import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const field =
  "w-full bg-bg text-ink text-sm rounded-xl px-4 py-2.5 border border-white/10 focus:border-mint outline-none transition-colors placeholder:text-muted/50";
const label = "block text-muted text-xs mb-1.5";

function Login() {
  const [flipped, setFlipped] = useState(false);
  const [error, setError] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [name, setName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  function handleLogin(e) {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return setError("Enter your email and password.");
    setError("");
    console.log("Logging in:", { loginEmail, loginPassword });
  }

  function handleSignup(e) {
    e.preventDefault();
    if (!name || !signupEmail || !signupPassword) return setError("Fill in every field to create your account.");
    setError("");
    console.log("Signing up:", { name, signupEmail, signupPassword });
  }

  function flip(to) {
    setFlipped(to);
    setError("");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <Link to="/" className="block text-center font-display font-extrabold text-xl tracking-tight text-ink mb-8">
          Mastery Loop
        </Link>

        <div className="[perspective:1400px]">
          <motion.div
            className="relative [transform-style:preserve-3d] min-h-[520px]"
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 160, damping: 22 }}
          >
            {/* Front — log in */}
            <div className="absolute inset-0 [backface-visibility:hidden] bg-surface rounded-3xl p-7 border border-white/5">
              <h1 className="font-display font-bold text-2xl text-ink">Welcome back</h1>
              <p className="text-muted text-sm mt-1.5 mb-6">Pick up where your reviews left off.</p>

              {error && !flipped && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-rose bg-rose/10 rounded-xl px-3.5 py-2.5 mb-4"
                >
                  {error}
                </motion.p>
              )}

              <form onSubmit={handleLogin}>
                <label className={label}>Email</label>
                <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="you@example.com" className={field + " mb-4"} />

                <label className={label}>Password</label>
                <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="••••••••" className={field + " mb-6"} />

                <motion.button whileTap={{ scale: 0.98 }} type="submit" className="w-full bg-gold text-bg font-display font-bold py-3 rounded-full">
                  Log in
                </motion.button>
              </form>

              <p className="text-center text-muted text-sm mt-6">
                New here?{" "}
                <button type="button" onClick={() => flip(true)} className="text-mint hover:underline">
                  Create an account
                </button>
              </p>
            </div>

            {/* Back — sign up */}
            <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-surface rounded-3xl p-7 border border-white/5">
              <h1 className="font-display font-bold text-2xl text-ink">Start your first loop</h1>
              <p className="text-muted text-sm mt-1.5 mb-6">Your schedule builds from your very first answer.</p>

              {error && flipped && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-rose bg-rose/10 rounded-xl px-3.5 py-2.5 mb-4"
                >
                  {error}
                </motion.p>
              )}

              <form onSubmit={handleSignup}>
                <label className={label}>Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={field + " mb-4"} />

                <label className={label}>Email</label>
                <input type="email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} placeholder="you@example.com" className={field + " mb-4"} />

                <label className={label}>Password</label>
                <input type="password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} placeholder="At least 8 characters" className={field + " mb-6"} />

                <motion.button whileTap={{ scale: 0.98 }} type="submit" className="w-full bg-mint text-bg font-display font-bold py-3 rounded-full">
                  Create account
                </motion.button>
              </form>

              <p className="text-center text-muted text-sm mt-6">
                Already have one?{" "}
                <button type="button" onClick={() => flip(false)} className="text-mint hover:underline">
                  Log in
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Login;