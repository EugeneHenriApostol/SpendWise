import { api } from "./api";

const API_BASE = "http://localhost:5079/api";

export const savingsService = {
  // Get all savings goals
  async getGoals(token) {
    return api.get("/savings", token);
  },

  // Get goal by ID
  async getGoalById(id, token) {
    return api.get(`/savings/${id}`, token);
  },

  // Create new savings goal
  async createGoal(data, token) {
    return api.post("/savings/goal", data, token);
  },

  // Update savings goal
  async updateGoal(id, data, token) {
    return api.put(`/savings/${id}`, data, token);
  },

  // Delete savings goal
  async deleteGoal(id, token) {
    const res = await fetch(`${API_BASE}/savings/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return res.json();
  },

  // Add contribution to goal
  async addContribution(goalId, data, token) {
    return api.post(`/savings/${goalId}/contribution`, data, token);
  },

  // Get contributions for a goal
  async getContributions(goalId, token) {
    return api.get(`/savings/${goalId}/contributions`, token);
  },
};