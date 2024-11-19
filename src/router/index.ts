import IsNewUserView from "@/views/IsNewUserView.vue";
import LoginView from "@/views/LoginView.vue";
import ProfileView from "@/views/ProfileView.vue";
import RegisterView from "@/views/RegisterView.vue";
import UserAccountView from "@/views/UserAccountView.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "Profile",
            component: ProfileView,
        },
        {
            path: "/user-creation",
            name: "User Creation",
            component: IsNewUserView,
        },
        {
            path: "/user-account",
            name: "User Account",
            component: UserAccountView,
        },
        {
            path: "/register",
            name: "Register",
            component: RegisterView,
        },
        {
            path: "/login",
            name: "Login",
            component: LoginView,
        },
    ],
});

export default router;
