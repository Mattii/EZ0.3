import { ref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useStore } from 'vuex';
import { getDatabase, query, orderByValue, orderByKey, orderByChild, onValue, startAt, endAt } from  "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import {ref as fref } from  "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import app from "../modules/firebase.js"

const crop = {
  template: `          
  <v-container fluid>
    <v-row justify="center">
      <v-col xs="12" sm="10" md="9" lg="8">
        <catalog-hero></catalog-hero>
      </v-col>
    </v-row>
    <v-row justify="center" class="">
    <v-col  xs="12" sm="10" md="9" lg="8" class="pa-0 ma-0 d-flex flex-wrap justify-center">
          <v-col  xs="12" sm="6" md="4" class="d-flex flex-wrap justify-space-evenly"             
          v-for="(item, index) in crops"
            key="index">
            <router-link 
            class="w-100 h-100"
            :to="{name: 'crop', params: {name: index}}">
            <main-vareity-card
              v-if="item"
              :item="item"
              :stock="stock"
            ></main-vareity-card>
            </router-link>
          </v-col>
          </v-col>
    </v-row>
  </v-container>`,
  setup() {
    const route = useRoute();
    const store = useStore();
    const crops = ref({});
    const stock = ref([]);

    onMounted(async () => {
      const db = getDatabase(app);


      if(store.getters.getKatalogFromStore.length != 0 && !navigator.onLine){
        crops.value = store.getters.getKatalogFromStore
      }else{
        const katalog = fref(db, "katalog");
        onValue(katalog, (snapshot) => {
          store.dispatch('insertKatalogToStore', snapshot.val())
          crops.value = snapshot.val();
        });
      }
      
    });

    return {
      route,
      crops,
      stock,
      onMounted,
    };
  },
};

export default crop;
