import { ref, computed, onMounted, watch } from "vue";
const stocImput = {
  template: `
    <v-file-input
    prepend-icon=""
    variant="solo"
    label="Wyszukaj raport"
    truncate-length="15"
    density="compact"
    type="file"
    @change="readJsonFile"
    @click:clear="clearFiled"
    id="file"
    accept=".xls,.xlsx"
    bg-color="#9b91f9"
    rounded="pill"
  >
  <template v-slot:prepend>
      <v-btn
        color="#64d273"
        icon="mdi-file-excel"
      ></v-btn>
    </template>
  </v-file-input>
    `,
  emits:['stockReady'],
  setup(props, context) {

    function readJsonFile(rawFile) {
      let fileReader = new FileReader();

      fileReader.onload = (event) => {
        let data = event.target.result;
        console.log(event.target.result);
        if (window.Worker) {
          // …
          const myWorker = new Worker("/workers/xlsx.js");
          console.log("worker works");
          console.log("Message posted to worker");
          myWorker.postMessage(data);
          myWorker.onmessage = (e) => {
            stockRaportEmiter(e.data)
            console.log("Message received from worker");
          };
        } else {
          let workbook = XLSX.read(data, { type: "binary", cellDates: true });
          workbook.SheetNames.forEach((sheet) => {
            let rawStock = XLSX.utils.sheet_to_row_object_array(
              workbook.Sheets[sheet],
              { dateNF: "yyyy-mm" }
            );

            stockRaportEmiter(rawStock.map((ele) => {
              return Object.assign(
                {},
                ...Object.keys(ele).map((key) => {
                  let newKey = key.replace(/\n/g, " ").replace(/\s+/g, "_");
                  return { [newKey]: ele[key] };
                })
              );
            }))
          });
        }
        
      };
      fileReader.readAsBinaryString(rawFile.target.files[0]);
    }

    function stockRaportEmiter(stock) {
      context.emit('stockReady', stock);
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
