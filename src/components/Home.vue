<script setup lang="ts">
import Add from "./logos/Add.vue";
</script>

<template>
    <div class="row g-5" style="max-width: 56.25rem">
        <!-- Second Section -->
        <div class="col-6">
            <div id="cards" class="card rounded-4">
                <div class="card-title">
                    <div class="mx-5 d-flex justify-content-between my-3">
                        <span class="fs-3">Achievements</span>
                        <div>
                            <a
                                href="#"
                                class="link-dark"
                                @click="() => console.log('add')"
                                ><Add
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
                    <div class="d-flex justify-content-center">
                        <div class=""></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-6">
            <div id="cards" class="card rounded-4">
                <div class="card-title">
                    <div class="mx-5 d-flex justify-content-between my-3">
                        <span class="fs-3">Favourite Book</span>
                        <div>
                            <a
                                href="#"
                                class="link-dark"
                                @click="() => console.log('add')"
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
                    <div class="d-flex justify-content-center">
                        <div class="align-self-center"></div>
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
                <div class="card-body" id="booksCard" style="min-height: 30rem">
                    <div class="d-flex justify-content-center">
                        <div class="align-self-center"></div>
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
                                @click="() => console.log('add')"
                                ><Add
                            /></a>
                        </div>
                    </div>
                    <hr class="mx-5" />
                </div>
                <div
                    class="card-body"
                    id="reviewsCard"
                    style="min-height: 25rem"
                >
                    <div class="d-flex justify-content-center">
                        <div class="align-self-center"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
