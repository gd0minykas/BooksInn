<script async setup lang="ts">
import { ref } from "vue";
import NavBar from "@/components/NavBar.vue";
import { auth } from "@/firebase";
import { type User } from "firebase/auth";
import Spinner1 from "@/components/Spinner1.vue";

const user = ref<User | null>(auth.currentUser);
</script>

<template>
  <NavBar />
  <div class="container">
    <h1>BooksInn Profile</h1>
    <h2 v-if="user">Hello, {{ user?.email }}</h2>
  </div>
</template>
