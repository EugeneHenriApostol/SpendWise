using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SpendWise.DTO.Savings;
using SpendWise.Service;

namespace SpendWise.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SavingsController : BaseController
    {
        private readonly SavingsService _service;

        public SavingsController(SavingsService service)
        {
            _service = service;
        }

        // savings goal

        [HttpPost("goal")]
        public async Task<IActionResult> CreateGoal(CreateSavingsGoalDto dto)
        {
            var result = await _service.CreateGoal(UserId, dto);

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetGoalById(int id)
        {
            var result = await _service.GetGoalById(UserId, id);

            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetUserGoals()
        {
            var result = await _service.GetUserGoals(UserId);

            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateGoal(int id, UpdateSavingsGoalDto dto)
        {
            var result = await _service.UpdateGoal(UserId, id, dto);

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGoal(int id)
        {
            var result = await _service.DeleteGoal(UserId, id);

            return Ok(result);
        }

        // contribution
        [HttpPost("{id}/contribution")]
        public async Task<IActionResult> AddContribution(string userId, int id, AddContributionDto dto)
        {
            var result = await _service.AddContribution(userId, id, dto);

            return Ok(result);
        }

        [HttpGet("{id}/contributions")]
        public async Task<IActionResult> GetContributions(int id)
        {
            var result = await _service.GetContributions(UserId, id);

            return Ok(result);
        }
    }
}
