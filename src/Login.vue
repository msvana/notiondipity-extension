<template>
    <div class="login-btn text-center m-5">
        <p>You are not logged in or your access token has expired. Please login with your Notion account</p>
        <button class="btn btn-primary" @click="login">Login with Notion</button>
    </div>
</template>

<script lang="ts" setup>
import {useRouter} from 'vue-router';

const router = useRouter()

async function login() {
    const response = await chrome.runtime.sendMessage({type: 'login'})
	if (response.accessToken) {
		router.push('home')
	}
}
</script> 
