<script setup lang="ts">
import Add from "./logos/Add.vue";
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
                            @click="() => console.log('add')"
                            ><Add
                        /></a>
                    </div>
                </div>
                <hr class="mx-5" />
            </div>
            <div class="card-body" id="favBookCard">
                <div class="d-flex justify-content-center">
                    <div class="align-self-center"></div>
                </div>
            </div>
        </div>
    </div>
</template>
