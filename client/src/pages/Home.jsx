import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import ForgettingCurve from "../components/common/ForgettingCurve";

const reasons = [
  {
    title: "It schedules around forgetting",
    body: "Every topic gets its own review date, pushed further out each time you recall it correctly and pulled closer when you don't.",
  },
  {
    title: "Topics unlock in order",
    body: "You can't jump to graph traversal before recursion holds. Prerequisites gate what appears next, so practice follows a real sequence.",
  },
  {
    title: "Progress you can see decaying",
    body: "Mastery isn't a checkbox. Each node's strength fades visibly over time, which is exactly why the review lands when it does.",
  },
];

const loopSteps = [
  { verb: "Recall", detail: "Answer from memory, not recognition." },
  { verb: "Score", detail: "Your answer adjusts that topic's difficulty." },
  { verb: "Reschedule", detail: "The next review moves to where it holds." },
];

function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero — the page's one orchestrated moment */}
      <section className="max-w-5xl mx-auto px-6 md:px-10 pt-12 pb-28">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="font-display font-extrabold text-ink text-5xl md:text-7xl leading-[0.95] tracking-tight max-w-3xl"
        >
          You forget on a schedule. Practice on one too.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-muted text-lg mt-6 max-w-xl leading-relaxed"
        >
          Mastery Loop tracks how well you hold each topic and brings it back
          right before it slips — inside a skill tree that unlocks as you go.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-10"
        >
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} className="inline-block">
            <Link
              to="/login"
              className="inline-block bg-gold text-bg font-display font-bold px-8 py-3.5 rounded-full"
            >
              Start practicing
            </Link>
          </motion.div>
        </motion.div>

        <div className="mt-16 rounded-3xl bg-surface border border-white/5 p-6 md:p-10">
          <ForgettingCurve />
        </div>
      </section>

      {/* Why it works — asymmetric, no card kit */}
      <section id="why" className="max-w-5xl mx-auto px-6 md:px-10 pb-28">
        <h2 className="font-display font-bold text-ink text-3xl md:text-4xl tracking-tight max-w-lg">
          Built on how memory actually behaves
        </h2>

        <div className="mt-12 divide-y divide-white/5 border-t border-white/5">
          {reasons.map((r) => (
            <div key={r.title} className="grid md:grid-cols-[1fr_1.4fr] gap-2 md:gap-10 py-7">
              <h3 className="font-display font-bold text-ink text-lg">{r.title}</h3>
              <p className="text-muted leading-relaxed max-w-prose">{r.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The loop — a cycle, so no 01/02/03 */}
      <section id="loop" className="max-w-5xl mx-auto px-6 md:px-10 pb-28">
        <h2 className="font-display font-bold text-ink text-3xl md:text-4xl tracking-tight">
          The loop
        </h2>

        <div className="mt-10 flex flex-col md:flex-row md:items-stretch gap-4">
          {loopSteps.map((s, i) => (
            <div key={s.verb} className="flex-1 flex items-center gap-4">
              <div className="flex-1 rounded-2xl bg-surface border border-white/5 px-6 py-7">
                <p className="font-display font-bold text-ink text-xl">{s.verb}</p>
                <p className="text-muted text-sm mt-2 leading-relaxed">{s.detail}</p>
              </div>
              <span className="text-muted/50 text-2xl rotate-90 md:rotate-0 mx-auto md:mx-0">
                {i === loopSteps.length - 1 ? "↻" : "→"}
              </span>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/5 py-10">
        <p className="max-w-5xl mx-auto px-6 md:px-10 text-muted text-sm">
          Mastery Loop — MCA final year project
        </p>
      </footer>
    </div>
  );
}

export default Home;