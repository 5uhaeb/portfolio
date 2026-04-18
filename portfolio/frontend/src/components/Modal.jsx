import { useEffect } from 'react';

export default function Modal({ open, onClose, children, title, wide = false }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/50 px-4 py-10"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`relative w-full ${wide ? 'max-w-3xl' : 'max-w-xl'} bg-paper border border-ink/20 shadow-2xl`}
      >
        <div className="flex items-center justify-between border-b border-ink/15 px-6 py-4">
          <h2 className="font-display text-xl tracking-tightest">{title}</h2>
          <button
            onClick={onClose}
            className="font-mono text-xs uppercase tracking-widest text-ink/60 hover:text-ink"
            aria-label="Close"
          >
            Close ✕
          </button>
        </div>
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>
  );
}
