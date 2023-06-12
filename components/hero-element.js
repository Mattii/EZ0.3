import { ref, computed, onMounted } from "vue";
const heroElement = {
  template: `
        <v-sheet
          rounded
          :color="color"
          width="100%"
          class="pt-3 v-theme--dark"
        >
        <v-row no-gutters justify="space-around">
          <v-col cols="12" sm="7">
          <v-img
            width="100%"
            :src="{ src: src, lazySrc: lazySrc, aspect: '16/9' }"
          >
          </v-img>
          </v-col>
          <v-col cols="12" sm="5" md="4" order-sm="first" align-self="center">
          <div class="px-6 py-3 ff-crete-round">
            <h2 class="text-h5 text-md-h3 mb-3 ff-crete-round">{{title}}</h2>
            <p class="mb-5 text-body-2">{{subtitle}}</p>
            <slot></slot>
          </div>
          </v-col>
        </v-row>
        </v-sheet>
  `,
  props: {
    color: {
      type: String,
      reqired: false,
      default: "#608634",
    },
    src: {
      type: String,
      reqired: false,
      default:
        "https://res.cloudinary.com/ddkef5waq/image/upload/v1684482332/enzapp/hero_kmw5p3.jpg",
    },
    lazySrc: {
      type: String,
      reqired: false,
      default:
        "https://res.cloudinary.com/ddkef5waq/image/upload/v1684482332/enzapp/hero_kmw5p3.jpg",
    },
    title: {
      type: String,
      reqired: false,
      default: "Twój Katalog",
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
