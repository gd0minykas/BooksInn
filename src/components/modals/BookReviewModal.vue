<script setup lang="ts">
import { auth, db } from "@/firebase";
import { addReview, type reviewBook } from "@/sharing";
import { collection, onSnapshot } from "firebase/firestore";
import Back from "../logos/Back.vue";
import { onMounted, ref, watch } from "vue";

const list = ref();
const bookReviewIsOpen = ref<boolean>(false);
const ratingNum = ref<number | undefined>();
let chosenBook: reviewBook;

onMounted(() => {
    try {
        onSnapshot(
            collection(db, `users/${auth.currentUser?.uid}/read`),
            (querySnapshot) => {
                list.value = querySnapshot.docs;
            }
        );

        // unsubscribe need
    } catch (error) {
        console.log(error);
    }
});

watch(ratingNum, () => {
    if (ratingNum.value != undefined) {
        if (ratingNum.value > 5) {
            ratingNum.value = 5;
        } else if (ratingNum.value < 0) {
            ratingNum.value = 0;
        }
    }
});

function getBookDetails(
    _id: string,
    _title: string,
    _authors: string[],
    _imgSrc?: string,
    _imgSrcSmall?: string
) {
    chosenBook = {
        id: _id,
        title: _title,
        authors: _authors,
        imgSrc: _imgSrc,
        imgSrcSmall: _imgSrcSmall,
    };
    bookReviewIsOpen.value = true;
}

async function addReviewOfaBook() {
    chosenBook.rating = ratingNum.value;
    try {
        const result: any = await addReview(chosenBook);
    } catch (error) {
        console.log(error);
    }
}
</script>

<template>
    <div
        class="modal fade"
        id="bookReviewModal"
        ref="modalRef"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="bookReviewModalLabel"
        aria-hidden="true"
    >
        <div class="modal-dialog modal-lg">
            <div class="modal-content" style="max-height: 80vh">
                <div class="modal-header">
                    <div class="w-100">
                        <div class="d-flex justify-content-between">
                            <h1
                                class="modal-title fs-5"
                                id="bookReviewModalLabel"
                            >
                                Read Books list:
                            </h1>
                            <button
                                type="button"
                                class="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                @click="bookReviewIsOpen = !bookReviewIsOpen"
                            ></button>
                        </div>
                    </div>
                </div>
                <div class="modal-body overflow-y-auto">
                    <div v-if="bookReviewIsOpen">
                        <div class="row">
                            <div class="col-12 justify-content-start mb-3">
                                <button
                                    class="nav-link link-warning"
                                    @click="
                                        () => {
                                            bookReviewIsOpen =
                                                !bookReviewIsOpen;
                                        }
                                    "
                                >
                                    <Back />
                                </button>
                            </div>
                            <div class="col-4">
                                <div class="d-flex justify-content-center m-3">
                                    <img
                                        v-if="chosenBook.imgSrc"
                                        :src="chosenBook.imgSrc"
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
                                <div class="d-flex flex-column ms-4">
                                    <div>
                                        <span class="fs-5"
                                            >"{{ chosenBook.title }}"</span
                                        >
                                    </div>
                                    <hr class="mt-0" />
                                    <div class="row">
                                        <div class="col-6">
                                            <p class="mb-0">Authors:</p>
                                            <div
                                                v-for="author in chosenBook.authors"
                                            >
                                                <span class="ms-2">{{
                                                    author
                                                }}</span>
                                            </div>
                                        </div>
                                        <div
                                            class="col-6 d-flex justify-content-end"
                                        >
                                            <div style="width: 80px">
                                                <label
                                                    for="rating"
                                                    class="form-label"
                                                    >Rating</label
                                                >
                                                <input
                                                    class="form-control"
                                                    type="number"
                                                    min="0"
                                                    max="5"
                                                    v-model="ratingNum"
                                                    id="rating"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-floating mt-3">
                                        <textarea
                                            class="form-control"
                                            placeholder="Write a review here"
                                            id="bookReview"
                                            v-model="chosenBook.review"
                                            style="min-height: 100px"
                                        ></textarea>
                                        <label for="bookReview">Review</label>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12 mt-5">
                                <hr />
                                <div
                                    class="d-flex justify-content-end gap-4 w-100 mt-2"
                                >
                                    <button
                                        type="submit"
                                        class="btn btn-secondary"
                                        @click="
                                            () => {
                                                bookReviewIsOpen =
                                                    !bookReviewIsOpen;
                                            }
                                        "
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        class="btn btn-warning"
                                        data-bs-dismiss="modal"
                                        @click="
                                            () => {
                                                bookReviewIsOpen =
                                                    !bookReviewIsOpen;
                                                addReviewOfaBook();
                                            }
                                        "
                                    >
                                        Add Review
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        <div v-for="items in list" class="d-flex flex-column">
                            <button
                                class="my-2 d-flex btn btn-light shadow text-start"
                                @click="
                                    getBookDetails(
                                        items.id,
                                        items.data().title,
                                        items.data().authors,
                                        items.data().imgSrc,
                                        items.data().imgSrcSmall
                                    )
                                "
                            >
                                <div class="d-flex justify-content-center m-3">
                                    <img
                                        v-if="items.data().imgSrcSmall"
                                        :src="items.data().imgSrcSmall"
                                        class="border border-dark"
                                        width="80px"
                                        height="120px"
                                        alt="Book Cover"
                                    />
                                    <div
                                        v-else
                                        class="border border-dark d-flex"
                                        style="
                                            width: 80px;
                                            height: 120px;
                                            background-color: #737163;
                                        "
                                    >
                                        <span
                                            class="text-center mt-3 text-white"
                                            >Missing Book Cover</span
                                        >
                                    </div>
                                </div>
                                <div class="d-flex flex-column ms-4">
                                    <div>
                                        <span class="fs-4"
                                            >"{{ items.data().title }}"</span
                                        >
                                    </div>
                                    <hr class="mt-0" />
                                    <p class="mb-0">Authors:</p>
                                    <div
                                        v-for="authors in items.data().authors"
                                    >
                                        <span class="ms-2">{{ authors }}</span>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer"></div>
        </div>
    </div>
</template>
