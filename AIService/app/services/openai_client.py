import os
from openai import OpenAI
from typing import List, Dict
import json

class OpenAIClient:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.model = "gpt-3.5-turbo"
    
    async def get_budget_recommendations(self, transactions_data: str, month: int, year: int, current_budget: float = None):
        from prompts.templates import BUDGET_RECOMMENDATION_PROMPT
        
        prompt = BUDGET_RECOMMENDATION_PROMPT.format(
            month=month,
            year=year,
            transactions=transactions_data,
            current_budget=current_budget or "Not set"
        )
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a financial advisor. Return only valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=500
            )
            
            result = response.choices[0].message.content
            # Clean and parse JSON
            result = result.replace('```json', '').replace('```', '').strip()
            return json.loads(result)
        except Exception as e:
            print(f"OpenAI error: {e}")
            return []
    
    async def get_financial_insights(self, transactions_data: str):
        from prompts.templates import FINANCIAL_INSIGHTS_PROMPT
        
        prompt = FINANCIAL_INSIGHTS_PROMPT.format(transactions=transactions_data)
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a financial advisor. Return only valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.5,
                max_tokens=800
            )
            
            result = response.choices[0].message.content
            result = result.replace('```json', '').replace('```', '').strip()
            return json.loads(result)
        except Exception as e:
            print(f"OpenAI error: {e}")
            return []