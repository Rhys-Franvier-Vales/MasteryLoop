import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto">
      <span className="font-display font-bold text-xl text-ink">
        Mastery<span className="text-gold">Loop</span>
      </span>
      <div className="hidden md:flex gap-8 text-muted font-body text-sm">
        <a href="#features" className="hover:text-ink transition">Features</a>
        <a href="#how" className="hover:text-ink transition">How it works</a>
      </div>
      <Link
        to="/login"
        className="bg-teal text-bg font-body font-semibold text-sm px-5 py-2 rounded-full hover:opacity-90 transition"
      >
        Get Started
      </Link>
    </nav>
  );
}

export default Navbar;