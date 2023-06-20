import { createRouter, createWebHistory } from "vue-router";
import Home from "./pages/home.js";
import Family from "./pages/family.js";
import Katalog from "./pages/katalog.js";


const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Twoje trasy
    { path: "/", component: Home, name: "home"},
    { path: "/katalog", component: Katalog, name:"katalog" },
    { path: "/katalog/:family", component: Family, name:"family", props: true },
  ],
});

export default router;
