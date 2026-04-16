//transactionService.js
import { api } from "./api";

export const transactionService = {
  // Get all transactions - for dashboard
  async getTransactions(token) {
    return api.get("/transaction", token);
  },

  async getPaginatedTransactions(token, params = {}) {
    const {
      pageNumber = 1,
      pageSize = 10,
      filterType = null,
      categoryId = null,
      searchTerm = null,
      fromDate = null,
      toDate = null,
    } = params;

    // build query string
    const queryParams = new URLSearchParams();
    queryParams.append('pageNumber', pageNumber);
    queryParams.append('pageSize', pageSize);
    if (filterType && filterType !== 'all') queryParams.append('filterType', filterType);
    if (categoryId) queryParams.append('categoryId', categoryId);
    if (searchTerm) queryParams.append('searchTerm', searchTerm);
    if (fromDate) queryParams.append('fromDate', fromDate);
    if (toDate) queryParams.append('toDate', toDate);

    return api.get(`/transaction/paginated?${queryParams.toString()}`, token);
  },

  // Get transaction by ID
  async getTransactionById(id, token) {
    return api.get(`/transaction/${id}`, token);
  },

  // Create new transaction
  async createTransaction(data, token) {
    return api.post("/transaction", data, token);
  },

  // Update transaction
  async updateTransaction(id, data, token) {
    return api.put(`/transaction/${id}`, data, token);
  },

  // Delete transaction - Use api.delete
  async deleteTransaction(id, token) {
    return api.delete(`/transaction/${id}`, token);
  },
};