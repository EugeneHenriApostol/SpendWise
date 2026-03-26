// CategoryCard.jsx
import { FiEdit2, FiTrash2, FiTrendingUp, FiTrendingDown } from "react-icons/fi";

export default function CategoryCard({ category, onEdit, onDelete, transactionCount = 0 }) {
  const getTypeStyles = () => {
    if (category.categoryType === "Income") {
      return {
        bg: "bg-green-500/10",
        border: "border-green-500/20",
        text: "text-green-400",
        icon: FiTrendingUp,
        badge: "bg-green-500/20 text-green-400",
      };
    }
    return {
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      text: "text-red-400",
      icon: FiTrendingDown,
      badge: "bg-red-500/20 text-red-400",
    };
  };

  const styles = getTypeStyles();
  const Icon = styles.icon;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl hover:border-gray-700 transition-all duration-200 group">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${styles.bg} border ${styles.border}`}>
              <Icon size={18} className={styles.text} />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">
                {category.categoryName}
              </h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${styles.badge}`}>
                {category.categoryType}
              </span>
            </div>
          </div>
          
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(category)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
              title="Edit category"
            >
              <FiEdit2 size={16} />
            </button>
            <button
              onClick={() => onDelete(category)}
              className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-gray-800 transition"
              title="Delete category"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 pt-4 border-t border-gray-800">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Transactions</span>
            <span className="text-white font-medium">{transactionCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}