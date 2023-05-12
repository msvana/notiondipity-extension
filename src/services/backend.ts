import {BASE_URL} from '../config.ts'
import {getAccessToken} from './auth.ts'

async function makeRequest(url: string, method: string = 'GET'): Promise<Response> {
    const accessToken = await getAccessToken()
    const fullUrl = `${BASE_URL}${url}`
    const headers = {'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}`}
    return fetch(fullUrl, {method: method, mode: 'cors', headers: headers})
}

export async function requestEmbeddingRefesh(): Promise<Response> {
    return makeRequest('/refresh-embeddings')
}