<script setup lang="ts">
import Spinner1 from "@/components/Spinner1.vue";
import { onBeforeMount, ref } from "vue";
import NavBar from "@/components/NavBar.vue";
import { auth } from "@/firebase";
import type { User } from "firebase/auth";

const user = ref<User | null>();

onBeforeMount(() => {
  user.value = auth.currentUser;
});

let userName: string;
</script>

<template>
  <NavBar />
  <div class="container">
    <h1>BooksInn Profile</h1>
    <h2 v-if="user">Hello, {{ user?.email }}</h2>
    <Spinner1 v-else />
  </div>
</template>
