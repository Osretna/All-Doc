import React, { useState } from 'react';
import { X, Lock, ShieldCheck } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isProtected: boolean;
  onToggleProtect: (password: string) => void;
  sheetLabel?: string;
}

export const ProtectSheetModal: React.FC<Props> = ({
  isOpen,
  onClose,
  isProtected,
  onToggleProtect,
  sheetLabel,
}) => {
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onToggleProtect(password);
    setPassword('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none" dir="rtl">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-300 w-full max-w-sm flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100 text-right">
        <div className="flex items-center justify-between px-4 py-3 bg-[#107c41] text-white">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            <h3 className="font-bold text-sm">
              {isProtected ? `إلغاء حماية ورقة العمل (${sheetLabel || ''})` : `حماية ورقة العمل (${sheetLabel || ''})`}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded cursor-pointer transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3 text-xs text-gray-700">
          <div className="flex items-start gap-2 p-2 bg-amber-50 border border-amber-200 rounded text-amber-900 text-[11px]">
            <ShieldCheck className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" />
            <span>
              {isProtected
                ? 'ورقة العمل الحالية محمية. أدخل كلمة المرور لإلغاء الحماية والسماح بالتعديل.'
                : 'حماية الورقة تمنع التعديلات العشوائية على الخلايا والصيغ.'}
            </span>
          </div>

          <div>
            <label className="block font-medium mb-1">كلمة المرور:</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-[#107c41]"
              placeholder="أدخل كلمة المرور..."
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-100 cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#107c41] text-white rounded font-bold hover:bg-[#0c6233] cursor-pointer"
            >
              {isProtected ? 'إلغاء الحماية' : 'تفعيل الحماية'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
