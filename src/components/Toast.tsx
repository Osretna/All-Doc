import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'error' | 'info';
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-12 left-6 z-50 flex flex-col gap-2 max-w-md select-none toast-container no-print" dir="rtl">
      {toasts.map(toast => {
        const bg =
          toast.type === 'success'
            ? 'bg-emerald-600 text-white'
            : toast.type === 'error'
            ? 'bg-rose-600 text-white'
            : 'bg-slate-800 text-white';

        const Icon =
          toast.type === 'success' ? CheckCircle2 : toast.type === 'error' ? AlertCircle : Info;

        return (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl ${bg} animate-in fade-in slide-in-from-bottom-2 duration-200 border border-white/10`}
          >
            <Icon className="w-5 h-5 shrink-0" />
            <p className="text-xs sm:text-sm font-medium leading-relaxed flex-1">{toast.text}</p>
            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
