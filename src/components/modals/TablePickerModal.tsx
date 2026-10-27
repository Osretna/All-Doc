import React, { useState } from 'react';
import { Table, Plus, X } from 'lucide-react';

interface TablePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertTable: (rows: number, cols: number) => void;
  onInsertQuickTable?: (type: 'calendar' | 'matrix' | 'comparison') => void;
}

export const TablePickerModal: React.FC<TablePickerModalProps> = ({
  isOpen,
  onClose,
  onInsertTable,
  onInsertQuickTable,
}) => {
  const [hoveredRow, setHoveredRow] = useState<number>(0);
  const [hoveredCol, setHoveredCol] = useState<number>(0);

  if (!isOpen) return null;

  const maxRows = 8;
  const maxCols = 10;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4">
      <div 
        className="w-full max-w-sm bg-white rounded-lg shadow-2xl border border-slate-300 overflow-hidden text-right"
        dir="rtl"
      >
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#2b579a] text-white">
          <div className="flex items-center gap-2">
            <Table className="w-4 h-4 text-white" />
            <span className="font-semibold text-sm">إدراج جدول (Insert Table)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded text-white/90 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <div className="text-center font-medium text-xs text-slate-700 bg-slate-50 py-1.5 rounded border border-slate-200">
            {hoveredRow > 0 && hoveredCol > 0 ? (
              <span className="text-[#2b579a] font-bold">
                جدول {hoveredCol} × {hoveredRow}
              </span>
            ) : (
              <span>مرر الفأرة فوق الشبكة لتحديد الأبعاد</span>
            )}
          </div>

          {/* Interactive Grid */}
          <div 
            className="grid gap-1 p-2 bg-slate-100/70 border border-slate-200 rounded justify-center"
            style={{ gridTemplateColumns: `repeat(${maxCols}, minmax(0, 1fr))` }}
            onMouseLeave={() => {
              setHoveredRow(0);
              setHoveredCol(0);
            }}
          >
            {Array.from({ length: maxRows }).map((_, rIdx) =>
              Array.from({ length: maxCols }).map((_, cIdx) => {
                const r = rIdx + 1;
                const c = cIdx + 1;
                const isSelected = r <= hoveredRow && c <= hoveredCol;
                return (
                  <button
                    key={`${r}-${c}`}
                    onMouseEnter={() => {
                      setHoveredRow(r);
                      setHoveredCol(c);
                    }}
                    onClick={() => {
                      onInsertTable(r, c);
                      onClose();
                    }}
                    className={`w-5 h-5 border transition-colors rounded-[2px] ${
                      isSelected
                        ? 'bg-blue-600 border-blue-700'
                        : 'bg-white border-slate-300 hover:border-blue-400'
                    }`}
                    title={`${c} × ${r}`}
                  />
                );
              })
            )}
          </div>

          {/* Quick options */}
          <div className="pt-2 border-t border-slate-200 space-y-1 text-xs">
            <button
              onClick={() => {
                onInsertTable(3, 4);
                onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-1.5 text-slate-700 hover:bg-slate-100 rounded text-right transition-colors"
            >
              <span>إدراج جدول قياسي سريع (4 أعمدة × 3 صفوف)</span>
              <Plus className="w-3.5 h-3.5 text-slate-400" />
            </button>
            <button
              onClick={() => {
                if (onInsertQuickTable) onInsertQuickTable('comparison');
                onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-1.5 text-slate-700 hover:bg-slate-100 rounded text-right transition-colors"
            >
              <span>جدول سريع: جدول مقارنة وبيانات</span>
              <span className="text-[10px] text-slate-400">قالب</span>
            </button>
            <button
              onClick={() => {
                if (onInsertQuickTable) onInsertQuickTable('calendar');
                onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-1.5 text-slate-700 hover:bg-slate-100 rounded text-right transition-colors"
            >
              <span>جدول سريع: تقويم شهري جاهز</span>
              <span className="text-[10px] text-slate-400">قالب</span>
            </button>
          </div>
        </div>

        <div className="flex justify-end p-3 bg-slate-50 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-white border border-slate-300 text-xs text-slate-700 rounded hover:bg-slate-100 transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
