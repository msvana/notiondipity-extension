<template>
    <h1><small>Pages similar to</small><span>{{ currentPageName }}</span></h1>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue'

const currentPageName = ref<string>('')

onMounted(async function () {
    browser.runtime.sendMessage({type: 'get-page-id'}).then((response) => {
        loadRecommendations(response.pageId)
    })
})

async function loadRecommendations(pageId: string) {

}

</script>