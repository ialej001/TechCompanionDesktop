import Vue from "vue";
import axios from "axios";
import VueLogger from "vuejs-logger";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Buefy from "buefy";
import VeeValidate from "vee-validate";
import "buefy/dist/buefy.css";
import "@mdi/font/css/materialdesignicons.css";
import "v8-compile-cache";

Vue.use(Buefy);
Vue.use(VeeValidate);

if (!process.env.IS_WEB) Vue.use(require("vue-electron"));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

const options = {
  isEnabled: true,
  logLevel: "debug",
  stringifyArguments: false,
  showLogLevel: true,
  showMethodName: false,
  separator: "|",
  showConsoleColors: true
};
Vue.use(VueLogger, options);

/* eslint-disable no-new */
new Vue({
  // components: { App },
  router,
  store,
  template: "<App/>",
  render: h => h(App)
}).$mount("#app");
