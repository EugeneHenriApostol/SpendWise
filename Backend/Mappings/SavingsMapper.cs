using SpendWise.DTO.Savings;
using SpendWise.Models;

namespace SpendWise.Mappings
{
    public class SavingsMapper
    {
        /* =========================
           Mapping helper
        ========================== */

        public static SavingsGoalResponseDto MapGoalToResponse(SavingsGoal goal)
        {
            return new SavingsGoalResponseDto
            {
                Id = goal.Id,
                Name = goal.Name,
                TargetAmount = goal.TargetAmount,
                CurrentAmount = goal.CurrentAmount,
                ProgressPercentage = goal.ProgressPercentage(),
                IsCompleted = goal.IsCompleted,
                TargetDate = goal.TargetDate
            };
        }
    }
}
