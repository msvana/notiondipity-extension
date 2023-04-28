<template>
    <h1><small>Pages similar to</small><br><span>{{ currentPageName }}</span></h1>
    <ul>
        <li v-for="recommendation in recommendedPagesList">
            <a :href="recommendation[0]">{{ recommendation[0] }}</a>
        </li>
    </ul>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import type {CurrentPageReponse, Recommendation, RecommendationResponse} from './Models.ts'

const currentPageName = ref<string>('')
const recommendedPagesList = ref<Recommendation[]>([])

onMounted(async function () {
    browser.runtime.sendMessage({type: 'get-page-id'}).then((response: CurrentPageReponse) => {
        loadRecommendations(response.pageId)
    })
})


async function loadRecommendations(pageId: string | null) {
	if(pageId === null) {
		return
	}

	const recommendationResponse = await getRecommendations(pageId)
    currentPageName.value = recommendationResponse.currentPage.title
    recommendedPagesList.value = recommendationResponse.recommendations
}

async function getRecommendations(pageId): Promise<RecommendationResponse> {
    const url = `https://notiondipity-backend.fly.dev/recommend/${pageId}`

    const response = await fetch(url, {
        method: 'GET',
        mode: 'cors'
    })

    const result = await response.json()
    return result
}
</script>
