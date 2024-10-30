<script setup lang="ts">
import { onMounted, ref } from "vue";
import NavBar from "@/components/NavBar.vue";
import { auth } from "@/firebase";
import type { User } from "firebase/auth";

const user = ref<User | null>();

onMounted(() => {
  user.value = auth.currentUser;
});

let userName: string;
</script>

<template>
  <NavBar />
  <div class="container">
    <h1>BooksInn Profile</h1>
    <h2>Hello, {{ user?.email }}</h2>
  </div>
</template>
