export type CurrentPageReponse = {
    pageId: string | undefined
}

export type PageDetails = {
    id: string,
    title: string,
    url: string
}

export type Recommendation = [string, number]

export type RecommendationResponse = {
    currentPage: PageDetails,
    recommendations: Recommendation[]
}