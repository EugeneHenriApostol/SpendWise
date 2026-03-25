import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { savingsService } from "../services/savingsService";
import SavingsGoalModal from "../components/savings/SavingsGoalModal";
import ContributionModal from "../components/savings/ContributionModal";
import SavingsGoalCard from "../components/savings/SavingsGoalCard";
import ContributionHistory from "../components/savings/ContributionHistory";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { FiPlus, FiAlertCircle, FiPieChart } from "react-icons/fi";

export default function SavingsPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [contributions, setContributions] = useState([]);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await savingsService.getGoals(token);
      setGoals(data);
    } catch (err) {
      console.error("Failed to fetch savings goals:", err);
      setError("Failed to load savings goals. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchContributions = async (goalId) => {
    try {
      const data = await savingsService.getContributions(goalId, token);
      setContributions(data);
    } catch (err) {
      console.error("Failed to fetch contributions:", err);
    }
  };

  const handleCreateGoal = async (data) => {
    try {
      await savingsService.createGoal(data, token);
      await fetchGoals();
    } catch (err) {
      console.error("Failed to create goal:", err);
      throw err;
    }
  };

  const handleUpdateGoal = async (data) => {
    try {
      await savingsService.updateGoal(selectedGoal.id, data, token);
      await fetchGoals();
    } catch (err) {
      console.error("Failed to update goal:", err);
      throw err;
    }
  };

  const handleDeleteGoal = async (goal) => {
    if (window.confirm(`Are you sure you want to delete "${goal.name}"? This will also delete all contributions.`)) {
      try {
        await savingsService.deleteGoal(goal.id, token);
        await fetchGoals();
      } catch (err) {
        console.error("Failed to delete goal:", err);
        alert("Failed to delete goal. Please try again.");
      }
    }
  };

  const handleAddContribution = async (amount) => {
    try {
      await savingsService.addContribution(selectedGoal.id, { amount }, token);
      await fetchGoals();
      if (isHistoryModalOpen) {
        await fetchContributions(selectedGoal.id);
      }
    } catch (err) {
      console.error("Failed to add contribution:", err);
      throw err;
    }
  };

  const handleOpenCreateModal = () => {
    setModalMode("create");
    setSelectedGoal(null);
    setIsGoalModalOpen(true);
  };

  const handleEditGoal = (goal) => {
    setSelectedGoal(goal);
    setModalMode("edit");
    setIsGoalModalOpen(true);
  };

  const handleOpenContributionModal = (goal) => {
    setSelectedGoal(goal);
    setIsContributionModalOpen(true);
  };

  const handleViewHistory = async (goal) => {
    setSelectedGoal(goal);
    await fetchContributions(goal.id);
    setIsHistoryModalOpen(true);
  };

  const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Savings Goals</h1>
          <p className="text-gray-400 mt-1">
            Track your progress towards financial freedom
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#5409DA] to-[#4E71FF] text-white rounded-lg font-medium hover:opacity-90 transition"
        >
          <FiPlus size={18} />
          New Goal
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-red-950 border border-red-800 text-red-400">
          <FiAlertCircle size={18} />
          <span className="text-sm">{error}</span>
          <button onClick={fetchGoals} className="ml-auto text-sm underline hover:no-underline">
            Retry
          </button>
        </div>
      )}

      {/* Overall Progress Card */}
      {goals.length > 0 && (
        <div className="bg-gradient-to-r from-[#5409DA] to-[#4E71FF] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FiPieChart size={20} className="text-white/80" />
              <h3 className="text-white font-semibold">Overall Progress</h3>
            </div>
            <span className="text-white/80 text-sm">{overallProgress.toFixed(1)}%</span>
          </div>
          <div className="relative h-3 bg-white/20 rounded-full overflow-hidden mb-3">
            <div
              className="absolute left-0 top-0 h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${Math.min(overallProgress, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-white/80 text-sm">
            <span>₱{totalSaved.toLocaleString()} saved</span>
            <span>of ₱{totalTarget.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
          <div className="inline-flex p-4 rounded-2xl bg-gray-800 mb-4">
            <FiPieChart size={32} className="text-gray-500" />
          </div>
          <h3 className="text-white font-medium text-lg mb-2">No savings goals yet</h3>
          <p className="text-gray-500 mb-4">
            Create your first savings goal to start tracking your progress
          </p>
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 bg-gradient-to-r from-[#5409DA] to-[#4E71FF] text-white rounded-lg text-sm font-medium hover:opacity-90 transition"
          >
            Create Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {goals.map((goal) => (
            <SavingsGoalCard
              key={goal.id}
              goal={goal}
              onEdit={handleEditGoal}
              onDelete={handleDeleteGoal}
              onAddContribution={handleOpenContributionModal}
              onViewHistory={handleViewHistory}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <SavingsGoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onSubmit={modalMode === "create" ? handleCreateGoal : handleUpdateGoal}
        goal={selectedGoal}
        mode={modalMode}
      />

      <ContributionModal
        isOpen={isContributionModalOpen}
        onClose={() => setIsContributionModalOpen(false)}
        onSubmit={handleAddContribution}
        goalName={selectedGoal?.name}
      />

      <ContributionHistory
        contributions={contributions}
        onClose={() => setIsHistoryModalOpen(false)}
      />
    </div>
  );
}