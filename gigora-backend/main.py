import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from supabase import create_client, Client
from ai_service import generate_proposal, optimize_gig, analyze_profile

load_dotenv()

app = FastAPI()

# 1. CORS Setup (React ke sath communication ke liye)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Supabase Setup
url: str = os.getenv("SUPABASE_URL", "")
key: str = os.getenv("SUPABASE_KEY", "")
supabase: Client = create_client(url, key)

class AuthModel(BaseModel):
    email: str
    password: str

# ------------------------------------
# ROUTES
# ------------------------------------

# Root route (Is se 127.0.0.1:8000 par Not Found ka error nahi aayega)
@app.get("/")
def home():
    return {"status": "Gigora Backend API Server is Running!"}

# Auth Routes
@app.post("/api/auth/login")
def login(data: AuthModel):
    try:
        res = supabase.auth.sign_in_with_password({
            "email": data.email,
            "password": data.password
        })
        return {"access_token": res.session.access_token, "user": res.user}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/auth/signup")
def signup(data: AuthModel):
    try:
        res = supabase.auth.sign_up({
            "email": data.email,
            "password": data.password
        })
        return {"message": "User registered successfully", "user": res.user}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# AI Service Routes
@app.post("/api/proposal")
def create_proposal(data: dict):
    try:
        job_post = data.get("job_post", "")
        result = generate_proposal(job_post)
        
        user_id = data.get("user_id", None)
        if user_id:
            try:
                supabase.table("proposals").insert({
                    "user_id": user_id,
                    "job_post": job_post,
                    "generated_proposal": result
                }).execute()
            except Exception:
                pass # Continue even if database save fails

        return {"proposal": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/seo")
def create_seo(data: dict):
    try:
        title = data.get("title", "")
        description = data.get("description", "")
        result = optimize_gig(title, description)
        return {"optimized": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/profile")
def create_profile_analysis(data: dict):
    try:
        profile_text = data.get("profile_text", "")
        result = analyze_profile(profile_text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))