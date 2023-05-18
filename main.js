import { createApp, ref, reactive, onMounted } from "vue";
import { createVuetify } from "vuetify";
import vareityCard from "./components/vareity-card.js";

const vuetify = createVuetify();

const app = createApp({
  setup() {
    const compayName = ref("Enza Zaden");
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
      // ('https://nuxtestapp-default-rtdb.europe-west1.firebasedatabase.app/cennik.json?orderBy="name"&startAt="fairly"&endAt="fairly\uf8ff"');
      // const cennik = await fetch(
      //   "https://nuxtestapp-default-rtdb.europe-west1.firebasedatabase.app/cennik.json"
      // ).then((res) => res.json());
      // this.cennik = cennik;
    });

    return {
      compayName,
      katalog,
      stock,
      readJsonFile,
      clearFiled,
      onMounted,
    };
  }
});

app.component("vareity-card", vareityCard);
app.use(vuetify);
app.mount("#app");
