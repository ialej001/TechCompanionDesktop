import Api from "@/services/Api";
import { authHeader } from "@/services/AuthHeader.js";

export const authService = {
  login,
  logout,
  register
};

function login(username, password) {
  return Api()
    .post("api/auth/login", JSON.stringify({ username, password }), {
      headers: { "Content-Type": "application/json" }
    })
    .then(user => {
      if (user.token) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      return user;
    });
}

function logout() {
  // TODO: implement server side token removal
  localStorage.removeItem("user");
}

function register(user) {
  return Api().post("/api/auth/register", {
    username: user.username,
    email: user.email,
    roles: user.roles,
    password: user.password
  });
}
