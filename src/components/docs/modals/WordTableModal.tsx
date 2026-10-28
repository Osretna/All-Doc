import React, { useState } from 'react';
import { X, Table, Grid } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onInsertTable: (rows: number, cols: number) => void;
}

export const WordTableModal: React.FC<Props> = ({ isOpen, onClose, onInsertTable }) => {
  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(4);
  const [hoverRow, setHoverRow] = useState(0);
  const [hoverCol, setHoverCol] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onInsertTable(Math.max(1, rows), Math.max(1, cols));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-300 w-full max-w-sm flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        <div className="flex items-center justify-between px-4 py-3 bg-[#004578] text-white">
          <div className="flex items-center gap-2">
            <Table className="w-5 h-5" />
            <h3 className="font-bold text-sm">إدراج جدول (Insert Table)</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded cursor-pointer transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4 text-xs text-gray-700">
          {/* Visual Grid Picker */}
          <div>
            <div className="text-[11px] font-bold text-gray-500 mb-2 flex justify-between">
              <span>تحديد حجم الجدول بالماوس:</span>
              <span className="font-mono text-[#004578] font-bold">
                {hoverRow > 0 ? `${hoverRow} × ${hoverCol}` : `${rows} صفوف × ${cols} أعمدة`}
              </span>
            </div>
            <div className="p-2 bg-gray-50 rounded border border-gray-200 inline-block">
              <div className="grid grid-cols-8 gap-1">
                {Array.from({ length: 8 }).map((_, rIdx) =>
                  Array.from({ length: 8 }).map((_, cIdx) => {
                    const r = rIdx + 1;
                    const c = cIdx + 1;
                    const active = (hoverRow > 0 ? r <= hoverRow && c <= hoverCol : r <= rows && c <= cols);
                    return (
                      <div
                        key={`${r}-${c}`}
                        onMouseEnter={() => { setHoverRow(r); setHoverCol(c); }}
                        onMouseLeave={() => { setHoverRow(0); setHoverCol(0); }}
                        onClick={() => { setRows(r); setCols(c); onInsertTable(r, c); onClose(); }}
                        className={`w-4 h-4 border rounded-xs cursor-pointer transition ${
                          active ? 'bg-blue-600 border-blue-700' : 'bg-white border-gray-300 hover:border-blue-400'
                        }`}
                      />
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Manual Input */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block font-medium mb-1">عدد الأعمدة (Columns):</label>
              <input
                type="number"
                min="1"
                max="20"
                value={cols}
                onChange={e => setCols(parseInt(e.target.value, 10) || 1)}
                className="w-full border border-gray-300 rounded px-2.5 py-1 text-xs outline-none focus:border-[#004578]"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">عدد الصفوف (Rows):</label>
              <input
                type="number"
                min="1"
                max="50"
                value={rows}
                onChange={e => setRows(parseInt(e.target.value, 10) || 1)}
                className="w-full border border-gray-300 rounded px-2.5 py-1 text-xs outline-none focus:border-[#004578]"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-medium cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-1.5 rounded bg-[#004578] hover:bg-[#00345b] text-white font-bold text-xs cursor-pointer shadow-xs"
            >
              إدراج الجدول
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
