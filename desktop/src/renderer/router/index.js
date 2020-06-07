import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "Home",
      component: require("@/components/Home.vue").default
    },
    {
      path: "/Dispatch",
      name: "Dispatch",
      component: require("@/components/Dispatch/Dispatch.vue").default
    },
    {
      path: "/Customers",
      name: "Customers",
      component: require("@/components/Customers/Customers.vue").default
    },
    {
      path: "/History",
      name: "History",
      component: require("@/components/History/History.vue").default
    },
    {
      path: "/Maintenance",
      name: "Maintenance",
      component: require("@/components/Maintenance.vue").default
    },
    {
      path: "/Users",
      name: "Users",
      component: require("@/components/Users/Users.vue").default
    },
    {
      path: "/Inventory",
      name: "Inventory",
      component: require("@/components/Inventory/Inventory.vue").default
    },
    {
      path: "*",
      redirect: "/"
    }
  ]
});
