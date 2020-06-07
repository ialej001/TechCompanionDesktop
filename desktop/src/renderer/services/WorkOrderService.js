import Api from "@/services/Api";
import authHeader from "@/services/AuthHeader.js";

export default {
  getIncompleteWorkOrders(auth) {
    return Api().get("api/incomplete", {
      headers: authHeader(auth)
    });
  },
  getCompletedWorkOrders(auth) {
    return Api().get("api/complete", {
      headers: authHeader(auth)
    });
  },
  dispatchWorkOrder(auth, customerInfo) {
    return Api().post("api/dispatch/work-order", customerInfo, {
      headers: authHeader(auth)
    });
  },
  updateWorkOrder(auth, customerInfo, id) {
    return Api().put(`api/update/${id}`, customerInfo, {
      headers: authHeader(auth)
    });
  },
  cancelWorkOrder(auth, id) {
    return Api().delete(`api/work-order/${id}`, { headers: authHeader(auth) });
  }
};
