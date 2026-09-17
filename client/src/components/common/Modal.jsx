import { motion, AnimatePresence } from "framer-motion";

function Modal({ isOpen, onClose, title, subtitle, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="relative bg-surface rounded-3xl p-7 border border-white/10 w-full max-w-md"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="font-display font-bold text-xl text-ink">{title}</h2>
                {subtitle && <p className="text-muted text-sm mt-1">{subtitle}</p>}
              </div>
              <button onClick={onClose} aria-label="Close" className="text-muted hover:text-ink transition-colors text-2xl leading-none -mt-1">
                ×
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default Modal;