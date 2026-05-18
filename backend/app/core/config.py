import os
from dotenv import load_dotenv

load_dotenv()

APP_NAME = os.getenv("APP_NAME", "AI Career Assistant")
APP_VERSION = os.getenv("APP_VERSION", "1.0.0")
DEBUG = os.getenv("DEBUG", "True") == "True"

ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
]

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")

print("KEY:", GROQ_API_KEY)

if not GROQ_API_KEY:
    print("⚠️ WARNING: GROQ_API_KEY is not set in .env")

AI_MODEL = os.getenv("AI_MODEL", "llama3-70b-8192")
MAX_TOKENS = int(os.getenv("MAX_TOKENS", "1024"))
AI_TEMPERATURE = float(os.getenv("AI_TEMPERATURE", "0.7"))

DATABASE_URL = os.getenv("DATABASE_URL", "")