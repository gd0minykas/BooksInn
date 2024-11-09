<script async setup lang="ts">
import { onMounted, ref } from "vue";
import NavBar from "@/components/NavBar.vue";
import Spinner1 from "@/components/Spinner1.vue";
import FooterBar from "@/components/Footer.vue";
import { auth, db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { type User } from "firebase/auth";
import { toast } from "vue3-toastify";

const user = ref<User | null>();
const loading = ref<boolean>(false);
const userDoc = ref();

onMounted(async () => {
  loading.value = true;
  try {
    await auth.authStateReady();
    user.value = auth.currentUser;
    console.log(user?.value);
    userDoc.value = await getDoc(doc(db, "users", user?.value.uid));
  } catch (error) {
    console.log(error);
  }
  loading.value = false;
});
</script>

<template>
  <NavBar />
  <div class="container">
    <div v-if="loading">
      <Spinner1 />
    </div>
    <div v-else>
      <OffCanvas />
      <div class="row g-5">
        <!-- Fist Section -->
        <div class="col-12">
          <div class="d-flex justify-content-evenly">
            <div class="d-flex justify-content-center">
              <img
                src="../assets/img/placeholderAvatars/1.png"
                class="rounded-circle border border-dark"
                style="max-width: 10rem; max-height: 10rem"
                alt="Avatar"
              />
            </div>
            <!-- <div class="vr mx-4"></div> -->
            <div class="align-self-center">
              <span v-if="user?.displayName" class="fs-2">{{
                user?.displayName
              }}</span>
              <span v-else class="fs-2">Guest</span>
              <div>
                <label for="title" class="form-label mb-0">Title:</label>
                <span class="fs-4 ms-3" id="title">Novice</span>
              </div>
            </div>
            <!-- <div class="vr mx-4"></div> -->
            <div class="d-flex align-self-center row">
              <span class="fs-2">Profile Level</span>
              <div>
                <span class="fs-8">Level: {{ 1 }}</span>
              </div>
              <div>
                <div class="progress border border-dark mt-1">
                  <div
                    class="progress-bar bg-warning text-dark"
                    role="progressbar"
                    style="width: 50%"
                    aria-valuenow="50"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    50%
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr />
        </div>

        <!-- Second Section -->
        <div class="col-6">
          <div id="cards" class="card rounded-4">
            <div class="card-title">
              <div class="d-flex justify-content-center my-3">
                <span class="fs-4">Achievements</span>
              </div>
            </div>
            <div class="card-body" id="achiementsCard">
              <div class="d-flex justify-content-center">
                <div class=""></div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-6">
          <div id="cards" class="card rounded-4">
            <div class="card-title">
              <div class="d-flex justify-content-center my-3">
                <span class="fs-4">Favourite Book</span>
              </div>
            </div>
            <div class="card-body" id="favBookCard">
              <div class="d-flex justify-content-center">
                <div class="align-self-center"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Third Section -->
        <div class="col-12">
          <div class="mx-3">
            <ul class="nav nav-tabs">
              <li class="nav-item">
                <button class="nav-link link-dark" href="#">Read</button>
              </li>
              <li class="nav-item">
                <button class="nav-link link-dark" href="#">To Read</button>
              </li>
              <li class="nav-item">
                <button class="nav-link link-dark" href="#">Reading</button>
              </li>
            </ul>
          </div>
          <div id="cards" class="card rounded-4">
            <div class="card-title">
              <div class="d-flex justify-content-center my-3">
                <span class="fs-4">Books</span>
              </div>
            </div>
            <div class="card-body" id="favBookCard">
              <div class="d-flex justify-content-center">
                <div class="align-self-center"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Forth Section -->
        <div class="col-12">
          <div id="cards" class="card rounded-4">
            <div class="card-title">
              <div class="d-flex justify-content-center my-3">
                <span class="fs-4">Reviews</span>
              </div>
            </div>
            <div class="card-body" id="favBookCard">
              <div class="d-flex justify-content-center">
                <div class="align-self-center"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <FooterBar v-if="!loading" />
</template>

<style>
#cards {
  background-color: #e0cdbf;
  border: none;
  box-shadow: 5px 5px 2px #b5b4b3;
}

.nav-item {
  background-color: #e0cdbf;
  border-radius: 5px 5px 0 0;
}
</style>
