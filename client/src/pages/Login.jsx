import { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [isFlipped, setIsFlipped] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup state
  const [name, setName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const [error, setError] = useState("");

  function handleLogin(e) {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setError("Please fill in both fields.");
      return;
    }
    setError("");
    console.log("Logging in with:", { loginEmail, loginPassword });
  }

  function handleSignup(e) {
    e.preventDefault();
    if (!name || !signupEmail || !signupPassword) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    console.log("Signing up with:", { name, signupEmail, signupPassword });
  }

  return (
    <div className="bg-bg min-h-screen flex items-center justify-center px-6 font-body">
      <div className="w-full max-w-sm">
        <Link to="/" className="block text-center mb-8">
          <span className="font-display font-bold text-2xl text-ink">
            Mastery<span className="text-gold">Loop</span>
          </span>
        </Link>

        {/* Flip container — perspective must live on the parent */}
        <div className="[perspective:1200px]">
          <div
            className={`relative transition-transform duration-700 [transform-style:preserve-3d] ${
              isFlipped ? "[transform:rotateY(180deg)]" : ""
            }`}
          >
            {/* FRONT FACE — Login */}
            <div className="[backface-visibility:hidden] bg-surface rounded-2xl p-6 border border-white/5 min-h-[405px]">
              <h2 className="font-display font-semibold text-lg text-ink mb-4 mt-10">Log In</h2>

              {error && !isFlipped && (
                <p className="text-sm text-red-400 bg-red-400/10 rounded-lg px-3 py-2 mb-4">
                  {error}
                </p>
              )}

              <form onSubmit={handleLogin}>
                <label className="block text-muted text-xs mb-1">Email</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-bg text-ink text-sm rounded-lg px-3 py-2 mb-4 border border-white/10 focus:border-teal outline-none transition"
                />

                <label className="block text-muted text-xs mb-1">Password</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-bg text-ink text-sm rounded-lg px-3 py-2 mb-6 border border-white/10 focus:border-teal outline-none transition"
                />

                <button
                  type="submit"
                  className="w-full bg-gold text-bg font-display font-bold py-2.5 rounded-full hover:opacity-90 transition"
                >
                  Log In
                </button>

                <p className="text-center text-muted text-sm mt-5 mb-10">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => { setIsFlipped(true); setError(""); }}
                    className="text-teal hover:underline"
                  >
                    Sign up
                  </button>
                </p>
              </form>
            </div>

            {/* BACK FACE — Signup */}
            <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-surface rounded-2xl p-6 border border-white/5">
              <h2 className="font-display font-semibold text-lg text-ink mb-4">Create Account</h2>

              {error && isFlipped && (
                <p className="text-sm text-red-400 bg-red-400/10 rounded-lg px-3 py-2 mb-4">
                  {error}
                </p>
              )}

              <form onSubmit={handleSignup}>
                <label className="block text-muted text-xs mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full bg-bg text-ink text-sm rounded-lg px-3 py-2 mb-4 border border-white/10 focus:border-teal outline-none transition"
                />

                <label className="block text-muted text-xs mb-1">Email</label>
                <input
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-bg text-ink text-sm rounded-lg px-3 py-2 mb-4 border border-white/10 focus:border-teal outline-none transition"
                />

                <label className="block text-muted text-xs mb-1">Password</label>
                <input
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-bg text-ink text-sm rounded-lg px-3 py-2 mb-6 border border-white/10 focus:border-teal outline-none transition"
                />

                <button
                  type="submit"
                  className="w-full bg-teal text-bg font-display font-bold py-2.5 rounded-full hover:opacity-90 transition"
                >
                  Sign Up
                </button>

                <p className="text-center text-muted text-sm mt-5">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => { setIsFlipped(false); setError(""); }}
                    className="text-teal hover:underline"
                  >
                    Log in
                  </button>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;