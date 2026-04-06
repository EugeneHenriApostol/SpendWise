using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SpendWise.Services;
using SpendWise.Repository;

namespace SpendWise.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AIController : BaseController
    {
        private readonly AIClientService _aiClient;
        private readonly TransactionRepository _transactionRepo;
        private readonly BudgetRepository _budgetRepo;

        public AIController(AIClientService aiClient, TransactionRepository transactionRepo, BudgetRepository budgetRepo)
        {
            _aiClient = aiClient;
            _transactionRepo = transactionRepo;
            _budgetRepo = budgetRepo;
        }

        [HttpPost("budget-recommendations")]
        public async Task<IActionResult> GetBudgetRecommendations(int month, int year)
        {
            var transactions = await _transactionRepo.GetByMonthAsync(UserId, year, month);
            var currentBudget = await _budgetRepo.GetByMonthAsync(UserId, month, year);

            var recommendations = await _aiClient.GetBudgetRecommendations(
                transactions,
                month,
                year,
                currentBudget?.BudgetAmount
            );

            if (recommendations == null || !recommendations.Success)
                return BadRequest(recommendations?.Error ?? "AI service unavailable");

            return Ok(recommendations.Data);
        }

        [HttpPost("financial-insights")]
        public async Task<IActionResult> GetFinancialInsights()
        {
            var transactions = await _transactionRepo.GetAllAsync(UserId);

            var insights = await _aiClient.GetFinancialInsights(transactions);

            if (insights == null || !insights.Success)
                return BadRequest(insights?.Error ?? "AI service unavailable");

            return Ok(insights.Data);
        }
    }
}