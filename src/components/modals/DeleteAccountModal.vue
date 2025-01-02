<script setup lang="ts">
import { generateFirebaseAuthErrorMessage } from '@/errorHandler';
import { auth, db } from '@/firebase';
import { FirebaseError } from 'firebase/app';
import { deleteUser, type User } from 'firebase/auth';
import { deleteDoc, doc } from 'firebase/firestore';
import { onMounted, ref } from 'vue';
import { toast } from 'vue3-toastify';

const user = ref<User | null>();
const errorMessage = ref<string | undefined>();


onMounted(async () => {
    try {
        await auth.authStateReady();
        user.value = auth.currentUser;
    } catch (error) {
        console.log(error);
    }
});


async function deleteUserAccount() {
    if (user.value) {
        try {
            await deleteDoc(doc(db, "users", user.value?.uid));
            setTimeout(async () => {
              if(user.value) {
                await deleteUser(user.value);
              };
              localStorage.removeItem("userIsLogedIn");
            }, 3000);
            toast("Profile data has been deleted", {
                autoClose: 2500,
                theme: "colored",
                type: "warning"
            });
        } catch (error) {
            if(error instanceof FirebaseError) [
              errorMessage.value = generateFirebaseAuthErrorMessage(error.code)
            ]
        }
    }
}
</script>
<template>
  <div
    class="modal fade"
    id="deleteAccountModal"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="deleteAccountModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="deleteAccountModalLabel">
            Deleting Your Account ?
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
            Do You really want to delete your Account?
          </p>
          <hr></hr>
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
          <button type="button" class="btn btn-danger" @click="deleteUserAccount()" data-bs-dismiss="modal">Yes</button>
        </div>
      </div>
    </div>
  </div>
</template>
