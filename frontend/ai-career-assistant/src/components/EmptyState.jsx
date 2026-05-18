// src/components/EmptyState.jsx
// Purpose: The welcome screen shown when no messages exist yet
// Great UX practice — never show users a blank page, guide them

// These are the suggested prompt cards the user can click
// Clicking one automatically fills the input and sends it
const SUGGESTED_PROMPTS = [
  {
    icon: "📄",
    title: "Analyze my resume",
    subtitle: "Get feedback on your resume",
    prompt: "Can you help me analyze my resume and identify areas for improvement?",
  },
  {
    icon: "🗺️",
    title: "Career roadmap",
    subtitle: "Plan your path forward",
    prompt: "I want to become a software engineer. Can you create a career roadmap for me?",
  },
  {
    icon: "💼",
    title: "Skill gap analysis",
    subtitle: "Find what you're missing",
    prompt: "What skills do I need to land a job as a data scientist?",
  },
  {
    icon: "🎯",
    title: "Interview prep",
    subtitle: "Practice common questions",
    prompt: "Give me the top 10 interview questions for a frontend developer role.",
  },
]

// onSelectPrompt is a function passed from the parent (ChatPage)
// When user clicks a card, we call this function with the prompt text
// The parent then handles putting it in the input and sending it
function EmptyState({ onSelectPrompt }) {
  return (
    // Center everything both horizontally and vertically
    <div className="flex-1 flex flex-col items-center justify-center p-8 gap-8">

      {/* Hero section */}
      <div className="text-center">
        <div className="text-5xl mb-4">🤖</div>
        <h2 className="text-2xl font-bold text-white mb-2">
          AI Career Assistant
        </h2>
        <p className="text-gray-400 max-w-md">
          Your intelligent career companion. Ask me anything about your career,
          resume, skills, or job search.
        </p>
      </div>

      {/* Suggested prompts grid */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-2xl">
        {SUGGESTED_PROMPTS.map((item) => (
          <button
            key={item.title}
            onClick={() => onSelectPrompt(item.prompt)}
            className="
              text-left p-4 rounded-xl
              bg-gray-800 border border-gray-700
              hover:bg-gray-750 hover:border-gray-600
              transition-all duration-150
              group
            "
          >
            <div className="text-2xl mb-2">{item.icon}</div>
            <div className="text-white text-sm font-medium group-hover:text-blue-400 transition-colors">
              {item.title}
            </div>
            <div className="text-gray-500 text-xs mt-1">
              {item.subtitle}
            </div>
          </button>
        ))}
      </div>

    </div>
  )
}

export default EmptyState