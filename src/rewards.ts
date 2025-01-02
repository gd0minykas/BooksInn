import { toast } from "vue3-toastify";
import { achievementsIconsList, auth, db } from "./firebase";
import type { User } from "firebase/auth";
import { ref } from "vue";
import {
    doc,
    getDoc,
    serverTimestamp,
    setDoc,
    updateDoc,
} from "firebase/firestore";

export async function levelUp(level: number) {
    if (level > 1) {
        toast(`Congratulations! You have reached level ${level}!`, {
            autoClose: 5000,
            type: "success",
            theme: "light",
            position: "top-left",
        });
    }

    switch (level) {
        // Novice title and new member achievement
        case 1: {
            let levelString: string = level.toString();
            const user = ref<User | null>(auth.currentUser);
            if (user.value) {
                try {
                    const docTitlesRef = doc(
                        db,
                        "users",
                        user.value.uid,
                        "titles",
                        levelString
                    );
                    const docAchievRef = doc(
                        db,
                        "users",
                        user.value.uid,
                        "achievements",
                        levelString
                    );
                    const userDocRef = doc(db, "users", user.value.uid);
                    const docTitlesSnap = await getDoc(docTitlesRef);
                    const docAchievSnap = await getDoc(docAchievRef);
                    if (!docAchievSnap.exists() && !docTitlesSnap.exists()) {
                        await setDoc(docTitlesRef, {
                            title: "Novice",
                            added: serverTimestamp(),
                        });
                        await setDoc(docAchievRef, {
                            title: "Reached Level 1",
                            IconUrl: achievementsIconsList[0],
                            added: serverTimestamp(),
                        });
                        await updateDoc(userDocRef, {
                            CurrentTitle: "Novice",
                            updated: serverTimestamp(),
                        });
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            break;
        }

        case 2: {
            let levelString: string = level.toString();
            const user = ref<User | null>(auth.currentUser);
            if (user.value) {
                try {
                    const docTitlesRef = doc(
                        db,
                        "users",
                        user.value.uid,
                        "titles",
                        levelString
                    );
                    const docAchievRef = doc(
                        db,
                        "users",
                        user.value.uid,
                        "achievements",
                        levelString
                    );
                    const docTitlesSnap = await getDoc(docTitlesRef);
                    const docAchievSnap = await getDoc(docAchievRef);
                    if (!docAchievSnap.exists() && !docTitlesSnap.exists()) {
                        await setDoc(docTitlesRef, {
                            title: "Apprentice",
                            added: serverTimestamp(),
                        });
                        await setDoc(docAchievRef, {
                            title: "Reached Level 2",
                            IconUrl: achievementsIconsList[1],
                            added: serverTimestamp(),
                        });
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            toast(`You unlocked a new Title and an Achievement!`, {
                autoClose: 5000,
                type: "success",
                theme: "light",
                position: "top-left",
            });
            break;
        }

        case 5: {
            let levelString: string = level.toString();
            const user = ref<User | null>(auth.currentUser);
            if (user.value) {
                try {
                    const docTitlesRef = doc(
                        db,
                        "users",
                        user.value.uid,
                        "titles",
                        levelString
                    );
                    const docAchievRef = doc(
                        db,
                        "users",
                        user.value.uid,
                        "achievements",
                        levelString
                    );
                    const docTitlesSnap = await getDoc(docTitlesRef);
                    const docAchievSnap = await getDoc(docAchievRef);
                    if (!docAchievSnap.exists() && !docTitlesSnap.exists()) {
                        await setDoc(docTitlesRef, {
                            title: "Novice",
                            added: serverTimestamp(),
                        });
                        await setDoc(docAchievRef, {
                            title: "Reached Level 5",
                            IconUrl: achievementsIconsList[2],
                            added: serverTimestamp(),
                        });
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            toast(`You unlocked a new Title and an Achievement!`, {
                autoClose: 5000,
                type: "success",
                theme: "light",
                position: "top-left",
            });
            break;
        }

        case 10: {
            let levelString: string = level.toString();
            const user = ref<User | null>(auth.currentUser);
            if (user.value) {
                try {
                    const docTitlesRef = doc(
                        db,
                        "users",
                        user.value.uid,
                        "titles",
                        levelString
                    );
                    const docAchievRef = doc(
                        db,
                        "users",
                        user.value.uid,
                        "achievements",
                        levelString
                    );
                    const docTitlesSnap = await getDoc(docTitlesRef);
                    const docAchievSnap = await getDoc(docAchievRef);
                    if (!docAchievSnap.exists() && !docTitlesSnap.exists()) {
                        await setDoc(docTitlesRef, {
                            title: "The Knowladgeble",
                            added: serverTimestamp(),
                        });
                        await setDoc(docAchievRef, {
                            title: "Reached Level 10",
                            IconUrl: achievementsIconsList[3],
                            added: serverTimestamp(),
                        });
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            toast(`You unlocked a new Title and an Achievement!`, {
                autoClose: 5000,
                type: "success",
                theme: "light",
                position: "top-left",
            });
            break;
        }

        case 50: {
            let levelString: string = level.toString();
            const user = ref<User | null>(auth.currentUser);
            if (user.value) {
                try {
                    const docTitlesRef = doc(
                        db,
                        "users",
                        user.value.uid,
                        "titles",
                        levelString
                    );
                    const docAchievRef = doc(
                        db,
                        "users",
                        user.value.uid,
                        "achievements",
                        levelString
                    );
                    const docTitlesSnap = await getDoc(docTitlesRef);
                    const docAchievSnap = await getDoc(docAchievRef);
                    if (!docAchievSnap.exists() && !docTitlesSnap.exists()) {
                        await setDoc(docTitlesRef, {
                            title: "Dungeon Master",
                            added: serverTimestamp(),
                        });
                        await setDoc(docAchievRef, {
                            title: "Reached Level 50",
                            IconUrl: achievementsIconsList[4],
                            added: serverTimestamp(),
                        });
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            toast(`You unlocked a new Title and an Achievement!`, {
                autoClose: 5000,
                type: "success",
                theme: "light",
                position: "top-left",
            });
            break;
        }
    }
}
