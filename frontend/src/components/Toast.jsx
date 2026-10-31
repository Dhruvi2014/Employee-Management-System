import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" role="region" aria-live="polite">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, toast.duration || 4500);

    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const icons = {
    success: <CheckCircle2 className="toast-icon text-success" size={20} />,
    error: <AlertCircle className="toast-icon text-danger" size={20} />,
    info: <Info className="toast-icon text-primary" size={20} />,
  };

  return (
    <div className={`toast-card toast-${toast.type || 'info'} animate-slide-in`}>
      <div className="toast-content">
        {icons[toast.type] || icons.info}
        <div className="toast-text">
          {toast.title && <div className="toast-title">{toast.title}</div>}
          <div className="toast-message">{toast.message}</div>
        </div>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="toast-close-btn"
        aria-label="Dismiss notification"
      >
        <X size={16} />
      </button>
    </div>
  );
}
