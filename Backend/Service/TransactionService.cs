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

        public async Task<TransactionResponseDto> AddTransaction(string userId, CreateTransactionDto dto)
        {
            var transaction = new Transaction
            {
                UserId = userId,
                TransactionAmount = dto.Amount,
                TransactionType = dto.Type,
                CategoryId = dto.CategoryId,
                Description = dto.Description,
                TransactionDate = dto.Date
            };

            transaction.MarkCreated();

            await _repo.AddAsync(transaction);

            return MapToDto(transaction);
        }

        public async Task<TransactionResponseDto> GetTransactionById(string userId, int transactionId)
        {
            var transaction = await _repo.GetByIdAsync(userId, transactionId);

            if (transaction == null)
                throw new KeyNotFoundException("Transaction not found");

            return MapToDto(transaction);
        }

        public async Task<List<TransactionResponseDto>> GetAllTransactions(string userId)
        {
            var transactions = await _repo.GetAllAsync(userId);
            return transactions.Select(MapToDto).ToList();
        }

        public async Task<List<TransactionResponseDto>> GetTransactionsByMonth(string userId, int year, int month)
        {
            var transactions = await _repo.GetByMonthAsync(userId, year, month);
            return transactions.Select(MapToDto).ToList();
        }

        public async Task<TransactionResponseDto> UpdateTransaction(string userId, int transactionId, UpdateTransactionDto dto)
        {
            var transaction = await _repo.GetByIdAsync(userId, transactionId);

            if (transaction == null)
                throw new KeyNotFoundException("Transaction not found");

            transaction.TransactionAmount = dto.Amount;
            transaction.TransactionType = dto.Type;
            transaction.Description = dto.Description;
            transaction.TransactionDate = dto.Date;
            transaction.MarkUpdated();

            await _repo.SaveChangesAsync();

            return MapToDto(transaction);
        }

        public async Task<TransactionResponseDto> DeleteTransaction(string userId, int transactionId)
        {
            var transaction = await _repo.GetByIdAsync(userId, transactionId);

            if (transaction == null)
                throw new KeyNotFoundException("Transaction not found");

            transaction.SoftDelete();
            transaction.MarkUpdated();

            await _repo.SaveChangesAsync();

            return MapToDto(transaction);
        }

        private static TransactionResponseDto MapToDto(Transaction transaction)
        {
            return new TransactionResponseDto
            {
                Id = transaction.Id,
                Amount = transaction.TransactionAmount,
                Type = transaction.TransactionType,
                CategoryId = transaction.CategoryId,
                CategoryName = transaction.Category?.CategoryName,
                Description = transaction.Description,
                Date = transaction.TransactionDate
            };
        }
    }
}