// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  type User,
  type UserCredential,
} from "firebase/auth";
import { ref } from "vue";
import router from "./router";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_APIKEY,
  authDomain: import.meta.env.VITE_APP_AUTHDOMAIN,
  projectId: import.meta.env.VITE_APP_PROJECTID,
  storageBucket: import.meta.env.VITE_APP_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_APP_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_APP_APPID,
  measurementId: import.meta.env.VITE_APP_MEASUREMENTID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const user = ref<User | null>(auth.currentUser);
const createdUser = ref<UserCredential | null>();
const createdUserWithProviders = ref<UserCredential | null>();

onAuthStateChanged(auth, (user) => {
  if (user) {
    localStorage.setItem("userIsLogedIn", "true");
    router.push("/");
  } else {
    if (router.currentRoute.value.path !== "/register") {
      router.push("/login");
    }
  }
});

// Creation of the user on firestore
async function createUserOnDb(
  userId: string,
  name: string | null | undefined,
  creationTime: string | undefined
) {
  await setDoc(doc(db, "users", userId), {
    Name: name,
    Exp: 1,
    isNew: true,
    created: creationTime,
    updated: null,
  });
}

// Sign Ins
export async function createUserWithEmail(email: string, password: string) {
  createdUser.value = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  await createUserOnDb(
    createdUser.value.user.uid,
    auth.currentUser?.displayName,
    createdUser.value.user.metadata.creationTime
  );
}

export async function signInGoogleUser() {
  createdUserWithProviders.value = await signInWithPopup(auth, provider);
  const userDoc = await getDoc(
    doc(db, "users", createdUserWithProviders.value.user.uid)
  );
  if (createdUserWithProviders.value && !userDoc.exists()) {
    await createUserOnDb(
      createdUserWithProviders.value.user.uid,
      auth.currentUser?.displayName,
      createdUserWithProviders.value.user.metadata.creationTime
    );
  }
}

const provider: GoogleAuthProvider = new GoogleAuthProvider();
provider.addScope("email");
auth.useDeviceLanguage();

export { analytics, auth, db, provider, user };
