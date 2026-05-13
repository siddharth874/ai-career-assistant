function ChatPage() {
  return (
    <main className="flex-1 flex flex-col bg-gray-950">

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">

        <div className="flex gap-3">

          <div className="w-8 h-8 bg-blue-600 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">
            AI
          </div>

          <div className="bg-gray-800 rounded-2xl rounded-tl-none px-4 py-3 max-w-xl">
            <p className="text-white text-sm">
              Hello! I'm your AI Career Assistant.
            </p>
          </div>

        </div>

      </div>

      <div className="border-t border-gray-800 p-4">

        <div className="flex gap-3 max-w-4xl mx-auto">

          <input
            type="text"
            placeholder="Ask me anything about your career..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
          />

          <button className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-xl text-sm font-medium transition-colors">
            Send
          </button>

        </div>

      </div>

    </main>
  )
}

export default ChatPage