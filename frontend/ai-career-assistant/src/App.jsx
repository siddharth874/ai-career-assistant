import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import ChatPage from './pages/ChatPage'

function App() {
  return (
    <div className="h-screen flex flex-col bg-gray-950 text-white">

      <Navbar />

      <div className="flex flex-1 overflow-hidden">

        <Sidebar />

        <ChatPage />

      </div>

    </div>
  )
}

export default App