from groq import Groq

from app.core.config import (
    GROQ_API_KEY,
    AI_MODEL,
    MAX_TOKENS,
    AI_TEMPERATURE,
)

client = Groq(api_key=GROQ_API_KEY)


def get_ai_response(user_message, conversation_history=None):

    if conversation_history is None:
        conversation_history = []

    messages = []

    for msg in conversation_history:
        messages.append({
            "role": msg["role"],
            "content": msg["content"]
        })

    messages.append({
        "role": "user",
        "content": user_message
    })

    response = client.chat.completions.create(
        model=AI_MODEL,
        messages=messages,
        temperature=AI_TEMPERATURE,
        max_tokens=MAX_TOKENS,
    )

    return response.choices[0].message.content