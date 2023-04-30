<template>
    <h1>
        <small>Pages similar to</small><br /><span>{{ currentPageName }}</span>
    </h1>
    <ul>
        <li v-for="recommendation in recommendedPagesList">
            <a :href="recommendation[0]">{{ recommendation[0] }}</a>
        </li>
    </ul>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import type { CurrentPageReponse, Recommendation, RecommendationResponse } from "@/Models";

const currentPageName = ref<string>("");
const recommendedPagesList = ref<Recommendation[]>([]);

onMounted(async function () {
    browser.runtime.sendMessage({ type: "get-page-id" }).then((response: CurrentPageReponse) => {
        loadRecommendations(response.pageId);
    });
});

async function loadRecommendations(pageId: string | null) {
    if (pageId === null) {
        return;
    }


    const recommendationResponse = await getRecommendations(pageId);
    currentPageName.value = recommendationResponse.currentPage.title;
    recommendedPagesList.value = recommendationResponse.recommendations;
}

async function getRecommendations(pageId: string): Promise<RecommendationResponse> {
    const url = `http://localhost:5001/recommend/${pageId}`;
    const accessTokenResponse = await browser.runtime.sendMessage({type: 'get-access-token'})
    const accessToken = accessTokenResponse['accessToken']

    const response = await fetch(url, {
        method: "GET",
        mode: "cors",
        headers: {Authorization: `Bearer ${accessToken}`}
    });

    const result = await response.json();
    return result;
}
</script>
