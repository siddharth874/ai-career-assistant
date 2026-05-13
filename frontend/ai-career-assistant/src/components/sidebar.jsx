const navItems = [
  { label: "Chat", icon: "💬", active: true },
  { label: "Resume", icon: "📄", active: false },
  { label: "Career Roadmap", icon: "🗺️", active: false },
  { label: "Interview Prep", icon: "🎯", active: false },
]

function Sidebar() {
  return (
    <aside className="h-full w-64 bg-gray-900 border-r border-gray-800 flex flex-col p-4">

      <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3">
        Navigation
      </p>

      <nav className="flex flex-col gap-1">

        {navItems.map((item) => (
          <button
            key={item.label}
            className={`
              flex items-center gap-3 px-3 py-2 rounded-lg text-sm w-full text-left
              transition-colors duration-150
              ${item.active
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }
            `}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}

      </nav>

      <div className="mt-auto">
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm w-full text-left text-gray-400 hover:bg-gray-800 hover:text-white transition-colors duration-150">
          <span>⚙️</span>
          <span>Settings</span>
        </button>
      </div>

    </aside>
  )
}

export default Sidebar