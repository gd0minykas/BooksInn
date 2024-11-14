<script setup lang="ts">
import Add from "./logos/Add.vue";
</script>
<template>
  <!-- Third Section -->
  <div class="col-12">
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

      <div class="tab-content" style="min-height: 40vh" id="myTabContent">
        <div
          class="tab-pane fade show active"
          id="read-tab-pane"
          role="tabpanel"
          aria-labelledby="read-tab"
          tabindex="0"
        >
          <div class="card-body pt-0" id="favBookCard">
            <div class="d-flex justify-content-center">
              <div class="align-self-center">
                <div class="d-flex justify-content-center my-3">
                  <span class="fs-4">Read</span>
                </div>
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
            <div class="d-flex justify-content-center">
              <div class="align-self-center">
                <div class="d-flex justify-content-center my-3">
                  <span class="fs-4">To Read</span>
                </div>
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
            <div class="d-flex justify-content-center">
              <div class="align-self-center">
                <div class="d-flex justify-content-center my-3">
                  <span class="fs-4">Reading</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
