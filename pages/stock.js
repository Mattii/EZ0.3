import { ref, reactive, onMounted, computed} from "vue";
import { useStore } from 'vuex';
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
        <v-text-field
          clearable 
          prepend-icon=""
          variant="solo"
          label="Wyszukaj odmianę"
          truncate-length="15"
          density="compact"
          bg-color="primary"
          rounded="pill"
          v-model="searchValue"
          @click:clear="() => {searchValue = ''}"
        > 
          <template v-slot:append>
            <v-btn
              color="secondary"
              icon="mdi-magnify"
            ></v-btn>
          </template>
        </v-text-field>

    <v-row justify="center">
      <v-col  xs="12" md="10" lg="8" class="d-flex flex-wrap justify-space-evenly">
        <!-- visible on screen  (width < 600)  -->

        <!-- visible on screen  (width > 600)  -->

      </v-col>
    </v-row>`,
  setup() {
    const route = useRoute();
    const store = useStore();
    const searchValue = ref('');

    const headersMobile = ref([
      { title: 'Nazwa', align: 'start', key: 'name' },
      { title: 'Cena/Opakowanie', align: 'end', key: 'price' },
    ])

    const headers = ref([
      { title: 'Nazwa', align: 'start', key: 'name' },
      { title: 'Rodzina', align: 'end', key: 'family' },
      { title: 'Cena(netto)', align: 'end', key: 'price' },
      { title: 'Cena(brutto)', align: 'start' },
      { title: 'Opakowanie', align: 'end', key: 'packing' },
    ])


    
    const toPLAccountingStandards = (num) => new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(
      num,
    )

    onMounted(async () => {

      if(store.getters.getPriceListFromStore.length == 0){
        const db = getDatabase(app);

        const priceList = query(fref(db, "cennik"), orderByChild("name"));
        onValue(priceList, (snap) => {
          prices.value = snap.val();
          store.dispatch('insertPriceListToStore', {
            priceList: prices.value
          })
          console.log(snap.val());
        });
      }else {
        prices.value = store.getters.getPriceListFromStore
      }

    });

    return {
      route,
      headers,
      headersMobile,
      searchValue,
      onMounted,
      toPLAccountingStandards
    };
  },
};

export default stock;
