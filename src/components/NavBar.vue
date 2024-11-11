<script setup lang="ts">
import { auth, signOutUser } from "@/firebase";
import { FirebaseError } from "firebase/app";
import { signOut } from "firebase/auth";
import { ref } from "vue";
import BooksInnLogo from "./logos/BooksInnLogo.vue";
import { generateFirebaseAuthErrorMessage } from "@/errorHandler";
import router from "@/router";

const userState = ref<string | null>(localStorage.getItem("userIsLogedIn"));
const currentRoute = ref<string>(router.currentRoute.value.path);

async function signOutFromNavbar() {
  try {
    await signOutUser();
    userState.value = null;
  } catch (error) {
    if (error instanceof FirebaseError) {
      console.log(generateFirebaseAuthErrorMessage(error.code));
    }
  }
}
</script>

<template>
  <nav id="nav" class="navbar navbar-expand-lg mb-5 mx-5 rounded-5">
    <div
      v-if="currentRoute != '/'"
      class="container-fluid d-flex justify-content-evenly"
    >
      <div>
        <a class="navbar-brand" href="/">
          <BooksInnLogo />
        </a>
      </div>
      <div v-if="userState" class="d-flex">
        <button class="btn btn-warning me-2" @click="signOutFromNavbar()">
          Sign Out
        </button>
      </div>
    </div>
    <div v-else class="container-fluid d-flex justify-content-end">
      <div v-if="userState" class="d-flex">
        <button class="btn btn-warning me-2" @click="signOutFromNavbar()">
          Sign Out
        </button>
      </div>
    </div>
  </nav>
</template>
