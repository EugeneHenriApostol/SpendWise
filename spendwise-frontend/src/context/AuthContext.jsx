//AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load initial auth state
  useEffect(() => {
    const storedToken = localStorage.getItem("sw_token");
    const storedUser = localStorage.getItem("sw_user");
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  function saveSession(data) {
    console.log("Saving session:", data);
    localStorage.setItem("sw_token", data.token);
    localStorage.setItem("sw_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  }

  function logout() {
    console.log("Logging out");
    localStorage.removeItem("sw_token");
    localStorage.removeItem("sw_user");
    setToken(null);
    setUser(null);
  }

  const value = {
    user,
    token,
    loading,
    saveSession,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}