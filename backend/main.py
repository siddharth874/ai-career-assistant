# main.py
# Purpose: The entry point of the FastAPI backend
# This file creates the app, configures it, and registers all routes
# Think of it as the "manager" that sets everything up before opening for business

# FastAPI is the framework class — we create one instance of it
from fastapi import FastAPI

# CORSMiddleware handles the cross-origin blocking issue we explained in config.py
# "Middleware" = code that runs on EVERY request before it reaches your route handlers
from fastapi.middleware.cors import CORSMiddleware

# Import our settings
from app.core.config import APP_NAME, APP_VERSION, ALLOWED_ORIGINS, DEBUG
from app.routes import chat
# -------------------------------------------------------
# 1. CREATE THE APP INSTANCE
# -------------------------------------------------------
# This is your entire FastAPI application in one object
# title and version appear in the auto-generated documentation
app = FastAPI(
    title=APP_NAME,
    version=APP_VERSION,
    # Only show docs in development mode, not in production
    docs_url="/docs" if DEBUG else None,
)

# -------------------------------------------------------
# 2. ADD CORS MIDDLEWARE
# -------------------------------------------------------
# This runs before every request and adds the right headers
# so the browser allows React to talk to FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(chat.router)
# -------------------------------------------------------
# 3. DEFINE ROUTES (URL endpoints)
# -------------------------------------------------------
# A "route" is a URL + HTTP method + the function that handles it
# When someone visits /health, FastAPI runs the health_check function

@app.get("/")
def root():
    """
    Root endpoint — just confirms the server is running.
    The triple-quote string becomes the description in auto-generated docs.
    """
    return {
        "message": f"Welcome to {APP_NAME}",
        "version": APP_VERSION,
        "status": "running"
    }


@app.get("/health")
def health_check():
    """
    Health check endpoint.
    Deployment platforms (Render, Railway) call this to verify the server is alive.
    If this returns 200 OK, the server is healthy.
    """
    return {"status": "healthy"}


# -------------------------------------------------------
# 4. STARTUP EVENT
# -------------------------------------------------------
# This runs ONCE when the server starts — before it accepts any requests
# Useful for: setting up database connections, loading ML models, etc.

@app.on_event("startup")
async def startup_event():
    print(f"🚀 {APP_NAME} v{APP_VERSION} is starting...")
    print(f"📖 API docs available at: http://localhost:8000/docs")
    print(f"🔧 Debug mode: {DEBUG}")


# -------------------------------------------------------
# 5. HOW TO RUN (for reference)
# -------------------------------------------------------
# Run the server with: uvicorn main:app --reload
# - main     = the filename (main.py)
# - app      = the FastAPI instance we created above
# - --reload = auto-restart when you save a file (dev mode only)