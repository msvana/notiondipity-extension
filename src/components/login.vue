<template>
    <div class="login-btn text-center m-5">
        <p>You are not logged in or your access token has expired. Please login with your Notion account</p>
        <button class="btn btn-primary" @click="login" :disabled="buttonDisabled">
            {{ buttonDisabled ? 'Please Wait' : 'Login with Notion' }}
        </button>
    </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import type {AccessTokenResponse} from '../Models.ts'

const router = useRouter()
const buttonDisabled = ref<boolean>()

async function login() {
    buttonDisabled.value = true
    const response: AccessTokenResponse = await chrome.runtime.sendMessage({type: 'login'})

    if (response.accessToken) {
        router.push('home')
    }
}
</script> 
