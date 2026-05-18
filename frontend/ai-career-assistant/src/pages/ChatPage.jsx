// src/pages/ChatPage.jsx
// Purpose: The main chat page — complete, polished version
// Uses: MessageBubble, TypingIndicator, EmptyState, useApi hook, api layer

import { useState, useRef, useEffect } from "react"
import MessageBubble from "../components/MessageBubble"
import TypingIndicator from "../components/TypingIndicator"
import EmptyState from "../components/EmptyState"
import { sendChatMessage } from "../api/index.js"
import { useApi } from "../hooks/useApi.js"

// Maximum characters allowed in the input
const MAX_CHARS = 2000

function ChatPage() {

  // ─── State ──────────────────────────────────────────────────────────────────

  // messages: array of { role, content, timestamp }
  // We start with an EMPTY array — the EmptyState component shows instead
  const [messages, setMessages] = useState([])

  // inputText: what the user is currently typing
  const [inputText, setInputText] = useState("")

  // useApi gives us: execute (the function to call), loading, error
  const { execute: sendMessage, loading, error } = useApi(sendChatMessage)

  // ─── Refs ────────────────────────────────────────────────────────────────────

  // useRef creates a reference to a DOM element
  // We use this to scroll to the bottom of the messages list
  // A ref does NOT cause re-renders when it changes — unlike state
  const messagesEndRef = useRef(null)

  // ─── Auto-scroll Effect ──────────────────────────────────────────────────────

  // useEffect runs AFTER React renders the component to the screen
  // This runs every time `messages` or `loading` changes
  // So every time a new message appears, we scroll to the bottom
  useEffect(() => {
    // scrollIntoView moves the referenced element into the visible area
    // behavior: "smooth" animates the scroll instead of jumping
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])
  // The ?. is "optional chaining" — if messagesEndRef.current is null, don't crash

  // ─── Handlers ────────────────────────────────────────────────────────────────

  // addMessage: helper to add a message to the list with a timestamp
  function addMessage(role, content) {
    setMessages(prev => [
      ...prev,                        // keep all existing messages
      { role, content, timestamp: new Date() }  // add the new one
    ])
  }

  // handleSend: called when user clicks Send or presses Enter
  async function handleSend() {
  const trimmed = inputText.trim()

  // stop if invalid
  if (!trimmed || loading || trimmed.length > MAX_CHARS) {
    return
  }

  // create user message
  const userMessage = {
    role: "user",
    content: trimmed,
    timestamp: new Date(),
  }

  // show immediately in UI
  setMessages(prev => [...prev, userMessage])

  // clear input
  setInputText("")

  // build conversation history
  const historyForApi = messages.map(msg => ({
    role: msg.role,
    content: msg.content,
  }))

  // send BOTH message + history to backend
  const response = await sendMessage(trimmed, historyForApi)

  // add AI reply
  if (response) {
    addMessage("assistant", response.content)
  }
}
  // handleKeyDown: Enter sends, Shift+Enter adds a newline
  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // handleSelectPrompt: called when user clicks a suggested prompt card
  // It fills the input AND immediately sends the message
  async function handleSelectPrompt(prompt) {

  addMessage("user", prompt)

  const historyForApi = messages.map(msg => ({
    role: msg.role,
    content: msg.content,
  }))

  const response = await sendMessage(prompt, historyForApi)

  if (response) {
    addMessage("assistant", response.content)
  }
}

  // handleClearChat: resets the conversation
  function handleClearChat() {
    setMessages([])
  }

  // ─── Derived values ──────────────────────────────────────────────────────────

  // How many characters has the user typed?
  const charCount = inputText.length
  // Is the user getting close to the limit?
  const isNearLimit = charCount > MAX_CHARS * 0.8  // 80% of limit
  const isOverLimit = charCount > MAX_CHARS
  // Can we send? Need text, not loading, not over limit
  const canSend = inputText.trim() && !loading && !isOverLimit

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <main className="flex-1 flex flex-col bg-gray-950 overflow-hidden">

      {/* ── Chat Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800">
        <div>
          <h2 className="text-white font-semibold text-sm">Career Chat</h2>
          <p className="text-gray-500 text-xs">
            {messages.length === 0
              ? "Start a conversation"
              : `${messages.length} message${messages.length !== 1 ? "s" : ""}`
            }
          </p>
        </div>

        {/* Clear chat button — only show if there are messages */}
        {messages.length > 0 && (
          <button
            onClick={handleClearChat}
            className="text-gray-500 hover:text-gray-300 text-xs transition-colors px-2 py-1 rounded hover:bg-gray-800"
          >
            Clear chat
          </button>
        )}
      </div>

      {/* ── Messages Area ───────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">

        {/* Show EmptyState when no messages exist */}
        {messages.length === 0 && !loading ? (
          <EmptyState onSelectPrompt={handleSelectPrompt} />
        ) : (
          <div className="p-6 flex flex-col gap-4">

            {/* Render each message */}
            {messages.map((message, index) => (
              <MessageBubble key={index} message={message} />
            ))}

            {/* Typing indicator while waiting for AI */}
            {loading && <TypingIndicator />}

            {/* Error message if API call failed */}
            {error && (
              <div className="bg-red-900/30 border border-red-700/50 text-red-400 rounded-xl px-4 py-3 text-sm">
                ⚠️ {error} — is your backend running?
              </div>
            )}

            {/* 
              This invisible div sits at the very bottom of the messages list
              We scroll IT into view to auto-scroll to the bottom
              It's the "anchor" our useEffect scrolls to
            */}
            <div ref={messagesEndRef} />

          </div>
        )}
      </div>

      {/* ── Input Area ──────────────────────────────────────────────────────── */}
      <div className="border-t border-gray-800 p-4">
        <div className="max-w-4xl mx-auto flex flex-col gap-2">

          {/* Input row */}
          <div className="flex gap-3">
            <textarea
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about your career..."
              disabled={loading}
              rows={1}
              className="
                flex-1 bg-gray-800 border border-gray-700 rounded-xl
                px-4 py-3 text-white placeholder-gray-500 text-sm
                focus:outline-none focus:border-blue-500
                disabled:opacity-50 disabled:cursor-not-allowed
                resize-none transition-colors
                leading-relaxed
              "
              style={{
                // Auto-grow the textarea as user types more lines
                // minHeight keeps it compact for short messages
                minHeight: "48px",
                maxHeight: "160px",
              }}
            />

            <button
              onClick={handleSend}
              disabled={!canSend}
              className="
                self-end
                bg-blue-600 hover:bg-blue-500 text-white
                px-5 py-3 rounded-xl text-sm font-medium
                disabled:opacity-40 disabled:cursor-not-allowed
                transition-colors flex-shrink-0
              "
            >
              {loading ? "..." : "Send"}
            </button>
          </div>

          {/* ── Footer row: hint text + character count ──────────── */}
          <div className="flex items-center justify-between px-1">

            <p className="text-gray-600 text-xs">
              Enter to send · Shift+Enter for new line
            </p>

            {/* Character count — only show when user has typed something */}
            {charCount > 0 && (
              <span className={`text-xs transition-colors ${
                isOverLimit  ? "text-red-400" :
                isNearLimit  ? "text-amber-400" :
                               "text-gray-600"
              }`}>
                {charCount}/{MAX_CHARS}
              </span>
            )}

          </div>

        </div>
      </div>

    </main>
  )
}

export default ChatPage