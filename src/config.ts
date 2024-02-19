export const BASE_URL = process.env.BACKEND_URL
export const REDIRECT_URL = chrome.identity?.getRedirectURL()
const OAUTH_CLIENT_ID = '3eeccaf2-dd44-4eee-bfe0-983e8e09cc32'
const OAUTH_BASE_URL = 'https://api.notion.com/v1/oauth/authorize'

export const OAUTH_URL =
    `${OAUTH_BASE_URL}?owner=user` +
    `&client_id=${OAUTH_CLIENT_ID}` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URL)}`

export enum MessageType {
    GET_AUTH_TOKEN,
    GET_PAGE_CONTENTS,
    GET_CURRENT_PAGE,
    LOGIN,
    LOGOUT,
}
