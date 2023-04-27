
const redirectURL = browser.identity.getRedirectURL();
const clientId = '3eeccaf2-dd44-4eee-bfe0-983e8e09cc32'
const authUrl = `https://api.notion.com/v1/oauth/authorize?owner=user&client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectURL)}`

/*
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
 */

async function getCurrentPageId(): Promise<string | null> {
	const currentTab = await browser.tabs.query({active: true, currentWindow: true})
	const currentUrl = currentTab[0].url

	if (!currentUrl.startsWith('https://www.notion.so/'))
		return null

	const potentialId = currentUrl.split('-').pop()
	
	if (potentialId.length !== 32)
		return null

	return potentialId
}

browser.runtime.onMessage.addListener(function (message, _, sendResponse) {
    if (message.type === 'get-page-id') {
		getCurrentPageId().then((pageId) => sendResponse({'pageId': pageId}))
	}

	return true
})
