import { createApp, ref, reactive, onMounted } from "vue";
import { createVuetify } from "vuetify";
import vareityCard from "./components/vareity-card.js";
import heroElement from "./components/hero-element.js";
import router from "./router.js";

const vuetify = createVuetify();

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
app.mount("#app");
