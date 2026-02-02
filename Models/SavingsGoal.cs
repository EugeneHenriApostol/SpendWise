namespace SpendWise.Models
{
    public class SavingsGoal : BaseEntity
    {
        public required string Name { get; set; }
        public decimal TargetAmount { get; set; }
        public decimal CurrentAmount { get; private set; }
        public DateTime? TargetDate { get; set; }
        public bool IsCompleted { get; private set; }

        // Navigation property
        public ICollection<SavingsContribution> Contributions { get; set; } = [];

        public void AddContribution(decimal amount)
        {
            if (amount <= 0)
                throw new ArgumentException("Amount muster be positive");

            CurrentAmount += amount;

            if (CurrentAmount >= TargetAmount)
                IsCompleted = true;
        }

        public decimal ProgressPercentage()
        {
            return TargetAmount == 0 ? 0 : (CurrentAmount / TargetAmount) * 100;
        }
    }
}
