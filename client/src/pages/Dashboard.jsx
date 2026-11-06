import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "../components/common/Modal";
import useAuth from "../hooks/useAuth";
import * as userService from "../services/userService";
import * as skillService from "../services/skillService";
import { errorMessage } from "../services/api";

const field = "w-full bg-bg text-ink text-sm rounded-xl px-4 py-2.5 border border-white/10 focus:border-mint outline-none transition-colors placeholder:text-muted/50";
const label = "block text-muted text-xs mb-1.5";
const toneClass = { gold: "text-gold", mint: "text-mint", ink: "text-ink" };
const MAX_AVATAR_BYTES = 1_000_000;

function Dashboard() {
  const navigate = useNavigate();
  const { user, setUser, logout } = useAuth();

  const [stats, setStats] = useState(null);
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  // Edit-profile form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newAvatar, setNewAvatar] = useState(null); // null = unchanged
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    let cancelled = false;
    Promise.all([userService.getStats(), skillService.getDue()])
      .then(([s, d]) => {
        if (cancelled) return;
        setStats(s);
        setQuests(d.quests);
      })
      .catch((err) => !cancelled && setLoadError(errorMessage(err)))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  function openEdit() {
    setName(user.name);
    setEmail(user.email);
    setPassword("");
    setCurrentPassword("");
    setNewAvatar(null);
    setFormError("");
    setMenuOpen(false);
    setEditOpen(true);
  }

  function handleAvatar(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > MAX_AVATAR_BYTES) return setFormError("Pick an image under 1 MB.");
    setFormError("");
    const reader = new FileReader();
    reader.onload = () => setNewAvatar(reader.result);
    reader.readAsDataURL(file);
  }

  async function saveProfile(e) {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    try {
      const payload = { name, email };
      if (newAvatar !== null) payload.avatar = newAvatar;
      if (password) {
        payload.password = password;
        payload.currentPassword = currentPassword;
      }
      const data = await userService.updateProfile(payload);
      setUser(data.user);
      setEditOpen(false);
    } catch (err) {
      setFormError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  const avatar = newAvatar ?? user.avatar;
  const firstName = user.name.split(" ")[0];
  const anyReview = quests.some((q) => !q.isNew);

  const headline = loading
    ? "Getting your reviews ready…"
    : quests.length
    ? `${quests.length} ${quests.length === 1 ? "topic is" : "topics are"} ready, ${firstName}.`
    : `You're all caught up, ${firstName}.`;
  const subline = loading
    ? ""
    : !quests.length
    ? "Nothing is due right now. Check the skill tree to see what unlocks next."
    : anyReview
    ? "They're at their weakest right now, which is exactly when recall sticks."
    : "Start with these to begin building your review schedule.";

  const statCards = [
    { label: "Experience earned", value: stats ? stats.xp.toLocaleString() : "–", tone: "gold" },
    { label: "Day streak", value: stats ? String(stats.streak) : "–", tone: "mint" },
    { label: "Nodes mastered", value: stats ? `${stats.mastered}/${stats.totalNodes}` : "–", tone: "ink" },
  ];

  return (
    <div className="min-h-screen">
      <nav className="flex items-center justify-between px-6 md:px-10 py-6 max-w-6xl mx-auto">
        <Link to="/" className="font-display font-extrabold text-xl tracking-tight text-ink">
          Mastery Loop
        </Link>

        <div className="flex items-center gap-3 relative">
          <span className="text-muted text-sm hidden sm:block">Level {stats ? stats.level : user.level}</span>

          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Account menu"
            className="w-10 h-10 rounded-full bg-raised border border-white/10 flex items-center justify-center text-ink font-display font-bold overflow-hidden hover:border-mint/60 transition-colors"
          >
            {user.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : user.name.charAt(0).toUpperCase()}
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
                  <button onClick={openEdit} className="w-full text-left px-3.5 py-2.5 text-sm text-ink rounded-xl hover:bg-white/5 transition-colors">
                    Edit profile
                  </button>
                  <Link to="/skilltree" onClick={() => setMenuOpen(false)} className="block px-3.5 py-2.5 text-sm text-ink rounded-xl hover:bg-white/5 transition-colors">
                    Skill tree
                  </Link>
                  <button onClick={handleLogout} className="w-full text-left px-3.5 py-2.5 text-sm text-muted rounded-xl hover:bg-white/5 transition-colors">
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
          <h1 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight text-ink">{headline}</h1>
          {subline && <p className="text-muted mt-2">{subline}</p>}
        </header>

        {loadError && <p className="text-sm text-rose bg-rose/10 rounded-xl px-4 py-3 mb-8">{loadError}</p>}

        <div className="grid sm:grid-cols-3 gap-4 mb-14">
          {statCards.map((s) => (
            <div key={s.label} className="rounded-2xl bg-surface border border-white/5 px-6 py-6">
              <p className={`nums font-bold text-4xl ${toneClass[s.tone]}`}>{s.value}</p>
              <p className="text-muted text-sm mt-1.5">{s.label}</p>
            </div>
          ))}
        </div>

        <h2 className="font-display font-bold text-xl text-ink mb-5">Ready to review</h2>
        <div className="flex flex-col gap-2.5">
          {!loading && quests.length === 0 && !loadError && (
            <div className="rounded-xl bg-surface border border-white/5 px-5 py-6 text-muted text-sm">
              Nothing to review today. <Link to="/skilltree" className="text-mint hover:underline">Open the skill tree</Link> to see what's next.
            </div>
          )}

          {quests.map((q) => (
            <motion.div
              key={q.nodeId}
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="rounded-xl bg-surface border border-white/5 px-5 py-4 flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <p className="text-ink font-medium truncate">{q.title}</p>
                {q.isNew ? (
                  <p className="text-mint text-xs mt-2">New topic</p>
                ) : (
                  <div className="flex items-center gap-2.5 mt-2">
                    <div className="h-1 w-28 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full rounded-full bg-rose" style={{ width: `${Math.round(q.strength * 100)}%` }} />
                    </div>
                    <span className="text-muted text-xs">{Math.round(q.strength * 100)}% strength</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <span className="nums text-gold text-sm">+{q.xp}</span>
                <motion.div whileTap={{ scale: 0.96 }}>
                  <Link to={`/practice?node=${q.nodeId}`} className="inline-block bg-mint text-bg font-semibold text-sm px-4 py-2 rounded-full">
                    {q.isNew ? "Start" : "Review"}
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit profile" subtitle="Changes apply as soon as you save.">
        <form onSubmit={saveProfile}>
          {formError && <p className="text-sm text-rose bg-rose/10 rounded-xl px-3.5 py-2.5 mb-4">{formError}</p>}

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-bg border border-white/10 flex items-center justify-center text-ink font-display font-bold text-xl overflow-hidden">
              {avatar ? <img src={avatar} alt="" className="w-full h-full object-cover" /> : (name || user.name).charAt(0).toUpperCase()}
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
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Leave blank to keep your current one" className={field + " mb-4"} />

          {password && (
            <>
              <label className={label}>Current password</label>
              <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Needed to change your password" className={field + " mb-4"} />
            </>
          )}

          <motion.button whileTap={{ scale: 0.98 }} type="submit" disabled={saving} className="w-full bg-gold text-bg font-display font-bold py-3 rounded-full mt-3 disabled:opacity-50">
            {saving ? "Saving…" : "Save changes"}
          </motion.button>
        </form>
      </Modal>
    </div>
  );
}

export default Dashboard;
