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
                  <v-chip class="my-1" color="red" variant="tonal" density="comfortable" v-if="item.Blocked_indicator">Blokada</v-chip>
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

    <v-bottom-sheet 
      max-height="70vh"
      v-model="sheet"
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
             @click="sheet = !sheet"
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

          <div class="my-3 d-flex flex-row-reverse">
            <v-chip class="mr-3" variant="tonal" density="comfortable" v-if="!findVareityInKatalog">Brak w katalogu</v-chip>
            <v-chip class="mr-3" variant="tonal" density="comfortable" v-if="showSampleBatch.length == 0">Brak sampli</v-chip>
            <v-chip class="mr-3" variant="tonal" density="comfortable" v-if="showBatchPrice.length == 0">Brak w cenniku</v-chip>  
            <v-chip class="mr-3" color="red" variant="tonal" density="comfortable" v-if="!sheetData.Quantity_usable">Niedostępne</v-chip>
            <v-chip class="mr-3" color="red" variant="tonal" density="comfortable" v-if="sheetData.Blocked_indicator">Blokada</v-chip>
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
              <p v-for="(item,kay) in showBatchPrice" class="text-body-2"
              >{{item.name.toUpperCase()}} {{item.packing}} x {{item.price}}zł</p>
              
            </div>
          </div>

          <div v-if="showSampleBatch.length != 0">
          <v-divider />
            <div class="py-3">
              
            <span class="text-medium-emphasis text-subtitle-2">Stan sampli</span>
              <p v-for="(item,kay) in showSampleBatch" class="text-body-2"
              >{{item.Description}} {{item.Number_of_packs}} x {{item.Packaging}} B:{{item.Batch}} {{ new Date(item.Packing_date).toLocaleString("pl-PL", { year: "numeric", month: "numeric"}) }}</p>
              
            </div>
          </div>

          <div v-if="findVareityInKatalog">
          <v-divider />

            <div class="py-3">
            <v-btn 
              :style="familyType?.color ? 'background-color:'+ familyType?.color : 'background-color:' + '#61cb6f'"
              :to="{name: 'crop', params: {name: sheetData.Article_abbreviated.toLowerCase().replace(' ', '_')}}" 
              elevation="1" 
              class="ff-nunito text-caption" 
              rounded="pill"  
            >Zobacz w katalogu</v-btn>
            </div>
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

    const familyType = computed(() => store.getters.getCropsListFromStore.find(ele => {
      return ele.crop == sheetData.value.Crop_code
    })); 

    const showBatchPrice = computed(() => store.getters.getPriceListFromStore.filter(ele => {
     
      return ele.name.toUpperCase().replace(' ', '_').includes(sheetData.value.Article_abbreviated.replace(' ', '_')) && comparePacking(ele.packing, sheetData.value.Packaging_abbreviated)
    }));

    const showSampleBatch= computed(() => store.getters.getSampleFromStore.filter(ele => {
     
      return ele.Description.toUpperCase().replace(' ', '_').includes(sheetData.value.Article_abbreviated.replace(' ', '_'))
    }));

    const findVareityInKatalog = computed(() => store.getters.getKatalogFromStore[`${sheetData.value.Article_abbreviated.toLowerCase().replace(' ', '_')}`]);

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
      }  

      const comparePacking = (item1, item2) => {
        const milTest = (num) => num <= 20 ? num * 1000000 : num 
        return item1.toString().replace('.', '').replace(' ', '').match(/\d+/g)[0] == milTest(item2.toString().replace('.', '').replace(' ', '').match(/\d+/g)[0])
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
      familyType,
      showSampleBatch,
      selectBatch,
      toPLAccountingStandards,
      findVareityInKatalog,
      showBatchPrice,
    };
  },
};

export default stock;
