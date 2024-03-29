import { ref, computed, onMounted } from "vue";
import { getDatabase, query, orderByValue, orderByKey, orderByChild, onValue, startAt, endAt } from  "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import {ref as fref } from  "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import app from "../modules/firebase.js"

const vareityCard = {
  template: `   
                      <v-card :color="color || item.color" class="mx-auto"  min-width="260" theme="dark">
                        <v-img
                          :src="{ src: item.imgs[0], lazySrc: altImg || '../assets/salata.jpg', aspect: '4/3' }"
                          height="180px"
                          class="white--text align-end"
                          gradient="20deg, rgba(25,32,72,.7), rgba(25,32,72,.3), rgba(255,255,255,0), rgba(255,255,255,0)"
                          cover
                        >
                        <v-card-item>
                          <v-card-title class="pb-0 ff-nunito">
                            {{ item.name }}
                          </v-card-title>
                          <v-card-subtitle class="pb-2 ff-nunito">
                            {{ item.segment }}
                          </v-card-subtitle>
                          </v-card-item>
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

                            <v-list :bg-color="color || item.color" lines="one">
                            <v-list-subheader>Ceny</v-list-subheader>
                              <v-list-item
                                v-if="prices"
                                v-for="(price, index) in prices"
                                :key="item.title"
                                :title="getPrice(price)"
                                :subtitle="price.packing"
                              ></v-list-item>
                              <v-list-item v-else>brak ceny</v-list-item>
                            </v-list>
                            

                            <v-list :bg-color="color || item.color" v-if="stock.length" lines="one">
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
    color: {
      type: String,
      required: false,
    },
    altImg: {
      type: String,
      required: false,
    },
  },
  setup(props) {
    const prices = ref({});
    const show = ref(false);

    const availableStock = computed(() => {
      return props.stock.filter(
        (element) => props.item.name.toUpperCase() == element["Product_name"]
      );
    });

    const getPrice = (price) => {
      return `${price.price}zł (${Number.parseFloat(price.price + price.price * 0.08).toFixed(2)}zł)`;
    };

    onMounted(async () => {
      //podczas pobierania przez SDK żle pobiera pozycje 0 i 1 jeżeli zbiór dnych jest tablicą
      const db = getDatabase(app);

      const cropPrices = query(fref(db, 'cennik'), orderByChild('name'), startAt(props.item.name.toLowerCase()), endAt(props.item.name.toLowerCase() + "\uf8ff"));
      onValue(cropPrices, (snapshot) => {

        prices.value = snapshot.val();
       });

      // try {
      //   const freshPrices = await fetch(
      //     `https://nuxtestapp-default-rtdb.europe-west1.firebasedatabase.app/cennik.json?orderBy="name"&startAt="${props.item.name.toLowerCase()}"&endAt="${props.item.name.toLowerCase()}\uf8ff"`
      //   ).then((res) => res.json());
      //   prices.value = freshPrices;
      // } catch (error) {
      //   console.log("error");
      // }
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
