export default {
    state () {
      return {
        crops: [
            {
              crop: "TO",
              src: "https://res.cloudinary.com/ddkef5waq/image/upload/v1701249930/enzapp/pom_se5gvw.png",
              lazySrc: "../assets/pomidory.jpg",
              color: "#C294B6",
              title: "Pomidory",
              subtitle: "najlepszy wybór do hydroponiki i gruntu",
            },
            {
              crop: "CC",
              src: "https://res.cloudinary.com/ddkef5waq/image/upload/v1701249930/enzapp/ogo_tetxi2.png",
              lazySrc: "../assets/ogorki.png",
              color: "#94C2B4",
              title: "Ogórki",
              subtitle: "najlepszy wybór do hydroponiki i gruntu",
            },
            {
              crop: "ED",
              src: "https://res.cloudinary.com/ddkef5waq/image/upload/v1701854737/enzapp/endiv_pazfrl.png",
              lazySrc: "../assets/endive.png",
              color: "#94C2A6",
              title: "Endive",
              subtitle: "najlepszy wybór do hydroponiki i gruntu",
            },
            {
              crop: "LT",
              src: "https://res.cloudinary.com/ddkef5waq/image/upload/v1701854322/enzapp/sala_dy54oi.png",
              lazySrc: "../assets/salata.jpg",
              color: "#9D94C2",
              title: "Sałaty",
              subtitle: "najlepszy wybór do hydroponiki i gruntu",
            },
            {
              crop: "SP",
              src: "https://res.cloudinary.com/ddkef5waq/image/upload/v1701434906/enzapp/pep_gniytm.png",
              lazySrc: "../assets/paryki.jpg",
              color: "#98C294",
              title: "Papryki",
              subtitle: "najlepszy wybór do hydroponiki i gruntu",
            },
            {
              crop: "RA",
              src: "https://res.cloudinary.com/ddkef5waq/image/upload/v1701423716/enzapp/rad_xopad4.png",
              lazySrc: "../assets/rzodkiewki.png",
              color: "#C29494",
              title: "Rzodkiewki",
              subtitle: "najlepszy wybór do hydroponiki i gruntu",
            },
            {
              crop: "B_",
              src: "https://res.cloudinary.com/ddkef5waq/image/upload/v1701854171/enzapp/kap_czthmi.png",
              lazySrc: "../assets/rzodkiewki.png",
              color: "#94C2A6",
              title: "Kapusty",
              subtitle: "najlepszy wybór do hydroponiki i gruntu",
            },
            {
              crop: "B_CF",
              src: "https://res.cloudinary.com/ddkef5waq/image/upload/v1701434098/enzapp/cal_ngymad.png",
              lazySrc: "../assets/rzodkiewki.png",
              color: "#94BFC2",
              title: "Kalafiory",
              subtitle: "najlepszy wybór do hydroponiki i gruntu",
            },
            {
              crop: "ON",
              src: "https://res.cloudinary.com/ddkef5waq/image/upload/v1701856234/enzapp/oni_qiira5.png",
              lazySrc: "../assets/rzodkiewki.png",
              color: "#C2B294",
              title: "Cebule",
              subtitle: "najlepszy wybór do hydroponiki i gruntu",
            },
            {
              crop: "H_",
              src: "https://res.cloudinary.com/ddkef5waq/image/upload/v1701864324/enzapp/herb_oy76lx.png",
              lazySrc: "../assets/rzodkiewki.png",
              color: "#95C294",
              title: "Zioła",
              subtitle: "najlepszy wybór do hydroponiki i gruntu",
            },
            // {
            //   crop: "B_KR",
            //   src: null,
            //   lazySrc: "../assets/rzodkiewki.png",
            //   color: "#3C9900",
            //   title: "Kalarepy",
            //   subtitle: "najlepszy wybór do hydroponiki i gruntu",
            // },
        ],
        priceList:[],
        stock:[],
        raport:[],
        symfonia:[],
      }
    },
    getters: {
        getPriceListFromStore (state) {
          return state.priceList
        },
        getCropsListFromStore (state) {
            return state.crops
        },
        getStockFromStore (state) {
          return state.stock
        },
        getRaportFromStore (state) {
          return state.raport
        },
        getSymfoniaFromStore (state) {
          return state.symfonia
        },
        getCropFromStore: (state) => (id) => {
          return state.crops.find((ele) => id == ele.crop )
        },
        getBatchFromStockInStore: (state) => (name) => {
          return state.stock.find((ele) => name == ele.name )
        },
    },
    actions: {
        insertPriceListToStore (context, payload) {
          context.commit('insertPriceListToStore', payload)
        },
        insertRaportToStore (context, payload) {
          context.commit('insertRaportToStore', payload)
        },
        insertSymfoniaToStore (context, payload) {
          context.commit('insertSymfoniaToStore', payload)
        },
        insertStockToStore (context, payload) {
          context.commit('insertStockToStore', payload)
        }
    },
    mutations: {
      insertPriceListToStore (state, payload) {
        state.priceList = payload.priceList
      },
      insertStockToStore (state, payload) {
        state.stock = payload
      },
      insertRaportToStore (state, payload) {
        state.raport = payload
      },
      insertSymfoniaToStore (state, payload) {
        state.symfonia = payload
      },
    }
  }