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
        title="Próby"
        ></hero-element>
      </v-col>
    </v-row>
      <v-row justify="center">
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
        <v-sheet 
        v-if="!showSampleStock.length"
        class="pa-12"
        color="secondary"
        rounded="xl"
        >
          <p class="text-h5 my-3 ff-nunito">Niestety nasion próbowych nie znaleziono</p>
          <v-col  xs="12" sm="8" md="6"  class="">
            <p>need to login</p>>
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
              <span class="font-weight-light text-medium-emphasis text-subtitle-2">{{ item.Batch }}</span>
            </td>
            <td class="tabular-nums text-end">
              <span class="tabular-nums font-weight-light text-medium-emphasis text-subtitle-2">{{new Date(item.Packing_date).toLocaleString("pl-PL", { year: "numeric", month: "numeric"})}}</span>          
              <br/>
              <span class="tabular-nums font-weight-medium">{{ item['Number_of_packs'] }}</span> 
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
                <span class="text-uppercase">{{ item.Batch }}</span>
              </td>
              <td>
                <span class="text-uppercase">{{ item.Description }}</span>
              </td>
              <td>
                <span class="font-weight-thin text-medium-emphasis text-subtitle-2">{{item.Crop}}</span>
              </td>
              <td class="text-end">
                <span class="text-uppercase">{{ item['Number_of_packs'] }}</span>
              </td>
              <td class="">
                <span class="text-uppercase">{{  item.Packaging }}</span>
              </td>
              <td class="">
                <span class="text-uppercase">{{ new Date(item.Packing_date).toLocaleString("pl-PL", { year: "numeric", month: "numeric"}) }}</span>
              </td>
            </tr>
          </template>
        </v-data-table>
        </div>
      </v-col>
    </v-row>
    </v-container>`,
  setup() {
    const route = useRoute();
    const store = useStore();
    const stock = ref([]);
    const searchValue = ref("");
    const db = getDatabase(app);

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
      { title: "Segment", align: "start", key: "Crop" },
      { title: "Ilość", align: "end", key: "Number_of_packs" },
      { title: "Pakowanie", align: "Packaging" },
      { title: "Data pakowania", align: "Packing_date" },
    ]);

    const toPLAccountingStandards = (num) =>
      new Intl.NumberFormat("pl-PL", {
        style: "currency",
        currency: "PLN",
      }).format(num);

    onMounted(async () => {
      const sample = fref(db, "sample");
      onValue(sample, (snapshot) => {
        store.dispatch('insertSampleToStore', snapshot.val());
      });
    });

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
