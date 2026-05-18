// src/components/Sidebar.jsx
// Updated: Active page is now tracked with state instead of being hardcoded

import { useState } from "react"

const NAV_ITEMS = [
  { id: "chat",      label: "Chat",           icon: "💬" },
  { id: "resume",    label: "Resume",          icon: "📄" },
  { id: "roadmap",   label: "Career Roadmap",  icon: "🗺️"  },
  { id: "interview", label: "Interview Prep",  icon: "🎯" },
]

function Sidebar() {
  // Track which nav item is currently active
  // "chat" is the default — users start on the chat page
  const [activePage, setActivePage] = useState("chat")

  return (
    <aside className="h-full w-64 bg-gray-900 border-r border-gray-800 flex flex-col p-4">

      <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3">
        Navigation
      </p>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          // isActive is true if this item's id matches the currently active page
          const isActive = activePage === item.id

          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-lg text-sm w-full text-left
                transition-colors duration-150
                ${isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }
              `}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
              {/* In Phase 12 we'll add React Router to navigate between real pages */}
            </button>
          )
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-1">
        <div className="border-t border-gray-800 pt-3 mb-1" />
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm w-full text-left text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
          <span>⚙️</span>
          <span>Settings</span>
        </button>
      </div>

    </aside>
  )
}

export default Sidebar