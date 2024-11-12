<script async setup lang="ts">
import { onMounted, ref, watch } from "vue";
import NavBar from "@/components/NavBar.vue";
import Spinner1 from "@/components/Spinner1.vue";
import FooterBar from "@/components/Footer.vue";
import LeftArrow from "@/components/inputs/icons/LeftArrow.vue";
import RightArrow from "@/components/inputs/icons/RightArrow.vue";
import { auth, db, avatarsList } from "@/firebase";
import { doc, DocumentSnapshot, getDoc } from "firebase/firestore";
import { type User } from "firebase/auth";
import router from "@/router";

const user = ref<User | null>();
const isNew = ref<boolean>();
const editingMode = ref<boolean>();
const index = ref<number>(0);
const loading = ref<boolean>(false);
const userDoc = ref<DocumentSnapshot>();

onMounted(async () => {
  loading.value = true;
  try {
    await auth.authStateReady();
    user.value = auth.currentUser;
    userDoc.value = await getDoc(doc(db, "users", user.value?.uid!));
    isNew.value = await userDoc.value?.data()?.isNew;
    index.value = await userDoc.value?.data()?.AvatarIndex;
    if (isNew.value) {
      router.push("/user-creation");
    }
  } catch (error) {
    console.log(error);
  }
  loading.value = false;
});

async function saveChanges() {
  console.log("lol");
}

watch(editingMode, () => console.log(editingMode.value));

// Galery, Might be a better solution.
watch(index, () => {
  if (index.value === -1) {
    index.value = 49;
  } else if (index.value === 50) {
    index.value = 0;
  }
});
</script>

<template>
  <div id="banner">
    <NavBar />
    <div v-if="loading">
      <Spinner1 />
    </div>
    <div v-else class="container">
      <div class="row g-5">
        <!-- Fist Section -->
        <div class="col-12" style="min-height: 180px">
          <div class="d-flex justify-content-evenly">
            <div class="d-flex justify-content-center">
              <div id="avatarPlace">
                <div v-if="editingMode">
                  <div class="d-flex justify-content-center">
                    <img
                      :src="avatarsList[index]"
                      class="rounded-circle border border-light"
                      style="width: 7.5rem; height: 7.5rem"
                      alt="Avatar"
                    />
                  </div>
                  <div class="d-flex justify-content-center mt-2">
                    <button
                      type="button"
                      class="btn btn-warning btn-sm mx-1"
                      @click="() => index--"
                    >
                      <LeftArrow />
                    </button>
                    <button
                      type="button"
                      class="btn btn-warning btn-sm mx-1"
                      @click="() => index++"
                    >
                      <RightArrow />
                    </button>
                  </div>
                </div>
                <div v-else>
                  <img
                    v-if="!isNew && user?.photoURL"
                    :src="user.photoURL"
                    class="rounded-circle border border-light"
                    style="width: 10rem; height: 10rem"
                    alt="Avatar"
                  />
                </div>
              </div>
            </div>
            <div class="align-self-end">
              <div class="mb-2">
                <span v-if="user?.displayName" class="fs-2">{{
                  user?.displayName
                }}</span>
                <span v-else class="fs-2">Guest</span>
                <div>
                  <label for="title" class="form-label mb-0">Title:</label>
                  <span class="fs-4 ms-3" id="title">Novice</span>
                </div>
              </div>
            </div>
            <div class="d-flex align-self-end row">
              <div class="mt-4">
                <span class="fs-3">Profile Level</span>
                <div>
                  <span class="fs-8">Level: {{ 1 }}</span>
                </div>
                <div>
                  <div class="progress border border-dark mt-1">
                    <div
                      class="progress-bar bg-warning text-dark"
                      role="progressbar"
                      style="width: 1%"
                      aria-valuenow="1"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="!editingMode" class="d-flex align-self-center">
              <div class="mt-5">
                <div>
                  <button
                    class="btn btn-warning"
                    @click="editingMode = !editingMode"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
            <div v-else class="d-flex align-self-end">
              <div class="mt-5">
                <div class="d-flex flex-column">
                  <button
                    class="btn btn-warning"
                    @click="editingMode = !editingMode"
                  >
                    Edit Profile
                  </button>
                  <button
                    class="btn btn-warning btn-sm mt-2"
                    @click="saveChanges()"
                  >
                    Save Changes
                  </button>
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
#banner {
  background-image: url("../assets/img/background.jpeg");
  background-size: 550px;
  background-color: #ffffff;
  height: 10rem;
}

#canvas {
  background-color: transparent;
}

#cards {
  background-color: #e0cdbf;
  border: none;
  box-shadow: 5px 5px 2px #b5b4b3;
}

.nav-item {
  background-color: #e0cdbf;
  border-radius: 5px 5px 0 0;
}

#avatarPlace {
  min-width: 160px;
}
</style>
