<template>
    <div v-if="loading" class="text-center">
        <img src="../../public/loading.gif" alt="" class="p-3">
    </div>
    <div v-else>
        <div v-if="error">{{ errorText }}</div>
        <div v-else>
            <h1>
                <small>Pages similar to</small><br/><span>{{ currentPageName }}</span>
            </h1>

            <div class="card mb-2 p-2" v-for="recommendation in recommendedPagesList">
                <h4 class="card-title">
                    <a :href="recommendation[0]">{{ recommendation[1] }}</a>
                </h4>
                <p class="card-subtitle text-body-secondary">
                    Similarity: {{ recommendation[2].toFixed(3) }}
                </p>
            </div>
        </div>
    </div>

    <div v-if="!hasData" class="alert alert-warning mt-4">
        We are processing your Notion pages for the first time. Many similar pages might be missing
        until the first update is finished. This might take several minutes.
    </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import {useRouter} from 'vue-router'
import {BASE_URL} from '../config.ts'
import type {PageIdResponse, Recommendation, RecommendationResponse} from '../Models.ts'
import {isLoggedIn} from '../services/auth.ts'
import {checkDataAvailability} from '../services/backend.ts'

const currentPageName = ref<string>('')
const recommendedPagesList = ref<Recommendation[]>([])
const loading = ref<boolean>(true)
const error = ref<boolean>(false)
const hasData = ref<boolean>(true)
const errorText = ref<string>('')
const router = useRouter()

onMounted(async function () {
    if (!await isLoggedIn()) router.push('login')
    hasData.value = await checkDataAvailability()
    const pageIdResponse: PageIdResponse = await chrome.runtime.sendMessage({type: 'get-page-id'})
    displayRecommendations(pageIdResponse.pageId)
})

async function displayRecommendations(pageId: string | null) {
    if (pageId == null) {
        error.value = true
        errorText.value = 'Looks like your current active tab is not a Notion page!'
    } else {
        const recommendationResponse = await getRecommendations(pageId)

        if (recommendationResponse != null) {
            currentPageName.value = recommendationResponse.currentPage.title
            recommendedPagesList.value = recommendationResponse.recommendations
        }
    }

    loading.value = false
}

async function getRecommendations(pageId: string): Promise<RecommendationResponse | null> {
    const url = `${BASE_URL}/recommend/${pageId}`
    const accessTokenResponse = await chrome.runtime.sendMessage({type: 'get-access-token'})
    const accessToken = accessTokenResponse['accessToken']

    const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {Authorization: `Bearer ${accessToken}`}
    })

    const statusCode = response.status

    if (statusCode == 401) {
        router.push('login')
    } else if (statusCode == 404) {
        errorText.value =
            'Cannot access the current notion page data. Are you logged in under the right account?'
        error.value = true
        return null
    }

    const result = await response.json()
    return result
}

</script>

<style>
h1 {
    font-size: 1.25rem;
}
</style>