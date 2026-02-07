namespace SpendWise.DTO.Transaction
{
    public class TransactionResponseDto
    {
        public decimal Amount { get; set; }
        public string Type { get; set; } = string.Empty;
        public DateTime Date { get; set; }
    }
}
