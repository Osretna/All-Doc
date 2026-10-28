import React, { useState } from 'react';
import { X, Target, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  activeCell: string;
  onRunGoalSeek: (targetCell: string, targetValue: number, changingCell: string) => void;
}

export const GoalSeekModal: React.FC<Props> = ({
  isOpen,
  onClose,
  activeCell,
  onRunGoalSeek,
}) => {
  const [setCell, setSetCell] = useState(activeCell || 'C10');
  const [toValue, setToValue] = useState('10000');
  const [byChangingCell, setByChangingCell] = useState('B2');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(toValue);
    if (isNaN(val)) {
      alert('يرجى إدخال قيمة عددية مستهدفة صالحة!');
      return;
    }
    onRunGoalSeek(setCell.trim().toUpperCase(), val, byChangingCell.trim().toUpperCase());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-300 w-full max-w-sm flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        <div className="flex items-center justify-between px-4 py-3 bg-[#107c41] text-white">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            <h3 className="font-bold text-sm">استرجاع القيمة المستهدفة (Goal Seek)</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded cursor-pointer transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3 text-xs text-gray-700">
          <p className="text-gray-500 text-[11px] leading-relaxed">
            البحث عن المدخلات المناسبة للوصول إلى النتيجة المرجوة في خلية المعادلة:
          </p>

          <div>
            <label className="block font-medium mb-1">تعيين الخلية (Set cell):</label>
            <input
              type="text"
              value={setCell}
              onChange={e => setSetCell(e.target.value)}
              className="w-full border border-gray-300 rounded px-2.5 py-1.5 font-mono text-xs uppercase outline-none focus:border-[#107c41]"
              placeholder="مثال: C10"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">إلى القيمة المستهدفة (To value):</label>
            <input
              type="number"
              step="any"
              value={toValue}
              onChange={e => setToValue(e.target.value)}
              className="w-full border border-gray-300 rounded px-2.5 py-1.5 font-mono text-xs outline-none focus:border-[#107c41]"
              placeholder="مثال: 50000"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">بتغيير الخلية (By changing cell):</label>
            <input
              type="text"
              value={byChangingCell}
              onChange={e => setByChangingCell(e.target.value)}
              className="w-full border border-gray-300 rounded px-2.5 py-1.5 font-mono text-xs uppercase outline-none focus:border-[#107c41]"
              placeholder="مثال: B2"
              required
            />
          </div>

          <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded flex items-center gap-2 text-[11px] text-emerald-800">
            <Sparkles className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>سيقوم المحرك بحساب القيمة الدقيقة تلقائياً وبأسرع استجابة.</span>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-medium cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-1.5 rounded bg-[#107c41] hover:bg-[#0e6b37] text-white font-bold text-xs cursor-pointer shadow-xs"
            >
              موافق (حل)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
