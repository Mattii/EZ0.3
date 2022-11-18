import { createApp } from "vue";
import { createVuetify } from "vuetify";
import vareityCard from './components/vareity-card.js';

const vuetify = createVuetify();

const app = createApp({
  data() {
    return {
      compayName: "Enza Zaden",
      katalog: {},
      cennik: [],
      stock: [],
    };
  },
  methods: {
    readJsonFile(rawFile) {
      let fileReader = new FileReader();

      fileReader.onload = (event) => {
        let data = event.target.result;
        let workbook = XLSX.read(data, { type: "binary" });
        workbook.SheetNames.forEach((sheet) => {
          let stock = XLSX.utils.sheet_to_row_object_array(
            workbook.Sheets[sheet]
          );
          console.log(stock);
          this.stock = stock;
        });
      };

      fileReader.readAsBinaryString(rawFile.target.files[0]);
    },
    clearFiled() {
      return console.log("test clear");
    },
  },
  mounted: async function () {
    const katalog = await fetch(
      "https://nuxtestapp-default-rtdb.europe-west1.firebasedatabase.app/katalog/.json"
    ).then((res) => res.json());
    this.katalog = katalog;

    ('https://nuxtestapp-default-rtdb.europe-west1.firebasedatabase.app/cennik.json?orderBy="name"&startAt="fairly"&endAt="fairly\uf8ff"');
    const cennik = await fetch(
      "https://nuxtestapp-default-rtdb.europe-west1.firebasedatabase.app/cennik.json"
    ).then((res) => res.json());
    this.cennik = cennik;
  },
});

app.component("vareity-card", vareityCard);
app.use(vuetify);
app.mount("#app");