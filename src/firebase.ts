// Import the functions you need from the SDKs you need
import { FirebaseError, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { doc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";
import { getStorage, ref as stRef } from "firebase/storage";
import {
    createUserWithEmailAndPassword,
    getAuth,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithPopup,
    signOut,
    type User,
    type UserCredential,
} from "firebase/auth";
import { ref } from "vue";
import router from "./router";
import { generateFirebaseAuthErrorMessage } from "./errorHandler";
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

const avatarsList: string[] = [
    "https://firebasestorage.googleapis.com/v0/b/booksinn-8888.firebasestorage.app/o/AvatarsWithBG%2F1.png?alt=media&token=68819c91-9844-42ac-9c3b-9a381b926ebf",
    "https://firebasestorage.googleapis.com/v0/b/booksinn-8888.firebasestorage.app/o/AvatarsWithBG%2F2.png?alt=media&token=226ec2b9-b58d-48d7-943b-bb5799ed72f1",
    "https://firebasestorage.googleapis.com/v0/b/booksinn-8888.firebasestorage.app/o/AvatarsWithBG%2F3.png?alt=media&token=8bf125ba-4458-482f-b6b3-23b4ac01d82c",
    "https://firebasestorage.googleapis.com/v0/b/booksinn-8888.firebasestorage.app/o/AvatarsWithBG%2F4.png?alt=media&token=ffeb73e8-478f-4eca-a79d-e694325488ce",
    "https://firebasestorage.googleapis.com/v0/b/booksinn-8888.firebasestorage.app/o/AvatarsWithBG%2F5.png?alt=media&token=5e10e4b1-b3e3-486c-8f4a-64e24800d3e4",
    "https://firebasestorage.googleapis.com/v0/b/booksinn-8888.firebasestorage.app/o/AvatarsWithBG%2F6.png?alt=media&token=c24a62b2-931b-4cad-9189-dce43b59ef81",
    "https://firebasestorage.googleapis.com/v0/b/booksinn-8888.firebasestorage.app/o/AvatarsWithBG%2F7.png?alt=media&token=9461f6a9-500f-4e6e-a881-abc40e247d6e",
    "https://firebasestorage.googleapis.com/v0/b/booksinn-8888.firebasestorage.app/o/AvatarsWithBG%2F8.png?alt=media&token=7f484043-0df5-46fa-b09e-97d4cead3f7f",
    "https://firebasestorage.googleapis.com/v0/b/booksinn-8888.firebasestorage.app/o/AvatarsWithBG%2F9.png?alt=media&token=f97266fb-5201-4f3b-91ad-44be087b80c4",
    "https://firebasestorage.googleapis.com/v0/b/booksinn-8888.firebasestorage.app/o/AvatarsWithBG%2F10.png?alt=media&token=cf594182-1541-4651-aa90-3d9130dad372",
    "https://firebasestorage.googleapis.com/v0/b/booksinn-8888.firebasestorage.app/o/AvatarsWithBG%2F11.png?alt=media&token=069570cc-693b-4750-9e8a-ccb930c3980c",
    "https://firebasestorage.googleapis.com/v0/b/booksinn-8888.firebasestorage.app/o/AvatarsWithBG%2F12.png?alt=media&token=041d390e-efc2-493a-b738-e84336aeefb7",
    "https://firebasestorage.googleapis.com/v0/b/booksinn-8888.firebasestorage.app/o/AvatarsWithBG%2F13.png?alt=media&token=7cd06840-8e09-43ed-b9a2-a7654e4c160c",
    "https://firebasestorage.googleapis.com/v0/b/booksinn-8888.firebasestorage.app/o/AvatarsWithBG%2F14.png?alt=media&token=a97dc4f9-03a6-47a0-bcd9-8691012e9f07",
    "https://firebasestorage.googleapis.com/v0/b/booksinn-8888.firebasestorage.app/o/AvatarsWithBG%2F15.png?alt=media&token=8db8f7f6-5c4a-42c2-9110-a33cbb7ed4d3",
    "https://firebasestorage.googleapis.com/v0/b/booksinn-8888.firebasestorage.app/o/AvatarsWithBG%2F16.png?alt=media&token=2f5a7be5-5d62-4687-912e-c446ab395af9",
    "https://firebasestorage.googleapis.com/v0/b/booksinn-8888.firebasestorage.app/o/AvatarsWithBG%2F17.png?alt=media&token=e25ba8ab-6432-499a-a3a5-b26ff4064d13",
    "https://firebasestorage.googleapis.com/v0/b/booksinn-8888.firebasestorage.app/o/AvatarsWithBG%2F18.png?alt=media&token=b2240a5e-4f3e-48c5-80f6-8e748dda25dd",
    "https://firebasestorage.googleapis.com/v0/b/booksinn-8888.firebasestorage.app/o/AvatarsWithBG%2F19.png?alt=media&token=9d60b62e-d14f-4e78-ba3e-b024e5e7f0e1",
    "https://firebasestorage.googleapis.com/v0/b/booksinn-8888.firebasestorage.app/o/AvatarsWithBG%2F20.png?alt=media&token=ab50a289-e84a-4e47-878e-017863c689db",
    "https://firebasestorage.googleapis.com/v0/b/booksinn-8888.firebasestorage.app/o/AvatarsWithBG%2F21.png?alt=media&token=1424a74a-e7f6-4786-b949-c8b37dd34819",
    "https://firebasestorage.googleapis.com/v0/b/booksinn-8888.firebasestorage.app/o/AvatarsWithBG%2F22.png?alt=media&token=c79d5fc8-61a7-48db-9694-2ab5c222c468",
    "https://firebasestorage.googleapis.com/v0/b/booksinn-8888.firebasestorage.app/o/AvatarsWithBG%2F23.png?alt=media&token=620127a1-8338-45fd-99f1-d1ea0eb1ba56",
    "https://firebasestorage.googleapis.com/v0/b/booksinn-8888.firebasestorage.app/o/AvatarsWithBG%2F24.png?alt=media&token=efd6ce17-1b00-450e-b931-1c8dac103a5d",
    "https://firebasestorage.googleapis.com/v0/b/booksinn-8888.firebasestorage.app/o/AvatarsWithBG%2F25.png?alt=media&token=2dbbe85f-a023-45f2-951f-b305fc346c10",
    "https://firebasestorage.googleapis.com/v0/b/booksinn-8888.firebasestorage.app/o/AvatarsWithBG%2F26.png?alt=media&token=159bef9b-2244-4ae8-be0a-51bf0769f0b3",
    "https://firebasestorage.googleapis.com/v0/b/booksinn-8888.firebasestorage.app/o/AvatarsWithBG%2F27.png?alt=media&token=e09faade-362c-4cca-819d-fbc09f4049eb",
    "https://firebasestorage.googleapis.com/v0/b/booksinn-8888.firebasestorage.app/o/AvatarsWithBG%2F28.png?alt=media&token=c0e1b966-e0a0-4227-88cf-2d72feebbe23",
    "https://firebasestorage.googleapis.com/v0/b/booksinn-8888.firebasestorage.app/o/AvatarsWithBG%2F29.png?alt=media&token=6dc9c07d-6b24-4dd9-af3e-1013a63788a8",
    "https://firebasestorage.googleapis.com/v0/b/booksinn-8888.firebasestorage.app/o/AvatarsWithBG%2F30.png?alt=media&token=82ea714b-5820-4f24-8a93-521b9a5cd11a",
    "https://firebasestorage.googleapis.com/v0/b/booksinn-8888.firebasestorage.app/o/AvatarsWithBG%2F31.png?alt=media&token=232a136f-0711-458f-81b5-446d94f2e879",
    "https://firebasestorage.googleapis.com/v0/b/booksinn-8888.firebasestorage.app/o/AvatarsWithBG%2F32.png?alt=media&token=c51f2be3-cc59-4167-8cad-5cf4f57de551",
    "https://firebasestorage.googleapis.com/v0/b/booksinn-8888.firebasestorage.app/o/AvatarsWithBG%2F33.png?alt=media&token=6e08c58d-4e85-46b9-ad18-b44c77728962",
    "https://firebasestorage.googleapis.com/v0/b/booksinn-8888.firebasestorage.app/o/AvatarsWithBG%2F34.png?alt=media&token=a39bf945-aa71-4d0d-b96d-c6a7a124c74e",
    "https://firebasestorage.googleapis.com/v0/b/booksinn-8888.firebasestorage.app/o/AvatarsWithBG%2F35.png?alt=media&token=bb42eef5-741e-4c22-b5f9-5bd43111dd56",
    "https://firebasestorage.googleapis.com/v0/b/booksinn-8888.firebasestorage.app/o/AvatarsWithBG%2F36.png?alt=media&token=ed43c83e-830c-498b-a5b6-f77d61189b78",
    "https://firebasestorage.googleapis.com/v0/b/booksinn-8888.firebasestorage.app/o/AvatarsWithBG%2F37.png?alt=media&token=b324e5fd-5b03-4736-8c7e-f10eccd2937c",
    "https://firebasestorage.googleapis.com/v0/b/booksinn-8888.firebasestorage.app/o/AvatarsWithBG%2F38.png?alt=media&token=bcc7213b-4676-4414-bac5-62315168be5c",
    "https://firebasestorage.googleapis.com/v0/b/booksinn-8888.firebasestorage.app/o/AvatarsWithBG%2F39.png?alt=media&token=af97e795-506c-4ca9-bdf9-44d6d9166649",
    "https://firebasestorage.googleapis.com/v0/b/booksinn-8888.firebasestorage.app/o/AvatarsWithBG%2F40.png?alt=media&token=b1b0ebe4-6207-4f9c-86ae-a571ab36d74c",
    "https://firebasestorage.googleapis.com/v0/b/booksinn-8888.firebasestorage.app/o/AvatarsWithBG%2F41.png?alt=media&token=c0194546-3c26-4957-ba71-87c42338bd8a",
    "https://firebasestorage.googleapis.com/v0/b/booksinn-8888.firebasestorage.app/o/AvatarsWithBG%2F42.png?alt=media&token=5213bb0d-e1b2-4598-96b3-248f98ab609e",
    "https://firebasestorage.googleapis.com/v0/b/booksinn-8888.firebasestorage.app/o/AvatarsWithBG%2F43.png?alt=media&token=0aae5414-d45f-46f1-bd5e-ee5d958dc215",
    "https://firebasestorage.googleapis.com/v0/b/booksinn-8888.firebasestorage.app/o/AvatarsWithBG%2F44.png?alt=media&token=a3ba31ba-1263-41a3-bb5d-b191bd211876",
    "https://firebasestorage.googleapis.com/v0/b/booksinn-8888.firebasestorage.app/o/AvatarsWithBG%2F45.png?alt=media&token=c4636d4e-6ad0-4a41-b179-0ab5cb92e683",
    "https://firebasestorage.googleapis.com/v0/b/booksinn-8888.firebasestorage.app/o/AvatarsWithBG%2F46.png?alt=media&token=c964f8f7-a25b-4ee0-b595-1bdebb70a9c0",
    "https://firebasestorage.googleapis.com/v0/b/booksinn-8888.firebasestorage.app/o/AvatarsWithBG%2F47.png?alt=media&token=21661db6-75e5-4e49-828e-a7b07da4c639",
    "https://firebasestorage.googleapis.com/v0/b/booksinn-8888.firebasestorage.app/o/AvatarsWithBG%2F48.png?alt=media&token=bc5b27b4-7085-4ba6-9c1a-a4a73c8bfa72",
    "https://firebasestorage.googleapis.com/v0/b/booksinn-8888.firebasestorage.app/o/AvatarsWithBG%2F49.png?alt=media&token=dd01149f-715b-45f4-a250-7e61fe2bbeb1",
    "https://firebasestorage.googleapis.com/v0/b/booksinn-8888.firebasestorage.app/o/AvatarsWithBG%2F50.png?alt=media&token=28b61c5d-65a7-4527-9ee1-aef6cb4a1994",
];

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage();
const storageRef = stRef(storage);
const user = ref<User | null>(auth.currentUser);
const createdUser = ref<UserCredential | null>();
const createdUserWithProviders = ref<UserCredential | null>();

onAuthStateChanged(auth, (user) => {
    if (user) {
        localStorage.setItem("userIsLogedIn", "true");
        if (router.currentRoute.value.path !== "/user-creation") {
            router.push("/");
        }
    } else {
        if (router.currentRoute.value.path !== "/register") {
            router.push("/login");
        }
    }
});

// Creation of the user on firestore
async function createUserOnDb(userId: string, name: string | null | undefined) {
    await setDoc(doc(db, "users", userId), {
        Name: name,
        Exp: 1000,
        isNew: true,
        created: serverTimestamp(),
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
        auth.currentUser?.displayName
    );
}

export async function signInGoogleUser() {
    createdUserWithProviders.value = await signInWithPopup(auth, provider);
    if (
        createdUserWithProviders.value.user.metadata.creationTime ==
        createdUserWithProviders.value.user.metadata.lastSignInTime
    ) {
        await createUserOnDb(
            createdUserWithProviders.value.user.uid,
            createdUserWithProviders.value.user.displayName
        );
    }
}

export async function signOutUser() {
    try {
        signOut(auth);
        localStorage.removeItem("userIsLogedIn");
    } catch (error) {
        if (error instanceof FirebaseError) {
            console.log(generateFirebaseAuthErrorMessage(error.code));
        }
    }
}

const provider: GoogleAuthProvider = new GoogleAuthProvider();
provider.addScope("email");
auth.useDeviceLanguage();

export { analytics, auth, db, provider, user, storageRef, avatarsList };
