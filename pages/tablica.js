import { ref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getDatabase, query, orderByValue, orderByKey, orderByChild, onValue, startAt, endAt } from  "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import {ref as fref } from  "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import app from "../modules/firebase.js"

const crop = {
  template: `          
  <v-container fluid>
    <v-row justify="center">
      <v-col xs="12" sm="11" md="10">
        <stock-input @stock-ready="(data) => stock = data"></stock-input>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col xs="12" md="10">
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col  xs="12" md="10" lg="8" class="d-flex flex-wrap justify-space-evenly">
        <ul>
          <li v-for="batch in stock" >{{batch.Batch_number}}</li>
        </ul>
      </v-col>
    </v-row>
  </v-container>`,
  setup() {
    const route = useRoute();
    const crop = ref({});
    const stock = ref([]);


    onMounted(async () => {
      const db = getDatabase(app);

      const katalog = fref(db, 'katalog');
      const mostViewedPosts = query(fref(db, 'katalog'), orderByChild('crop'), startAt("TO"), endAt("TO"));
      onValue(katalog, (snapshot) => {
         crop.value = snapshot.val();
         console.log(snapshot.val());
       });
    });

    return {
      route,
      crop,
      stock,
      onMounted,
    };
  },
};

export default crop;
