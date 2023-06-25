<template>
    <div class="login-btn text-center mb-5">
        <p>You are not logged in or your access token has expired. Please login with your Notion account</p>
        <button class="btn btn-primary" @click="login" :disabled="buttonDisabled">
            {{ buttonDisabled ? 'Please Wait' : 'Login with Notion' }}
        </button>
    </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import {MessageType} from '../config'

const router = useRouter()
const buttonDisabled = ref<boolean>()

async function login() {
    buttonDisabled.value = true
    const authToken = await chrome.runtime.sendMessage({type: MessageType.LOGIN})

    if (typeof authToken == 'string') {
        router.push('home')
    }
}
</script> 
