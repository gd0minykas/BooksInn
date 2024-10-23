import LoginView from "@/views/LoginView.vue";
import ProfileCreationView from "@/views/ProfileCreationView.vue";
import ProfileView from "@/views/ProfileView.vue";
import RegisterView from "@/views/RegisterView.vue";
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
      path: "/register",
      name: "Register",
      component: RegisterView,
    },
    {
      path: "/login",
      name: "Login",
      component: LoginView,
    },
    {
      path: "/create",
      name: "Profile Creation",
      component: ProfileCreationView,
    },
  ],
});

export default router;
