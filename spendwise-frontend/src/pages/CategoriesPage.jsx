//CategoriesPage.jsx

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { categoryService } from "../services/categoryService";
import { transactionService } from "../services/transactionService";
import CategoryModal from "../components/categories/CategoryModal";
import CategoryCard from "../components/categories/CategoryCard";
import CategoryStats from "../components/categories/CategoryStats";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { FiPlus, FiAlertCircle, FiSearch, FiTag } from "react-icons/fi";

export default function CategoriesPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // all, expense, income
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterCategories();
  }, [searchTerm, filterType, categories]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [categoriesData, transactionsData] = await Promise.all([
        categoryService.getCategories(token),
        transactionService.getTransactions(token),
      ]);
      
      setCategories(categoriesData);
      setTransactions(transactionsData);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setError("Failed to load categories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filterCategories = () => {
    let filtered = [...categories];
    
    // Filter by type
    if (filterType === "expense") {
      filtered = filtered.filter(c => c.categoryType === "Expense");
    } else if (filterType === "income") {
      filtered = filtered.filter(c => c.categoryType === "Income");
    }
    
    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(c =>
        c.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredCategories(filtered);
  };

  const getTransactionCount = (categoryId) => {
    return transactions.filter(tx => tx.categoryId === categoryId).length;
  };

  const handleCreateCategory = async (data) => {
    try {
      await categoryService.createCategory(data, token);
      await fetchData(); // Refresh data
    } catch (err) {
      console.error("Failed to create category:", err);
      throw err;
    }
  };

  const handleUpdateCategory = async (data) => {
    try {
      await categoryService.updateCategory(selectedCategory.id, data, token);
      await fetchData(); // Refresh data
    } catch (err) {
      console.error("Failed to update category:", err);
      throw err;
    }
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleDeleteCategory = async (category) => {
    const transactionCount = getTransactionCount(category.id);
    const message = transactionCount > 0
      ? `This category has ${transactionCount} transaction(s). Deleting it will affect your transaction history. Are you sure you want to delete "${category.categoryName}"?`
      : `Are you sure you want to delete "${category.categoryName}"?`;
    
    if (window.confirm(message)) {
      try {
        await categoryService.deleteCategory(category.id, token);
        await fetchData(); // Refresh data
      } catch (err) {
        console.error("Failed to delete category:", err);
        alert("Failed to delete category. Please try again.");
      }
    }
  };

  const handleOpenCreateModal = () => {
    setModalMode("create");
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Categories</h1>
          <p className="text-gray-400 mt-1">
            Organize your transactions by creating categories
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#5409DA] to-[#4E71FF] text-white rounded-lg font-medium hover:opacity-90 transition"
        >
          <FiPlus size={18} />
          New Category
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-red-950 border border-red-800 text-red-400">
          <FiAlertCircle size={18} />
          <span className="text-sm">{error}</span>
          <button onClick={fetchData} className="ml-auto text-sm underline hover:no-underline">
            Retry
          </button>
        </div>
      )}

      {/* Stats */}
      <CategoryStats categories={categories} />

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 text-white text-sm rounded-lg pl-10 pr-4 py-2.5 placeholder-gray-500 outline-none focus:border-[#4E71FF] focus:ring-1 focus:ring-[#4E71FF] transition"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilterType("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filterType === "all"
                ? "bg-gradient-to-r from-[#5409DA] to-[#4E71FF] text-white"
                : "bg-gray-900 border border-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType("expense")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filterType === "expense"
                ? "bg-red-600 text-white"
                : "bg-gray-900 border border-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            Expenses
          </button>
          <button
            onClick={() => setFilterType("income")}
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

      {/* Categories Grid */}
      {filteredCategories.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
          <div className="inline-flex p-4 rounded-2xl bg-gray-800 mb-4">
            <FiTag size={32} className="text-gray-500" />
          </div>
          <h3 className="text-white font-medium text-lg mb-2">No categories found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || filterType !== "all"
              ? "Try adjusting your search or filter"
              : "Create your first category to start organizing transactions"}
          </p>
          {!searchTerm && filterType === "all" && (
            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2 bg-gradient-to-r from-[#5409DA] to-[#4E71FF] text-white rounded-lg text-sm font-medium hover:opacity-90 transition"
            >
              Create Category
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={handleEditCategory}
              onDelete={handleDeleteCategory}
              transactionCount={getTransactionCount(category.id)}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={modalMode === "create" ? handleCreateCategory : handleUpdateCategory}
        category={selectedCategory}
        mode={modalMode}
      />
    </div>
  );
}