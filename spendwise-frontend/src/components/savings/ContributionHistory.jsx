//ContributionHistory.jsx
import { FiDollarSign, FiCalendar } from "react-icons/fi";

export default function ContributionHistory({ contributions, onClose }) {
  if (!contributions || contributions.length === 0) {
    return null;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const totalContributions = contributions.reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-gray-900 border border-gray-800 rounded-2xl shadow-xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <div>
            <h2 className="text-xl font-semibold text-white">Contribution History</h2>
            <p className="text-gray-400 text-sm mt-1">Total: ₱{totalContributions.toLocaleString()}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="space-y-3">
            {contributions.map((contribution) => (
              <div
                key={contribution.id}
                className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                    <FiDollarSign size={14} className="text-green-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">₱{contribution.amount.toLocaleString()}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <FiCalendar size={10} className="text-gray-500" />
                      <span className="text-gray-500 text-xs">{formatDate(contribution.contributedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}