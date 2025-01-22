import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
const prsona = {
  template: `
        <v-list-item
          class="py-3"
          
        >
        <template v-slot:prepend>
          <v-avatar color="secondary" >
            <v-icon icon="mdi-account"></v-icon>
          </v-avatar>
          
        </template>
        {{user?user?.email:'Gość'}}
        </v-list-item>
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
  setup() {
    const store = useStore();

    const user = computed(() => 
      store.getters.getUserFromStore
    );

    console.log(user.value);
    
    return {
      user
    }
  },
};
export default prsona;
