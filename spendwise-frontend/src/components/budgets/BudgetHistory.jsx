//BudgetHistory.jsx
import { FiCalendar, FiDollarSign, FiX } from "react-icons/fi";

export default function BudgetHistory({ budgets, onClose }) {
  if (!budgets || budgets.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
        <div className="inline-flex p-3 rounded-xl bg-gray-800 mb-3">
          <FiCalendar size={24} className="text-gray-500" />
        </div>
        <h3 className="text-white font-medium mb-1">No budget history found</h3>
        <p className="text-gray-500 text-sm">No past budgets have been set yet</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition"
        >
          Close
        </button>
      </div>
    );
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-gray-800">
        <div>
          <h2 className="text-white font-semibold text-lg">Budget History</h2>
          <p className="text-gray-400 text-sm mt-1">Your past monthly budgets</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
        >
          <FiX size={20} />
        </button>
      </div>
      
      <div className="divide-y divide-gray-800 max-h-96 overflow-y-auto">
        {budgets.map((budget) => (
          <div key={budget.id} className="p-4 hover:bg-gray-800/50 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">
                  {monthNames[budget.month - 1]} {budget.year}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1">
                    <FiDollarSign size={12} className="text-gray-500" />
                    <span className="text-gray-400 text-sm">
                      ₱{budget.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-400">
                  Past
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}