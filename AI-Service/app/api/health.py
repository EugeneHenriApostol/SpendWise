from fastapi import APIRouter
from app.models.chat import HealthResponse
from app.services.gemini_service import GeminiService

router = APIRouter()
gemini_service = GeminiService()

@router.get("/health", response_model=HealthResponse)
async def health_check():
    gemini_available = await gemini_service.health_check()
    return HealthResponse(
        status="healthy",
        gemini_available=gemini_available
    )