//api.js
const API_BASE = "http://localhost:5079/api";

// Global logout callback
let logoutCallback = null;

export const setLogoutCallback = (callback) => {
  logoutCallback = callback;
};

export const api = {
  async get(endpoint, token) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    
    if (res.status === 401) {
      if (logoutCallback) {
        logoutCallback();
      }
      throw new Error("Session expired. Please login again.");
    }
    
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return res.json();
  },

  async post(endpoint, data, token) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    if (res.status === 401) {
      if (logoutCallback) {
        logoutCallback();
      }
      throw new Error("Session expired. Please login again.");
    }
    
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return res.json();
  },

  async put(endpoint, data, token) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    // Handle unauthorized (server says token expired or invalid)
    if (res.status === 401) {
      if (logoutCallback) {
        logoutCallback();
      }
      throw new Error("Session expired. Please login again.");
    }
    
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return res.json();
  },

  async delete(endpoint, token) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    
    // Handle unauthorized (server says token expired or invalid)
    if (res.status === 401) {
      if (logoutCallback) {
        logoutCallback();
      }
      throw new Error("Session expired. Please login again.");
    }
    
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return res.json();
  },
};

// Dashboard specific API calls
export const dashboardService = {
  async getDashboardData(token) {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    try {
      const [transactions, categories, budget] = await Promise.all([
        api.get("/transaction", token),
        api.get("/category", token),
        api.get(`/budget/${month}/${year}`, token).catch(() => null),
      ]);

      return { transactions, categories, budget, currentMonth: month, currentYear: year };
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      throw error;
    }
  },
};