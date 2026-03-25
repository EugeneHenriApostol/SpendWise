import { FiEdit2, FiTrash2, FiArrowUpRight, FiArrowDownRight, FiCalendar, FiTag } from "react-icons/fi";

export default function TransactionCard({ transaction, categories, onEdit, onDelete }) {
  const getTypeStyles = () => {
    if (transaction.type === "Income") {
      return {
        bg: "bg-green-500/10",
        border: "border-green-500/20",
        text: "text-green-400",
        icon: FiArrowUpRight,
        amountClass: "text-green-400",
        prefix: "+",
      };
    }
    return {
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      text: "text-red-400",
      icon: FiArrowDownRight,
      amountClass: "text-red-400",
      prefix: "-",
    };
  };

  const styles = getTypeStyles();
  const Icon = styles.icon;
  
  const category = categories.find(c => c.id === transaction.categoryId);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl hover:border-gray-700 transition-all duration-200 group">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className={`p-2 rounded-xl ${styles.bg} border ${styles.border}`}>
              <Icon size={18} className={styles.text} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-white font-medium">
                  {transaction.type}
                </span>
                {category && (
                  <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-400">
                    <FiTag size={10} />
                    {category.categoryName}
                  </span>
                )}
              </div>
              {transaction.description && (
                <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                  {transaction.description}
                </p>
              )}
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1 text-gray-500 text-xs">
                  <FiCalendar size={12} />
                  <span>{formatDate(transaction.date)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className={`text-lg font-bold ${styles.amountClass}`}>
                {styles.prefix} ₱{transaction.amount.toLocaleString()}
              </p>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onEdit(transaction)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
                title="Edit transaction"
              >
                <FiEdit2 size={14} />
              </button>
              <button
                onClick={() => onDelete(transaction)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-gray-800 transition"
                title="Delete transaction"
              >
                <FiTrash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}