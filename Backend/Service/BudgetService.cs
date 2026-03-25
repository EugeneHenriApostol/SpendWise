//BudgetService.cs
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
            var existing = await _budgetRepo.GetByMonthAsync(userId, dto.Month, dto.Year);

            if (existing != null)
                throw new InvalidOperationException("Budget already exists for this month");

            var budget = new Budget
            {
                UserId = userId
            };

            budget.SetAmount(dto.Amount);
            budget.SetPeriod(dto.Month, dto.Year);
            budget.MarkCreated();

            await _budgetRepo.AddAsync(budget);

            return MapToDto(budget);
        }

        public async Task<BudgetResponseDto?> GetBudget(string userId, int month, int year)
        {
            var budget = await _budgetRepo.GetByMonthAsync(userId, month, year);

            if (budget == null)
                return null;

            return MapToDto(budget);
        }

        public async Task<List<BudgetResponseDto>> GetAllBudgets(string userId)
        {
            var budgets = await _budgetRepo.GetAllAsync(userId);
            return budgets.Select(MapToDto).ToList();
        }

        public async Task<BudgetResponseDto?> UpdateBudget(string userId, int budgetId, UpdateBudgetDto dto)
        {
            var budget = await _budgetRepo.GetByIdAsync(userId, budgetId);

            if (budget == null)
                return null;

            budget.SetAmount(dto.BudgetAmount);
            budget.SetPeriod(dto.Month, dto.Year);
            budget.MarkUpdated();

            await _budgetRepo.SaveChangesAsync();

            return MapToDto(budget);
        }

        public async Task<BudgetResponseDto?> DeleteBudget(string userId, int budgetId)
        {
            var budget = await _budgetRepo.GetByIdAsync(userId, budgetId);

            if (budget == null)
                return null;

            budget.SoftDelete();
            budget.MarkUpdated();

            await _budgetRepo.SaveChangesAsync();

            return MapToDto(budget);
        }

        private static BudgetResponseDto MapToDto(Budget budget)
        {
            return new BudgetResponseDto
            {
                Id = budget.Id,
                Amount = budget.BudgetAmount,
                Month = budget.Month,
                Year = budget.Year,
            };
        }
    }
}