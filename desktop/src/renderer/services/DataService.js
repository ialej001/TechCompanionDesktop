import Api from "@/services/Api";

export default {
  // Customer calls
  createCustomer(customer) {
    return Api().post("api/customer/new", customer);
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

  // Dispatch calls
  getIncompleteWorkOrders() {
    return Api().get("api/incomplete", {
      transformResponse: [
        function(data) {
          return data ? JSON.parse(data) : data;
        }
      ]
    });
  },
  getCompletedWorkOrders() {
    return Api().get("api/complete", {
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
  },

  // Inventory calls
  createItem(item) {},
  getAllItems() {
    return Api().get("api/parts/all", {
      transformResponse: [
        function(data) {
          return data ? JSON.parse(data) : data;
        }
      ]
    });
  },
  updateItem(id, item) {
    return Api().put(`api/parts/update/${id}`, item);
  },
  deleteItem(id) {
    return Api().delete(`api/parts/delete/${id}`);
  }
};
