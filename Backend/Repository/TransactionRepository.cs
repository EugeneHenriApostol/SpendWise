using Microsoft.EntityFrameworkCore;
using SpendWise.Data;
using SpendWise.Models;

namespace SpendWise.Repository
{
    public class TransactionRepository
    {
        private readonly AppDbContext _context;

        public TransactionRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Transaction transaction)
        {
            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();
        }

        public async Task<Transaction?> GetByIdAsync(string userId, int transactionId)
        {
            return await _context.Transactions
                .Include(t => t.Category)
                .FirstOrDefaultAsync(t => t.Id == transactionId && t.UserId == userId);
        }

        public async Task<List<Transaction>> GetAllAsync(string userId)
        {
            return await _context.Transactions
                .Where(t => t.UserId == userId)
                .Include(t => t.Category)
                .OrderByDescending(t => t.TransactionDate)
                .ThenByDescending(t => t.CreatedAt)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<List<Transaction>> GetByMonthAsync(string userId, int year, int month)
        {
            return await _context.Transactions
                .Where(t => t.UserId == userId &&
                            t.TransactionDate.Year == year &&
                            t.TransactionDate.Month == month)
                .Include(t => t.Category)
                .OrderByDescending(t => t.TransactionDate)
                .ThenByDescending(t => t.CreatedAt)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<(List<Transaction> Items, int TotalCount)> GetPaginatedAsync(
            string userId,
            int pageNumber = 1,
            int pageSize = 10,
            string? filterType = null,
            int? categoryId = null,
            string? searchTerm = null,
            DateTime? fromDate = null,
            DateTime? toDate = null
            )
        {
            var query = _context.Transactions
                .Where(t => t.UserId == userId)
                .Include(t => t.Category)
                .AsNoTracking();

            // apply filters
            if (!string.IsNullOrEmpty(filterType) && filterType != "all")
            {
                query = query.Where(t => t.TransactionType == filterType);
            }

            if (categoryId.HasValue)
            {
                query = query.Where(t => t.CategoryId == categoryId.Value);
            }

            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(t => t.Description != null && t.Description.Contains(searchTerm));
            }

            if (fromDate.HasValue)
            {
                var from = fromDate.Value.Date;
                query = query.Where(t => t.TransactionDate >= from);
            }

            if (toDate.HasValue)
            {
                var to = toDate.Value.Date.AddDays(1).AddTicks(-1);
                query = query.Where(t => t.TransactionDate <= to);
            }

            // get total count before pagination
            var totalCount = await query.CountAsync();

            // apply pagination and sorting
            var items = await query
                .OrderByDescending(t => t.TransactionDate)
                .ThenByDescending(t => t.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, totalCount);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}