import { createRouter, createWebHistory } from "vue-router";
import Home from "./pages/home.js";
import Crop from "./pages/crop.js";


const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Twoje trasy
    { path: "/", component: Home },
    { path: "/crop/:id", component: Crop },
  ],
});

export default router;
