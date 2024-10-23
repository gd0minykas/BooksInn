<script setup lang="ts">
import { auth } from "@/firebase";
import { FirebaseError } from "firebase/app";
import { signOut, type User } from "firebase/auth";
import { ref, type Ref, onMounted } from "vue";

let userName: string;

onMounted(() => {
  console.log(auth.currentUser);
});

async function signOutUser() {
  try {
    signOut(auth);
  } catch (error) {
    if (error instanceof FirebaseError) {
      // TODO ERROR HANDLING
      console.log(error.code);
    }
  }
}
</script>

<template>
  <div class="container">
    <h1>BooksInn Profile</h1>
    <h2>Hello {{ auth.currentUser?.email }}</h2>
    <button class="btn btn-warning" @click="signOutUser()">SignOut</button>
  </div>
</template>
