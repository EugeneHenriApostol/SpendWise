//BudgetRepository.cs
using Microsoft.EntityFrameworkCore;
using SpendWise.Data;
using SpendWise.Models;

namespace SpendWise.Repository
{
    public class BudgetRepository
    {
        private readonly AppDbContext _context;

        public BudgetRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Budget budget)
        {
            _context.Budgets.Add(budget);
            await _context.SaveChangesAsync();
        }

        public async Task<Budget?> GetByIdAsync(string userId, int budgetId)
        {
            return await _context.Budgets
                .FirstOrDefaultAsync(b =>
                    b.Id == budgetId &&
                    b.UserId == userId);
        }

        public async Task<Budget?> GetByMonthAsync(string userId, int month, int year)
        {
            return await _context.Budgets
                .AsNoTracking()
                .FirstOrDefaultAsync(b =>
                    b.UserId == userId &&
                    b.Month == month &&
                    b.Year == year);
        }

        public async Task<List<Budget>> GetAllAsync(string userId)
        {
            return await _context.Budgets
                .Where(b => b.UserId == userId)
                .OrderByDescending(b => b.Year)
                .ThenByDescending(b => b.Month)
                .AsNoTracking()
                .ToListAsync();
        }


        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}