<template>
    <div v-if="loading" class="text-center">
        <img src="../../public/loading.gif" alt="" class="p-3">
    </div>
    <div v-else>
        <div v-if="error">{{ errorText }}</div>
        <div v-else>
            <h1><small>Comparison with</small> {{pageTitle}}</h1>
            <div class="card mb-2 p-2">
                <h4 class="card-title text-success">Similarities</h4>
                <ul>
                    <li v-for="similarity in similarities">{{ similarity }}</li>
                </ul>
            </div>
            <div class="card mb-2 p-2">
                <h4 class="card-title text-danger">Differences</h4>
                <ul>
                    <li v-for="difference in differences">{{ difference }}</li>
                </ul>
            </div>
            <div class="card mb-2 p-2">
                <h4 class="card-title text-warning">Combinations</h4>
                <ul>
                    <li v-for="combination in combinations">{{ combination }}</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {BASE_URL, MessageType} from '../config'
import {isLoggedIn} from '../services/auth'
import type {CurrentPage} from '../worker'
import type {ComparisonResponse} from '../services/backend'

const loading = ref<boolean>(true)
const error = ref<boolean>(false)
const errorText = ref<string>('')
const router = useRouter()
const route = useRoute()
const pageTitle = ref<string>('')
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
        const comparisonResponse = await getComparison(currentPage, secondPageId)

        if (comparisonResponse != null) {
            similarities.value = comparisonResponse.comparison?.similarities || []
            differences.value = comparisonResponse.comparison?.differences || []
            combinations.value = comparisonResponse.comparison?.combinations || []
            pageTitle.value = comparisonResponse.comparison?.secondPageTitle || 'Unknown page'
        }
    }

    loading.value = false
}

async function getComparison(currentPage: CurrentPage, secondPageId: string): Promise<ComparisonResponse | null> {
    const url = `${BASE_URL}/compare/`
    const authToken = await chrome.runtime.sendMessage({type: MessageType.GET_AUTH_TOKEN})

    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json'},
        body: JSON.stringify({
            'pageId': currentPage.pageId,
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
