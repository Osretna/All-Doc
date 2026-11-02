import React, { useState } from 'react';
import { X, CopyX, CheckSquare, Square } from 'lucide-react';
import { COLUMN_LETTERS } from '../../../utils/formulaEngine';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  minColIdx: number;
  maxColIdx: number;
  onRemoveDuplicates: (selectedCols: string[]) => void;
}

export const RemoveDuplicatesModal: React.FC<Props> = ({
  isOpen,
  onClose,
  minColIdx,
  maxColIdx,
  onRemoveDuplicates,
}) => {
  const cols: string[] = [];
  for (let c = minColIdx; c <= maxColIdx; c++) {
    cols.push(COLUMN_LETTERS[c] || `عمود ${c + 1}`);
  }

  const [selected, setSelected] = useState<string[]>(cols);

  if (!isOpen) return null;

  const toggleCol = (c: string) => {
    if (selected.includes(c)) {
      setSelected(selected.filter(x => x !== c));
    } else {
      setSelected([...selected, c]);
    }
  };

  const handleSelectAll = () => setSelected(cols);
  const handleUnselectAll = () => setSelected([]);

  const handleExecute = () => {
    if (selected.length === 0) {
      alert('يرجى اختيار عمود واحد على الأقل للمقارنة!');
      return;
    }
    onRemoveDuplicates(selected);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-300 w-full max-w-sm flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        <div className="flex items-center justify-between px-4 py-3 bg-[#107c41] text-white">
          <div className="flex items-center gap-2">
            <CopyX className="w-5 h-5" />
            <h3 className="font-bold text-sm">إزالة التكرارات (Remove Duplicates)</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded cursor-pointer transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3 text-xs text-gray-700">
          <p className="leading-relaxed">
            لحذف القيم المكررة، حدد عموداً واحداً أو أكثر يحتوي على البيانات التي قد تكون مكررة:
          </p>

          <div className="flex items-center justify-between pt-1 pb-1">
            <button
              onClick={handleSelectAll}
              className="text-emerald-700 hover:text-emerald-800 font-bold cursor-pointer"
            >
              تحديد الكل
            </button>
            <button
              onClick={handleUnselectAll}
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              إلغاء تحديد الكل
            </button>
          </div>

          <div className="border border-gray-200 rounded p-2 max-h-40 overflow-y-auto space-y-1 bg-gray-50">
            {cols.map(c => {
              const isChecked = selected.includes(c);
              return (
                <div
                  key={c}
                  onClick={() => toggleCol(c)}
                  className="flex items-center gap-2 p-1.5 hover:bg-white rounded cursor-pointer transition"
                >
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-[#107c41]" />
                  ) : (
                    <Square className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="font-mono font-bold">العمود {c}</span>
                </div>
              );
            })}
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
            onClick={handleExecute}
            className="px-5 py-1.5 rounded bg-[#107c41] hover:bg-[#0e6b37] text-white font-bold text-xs cursor-pointer shadow-xs"
          >
            موافق (حذف المكرر)
          </button>
        </div>
      </div>
    </div>
  );
};
