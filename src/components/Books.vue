<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import Add from "./logos/Add.vue";
import type { book } from "@/sharing";
import type { User } from "firebase/auth";
import { collection, onSnapshot, type Unsubscribe } from "firebase/firestore";
import { auth, db } from "@/firebase";
import BookDetailsModal from "./modals/BookDetailsModal.vue";
import { Modal } from "bootstrap";

// for details
let chosenBook: book;

const user = ref<User | null>();
const ReadList = ref();
const ToReadList = ref();
const ReadingList = ref();
let unsubscribeRead: Unsubscribe;
let unsubscribeToRead: Unsubscribe;
let unsubscribeReading: Unsubscribe;
const booksDetailsOpen = ref<boolean>();

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

        // unsubscribe need
    } catch (error) {
        console.log(error);
    }
});
</script>
<template>
    <BookDetailsModal
        v-if="booksDetailsOpen"
        :book="chosenBook"
        @hide-modal="closeModal()"
    />
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

            <div class="tab-content" id="myTabContent">
                <div
                    class="tab-pane fade show active"
                    id="read-tab-pane"
                    role="tabpanel"
                    aria-labelledby="read-tab"
                    tabindex="0"
                >
                    <div class="card-body pt-0" id="favBookCard">
                        <div class="row mx-md-3 mb-3">
                            <div class="col-12 text-center mb-3">
                                <span class="fs-4">Read</span>
                            </div>
                            <div
                                class="col-4 col-md-2 mb-3"
                                v-for="doc in ReadList"
                                v-if="ReadList"
                            >
                                <button
                                    class="d-flex btn btn-light shadow text-start w-100 h-100"
                                    @click="
                                        () => {
                                            getBookDetails(
                                                doc.id,
                                                doc.data().title,
                                                doc.data().authors,
                                                doc.data().categories,
                                                doc.data().pages,
                                                doc.data().currentCategory,
                                                doc.data().imgSrc,
                                                doc.data().imgSrcSmall
                                            );
                                        }
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
                                        class="border border-dark w-100 h-100"
                                        alt="Book Cover"
                                    />
                                    <div
                                        v-else
                                        class="border border-dark d-flex w-100 h-100"
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
                <div
                    class="tab-pane fade"
                    id="reading-tab-pane"
                    role="tabpanel"
                    aria-labelledby="reading-tab"
                    tabindex="0"
                >
                    <div class="card-body pt-0" id="favBookCard">
                        <div class="row mx-md-3 mb-3">
                            <div class="col-12 text-center mb-3">
                                <span class="fs-4">Reading</span>
                            </div>
                            <div
                                class="col-4 col-md-2 mb-3"
                                v-for="doc in ReadingList"
                                v-if="ReadingList"
                            >
                                <button
                                    class="d-flex btn btn-light shadow text-start w-100 h-100"
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
                                        class="border border-dark w-100 h-100"
                                        alt="Book Cover"
                                    />
                                    <div
                                        v-else
                                        class="border border-dark d-flex w-100 h-100"
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
                <div
                    class="tab-pane fade"
                    id="to-read-tab-pane"
                    role="tabpanel"
                    aria-labelledby="to-read-tab"
                    tabindex="0"
                >
                    <div class="card-body pt-0" id="favBookCard">
                        <div class="row mx-md-3 mb-3">
                            <div class="col-12 text-center mb-3">
                                <span class="fs-4">To Read</span>
                            </div>
                            <div
                                class="col-4 col-md-2 mb-3"
                                v-for="doc in ToReadList"
                                v-if="ToReadList"
                            >
                                <button
                                    class="d-flex btn btn-light shadow text-start w-100 h-100"
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
                                        class="border border-dark w-100 h-100"
                                        alt="Book Cover"
                                    />
                                    <div
                                        v-else
                                        class="border border-dark d-flex w-100 h-100"
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
    </div>
</template>
