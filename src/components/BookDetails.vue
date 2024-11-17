<script setup lang="ts">
import Back from "./logos/Back.vue";
const props = defineProps({
    imgSrc: String,
    title: String,
    authors: String,
    categories: String,
    pages: Number,
});
</script>

<template>
    <div class="row">
        <div class="col-12 justify-content-start mb-3">
            <button
                class="nav-link link-warning"
                @click="() => console.log('test')"
            >
                <Back />
            </button>
        </div>
        <div class="col-4">
            <div class="d-flex justify-content-center m-3">
                <img
                    v-if="props.imgSrc"
                    :src="props.imgSrc"
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
                    <span class="text-center mt-3 text-white lead"
                        >Missing Book Cover</span
                    >
                </div>
            </div>
        </div>
        <div class="col-8">
            <div class="d-flex flex-column ms-4">
                <div>
                    <span class="fs-5">"{{ props.title }}"</span>
                </div>
                <hr class="mt-0" />
                <p class="mb-0">Authors:</p>
                <div v-for="authors in props.authors">
                    <span class="ms-2">{{ authors }}</span>
                </div>
                <p class="mb-0">Categories:</p>
                <div v-for="categories in props.categories">
                    <span class="ms-2">{{ categories }}</span>
                </div>
                <div>
                    <span class="fs-5">"{{ props.pages }}"</span>
                </div>
            </div>
        </div>
        <div class="col-12 mt-5">
            <hr />
            <div class="d-flex justify-content-evenly w-100 mt-2">
                <div class="col-4">
                    <span class="fs-5">Add a book to:</span>
                </div>
                <!-- <div class="col-8 d-flex justify-content-evenly">
          <button
            type="submit"
            class="btn btn-warning"
            @click="addChosenBook('read')"
            data-bs-dismiss="modal"
          >
            Read
          </button>
          <button
            type="submit"
            class="btn btn-warning"
            @click="addChosenBook('to-read')"
            data-bs-dismiss="modal"
          >
            To Read
          </button>
          <button
            type="submit"
            class="btn btn-warning"
            @click="addChosenBook('reading')"
            data-bs-dismiss="modal"
          >
            Reading
          </button>
        </div> -->
            </div>
        </div>
    </div>
</template>
