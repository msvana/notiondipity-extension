import { MessageType } from "./config";
import type { Message } from "./worker";

chrome.runtime.onMessage.addListener(function (message: Message, _, sendResponse) {
    if (message.type == MessageType.GET_PAGE_CONTENTS) {
        const pageContentsElement = document.querySelector(".notion-page-content") as HTMLElement;
        const pageContents = pageContentsElement?.innerText;
        sendResponse(pageContents);
    }
});
