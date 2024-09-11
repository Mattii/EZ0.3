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
        title="Logowanie"
        ></hero-element>
      </v-col>
    </v-row>
    
    <v-row justify="center" class="">
      <v-col xs="12" sm="10" md="9" lg="8">
        <v-sheet
          class="pa-3 pa-xl-12 d-flex flex-column justify-center"
          rounded="xl"
          >
            <v-col  xs="12" md="8"  class="">
              <v-text-field
              clearable 
              prepend-icon=""
              variant="solo"
              label="Wpisz adres mailowy"
              placeholder="twójadres@gmail.com"
              density="compact"
              bg-color="primary"
              rounded="pill"
              type="email"
              v-model="mail"
              @click:clear="() => {}"
              > 
              <template v-slot:append>
                <v-btn
                  color="secondary"
                  icon="mdi-at"
                ></v-btn>
              </template>
              </v-text-field>
            </v-col>

            <v-col  xs="12" md="8"  class="">
              <v-text-field
              clearable 
              prepend-icon=""
              variant="solo"
              label="Wpisz swoje hasło"
              density="compact"
              bg-color="primary"
              rounded="pill"
              type="password"
              v-model="password"
              @click:clear="() => {}"
              > 
              <template v-slot:append>
                <v-btn
                  color="secondary"
                  icon="mdi-form-textbox-password"
                ></v-btn>
              </template>
              </v-text-field>
            </v-col> 
            <v-col  xs="12" md="8"  class="">
              <v-btn
                color="secondary"
                rounded="xl"
                size="large"
                append-icon="mdi-login"
              > 
                Zaloguj
              </v-btn>
            </v-col>   
          </v-sheet>
      </v-col>
    </v-row>

    </v-container>`,
  setup() {
    const route = useRoute();
    const store = useStore();
    const mail = ref("");
    const password = ref("")

    onMounted(async () => {});

    return {
      route,
      onMounted,
      mail,
      password,
    };
  },
};

export default stock;
