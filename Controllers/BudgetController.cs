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
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized();
            }

            var result = await _service.AddBudget(userId, dto);

            return Ok(result);
        }
    }
}
