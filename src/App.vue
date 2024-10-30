<script setup lang="ts">
import { onAuthStateChanged } from "firebase/auth";
import router from "./router";
import { auth } from "./firebase";
import { onBeforeMount } from "vue";

onAuthStateChanged(auth, (user) => {
  if (user) {
    router.push("/");
  } else {
    if (router.currentRoute.value.path !== "/register") {
      router.push("/login");
    }
  }
});
</script>

<template>
  <RouterView />
</template>
