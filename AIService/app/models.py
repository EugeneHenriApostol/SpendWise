from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Transaction(BaseModel):
    id: int
    amount: float
    type: str  # Income or Expense
    category: str
    description: Optional[str]
    date: datetime

class BudgetRecommendationRequest(BaseModel):
    transactions: List[Transaction]
    current_budget: Optional[float]
    month: int
    year: int

class BudgetRecommendation(BaseModel):
    category: str
    current_spending: float
    recommended_budget: float
    potential_savings: float
    reasoning: str
    confidence: float

class FinancialInsight(BaseModel):
    title: str
    description: str
    impact: float  # Potential savings in pesos
    action_items: List[str]
    priority: str  # High, Medium, Low
    category: str

class AIResponse(BaseModel):
    success: bool
    data: Optional[List[BudgetRecommendation] | List[FinancialInsight]]
    error: Optional[str]