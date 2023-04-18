let currentPageId = null

const redirectURL = browser.identity.getRedirectURL();
const clientId = '3eeccaf2-dd44-4eee-bfe0-983e8e09cc32'
const authUrl = `https://api.notion.com/v1/oauth/authorize?owner=user&client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectURL)}`


browser.identity.launchWebAuthFlow({url: authUrl, interactive: true}).then(async (url: string) => {
    const urlParsed = new URL(url)
    const code = urlParsed.searchParams.get('code') || ''
    const tokenUrl = 'http://localhost:5001/token'
    const data = {code: code, redirectUri: redirectURL}
    const response = await fetch(tokenUrl, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'}
    })
    const accessToken = await response.json()
    console.log(accessToken)
})

browser.webRequest.onBeforeRequest.addListener((details) => {
    const requestBodyText = new TextDecoder().decode(details.requestBody.raw[0].bytes)
    const requestBody = JSON.parse(requestBodyText)
    currentPageId = requestBody.block.id
}, {urls: ['https://www.notion.so/api/v3/recordPageVisit']}, ['requestBody'])

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'get-page-id') {
        sendResponse({'pageId': currentPageId})
    }
})