import { ref, computed, onMounted } from "vue";
const heroElement = {
  template: `
        <v-sheet
          color="#9b91f9"
          rounded="xl"
          width="100%"
          class="v-theme--dark overflow-hidden"
        >
        <v-row no-gutters justify="space-around">
          <v-col cols="12">
          <v-img
          cover
            width="100%"
            src="https://res.cloudinary.com/ddkef5waq/image/upload/v1700745362/kataloghero1400x400_s12wgg.png"
          >
            <template #sources>
              <source media="(max-width: 460px)" srcset="https://res.cloudinary.com/ddkef5waq/image/upload/v1700745362/kataloghero300x200_wam47j.png">
              <source media="(max-width: 690px)" srcset="https://res.cloudinary.com/ddkef5waq/image/upload/v1700745362/kataloghero600x200_gnd8kj.png">
              <source media="(max-width: 800px)" srcset="https://res.cloudinary.com/ddkef5waq/image/upload/v1700745362/kataloghero800x300_ctamac.png">
            </template>
          <div class="px-9 pb-9 px-sm-12 pb-sm-12 pb-lg-14 px-lg-14 h-100 ff-nunito d-flex align-end">
            <h2 class="text-h4 text-md-h3 text-lg-h2 ff-nunito">Katalog</h2>
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
        "https://res.cloudinary.com/ddkef5waq/image/upload/v1700734253/enzapp/pricehero14000x400_kh4zst.png",
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
