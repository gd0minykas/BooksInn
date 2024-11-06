<script setup lang="ts">
import router from "@/router/index";
import BooksInnLogo from "./logos/BooksInnLogo.vue";
import { ref, computed } from "vue";

const userState = ref<string | null>(localStorage.getItem("userIsLogedIn"));
const currentRoute = ref<string>(router.currentRoute.value.path);
</script>
<template>
  <div
    class="position-absolute bottom-0 start-50 translate-middle-x"
    id="footer-container"
  >
    <footer id="footer" class="mt-5">
      <div class="container">
        <div class="row">
          <hr class="mt-3" />
          <div class="col">
            <a class="d-flex navbar-brand my-3 mx-5" href="/">
              <BooksInnLogo />
              <span class="ms-2 fs-4">Books' Inn</span>
            </a>
          </div>
          <div class="col">
            <div
              class="d-flex flex-row-reverse justify-content-evenly my-3 mx-5"
              v-if="!userState"
            >
              <div class="align-self-center">
                <button
                  type="button"
                  class="ms-5 btn btn-warning"
                  @click="router.push('/register')"
                >
                  Register
                </button>
              </div>
              <p class="lead">
                Join Books' Inn <br />
                by creating your own Account!
              </p>
            </div>
            <div v-else class="d-flex flex-row-reverse my-3 mx-5">
              <p class="lead text-end">
                Books' Inn <br />
                making reading even more fun!
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
#footer {
  background-color: #e0cdbf;
  min-height: 9em;
}
#footer-container {
  width: 100vw;
}
</style>
