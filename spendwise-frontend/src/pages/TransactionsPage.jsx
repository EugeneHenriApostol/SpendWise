import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { transactionService } from "../services/transactionService";
import { categoryService } from "../services/categoryService";
import TransactionModal from "../components/transactions/TransactionModal";
import TransactionCard from "../components/transactions/TransactionCard";
import TransactionFilters from "../components/transactions/TransactionFilters";
import Pagination from "../components/common/Pagination";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { FiPlus, FiAlertCircle, FiTrendingUp, FiTrendingDown } from "react-icons/fi";

export default function TransactionsPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false
  });

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [dateRange, setDateRange] = useState({ from: null, to: null });

  // Stats (calculated from filtered data)
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netBalance: 0,
    transactionCount: 0,
  });

  // Fetch data when page, filters, or pagination changes
  useEffect(() => {
    fetchPaginatedData();
  }, [pagination.currentPage, pagination.pageSize, filterType, selectedCategory, searchTerm, dateRange]);

  // Also fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const categoriesData = await categoryService.getCategories(token);
      setCategories(categoriesData);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const fetchPaginatedData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        pageNumber: pagination.currentPage,
        pageSize: pagination.pageSize,
        filterType: filterType,
        categoryId: selectedCategory,
        searchTerm: searchTerm || null,
        fromDate: dateRange.from,
        toDate: dateRange.to
      };
      
      const response = await transactionService.getPaginatedTransactions(token, params);
      
      setTransactions(response.items);
      setPagination({
        currentPage: response.pageNumber,
        pageSize: response.pageSize,
        totalCount: response.totalCount,
        totalPages: response.totalPages,
        hasPreviousPage: response.hasPreviousPage,
        hasNextPage: response.hasNextPage
      });
      
      // Calculate stats from all transactions (you might want a separate endpoint for this)
      // For now, we'll just show stats for current page
      calculateStats(response.items);
      
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
      setError("Failed to load transactions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (items) => {
    const totalIncome = items
      .filter(t => t.type === "Income")
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = items
      .filter(t => t.type === "Expense")
      .reduce((sum, t) => sum + t.amount, 0);
    
    setStats({
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses,
      transactionCount: items.length,
    });
  };

  const handleCreateTransaction = async (data) => {
    try {
      await transactionService.createTransaction(data, token);
      await fetchPaginatedData(); // Refresh current page
      window.dispatchEvent(new Event('focus'));
    } catch (err) {
      console.error("Failed to create transaction:", err);
      throw err;
    }
  };

  const handleUpdateTransaction = async (data) => {
    try {
      await transactionService.updateTransaction(selectedTransaction.id, data, token);
      await fetchPaginatedData();
    } catch (err) {
      console.error("Failed to update transaction:", err);
      throw err;
    }
  };

  const handleEditTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleDeleteTransaction = async (transaction) => {
    if (window.confirm(`Are you sure you want to delete this ${transaction.type} of ₱${transaction.amount.toLocaleString()}?`)) {
      try {
        await transactionService.deleteTransaction(transaction.id, token);
        await fetchPaginatedData();
      } catch (err) {
        console.error("Failed to delete transaction:", err);
        alert("Failed to delete transaction. Please try again.");
      }
    }
  };

  const handleOpenCreateModal = () => {
    setModalMode("create");
    setSelectedTransaction(null);
    setIsModalOpen(true);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setFilterType("all");
    setSelectedCategory(null);
    setDateRange({ from: null, to: null });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (newSize) => {
    setPagination(prev => ({ ...prev, pageSize: newSize, currentPage: 1 }));
  };

  if (loading && transactions.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Transactions</h1>
          <p className="text-gray-400 mt-1">
            Track all your income and expenses
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#5409DA] to-[#4E71FF] text-white rounded-lg font-medium hover:opacity-90 transition"
        >
          <FiPlus size={18} />
          Add Transaction
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-red-950 border border-red-800 text-red-400">
          <FiAlertCircle size={18} />
          <span className="text-sm">{error}</span>
          <button onClick={fetchPaginatedData} className="ml-auto text-sm underline hover:no-underline">
            Retry
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-green-500/10 border border-green-500/20">
              <FiTrendingUp size={18} className="text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Income</p>
              <p className="text-white text-xl font-bold">₱{stats.totalIncome.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20">
              <FiTrendingDown size={18} className="text-red-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Expenses</p>
              <p className="text-white text-xl font-bold">₱{stats.totalExpenses.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <div>
            <p className="text-gray-400 text-sm">Net Balance</p>
            <p className={`text-xl font-bold ${stats.netBalance >= 0 ? "text-green-400" : "text-red-400"}`}>
              ₱{stats.netBalance.toLocaleString()}
            </p>
            <p className="text-gray-500 text-xs mt-1">Showing {transactions.length} of {pagination.totalCount} transactions</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <TransactionFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterType={filterType}
        onFilterTypeChange={setFilterType}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onReset={resetFilters}
      />

      {/* Transactions List */}
      {transactions.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
          <div className="inline-flex p-4 rounded-2xl bg-gray-800 mb-4">
            <FiPlus size={32} className="text-gray-500" />
          </div>
          <h3 className="text-white font-medium text-lg mb-2">No transactions found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || filterType !== "all" || selectedCategory
              ? "Try adjusting your filters"
              : "Add your first transaction to start tracking"}
          </p>
          {!searchTerm && filterType === "all" && !selectedCategory && (
            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2 bg-gradient-to-r from-[#5409DA] to-[#4E71FF] text-white rounded-lg text-sm font-medium hover:opacity-90 transition"
            >
              Add Transaction
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                categories={categories}
                onEdit={handleEditTransaction}
                onDelete={handleDeleteTransaction}
              />
            ))}
          </div>
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              pageSize={pagination.pageSize}
              onPageSizeChange={handlePageSizeChange}
              totalCount={pagination.totalCount}
            />
          )}
        </>
      )}

      {/* Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={modalMode === "create" ? handleCreateTransaction : handleUpdateTransaction}
        transaction={selectedTransaction}
        categories={categories}
        mode={modalMode}
      />
    </div>
  );
}