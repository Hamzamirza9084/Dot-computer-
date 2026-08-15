import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel' }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onCancel} />

      {/* Modal */}
      <div className="relative w-full max-w-sm sm:max-w-md border border-white/15 bg-[#0a0a0a] p-5 sm:p-8 animate-in rounded-sm">
        <button
          onClick={onCancel}
          className="absolute top-4 sm:top-5 right-4 sm:right-5 text-white/30 hover:text-white transition-colors"
          id="modal-close-btn"
        >
          <X size={16} />
        </button>

        <h3 className="text-sm sm:text-base font-bold tracking-tight text-white mb-2">{title}</h3>
        <p className="text-white/50 text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8">{message}</p>

        <div className="flex gap-2.5 sm:gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-3 sm:px-4 py-2 text-[11px] sm:text-xs font-mono tracking-widest uppercase border border-white/15 text-white/40 hover:text-white hover:border-white/30 transition-all rounded-sm"
            id="modal-cancel-btn"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 sm:px-5 py-2 text-[11px] sm:text-xs font-mono font-semibold tracking-widest uppercase bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-500 hover:to-purple-400 transition-all rounded-sm"
            id="modal-confirm-btn"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
