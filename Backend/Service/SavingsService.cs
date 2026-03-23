using SpendWise.Repository;
using SpendWise.DTO.Savings;
using SpendWise.Models;
using SpendWise.Mappings;

namespace SpendWise.Service
{
    public class SavingsService
    {
        private readonly SavingsRepository _repo;

        public SavingsService(SavingsRepository repo)
        {
            _repo = repo;
        }

        /* =========================
           Goals
        ========================== */

        public async Task<SavingsGoalResponseDto> CreateGoal(string userId, CreateSavingsGoalDto dto)
        {
            var goal = new SavingsGoal
            {
                Name = dto.Name,
                TargetAmount = dto.TargetAmount,
                TargetDate = dto.TargetDate,
                UserId = userId
            };

            goal.MarkCreated();

            await _repo.AddGoalAsync(goal);

            return SavingsMapper.MapGoalToResponse(goal);
        }

        public async Task<SavingsGoalResponseDto> GetGoalById(string userId, int goalId)
        {
            var goal = await _repo.GetGoalByIdAsync(userId, goalId);

            if (goal == null)
                throw new KeyNotFoundException("Savings goal not found");

            return SavingsMapper.MapGoalToResponse(goal);
        }

        public async Task<IEnumerable<SavingsGoalResponseDto>> GetUserGoals(
            string userId)
        {
            var goals = await _repo.GetUserGoalsAsync(userId);

            return goals.Select(SavingsMapper.MapGoalToResponse);
        }

        public async Task<SavingsGoalResponseDto> UpdateGoal(string userId, int goalId, UpdateSavingsGoalDto dto)
        {
            var goal = await _repo.GetGoalByIdAsync(userId, goalId);

            if (goal == null)
                throw new KeyNotFoundException("Savings goal not found");

            goal.Name = dto.Name;
            goal.TargetAmount = dto.TargetAmount;
            goal.TargetDate = dto.TargetDate;
            goal.MarkUpdated();

            await _repo.SaveChangesAsync();

            return SavingsMapper.MapGoalToResponse(goal);
        }

        public async Task<SavingsGoalResponseDto> DeleteGoal(string userId, int goalId)
        {
            var goal = await _repo.GetGoalByIdAsync(userId, goalId);

            if (goal == null)
                throw new KeyNotFoundException("Savings goal not found");

            goal.SoftDelete();
            goal.MarkUpdated();

            await _repo.SaveChangesAsync();

            return SavingsMapper.MapGoalToResponse(goal);
        }

        /* =========================
           Contributions
        ========================== */

        public async Task<SavingsContributionResponseDto> AddContribution(string userId, int goalId, AddContributionDto dto)
        {
            await _repo.BeginTransactionAsync();

            try
            {
                var goal = await _repo.GetGoalByIdAsync(userId, goalId);

                if (goal == null)
                    throw new KeyNotFoundException("Savings goal not found");

                // DOMAIN LOGIC
                goal.AddContribution(dto.Amount);
                goal.MarkUpdated();

                var contribution = new SavingsContribution
                {
                    Amount = dto.Amount,
                    ContributedAt = dto.ContributedAt ?? DateTime.UtcNow,
                    SavingsGoalId = goalId
                };

                contribution.MarkCreated();

                await _repo.AddContributionAsync(contribution);

                await _repo.SaveChangesAsync();
                await _repo.CommitTransactionAsync();

                return new SavingsContributionResponseDto
                {
                    Id = contribution.Id,
                    Amount = contribution.Amount,
                    ContributedAt = contribution.ContributedAt
                };
            }
            catch
            {
                await _repo.RollbackTransactionAsync();
                throw;
            }
        }

        public async Task<IEnumerable<SavingsContributionResponseDto>> GetContributions(string userId, int goalId)
        {
            var goal = await _repo.GetGoalByIdAsync(userId, goalId);

            if (goal == null)
                throw new KeyNotFoundException("Savings goal not found");

            var contributions = await _repo.GetContributionsAsync(goalId);

            return contributions.Select(c => new SavingsContributionResponseDto
            {
                Id = c.Id,
                Amount = c.Amount,
                ContributedAt = c.ContributedAt
            });
        }
    }
}
