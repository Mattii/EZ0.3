import { ref, computed, onMounted } from "vue";
const stocImput = {
  template: `
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
    `,
    setup() {

      const stock = ref([]);

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
  
  
      return {
        route,
        crops,
        stock,
        readJsonFile,
        clearFiled,
      };
    },
};
export default stocImput;
