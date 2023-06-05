import { ref, computed, onMounted } from "vue";
const vareityCard = {
  template: `   
                      <v-card :color="item.color" class="mx-auto"  min-width="260" theme="dark">
                        <v-img
                          :src="{ src: item.imgs[0], lazySrc: '../assets/salata.jpg', aspect: '16/9' }"
                          height="180px"
                          class="white--text align-end"
                          gradient="20deg, rgba(25,32,72,.7), rgba(25,32,72,.3), rgba(255,255,255,0), rgba(255,255,255,0)"
                          cover
                        >
                          <v-card-title class="pb-0">
                            {{ item.name }}
                          </v-card-title>
                          <v-card-subtitle class="pb-2">
                            {{ item.segment }}
                          </v-card-subtitle>
                        </v-img>
      
                        <v-card-actions>
                          <v-btn icon @click="show = !show">
                            <v-icon
                              >{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down'
                              }}</v-icon
                            >
                          </v-btn>
                          <v-icon v-if="stock.length">{{!availableStock.length ? 'mdi-signal-cellular-outline' : 'mdi-signal-cellular-3'}}</v-icon>
                          <v-spacer></v-spacer>
                          <v-btn text> więcej </v-btn>
                        </v-card-actions>
      
                        <v-expand-transition>
                          <div v-show="show" class="pb-3">
                            <v-divider></v-divider>

                            <v-list :bg-color="item.color" lines="one">
                            <v-list-subheader>Ceny</v-list-subheader>
                              <v-list-item
                                v-if="Object.keys(prices).length"
                                v-for="(price, index) in prices"
                                :key="item.title"
                                :title="getPrice(price)"
                                :subtitle="price.packing"
                              ></v-list-item>
                              <v-list-item v-else>brak ceny</v-list-item>
                            </v-list>
                            

                            <v-list :bg-color="item.color" v-if="stock.length" lines="one">
                            <v-list-subheader>Dostępność</v-list-subheader>
                              <v-list-item
                                v-if="availableStock.length"
                                v-for="(batch, index) in availableStock"
                                :key="index"
                                :title="batch['Stock_WARSZAWA'] + ' ' + batch['Unit_code']"
                                :subtitle="batch['Packaging']"
                              ></v-list-item>
                              <v-list-item v-else>brak na stanie</v-list-item>
                            </v-list>
                            
                          </div>
                        </v-expand-transition>
                      </v-card>`,
  props: {
    item: {
      type: Object,
      required: true,
    },
    stock: {
      type: Array,
      required: false,
      default: [],
    },
  },
  setup(props) {
    const prices = ref([]);
    const show = ref(false);

    const availableStock = computed(() => {
      return props.stock.filter(
        (element) => props.item.name.toUpperCase() == element["Product_name"]
      );
    });

    const getPrice = (price) => {
      return `${price.price}zł (${price.price + price.price * 0.08}zł)`;
    };

    onMounted(async () => {
      try {
        const freshPrices = await fetch(
          `https://nuxtestapp-default-rtdb.europe-west1.firebasedatabase.app/cennik.json?orderBy="name"&startAt="${props.item.name.toLowerCase()}"&endAt="${props.item.name.toLowerCase()}\uf8ff"`
        ).then((res) => res.json());
        prices.value = freshPrices;
      } catch (error) {
        console.log("error");
      }
    });

    return {
      prices,
      show,
      getPrice,
      availableStock,
      onMounted,
    };
  },
};
export default vareityCard;
