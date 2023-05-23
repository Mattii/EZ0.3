import { ref, reactive, onMounted } from "vue";

const home = {
  template: `          
  <v-container fluid>
    <v-row justify="center">
      <v-col xs="12" sm="11" md="10">
        <v-sheet
          rounded
          color="#608634"
          width="100%"
          class="pt-3 v-theme--dark"
        >
        <v-row no-gutters justify="space-around">
          <v-col cols="12" sm="7">
          <v-img
            width="100%"
            src="https://res.cloudinary.com/ddkef5waq/image/upload/v1684482332/enzapp/hero_kmw5p3.jpg"
          >
          </v-img>
          </v-col>
          <v-col cols="12" sm="5" md="4" order-sm="first" align-self="center">
          <div class="px-6 py-3 crete-round">
            <h2 class="text-h5 mb-3 crete-round">Twój Katalog</h2>
            <p class="mb-5 text-body-2">najlepsze nasiona na wyciągnięcie ręki</p>
            <v-btn class="mb-3 text-caption crete-round" block color="#FEFB08" dark
              >Eksploruj</v-btn
            >
          </div>
          </v-col>
        </v-row>
        </v-sheet>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col xs="12" md="10">
        <v-file-input
          hide-input
          variant="underlined"
          label="Pobierze stock"
          truncate-length="15"
          type="file"
          @change="readJsonFile"
          @click:clear="clearFiled"
          id="file"
          accept=".xls,.xlsx"
        ></v-file-input>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col  xs="12" md="10" lg="9" class="d-flex flex-wrap justify-space-evenly">
          <div
            v-for="(item, index) in katalog"
            :key="index"
            class="py-4"
          >
            <vareity-card
              v-if="item"
              :item="item"
              :stock="stock"
            ></vareity-card>
          </div>
      </v-col>
    </v-row>
  </v-container>`,
  setup() {
    const katalog = ref({});
    const stock = ref([]);

    function readJsonFile(rawFile) {
      let fileReader = new FileReader();

      fileReader.onload = (event) => {
        let data = event.target.result;
        let workbook = XLSX.read(data, { type: "binary", cellDates: true });
        workbook.SheetNames.forEach((sheet) => {
          let rawStock = XLSX.utils.sheet_to_row_object_array(
            workbook.Sheets[sheet],
            { dateNF: "yyyy-mm" }
          );

          stock.value = rawStock.map((ele) => {
            return Object.assign(
              {},
              ...Object.keys(ele).map((key) => {
                let newKey = key.replace(/\n/g, " ").replace(/\s+/g, "_");
                return { [newKey]: ele[key] };
              })
            );
          });
        });
      };

      fileReader.readAsBinaryString(rawFile.target.files[0]);
    }

    function clearFiled() {
      return console.log("test clear");
    }

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
      stock,
      readJsonFile,
      clearFiled,
      onMounted,
    };
  },
};

export default home;
