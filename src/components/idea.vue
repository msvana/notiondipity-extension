<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import type { Idea } from "../services/backend";
import { saveIdea as backendSaveIdea, unsaveIdea as backendUnsaveIdea } from "../services/backend";
import { MessageType } from "../config";

defineProps<{ idea: Idea }>();
const emit = defineEmits(["unsave"]);

async function saveIdea(idea: Idea) {
    const authToken = await chrome.runtime.sendMessage({ type: MessageType.GET_AUTH_TOKEN });
    const result = await backendSaveIdea(idea.idea_id, authToken);

    if (result) {
        idea.saved = true;
    }
}

async function unsaveIdea(idea: Idea) {
    const authToken = await chrome.runtime.sendMessage({ type: MessageType.GET_AUTH_TOKEN });
    const result = await backendUnsaveIdea(idea.idea_id, authToken);

    if (result) {
        idea.saved = false;
    }

    emit("unsave");
}

function changeButtonToUnsave(event: MouseEvent) {
    const target = event.target as HTMLButtonElement;
    target.innerText = "Unsave";
    target.classList.remove("btn-primary");
    target.classList.add("btn-danger");
}

function changeButtonToSaved(event: MouseEvent) {
    const target = event.target as HTMLButtonElement;
    target.innerText = "Saved";
    target.classList.remove("btn-danger");
    target.classList.add("btn-primary");
}
</script>

<template>
    <div class="card mb-2 p-2">
        <h4 class="card-title">
            {{ idea.title }}
        </h4>

        <p>
            <button
                v-if="idea.saved"
                type="button"
                class="btn btn-primary btn-sm"
                @mouseover="changeButtonToUnsave"
                @mouseleave="changeButtonToSaved"
                @click="unsaveIdea(idea)"
            >
                Saved
            </button>
            <button
                v-else
                type="button"
                class="btn btn-outline-primary btn-sm"
                @click="saveIdea(idea)"
            >
                Save
            </button>
        </p>

        <p class="card-subtitle text-body-secondary">
            {{ idea.description }}
        </p>
    </div>
</template>
