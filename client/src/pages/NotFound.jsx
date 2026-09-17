import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="nums text-muted text-sm"
      >
        404
      </motion.p>
      <h1 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight text-ink mt-3 mb-3">
        This node isn't on the tree
      </h1>
      <p className="text-muted text-sm mb-9 max-w-xs">
        The page you asked for doesn't exist. Head back and pick up your reviews.
      </p>
      <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
        <Link to="/" className="inline-block bg-mint text-bg font-semibold text-sm px-6 py-3 rounded-full">
          Back to home
        </Link>
      </motion.div>
    </div>
  );
}

export default NotFound;