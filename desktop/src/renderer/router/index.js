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
      component: require("@/components/WorkOrder.vue").default
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
      path: "*",
      redirect: "/"
    }
  ]
});
