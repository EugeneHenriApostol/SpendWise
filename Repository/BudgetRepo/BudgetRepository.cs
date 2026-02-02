using Microsoft.EntityFrameworkCore;
using SpendWise.Data;
using SpendWise.Models;

namespace SpendWise.Repository.BudgetRepo
{
    public class BudgetRepository : IBudgetRepository
    {
        private readonly AppDbContext _context;

        public BudgetRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Budget> AddBudgetAsync(Budget budget)
        {
            _context.Budgets.Add(budget);
            await _context.SaveChangesAsync();
            return budget;
        }

        public async Task<Budget> UpdateBudgetAsync(Budget budget)
        {
            _context.Budgets.Update(budget);
            await _context.SaveChangesAsync();
            return budget;
        }

        public async Task<Budget?> GetBudgetAsync(string userId, int month, int year)
        {
            return await _context.Budgets.FirstOrDefaultAsync(b => b.UserId == userId && b.Months == month && b.Year == year);
        }

        public async Task<Budget> DeleteBudgetAsync(string userId, int budgetId)
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
