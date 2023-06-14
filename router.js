import { createRouter, createWebHistory } from "vue-router";
import Home from "./pages/home.js";
import Crop from "./pages/crop.js";
import Katalog from "./pages/katalog.js";


const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Twoje trasy
    { path: "/", component: Home, name: "home"},
    { path: "/katalog", component: Katalog, name:"katalog" },
    { path: "/katalog/:crop", component: Crop, name:"crop", props: true },
  ],
});

export default router;
