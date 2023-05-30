import { ref, reactive, onMounted } from "vue";

const home = {
  template: `          
  <v-container fluid>
    <v-row justify="center">
      <v-col xs="12" sm="11" md="10">
        <hero-element
        
        >
          <v-btn class="mb-3 text-caption crete-round" block color="#FEFB08" dark
          >Eksploruj</v-btn>
        </hero-element>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col  xs="12" md="10" lg="9" class="d-flex flex-wrap justify-space-evenly">
        <div>
          karta odmian 
        </div>
      </v-col>
    </v-row>
  </v-container>`,
  setup() {
    const katalog = ref({});

    onMounted(async () => {
      try {
        const newKatalog = await fetch(
          "https://nuxtestapp-default-rtdb.europe-west1.firebasedatabase.app/katalog/.json"
        ).then((res) => res.json());
        katalog.value = newKatalog;
      } catch (error) {
        console.log(error);
      }

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
    };
  },
};

export default home;
