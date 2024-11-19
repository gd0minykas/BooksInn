<script setup lang="ts">
import NavBar from "@/components/navigations/NavBar.vue";
import Spinner1 from "@/components/Spinner1.vue";
import FooterBar from "@/components/navigations/Footer.vue";
import LeftArrow from "@/components/inputs/icons/LeftArrow.vue";
import RightArrow from "@/components/inputs/icons/RightArrow.vue";
import ErrorMessage from "@/components/inputs/ErrorMessage.vue";
import { auth, db, avatarsList } from "@/firebase";
import { onMounted, ref, watch } from "vue";
import { toast } from "vue3-toastify";
import { FirebaseError } from "firebase/app";
import {
    deleteUser,
    sendEmailVerification,
    updateProfile,
} from "firebase/auth";
import { generateFirebaseAuthErrorMessage } from "@/errorHandler";
import {
    deleteDoc,
    doc,
    DocumentSnapshot,
    getDoc,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";
import router from "@/router";
import DeleteAccountModal from "@/components/modals/DeleteAccountModal.vue";

const displayedName = ref<string | null>();
const email = ref<string | null>();
const joined = ref<string | null>();
const userDoc = ref<DocumentSnapshot>();
const loading = ref<boolean>(false);
const loadingForm = ref<boolean>(false);
const index = ref<number>(0);
const user: any = ref();
const regex: RegExp = new RegExp(/^[a-zA-Z_ ]+$/);
const errorMessage = ref<string | undefined>();
const deleteAccountModalRef = ref();

const advice = () => {
    toast("Hello, Traveler!", {
        autoClose: 3000,
        theme: "colored",
        type: "info",
        position: "top-right",
    });
};

onMounted(async () => {
    loading.value = true;
    try {
        await auth.authStateReady();
        user.value = auth.currentUser;
        displayedName.value = user.value?.displayName;
        joined.value = user.value?.metadata.creationTime;
        email.value = user.value?.email;
        if (user.value) {
            userDoc.value = await getDoc(doc(db, "users", user.value?.uid!));
            if (userDoc.value != undefined) {
                index.value = userDoc.value?.data()?.AvatarIndex;
            }
        }
    } catch (error) {
        console.log(error);
    }
    loading.value = false;
    advice();
});

async function editYourAccount() {
    loadingForm.value = true;
    try {
        if (user.value && displayedName.value) {
            if (!displayedName.value.match(regex)) {
                loadingForm.value = false;
                errorMessage.value = generateFirebaseAuthErrorMessage(
                    "displayed-name-regex"
                );
            } else {
                await updateProfile(user.value, {
                    displayName: displayedName.value,
                    photoURL: avatarsList[index.value],
                });
                await updateDoc(doc(db, "users", user.value.uid), {
                    Name: displayedName.value,
                    AvatarIndex: index.value,
                    isNew: false,
                    updated: serverTimestamp(),
                });
                router.push("/");
            }
        } else {
            loadingForm.value = false;
            errorMessage.value = generateFirebaseAuthErrorMessage(
                "displayed-name-left-empty"
            );
        }
    } catch (error) {
        if (error instanceof FirebaseError) {
            errorMessage.value = generateFirebaseAuthErrorMessage(error.code);
        }
    }

    loadingForm.value = false;
}

async function verifyEmail() {
    console.log("verify");
    if (user.value && email.value) {
        try {
            await sendEmailVerification(user.value);
            toast("Verification link has been sent to your email address!", {
                autoClose: 5000,
                type: "info",
                theme: "colored",
            });
        } catch (error) {
            console.log(error);
        }
    }
}

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
    <DeleteAccountModal ref="deleteAccountModalRef" />
    <NavBar />
    <div v-if="loading">
        <Spinner1 />
    </div>
    <div v-else>
        <div v-if="user && userDoc" class="container">
            <div class="row">
                <div class="col align-self-center">
                    <div>
                        <span class="fs-2">This is your account setup!</span>
                        <p class="fs-5">
                            Thank you for using Books' inn<br />
                            In this page you can choose an Avatar and <br />
                            The Displayed Name of the profile.
                        </p>
                    </div>
                    <div>
                        <span class="fs-3">Account details:</span>
                        <p
                            v-if="user.emailVerified"
                            class="fs-6 text-secondary mb-1"
                        >
                            • {{ email }}
                        </p>
                        <p v-else class="fs-6 text-secondary mb-1">
                            •
                            <a
                                href="#"
                                class="link-dark"
                                title="Press the link to varify email"
                                @click="verifyEmail()"
                                >{{ email }}</a
                            >
                            <span class="fs-6 fst-italic">
                                (Email not varified)
                            </span>
                        </p>
                        <p class="fs-6 text-secondary mb-1">• {{ joined }}</p>
                    </div>
                    <div>
                        <button
                            type="button"
                            class="btn btn-danger mt-5"
                            data-bs-toggle="modal"
                            data-bs-target="#deleteAccountModal"
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
                <div v-if="loadingForm" class="col">
                    <Spinner1 />
                </div>
                <div v-else class="col">
                    <div class="mb-3 d-flex justify-content-center">
                        <div>
                            <img
                                :src="avatarsList[index]"
                                class="rounded-circle border border-dark"
                                style="width: 15rem; height: 15rem"
                                alt="Avatar"
                            />
                        </div>
                    </div>
                    <div class="d-flex justify-content-center">
                        <button
                            type="button"
                            class="btn btn-warning mx-1"
                            @click="() => index--"
                        >
                            <LeftArrow />
                        </button>
                        <button
                            type="button"
                            class="btn btn-warning mx-1"
                            @click="() => index++"
                        >
                            <RightArrow />
                        </button>
                    </div>
                    <hr />
                    <div class="form-floating mb-3">
                        <input
                            v-model="displayedName"
                            type="text"
                            class="form-control"
                            id="displayedName"
                            placeholder="Displayed Name"
                        />
                        <label for="displayedName">Displayed Name</label>
                    </div>
                    <div class="min-h-2" style="min-height: 3em">
                        <ErrorMessage :msg="errorMessage" v-if="errorMessage" />
                    </div>
                    <div class="d-flex justify-content-end">
                        <button
                            type="button"
                            class="btn btn-warning"
                            @click="editYourAccount()"
                        >
                            Finish
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <FooterBar />
</template>
