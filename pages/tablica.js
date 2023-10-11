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

      <v-col cols="12" sm="6" md="4" lg="3">
      <v-card
          class="mx-auto"
          max-width="344"
          color="primary"
          variant="tonal"
        >
          <v-card-item>
            <div>
              <div class="text-h4 mt-2">
                {{amountOfCrops}}
              </div>
              <div class="text-overline mb-1">
                odmian w katalogu
              </div>
              <div class="text-caption">Greyhound divisely hello coldly fonwderfully</div>
            </div>
          </v-card-item>
      </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4" lg="3">
      <v-card
          class="mx-auto"
          max-width="344"
          color="primary"
          variant="tonal"
        >
          <v-card-item>
            <div>
            <div class="text-h4 mt-2">
                {{amountOfBatches}}
              </div>
              <div class="text-overline mb-1">
                parti na stanie
              </div>
              <div class="text-caption">Greyhound divisely hello coldly fonwderfully</div>
            </div>
          </v-card-item>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4" lg="3">
      </v-col>
    </v-row>

    <v-row justify="center">

      <v-col cols="12" sm="10" md="6">
        <stock-input @stock-ready="(data) => stock = data"></stock-input>
      </v-col>

    </v-row>

    <v-row justify="center">

      <v-col cols="12" sm="10" md="6">
        <v-list lines="two">
          <v-list-item
            v-for="(batch, index) in stock"
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

    const amountOfCrops = computed(() => {
      return Object.values(crops.value).length
    })
    const amountOfBatches = computed(() => {
      return stock.value.length
    })

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
    });

    return {
      route,
      crops,
      stock,
      onMounted,
      amountOfCrops,
      amountOfBatches
    };
  },
};

export default crop;
