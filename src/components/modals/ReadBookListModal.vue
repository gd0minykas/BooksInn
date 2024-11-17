<script setup lang="ts">
import { auth, db } from "@/firebase";
import { addFavBook, type book, type favBook } from "@/sharing";
import { collection, onSnapshot } from "firebase/firestore";
import { onMounted, ref } from "vue";

const list = ref();
let favouriteBook: favBook;

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

async function addFavouriteBook(data: any) {
    favouriteBook = {
        title: data.title,
        authors: data.authors,
        categories: data.categories,
        pages: data.pages,
        imgSrc: data.imgSrc,
        imgSrcSmall: data.imgSrcSmall,
    };
    console.log(favouriteBook);
    try {
        await addFavBook(favouriteBook);
    } catch (error) {
        console.log(error);
    }
}
</script>

<template>
    <div
        class="modal fade"
        id="readBookListModal"
        ref="modalRef"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="readBookListModalLabel"
        aria-hidden="true"
    >
        <div class="modal-dialog modal-lg">
            <div class="modal-content" style="max-height: 80vh">
                <div class="modal-header">
                    <div class="w-100">
                        <div class="d-flex justify-content-between">
                            <h1
                                class="modal-title fs-5"
                                id="readBookListModalLabel"
                            >
                                Read Books list:
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
                    <div v-for="items in list" class="d-flex flex-column">
                        <button
                            class="my-2 d-flex btn btn-light shadow text-start"
                            data-bs-dismiss="modal"
                            @click="addFavouriteBook(items.data())"
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
                                    <span class="text-center mt-3 text-white"
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
                                <div v-for="authors in items.data().authors">
                                    <span class="ms-2">{{ authors }}</span>
                                </div>
                                <div></div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
            <div class="modal-footer"></div>
        </div>
    </div>
</template>
