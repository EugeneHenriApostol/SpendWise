from fastapi import APIRouter, HTTPException, status
from app.models.chat import ChatRequest, ChatResponse
from app.core.auth import validate_jwt_token
from app.services.data_fetcher import DataFetcher
from app.services.context_builder import ContextBuilder
from app.services.gemini_service import GeminiService
from app.core.config import config

router = APIRouter()
gemini_service = GeminiService()

def detect_question_type(question: str) -> str:
    """Determine what type of question the user is asking"""
    question_lower = question.lower()
    
    for q_type, patterns in config.QUESTION_PATTERNS.items():
        for pattern in patterns:
            if pattern in question_lower:
                return q_type
    
    return "general"

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Main chat endpoint that:
    1. Validates JWT token
    2. Fetches user data from ASP.NET Core APIs
    3. Builds context based on question type
    4. Gets AI response from Gemini
    5. Returns response to user
    """
    # Step 1: Validate JWT token
    validate_jwt_token(request.jwt_token)
    
    # Step 2: Detect question type
    question_type = detect_question_type(request.question)
    print(f"Question type detected: {question_type}")
    
    # Step 3: Fetch user data from ASP.NET Core APIs
    fetcher = DataFetcher(request.jwt_token)
    user_data = await fetcher.fetch_all_data()
    
    # Step 4: Build context based on question type
    context_builder = ContextBuilder(user_data)
    context = context_builder.build_context(question_type)
    
    # Step 5: Generate response using Gemini
    ai_response = await gemini_service.generate_response(context, request.question)
    
    # Step 6: Return response
    return ChatResponse(
        response=ai_response,
        question_type=question_type,
        data_summary=context[:500] + "..." if len(context) > 500 else context
    )