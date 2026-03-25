import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";

export default function CategoryModal({ isOpen, onClose, onSubmit, category, mode = "create" }) {
  const [formData, setFormData] = useState({
    categoryName: "",
    categoryType: "Expense",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (category && mode === "edit") {
      setFormData({
        categoryName: category.categoryName,
        categoryType: category.categoryType,
      });
    }
  }, [category, mode]);

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setFormData({
        categoryName: "",
        categoryType: "Expense",
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
      if (!formData.categoryName.trim()) {
        throw new Error("Category name is required");
      }

      const data = {
        categoryName: formData.categoryName.trim(),
        categoryType: formData.categoryType,
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
            {mode === "create" ? "Create Category" : "Edit Category"}
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

          {/* Category Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Category Name
            </label>
            <input
              type="text"
              value={formData.categoryName}
              onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
              placeholder="e.g., Groceries, Rent, Salary"
              required
              className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3.5 py-2.5 placeholder-gray-500 outline-none focus:border-[#4E71FF] focus:ring-1 focus:ring-[#4E71FF] transition"
            />
          </div>

          {/* Category Type Select */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Category Type
            </label>
            <select
              value={formData.categoryType}
              onChange={(e) => setFormData({ ...formData, categoryType: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3.5 py-2.5 outline-none focus:border-[#4E71FF] focus:ring-1 focus:ring-[#4E71FF] transition"
            >
              <option value="Expense">Expense</option>
              <option value="Income">Income</option>
            </select>
            <p className="text-xs text-gray-500 mt-1.5">
              Income categories appear when adding income, expense categories appear when adding expenses
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#5409DA] to-[#4E71FF] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition"
          >
            {loading ? "Saving..." : mode === "create" ? "Create Category" : "Update Category"}
          </button>
        </form>
      </div>
    </div>
  );
}