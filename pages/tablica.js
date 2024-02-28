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

      <v-navigation-drawer
      class=""
        v-model="drawer"
        temporary
        app
      >
        <v-list>
          <v-list-item
            prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
            title="Mateusz"
            subtitle="MadDaimond@gravity.com"
          ></v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list 
          density="comfortable"
          nav>
          <v-list-group value="Admin">
          <template v-slot:activator="{ props }">
            <v-list-item
              rounded="xl" prepend-icon="mdi-bookshelf" value="myfiles"
              v-bind="props"
              title="Magazyn"
            ></v-list-item>
          </template>

          <v-list-item
            color=""
            rounded="xl"
            v-for="([title, icon], i) in [['Komercja', 'mdi-wallet-membership'], ['Sample', 'mdi-wallet-giftcard']]"
            :key="i"
            :title="title"
            :prepend-icon="icon"
            :value="title"
          ></v-list-item>
        </v-list-group>
          <v-list-item rounded="xl" prepend-icon="mdi-account-multiple" title="profil" value="shared"></v-list-item>
          <v-list-item rounded="xl" prepend-icon="mdi-star" title="Stan" value="starred"></v-list-item>
        </v-list>
      </v-navigation-drawer>

  <v-container fluid>

  <v-row justify="center">
    <v-col xs="12" sm="10" md="9" lg="8" class="d-flex flex-wrap">
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
                  {{amountOfBatchesInRaport}}/{{amountOfBatchesInStock}}
              </div>
              <div class="text-overline mb-1 ff-nunito">
                  dostępne / stan
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
    const drawer  = inject('drawer')

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
