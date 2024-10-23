<script setup lang="ts">
import NavBar from "@/components/NavBar.vue";
import { auth } from "@/firebase";

let userName: string;
</script>

<template>
  <NavBar />
  <div class="container">
    <h1>BooksInn Profile</h1>
    <h2>Hello</h2>
  </div>
</template>
