using SpendWise.DTO.Transaction;
using SpendWise.Models;
using SpendWise.Repository;

namespace SpendWise.Service
{
    public class TransactionService
    {
        private readonly TransactionRepository _repo;

        public TransactionService(TransactionRepository repo)
        {
            _repo = repo;
        }

        public async Task<TransactionResponseDto> AddTransaction(CreateTransactionDto dto)
        {
            var mapTransaction = new Transaction
            {
                TransactionAmount = dto.Amount,
                TransactionType = dto.Type,
                TransactionDate = dto.Date
            };

            var addTransaction = await _repo.AddTransaction(mapTransaction);

            return new TransactionResponseDto
            {
                Amount = addTransaction.TransactionAmount,
                Type = addTransaction.TransactionType,
                Date = addTransaction.TransactionDate,
            };
        }

        public async Task<IEnumerable<TransactionResponseDto>> GetAllTransactions(string userId)
        {
            var transactions = await _repo.GetAllTransactions(userId);

            return transactions.Select(t => new TransactionResponseDto
            {
                Amount = t.TransactionAmount,
                Type = t.TransactionType,
                Date = t.TransactionDate
            });
        }

        public async Task<TransactionResponseDto> GetTransactionById(string userId, int transactionId)
        {
            var transaction = await _repo.GetTransactionById(userId, transactionId);

            return new TransactionResponseDto
            {
                Amount = transaction.TransactionAmount,
                Type = transaction.TransactionType,
                Date = transaction.TransactionDate
            };
        }

        public async Task<IEnumerable<TransactionResponseDto>> GetTransactionByMonth(string userId, int year, int month)
        {
            var getTransaction = await _repo.GetTransactionByMonth(userId, year, month);

            return getTransaction.Select(t => new TransactionResponseDto
            {
                Amount = t.TransactionAmount,
                Type = t.TransactionType,
                Date = t.TransactionDate
            });
        }

        public async Task<TransactionResponseDto> UpdateTransaction(string userId, int transactionId, UpdateTransactionDto dto)
        {
            var updateTransaction = await _repo.UpdateTransaction(userId, transactionId, dto);

            return new TransactionResponseDto
            {
                Amount = updateTransaction.TransactionAmount,
                Type = updateTransaction.TransactionType,
                Date = updateTransaction.TransactionDate
            };
        }

        public async Task<TransactionResponseDto> DeleteTransaction(string userId, int transactionId)
        {
            var deleteTransaction = await _repo.DeleteTransaction(userId, transactionId);

            return new TransactionResponseDto
            {
                Amount = deleteTransaction.TransactionAmount,
                Type = deleteTransaction.TransactionType,
                Date = deleteTransaction.TransactionDate
            };
        }
    }
}
