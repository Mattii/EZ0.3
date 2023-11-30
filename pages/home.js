import { ref, reactive, onMounted } from "vue";

const home = {
  template: `          
  <v-container fluid>
    <v-row justify="center">
      <v-col xs="12" sm="10" md="9" xl="8">
        <main-hero>
        </main-hero>
      </v-col>
    </v-row>

    <v-row justify="center" class="">
    <v-col  xs="12" sm="10" md="9" xl="8" class="pa-0 ma-0 d-flex flex-wrap justify-space-evenly">
          <v-col  xs="12" sm="6" md="4" xl="3" class="d-flex flex-wrap justify-space-evenly"             
          v-for="(crop, index) in crops"
            key="index">
            
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
                    <div class="px-8 pt-6 pb-9 h-100 ff-nunito d-flex flex-wrap justify-end">
                      <h2 class="text-h5 ff-nunito">{{crop.title}}</h2>
                    </div>
                  </v-img>
                </v-col>
              </v-row>
            </v-sheet>
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
    const katalog = ref({});
    const crops = ref([
      {
        crop: "LT",
        src: "https://res.cloudinary.com/ddkef5waq/image/upload/v1701333265/enzapp/sala_u6emol.png",
        lazySrc: "../assets/salata.jpg",
        color: "#9D94C2",
        title: "Słaty",
        subtitle: "najlepszy wybór do hydroponiki i gruntu",
      },
      {
        crop: "ED",
        src: "https://res.cloudinary.com/ddkef5waq/image/upload/v1701249930/enzapp/sal_it9gl4.png",
        lazySrc: "../assets/endive.png",
        color: "#94C2A6",
        title: "Endive",
        subtitle: "najlepszy wybór do hydroponiki i gruntu",
      },
      {
        crop: "TO",
        src: "https://res.cloudinary.com/ddkef5waq/image/upload/v1701249930/enzapp/pom_se5gvw.png",
        lazySrc: "../assets/pomidory.jpg",
        color: "#C294B6",
        title: "Pomidory",
        subtitle: "najlepszy wybór do hydroponiki i gruntu",
      },
      {
        crop: "CC",
        src: "https://res.cloudinary.com/ddkef5waq/image/upload/v1701249930/enzapp/ogo_tetxi2.png",
        lazySrc: "../assets/ogorki.png",
        color: "#94C2B4",
        title: "Ogórki",
        subtitle: "najlepszy wybór do hydroponiki i gruntu",
      },
      // {
      //   crop: "SP",
      //   src: "https://res.cloudinary.com/ddkef5waq/image/upload/v1684477638/enzapp/3.Pepper_yellow_preview_lbjt3r.jpg",
      //   lazySrc: "../assets/paryki.jpg",
      //   color: "#c18200",
      //   title: "Papryki",
      //   subtitle: "najlepszy wybór do hydroponiki i gruntu",
      // },
      // {
      //   crop: "RA",
      //   src: "https://res.cloudinary.com/ddkef5waq/image/upload/v1684477638/enzapp/1.Radish_red_preview_cnfpuz.jpg",
      //   lazySrc: "../assets/rzodkiewki.png",
      //   color: "#900A2F",
      //   title: "Rzodkiewki",
      //   subtitle: "najlepszy wybór do hydroponiki i gruntu",
      // },
      // {
      //   crop: "B_CF",
      //   src: null,
      //   lazySrc: "../assets/rzodkiewki.png",
      //   color: "#39741C",
      //   title: "Kalafiory",
      //   subtitle: "najlepszy wybór do hydroponiki i gruntu",
      // },
      // {
      //   crop: "B_",
      //   src: null,
      //   lazySrc: "../assets/rzodkiewki.png",
      //   color: "#5D9F70",
      //   title: "Kapusty",
      //   subtitle: "najlepszy wybór do hydroponiki i gruntu",
      // },
      // {
      //   crop: "B_KR",
      //   src: null,
      //   lazySrc: "../assets/rzodkiewki.png",
      //   color: "#3C9900",
      //   title: "Kalarepy",
      //   subtitle: "najlepszy wybór do hydroponiki i gruntu",
      // },
    ]);

    onMounted(async () => {
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
