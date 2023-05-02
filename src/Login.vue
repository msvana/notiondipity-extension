<template>
    <div class="login-btn">
        <button @click="login">Login with Notion</button>
    </div>
</template>

<script lang="ts" setup>
import {useRouter} from 'vue-router';

const router = useRouter()

async function login() {
    const response = await browser.runtime.sendMessage({type: 'login'})
	if (response.accessToken) {
		router.push('home')
	}
}
</script> 
