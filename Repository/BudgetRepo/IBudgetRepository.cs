using SpendWise.Models;

namespace SpendWise.Repository.BudgetRepo
{
    public interface IBudgetRepository
    {
        public Task<Budget> AddBudgetAsync(Budget budget);
        public Task<Budget> UpdateBudgetAsync(Budget budget);
        public Task<Budget> DeleteBudgetAsync(string UserId, int budgetId);
        public Task<Budget?> GetBudgetAsync(string UserId, int month, int year);
    }
}
