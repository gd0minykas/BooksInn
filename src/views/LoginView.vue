<script setup lang="ts">
import GoogleLogo from "@/components/logos/GoogleLogo.vue";
import ErrorMessage from "@/components/inputs/ErrorMessage.vue";
import ForgotPModal from "@/components/ForgotPasswordModal.vue";
import ShowPassButton from "@/components/inputs/icons/ShowPassButton.vue";
import HidePassButton from "@/components/inputs/icons/HidePassButton.vue";
import Spinner1 from "@/components/Spinner1.vue";
import NavBar from "@/components/NavBar.vue";
import FooterBar from "@/components/Footer.vue";
import { auth, signInGoogleUser } from "@/firebase";
import { generateFirebaseAuthErrorMessage } from "@/errorHandler";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ref } from "vue";

const email = ref<string>("");
const password = ref<string>("");
const errorMessage = ref<string | undefined>();
const loading = ref<boolean>(false);
const hidePassword = ref<boolean>(true);

// Implement floating label to form-control

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
  <div>
    <div class="container">
      <div class="row">
        <div class="col align-self-start">
          <h1 class="fs-1">BooksInn</h1>
          <h2>Log In as an existing user</h2>
        </div>
        <div class="col">
          <div class="form-floating mb-3">
            <input
              type="email"
              v-model="email"
              class="form-control"
              id="email"
              placeholder="Email"
            />
            <label for="email">Email</label>
          </div>
          <div class="mb-3">
            <div v-if="hidePassword" class="input-group mb-3">
              <div class="form-floating">
                <input
                  class="form-control"
                  type="password"
                  v-model="password"
                  id="password"
                  placeholder="Password"
                />
                <label for="password">Password:</label>
              </div>
              <HidePassButton @click="hidePassword = !hidePassword" />
            </div>
            <div v-else class="input-group mb-3">
              <div class="form-floating">
                <input
                  class="form-control"
                  type="text"
                  v-model="password"
                  id="password"
                  placeholder="Password"
                />
                <label for="password">Password:</label>
              </div>
              <ShowPassButton @click="hidePassword = !hidePassword" />
            </div>
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
          </div>
          <Spinner1 v-if="loading" />
        </div>
      </div>
    </div>
  </div>
  <FooterBar />
</template>
