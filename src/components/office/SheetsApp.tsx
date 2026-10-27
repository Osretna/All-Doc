import React, { useState, useEffect, useRef } from 'react';
import { SheetData, SheetCell } from '../../types';
import { localVault } from '../../utils/storage';
import { evaluateExcelFormula, parseRange, EXCEL_FUNCTIONS, ExcelFunctionDef } from '../../utils/excelEngine';
import { parseExcelFile } from '../../utils/fileImport';
import { 
  Sigma, 
  BarChart3, 
  PieChart, 
  Download, 
  Upload,
  Plus, 
  Trash2, 
  Check, 
  DollarSign, 
  Percent, 
  FileSpreadsheet,
  X,
  Grid,
  ArrowRightLeft,
  FunctionSquare,
  HelpCircle,
  FileUp
} from 'lucide-react';

interface Props {
  fontFamily: string;
  zoomLevel: number;
  initialSheets?: Record<string, { label: string; data: SheetData }>;
  onSheetsChange?: (sheets: Record<string, { label: string; data: SheetData }>) => void;
}

const COLS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'];
const ROWS_COUNT = 45;

const DEFAULT_EXCEL_PRESETS: Record<string, { label: string; data: SheetData }> = {
  sheet1: {
    label: 'ورقة 1: ميزانية ملاك والصيانة',
    data: {
      'A1': { value: 'كشف ميزانية اتحاد شاغلين - برج النخيل (نظام ملاك)', bold: true, bg: '#107c41', color: '#ffffff', align: 'center' },
      'A3': { value: 'البند / المصروف', bold: true, bg: '#e2e8f0', align: 'right' },
      'B3': { value: 'الشهر السابق (ر.س)', bold: true, bg: '#e2e8f0', align: 'center' },
      'C3': { value: 'الشهر الحالي (ر.س)', bold: true, bg: '#e2e8f0', align: 'center' },
      'D3': { value: 'الميزانية المعتمدة', bold: true, bg: '#e2e8f0', align: 'center' },
      'E3': { value: 'نسبة الإنجاز', bold: true, bg: '#e2e8f0', align: 'center' },

      'A4': { value: 'صيانة المصاعد الدورية' },
      'B4': { value: '1200' },
      'C4': { value: '1200' },
      'D4': { value: '1500' },
      'E4': { value: '80%' },

      'A5': { value: 'خدمات الأمن والحراسة' },
      'B5': { value: '2500' },
      'C5': { value: '2500' },
      'D5': { value: '2500' },
      'E5': { value: '100%' },

      'A6': { value: 'فاتورة الكهرباء المشتركة' },
      'B6': { value: '850' },
      'C6': { value: '920' },
      'D6': { value: '1000' },
      'E6': { value: '92%' },

      'A7': { value: 'أعمال النظافة ومواد التعقيم' },
      'B7': { value: '600' },
      'C7': { value: '650' },
      'D7': { value: '700' },
      'E7': { value: '93%' },

      'A8': { value: 'صندوق الطوارئ والاحتياطي' },
      'B8': { value: '1000' },
      'C8': { value: '1000' },
      'D8': { value: '1000' },
      'E8': { value: '100%' },

      'A9': { value: 'الإجمالي العام للمصروفات', bold: true, bg: '#dcfce7', align: 'right' },
      'B9': { value: '6150', formula: '=SUM(B4:B8)', bold: true, bg: '#dcfce7' },
      'C9': { value: '6270', formula: '=SUM(C4:C8)', bold: true, bg: '#dcfce7' },
      'D9': { value: '6700', formula: '=SUM(D4:D8)', bold: true, bg: '#dcfce7' },
      'E9': { value: '93%', bold: true, bg: '#dcfce7' },
    },
  },
  sheet2: {
    label: 'ورقة 2: مسير رواتب الموظفين',
    data: {
      'A1': { value: 'مسير رواتب موظفي إنفينيتي تكنولوجي لتقنية المعلومات', bold: true, bg: '#1e293b', color: '#ffffff', align: 'center' },
      'A3': { value: 'اسم الموظف', bold: true, bg: '#e2e8f0' },
      'B3': { value: 'الراتب الأساسي', bold: true, bg: '#e2e8f0' },
      'C3': { value: 'بدل سكن', bold: true, bg: '#e2e8f0' },
      'D3': { value: 'بدل نقل', bold: true, bg: '#e2e8f0' },
      'E3': { value: 'خصم التأمينات', bold: true, bg: '#e2e8f0' },
      'F3': { value: 'صافي الراتب', bold: true, bg: '#e2e8f0' },

      'A4': { value: 'م. خالد الشهري' },
      'B4': { value: '14000' },
      'C4': { value: '3500' },
      'D4': { value: '1000' },
      'E4': { value: '1400' },
      'F4': { value: '17100', formula: '=SUM(B4:D4)-E4', bold: true },

      'A5': { value: 'أ. سارة المنصور' },
      'B5': { value: '11500' },
      'C5': { value: '2875' },
      'D5': { value: '1000' },
      'E5': { value: '1150' },
      'F5': { value: '14225', formula: '=SUM(B5:D5)-E5', bold: true },

      'A6': { value: 'م. ياسر القاضي' },
      'B6': { value: '16000' },
      'C6': { value: '4000' },
      'D6': { value: '1200' },
      'E6': { value: '1600' },
      'F6': { value: '19600', formula: '=SUM(B6:D6)-E6', bold: true },

      'A7': { value: 'إجمالي كتلة الرواتب الشهرية', bold: true, bg: '#fef08a' },
      'B7': { value: '41500', formula: '=SUM(B4:B6)', bold: true },
      'C7': { value: '10375', formula: '=SUM(C4:C6)', bold: true },
      'D7': { value: '3200', formula: '=SUM(D4:D6)', bold: true },
      'E7': { value: '4150', formula: '=SUM(E4:E6)', bold: true },
      'F7': { value: '50925', formula: '=SUM(F4:F6)', bold: true, bg: '#fef08a' },
    },
  },
};

export const SheetsApp: React.FC<Props> = ({ 
  fontFamily, 
  zoomLevel,
  initialSheets,
  onSheetsChange
}) => {
  const [activeSheetKey, setActiveSheetKey] = useState<string>('sheet1');
  const [sheets, setSheets] = useState<Record<string, { label: string; data: SheetData }>>(() => {
    return initialSheets || localVault.get<Record<string, { label: string; data: SheetData }>>(
      localVault.KEYS.SHEETS_DATA,
      DEFAULT_EXCEL_PRESETS
    );
  });

  // Sync when initialSheets is updated externally (e.g. from Backstage file open)
  useEffect(() => {
    if (initialSheets && Object.keys(initialSheets).length > 0) {
      setSheets(initialSheets);
      setActiveSheetKey(Object.keys(initialSheets)[0]);
    }
  }, [initialSheets]);

  const [selectedCell, setSelectedCell] = useState<string>('A4');
  const [formulaInput, setFormulaInput] = useState<string>('');
  const [isRTL, setIsRTL] = useState<boolean>(true);
  const [showGridlines, setShowGridlines] = useState<boolean>(true);
  const [showChart, setShowChart] = useState<boolean>(false);
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');
  const [showFxHelper, setShowFxHelper] = useState<boolean>(false);
  const [showFormulasMode, setShowFormulasMode] = useState<boolean>(false);
  const [showFilterActive, setShowFilterActive] = useState<boolean>(false);

  // Excel Formula Autocomplete state
  const [matchingFunctions, setMatchingFunctions] = useState<ExcelFunctionDef[]>([]);
  const [selectedFunctionIndex, setSelectedFunctionIndex] = useState<number>(0);
  const [showAutocomplete, setShowAutocomplete] = useState<boolean>(false);
  const [currentFunctionSyntax, setCurrentFunctionSyntax] = useState<string | null>(null);
  const [isEditingCell, setIsEditingCell] = useState<boolean>(false);
  const formulaInputRef = useRef<HTMLInputElement>(null);

  // Cell reference selection & dragging states for Excel formulas
  const [formulaOriginCell, setFormulaOriginCell] = useState<string>('A4');
  const [formulaOriginSheet, setFormulaOriginSheet] = useState<string>('sheet1');
  const [isDraggingRange, setIsDraggingRange] = useState<boolean>(false);
  const [dragStartCell, setDragStartCell] = useState<string | null>(null);

  const currentSheet = sheets[activeSheetKey] || sheets[Object.keys(sheets)[0]];
  const data = currentSheet ? currentSheet.data : {};

  // Auto-recalculate formula cells on load or sheet change
  useEffect(() => {
    if (!currentSheet) return;
    const cell = data[selectedCell];
    setFormulaInput(cell?.formula || cell?.value || '');
    setShowAutocomplete(false);
    setCurrentFunctionSyntax(null);
  }, [selectedCell, activeSheetKey]);

  // Extract referenced cells for visual border highlighting (colored dashed borders like real Excel)
  const getReferencedCellsMap = (): Record<string, string> => {
    if (!formulaInput.startsWith('=')) return {};
    const colors = ['#2563eb', '#16a34a', '#9333ea', '#ea580c', '#0891b2', '#e11d48'];
    const cellMap: Record<string, string> = {};

    // Match ranges like B4:B8 or Sheet1!B4:B8 or individual cells like B4
    const tokenRegex = /(?:'([^']+)'|([A-Za-z0-9_]+))!([A-Z]+[0-9]+(?::[A-Z]+[0-9]+)?)|([A-Z]+[0-9]+(?::[A-Z]+[0-9]+)?)/gi;
    let match: RegExpExecArray | null;
    let colorIdx = 0;

    while ((match = tokenRegex.exec(formulaInput)) !== null) {
      const sheetName = match[1] || match[2];
      const rangeOrCell = match[3] || match[4];
      const color = colors[colorIdx % colors.length];
      colorIdx++;

      // If formula references another sheet, only highlight if active sheet matches
      if (sheetName) {
        const isCurrent = currentSheet.label.toLowerCase() === sheetName.toLowerCase() ||
                          activeSheetKey.toLowerCase() === sheetName.toLowerCase();
        if (!isCurrent) continue;
      }

      if (rangeOrCell.includes(':')) {
        const expanded = parseRange(rangeOrCell.toUpperCase());
        expanded.forEach((c) => {
          cellMap[c] = color;
        });
      } else {
        cellMap[rangeOrCell.toUpperCase()] = color;
      }
    }

    return cellMap;
  };

  const referencedCellsMap = getReferencedCellsMap();

  // Handle formula typing and autocomplete suggestions
  const handleFormulaInputChange = (val: string) => {
    setFormulaInput(val);
    handleCellChange(formulaOriginCell || selectedCell, val);

    if (val.startsWith('=')) {
      // Find trailing function prefix: e.g. "=S" or "=SUM(" or "=A1+AV"
      const match = val.match(/([A-Za-z]+)$/);
      if (match) {
        const prefix = match[1].toUpperCase();
        const filtered = EXCEL_FUNCTIONS.filter((f) => f.name.startsWith(prefix));
        if (filtered.length > 0) {
          setMatchingFunctions(filtered);
          setSelectedFunctionIndex(0);
          setShowAutocomplete(true);
          setCurrentFunctionSyntax(null);
          return;
        }
      }

      // Check if inside a function call for parameter syntax tooltip
      const funcCallMatch = val.match(/([A-Z]+)\s*\([^)]*$/i);
      if (funcCallMatch) {
        const fnName = funcCallMatch[1].toUpperCase();
        const fnDef = EXCEL_FUNCTIONS.find((f) => f.name === fnName);
        if (fnDef) {
          setCurrentFunctionSyntax(`${fnDef.syntax} — ${fnDef.desc}`);
        } else {
          setCurrentFunctionSyntax(null);
        }
        setShowAutocomplete(false);
        return;
      }
    }

    setShowAutocomplete(false);
    setCurrentFunctionSyntax(null);
  };

  const handleSelectFunction = (fn: ExcelFunctionDef) => {
    let newVal = '';
    if (formulaInput.includes('(')) {
      newVal = formulaInput.replace(/([A-Za-z]+)$/, `${fn.name}(`);
    } else {
      newVal = `=${fn.name}(`;
    }
    setFormulaInput(newVal);
    handleCellChange(formulaOriginCell || selectedCell, newVal);
    setShowAutocomplete(false);
    setCurrentFunctionSyntax(`${fn.syntax} — ${fn.desc}`);
    if (formulaInputRef.current) {
      formulaInputRef.current.focus();
    }
  };

  const handleFormulaKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showAutocomplete && matchingFunctions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedFunctionIndex((prev) => (prev + 1) % matchingFunctions.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedFunctionIndex((prev) => (prev - 1 + matchingFunctions.length) % matchingFunctions.length);
        return;
      }
      if (e.key === 'Tab' || e.key === 'Enter') {
        e.preventDefault();
        handleSelectFunction(matchingFunctions[selectedFunctionIndex]);
        return;
      }
      if (e.key === 'Escape') {
        setShowAutocomplete(false);
        return;
      }
    }
    if (e.key === 'Enter') {
      setIsEditingCell(false);
      setShowAutocomplete(false);
    }
  };

  const saveSheets = (newSheets: Record<string, { label: string; data: SheetData }>) => {
    setSheets(newSheets);
    localVault.set(localVault.KEYS.SHEETS_DATA, newSheets);
    onSheetsChange?.(newSheets);
  };

  // Recalculates all formulas across the current sheet with cross-sheet access
  const recalculateSheet = (sourceData: SheetData): SheetData => {
    const updated = { ...sourceData };
    Object.keys(updated).forEach((cellId) => {
      const cell = updated[cellId];
      if (cell && cell.formula) {
        const computed = evaluateExcelFormula(cell.formula, updated, sheets);
        updated[cellId] = {
          ...cell,
          value: computed,
        };
      }
    });
    return updated;
  };

  const handleCellChange = (cellId: string, rawVal: string) => {
    const isFormula = rawVal.startsWith('=');
    const computedVal = isFormula ? evaluateExcelFormula(rawVal, data, sheets) : rawVal;

    const nextData = {
      ...data,
      [cellId]: {
        ...(data[cellId] || {}),
        value: computedVal,
        formula: isFormula ? rawVal : undefined,
      },
    };

    // Cascade recalculation across other formula cells
    const fullyComputed = recalculateSheet(nextData);

    const updatedSheets = {
      ...sheets,
      [activeSheetKey]: {
        ...currentSheet,
        data: fullyComputed,
      },
    };
    saveSheets(updatedSheets);
  };

  // Excel Cell Reference Insertion on Click / Drag
  const handleGridCellClickOrSelect = (cellId: string) => {
    if (formulaInput.startsWith('=')) {
      const targetSheet = sheets[activeSheetKey];
      const isOtherSheet = formulaOriginSheet && formulaOriginSheet !== activeSheetKey;
      const prefix = isOtherSheet ? `'${targetSheet.label}'!` : '';
      const ref = `${prefix}${cellId}`;

      // Check if formula ends with an operator, opening paren, or comma
      if (/[=+\-*/(,;><&]$/.test(formulaInput.trim())) {
        const nextFormula = formulaInput + ref;
        handleFormulaInputChange(nextFormula);
      } else {
        // If user already had a reference and clicks a different cell without typing an operator, replace it
        const replaced = formulaInput.replace(/(?:'[^']+'!)?[A-Z]+[0-9]+(?::[A-Z]+[0-9]+)?$/i, ref);
        handleFormulaInputChange(replaced);
      }
      formulaInputRef.current?.focus();
      return;
    }

    setSelectedCell(cellId);
    setFormulaOriginCell(cellId);
    setFormulaOriginSheet(activeSheetKey);
  };

  const handleGridCellMouseDown = (cellId: string) => {
    if (formulaInput.startsWith('=')) {
      setIsDraggingRange(true);
      setDragStartCell(cellId);
      handleGridCellClickOrSelect(cellId);
    }
  };

  const handleGridCellMouseEnter = (cellId: string) => {
    if (isDraggingRange && dragStartCell && formulaInput.startsWith('=')) {
      const targetSheet = sheets[activeSheetKey];
      const isOtherSheet = formulaOriginSheet && formulaOriginSheet !== activeSheetKey;
      const prefix = isOtherSheet ? `'${targetSheet.label}'!` : '';
      const rangeRef = `${prefix}${dragStartCell}:${cellId}`;

      const replaced = formulaInput.replace(/(?:'[^']+'!)?[A-Z]+[0-9]+(?::[A-Z]+[0-9]+)?$/i, rangeRef);
      handleFormulaInputChange(replaced);
    }
  };

  const handleGridMouseUp = () => {
    setIsDraggingRange(false);
    setDragStartCell(null);
  };

  // Microsoft Excel Keyboard Shortcuts
  useEffect(() => {
    const handleExcelGlobalKeys = (e: KeyboardEvent) => {
      // 1. Ctrl + ; : Today's Date
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === ';') {
        e.preventDefault();
        const today = new Date().toISOString().split('T')[0];
        handleCellChange(selectedCell, today);
        return;
      }

      // 2. Ctrl + Shift + ; or Ctrl + : : Current Time
      if ((e.ctrlKey || e.metaKey) && (e.shiftKey && (e.key === ';' || e.key === ':'))) {
        e.preventDefault();
        const now = new Date().toLocaleTimeString('ar-EG');
        handleCellChange(selectedCell, now);
        return;
      }

      // 3. Ctrl + D : Fill Down (Copy from cell above)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        const m = selectedCell.match(/([A-Z]+)(\d+)/);
        if (m) {
          const col = m[1];
          const row = parseInt(m[2], 10);
          if (row > 1) {
            const aboveCellId = `${col}${row - 1}`;
            const aboveCell = data[aboveCellId];
            if (aboveCell) {
              const val = aboveCell.formula || aboveCell.value;
              handleCellChange(selectedCell, val);
            }
          }
        }
        return;
      }

      // 4. Ctrl + R : Fill Right (Copy from cell to left)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'r' || e.key === 'R')) {
        e.preventDefault();
        const m = selectedCell.match(/([A-Z]+)(\d+)/);
        if (m) {
          const col = m[1];
          const row = parseInt(m[2], 10);
          const colIdx = COLS.indexOf(col);
          if (colIdx > 0) {
            const leftCol = COLS[colIdx - 1];
            const leftCellId = `${leftCol}${row}`;
            const leftCell = data[leftCellId];
            if (leftCell) {
              const val = leftCell.formula || leftCell.value;
              handleCellChange(selectedCell, val);
            }
          }
        }
        return;
      }

      // 5. Alt + = : AutoSum
      if (e.altKey && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        const m = selectedCell.match(/([A-Z]+)(\d+)/);
        if (m) {
          const col = m[1];
          const row = parseInt(m[2], 10);
          if (row > 1) {
            const formula = `=SUM(${col}4:${col}${row - 1})`;
            handleCellChange(selectedCell, formula);
            setFormulaInput(formula);
          }
        }
        return;
      }

      // 6. Ctrl + Shift + L : Toggle AutoFilter
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'l' || e.key === 'L')) {
        e.preventDefault();
        setShowFilterActive((prev) => !prev);
        return;
      }

      // 7. Ctrl + T : Convert to Table format
      if ((e.ctrlKey || e.metaKey) && (e.key === 't' || e.key === 'T')) {
        e.preventDefault();
        handleFormat('bg', '#e2e8f0');
        handleFormat('bold', true);
        alert('تم تطبيق تنسيق جدول Excel (Ctrl+T) على النطاق المحدد!');
        return;
      }

      // 8. Ctrl + Shift + $ : Currency Format
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === '$' || e.key === '4')) {
        e.preventDefault();
        const currentVal = data[selectedCell]?.value || '';
        if (currentVal && !currentVal.includes('ر.س')) {
          handleCellChange(selectedCell, `${currentVal} ر.س`);
        }
        return;
      }

      // 9. Ctrl + Shift + % : Percentage Format
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === '%' || e.key === '5')) {
        e.preventDefault();
        const currentVal = data[selectedCell]?.value || '';
        if (currentVal && !currentVal.includes('%')) {
          handleCellChange(selectedCell, `${currentVal}%`);
        }
        return;
      }

      // 10. Ctrl + ` : Toggle Show Formulas Mode
      if ((e.ctrlKey || e.metaKey) && (e.key === '`' || e.key === '~')) {
        e.preventDefault();
        setShowFormulasMode((prev) => !prev);
        return;
      }

      // 11. F4 : Cycle absolute references ($A$1)
      if (e.key === 'F4') {
        e.preventDefault();
        if (formulaInput.startsWith('=')) {
          const lastRefMatch = formulaInput.match(/(\$?)([A-Z]+)(\$?)(\d+)$/);
          if (lastRefMatch) {
            const hasColDollar = !!lastRefMatch[1];
            const col = lastRefMatch[2];
            const hasRowDollar = !!lastRefMatch[3];
            const row = lastRefMatch[4];
            let nextRef = '';
            if (!hasColDollar && !hasRowDollar) nextRef = `$${col}$${row}`;
            else if (hasColDollar && hasRowDollar) nextRef = `${col}$${row}`;
            else if (!hasColDollar && hasRowDollar) nextRef = `$${col}${row}`;
            else nextRef = `${col}${row}`;

            const replaced = formulaInput.replace(/(\$?)([A-Z]+)(\$?)(\d+)$/, nextRef);
            handleFormulaInputChange(replaced);
          }
        }
        return;
      }
    };

    window.addEventListener('keydown', handleExcelGlobalKeys);
    return () => window.removeEventListener('keydown', handleExcelGlobalKeys);
  }, [selectedCell, data, formulaInput, activeSheetKey]);

  const handleFormat = (prop: keyof SheetCell, value: any) => {
    const cell = data[selectedCell] || { value: '' };
    const nextData = {
      ...data,
      [selectedCell]: {
        ...cell,
        [prop]: value,
      },
    };
    saveSheets({
      ...sheets,
      [activeSheetKey]: {
        ...currentSheet,
        data: nextData,
      },
    });
  };

  // Real Excel .xlsx / .csv file opener
  const handleOpenExcelFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const parsedSheets = await parseExcelFile(file);
      if (Object.keys(parsedSheets).length > 0) {
        saveSheets(parsedSheets);
        setActiveSheetKey(Object.keys(parsedSheets)[0]);
        alert(`تم فتح ملف إكسيل "${file.name}" بنجاح وتضمين ${Object.keys(parsedSheets).length} ورقة عمل!`);
      } else {
        alert('لم يتم العثور على أوراق عمل داخل الملف.');
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء قراءة ملف Excel. تأكد من سلامة الملف.');
    }
  };

  const handleAddSheet = () => {
    const newKey = `sheet_${Date.now()}`;
    const newSheet = {
      label: `ورقة ${Object.keys(sheets).length + 1}`,
      data: {
        'A1': { value: 'ورقة عمل جديدة', bold: true, bg: '#107c41', color: '#ffffff' },
      },
    };
    const updated = { ...sheets, [newKey]: newSheet };
    saveSheets(updated);
    setActiveSheetKey(newKey);
  };

  const exportCSV = () => {
    let csv = '';
    for (let r = 1; r <= 30; r++) {
      const rowVals = COLS.map((c) => `"${data[`${c}${r}`]?.value || ''}"`);
      csv += rowVals.join(',') + '\n';
    }
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentSheet.label.replace(/\s+/g, '_')}.csv`;
    link.click();
  };

  // Chart data extraction
  const chartItems = [
    { label: data['A4']?.value || 'بند 1', val: parseFloat(data['C4']?.value || data['B4']?.value || '0') },
    { label: data['A5']?.value || 'بند 2', val: parseFloat(data['C5']?.value || data['B5']?.value || '0') },
    { label: data['A6']?.value || 'بند 3', val: parseFloat(data['C6']?.value || data['B6']?.value || '0') },
    { label: data['A7']?.value || 'بند 4', val: parseFloat(data['C7']?.value || data['B7']?.value || '0') },
    { label: data['A8']?.value || 'بند 5', val: parseFloat(data['C8']?.value || data['B8']?.value || '0') },
  ].filter((i) => i.val > 0);

  const maxChartVal = Math.max(...chartItems.map((i) => i.val), 100);

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden text-xs select-none">
      {/* 1. Authentic Excel Formula Bar */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-[#f3f2f1] border-b border-gray-300 relative z-30">
        {/* Active Cell Reference box */}
        <div className="w-16 px-2 py-1 bg-white border border-gray-300 rounded font-mono font-bold text-center text-gray-900 shadow-2xs">
          {selectedCell}
        </div>

        {/* fx symbol button with popup helper */}
        <button
          onClick={() => setShowFxHelper(!showFxHelper)}
          className="font-serif italic font-bold text-emerald-800 text-sm px-2 py-0.5 rounded hover:bg-emerald-100 transition cursor-pointer"
          title="معالج الدوال الرياضية (fx Function Builder)"
        >
          fx
        </button>

        {/* Equal Sign Indicator Button (Pin/Toggle '=' at the beginning) */}
        <button
          onClick={() => {
            if (!formulaInput.startsWith('=')) {
              const newVal = '=' + formulaInput;
              handleFormulaInputChange(newVal);
            }
            formulaInputRef.current?.focus();
          }}
          className={`w-7 h-7 flex items-center justify-center font-mono font-black text-sm rounded cursor-pointer transition select-none ${
            formulaInput.startsWith('=')
              ? 'bg-[#107c41] text-white shadow-xs'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
          }`}
          title="تفعيل صيغة رياضية (=)"
        >
          =
        </button>

        {/* Formula Input (strictly LTR for Excel formulas) */}
        <div className="flex-1 relative">
          <input
            ref={formulaInputRef}
            type="text"
            dir="ltr"
            value={formulaInput}
            onChange={(e) => handleFormulaInputChange(e.target.value)}
            onKeyDown={handleFormulaKeyDown}
            placeholder="=SUM(B4:B8), =AVERAGE(C4:C8), =IF(C4>1000,'فائض','ضمن الحد')"
            className="w-full bg-white border border-gray-300 rounded px-3 py-1 font-mono text-xs text-gray-900 outline-none focus:border-[#107c41] focus:ring-1 focus:ring-[#107c41] text-left"
            style={{ direction: 'ltr', textAlign: 'left' }}
          />

          {/* Excel Function Autocomplete Dropdown */}
          {showAutocomplete && matchingFunctions.length > 0 && (
            <div className="absolute left-0 top-full mt-1 w-96 max-h-64 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-2xl z-50 p-1 divide-y divide-gray-100 text-right animate-in fade-in">
              <div className="px-2.5 py-1.5 text-[10px] text-gray-500 font-bold bg-gray-50 flex items-center justify-between">
                <span>اقتراحات دوال إكسيل التلقائية:</span>
                <span className="font-mono text-[9px] text-emerald-700">اضغط Tab أو Enter للإكمال</span>
              </div>
              {matchingFunctions.map((fn, idx) => (
                <div
                  key={fn.name}
                  onClick={() => handleSelectFunction(fn)}
                  className={`p-2.5 rounded cursor-pointer text-xs transition ${
                    idx === selectedFunctionIndex
                      ? 'bg-emerald-100/90 text-emerald-950 font-bold border border-emerald-300'
                      : 'hover:bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-mono text-xs font-black text-emerald-800 tracking-wide">{fn.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-gray-200 text-gray-700 rounded font-normal">
                      {fn.category}
                    </span>
                  </div>
                  <div className="text-[11.5px] text-gray-600 line-clamp-1">{fn.desc}</div>
                  <div className="font-mono text-[10.5px] text-emerald-700 mt-1 font-semibold" dir="ltr" style={{ textAlign: 'left' }}>
                    {fn.syntax}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Parameter Syntax Helper Pill */}
          {currentFunctionSyntax && (
            <div className="absolute left-0 top-full mt-1 bg-emerald-50 border border-emerald-300 text-emerald-950 rounded-md px-3 py-1.5 text-[11px] shadow-lg z-40 flex items-center gap-2 animate-in fade-in">
              <span className="font-bold text-emerald-800">صيغة الدالة:</span>
              <span className="font-mono text-xs text-emerald-900 font-semibold" dir="ltr">{currentFunctionSyntax}</span>
            </div>
          )}
        </div>

        {/* Right Quick Controls & Open Real Excel File Button */}
        <div className="flex items-center gap-1">
          <label className="flex items-center gap-1 px-2.5 py-1 rounded border border-gray-300 bg-white hover:bg-emerald-50 text-emerald-800 font-bold cursor-pointer transition shadow-2xs">
            <FileUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>فتح ملف Excel (.xlsx)</span>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleOpenExcelFile}
              className="hidden"
            />
          </label>

          <button
            onClick={() => handleFormat('bold', !data[selectedCell]?.bold)}
            className={`px-2 py-1 rounded border cursor-pointer font-bold ${
              data[selectedCell]?.bold ? 'bg-emerald-100 border-emerald-400 text-emerald-800' : 'bg-white border-gray-300'
            }`}
            title="تغميق الخط (Ctrl+B)"
          >
            B
          </button>
          <button
            onClick={() => handleFormat('format', 'currency-sar')}
            className="px-2 py-1 rounded border border-gray-300 bg-white hover:bg-gray-100 cursor-pointer text-emerald-700 font-bold"
            title="تنسيق العملة (ر.س)"
          >
            ر.س
          </button>
          <button
            onClick={() => setIsRTL(!isRTL)}
            className="px-2 py-1 rounded border border-gray-300 bg-white hover:bg-gray-100 cursor-pointer text-gray-700 flex items-center gap-1"
            title="تغيير اتجاه ورقة العمل (يمين لليسار / يسار لليمين)"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isRTL ? 'RTL' : 'LTR'}</span>
          </button>
          <button
            onClick={() => setShowChart(!showChart)}
            className="px-2.5 py-1 rounded border border-emerald-600 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1 cursor-pointer"
            title="توليد مخطط بياني فوري"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>مخطط بياني</span>
          </button>
          <button
            onClick={exportCSV}
            className="px-2 py-1 rounded border border-gray-300 bg-white hover:bg-gray-100 cursor-pointer text-gray-700"
            title="تصدير كملف CSV"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* fx Functions Helper Popover */}
      {showFxHelper && (
        <div className="bg-emerald-50 border-b border-emerald-200 p-2.5 flex items-center gap-2 overflow-x-auto text-[11px] animate-in fade-in">
          <span className="font-bold text-emerald-900 shrink-0">معالج الدوال السريعة:</span>
          {[
            { name: '=SUM(B4:B8)', desc: 'مجموع الخلايا' },
            { name: '=AVERAGE(C4:C8)', desc: 'المتوسط الحسابي' },
            { name: '=IF(C4>1000, "فائض", "ضمن الحد")', desc: 'دالة الشرط' },
            { name: '=COUNT(A4:A20)', desc: 'عدد القيم' },
            { name: '=ROUND(B4*1.15, 2)', desc: 'تقريب رقمي' },
            { name: '=MAX(C4:C8)', desc: 'أعلى قيمة' },
            { name: '=MIN(C4:C8)', desc: 'أدنى قيمة' },
          ].map((fx) => (
            <button
              key={fx.name}
              onClick={() => {
                setFormulaInput(fx.name);
                handleCellChange(selectedCell, fx.name);
                setShowFxHelper(false);
              }}
              className="bg-white hover:bg-emerald-100 border border-emerald-300 text-emerald-900 px-2 py-1 rounded font-mono font-bold whitespace-nowrap shadow-2xs cursor-pointer"
            >
              {fx.name} <span className="text-[9px] text-gray-500 font-normal">({fx.desc})</span>
            </button>
          ))}
        </div>
      )}

      {/* 2. Main Spreadsheet Grid */}
      <div 
        onMouseUp={handleGridMouseUp}
        className="flex-1 overflow-auto bg-gray-100 p-1"
        style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: isRTL ? 'top right' : 'top left' }}
      >
        <table className={`border-collapse bg-white shadow-xs min-w-full ${isRTL ? 'text-right' : 'text-left'}`}>
          <thead>
            <tr className="bg-[#f3f2f1] text-gray-600 font-semibold text-[11px]">
              <th className="w-10 p-1 border border-gray-300 text-center bg-[#eae8e6]">#</th>
              {COLS.map((col) => (
                <th key={col} className="p-1 border border-gray-300 text-center min-w-[110px] w-28">
                  <span>{col}</span>
                  {showFilterActive && (
                    <span className="inline-block text-[9px] text-emerald-800 bg-white border border-gray-300 rounded px-1 ml-1 cursor-pointer hover:bg-emerald-50">
                      ▼
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: ROWS_COUNT }).map((_, rIdx) => {
              const rowNum = rIdx + 1;
              return (
                <tr key={rowNum} className="hover:bg-emerald-50/20">
                  {/* Row Number */}
                  <td className="p-1 border border-gray-300 text-center bg-[#f3f2f1] text-gray-500 font-mono text-[10px]">
                    {rowNum}
                  </td>

                  {/* Columns */}
                  {COLS.map((col) => {
                    const cellId = `${col}${rowNum}`;
                    const cell = data[cellId];
                    const isSelected = selectedCell === cellId;
                    const refColor = referencedCellsMap[cellId];

                    return (
                      <td
                        key={cellId}
                        onMouseDown={() => handleGridCellMouseDown(cellId)}
                        onMouseEnter={() => handleGridCellMouseEnter(cellId)}
                        onClick={() => handleGridCellClickOrSelect(cellId)}
                        className={`p-1 relative transition-all select-none ${
                          showGridlines ? 'border border-gray-300' : 'border border-transparent'
                        } ${
                          isSelected ? 'outline-2 outline-[#107c41] z-10 bg-emerald-50/60 shadow-xs' : ''
                        }`}
                        style={{
                          backgroundColor: cell?.bg,
                          color: cell?.color,
                          fontWeight: cell?.bold ? 'bold' : 'normal',
                          textAlign: cell?.align || (isRTL ? 'right' : 'left'),
                          fontFamily: fontFamily,
                          boxShadow: refColor ? `inset 0 0 0 2px ${refColor}` : undefined,
                          outline: refColor ? `2px dashed ${refColor}` : undefined,
                          zIndex: refColor ? 20 : (isSelected ? 10 : 1),
                        }}
                      >
                        <input
                          type="text"
                          value={
                            showFormulasMode && cell?.formula
                              ? cell.formula
                              : (isSelected && isEditingCell && cell?.formula ? cell.formula : (cell?.value || ''))
                          }
                          onFocus={() => {
                            setSelectedCell(cellId);
                            setFormulaOriginCell(cellId);
                            setFormulaOriginSheet(activeSheetKey);
                            setIsEditingCell(true);
                          }}
                          onBlur={() => setIsEditingCell(false)}
                          onChange={(e) => handleCellChange(cellId, e.target.value)}
                          className={`w-full bg-transparent outline-none text-xs px-1 text-inherit font-inherit ${
                            isRTL ? 'text-right' : 'text-left'
                          }`}
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

      {/* 3. Interactive Chart Modal */}
      {showChart && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-gray-200 p-6 text-right">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-gray-900">مخطط إكسيل البياني المعتمد (Excel Chart)</h3>
              </div>
              <button
                onClick={() => setShowChart(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-gray-500">تم استخراج البيانات تلقائياً من أعمدة ورقة العمل الحالية</span>
              <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded">
                <button
                  onClick={() => setChartType('bar')}
                  className={`px-2 py-0.5 rounded text-xs font-semibold cursor-pointer ${
                    chartType === 'bar' ? 'bg-white text-emerald-700 shadow-xs' : 'text-gray-600'
                  }`}
                >
                  أعمدة (Bar Chart)
                </button>
                <button
                  onClick={() => setChartType('pie')}
                  className={`px-2 py-0.5 rounded text-xs font-semibold cursor-pointer ${
                    chartType === 'pie' ? 'bg-white text-emerald-700 shadow-xs' : 'text-gray-600'
                  }`}
                >
                  دائري (Pie Chart)
                </button>
              </div>
            </div>

            {/* Rendered Bars */}
            <div className="mt-6 space-y-3.5">
              {chartItems.map((item, idx) => {
                const pct = Math.round((item.val / maxChartVal) * 100);
                const barColors = ['#107c41', '#0078d4', '#d83b01', '#7719aa', '#0284c7'];
                const color = barColors[idx % barColors.length];

                return (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium text-gray-700">
                      <span>{item.label}</span>
                      <span className="font-mono font-bold text-gray-900">{item.val.toLocaleString('ar-EG')} ر.س</span>
                    </div>
                    <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 shadow-inner"
                        style={{ width: `${pct}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setShowChart(false)}
                className="bg-[#107c41] text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-[#0b6a35] transition cursor-pointer"
              >
                إغلاق المخطط
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Multi-Sheet Tabs Bar (Real Microsoft Excel Sheet Switcher) */}
      <div className="flex items-center justify-between px-3 py-1 bg-[#f3f2f1] border-t border-gray-300 text-[11px] text-gray-600">
        <div className="flex items-center gap-1 overflow-x-auto">
          {Object.entries(sheets).map(([key, s]) => {
            const isActive = key === activeSheetKey;
            return (
              <button
                key={key}
                onClick={() => setActiveSheetKey(key)}
                className={`px-3 py-1 font-bold rounded-t transition cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-white text-emerald-800 border-t-2 border-emerald-600 shadow-xs'
                    : 'hover:bg-gray-200 text-gray-600'
                }`}
              >
                {s.label}
              </button>
            );
          })}

          <button
            onClick={handleAddSheet}
            className="p-1 hover:bg-gray-200 rounded text-gray-700 cursor-pointer"
            title="إضافة ورقة عمل جديدة (+)"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="text-[10px] text-gray-500 font-mono hidden sm:inline">
          Excel Sovereign Formula Engine | Ready | 100% Offline
        </div>
      </div>
    </div>
  );
};
