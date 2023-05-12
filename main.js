import { createApp } from "vue";
import { createVuetify } from "vuetify";
import vareityCard from './components/vareity-card.js';

const vuetify = createVuetify();

const app = createApp({
  data() {
    return {
      compayName: "Enza Zaden",
      katalog: {},
      stock: [],
    };
  },
  computed:{

  },
  methods: {
    readJsonFile(rawFile) {
      let fileReader = new FileReader();

      fileReader.onload = (event) => {
        let data = event.target.result;
        let workbook = XLSX.read(data, { type: "binary", cellDates:true });
        workbook.SheetNames.forEach((sheet) => {
          let stock = XLSX.utils.sheet_to_row_object_array(
            workbook.Sheets[sheet], { dateNF:'yyyy-mm'}
          );
          this.stock = stock.map(ele => {
            return Object.assign({}, ...Object.keys(ele).map(key => {
              let newKey = key.replace(/\n/g, " ").replace(/\s+/g, "_");
              return {[newKey]: ele[key]}
            }))
          });
          // console.log(JSON.stringify(stock.map(ele => {
          //   ele.name = ele.name.toLowerCase()
          //   return ele;
          // })));
        });
      };

      fileReader.readAsBinaryString(rawFile.target.files[0]);
    },
    clearFiled() {
      return console.log("test clear");
    },
  },
  mounted: async function () {
    try {
      const katalog = await fetch(
        "https://nuxtestapp-default-rtdb.europe-west1.firebasedatabase.app/katalog/.json"
      ).then((res) => res.json());
      this.katalog = katalog;
    } catch (error) {
      console.log(error);
    }


    // ('https://nuxtestapp-default-rtdb.europe-west1.firebasedatabase.app/cennik.json?orderBy="name"&startAt="fairly"&endAt="fairly\uf8ff"');
    // const cennik = await fetch(
    //   "https://nuxtestapp-default-rtdb.europe-west1.firebasedatabase.app/cennik.json"
    // ).then((res) => res.json());
    // this.cennik = cennik;
  },
});

app.component("vareity-card", vareityCard);
app.use(vuetify);
app.mount("#app");