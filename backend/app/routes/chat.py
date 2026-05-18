from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional

from app.services.ai import get_ai_response

router = APIRouter(prefix="/chat", tags=["Chat"])


class ChatMessage(BaseModel):
    role: str
    content: str


class MessageRequest(BaseModel):
    text: str
    history: Optional[List[ChatMessage]] = []


class MessageResponse(BaseModel):
    role: str
    content: str


@router.get("/")
def get_chat_info():

    return {
        "endpoint": "chat",
        "status": "ready",
        "mode": "ai-powered"
    }


@router.post("/message", response_model=MessageResponse)
def send_message(request: MessageRequest):

    user_text = request.text.strip()

    if not user_text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message cannot be empty"
        )

    if len(user_text) > 2000:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message too long"
        )

    history_dicts = [
        {
            "role": msg.role,
            "content": msg.content
        }
        for msg in request.history
    ]

    try:

        ai_response = get_ai_response(
            user_message=user_text,
            conversation_history=history_dicts
        )

        return MessageResponse(
            role="assistant",
            content=ai_response
        )

    except Exception as e:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )