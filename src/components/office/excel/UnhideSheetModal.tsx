import React, { useState } from 'react';
import { X, Eye, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  hiddenSheets: { key: string; label: string }[];
  onConfirmUnhide: (key: string) => void;
}

export const UnhideSheetModal: React.FC<Props> = ({
  isOpen,
  onClose,
  hiddenSheets,
  onConfirmUnhide,
}) => {
  const [selectedKey, setSelectedKey] = useState<string>(hiddenSheets[0]?.key || '');

  React.useEffect(() => {
    if (hiddenSheets.length > 0 && !selectedKey) {
      setSelectedKey(hiddenSheets[0].key);
    }
  }, [hiddenSheets, selectedKey]);

  if (!isOpen || hiddenSheets.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none" dir="rtl">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-2xl border border-gray-300 overflow-hidden text-right font-sans text-xs">
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#107c41] text-white">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-white" />
            <span className="font-bold">إظهار الورقة (Unhide Sheet)</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded text-white/90">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <label className="block font-bold text-gray-700">اختر ورقة العمل لإظهارها (Unhide sheet):</label>
          <div className="border border-gray-300 rounded bg-white max-h-40 overflow-y-auto divide-y divide-gray-100">
            {hiddenSheets.map((s) => (
              <div
                key={s.key}
                onClick={() => setSelectedKey(s.key)}
                className={`p-2.5 cursor-pointer hover:bg-emerald-50 ${
                  selectedKey === s.key ? 'bg-emerald-100 font-bold text-emerald-950' : 'text-gray-800'
                }`}
              >
                {s.label}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 p-3 bg-gray-50 border-t border-gray-200">
          <button
            onClick={() => {
              if (selectedKey) {
                onConfirmUnhide(selectedKey);
                onClose();
              }
            }}
            className="px-4 py-1.5 bg-[#107c41] hover:bg-[#0c6233] text-white rounded font-bold shadow-sm transition cursor-pointer flex items-center gap-1"
          >
            <Check className="w-3.5 h-3.5" />
            <span>موافق</span>
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-100 cursor-pointer"
          >
            إلغاء الأمر
          </button>
        </div>
      </div>
    </div>
  );
};
