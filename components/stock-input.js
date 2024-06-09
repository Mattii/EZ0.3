import { ref, computed, onMounted, watch } from "vue";
import { useStore } from 'vuex';
import {
  getDatabase,
  query,
  orderByValue,
  orderByKey,
  orderByChild,
  onValue,
  startAt,
  endAt,
  set,
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import { ref as fref } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import app from "../modules/firebase.js";


const stocImput = {
  template: `
    <v-file-input
    multiple
    prepend-icon=""
    variant="solo"
    label="załaduj plik"
    truncate-length="15"
    density="compact"
    type="file"
    @change="readJsonFile"
    @click:clear="clearFiled"
    id="file"
    accept=".xls,.xlsx"
    bg-color="primary"
    rounded="pill"
  >
  <template v-slot:prepend>
      <v-btn
        color="secondary"
        icon="mdi-file-excel"
      ></v-btn>
    </template>
  </v-file-input>
    `,
  emits:['stockReady', 'raportReady','symfoniaReady'],
  setup(props, context) {
    
    const db = getDatabase(app);
    const store = useStore();
    async function readJsonFile(rawFile) {

      for(let e = 0 ;e < rawFile.target.files.length; e++){
        if(rawFile.target.files[e]?.name.includes("stock")){
          let stock = await convertXLSXtoJSON(rawFile.target.files[e])
          stockEmiter(stock);
        } else if(rawFile.target.files[e]?.name.includes("raport")){
          let raport = await convertXLSXtoJSON(rawFile.target.files[e])
          raportEmiter(raport);
        } else if(rawFile.target.files[e]?.name.includes("sample")){
          let sample = await convertXLSXtoJSON(rawFile.target.files[e])
          sampleEmiter(sample);
        } else if(rawFile.target.files[e]?.name.includes("cennik")) {
          let cennik = await convertXLSXtoJSON(rawFile.target.files[e])

          set(fref(db, 'cennik'), cennik.map((ele) => {
            ele.name = ele.name?.toLowerCase()
            ele.segment = ele.segment?.toLowerCase()
            ele.price = +Number.parseFloat(ele.price).toFixed(2)
            return ele
          }));
        } else if(rawFile.target.files[e]?.name.includes("symfonia")){
          let symfonia = await convertXLSXtoJSON(rawFile.target.files[e])
          symfoniaReady(symfonia);
        }
      }


    }

    const convertXLSXtoJSON = (rawFile) => {
      
      let fileReader = new FileReader();

      fileReader.readAsBinaryString(rawFile);

      return new Promise((resolve, reject) => {
        fileReader.onload = (event) => {
          let data = event.target.result;
          if (window.Worker) {
            // …
            const myWorker = new Worker("/workers/xlsx.js");
            console.log("worker works");
            console.log("Message posted to worker");
            myWorker.postMessage(data);
            myWorker.onmessage = (e) => {
              console.log("Message received from worker");
              resolve(e.data)
            };
          } else {
            let workbook = XLSX.read(data, { type: "binary", cellDates: true });
  
            workbook.SheetNames.forEach((sheet) => {
              let rawStock = XLSX.utils.sheet_to_row_object_array(
                workbook.Sheets[sheet],
                { dateNF: "yyyy-mm" }
              );
  
              let stock = rawStock.map((ele) => {
                return Object.assign(
                  {},
                  ...Object.keys(ele).map((key) => {
                    let newKey = key.replace(/\n/g, " ").replace(/V\//g, "").replace(/\s+/g, "_");
                    return { [newKey]: ele[key] };
                  })
                );
              });
              resolve(stock)
            });
          }
        };
      })
      
    }

    function stockEmiter(stock) {
      set(fref(db, 'stock'), stock);
      store.dispatch('insertStockToStore', stock);
    }

    function raportEmiter(raport) {
      store.dispatch('insertRaportToStore', raport);
    }

    function sampleEmiter(sample) {
      set(fref(db, 'sample'), sample);
      store.dispatch('insertSampleToStore', sample);
    }

    function symfoniaReady(symfonia) {
      store.dispatch('insertSymfoniaToStore', symfonia);
    }
    

    function clearFiled() {
      return console.log("test clear");
    }

    return {
      readJsonFile,
      clearFiled,
    };
  },
};
export default stocImput;
