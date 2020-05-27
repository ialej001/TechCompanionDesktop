export default class Customer {
  constructor() {
    this.string_id = null;
    this.managementCompany = "";
    this.propertyName = "";
    this.propertyType = "";
    this.streetAddress = "";
    this.city = "";
    this.zipCode = "";
    this.serviceAddress = "";
    this.contactName = "";
    this.contactPhone = "";
    this.contactEmail = "";
    this.gateDetails = [];
    this.billingMethod = "COD";
    this.laborRate = 95.0;
    this.taxRate = 9.5;
  }
}
