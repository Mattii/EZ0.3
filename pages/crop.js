import { ref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import {
  getDatabase,
  query,
  orderByValue,
  orderByKey,
  orderByChild,
  onValue,
  startAt,
  endAt,
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import { ref as fref } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import app from "../modules/firebase.js";

const crop = {
  template: `          
  <v-container fluid>
    <v-row justify="center">
      <v-col xs="12" sm="11" md="10">
        <hero-element
          :src="route.query.src"
          :color="route.query.color"
          :title="route.query.title"
          :subtitle="route.query.subtitle"
        >
        </hero-element>
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
            v-for="(item, index) in crops"
            class="py-4"
          >
            <vareity-card
              :key="index"
              v-if="item"
              :item="item"
              :stock="stock"
            ></vareity-card>
          </div>
      </v-col>
    </v-row>
  </v-container>`,
  setup() {
    const route = useRoute();
    const crops = ref({});
    const stock = ref([]);
    console.log(route.query);
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

      const dbCrops = query(
        fref(db, "katalog"),
        orderByChild("crop"),
        startAt(route.params.crop),
        endAt(route.params.crop + "\uf8ff")
      );
      onValue(dbCrops, (snapshot) => {
        crops.value = snapshot.val();
        console.log(snapshot.val());
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
      crops,
      stock,
      readJsonFile,
      clearFiled,
      onMounted,
    };
  },
};

export default crop;
