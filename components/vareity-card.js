const vareityCard = {
  template: `   
                      <v-card :color="item.color" class="mx-auto" max-width="324" min-width="300">
                        <v-img
                          src="./assets/salata.jpg"
                          height="180px"
                          class="white--text align-end"
                          cover
                        >
                          <v-card-title class="text-h py-2">
                            {{ item.name }}
                          </v-card-title>
                        </v-img>
      
                        <v-card-actions>
                          <v-btn icon @click="show = !show">
                            <v-icon
                              >{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down'
                              }}</v-icon
                            >
                          </v-btn>
                          <v-btn text> Listen Now </v-btn>
                        </v-card-actions>
      
                        <v-expand-transition>
                          <div v-show="show">
                            <v-divider></v-divider>
      
                            <v-card-text>

                              <ul v-if="Object.keys(prices).length">
                                <li v-for="(price, index) in prices" :key="index">
                                  {{ price }}
                                </li>
                              </ul>
                              <span v-else>brak ceny w cenniku</span>

                              <ul v-if="availableStock.length">
                                <li
                                  v-for="(batch, index) in availableStock"
                                  :key="index"
                                >
                                  {{ batch }}
                                </li>
                              </ul>
                              <p v-else>brak na stanie</p>
                              
                            </v-card-text>
                          </div>
                        </v-expand-transition>
                      </v-card>`,
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      prices: [],
      show: true,
    };
  },
  computed: {
    availableStock() {
      return this.$attrs.stock.filter(
        (element) => this.item.name.toUpperCase() == element["Product name"]
      );
    },
  },
  mounted: async function () {
    try {
      const prices = await fetch(
        `https://nuxtestapp-default-rtdb.europe-west1.firebasedatabase.app/cennik.json?orderBy="name"&startAt="${this.item.name.toUpperCase()}"&endAt="${this.item.name.toUpperCase()}\uf8ff"`
      ).then((res) => res.json());
      this.prices = prices;
    } catch (error) {
      console.log("error");
    }
  },
};
export default vareityCard;
