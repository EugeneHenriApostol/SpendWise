namespace SpendWise.DTO.Savings
{
    public class SavingsContributionResponseDto
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public DateTime ContributedAt { get; set; }
    }
}
