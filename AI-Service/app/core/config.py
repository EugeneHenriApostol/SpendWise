import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
    API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:5079")
    PORT = int(os.getenv("PORT", 8000))
    
    # Question patterns
    QUESTION_PATTERNS = {
        "save_money": ["save money", "save more", "reduce spending", "cut costs"],
        "savings_goals": ["savings goal", "save faster", "reach goal", "saving target"],
        "where_money_goes": ["where does my money go", "spending breakdown", "where is my money"],
        "stick_to_budget": ["stick to budget", "budget help", "stop overspending", "budget tips"],
        "financial_health": ["financial health", "checkup", "how am i doing", "financial status"]
    }

config = Config()