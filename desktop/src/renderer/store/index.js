import Vue from "vue";
import Vuex from "vuex";

import { createPersistedState, createSharedMutations } from "vuex-electron";

// import modules from "./modules";
import { authentication } from "./Authentication";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    authentication
  }
  // plugins: [createPersistedState(), createSharedMutations()],
  // strict: process.env.NODE_ENV !== "production"
});
