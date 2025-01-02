import { toast } from "vue3-toastify";

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
        case 1:
            break;

        case 2:
            toast(`You unlocked a new Title and an Achievement!`, {
                autoClose: 5000,
                type: "success",
                theme: "light",
                position: "top-left",
            });
            break;

        case 5:
            toast(`You unlocked a new Title and an Achievement!`, {
                autoClose: 5000,
                type: "success",
                theme: "light",
                position: "top-left",
            });
            break;

        case 10:
            toast(`You unlocked a new Title and an Achievement!`, {
                autoClose: 5000,
                type: "success",
                theme: "light",
                position: "top-left",
            });
            break;

        case 50:
            toast(`You unlocked a new Title and an Achievement!`, {
                autoClose: 5000,
                type: "success",
                theme: "light",
                position: "top-left",
            });
            break;
    }
}
