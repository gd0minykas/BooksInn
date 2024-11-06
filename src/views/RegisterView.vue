<script setup lang="ts">
import GoogleLogo from "@/components/logos/GoogleLogo.vue";
import ErrorMessage from "@/components//inputs/ErrorMessage.vue";
import ShowPassButton from "@/components/inputs/icons/ShowPassButton.vue";
import HidePassButton from "@/components/inputs/icons/HidePassButton.vue";
import Spinner1 from "@/components/Spinner1.vue";
import NavBar from "@/components/NavBar.vue";
import FooterBar from "@/components/Footer.vue";
import { createUserWithEmail, signInGoogleUser } from "@/firebase";
import { FirebaseError } from "firebase/app";
import router from "@/router/index";
import { ref } from "vue";
import { generateFirebaseAuthErrorMessage } from "@/errorHandler";

const email = ref<string>("");
const password = ref<string>("");
const repeatPassword = ref<string>("");
const errorMessage = ref<string | undefined>();
const loading = ref<boolean>(false);
const hidePassword = ref<boolean>(true);

async function createUser() {
  try {
    if (password.value == repeatPassword.value) {
      loading.value = true;
      await createUserWithEmail(email.value, password.value);
      loading.value = false;
    } else {
      errorMessage.value = generateFirebaseAuthErrorMessage(
        "repeatPassword does not match"
      );
    }
  } catch (error) {
    if (error instanceof FirebaseError) {
      loading.value = false;
      errorMessage.value = generateFirebaseAuthErrorMessage(error.code);
    }
  }
}

async function createGoogleUser() {
  try {
    loading.value = true;
    await signInGoogleUser();
    loading.value = false;
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
        <h2>Register as a new user</h2>
      </div>
      <div class="col">
        <div class="mb-3">
          <label for="email" class="form-label ms-1">Email:</label>
          <input type="email" v-model="email" id="email" class="form-control" />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label ms-1">Password:</label>
          <div v-if="hidePassword" class="input-group">
            <input
              class="form-control"
              type="password"
              v-model="password"
              id="password"
            />
            <HidePassButton @click="hidePassword = !hidePassword" />
          </div>
          <div v-else class="input-group">
            <input
              class="form-control"
              type="text"
              v-model="password"
              id="password"
            />
            <ShowPassButton @click="hidePassword = !hidePassword" />
          </div>
        </div>
        <div class="mb-3">
          <label for="rePassword" class="form-label ms-1"
            >Repeat Password:</label
          >
          <div v-if="hidePassword" class="input-group">
            <input
              class="form-control"
              type="password"
              v-model="repeatPassword"
              id="rePassword"
            />
            <HidePassButton @click="hidePassword = !hidePassword" />
          </div>
          <div v-else class="input-group">
            <input
              class="form-control"
              type="text"
              v-model="repeatPassword"
              id="rePassword"
            />
            <ShowPassButton @click="hidePassword = !hidePassword" />
          </div>
        </div>
        <div v-if="!loading">
          <div class="min-h-2" style="min-height: 3em">
            <ErrorMessage :msg="errorMessage" v-if="errorMessage" />
          </div>
          <div class="mb-3 d-flex flex-row-reverse">
            <button type="button" class="btn btn-warning" @click="createUser()">
              Register
            </button>
            <a href="#" @click="createGoogleUser()">
              <GoogleLogo class="me-5" />
            </a>
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
            <p class="mt-2 lead">
              *Log back in if you have an account created!
            </p>
          </div>
        </div>
        <Spinner1 v-if="loading" />
      </div>
    </div>
  </div>
  <FooterBar />
</template>
