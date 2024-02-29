import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import App from "./components/app.vue";
import Comparison from "./components/comparison.vue";
import Home from "./components/home.vue";
import IdeasPage from "./components/ideas-page.vue";
import IdeasSaved from "./components/ideas-saved.vue";
import Ideas from "./components/ideas.vue";
import Login from "./components/login.vue";
import Search from "./components/search.vue";

const routes = [
    { path: "/", component: Home, name: "home" },
    { path: "/login", component: Login, name: "login" },
    { path: "/search", component: Search, name: "search" },
    {
        path: "/ideas",
        component: Ideas,
        name: "ideas",
        children: [
            { path: "", redirect: { name: "ideas-page" } },
            { path: "page", component: IdeasPage, name: "ideas-page" },
            { path: "saved", component: IdeasSaved, name: "ideas-saved" },
        ],
    },
    { path: "/comparison/:id", component: Comparison, name: "comparison" },
];

// @ts-ignore
const router = createRouter({
    routes,
    history: createWebHashHistory("index.html"),
    linkActiveClass: "active",
});

// @ts-ignore
const app = createApp(App);

app.use(router);
app.mount("#app");
