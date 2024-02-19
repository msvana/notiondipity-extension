import {BASE_URL} from "../config";
import {getAuthTokenFromWorker} from "./auth";

export type PageDetails = {
    id: string;
    title: string;
    url: string;
};
export type Recommendation = [string, string, number];

export type RecommendationResponse = {
    currentPage: PageDetails;
    recommendations: Recommendation[];
};

export type IdeasResponse = {
    status: string;
    ideas: { title: string; description: string }[];
};

export type ComparisonResponse = {
    status: string;
    comparison?: {
        cached: boolean;
        secondPageTitle: string;
        similarities: string[];
        differences: string[];
        combinations: string[];
    };
};

async function makeRequest(url: string, method = "GET", authToken?: string): Promise<Response> {
    if (!authToken) authToken = await getAuthTokenFromWorker();
    const fullUrl = `${BASE_URL}${url}`;
    const headers = { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` };
    return fetch(fullUrl, { method: method, mode: "cors", headers: headers });
}

export async function requestEmbeddingRefesh(authToken?: string): Promise<Response> {
    return makeRequest("/refresh-embeddings", "GET", authToken);
}

export async function checkDataAvailability(): Promise<boolean> {
    const response = await makeRequest("/has-data");
    const responseData = await response.json();
    return responseData.hasData;
}
