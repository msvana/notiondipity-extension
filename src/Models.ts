export type CurrentPageReponse = {
    pageId: string | undefined
}

export type AccessTokenResponse = {
    accessToken: string | null
}

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
