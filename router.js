import { createRouter, createWebHistory } from "vue-router";
import home from "./pages/home.js";


const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Twoje trasy
    { path: "/", component: home },
    { path: "/about", component: { template: "<div>About</div>" } },
  ],
});

export default router;
