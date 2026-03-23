namespace SpendWise.Models
{
    public class Budget : BaseEntity
    {
        public decimal BudgetAmount { get; private set; }
        public int Month { get; private set; }
        public int Year { get; private set; }

        // Foreign key
        public string UserId { get; set; } = string.Empty;
        // Navigation property
        public User? User { get; set; }

        public void SetPeriod(int month, int year)
        {
            if (month < 1 || month > 12)
                throw new ArgumentOutOfRangeException(nameof(month), "Month must be between 1 and 12.");

            if (year < 2000 || year > 2100)
                throw new ArgumentOutOfRangeException(nameof(year), "Year must be valid.");

            Month = month;
            Year = year;
        }

        public void SetAmount(decimal amount)
        {
            if (amount < 0)
                throw new ArgumentException("Budget amount cannot be negative.");

            BudgetAmount = amount;
        }
    }
}
