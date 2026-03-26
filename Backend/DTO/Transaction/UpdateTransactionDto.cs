namespace SpendWise.DTO.Transaction
{
    public class UpdateTransactionDto
    {
        public decimal Amount { get; set; }
        public string Type { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public string? Description { get; set; }
        public DateTime Date { get; set; }
    }
}
