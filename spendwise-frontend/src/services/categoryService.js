import { api } from "./api";

export const categoryService = {
  async getCategories(token) {
    return api.get("/category", token);
  },

  async getCategoryById(id, token) {
    return api.get(`/category/${id}`, token);
  },

  async createCategory(data, token) {
    return api.post("/category", data, token);
  },

  async updateCategory(id, data, token) {
    return api.put(`/category/${id}`, data, token);
  },

  async deleteCategory(id, token) {
    return api.delete(`/category/${id}`, token);
  },
};