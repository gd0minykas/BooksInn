<script setup lang="ts">
import Add from "./logos/Add.vue";
import { onMounted, ref } from "vue";
import { removeReview, type book } from "@/sharing";
import type { User } from "firebase/auth";
import { collection, onSnapshot, type Unsubscribe } from "firebase/firestore";
import { auth, db } from "@/firebase";
import Minus from "./logos/Minus.vue";

// for details
let chosenBook: book;

const user = ref<User | null>();
const ReviewList = ref();
const booksDetailsOpen = ref<boolean>();
let unsubscribeReview: Unsubscribe;

onMounted(async () => {
    try {
        await auth.authStateReady();
        user.value = auth.currentUser;

        unsubscribeReview = onSnapshot(
            collection(db, `users/${user.value?.uid}/reviews`),
            (querySnapshot) => {
                ReviewList.value = querySnapshot.docs;
            }
        );

        // unsubscribe need
    } catch (error) {
        console.log(error);
    }
});
</script>
<template>
    <!-- Forth Section -->
    <div class="col-12" style="max-width: 56.25rem">
        <div id="cards" class="card rounded-4">
            <div class="card-title">
                <div class="mx-5 d-flex justify-content-between mt-3">
                    <span class="fs-2">Reviews</span>
                    <div>
                        <a
                            href="#"
                            class="link-dark"
                            data-bs-toggle="modal"
                            data-bs-target="#bookReviewModal"
                            ><Add
                        /></a>
                    </div>
                </div>
                <hr class="mx-5" />
            </div>
            <div class="card-body me-3" id="favBookCard">
                <div class="row">
                    <div v-for="items in ReviewList" v-if="ReviewList">
                        <div class="row">
                            <div class="col-4">
                                <div class="d-flex justify-content-center">
                                    <img
                                        v-if="items.data().imgSrc"
                                        :src="items.data().imgSrc"
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
                            <div class="col-8">
                                <div class="d-flex flex-column">
                                    <div class="d-flex justify-content-between">
                                        <div>
                                            <span class="fs-5"
                                                >"{{
                                                    items.data().title
                                                }}"</span
                                            >
                                        </div>
                                        <div class="me-1">
                                            <a
                                                href="#"
                                                class="link-danger"
                                                @click="removeReview(items)"
                                            >
                                                <Minus />
                                            </a>
                                        </div>
                                    </div>

                                    <hr class="mt-0" />
                                    <div class="row">
                                        <div class="col-6">
                                            <p class="mb-0">Authors:</p>
                                            <div
                                                v-for="author in items.data()
                                                    .authors"
                                            >
                                                <span class="ms-2">{{
                                                    author
                                                }}</span>
                                            </div>
                                        </div>
                                        <div
                                            class="col-6 d-flex justify-content-end"
                                        >
                                            <div class="me-3 lead">
                                                <span>Rating: </span>
                                                <span
                                                    >{{ items.data().rating }} /
                                                    5</span
                                                >
                                            </div>
                                        </div>
                                    </div>
                                    <div class="mt-4">
                                        <p class="fst-italic">
                                            "{{ items.data().review }}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
