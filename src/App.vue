<template>
    <div v-if="loading">
        Checking user credentials ...
    </div>
    <div v-else>
        <div class="login-btn" v-if="accessToken == null">
            <button @click="login">Login with Notion</button>
        </div>
        <RouterView v-else/>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const accessToken = ref<string|null>(null)
const loading = ref<boolean>(true)

onMounted(async function() {
    const response = await browser.runtime.sendMessage({type: 'get-access-token'})
    accessToken.value = response.accessToken
    loading.value = false
    requestEmbeddingRefresh()
})

async function login() {
    const response = await browser.runtime.sendMessage({type: 'login'})
    accessToken.value = response.accessToken
}

async function requestEmbeddingRefresh() {
	fetch(`http://localhost:5001/refresh-embeddings`, {
		method: 'GET',
		mode: 'cors',
        headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken.value}`}
	})
}
</script>
