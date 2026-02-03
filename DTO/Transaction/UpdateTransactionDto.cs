namespace SpendWise.DTO.Transaction
{
    public class UpdateTransactionDto
    {
        public decimal Amount { get; set; }
        public string Type { get; set; } = string.Empty;
        public DateTime Date { get; set; }
    }
}
