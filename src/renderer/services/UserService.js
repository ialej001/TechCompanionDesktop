import Api from "@/services/Api";
import authHeader from "@/services/AuthHeader.js";

export default {
  getAllUsers(auth) {
    return Api().get("api/users/all", {
      headers: authHeader(auth),
      transformResponse: [
        function(data) {
          return data ? JSON.parse(data) : data;
        }
      ]
    });
  },
  createUser(auth, newUser) {
    return Api().post("api/auth/register", newUser, {
      headers: authHeader(auth)
    });
  },
  updateUser(auth, updateUser) {
    return Api().put(`api/users/${updateUser.id}`, updateUser, {
      headers: authHeader(auth)
    });
  },
  deleteUser(auth, id) {
    return Api().delete(`api/users/${id}`, { headers: authHeader(auth) });
  }
};
