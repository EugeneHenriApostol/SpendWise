//SavingsGoalCard.jsx
import { FiEdit2, FiTrash2, FiPlus, FiTarget, FiCalendar, FiTrendingUp } from "react-icons/fi";

export default function SavingsGoalCard({ goal, onEdit, onDelete, onAddContribution }) {
  const progress = goal.progressPercentage || ((goal.currentAmount / goal.targetAmount) * 100);
  const isCompleted = goal.isCompleted || progress >= 100;
  
  const formatDate = (dateString) => {
    if (!dateString) return "No deadline";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const getProgressColor = () => {
    if (isCompleted) return "from-green-500 to-green-600";
    if (progress >= 75) return "from-[#8DD8FF] to-[#BBFBFF]";
    if (progress >= 50) return "from-[#4E71FF] to-[#8DD8FF]";
    return "from-[#5409DA] to-[#4E71FF]";
  };

  const getStatusText = () => {
    if (isCompleted) return "Completed! 🎉";
    if (progress >= 75) return "Almost there!";
    if (progress >= 50) return "Halfway there!";
    return "Keep going!";
  };

  const remaining = goal.targetAmount - goal.currentAmount;
  const remainingDays = goal.targetDate 
    ? Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-all duration-200">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl bg-gradient-to-br ${getProgressColor()} bg-opacity-20`}>
              <FiTarget size={18} className="text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">{goal.name}</h3>
              <span className="text-xs text-gray-500">{getStatusText()}</span>
            </div>
          </div>
          
          <div className="flex gap-1">
            <button
              onClick={() => onAddContribution(goal)}
              className="p-2 rounded-lg text-gray-400 hover:text-[#8DD8FF] hover:bg-gray-800 transition"
              title="Add contribution"
            >
              <FiPlus size={16} />
            </button>
            <button
              onClick={() => onEdit(goal)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
              title="Edit goal"
            >
              <FiEdit2 size={16} />
            </button>
            <button
              onClick={() => onDelete(goal)}
              className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-gray-800 transition"
              title="Delete goal"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        </div>

        {/* Amounts */}
        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Target</span>
            <span className="text-white font-medium">₱{goal.targetAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Saved</span>
            <span className="text-[#8DD8FF] font-medium">₱{goal.currentAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Remaining</span>
            <span className="text-white font-medium">₱{remaining.toLocaleString()}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`absolute left-0 top-0 h-full bg-gradient-to-r ${getProgressColor()} transition-all duration-500`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-500">{progress.toFixed(1)}%</span>
            {!isCompleted && (
              <span className="text-xs text-gray-500">
                ₱{Math.ceil(remaining / (remainingDays || 30))}/day needed
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-800">
          <div className="flex items-center gap-1">
            <FiCalendar size={12} className="text-gray-500" />
            <span className="text-xs text-gray-500">
              {goal.targetDate ? formatDate(goal.targetDate) : "No deadline"}
            </span>
          </div>
          {remainingDays && remainingDays > 0 && !isCompleted && (
            <div className="flex items-center gap-1">
              <FiTrendingUp size={12} className="text-gray-500" />
              <span className="text-xs text-gray-500">{remainingDays} days left</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}