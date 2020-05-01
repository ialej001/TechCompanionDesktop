import Api from "@/services/Api";

export default {
  // create
  dispatchWorkOrder(workOrder) {
    return Api().post("dispatch", workOrder);
  },
  // retrieve data
  findCustomer(serviceAddress) {
    return Api().post("findCustomer", serviceAddress);
  }
};
