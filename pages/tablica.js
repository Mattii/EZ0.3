import { ref, reactive, onMounted, computed } from "vue";
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

const crop = {
  template: `          
  <v-container fluid>
  <v-row justify="center">

      <v-col cols="12" sm="10" md="9" class="d-flex flex-column flex-sm-row justify-sm-space-evenly flex-sm-wrap">
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
                  parti na stanie
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

      <v-col cols="11" sm="10" md="6">
        <stock-input @stock-ready="(data) => stock = data" @raport-ready="(data) => raport = data"></stock-input>
      </v-col>

    </v-row>

    <v-row justify="center">
      <v-col cols="12" sm="10" md="6">
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
        <v-list lines="two">
          <v-list-item
            v-for="(batch, index) in searchedStock"
            :key="index"
            :title="batch.Batch_number + ' ' + batch.Product_name"
            :subtitle="batch.Number_WARSZAWA + 'x ' + batch.Packaging + ' (' + batch.Stock_WARSZAWA + batch.Unit_code + ')'"
            rounded="xl"
          ></v-list-item>
        </v-list>
      </v-col>

    </v-row>

  </v-container>`,

  setup() {
    const route = useRoute();
    const crops = ref({});
    const stock = ref([]);
    const prices = ref([]);
    const raport = ref([]);
    const searchValue = ref('');

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
        //console.log(snapshot.val());
      });

      const priceList = query(fref(db, "cennik"), orderByChild('name'));
      onValue(priceList, (snap) => {
        prices.value = snap.val();
      })
    });

    return {
      route,
      crops,
      stock,
      raport,
      prices,
      searchValue,
      searchedStock,
      onMounted,
      amountOfCrops,
      amountOfBatchesInRaport,
      amountOfBatchesInStock,
    };
  },
};

export default crop;
