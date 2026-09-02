import Navbar from "../components/layout/Navbar";

const features = [
  { title: "Adaptive Scheduling", desc: "A spaced-repetition engine decides exactly when you should revisit each topic — before you forget it.", accent: "gold" },
  { title: "Skill-Tree Progression", desc: "Topics unlock as you master their prerequisites, so practice always follows a real learning sequence.", accent: "teal" },
  { title: "XP & Streaks", desc: "Every correct answer builds momentum — levels and streaks turn practice into a habit, not a chore.", accent: "gold" },
  { title: "Mastery Analytics", desc: "See exactly where you're strong and where you're slipping, tracked topic by topic over time.", accent: "teal" },
];

const steps = [
  { label: "Practice", desc: "Answer questions from your current skill nodes." },
  { label: "Track", desc: "The engine scores your mastery and schedules your next review." },
  { label: "Level Up", desc: "Unlock new nodes as prerequisites reach mastery." },
];

function Home() {
  return (
    <div className="bg-bg min-h-screen font-body">
      <Navbar />

      {/* Hero */}
      <section className="max-w-4xl mx-auto text-center pt-20 pb-24 px-6">
        {/* Signature element: skill-node constellation */}
        <div className="flex justify-center items-center gap-3 mb-8">
          {[true, true, false, true, false, false].map((lit, i) => (
            <div key={i} className="flex items-center">
              <span
                className={`w-3 h-3 rounded-full ${
                  lit ? "bg-gold shadow-[0_0_12px_2px_rgba(242,183,5,0.6)]" : "bg-surface border border-muted/40"
                }`}
              />
              {i < 5 && <span className="w-6 h-px bg-muted/30 mx-1" />}
            </div>
          ))}
        </div>

        <h1 className="font-display font-extrabold text-4xl md:text-6xl text-ink leading-tight">
          Master anything, <span className="text-gold">one node</span> at a time.
        </h1>
        <p className="text-muted font-body text-lg mt-6 max-w-2xl mx-auto">
          Mastery Loop combines spaced-repetition science with a skill-tree structure —
          so you always practice exactly what you're about to forget.
        </p>
        <button className="mt-10 bg-gold text-bg font-display font-bold px-8 py-3 rounded-full hover:opacity-90 transition">
          Start Practicing
        </button>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="font-display font-bold text-2xl md:text-3xl text-ink text-center mb-12">
          Built for how memory actually works
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-surface rounded-2xl p-6 border border-white/5">
              <div className={`w-8 h-1 rounded-full mb-4 ${f.accent === "gold" ? "bg-gold" : "bg-teal"}`} />
              <h3 className="font-display font-semibold text-lg text-ink mb-2">{f.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="font-display font-bold text-2xl md:text-3xl text-ink text-center mb-12">
          The loop
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <div key={s.label} className="text-center">
              <span className="font-mono text-teal text-sm">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="font-display font-semibold text-ink text-lg mt-2 mb-2">{s.label}</h3>
              <p className="text-muted text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-muted text-sm font-body">
        Mastery Loop 
      </footer>
    </div>
  );
}

export default Home;