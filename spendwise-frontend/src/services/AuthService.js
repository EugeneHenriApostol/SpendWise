//AuthService.js

const API_BASE = "http://localhost:5079/api";

export const authService = {
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.errorMessage || "Login failed");
    }
    
    if (data.success && data.user) {
      return {
        token: data.user.token,
        user: data.user.user
      };
    }
    
    throw new Error("Invalid response from server");
  },

  async signUp(email, password) {
    const res = await fetch(`${API_BASE}/auth/SignUp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.errorMessage || "Sign up failed");
    }

    if (data.success && data.user) {
      return {
        token: data.user.token,
        user: data.user.user
      };
    }
    
    throw new Error("Invalid response from server");
  },
};