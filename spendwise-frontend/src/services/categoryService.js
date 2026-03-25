import { api } from "./api";

export const categoryService = {
  // Get all categories
  async getCategories(token) {
    return api.get("/category", token);
  },

  // Get category by ID
  async getCategoryById(id, token) {
    return api.get(`/category/${id}`, token);
  },

  // Create new category
  async createCategory(data, token) {
    return api.post("/category", data, token);
  },

  // Update category
  async updateCategory(id, data, token) {
    return api.put(`/category/${id}`, data, token);
  },

  // Delete category
  async deleteCategory(id, token) {
    const res = await fetch(`${API_BASE}/category/${id}`, {
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