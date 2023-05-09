<template>
    <div v-if="loading">Loading similar pages ...</div>
    <div v-else>
        <div v-if="error">{{ errorText }}</div>
        <div v-else>
            <h1>
                <small>Pages similar to</small><br /><span>{{ currentPageName }}</span>
            </h1>

            <div class="card mb-2" v-for="recommendation in recommendedPagesList">
                <div class="card-body">
                    <h4 class="card-title">
                        <a :href="recommendation[0]">{{ recommendation[1] }}</a>
                    </h4>
                    <p class="card-subtitle text-body-secondary">
                        Similarity: {{ recommendation[2].toFixed(3) }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import type { CurrentPageReponse, Recommendation, RecommendationResponse } from "./Models";
import { BASE_URL } from "./Config";
import { useRouter } from "vue-router";

const currentPageName = ref<string>("");
const recommendedPagesList = ref<Recommendation[]>([]);
const loading = ref<boolean>(true);
const error = ref<boolean>(false);
const errorText = ref<string>("");
const router = useRouter();

onMounted(async function () {
    browser.runtime.sendMessage({ type: "get-page-id" }).then((response: CurrentPageReponse) => {
        loadRecommendations(response.pageId);
    });
});

async function loadRecommendations(pageId: string | null) {
    if (pageId === null) {
        errorText.value = "Looks like your current active tab is not a Notion page!";
        error.value = true;
    } else {
        const recommendationResponse = await getRecommendations(pageId);
        if (recommendationResponse != null) {
            currentPageName.value = recommendationResponse.currentPage.title;
            recommendedPagesList.value = recommendationResponse.recommendations;
        }
    }

    loading.value = false;
}

async function getRecommendations(pageId: string): Promise<RecommendationResponse | null> {
    const url = `${BASE_URL}recommend/${pageId}`;
    const accessTokenResponse = await browser.runtime.sendMessage({ type: "get-access-token" });
    const accessToken = accessTokenResponse["accessToken"];

    const response = await fetch(url, {
        method: "GET",
        mode: "cors",
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    const statusCode = response.status;

    if (statusCode == 401) {
        router.push("login");
    } else if (statusCode == 404) {
        errorText.value =
            "Cannot access the current notion page data. Are you logged in under the right account?";
        error.value = true;
        return null;
    }

    const result = await response.json();
    return result;
}
</script>
