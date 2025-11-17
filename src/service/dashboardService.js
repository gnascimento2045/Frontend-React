import api from "../api";

export const dashboardService = {
  async getDashboardData() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.token) return null;

    try {
      const response = await api.get("/dashboard", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar dados do dashboard:", error);
      return null;
    }
  },

  logout() {
    localStorage.removeItem("user");
  },

  getUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    const user = JSON.parse(localStorage.getItem("user"));
    return !!(user && user.token);
  },
};
