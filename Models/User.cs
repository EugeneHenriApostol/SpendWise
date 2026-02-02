using Microsoft.AspNetCore.Identity;

namespace SpendWise.Models
{
    public class User : IdentityUser
    {
        public bool IsDelete { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        // Navigation properties
        public ICollection<Budget> Budgets { get; set; } = [];
        public ICollection<Category> Categories { get; set; } = [];
        public ICollection<Transaction> Transactions { get; set; } = [];

        public void MarkCreated()
        {
            CreatedAt = DateTime.UtcNow;
            UpdatedAt = DateTime.UtcNow;
        }

        public void MarkUpdated()
        {
            UpdatedAt = DateTime.UtcNow;
        }

        public void SoftDelete()
        {
            IsDelete = true;
            UpdatedAt = DateTime.UtcNow;
        }
    }
}
