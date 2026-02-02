using SpendWise.Data;
using System.Transactions;
using SpendWise.Models;
using SpendWise.DTO;
using Microsoft.EntityFrameworkCore;

namespace SpendWise.Repository
{
    public class TransactionRepository
    {
        private readonly AppDbContext _context;

        public TransactionRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Models.Transaction> AddTransaction(Models.Transaction transaction)
        {
            transaction.MarkCreated();

            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();

            return transaction;
        }

        public async Task<Models.Transaction> UpdateTransaction(string userId, int transactionId, UpdateTransactionDto dto)
        {
            var transaction = await _context.Transactions.FirstOrDefaultAsync(t => 
                                                                            t.UserId == userId && t.Id == transactionId 
                                                                            && !t.IsDeleted);
            if (transaction == null)
            {
                throw new KeyNotFoundException("Transaction not found");
            }

            transaction.TransactionAmount = dto.Amount;
            transaction.TransactionType = dto.Type;
            transaction.TransactionDate = dto.Date;

            transaction.MarkUpdated();

            await _context.SaveChangesAsync();

            return transaction;
        }

        public async Task<IEnumerable<Models.Transaction>> GetAllTransactions(string userId)
        {
            return await _context.Transactions.Where(t => t.UserId == userId && !t.IsDeleted).ToListAsync();
        }

        public async Task<Models.Transaction> GetTransactionById(string userId, int transactionId)
        {
            var transaction =  await _context.Transactions.Include(t => t.Category)
                                                .FirstOrDefaultAsync(t => t.Id == transactionId && t.UserId == userId);

            if (transaction == null)
            {
                throw new KeyNotFoundException("Transaction not found");
            }

            return transaction;
        }

        public async Task<IEnumerable<Models.Transaction>> GetTransactionByMonth(string userId, int month, int year)
        {
            return await _context.Transactions.Include(t => t.Category)
                                               .Where(t => t.UserId == userId && t.TransactionDate.Month == month && t.TransactionDate.Year == year)
                                               .OrderByDescending(t => t.TransactionDate)
                                               .ThenByDescending(t => t.CreatedAt)
                                               .ToListAsync();
        }

        public async Task<Models.Transaction> DeleteTransaction(string userId, int transactionId)
        {
            var transaction = await _context.Transactions.FirstOrDefaultAsync(t => t.UserId == userId && t.Id == transactionId);

            if (transaction == null)
            {
                throw new KeyNotFoundException("Transaction not found");
            }

            transaction.SoftDelete();

            await _context.SaveChangesAsync();

            return transaction;
        }
    }
}
