//BudgetController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SpendWise.DTO.Budget;
using SpendWise.Service;
using System.Security.Claims;

namespace SpendWise.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class BudgetController : BaseController
    {
        private readonly BudgetService _service;

        public BudgetController(BudgetService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> AddBudget(CreateBudgetDto dto)
        {
            try
            {
                var result = await _service.AddBudget(UserId, dto);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        [HttpGet("{month}/{year}")]
        public async Task<IActionResult> GetBudget(int month, int year)
        {
            var result = await _service.GetBudget(UserId, month, year);

            // Always return a JSON object, never empty response
            if (result == null)
            {
                return Ok(new { exists = false, budget = (object?)null });
            }

            return Ok(new { exists = true, budget = result });
        }

        [HttpPut("{budgetId}")]
        public async Task<IActionResult> UpdateBudget(int budgetId, UpdateBudgetDto dto)
        {
            var result = await _service.UpdateBudget(UserId, budgetId, dto);

            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllBudgets()
        {
            var result = await _service.GetAllBudgets(UserId);
            return Ok(result);
        }


        [HttpDelete("{budgetId}")]
        public async Task<IActionResult> DeleteBudget(int budgetId)
        {

            var result = await _service.DeleteBudget(UserId, budgetId);

            return Ok(result);
        }
    }
}
