<script setup lang="ts">
import { onAuthStateChanged } from "firebase/auth";
import router from "./router";
import { auth } from "./firebase";

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log(user);
    localStorage.setItem("userIsLogedIn", "true");
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
