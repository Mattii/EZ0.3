import { createRouter, createWebHistory } from "vue-router";
import Home from "./pages/home.js";
import Crop from "./pages/crop.js";


const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Twoje trasy
    { path: "/", component: Home, name: "home"},
    { path: "/katalog/:crop", component: Crop, name:"crop" },
  ],
});

export default router;
