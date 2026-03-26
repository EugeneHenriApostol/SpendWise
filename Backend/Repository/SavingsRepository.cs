//SavingsRepository.cs
using Microsoft.EntityFrameworkCore;
using SpendWise.Data;
using SpendWise.Models;

namespace SpendWise.Repository
{
    public class SavingsRepository
    {
        private readonly AppDbContext _context;

        public SavingsRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddGoalAsync(SavingsGoal goal)
        {
            _context.SavingsGoals.Add(goal);
            await _context.SaveChangesAsync();
        }

        public async Task<SavingsGoal?> GetGoalByIdAsync(string userId, int goalId)
        {
            return await _context.SavingsGoals
                .Include(g => g.Contributions)
                .FirstOrDefaultAsync(g => g.Id == goalId && g.UserId == userId);
        }

        public async Task<List<SavingsGoal>> GetUserGoalsAsync(string userId)
        {
            return await _context.SavingsGoals
                .Where(g => g.UserId == userId)
                .OrderByDescending(g => g.CreatedAt)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task AddContributionAsync(SavingsContribution contribution)
        {
            _context.SavingsContributions.Add(contribution);
        }

        public async Task<List<SavingsContribution>> GetContributionsAsync(int goalId)
        {
            return await _context.SavingsContributions
                .Where(c => c.SavingsGoalId == goalId)
                .OrderByDescending(c => c.ContributedAt)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task BeginTransactionAsync()
        {
            await _context.Database.BeginTransactionAsync();
        }

        public async Task CommitTransactionAsync()
        {
            await _context.Database.CommitTransactionAsync();
        }

        public async Task RollbackTransactionAsync()
        {
            await _context.Database.RollbackTransactionAsync();
        }
    }
}