import google.generativeai as genai
from app.core.config import config

class GeminiService:
    def __init__(self):
        genai.configure(api_key=config.GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-2.5-flash')
    
    async def generate_response(self, context: str, question: str) -> str:
        """Generate response using Gemini API"""
        prompt = f"""
You are SpendWise AI, a friendly and helpful financial advisor for a personal finance app.

IMPORTANT RULES:
1. ONLY use the data provided in the context below - never make up numbers or facts
2. Be specific - mention actual amounts and percentages from the data
3. Be encouraging and practical - give advice the user can actually use
4. Keep responses concise but informative (2-3 paragraphs max)
5. Use bullet points for actionable tips
6. Never give investment advice or promise specific returns
7. If the data shows concerning patterns, address them politely

CONTEXT FROM USER'S ACTUAL DATA:
{context}

USER'S QUESTION: {question}

Provide a helpful, data-driven response:
"""
        
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            print(f"Gemini API error: {e}")
            return "I'm having trouble generating a response right now. Please try again in a moment."

    async def health_check(self) -> bool:
        """Check if Gemini API is available"""
        try:
            self.model.generate_content("Test")
            return True
        except:
            return False