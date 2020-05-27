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
      path: "/ServiceCall",
      name: "ServiceCall",
      component: require("@/components/Dispatch.vue").default
    },
    {
      path: "/Customers",
      name: "Customers",
      component: require("@/components/Customers.vue").default
    },
    {
      path: "/History",
      name: "History",
      component: require("@/components/History/ServiceHistory.vue").default
    },
    {
      path: "/Maintenance",
      name: "Maintenance",
      component: require("@/components/Maintenance.vue").default
    },
    {
      path: "/Technicians",
      name: "Technicians",
      component: require("@/components/Technicians.vue").default
    },
    {
      path: "/Inventory",
      name: "Inventory",
      component: require("@/components/Inventory.vue").default
    },
    {
      path: "*",
      redirect: "/"
    }
  ]
});
