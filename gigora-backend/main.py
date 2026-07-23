from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from ai_service import generate_proposal_async

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ProposalRequest(BaseModel):
    job_post: str
    tone: str
    skill: str
    platform: str
    length: str

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

# Replace your existing /api/seo route in main.py with this:
@app.post("/api/seo")
async def analyze_seo(data: dict):
    # This structure matches exactly what your SeoOptimizer.jsx expects
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

# In your main.py, ensure your route matches this structure:
@app.post("/api/proposal")
async def generate_proposal(request: ProposalRequest):
    try:
        # Pass the validated request data to your AI service
        # Ensure generate_proposal_async is imported correctly at the top
        result = await generate_proposal_async(
            job_post=request.job_post,
            tone=request.tone,
            skill=request.skill,
            platform=request.platform,
            length=request.length
        )
        
        # Return the exact structure your frontend expects
        return {
            "success": True,
            "data": result
        }
        
    except Exception as e:
        print(f"Error generating proposal: {e}")
        # Raise an HTTP exception so the frontend receives a proper error message
        raise HTTPException(status_code=500, detail=str(e))