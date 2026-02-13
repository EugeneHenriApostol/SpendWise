using Microsoft.EntityFrameworkCore;
using SpendWise.Data;
using SpendWise.DTO.Savings;
using SpendWise.Models;

namespace SpendWise.Repository
{
    public class SavingsRepository
    {
        public readonly AppDbContext _context;

        public SavingsRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<SavingsGoal> CreateGoal(SavingsGoal goal)
        {
            goal.MarkCreated();

            _context.SavingsGoals.Add(goal);
            await _context.SaveChangesAsync();

            return goal;
        }

        public async Task<SavingsGoal> GetGoalById(string userId, int goalId)
        {
            var goal = await _context.SavingsGoals.Include(g => g.Contributions)
                                                .FirstOrDefaultAsync(g => g.Id == goalId
                                                                    && g.UserId == userId
                                                                    && !g.IsDeleted);
            if (goal == null)
            {
                throw new KeyNotFoundException("Savings goal not found");
            }

            return goal;
        }

        public async Task<IEnumerable<SavingsGoal>> GetUserGoals(string userId)
        {
            var goal = await _context.SavingsGoals.Where(g => g.UserId == userId)
                                                    .OrderByDescending(g => g.CreatedAt)
                                                    .ToListAsync();
            if (goal == null)
            {
                throw new KeyNotFoundException("Could not find user");
            }

            return goal;
        }

        public async Task<SavingsGoal> UpdateGoal(string userId, int goalId, UpdateSavingsGoalDto dto)
        {
            var goal = await _context.SavingsGoals.FirstOrDefaultAsync(g => g.UserId == userId && 
                                                                        g.Id == goalId &&
                                                                        !g.IsDeleted);
            if (goal == null)
            {
                throw new KeyNotFoundException("Savings goal not found");
            }

            goal.Name = dto.Name;
            goal.TargetAmount = dto.TargetAmount;
            goal.TargetDate = dto.TargetDate;

            goal.MarkUpdated();
            await _context.SaveChangesAsync();

            return goal;
        }

        public async Task<SavingsGoal> DeleteGoal(string userId, int goalId)
        {
            var goal = await _context.SavingsGoals.FirstOrDefaultAsync(g => g.UserId == userId &&
                                                                        g.Id == goalId &&
                                                                        !g.IsDeleted);
            if (goal == null)
            {
                throw new KeyNotFoundException("Savings goal not found");
            }

            goal.SoftDelete();
            goal.MarkUpdated();

            await _context.SaveChangesAsync();
            return goal;
        }

        /* =========================
           Contributions
        ========================== */

        public async Task<SavingsContribution> AddContribution(string userId, int goalId, 
                                                                decimal amount, DateTime? contributedAt = null)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            var goal = await _context.SavingsGoals.FirstOrDefaultAsync(g => g.UserId == userId &&
                                                                        g.Id == goalId &&
                                                                        !g.IsDeleted);
            if (goal == null)
            {
                throw new KeyNotFoundException("Savings not found");
            }

            goal.AddContribution(amount);
            goal.MarkUpdated();

            var contribution = new SavingsContribution
            {
                Amount = amount,
                ContributedAt = contributedAt ?? DateTime.UtcNow,
                SavingsGoalId = goalId,
            };

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return contribution;
        }

        public async Task<IEnumerable<SavingsContribution>> GetContributions(string userId, int goalId)
        {
            // ensure ownership
            var ownsGoal = await _context.SavingsGoals.AnyAsync(g => g.UserId == userId &&
                                                            g.Id == goalId &&
                                                            !g.IsDeleted);
            if (!ownsGoal)
            {
                throw new KeyNotFoundException("Savings goal not found");
            }

            var goalContribution = await _context.SavingsContributions.Where(c => c.SavingsGoalId == goalId && 
                                                                            !c.IsDeleted)
                                                                      .OrderByDescending(c => c.ContributedAt)
                                                                      .ToListAsync();
            return goalContribution;
        }
    }
}
