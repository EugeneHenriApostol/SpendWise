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
            var result = await _service.AddTransaction(dto);

            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllTransactions()
        {
            var result = await _service.GetAllTransactions(UserId);

            return Ok(result);
        }

        [HttpGet("{id: int}")]
        public async Task<IActionResult> GetTransactionById(int id)
        {
            var result = await _service.GetTransactionById(UserId, id);

            return Ok(result);
        }

        [HttpGet("{month}")]
        public async Task<IActionResult> GetTransactionByMonth(int id, int month)
        {
            var result = await _service.GetTransactionByMonth(UserId, id, month);

            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTransaction(int id, UpdateTransactionDto dto)
        {
            var result = await _service.UpdateTransaction(UserId, id, dto);

            return Ok(result);
        }

        public async Task<IActionResult> DeleteTransaction(int id)
        {
            var result = await _service.DeleteTransaction(UserId, id);

            return Ok(result);
        }
    }
}
