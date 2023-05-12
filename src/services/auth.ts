export async function getAccessToken(): Promise<null | string> {
    const accessTokenResponse = await chrome.runtime.sendMessage({ type: "get-access-token" });
    const accessToken = accessTokenResponse["accessToken"];
    return accessToken;
}

export async function isLoggedIn(): Promise<boolean> {
    return typeof await getAccessToken() == 'string'
}

