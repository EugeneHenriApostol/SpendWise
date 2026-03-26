//TransactionFilters.jsx
import { useState } from "react";
import { FiSearch, FiCalendar, FiFilter, FiX } from "react-icons/fi";

export default function TransactionFilters({ 
  searchTerm, 
  onSearchChange,
  filterType,
  onFilterTypeChange,
  dateRange,
  onDateRangeChange,
  categories,
  selectedCategory,
  onCategoryChange,
  onReset
}) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const hasActiveFilters = searchTerm || filterType !== "all" || selectedCategory || dateRange?.from || dateRange?.to;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search by description..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 text-white text-sm rounded-lg pl-10 pr-4 py-2.5 placeholder-gray-500 outline-none focus:border-[#4E71FF] focus:ring-1 focus:ring-[#4E71FF] transition"
          />
        </div>

        {/* Type Filter */}
        <div className="flex gap-2">
          <button
            onClick={() => onFilterTypeChange("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filterType === "all"
                ? "bg-gradient-to-r from-[#5409DA] to-[#4E71FF] text-white"
                : "bg-gray-900 border border-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            All
          </button>
          <button
            onClick={() => onFilterTypeChange("expense")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filterType === "expense"
                ? "bg-red-600 text-white"
                : "bg-gray-900 border border-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            Expenses
          </button>
          <button
            onClick={() => onFilterTypeChange("income")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filterType === "income"
                ? "bg-green-600 text-white"
                : "bg-gray-900 border border-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            Income
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        {/* Category Filter */}
        <select
          value={selectedCategory || ""}
          onChange={(e) => onCategoryChange(e.target.value || null)}
          className="bg-gray-900 border border-gray-800 text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-[#4E71FF] focus:ring-1 focus:ring-[#4E71FF] transition"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.categoryName}
            </option>
          ))}
        </select>

        {/* Date Range Filter - Simplified for now */}
        <div className="relative">
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="flex items-center gap-2 px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-gray-400 hover:text-white transition"
          >
            <FiCalendar size={14} />
            <span className="text-sm">
              {dateRange?.from || dateRange?.to 
                ? "Date Range"
                : "Filter by date"}
            </span>
          </button>
          
          {showDatePicker && (
            <div className="absolute top-full left-0 mt-2 z-10 bg-gray-900 border border-gray-800 rounded-lg p-3 shadow-xl min-w-[200px]">
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">From</label>
                  <input
                    type="date"
                    value={dateRange?.from || ""}
                    onChange={(e) => onDateRangeChange({ ...dateRange, from: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-2 py-1.5 outline-none focus:border-[#4E71FF]"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">To</label>
                  <input
                    type="date"
                    value={dateRange?.to || ""}
                    onChange={(e) => onDateRangeChange({ ...dateRange, to: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-2 py-1.5 outline-none focus:border-[#4E71FF]"
                  />
                </div>
                {(dateRange?.from || dateRange?.to) && (
                  <button
                    onClick={() => onDateRangeChange({ from: null, to: null })}
                    className="w-full text-xs text-red-400 hover:text-red-300 mt-2"
                  >
                    Clear dates
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Reset Filters */}
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition"
          >
            <FiX size={14} />
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
}