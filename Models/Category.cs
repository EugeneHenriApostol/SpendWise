namespace SpendWise.Models
{
    public class Category : BaseEntity
    {
        public required string CategoryType { get; set; }
        public required string CategoryName { get; set; }

        // Foreign key
        public string UserId { get; set; } = string.Empty;
        // Navigation property
        public User? User { get; set; }
    }
}
