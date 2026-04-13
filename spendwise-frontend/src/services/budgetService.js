//budgetService.js
import { api } from "./api";

export const budgetService = {
  async createBudget(data, token) {
    return api.post("/budget", data, token);
  },

  async getBudget(month, year, token) {
    try {
      const response = await api.get(`/budget/${month}/${year}`, token);
      return response.budget; // This will be null if no budget exists
    } catch (error) {
      console.error("Failed to fetch budget:", error);
      return null;
    }
  },

  async getAllBudgets(token) {
    return api.get("/budget", token);
  },

  async updateBudget(budgetId, data, token) {
    return api.put(`/budget/${budgetId}`, data, token);
  },

  async deleteBudget(budgetId, token) {
    return api.delete(`/budget/${budgetId}`, token);
  },
};