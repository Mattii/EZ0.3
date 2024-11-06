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
  equalTo,
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
    <v-img
                    class="w-100 h-100"
                    rounded="xl"
                    cover
                    max-height="300px"                   
                    :src="imgSrc"
                    >
                    <template #sources>
                      <source media="(max-width: 460px)" :srcset="crop.imgs[0]">
                      <source media="(max-width: 840px)" :srcset="crop.imgs[0]">
                      <source media="(max-width: 900px)" :srcset="crop.imgs[0]">
                    </template>

                    <div class=" pb-6 ff-nunito d-flex h-100 flex-wrap justify-start align-end ff-nunito">
                      <div>
                      <h2 
                        :style="familyType?.color ? 'background-color:'+ familyType?.color : 'background-color:' + '#61cb6f'" 
                        class="rounded-e-xl my-3  text-h5  text-md-h4 px-4 py-1 d-inline-block "
                      >{{crop.name}}</h2><br/>
                      <p
                      :style="familyType?.color ? 'background-color:'+ familyType?.color : 'background-color:' + '#61cb6f'" 
                      class="rounded-e-xl px-4 py-1 font-weight-light d-inline-block"
                      >{{ crop.segment }}</p>  
                      </div>
                    </div>
                  </v-img>
      </v-col>
    </v-row>

    
    <v-row justify="center" class="">
      <v-col  xs="12" sm="10" md="9" lg="8" class="pa-0 ma-0 d-flex flex-wrap">
          <v-col 
            cols="6"
            sm="4"
            md="3"
            v-if="crop.type" 
            class="d-flex flex-wrap justify-space-evenly"
            >

            <v-sheet
              class="rounded-xl pa-3"
              width="100%"
              min-width="200px"
            >
            <v-chip class=" mb-3 font-weight-light text-subtitle-2">typ:</v-chip>
            <p class="">{{ crop.type }}</p>
            </v-sheet>
          </v-col>          

          <v-col 
            cols="6"
            sm="4"
            md="3"
            v-if="crop.cultivation" 
            class="d-flex flex-wrap justify-space-evenly"
            >

            <v-sheet
              class="rounded-xl pa-3"
              width="100%"
              min-width="200px"
            >
            <v-chip class=" mb-3 font-weight-light text-subtitle-2">uprawa:</v-chip>
            <p             
            v-for="(item, index) in crop.cultivation"
              key="index"
              class="">{{ item }}</p>
            </v-sheet>
          </v-col>   

          <v-col 
            cols="6"
            sm="4"
            md="3"
            v-if="crop.production" 
            class="d-flex flex-wrap justify-space-evenly"
            >

            <v-sheet
              class="rounded-xl pa-3"
              width="100%"
              min-width="200px"
            >
            <v-chip class=" mb-3 font-weight-light text-subtitle-2">produkcja:</v-chip>
            <p             
            v-for="(item, index) in crop.production"
              key="index"
              class="">{{ item }}</p>
            </v-sheet>
          </v-col>  

          <v-col 
            cols="6"
            sm="4"
            md="3"
            v-if="crop.shape" 
            class="d-flex flex-wrap justify-space-evenly"
            >

            <v-sheet
              class="rounded-xl pa-3"
              width="100%"
              min-width="200px"
            >
            <v-chip class=" mb-3 font-weight-light text-subtitle-2">kształt:</v-chip>
            <p             
              class="">{{ crop.shape }}</p>
            </v-sheet>
          </v-col>   

          <v-col 
            cols="6"
            sm="4"
            md="3"
            v-if="crop.intended" 
            class="d-flex flex-wrap justify-space-evenly"
            >

            <v-sheet
              class="rounded-xl pa-3"
              width="100%"
              min-width="200px"
            >
            <v-chip class=" mb-3 font-weight-light text-subtitle-2">przeznaczenie:</v-chip>
            <p             
            v-for="(item, index) in crop.intended"
              key="index"
              class="">{{ item }}</p>
            </v-sheet>
          </v-col>  

          <v-col 
            cols="6"
            sm="4"
            md="3"
            v-if="crop.early" 
            class="d-flex flex-wrap justify-space-evenly"
            >

            <v-sheet
              class="rounded-xl pa-3"
              width="100%"
              min-width="200px"
            >
            <v-chip class=" mb-3 font-weight-light text-subtitle-2">wczesność:</v-chip>
            <p class="">{{ crop.early }}</p>
            </v-sheet>
          </v-col>

          <v-col 
            cols="6"
            sm="4"
            md="3"
            v-if="crop.guardian" 
            class="d-flex flex-wrap justify-space-evenly "
            >

            <v-sheet
              class="rounded-xl pa-3"
              width="100%"
            >
            <v-chip class=" mb-3 font-weight-light text-subtitle-2">opiekun:</v-chip>
            <p class="">{{ crop.guardian }}</p>
            </v-sheet>
          </v-col>  

          <v-col 
            cols="6"
            sm="4"
            md="3"
            v-if="crop.resistance" 
            class="d-flex flex-wrap justify-space-evenly"
            >

            <v-sheet
              class="rounded-xl pa-3"
              width="100%"
              min-width="200px"
            >
            <v-chip class=" mb-3 font-weight-light text-subtitle-2">odporność:</v-chip>
            <p             
            v-for="(item, index) in crop.resistance"
              key="index"
              class="">{{ item }}</p>
            </v-sheet>
          </v-col>  

          <v-col 
            cols="12"
            sm="6"
            v-if="crop.plant" 
            class="d-flex flex-wrap justify-space-evenly"
            >

            <v-sheet
              class="rounded-xl pa-3"
              width="100%"
              min-width="200px"
            >
            <v-chip class=" mb-3 font-weight-light text-subtitle-2">roślina:</v-chip>
            <p             
            v-for="(item, index) in crop.plant"
              key="index"
              class="">{{ item }},</p>
            </v-sheet>
          </v-col>

          <v-col
            cols="12"
            sm="6"
            v-if="crop.frut"
            class="d-flex flex-wrap justify-space-evenly"
            >
            <v-sheet
              class="rounded-xl pa-3"
              width="100%"
              min-width="200px"
            >
            <v-chip class=" mb-3 font-weight-light text-subtitle-2">owoce:</v-chip>
            <p             
            v-for="(item, index) in crop.frut"
              key="index"
              class="">{{ item }},</p>
            </v-sheet>
          </v-col>

          <v-col
            cols="12"
            sm="6"
            v-if="crop.description"
            class="d-flex flex-wrap justify-space-evenly"
            >
            <v-sheet
              class="rounded-xl pa-3"
              width="100%"
              min-width="200px"
            >
            <v-chip class=" mb-3 font-weight-light text-subtitle-2">opis:</v-chip>
            <p class="">{{ crop.description }},</p>
            </v-sheet>
          </v-col>

          <v-col
            xs="12"
            sm="6"
            v-if="crop.remarks"
            class="d-flex flex-wrap justify-space-evenly"
            >
            <v-sheet
              class="rounded-xl pa-3"
              width="100%"
              min-width="200px"
            >
            <v-chip class=" mb-3 font-weight-light text-subtitle-2">uwagi:</v-chip>
            <p             
            v-for="(item, index) in crop.remarks"
              key="index"
              class="">{{ item }},</p>
            </v-sheet>
          </v-col>




          <v-col  xs="12" sm="6" md="4" class="d-flex flex-wrap justify-space-evenly"             
          v-for="(item, index) in crop"
            key="index">
            <v-sheet
              rounded="xl"
              :color="familyType?.color ? familyType.color : '#9b91f9'"
              width="100%"
              min-width="200px"
              class="pa-6 v-theme--dark overflow-hidden"
            >
            <p>{{ index }} {{ item }}</p>
            </v-sheet>
          </v-col>
        </v-col>
    </v-row>
  </v-container>`,
  setup(props) {
    const route = useRoute();
    const store = useStore();
    const familyType = ref({});
    const crop = ref({});
    const stock = ref([]);

    const imgSrc = ref("");

    onMounted(async () => {
      const db = getDatabase(app);

      const dbCrops = query(
        fref(db, "katalog"),
        orderByChild("name"),
        equalTo(route.params.name)
      );
      onValue(dbCrops, (snapshot) => {
        crop.value = Object.values(snapshot.val())[0];
        imgSrc.value = crop.value.imgs[0];
        familyType.value = store.getters.getCropFromStore(crop.value.family);
      });

      // try {
      //   const newKatalog = await fetch(
      //     `https://nuxtestapp-default-rtdb.europe-west1.firebasedatabase.app/katalog.json?orderBy="crop"&startAt="${route.params.crop}"&endAt="${route.params.crop}\uf8ff"`
      //   ).then((res) => res.json());
      //   crop.value = newKatalog;
      // } catch (error) {
      //   console.log(error);
      // }
    });

    return {
      route,
      crop,
      familyType,
      imgSrc,
      stock,
      onMounted,
    };
  },
};

export default crop;
