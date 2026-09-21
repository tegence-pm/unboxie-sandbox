import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, X, CheckCircle2 } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'success' | 'primary';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getIconContainerClass = () => {
    switch (variant) {
      case 'danger':
        return 'bg-rose-50 text-rose-600 border border-rose-100';
      case 'warning':
        return 'bg-amber-50 text-amber-600 border border-amber-100';
      case 'success':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      default:
        return 'bg-brand-50 text-brand-600 border border-brand-100';
    }
  };

  const getButtonClass = () => {
    switch (variant) {
      case 'danger':
        return 'bg-rose-600 hover:bg-rose-700';
      case 'warning':
        return 'bg-amber-600 hover:bg-amber-700';
      case 'success':
        return 'bg-emerald-600 hover:bg-emerald-700';
      default:
        return 'bg-brand-500 hover:bg-brand-600';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-modal border border-slate-100 animate-fade-in transition-all"
          onClick={e => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-4">
            {/* Icon */}
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${getIconContainerClass()}`}
            >
              {variant === 'danger' && <Trash2 className="w-5 h-5" />}
              {variant === 'warning' && <AlertTriangle className="w-5 h-5" />}
              {variant === 'success' && <CheckCircle2 className="w-5 h-5" />}
              {variant === 'primary' && <AlertTriangle className="w-5 h-5" />}
            </div>

            {/* Title & Message */}
            <div className="min-w-0 flex-1 pt-0.5">
              <h3 className="text-base font-bold text-slate-900 font-heading">
                {title}
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {message}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-xs transition-all ${getButtonClass()}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
