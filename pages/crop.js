import { ref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";

const crop = {
  template: `          
  <v-container fluid>
    <v-row justify="center">
      <v-col xs="12" sm="11" md="10">
        <hero-element
          src="https://res.cloudinary.com/ddkef5waq/image/upload/v1684477105/enzapp/salata_gwjbqh.jpg"
          color="#3682bc"
          title="Słaty"
          subtitle="najlepszy wybór do hydroponiki i gruntu"
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
            v-for="(item, index) in crop"
            :key="index"
            class="py-4"
          >
            <vareity-card
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
    const crop = ref({});
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
          `https://nuxtestapp-default-rtdb.europe-west1.firebasedatabase.app/katalog.json?orderBy="crop"&startAt="${route.params.id}"&endAt="${route.params.id}\uf8ff"`
        ).then((res) => res.json());
        crop.value = newKatalog;
      } catch (error) {
        console.log(error);
      }
    });

    return {
      route,
      crop,
      stock,
      readJsonFile,
      clearFiled,
      onMounted,
    };
  },
};

export default crop;
