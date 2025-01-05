<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import Add from "./logos/Add.vue";
import { auth, db } from "@/firebase";
import type { User } from "firebase/auth";
import { removeFavBook, type book } from "@/sharing";
import {
    collection,
    doc,
    limit,
    onSnapshot,
    orderBy,
    query,
    type Unsubscribe,
} from "firebase/firestore";
import BookDetailsModal from "./modals/BookDetailsModal.vue";
import { Modal } from "bootstrap";
import Minus from "./logos/Minus.vue";
import Edit from "./logos/Edit.vue";
import AchievementsListModal from "./modals/AchievementsListModal.vue";

// for details
let chosenBook: book;

const user = ref<User | null>();
const UserRef = ref();
const ReadListLast5 = ref();
const ToReadListLast5 = ref();
const ReadingListLast5 = ref();
const ReviewList = ref();
const AchievementsList = ref();
let unsubscribeUser: Unsubscribe;
let unsubscribeRead: Unsubscribe;
let unsubscribeToRead: Unsubscribe;
let unsubscribeReading: Unsubscribe;
let unsubscribeReview: Unsubscribe;
const booksDetailsOpen = ref<boolean>();
let procentageLevel: number;
let remainingToLevel: number;
let level: number;
let levelInK: number;

function closeModal() {
    const modal = Modal.getOrCreateInstance("#bookDetailsModal");
    modal.hide();
    booksDetailsOpen.value = false;
}

function openModal() {
    setTimeout(() => {
        const modal = Modal.getOrCreateInstance("#bookDetailsModal");
        modal.toggle();
        modal.show();
    }, 1);
}

function getBookDetails(
    _id: string,
    _title: string,
    _authors: string[],
    _categories: string[],
    _pages: number,
    _currentCategory: string,
    _imgSrc?: string,
    _imgSrcSmall?: string
) {
    chosenBook = {
        id: _id,
        title: _title,
        authors: _authors,
        categories: _categories,
        pages: _pages,
        currentCategory: _currentCategory,
        imgSrc: _imgSrc,
        imgSrcSmall: _imgSrcSmall,
    };

    booksDetailsOpen.value = true;
    openModal();
}

onMounted(async () => {
    try {
        await auth.authStateReady();
        user.value = auth.currentUser;

        if (user.value) {
            unsubscribeUser = onSnapshot(
                doc(db, "users", user.value?.uid!),
                (querySnapshot) => {
                    UserRef.value = querySnapshot;
                    AchievementsList.value =
                        UserRef.value.data().DisplayedAchiev;
                }
            );

            unsubscribeRead = onSnapshot(
                query(
                    collection(db, `users/${user.value?.uid}/read`),
                    orderBy("added", "desc"),
                    limit(6)
                ),
                (querySnapshot) => {
                    ReadListLast5.value = querySnapshot.docs;
                }
            );

            unsubscribeToRead = onSnapshot(
                query(
                    collection(db, `users/${user.value?.uid}/to-read`),
                    orderBy("added", "desc"),
                    limit(6)
                ),
                (querySnapshot) => {
                    ToReadListLast5.value = querySnapshot.docs;
                }
            );

            unsubscribeReading = onSnapshot(
                query(
                    collection(db, `users/${user.value?.uid}/reading`),
                    orderBy("added", "desc"),
                    limit(6)
                ),
                (querySnapshot) => {
                    ReadingListLast5.value = querySnapshot.docs;
                }
            );

            unsubscribeReview = onSnapshot(
                query(
                    collection(db, `users/${user.value?.uid}/reviews`),
                    orderBy("added", "desc"),
                    limit(1)
                ),
                (querySnapshot) => {
                    ReviewList.value = querySnapshot.docs;
                }
            );
        }
    } catch (error) {
        console.log(error);
    }
});

watch(UserRef, () => {
    level = Math.trunc(UserRef.value?.data()?.Exp / 1000);
    levelInK = level * 1000;
    remainingToLevel = UserRef.value?.data()?.Exp - levelInK;
    procentageLevel = (remainingToLevel * 100) / 1000;
});
</script>

<template>
    <BookDetailsModal
        v-if="booksDetailsOpen"
        :book="chosenBook"
        @hide-modal="closeModal()"
    />
    <AchievementsListModal />
    <div class="row g-5" style="max-width: 56.25rem">
        <!-- Second Section -->
        <div class="col-6">
            <div id="cards" class="card rounded-4">
                <div class="card-title">
                    <div class="mx-5 d-flex justify-content-between my-3">
                        <span class="fs-3">Stats</span>
                        <div>
                            <a
                                href="#"
                                class="link-dark"
                                data-bs-toggle="modal"
                                data-bs-target="#achievementListModal"
                                ><Edit
                            /></a>
                        </div>
                    </div>
                    <hr class="mx-5" />
                </div>
                <div
                    class="card-body"
                    id="achiementsCard"
                    style="min-height: 15rem"
                >
                    <div class="row">
                        <div class="col-12">
                            <div class="mb-4 mx-5">
                                <div class="ms-2">
                                    <span class="fs-5">Profile Level</span>
                                    <div v-if="level">
                                        <span class="fs-8"
                                            >Lvl: {{ level }}</span
                                        >
                                    </div>
                                </div>
                                <div>
                                    <div
                                        class="progress mt-2 border border-dark"
                                        role="progressbar"
                                        aria-label="Warning example"
                                        aria-valuenow="75"
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                    >
                                        <div
                                            class="progress-bar bg-warning text-dark"
                                            :style="{
                                                width: procentageLevel + '%',
                                            }"
                                        >
                                            {{
                                                Math.trunc(procentageLevel)
                                                    ? Math.trunc(
                                                          procentageLevel
                                                      )
                                                    : 0
                                            }}%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12">
                            <hr class="mt-0 mx-4" />
                            <!-- achievements -->
                            <div
                                class="d-flex justify-content-evenly"
                                v-if="AchievementsList"
                            >
                                <div
                                    class="d-flex flex-column"
                                    v-for="achievement in AchievementsList"
                                >
                                    <img
                                        :src="achievement?.IconUrl"
                                        class="border shadow align-self-center"
                                        style="
                                            width: 50px;
                                            height: 50px;
                                            background-color: #737163;
                                        "
                                        alt="Achievements Cover"
                                    />
                                    <span
                                        style="max-width: 90px"
                                        class="fs-6 mt-1 fst-italic text-center"
                                        >{{ achievement.title }}</span
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-6">
            <div id="cards" class="card rounded-4">
                <div class="card-title">
                    <div class="mx-5 d-flex justify-content-between my-3">
                        <span class="fs-3">Favourite Book</span>
                        <div v-if="UserRef?.data()?.favBook">
                            <a
                                href="#"
                                class="link-danger"
                                @click="removeFavBook()"
                            >
                                <Minus />
                            </a>
                        </div>
                        <div v-else>
                            <a
                                href="#"
                                class="link-dark"
                                data-bs-toggle="modal"
                                data-bs-target="#readBookListModal"
                                ><Add
                            /></a>
                        </div>
                    </div>
                    <hr class="mx-5" />
                </div>
                <div
                    class="card-body"
                    id="favBookCard"
                    style="min-height: 15rem"
                >
                    <div
                        class="row mx-3"
                        v-if="UserRef?.data()?.favBook != null"
                    >
                        <div class="col-4">
                            <div class="d-flex justify-content-center m-3">
                                <img
                                    v-if="UserRef?.data()?.favBook.imgSrc"
                                    :src="UserRef?.data()?.favBook.imgSrc"
                                    style="
                                        width: 100px;
                                        height: 160px;
                                        background-color: #737163;
                                    "
                                    class="border border-dark"
                                    alt="Book Cover"
                                />
                                <div
                                    v-else
                                    class="border border-dark d-flex"
                                    style="
                                        width: 100px;
                                        height: 160px;
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
                            <div class="d-flex flex-column ms-4 mt-2">
                                <div>
                                    <span class="fs-5"
                                        >"{{
                                            UserRef?.data()?.favBook.title
                                        }}"</span
                                    >
                                </div>
                                <hr class="mt-0" />
                                <p class="mb-0">Authors:</p>
                                <div
                                    v-for="author in UserRef?.data()?.favBook
                                        .authors"
                                >
                                    <span class="ms-2">{{ author }}</span>
                                </div>
                                <p class="mb-0 mt-2">Categories:</p>
                                <div
                                    v-for="category in UserRef?.data()?.favBook
                                        .categories"
                                >
                                    <span class="ms-2">{{ category }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Third Section -->
        <div class="col-12">
            <div id="cards" class="card rounded-4">
                <div class="card-title">
                    <div class="mx-5 d-flex justify-content-between my-3">
                        <span class="fs-3">Books</span>
                        <div>
                            <a
                                href="#"
                                class="link-dark"
                                data-bs-toggle="modal"
                                data-bs-target="#bookSearchModal"
                                ><Add
                            /></a>
                        </div>
                    </div>
                    <hr class="mx-5" />
                </div>
                <div class="card-body" id="booksCard">
                    <div class="row g-4 mb-2">
                        <div class="d-flex justify-content-center">
                            <span
                                class="fw-lighter text-decoration-underline mb-3"
                                >Read Books</span
                            >
                        </div>
                        <div class="row">
                            <div
                                class="col-2"
                                v-for="doc in ReadListLast5"
                                v-if="ReadListLast5"
                            >
                                <button
                                    class="my-2 d-flex btn btn-light shadow text-start"
                                    @click="
                                        getBookDetails(
                                            doc.id,
                                            doc.data().title,
                                            doc.data().authors,
                                            doc.data().categories,
                                            doc.data().pages,
                                            doc.data().currentCategory,
                                            doc.data().imgSrc,
                                            doc.data().imgSrcSmall
                                        )
                                    "
                                    :disabled="booksDetailsOpen"
                                >
                                    <img
                                        v-if="doc.data().imgSrc"
                                        :src="doc.data().imgSrc"
                                        style="
                                            width: 100px;
                                            height: 160px;
                                            background-color: #737163;
                                        "
                                        class="border border-dark"
                                        alt="Book Cover"
                                    />
                                    <div
                                        v-else
                                        class="border border-dark d-flex"
                                        style="
                                            width: 100px;
                                            height: 160px;
                                            background-color: #737163;
                                        "
                                    >
                                        <span
                                            class="text-center mt-3 text-white lead"
                                            >Missing Book Cover</span
                                        >
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="row g-4 mb-2">
                        <div class="d-flex justify-content-center">
                            <span
                                class="fw-lighter text-decoration-underline mb-3"
                                >Reading Books</span
                            >
                        </div>
                        <div class="row">
                            <div
                                class="col-2"
                                v-for="doc in ReadingListLast5"
                                v-if="ReadingListLast5"
                            >
                                <button
                                    class="my-2 d-flex btn btn-light shadow text-start"
                                    @click="
                                        getBookDetails(
                                            doc.id,
                                            doc.data().title,
                                            doc.data().authors,
                                            doc.data().categories,
                                            doc.data().pages,
                                            doc.data().currentCategory,
                                            doc.data().imgSrc,
                                            doc.data().imgSrcSmall
                                        )
                                    "
                                    :disabled="booksDetailsOpen"
                                >
                                    <img
                                        v-if="doc.data().imgSrc"
                                        :src="doc.data().imgSrc"
                                        style="
                                            width: 100px;
                                            height: 160px;
                                            background-color: #737163;
                                        "
                                        class="border border-dark"
                                        alt="Book Cover"
                                    />
                                    <div
                                        v-else
                                        class="border border-dark d-flex"
                                        style="
                                            width: 100px;
                                            height: 160px;
                                            background-color: #737163;
                                        "
                                    >
                                        <span
                                            class="text-center mt-3 text-white lead"
                                            >Missing Book Cover</span
                                        >
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="row g-4 mb-2">
                        <div class="d-flex justify-content-center">
                            <span
                                class="fw-lighter text-decoration-underline mb-3"
                                >Books To Read</span
                            >
                        </div>
                        <div class="row">
                            <div
                                class="col-2"
                                v-for="doc in ToReadListLast5"
                                v-if="ToReadListLast5"
                            >
                                <button
                                    class="my-2 d-flex btn btn-light shadow text-start"
                                    @click="
                                        getBookDetails(
                                            doc.id,
                                            doc.data().title,
                                            doc.data().authors,
                                            doc.data().categories,
                                            doc.data().pages,
                                            doc.data().currentCategory,
                                            doc.data().imgSrc,
                                            doc.data().imgSrcSmall
                                        )
                                    "
                                    :disabled="booksDetailsOpen"
                                >
                                    <img
                                        v-if="doc.data().imgSrc"
                                        :src="doc.data().imgSrc"
                                        style="
                                            width: 100px;
                                            height: 160px;
                                            background-color: #737163;
                                        "
                                        class="border border-dark"
                                        alt="Book Cover"
                                    />
                                    <div
                                        v-else
                                        class="border border-dark d-flex"
                                        style="
                                            width: 100px;
                                            height: 160px;
                                            background-color: #737163;
                                        "
                                    >
                                        <span
                                            class="text-center mt-3 text-white lead"
                                            >Missing Book Cover</span
                                        >
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Forth Section -->
        <div class="col-12 pb-5">
            <div id="cards" class="card rounded-4">
                <div class="card-title">
                    <div class="mx-5 d-flex justify-content-between my-3">
                        <span class="fs-3">Reviews</span>
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
                <div class="card-body me-3" id="reviewsCard">
                    <div class="row">
                        <div v-for="items in ReviewList" v-if="ReviewList">
                            <div class="row">
                                <div class="col-4">
                                    <div
                                        class="d-flex justify-content-center m-3"
                                    >
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
                                        <div>
                                            <span class="fs-5"
                                                >"{{
                                                    items.data().title
                                                }}"</span
                                            >
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
                                                        >{{
                                                            items.data().rating
                                                        }}
                                                        / 5</span
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
    </div>
</template>
