import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react';

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  employee,
  loading = false,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !loading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen || !employee) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-container modal-danger animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="danger-header-wrap">
            <div className="danger-icon-badge">
              <AlertTriangle size={22} className="text-danger" />
            </div>
            <div>
              <h2 className="modal-title">Confirm Deletion</h2>
              <p className="modal-subtitle">This action cannot be undone.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="modal-close-btn"
            disabled={loading}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p className="danger-prompt-text">
            Are you sure you want to permanently delete this employee record?
          </p>

          <div className="employee-preview-box">
            <div className="preview-row">
              <span className="preview-label">Name:</span>
              <span className="preview-value font-semibold">{employee.name}</span>
            </div>
            <div className="preview-row">
              <span className="preview-label">Email:</span>
              <span className="preview-value">{employee.email}</span>
            </div>
            <div className="preview-row">
              <span className="preview-label">Department:</span>
              <span className="preview-value">{employee.department}</span>
            </div>
            <div className="preview-row">
              <span className="preview-label">Designation:</span>
              <span className="preview-value">{employee.designation}</span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="btn btn-danger"
            disabled={loading}
            id="confirm-delete-btn"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 size={16} />
                <span>Delete Employee</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
