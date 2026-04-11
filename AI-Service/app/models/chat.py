from pydantic import BaseModel
from typing import Optional

class ChatRequest(BaseModel):
    question: str
    jwt_token: str

class ChatResponse(BaseModel):
    response: str
    question_type: str
    data_summary: Optional[str] = None

class HealthResponse(BaseModel):
    status: str
    gemini_available: bool