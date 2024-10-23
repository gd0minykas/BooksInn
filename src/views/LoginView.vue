<script setup lang="ts">
import FacebookLogo from "@/components/logos/FacebookLogo.vue";
import GoogleLogo from "@/components/logos/GoogleLogo.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";
import router from "@/router/index";
import { auth } from "@/firebase";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ref, type Ref } from "vue";

const email: Ref<string> = ref("");
const password: Ref<string> = ref("");

const emailError: Ref<string | undefined> = ref();
const passwordError: Ref<string | undefined> = ref();

async function signIn() {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
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
    <div class="row">
      <div class="col align-self-start">
        <h1 class="fs-1">BooksInn</h1>
        <h2>Log In as an existing user</h2>
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
          <div class="mb-3 d-flex flex-row-reverse">
            <button
              type="button"
              class="ms-2 btn btn-warning"
              @click="signIn()"
            >
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
        </form>
      </div>
    </div>
  </div>
</template>
