using System.Text;
using System.Text.Json;
using SpendWise.Models;

namespace SpendWise.Services
{
    public class AIClientService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly string _aiServiceUrl;

        public AIClientService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _aiServiceUrl = _configuration["AIService:Url"] ?? "http://ai-service:8000";
        }

        public async Task<BudgetRecommendationResponse?> GetBudgetRecommendations(
            List<Transaction> transactions,
            int month,
            int year,
            decimal? currentBudget = null)
        {
            var request = new
            {
                transactions = transactions.Select(t => new
                {
                    t.Id,
                    t.TransactionAmount,
                    Type = t.TransactionType,
                    Category = t.Category?.CategoryName,
                    t.Description,
                    t.TransactionDate
                }),
                month,
                year,
                current_budget = currentBudget
            };

            var content = new StringContent(
                JsonSerializer.Serialize(request),
                Encoding.UTF8,
                "application/json"
            );

            var response = await _httpClient.PostAsync(
                $"{_aiServiceUrl}/api/ai/budget-recommendations",
                content
            );

            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<BudgetRecommendationResponse>(json);
            }

            return null;
        }

        public async Task<FinancialInsightsResponse?> GetFinancialInsights(List<Transaction> transactions)
        {
            var request = transactions.Select(t => new
            {
                t.Id,
                t.TransactionAmount,
                Type = t.TransactionType,
                Category = t.Category?.CategoryName,
                t.Description,
                t.TransactionDate
            });

            var content = new StringContent(
                JsonSerializer.Serialize(request),
                Encoding.UTF8,
                "application/json"
            );

            var response = await _httpClient.PostAsync(
                $"{_aiServiceUrl}/api/ai/financial-insights",
                content
            );

            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<FinancialInsightsResponse>(json);
            }

            return null;
        }
    }

    public class BudgetRecommendationResponse
    {
        public bool Success { get; set; }
        public List<BudgetRecommendation>? Data { get; set; }
        public string? Error { get; set; }
    }

    public class BudgetRecommendation
    {
        public string? Category { get; set; }
        public decimal CurrentSpending { get; set; }
        public decimal RecommendedBudget { get; set; }
        public decimal PotentialSavings { get; set; }
        public string? Reasoning { get; set; }
        public double Confidence { get; set; }
    }

    public class FinancialInsightsResponse
    {
        public bool Success { get; set; }
        public List<FinancialInsight>? Data { get; set; }
        public string? Error { get; set; }
    }

    public class FinancialInsight
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public decimal Impact { get; set; }
        public List<string>? ActionItems { get; set; }
        public string? Priority { get; set; }
        public string? Category { get; set; }
    }
}