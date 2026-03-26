//transactionService.js
import { api } from "./api";

export const transactionService = {
  // Get all transactions
  async getTransactions(token) {
    return api.get("/transaction", token);
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