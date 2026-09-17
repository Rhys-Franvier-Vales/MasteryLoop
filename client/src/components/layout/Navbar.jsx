import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 md:px-10 py-6 max-w-6xl mx-auto">
      <Link to="/" className="font-display font-extrabold text-xl tracking-tight text-ink">
        Mastery Loop
      </Link>

      <div className="hidden md:flex gap-8 text-muted text-sm">
        <a href="#why" className="hover:text-ink transition-colors">Why it works</a>
        <a href="#loop" className="hover:text-ink transition-colors">The loop</a>
      </div>

      <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
        <Link
          to="/login"
          className="inline-block bg-mint text-bg font-semibold text-sm px-5 py-2.5 rounded-full"
        >
          Start practicing
        </Link>
      </motion.div>
    </nav>
  );
}

export default Navbar;