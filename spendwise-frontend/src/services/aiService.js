import { api } from './api';

export const aiService = {
  async getBudgetRecommendations(month, year) {
    return api.post(`/ai/budget-recommendations?month=${month}&year=${year}`, {});
  },
  
  async getFinancialInsights() {
    return api.post('/ai/financial-insights', {});
  }
};