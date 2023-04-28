<template>
    <div class="login-btn" v-if="accessToken == null">
        <button @click="login">Login with Notion</button>
    </div>
    <RouterView v-else/>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const accessToken = ref<string|null>(null)

onMounted(async function() {
    const response = await browser.runtime.sendMessage({type: 'get-access-token'})
    accessToken.value = response.accessToken
})

async function login() {
    const response = await browser.runtime.sendMessage({type: 'login'})
    accessToken.value = response.accessToken
}
</script>
