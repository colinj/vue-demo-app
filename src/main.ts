import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "@/App.vue";
import router from "@/router";

import "@/assets/main.css";
import "@/scss/main.scss";
import { initApiServices } from "@/api/_http";

initApiServices("default", "https://jsonplaceholder.typicode.com");

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
