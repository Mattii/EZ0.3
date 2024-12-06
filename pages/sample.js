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
import cropCodeToFullCropName from "../modules/cropCodeToFullCropName.js";

const stock = {
  template: `
      <v-container fluid>
      <v-row justify="center" class="mb-6">
      <v-col xs="12" sm="11" md="10" lg="8">
      <hero-element
        v-once
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
            <v-btn
            class="ml-3"
            color="secondary"
            icon="mdi-filter"
            @click="() => {
              filterShow = !filterShow;
              filterValues = []
              }"
            >
          </v-btn>
          </template>
        </v-text-field>
        <v-slide-y-transition>
          <v-select
            v-if="filterShow"
            v-model="filterValues"
            :items="filterItems"
            variant="solo"
            density="compact"
            bg-color="primary"
            rounded="pill"
            label="Wybierz segment"
            clearable
            multiple
          >
            <template v-slot:selection="{ item, index }">
              <v-chip v-if="index < 3">
                <span>{{ cropCodeToFullCropName(item.title) }}</span>
              </v-chip>
              <span
                v-if="index === 3"
                class="text-lightgrey text-caption align-self-center"
              >
                (+{{ filterValues.length - 3 }} )
              </span>
            </template>

            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props" :title="cropCodeToFullCropName(item.title)"></v-list-item>
            </template>
          </v-select>
        </v-slide-y-transition>
        </v-col>
    </v-row>
    
    <v-row justify="center">

      <v-col  xs="12" sm="10" md="9" lg="8"  v-if="!showSampleStock.length" class="px-0 px-sm-3 d-flex justify-center 100w">
        <v-progress-circular
          size="36"
          color="primary"
          indeterminate
        ></v-progress-circular>

      <!-- <v-sheet 
        class="pa-12"
        color="secondary"
        rounded="xl"
        >
          <p class="text-h5 my-3 ff-nunito">Niestety nasion próbowych nie znaleziono</p>
          <v-col  xs="12" sm="8" md="6"  class="">
            <p>need to login</p>>
          </v-col>  
        </v-sheet> -->

      </v-col>  

      <v-col v-else xs="12" sm="10" md="9" lg="8" class="px-0 px-sm-3">

        <!-- visible on screen  (width < 600)  -->
        <v-data-table
        fixed-header
        :headers="headersMobile"
        :items="showSampleStock"
        class="h-100 d-flex d-sm-none"
        item-value="index"
        >
        <template v-slot:item="{ item }">
          <tr @click="selectBatch(item)">
            <td class="py-2">
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

        <!-- visible on screen  (width > 600)  -->
        <v-data-table
        fixed-header
        :headers="headers"
        :items="showSampleStock"
        class="h-100 d-none d-sm-flex"
        item-value="index"
        >
          <template v-slot:item="{ item }">
            <tr class="">
              <td class="text-end ">
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

    <v-bottom-sheet
      max-height="60vh"
      v-model="sheet"
    >
      <v-card
        class=""
      >
      <v-fab
            :active="sheet"
            class=""
            color="secondary"
            icon="mdi-close"
            location="bottom end"
            size="small"
            position="sticky"
             @click="sheet = !sheet"
             appear
             app
          ></v-fab>

      <v-card-item>
        <v-card-subtitle class="text-h5">
        {{sheetData.Batch}}
        </v-card-subtitle>
        <v-card-title class="text-h4">
          {{sheetData.Description}}
          <p class="text-subtitle-1">{{sheetData.Crop}}</p>
        </v-card-title>
      </v-card-item>
        <v-card-text>
          <div class="py-3">
            {{sheetData.Number_of_packs}}x {{sheetData.Packaging}}
          </div>
          <v-divider />
          <div class="py-3">
          {{ new Date(sheetData.Packing_date).toLocaleString("pl-PL", { year: "numeric", month: "numeric"}) }}
          </div>
          <v-divider />
          <div class="py-3">
            {{sheetData.Reference}}
          </div>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>

    </v-container>`,
  setup() {
    const route = useRoute();
    const store = useStore();
    const stock = ref([]);
    const searchValue = ref("");
    const db = getDatabase(app);
    const sheet = ref(false);
    const sheetData = ref({});
    const filterShow = ref(false);
    const filterValues = ref([]);

    const headersMobile = ref([
      { title: "Nazwa", align: "start", key: "Description" },
      { title: "Ilość/Opakowanie", align: "end", key: "Packaging" },
    ]);

    const filterItems = computed(() => [
      ...new Set(store.getters.getSampleFromStore.map((ele) => ele.Crop)),
    ]);

    const showSampleStock = computed(() =>
      store.getters.getSampleFromStore.filter((ele) => {
        return (
          ele.Description.includes(searchValue.value.toUpperCase()) &&
          (filterValues.value.length > 0
            ? filterValues.value.includes(ele.Crop)
            : true)
        );
      })
    );

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

    const selectBatch = (item) => {
      sheet.value = !sheet.value;
      sheetData.value = item;
    };

    onMounted(async () => {
      const sample = fref(db, "sample");
      onValue(sample, (snapshot) => {
        store.dispatch("insertSampleToStore", snapshot.val());
      });
    });

    return {
      route,
      showSampleStock,
      headers,
      headersMobile,
      searchValue,
      onMounted,
      sheet,
      sheetData,
      filterShow,
      filterValues,
      filterItems,
      selectBatch,
      toPLAccountingStandards,
      cropCodeToFullCropName,
    };
  },
};

export default stock;
