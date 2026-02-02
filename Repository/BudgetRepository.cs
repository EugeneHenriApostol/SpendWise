using Microsoft.EntityFrameworkCore;
using SpendWise.Data;
using SpendWise.DTO;
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

        public async Task<Budget> AddBudget(Budget budget)
        {
            budget.MarkCreated();

            _context.Budgets.Add(budget);
            await _context.SaveChangesAsync();

            return budget;
        }

        public async Task<Budget> UpdateBudget(string userId, int budgetId, UpdateBudgetDto dto)
        {
            var budget = await _context.Budgets.FirstOrDefaultAsync(b => b.UserId == userId && b.Id == budgetId && !b.IsDeleted);

            if (budget == null)
            {
                throw new Exception("Budget not found");
            }

            budget.BudgetAmount = dto.BudgetAmount;
            budget.Month = dto.Month;
            budget.Year = dto.Year;

            budget.MarkUpdated();

            await _context.SaveChangesAsync();

            return budget;
        }

        public async Task<Budget?> GetBudget(string userId, int month, int year)
        {
            return await _context.Budgets.FirstOrDefaultAsync(b => b.UserId == userId && b.Month == month && b.Year == year);
        }

        public async Task<Budget> DeleteBudget(string userId, int budgetId)
        {
            var budget = await _context.Budgets.FirstOrDefaultAsync(b => b.Id == budgetId
                                                                    && b.UserId == userId
                                                                    && !b.IsDeleted);
            if (budget == null)
            {
                throw new Exception("Budget not found");
            }

            budget.SoftDelete();

            await _context.SaveChangesAsync();
            return budget;
        }
    }
}
