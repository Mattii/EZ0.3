import { ref, reactive, onMounted } from "vue";

const home = {
  template: `          
  <v-container fluid>
    <v-row justify="center">
      <v-col xs="12" sm="11" md="10">
        <hero-element
        
        >
          <v-btn class="mb-3 text-caption ff-crete-round" block color="#FEFB08"
          >Eksploruj</v-btn>
        </hero-element>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col  xs="12" md="10" lg="8" class="d-flex flex-wrap justify-space-evenly">
          <router-link 
            v-for="(crop, index) in crops"
            key="index"
            class="my-3 "
            :to="{name: 'crop', params: {crop: crop.crop}, query: crop}">
            <v-card
              :color="crop.color"
              class="v-theme--dark"
              min-width="260"
            >
            <v-img
              :src="crop.src"
              class="align-end"
              gradient="20deg, rgba(25,32,72,.7), rgba(25,32,72,.3), rgba(255,255,255,0), rgba(255,255,255,0)"
              height="200px"
              cover
            >
            <v-card-item>
                <v-card-title class="ff-crete-round">{{crop.title}}</v-card-title>
                </v-card-item>
            </v-img>
            </v-card>
          </router-link>
      </v-col>
    </v-row>
  </v-container>`,
  setup() {
    const katalog = ref({});
    const crops = ref([
      {
        crop: "LT",
        src: "https://res.cloudinary.com/ddkef5waq/image/upload/v1684477105/enzapp/salata_gwjbqh.jpg",
        lazySrc: "../assets/salata.jpg",
        color: "#3682bc",
        title: "Słaty",
        subtitle: "najlepszy wybór do hydroponiki i gruntu",
      },
      {
        crop: "TO",
        src: "https://res.cloudinary.com/ddkef5waq/image/upload/v1686559569/enzapp/pomidory_lk7zmk.png",
        lazySrc: "../assets/pomidory.jpg",
        color: "#E80A0A",
        title: "Pomidory",
        subtitle: "najlepszy wybór do hydroponiki i gruntu",
      },
      {
        crop: "CC",
        src: "https://res.cloudinary.com/ddkef5waq/image/upload/v1687157206/enzapp/ogorki_banwj2.png",
        lazySrc: "../assets/ogorki.png",
        color: "#1E700D",
        title: "Ogórki",
        subtitle: "najlepszy wybór do hydroponiki i gruntu",
      },
      {
        crop: "SP",
        src: "https://res.cloudinary.com/ddkef5waq/image/upload/v1684477638/enzapp/3.Pepper_yellow_preview_lbjt3r.jpg",
        lazySrc: "../assets/paryki.jpg",
        color: "#c18200",
        title: "Papryki",
        subtitle: "najlepszy wybór do hydroponiki i gruntu",
      },
      {
        crop: "RA",
        src: "https://res.cloudinary.com/ddkef5waq/image/upload/v1684477638/enzapp/1.Radish_red_preview_cnfpuz.jpg",
        lazySrc: "../assets/rzodkiewki.jpg",
        color: "#900A2F",
        title: "Rzodkiewki",
        subtitle: "najlepszy wybór do hydroponiki i gruntu",
      },
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
