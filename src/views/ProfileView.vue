<script async setup lang="ts">
import { onMounted, ref, watch } from "vue";
import NavBar from "@/components/navigations/NavBar.vue";
import Spinner1 from "@/components/Spinner1.vue";
// import FooterBar from "@/components/navigations/Footer.vue";
import LeftArrow from "@/components/inputs/icons/LeftArrow.vue";
import RightArrow from "@/components/inputs/icons/RightArrow.vue";
import Home from "@/components/Home.vue";
import Books from "@/components/Books.vue";
import Reviews from "@/components/Reviews.vue";
import BookSearchModal from "@/components/modals/BookSearchModal.vue";
import { auth, db, avatarsList } from "@/firebase";
import { doc, DocumentSnapshot, getDoc, updateDoc } from "firebase/firestore";
import { updateProfile, type User } from "firebase/auth";
import router from "@/router";
import { FirebaseError } from "firebase/app";
import { generateFirebaseAuthErrorMessage } from "@/errorHandler";
import { toast } from "vue3-toastify";
import ReadBookListModal from "@/components/modals/ReadBookListModal.vue";

const user = ref<User | null>();
const editingMode = ref<boolean>();
// from db
const isNew = ref<boolean>();
const index = ref<number>(0);
const userDoc = ref<DocumentSnapshot>();
const displayedName = ref<string | undefined>();

const loading = ref<boolean>(false);
const loadingForm = ref<boolean>(false);
const errorMessage = ref<string | undefined>();
const regex: RegExp = new RegExp(/^[a-zA-Z_ ]+$/);

const errorNotification = (error: string) => {
    toast(`${error}`, {
        autoClose: 6000,
        theme: "colored",
        type: "error",
        position: "bottom-right",
    });
};

onMounted(async () => {
    loading.value = true;
    try {
        await auth.authStateReady();
        user.value = auth.currentUser;
        userDoc.value = await getDoc(doc(db, "users", user.value?.uid!));
        isNew.value = await userDoc.value?.data()?.isNew;
        index.value = await userDoc.value?.data()?.AvatarIndex;
        displayedName.value = await userDoc.value?.data()?.Name;
        if (isNew.value) {
            router.push("/user-creation");
        }
    } catch (error) {
        console.log(error);
    }
    loading.value = false;
});

// EDITING PART. Galery, Might be a better solution.
watch(index, () => {
    if (index.value === -1) {
        index.value = 49;
    } else if (index.value === 50) {
        index.value = 0;
    }
});

async function saveChanges() {
    loadingForm.value = true;
    try {
        if (user.value && displayedName.value) {
            if (!displayedName.value.match(regex)) {
                errorMessage.value = generateFirebaseAuthErrorMessage(
                    "displayed-name-regex"
                );
                errorNotification(errorMessage.value);
            } else {
                await updateProfile(user.value, {
                    displayName: displayedName.value,
                    photoURL: avatarsList[index.value],
                });
                await updateDoc(doc(db, "users", user.value.uid), {
                    Name: displayedName.value,
                    AvatarIndex: index.value,
                    isNew: false,
                    updated: new Date().toUTCString(),
                });
                router.push("/");
                editingMode.value = !editingMode.value;
            }
            loadingForm.value = false;
        } else {
            errorMessage.value = generateFirebaseAuthErrorMessage(
                "displayed-name-left-empty"
            );
            errorNotification(errorMessage.value);
        }
        loadingForm.value = false;
    } catch (error) {
        if (error instanceof FirebaseError) {
            errorMessage.value = generateFirebaseAuthErrorMessage(error.code);
            errorNotification(errorMessage.value);
        }
    }
}

/* TODO:
 * add favourite book from Read books list
 * Write a review for a book from Read books lists
 * If added to read, add pages to the xp, xp devided by 1000 is the level.
 * Reward.ts handling the level up (if xp > 1000 => lvl1, 2000 => lvl2). Add revards to the used document subdocs achievements, titles, avatars?
 * MAIN PART DONE
 *
 * Anonymous user profile viewing by id of the user. Pref username.
 * user Email validation
 * Avatar picture component.
 */
</script>

<template>
    <ReadBookListModal v-if="user" />
    <BookSearchModal />
    <div class="main">
        <div id="banner">
            <NavBar />
            <div v-if="loading" class="mt-5">
                <div style="height: 40vh"></div>
                <Spinner1 />
            </div>
            <div v-else id="main" class="container">
                <div class="row g-5">
                    <!-- Fist Section -->
                    <div class="col-12" style="min-height: 180px">
                        <div class="d-flex justify-content-evenly">
                            <div class="d-flex justify-content-center">
                                <div id="avatarPlace">
                                    <div v-if="editingMode">
                                        <div
                                            class="d-flex justify-content-center"
                                        >
                                            <img
                                                :src="avatarsList[index]"
                                                class="rounded-circle border border-light"
                                                style="
                                                    width: 7.5rem;
                                                    height: 7.5rem;
                                                "
                                                alt="Avatar"
                                            />
                                        </div>
                                        <div
                                            class="d-flex justify-content-center mt-2"
                                        >
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
                                <div
                                    v-if="editingMode"
                                    class="mb-2 justify-content-center"
                                >
                                    <div>
                                        <input
                                            v-model="displayedName"
                                            type="text"
                                            class="form-control form-control-lg"
                                            placeholder="Displayed Name"
                                        />
                                    </div>
                                    <div class="d-flex justify-content-center">
                                        <span class="fs-4">Novice</span>
                                    </div>
                                </div>
                                <div v-else class="mb-2 justify-content-center">
                                    <div>
                                        <span
                                            v-if="user?.displayName"
                                            class="fs-2"
                                            >{{ user?.displayName }}</span
                                        >
                                        <span v-else class="fs-2">Guest</span>
                                    </div>
                                    <div class="d-flex justify-content-center">
                                        <span class="fs-4">Novice</span>
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
                                        <div
                                            class="progress border border-dark mt-1"
                                        >
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
                            <div class="d-flex align-self-end">
                                <div class="mt-5">
                                    <div class="d-flex flex-column">
                                        <div>
                                            <div v-if="loadingForm">
                                                <Spinner1 />
                                            </div>
                                            <button
                                                v-if="
                                                    editingMode && !loadingForm
                                                "
                                                class="btn btn-warning btn-sm mt-2"
                                                @click="saveChanges()"
                                            >
                                                Save Changes
                                            </button>
                                        </div>
                                        <button
                                            class="btn btn-warning mt-3"
                                            @click="editingMode = !editingMode"
                                        >
                                            Edit Profile
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr class="mt-4" />
                        <div class="d-flex justify-content-center">
                            <ul
                                class="nav nav-pills mb-3 gap-3"
                                id="pills-tab"
                                role="tablist"
                            >
                                <li class="nav-item" role="presentation">
                                    <button
                                        class="btn btn-outline-warning active"
                                        id="pills-home-tab"
                                        data-bs-toggle="pill"
                                        data-bs-target="#pills-home"
                                        type="button"
                                        role="tab"
                                        aria-controls="pills-home"
                                        aria-selected="true"
                                    >
                                        Home
                                    </button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button
                                        class="btn btn-outline-warning"
                                        id="pills-books-tab"
                                        data-bs-toggle="pill"
                                        data-bs-target="#pills-books"
                                        type="button"
                                        role="tab"
                                        aria-controls="pills-books"
                                        aria-selected="false"
                                    >
                                        Books
                                    </button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button
                                        class="btn btn-outline-warning"
                                        id="pills-reviews-tab"
                                        data-bs-toggle="pill"
                                        data-bs-target="#pills-reviews"
                                        type="button"
                                        role="tab"
                                        aria-controls="pills-reviews"
                                        aria-selected="false"
                                    >
                                        Reviews
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="tab-content" id="pills-tabContent">
                        <div
                            class="tab-pane fade show active"
                            id="pills-home"
                            role="tabpanel"
                            aria-labelledby="pills-home-tab"
                            tabindex="0"
                        >
                            <div class="d-flex justify-content-center mb-5">
                                <Home v-if="user" />
                            </div>
                        </div>
                        <div
                            class="tab-pane fade"
                            id="pills-books"
                            role="tabpanel"
                            aria-labelledby="pills-books-tab"
                            tabindex="0"
                        >
                            <div class="d-flex justify-content-center mb-5">
                                <Books v-if="user" />
                            </div>
                        </div>
                        <div
                            class="tab-pane fade"
                            id="pills-reviews"
                            role="tabpanel"
                            aria-labelledby="pills-reviews-tab"
                            tabindex="0"
                        >
                            <div class="d-flex justify-content-center mb-5">
                                <Reviews v-if="user" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- <FooterBar v-if="!loading" /> -->
        </div>
    </div>
</template>

<style>
html {
    scrollbar-gutter: stable;
}

.main {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    /* might be bad */
}

#banner {
    background-image: url("../assets/img/background.jpeg");
    background-size: 550px;
    background-color: #ffffff;
    height: 10rem;
}

#cards {
    background-color: #e0cdbf;
    border: none;
    box-shadow: 5px 5px 2px #b5b4b3;
}

#avatarPlace {
    min-width: 160px;
}
</style>
