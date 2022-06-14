import Customer from "@/models/Customer.js";

export default class ServiceCall {
  constructor() {
    this.string_id = null;
    this.customer = new Customer();
    this.techAssigned = null;
    this.issues = [];
    this.isWarranty = false;
  }
}
