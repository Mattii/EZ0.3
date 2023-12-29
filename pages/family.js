import { ref, reactive, onMounted } from "vue";
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

const crop = {
  template: `          
  <v-container fluid>
  <v-row justify="center">
    <v-col xs="12" sm="10" md="9" lg="8" >
      <family-hero-element
      :color="familyType.color"
      :src="familyType.src"
      :title="familyType.title"
      ></family-hero-element>
      </v-col>
    </v-row>

    <v-row justify="center" class="">
    <v-col  xs="12" sm="10" md="9" lg="8" class="pa-0 ma-0 d-flex flex-wrap justify-center">
          <v-col  xs="12" sm="6" md="4" class="d-flex flex-wrap justify-space-evenly"             
          v-for="(item, index) in crops"
            key="index">
            <router-link 
            class="w-100 h-100"
            :to="">
            <v-sheet
              rounded="xl"
              :color="familyType.color"
              width="100%"
              min-width="200px"
              class="v-theme--dark overflow-hidden"
            >
              <v-row no-gutters justify="space-around">
                <v-col cols="12">
                  <v-img
                    class="w-100 h-100"
                    rounded="xl"
                    cover
                    max-height="200px"
                    :src="{ src: item.imgs[0], lazySrc: familyType.src || '../assets/salata.jpg', aspect: '16/9' }"
                    >
                    <div class=" pb-6 ff-nunito d-flex h-100 flex-wrap justify-start align-end">
                      <h2 :style="'background-color:'+ familyType.color" class=" rounded-e-xl px-9 py-1 text-h5 ff-nunito">{{item.name}}</h2>
                    </div>
                  </v-img>
                </v-col>
              </v-row>
            </v-sheet>
            
          </router-link>
          </v-col>
          </v-col>
    </v-row>
  </v-container>`,
  setup(props) {
    const route = useRoute();
    const store = useStore();
    const familyType = ref({});
    const crops = ref({});
    const stock = ref([]);

    onMounted(async () => {

      const db = getDatabase(app);

      const dbCrops = query(
        fref(db, "katalog"),
        orderByChild("crop"),
        startAt(route.params.family),
        endAt(route.params.family + "\uf8ff")
      );
      onValue(dbCrops, (snapshot) => {
        crops.value = snapshot.val();
      });
      // try {
      //   const newKatalog = await fetch(
      //     `https://nuxtestapp-default-rtdb.europe-west1.firebasedatabase.app/katalog.json?orderBy="crop"&startAt="${route.params.crop}"&endAt="${route.params.crop}\uf8ff"`
      //   ).then((res) => res.json());
      //   crop.value = newKatalog;
      // } catch (error) {
      //   console.log(error);
      // }

      familyType.value = store.getters.getCropFromStore(route.params.family)
    });

    return {
      route,
      crops,
      familyType,
      stock,
      onMounted,
    };
  },
};

export default crop;
