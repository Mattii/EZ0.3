import { createApp, computed, ref, reactive, onMounted, provide } from "vue";
import { useRoute, useRouter } from "vue-router";
import { createStore } from 'vuex';
import { createVuetify } from "vuetify";
import vuexStore from "./modules/vuex.js"
import mainVareityCard from "./components/main-vareity-card.js";
import familyHeroElement from "./components/family-hero-element.js";
import mainHero from "./components/main-hero.js";
import priceHero from "./components/price-hero.js";
import heroElement from "./components/hero-element.js";
import catalogHero from "./components/catalog-hero.js";
import router from "./router.js";
import stockInput from "./components/stock-input.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

const vuetify = createVuetify({
  theme: {
    themes: {
      light: {
        colors: {
          primary: '#61cb6f',
          secondary: '#9b91f9'
        }
      },
    },
  },
});

const store = createStore(vuexStore)

const app = createApp({
  setup() {
    const loaded = ref(false)
    const compayName = ref("ENZApp");
    const icons = ref([
      "mdi-facebook",
      "mdi-twitter",
      "mdi-linkedin",
      "mdi-instagram",
    ]);
    const drawer = ref(false)
    provide("drawer", drawer )
    // fetch("/katalog-export.json")
    //   .then((res) => res.json())
    //   .then((data) => {
    //     for (let d in data) {
    //       data[d].family = data[d].crop
    //     }
    //     return data;
    //   })
    //   .then((changed) => JSON.stringify(changed));

    const router = useRouter();

    const auth = getAuth();
    const logedInUser = computed(()=> store.getters.getUserFromStore);
    const logOut = () => {
      signOut(auth).then(() => {
        // Sign-out successful.
        
        store.dispatch('insertUserToStore', null)
        console.log("Wylogowano");
        router.push('/')
      }).catch((error) => {
        // An error happened.
        console.log("Ooooppsi nie wylogowano");
      });
    }

    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        
        store.dispatch('insertUserToStore', user)
        // ...
      } else {
        // User is signed out
        // ...
        
        store.dispatch('insertUserToStore', null)
        console.log("Wylogowany");
      }
    });

    onMounted(async () => {
      let katalog = localStorage.getItem('katalog');

      if(!Array.isArray(JSON.parse(katalog))){
        localStorage.removeItem("katalog")
        const db = getDatabase(app);


        const katalog = fref(db, "katalog");
        onValue(katalog, (snapshot) => {
          store.dispatch('insertKatalogToStore', snapshot.val())
          crops.value = snapshot.val();
        });
      }
      
    });

    return {
      compayName,
      icons,
      loaded,
      drawer,
      logedInUser,
      logOut
    };
  },
});


app.use(router);
app.use(store);
app.use(vuetify);
app.component("main-vareity-card", mainVareityCard);
app.component("family-hero-element", familyHeroElement);
app.component("main-hero", mainHero);
app.component("hero-element", heroElement);
app.component("stock-input", stockInput);
app.component("price-hero", priceHero);
app.component("catalog-hero", catalogHero);
app.mount("#app");
