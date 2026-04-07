//App.jsx

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { setLogoutCallback } from "./services/api";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import Layout from "./components/layout/Layout";
import DashboardPage from "./pages/dashboard/DashboardPage";
import LoadingSpinner from "./components/common/LoadingSpinner";
import BudgetsPage from "./pages/BudgetsPage";
import CategoriesPage from "./pages/CategoriesPage";
import TransactionsPage from "./pages/TransactionsPage";
import SavingsPage from "./pages/SavingsPage";
import AIInsightsPage from "./pages/AIInsightsPage";
import { useEffect } from "react";

// Protect routes that require auth
function PrivateRoute({ children }) {
  const { token, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  // Just check if token exists - server will handle expiration
  return token ? children : <Navigate to="/login" replace />;
}

// Redirect logged-in users away from auth pages
function PublicRoute({ children }) {
  const { token, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return token ? <Navigate to="/dashboard" replace /> : children;
}

function AppRoutes() {
  const { logout } = useAuth();
  
  // Set logout callback for API interceptor
  useEffect(() => {
    setLogoutCallback(logout);
  }, [logout]);
  
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="budgets" element={<BudgetsPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="savings" element={<SavingsPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="ai-insights" element={<AIInsightsPage />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}