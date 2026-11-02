import React, { useState } from 'react';
import { X, SplitSquareVertical } from 'lucide-react';
import { SheetData } from '../../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedRange: string[];
  data: SheetData;
  onApplySplit: (splits: { targetCell: string; value: string }[]) => void;
}

export const TextToColumnsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  selectedRange,
  data,
  onApplySplit,
}) => {
  const [delimiterType, setDelimiterType] = useState<'comma' | 'space' | 'tab' | 'semicolon' | 'custom'>('comma');
  const [customDelimiter, setCustomDelimiter] = useState('-');

  if (!isOpen) return null;

  const sampleCellId = selectedRange[0] || 'A4';
  const sampleValue = String(data[sampleCellId]?.value || 'الاسم الأول, الاسم الأخير, الهاتف');

  const getActiveDelimiter = () => {
    switch (delimiterType) {
      case 'comma': return ',';
      case 'space': return ' ';
      case 'tab': return '\t';
      case 'semicolon': return ';';
      case 'custom': return customDelimiter;
    }
  };

  const previewTokens = sampleValue.split(getActiveDelimiter()).map((s) => s.trim());

  const handleExecute = () => {
    const delim = getActiveDelimiter();
    const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'];
    const splits: { targetCell: string; value: string }[] = [];

    selectedRange.forEach((cid) => {
      const cell = data[cid];
      if (cell && cell.value) {
        const tokens = String(cell.value).split(delim);
        const match = cid.match(/([A-Z]+)(\d+)/);
        if (match) {
          const colStr = match[1];
          const rowNum = match[2];
          const startColIdx = cols.indexOf(colStr);

          tokens.forEach((tok, idx) => {
            const nextCol = cols[startColIdx + idx];
            if (nextCol) {
              splits.push({
                targetCell: `${nextCol}${rowNum}`,
                value: tok.trim(),
              });
            }
          });
        }
      }
    });

    onApplySplit(splits);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95">
        <div className="bg-[#107c41] text-white px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SplitSquareVertical className="w-4 h-4" />
            <h3 className="font-bold text-xs">معالج تحويل النص إلى أعمدة (Text to Columns)</h3>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded transition">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-4 space-y-4 text-xs">
          <div>
            <span className="font-bold text-gray-800 block mb-2">اختر الفاصل المستخدم لتجزئة البيانات:</span>
            <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="delimiter"
                  checked={delimiterType === 'comma'}
                  onChange={() => setDelimiterType('comma')}
                  className="accent-[#107c41]"
                />
                <span>فاصلة (Comma ,)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="delimiter"
                  checked={delimiterType === 'space'}
                  onChange={() => setDelimiterType('space')}
                  className="accent-[#107c41]"
                />
                <span>مسافة (Space)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="delimiter"
                  checked={delimiterType === 'semicolon'}
                  onChange={() => setDelimiterType('semicolon')}
                  className="accent-[#107c41]"
                />
                <span>فاصلة منقوطة (Semicolon ;)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="delimiter"
                  checked={delimiterType === 'tab'}
                  onChange={() => setDelimiterType('tab')}
                  className="accent-[#107c41]"
                />
                <span>علامة جدولة (Tab)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer col-span-2 mt-1">
                <input
                  type="radio"
                  name="delimiter"
                  checked={delimiterType === 'custom'}
                  onChange={() => setDelimiterType('custom')}
                  className="accent-[#107c41]"
                />
                <span>مخصص:</span>
                <input
                  type="text"
                  value={customDelimiter}
                  maxLength={3}
                  onChange={(e) => {
                    setCustomDelimiter(e.target.value);
                    setDelimiterType('custom');
                  }}
                  className="w-16 border border-gray-300 rounded px-2 py-0.5 text-center font-mono"
                />
              </label>
            </div>
          </div>

          <div>
            <span className="font-bold text-gray-700 block mb-1">معاينة التجزئة للخلية الأولى ({sampleCellId}):</span>
            <div className="bg-slate-100 border border-slate-300 rounded p-2 text-gray-800 text-[11px] mb-2 font-mono truncate" dir="ltr">
              {sampleValue}
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {previewTokens.map((tok, i) => (
                <div key={i} className="flex-1 min-w-[70px] bg-emerald-50 border border-emerald-300 rounded p-1.5 text-center">
                  <div className="text-[9px] text-emerald-800 font-bold mb-0.5">عمود {i + 1}</div>
                  <div className="font-semibold text-gray-900 truncate">{tok}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 border-t border-gray-200 px-4 py-2.5 flex items-center justify-between text-xs">
          <button onClick={onClose} className="px-3 py-1.5 border border-gray-300 rounded font-semibold text-gray-600 hover:bg-gray-100">
            إلغاء
          </button>
          <button
            onClick={handleExecute}
            className="px-4 py-1.5 bg-[#107c41] text-white rounded font-bold hover:bg-[#0e6b37] transition"
          >
            تطبيق التقسيم
          </button>
        </div>
      </div>
    </div>
  );
};
