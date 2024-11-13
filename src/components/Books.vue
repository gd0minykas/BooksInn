<script setup lang="ts"></script>
<template>
  <!-- Third Section -->
  <div class="col-12">
    <div id="cards" class="card rounded-4">
      <div class="card-title">
        <div class="mt-2 ms-5">
          <ul class="nav nav-pills">
            <li class="nav-item">
              <button class="nav-link link-dark" href="#">Read</button>
            </li>
            <li class="nav-item">
              <button class="nav-link link-dark" href="#">To Read</button>
            </li>
            <li class="nav-item">
              <button class="nav-link link-dark" href="#">Reading</button>
            </li>
          </ul>
        </div>
        <div class="d-flex justify-content-center">
          <span class="fs-4">Books</span>
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
