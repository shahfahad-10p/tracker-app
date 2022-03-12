import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./portal-router";
import vuetify from "./plugins/vuetify";
import 'mapbox-gl/src/css/mapbox-gl.css';

Vue.config.productionTip = false;

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
