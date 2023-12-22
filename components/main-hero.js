import { ref, computed, onMounted } from "vue";
const heroElement = {
  template: `
        <v-sheet
          rounded="xl"
          color="#61cb6f"
          width="100%"
          class="v-theme--dark my-4 overflow-hidden"
        >
        <v-row no-gutters justify="space-around">
          <v-col cols="12">
          <v-img
          rounded="xl"
            cover
            width="100%"
            src="https://res.cloudinary.com/ddkef5waq/image/upload/v1700138246/enzapp/hero1440_kchrpx.png"
          >
            <template #sources>
              <source media="(max-width: 460px)" srcset="https://res.cloudinary.com/ddkef5waq/image/upload/v1700049491/enzapp/heroXS_yplnho.png">
              <source media="(max-width: 690px)" srcset="https://res.cloudinary.com/ddkef5waq/image/upload/v1700135865/enzapp/hero600_thyykd.png">
              <source media="(max-width: 800px)" srcset="https://res.cloudinary.com/ddkef5waq/image/upload/v1700136988/enzapp/hero800_ifozsn.png">
            </template>
          <div class="px-9 pt-9 pb-6 h-100 py-sm-10 pa-lg-16 ff-nunito d-flex flex-wrap">
            <h2 class="text-h4 text-md-h3 text-lg-h2 mb-3 ff-nunito">Sięgnij po </h2>
            <div class="align-self-end d-flex justify-end w-100">
            <v-btn to="/katalog" size="large" elevation="8" class="ff-nunito" rounded="pill"  color="secondary"
            >Katalog</v-btn>
            </div>
          </div>
          </v-img>
          </v-col>
        </v-row>
        </v-sheet>
  `,
  props: {
    lazySrc: {
      type: String,
      reqired: false,
      default:
        "https://res.cloudinary.com/ddkef5waq/image/upload/v1684482332/enzapp/hero_kmw5p3.jpg",
    },
    title: {
      type: String,
      reqired: false,
      default: "Sięgnij po swój",
    },
    subtitle: {
      type: String,
      reqired: false,
      default: "najlepsze nasiona na wyciągnięcie ręki",
    },
  },
  setup() {},
};
export default heroElement;
