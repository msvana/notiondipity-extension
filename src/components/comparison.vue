<template>
    <div v-if="loading" class="text-center">
        <img src="../../public/loading.gif" alt="" class="p-3">
    </div>
    <div v-else>
        <div v-if="error">{{ errorText }}</div>
        <div v-else>
            <h1>Similarities</h1>
            <ul>
                <li v-for="similarity in similarities">{{similarity}}</li>
            </ul>
            <h1>Differences</h1>
            <ul>
                <li v-for="difference in differences">{{difference}}</li>
            </ul>
            <h1>Combinations</h1>
            <ul>
                <li v-for="combination in combinations">{{combination}}</li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import {BASE_URL, MessageType} from '../config'
import {isLoggedIn} from '../services/auth'
import type {CurrentPage} from '../worker'
import type {ComparisonResponse} from '../services/backend'

const loading = ref<boolean>(true)
const error = ref<boolean>(false)
const errorText = ref<string>('')
const router = useRouter()
const route = useRoute()
const similarities = ref<string[]>([])
const differences = ref<string[]>([])
const combinations = ref<string[]>([])

onMounted(async function () {
    if (!await isLoggedIn()) router.push('login')
    const currentPageReponse: CurrentPage | null = await chrome.runtime.sendMessage({type: MessageType.GET_CURRENT_PAGE})
    const secondPageId = route.params.id as string
    displayComparison(currentPageReponse, secondPageId)
})

async function displayComparison(currentPage: CurrentPage | null, secondPageId: string) {
    if (currentPage == null) {
        error.value = true
        errorText.value = 'Looks like your current active tab is not a Notion page!'
    } else {
        const comparisonResponse = await getRecommendations(currentPage, secondPageId)

        if (comparisonResponse != null) {
            similarities.value = comparisonResponse.similarities || []
            differences.value = comparisonResponse.differences || []
            combinations.value = comparisonResponse.combinations || []
        }
    }

    loading.value = false
}

async function getRecommendations(currentPage: CurrentPage, secondPageId: string): Promise<ComparisonResponse | null> {
    const url = `${BASE_URL}/compare/`
    const authToken = await chrome.runtime.sendMessage({type: MessageType.GET_AUTH_TOKEN})

    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json'},
        body: JSON.stringify({
            'secondPageId': secondPageId,
            'title': currentPage.title,
            'content': currentPage.content
        })
    })

    const statusCode = response.status

    if (statusCode == 401) {
        router.push('login')
    } else if (statusCode == 404) {
        errorText.value = 'Page with a given id was not found'
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
