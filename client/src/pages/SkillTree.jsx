import { Link } from "react-router-dom";

const mockNodes = [
  { id: 1, title: "Arrays & Strings", mastery: 1, unlocked: true },
  { id: 2, title: "Recursion", mastery: 0.9, unlocked: true },
  { id: 3, title: "Sorting Algorithms", mastery: 0.6, unlocked: true },
  { id: 4, title: "Binary Search Trees", mastery: 0.3, unlocked: true },
  { id: 5, title: "Graph Traversal", mastery: 0, unlocked: false },
  { id: 6, title: "Dynamic Programming", mastery: 0, unlocked: false },
];

function SkillTree() {
  return (
    <div className="bg-bg min-h-screen font-body">
      <nav className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto">
        <Link to="/" className="font-display font-bold text-xl text-ink">
          Mastery<span className="text-gold">Loop</span>
        </Link>
        <Link to="/dashboard" className="text-muted text-sm hover:text-ink transition">
          Back to Dashboard
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pb-16">
        <h1 className="font-display font-bold text-3xl text-ink mt-4 mb-10">
          Skill Tree
        </h1>

        <div className="flex flex-col gap-4">
          {mockNodes.map((node) => (
            <div
              key={node.id}
              className={`rounded-2xl p-5 border flex items-center justify-between ${
                node.unlocked
                  ? "bg-surface border-white/5"
                  : "bg-surface/40 border-white/5 opacity-50"
              }`}
            >
              <div className="flex items-center gap-4">
                <span
                  className={`w-3 h-3 rounded-full ${
                    node.mastery >= 1
                      ? "bg-gold shadow-[0_0_10px_2px_rgba(242,183,5,0.5)]"
                      : node.mastery > 0
                      ? "bg-teal"
                      : "bg-white/20"
                  }`}
                />
                <p className="text-ink font-body font-medium">{node.title}</p>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-mono text-muted text-xs">
                  {Math.round(node.mastery * 100)}%
                </span>
                <button
                  disabled={!node.unlocked}
                  className={`text-sm font-body font-semibold px-4 py-1.5 rounded-full transition ${
                    node.unlocked
                      ? "bg-teal text-bg hover:opacity-90"
                      : "bg-white/10 text-muted cursor-not-allowed"
                  }`}
                >
                  {node.unlocked ? "Practice" : "Locked"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default SkillTree;