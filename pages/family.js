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
          :lazySrc="route.query.lazySrc"
        >
        <v-row>
          <v-col>
            <v-btn icon variant="text">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.66669 13.3334C2.66669 13.3334 7.33335 18.6667 16 18.6667C24.6667 18.6667 29.3334 13.3334 29.3334 13.3334" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M5.33335 15.526L2.66669 18.6667" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M29.3333 18.6667L26.6719 15.5312" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M11.8854 18.2396L10.6667 22" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M20.0834 18.25L21.3334 22" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </v-btn>            
            <v-btn icon variant="text">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M27.5 15.5C28.7726 14.234 29.7449 12.6635 29.7449 10.8766C29.7515 9.08308 29.0526 7.40165 27.7866 6.13563C26.5205 4.86961 24.8391 4.17066 23.0522 4.17066C21.2652 4.17066 19.5772 4.86961 18.3112 6.13563L16.8078 7.63903C16.3792 8.06104 15.6275 8.06104 15.2055 7.63903L13.6955 6.12903C12.4229 4.85642 10.7414 4.15747 8.94789 4.15747C7.16755 4.15747 5.48612 4.85642 4.2201 6.11585C2.95407 7.38187 2.26172 9.0633 2.26172 10.8502C2.26831 12.6438 2.96726 14.3252 4.23328 15.5912L16.0165 27.3745L18.5 24.8895" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M25.9874 18.6953C25.9874 19.5237 25.3159 20.1953 24.4874 20.1953C23.659 20.1953 22.9874 19.5237 22.9874 18.6953C22.9874 17.8669 23.659 17.1953 24.4874 17.1953C25.3159 17.1953 25.9874 17.8669 25.9874 18.6953Z" fill="white"/>
                <path d="M23.0854 22C23.0854 22.8284 22.4138 23.5 21.5854 23.5C20.7569 23.5 20.0854 22.8284 20.0854 22C20.0854 21.1716 20.7569 20.5 21.5854 20.5C22.4138 20.5 23.0854 21.1716 23.0854 22Z" fill="white"/>
              </svg>
            </v-btn>
            <v-btn icon variant="text">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.9108 18.3L18.0581 21.5288" stroke="white" stroke-width="2" stroke-linecap="round"/>
                <path d="M11.9501 13.3503L18.0809 10.0905" stroke="white" stroke-width="2" stroke-linecap="round"/>
                <circle cx="7" cy="16" r="3" fill="white"/>
                <circle cx="23" cy="24" r="3" fill="white"/>
                <circle cx="23" cy="8" r="3" fill="white"/>
              </svg>
            </v-btn>

          </v-col>
        </v-row>
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
      <v-col  xs="12" md="10" lg="8" class="d-flex flex-wrap justify-space-evenly">
          <div
            v-for="(item, index) in crops"
            class="py-4"
          >
            <vareity-card
              :key="index"
              v-if="item"
              :item="item"
              :stock="stock"
              :color="route.query.color"
              :altImg="route.query.src"
            ></vareity-card>
          </div>
      </v-col>
    </v-row>
  </v-container>`,
  props: {
    crop: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const route = useRoute();
    const crops = ref({});
    const stock = ref([]);
    console.log("route props:", props.crop);
    function readJsonFile(rawFile) {
      let fileReader = new FileReader();

      fileReader.onload = (event) => {
        let data = event.target.result;

        if (window.Worker) {
          // …
          const myWorker = new Worker("/workers/xlsx.js");
          console.log("worker works");
          console.log("Message posted to worker");
          myWorker.postMessage(data);
          myWorker.onmessage = (e) => {
            stock.value = e.data;
            console.log("Message received from worker");
          };
        } else {
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
        }
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
        startAt(route.params.family),
        endAt(route.params.family + "\uf8ff")
      );
      onValue(dbCrops, (snapshot) => {
        crops.value = snapshot.val();
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
