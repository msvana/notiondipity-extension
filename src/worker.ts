import {MessageType} from './config'
import {getAuthTokenFromStorage, login, logout} from './services/auth'

export type Message = {
    type: MessageType
}

export type CurrentPage = {
    pageId: string,
    title: string,
    content: string
}

async function getCurrentPage(): Promise<CurrentPage | undefined> {
    const currentTab = await chrome.tabs.query({active: true, currentWindow: true})
    const currentUrl = currentTab[0].url
    const currentTitle = currentTab[0].title

    if (!currentUrl || !currentUrl.startsWith('https://www.notion.so/')) return undefined
    const pageId = currentUrl.split('-').pop()
    if (pageId?.length !== 32) return undefined

    if (!currentTab[0].id) return undefined
    const pageContent = await chrome.tabs.sendMessage(currentTab[0].id, {type: MessageType.GET_PAGE_CONTENTS})

    return {
        pageId: pageId,
        title: currentTitle || '',
        content: pageContent
    }
}

chrome.runtime.onMessage.addListener(function (message: Message, _, sendResponse) {
    switch (message.type) {
        case MessageType.GET_CURRENT_PAGE:
            getCurrentPage().then(sendResponse)
            break
        case MessageType.GET_AUTH_TOKEN:
            getAuthTokenFromStorage().then(sendResponse)
            break
        case MessageType.LOGIN:
            login().then(sendResponse)
            break
        case MessageType.LOGOUT:
            logout().then(() => sendResponse('OK'))
            break
    }

    return true
})