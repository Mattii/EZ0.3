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

const priceList = {
  template: `          
  <v-container fluid>
    <v-row justify="center">
      <v-col xs="12" sm="11" md="10" lg="8">
        <price-hero></price-hero>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" sm="6" md="4">
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
          class="mt-3"
          @click:clear="() => {searchValue = ''}"
        > 
          <template v-slot:append>
            <v-btn
              color="secondary"
              icon="mdi-magnify"
            ></v-btn>
          </template>
        </v-text-field>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col  xs="12" md="10" lg="8" class="d-flex flex-wrap justify-space-evenly">
        <!-- visible on screen  (width < 600)  -->
      <v-data-table
        fixed-header
        :headers="headersMobile"
        :items="searchedPriceList"
        class="h-100 d-flex d-sm-none"
        item-value="index"
      >
      <template v-slot:item="{ item }">
        <tr>
          <td>
            <span class="font-weight-regular text-medium-emphasis text-subtitle-2">{{item.family}}</span>
            <br />
            <span class="text-uppercase font-weight-medium">{{ item.name }}</span>
            <br/>
            <span class="font-weight-light text-medium-emphasis text-subtitle-2">{{item?.segment}}</span>
          </td>
          <td class="tabular-nums text-end">
            <span class="tabular-nums font-weight-regular text-subtitle-2">{{item.packing}}</span>
            <br/>
            <span class="tabular-nums font-weight-medium">{{ toPLAccountingStandards(item.price) }}</span> 
            <br/>
            <span class="tabular-nums font-weight-light text-medium-emphasis text-subtitle-2">{{ toPLAccountingStandards(Number.parseFloat(item.price + item.price * 0.08).toFixed(2)) }}</span>          
          </td>
        </tr>
      </template>
      </v-data-table>
      <!-- visible on screen  (width > 600)  -->
      <v-data-table
        fixed-header
        :headers="headers"
        :items="searchedPriceList"
        class="h-100 d-none d-sm-flex"
        item-value="index"
      >
      <template v-slot:item="{ item }">
        <tr>
          <td><span class="text-uppercase">{{ item.name }}</span> <br/> <span class="font-weight-thin text-medium-emphasis text-subtitle-2">{{item?.segment}}</span></td>
          <td class="text-end">{{ item.family }}</td>
          <td class="tabular-nums text-end">{{ toPLAccountingStandards(item.price) }}</td>
          <td class="tabular-nums font-weight-thin text-medium-emphasis text-subtitle-2">{{ toPLAccountingStandards(Number.parseFloat(item.price + item.price * 0.08).toFixed(2)) }}</td>
          <td class="text-end">{{ item.packing }}</td>
        </tr>
      </template>
      </v-data-table>
      </v-col>
    </v-row>
  </v-container>`,
  setup() {
    const route = useRoute();
    const store = useStore();
    const prices = ref([]);
    const stock = ref([]);
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

    const searchedPriceList = computed(() => {
      return prices.value.filter(ele => ele.name.includes(searchValue.value.toLowerCase()));
    });
    
    const toPLAccountingStandards = (num) => new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(
      num,
    )

    onMounted(async () => {

      if(store.getters.getPriceListFromStore.length == 0){
        const db = getDatabase(app);

        const priceList = query(fref(db, "cennik"), orderByChild("name"));
        onValue(priceList, (snap) => {
          prices.value = snap.val();
          store.dispatch('insertPriceListToStore', snap.val())
          console.log(snap.val());
        });
      }else {
        prices.value = store.getters.getPriceListFromStore
      }

    });

    return {
      route,
      prices,
      stock,
      headers,
      headersMobile,
      searchValue,
      searchedPriceList,
      onMounted,
      toPLAccountingStandards
    };
  },
};

export default priceList;
