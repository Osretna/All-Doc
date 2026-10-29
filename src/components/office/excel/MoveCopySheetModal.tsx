import React, { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  sheets: Record<string, { label: string }>;
  activeSheetKey: string;
  onConfirmMoveCopy: (sourceKey: string, targetKey: string | 'end', isCopy: boolean) => void;
}

export const MoveCopySheetModal: React.FC<Props> = ({
  isOpen,
  onClose,
  sheets,
  activeSheetKey,
  onConfirmMoveCopy,
}) => {
  const [targetKey, setTargetKey] = useState<string | 'end'>('end');
  const [isCopy, setIsCopy] = useState(false);

  if (!isOpen) return null;

  const currentLabel = sheets[activeSheetKey]?.label || 'الورقة';

  const handleApply = () => {
    onConfirmMoveCopy(activeSheetKey, targetKey, isCopy);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none" dir="rtl">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-2xl border border-gray-300 overflow-hidden text-right font-sans text-xs">
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#107c41] text-white">
          <div className="flex items-center gap-2">
            <Copy className="w-4 h-4 text-white" />
            <span className="font-bold">نقل أو نسخ (Move or Copy)</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded text-white/90">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <div>
            <span className="text-gray-600 block mb-1">نقل الورقة المحددة: <strong>{currentLabel}</strong></span>
            <label className="block mb-1 font-bold text-gray-700">قبل الورقة (Before sheet):</label>
            <div className="border border-gray-300 rounded bg-white max-h-36 overflow-y-auto divide-y divide-gray-100">
              {Object.entries(sheets).map(([k, s]) => (
                <div
                  key={k}
                  onClick={() => setTargetKey(k)}
                  className={`p-2 cursor-pointer hover:bg-emerald-50 ${
                    targetKey === k ? 'bg-emerald-100 font-bold text-emerald-950' : 'text-gray-800'
                  }`}
                >
                  {s.label}
                </div>
              ))}
              <div
                onClick={() => setTargetKey('end')}
                className={`p-2 cursor-pointer hover:bg-emerald-50 ${
                  targetKey === 'end' ? 'bg-emerald-100 font-bold text-emerald-950' : 'text-gray-800'
                }`}
              >
                (تحريك إلى النهاية / Move to end)
              </div>
            </div>
          </div>

          <label className="flex items-center gap-2 pt-2 border-t border-gray-200 cursor-pointer">
            <input
              type="checkbox"
              checked={isCopy}
              onChange={(e) => setIsCopy(e.target.checked)}
              className="accent-[#107c41] rounded w-4 h-4 cursor-pointer"
            />
            <span className="font-bold text-gray-800">إنشاء نسخة (Create a copy)</span>
          </label>
        </div>

        <div className="flex justify-end gap-2 p-3 bg-gray-50 border-t border-gray-200">
          <button
            onClick={handleApply}
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
