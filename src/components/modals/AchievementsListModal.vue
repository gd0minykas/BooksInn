<script setup lang="ts">
import { auth, db } from "@/firebase";
import type { User } from "firebase/auth";
import {
    collection,
    onSnapshot,
    orderBy,
    query,
    type Unsubscribe,
} from "firebase/firestore";
import { onMounted, ref, watch } from "vue";

const user = ref<User | null>();
const AchievementsList = ref();
let unsubscribeAchiev: Unsubscribe;
const displayedAchievements = ref([]);

watch(displayedAchievements, () => {
    console.log(displayedAchievements);
});

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
                                Achievements list:
                            </h1>
                            <button
                                type="button"
                                class="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                    </div>
                </div>
                <div class="modal-body overflow-y-auto">
                    <div
                        v-for="items in AchievementsList"
                        class="d-flex flex-column"
                    >
                        <input
                            type="checkbox"
                            class="btn-check"
                            :id="items.data().id"
                            :value="items.data().title"
                            v-model="displayedAchievements"
                        />
                        <label
                            :for="items.data().id"
                            class="my-2 d-flex btn btn-light shadow text-start"
                        >
                            <div class="d-flex justify-content-center m-3">
                                <img
                                    v-if="items.data().IconUrl"
                                    :src="items.data().IconUrl"
                                    class="border border-dark"
                                    width="80px"
                                    height="80px"
                                    alt="Achievement Cover"
                                />
                                <div
                                    v-else
                                    class="border border-dark d-flex"
                                    style="
                                        width: 80px;
                                        height: 80px;
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
                                <hr class="mt-0" />
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
                        </label>
                        <!-- <button
                            class="my-2 d-flex btn btn-light shadow text-start"
                            @click="
                                () => {
                                    displayedAchievements?.push([
                                        items.data().title,
                                        items.data().IconUrl,
                                    ]);
                                    console.log(displayedAchievements);
                                }
                            "
                            data-bs-toggle="button"
                            :disabled="displayedAchievements.length == 3"
                        >
                            <div class="d-flex justify-content-center m-3">
                                <img
                                    v-if="items.data().IconUrl"
                                    :src="items.data().IconUrl"
                                    class="border border-dark"
                                    width="80px"
                                    height="80px"
                                    alt="Achievement Cover"
                                />
                                <div
                                    v-else
                                    class="border border-dark d-flex"
                                    style="
                                        width: 80px;
                                        height: 80px;
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
                                <hr class="mt-0" />
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
                        </button> -->
                    </div>
                    <div class="modal-footer mt-3">
                        <div class="d-flex justify-content-between w-100">
                            <div class="lead">
                                {{
                                    displayedAchievements?.length
                                        ? displayedAchievements?.length
                                        : "0"
                                }}
                            </div>
                            <div class="d-flex gap-2">
                                <button
                                    type="button"
                                    class="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                >
                                    Close
                                </button>
                                <button
                                    type="button"
                                    class="btn btn-warning"
                                    @click="console.log('add')"
                                    data-bs-dismiss="modal"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
