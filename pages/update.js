import { ref, reactive, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import {
  getDatabase,
  query,
  orderByValue,
  orderByKey,
  orderByChild,
  onValue,
  startAt,
  endAt,
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import { ref as fref } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import app from "../modules/firebase.js";

const stock = {
  template: `
      <v-container fluid>
      <v-row justify="center" class="mb-6">
      <v-col xs="12" sm="11" md="10" lg="8">
      <hero-element
        title="Update"
        ></hero-element>
      </v-col>
    </v-row>
    
    <v-row justify="center" class="">
      <v-col xs="12" sm="10" md="9" lg="8">
        <v-sheet
          class="pa-12"
          color="secondary"
          rounded="xl"
          >
            <p class="text-h5 my-3 ff-nunito">Wyślij stany do bazy danych</p>
            <v-col  xs="12" sm="8" md="6"  class="">
              <stock-input></stock-input>
            </v-col>  
          </v-sheet>
      </v-col>
    </v-row>

    </v-container>`,
  setup() {
    const route = useRoute();
    const store = useStore();

    onMounted(async () => {});

    return {
      route,
      onMounted,
    };
  },
};

export default stock;
