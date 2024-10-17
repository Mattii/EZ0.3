import { ref, reactive, onMounted, computed} from "vue";
import { useStore } from 'vuex';
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

const priceList = {
  template: `          
  <v-container fluid>
    <v-row justify="center">
      <v-col xs="12" sm="11" md="10" lg="8">
        <price-hero></price-hero>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" sm="6" md="4">
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
          class="mt-3"
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
            class=""
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
      <v-col  xs="12" md="10" lg="8" class="d-flex flex-wrap justify-space-evenly">
        <!-- visible on screen  (width < 600)  -->
      <v-data-table
        fixed-header
        :headers="headersMobile"
        :items="searchedPriceList"
        class="h-100 d-flex d-sm-none"
        item-value="index"
        density="comfortable"
      >
      <template v-slot:item="{ item }">
        <tr>
          <td class="">
              
            <span v-if="item.new" class="rounded-xl px-3 mr-1 py-0 bg-red">Nowość</span>
            <span v-if="item.hrez" class="rounded-xl px-3 py-0 mr-1 bg-red-darken-3 text-decoration-underline">HREZ</span>
            <span v-if="item.cgmmv_hr" class="rounded-xl px-3 py-0 mr-1 bg-green">CGMMV HR</span>
            <span v-if="item.bio" class="rounded-xl px-3 py-0 mr-1 bg-green-darken-3">BIO</span>
            <br v-if="item.new || item.hrez || item.bio || item.cgmmv_hr" />
            <span class="font-weight-regular text-medium-emphasis text-subtitle-2">{{cropCodeToFullCropName(item.family)}}</span>
            <br />
            <span class="text-uppercase font-weight-medium">{{ item.name }}</span>
            <br/>
            <span class="font-weight-light text-medium-emphasis text-subtitle-2">{{item?.segment}}</span>
          </td>
          <td class="tabular-nums text-end">
              
            <br v-if="item.new || item.hrez || item.bio || item.cgmmv_hr" />
            <span class="tabular-nums font-weight-regular text-subtitle-2">{{item.packing}}</span>
            <br/>
            <span class="tabular-nums font-weight-medium">{{ toPLAccountingStandards(item.price) }}</span> 
            <br/>
            <span class="tabular-nums font-weight-light text-medium-emphasis text-subtitle-2">{{ toPLAccountingStandards(Number.parseFloat(item.price + item.price * 0.08).toFixed(2)) }}</span>          
          </td>
        </tr>
      </template>
      </v-data-table>
      <!-- visible on screen  (width > 600)  -->
      <v-data-table
        fixed-header
        :headers="headers"
        :items="searchedPriceList"
        class="h-100 d-none d-sm-flex"
        item-value="index"
      >
      <template v-slot:item="{ item }">
        <tr>
          <td><span class="text-uppercase">{{ item.name }}</span> <br/> <span class="font-weight-thin text-medium-emphasis text-subtitle-2">{{item?.segment}}</span></td>
          <td class="text-end">{{ cropCodeToFullCropName(item.family) }}</td>
          <td class="tabular-nums text-end">{{ toPLAccountingStandards(item.price) }}</td>
          <td class="tabular-nums font-weight-thin text-medium-emphasis text-subtitle-2">{{ toPLAccountingStandards(Number.parseFloat(item.price + item.price * 0.08).toFixed(2)) }}</td>
          <td class="text-end">{{ item.packing }}</td>
        </tr>
      </template>
      </v-data-table>
      </v-col>
    </v-row>
  </v-container>`,
  setup() {
    const route = useRoute();
    const store = useStore();
    const prices = ref([]);
    const stock = ref([]);
    const searchValue = ref('');
    const filterShow = ref(false);
    const filterValues = ref([])

    const headersMobile = ref([
      { title: 'Nazwa', align: 'start', key: 'name' },
      { title: 'Cena/Opakowanie', align: 'end', key: 'price' },
    ])

    const headers = ref([
      { title: 'Nazwa', align: 'start', key: 'name' },
      { title: 'Rodzina', align: 'end', key: 'family' },
      { title: 'Cena(netto)', align: 'end', key: 'price' },
      { title: 'Cena(brutto)', align: 'start' },
      { title: 'Opakowanie', align: 'end', key: 'packing' },
    ])

    const filterItems = computed(() => [...new Set(store.getters.getPriceListFromStore.map(ele => ele.family))]);

    const searchedPriceList = computed(() => store.getters.getPriceListFromStore.filter(ele => {
      return ele.name.includes(searchValue.value.toLowerCase()) && (filterValues.value.length > 0?filterValues.value.includes(ele.family):true)
    }));
    
    const toPLAccountingStandards = (num) => new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(
      num,
    )

    onMounted(async () => {


        const db = getDatabase(app);

        const priceList = query(fref(db, "cennik"), orderByChild("name"));
        onValue(priceList, (snap) => {
          prices.value = snap.val();
          store.dispatch('insertPriceListToStore', snap.val())
          console.log(snap.val());
        });


    });

    return {
      route,
      prices,
      stock,
      headers,
      headersMobile,
      searchValue,
      searchedPriceList,
      filterShow,
      filterValues,
      filterItems,
      onMounted,
      cropCodeToFullCropName,
      toPLAccountingStandards
    };
  },
};

export default priceList;
