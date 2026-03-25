import { FiTrendingUp, FiTrendingDown, FiTarget, FiDollarSign } from "react-icons/fi";

export default function SummaryCards({ stats }) {
  const cards = [
    {
      title: "Total Income",
      value: `₱${stats.totalIncome.toLocaleString()}`,
      icon: FiTrendingUp,
      color: "from-green-500 to-green-600",
      bgGlow: "rgba(34,197,94,0.1)",
    },
    {
      title: "Total Expenses",
      value: `₱${stats.totalExpenses.toLocaleString()}`,
      icon: FiTrendingDown,
      color: "from-red-500 to-red-600",
      bgGlow: "rgba(239,68,68,0.1)",
    },
    {
      title: "Net Balance",
      value: `₱${stats.netBalance.toLocaleString()}`,
      icon: FiDollarSign,
      color: stats.netBalance >= 0 ? "from-[#5409DA] to-[#4E71FF]" : "from-red-500 to-red-600",
      bgGlow: "rgba(84,9,218,0.1)",
    },
    {
      title: "Budget Remaining",
      value: stats.budgetRemaining !== null ? `₱${stats.budgetRemaining.toLocaleString()}` : "Not set",
      icon: FiTarget,
      color: "from-[#8DD8FF] to-[#BBFBFF]",
      bgGlow: "rgba(141,216,255,0.1)",
      textColor: "text-[#8DD8FF]",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 p-5 hover:scale-[1.02] transition-transform duration-200"
        >
          <div
            className="absolute inset-0 opacity-20"
            style={{ background: `radial-gradient(circle at 20% 50%, ${card.bgGlow}, transparent 70%)` }}
          />
          <div className="relative z-10">
            <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${card.color} bg-opacity-20 mb-3`}>
              <card.icon size={20} className="text-white" />
            </div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">{card.title}</h3>
            <p className={`text-2xl font-bold ${card.textColor || "text-white"}`}>{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}