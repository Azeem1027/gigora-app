import os
import asyncio
import google.generativeai as genai
from fastapi import HTTPException
from groq import Groq
import cohere
from database import get_gemini_api_key, rotate_gemini_key

# --- Helper Functions ---
def get_configured_model():
    api_key = get_gemini_api_key()
    genai.configure(api_key=api_key)
    return genai.GenerativeModel('gemini-1.5-flash')

def call_gemini_with_retry(prompt: str) -> str:
    for _ in range(3):
        try:
            model = get_configured_model()
            response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
            return response.text
        except Exception as e:
            if any(k in str(e).lower() for k in ["429", "quota"]):
                rotate_gemini_key()
                continue
            raise HTTPException(status_code=500, detail=f"AI Engine failure: {str(e)}")
    return "FALLBACK_TRIGGER"

def score_proposal(text: str, job_post: str) -> int:
    words = text.split()
    length_score = 40 if 100 <= len(words) <= 300 else 10
    
    job_words = set(job_post.lower().split())
    matches = sum(1 for w in words if w.lower() in job_words)
    keyword_score = min(matches * 5, 60)
    
    return length_score + keyword_score

# --- Async Model Calls ---
async def fetch_groq(prompt: str):
    try:
        # Initialize client here to read from env vars after load_dotenv()
        client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        chat = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama3-70b-8192"
        )
        return chat.choices[0].message.content
    except Exception: 
        return ""

async def fetch_cohere(prompt: str):
    try:
        # Initialize client here to read from env vars after load_dotenv()
        client = cohere.Client(api_key=os.getenv("COHERE_API_KEY"))
        response = client.chat(message=prompt, model="command-r")
        return response.text
    except Exception: 
        return ""

async def generate_proposal_async(job_post: str, tone: str, skill: str, platform: str, length: str) -> dict:
    prompt = f"Write a professional {tone} proposal for {platform}. Job: {job_post}. Skills: {skill}. Length: {length}."
    
    # Run all 3 concurrently
    gemini_task = asyncio.to_thread(call_gemini_with_retry, prompt)
    groq_task = fetch_groq(prompt)
    cohere_task = fetch_cohere(prompt)
    
    results = await asyncio.gather(gemini_task, groq_task, cohere_task)
    
    # Score them
    scored_results = []
    for i, res in enumerate(results):
        if res and res != "FALLBACK_TRIGGER":
            scored_results.append({
                "model": ["Gemini", "Groq", "Cohere"][i],
                "proposal": res,
                "score": score_proposal(res, job_post)
            })
            
    # Fallback if all fail
    if not scored_results:
        return {"proposal": "Unable to generate proposal.", "all_results": []}

    # Pick best
    best = max(scored_results, key=lambda x: x["score"])
    
    return {
        "proposal": best["proposal"],
        "best_model": best["model"],
        "all_results": scored_results 
    }