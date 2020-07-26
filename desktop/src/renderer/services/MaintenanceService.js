import Api from "@/services/Api";
import authHeader from "@/services/AuthHeader.js";

export default {
  createContract(auth, contract) {
    return Api().post("api/maintenance/new", contract, {
      headers: authHeader(auth)
    });
  },
  getContracts(auth) {
    return Api().get("api/maintenance", {
      headers: authHeader(auth)
    });
  },
  updateContract(auth, contract, id) {
    return Api().put(`api/maintenance/${id}`, contract, {
      headers: authHeader(auth)
    });
  },
  toggleContractStatus(auth, id) {
    return Api().put(`api/maintenance/deactivate/${id}`, {
      headers: authHeader(auth)
    });
  },
  deleteContract(auth, id) {
    return Api().delete(`api/maintenance/${id}`, {
      headers: authHeader(auth)
    });
  }
};
