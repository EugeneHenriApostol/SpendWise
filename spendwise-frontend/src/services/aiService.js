import { api } from './api';

export const aiService = {
  async getBudgetRecommendations(month, year, token) {  // Add token parameter
    return api.post(`/ai/budget-recommendations?month=${month}&year=${year}`, {}, token);
  },
  
  async getFinancialInsights(token) {  // Add token parameter
    return api.post('/ai/financial-insights', {}, token);
  }
};