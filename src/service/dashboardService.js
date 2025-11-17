export const dashboardService = {
  getUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  logout() {
    localStorage.removeItem("user");
  },

  isAuthenticated() {
    return !!localStorage.getItem("user");
  },
};