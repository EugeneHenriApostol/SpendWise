//BudgetModal.jsx
import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";

export default function BudgetModal({ isOpen, onClose, onSubmit, budget, mode = "create" }) {
  const [formData, setFormData] = useState({
    amount: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (budget && mode === "edit") {
      setFormData({
        amount: budget.amount,
        month: budget.month,
        year: budget.year,
      });
    }
  }, [budget, mode]);

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setFormData({
        amount: "",
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      });
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Please enter a valid amount greater than 0");
      }

      // Different data structure based on mode
      let data;
      if (mode === "create") {
        // CreateBudgetDto expects: Amount, Month, Year
        data = {
          amount: amount,
          month: parseInt(formData.month),
          year: parseInt(formData.year),
        };
      } else {
        // UpdateBudgetDto expects: BudgetAmount, Month, Year
        data = {
          budgetAmount: amount,
          month: parseInt(formData.month),
          year: parseInt(formData.year),
        };
      }

      await onSubmit(data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">
            {mode === "create" ? "Set Monthly Budget" : "Edit Budget"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-950 border border-red-800 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Budget Amount (₱)
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
              className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3.5 py-2.5 placeholder-gray-500 outline-none focus:border-[#4E71FF] focus:ring-1 focus:ring-[#4E71FF] transition"
            />
          </div>

          {/* Month Select */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Month
            </label>
            <select
              value={formData.month}
              onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
              className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3.5 py-2.5 outline-none focus:border-[#4E71FF] focus:ring-1 focus:ring-[#4E71FF] transition"
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>

          {/* Year Select */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Year
            </label>
            <select
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
              className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3.5 py-2.5 outline-none focus:border-[#4E71FF] focus:ring-1 focus:ring-[#4E71FF] transition"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#5409DA] to-[#4E71FF] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition"
          >
            {loading ? "Saving..." : mode === "create" ? "Set Budget" : "Update Budget"}
          </button>
        </form>
      </div>
    </div>
  );
}