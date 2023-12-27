import { ref, computed, onMounted } from "vue";
const heroElement = {
  template: `
        <v-sheet
          rounded="xl"
          :color="color"
          width="100%"
          class="v-theme--dark my-4 overflow-hidden"
        >
        <v-row no-gutters justify="space-around">
          <v-col cols="12">
          <v-img
          rounded="xl"
            cover
            width="100%"
            :src="src"
          >
              <div class="px-9 pt-6 px-sm-16 pt-sm-16 h-100 ff-nunito d-flex flex-wrap justify-end">
                  <h2 class="text-h4 text-sm-h2 text-lg-h2 ff-nunito">{{ title }}</h2>
              </div>
          </v-img>
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
