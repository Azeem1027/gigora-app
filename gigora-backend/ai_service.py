import json
import re
import google.generativeai as genai
from fastapi import HTTPException
from database import get_gemini_api_key, rotate_gemini_key

def get_configured_model():
    """Dynamically configures genai with the currently active key from the rotation pool."""
    api_key = get_gemini_api_key()
    genai.configure(api_key=api_key)
    return genai.GenerativeModel('gemini-1.5-flash')

def call_gemini_with_retry(prompt: str) -> str:
    """Executes call against Gemini. Rotates API keys transparently if a 429 error occurs."""
    for _ in range(3):
        try:
            model = get_configured_model()
            response = model.generate_content(
                prompt,
                generation_config={"response_mime_type": "application/json"}
            )
            return response.text
        except Exception as e:
            err_msg = str(e).lower()
            if "429" in err_msg or "quota" in err_msg or "resource_exhausted" in err_msg:
                print(f"[Gemini 429] Rate limit hit. Initiating key rotation...")
                rotate_gemini_key()
                continue
            else:
                raise HTTPException(status_code=500, detail=f"AI Engine operational failure: {str(e)}")
    
    raise HTTPException(status_code=429, detail="All backup Gemini keys rate limited. Please try again later.")

def validate_single_tag(tag: str) -> bool:
    """Keyword Validator Rules."""
    if not tag or len(tag) > 20:
        return False
    words = [w for w in tag.split() if w.strip()]
    if not (2 <= len(words) <= 5):
        return False
    if not re.match(r"^[a-zA-Z0-9\s]+$", tag):
        return False
    return True

def optimize_gig(title: str, description: str, category: str) -> dict:
    """Generates an optimized Fiverr gig and structures breakdown scores."""
    prompt = f"""
You are a top-rated Fiverr SEO expert and copywriter. Optimize this gig to convert.
Category: {category}
Title: {title}
Description: {description}

Return a valid JSON object ONLY. No conversational introduction or markdown containers.
Target JSON structure:
{{
  "optimized_title": "Compelling SEO title starting with 'I will', under 80 characters",
  "tags": ["tag one", "tag two", "tag three", "tag four", "tag five"],
  "optimized_description": "Polished high-converting description containing rich domain terms",
  "tips": ["Actionable optimization tip 1", "Actionable optimization tip 2", "Actionable optimization tip 3"]
}}
"""
    raw_response = call_gemini_with_retry(prompt)
    try:
        data = json.loads(raw_response)
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to parse valid structured JSON from AI engine.")

    validated_tags = []
    tags_pool = data.get("tags", [])
    if not isinstance(tags_pool, list):
        tags_pool = []
        
    for tag in tags_pool:
        tag_str = str(tag).strip()
        is_valid = validate_single_tag(tag_str)
        validated_tags.append({"text": tag_str, "valid": is_valid})

    opt_title = data.get("optimized_title", "")
    title_score = 100 if (10 <= len(opt_title) <= 80) else (60 if len(opt_title) > 80 else 40)
    
    valid_count = sum(1 for t in validated_tags if t["valid"])
    tag_score = int((valid_count / len(validated_tags)) * 100) if validated_tags else 0
    
    opt_desc = data.get("optimized_description", "")
    desc_len = len(opt_desc)
    desc_score = 100 if (400 <= desc_len <= 1200) else (75 if desc_len > 1200 else 50)
    
    return {
        "optimized_title": opt_title,
        "tags": validated_tags,
        "optimized_description": opt_desc,
        "scores": {
            "title_strength": title_score,
            "tag_quality": tag_score,
            "description_length": desc_score,
            "overall_score": int((title_score + tag_score + desc_score) / 3)
        },
        "tips": data.get("tips", ["Refine search tags", "Incorporate local package details", "Add concise FAQs"])
    }

def generate_proposal(job_post: str, tone: str, skill: str, platform: str, length: str) -> dict:
    """Generates optimized freelancer proposals leveraging few-shot engineering examples."""
    word_ceilings = {"short": 100, "medium": 200, "long": 300}
    target_words = word_ceilings.get(length.lower(), 200)

    example_fiverr = '"proposal": "Hi! I see you need a clean, highly secure Python API backend...", "word_count": 52, "key_points": ["3+ years backend experience"]'
    example_upwork = '"proposal": "Dear Hiring Manager... Best regards, Azeem", "word_count": 72, "key_points": ["20+ functional web module builds"]'

    prompt = f"""
You are an expert elite {skill} freelancer writing a high-converting proposal on {platform}.
Write the application response in a highly persuasive, crisp, {tone} tone around {target_words} words.

FEW-SHOT EXAMPLES FOR LEARNING EXPECTATIONS:
If platform is Fiverr, structure similarly to this: {{{example_fiverr}}}
If platform is Upwork, structure similarly to this: {{{example_upwork}}}

Client Job Posting requirements:
{job_post}

Return a valid JSON object ONLY. Do not wrap code blocks in markdown.
Expected Target JSON Schema Structure:
{{
  "proposal": "The actual full text of your generated proposal matching the requested parameters",
  "key_points": ["Key selling point text badge 1", "Key selling point badge 2"]
}}
"""
    raw_response = call_gemini_with_retry(prompt)
    try:
        data = json.loads(raw_response)
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to parse valid structured JSON from proposal generation engine.")

    proposal_text = data.get("proposal", "")
    actual_words = len(proposal_text.split())

    return {
        "proposal": proposal_text,
        "word_count": actual_words,
        "key_points": data.get("key_points", ["Proven technical excellence", "Rapid milestone delivery"])
    }