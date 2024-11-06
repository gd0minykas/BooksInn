<script setup lang="ts">
import { auth } from "@/firebase";
import { FirebaseError } from "firebase/app";
import { signOut } from "firebase/auth";
import { ref } from "vue";
import BooksInnLogo from "./logos/BooksInnLogo.vue";
import { generateFirebaseAuthErrorMessage } from "@/errorHandler";

const userState = ref<string | null>(localStorage.getItem("userIsLogedIn"));

async function signOutUser() {
  try {
    signOut(auth);
    localStorage.removeItem("userIsLogedIn");
    userState.value = null;
  } catch (error) {
    if (error instanceof FirebaseError) {
      console.log(generateFirebaseAuthErrorMessage(error.code));
    }
  }
}
</script>

<template>
  <nav class="navbar navbar-expand-lg mb-5 mx-5">
    <div class="container-fluid d-flex justify-content-evenly">
      <a class="navbar-brand" href="/">
        <BooksInnLogo />
        <span class="ms-2 fs-4">Books' Inn</span></a
      >
      <button v-if="userState" class="btn btn-warning" @click="signOutUser()">
        Sign Out
      </button>
    </div>
  </nav>
</template>

<style></style>
