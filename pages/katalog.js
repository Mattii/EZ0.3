import { ref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getDatabase, query, orderByValue, orderByKey, orderByChild, onValue, startAt, endAt } from  "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import {ref as fref } from  "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import app from "../modules/firebase.js"

const crop = {
  template: `          
  <v-container fluid>
    <v-row justify="center">
      <v-col xs="12" sm="11" md="10" lg="8">
        <catalog-hero></catalog-hero>
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
            <main-vareity-card
              v-if="item"
              :item="item"
              :stock="stock"
            ></main-vareity-card>
            </router-link>
          </v-col>
          </v-col>
    </v-row>
  </v-container>`,
  setup() {
    const route = useRoute();
    const crops = ref({});
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
      const db = getDatabase(app);

      const katalog = fref(db, 'katalog');
      const mostViewedPosts = query(fref(db, 'katalog'), orderByChild('crop'), startAt("TO"), endAt("TO"));
      onValue(katalog, (snapshot) => {
         crops.value = snapshot.val();
         console.log(snapshot.val());
       });
    });

    return {
      route,
      crops,
      stock,
      readJsonFile,
      clearFiled,
      onMounted,
    };
  },
};

export default crop;
