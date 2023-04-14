let currentPageId = null

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
