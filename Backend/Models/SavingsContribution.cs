namespace SpendWise.Models
{
    public class SavingsContribution : BaseEntity
    {
        public decimal Amount { get; set; }
        public DateTime ContributedAt { get; set; }
        
        // foreign key
        public int SavingsGoalId { get; set; }
        // Navigation property
        public SavingsGoal? SavingsGoal { get; set; }
    }
}
