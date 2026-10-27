import React, { useState } from 'react';
import { Copy, Trash2, X, Check } from 'lucide-react';

interface RemoveDuplicatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  columns: string[];
  onRemoveDuplicates: (selectedCols: string[]) => void;
}

export const RemoveDuplicatesModal: React.FC<RemoveDuplicatesModalProps> = ({
  isOpen,
  onClose,
  columns,
  onRemoveDuplicates,
}) => {
  const [selectedCols, setSelectedCols] = useState<string[]>(columns.slice(0, 4));

  if (!isOpen) return null;

  const toggleCol = (col: string) => {
    if (selectedCols.includes(col)) {
      setSelectedCols(selectedCols.filter(c => c !== col));
    } else {
      setSelectedCols([...selectedCols, col]);
    }
  };

  const handleApply = () => {
    onRemoveDuplicates(selectedCols);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4" dir="rtl">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl border border-gray-300 overflow-hidden text-right">
        <div className="flex items-center justify-between px-4 py-3 bg-[#107c41] text-white">
          <div className="flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-white" />
            <span className="font-bold text-sm">إزالة التكرارات (Remove Duplicates)</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded text-white/90">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-3 text-xs">
          <p className="text-gray-600 leading-relaxed">
            لحذف القيم المكررة، حدد عموداً واحداً أو أكثر يحتوي على التكرارات:
          </p>

          <div className="flex gap-2 pb-1">
            <button
              type="button"
              onClick={() => setSelectedCols(columns)}
              className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700"
            >
              تحديد الكل
            </button>
            <button
              type="button"
              onClick={() => setSelectedCols([])}
              className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700"
            >
              إلغاء التحديد
            </button>
          </div>

          <div className="border border-gray-300 rounded max-h-48 overflow-y-auto p-2 bg-gray-50/50 space-y-1.5">
            {columns.map((col) => (
              <label key={col} className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded">
                <input
                  type="checkbox"
                  checked={selectedCols.includes(col)}
                  onChange={() => toggleCol(col)}
                  className="rounded border-gray-300 text-[#107c41] focus:ring-[#107c41]"
                />
                <span className="font-mono font-medium text-gray-800">عمود {col}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 p-3 bg-gray-50 border-t border-gray-200 text-xs">
          <button
            onClick={handleApply}
            className="px-5 py-1.5 bg-[#107c41] hover:bg-[#0c6233] text-white rounded font-bold shadow-sm transition"
          >
            موافق
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
          >
            إلغاء الأمر
          </button>
        </div>
      </div>
    </div>
  );
};
