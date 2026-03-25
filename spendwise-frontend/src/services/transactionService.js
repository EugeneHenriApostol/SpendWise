import { api } from "./api";

const API_BASE = "http://localhost:5079/api";

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

  // Delete transaction
  async deleteTransaction(id, token) {
    const res = await fetch(`${API_BASE}/transaction/${id}`, {
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