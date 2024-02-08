import { ref, reactive, computed,  onMounted } from "vue";
import { useStore } from 'vuex';

const home = {
  template: `          
  <v-container fluid>
    <v-row justify="center">
      <v-col xs="12" sm="10" md="9" lg="8" >
        <main-hero>
        </main-hero>
      </v-col>
    </v-row>

    <v-row justify="center" class="">
    <v-col  xs="12" sm="10" md="9" lg="8" class="pa-0 ma-0 d-flex flex-wrap justify-center">
          <v-col  xs="12" sm="6" md="4" lg="3" class="d-flex flex-wrap justify-space-evenly"             
          v-for="(crop, index) in crops"
            key="index">
            <router-link 
            class="w-100 h-100"
            :to="{name: 'family', params: {family: crop.crop}}">
            <v-sheet
              rounded="xl"
              :color="crop.color"
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
                    :src="{ src: crop.src, aspect: '16/9' }"
                    >
                    <div class="px-9 py-6 py-sm-7 py-lg-6 px-lg-9 h-100 ff-nunito d-flex flex-wrap justify-end">
                      <h2 class="text-h4 text-sm-h5 text-lg-h6 ff-nunito">{{crop.title}}</h2>
                    </div>
                  </v-img>
                </v-col>
              </v-row>
            </v-sheet>
            
          </router-link>
          </v-col>
          </v-col>
    </v-row>

    <!-- <v-row justify="center">
      <v-col  xs="12" sm="11" md="10" lg="8" class="d-flex flex-wrap justify-space-evenly">
          <router-link 
            v-for="(crop, index) in crops"
            key="index"
            class="ma-3"
            :to="{name: 'family', params: {family: crop.crop}, query: crop}">
            <v-card
              :color="crop.color"
              class="v-theme--dark"
              min-width="290"
            >
              <v-img
                :src="{ src: crop.src, lazySrc: crop.lazySrc || '../assets/salata.jpg', aspect: '4/3' }"
                class="align-end"
                gradient="20deg, rgba(25,32,72,.7), rgba(25,32,72,.3), rgba(255,255,255,0), rgba(255,255,255,0)"
                height="200px"
                cover
              >
                <v-card-item>
                  <v-card-title class="ff-nunito">{{crop.title}}</v-card-title>
                </v-card-item>
              </v-img>
            </v-card>
          </router-link>
      </v-col>
    </v-row> -->
  </v-container>`,
  setup() {
    
    const store = useStore();
    const katalog = ref({});
    const crops = ref([])
    
    onMounted(async () => {
      crops.value = store.getters.getCropsListFromStore
      // try {
      //   const newKatalog = await fetch(
      //     "https://nuxtestapp-default-rtdb.europe-west1.firebasedatabase.app/katalog/.json"
      //   ).then((res) => res.json());
      //   //console.log(Object.values(newKatalog).filter(e => e.imgs[0] == "https://res.cloudinary.com/ddkef5waq/image/upload/v1684477105/enzapp/salata_gwjbqh.jpg").map(e => e.name));
      //   katalog.value = newKatalog;
      // } catch (error) {
      //   console.log(error);
      // }
      // fetch(
      //  'https://nuxtestapp-default-rtdb.europe-west1.firebasedatabase.app/katalog.json?orderBy="crop"&startAt="LT"&endAt="LT\uf8ff"'
      //).then((res) => res.json()).then(data => console.log(data));
      // ('https://nuxtestapp-default-rtdb.europe-west1.firebasedatabase.app/cennik.json?orderBy="name"&startAt="fairly"&endAt="fairly\uf8ff"');
      // const cennik = await fetch(
      //   "https://nuxtestapp-default-rtdb.europe-west1.firebasedatabase.app/cennik.json"
      // ).then((res) => res.json());
      // this.cennik = cennik;
    });

    return {
      katalog,
      onMounted,
      crops,
    };
  },
};

export default home;
