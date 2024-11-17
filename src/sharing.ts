import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db, auth } from "./firebase";
import type { User } from "firebase/auth";
import { ref } from "vue";
import { toast } from "vue3-toastify";

export function getPrettyCategory(category: string) {
    switch (category) {
        case "read":
            return "Read";

        case "to-read":
            return "To Read";

        case "reading":
            return "Reading";
    }
}

export interface book {
    id: string;
    title: string;
    authors: string[];
    categories: string[];
    pages: number;
    currentCategory: string;
    imgSrc?: string;
}

export interface newBook {
    id: string;
    title: string;
    authors: string[];
    categories: string[];
    pages: number;
    imgSrc?: string;
}

export async function addBook(data: book, category: string) {
    const user = ref<User | null>(auth.currentUser);
    const prettyCategory: string | undefined = getPrettyCategory(category);
    if (user.value) {
        try {
            const docRef = doc(db, "users", user.value.uid, category, data.id);
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) {
                await setDoc(docRef, {
                    title: data.title,
                    authors: data.authors,
                    categories: data.categories,
                    pages: data.pages,
                    imgSrc: data.imgSrc ? data.imgSrc : null,
                    currentCategory: category,
                    added: serverTimestamp(),
                });
                toast(
                    `${data.title} was added to ${prettyCategory} category successfully!`,
                    {
                        autoClose: 5000,
                        type: "success",
                        theme: "colored",
                    }
                );
                return 1;
                /*
                    Add xp if category is read.
                    If level up => call rewards.ts function.
                */
            } else {
                toast(
                    `This book already exists on ${prettyCategory} category`,
                    {
                        autoClose: 5000,
                        type: "info",
                        theme: "colored",
                    }
                );
                return 0;
            }
        } catch (error) {
            console.log(error);
        }
    } else {
        console.log(user.value);
    }
}
