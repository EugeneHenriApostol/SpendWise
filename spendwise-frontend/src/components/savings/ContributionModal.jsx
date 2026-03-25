import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";

export default function ContributionModal({ isOpen, onClose, onSubmit, goalName }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setAmount("");
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const contributionAmount = parseFloat(amount);
      if (isNaN(contributionAmount) || contributionAmount <= 0) {
        throw new Error("Please enter a valid amount greater than 0");
      }

      await onSubmit(contributionAmount);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">
            Add Contribution
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <div className="text-center mb-4">
            <p className="text-gray-400 text-sm">Adding to</p>
            <p className="text-white font-semibold text-lg">{goalName}</p>
          </div>

          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-950 border border-red-800 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Contribution Amount (₱)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
              className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3.5 py-2.5 placeholder-gray-500 outline-none focus:border-[#4E71FF] focus:ring-1 focus:ring-[#4E71FF] transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#5409DA] to-[#4E71FF] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition"
          >
            {loading ? "Adding..." : "Add Contribution"}
          </button>
        </form>
      </div>
    </div>
  );
}