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
          v-if="userError"
          class="pa-3 pa-xl-12"
          rounded="xl"
          >
          <v-col  xs="12" md="8"  class="d-flex align-center justify-center">
            <span>{{userError}}</span>
          </v-col>
        </v-sheet>
        <v-sheet
          class="pa-3 pa-xl-12 d-flex flex-column justify-center"
          rounded="xl"
          >
          <v-form @submit.prevent="signIn">
            <v-col  xs="12" md="8"  class="">
              <v-text-field
              class="mb-2"
              clearable 
              prepend-icon=""
              variant="solo"
              label="e-mail"
              placeholder="twójadres@gmail.com"
              density="compact"
              bg-color="primary"
              rounded="pill"
              type="email"
              v-model="mail"
              :rules="[rules.required]"
              :error-messages="emailError"
              @click:clear="() => {}"
              > 
              <template v-slot:prepend>
                <v-btn
                  color="secondary"
                  icon="mdi-at"
                  readonly
                ></v-btn>
              </template>
              </v-text-field>

              <v-text-field
              clearable 
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              variant="solo"
              label="hasło"
              density="compact"
              bg-color="primary"
              rounded="pill"
              :rules="[rules.required]"
              :type="showPassword ? 'text' : 'password'"
              :error-messages="passwordError"
              v-model="password"
              @click:append-inner="showPassword = !showPassword"
              @click:clear="() => {}"
              > 
              <template v-slot:prepend>
                <v-btn
                  color="secondary"
                  icon="mdi-form-textbox-password"
                  readonly
                ></v-btn>
              </template>
              </v-text-field>
            </v-col> 
            <v-col  xs="12" md="8"  class="">
            <v-btn
                  color="secondary"
                  icon="mdi-login"
                  readonly
                ></v-btn>
              <v-btn
                class="ml-4 "
                color="secondary"
                rounded="xl"
                size="large"
                type="submit"
              > 
                Zaloguj
              </v-btn>
            </v-col>   
            </v-form>
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
    const showPassword = ref(false);
    const fireBaseError = ref({});
    const rules = reactive({
      required: value => !!value || 'Wypełnij',
      min: v => v.length >= 8 || 'Min 8 characters',
      emailMatch: () => (`The email and password you entered don't match`),
    })

    const auth = getAuth();

    const userError = computed(() => {
      return fireBaseError.value.code === 'auth/user-not-found' ? 'Nie znaleźiono takiego urzytkownika' : '';
    });
    const passwordError = computed(() => {
      return fireBaseError.value.code === 'auth/missing-password' ? 'Nieprawidłowe hasło' : '';
    });
    const emailError = computed(() => {
      return fireBaseError.value.code === 'auth/invalid-email' ? 'Nieprawidłowy email' : '';
    });


    const signIn = () => {
      signInWithEmailAndPassword(auth, mail.value, password.value)
        .then((userCredential) => {
          // Signed in 
          store.dispatch('insertUserToStore', userCredential)
          router.push('/tablica')
          // ...
        })
        .catch((error) => {
          fireBaseError.value = error;
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
      showPassword,
      passwordError,
      emailError,
      userError,
      rules,
      signIn,
    };
  },
};

export default stock;
