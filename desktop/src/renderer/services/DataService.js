import Api from "@/services/Api";

export default {
  searchForCustomer(serviceAddress) {
    return Api().post("api/findCustomer", serviceAddress);
  },

  getCustomers() {
    return Api().get("api/customers", {
      transformResponse: [
        function(data) {
          return data ? JSON.parse(data) : data;
        }
      ]
    });
  },

  updateCustomer(customerInfo, id) {
    return Api().put(`api/customer/${id}`, customerInfo);
  },

  deleteCustomer(id) {
    return Api().delete(`api/customer/${id}`);
  },

  getAllWorkOrders() {
    return Api().get("api/all", {
      transformResponse: [
        function(data) {
          return data ? JSON.parse(data) : data;
        }
      ]
    });
  },

  dispatchWorkOrder(customerInfo) {
    return Api().post("api/dispatch/work-order", customerInfo);
  },

  updateWorkOrder(customerInfo, id) {
    return Api().put(`api/update/${id}`, customerInfo);
  },

  cancelWorkOrder(id) {
    return Api().delete(`api/work-order/${id}`);
  }
};
