//savingsService.js
import { api } from "./api";

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

  // Delete savings goal - Use api.delete
  async deleteGoal(id, token) {
    return api.delete(`/savings/${id}`, token);
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