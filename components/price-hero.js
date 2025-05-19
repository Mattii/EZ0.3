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
            src="https://res.cloudinary.com/ddkef5waq/image/upload/v1700734253/enzapp/pricehero14000x400_kh4zst.png"
          >
            <template #sources>
              <source media="(max-width: 460px)" srcset="https://res.cloudinary.com/ddkef5waq/image/upload/v1700733238/enzapp/pricehero300x200_kqjas8.png">
              <source media="(max-width: 690px)" srcset="https://res.cloudinary.com/ddkef5waq/image/upload/v1700733135/enzapp/pricehero600x200_gunlex.png">
              <source media="(max-width: 800px)" srcset="https://res.cloudinary.com/ddkef5waq/image/upload/v1700733815/enzapp/pricehero800x300_c2ebjz.png">
            </template>
          <div class="px-9 py-9 px-sm-12 pb-sm-12 h-100 ff-nunito d-flex d-inline-flex flex-column justify-end ">
            <div v-if="true" class="rounded-xl font-weight-light px-3  pt-1 d-inline bg-red mr-auto">NOWY</div>
            <h2 class="text-h4 text-md-h3 mt-1 text-lg-h2 ff-nunito">Cennik</h2>
            <h4 class="text-subtitle-1 font-weight-thin">Aktualny od 18.05.2025</h4>
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
