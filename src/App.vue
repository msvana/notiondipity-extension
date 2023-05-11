<template>
    <div class="float-end fs-3">
        <a href="" @click="logout"><i class="bi-box-arrow-right"></i></a>
    </div>

    <RouterView />
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { BASE_URL } from "./Config";
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(async function () {
    requestEmbeddingRefresh();
});

async function requestEmbeddingRefresh() {
    const accessTokenResponse = await chrome.runtime.sendMessage({ type: "get-access-token" });
    const accessToken = accessTokenResponse.accessToken;
    fetch(`${BASE_URL}/refresh-embeddings`, {
        method: "GET",
        mode: "cors",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
    });
}

async function logout() {
    chrome.runtime.sendMessage({ type: "logout" }).then((_) => {
        router.push("/login");
    });
}
</script>
