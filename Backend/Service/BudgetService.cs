using SpendWise.Repository;
using SpendWise.Models;
using SpendWise.DTO.Budget;

namespace SpendWise.Service
{
    public class BudgetService
    {
        private readonly BudgetRepository _budgetRepo;

        public BudgetService(BudgetRepository budgetRepo)
        {
            _budgetRepo = budgetRepo;
        }

        public async Task<BudgetResponseDto> AddBudget(string userId, CreateBudgetDto dto)
        {
            var existing = await _budgetRepo.GetBudget(userId, dto.Month, dto.Year);

            if (existing != null)
            {
                throw new KeyNotFoundException("Budget already exists for this month");
            }

            var budget = new Budget
            {
                UserId = userId,
                BudgetAmount = dto.Amount,
                Month = dto.Month,
                Year = dto.Year,
            };

            budget = await _budgetRepo.AddBudget(budget);

            return new BudgetResponseDto
            {
                Id = budget.Id,
                Amount = budget.BudgetAmount,
                Month = budget.Month,
                Year = budget.Year,
            };
        }

        public async Task<BudgetResponseDto> GetBudget(string userId, int month, int year)
        {
            var budget = await _budgetRepo.GetBudget(userId, month, year);

            if (budget == null)
            {
                throw new KeyNotFoundException("Budget Not Found");
            }

            return new BudgetResponseDto
            {
                Id = budget.Id,
                Amount = budget.BudgetAmount,
                Month = budget.Month,
                Year = budget.Year,
            };
        }

        public async Task<BudgetResponseDto> UpdateBudget(string userId, int budgetId, UpdateBudgetDto dto)
        {
            var updateBudget = await _budgetRepo.UpdateBudget(userId, budgetId, dto);

            return new BudgetResponseDto
            {
                Id = updateBudget.Id,
                Amount = updateBudget.BudgetAmount,
                Month = updateBudget.Month,
                Year = updateBudget.Year,
            };
        }

        public async Task<BudgetResponseDto> DeleteBudget(string userId, int budgetId)
        {
            var deleteBudget = await _budgetRepo.DeleteBudget(userId, budgetId);

            return new BudgetResponseDto
            {
                Id = deleteBudget.Id,
                Amount = deleteBudget.BudgetAmount,
                Month = deleteBudget.Month,
                Year = deleteBudget.Year,
            };
        }
    }
}
