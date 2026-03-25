import { api } from "./api";

// Add API_BASE for delete method
const API_BASE = "http://localhost:5079/api";

export const budgetService = {
  // Create a new budget
  async createBudget(data, token) {
    return api.post("/budget", data, token);
  },

  // Get budget for specific month/year
  // Note: Backend expects GET /budget/{month}/{year}
  async getBudget(month, year, token) {
    try {
      return await api.get(`/budget/${month}/${year}`, token);
    } catch (error) {
      // Return null if budget not found (404)
      if (error.message.includes("404")) {
        return null;
      }
      throw error;
    }
  },

  async getAllBudgets(token) {
    return api.get("/budget", token);
  },

  async updateBudget(budgetId, data, token) {
    const res = await fetch(`${API_BASE}/budget/${budgetId}`, {
      method: "PUT", 
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return res.json();
  },

  async deleteBudget(budgetId, token) {
    const res = await fetch(`${API_BASE}/budget/${budgetId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return res.json();
  },
};