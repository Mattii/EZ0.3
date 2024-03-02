import { createRouter, createWebHistory } from "vue-router";
import Home from "./pages/home.js";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Twoje trasy
    { path: "/", component: Home, name: "home" },
    {
      path: "/katalog",
      component: () => import("./pages/katalog.js"),
      name: "katalog",
    },
    {
      path: "/cennik",
      component: () => import("./pages/cennik.js"),
      name: "cennik",
    },
    {
      path: "/tablica",
      component: () => import("./pages/tablica.js"),
      name: "tablica",
      children: [
        {
          // Stock will be rendered inside User's <router-view>
          // when /tablica/stock is matched
          path: 'komercja',
          name: "komercja",
          component: () => import("./pages/stock.js"),
        },        
        {
          // Stock will be rendered inside User's <router-view>
          // when /tablica/stock is matched
          path: 'sample',
          name: "sample",
          component: () => import("./pages/sample.js"),
        },
      ]
    },
    {
      path: "/katalog/:family",
      component: () => import("./pages/family.js"),
      name: "family",
      props: true,
      
    },
  ],
});

export default router;
