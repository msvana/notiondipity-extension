import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import environment from "vite-plugin-environment";
import webExtension from "vite-plugin-web-extension";

export default defineConfig({
    plugins: [
        vue(),
        webExtension({
            browser: process.env.TARGET || "chrome",
            scriptViteConfig: { mode: process.env.MODE, build: { minify: false } },
            htmlViteConfig: { mode: process.env.MODE, build: { minify: false } },
        }),
        environment("all"),
    ],
    // base: "/dist/",
});
