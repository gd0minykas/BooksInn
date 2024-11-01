import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import Vue3Toastify, { type ToastContainerOptions } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

const app = createApp(App);

app.use(router).use(Vue3Toastify, {
  autoClose: 3000,
} as ToastContainerOptions);

app.mount("#app");
