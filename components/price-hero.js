import { ref, computed, onMounted } from "vue";
const heroElement = {
  template: `
        <v-sheet
          color="#9b91f9"
          rounded="xl"
          width="100%"
          class="v-theme--dark"
        >
        <v-row no-gutters justify="space-around">
          <v-col cols="12" sm="7" >
          <v-img
          cover
            width="100%"
            src="https://res.cloudinary.com/ddkef5waq/image/upload/v1684482332/enzapp/hero_kmw5p3.jpg"
          >
            <template #sources>
              <source media="(max-width: 460px)" srcset="https://res.cloudinary.com/ddkef5waq/image/upload/v1700211629/enzapp/pricehero300x200_zc6est.png">
            </template>
          <div class="px-9 pb-9 px-sm-12 pb-sm-12 h-100 ff-nunito d-flex align-end">
            <h2 class="text-h4 text-md-h3 text-lg-h2 ff-nunito">Cennik</h2>
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
