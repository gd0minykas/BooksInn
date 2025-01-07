<script setup lang="ts">
import { auth, db } from "@/firebase";
import { addBook, type book } from "@/sharing";
import { deleteDoc, doc } from "firebase/firestore";
import { toast } from "vue3-toastify";

const props = defineProps<{
    book: book;
}>();

async function deleteBook() {
    if (auth.currentUser?.uid) {
        try {
            await deleteDoc(
                doc(
                    db,
                    `users/${auth.currentUser?.uid}/${props.book.currentCategory}`,
                    props.book.id
                )
            );
            toast(`${props.book.title} was deleted successfully!`, {
                autoClose: 5000,
                type: "success",
                theme: "colored",
            });
        } catch (error) {
            console.log(error);
        }
    }
}

async function addExistingBook(category: string) {
    if (auth.currentUser?.uid) {
        try {
            await deleteDoc(
                doc(
                    db,
                    `users/${auth.currentUser?.uid}/${props.book.currentCategory}`,
                    props.book.id
                )
            );
            await addBook(props.book, category);
        } catch (error) {
            console.log(error);
        }
    }
}
</script>

<template>
    <div
        class="modal fade"
        id="bookDetailsModal"
        ref="modalRef"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="bookDetailsModalLabel"
        aria-hidden="true"
    >
        <div class="modal-dialog modal-lg">
            <div class="modal-content" style="max-height: 80vh">
                <div class="modal-header">
                    <div class="w-100">
                        <div class="d-flex justify-content-between">
                            <h1 class="modal-title fs-5">Book Details</h1>
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
                    <div class="row">
                        <div class="col-12 d-flex justify-content-end mb-3">
                            <button
                                class="btn btn-danger btn-sm"
                                @click="
                                    () => {
                                        deleteBook().then(() => {
                                            $emit('hide-modal');
                                        });
                                    }
                                "
                            >
                                Delete
                            </button>
                        </div>
                        <div class="col-4">
                            <div class="d-flex justify-content-center m-3">
                                <img
                                    v-if="props.book.imgSrc"
                                    :src="props.book.imgSrc"
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
                                        >"{{ props.book.title }}"</span
                                    >
                                </div>
                                <hr class="mt-0" />
                                <p class="mb-0">Authors:</p>
                                <div v-for="author in props.book.authors">
                                    <span class="ms-2">{{ author }}</span>
                                </div>
                                <p class="mb-0 mt-2">Categories:</p>
                                <div v-for="category in props.book.categories">
                                    <span class="ms-2">{{ category }}</span>
                                </div>
                                <p class="mb-0 mt-2">Pages:</p>
                                <div>
                                    <span class="ms-2">{{
                                        props.book.pages
                                    }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 mt-5">
                            <hr />
                            <div
                                class="d-flex justify-content-evenly w-100 mt-2"
                            >
                                <div class="col-4">
                                    <span class="fs-5">Add a book to:</span>
                                </div>
                                <div
                                    class="col-8 d-flex justify-content-evenly"
                                >
                                    <button
                                        type="submit"
                                        class="btn btn-warning"
                                        @click="
                                            addExistingBook('read').then(() => {
                                                $emit('hide-modal');
                                            })
                                        "
                                        :disabled="
                                            props.book.currentCategory == 'read'
                                        "
                                    >
                                        Read
                                    </button>
                                    <button
                                        type="submit"
                                        class="btn btn-warning"
                                        @click="
                                            addExistingBook('reading').then(
                                                () => {
                                                    $emit('hide-modal');
                                                }
                                            )
                                        "
                                        :disabled="
                                            props.book.currentCategory ==
                                                'reading' ||
                                            props.book.currentCategory == 'read'
                                        "
                                    >
                                        Reading
                                    </button>
                                    <button
                                        type="submit"
                                        class="btn btn-warning"
                                        @click="
                                            addExistingBook('to-read').then(
                                                () => {
                                                    $emit('hide-modal');
                                                }
                                            )
                                        "
                                        :disabled="
                                            props.book.currentCategory ==
                                                'to-read' ||
                                            props.book.currentCategory == 'read'
                                        "
                                    >
                                        To Read
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
