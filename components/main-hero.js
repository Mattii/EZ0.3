import { ref, computed, onMounted } from "vue";
const heroElement = {
  template: `
        <v-sheet
          rounded="xl"
          color="secondary"
          width="100%"
          class="v-theme--dark"
        >
        <v-row no-gutters justify="space-around">
          <v-col cols="12" sm="7">
          <v-img
          cover
            width="100%"
            src="https://res.cloudinary.com/ddkef5waq/image/upload/v1684482332/enzapp/hero_kmw5p3.jpg"
          >
            <template #sources>
              <source media="(max-width: 460px)" srcset="https://res.cloudinary.com/ddkef5waq/image/upload/v1700046172/enzapp/heroXS_my2xzj.png">
            </template>
          <div class="px-8 pt-9 pb-6 px-sm-12 h-100 pt-sm-16 ff-nunito d-flex flex-wrap">
            <h2 class="text-h5 text-md-h3 text-lg-h2 mb-3 ff-nunito">Sięgnij po <br /> swój</h2>
            <div class="align-self-end d-flex justify-end w-100">
            <v-btn class="mt-3 text-capitalize ff-nunito" rounded="pill"  color="primary"
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
