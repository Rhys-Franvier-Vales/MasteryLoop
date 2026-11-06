import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import * as skillService from "../services/skillService";
import { errorMessage } from "../services/api";

function SkillTree() {
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    skillService
      .getTree()
      .then((data) => !cancelled && setNodes(data.nodes))
      .catch((err) => !cancelled && setError(errorMessage(err)))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen">
      <nav className="flex items-center justify-between px-6 md:px-10 py-6 max-w-4xl mx-auto">
        <Link to="/" className="font-display font-extrabold text-xl tracking-tight text-ink">
          Mastery Loop
        </Link>
        <Link to="/dashboard" className="text-muted text-sm hover:text-ink transition-colors">
          Dashboard
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto px-6 md:px-10 pb-20">
        <header className="mt-6 mb-12">
          <h1 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight text-ink">Skill tree</h1>
          <p className="text-muted mt-2">Locked topics open once the ones they depend on hold steady.</p>
        </header>

        {loading && <p className="text-muted text-sm">Loading your skill tree…</p>}
        {error && <p className="text-sm text-rose bg-rose/10 rounded-xl px-4 py-3">{error}</p>}

        <div className="relative pl-8">
          <div className="absolute left-[7px] top-3 bottom-3 w-px bg-white/10" />

          <div className="flex flex-col gap-3">
            {nodes.map((n) => (
              <motion.div
                key={n.id}
                whileHover={n.unlocked ? { x: 4 } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="relative"
              >
                <span
                  className={`absolute -left-8 top-6 w-3.5 h-3.5 rounded-full border-2 ${
                    n.mastery >= 0.8 ? "bg-gold border-gold" : n.mastery > 0 ? "bg-mint border-mint" : "bg-bg border-white/20"
                  }`}
                />

                <div className={`rounded-2xl border px-5 py-5 flex items-center justify-between gap-4 ${n.unlocked ? "bg-surface border-white/5" : "bg-surface/40 border-white/5"}`}>
                  <div className="min-w-0">
                    <p className={`font-medium ${n.unlocked ? "text-ink" : "text-muted"}`}>{n.title}</p>

                    {n.unlocked ? (
                      <div className="flex items-center gap-2.5 mt-2.5">
                        <div className="h-1.5 w-36 rounded-full bg-white/10 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${n.mastery * 100}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className={`h-full rounded-full ${n.mastery >= 0.8 ? "bg-gold" : "bg-mint"}`}
                          />
                        </div>
                        <span className="text-muted text-xs">{Math.round(n.mastery * 100)}%</span>
                      </div>
                    ) : (
                      <p className="text-muted text-xs mt-2">Opens after {n.needs.join(", ")}</p>
                    )}
                  </div>

                  {n.unlocked ? (
                    <motion.div whileTap={{ scale: 0.96 }} className="shrink-0">
                      <Link to={`/practice?node=${n.id}`} className="inline-block bg-mint text-bg font-semibold text-sm px-4 py-2 rounded-full">
                        {n.attempts === 0 ? "Start" : "Review"}
                      </Link>
                    </motion.div>
                  ) : (
                    <span className="shrink-0 text-muted text-sm px-4 py-2 rounded-full bg-white/5">Locked</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default SkillTree;
