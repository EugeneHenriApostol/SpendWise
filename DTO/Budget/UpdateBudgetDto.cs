namespace SpendWise.DTO.Budget
{
    public class UpdateBudgetDto
    {
        public decimal BudgetAmount { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
    }
}
