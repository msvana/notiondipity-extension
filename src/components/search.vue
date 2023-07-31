<template>

    <form @submit.prevent="performSearch">
        <div class="input-group">
            <input v-model="query" type="text" class="form-control" placeholder="Search query"
                   @change="performSearch">
            <button class="btn btn-primary" type="button" @click="performSearch"><i class="bi bi-search"></i>
            </button>
        </div>

        <p class="form-text text-center">Press ENTER or click the Search button to perform search</p>
    </form>

    <div v-if="loading" class="text-center">
        <img src="../../public/loading.gif" alt="" class="p-3">
    </div>
    <div v-else>
        <div class="card mb-2 p-2" v-for="recommendation in recommendedPagesList">
            <h4 class="card-title">
                <a :href="recommendation[0]">{{ recommendation[1] }}</a>
            </h4>
            <p class="card-subtitle text-body-secondary">
                Similarity: {{ recommendation[2].toFixed(3) }}
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">

import type {Recommendation, RecommendationResponse} from '../services/backend'
import {BASE_URL, MessageType} from '../config'
import {ref} from 'vue'
import {useRouter} from 'vue-router'

const query = ref<string>('')
const recommendedPagesList = ref<Recommendation[] | null>()
const loading = ref<boolean>(false)
const router = useRouter()

async function performSearch() {
    loading.value = true
    recommendedPagesList.value = (await getRecommendations(query.value))?.recommendations
    loading.value = false
}

async function getRecommendations(query: string): Promise<RecommendationResponse | null> {
    const url = `${BASE_URL}/v2/recommend/`
    const authToken = await chrome.runtime.sendMessage({type: MessageType.GET_AUTH_TOKEN})

    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json'},
        body: JSON.stringify({
            'title': query,
            'content': ''
        })
    })

    const statusCode = response.status

    if (statusCode == 401) {
        router.push('login')
        return null
    }

    const result = await response.json()
    return result
}

</script>