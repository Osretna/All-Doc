import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Upload, Printer, Save, Plus, Trash2, FileSpreadsheet,
  BarChart3, Sigma, Calculator, DollarSign, Percent, Bold, Filter,
  ArrowUpDown, Search, Check, FileDown, Layers
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveFileDirectlyToDevice } from '../utils/fileSaver';
import { printDocumentContent } from '../utils/printHelper';

interface ExcelAppProps {
  onNotify: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

interface SheetData {
  name: string;
  grid: (string | number)[][];
}

const DEFAULT_ROWS = 25;
const DEFAULT_COLS = 12;

const getColName = (colIndex: number): string => {
  let name = '';
  let n = colIndex;
  while (n >= 0) {
    name = String.fromCharCode((n % 26) + 65) + name;
    n = Math.floor(n / 26) - 1;
  }
  return name;
};

export const ExcelApp: React.FC<ExcelAppProps> = ({ onNotify }) => {
  const [docTitle, setDocTitle] = useState<string>('جدول_البيانات');
  const [originalExtension, setOriginalExtension] = useState<string>('xlsx');
  const [sheets, setSheets] = useState<SheetData[]>([]);
  const [activeSheetIndex, setActiveSheetIndex] = useState<number>(0);
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number }>({ r: 0, c: 0 });
  const [formulaInput, setFormulaInput] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showChart, setShowChart] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize with professional default business budget data
  useEffect(() => {
    const initialGrid: (string | number)[][] = Array(DEFAULT_ROWS)
      .fill(null)
      .map(() => Array(DEFAULT_COLS).fill(''));

    // Populate Sample Data
    const sampleHeaders = ['القسم / البند', 'الربع الأول', 'الربع الثاني', 'الربع الثالث', 'الربع الرابع', 'المجموع السنوي', 'الهدف', 'نسبة الإنجاز', 'الحالة'];
    sampleHeaders.forEach((h, c) => {
      initialGrid[0][c] = h;
    });

    const sampleRows: (string | number)[][] = [
      ['تطوير البرمجيات', 120000, 145000, 160000, 180000, 605000, 550000, '110%', 'مكتمل'],
      ['التسويق الرقمي', 45000, 60000, 75000, 90000, 270000, 260000, '104%', 'مكتمل'],
      ['خدمة العملاء', 30000, 32000, 35000, 38000, 135000, 140000, '96%', 'قيد التنفيذ'],
      ['المبيعات المباشرة', 220000, 280000, 310000, 390000, 1200000, 1000000, '120%', 'ممتاز'],
      ['المصروفات الإدارية', 50000, 52000, 51000, 53000, 206000, 210000, '98%', 'منضبط'],
      ['الإجمالي العام', 465000, 569000, 631000, 751000, 2416000, 2160000, '112%', 'ناجح'],
    ];

    sampleRows.forEach((row, r) => {
      row.forEach((val, c) => {
        initialGrid[r + 1][c] = val;
      });
    });

    setSheets([
      { name: 'الميزانية السنوية', grid: initialGrid },
      {
        name: 'قائمة المبيعات',
        grid: (() => {
          const g: (string | number)[][] = Array(DEFAULT_ROWS)
            .fill(null)
            .map(() => Array(DEFAULT_COLS).fill(''));
          g[0][0] = 'اسم العميل';
          g[0][1] = 'المنتج';
          g[0][2] = 'الكمية';
          g[0][3] = 'السعر';
          g[0][4] = 'الإجمالي';
          g[1] = ['شركة الأمل للتقنية', 'ترخيص سنوي', 5, 1200, 6000];
          g[2] = ['مؤسسة الرواد', 'حزمة استشارات', 2, 4500, 9000];
          g[3] = ['مجموعة التميز', 'سيرفر مخصص', 3, 2800, 8400];
          return g;
        })(),
      },
    ]);
  }, []);

  const activeGrid = useMemo(() => {
    return sheets[activeSheetIndex]?.grid || [];
  }, [sheets, activeSheetIndex]);

  // Update formula input when selected cell changes
  useEffect(() => {
    if (activeGrid && activeGrid[selectedCell.r]) {
      const val = activeGrid[selectedCell.r][selectedCell.c] ?? '';
      setFormulaInput(String(val));
    }
  }, [selectedCell, activeGrid]);

  // Update cell value
  const setCellValue = (r: number, c: number, value: string | number) => {
    setSheets(prevSheets => {
      const updated = [...prevSheets];
      const curSheet = { ...updated[activeSheetIndex] };
      const curGrid = curSheet.grid.map(row => [...row]);

      // Expand rows if needed
      while (curGrid.length <= r) {
        curGrid.push(Array(DEFAULT_COLS).fill(''));
      }
      // Expand cols if needed
      while (curGrid[r].length <= c) {
        curGrid[r].push('');
      }

      // Handle simple math formula evaluation: e.g. =SUM or =10+20
      let evaluated: string | number = value;
      if (typeof value === 'string' && value.startsWith('=')) {
        try {
          const expr = value.substring(1).trim().toUpperCase();
          if (expr.startsWith('SUM(') && expr.endsWith(')')) {
            // e.g. SUM(B2:B5)
            const range = expr.substring(4, expr.length - 1);
            const [startCell, endCell] = range.split(':');
            if (startCell && endCell) {
              const startCol = startCell.charCodeAt(0) - 65;
              const startRow = parseInt(startCell.substring(1)) - 1;
              const endCol = endCell.charCodeAt(0) - 65;
              const endRow = parseInt(endCell.substring(1)) - 1;

              let sum = 0;
              for (let i = Math.min(startRow, endRow); i <= Math.max(startRow, endRow); i++) {
                for (let j = Math.min(startCol, endCol); j <= Math.max(startCol, endCol); j++) {
                  const num = Number(curGrid[i]?.[j]) || 0;
                  sum += num;
                }
              }
              evaluated = sum;
            }
          } else {
            // Basic math evaluation
            const sanitized = expr.replace(/[^0-9+\-*/().]/g, '');
            // eslint-disable-next-line no-eval
            evaluated = Function(`'use strict'; return (${sanitized})`)();
          }
        } catch {
          evaluated = '#خطأ!';
        }
      }

      curGrid[r][c] = evaluated;
      curSheet.grid = curGrid;
      updated[activeSheetIndex] = curSheet;
      return updated;
    });
  };

  // Upload and parse Excel / CSV file
  const handleFileUpload = async (file: File) => {
    try {
      const fileName = file.name;
      const fileExt = fileName.split('.').pop()?.toLowerCase() || 'xlsx';
      const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
      setDocTitle(nameWithoutExt);
      setOriginalExtension(fileExt);

      onNotify(`جاري قراءة واستيراد جدول ${fileName}...`, 'info');

      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });

      if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        throw new Error('الملف لا يحتوي على أوراق عمل صالحة');
      }

      const importedSheets: SheetData[] = workbook.SheetNames.map(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        const rawJson = XLSX.utils.sheet_to_json<(string | number)[]>(worksheet, { header: 1 });
        
        // Ensure standard dimensions
        const rowsCount = Math.max(rawJson.length, DEFAULT_ROWS);
        const colsCount = Math.max(
          rawJson.reduce((max, r) => Math.max(max, r?.length || 0), 0),
          DEFAULT_COLS
        );

        const grid: (string | number)[][] = Array(rowsCount)
          .fill(null)
          .map((_, r) => {
            const rowData = rawJson[r] || [];
            return Array(colsCount)
              .fill(null)
              .map((_, c) => rowData[c] ?? '');
          });

        return {
          name: sheetName,
          grid,
        };
      });

      setSheets(importedSheets);
      setActiveSheetIndex(0);
      setSelectedCell({ r: 0, c: 0 });
      onNotify(`تم فتح ملف الإكسل ${fileName} بنجاح مع كافة الأوراق والبيانات!`, 'success');
    } catch (err: unknown) {
      console.error('Error importing Excel file:', err);
      onNotify('حدث خطأ أثناء فتح ملف الإكسل: تأكد من صحة الملف', 'error');
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Save to device at user's chosen location with original extension
  const handleSaveToDevice = async () => {
    setIsSaving(true);
    try {
      const wb = XLSX.utils.book_new();

      sheets.forEach(sheet => {
        // Trim empty trailing rows/columns
        const cleanAoa = sheet.grid.map(row => [...row]);
        const ws = XLSX.utils.aoa_to_sheet(cleanAoa);
        XLSX.utils.book_append_sheet(wb, ws, sheet.name.substring(0, 31)); // 31 chars max for sheet name
      });

      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const result = await saveFileDirectlyToDevice({
        filename: `${docTitle}`,
        data: blob,
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        primaryExtension: originalExtension || 'xlsx',
        description: 'جدول بيانات مايكروسوفت إكسل (Excel)',
      });

      onNotify(`تم حفظ جدول الإكسل بنجاح على جهازك باسم (${result.filename}) بالامتداد الأصلي .${originalExtension}!`, 'success');
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes('إلغاء')) {
        onNotify('تم إلغاء الحفظ', 'info');
      } else {
        console.error('Error saving Excel:', err);
        onNotify('حدث خطأ أثناء حفظ الملف على جهازك', 'error');
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Print ONLY active spreadsheet table (isolated)
  const handlePrintSheet = () => {
    printDocumentContent('excel-printable-content', `${docTitle} - ${sheets[activeSheetIndex]?.name || 'ورقة العمل'}`);
    onNotify('تم إرسال محتوى جدول البيانات فقط إلى الطباعة بنجاح', 'success');
  };

  const addNewSheet = () => {
    const newName = `ورقة ${sheets.length + 1}`;
    const newGrid = Array(DEFAULT_ROWS)
      .fill(null)
      .map(() => Array(DEFAULT_COLS).fill(''));
    setSheets([...sheets, { name: newName, grid: newGrid }]);
    setActiveSheetIndex(sheets.length);
    onNotify(`تمت إضافة ${newName}`, 'info');
  };

  const addRow = () => {
    setSheets(prev => {
      const updated = [...prev];
      const cur = { ...updated[activeSheetIndex] };
      cur.grid = [...cur.grid, Array(cur.grid[0]?.length || DEFAULT_COLS).fill('')];
      updated[activeSheetIndex] = cur;
      return updated;
    });
  };

  const addColumn = () => {
    setSheets(prev => {
      const updated = [...prev];
      const cur = { ...updated[activeSheetIndex] };
      cur.grid = cur.grid.map(row => [...row, '']);
      updated[activeSheetIndex] = cur;
      return updated;
    });
  };

  // Quick AutoSum
  const insertAutoSum = () => {
    const { r, c } = selectedCell;
    setCellValue(r, c, `=SUM(${getColName(c)}1:${getColName(c)}${r})`);
  };

  // Numeric chart data calculation from selected table
  const chartData = useMemo(() => {
    if (!activeGrid || activeGrid.length < 2) return [];
    const items = [];
    for (let i = 1; i < Math.min(activeGrid.length, 10); i++) {
      const label = String(activeGrid[i][0] || `صف ${i}`);
      const val = Number(activeGrid[i][1]) || 0;
      if (label && val > 0) {
        items.push({ label, val });
      }
    }
    return items;
  }, [activeGrid]);

  const maxChartVal = useMemo(() => {
    return Math.max(...chartData.map(d => d.val), 1);
  }, [chartData]);

  return (
    <div
      className="flex flex-col h-full bg-slate-100"
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={onFileInputChange}
        className="hidden"
      />

      {isDragging && (
        <div className="absolute inset-0 z-50 bg-emerald-600/20 backdrop-blur-xs flex items-center justify-center border-4 border-dashed border-emerald-600 pointer-events-none">
          <div className="bg-white px-8 py-6 rounded-2xl shadow-2xl text-center">
            <Upload className="w-16 h-16 text-emerald-600 mx-auto mb-3 animate-bounce" />
            <h3 className="text-xl font-bold text-slate-800">أفلت ملف الإكسل هنا لفتحه مباشرة</h3>
            <p className="text-sm text-slate-500 mt-1">يدعم ملفات .xlsx, .xls, .csv بكافة المعادلات والجداول</p>
          </div>
        </div>
      )}

      {/* Excel Ribbon Toolbar */}
      <div className="bg-white border-b border-slate-200 shadow-xs select-none no-print">
        {/* Header Actions */}
        <div className="flex flex-wrap items-center justify-between px-4 py-2 border-b border-slate-100 gap-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
              X
            </div>
            <div>
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                className="text-base font-bold text-slate-800 bg-transparent hover:bg-slate-50 focus:bg-white focus:ring-1 focus:ring-emerald-500 rounded px-2 py-0.5 border border-transparent hover:border-slate-300 transition-all"
                title="تعديل اسم المصنف"
              />
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold mr-1">
                .{originalExtension}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              title="استيراد ملف إكسل من جهازك (.xlsx, .xls, .csv)"
            >
              <Upload className="w-4 h-4 text-emerald-600" />
              <span>رفع ملف إكسل</span>
            </button>

            <button
              onClick={handlePrintSheet}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              title="طباعة محتوى جدول البيانات فقط بدون واجهة البرنامج"
            >
              <Printer className="w-4 h-4 text-emerald-600" />
              <span>طباعة المحتوى فقط</span>
            </button>

            <button
              onClick={handleSaveToDevice}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-xs hover:shadow cursor-pointer disabled:opacity-60"
              title={`حفظ على جهازك في المسار الذي تريده بامتداد .${originalExtension}`}
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'جاري الحفظ...' : `حفظ على الجهاز (.${originalExtension})`}</span>
            </button>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-2 px-4 py-1.5 text-slate-700 text-sm overflow-x-auto">
          {/* Quick Calculations */}
          <button
            onClick={insertAutoSum}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-emerald-700 transition-colors"
            title="حساب الجمع التلقائي (AutoSum)"
          >
            <Sigma className="w-3.5 h-3.5" />
            <span>جمع تلقائي (AutoSum)</span>
          </button>

          <div className="h-5 w-px bg-slate-200" />

          {/* Add Row & Col */}
          <button
            onClick={addRow}
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-100 text-xs font-medium text-slate-700"
            title="إضافة صف جديد بالأسفل"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-600" />
            <span>إضافة صف</span>
          </button>
          <button
            onClick={addColumn}
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-100 text-xs font-medium text-slate-700"
            title="إضافة عمود جديد"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-600" />
            <span>إضافة عمود</span>
          </button>

          <div className="h-5 w-px bg-slate-200" />

          {/* Toggle Chart */}
          <button
            onClick={() => setShowChart(!showChart)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              showChart ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-slate-100 text-slate-700'
            }`}
            title="معاينة بيانية سريعة للأعمدة الرقمية"
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
            <span>رسم بياني للمؤشرات</span>
          </button>

          {/* Search Box */}
          <div className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-xs mr-auto">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="بحث في الجدول..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none w-28 text-slate-700 text-xs"
            />
          </div>
        </div>

        {/* Excel Formula Bar */}
        <div className="flex items-center px-4 py-1.5 bg-slate-50 border-t border-slate-200 gap-2">
          {/* Cell Address Box */}
          <div className="w-16 h-7 bg-white border border-slate-300 rounded px-2 flex items-center justify-center font-mono font-bold text-xs text-slate-700">
            {getColName(selectedCell.c)}{selectedCell.r + 1}
          </div>

          <div className="text-slate-400 font-mono text-xs font-semibold px-1">
            fx
          </div>

          {/* Formula / Cell Content Input */}
          <input
            type="text"
            value={formulaInput}
            onChange={(e) => {
              setFormulaInput(e.target.value);
              setCellValue(selectedCell.r, selectedCell.c, e.target.value);
            }}
            placeholder="أدخل قيمة أو معادلة (مثال: =SUM(B2:B5) أو =150*12)"
            className="flex-1 h-7 bg-white border border-slate-300 rounded px-3 text-xs text-slate-800 font-mono outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Optional Visual Chart Panel */}
        {showChart && chartData.length > 0 && (
          <div className="bg-white border-b border-slate-200 p-4 shrink-0 no-print">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                <span>رسم بياني تحليلي للبيانات (العمود الأول والثاني)</span>
              </h4>
              <button onClick={() => setShowChart(false)} className="text-xs text-slate-400 hover:text-slate-600">
                إغلاق الرسم
              </button>
            </div>
            <div className="flex items-end gap-4 h-32 pt-2 px-4 overflow-x-auto">
              {chartData.map((d, idx) => {
                const heightPct = Math.round((d.val / maxChartVal) * 100);
                return (
                  <div key={idx} className="flex flex-col items-center min-w-[70px] group">
                    <span className="text-[10px] text-slate-500 font-mono mb-1">{d.val.toLocaleString()}</span>
                    <div
                      className="w-10 bg-emerald-500 group-hover:bg-emerald-600 rounded-t transition-all"
                      style={{ height: `${Math.max(10, heightPct)}%` }}
                    />
                    <span className="text-[10px] text-slate-700 font-medium truncate max-w-[80px] mt-1 text-center" title={d.label}>
                      {d.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Spreadsheet Table Grid Workspace */}
        <div className="flex-1 overflow-auto bg-slate-200/50 p-2 sm:p-4">
          <div
            id="excel-printable-content"
            className="printable-content bg-white shadow-lg border border-slate-300 rounded overflow-hidden min-w-full inline-block"
          >
            {/* Sheet Title when Printed */}
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-800">{docTitle}</h2>
                <p className="text-xs text-slate-500">ورقة العمل: {sheets[activeSheetIndex]?.name}</p>
              </div>
              <span className="text-xs text-slate-400 font-mono no-print">
                {activeGrid.length} صف × {activeGrid[0]?.length || 0} عمود
              </span>
            </div>

            <table className="w-full border-collapse text-xs select-text">
              <thead>
                <tr className="bg-slate-100 text-slate-600 border-b border-slate-300">
                  {/* Row index header corner */}
                  <th className="w-10 px-2 py-1.5 border-r border-slate-300 text-center font-mono bg-slate-200 text-slate-500">
                    #
                  </th>
                  {activeGrid[0]?.map((_, colIdx) => (
                    <th
                      key={colIdx}
                      className="px-3 py-1.5 border-r border-slate-300 font-mono font-bold text-center min-w-[90px]"
                    >
                      {getColName(colIdx)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activeGrid.map((row, rowIdx) => {
                  const isMatch = searchQuery
                    ? row.some(cell => String(cell).toLowerCase().includes(searchQuery.toLowerCase()))
                    : true;

                  if (!isMatch && searchQuery) return null;

                  return (
                    <tr
                      key={rowIdx}
                      className={`border-b border-slate-200 transition-colors ${
                        rowIdx === 0 ? 'bg-slate-50 font-bold' : rowIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                      }`}
                    >
                      {/* Row Number */}
                      <td className="w-10 px-2 py-1 border-r border-slate-300 text-center font-mono text-slate-400 bg-slate-100/70 select-none">
                        {rowIdx + 1}
                      </td>

                      {/* Cells */}
                      {row.map((cellValue, colIdx) => {
                        const isSelected = selectedCell.r === rowIdx && selectedCell.c === colIdx;
                        const isNumeric = typeof cellValue === 'number' || (!isNaN(Number(cellValue)) && cellValue !== '');

                        return (
                          <td
                            key={colIdx}
                            onClick={() => setSelectedCell({ r: rowIdx, c: colIdx })}
                            className={`px-2 py-1 border-r border-slate-200 outline-none relative transition-all ${
                              isSelected ? 'bg-emerald-50 ring-2 ring-emerald-600 ring-inset z-10' : ''
                            } ${isNumeric ? 'text-left font-mono' : 'text-right'}`}
                          >
                            <input
                              type="text"
                              value={cellValue ?? ''}
                              onChange={(e) => setCellValue(rowIdx, colIdx, e.target.value)}
                              className="w-full bg-transparent border-none outline-none text-xs text-slate-800"
                            />
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Sheet Tabs Bar (Bottom of Excel) */}
      <div className="bg-white border-t border-slate-200 px-4 py-1.5 flex items-center justify-between text-xs select-none no-print">
        <div className="flex items-center gap-1 overflow-x-auto">
          {sheets.map((sheet, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSheetIndex(idx)}
              className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                activeSheetIndex === idx
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>{sheet.name}</span>
            </button>
          ))}

          <button
            onClick={addNewSheet}
            className="p-1 rounded text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
            title="إضافة ورقة عمل جديدة"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3 text-slate-500">
          <span className="flex items-center gap-1 text-emerald-600">
            <Check className="w-3.5 h-3.5" />
            <span>محرك الجداول جاهز</span>
          </span>
          <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-600">
            .{originalExtension}
          </span>
        </div>
      </div>
    </div>
  );
};
