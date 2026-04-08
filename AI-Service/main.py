from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import chat, health

app = FastAPI(
    title="SpendWise AI Service",
    description="AI-powered financial advice using Gemini API",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat.router, prefix="/api", tags=["chat"])
app.include_router(health.router, prefix="/api", tags=["health"])

@app.get("/")
async def root():
    return {
        "service": "SpendWise AI Service",
        "status": "running",
        "endpoints": ["/api/chat", "/api/health"]
    }

if __name__ == "__main__":
    import uvicorn
    from app.core.config import config
    uvicorn.run(app, host="0.0.0.0", port=config.PORT)