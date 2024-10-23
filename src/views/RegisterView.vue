<script setup lang="ts">
import FacebookLogo from "@/components/logos/FacebookLogo.vue";
import GoogleLogo from "@/components/logos/GoogleLogo.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";
import NavBar from "@/components/NavBar.vue";
import { auth } from "@/firebase";
import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword } from "firebase/auth";
import router from "@/router/index";
import { ref } from "vue";

const email = ref<string>("");
const password = ref<string>("");
const repeatPassword = ref<string>("");

const emailError = ref<string | undefined>();
const passwordError = ref<string | undefined>();
const repeatPasswordError = ref<string | undefined>();

async function createUser() {
  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value);
    localStorage.setItem("userIsLogedIn", "true");
  } catch (error) {
    if (error instanceof FirebaseError) {
      // TODO ERROR HANDLING
      console.log(error.code);
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
        <form>
          <div class="mb-3">
            <label for="email" class="form-label ms-1">Email:</label>
            <input
              type="email"
              v-model="email"
              id="email"
              class="form-control"
            />
            <ErrorMessage v-if="emailError" :msg="emailError" />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label ms-1">Password:</label>
            <input
              type="password"
              v-model="password"
              id="password"
              class="form-control"
            />
            <ErrorMessage v-if="passwordError" :msg="passwordError" />
          </div>
          <div class="mb-4">
            <label for="rePassword" class="form-label ms-1"
              >Repeat Password:</label
            >
            <input
              type="password"
              v-model="repeatPassword"
              id="rePassword"
              class="form-control"
              disabled
            />
            <ErrorMessage
              v-if="repeatPasswordError"
              :msg="repeatPasswordError"
            />
          </div>
          <div class="mb-3 d-flex flex-row-reverse">
            <button
              type="button"
              class="ms-5 btn btn-warning"
              @click="createUser()"
            >
              Register
            </button>
            <a href="#"><FacebookLogo class="mx-3" /></a>
            <a href="#"><GoogleLogo class="me-3" /></a>
          </div>
          <div class="d-flex flex-row-reverse">
            <button
              type="button"
              class="ms-5 btn btn-warning btn-sm"
              @click="router.push('/login')"
            >
              Log In
            </button>
            <p class="mt-2 lead">
              *Log back in if you have an account created!
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
