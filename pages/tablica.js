import { ref, reactive, onMounted, computed, inject } from "vue";
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
    <v-col xs="12" sm="10" md="9" lg="8" class="d-flex flex-wrap ma-0 pa-0">
        <v-col xs="6" sm="4" md="3"  class="">
          <v-sheet 
            class="pa-3 w-100 h-100 d-flex align-stretch"
            color="primary"
            rounded="lg"
            elevation="3"
            >
                <div class="">
                  <div class="text-h4 mt-2">
                    {{amountOfCrops}}
                  </div>
                  <div class="text-overline mb-1 ff-nunito">
                    odmian w katalogu
                  </div>
                </div>
          </v-sheet>
        </v-col>

        <v-col cols="6" sm="4" md="3" class="">
        <v-sheet 
          class="pa-3 w-100 h-100"
          color="primary"
          rounded="lg"
          elevation="3"
          >
            <div>
              <div class="text-h4 mt-2">
                  {{amountOfBatchesInRaport}}
              </div>
              <div class="text-overline mb-1 ff-nunito">
                  dostępne
              </div>
            </div>
        </v-sheet>
        </v-col>

        <v-col cols="6" sm="4" md="3" class="">
        <v-sheet 
          class="pa-3 w-100 h-100"
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
        </v-col>

        <v-col cols="6" sm="4" md="3" class="">
        <v-sheet 
          class="pa-3 w-100 h-100"
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

        <v-col cols="6" sm="4" md="3" class=""
          v-for="([title, icon, link], i) in [['Komercja', 'mdi-wallet-membership', '/tablica/komercja'], ['Sample', 'mdi-wallet-giftcard', '/tablica/sample']]"
          :key="i"
        >
          <router-link
            :to="link"
          >
            <v-sheet 
              class="pa-3 w-100 h-100"
              color="primary"
              rounded="lg"
              elevation="3"
              >
                <div>
                  <div class="text-h4 mt-2">
                      {{title == "Komercja" ? amountOfBatchesInStock : amountOfSampleInStock}}
                    </div>
                    <div class="text-overline mb-1 ff-nunito">
                      {{ title }}
                    </div>
                  </div>
            </v-sheet>
          </router-link>

        </v-col>
    </v-col>
  </v-row>

    <v-row justify="center" class="mt-12">
      <v-col cols="12">
        <router-view></router-view>
      </v-col>
    </v-row>

    <v-row justify="center" class="">
      <v-col xs="12" sm="10" md="9" lg="8">
        <v-sheet
          class="pa-12"
          color="secondary"
          rounded="xl"
          >
            <p class="text-h5 my-3 ff-nunito">Niestety nasion komercyjnych nie znaleziono</p>
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
    const crops = ref([]);
    const prices = ref([]);
    const raport = ref([]);
    const symfonia = ref([]);
    const searchValue = ref('');
    const tab = ref(null);
    const drawer  = inject('drawer')


    const stock = computed(() => {
      return store.getters.getStockFromStore
    });

    const amountOfCrops = computed(() => {
      return Object.values(crops.value).length;
    });
    const amountOfBatchesInRaport = computed(() => {
      return raport.value.length;
    });

    const amountOfBatchesInStock = computed(() => {
      return stock.value.length;
    });

    const amountOfSampleInStock = computed(() => {
      return store.getters.getSampleFromStore.length;
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
      const mostViewedPosts = query(
        fref(db, "katalog"),
        orderByChild("crop"),
        startAt("TO"),
        endAt("TO")
      );


      if(store.getters.getKatalogFromStore.length != 0){
        crops.value = store.getters.getKatalogFromStore
      }else{
        const katalog = fref(db, "katalog");
        onValue(katalog, (snapshot) => {
          store.dispatch('insertKatalogToStore', snapshot.val())
          crops.value = snapshot.val();
          console.log(snapshot.val());
        });
      }

      if(store.getters.getPriceListFromStore.length != 0){
        prices.value = store.getters.getPriceListFromStore
      }else{
        const priceList = query(fref(db, "cennik"), orderByChild('name'));
        onValue(priceList, (snap) => {
          store.dispatch('insertPriceListToStore', snap.val())
          prices.value = snap.val();
        })
      }

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
      drawer,
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
      amountOfSampleInStock,
      batchesJustOnStock,
      batchesJustOnSymfonia,
      differenceBetweenBatchesOnStockAndSymfonia,
    };
  },
};

export default crop;
