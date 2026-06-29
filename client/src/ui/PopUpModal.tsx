'use client'

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function PopUpModal({ isOpen, onClose, children }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-y-auto p-4 animate-fadeIn">
      <div
        className="card p-7 relative overflow-auto max-h-[90vh] w-full max-w-lg animate-fadeInUp shadow-lg"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3.5 right-3.5 grid place-items-center size-9 rounded-full border border-border bg-surface text-text-muted hover:text-text-primary hover:border-border-strong text-xl leading-none transition-colors"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
