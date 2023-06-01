import {BASE_URL} from '../config'
import {getAuthTokenFromWorker} from './auth'

export type PageDetails = {
    id: string,
    title: string,
    url: string
}
export type Recommendation = [string, string, number]

export type RecommendationResponse = {
    currentPage: PageDetails,
    recommendations: Recommendation[]
}

async function makeRequest(url: string, method: string = 'GET', authToken: string | undefined = undefined): Promise<Response> {
    if (!authToken) authToken = await getAuthTokenFromWorker()
    const fullUrl = `${BASE_URL}${url}`
    const headers = {'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}`}
    return fetch(fullUrl, {method: method, mode: 'cors', headers: headers})
}

export async function requestEmbeddingRefesh(authToken: string | undefined = undefined): Promise<Response> {
    return makeRequest('/refresh-embeddings', 'GET', authToken)
}

export async function checkDataAvailability(): Promise<boolean> {
    const response = await makeRequest('/has-data')
    const responseData = await response.json()
    return responseData.hasData
}