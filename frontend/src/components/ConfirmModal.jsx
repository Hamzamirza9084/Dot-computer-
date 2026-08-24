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
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ padding: '16px' }}>
      {/* Backdrop */}
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={onCancel} />

      {/* Modal */}
      <div className="relative w-full rounded-2xl"
           style={{ maxWidth: '420px', backgroundColor: '#ffffff', border: '1px solid #e2e2e2', padding: '32px', boxShadow: '0 24px 64px rgba(0,0,0,0.2)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <button onClick={onCancel} className="absolute transition-colors duration-300"
                style={{ top: '20px', right: '20px', color: '#c2c7d0' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#1b1b1b'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#c2c7d0'; }}
                id="modal-close-btn">
          <X size={18} />
        </button>

        <h3 className="font-bold" style={{ fontSize: '20px', color: '#1b1b1b', marginBottom: '8px' }}>{title}</h3>
        <p style={{ fontSize: '14px', lineHeight: '22px', color: '#42474f', marginBottom: '28px' }}>{message}</p>

        <div className="flex gap-3 justify-end">
          <button onClick={onCancel}
            className="text-sm font-semibold transition-colors duration-300"
            style={{ color: '#727780', padding: '10px 20px', borderRadius: '12px', border: '1px solid #e2e2e2' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#1b1b1b'; e.currentTarget.style.color = '#1b1b1b'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e2e2'; e.currentTarget.style.color = '#727780'; }}
            id="modal-cancel-btn">
            {cancelText}
          </button>
          <button onClick={onConfirm}
            className="text-white text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5"
            style={{ backgroundColor: '#5682B1', borderRadius: '12px', padding: '10px 24px' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#739EC9'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#5682B1'; }}
            id="modal-confirm-btn">
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
