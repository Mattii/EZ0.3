import { ref, reactive, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
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
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import app from "../modules/firebase.js";

const stock = {
  template: `
      <v-container fluid>
      <v-row justify="center" class="mb-6">
      <v-col xs="12" sm="11" md="10" lg="8">
      <hero-element
        title="Logowanie"
        mainSrc="https://res.cloudinary.com/ddkef5waq/image/upload/v1726141224/enzapp/login-hero1400x400_kzijoj.png"
        :mainSrcSource="['https://res.cloudinary.com/ddkef5waq/image/upload/v1726141223/enzapp/login-hero300x200_m91euq.png',
          'https://res.cloudinary.com/ddkef5waq/image/upload/v1726141223/enzapp/login-hero600x250_v1rsxu.png',
          'https://res.cloudinary.com/ddkef5waq/image/upload/v1726141224/enzapp/login-hero800x300_ddi3th.png']"
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
              <template v-slot:prepend>
                <v-btn
                  color="secondary"
                  icon="mdi-at"
                ></v-btn>
              </template>
              </v-text-field>

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
              <template v-slot:prepend>
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
                  icon="mdi-login"
                ></v-btn>
              <v-btn
                class="ml-4 "
                color="secondary"
                rounded="xl"
                size="large"
                @click="signIn"
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
    const router = useRouter();
    const store = useStore();
    const mail = ref("");
    const password = ref("");

    const auth = getAuth();

    const signIn = () => {
      signInWithEmailAndPassword(auth, mail.value, password.value)
        .then((userCredential) => {
          // Signed in 
          store.dispatch('insertUserToStore', userCredential)
          router.push('/tablica')
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error(errorCode, errorMessage);
          
        });
    }

    onMounted(async () => {
        console.log(auth.currentUser);
      
    });

    return {
      route,
      onMounted,
      mail,
      password,
      signIn,
    };
  },
};

export default stock;
