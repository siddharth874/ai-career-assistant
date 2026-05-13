# app/routes/chat.py — updated with proper error handling

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

router = APIRouter(prefix="/chat", tags=["Chat"])


# Pydantic model = a blueprint for your request data
# Instead of accepting a raw dict, we define exactly what shape we expect
# FastAPI automatically validates incoming JSON against this model
# If the data doesn't match, FastAPI returns a clear 422 error automatically
class MessageRequest(BaseModel):
    text: str           # required — must be a string
    user_id: str = ""   # optional — defaults to empty string


class MessageResponse(BaseModel):
    role: str
    content: str
    mock: bool = False


@router.get("/")
def get_chat_info():
    """Returns information about the chat endpoint."""
    return {
        "endpoint": "chat",
        "description": "AI-powered career chat",
        "status": "ready"
    }


@router.post("/message", response_model=MessageResponse)
def send_message(request: MessageRequest):
    """
    Receives a message from the user and returns a response.
    
    request: MessageRequest means FastAPI will:
    1. Read the incoming JSON body
    2. Validate it matches MessageRequest (has a "text" field that's a string)
    3. Pass it to this function as a typed Python object
    
    response_model=MessageResponse means FastAPI will:
    1. Take our return value
    2. Validate it matches MessageResponse
    3. Serialize it to JSON automatically
    """
    
    # Clean up whitespace from the message
    user_text = request.text.strip()

    # Validate: don't process empty messages
    if not user_text:
        # HTTPException sends a proper HTTP error response
        # status_code=400 means "Bad Request" — the client sent invalid data
        # detail is the error message the client receives
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message text cannot be empty"
        )

    # Validate: prevent absurdly long messages
    if len(user_text) > 2000:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message too long. Maximum 2000 characters."
        )

    # Mock response — replaced with real AI in Phase 6
    return MessageResponse(
        role="assistant",
        content=f"Received: '{user_text}'. Real AI coming in Phase 6!",
        mock=True
    )