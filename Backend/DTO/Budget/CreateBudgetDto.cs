namespace SpendWise.DTO.Budget
{
    public class CreateBudgetDto
    {
        public decimal Amount { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
    }
}
