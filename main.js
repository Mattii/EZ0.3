import { createApp, ref, reactive, onMounted } from "vue";
import { createStore } from 'vuex';
import { createVuetify } from "vuetify";
import vuexStore from "./modules/vuex.js"
import mainVareityCard from "./components/main-vareity-card.js";
import familyHeroElement from "./components/family-hero-element.js";
import mainHero from "./components/main-hero.js";
import priceHero from "./components/price-hero.js";
import catalogHero from "./components/catalog-hero.js";
import router from "./router.js";
import stockInput from "./components/stock-input.js";

const vuetify = createVuetify({
  theme: {
    themes: {
      light: {
        dark: false,
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
    // fetch("/katalog-export.json")
    //   .then((res) => res.json())
    //   .then((data) => {
    //     for (let d in data) {
    //       data[d].family = data[d].crop
    //     }
    //     return data;
    //   })
    //   .then((changed) => JSON.stringify(changed));

    return {
      compayName,
      icons,
      loaded,
    };
  },
});


app.use(router);
app.use(store);
app.use(vuetify);
app.component("main-vareity-card", mainVareityCard);
app.component("family-hero-element", familyHeroElement);
app.component("main-hero", mainHero);
app.component("stock-input", stockInput);
app.component("price-hero", priceHero);
app.component("catalog-hero", catalogHero);
app.mount("#app");
