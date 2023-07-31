<template>
    <ul class="nav nav-tabs nav-fill fixed-top bg-light" v-if="loggedIn">
        <li class="nav-item">
            <router-link to="/" class="nav-link">Similar</router-link>
        </li>
        <li class="nav-item">
            <router-link to="/search" class="nav-link">Search</router-link>
        </li>

        <li class="nav-item fs-3 pt-1">
            <a href="#" @click="logout"><i class="bi-box-arrow-right"></i></a>
        </li>
    </ul>

    <div class="m-2" style="padding-top: 2.5em">
        <router-view/>
        <p v-if="checkingLogin" class="text-center">
            Checking user authentication status ...
        </p>
    </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {useRouter} from 'vue-router'
import {MessageType} from '../config'
import {isLoggedIn} from '../services/auth'
import {requestEmbeddingRefesh} from '../services/backend'

const router = useRouter()
const loggedIn = ref<boolean>(false)
const checkingLogin = ref<boolean>(false)

onMounted(async function () {
    checkingLogin.value = true
    loggedIn.value = await isLoggedIn()
    checkingLogin.value = false
    requestEmbeddingRefesh()
})

async function logout() {
    await chrome.runtime.sendMessage({type: MessageType.LOGOUT})
    loggedIn.value = false
    router.push('/login')
}
</script>
