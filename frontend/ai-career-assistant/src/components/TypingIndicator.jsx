// src/components/TypingIndicator.jsx
// Purpose: Shows animated dots while the AI is "thinking"
// This is the same bouncing dots you see in iMessage / WhatsApp

function TypingIndicator() {
  return (
    <div className="flex gap-3">

      {/* AI avatar — matches the one in MessageBubble */}
      <div className="w-8 h-8 bg-blue-600 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">
        AI
      </div>

      {/* Bouncing dots container */}
      <div className="bg-gray-800 rounded-2xl rounded-tl-none px-4 py-3 flex gap-1 items-center">
        {/* 
          Each dot has animate-bounce with a different animation-delay
          This creates the staggered wave effect
          The inline style is needed because Tailwind doesn't have delay utilities by default
        */}
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>

    </div>
  )
}

export default TypingIndicator