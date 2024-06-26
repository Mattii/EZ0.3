import { ref, reactive, onMounted, computed } from "vue";
import { useStore } from "vuex";
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
    <v-container fluid>
      <v-row justify="center" class="mb-6">
      <v-col xs="12" sm="11" md="10" lg="8">
        <hero-element
        title="Komercja"
        ></hero-element>
      </v-col>
    </v-row>
      <v-row justify="center" class="">
      <v-col  xs="12" sm="8" md="6" lg="4" class="">
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
      <v-col  xs="12" sm="10" md="9" lg="8" class="">

        <!-- visible on screen  (width < 600)  -->
        <v-sheet v-if="!showStock.length"
        class="pa-12"
        color="secondary"
        rounded="xl"
        >
          <p class="text-h5 my-3 ff-nunito">Niestety nasion komercyjnych nie znaleziono</p>
          <v-col  xs="12" sm="8" md="6"  class="">
            <p>need to login</p>
          </v-col>  
        </v-sheet>
        <!-- visible on screen  (width > 600)  -->
        <div
        v-else
        >
        <v-data-table
        fixed-header
        :headers="headersMobile"
        :items="showStock"
        class="h-100 d-flex d-sm-none"
        item-value="index"
        >
        <template v-slot:item="{ item }">
        <tr @click="selectBatch(item)">
            <td>
              <span class="font-weight-regular text-medium-emphasis text-subtitle-2">{{ item.Product_full_name }}</span>
              <br />
              <span class="text-uppercase font-weight-medium">{{ item.Article_abbreviated }}</span>
              <br/>
              <span class="font-weight-light text-medium-emphasis text-subtitle-2">{{ item.Batch_number }} {{ item.Lot_number }}</span>
            </td>
            <td class="tabular-nums text-end">
              <span class="tabular-nums font-weight-light text-medium-emphasis text-subtitle-2">
                <v-chip color="red" variant="tonal" density="comfortable" v-if="!item.Quantity_usable">Niedostępne</v-chip>
                <span v-else>{{item.Quantity_usable}} {{item.Unit_code}}</span>
              </span>          
              <br/>
              <span class="tabular-nums font-weight-medium">{{ item.Number_balance }}</span> 
              <br/>
              <span class="tabular-nums font-weight-regular text-subtitle-2">{{  item.Packaging_abbreviated }}</span>
            </td>
          </tr>
        </template>
        </v-data-table>

        <v-data-table
        class="w-100"
        fixed-header
        :headers="headers"
        :items="showStock"
        class="h-100 d-none d-sm-flex"
        item-value="index"
        >
          <template v-slot:item="{ item }">
            <tr>
              <td class="text-end">
                <span class="text-uppercase">{{ item.Batch_number }}</span>
                <br/>
                <span class="font-weight-thin text-medium-emphasis text-subtitle-2">{{item.Lot_number}}</span>
              </td>
              <td>
                <span class="text-uppercase">{{ item.Article_abbreviated }}</span>
                <br/> 
                <span class="font-weight-thin text-medium-emphasis text-subtitle-2">{{item.Product_full_name}}</span>
              </td>
              <td class="text-end">
                <span class="text-uppercase">{{ item.Number_balance }}</span>
                <br/> 
                <span class="font-weight-thin text-medium-emphasis text-subtitle-2">
                  <v-chip color="red" variant="tonal" density="comfortable" v-if="!item.Quantity_usable">Niedostępne</v-chip>
                  <span v-else>{{item.Quantity_usable}} {{item.Unit_code}}</span>
                </span>
              </td>
              <td class="">
                <span class="text-uppercase">{{  item.Packaging_abbreviated }}</span>
                <br/> 
                <span class="font-weight-thin text-medium-emphasis text-subtitle-2">{{item.Quantity_balance}} {{item.Unit_code}}</span></td>
            </tr>
          </template>
        </v-data-table>
        </div>
      </v-col>
    </v-row>
    <v-bottom-sheet v-model="sheet">
      <v-card
        class=""
      >
      <v-btn
            variant="text"
            @click="sheet = !sheet"
          >
            zamknij 
      </v-btn>

    <v-card-item>
        <v-card-subtitle class="text-h5">
        </v-card-subtitle>
        <v-card-title class="text-h3">
          {{sheetData.Article_abbreviated}}
          <p class="text-subtitle-1"></p>
        </v-card-title>
      </v-card-item>
        <v-card-text>
          <div class="py-3">
            {{sheetData}}
          <v-divider />
          <div class="py-3">
          </div>
          <v-divider />
          <div class="py-3">
          </div>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>
    </v-container>
    `,
  setup() {
    const route = useRoute();
    const store = useStore();
    const stock = ref([]);
    const searchValue = ref("");
    const db = getDatabase(app);
    const sheet = ref(false);
    const sheetData = ref({});

    const headersMobile = ref([
      { title: "Nazwa", align: "start", key: "Article_abbreviated" },
      { title: "Ilość/Opakowanie", align: "end", key: "Packaging_abbreviated" },
    ]);

    const showStock = computed(() => store.getters.getStockFromStore.filter(ele => {

      return ele.Article_abbreviated.includes(searchValue.value.toUpperCase())
    }));

    const headers = ref([
      { title: "Partia", align: "end", key: "Batch_number" },
      { title: "Nazwa", align: "start", key: "Article_abbreviated" },
      { title: "Ilość", align: "end", key: "Number_balance" },
      { title: "Pakowanie", align: "Packaging_abbreviated" },
    ]);

    const toPLAccountingStandards = (num) =>
      new Intl.NumberFormat("pl-PL", {
        style: "currency",
        currency: "PLN",
      }).format(num);

      const selectBatch = (item) => {
        sheet.value = !sheet.value;
        sheetData.value = item
        console.log(item);
      }  

    onMounted(async () => {
      const stock = fref(db, "stock");
      onValue(stock, (snapshot) => {
        store.dispatch('insertStockToStore', snapshot.val());
      });
    });

    return {
      route,
      showStock,
      headers,
      headersMobile,
      searchValue,
      onMounted,
      sheet,
      sheetData,
      selectBatch,
      toPLAccountingStandards,
    };
  },
};

export default stock;
