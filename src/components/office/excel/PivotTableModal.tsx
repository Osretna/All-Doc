import React, { useState, useMemo } from 'react';
import { 
  TableProperties, 
  BarChart3, 
  Layers, 
  X, 
  Plus, 
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { SheetData, SheetCell } from '../../../types';

interface PivotTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: SheetData;
  onInsertPivot: (pivotData: {
    sheetName: string;
    cells: SheetData;
    targetLocation: 'newSheet' | 'currentSheet';
  }) => void;
}

export const PivotTableModal: React.FC<PivotTableModalProps> = ({
  isOpen,
  onClose,
  data,
  onInsertPivot,
}) => {
  // Extract all available columns and their row data from the current sheet
  const { detectedColumns, headerRow, dataRows } = useMemo(() => {
    // Look for a row that contains header labels (usually rows 1 to 5)
    let bestHeaderRow = 1;
    let maxColsFound = 0;
    const colLabels: Record<string, string> = {};

    const COLS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'];

    for (let r = 1; r <= 8; r++) {
      let count = 0;
      COLS.forEach((c) => {
        const val = data[`${c}${r}`]?.value;
        if (val && String(val).trim()) count++;
      });
      if (count > maxColsFound) {
        maxColsFound = count;
        bestHeaderRow = r;
      }
    }

    COLS.forEach((c) => {
      const val = data[`${c}${bestHeaderRow}`]?.value;
      if (val && String(val).trim()) {
        colLabels[c] = String(val).trim();
      }
    });

    // Default fallback columns if sheet was completely blank
    if (Object.keys(colLabels).length === 0) {
      colLabels['A'] = 'القسم / الفرع';
      colLabels['B'] = 'اسم الموظف / العميل';
      colLabels['C'] = 'المبلغ / المبيعات';
      colLabels['D'] = 'الشهر / الربع سنوي';
    }

    // Collect data rows
    const rows: Record<string, any>[] = [];
    for (let r = bestHeaderRow + 1; r <= bestHeaderRow + 200; r++) {
      let hasData = false;
      const rowItem: Record<string, any> = {};
      Object.keys(colLabels).forEach((col) => {
        const val = data[`${col}${r}`]?.value;
        if (val !== undefined && val !== null && String(val).trim() !== '') {
          hasData = true;
          rowItem[col] = String(val).trim();
        } else {
          rowItem[col] = '';
        }
      });
      if (hasData) {
        rows.push(rowItem);
      }
    }

    return {
      detectedColumns: colLabels,
      headerRow: bestHeaderRow,
      dataRows: rows,
    };
  }, [data]);

  const colEntries = Object.entries(detectedColumns);
  const [rowCol, setRowCol] = useState<string>(colEntries[0]?.[0] || 'A');
  const [valCol, setValCol] = useState<string>(colEntries[2]?.[0] || colEntries[1]?.[0] || 'B');
  const [aggregation, setAggregation] = useState<'SUM' | 'COUNT' | 'AVERAGE' | 'MAX' | 'MIN'>('SUM');
  const [targetLocation, setTargetLocation] = useState<'newSheet' | 'currentSheet'>('newSheet');

  if (!isOpen) return null;

  const handleCreate = () => {
    const rowFieldLabel = detectedColumns[rowCol] || 'الصف';
    const valFieldLabel = detectedColumns[valCol] || 'القيمة';

    // Group rows by rowCol
    const groups: Record<string, number[]> = {};

    dataRows.forEach((r) => {
      const groupKey = r[rowCol] || '(فارغ)';
      const rawVal = r[valCol];
      const numVal = parseFloat(String(rawVal).replace(/[^0-9.-]+/g, ''));
      const val = isNaN(numVal) ? 0 : numVal;

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(val);
    });

    // If dataRows was empty (blank sheet), provide meaningful default presentation
    if (Object.keys(groups).length === 0) {
      groups['القطاع الشمالي'] = [25000, 18500];
      groups['القطاع الأوسط'] = [42000, 31000];
      groups['القطاع الشرقي'] = [36500, 29000];
      groups['القطاع الغربي'] = [28000, 22500];
    }

    // Build Excel Pivot Table formatted cells
    const pivotCells: SheetData = {};

    // Title / Header
    pivotCells['A2'] = {
      value: `تقرير الجدول المحوري (PivotTable) - ملخص ${valFieldLabel} حسب ${rowFieldLabel}`,
      bold: true,
      color: '#107c41',
      fontSize: 14,
    };

    // Table Headers
    pivotCells['A4'] = {
      value: `تسميات الصفوف (${rowFieldLabel})`,
      bold: true,
      bg: '#107c41',
      color: '#ffffff',
      align: 'right',
      border: 'all',
    };
    pivotCells['B4'] = {
      value: `${aggregation} of ${valFieldLabel}`,
      bold: true,
      bg: '#107c41',
      color: '#ffffff',
      align: 'left',
      border: 'all',
    };

    let curRow = 5;
    let grandTotal = 0;
    let grandCount = 0;
    const allNums: number[] = [];

    Object.entries(groups).forEach(([groupName, vals]) => {
      let aggregatedVal = 0;
      if (aggregation === 'SUM') {
        aggregatedVal = vals.reduce((a, b) => a + b, 0);
        grandTotal += aggregatedVal;
      } else if (aggregation === 'COUNT') {
        aggregatedVal = vals.length;
        grandTotal += aggregatedVal;
      } else if (aggregation === 'AVERAGE') {
        aggregatedVal = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
        grandTotal += vals.reduce((a, b) => a + b, 0);
        grandCount += vals.length;
      } else if (aggregation === 'MAX') {
        aggregatedVal = vals.length > 0 ? Math.max(...vals) : 0;
        allNums.push(...vals);
      } else if (aggregation === 'MIN') {
        aggregatedVal = vals.length > 0 ? Math.min(...vals) : 0;
        allNums.push(...vals);
      }

      const isZebra = curRow % 2 === 1;
      pivotCells[`A${curRow}`] = {
        value: groupName,
        bg: isZebra ? '#f8fafc' : '#ffffff',
        border: 'all',
        align: 'right',
      };
      pivotCells[`B${curRow}`] = {
        value: aggregation === 'AVERAGE' ? aggregatedVal.toFixed(2) : aggregatedVal.toLocaleString('en-US'),
        bg: isZebra ? '#f8fafc' : '#ffffff',
        border: 'all',
        align: 'left',
        bold: true,
      };
      curRow++;
    });

    // Grand Total Row
    let finalGrandVal = '0';
    if (aggregation === 'SUM') finalGrandVal = grandTotal.toLocaleString('en-US');
    else if (aggregation === 'COUNT') finalGrandVal = grandTotal.toString();
    else if (aggregation === 'AVERAGE') finalGrandVal = grandCount > 0 ? (grandTotal / grandCount).toFixed(2) : '0';
    else if (aggregation === 'MAX') finalGrandVal = allNums.length ? Math.max(...allNums).toLocaleString('en-US') : '0';
    else if (aggregation === 'MIN') finalGrandVal = allNums.length ? Math.min(...allNums).toLocaleString('en-US') : '0';

    pivotCells[`A${curRow}`] = {
      value: 'الإجمالي الكلي (Grand Total)',
      bold: true,
      bg: '#e2e8f0',
      color: '#0f172a',
      border: 'double-bottom',
      align: 'right',
    };
    pivotCells[`B${curRow}`] = {
      value: finalGrandVal,
      bold: true,
      bg: '#e2e8f0',
      color: '#0f172a',
      border: 'double-bottom',
      align: 'left',
    };

    onInsertPivot({
      sheetName: `PivotTable_${Date.now().toString().slice(-4)}`,
      cells: pivotCells,
      targetLocation,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none" dir="rtl">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-gray-300 overflow-hidden text-right font-sans">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#107c41] text-white">
          <div className="flex items-center gap-2">
            <TableProperties className="w-5 h-5 text-white" />
            <span className="font-bold text-sm">إنشاء جدول محوري (Create PivotTable)</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded text-white/90">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <div className="p-5 space-y-4 text-xs">
          <div>
            <label className="block mb-1.5 font-bold text-gray-700">نطاق الجدول / البيانات المصدرية:</label>
            <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded font-mono text-xs text-gray-700 flex items-center justify-between">
              <span>{headerRow > 0 ? `الورقة الحالية: الصف ${headerRow} وحتى ${headerRow + dataRows.length}` : 'النطاق التلقائي المكتشف'}</span>
              <span className="text-emerald-700 font-bold">{dataRows.length} صف بيانات</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block mb-1.5 font-bold text-gray-700">حقل الصفوف (Row Field):</label>
              <select 
                value={rowCol} 
                onChange={(e) => setRowCol(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded outline-none focus:border-[#107c41] bg-white font-medium"
              >
                {colEntries.map(([col, label]) => (
                  <option key={col} value={col}>
                    العمود {col}: {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1.5 font-bold text-gray-700">حقل القيم (Values Field):</label>
              <select 
                value={valCol} 
                onChange={(e) => setValCol(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded outline-none focus:border-[#107c41] bg-white font-medium"
              >
                {colEntries.map(([col, label]) => (
                  <option key={col} value={col}>
                    العمود {col}: {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1.5 font-bold text-gray-700">دالة التلخيص والتجميع:</label>
              <select 
                value={aggregation} 
                onChange={(e) => setAggregation(e.target.value as any)}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded outline-none font-bold text-emerald-800 bg-emerald-50"
              >
                <option value="SUM">مجموع القيم (SUM)</option>
                <option value="COUNT">عدد السجلات (COUNT)</option>
                <option value="AVERAGE">المتوسط الحسابي (AVERAGE)</option>
                <option value="MAX">القيمة الكبرى (MAX)</option>
                <option value="MIN">القيمة الصغرى (MIN)</option>
              </select>
            </div>

            <div>
              <label className="block mb-1.5 font-bold text-gray-700">موضع وضع التقرير المحوري:</label>
              <div className="flex flex-col gap-1.5 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="pivotLoc"
                    checked={targetLocation === 'newSheet'}
                    onChange={() => setTargetLocation('newSheet')}
                    className="accent-[#107c41]"
                  />
                  <span>ورقة عمل جديدة (New Sheet)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="pivotLoc"
                    checked={targetLocation === 'currentSheet'}
                    onChange={() => setTargetLocation('currentSheet')}
                    className="accent-[#107c41]"
                  />
                  <span>في نفس ورقة العمل (Existing Sheet)</span>
                </label>
              </div>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold">تحليل محوري احترافي (Pivot Analysis):</div>
              <p className="text-[11px] text-emerald-800 mt-0.5">
                سيقوم Excel بحساب إجمالي <strong>{detectedColumns[valCol] || valCol}</strong> وتجميعه حسب <strong>{detectedColumns[rowCol] || rowCol}</strong> مع حساب الإجمالي الكلي النهائي تلقائياً.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-3 bg-gray-50 border-t border-gray-200 text-xs">
          <button
            onClick={handleCreate}
            className="px-5 py-2 bg-[#107c41] hover:bg-[#0c6233] text-white rounded font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>موافق (إنشاء PivotTable)</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-100 cursor-pointer"
          >
            إلغاء الأمر
          </button>
        </div>
      </div>
    </div>
  );
};
