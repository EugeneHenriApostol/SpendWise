namespace SpendWise.Models
{
    public class Transaction : BaseEntity
    {
        public required decimal TransactionAmount { get; set; }
        public required string TransactionType { get; set; }
        public required DateTime TransactionDate { get; set; }

        // Foreign key
        public string UserId { get; set; } = string.Empty;
        public int CategoryId { get; set; }

        // Navigation properties
        public Category? Category { get; set; }
        public User? User { get; set; }
    }
}
