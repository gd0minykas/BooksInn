<script setup lang="ts">
import { ref } from "vue";
import Spinner1 from "@/components/Spinner1.vue";
import Back from "../logos/Back.vue";
import { type book, addBook } from "@/sharing";

const data = ref();
const searchResult = ref<string>();
const loadingSearch = ref<boolean>(false);
const bookDetailsOpen = ref<boolean>(false);

// for details
let chosenBook: book;

async function doSearch() {
    loadingSearch.value = true;
    try {
        fetch(
            `https://www.googleapis.com/books/v1/volumes?q=${searchResult.value}&orderBy=relevance&maxResults=20`
        )
            .then((response) => response.json())
            .then((result) => {
                data.value = result.items;
            });
        loadingSearch.value = false;
    } catch (error) {
        console.log(error);
    }
    loadingSearch.value = false;
}

function getBookDetails(
    _id: string,
    _title: string,
    _authors: string[],
    _categories: string[],
    _pages: number,
    _imgSrc?: string
) {
    chosenBook = {
        id: _id,
        title: _title,
        authors: _authors,
        categories: _categories,
        pages: _pages,
        imgSrc: _imgSrc,
    };

    bookDetailsOpen.value = true;
}

async function addChosenBook(category: string) {
    if (chosenBook.id) {
        const result = await addBook(chosenBook, category);
        if (result == 1) {
            console.log("added");
        } else if (result == 0) {
            console.log("not added");
        }
    }
}

// book search modal can be used for booksearch and for favourite book
</script>

<template>
    <div
        class="modal fade"
        id="bookSearchModal"
        ref="modalRef"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="bookSearchModalLabel"
        aria-hidden="true"
    >
        <div class="modal-dialog modal-lg">
            <div class="modal-content" style="max-height: 80vh">
                <div class="modal-header">
                    <div class="w-100">
                        <div class="d-flex justify-content-between">
                            <h1
                                class="modal-title fs-5"
                                id="bookSearchModalLabel"
                            >
                                Add a Book:
                            </h1>
                            <button
                                type="button"
                                class="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                @click="
                                    () => {
                                        data = null;
                                        searchResult = '';
                                        bookDetailsOpen = false;
                                    }
                                "
                            ></button>
                        </div>
                        <hr />
                        <div class="input-group">
                            <input
                                class="form-control"
                                type="search"
                                placeholder="Search"
                                aria-label="Search"
                                aria-describedby="doSearch"
                                v-model="searchResult"
                                :disabled="bookDetailsOpen"
                            />
                            <button
                                class="btn btn-outline-warning"
                                type="button"
                                id="doSearch"
                                @click="doSearch()"
                                :disabled="bookDetailsOpen"
                            >
                                Search
                            </button>
                        </div>
                    </div>
                </div>
                <div class="modal-body overflow-y-auto">
                    <div v-if="loadingSearch">
                        <Spinner1 />
                    </div>
                    <div v-else>
                        <div v-if="bookDetailsOpen">
                            <div class="row">
                                <div class="col-12 justify-content-start mb-3">
                                    <button
                                        class="nav-link link-warning"
                                        @click="
                                            bookDetailsOpen = !bookDetailsOpen
                                        "
                                    >
                                        <Back />
                                    </button>
                                </div>
                                <div class="col-4">
                                    <div
                                        class="d-flex justify-content-center m-3"
                                    >
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
                                        <p class="mb-0">Authors:</p>
                                        <div
                                            v-for="author in chosenBook.authors"
                                        >
                                            <span class="ms-2">{{
                                                author
                                            }}</span>
                                        </div>
                                        <p class="mb-0 mt-2">Categories:</p>
                                        <div
                                            v-for="category in chosenBook.categories"
                                        >
                                            <span class="ms-2">{{
                                                category
                                            }}</span>
                                        </div>
                                        <p class="mb-0 mt-2">Pages:</p>
                                        <div>
                                            <span class="ms-2">{{
                                                chosenBook.pages
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
                                            <span class="fs-5"
                                                >Add a book to:</span
                                            >
                                        </div>
                                        <div
                                            class="col-8 d-flex justify-content-evenly"
                                        >
                                            <button
                                                type="submit"
                                                class="btn btn-warning"
                                                @click="addChosenBook('read')"
                                            >
                                                Read
                                            </button>
                                            <button
                                                type="submit"
                                                class="btn btn-warning"
                                                @click="
                                                    addChosenBook('to-read')
                                                "
                                            >
                                                To Read
                                            </button>
                                            <button
                                                type="submit"
                                                class="btn btn-warning"
                                                @click="
                                                    addChosenBook('reading')
                                                "
                                            >
                                                Reading
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else>
                            <div
                                v-for="items in data"
                                class="d-flex flex-column"
                            >
                                <button
                                    v-if="items.volumeInfo.printType == 'BOOK'"
                                    class="my-2 d-flex btn btn-light shadow text-start"
                                    @click="
                                        getBookDetails(
                                            items.id,
                                            items.volumeInfo.title,
                                            items.volumeInfo.authors
                                                ? items.volumeInfo.authors
                                                : '-',
                                            items.volumeInfo.categories
                                                ? items.volumeInfo.categories
                                                : '-',
                                            items.volumeInfo.pageCount,
                                            items.volumeInfo.imageLinks
                                                ?.thumbnail
                                        )
                                    "
                                >
                                    <div
                                        class="d-flex justify-content-center m-3"
                                    >
                                        <img
                                            v-if="
                                                items.volumeInfo.imageLinks
                                                    ?.smallThumbnail
                                            "
                                            :src="
                                                items.volumeInfo.imageLinks
                                                    ?.smallThumbnail
                                            "
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
                                                >"{{
                                                    items.volumeInfo.title
                                                }}"</span
                                            >
                                        </div>
                                        <hr class="mt-0" />
                                        <p class="mb-0">Authors:</p>
                                        <div
                                            v-for="authors in items.volumeInfo
                                                .authors"
                                        >
                                            <span class="ms-2">{{
                                                authors
                                            }}</span>
                                        </div>
                                        <div></div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer"></div>
            </div>
        </div>
    </div>
</template>
