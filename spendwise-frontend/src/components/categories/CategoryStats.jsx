// CategoryStats.jsx
import { FiPieChart, FiTag, FiTrendingUp, FiTrendingDown } from "react-icons/fi";

export default function CategoryStats({ categories }) {
  const totalCategories = categories.length;
  const expenseCategories = categories.filter(c => c.categoryType === "Expense").length;
  const incomeCategories = categories.filter(c => c.categoryType === "Income").length;

  const stats = [
    {
      title: "Total Categories",
      value: totalCategories,
      icon: FiTag,
      color: "from-[#5409DA] to-[#4E71FF]",
    },
    {
      title: "Expense Categories",
      value: expenseCategories,
      icon: FiTrendingDown,
      color: "from-red-500 to-red-600",
    },
    {
      title: "Income Categories",
      value: incomeCategories,
      icon: FiTrendingUp,
      color: "from-green-500 to-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="relative overflow-hidden rounded-2xl bg-gray-900 border border-gray-800 p-5"
        >
          <div className="relative z-10">
            <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-20 mb-3`}>
              <stat.icon size={20} className="text-white" />
            </div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}