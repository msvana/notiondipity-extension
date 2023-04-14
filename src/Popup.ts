type PageDetails = {
    id: string,
    title: string,
    url: string
}

type Recommendation = [string, number]

type RecommendationResponse = {
    currentPage: PageDetails,
    recommendations: Recommendation[]
}

async function getRecommendations(pageId): Promise<RecommendationResponse> {
    const url = `http://127.0.0.1:5000/recommend/${pageId}`
    const response = await fetch(url, {
        method: 'GET',
        mode: 'cors'
    })

    const result = await response.json()
    return result
}

async function loadRecommendations(pageId: string) {
    const recommendationResponse = await getRecommendations(pageId)
    const currentPageName = document.getElementById('current-page-name')
    currentPageName.innerText = recommendationResponse.currentPage.title
    const currentPageId = document.getElementById('current-page-id')
    currentPageId.innerText = recommendationResponse.currentPage.id

    const recommendedPagesList = document.getElementById('recommended-pages')
    for(const r of recommendationResponse.recommendations) {
        recommendedPagesList.innerHTML += `<li><a href="${r[0]}">${r[0]}</a></li>`
    }
}

const message = browser.runtime.sendMessage({type: 'get-page-id'})

message.then((response) => {
    loadRecommendations(response.pageId)
})

