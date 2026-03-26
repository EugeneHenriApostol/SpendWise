import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { dashboardService } from "../../services/api";
import { budgetService } from "../../services/budgetService";
import SummaryCards from "./SummaryCards";
import RecentTransactions from "./RecentTransactions";
import ExpenseChart from "./ExpenseChart";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function DashboardPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    transactions: [],
    categories: [],
    budget: null,
    currentMonth: new Date().getMonth() + 1,
    currentYear: new Date().getFullYear(),
  });

  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netBalance: 0,
    budgetRemaining: null,
  });

  const [expensesByCategory, setExpensesByCategory] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Refresh data when window gains focus (after adding transaction from another page)
  useEffect(() => {
    const handleFocus = () => {
      fetchDashboardData();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();
      
      // Fetch all data in parallel
      const [transactions, categories, budget] = await Promise.all([
        dashboardService.getTransactions(token),
        dashboardService.getCategories(token),
        budgetService.getBudget(currentMonth, currentYear, token), // Explicitly fetch budget
      ]);
      
      console.log("Dashboard data:", { transactions, categories, budget }); // Debug log
      
      setData({
        transactions,
        categories,
        budget,
        currentMonth,
        currentYear,
      });
      
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const currentMonthTransactions = data.transactions.filter((tx) => {
      const txDate = new Date(tx.date);
      return txDate.getMonth() + 1 === data.currentMonth && 
             txDate.getFullYear() === data.currentYear;
    });

    const totalIncome = currentMonthTransactions
      .filter((tx) => tx.type === "Income")
      .reduce((sum, tx) => sum + tx.amount, 0);

    const totalExpenses = currentMonthTransactions
      .filter((tx) => tx.type === "Expense")
      .reduce((sum, tx) => sum + tx.amount, 0);

    const netBalance = totalIncome - totalExpenses;
    
    // Calculate budget remaining
    let budgetRemaining = null;
    if (data.budget && data.budget.amount) {
      budgetRemaining = data.budget.amount - totalExpenses;
    }

    console.log("Budget calculation:", { 
      budgetAmount: data.budget?.amount, 
      totalExpenses, 
      budgetRemaining 
    }); // Debug log

    setStats({ totalIncome, totalExpenses, netBalance, budgetRemaining });
  };

  const calculateExpensesByCategory = () => {
    const currentMonthExpenses = data.transactions.filter((tx) => {
      const txDate = new Date(tx.date);
      return tx.type === "Expense" &&
             txDate.getMonth() + 1 === data.currentMonth &&
             txDate.getFullYear() === data.currentYear;
    });

    const categoryMap = new Map();
    
    currentMonthExpenses.forEach((tx) => {
      let categoryName = "Uncategorized";
      
      if (tx.category) {
        categoryName = tx.category.categoryName || "Uncategorized";
      } else if (tx.categoryId) {
        const foundCategory = data.categories.find(c => c.id === tx.categoryId);
        if (foundCategory) {
          categoryName = foundCategory.categoryName;
        }
      } else if (tx.categoryName) {
        categoryName = tx.categoryName;
      }
      
      categoryMap.set(categoryName, (categoryMap.get(categoryName) || 0) + tx.amount);
    });

    const chartData = Array.from(categoryMap.entries()).map(([name, value]) => ({
      name,
      value,
    }));

    setExpensesByCategory(chartData);
  };

  // Recalculate when data changes
  useEffect(() => {
    if (data.transactions.length > 0 || data.budget) {
      calculateStats();
      calculateExpensesByCategory();
    }
  }, [data.transactions, data.budget, data.categories]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-[#5409DA] text-white rounded-lg hover:bg-[#4E71FF] transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const handleAddTransaction = () => {
    alert("Add transaction modal coming soon!");
  };

  const recentTransactions = [...data.transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">
          {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </p>
      </div>

      <SummaryCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentTransactions 
            transactions={recentTransactions} 
            onAddClick={handleAddTransaction}
          />
        </div>
        <div>
          <ExpenseChart expensesByCategory={expensesByCategory} />
        </div>
      </div>
    </div>
  );
}