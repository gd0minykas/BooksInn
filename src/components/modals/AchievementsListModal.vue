<script setup lang="ts">
import { auth, db } from "@/firebase";
import { addAchievement, type Achievement } from "@/sharing";
import type { User } from "firebase/auth";
import {
    collection,
    onSnapshot,
    orderBy,
    query,
    type Unsubscribe,
} from "firebase/firestore";
import { onMounted, ref } from "vue";

const props = defineProps<{
    achievementPos: number;
    currentAchievId: string;
}>();

let achievement: Achievement;

const user = ref<User | null>();
const AchievementsList = ref();
let unsubscribeAchiev: Unsubscribe;

async function addAchievementToSlot(id: string, url: string, title: string) {
    achievement = {
        id: id,
        iconUrl: url,
        title: title,
    };
    if (auth.currentUser?.uid) {
        try {
            await addAchievement(props.achievementPos, achievement);
        } catch (error) {
            console.log(error);
        }
    }
}

onMounted(async () => {
    try {
        await auth.authStateReady();
        user.value = auth.currentUser;

        unsubscribeAchiev = onSnapshot(
            query(
                collection(db, `users/${user.value?.uid}/achievements`),
                orderBy("added", "asc")
            ),
            (querySnapshot) => {
                AchievementsList.value = querySnapshot.docs;
            }
        );
    } catch (error) {
        console.log(error);
    }
});
</script>

<template>
    <div
        class="modal fade"
        id="achievementListModal"
        ref="modalRef"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="achievementListModal Label"
        aria-hidden="true"
    >
        <div class="modal-dialog modal-lg">
            <div class="modal-content" style="max-height: 80vh">
                <div class="modal-header">
                    <div class="w-100">
                        <div class="d-flex justify-content-between">
                            <h1
                                class="modal-title fs-5"
                                id="achievementListModal Label"
                            >
                                Achievements Slot Nr.
                                {{ props.achievementPos }}:
                            </h1>
                            <button
                                type="button"
                                class="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                @click="
                                    () => {
                                        $emit('hide-modal');
                                    }
                                "
                            ></button>
                        </div>
                    </div>
                </div>
                <div class="modal-body overflow-y-auto">
                    <div
                        v-for="items in AchievementsList"
                        class="d-flex flex-column"
                    >
                        <button
                            class="my-2 d-flex btn btn-light shadow text-start align-items-center"
                            @click="
                                () => {
                                    addAchievementToSlot(
                                        items.id,
                                        items.data().IconUrl,
                                        items.data().title
                                    );
                                    $emit('hide-modal');
                                }
                            "
                            :disabled="props.currentAchievId == items.id"
                        >
                            <div
                                class="d-flex justify-content-center m-3 shadow"
                            >
                                <img
                                    v-if="items.data().IconUrl"
                                    :src="items.data().IconUrl"
                                    class="border border-dark"
                                    width="60px"
                                    height="60px"
                                    alt="Achievement Cover"
                                />
                                <div
                                    v-else
                                    class="border border-dark d-flex shadow"
                                    style="
                                        width: 60px;
                                        height: 60px;
                                        background-color: #737163;
                                    "
                                >
                                    <span class="text-center mt-3 text-white"
                                        >Missing Achievement Icon</span
                                    >
                                </div>
                            </div>
                            <div class="d-flex flex-column ms-4 mt-3">
                                <div>
                                    <span class="fs-4"
                                        >"{{ items.data().title }}"</span
                                    >
                                </div>
                                <hr class="m-0" />
                                <p class="mb-0">Unlocked:</p>
                                <div>
                                    <span class="ms-2">{{
                                        new Intl.DateTimeFormat("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        }).format(items.data().added.toDate())
                                    }}</span>
                                </div>
                                <div></div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
