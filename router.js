import { createRouter, createWebHistory } from "vue-router";
import Home from "./pages/home.js";
import { useStore } from 'vuex';
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

const auth = getAuth();

const isAuth = () => auth.currentUser;

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
          path: 'sample',
          name: "sample",
          component: () => import(''),
        },
      ]
    },
    {
      // Stock will be rendered inside User's <router-view>
      // when /tablica/stock is matched
      path: '/komercja',
      name: "komercja",
      component: () => import("./pages/stock.js"),
      beforeEnter: (to, from, next) => {
        if ( !isAuth() ) next({ name: 'logowanie' })
        else next()
      },
    },   
    {
      // Stock will be rendered inside User's <router-view>
      // when /tablica/stock is matched
      path: '/proby',
      name: "proby",
      component: () => import("./pages/sample.js"),      
      beforeEnter: (to, from, next) => {
        if ( !isAuth() ) next({ name: 'logowanie' })
        else next()
      },
    },
    {
      path: "/katalog/:family",
      component: () => import("./pages/family.js"),
      name: "family",
      props: true,
      
    },
    {
      path: "/katalog/odmiana/:name",
      component: () => import("./pages/crop.js"),
      name: "crop",
      props: true,
      
    },
    {
      path: "/update",
      component: () => import("./pages/update.js"),
      name: "update",
      props: false,      
      beforeEnter: (to, from, next) => {
        if ( !isAuth() ) next({ name: 'logowanie' })
        else next()
      },
    },
    {
      path: "/logowanie",
      component: () => import("./pages/login.js"),
      name: "logowanie",
      props: false,
      
    },
  ],
});

export default router;
