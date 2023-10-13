import { ref, computed, onMounted, watch } from "vue";
const stocImput = {
  template: `
    <v-file-input
    multiple
    prepend-icon=""
    variant="solo"
    label="Załaduj raport"
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
  emits:['stockReady', 'raportReady'],
  setup(props, context) {

    async function readJsonFile(rawFile) {

      for(let e = 0 ;e < rawFile.target.files.length; e++){
        if(rawFile.target.files[e]?.name.includes("stock")){
          let stock = await convertXLSXtoJSON(rawFile.target.files[e])
          stockEmiter(stock);
        } else if(rawFile.target.files[e]?.name.includes("raport")){
          let raport = await convertXLSXtoJSON(rawFile.target.files[e])
          raportEmiter(raport);
        } else if(rawFile.target.files[e]?.name.includes("cennik")) {
          let cennik = await convertXLSXtoJSON(rawFile.target.files[e])
          console.log(cennik.map((ele) => {
            ele.name = ele.name?.toLowerCase()
            ele.segment = ele.segment?.toLowerCase()
            ele.price = +Number.parseFloat(ele.price).toFixed(2)
            return ele
          }));
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
                    let newKey = key.replace(/\n/g, " ").replace(/\s+/g, "_");
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
      context.emit('stockReady', stock);
      console.log(stock);
    }

    function raportEmiter(raport) {
      context.emit('raportReady', raport);
      console.log(raport);
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
