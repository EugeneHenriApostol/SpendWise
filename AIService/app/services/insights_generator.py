from typing import List
from ..models import Transaction, FinancialInsight
from .openai_client import OpenAIClient
import json

class InsightsGenerator:
    def __init__(self):
        self.openai = OpenAIClient()
    
    async def generate_insights(
        self, 
        transactions: List[Transaction]
    ) -> List[FinancialInsight]:
        
        # Format transactions for last 3 months
        transactions_data = []
        for t in transactions:
            transactions_data.append({
                "amount": t.amount,
                "type": t.type,
                "category": t.category,
                "description": t.description,
                "date": t.date.isoformat()
            })
        
        # Get AI insights
        insights = await self.openai.get_financial_insights(
            json.dumps(transactions_data, indent=2)
        )
        
        # Convert to model
        return [FinancialInsight(**insight) for insight in insights]