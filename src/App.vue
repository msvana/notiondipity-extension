<template>
    <RouterView />
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { BASE_URL } from "./Config";

onMounted(async function () {
    requestEmbeddingRefresh();
});

async function requestEmbeddingRefresh() {
    const accessTokenResponse = await browser.runtime.sendMessage({ type: "get-access-token" });
    const accessToken = accessTokenResponse.accessToken;
    fetch(`${BASE_URL}refresh-embeddings`, {
        method: "GET",
        mode: "cors",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
    });
}
</script>
