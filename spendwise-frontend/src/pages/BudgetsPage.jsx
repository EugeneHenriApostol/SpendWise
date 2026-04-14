//BudgetsPage.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { budgetService } from "../services/budgetService";
import { transactionService } from "../services/transactionService";
import BudgetModal from "../components/budgets/BudgetModal";
import BudgetCard from "../components/budgets/BudgetCard";
import BudgetHistory from "../components/budgets/BudgetHistory";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { FiPlus, FiAlertCircle, FiClock } from "react-icons/fi";

export default function BudgetsPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [currentBudget, setCurrentBudget] = useState(null);
  const [budgetHistory, setBudgetHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [currentExpenses, setCurrentExpenses] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [error, setError] = useState(null);

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  useEffect(() => {
    fetchCurrentBudget();
  }, []);

  const fetchCurrentBudget = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const budget = await budgetService.getBudget(currentMonth, currentYear, token);
      setCurrentBudget(budget);
      
      const transactions = await transactionService.getTransactions(token);
      const currentMonthTransactions = transactions.filter(tx => {
        const txDate = new Date(tx.date);
        return tx.type === "Expense" &&
               txDate.getMonth() + 1 === currentMonth &&
               txDate.getFullYear() === currentYear;
      });
      
      const totalExpenses = currentMonthTransactions.reduce((sum, tx) => sum + tx.amount, 0);
      setCurrentExpenses(totalExpenses);
      
    } catch (err) {
      console.error("Failed to fetch budget data:", err);
      setError("Failed to load budget data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBudgetHistory = async () => {
    try {
      setLoadingHistory(true);
      setError(null);

      const allBudgets = await budgetService.getAllBudgets(token);
      
      const history = allBudgets.filter(budget => {
        return !(budget.month === currentMonth && budget.year === currentYear);
      });
      
      history.sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year;
        return b.month - a.month;
      });
      
      setBudgetHistory(history);
      setShowHistory(true);
      
    } catch (err) {
      console.error("Failed to fetch budget history:", err);
      setError("Failed to load budget history. Please try again.");
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleCreateBudget = async (data) => {
    try {
      await budgetService.createBudget(data, token);
      await fetchCurrentBudget();
      if (showHistory) {
        setShowHistory(false);
      }
    } catch (err) {
      console.error("Failed to create budget:", err);
      throw err;
    }
  };

  const handleUpdateBudget = async (data) => {
    try {
      if (!selectedBudget?.id) {
        throw new Error("No budget selected for update");
      }
      await budgetService.updateBudget(selectedBudget.id, data, token);
      await fetchCurrentBudget();
      if (showHistory) {
        setShowHistory(false);
      }
    } catch (err) {
      console.error("Failed to update budget:", err);
      throw err;
    }
  };

  const handleEditBudget = (budget) => {
    setSelectedBudget(budget);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleDeleteBudget = async (budget) => {
    if (window.confirm(`Are you sure you want to delete the budget for ${new Date(budget.year, budget.month - 1).toLocaleString('default', { month: 'long' })} ${budget.year}?`)) {
      try {
        await budgetService.deleteBudget(budget.id, token);
        await fetchCurrentBudget();
        if (showHistory) {
          setShowHistory(false);
        }
      } catch (err) {
        console.error("Failed to delete budget:", err);
        alert("Failed to delete budget. Please try again.");
      }
    }
  };

  const handleOpenCreateModal = () => {
    setModalMode("create");
    setSelectedBudget(null);
    setIsModalOpen(true);
  };

  const handleCloseHistory = () => {
    setShowHistory(false);
    setBudgetHistory([]);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Budgets</h1>
          <p className="text-gray-400 mt-1">
            Track your monthly spending limits
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchBudgetHistory}
            disabled={loadingHistory}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition disabled:opacity-50"
          >
            {loadingHistory ? (
              "Loading..."
            ) : (
              <>
                <FiClock size={18} />
                View History
              </>
            )}
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#5409DA] to-[#4E71FF] text-white rounded-lg font-medium hover:opacity-90 transition"
          >
            <FiPlus size={18} />
            Set Budget
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-red-950 border border-red-800 text-red-400">
          <FiAlertCircle size={18} />
          <span className="text-sm">{error}</span>
          <button onClick={fetchCurrentBudget} className="ml-auto text-sm underline hover:no-underline">
            Retry
          </button>
        </div>
      )}

      {currentBudget ? (
        <BudgetCard 
          budget={currentBudget}
          currentExpenses={currentExpenses}
          onEdit={handleEditBudget}
          onDelete={handleDeleteBudget}
        />
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
          <div className="inline-flex p-3 rounded-xl bg-gray-800 mb-3">
            <FiAlertCircle size={24} className="text-[#8DD8FF]" />
          </div>
          <h3 className="text-white font-medium mb-1">No budget set for this month</h3>
          <p className="text-gray-500 text-sm mb-4">
            Set a budget for {new Date().toLocaleString('default', { month: 'long' })} {currentYear} to track your spending
          </p>
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 bg-gradient-to-r from-[#5409DA] to-[#4E71FF] text-white rounded-lg text-sm font-medium hover:opacity-90 transition"
          >
            Set Monthly Budget
          </button>
        </div>
      )}

      {showHistory && (
        <div className="relative">
          <BudgetHistory 
            budgets={budgetHistory} 
            onClose={handleCloseHistory}
          />
        </div>
      )}

      <BudgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={modalMode === "create" ? handleCreateBudget : handleUpdateBudget}
        budget={selectedBudget}
        mode={modalMode}
      />
    </div>
  );
}