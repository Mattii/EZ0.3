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
        <price-hero></price-hero>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col  xs="12" md="10" lg="8" class="d-flex flex-wrap justify-space-evenly">
        <!-- visible on screen  (width < 600)  -->
      <v-data-table
        fixed-header
        :headers="headersMobile"
        :items="prices"
        class="h-100 d-flex d-sm-none"
        item-value="index"
      >
      <template v-slot:item="{ item }">
        <tr>
          <td>
            <span class="font-weight-thin text-medium-emphasis text-subtitle-2">{{item.family}}</span>
            <br />
            <span class="text-uppercase">{{ item.name }}</span>
            <br/>
            <span class="font-weight-thin text-medium-emphasis text-subtitle-2">{{item?.segment}}</span>
          </td>
          <td class="tabular-nums text-end">
            <span class="tabular-nums font-weight-thin text-high-emphasis text-subtitle-2">{{item.packing}}</span> 
            <br/>
            {{ toPLAccountingStandards(item.price) }} 
            <br/>
            <span class="tabular-nums font-weight-thin text-medium-emphasis text-subtitle-2">{{ toPLAccountingStandards(Number.parseFloat(item.price + item.price * 0.08).toFixed(2)) }}</span>
          </td>
        </tr>
      </template>
      </v-data-table>
      <!-- visible on screen  (width > 600)  -->
      <v-data-table
        fixed-header
        :headers="headers"
        :items="prices"
        class="h-100 d-none d-sm-flex"
        item-value="index"
      >
      <template v-slot:item="{ item }">
        <tr>
          <td><span class="text-uppercase">{{ item.name }}</span> <br/> <span class="font-weight-thin text-medium-emphasis text-subtitle-2">{{item?.segment}}</span></td>
          <td class="text-end">{{ item.family }}</td>
          <td class="tabular-nums text-end">{{ toPLAccountingStandards(item.price) }}</td>
          <td class="tabular-nums font-weight-thin text-medium-emphasis text-subtitle-2">{{ toPLAccountingStandards(Number.parseFloat(item.price + item.price * 0.08).toFixed(2)) }}</td>
          <td class="text-end">{{ item.packing }}</td>
        </tr>
      </template>
      </v-data-table>
      </v-col>
    </v-row>
  </v-container>`,
  setup() {
    const route = useRoute();
    const prices = ref([]);
    const stock = ref([]);
    const headersMobile = ref([
      { title: 'Nazwa', align: 'start', key: 'name' },
      { title: 'Cena', align: 'end', key: 'price' },
    ])
    const headers = ref([
      { title: 'Nazwa', align: 'start', key: 'name' },
      { title: 'Rodzina', align: 'end', key: 'family' },
      { title: 'Cena(netto)', align: 'end', key: 'price' },
      { title: 'Cena(brutto)', align: 'end' },
      { title: 'Opakowanie', align: 'end', key: 'packing' },
    ])

    const toPLAccountingStandards = (num) => new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(
      num,
    )

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
      headersMobile,
      onMounted,
      toPLAccountingStandards
    };
  },
};

export default priceList;
