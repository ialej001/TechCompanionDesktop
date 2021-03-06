import { authService } from "@/services/AuthenticationService.js";

const user = JSON.parse(localStorage.getItem("user"));
const initialState = user
  ? { status: { loggedIn: true }, user }
  : { status: {}, user: null };

export const authentication = {
  namespaced: true,
  state: initialState,
  actions: {
    login({ commit }, { username, password }) {
      commit("loginRequest", { username });

      authService.login(username, password).then(
        user => {
          commit("loginSuccess", user);
        },
        error => {
          commit("loginFailure", error);
        }
      );
    },
    logout({ commit }) {
      authService.logout();
      commit("logout");
    }
  },
  mutations: {
    loginRequest(state, user) {
      state.status = { loggingIn: true };
      state.user = user;
    },
    loginSuccess(state, user) {
      state.status = { loggedIn: true };
      state.user = user;
    },
    loginFailure(state) {
      state.status = { loggedIn: false, rejected: true };
      state.user = null;
    },
    logout(state) {
      state.status = {};
      state.user = null;
    }
  }
};
