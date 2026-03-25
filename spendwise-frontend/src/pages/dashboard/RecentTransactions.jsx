import { FiArrowUpRight, FiArrowDownRight, FiPlus } from "react-icons/fi";

export default function RecentTransactions({ transactions, onAddClick }) {
  const getTypeStyles = (type) => {
    if (type === "Income") {
      return {
        bg: "bg-green-500/10",
        text: "text-green-400",
        icon: FiArrowUpRight,
        border: "border-green-500/20",
      };
    }
    return {
      bg: "bg-red-500/10",
      text: "text-red-400",
      icon: FiArrowDownRight,
      border: "border-red-500/20",
    };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-gray-800">
        <h2 className="text-white font-semibold text-lg">Recent Transactions</h2>
        <button
          onClick={onAddClick}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#5409DA] to-[#4E71FF] text-white text-sm font-medium hover:opacity-90 transition"
        >
          <FiPlus size={16} />
          Add
        </button>
      </div>

      <div className="divide-y divide-gray-800">
        {transactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No transactions yet. Click "Add" to create your first transaction!
          </div>
        ) : (
          transactions.map((tx) => {
            const styles = getTypeStyles(tx.type);
            const Icon = styles.icon;
            return (
              <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-gray-800/50 transition">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`p-2 rounded-lg ${styles.bg} border ${styles.border}`}>
                    <Icon size={16} className={styles.text} />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">
                      {tx.type === "Income" ? "Income" : "Expense"}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {formatDate(tx.date)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${tx.type === "Income" ? "text-green-400" : "text-red-400"}`}>
                    {tx.type === "Income" ? "+" : "-"} ₱{tx.amount.toLocaleString()}
                  </p>
                  {tx.category && (
                    <p className="text-gray-500 text-xs mt-0.5">{tx.category.categoryName}</p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}