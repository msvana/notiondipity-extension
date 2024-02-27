<template>
    <div v-if="loading" class="text-center">
        <img src="../../public/loading.gif" alt="" class="p-3" />
        <p class="text-center">Talking to ChatGPT. This usually takes about 15 seconds.</p>
    </div>

    <div v-else>
        <div v-if="error">{{ errorText }}</div>
        <div v-else>
            <h1>
                <small>Ideas generated from </small><br /><span>{{ currentPageName }}</span> and
                similar pages.
            </h1>

            <p>
                <button type="button" class="btn btn-outline-primary btn-sm" @click="refresh">
                    Refresh
                </button>
            </p>

            <div class="card mb-2 p-2" v-for="idea in ideas">
                <h4 class="card-title">
                    {{ idea.title }}
                </h4>

                <p>
                    <button
                        type="button"
                        class="btn btn-outline-primary btn-sm"
                        @click="saveIdea(idea.idea_id)"
                    >
                        Save
                    </button>
                </p>

                <p class="card-subtitle text-body-secondary">
                    {{ idea.description }}
                </p>
            </div>
        </div>
    </div>

    <div v-if="!hasData" class="alert alert-warning mt-4">
        We are processing your Notion pages for the first time. Many similar pages might be missing
        until the first update is finished. This might take several minutes.
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { isLoggedIn } from "../services/auth";
import type { IdeasResponse } from "../services/backend";
import { checkDataAvailability, saveIdea as backendSaveIdea } from "../services/backend";
import { useRouter } from "vue-router";
import type { CurrentPage } from "../worker";
import { BASE_URL, MessageType } from "../config";

const hasData = ref<boolean>(true);
const currentPageName = ref<string>("");
const loading = ref<boolean>(true);
const router = useRouter();
const error = ref<boolean>(false);
const errorText = ref<string>("");
const ideas = ref<{ title: string; description: string; idea_id: number }[]>([]);

onMounted(async function () {
    if (!(await isLoggedIn())) router.push("login");
    hasData.value = await checkDataAvailability();
    const currentPageReponse: CurrentPage | null = await chrome.runtime.sendMessage({
        type: MessageType.GET_CURRENT_PAGE,
    });
    displayIdeas(currentPageReponse);
});

async function displayIdeas(currentPage: CurrentPage | null, refresh: boolean = false) {
    if (currentPage == null) {
        error.value = true;
        errorText.value = "Looks like your current active tab is not a Notion page!";
    } else {
        const ideasResponse = await getIdeas(currentPage, refresh);
        if (ideasResponse != null) {
            currentPageName.value = currentPage.title;
            ideas.value = ideasResponse.ideas;
        }
    }

    loading.value = false;
}

async function getIdeas(currentPage: CurrentPage, refresh: boolean): Promise<IdeasResponse | null> {
    const url = `${BASE_URL}/ideas/`;
    const authToken = await chrome.runtime.sendMessage({ type: MessageType.GET_AUTH_TOKEN });

    const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: { Authorization: `Bearer ${authToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({
            pageId: currentPage.pageId,
            title: currentPage.title,
            content: currentPage.content,
            refresh: refresh,
        }),
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

    const result: IdeasResponse = await response.json();

    if (result.ideas.length == 0) {
        errorText.value =
            "ChatGPT couldn't generate any interesting project ideas from this content.";
        error.value = true;
        return null;
    }

    return result;
}

async function refresh() {
    loading.value = true;
    error.value = false;
    const currentPageReponse: CurrentPage | null = await chrome.runtime.sendMessage({
        type: MessageType.GET_CURRENT_PAGE,
    });
    displayIdeas(currentPageReponse, true);
}

async function saveIdea(ideaId: number) {
    const authToken = await chrome.runtime.sendMessage({ type: MessageType.GET_AUTH_TOKEN });
    const result = await backendSaveIdea(ideaId, authToken);
}
</script>
