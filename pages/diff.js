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
      <v-row justify="center">
      <v-col  xs="12" md="6" lg="4" class="">
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
        </v-col>
    </v-row>
    
    <v-row justify="center">
      <v-col cols="12" sm="6" md="4">
        <v-text-field
          prepend-icon=""
          variant="solo"
          label="Wyszukaj partję"
          truncate-length="15"
          density="compact"
          bg-color="primary"
          rounded="pill"
          v-model="searchValue"
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
      <v-col cols="12" sm="10" md="6">
        <v-tabs
          v-model="tab"
          color="primary"
          align-tabs="center"
          center-active
          show-arrows
        >
          <v-tab value="1">raport</v-tab>
          <v-tab value="2">symfonia</v-tab>
          <v-tab value="3">stock</v-tab>
        </v-tabs>
        <v-window v-model="tab">
          <v-window-item value="1">
            <v-list lines="two">
              <v-list-item
                v-for="(batch, index) in searchedStock"
                :key="index"
                :title="batch.Batch_number + ' ' + batch.Product_name"
                :subtitle="batch.Number_WARSZAWA + 'x ' + batch.Packaging + ' (' + batch.Stock_WARSZAWA + batch.Unit_code + ')'"
                rounded="xl"
                ></v-list-item>
            </v-list>
          </v-window-item>

          <v-window-item value="2">
            <v-list lines="two">
              <v-list-item
                v-for="(batch, index) in symfonia"
                :key="index"
                :title="batch.batch + ' ' + batch.nazwa"
                :subtitle="batch.kod + ' x' + batch.ilość"
                >
              </v-list-item>
            </v-list>
          </v-window-item>

          <v-window-item value="3">
            <v-list >
            <v-list-subheader>partje tylko na stanie ABS {{batchesJustOnStock.length}}</v-list-subheader>
              <v-virtual-scroll
                :items="batchesJustOnStock"
                height="300"
                item-height="50"
              >
              <template v-slot:default="{ item }">
              <v-list-item
                :title="item.Batch_number + ' ' + item.Article_abbreviated"
                :subtitle="item.Packaging_abbreviated + ' x' + item.Number_balance"
                >
              </v-list-item>
              </template>
              </v-virtual-scroll>
            </v-list>

            <v-list >
            <v-list-subheader>partje tylko w symfonii {{batchesJustOnSymfonia.length}}</v-list-subheader>
              <v-virtual-scroll
                :items="batchesJustOnSymfonia"
                height="300"
                item-height="50"
              >
              <template v-slot:default="{ item }">
              <v-list-item
                :title="item.batch + ' ' + item.nazwa"
                :subtitle="item.kod + ' x' + item.ilość"
                >
              </v-list-item>
              </template>
              </v-virtual-scroll>
            </v-list>

            <v-list >
            <v-list-subheader>różnica między ABS a symfonii {{differenceBetweenBatchesOnStockAndSymfonia.length}}</v-list-subheader>
              <v-virtual-scroll
                :items="differenceBetweenBatchesOnStockAndSymfonia"
                height="300"
                item-height="50"
              >
              <template v-slot:default="{ item }">
              <v-list-item
                :title="item.batch + ' ' + item.name"
                :subtitle="item.amountInABS + '/ABS - ' + item.amountInSymfonia + '/symf = ' + item.amountDiffrance"
                >
              </v-list-item>
              </template>
              </v-virtual-scroll>
            </v-list>
          </v-window-item>
        </v-window>
      </v-col>

    </v-row>`,
  setup() {
    const route = useRoute();
    const store = useStore();
    const stock = ref([]);
    const searchValue = ref('');

    const headersMobile = ref([
      { title: 'Nazwa', align: 'start', key: 'name' },
      { title: 'Cena/Opakowanie', align: 'end', key: 'price' },
    ])

    const showStock = computed(() => store.getters.getStockFromStore)
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

    

    });

    return {
      route,
      showStock,
      headers,
      headersMobile,
      searchValue,
      onMounted,
      toPLAccountingStandards
    };
  },
};

export default stock;
