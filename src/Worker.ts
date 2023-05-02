const BACKEND_URL = "http://localhost:5001";
const REDIRECT_URL = browser.identity.getRedirectURL();
const OAUTH_CLIENT_ID = "3eeccaf2-dd44-4eee-bfe0-983e8e09cc32";
const OAUTH_BASE_URL = "https://api.notion.com/v1/oauth/authorize";
const OAUTH_URL = `${OAUTH_BASE_URL}?owner=user&client_id=${OAUTH_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
    REDIRECT_URL
)}`;

async function getCurrentPageId(): Promise<string | null> {
    const currentTab = await browser.tabs.query({ active: true, currentWindow: true });
    const currentUrl = currentTab[0].url;

    if (!currentUrl.startsWith("https://www.notion.so/")) return null;

    const potentialId = currentUrl.split("-").pop();

    if (potentialId.length !== 32) return null;

    return potentialId;
}

async function getAccessToken(): Promise<string | null> {
    const accessTokenStorage: Object = await browser.storage.local.get("accessToken");
    if ("accessToken" in accessTokenStorage) {
        return accessTokenStorage.accessToken as string;
    }

    return null;
}

async function login(): Promise<string | null> {
    let url: string = "";

    try {
        url = await browser.identity.launchWebAuthFlow({ url: OAUTH_URL, interactive: true });
    } catch (e) {
        console.log(e);
        return null;
    }

    const urlParsed = new URL(url);
    const code = urlParsed.searchParams.get("code") || "";
    const tokenUrl = `${BACKEND_URL}/token`;
    const data = { code: code, redirectUri: REDIRECT_URL };
    const response = await fetch(tokenUrl, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
    });
    const accessTokenResponse = await response.json();

    browser.storage.local.set({ accessToken: accessTokenResponse.accessToken });
    return accessTokenResponse.accessToken;
}

browser.runtime.onMessage.addListener(function (message, _, sendResponse) {
    if (message.type === "get-page-id") {
        getCurrentPageId().then((pageId) => sendResponse({ pageId: pageId }));
    } else if (message.type === "get-access-token") {
        getAccessToken().then((accessToken) => sendResponse({ accessToken: accessToken }));
    } else if (message.type === "login") {
        login().then((accessToken) => sendResponse({ accessToken: accessToken }));
    }

    return true;
});
