<script async setup lang="ts">
import { onMounted, ref } from "vue";
import NavBar from "@/components/NavBar.vue";
import { auth } from "@/firebase";
import { type User } from "firebase/auth";
import Spinner1 from "@/components/Spinner1.vue";

const user = ref<User | null>();
const loading = ref<boolean>(false);

onMounted(async () => {
  loading.value = true;
  await auth.authStateReady();
  user.value = auth.currentUser;
  loading.value = false;
});
</script>

<template>
  <NavBar />
  <div class="container">
    <div v-if="loading">
      <Spinner1 />
    </div>
    <div v-else>
      <h1>BooksInn Profile</h1>
      <h2 v-if="user">Hello, {{ user?.displayName }}</h2>
    </div>
  </div>
</template>
