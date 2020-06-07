import Api from "@/services/Api";
import authHeader from "@/services/AuthHeader.js";

export default {
  createCustomer(auth, customer) {
    return Api().post("api/customer/new", customer, {
      headers: authHeader(auth)
    });
  },
  getCustomers(auth) {
    return Api().get("api/customers", {
      headers: authHeader(auth)
    });
  },
  updateCustomer(auth, customerInfo, id) {
    return Api().put(`api/customer/${id}`, customerInfo, {
      headers: authHeader(auth)
    });
  },
  deleteCustomer(auth, id) {
    return Api().delete(`api/customer/${id}`, { headers: authHeader(auth) });
  }
};
