BUDGET_RECOMMENDATION_PROMPT = """
You are a financial advisor analyzing spending patterns.

Transactions for {month}/{year}:
{transactions}

Current budget: ₱{current_budget if current_budget else 'Not set'}

Analyze the spending data and provide budget recommendations for these categories:
- Food & Dining
- Transportation
- Shopping
- Entertainment
- Bills & Utilities
- Savings

For each category, provide:
1. Current spending amount
2. Recommended budget
3. Potential savings if budget is followed
4. Brief reasoning

Format as JSON with this structure:
[
  {{
    "category": "Food & Dining",
    "current_spending": 15000,
    "recommended_budget": 12000,
    "potential_savings": 3000,
    "reasoning": "You're spending 20% above average on dining out"
  }}
]
"""

FINANCIAL_INSIGHTS_PROMPT = """
You are a financial advisor analyzing spending patterns.

Transactions from last 3 months:
{transactions}

Generate 3 personalized financial insights that help the user save money.
Include:
- Title
- Description with specific numbers
- Estimated monthly savings
- Actionable steps
- Priority (High/Medium/Low)

Make it specific to their actual spending patterns.

Format as JSON:
[
  {{
    "title": "Coffee Shop Spending",
    "description": "You spend ₱{amount}/month on coffee. Making coffee at home could save ₱{savings}/month.",
    "impact": {savings},
    "action_items": ["Bring coffee from home 3x/week", "Use loyalty cards"],
    "priority": "Medium",
    "category": "Lifestyle"
  }}
]
"""