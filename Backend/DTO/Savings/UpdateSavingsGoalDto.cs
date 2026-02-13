namespace SpendWise.DTO.Savings
{
    public class UpdateSavingsGoalDto
    {
        public string Name { get; set; } = string.Empty;
        public decimal TargetAmount { get; set; }
        public DateTime? TargetDate { get; set; }
    }
}
