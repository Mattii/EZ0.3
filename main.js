const data = {
    compayName: "Enza Zaden",
    katalog: {},
    cennik: [],
    stoc:[],
  };
  const methods = {
    readJsonFile (rawFile) {

        let fileReader = new FileReader();

        fileReader.readAsBinaryString(rawFile);

        fileReader.onload = (event) => {
            let data = event.target.result;
            let workbook = XLSX.read(data, {type: "binary"});
            workbook.SheetNames.forEach((sheet) => {
                let stoc = XLSX.utils.sheet_to_row_object_array(
                    workbook.Sheets[sheet]
                );
                console.log(stoc);
                this.stoc = stoc;
            });
        };
    },
    clearFiled () {
      return console.log("test clear");
    },
  };
  const computed = {

  }
  Vue.component('vareity-card', {
    template: `   <v-card
                    :color="item.color"
                    dark
                    max-width="320"
                  >
                    <v-card-title class="text-h5">
                      {{ item.name }}
                    </v-card-title>
        
                    <v-card-subtitle>{{ item.description }}</v-card-subtitle>
                    <v-card-text>
                        <ul v-if="Object.keys(prices).length">
                            <li v-for="(price, index) in prices" :key="index">{{ price }}</li>
                        </ul>
                        <p v-else>brak ceny w cenniku</p>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn text>
                        Listen Now
                      </v-btn>
                    </v-card-actions>
                  </v-card>`,
    props: {
      item: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        prices: []
      }
    },
    mounted: async function() {
        try {
            const prices = await fetch(`https://nuxtestapp-default-rtdb.europe-west1.firebasedatabase.app/cennik.json?orderBy="name"&startAt="${this.item.name.toUpperCase()}"&endAt="${this.item.name.toUpperCase()}\uf8ff"`).then((res) => res.json());
            this.prices = prices;
        } catch (error) {
            console.log("error");
        }
    }
  })


  new Vue({
    el: "#app",
    vuetify: new Vuetify(),
    data,
    methods,
    computed,
    mounted: async function() {
      const katalog = await fetch("https://nuxtestapp-default-rtdb.europe-west1.firebasedatabase.app/katalog/.json").then((res) => res.json());
      this.katalog = katalog;

      // 'https://nuxtestapp-default-rtdb.europe-west1.firebasedatabase.app/cennik.json?orderBy="name"&startAt="fairly"&endAt="fairly\uf8ff"'
      const cennik = await fetch("https://nuxtestapp-default-rtdb.europe-west1.firebasedatabase.app/cennik.json").then((res) => res.json())
      this.cennik = cennik
    },
  });