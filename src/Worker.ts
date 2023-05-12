import * as config from "./config.ts";


async function getCurrentPageId(): Promise<string | null> {
    const currentTab = await chrome.tabs.query({ active: true, currentWindow: true });
    const currentUrl = currentTab[0].url;

    if (!currentUrl.startsWith("https://www.notion.so/")) return null;

    const potentialId = currentUrl.split("-").pop();

    if (potentialId.length !== 32) return null;

    return potentialId;
}

async function getAccessToken(): Promise<string | null> {
    const accessTokenStorage: Object = await chrome.storage.local.get("accessToken");
    if ("accessToken" in accessTokenStorage) {
        return accessTokenStorage.accessToken as string;
    }

    return null;
}

async function login(): Promise<string | null> {
    let url: string = "";

    try {
        url = await chrome.identity.launchWebAuthFlow({ url: config.OAUTH_URL, interactive: true });
    } catch (e) {
        console.log(e);
        return null;
    }

    const urlParsed = new URL(url);
    const code = urlParsed.searchParams.get("code") || "";
    const tokenUrl = `${config.BASE_URL}/token/`;
    const data = { code: code, redirectUri: config.REDIRECT_URL };
    const response = await fetch(tokenUrl, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
    });
    const accessTokenResponse = await response.json();

    chrome.storage.local.set({ accessToken: accessTokenResponse.accessToken });
    return accessTokenResponse.accessToken;
}

async function logout() {
    await chrome.storage.local.remove("accessToken");
}

chrome.runtime.onMessage.addListener(function (message, _, sendResponse) {
    if (message.type == "get-page-id") {
        getCurrentPageId().then((pageId) => sendResponse({ pageId: pageId }));
    } else if (message.type == "get-access-token") {
        getAccessToken().then((accessToken) => sendResponse({ accessToken: accessToken }));
    } else if (message.type == "login") {
        login().then((accessToken) => sendResponse({ accessToken: accessToken }));
    } else if (message.type == "logout") {
        logout().then(() => sendResponse({ status: "OK" }));
    }

    return true;
});
