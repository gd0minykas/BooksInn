<script setup lang="ts">
import { sendPasswordResetEmail } from "firebase/auth";
import ErrorMessage from "@/components/inputs/ErrorMessage.vue";
import { auth } from "@/firebase";
import { ref } from 'vue';
import { toast } from "vue3-toastify";
import { FirebaseError } from "firebase/app";
import { generateFirebaseAuthErrorMessage } from "@/errorHandler";

const emailForgotPassword = ref<string>("");
const errorMessage = ref<string | undefined>();

const notify = () => {
  toast('Password reset link was sent successfully!', {
    autoClose:3000,
    theme:'colored',
    type: 'success',
    position: 'top-right'
  })
}

async function sendForgotPassword() {
  try {
    await sendPasswordResetEmail(auth, emailForgotPassword.value);
    notify();
  } catch (error) {
    if(error instanceof FirebaseError) {
      errorMessage.value = generateFirebaseAuthErrorMessage(error.code);
    }
  }
}
</script>
<template>
  <div
    class="modal fade"
    id="staticBackdrop"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="staticBackdropLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="staticBackdropLabel">
            Forgot Your Password ?
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <p class="lead">
            No Problem! Enter your Email and receive a link to change
            your password
          </p>
          <hr></hr>
          <div class="mb-3">
            <label for="emailPassword" class="form-label ms-1">Email:</label>
            <input type="email" v-model="emailForgotPassword" id="emailPassword" class="form-control" />
          </div>
          <div class="min-h-2" style="min-height: 2em">
            <ErrorMessage :msg="errorMessage" v-if="errorMessage" />
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
          <button type="button" class="btn btn-warning" @click="sendForgotPassword()" data-bs-dismiss="modal">Send</button>
        </div>
      </div>
    </div>
  </div>
</template>
