import Api from "@/services/Api";
import authHeader from "@/services/AuthHeader.js";

export default {
  createItem(auth, item) {},
  getAllItems(auth) {
    return Api().get("api/parts/all", {
      headers: authHeader(auth),
      transformResponse: [
        function(data) {
          return data ? JSON.parse(data) : data;
        }
      ]
    });
  },
  updateItem(auth, id, item) {
    return Api().put(`api/parts/update/${id}`, item, {
      headers: authHeader(auth)
    });
  },
  deleteItem(auth, id) {
    return Api().delete(`api/parts/delete/${id}`, {
      headers: authHeader(auth)
    });
  }
};
