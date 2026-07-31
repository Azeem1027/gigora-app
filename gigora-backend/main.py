import os
import logging
from typing import Optional, List, Dict, Any
from dotenv import load_dotenv

from fastapi import FastAPI, Header, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from ai_service import generate_proposal_async

# Load environment variables
load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Gigora API",
    description="Backend service for Gigora AI SaaS Platform",
    version="1.0.0"
)

# Configure CORS dynamically for local dev + production deployment
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
origins = [origin.strip() for origin in allowed_origins_env.split(",") if origin]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schemas
class ProposalRequest(BaseModel):
    job_post: str = Field(..., min_length=1, description="The job posting text")
    tone: str = Field(default="professional", description="Tone of the proposal")
    skill: str = Field(..., description="Key skills to emphasize")
    platform: str = Field(default="Upwork", description="Target platform (e.g., Upwork, Fiverr)")
    length: str = Field(default="medium", description="Desired length")

class SEORequest(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[List[str]] = None

# Routes
@app.get("/")
async def root():
    return {"message": "Gigora Backend is running"}

@app.get("/api/usage")
async def get_usage():
    return {"status": "success", "usage_data": {"runs": 0, "limit": 10}}

@app.get("/api/me")
async def get_me():
    return {"user_id": "test_user", "status": "active"}

@app.get("/api/history")
async def get_history():
    return {"history": []}

@app.post("/api/seo")
async def analyze_seo(data: SEORequest):
    try:
        # Returns exact structure expected by SeoOptimizer.jsx
        return {
            "success": True,
            "data": {
                "scores": {
                    "overall_score": 85,
                    "title_strength": 90,
                    "tag_quality": 80,
                    "description_length": 85
                },
                "optimized_title": "I will build an automated AI chatbot with Gemini API",
                "tags": [
                    {"text": "AI Chatbot", "valid": True},
                    {"text": "Gemini", "valid": True},
                    {"text": "Automation", "valid": False}
                ],
                "optimized_description": "I will build a high-performance automated chatbot...",
                "tips": ["Use clearer keywords", "Include specific technology names"]
            }
        }
    except Exception as e:
        logger.error(f"Error analyzing SEO: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to analyze SEO data."
        )

@app.post("/api/proposal")
async def generate_proposal(request: ProposalRequest):
    try:
        result = await generate_proposal_async(
            job_post=request.job_post,
            tone=request.tone,
            skill=request.skill,
            platform=request.platform,
            length=request.length
        )
        return {
            "success": True,
            "data": result
        }
    except Exception as e:
        logger.error(f"Error generating proposal: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )