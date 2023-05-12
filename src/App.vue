<template>
    <div class="float-end fs-3">
        <a href="#" @click="logout" v-if="loggedIn"><i class="bi-box-arrow-right"></i></a>
    </div>

    <RouterView/>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {useRouter} from 'vue-router'
import {isLoggedIn} from './services/auth.ts'
import {requestEmbeddingRefesh} from './services/backend.ts'

const router = useRouter()
const loggedIn = ref<boolean>(false)

onMounted(async function () {
    loggedIn.value = await isLoggedIn()
    requestEmbeddingRefesh()
})

async function logout() {
    await chrome.runtime.sendMessage({type: 'logout'})
    loggedIn.value = false
    router.push('/login')
}
</script>
