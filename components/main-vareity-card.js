import { ref, computed, onMounted } from "vue";
import { getDatabase, query, orderByValue, orderByKey, orderByChild, onValue, startAt, endAt } from  "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import {ref as fref } from  "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import app from "../modules/firebase.js"
import { useStore } from 'vuex';

const vareityCard = {
  template: `   
            <v-sheet
              rounded="xl"
              :color="familyType?.color ? familyType.color : '#9b91f9'"
              width="100%"
              min-width="200px"
              class="v-theme--dark overflow-hidden"
            >
              <v-row no-gutters justify="space-around">
                <v-col cols="12">
                  <v-img
                    class="w-100 h-100"
                    rounded="xl"
                    cover
                    max-height="200px"
                    :src="{ src: item.imgs[0], lazySrc: familyType?.src || '../assets/salata.jpg', aspect: '16/9' }"
                    >
                    <template #sources>
                      <source media="(max-width: 460px)" :srcset="item.imgs[0]">
                      <source media="(max-width: 840px)" :srcset="item.imgs[0]">
                      <source media="(max-width: 900px)" :srcset="item.imgs[0]">
                    </template>
                    <div class=" pb-6 ff-nunito d-flex h-100 flex-wrap justify-start align-end ff-nunito">
                      <div>
                      <h3 
                        :style="familyType?.color ? 'background-color:'+ familyType?.color : 'background-color:' + '#61cb6f'" 
                        class="rounded-e-xl my-3 px-4 py-1 d-inline-block "
                      >{{item.name}}</h3><br/>
                      <p
                      :style="familyType?.color ? 'background-color:'+ familyType?.color : 'background-color:' + '#61cb6f'" 
                      class="rounded-e-xl px-4 py-1 font-weight-light d-inline-block"
                      >{{ item.segment }}</p>  
                      </div>
                    </div>
                  </v-img>
                </v-col>
              </v-row>
            </v-sheet>
            `,
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
    const store = useStore();
    const familyType = ref({})

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

       familyType.value = store.getters.getCropFromStore(props.item.family)
    });

    return {
      prices,
      show,
      getPrice,
      availableStock,
      onMounted,
      familyType
    };
  },
};
export default vareityCard;
