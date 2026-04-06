from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .models import BudgetRecommendationRequest, AIResponse
from .services.budget_advisor import BudgetAdvisor
from .services.insights_generator import InsightsGenerator
import os

app = FastAPI(title="SpendWise AI Service", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5079"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

budget_advisor = BudgetAdvisor()
insights_generator = InsightsGenerator()

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "AI Service"}

@app.post("/api/ai/budget-recommendations", response_model=AIResponse)
async def get_budget_recommendations(request: BudgetRecommendationRequest):
    try:
        recommendations = await budget_advisor.generate_recommendations(
            request.transactions,
            request.month,
            request.year,
            request.current_budget
        )
        return AIResponse(success=True, data=recommendations)
    except Exception as e:
        return AIResponse(success=False, error=str(e))

@app.post("/api/ai/financial-insights", response_model=AIResponse)
async def get_financial_insights(transactions: list):
    try:
        insights = await insights_generator.generate_insights(transactions)
        return AIResponse(success=True, data=insights)
    except Exception as e:
        return AIResponse(success=False, error=str(e))