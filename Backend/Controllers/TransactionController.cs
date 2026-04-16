//TransactionController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SpendWise.DTO.Transaction;
using SpendWise.Service;
using System.Security.Claims;

namespace SpendWise.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionController : BaseController
    {
        private readonly TransactionService _service;

        public TransactionController(TransactionService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> AddTransaction(CreateTransactionDto dto)
        {
            var result = await _service.AddTransaction(UserId, dto);

            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllTransactions()
        {
            var result = await _service.GetAllTransactions(UserId);

            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetTransactionById(int id)
        {
            var result = await _service.GetTransactionById(UserId, id);

            return Ok(result);
        }

        [HttpGet("paginated")]
        public async Task<IActionResult> GetPaginatedTransactions(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? filterType = null,
            [FromQuery] int? categoryId = null,
            [FromQuery] string? searchTerm = null,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null)
        {
            var result = await _service.GetPaginatedTransactions(
                UserId, pageNumber, pageSize, filterType, categoryId, searchTerm, fromDate, toDate);
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTransaction(int id, UpdateTransactionDto dto)
        {
            var result = await _service.UpdateTransaction(UserId, id, dto);

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTransaction(int id)
        {
            var result = await _service.DeleteTransaction(UserId, id);

            return Ok(result);
        }
    }
}
