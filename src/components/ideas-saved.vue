<template>
    <div v-if="loading" class="text-center">
        <img src="../../public/loading.gif" alt="" class="p-3" />
        <p class="text-center">Loading saved ideas ...</p>
    </div>

    <div v-else>
        <div v-if="error">{{ errorText }}</div>
        <div v-else>
            <div class="card mb-2 p-2" v-for="idea in ideas">
                <h4 class="card-title">
                    {{ idea.title }}
                </h4>
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
import { useRouter } from "vue-router";
import { isLoggedIn } from "../services/auth";
import type { Idea, IdeasResponse } from "../services/backend";
import { getSavedIdeas, checkDataAvailability } from "../services/backend";

const hasData = ref<boolean>(true);
const loading = ref<boolean>(true);
const router = useRouter();
const error = ref<boolean>(false);
const errorText = ref<string>("");
const ideas = ref<Idea[]>([]);

onMounted(async function () {
    if (!(await isLoggedIn())) router.push("login");
    hasData.value = await checkDataAvailability();
    displayIdeas();
});

async function displayIdeas() {
    const response = await getSavedIdeas();
    const statusCode = response.status;
    loading.value = false;

    if (statusCode === 401) {
        router.push("login");
        return;
    }

    if (statusCode == 404) {
        errorText.value =
            "Cannot access the current notion page data." +
            " Are you logged in under the right account?";
        error.value = true;
        return;
    }

    const ideasResponse: IdeasResponse = await response.json();

    if (ideasResponse.ideas.length == 0) {
        errorText.value = "You don't have any saved ideas";
        return;
    }

    ideas.value = ideasResponse.ideas;
}
</script>
