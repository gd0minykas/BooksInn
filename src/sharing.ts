import {
    deleteDoc,
    doc,
    getDoc,
    serverTimestamp,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import { db, auth } from "./firebase";
import type { User } from "firebase/auth";
import { ref } from "vue";
import { toast } from "vue3-toastify";
import { levelUp } from "./rewards";

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

export interface Achievement {
    id: string;
    iconUrl: string;
    title: string;
}

export interface reviewBook {
    id: string;
    title: string;
    authors: string[];
    review?: string;
    imgSrc?: string;
    imgSrcSmall?: string;
    rating?: number;
}

export interface favBook {
    title: string;
    authors: string[];
    categories: string[];
    pages: number;
    imgSrc?: string;
    imgSrcSmall?: string;
}

export interface book {
    id: string;
    title: string;
    authors: string[];
    categories: string[];
    pages: number;
    currentCategory: string;
    imgSrc?: string;
    imgSrcSmall?: string;
}

export interface newBook {
    id: string;
    title: string;
    authors: string[];
    categories: string[];
    pages: number;
    imgSrc?: string;
    imgSrcSmall?: string;
}

export async function addAchievement(slot: number, achiement: Achievement) {
    const user = ref<User | null>(auth.currentUser);
    if (user.value) {
        try {
            switch (slot) {
                case 1:
                    await updateDoc(doc(db, "users", user.value.uid), {
                        achievementSlot1: achiement,
                        updated: serverTimestamp(),
                    });
                    break;

                case 2:
                    await updateDoc(doc(db, "users", user.value.uid), {
                        achievementSlot2: achiement,
                        updated: serverTimestamp(),
                    });
                    break;

                case 3:
                    await updateDoc(doc(db, "users", user.value.uid), {
                        achievementSlot3: achiement,
                        updated: serverTimestamp(),
                    });
                    break;
            }
        } catch (error) {
            console.log(error);
        }
    }
}

export async function removeReview(book: reviewBook) {
    const user = ref<User | null>(auth.currentUser);
    if (user.value) {
        try {
            await deleteDoc(
                doc(db, `users/${auth.currentUser?.uid}/reviews`, book.id)
            );
            toast(`${book.title} Book Review was deleted successfully!`, {
                autoClose: 3000,
                type: "success",
                theme: "colored",
            });
        } catch (error) {
            console.log(error);
        }
    }
}

export async function addReview(data: reviewBook) {
    const user = ref<User | null>(auth.currentUser);
    if (user.value) {
        try {
            const docRef = doc(db, "users", user.value.uid, "reviews", data.id);
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) {
                await setDoc(docRef, {
                    title: data.title,
                    authors: data.authors,
                    imgSrc: data.imgSrc ? data.imgSrc : null,
                    imgSrcSmall: data.imgSrcSmall ? data.imgSrcSmall : null,
                    review: data.review ? data.review : "",
                    rating: data.rating ? data.rating : 0,
                    added: serverTimestamp(),
                });
                toast(`Review of ${data.title} was added successfully!`, {
                    autoClose: 3000,
                    type: "success",
                    theme: "colored",
                });
                return 1;
            } else {
                toast(`This book already has a review`, {
                    autoClose: 3000,
                    type: "info",
                    theme: "colored",
                });
                return 0;
            }
        } catch (error) {
            console.log(error);
        }
    } else {
        console.log(user.value);
    }
}

export async function removeFavBook() {
    const user = ref<User | null>(auth.currentUser);
    if (user.value) {
        try {
            await updateDoc(doc(db, "users", user.value.uid), {
                favBook: null,
                updated: serverTimestamp(),
            });
        } catch (error) {
            console.log(error);
        }
    }
}

export async function addFavBook(book: favBook) {
    const user = ref<User | null>(auth.currentUser);
    if (user.value) {
        try {
            await updateDoc(doc(db, "users", user.value.uid), {
                favBook: {
                    title: book.title,
                    authors: book.authors,
                    categories: book.categories,
                    pages: book.pages,
                    imgSrc: book.imgSrc,
                    imgSrcSmall: book.imgSrcSmall,
                },
                updated: serverTimestamp(),
            });
        } catch (error) {
            console.log(error);
        }
    }
}

export async function addBook(data: book, category: string) {
    const user = ref<User | null>(auth.currentUser);
    const prettyCategory: string | undefined = getPrettyCategory(category);
    if (user.value) {
        try {
            const docRef = doc(db, "users", user.value.uid, category, data.id);
            const userDocRef = doc(db, "users", user.value.uid);
            const userDocSnap = await getDoc(userDocRef);
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) {
                await setDoc(docRef, {
                    title: data.title,
                    authors: data.authors,
                    categories: data.categories,
                    pages: data.pages,
                    imgSrc: data.imgSrc ? data.imgSrc : null,
                    imgSrcSmall: data.imgSrcSmall ? data.imgSrcSmall : null,
                    currentCategory: category,
                    added: serverTimestamp(),
                });
                toast(
                    `${data.title} was added to ${prettyCategory} category successfully!`,
                    {
                        autoClose: 3000,
                        type: "success",
                        theme: "colored",
                    }
                );

                if (category == "read") {
                    try {
                        let expPrevious: number = userDocSnap?.data()?.Exp;
                        let expCurrent: number = expPrevious + data.pages;
                        await updateDoc(userDocRef, {
                            Exp: expCurrent,
                            updated: serverTimestamp(),
                        });
                        // IF GOES OVER k THEN CALL Level Up()
                        if (
                            Math.floor(expPrevious / 1000) <
                            Math.floor(expCurrent / 1000)
                        ) {
                            expPrevious = expCurrent;
                            await levelUp(Math.floor(expCurrent / 1000));
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }

                return 1;
            } else {
                toast(
                    `This book already exists on ${prettyCategory} category`,
                    {
                        autoClose: 3000,
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
