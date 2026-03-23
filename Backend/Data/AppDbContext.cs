using SpendWise.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace SpendWise.Data
{
    public class AppDbContext : IdentityDbContext<User>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Budget> Budgets { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<SavingsGoal> SavingsGoals { get; set; }
        public DbSet<SavingsContribution> SavingsContributions { get; set; }

        // fluent api
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // global soft delete filter
            builder.Entity<Budget>().HasQueryFilter(b => !b.IsDeleted);
            builder.Entity<Category>().HasQueryFilter(c => !c.IsDeleted);
            builder.Entity<Transaction>().HasQueryFilter(t => !t.IsDeleted);
            builder.Entity<SavingsGoal>().HasQueryFilter(s => !s.IsDeleted);
            builder.Entity<SavingsContribution>().HasQueryFilter(sc => !sc.IsDeleted);


            // entity relationships
            builder.Entity<Transaction>()
                .HasOne(t => t.User)
                .WithMany(t => t.Transactions)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Transaction>()
                .HasOne(t => t.Category)
                .WithMany()
                .OnDelete(DeleteBehavior.Restrict);

            // decimal precisions
            builder.Entity<Budget>()
                .Property(b => b.BudgetAmount)
                .HasPrecision(18, 2);

            builder.Entity<Transaction>()
                .Property(t => t.TransactionAmount)
                .HasPrecision(18, 2);

            builder.Entity<SavingsGoal>()
                .Property(s => s.CurrentAmount)
                .HasPrecision(18, 2);

            builder.Entity<SavingsGoal>()
                .Property(s => s.TargetAmount)
                .HasPrecision(18, 2);

            builder.Entity<SavingsContribution>()
                .Property(sc => sc.Amount)
                .HasPrecision(18, 2);
        }
    }
}
