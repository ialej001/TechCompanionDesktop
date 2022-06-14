<template>
  <div id="app">
    <div v-if="isLoggedIn" class="tabs is-medium is-boxed is-primary">
      <ul>
        <router-link
          tag="li"
          :to="{ path: '/Dispatch' }"
          active-class="is-active"
          exact
        >
          <a>Dispatch</a>
        </router-link>
        <router-link
          tag="li"
          :to="{ path: '/History' }"
          active-class="is-active"
          exact
        >
          <a>History</a>
        </router-link>
        <router-link
          tag="li"
          :to="{ path: '/Maintenance' }"
          active-class="is-active"
          exact
        >
          <a>Maintenance</a>
        </router-link>
        <router-link
          tag="li"
          :to="{ path: '/Customers' }"
          active-class="is-active"
          exact
        >
          <a>Customers</a>
        </router-link>
        <router-link
          tag="li"
          :to="{ path: '/Inventory' }"
          active-class="is-active"
          exact
        >
          <a>Inventory</a>
        </router-link>
        <router-link
          v-if="isAdmin"
          tag="li"
          :to="{ path: '/Users' }"
          active-class="is-active"
          exact
        >
          <a>Users</a>
        </router-link>
        <li class="is-pulled-right" @click="logout()"><a>Logout</a></li>
      </ul>
    </div>
    <div v-if="!isLoggedIn">
      <Login :isLoggedIn="isLoggedIn" />
    </div>
    <div v-else>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import authService from "@/services/AuthenticationService.js";

export default {
  name: "App",
  components: { Login: require("@/components/Login.vue").default },
  computed: {
    isLoggedIn() {
      return this.$store.state.authentication.status.loggedIn;
    },
    isAdmin() {
      if (this.$store.state.authentication.user.data.roles[0] === "ROLE_ADMIN")
        return true;
      return false;
    }
  },
  created() {
    this.$store.dispatch("authentication/logout");
  },
  methods: {
    logout() {
      this.$buefy.dialog.confirm({
        title: "Logout?",
        message: "Are you sure you want to <b>logout</b>?",
        confirmText: "Logout",
        type: "is-danger",
        hasIcon: true,
        onConfirm: async () => {
          this.$store.dispatch("authentication/logout");

          this.$buefy.toast.open("You've been logged out!");
        }
      });
    }
  }
};
</script>

<style>
/* CSS */
</style>
