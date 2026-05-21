const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

async function apiRequest(endpoint, method = "GET", body = null) {
  const url = `${BASE_URL}${endpoint}`

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  }

  if (body) {
    options.body = JSON.stringify(body)
  }

  const response = await fetch(url, options)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.detail || `Request failed: ${response.status}`)
  }

  return response.json()
}

export async function sendChatMessage(text, history = []) {
  return apiRequest("/chat/message", "POST", {
    text,
    history,
  })
}

export async function checkHealth() {
  return apiRequest("/health")
}

export async function getConversations() {
  return apiRequest("/conversations/")
}

export async function getConversation(conversationId) {
  return apiRequest(`/conversations/${conversationId}`)
}

export async function sendConversationMessage(content, conversationId = null) {
  return apiRequest("/conversations/message", "POST", {
    content,
    conversation_id: conversationId,
  })
}

export async function deleteConversation(conversationId) {
  return apiRequest(`/conversations/${conversationId}`, "DELETE")
}