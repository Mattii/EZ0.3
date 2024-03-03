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
      <v-row justify="center">
      <v-col  xs="12" md="4" lg="3" class="">
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
        <v-sheet 
        v-if="!showSampleStock.length"
        class="pa-12"
        color="secondary"
        rounded="xl"
        >
          <p class="text-h5 my-3 ff-nunito">Niestety nasion próbowych nie znaleziono</p>
          <v-col  xs="12" sm="8" md="6"  class="">
            <stock-input></stock-input>
          </v-col>  
        </v-sheet>
        <!-- visible on screen  (width > 600)  -->
        <div
        v-else
        >
        <v-data-table
        fixed-header
        :headers="headersMobile"
        :items="showSampleStock"
        class="h-100 d-flex d-sm-none"
        item-value="index"
        >
        <template v-slot:item="{ item }">
          <tr>
            <td>
              <span class="font-weight-regular text-medium-emphasis text-subtitle-2">{{ item.Crop }}</span>
              <br />
              <span class="text-uppercase font-weight-medium">{{ item.Description }}</span>
              <br/>
              <span class="font-weight-light text-medium-emphasis text-subtitle-2">{{ item['Batch_number(s)'] }}</span>
            </td>
            <td class="tabular-nums text-end">
              <span class="tabular-nums font-weight-light text-medium-emphasis text-subtitle-2">{{new Date(item.Packing_date).toLocaleString({ hour12: false })}}</span>          
              <br/>
              <span class="tabular-nums font-weight-medium">{{ item.STAN }}</span> 
              <br/>
              <span class="tabular-nums font-weight-regular text-subtitle-2">{{ item.Packaging  }}</span>
            </td>
          </tr>
        </template>
        </v-data-table>

        <v-data-table
        class="w-100"
        fixed-header
        :headers="headers"
        :items="showSampleStock"
        class="h-100 d-none d-sm-flex"
        item-value="index"
        >
          <template v-slot:item="{ item }">
            <tr>
              <td class="text-end">
                <span class="text-uppercase">{{ item['Batch_number(s)'] }}</span>
              </td>
              <td>
                <span class="text-uppercase">{{ item.Description }}</span>
                <br/> 
                <span class="font-weight-thin text-medium-emphasis text-subtitle-2">{{item.Crop}}</span>
              </td>
              <td class="text-end">
                <span class="text-uppercase">{{ item.STAN }}</span>
              </td>
              <td class="">
                <span class="text-uppercase">{{  item.Packaging }}</span>
              </td>
              <td class="">
                <span class="text-uppercase">{{ new Date(item.Packing_date).toLocaleString({ hour12: false }) }}</span>
              </td>
            </tr>
          </template>
        </v-data-table>
        </div>
      </v-col>
    </v-row>`,
  setup() {
    const route = useRoute();
    const store = useStore();
    const stock = ref([]);
    const searchValue = ref("");

    const headersMobile = ref([
      { title: "Nazwa", align: "start", key: "Description" },
      { title: "Ilość/Opakowanie", align: "end", key: "Packaging" },
    ]);

    const showSampleStock = computed(() => store.getters.getSampleFromStore.filter(ele => {
      return ele.Description.includes(searchValue.value.toUpperCase())
    }));

    const headers = ref([
      { title: "Partia", align: "end", key: "Batch_number(s)" },
      { title: "Nazwa", align: "start", key: "Description" },
      { title: "Ilość", align: "end", key: "STAN" },
      { title: "Pakowanie", align: "Packaging" },
      { title: "Data pakowania", align: "Packing_date" },
    ]);

    const toPLAccountingStandards = (num) =>
      new Intl.NumberFormat("pl-PL", {
        style: "currency",
        currency: "PLN",
      }).format(num);

    onMounted(async () => {});

    return {
      route,
      showSampleStock,
      headers,
      headersMobile,
      searchValue,
      onMounted,
      toPLAccountingStandards,
    };
  },
};

export default stock;
