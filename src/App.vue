<script setup lang="ts">
import { onAuthStateChanged } from "firebase/auth";
import NavBar from "./components/NavBar.vue";
import { auth } from "./firebase";
import router from "./router";

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log(`Hello, ${auth.currentUser?.email}`);
    router.push("/");
  } else {
    router.push("/login");
  }
});
</script>

<template>
  <NavBar />
  <RouterView />
</template>
