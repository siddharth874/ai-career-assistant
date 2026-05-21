# backend/app/routes/conversations.py
# Purpose: All API endpoints for saving and loading conversations
# React calls these routes to persist chat history in SQLite

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from datetime import datetime

from app.core.database import get_db
from app.models.conversation import Conversation, Message
from app.services.ai import get_ai_response

router = APIRouter(prefix="/conversations", tags=["Conversations"])


# ─── Pydantic Schemas ─────────────────────────────────────────────────────────
# These define what data looks like going IN to and OUT of our API
# Completely separate from SQLAlchemy models (those define the database)

class MessageOut(BaseModel):
    """A single message returned to React."""
    id: str
    role: str
    content: str
    created_at: datetime

    class Config:
        # Tells Pydantic how to read SQLAlchemy model attributes
        # Without this line, Pydantic can't read data from ORM objects
        from_attributes = True


class ConversationOut(BaseModel):
    """Conversation summary — used in the sidebar list."""
    id: str
    title: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ConversationDetail(BaseModel):
    """Full conversation with all messages — used when loading a chat."""
    id: str
    title: str
    created_at: datetime
    updated_at: datetime
    messages: List[MessageOut]

    class Config:
        from_attributes = True

from typing import List, Optional
class SendMessageRequest(BaseModel):
    """What React sends when a user types a message."""
    content: str
    conversation_id: Optional[str] = None


class SendMessageResponse(BaseModel):
    """What we send back after AI responds."""
    conversation_id: str
    user_message: MessageOut
    ai_message: MessageOut


# ─── Routes ───────────────────────────────────────────────────────────────────

@router.get("/", response_model=List[ConversationOut])
def list_conversations(db: Session = Depends(get_db)):
    """
    Returns all conversations for the sidebar list.

    Depends(get_db) = FastAPI automatically calls get_db()
    and passes the session as `db`. We never call get_db() manually.
    """
    return (
        db.query(Conversation)
        .order_by(Conversation.updated_at.desc())  # newest first
        .all()
    )


@router.get("/{conversation_id}", response_model=ConversationDetail)
def get_conversation(conversation_id: str, db: Session = Depends(get_db)):
    """
    Returns one full conversation with all its messages.
    Called when user clicks a conversation in the sidebar.
    """
    conversation = db.query(Conversation).filter(
        Conversation.id == conversation_id
    ).first()

    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )

    return conversation


@router.post("/message", response_model=SendMessageResponse)
def send_message(request: SendMessageRequest, db: Session = Depends(get_db)):
    """
    Core endpoint — handles user sending a message.

    Flow:
    1. Find existing conversation OR create a new one
    2. Save the user's message to SQLite
    3. Load history from database for AI context
    4. Call Claude AI
    5. Save AI response to SQLite
    6. Commit everything atomically
    7. Return both messages to React
    """

    # ── 1. Get or create conversation ────────────────────────────────────────
    if request.conversation_id:
        conversation = db.query(Conversation).filter(
            Conversation.id == request.conversation_id
        ).first()

        if not conversation:
            raise HTTPException(
                status_code=404,
                detail="Conversation not found"
            )
    else:
        # New conversation — title = first 50 chars of opening message
        # This is exactly how ChatGPT names conversations
        raw_title = request.content[:50]
        title = raw_title + ("..." if len(request.content) > 50 else "")

        conversation = Conversation(title=title)
        db.add(conversation)
        # flush() sends the INSERT to SQLite without committing
        # This gives conversation an ID we can use for messages below
        db.flush()

    # ── 2. Save user message ──────────────────────────────────────────────────
    user_message = Message(
        conversation_id=conversation.id,
        role="user",
        content=request.content
    )
    db.add(user_message)
    db.flush()   # get user_message.id assigned

    # ── 3. Build conversation history for AI context ──────────────────────────
    # Load all previous messages so Claude remembers the conversation
    history = [
        {"role": msg.role, "content": msg.content}
        for msg in conversation.messages
        if msg.id != user_message.id   # exclude the message we just added
    ]

    # ── 4. Call  AI ─────────────────────────────────────────────────────
    try:
        ai_content = get_ai_response(
            user_message=request.content,
            conversation_history=history
        )
    except Exception as e:
        # If AI fails — rollback everything, don't save partial data
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

    # ── 5. Save AI response ───────────────────────────────────────────────────
    ai_message = Message(
        conversation_id=conversation.id,
        role="assistant",
        content=ai_content
    )
    db.add(ai_message)

    # Bump updated_at so this conversation floats to the top of the sidebar
    conversation.updated_at = datetime.utcnow()

    # ── 6. Commit — save everything at once ───────────────────────────────────
    # Atomic: either ALL of this saves or NONE of it does
    # If power cuts out between add() and here, nothing is corrupted
    db.commit()

    # Refresh objects to get auto-generated timestamps from SQLite
    db.refresh(user_message)
    db.refresh(ai_message)

    # ── 7. Return to React ────────────────────────────────────────────────────
    return SendMessageResponse(
        conversation_id=conversation.id,
        user_message=user_message,
        ai_message=ai_message
    )


@router.delete("/{conversation_id}")
def delete_conversation(conversation_id: str, db: Session = Depends(get_db)):
    """Deletes a conversation and all its messages (cascade)."""
    conversation = db.query(Conversation).filter(
        Conversation.id == conversation_id
    ).first()

    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    db.delete(conversation)   # cascade deletes all messages automatically
    db.commit()

    return {"message": "Conversation deleted"}