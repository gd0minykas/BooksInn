<script setup lang="ts">
import { sendPasswordResetEmail } from "firebase/auth";
import { auth, provider } from "@/firebase";
import { ref } from 'vue';

const emailForgotPassword = ref<string>("");

async function sendForgotPassword() {
  try {
    await sendPasswordResetEmail(auth, emailForgotPassword.value);
  } catch (error) {
    console.log(error);
  }
  // Open modal
  // Enter email
  // send password email
  // Validation?
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
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
          <button type="button" class="btn btn-warning" @click="sendForgotPassword()">Send</button>
        </div>
      </div>
    </div>
  </div>
</template>
