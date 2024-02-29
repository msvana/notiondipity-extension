import { BASE_URL } from "../config";
import { getAuthTokenFromWorker } from "./auth";

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

export type Idea = {
    title: string;
    description: string;
    idea_id: number;
    saved: boolean;
};

export type IdeasResponse = {
    status: string;
    ideas: Idea[];
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

export async function saveIdea(ideaId: number, authToken?: string): Promise<boolean> {
    const response = await makeRequest(`/ideas/save/${ideaId}`, "GET", authToken);
    const responseData = await response.json();
    return responseData.status === "OK";
}

export async function getSavedIdeas(authToken?: string): Promise<Response> {
    return makeRequest("/ideas/saved", "GET", authToken);
}
