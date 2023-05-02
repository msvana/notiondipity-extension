<template>
    <RouterView />
</template>

<script setup lang="ts">
import { onMounted } from "vue";

onMounted(async function () {
    requestEmbeddingRefresh();
});

async function requestEmbeddingRefresh() {
    const accessTokenResponse = await browser.runtime.sendMessage({ type: "get-access-token" });
    const accessToken = accessTokenResponse.accessToken;
    fetch(`http://localhost:5001/refresh-embeddings`, {
        method: "GET",
        mode: "cors",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
    });
}
</script>
