// src/components/MessageBubble.jsx

function formatTime(timestamp) {
  const date = new Date(timestamp)

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })
}

function MessageBubble({ message }) {
  const isUser = message.role === "user"

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"} group`}>

      <div className={`
        w-8 h-8 rounded-full flex-shrink-0
        flex items-center justify-center
        text-white text-xs font-bold
        ${isUser ? "bg-purple-600" : "bg-blue-600"}
      `}>
        {isUser ? "U" : "AI"}
      </div>

      <div className={`flex flex-col gap-1 max-w-xl ${isUser ? "items-end" : "items-start"}`}>

        {!isUser && (
          <span className="text-xs text-blue-400 font-medium px-1">
            AI Assistant
          </span>
        )}

        <div className={`
          px-4 py-3 rounded-2xl text-sm leading-relaxed
          ${isUser
            ? "bg-purple-600 text-white rounded-tr-none"
            : "bg-gray-800 text-gray-100 rounded-tl-none"
          }
        `}>
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>

        <span className="text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity px-1">
          {message.timestamp ? formatTime(message.timestamp) : ""}
        </span>

      </div>
    </div>
  )
}

export default MessageBubble 