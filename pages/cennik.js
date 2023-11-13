import { ref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import {
  getDatabase,
  query,
  orderByValue,
  orderByKey,
  orderByChild,
  onValue,
  startAt,
  endAt,
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import { ref as fref } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import app from "../modules/firebase.js";

const priceList = {
  template: `          
  <v-container fluid>
    <v-row justify="center">
      <v-col xs="12" sm="11" md="10">
        <hero-element
        >
        </hero-element>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col  xs="12" md="10" lg="8" class="d-flex flex-wrap justify-space-evenly">
      <v-data-table-virtual
        fixed-header
        :headers="headers"
        :items="prices"
        height="400"
        item-value="index"
      >
      <template v-slot:item="{ item }">
      <tr>
        <td>{{ item.name }}</td>
        <td>{{ item.family }}</td>
        <td>{{ item.price }}</td>
        <td><strong>{{ Number.parseFloat(item.price + item.price * 0.08).toFixed(2) }}</strong></td>
        <td>{{ item.packing }}</td>
      </tr>
    </template>
      </v-data-table-virtual>
      </v-col>
    </v-row>
  </v-container>`,
  setup() {
    const route = useRoute();
    const prices = ref([]);
    const stock = ref([]);
    const headers = ref([
      { title: 'Nazwa', align: 'start', key: 'name' },
      { title: 'Rodzina', align: 'end', key: 'family' },
      { title: 'Cena(netto)', align: 'end', key: 'price' },
      { title: 'Cena(brutto)', align: 'end' },
      { title: 'Opakowanie', align: 'end', key: 'packing' },
    ])

    onMounted(async () => {
      const db = getDatabase(app);

      const priceList = query(fref(db, "cennik"), orderByChild("name"));
      onValue(priceList, (snap) => {
        prices.value = snap.val();
        console.log(snap.val());
      });
    });

    return {
      route,
      prices,
      stock,
      headers,
      onMounted,
    };
  },
};

export default priceList;
