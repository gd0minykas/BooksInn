<script setup lang="ts">
import { auth } from "@/firebase";
import { FirebaseError } from "firebase/app";
import { signOut } from "firebase/auth";
import { onMounted, ref } from "vue";

const userState = ref<string | null>(localStorage.getItem("userIsLogedIn"));
console.log(userState);

async function signOutUser() {
  try {
    signOut(auth);
    localStorage.removeItem("userIsLogedIn");
    userState.value = null;
  } catch (error) {
    if (error instanceof FirebaseError) {
      // TODO ERROR HANDLING
      console.log(error.code);
    }
  }
}
</script>

<template>
  <nav class="navbar navbar-expand-lg mb-3">
    <div class="ms-5 container-fluid">
      <a class="navbar-brand mx-auto" href="/">
        <img src="/src/assets/img/favicon.ico" alt="LOGO" class="mb-1" />
        <span class="ms-2 fs-4">Books' Inn</span></a
      >
      <button
        v-if="userState || auth.currentUser"
        class="btn btn-success btn-sm"
        @click="signOutUser()"
      >
        Sign Out
      </button>
    </div>
  </nav>
</template>
