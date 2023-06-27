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
import {BASE_URL, MessageType} from '../config'
import {isLoggedIn} from '../services/auth'
import type {Recommendation, RecommendationResponse} from '../services/backend'
import {checkDataAvailability} from '../services/backend'
import type {CurrentPage} from '../worker'

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
    const currentPageReponse: CurrentPage | null = await chrome.runtime.sendMessage({type: MessageType.GET_CURRENT_PAGE})
    displayRecommendations(currentPageReponse)
})

async function displayRecommendations(currentPage: CurrentPage | null) {
    if (currentPage == null) {
        error.value = true
        errorText.value = 'Looks like your current active tab is not a Notion page!'
    } else {
        const recommendationResponse = await getRecommendations(currentPage)

        if (recommendationResponse != null) {
            currentPageName.value = currentPage.title
            recommendedPagesList.value = recommendationResponse.recommendations
        }
    }

    loading.value = false
}

async function getRecommendations(currentPage: CurrentPage): Promise<RecommendationResponse | null> {
    const url = `${BASE_URL}/v2/recommend/`
    const authToken = await chrome.runtime.sendMessage({type: MessageType.GET_AUTH_TOKEN})

    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json'},
        body: JSON.stringify({
            'pageId': currentPage.pageId,
            'title': currentPage.title,
            'content': currentPage.content
        })
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