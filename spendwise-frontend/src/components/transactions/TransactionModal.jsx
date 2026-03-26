//TransactionModal.jsx
import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";

export default function TransactionModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  transaction, 
  categories,
  mode = "create" 
}) {
  const [formData, setFormData] = useState({
    amount: "",
    type: "Expense",
    categoryId: "",
    date: new Date().toISOString().split('T')[0],
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (transaction && mode === "edit") {
      setFormData({
        amount: transaction.amount,
        type: transaction.type,
        categoryId: transaction.categoryId || "",
        date: transaction.date?.split('T')[0] || new Date().toISOString().split('T')[0],
        description: transaction.description || "",
      });
    }
  }, [transaction, mode]);

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setFormData({
        amount: "",
        type: "Expense",
        categoryId: "",
        date: new Date().toISOString().split('T')[0],
        description: "",
      });
      setError("");
    }
  }, [isOpen]);

  // Filter categories based on selected type
  const filteredCategories = categories.filter(
    cat => cat.categoryType === formData.type
  );

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

      if (!formData.categoryId) {
        throw new Error("Please select a category");
      }

      const data = {
        amount: amount,
        type: formData.type,
        categoryId: parseInt(formData.categoryId),
        date: formData.date,
        description: formData.description || undefined,
      };

      await onSubmit(data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">
            {mode === "create" ? "Add Transaction" : "Edit Transaction"}
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

          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Transaction Type
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, type: "Expense", categoryId: "" });
                }}
                className={`flex-1 py-2.5 rounded-lg font-medium transition ${
                  formData.type === "Expense"
                    ? "bg-red-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:text-white"
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, type: "Income", categoryId: "" });
                }}
                className={`flex-1 py-2.5 rounded-lg font-medium transition ${
                  formData.type === "Income"
                    ? "bg-green-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:text-white"
                }`}
              >
                Income
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Amount (₱)
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

          {/* Category Select */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Category
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              required
              className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3.5 py-2.5 outline-none focus:border-[#4E71FF] focus:ring-1 focus:ring-[#4E71FF] transition"
            >
              <option value="">Select a category</option>
              {filteredCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.categoryName}
                </option>
              ))}
            </select>
            {filteredCategories.length === 0 && (
              <p className="text-xs text-yellow-500 mt-1.5">
                No {formData.type.toLowerCase()} categories found. Create one in Categories page.
              </p>
            )}
          </div>

          {/* Date Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3.5 py-2.5 outline-none focus:border-[#4E71FF] focus:ring-1 focus:ring-[#4E71FF] transition"
            />
          </div>

          {/* Description (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Description <span className="text-gray-500 text-xs">(optional)</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add a note about this transaction..."
              rows="3"
              className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3.5 py-2.5 placeholder-gray-500 outline-none focus:border-[#4E71FF] focus:ring-1 focus:ring-[#4E71FF] transition resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#5409DA] to-[#4E71FF] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition"
          >
            {loading ? "Saving..." : mode === "create" ? "Add Transaction" : "Update Transaction"}
          </button>
        </form>
      </div>
    </div>
  );
}