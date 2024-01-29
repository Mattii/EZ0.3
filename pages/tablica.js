import { ref, reactive, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from 'vuex';
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

const crop = {
  template: `          
  <v-container fluid>
  <v-row justify="center">

      <v-col cols="12" sm="11" md="9" class="d-flex flex-column flex-sm-row justify-sm-center flex-sm-wrap">
        <v-sheet 
          class="ma-3 pa-6"
          color="primary"
          rounded="lg"
          elevation="3"
          >
              <div>
                <div class="text-h4 mt-2">
                  {{amountOfCrops}}
                </div>
                <div class="text-overline mb-1 ff-nunito">
                  odmian w katalogu
                </div>
              </div>
        </v-sheet>

        <v-sheet 
          class="ma-3 pa-6"
          color="primary"
          rounded="lg"
          elevation="3"
          >
            <div>
              <div class="text-h4 mt-2">
                  {{amountOfBatchesInRaport}}/{{amountOfBatchesInStock}}
              </div>
              <div class="text-overline mb-1 ff-nunito">
                  dostępne / stan
              </div>
            </div>
        </v-sheet>

        <v-sheet 
          class="ma-3 pa-6"
          color="primary"
          rounded="lg"
          elevation="3"
          >
            <div>
              <div class="text-h4 mt-2">
                  {{symfonia.length}}
              </div>
              <div class="text-overline mb-1 ff-nunito">
                  partii w symfonii
              </div>
            </div>
        </v-sheet>

        <v-sheet 
          class="ma-3 pa-6"
          color="primary"
          rounded="lg"
          elevation="3"
          >
            <div>
              <div class="text-h4 mt-2">
                  {{prices.length}}
                </div>
                <div class="text-overline mb-1 ff-nunito">
                  lini w cenniku
                </div>
              </div>
        </v-sheet>

      </v-col>
    </v-row>

    <v-row justify="center">

      <v-col cols="11" sm="6" md="4">
        <stock-input @stock-ready="stockUpdate" @raport-ready="raportUpdate" @symfonia-ready="symfoniaUpdate"></stock-input>
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

    </v-row>

  </v-container>`,

  setup() {
    const route = useRoute();
    const store = useStore();
    const crops = ref({});
    const stock = ref([]);
    const prices = ref([]);
    const raport = ref([]);
    const symfonia = ref([]);
    const searchValue = ref('');
    const tab = ref(null);


    const amountOfCrops = computed(() => {
      return Object.values(crops.value).length;
    });
    const amountOfBatchesInRaport = computed(() => {
      return raport.value.length;
    });

    const amountOfBatchesInStock = computed(() => {
      return stock.value.length;
    });

    const searchedStock = computed(() => {
      return raport.value.filter(ele => ele.Product_name.includes(searchValue.value.toUpperCase()));
    });

    const batchesJustOnStock = computed(() => {
      //sprawdza które batche są w ABS ale nie mam w symfonii
      const batchesInSymfonia = symfonia.value.map((batch) => +batch.batch)
      return stock.value.filter(ele => !batchesInSymfonia.includes(+ele.Batch_number))
    });

    const batchesJustOnSymfonia = computed(() => {
      //sprawdza które batche są w symfonii ale nie mam w symfonii ABS
      const batchesInStock = stock.value.map((batch) => +batch.Batch_number)
      return symfonia.value.filter(ele => !batchesInStock.includes(+ele.batch))
    });

    const stockUpdate = (freshStock) => {
      stock.value = freshStock;
      store.dispatch('insertStockToStore', freshStock);
    }

    const raportUpdate = (freshRaport) => {
      raport.value = freshRaport;
      store.dispatch('insertRaportToStore', freshRaport);
    }

    const symfoniaUpdate = (freshSymfonia) => {
      symfonia.value = freshSymfonia;
      store.dispatch('insertSymfoniaToStore', freshSymfonia);
    }

    const differenceBetweenBatchesOnStockAndSymfonia = computed(() => {
      //sprawdza które batche 
      return stock.value.reduce((accumulator, currentValue) => {
        const symfBatch = symfonia.value.find((batch) => +batch.batch == +currentValue.Batch_number)
        if(+symfBatch?.batch == +currentValue.Batch_number && +symfBatch?.ilość !== +currentValue.Number_balance ){
          const diff = {
            'batch': +currentValue.Batch_number,
            'name': currentValue.Article_abbreviated,
            'amountInSymfonia':+symfBatch?.ilość,
            'amountInABS': +currentValue.Number_balance,
            'amountDiffrance':+currentValue.Number_balance - +symfBatch?.ilość
          }
          accumulator.push(diff)
        }
        return accumulator
      }, [])
    });

    onMounted(async () => {
      const db = getDatabase(app);

      const katalog = fref(db, "katalog");
      const mostViewedPosts = query(
        fref(db, "katalog"),
        orderByChild("crop"),
        startAt("TO"),
        endAt("TO")
      );

      onValue(katalog, (snapshot) => {
        crops.value = snapshot.val();
        console.log(snapshot.val());
      });

      const priceList = query(fref(db, "cennik"), orderByChild('name'));
      onValue(priceList, (snap) => {
        prices.value = snap.val();
      })

      if(store.getters.getStockFromStore.length != 0){
        stock.value = store.getters.getStockFromStore
      }
      if(store.getters.getRaportFromStore.length != 0){
        raport.value = store.getters.getRaportFromStore
      }
      if(store.getters.getSymfoniaFromStore.length != 0){
        symfonia.value = store.getters.getSymfoniaFromStore
      }
    });

    return {
      tab,
      route,
      crops,
      stock,
      raport,
      prices,
      symfonia,
      searchValue,
      searchedStock,
      onMounted,
      amountOfCrops,
      amountOfBatchesInRaport,
      amountOfBatchesInStock,
      batchesJustOnStock,
      batchesJustOnSymfonia,
      differenceBetweenBatchesOnStockAndSymfonia,
      stockUpdate,
      raportUpdate,
      symfoniaUpdate,
    };
  },
};

export default crop;
