<script setup lang="ts">
import GoogleLogo from "@/components/logos/GoogleLogo.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";
import NavBar from "@/components/NavBar.vue";
import { auth } from "@/firebase";
import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword } from "firebase/auth";
import router from "@/router/index";
import { ref } from "vue";
import { generateFirebaseAuthErrorMessage } from "@/errorHandler";

const email = ref<string>("");
const password = ref<string>("");
const repeatPassword = ref<string>("");
const errorMessage = ref<string | undefined>();

async function createUser() {
  try {
    console.log(password.value);
    console.log(repeatPassword.value);
    if (password.value == repeatPassword.value) {
      await createUserWithEmailAndPassword(auth, email.value, password.value);
      localStorage.setItem("userIsLogedIn", "true");
    } else {
      errorMessage.value = generateFirebaseAuthErrorMessage(
        "repeatPassword does not match"
      );
    }
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
        <h2>Register as a new user</h2>
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
        <div class="mb-3">
          <label for="rePassword" class="form-label ms-1"
            >Repeat Password:</label
          >
          <input
            type="password"
            v-model="repeatPassword"
            id="rePassword"
            class="form-control"
          />
        </div>
        <div class="min-h-2" style="min-height: 3em">
          <ErrorMessage :msg="errorMessage" v-if="errorMessage" />
        </div>
        <div class="mb-3 d-flex flex-row-reverse">
          <button
            type="button"
            class="ms-5 btn btn-warning"
            @click="createUser()"
          >
            Register
          </button>
          <a href="#"><GoogleLogo class="me-3" /></a>
        </div>
        <div class="d-flex flex-row-reverse justify-content-between">
          <div class="align-self-center">
            <button
              type="button"
              class="ms-5 btn btn-warning"
              @click="router.push('/login')"
            >
              Log In
            </button>
          </div>
          <p class="mt-2 lead">*Log back in if you have an account created!</p>
        </div>
      </div>
    </div>
  </div>
</template>
