import os
import json
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def generate_proposal(job_post: str) -> str:
    prompt = f"You are an expert freelancer proposal writer. Write a professional, personalized proposal for this job:\n{job_post}\nMake it compelling, specific, and under 200 words."
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt,
    )
    return response.text

def optimize_gig(title: str, description: str) -> str:
    prompt = f"Optimize this gig title and description for SEO rankings:\nTitle: {title}\nDescription: {description}\nProvide an improved title, description, and key search keywords."
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt,
    )
    return response.text

def analyze_profile(profile_text: str) -> dict:
    prompt = f"""
    Analyze this freelancer profile and return JSON only:
    {profile_text}

    Return this exact JSON format:
    {{
      "score": 7,
      "strengths": ["point 1", "point 2"],
      "weaknesses": ["point 1", "point 2"],
      "suggestions": ["action 1", "action 2"]
    }}
    """
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt,
    )
    
    # Clean output if wrapped in markdown block
    raw_text = response.text.replace("```json", "").replace("```", "").strip()
    return json.loads(raw_text)