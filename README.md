Gigora AI 🚀
Gigora is an AI-powered freelance optimization platform designed to help freelancers maximize their impact on platforms like Fiverr. It provides tools for profile analysis, gig SEO optimization, and intelligent proposal generation using advanced AI models.

✨ Features
Profile Analyzer: Gain insights into your professional profile with AI-driven analytics.

Gig SEO Optimizer: Optimize your gig titles, descriptions, and tags to rank higher in search algorithms.

Smart Proposal Generator: Generate high-converting proposals by comparing bids across 3 different AI models.

Usage Tracking: Monitor your plan limits and usage metrics in real-time.

History Logs: Easily track and revisit your generated content and past optimizations.

🛠 Tech Stack
Frontend:

React

Tailwind CSS

React Hot Toast (for notifications)

Backend:

FastAPI (Python)

Supabase (Authentication & Database)

Google Gemini API (AI engine)

🚀 Getting Started
Prerequisites
Node.js (v18+)

Python (v3.9+)

Git

Installation
Clone the repository:

Bash
git clone https://github.com/your-username/gigora.git
cd gigora
Setup Backend:

Bash
cd backend
pip install -r requirements.txt
Setup Frontend:

Bash
cd ../gigora-frontend
npm install
Configuration
Create a .env file in your root directory (and your backend directory) to store your keys. Never commit this file to GitHub.

Template (.env):

Code snippet
REACT_APP_SUPABASE_URL=your_supabase_url_here
REACT_APP_SUPABASE_ANON_KEY=your_supabase_key_here

GEMINI_API_KEY=your_gemini_key_here
GROQ_API_KEY=your_groq_key_here
COHERE_API_KEY=your_cohere_key_here
Running the Application
Start Backend:

Bash
cd backend
uvicorn main:app --reload
Start Frontend:

Bash
cd gigora-frontend
npm start
🔐 Security Note
DO NOT push your .env file to GitHub. Ensure your .gitignore file includes .env to prevent your secret keys from being leaked.

Pro-Tip for your GitHub Repo
Since you are setting up the repo now, ensure you create a .gitignore file before you add your files. If you have already added files, you can run:

Bash
echo ".env" >> .gitignore
echo "node_modules" >> .gitignore
echo "__pycache__" >> .gitignore
git add .gitignore
git commit -m "Add gitignore"
