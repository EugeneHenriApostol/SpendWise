//BudgetCard.jsx
import { FiEdit2, FiTrash2, FiTrendingUp, FiTrendingDown } from "react-icons/fi";

export default function BudgetCard({ budget, currentExpenses, onEdit, onDelete }) {
  const spent = currentExpenses || 0;
  const remaining = budget.amount - spent;
  const spentPercentage = (spent / budget.amount) * 100;
  
  const getStatusColor = () => {
    if (spentPercentage >= 100) return "from-red-500 to-red-600";
    if (spentPercentage >= 80) return "from-yellow-500 to-yellow-600";
    return "from-[#5409DA] to-[#4E71FF]";
  };

  const getStatusText = () => {
    if (spentPercentage >= 100) return "Over Budget";
    if (spentPercentage >= 80) return "Approaching Limit";
    return "On Track";
  };

  const getStatusIcon = () => {
    if (spentPercentage >= 100) return <FiTrendingDown className="text-red-400" />;
    return <FiTrendingUp className="text-green-400" />;
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-all duration-200">
      {/* Header */}
      <div className="p-5 border-b border-gray-800">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white font-semibold text-lg">
            {monthNames[budget.month - 1]} {budget.year}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(budget)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
            >
              <FiEdit2 size={16} />
            </button>
            <button
              onClick={() => onDelete(budget)}
              className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-gray-800 transition"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className={`text-sm font-medium ${
            spentPercentage >= 100 ? "text-red-400" : 
            spentPercentage >= 80 ? "text-yellow-400" : 
            "text-[#8DD8FF]"
          }`}>
            {getStatusText()}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="p-5 space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Budget</span>
            <span className="text-white font-medium">₱{budget.amount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Spent</span>
            <span className={`font-medium ${spentPercentage >= 100 ? "text-red-400" : "text-white"}`}>
              ₱{spent.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm mb-3">
            <span className="text-gray-400">Remaining</span>
            <span className={`font-medium ${remaining < 0 ? "text-red-400" : "text-green-400"}`}>
              ₱{Math.abs(remaining).toLocaleString()} {remaining < 0 ? "over" : "left"}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`absolute left-0 top-0 h-full bg-gradient-to-r ${getStatusColor()} transition-all duration-500`}
              style={{ width: `${Math.min(spentPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="bg-gray-800/50 rounded-lg p-3">
            <p className="text-gray-400 text-xs mb-1">Spent Percentage</p>
            <p className="text-white font-semibold text-lg">{spentPercentage.toFixed(1)}%</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3">
            <p className="text-gray-400 text-xs mb-1">Daily Average</p>
            <p className="text-white font-semibold text-lg">
              ₱{(spent / 30).toFixed(0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}