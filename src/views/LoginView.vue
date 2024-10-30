<script setup lang="ts">
import FacebookLogo from "@/components/logos/FacebookLogo.vue";
import GoogleLogo from "@/components/logos/GoogleLogo.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";
import router from "@/router/index";
import NavBar from "@/components/NavBar.vue";
import { auth } from "@/firebase";
import { generateFirebaseAuthErrorMessage } from "@/errorHandler";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ref, watch, type Ref } from "vue";

const email = ref<string>("");
const password = ref<string>("");
const errorMessage = ref<string | undefined>();

async function signIn() {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    localStorage.setItem("userIsLogedIn", "true");
  } catch (error) {
    if (error instanceof FirebaseError) {
      errorMessage.value = generateFirebaseAuthErrorMessage(error.code);
    }
  }
}
</script>

<template>
  <NavBar />
  <div class="container">
    <div class="row">
      <div class="col align-self-start">
        <h1 class="fs-1">BooksInn</h1>
        <h2>Log In as an existing user</h2>
      </div>
      <div class="col">
        <div class="mb-3">
          <label for="email" class="form-label ms-1">Email:</label>
          <input type="email" v-model="email" id="email" class="form-control" />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label ms-1">Password:</label>
          <input
            type="password"
            v-model="password"
            id="password"
            class="form-control"
          />
        </div>
        <div class="min-h-2" style="min-height: 3em">
          <ErrorMessage :msg="errorMessage" v-if="errorMessage" />
        </div>
        <div class="mb-3 d-flex flex-row-reverse">
          <button type="submit" class="ms-2 btn btn-warning" @click="signIn()">
            Log In
          </button>
          <button
            type="button"
            class="ms-5 btn btn-warning"
            @click="router.push('/register')"
          >
            Register
          </button>
          <a href="#"><FacebookLogo class="mx-3" /></a>
          <a href="#"><GoogleLogo class="me-3" /></a>
        </div>
      </div>
    </div>
  </div>
</template>
