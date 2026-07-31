import os
import asyncio
import logging
import google.generativeai as genai
from fastapi import HTTPException
from groq import Groq
import cohere

from database import (
    get_gemini_api_key, 
    rotate_gemini_key, 
    increment_usage, 
    add_history_log
)

logger = logging.getLogger(__name__)

# --- Helper Functions ---
def get_configured_model():
    api_key = get_gemini_api_key()
    if not api_key:
        raise HTTPException(status_code=500, detail="Gemini API Key is missing.")
    genai.configure(api_key=api_key)
    return genai.GenerativeModel('gemini-1.5-flash')


def call_gemini_with_retry(prompt: str) -> str:
    for attempt in range(3):
        try:
            model = get_configured_model()
            response = model.generate_content(prompt)
            return response.text if response and response.text else ""
        except Exception as e:
            logger.warning(f"Gemini Attempt {attempt + 1} failed: {e}")
            if any(k in str(e).lower() for k in ["429", "quota", "resource_exhausted"]):
                rotate_gemini_key()
                continue
            break
    return "FALLBACK_TRIGGER"


def score_proposal(text: str, job_post: str) -> int:
    if not text:
        return 0
    words = text.split()
    length_score = 40 if 100 <= len(words) <= 300 else 10
    
    job_words = set(job_post.lower().split())
    matches = sum(1 for w in words if w.lower() in job_words)
    keyword_score = min(matches * 5, 60)
    
    return length_score + keyword_score


def _fetch_groq_sync(prompt: str) -> str:
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key or "YOUR_" in api_key:
        logger.warning("GROQ_API_KEY not configured properly.")
        return ""
    try:
        client = Groq(api_key=api_key)
        chat = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama3-70b-8192"
        )
        return chat.choices[0].message.content or ""
    except Exception as e:
        logger.error(f"Groq execution failed: {e}")
        return ""


def _fetch_cohere_sync(prompt: str) -> str:
    api_key = os.getenv("COHERE_API_KEY")
    if not api_key or "YOUR_" in api_key:
        logger.warning("COHERE_API_KEY not configured properly.")
        return ""
    try:
        client = cohere.Client(api_key=api_key)
        response = client.chat(message=prompt, model="command-r")
        return response.text or ""
    except Exception as e:
        logger.error(f"Cohere execution failed: {e}")
        return ""


# --- Async Model Calls ---
async def fetch_groq(prompt: str) -> str:
    return await asyncio.to_thread(_fetch_groq_sync, prompt)


async def fetch_cohere(prompt: str) -> str:
    return await asyncio.to_thread(_fetch_cohere_sync, prompt)


async def generate_proposal_async(job_post: str, tone: str, skill: str, platform: str, length: str) -> dict:
    prompt = f"Write a professional {tone} proposal for {platform}. Job: {job_post}. Skills: {skill}. Length: {length}."
    
    # Run all 3 concurrently in threads to avoid blocking event loop
    gemini_task = asyncio.to_thread(call_gemini_with_retry, prompt)
    groq_task = fetch_groq(prompt)
    cohere_task = fetch_cohere(prompt)
    
    results = await asyncio.gather(gemini_task, groq_task, cohere_task)
    
    # Score them
    scored_results = []
    models = ["Gemini", "Groq", "Cohere"]
    
    for i, res in enumerate(results):
        if res and res != "FALLBACK_TRIGGER":
            scored_results.append({
                "model": models[i],
                "proposal": res,
                "score": score_proposal(res, job_post)
            })
            
    # Fallback if all fail
    if not scored_results:
        return {
            "proposal": "Unable to generate proposal. Please verify API keys and network connections.",
            "best_model": "None",
            "all_results": []
        }

    # Pick best proposal
    best = max(scored_results, key=lambda x: x["score"])
    
    # Update usage metrics and history store
    increment_usage()
    add_history_log(action_type="Proposal Generation", input_text=job_post, output_text=best["proposal"])
    
    return {
        "proposal": best["proposal"],
        "best_model": best["model"],
        "all_results": scored_results 
    }