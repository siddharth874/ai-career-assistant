function Navbar() {
  return (
    <nav className="w-full bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">

      <div className="flex items-center gap-2">
        <span className="text-blue-400 font-bold text-xl">
          AI Career Assistant
        </span>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-gray-400 text-sm">
          Welcome back
        </span>

        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
          U
        </div>
      </div>

    </nav>
  )
}

export default Navbar