import React from 'react';
import { Trash2, AlertTriangle, X, Loader2 } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  message: string;
  itemName?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDeleting?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  confirmLabel = 'Ya, Hapus',
  cancelLabel = 'Batal',
  isDeleting = false
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) onClose();
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 p-6 text-slate-900 z-[101]"
      >
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isDeleting}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50 cursor-pointer"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Details */}
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mb-4 shadow-inner">
            <Trash2 className="w-7 h-7" />
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-2">
            {title}
          </h3>

          <p className="text-sm text-slate-600 leading-relaxed max-w-sm mb-3">
            {message}
          </p>

          {itemName && (
            <div className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 mb-6 text-xs font-semibold text-slate-800 break-words text-center">
              "{itemName}"
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-bold transition-all cursor-pointer disabled:opacity-50"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-sm font-bold shadow-md hover:shadow-rose-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menghapus...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>{confirmLabel}</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
