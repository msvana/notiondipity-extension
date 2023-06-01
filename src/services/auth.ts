import {BASE_URL, MessageType, OAUTH_URL, REDIRECT_URL} from '../config'
import {requestEmbeddingRefesh} from './backend'

export async function getAuthTokenFromStorage(): Promise<string | undefined> {
    const authTokenStorage = await chrome.storage.local.get('authToken')
    return authTokenStorage?.authToken
}

export async function getAuthTokenFromWorker(): Promise<string | undefined> {
    return await chrome.runtime.sendMessage({type: MessageType.GET_AUTH_TOKEN})
}

export async function isLoggedIn(): Promise<boolean> {
    return typeof await getAuthTokenFromWorker() == 'string'
}

export async function generateAuthToken(code: string) {
    const fullUrl = `${BASE_URL}/v1/token/`
    const headers = {'Content-Type': 'application/json'}
    const data = {'code': code, 'redirectUri': REDIRECT_URL}
    return fetch(fullUrl, {method: 'POST', mode: 'cors', headers: headers, body: JSON.stringify(data)})
}

export async function login(): Promise<string | undefined> {
    try {
        const url = await chrome.identity.launchWebAuthFlow({url: OAUTH_URL, interactive: true})
        if (!url) return undefined
        const urlParsed = new URL(url)
        const code = urlParsed.searchParams.get('code') || ''
        const response = await generateAuthToken(code)
        const responseData = await response.json()

        await chrome.storage.local.set({authToken: responseData.token})
        requestEmbeddingRefesh(responseData.token)
        return responseData.token
    } catch (e) {
        console.log(e)
        return undefined
    }

}

export async function logout() {
    await chrome.storage.local.remove('authToken')
}