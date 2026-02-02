namespace SpendWise.Models
{
    public class Budget : BaseEntity
    {
        public decimal BudgetAmount { get; set; }
        public int Months { get; set; }
        public int Year { get; set; }

        // Foreign key
        public string UserId { get; set; } = string.Empty;
        // Navigation property
        public User? User { get; set; }
    }
}
