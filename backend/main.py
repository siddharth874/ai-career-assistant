# backend/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import APP_NAME, APP_VERSION, ALLOWED_ORIGINS, DEBUG
from app.core.database import engine, Base
from app.routes import chat

app = FastAPI(
    title=APP_NAME,
    version=APP_VERSION,
    docs_url="/docs" if DEBUG else None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all route groups
app.include_router(chat.router)


@app.on_event("startup")
async def startup_event():
    print(f"🚀 {APP_NAME} v{APP_VERSION} is starting...")

    # Import models so SQLAlchemy registers them with Base
    # Without this import, create_all won't know these tables exist
    import app.models.conversation

    # Create all tables that don't exist yet in the database file
    # Safe to run every time — never drops existing tables or data
    Base.metadata.create_all(bind=engine)
    print("✅ SQLite database tables created/verified")
    print("📁 Database file: backend/database.db")
    print(f"📖 API docs: http://localhost:8000/docs")


@app.get("/")
def root():
    return {
        "message": f"Welcome to {APP_NAME}",
        "version": APP_VERSION,
        "database": "SQLite"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}