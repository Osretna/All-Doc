import React, { useState } from 'react';
import { X, Target } from 'lucide-react';
import { SheetData } from '../../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedCell: string;
  data: SheetData;
  onApplyGoalSeek: (targetCell: string, calculatedValue: number) => void;
}

export const GoalSeekModal: React.FC<Props> = ({
  isOpen,
  onClose,
  selectedCell,
  data,
  onApplyGoalSeek,
}) => {
  const [setCell, setSetCell] = useState(selectedCell || 'C9');
  const [targetValue, setTargetValue] = useState('7000');
  const [changingCell, setChangingCell] = useState('C4');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCalculate = () => {
    const target = parseFloat(targetValue);
    if (isNaN(target)) {
      setStatusMsg('يرجى إدخال قيمة رقمية صحيحة.');
      return;
    }

    // Current cell value
    const currentVal = parseFloat(String(data[setCell]?.value || '0').replace(/[^0-9.-]+/g, '')) || 0;
    const changingVal = parseFloat(String(data[changingCell]?.value || '0').replace(/[^0-9.-]+/g, '')) || 0;

    const diff = target - currentVal;
    const requiredChangingVal = changingVal + diff;

    setStatusMsg(`تم العثور على حل! لتصل الخلية ${setCell} إلى ${target}، يجب أن تصبح الخلية ${changingCell} بقيمة ${requiredChangingVal}`);

    setTimeout(() => {
      onApplyGoalSeek(changingCell, requiredChangingVal);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95">
        <div className="bg-[#107c41] text-white px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            <h3 className="font-bold text-xs">استهداف القيمة (Goal Seek / What-If)</h3>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded transition">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-4 space-y-3 text-xs">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">تعيين الخلية (Set cell):</label>
            <input
              type="text"
              value={setCell}
              onChange={(e) => setSetCell(e.target.value.toUpperCase())}
              className="w-full border border-gray-300 rounded px-2.5 py-1.5 font-mono text-center outline-none focus:border-[#107c41]"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">إلى القيمة (To value):</label>
            <input
              type="number"
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
              className="w-full border border-gray-300 rounded px-2.5 py-1.5 font-mono text-center outline-none focus:border-[#107c41]"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">بتغيير الخلية (By changing cell):</label>
            <input
              type="text"
              value={changingCell}
              onChange={(e) => setChangingCell(e.target.value.toUpperCase())}
              className="w-full border border-gray-300 rounded px-2.5 py-1.5 font-mono text-center outline-none focus:border-[#107c41]"
            />
          </div>

          {statusMsg && (
            <div className="bg-emerald-50 border border-emerald-300 rounded p-2 text-emerald-900 text-[11px] font-medium animate-in fade-in">
              {statusMsg}
            </div>
          )}
        </div>

        <div className="bg-gray-50 border-t border-gray-200 px-4 py-2.5 flex items-center justify-between text-xs">
          <button onClick={onClose} className="px-3 py-1.5 border border-gray-300 rounded font-semibold text-gray-600 hover:bg-gray-100">
            إلغاء
          </button>
          <button
            onClick={handleCalculate}
            className="px-4 py-1.5 bg-[#107c41] text-white rounded font-bold hover:bg-[#0e6b37] transition"
          >
            موافق (Calculate)
          </button>
        </div>
      </div>
    </div>
  );
};
