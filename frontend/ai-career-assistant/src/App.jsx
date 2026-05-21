import { useState } from "react"
import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar"
import ChatPage from "./pages/ChatPage"

function App() {
  const [activeConversationId, setActiveConversationId] = useState(null)
  const [sidebarRefresh, setSidebarRefresh] = useState(0)

  function handleNewChat() {
    setActiveConversationId(null)
  }

  function handleSelectConversation(id) {
    setActiveConversationId(id)
  }

  function handleConversationSaved(id) {
    setActiveConversationId(id)
    setSidebarRefresh(prev => prev + 1)
  }

  return (
    <div className="h-screen flex flex-col bg-gray-950 text-white">
      <Navbar />
     

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          key={sidebarRefresh}
          activeConversationId={activeConversationId}
          onSelectConversation={handleSelectConversation}
          onNewChat={handleNewChat}
        />

        <ChatPage
          conversationId={activeConversationId}
          onConversationSaved={handleConversationSaved}
        />
      </div>
    </div>
  )
}

export default App