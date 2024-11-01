<script setup lang="ts">
import GoogleLogo from "@/components/logos/GoogleLogo.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";
import ForgotPModal from "@/components/ForgotPasswordModal.vue";
import Spinner1 from "@/components/Spinner1.vue";
import router from "@/router/index";
import NavBar from "@/components/NavBar.vue";
import { auth, provider } from "@/firebase";
import { generateFirebaseAuthErrorMessage } from "@/errorHandler";
import { FirebaseError } from "firebase/app";
import {
  getRedirectResult,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { ref, watch, type Ref } from "vue";

const email = ref<string>("");
const password = ref<string>("");
const errorMessage = ref<string | undefined>();
const loading = ref<boolean>(false);

async function signIn() {
  try {
    loading.value = true;
    await signInWithEmailAndPassword(auth, email.value, password.value);
    loading.value = false;
  } catch (error) {
    loading.value = false;
    if (error instanceof FirebaseError) {
      errorMessage.value = generateFirebaseAuthErrorMessage(error.code);
    }
  }
}

async function loginGoogleUser() {
  try {
    loading.value = true;
    await signInWithPopup(auth, provider);
    const result = await getRedirectResult(auth);
    if (result) {
      console.log(result);
      loading.value = false;
    }
  } catch (error) {
    loading.value = false;
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
            class="form-control mb-3"
          />
          <a
            href="#"
            class="link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
            data-bs-toggle="modal"
            data-bs-target="#staticBackdrop"
          >
            <span>Forgot password</span></a
          >
          <ForgotPModal />
        </div>
        <div class="min-h-2" style="min-height: 3em">
          <ErrorMessage :msg="errorMessage" v-if="errorMessage" />
        </div>
        <div v-if="!loading">
          <div class="mb-3 d-flex flex-row-reverse">
            <button type="button" class="btn btn-warning" @click="signIn()">
              Log In
            </button>
            <a href="#" @click="loginGoogleUser()"
              ><GoogleLogo class="me-5"
            /></a>
          </div>
          <div class="d-flex flex-row-reverse justify-content-between">
            <div class="align-self-center">
              <button
                type="button"
                class="ms-5 btn btn-warning"
                @click="router.push('/register')"
              >
                Register
              </button>
            </div>
            <p class="mt-2 lead">
              *Register if you do not have an account already!
            </p>
          </div>
        </div>
        <Spinner1 v-if="loading" />
      </div>
    </div>
  </div>
</template>
