import { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../components/common/Modal";

const mockUser = { name: "Rhys", email: "rhys@example.com", xp: 1240, level: 6, streak: 9 };

const mockStats = [
  { label: "Total XP", value: "1,240", accent: "gold" },
  { label: "Current Streak", value: "9 days", accent: "teal" },
  { label: "Nodes Mastered", value: "14 / 32", accent: "gold" },
];

const mockQuestsDueToday = [
  { id: 1, title: "Recursion Basics", difficulty: "Easy", xp: 20 },
  { id: 2, title: "Binary Search Trees", difficulty: "Medium", xp: 35 },
  { id: 3, title: "Graph Traversal", difficulty: "Hard", xp: 50 },
];

function Dashboard() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  // Edit form state, pre-filled from mock user
  const [name, setName] = useState(mockUser.name);
  const [email, setEmail] = useState(mockUser.email);
  const [password, setPassword] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null);

  function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  }

  function handleSaveProfile(e) {
    e.preventDefault();
    // Placeholder — becomes a real API call once backend exists
    console.log("Saving profile:", { name, email, password, avatarPreview });
    setEditOpen(false);
  }

  return (
    <div className="bg-bg min-h-screen font-body">
      {/* Top bar */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto relative">
        <Link to="/" className="font-display font-bold text-xl text-ink">
          Mastery<span className="text-gold">Loop</span>
        </Link>

        <div className="flex items-center gap-3 relative">
          <span className="text-muted text-sm">Level {mockUser.level}</span>

          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-9 h-9 rounded-full bg-surface border border-white/10 flex items-center justify-center text-ink font-display font-semibold text-sm overflow-hidden 
           transition hover: border-teal/60 hover:bg-white/10 cursor-pointer"
          >
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              name.charAt(0)
            )}
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <>
              {/* Click-outside backdrop */}
              <div
                onClick={() => setDropdownOpen(false)}
                className="fixed inset-0 z-40"
              />
              <div className="absolute right-0 top-12 z-50 bg-surface border border-white/10 rounded-xl py-2 w-44 shadow-lg">
                <button
                  onClick={() => { setEditOpen(true); setDropdownOpen(false); }}
                  className="w-full text-left px-4 py-2 text-sm text-ink hover:bg-white/5 transition"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => setDropdownOpen(false)}
                  className="w-full text-left px-4 py-2 text-sm text-muted hover:bg-white/5 transition"
                >
                  Log Out
                </button>
              </div>
            </>
          )}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pb-16">
        <div className="mt-4 mb-10">
          <h1 className="font-display font-bold text-3xl text-ink">
            Welcome back, {mockUser.name}
          </h1>
          <p className="text-muted mt-1">Here's where your practice stands today.</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-5 mb-12">
          {mockStats.map((stat) => (
            <div key={stat.label} className="bg-surface rounded-2xl p-6 border border-white/5">
              <p className="text-muted text-sm mb-2">{stat.label}</p>
              <p className={`font-mono font-semibold text-2xl ${stat.accent === "gold" ? "text-gold" : "text-teal"}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div>
          <h2 className="font-display font-semibold text-xl text-ink mb-5">Due Today</h2>
          <div className="flex flex-col gap-3">
            {mockQuestsDueToday.map((quest) => (
              <div
                key={quest.id}
                className="bg-surface rounded-xl px-5 py-4 border border-white/5 flex items-center justify-between hover:border-teal/40 transition"
              >
                <div>
                  <p className="text-ink font-body font-medium">{quest.title}</p>
                  <p className="text-muted text-xs mt-1">{quest.difficulty}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-gold text-sm">+{quest.xp} XP</span>
                  <button className="bg-teal text-bg font-body font-semibold text-sm px-4 py-1.5 rounded-full hover:opacity-90 transition">
                    Practice
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Edit Profile Modal */}
      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit Profile">
        <form onSubmit={handleSaveProfile}>
          {/* Avatar upload */}
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-full bg-bg border border-white/10 flex items-center justify-center text-ink font-display font-semibold overflow-hidden">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                name.charAt(0)
              )}
            </div>
            <label className="text-teal text-sm cursor-pointer hover:underline">
              Change photo
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </label>
          </div>

          <label className="block text-muted text-xs mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-bg text-ink text-sm rounded-lg px-3 py-2 mb-4 border border-white/10 focus:border-teal outline-none transition"
          />

          <label className="block text-muted text-xs mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-bg text-ink text-sm rounded-lg px-3 py-2 mb-4 border border-white/10 focus:border-teal outline-none transition"
          />

          <label className="block text-muted text-xs mb-1">New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Leave blank to keep current password"
            className="w-full bg-bg text-ink text-sm rounded-lg px-3 py-2 mb-6 border border-white/10 focus:border-teal outline-none transition"
          />

          <button
            type="submit"
            className="w-full bg-gold text-bg font-display font-bold py-2.5 rounded-full hover:opacity-90 transition"
          >
            Save Changes
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default Dashboard;