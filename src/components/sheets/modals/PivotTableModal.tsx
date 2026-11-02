import React, { useState } from 'react';
import { X, Table, Calculator } from 'lucide-react';
import { SheetData } from '../../../types/office';
import { expandRange, getCellValue, parseCellCoordinate, colIndexToLetter } from '../../../utils/formulaEngine';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: SheetData;
  sourceRange: string;
  onCreatePivot: (summaryData: { rowLabel: string; value: number }[], metric: string) => void;
}

export const PivotTableModal: React.FC<Props> = ({
  isOpen,
  onClose,
  data,
  sourceRange,
  onCreatePivot,
}) => {
  const [rowColIndex, setRowColIndex] = useState<number>(0);
  const [valColIndex, setValColIndex] = useState<number>(1);
  const [aggFn, setAggFn] = useState<'SUM' | 'COUNT' | 'AVERAGE'>('SUM');

  if (!isOpen) return null;

  const cells = expandRange(sourceRange || 'A1:B10');
  let minCol = 999;
  let maxCol = -1;
  let minRow = 999;
  let maxRow = -1;

  cells.forEach((c: string) => {
    const coord = parseCellCoordinate(c);
    if (coord.colIdx < minCol) minCol = coord.colIdx;
    if (coord.colIdx > maxCol) maxCol = coord.colIdx;
    if (coord.row < minRow) minRow = coord.row;
    if (coord.row > maxRow) maxRow = coord.row;
  });

  const columns: { idx: number; name: string }[] = [];
  for (let c = minCol; c <= maxCol; c++) {
    const headerCell = `${colIndexToLetter(c)}${minRow}`;
    const val = getCellValue(headerCell, data);
    columns.push({ idx: c, name: val ? String(val) : `العمود ${colIndexToLetter(c)}` });
  }

  const handleGenerate = () => {
    const groups: { [key: string]: number[] } = {};

    for (let r = minRow + 1; r <= maxRow; r++) {
      const rowCell = `${colIndexToLetter(rowColIndex)}${r}`;
      const valCell = `${colIndexToLetter(valColIndex)}${r}`;

      const rowLabel = String(getCellValue(rowCell, data) || 'غير محدد').trim();
      const numVal = parseFloat(String(getCellValue(valCell, data)).replace(/[^0-9.-]+/g, '')) || 0;

      if (!groups[rowLabel]) groups[rowLabel] = [];
      groups[rowLabel].push(numVal);
    }

    const summary = Object.entries(groups).map(([label, nums]) => {
      let finalVal = 0;
      if (aggFn === 'SUM') finalVal = nums.reduce((a, b) => a + b, 0);
      else if (aggFn === 'COUNT') finalVal = nums.length;
      else if (aggFn === 'AVERAGE') finalVal = nums.reduce((a, b) => a + b, 0) / (nums.length || 1);

      return { rowLabel: label, value: Math.round(finalVal * 100) / 100 };
    });

    onCreatePivot(summary, aggFn);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-300 w-full max-w-md flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        <div className="flex items-center justify-between px-4 py-3 bg-[#107c41] text-white">
          <div className="flex items-center gap-2">
            <Table className="w-5 h-5" />
            <h3 className="font-bold text-sm">إنشاء جدول محوري (PivotTable)</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded cursor-pointer transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3 text-xs text-gray-700">
          <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded text-emerald-800">
            نطاق البيانات المصدرية: <strong className="font-mono">{sourceRange || 'المحدد حالياً'}</strong>
          </div>

          <div>
            <label className="block font-bold mb-1">حقل الصفوف (Rows Category):</label>
            <select
              value={rowColIndex}
              onChange={e => setRowColIndex(parseInt(e.target.value, 10))}
              className="w-full border border-gray-300 rounded px-2.5 py-1.5 bg-white text-xs outline-none focus:border-[#107c41]"
            >
              {columns.map(col => (
                <option key={col.idx} value={col.idx}>{col.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold mb-1">حقل القيم (Values Metric):</label>
            <select
              value={valColIndex}
              onChange={e => setValColIndex(parseInt(e.target.value, 10))}
              className="w-full border border-gray-300 rounded px-2.5 py-1.5 bg-white text-xs outline-none focus:border-[#107c41]"
            >
              {columns.map(col => (
                <option key={col.idx} value={col.idx}>{col.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold mb-1">دالة التجميع والتخليص:</label>
            <div className="flex items-center gap-4">
              {[
                { id: 'SUM', label: 'مجموع (SUM)' },
                { id: 'COUNT', label: 'عدد (COUNT)' },
                { id: 'AVERAGE', label: 'متوسط (AVERAGE)' },
              ].map(item => (
                <label key={item.id} className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="agg"
                    checked={aggFn === item.id}
                    onChange={() => setAggFn(item.id as any)}
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
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
            onClick={handleGenerate}
            className="px-5 py-1.5 rounded bg-[#107c41] hover:bg-[#0e6b37] text-white font-bold text-xs cursor-pointer shadow-xs"
          >
            توليد الجدول المحوري
          </button>
        </div>
      </div>
    </div>
  );
};
