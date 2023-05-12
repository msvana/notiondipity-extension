import App from "./components/app.vue";
import Home from "./Home.vue";
import Login from "./components/login.vue";
import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
    { path: "/", component: Home, name: "home" },
    { path: "/login", component: Login, name: "login" },
];

const router = createRouter({ routes, history: createWebHashHistory("index.html") });

const app = createApp(App);
app.use(router);
app.mount("#app");
