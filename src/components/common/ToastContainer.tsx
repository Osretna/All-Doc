import React from 'react';
import { ToastItem } from '../../types/office';
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from 'lucide-react';

interface Props {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<Props> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-12 left-4 z-50 flex flex-col gap-2 max-w-sm select-none">
      {toasts.map(toast => {
        let Icon = CheckCircle2;
        let borderClass = 'border-emerald-500 bg-emerald-50 text-emerald-900';
        if (toast.type === 'error') {
          Icon = XCircle;
          borderClass = 'border-red-500 bg-red-50 text-red-900';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          borderClass = 'border-amber-500 bg-amber-50 text-amber-900';
        } else if (toast.type === 'info') {
          Icon = Info;
          borderClass = 'border-blue-500 bg-blue-50 text-blue-900';
        }

        return (
          <div
            key={toast.id}
            className={`flex items-center justify-between gap-3 p-3 rounded-lg border shadow-lg text-xs font-semibold animate-in slide-in-from-bottom duration-200 ${borderClass}`}
          >
            <div className="flex items-center gap-2">
              <Icon className="w-4 h-4 shrink-0" />
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 hover:bg-black/10 rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
