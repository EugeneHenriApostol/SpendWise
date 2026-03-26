namespace SpendWise.DTO.Transaction
{
    public class TransactionResponseDto
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public string Type { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public string? CategoryName { get; set; }
        public DateTime Date { get; set; }
        public string? Description { get; set; }
    }
}