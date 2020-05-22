const state = {
  customers: []
};

const mutations = {
  removeCustomer(state, index) {
    state.customers.splice(index, 1);
  },
  addCustomer(state, customer) {
    state.customers.push(customer);
  },
  updateCustomer(state, index, customer) {
    state.customers.splice(index, 1, customer);
  }
};

const actions = {
  removeCustomer({ commit }, index) {
    // do something async
    commit("removeCustomer", index);
  },
  addCustomer({ commit }, customer) {
    commit("addCustomer", customer);
  },
  updateCustomer({ commit }, index, customer) {
    commit("updateCustomer", index, customer);
  }
};

export default {
  state,
  mutations,
  actions
};
