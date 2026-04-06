from typing import List
from ..models import Transaction, BudgetRecommendation
from .openai_client import OpenAIClient
import json

class BudgetAdvisor:
    def __init__(self):
        self.openai = OpenAIClient()
    
    async def generate_recommendations(
        self, 
        transactions: List[Transaction], 
        month: int, 
        year: int,
        current_budget: float = None
    ) -> List[BudgetRecommendation]:
        
        # Format transactions for prompt
        transactions_data = []
        for t in transactions:
            transactions_data.append({
                "amount": t.amount,
                "type": t.type,
                "category": t.category,
                "description": t.description
            })
        
        # Get AI recommendations
        recommendations = await self.openai.get_budget_recommendations(
            json.dumps(transactions_data, indent=2),
            month,
            year,
            current_budget
        )
        
        # Convert to model
        return [BudgetRecommendation(**rec) for rec in recommendations]