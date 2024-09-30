import { ref, reactive,computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useStore } from 'vuex';
import { getDatabase, query, orderByValue, orderByKey, orderByChild, onValue, startAt, endAt } from  "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import {ref as fref } from  "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import app from "../modules/firebase.js"
import cropCodeToFullCropName from "../modules/cropCodeToFullCropName.js"

const crop = {
  template: `          
  <v-container fluid>
    <v-row justify="center">
      <v-col xs="12" sm="10" md="9" lg="8">
        <catalog-hero></catalog-hero>
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
          v-model.trim="searchValue"
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

    <v-row justify="center" class="">
    <v-col  xs="12" sm="10" md="9" lg="8" class="pa-0 ma-0 d-flex flex-wrap justify-center">
          <v-col  xs="12" sm="6" md="4" class="d-flex flex-wrap justify-space-evenly"             
          v-for="(item, index) in showCrops"
            key="index">
            <router-link 
            class="w-100 h-100"
            :to="{name: 'crop', params: {name: item.name}}">
            <main-vareity-card
              v-if="item"
              :item="item"
              :stock="stock"
            ></main-vareity-card>
            </router-link>
          </v-col>
          </v-col>
    </v-row>
  </v-container>`,
  setup() {
    const route = useRoute();
    const store = useStore();
    const crops = ref({});
    const stock = ref([]);
    const filterShow = ref(false);
    const filterValues = ref([]);
    const searchValue = ref("");

    // const filterItems = computed(() => [...new Set(store.getters.getKatalogFromStore.map(ele => ele.crop))]);
    
    const filterItems = computed(() => [...new Set(store.getters.getKatalogFromStore.map(ele => ele.crop))]);

    const showCrops = computed(() => store.getters.getKatalogFromStore.filter(ele => {

      return ele.name.toLocaleLowerCase().includes(searchValue.value.toLocaleLowerCase()) && (filterValues.value.length > 0?filterValues.value.includes(ele.family):true)
    }));

    onMounted(async () => {
      const db = getDatabase(app);


        const katalog = fref(db, "katalog");
        onValue(katalog, (snapshot) => {
          store.dispatch('insertKatalogToStore', snapshot.val())
          crops.value = snapshot.val();
        });
      
    });

    return {
      route,
      crops,
      stock,
      showCrops,
      filterShow,
      filterItems,
      filterValues,
      onMounted,
      searchValue,
      cropCodeToFullCropName,
    };
  },
};

export default crop;
