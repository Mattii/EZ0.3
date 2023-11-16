import { createApp, ref, reactive, onMounted } from "vue";
import { createVuetify } from "vuetify";
import vareityCard from "./components/vareity-card.js";
import heroElement from "./components/hero-element.js";
import mainHero from "./components/main-hero.js";
import priceHero from "./components/price-hero.js";
import router from "./router.js";
import stockInput from "./components/stock-input.js";

const vuetify = createVuetify({
  theme: {
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#68C079',
          secondary: '#9496C2'
        }
      },
    },
  },
});

const app = createApp({
  setup() {
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
    };
  },
});


app.use(router);
app.use(vuetify);
app.component("vareity-card", vareityCard);
app.component("hero-element", heroElement);
app.component("main-hero", mainHero);
app.component("stock-input", stockInput);
app.component("price-hero", priceHero);
app.mount("#app");
