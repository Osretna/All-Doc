import React, { useState } from 'react';
import { X, Columns3 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSplitText: (delimiter: string) => void;
}

export const TextToColumnsModal: React.FC<Props> = ({ isOpen, onClose, onSplitText }) => {
  const [delimiterType, setDelimiterType] = useState<string>('comma');
  const [customChar, setCustomChar] = useState('-');

  if (!isOpen) return null;

  const handleApply = () => {
    let delim = ',';
    if (delimiterType === 'comma') delim = ',';
    else if (delimiterType === 'space') delim = ' ';
    else if (delimiterType === 'tab') delim = '\t';
    else if (delimiterType === 'semicolon') delim = ';';
    else delim = customChar || ',';

    onSplitText(delim);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-300 w-full max-w-sm flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        <div className="flex items-center justify-between px-4 py-3 bg-[#107c41] text-white">
          <div className="flex items-center gap-2">
            <Columns3 className="w-5 h-5" />
            <h3 className="font-bold text-sm">تحويل النص إلى أعمدة (Text to Columns)</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded cursor-pointer transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3 text-xs text-gray-700">
          <p className="leading-relaxed">
            اختر الفاصل المستخدم في الخلايا المحددة لتوزيع النصوص عبر الأعمدة المتجاورة:
          </p>

          <div className="space-y-2 border border-gray-200 rounded p-3 bg-gray-50">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="delim"
                checked={delimiterType === 'comma'}
                onChange={() => setDelimiterType('comma')}
                className="text-[#107c41] focus:ring-[#107c41]"
              />
              <span>فاصلة ( , )</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="delim"
                checked={delimiterType === 'space'}
                onChange={() => setDelimiterType('space')}
                className="text-[#107c41] focus:ring-[#107c41]"
              />
              <span>مسافة ( Space )</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="delim"
                checked={delimiterType === 'semicolon'}
                onChange={() => setDelimiterType('semicolon')}
                className="text-[#107c41] focus:ring-[#107c41]"
              />
              <span>فاصلة منقوطة ( ; )</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="delim"
                checked={delimiterType === 'custom'}
                onChange={() => setDelimiterType('custom')}
                className="text-[#107c41] focus:ring-[#107c41]"
              />
              <span>رمز مخصص:</span>
              <input
                type="text"
                maxLength={3}
                value={customChar}
                onChange={e => setCustomChar(e.target.value)}
                disabled={delimiterType !== 'custom'}
                className="w-12 px-2 py-0.5 border border-gray-300 rounded bg-white text-center text-xs"
              />
            </label>
          </div>
        </div>

        <div className="px-4 py-2.5 bg-gray-100 border-t border-gray-200 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-medium cursor-pointer"
          >
            إلغاء
          </button>
          <button
            onClick={handleApply}
            className="px-5 py-1.5 rounded bg-[#107c41] hover:bg-[#0e6b37] text-white font-bold text-xs cursor-pointer shadow-xs"
          >
            موافق (تقسيم الأعمدة)
          </button>
        </div>
      </div>
    </div>
  );
};
