import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="bg-bg min-h-screen flex flex-col items-center justify-center px-6 font-body text-center">
      <p className="font-mono text-gold text-sm mb-3">404</p>
      <h1 className="font-display font-bold text-2xl text-ink mb-3">
        This node doesn't exist.
      </h1>
      <p className="text-muted text-sm mb-8">
        The page you're looking for isn't part of the skill tree.
      </p>
      <Link
        to="/"
        className="bg-teal text-bg font-body font-semibold text-sm px-6 py-2.5 rounded-full hover:opacity-90 transition"
      >
        Back to Home
      </Link>
    </div>
  );
}

export default NotFound;