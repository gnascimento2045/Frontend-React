import api from "../api";

export const authService = {
  async login(data) {
    const response = await api.post("/login", data);
    return response.data;
  },

  async register(data) {
    const response = await api.post("/register", data);
    return response.data;
  },

  saveUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
  },

  getUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  clearUser() {
    localStorage.removeItem("user");
  },

  isAuthenticated() {
    return !!localStorage.getItem("user");
  },
};