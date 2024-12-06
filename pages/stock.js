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
        title="Komercja"
        mainSrc="https://res.cloudinary.com/ddkef5waq/image/upload/v1724404629/enzapp/komercja-hero1400x400_dyvnu8.png"
        :mainSrcSource="['https://res.cloudinary.com/ddkef5waq/image/upload/v1724406814/enzapp/komercja-hero300x200_jwfogr.png',
          'https://res.cloudinary.com/ddkef5waq/image/upload/v1724404628/enzapp/komercja-hero600x200_qxwue2.png',
          'https://res.cloudinary.com/ddkef5waq/image/upload/v1724404629/enzapp/komercja-hero800x300_coqrqb.png']"
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
      <v-col  xs="12" sm="10" md="9" lg="8"  v-if="!showStock.length" class="px-0 px-sm-3 d-flex justify-center 100w">
      <v-progress-circular
        size="36"
        color="primary"
        indeterminate
      ></v-progress-circular>

      <!-- <v-sheet v-if="!showStock.length"
        class="pa-12"
        color="secondary"
        rounded="xl"
        >
          <p class="text-h5 my-3 ff-nunito">Niestety nasion komercyjnych nie znaleziono</p>

        </v-sheet> -->
      </v-col>  

      <v-col v-else xs="12" sm="10" md="9" lg="8" class="px-0 px-sm-3">

        <!-- visible on screen  (width < 600)  -->
        <v-data-table
        fixed-header
        :headers="headersMobile"
        :items="showStock"
        class="h-100 d-flex d-sm-none"
        item-value="index"
        >
        <template v-slot:item="{ item }">
        <tr @click="selectBatch(item)">
            <td class="py-2">
              <span class="font-weight-regular text-medium-emphasis text-subtitle-2">{{ item.Product_full_name }}</span>
              <br />
              <span class="text-uppercase font-weight-medium">{{ item.Article_abbreviated }}</span>
              <br/>
              <span class="font-weight-light text-medium-emphasis text-subtitle-2">{{ item.Batch_number }} {{ item.Lot_number }}</span>
            </td>
            <td class="tabular-nums text-end py-2">
              <span class="tabular-nums font-weight-light text-medium-emphasis text-subtitle-2">
                <v-chip color="red" variant="tonal" density="comfortable" v-if="!item.Quantity_usable">Niedostępne</v-chip>
                <v-chip class="my-1" color="red" variant="tonal" density="comfortable" v-if="item.Blocked_indicator">Blokada</v-chip>
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

        <!-- visible on screen  (width > 600)  -->

        <v-data-table
        v-model:expanded="expanded"
        fixed-header
        :headers="headers"
        :items="showStock"
        class="h-100 d-none d-sm-flex"
        item-value="index"
        show-expand
        >
          <template v-slot:item="{ item }">
            <tr @click="selectBatch(item)">
              <td class="text-end  py-2" >
                <span class="text-uppercase">{{ item.Batch_number }}</span>
                <br/>
                <span class="font-weight-thin text-medium-emphasis text-subtitle-2">{{item.Lot_number}}</span>
              </td>
              <td>
                <span class="text-uppercase py-2">{{ item.Article_abbreviated }}</span>
                <br/> 
                <span class="font-weight-thin text-medium-emphasis text-subtitle-2 py-2">{{item.Product_full_name}}</span>
              </td>
              <td class="text-end">
                <span class="text-uppercase">{{ item.Number_balance }}</span>
                <br/> 
                <span class="font-weight-thin text-medium-emphasis text-subtitle-2">
                  <v-chip color="red" variant="tonal" density="comfortable" v-if="!item.Quantity_usable">Niedostępne</v-chip>
                  <v-chip class="my-1" color="red" variant="tonal" density="comfortable" v-if="item.Blocked_indicator">Blokada</v-chip>
                  <span v-else>{{item.Quantity_usable}} {{item.Unit_code}}</span>
                </span>
              </td>
              <td class="">
                <span class="text-uppercase">{{  item.Packaging_abbreviated }}</span>
                <br/> 
                <span class="font-weight-thin text-medium-emphasis text-subtitle-2">{{item.Quantity_balance}} {{item.Unit_code}}</span>
              </td>
              </tr>              
              
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <v-bottom-sheet 
      max-height="70vh"
      v-model="sheet"
      inset
    >
      <v-card>
        <v-fab
            :active="sheet"
            class=""
            :color="familyType?.color ? familyType.color : '#61cb6f'"
            icon="mdi-close"
            location="bottom end"
            size="small"
            position="sticky"
             @click="() => {sheet = !sheet; raportBatch = {}}"
             appear
             app
        ></v-fab>
        <v-img
                    v-if="findVareityInKatalog"
                     :color="familyType?.color ? familyType.color : '#9b91f9'"
                    class="mx-4 mt-6 mb-0"
                    rounded="xl"
                    cover
                    max-height="300px"                   
                    :src="{ src: findVareityInKatalog['imgs'][0], lazySrc: familyType?.src, aspect: '16/9' }"
                    >
                    <!-- <template #sources>
                      <source media="(max-width: 460px)" :srcset="crop.imgs[0]">
                      <source media="(max-width: 840px)" :srcset="crop.imgs[0]">
                      <source media="(max-width: 900px)" :srcset="crop.imgs[0]">
                    </template>-->
                    
                    <div class=" pb-6 ff-nunito d-flex h-100 flex-wrap justify-start align-end ff-nunito">
                      <div>
                      <h3 
                        :style="familyType?.color ? 'background-color:'+ familyType?.color : 'background-color:' + '#61cb6f'" 
                        class="rounded-e-xl text-h5 my-3 px-4 py-1 d-inline-block "
                      >{{sheetData.Article_abbreviated}}</h3><br/>
                      <p
                      :style="familyType?.color ? 'background-color:'+ familyType?.color : 'background-color:' + '#61cb6f'" 
                      class="rounded-e-xl px-4 py-1 font-weight-light d-inline-block"
                      >{{ sheetData.Product_full_name }}</p>  
                      </div>
                    </div> 
        </v-img>

        <v-card-item>

          <div class="pb-3 d-flex justify-end flex-wrap">  
            <v-chip class="ml-3 mt-3" color="red" variant="tonal" density="comfortable" v-if="!sheetData.Quantity_usable">Niedostępne</v-chip>
            <v-chip class="ml-3 mt-3" color="red" variant="tonal" density="comfortable" v-if="!raportBatch.Release_for_allocation">{{raportBatch.Batch_number?'Brak alokacji':'Brak raportu'}}</v-chip>
            <v-chip class="ml-3 mt-3" color="red" variant="tonal" density="comfortable" v-if="sheetData.Blocked_indicator">Blokada</v-chip>
            <v-chip class="ml-3 mt-3" variant="tonal" density="comfortable" v-if="!findVareityInKatalog">Brak w katalogu</v-chip>
            <v-chip class="ml-3 mt-3" variant="tonal" density="comfortable" v-if="showSampleBatch.length == 0">Brak sampli</v-chip>
            <v-chip class="ml-3 mt-3" variant="tonal" density="comfortable" v-if="showBatchPrice.length == 0">Brak w cenniku</v-chip>
          </div>

          <div v-if="!findVareityInKatalog">

            <v-card-title class="text-h5">
              {{sheetData.Article_abbreviated}}
              <p class="text-subtitle-1">{{sheetData.Product_full_name}}</p>
            </v-card-title>
            
            <v-card-subtitle>
              {{sheetData.Batch_number}} <span class="font-weight-thin text-medium-emphasis text-subtitle-1"> {{sheetData.Lot_number}}</span>
            </v-card-subtitle>
          </div>
          <div v-else>

            <span class="text-medium-emphasis text-subtitle-2">Partja <span class="font-weight-thin text-medium-emphasis">(partja mateczna)</span></span>
            <v-card-title class="text-h5">
              {{sheetData.Batch_number}} <span class="font-weight-thin text-medium-emphasis">( {{ sheetData.Sales_batch_number }} )</span>
            </v-card-title>

            <v-card-subtitle>
              {{sheetData.Lot_number}}
            </v-card-subtitle>

          </div>
          
          <v-sheet
              class="py-3 d-flex justify-space-around flex-wrapflex-wrap"
              v-if="raportBatch.Batch_number"
            >
            <v-sheet
            >
              <span class="text-medium-emphasis text-subtitle-2">Germinacja:</span>
              <div class="pt-2">
              <v-progress-circular
                :model-value="raportBatch.USA_Germ"
                :rotate="360"
                :size="100"
                :width="6"
                :color="familyType?.color ? familyType?.color : '#61cb6f'"
              >
              <span 
              class="d-flex  flex-column align-center">
                <span >{{ raportBatch.USA_Germ }}%</span>
                <span class="font-weight-thin text-medium-emphasis text-subtitle-2"> {{ toPolishTime(raportBatch.USA_Germ_date ) }} </span>
              </span>
              </v-progress-circular>
              </div>
            </v-sheet>

            <v-sheet
            >
              <span class="text-medium-emphasis text-subtitle-2">Przydatność:</span>
              <div class="pt-2">
              <v-progress-circular
                :model-value="batchLiveSpan()"
                :rotate="360"
                :size="100"
                :width="6"
                :color="familyType?.color ? familyType?.color : '#61cb6f'"
              >
              <span 
              class="d-flex  flex-column align-center">
                <span >{{ raportBatch?.Packing_date ? toPolishTime(raportBatch.Packing_date) : toPolishTime(raportBatch.Expiry_date  - 63072000000 ) }}</span>
                <span class=""> {{ raportBatch?.Packing_date ? toPolishTime(raportBatch.Packing_date + 63072000000 ) : toPolishTime(raportBatch.Expiry_date ) }} </span>
              </span>
              </v-progress-circular>
              </div>
            </v-sheet>

            
            <v-sheet
            >
              <span class="text-medium-emphasis text-subtitle-2">Ważność:</span>
              <div class="pt-2">
              <v-progress-circular
                model-value="100"
                :rotate="360"
                :size="100"
                :width="6"
                :color="raportBatch.Expiry_date > new Date().getTime()? familyType?.color || 'primary' : '#e53935'"
              >
              <span 
              class="d-flex  flex-column align-center">
                <span class=""> {{toPolishTime(raportBatch.Expiry_date)}} </span>
              </span>
              </v-progress-circular>
              </div>
            </v-sheet>
            
          </v-sheet>
          <div class="pt-3">
          <span class="text-medium-emphasis text-subtitle-2">Waga tysiąca nasion:</span>
          <br/>
            <span>{{raportBatch.TCW}} gram</span>
          </div>
        </v-card-item>

        <v-card-text>
          <v-divider />

          <div class="py-3">
              <span class="text-medium-emphasis text-subtitle-2">Stan komercji</span>
              <br/>
                <span class="text-uppercase">{{  sheetData.Number_balance }}</span> x <span class="text-uppercase">{{  sheetData.Packaging_abbreviated }}</span>
                <span class="font-weight-thin text-medium-emphasis text-subtitle-1"> ({{sheetData.Quantity_balance}} {{sheetData.Unit_code}})</span>
              <br/>
              <span class="text-medium-emphasis text-subtitle-2">Dostępne</span>
              <br/>
                <span>{{sheetData.Quantity_usable}} {{sheetData.Unit_code}}</span>
            
          </div>

          <div v-if="showBatchPrice.length != 0">
          <v-divider />
            <div class="py-3">
              
            <span class="text-medium-emphasis text-subtitle-2">Cennik</span>
              <p v-for="(item,kay) in showBatchPrice"
              >{{item.name.toUpperCase()}} {{item.packing}} x {{item.price}}zł</p>
              
            </div>
          </div>

          <div v-if="showSampleBatch.length != 0">
          <v-divider />
            <div class="py-3">
              
            <span class="text-medium-emphasis text-subtitle-2">Stan sampli</span>
              <p v-for="(item,kay) in showSampleBatch"
              >{{item.Description}} {{item.Number_of_packs}} x {{item.Packaging}} B:{{item.Batch}} {{ new Date(item.Packing_date).toLocaleString("pl-PL", { year: "numeric", month: "numeric"}) }}</p>
              
            </div>
          </div>

          <div v-if="findVareityInKatalog">
          <v-divider />

            <div class="py-3">
            <v-btn 
              :style="familyType?.color ? 'background-color:'+ familyType?.color : 'background-color:' + '#61cb6f'"
              :to="{name: 'crop', params: {name: findVareityInKatalog.name}}" 
              elevation="1" 
              class="ff-nunito text-caption" 
              rounded="pill"  
            >Zobacz w katalogu</v-btn>
            </div>
          </div>

          <div class="d-none py-3">

            {{raportBatch}}
          </div>

          <div class=" d-none py-3">
            {{findVareityInKatalog}}
          </div>
          <div class="d-none py-3">
              {{sheetData}}
          </div>

        </v-card-text>
      </v-card>
    </v-bottom-sheet>
    </v-container>
    `,
  setup() {
    const route = useRoute();
    const store = useStore();
    const raportBatch = ref([]);
    const searchValue = ref("");
    const db = getDatabase(app);
    const sheet = ref(false);
    const sheetData = ref({});
    const filterShow = ref(false);
    const filterValues = ref([]);
    const expanded = ref([]);

    const headersMobile = ref([
      { title: "Nazwa", align: "start", key: "Article_abbreviated" },
      { title: "Ilość/Opakowanie", align: "end", key: "Packaging_abbreviated" },
    ]);

    const showStock = computed(() =>
      store.getters.getStockFromStore.filter((ele) => {
        return (
          ele.Article_abbreviated.includes(searchValue.value.toUpperCase()) &&
          (filterValues.value.length > 0
            ? filterValues.value.includes(ele.Crop_code)
            : true)
        );
      })
    );

    const filterItems = computed(() => [
      ...new Set(store.getters.getStockFromStore.map((ele) => ele.Crop_code)),
    ]);

    const familyType = computed(() =>
      store.getters.getCropsListFromStore.find((ele) => {
        return ele.crop == sheetData.value.Crop_code;
      })
    );

    const showBatchPrice = computed(() =>
      store.getters.getPriceListFromStore.filter((ele) => {
        return (
          ele.name
            .toUpperCase()
            .replace(" ", "_")
            .includes(sheetData.value.Article_abbreviated.replace(" ", "_")) &&
          comparePacking(ele.packing, sheetData.value.Packaging_abbreviated)
        );
      })
    );

    const showSampleBatch = computed(() =>
      store.getters.getSampleFromStore.filter((ele) => {
        return ele.Description.toUpperCase()
          .replace(" ", "_")
          .includes(sheetData.value.Article_abbreviated.replace(" ", "_"));
      })
    );

    const findVareityInKatalog = computed(() =>
      store.getters.getKatalogFromStore.find((ele) =>
        ele.name
          .toLocaleLowerCase()
          .includes(sheetData?.value.Article_abbreviated.toLocaleLowerCase())
      )
    );

    const batchLiveSpan = () => {
      const twoYears = 63072000000;
      const time = new Date().getTime();
      let batchAge;
      if (raportBatch?.value.Packing_date) {
        batchAge = ((time - raportBatch.value.Packing_date) / twoYears) * 100;
      } else {
        batchAge =
          ((time - (raportBatch.value.Expiry_date - twoYears)) / twoYears) *
          100;
      }

      return Math.round(batchAge);
    };

    const headers = ref([
      { title: "Partia", align: "end", key: "Batch_number" },
      { title: "Nazwa", align: "start", key: "Article_abbreviated" },
      { title: "Ilość", align: "end", key: "Number_balance" },
      { title: "Pakowanie", align: "Packaging_abbreviated" },
    ]);

    const toPolishTime = (date) =>
      new Date(date).toLocaleString("pl-PL", {
        year: "numeric",
        month: "numeric",
      });

    const toPLAccountingStandards = (num) =>
      new Intl.NumberFormat("pl-PL", {
        style: "currency",
        currency: "PLN",
      }).format(num);

    const selectBatch = (item) => {
      sheet.value = !sheet.value;
      sheetData.value = item;
      const rBatch = query(
        fref(db, "raport"),
        orderByChild("Batch_number"),
        startAt(sheetData.value.Batch_number),
        endAt(sheetData.value.Batch_number)
      );
      onValue(rBatch, (snapshot) => {
        if (snapshot.val()) {
          let keys = Object.keys(snapshot.val());
          raportBatch.value = snapshot.val()[keys[0]];
        }
      });
    };

    const comparePacking = (item1, item2) => {
      const milTest = (num) => (num <= 20 ? num * 1000000 : num);
      return (
        item1.toString().replace(".", "").replace(" ", "").match(/\d+/g)[0] ==
        milTest(
          item2.toString().replace(".", "").replace(" ", "").match(/\d+/g)[0]
        )
      );
    };

    onMounted(async () => {
      const stock = fref(db, "stock");
      onValue(stock, (snapshot) => {
        store.dispatch("insertStockToStore", snapshot.val());
        console.log("data dispatched");
        
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
      expanded,
      sheetData,
      familyType,
      showSampleBatch,
      raportBatch,
      filterShow,
      filterItems,
      filterValues,
      batchLiveSpan,
      selectBatch,
      toPLAccountingStandards,
      toPolishTime,
      cropCodeToFullCropName,
      findVareityInKatalog,
      showBatchPrice,
    };
  },
};

export default stock;
