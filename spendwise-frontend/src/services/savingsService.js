//savingsService.js
import { api } from "./api";

export const savingsService = {
  async getGoals(token) {
    return api.get("/savings", token);
  },

  async getGoalById(id, token) {
    return api.get(`/savings/${id}`, token);
  },

  async createGoal(data, token) {
    return api.post("/savings/goal", data, token);
  },

  async updateGoal(id, data, token) {
    return api.put(`/savings/${id}`, data, token);
  },

  async deleteGoal(id, token) {
    return api.delete(`/savings/${id}`, token);
  },

  async addContribution(goalId, data, token) {
    return api.post(`/savings/${goalId}/contribution`, data, token);
  },

  async getContributions(goalId, token) {
    return api.get(`/savings/${goalId}/contributions`, token);
  },
};