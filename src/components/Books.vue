<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import Add from "./logos/Add.vue";
import type { User } from "firebase/auth";
import {
    collection,
    getDocs,
    onSnapshot,
    type CollectionReference,
    type Unsubscribe,
} from "firebase/firestore";
import { auth, db } from "@/firebase";
import { unsubscribe } from "diagnostics_channel";

const user = ref<User | null>();
const ReadList = ref();
const ToReadList = ref();
const ReadingList = ref();
let unsubscribeRead: Unsubscribe;
let unsubscribeToRead: Unsubscribe;
let unsubscribeReading: Unsubscribe;

onMounted(async () => {
    try {
        await auth.authStateReady();
        user.value = auth.currentUser;

        unsubscribeRead = onSnapshot(
            collection(db, `users/${user.value?.uid}/read`),
            (querySnapshot) => {
                ReadList.value = querySnapshot.docs;
            }
        );

        unsubscribeToRead = onSnapshot(
            collection(db, `users/${user.value?.uid}/to-read`),
            (querySnapshot) => {
                ToReadList.value = querySnapshot.docs;
            }
        );

        unsubscribeReading = onSnapshot(
            collection(db, `users/${user.value?.uid}/reading`),
            (querySnapshot) => {
                ReadingList.value = querySnapshot.docs;
            }
        );
    } catch (error) {
        console.log(error);
    }
});
</script>
<template>
    <!-- Third Section -->
    <div class="col-12" style="max-width: 56.25rem">
        <div id="cards" class="card rounded-4">
            <div class="card-title mb-0">
                <div class="mt-2 mx-5 d-flex justify-content-between">
                    <div>
                        <ul class="nav nav-underline" id="myTab" role="tablist">
                            <li class="nav-item link-dark" role="presentation">
                                <button
                                    class="nav-link link-dark active"
                                    id="read-tab"
                                    data-bs-toggle="tab"
                                    data-bs-target="#read-tab-pane"
                                    type="button"
                                    role="tab"
                                    aria-controls="read-tab-pane"
                                    aria-selected="true"
                                >
                                    Read
                                </button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button
                                    class="nav-link link-dark"
                                    id="to-read-tab"
                                    data-bs-toggle="tab"
                                    data-bs-target="#to-read-tab-pane"
                                    type="button"
                                    role="tab"
                                    aria-controls="to-read-tab-pane"
                                    aria-selected="false"
                                >
                                    To Read
                                </button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button
                                    class="nav-link link-dark"
                                    id="reading-tab"
                                    data-bs-toggle="tab"
                                    data-bs-target="#reading-tab-pane"
                                    type="button"
                                    role="tab"
                                    aria-controls="reading-tab-pane"
                                    aria-selected="false"
                                >
                                    Reading
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <a
                            href=""
                            class="link-dark"
                            data-bs-toggle="modal"
                            data-bs-target="#bookSearchModal"
                            ><Add
                        /></a>
                    </div>
                </div>
                <div></div>
                <hr class="mx-5" />
            </div>

            <div class="tab-content" style="min-height: 40vh" id="myTabContent">
                <div
                    class="tab-pane fade show active"
                    id="read-tab-pane"
                    role="tabpanel"
                    aria-labelledby="read-tab"
                    tabindex="0"
                >
                    <div class="card-body pt-0" id="favBookCard">
                        <div class="row g-4 mx-3">
                            <div class="col-12 text-center my-3">
                                <span class="fs-4">Read</span>
                            </div>
                            <div
                                class="col-2"
                                v-for="doc in ReadList"
                                v-if="ReadList"
                            >
                                <img
                                    v-if="doc.data().imgSrc"
                                    :src="doc.data().imgSrc"
                                    class="border border-dark"
                                    alt="Book Cover"
                                />
                                <div
                                    v-else
                                    class="border border-dark d-flex"
                                    style="
                                        width: 130px;
                                        height: 200px;
                                        background-color: #737163;
                                    "
                                >
                                    <span
                                        class="text-center mt-3 text-white lead"
                                        >Missing Book Cover</span
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    class="tab-pane fade"
                    id="to-read-tab-pane"
                    role="tabpanel"
                    aria-labelledby="to-read-tab"
                    tabindex="0"
                >
                    <div class="card-body pt-0" id="favBookCard">
                        <div class="row g-4 mx-3">
                            <div class="col-12 text-center my-3">
                                <span class="fs-4">To Read</span>
                            </div>
                            <div
                                class="col-2"
                                v-for="doc in ToReadList"
                                v-if="ToReadList"
                            >
                                <img
                                    v-if="doc.data().imgSrc"
                                    :src="doc.data().imgSrc"
                                    class="border border-dark"
                                    alt="Book Cover"
                                />
                                <div
                                    v-else
                                    class="border border-dark d-flex"
                                    style="
                                        width: 130px;
                                        height: 200px;
                                        background-color: #737163;
                                    "
                                >
                                    <span
                                        class="text-center mt-3 text-white lead"
                                        >Missing Book Cover</span
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    class="tab-pane fade"
                    id="reading-tab-pane"
                    role="tabpanel"
                    aria-labelledby="reading-tab"
                    tabindex="0"
                >
                    <div class="card-body pt-0" id="favBookCard">
                        <div class="row g-4 mx-3">
                            <div class="col-12 text-center my-3">
                                <span class="fs-4">Reading</span>
                            </div>
                            <div
                                class="col-2"
                                v-for="doc in ReadingList"
                                v-if="ReadingList"
                            >
                                <img
                                    v-if="doc.data().imgSrc"
                                    :src="doc.data().imgSrc"
                                    class="border border-dark"
                                    alt="Book Cover"
                                />
                                <div
                                    v-else
                                    class="border border-dark d-flex"
                                    style="
                                        width: 130px;
                                        height: 200px;
                                        background-color: #737163;
                                    "
                                >
                                    <span
                                        class="text-center mt-3 text-white lead"
                                        >Missing Book Cover</span
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style></style>
