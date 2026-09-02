function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
      {/* Backdrop — click to close */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />

      {/* Modal box */}
      <div className="relative bg-surface rounded-2xl p-6 border border-white/10 w-full max-w-md">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-semibold text-lg text-ink">{title}</h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-ink transition text-xl leading-none"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default Modal;