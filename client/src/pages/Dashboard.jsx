import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "../components/common/Modal";

const mockUser = { name: "Riya", email: "riya@example.com", level: 6 };

const stats = [
  { label: "Experience earned", value: "1,240", tone: "gold" },
  { label: "Day streak", value: "9", tone: "mint" },
  { label: "Nodes mastered", value: "14/32", tone: "ink" },
];

const dueToday = [
  { id: 1, title: "Recursion basics", strength: 0.34, xp: 20 },
  { id: 2, title: "Binary search trees", strength: 0.18, xp: 35 },
  { id: 3, title: "Graph traversal", strength: 0.09, xp: 50 },
];

const field = "w-full bg-bg text-ink text-sm rounded-xl px-4 py-2.5 border border-white/10 focus:border-mint outline-none transition-colors placeholder:text-muted/50";
const label = "block text-muted text-xs mb-1.5";
const toneClass = { gold: "text-gold", mint: "text-mint", ink: "text-ink" };

function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [name, setName] = useState(mockUser.name);
  const [email, setEmail] = useState(mockUser.email);
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);

  function handleAvatar(e) {
    const file = e.target.files[0];
    if (file) setAvatar(URL.createObjectURL(file));
  }

  function saveProfile(e) {
    e.preventDefault();
    console.log("Saving profile:", { name, email, password, avatar });
    setEditOpen(false);
  }

  return (
    <div className="min-h-screen">
      <nav className="flex items-center justify-between px-6 md:px-10 py-6 max-w-6xl mx-auto">
        <Link to="/" className="font-display font-extrabold text-xl tracking-tight text-ink">
          Mastery Loop
        </Link>

        <div className="flex items-center gap-3 relative">
          <span className="text-muted text-sm hidden sm:block">Level {mockUser.level}</span>

          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Account menu"
            className="w-10 h-10 rounded-full bg-raised border border-white/10 flex items-center justify-center text-ink font-display font-bold overflow-hidden hover:border-mint/60 transition-colors"
          >
            {avatar ? <img src={avatar} alt="" className="w-full h-full object-cover" /> : name.charAt(0)}
          </motion.button>

          <AnimatePresence>
            {menuOpen && (
              <>
                <div onClick={() => setMenuOpen(false)} className="fixed inset-0 z-40" />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -6 }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  className="absolute right-0 top-13 z-50 origin-top-right bg-raised border border-white/10 rounded-2xl p-1.5 w-48"
                >
                  <button
                    onClick={() => { setEditOpen(true); setMenuOpen(false); }}
                    className="w-full text-left px-3.5 py-2.5 text-sm text-ink rounded-xl hover:bg-white/5 transition-colors"
                  >
                    Edit profile
                  </button>
                  <Link to="/skilltree" onClick={() => setMenuOpen(false)} className="block px-3.5 py-2.5 text-sm text-ink rounded-xl hover:bg-white/5 transition-colors">
                    Skill tree
                  </Link>
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="w-full text-left px-3.5 py-2.5 text-sm text-muted rounded-xl hover:bg-white/5 transition-colors"
                  >
                    Log out
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 md:px-10 pb-20">
        <header className="mt-6 mb-12">
          <h1 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight text-ink">
            Three topics are ready, {mockUser.name}.
          </h1>
          <p className="text-muted mt-2">They're at their weakest right now, which is exactly when recall sticks.</p>
        </header>

        <div className="grid sm:grid-cols-3 gap-4 mb-14">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl bg-surface border border-white/5 px-6 py-6">
              <p className={`nums font-bold text-4xl ${toneClass[s.tone]}`}>{s.value}</p>
              <p className="text-muted text-sm mt-1.5">{s.label}</p>
            </div>
          ))}
        </div>

        <h2 className="font-display font-bold text-xl text-ink mb-5">Ready to review</h2>
        <div className="flex flex-col gap-2.5">
          {dueToday.map((q) => (
            <motion.div
              key={q.id}
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="rounded-xl bg-surface border border-white/5 px-5 py-4 flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <p className="text-ink font-medium truncate">{q.title}</p>
                {/* strength meter — shows why it surfaced today */}
                <div className="flex items-center gap-2.5 mt-2">
                  <div className="h-1 w-28 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-rose" style={{ width: `${q.strength * 100}%` }} />
                  </div>
                  <span className="text-muted text-xs">{Math.round(q.strength * 100)}% strength</span>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <span className="nums text-gold text-sm">+{q.xp}</span>
                <motion.div whileTap={{ scale: 0.96 }}>
                  <Link to="/practice" className="inline-block bg-mint text-bg font-semibold text-sm px-4 py-2 rounded-full">
                    Review
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <Modal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit profile"
        subtitle="Changes apply the next time you log in."
      >
        <form onSubmit={saveProfile}>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-bg border border-white/10 flex items-center justify-center text-ink font-display font-bold text-xl overflow-hidden">
              {avatar ? <img src={avatar} alt="" className="w-full h-full object-cover" /> : name.charAt(0)}
            </div>
            <label className="text-mint text-sm cursor-pointer hover:underline">
              Change photo
              <input type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
            </label>
          </div>

          <label className={label}>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={field + " mb-4"} />

          <label className={label}>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={field + " mb-4"} />

          <label className={label}>New password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Leave blank to keep your current one" className={field + " mb-7"} />

          <motion.button whileTap={{ scale: 0.98 }} type="submit" className="w-full bg-gold text-bg font-display font-bold py-3 rounded-full">
            Save changes
          </motion.button>
        </form>
      </Modal>
    </div>
  );
}

export default Dashboard;