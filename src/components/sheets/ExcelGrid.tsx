import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import * as XLSX from 'xlsx';
import {
  SheetCell,
  SheetData,
  SheetTab,
  WorkbookData,
  NamedRange,
  SheetChart,
  ConditionalRule,
  DataValidationRule,
  FilterState
} from '../../types/office';
import {
  COLUMN_LETTERS,
  colIndexToLetter,
  letterToColIndex,
  parseCellCoordinate,
  expandRange,
  getCellValue,
  formatCellValue,
  evaluateFormula
} from '../../utils/formulaEngine';
import { AppStorage } from '../../utils/storage';
import { ExcelRibbon } from './ExcelRibbon';
import { InsertFunctionModal } from './modals/InsertFunctionModal';
import { NameManagerModal } from './modals/NameManagerModal';
import { DataValidationModal } from './modals/DataValidationModal';
import { RemoveDuplicatesModal } from './modals/RemoveDuplicatesModal';
import { GoalSeekModal } from './modals/GoalSeekModal';
import { TextToColumnsModal } from './modals/TextToColumnsModal';
import { PivotTableModal } from './modals/PivotTableModal';
import { ChartModal } from './modals/ChartModal';
import { ConditionalFormattingModal } from './modals/ConditionalFormattingModal';
import { ProtectSheetModal } from './modals/ProtectSheetModal';
import { FindReplaceModal } from './modals/FindReplaceModal';
import { SpellCheckModal } from './modals/SpellCheckModal';
import { Check, X, Search, Filter, Trash2, Plus, Move } from 'lucide-react';

interface Props {
  initialSheets?: WorkbookData;
  onSheetsChange?: (sheets: WorkbookData) => void;
  onOpenBackstage: () => void;
  onNotify?: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

const DEFAULT_WORKBOOK: WorkbookData = {
  sheet1: {
    id: 'sheet1',
    label: 'ورقة 1',
    rtl: true,
    data: {
      A1: { value: 'البند / القسم', bold: true, bg: '#107c41', color: '#ffffff', align: 'center' },
      B1: { value: 'الربع الأول', bold: true, bg: '#107c41', color: '#ffffff', align: 'center' },
      C1: { value: 'الربع الثاني', bold: true, bg: '#107c41', color: '#ffffff', align: 'center' },
      D1: { value: 'الربع الثالث', bold: true, bg: '#107c41', color: '#ffffff', align: 'center' },
      E1: { value: 'الربع الرابع', bold: true, bg: '#107c41', color: '#ffffff', align: 'center' },
      F1: { value: 'الإجمالي السنوي', bold: true, bg: '#0e6b37', color: '#ffffff', align: 'center' },

      A2: { value: 'المبيعات والخدمات', bold: true },
      B2: { value: 12500, format: 'currency' },
      C2: { value: 14200, format: 'currency' },
      D2: { value: 16800, format: 'currency' },
      E2: { value: 19500, format: 'currency' },
      F2: { formula: '=SUM(B2:E2)', format: 'currency', bold: true, bg: '#f0fdf4' },

      A3: { value: 'التسويق والإعلانات' },
      B3: { value: 3200, format: 'currency' },
      C3: { value: 4100, format: 'currency' },
      D3: { value: 3800, format: 'currency' },
      E3: { value: 4500, format: 'currency' },
      F3: { formula: '=SUM(B3:E3)', format: 'currency', bold: true, bg: '#f0fdf4' },

      A4: { value: 'تكاليف التشغيل والدعم' },
      B4: { value: 4500, format: 'currency' },
      C4: { value: 4800, format: 'currency' },
      D4: { value: 5100, format: 'currency' },
      E4: { value: 5300, format: 'currency' },
      F4: { formula: '=SUM(B4:E4)', format: 'currency', bold: true, bg: '#f0fdf4' },

      A5: { value: 'صافي الأرباح', bold: true, bg: '#e2e8f0', color: '#0f172a' },
      B5: { formula: '=B2-(B3+B4)', format: 'currency', bold: true },
      C5: { formula: '=C2-(C3+C4)', format: 'currency', bold: true },
      D5: { formula: '=D2-(D3+D4)', format: 'currency', bold: true },
      E5: { formula: '=E2-(E3+E4)', format: 'currency', bold: true },
      F5: { formula: '=SUM(B5:E5)', format: 'currency', bold: true, bg: '#dcfce7', color: '#166534' },
    }
  }
};

const NUM_ROWS = 60;
const NUM_COLS = 26;

export const ExcelGrid: React.FC<Props> = ({
  initialSheets,
  onSheetsChange,
  onOpenBackstage,
  onNotify
}) => {
  // Sheets state
  const [workbook, setWorkbook] = useState<WorkbookData>(() => {
    return initialSheets || AppStorage.get(AppStorage.KEYS.SHEETS_DATA, DEFAULT_WORKBOOK);
  });
  const [activeSheetId, setActiveSheetId] = useState<string>(() => {
    return AppStorage.get(AppStorage.KEYS.ACTIVE_SHEET_KEY, Object.keys(workbook)[0] || 'sheet1');
  });

  const currentSheet = workbook[activeSheetId] || workbook[Object.keys(workbook)[0]] || DEFAULT_WORKBOOK.sheet1;
  const sheetData = currentSheet.data || {};

  // Active Ribbon Tab
  const [activeTab, setActiveTab] = useState('home');

  // Cell Selection State
  const [selectedCell, setSelectedCell] = useState<string>('A1');
  const [selectedRange, setSelectedRange] = useState<string[]>(['A1']);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionAnchor, setSelectionAnchor] = useState<string>('A1');

  // Inline Cell Editing
  const [isEditingCell, setIsEditingCell] = useState(false);
  const [formulaInput, setFormulaInput] = useState('');

  // Undo / Redo history
  const [undoStack, setUndoStack] = useState<WorkbookData[]>([]);
  const [redoStack, setRedoStack] = useState<WorkbookData[]>([]);

  // Format painter
  const [isFormatPainterActive, setIsFormatPainterActive] = useState(false);
  const [formatPainterSource, setFormatPainterSource] = useState<SheetCell | null>(null);

  // Clipboard for copy/cut
  const [clipboardData, setClipboardData] = useState<{ cells: { [rel: string]: SheetCell }; mode: 'copy' | 'cut' } | null>(null);

  // View settings
  const [showFormulaBar, setShowFormulaBar] = useState(true);
  const [showGridlines, setShowGridlines] = useState(true);
  const [showHeadings, setShowHeadings] = useState(true);
  const [showFormulasMode, setShowFormulasMode] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isRTL, setIsRTL] = useState(currentSheet.rtl ?? true);
  const [freezeState, setFreezeState] = useState<'none' | 'topRow' | 'firstCol' | 'selection'>('none');

  // Modals state
  const [isInsertFnOpen, setIsInsertFnOpen] = useState(false);
  const [isNameMgrOpen, setIsNameMgrOpen] = useState(false);
  const [isDataValOpen, setIsDataValOpen] = useState(false);
  const [isRemoveDupOpen, setIsRemoveDupOpen] = useState(false);
  const [isGoalSeekOpen, setIsGoalSeekOpen] = useState(false);
  const [isTextToColsOpen, setIsTextToColsOpen] = useState(false);
  const [isPivotOpen, setIsPivotOpen] = useState(false);
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);
  const [chartModalType, setChartModalType] = useState<'column' | 'line' | 'pie' | 'area'>('column');
  const [isCondFormatOpen, setIsCondFormatOpen] = useState(false);
  const [isProtectOpen, setIsProtectOpen] = useState(false);
  const [isFindReplaceOpen, setIsFindReplaceOpen] = useState(false);
  const [isSpellCheckOpen, setIsSpellCheckOpen] = useState(false);

  // Named ranges & rules
  const [namedRanges, setNamedRanges] = useState<NamedRange[]>(() => {
    return AppStorage.get(AppStorage.KEYS.NAMED_RANGES, [
      { name: 'المبيعات', refersTo: 'ورقة 1!$B$2:$E$2', scope: 'المصنف' },
      { name: 'الأرباح', refersTo: 'ورقة 1!$B$5:$E$5', scope: 'المصنف' },
    ]);
  });
  const [charts, setCharts] = useState<SheetChart[]>(() => {
    return AppStorage.get(`${AppStorage.KEYS.CHARTS}_${activeSheetId}`, []);
  });
  const [conditionalRules, setConditionalRules] = useState<ConditionalRule[]>([]);
  const [dataValidationRules, setDataValidationRules] = useState<DataValidationRule[]>([]);
  const [isSheetProtected, setIsSheetProtected] = useState(false);
  const [sheetPassword, setSheetPassword] = useState('');

  // AutoFilter
  const [filterState, setFilterState] = useState<FilterState>({
    enabled: false,
    headerRow: 1,
    filters: {}
  });
  const [activeFilterCol, setActiveFilterCol] = useState<string | null>(null);

  // Refs
  const formulaInputRef = useRef<HTMLInputElement>(null);
  const cellEditorRef = useRef<HTMLInputElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync with initialSheets
  useEffect(() => {
    if (initialSheets && Object.keys(initialSheets).length > 0) {
      setWorkbook(initialSheets);
      if (!initialSheets[activeSheetId]) {
        setActiveSheetId(Object.keys(initialSheets)[0]);
      }
    }
  }, [initialSheets]);

  // Sync formula bar input when selectedCell changes
  useEffect(() => {
    const cell = sheetData[selectedCell];
    const val = cell?.formula || (cell?.value !== undefined ? String(cell.value) : '');
    setFormulaInput(val);
    setIsEditingCell(false);
  }, [selectedCell, activeSheetId]);

  // Save changes to storage and notify
  const updateWorkbook = useCallback((newWb: WorkbookData, addToHistory = true) => {
    if (addToHistory) {
      setUndoStack(prev => [...prev.slice(-20), workbook]);
      setRedoStack([]);
    }
    setWorkbook(newWb);
    AppStorage.set(AppStorage.KEYS.SHEETS_DATA, newWb);
    onSheetsChange?.(newWb);
  }, [workbook, onSheetsChange]);

  const updateCurrentSheetData = useCallback((newData: SheetData, addToHistory = true) => {
    const updatedSheet: SheetTab = {
      ...currentSheet,
      data: newData,
      rtl: isRTL,
    };
    const newWb: WorkbookData = {
      ...workbook,
      [activeSheetId]: updatedSheet,
    };
    updateWorkbook(newWb, addToHistory);
  }, [currentSheet, isRTL, workbook, activeSheetId, updateWorkbook]);

  // Calculate stats for status bar
  const selectionStats = useMemo(() => {
    if (selectedRange.length <= 1) return null;
    let sum = 0;
    let count = 0;
    let numCount = 0;
    const nums: number[] = [];

    selectedRange.forEach(cellKey => {
      const cell = sheetData[cellKey];
      if (cell && cell.value !== undefined && cell.value !== '') {
        count++;
        const raw = getCellValue(cellKey, sheetData);
        const n = parseFloat(String(raw).replace(/[^0-9.-]+/g, ''));
        if (!isNaN(n)) {
          numCount++;
          sum += n;
          nums.push(n);
        }
      }
    });

    if (numCount === 0) return { count, numCount: 0, sum: 0, avg: 0, min: 0, max: 0 };
    return {
      count,
      numCount,
      sum: Math.round(sum * 100) / 100,
      avg: Math.round((sum / numCount) * 100) / 100,
      min: Math.min(...nums),
      max: Math.max(...nums),
    };
  }, [selectedRange, sheetData]);

  // Commit value or formula from formula bar or inline editor
  const commitCellEdit = useCallback((val: string) => {
    if (isSheetProtected) {
      alert('ورقة العمل محمية ضد التعديل. يرجى إلغاء الحماية أولاً.');
      return;
    }

    const trimmed = val.trim();
    const isFormula = trimmed.startsWith('=');
    const computedVal = isFormula ? evaluateFormula(trimmed, sheetData, new Set(), namedRanges) : trimmed;

    // Convert to number if numeric
    let finalVal: any = computedVal;
    if (!isFormula && trimmed !== '') {
      const num = Number(trimmed);
      if (!isNaN(num)) finalVal = num;
    }

    const currentCellObj = sheetData[selectedCell] || {};
    const updatedCell: SheetCell = {
      ...currentCellObj,
      value: finalVal,
      formula: isFormula ? trimmed : undefined,
    };

    const newData: SheetData = {
      ...sheetData,
      [selectedCell]: updatedCell,
    };

    // Recompute dependent cells
    Object.keys(newData).forEach(k => {
      if (newData[k]?.formula && k !== selectedCell) {
        newData[k] = {
          ...newData[k],
          value: evaluateFormula(newData[k].formula!, newData, new Set(), namedRanges),
        };
      }
    });

    updateCurrentSheetData(newData);
    setIsEditingCell(false);
  }, [isSheetProtected, sheetData, selectedCell, namedRanges, updateCurrentSheetData]);

  // Keyboard navigation & shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditingCell) {
        if (e.key === 'Enter') {
          e.preventDefault();
          commitCellEdit(formulaInput);
          // Move down
          const coord = parseCellCoordinate(selectedCell);
          const next = `${coord.col}${coord.row + 1}`;
          setSelectedCell(next);
          setSelectedRange([next]);
        } else if (e.key === 'Escape') {
          setIsEditingCell(false);
          setFormulaInput(sheetData[selectedCell]?.formula || String(sheetData[selectedCell]?.value || ''));
        }
        return;
      }

      // Check if user is typing into formula bar
      if (document.activeElement === formulaInputRef.current) {
        if (e.key === 'Enter') {
          e.preventDefault();
          commitCellEdit(formulaInput);
        }
        return;
      }

      // Undo (Ctrl+Z)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (undoStack.length > 0) {
          const prev = undoStack[undoStack.length - 1];
          setRedoStack(r => [...r, workbook]);
          setUndoStack(u => u.slice(0, -1));
          setWorkbook(prev);
          AppStorage.set(AppStorage.KEYS.SHEETS_DATA, prev);
          onSheetsChange?.(prev);
        }
        return;
      }

      // Redo (Ctrl+Y or Ctrl+Shift+Z)
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) {
        e.preventDefault();
        if (redoStack.length > 0) {
          const next = redoStack[redoStack.length - 1];
          setUndoStack(u => [...u, workbook]);
          setRedoStack(r => r.slice(0, -1));
          setWorkbook(next);
          AppStorage.set(AppStorage.KEYS.SHEETS_DATA, next);
          onSheetsChange?.(next);
        }
        return;
      }

      // Copy (Ctrl+C)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        handleCopy();
        return;
      }

      // Cut (Ctrl+X)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'x') {
        e.preventDefault();
        handleCut();
        return;
      }

      // Paste (Ctrl+V)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        handlePaste();
        return;
      }

      // Bold (Ctrl+B)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        handleUpdateStyle('bold', !sheetData[selectedCell]?.bold);
        return;
      }

      // Italic (Ctrl+I)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'i') {
        e.preventDefault();
        handleUpdateStyle('italic', !sheetData[selectedCell]?.italic);
        return;
      }

      // Underline (Ctrl+U)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'u') {
        e.preventDefault();
        handleUpdateStyle('underline', !sheetData[selectedCell]?.underline);
        return;
      }

      // Find (Ctrl+F)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setIsFindReplaceOpen(true);
        return;
      }

      // Recalculate (F9)
      if (e.key === 'F9') {
        e.preventDefault();
        handleRecalculateAll();
        return;
      }

      // Start editing (F2)
      if (e.key === 'F2') {
        e.preventDefault();
        setIsEditingCell(true);
        setTimeout(() => cellEditorRef.current?.focus(), 20);
        return;
      }

      // Delete / Backspace
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (!isSheetProtected) {
          e.preventDefault();
          handleClearContents();
        }
        return;
      }

      // Arrow keys navigation
      const coord = parseCellCoordinate(selectedCell);
      let newCol = coord.colIdx;
      let newRow = coord.row;

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        newRow = Math.max(1, newRow - 1);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        newRow = Math.min(NUM_ROWS, newRow + 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        // In RTL, ArrowRight moves to next column or previous depending on dir
        newCol = isRTL ? Math.max(0, newCol - 1) : Math.min(NUM_COLS - 1, newCol + 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        newCol = isRTL ? Math.min(NUM_COLS - 1, newCol + 1) : Math.max(0, newCol - 1);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        newRow = Math.min(NUM_ROWS, newRow + 1);
      } else if (e.key === 'Tab') {
        e.preventDefault();
        newCol = e.shiftKey ? Math.max(0, newCol - 1) : Math.min(NUM_COLS - 1, newCol + 1);
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        // Direct typing into cell starts editing
        setIsEditingCell(true);
        setFormulaInput(e.key);
        setTimeout(() => {
          if (cellEditorRef.current) {
            cellEditorRef.current.value = e.key;
            cellEditorRef.current.focus();
          }
        }, 10);
        return;
      } else {
        return;
      }

      const nextCell = `${colIndexToLetter(newCol)}${newRow}`;
      setSelectedCell(nextCell);
      if (e.shiftKey) {
        // Range select from anchor
        const range = expandRange(`${selectionAnchor}:${nextCell}`);
        setSelectedRange(range);
      } else {
        setSelectionAnchor(nextCell);
        setSelectedRange([nextCell]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isEditingCell,
    formulaInput,
    selectedCell,
    selectionAnchor,
    undoStack,
    redoStack,
    workbook,
    sheetData,
    isSheetProtected,
    isRTL,
    commitCellEdit
  ]);

  // Handle cell click & format painter application
  const handleCellClick = (cellKey: string, e: React.MouseEvent) => {
    if (isFormatPainterActive && formatPainterSource) {
      // Apply format to this cell or range
      const updatedData: SheetData = { ...sheetData };
      const targets = selectedRange.length > 0 ? selectedRange : [cellKey];
      targets.forEach(k => {
        updatedData[k] = {
          ...updatedData[k] || { value: '' },
          bold: formatPainterSource.bold,
          italic: formatPainterSource.italic,
          underline: formatPainterSource.underline,
          strikethrough: formatPainterSource.strikethrough,
          fontFamily: formatPainterSource.fontFamily,
          fontSize: formatPainterSource.fontSize,
          color: formatPainterSource.color,
          bg: formatPainterSource.bg,
          border: formatPainterSource.border,
          align: formatPainterSource.align,
          verticalAlign: formatPainterSource.verticalAlign,
          format: formatPainterSource.format,
          decimalPlaces: formatPainterSource.decimalPlaces,
        };
      });
      updateCurrentSheetData(updatedData);
      setIsFormatPainterActive(false);
      setFormatPainterSource(null);
      return;
    }

    if (e.shiftKey) {
      const range = expandRange(`${selectionAnchor}:${cellKey}`);
      setSelectedRange(range);
    } else {
      setSelectedCell(cellKey);
      setSelectionAnchor(cellKey);
      setSelectedRange([cellKey]);
    }
  };

  const handleCellDoubleClick = (cellKey: string) => {
    if (isSheetProtected) return;
    setSelectedCell(cellKey);
    setIsEditingCell(true);
    setTimeout(() => {
      cellEditorRef.current?.focus();
      cellEditorRef.current?.select();
    }, 20);
  };

  // Update styles on selected range
  const handleUpdateStyle = (key: keyof SheetCell, value: any) => {
    const updated: SheetData = { ...sheetData };
    selectedRange.forEach(cellKey => {
      updated[cellKey] = {
        ...updated[cellKey] || { value: '' },
        [key]: value,
      };
    });
    updateCurrentSheetData(updated);
  };

  const handleClearFormatting = () => {
    const updated: SheetData = { ...sheetData };
    selectedRange.forEach(cellKey => {
      if (updated[cellKey]) {
        updated[cellKey] = {
          value: updated[cellKey].value,
          formula: updated[cellKey].formula,
        };
      }
    });
    updateCurrentSheetData(updated);
  };

  const handleClearContents = () => {
    const updated: SheetData = { ...sheetData };
    selectedRange.forEach(cellKey => {
      if (updated[cellKey]) {
        delete updated[cellKey];
      }
    });
    updateCurrentSheetData(updated);
  };

  const handleClearAll = () => {
    const updated: SheetData = { ...sheetData };
    selectedRange.forEach(cellKey => {
      delete updated[cellKey];
    });
    updateCurrentSheetData(updated);
  };

  // Copy / Cut / Paste
  const handleCopy = () => {
    const cellsToCopy: { [rel: string]: SheetCell } = {};
    const origin = parseCellCoordinate(selectedRange[0]);
    selectedRange.forEach(c => {
      const coord = parseCellCoordinate(c);
      const relKey = `${coord.colIdx - origin.colIdx},${coord.row - origin.row}`;
      cellsToCopy[relKey] = { ...sheetData[c] || { value: '' } };
    });
    setClipboardData({ cells: cellsToCopy, mode: 'copy' });
    onNotify?.('تم نسخ الخلايا إلى الحافظة', 'info');
  };

  const handleCut = () => {
    handleCopy();
    if (clipboardData) clipboardData.mode = 'cut';
  };

  const handlePaste = (special?: 'values' | 'formats' | 'formulas') => {
    if (!clipboardData) return;
    const dest = parseCellCoordinate(selectedCell);
    const updated: SheetData = { ...sheetData };

    Object.entries(clipboardData.cells).forEach(([rel, sourceCell]) => {
      const [dx, dy] = rel.split(',').map(Number);
      const targetColIdx = dest.colIdx + dx;
      const targetRow = dest.row + dy;
      if (targetColIdx < 0 || targetColIdx >= NUM_COLS || targetRow < 1 || targetRow > NUM_ROWS) return;

      const targetKey = `${colIndexToLetter(targetColIdx)}${targetRow}`;
      const existing = updated[targetKey] || { value: '' };

      if (special === 'values') {
        const val = sourceCell.formula ? evaluateFormula(sourceCell.formula, sheetData, new Set(), namedRanges) : sourceCell.value;
        updated[targetKey] = { ...existing, value: val, formula: undefined };
      } else if (special === 'formats') {
        const { value, formula, ...styles } = sourceCell;
        updated[targetKey] = { ...existing, ...styles };
      } else if (special === 'formulas') {
        updated[targetKey] = { ...existing, formula: sourceCell.formula, value: sourceCell.value };
      } else {
        // Normal paste
        updated[targetKey] = { ...sourceCell };
      }
    });

    if (clipboardData.mode === 'cut') {
      // Clear original cut cells
      setClipboardData(null);
    }

    updateCurrentSheetData(updated);
    onNotify?.('تم اللصق بنجاح', 'success');
  };

  // Insert / Delete row & column
  const handleInsertRow = () => {
    const curRow = parseCellCoordinate(selectedCell).row;
    const updated: SheetData = {};
    Object.entries(sheetData).forEach(([cellKey, cell]) => {
      const coord = parseCellCoordinate(cellKey);
      if (coord.row < curRow) {
        updated[cellKey] = cell;
      } else {
        updated[`${coord.col}${coord.row + 1}`] = cell;
      }
    });
    updateCurrentSheetData(updated);
    onNotify?.(`تم إدراج صف جديد عند الصف ${curRow}`, 'info');
  };

  const handleInsertColumn = () => {
    const curColIdx = parseCellCoordinate(selectedCell).colIdx;
    const updated: SheetData = {};
    Object.entries(sheetData).forEach(([cellKey, cell]) => {
      const coord = parseCellCoordinate(cellKey);
      if (coord.colIdx < curColIdx) {
        updated[cellKey] = cell;
      } else {
        const nextColLetter = colIndexToLetter(coord.colIdx + 1);
        updated[`${nextColLetter}${coord.row}`] = cell;
      }
    });
    updateCurrentSheetData(updated);
    onNotify?.(`تم إدراج عمود جديد عند العمود ${colIndexToLetter(curColIdx)}`, 'info');
  };

  const handleDeleteRow = () => {
    const curRow = parseCellCoordinate(selectedCell).row;
    const updated: SheetData = {};
    Object.entries(sheetData).forEach(([cellKey, cell]) => {
      const coord = parseCellCoordinate(cellKey);
      if (coord.row < curRow) {
        updated[cellKey] = cell;
      } else if (coord.row > curRow) {
        updated[`${coord.col}${coord.row - 1}`] = cell;
      }
    });
    updateCurrentSheetData(updated);
    onNotify?.(`تم حذف الصف ${curRow}`, 'info');
  };

  const handleDeleteColumn = () => {
    const curColIdx = parseCellCoordinate(selectedCell).colIdx;
    const updated: SheetData = {};
    Object.entries(sheetData).forEach(([cellKey, cell]) => {
      const coord = parseCellCoordinate(cellKey);
      if (coord.colIdx < curColIdx) {
        updated[cellKey] = cell;
      } else if (coord.colIdx > curColIdx) {
        const prevColLetter = colIndexToLetter(coord.colIdx - 1);
        updated[`${prevColLetter}${coord.row}`] = cell;
      }
    });
    updateCurrentSheetData(updated);
    onNotify?.(`تم حذف العمود ${colIndexToLetter(curColIdx)}`, 'info');
  };

  // AutoSum function
  const handleAutoSum = (fn: 'SUM' | 'AVERAGE' | 'COUNT' | 'MAX' | 'MIN') => {
    const coord = parseCellCoordinate(selectedCell);
    // Find contiguous range above
    let startRow = coord.row - 1;
    while (startRow >= 1 && sheetData[`${coord.col}${startRow}`]?.value !== undefined && sheetData[`${coord.col}${startRow}`]?.value !== '') {
      startRow--;
    }
    const detectedRange = `${coord.col}${startRow + 1}:${coord.col}${coord.row - 1}`;
    const formulaStr = `=${fn}(${detectedRange})`;
    commitCellEdit(formulaStr);
    onNotify?.(`تم إنشاء معادلة ${fn} تلقائياً: ${formulaStr}`, 'success');
  };

  // Sort
  const handleSort = (dir: 'asc' | 'desc') => {
    const coord = parseCellCoordinate(selectedCell);
    const colIdx = coord.colIdx;

    // Collect all rows with data
    const rowsMap: { [row: number]: { [col: string]: SheetCell } } = {};
    let minRow = 2; // Keep header row intact
    let maxRow = 1;

    Object.entries(sheetData).forEach(([cellKey, cell]) => {
      const c = parseCellCoordinate(cellKey);
      if (c.row >= minRow) {
        if (!rowsMap[c.row]) rowsMap[c.row] = {};
        rowsMap[c.row][c.col] = cell;
        if (c.row > maxRow) maxRow = c.row;
      }
    });

    const rowsArray = Object.keys(rowsMap).map(Number);
    rowsArray.sort((rA, rB) => {
      const cellA = rowsMap[rA]?.[colIndexToLetter(colIdx)];
      const cellB = rowsMap[rB]?.[colIndexToLetter(colIdx)];
      const valA = cellA?.value !== undefined ? cellA.value : '';
      const valB = cellB?.value !== undefined ? cellB.value : '';

      const numA = parseFloat(String(valA));
      const numB = parseFloat(String(valB));
      if (!isNaN(numA) && !isNaN(numB)) {
        return dir === 'asc' ? numA - numB : numB - numA;
      }
      return dir === 'asc'
        ? String(valA).localeCompare(String(valB), 'ar')
        : String(valB).localeCompare(String(valA), 'ar');
    });

    const updated: SheetData = {};
    // Copy headers (row 1)
    Object.entries(sheetData).forEach(([cellKey, cell]) => {
      const c = parseCellCoordinate(cellKey);
      if (c.row < minRow) updated[cellKey] = cell;
    });

    // Write sorted rows
    rowsArray.forEach((originalRow, sortedIndex) => {
      const newRow = minRow + sortedIndex;
      const rowCells = rowsMap[originalRow];
      Object.entries(rowCells).forEach(([col, cell]) => {
        updated[`${col}${newRow}`] = cell;
      });
    });

    updateCurrentSheetData(updated);
    onNotify?.(`تم فرز البيانات ${dir === 'asc' ? 'تصاعدياً (أ-ي)' : 'تنازلياً (ي-أ)'}`, 'success');
  };

  // Toggle AutoFilter
  const handleToggleFilter = () => {
    setFilterState(prev => ({
      ...prev,
      enabled: !prev.enabled,
      headerRow: 1,
    }));
    onNotify?.(filterState.enabled ? 'تم إلغاء التصفية' : 'تم تفعيل أزرار التصفية التلقائية على الصف الأول', 'info');
  };

  // Remove Duplicates
  const handleRemoveDuplicates = (selectedCols: string[]) => {
    const seen = new Set<string>();
    const updated: SheetData = {};
    let duplicatesCount = 0;

    // Header row 1 preserved
    Object.entries(sheetData).forEach(([k, c]) => {
      if (parseCellCoordinate(k).row === 1) updated[k] = c;
    });

    // Group rows
    const rowsMap: { [row: number]: { [col: string]: SheetCell } } = {};
    Object.entries(sheetData).forEach(([k, c]) => {
      const coord = parseCellCoordinate(k);
      if (coord.row > 1) {
        if (!rowsMap[coord.row]) rowsMap[coord.row] = {};
        rowsMap[coord.row][coord.col] = c;
      }
    });

    let newRow = 2;
    Object.keys(rowsMap).map(Number).sort((a, b) => a - b).forEach(r => {
      const rowData = rowsMap[r];
      const key = selectedCols.map(col => String(rowData[col]?.value || '')).join('|||');
      if (seen.has(key)) {
        duplicatesCount++;
      } else {
        seen.add(key);
        Object.entries(rowData).forEach(([col, cell]) => {
          updated[`${col}${newRow}`] = cell;
        });
        newRow++;
      }
    });

    updateCurrentSheetData(updated);
    alert(`تم العثور على ${duplicatesCount} صف مكرر وحذفهم، مع الاحتفاظ بـ ${seen.size} صف فريد.`);
  };

  // Goal Seek solver
  const handleRunGoalSeek = (targetCellKey: string, targetValue: number, changingCellKey: string) => {
    let currentVal = getCellValue(changingCellKey, sheetData);
    let x = parseFloat(String(currentVal)) || 0;
    let step = 1;
    let bestX = x;
    let minDiff = Infinity;

    // Numerical approximation
    for (let iter = 0; iter < 100; iter++) {
      const testData: SheetData = {
        ...sheetData,
        [changingCellKey]: { ...(sheetData[changingCellKey] || {}), value: x }
      };
      // Evaluate target
      const targetFormula = sheetData[targetCellKey]?.formula;
      const result = targetFormula ? evaluateFormula(targetFormula, testData, new Set(), namedRanges) : testData[targetCellKey]?.value;
      const numResult = parseFloat(String(result)) || 0;
      const diff = Math.abs(numResult - targetValue);

      if (diff < minDiff) {
        minDiff = diff;
        bestX = x;
      }

      if (diff < 0.001) break;

      // Adjust x
      if (numResult < targetValue) {
        x += step;
      } else {
        x -= step;
        step *= 0.5;
      }
    }

    const updated: SheetData = {
      ...sheetData,
      [changingCellKey]: { ...(sheetData[changingCellKey] || {}), value: Math.round(bestX * 100) / 100 }
    };
    // Recalculate
    if (updated[targetCellKey]?.formula) {
      updated[targetCellKey] = {
        ...updated[targetCellKey],
        value: evaluateFormula(updated[targetCellKey].formula!, updated, new Set(), namedRanges)
      };
    }

    updateCurrentSheetData(updated);
    alert(`تم التوصل إلى الحل بنجاح!\nالخلية المستهدفة ${targetCellKey} أصبحت: ${targetValue}\nقيمة الخلية المتغيرة ${changingCellKey} هي: ${Math.round(bestX * 100) / 100}`);
  };

  // Text to Columns
  const handleSplitTextToColumns = (delim: string) => {
    const updated: SheetData = { ...sheetData };
    selectedRange.forEach(cellKey => {
      const coord = parseCellCoordinate(cellKey);
      const cell = sheetData[cellKey];
      if (cell && cell.value !== undefined) {
        const parts = String(cell.value).split(delim);
        parts.forEach((part, idx) => {
          const colLetter = colIndexToLetter(coord.colIdx + idx);
          if (coord.colIdx + idx < NUM_COLS) {
            updated[`${colLetter}${coord.row}`] = {
              ...(updated[`${colLetter}${coord.row}`] || {}),
              value: part.trim(),
            };
          }
        });
      }
    });
    updateCurrentSheetData(updated);
    onNotify?.('تم تحويل النص إلى أعمدة بنجاح', 'success');
  };

  // Find & Replace
  const handleFind = (findText: string) => {
    if (!findText) return;
    const keys = Object.keys(sheetData);
    const foundKey = keys.find(k => {
      const val = String(sheetData[k]?.value || '').toLowerCase();
      return val.includes(findText.toLowerCase());
    });
    if (foundKey) {
      setSelectedCell(foundKey);
      setSelectedRange([foundKey]);
      onNotify?.(`تم العثور على التطابق في الخلية ${foundKey}`, 'info');
    } else {
      alert(`لم يتم العثور على "${findText}" في ورقة العمل.`);
    }
  };

  const handleReplace = (findText: string, replaceText: string, replaceAll: boolean) => {
    if (!findText) return;
    const updated: SheetData = { ...sheetData };
    let count = 0;

    Object.keys(updated).forEach(k => {
      const val = String(updated[k]?.value || '');
      if (val.includes(findText)) {
        if (replaceAll || count === 0) {
          updated[k] = {
            ...updated[k],
            value: val.replaceAll(findText, replaceText),
          };
          count++;
        }
      }
    });

    if (count > 0) {
      updateCurrentSheetData(updated);
      onNotify?.(`تم استبدال ${count} عنصر بنجاح`, 'success');
    } else {
      alert(`لم يتم العثور على "${findText}" للاستبدال.`);
    }
  };

  // Recalculate all formulas
  const handleRecalculateAll = () => {
    const updated: SheetData = { ...sheetData };
    Object.keys(updated).forEach(k => {
      if (updated[k]?.formula) {
        updated[k] = {
          ...updated[k],
          value: evaluateFormula(updated[k].formula!, updated, new Set(), namedRanges)
        };
      }
    });
    updateCurrentSheetData(updated, false);
    onNotify?.('تمت إعادة حساب كافة المعادلات والصيغ بنجاح', 'success');
  };

  // Insert Image into Sheet
  const handleInsertImage = () => {
    fileInputRef.current?.click();
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const url = reader.result as string;
        // Embed image inside current cell or as floating image
        const updated: SheetData = {
          ...sheetData,
          [selectedCell]: {
            ...(sheetData[selectedCell] || {}),
            value: `[صورة: ${file.name}]`,
            bg: '#f8fafc',
            comment: `صورة مدرجة: ${url}`,
          }
        };
        updateCurrentSheetData(updated);
        onNotify?.('تم إدراج الصورة بنجاح في الخلية المحددة', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  // Create Table formatting
  const handleCreateTable = () => {
    if (selectedRange.length <= 1) {
      alert('يرجى تحديد نطاق من الخلايا لتنسيقه كجدول رسمي.');
      return;
    }
    const updated: SheetData = { ...sheetData };
    const minRow = Math.min(...selectedRange.map(c => parseCellCoordinate(c).row));

    selectedRange.forEach(cellKey => {
      const coord = parseCellCoordinate(cellKey);
      if (coord.row === minRow) {
        // Table Header
        updated[cellKey] = {
          ...(updated[cellKey] || { value: `عمود ${coord.col}` }),
          bold: true,
          bg: '#107c41',
          color: '#ffffff',
          align: 'center',
          border: 'all',
        };
      } else {
        // Alternating zebra rows
        const isEven = (coord.row - minRow) % 2 === 0;
        updated[cellKey] = {
          ...(updated[cellKey] || { value: '' }),
          bg: isEven ? '#f0fdf4' : '#ffffff',
          border: 'all',
        };
      }
    });

    updateCurrentSheetData(updated);
    setFilterState({ enabled: true, headerRow: minRow, filters: {} });
    onNotify?.('تم إنشاء وتنسيق الجدول وتفعيل أزرار التصفية', 'success');
  };

  // Sparklines
  const handleInsertSparkline = (type: 'line' | 'bar') => {
    const range = prompt('أدخل نطاق البيانات لإنشاء سباركلاين مصغر في الخلية (مثال: B2:E2):', 'B2:E2');
    if (range) {
      handleUpdateStyle('sparkline', type);
      handleUpdateStyle('sparklineRange', range.toUpperCase());
      onNotify?.(`تم إدراج سباركلاين (${type}) بالاعتماد على النطاق ${range}`, 'success');
    }
  };

  // Sheet Tabs Management
  const handleAddSheetTab = () => {
    const count = Object.keys(workbook).length + 1;
    const newId = `sheet_${Date.now()}`;
    const newSheet: SheetTab = {
      id: newId,
      label: `ورقة ${count}`,
      rtl: isRTL,
      data: {}
    };
    const newWb = { ...workbook, [newId]: newSheet };
    updateWorkbook(newWb);
    setActiveSheetId(newId);
    AppStorage.set(AppStorage.KEYS.ACTIVE_SHEET_KEY, newId);
    onNotify?.(`تمت إضافة ورقة عمل جديدة "${newSheet.label}"`, 'success');
  };

  const handleRenameSheetTab = (sheetId: string) => {
    const currentName = workbook[sheetId]?.label || '';
    const newName = prompt('تسمية ورقة العمل:', currentName);
    if (newName && newName.trim()) {
      const newWb = {
        ...workbook,
        [sheetId]: { ...workbook[sheetId], label: newName.trim() }
      };
      updateWorkbook(newWb);
    }
  };

  const handleDeleteSheetTab = (sheetId: string) => {
    if (Object.keys(workbook).length <= 1) {
      alert('يجب أن يحتوي المصنف على ورقة عمل واحدة على الأقل.');
      return;
    }
    if (confirm(`هل أنت متأكد من حذف "${workbook[sheetId]?.label}"؟`)) {
      const { [sheetId]: removed, ...rest } = workbook;
      updateWorkbook(rest);
      const nextId = Object.keys(rest)[0];
      setActiveSheetId(nextId);
      AppStorage.set(AppStorage.KEYS.ACTIVE_SHEET_KEY, nextId);
    }
  };

  // XLSX Export
  const handleExportXLSX = () => {
    const wb = XLSX.utils.book_new();
    Object.entries(workbook).forEach(([sId, tab]) => {
      const aoa: any[][] = [];
      Object.entries(tab.data || {}).forEach(([cellKey, cell]) => {
        const coord = parseCellCoordinate(cellKey);
        while (aoa.length <= coord.row - 1) aoa.push([]);
        while (aoa[coord.row - 1].length <= coord.colIdx) aoa[coord.row - 1].push('');
        aoa[coord.row - 1][coord.colIdx] = cell.formula || cell.value || '';
      });
      const ws = XLSX.utils.aoa_to_sheet(aoa);
      XLSX.utils.book_append_sheet(wb, ws, tab.label || sId);
    });
    XLSX.writeFile(wb, 'مصنف_Excel_السيادي.xlsx');
    onNotify?.('تم تصدير ملف Excel (.xlsx) بنجاح!', 'success');
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white select-none">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Excel Ribbon */}
      <ExcelRibbon
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenFileMenu={onOpenBackstage}
        selectedCellKey={selectedCell}
        currentCell={sheetData[selectedCell]}
        isFormatPainterActive={isFormatPainterActive}
        onToggleFormatPainter={() => {
          if (!isFormatPainterActive) {
            setIsFormatPainterActive(true);
            setFormatPainterSource({ ...sheetData[selectedCell] || {} });
            onNotify?.('تم نسخ التنسيق. انقر على أي خلية لتطبيقه.', 'info');
          } else {
            setIsFormatPainterActive(false);
            setFormatPainterSource(null);
          }
        }}
        onCut={handleCut}
        onCopy={handleCopy}
        onPaste={handlePaste}
        onUpdateStyle={handleUpdateStyle}
        onClearFormatting={handleClearFormatting}
        onClearContents={handleClearContents}
        onClearAll={handleClearAll}
        onInsertRow={handleInsertRow}
        onInsertColumn={handleInsertColumn}
        onDeleteRow={handleDeleteRow}
        onDeleteColumn={handleDeleteColumn}
        onAutoSum={handleAutoSum}
        onSort={handleSort}
        onToggleFilter={handleToggleFilter}
        isFilterActive={filterState.enabled}
        onOpenFindReplace={() => setIsFindReplaceOpen(true)}
        onOpenInsertFunction={() => setIsInsertFnOpen(true)}
        onInsertSparkline={handleInsertSparkline}
        onOpenConditionalFormatting={() => setIsCondFormatOpen(true)}
        onOpenDataValidation={() => setIsDataValOpen(true)}
        onOpenRemoveDuplicates={() => setIsRemoveDupOpen(true)}
        onOpenTextToColumns={() => setIsTextToColsOpen(true)}
        onOpenGoalSeek={() => setIsGoalSeekOpen(true)}
        onOpenNameManager={() => setIsNameMgrOpen(true)}
        onOpenPivotTable={() => setIsPivotOpen(true)}
        onOpenChartModal={(type) => {
          if (type) setChartModalType(type);
          setIsChartModalOpen(true);
        }}
        onOpenProtectSheet={() => setIsProtectOpen(true)}
        isSheetProtected={isSheetProtected}
        onOpenSpellCheck={() => setIsSpellCheckOpen(true)}
        onAddComment={() => {
          const author = 'مستخدم Sovereign';
          const existing = sheetData[selectedCell]?.comment || '';
          const comm = prompt('أدخل التعليق على هذه الخلية:', existing);
          if (comm !== null) {
            handleUpdateStyle('comment', comm);
            handleUpdateStyle('commentAuthor', author);
            onNotify?.('تم حفظ التعليق على الخلية', 'success');
          }
        }}
        onDeleteComment={() => {
          handleUpdateStyle('comment', undefined);
          handleUpdateStyle('commentAuthor', undefined);
          onNotify?.('تم حذف التعليق', 'info');
        }}
        showGridlines={showGridlines}
        onToggleGridlines={() => setShowGridlines(!showGridlines)}
        showHeadings={showHeadings}
        onToggleHeadings={() => setShowHeadings(!showHeadings)}
        showFormulaBar={showFormulaBar}
        onToggleFormulaBar={() => setShowFormulaBar(!showFormulaBar)}
        showFormulasMode={showFormulasMode}
        onToggleShowFormulas={() => setShowFormulasMode(!showFormulasMode)}
        isRTL={isRTL}
        onToggleRTL={() => setIsRTL(!isRTL)}
        freezeState={freezeState}
        onSetFreezePanes={setFreezeState}
        zoomLevel={zoomLevel}
        onSetZoomLevel={setZoomLevel}
        onRecalculateAll={handleRecalculateAll}
        onInsertImage={handleInsertImage}
        onCreateTable={handleCreateTable}
      />

      {/* Formula Bar */}
      {showFormulaBar && (
        <div className="flex items-center gap-1.5 px-3 py-1 bg-[#f8f9fa] border-b border-gray-300 text-xs text-gray-700 shrink-0">
          {/* Active Cell Reference */}
          <div className="px-2 py-1 bg-white border border-gray-300 rounded font-mono font-bold text-center min-w-[50px] shadow-2xs">
            {selectedCell}
          </div>

          {/* Action icons */}
          <div className="flex items-center gap-0.5 border-x border-gray-300 px-1">
            <button
              onClick={() => {
                setFormulaInput(sheetData[selectedCell]?.formula || String(sheetData[selectedCell]?.value || ''));
                setIsEditingCell(false);
              }}
              className="p-1 hover:bg-red-50 hover:text-red-600 rounded cursor-pointer"
              title="إلغاء (Escape)"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => commitCellEdit(formulaInput)}
              className="p-1 hover:bg-emerald-50 hover:text-emerald-600 rounded cursor-pointer"
              title="تثبيت (Enter)"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsInsertFnOpen(true)}
              className="p-1 hover:bg-gray-200 rounded font-serif italic font-bold text-xs cursor-pointer text-gray-700"
              title="إدراج دالة (fx)"
            >
              fx
            </button>
          </div>

          {/* Formula Text Input */}
          <input
            ref={formulaInputRef}
            type="text"
            value={formulaInput}
            onChange={e => setFormulaInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                commitCellEdit(formulaInput);
              }
            }}
            placeholder="اكتب قيمة أو معادلة رياضية تبدأ بعلامة = (مثال: =SUM(B2:E2))..."
            className="flex-1 bg-white border border-gray-300 rounded px-2.5 py-1 text-xs outline-none focus:border-[#107c41] font-mono shadow-2xs"
          />
        </div>
      )}

      {/* Spreadsheet Grid Container */}
      <div
        ref={gridContainerRef}
        className="flex-1 overflow-auto relative bg-[#e5e7eb]"
        style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: isRTL ? 'top right' : 'top left' }}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="inline-block min-w-full bg-white relative">
          <table className="border-collapse table-fixed select-none">
            {/* Table Header: Column Letters */}
            {showHeadings && (
              <thead>
                <tr className="bg-[#f3f2f1] text-[#323130] text-[11px] font-semibold border-b border-gray-300">
                  {/* Top Corner Cell */}
                  <th className="w-10 min-w-10 h-6 border-l border-r border-gray-300 bg-[#e1dfdd] text-center sticky top-0 z-20" />

                  {/* Column Letter Headers */}
                  {Array.from({ length: NUM_COLS }).map((_, cIdx) => {
                    const colLetter = colIndexToLetter(cIdx);
                    const isColSelected = selectedCell.startsWith(colLetter);
                    const isFrozen = freezeState === 'firstCol' && cIdx === 0;

                    return (
                      <th
                        key={colLetter}
                        className={`h-6 border-l border-r border-gray-300 font-mono text-center font-bold px-2 py-0.5 sticky top-0 z-10 transition ${
                          isFrozen ? 'sticky bg-amber-50' : 'bg-[#f3f2f1]'
                        } ${isColSelected ? 'bg-[#c7e0f4] text-[#004578]' : 'hover:bg-gray-200'}`}
                        style={{ width: 95, minWidth: 95 }}
                      >
                        <div className="flex items-center justify-center relative group">
                          <span>{colLetter}</span>
                          {/* Filter icon if AutoFilter is enabled */}
                          {filterState.enabled && (
                            <button
                              onClick={() => {
                                handleSort(filterState.filters[colLetter]?.active ? 'desc' : 'asc');
                              }}
                              className="mr-1 p-0.5 rounded hover:bg-gray-300 text-gray-600"
                              title={`تصفية العمود ${colLetter}`}
                            >
                              <Filter className="w-2.5 h-2.5 text-blue-600" />
                            </button>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
            )}

            {/* Table Body: Rows and Cells */}
            <tbody>
              {Array.from({ length: NUM_ROWS }).map((_, rIdx) => {
                const rowNum = rIdx + 1;
                const isFrozenRow = freezeState === 'topRow' && rowNum === 1;

                return (
                  <tr key={rowNum} className={`h-6 ${isFrozenRow ? 'sticky top-6 z-10 bg-amber-50' : ''}`}>
                    {/* Row Number Header */}
                    {showHeadings && (
                      <td
                        className={`w-10 min-w-10 text-center font-mono text-[10px] text-gray-600 bg-[#f3f2f1] border-b border-l border-r border-gray-300 font-bold sticky left-0 z-10 select-none ${
                          selectedCell.endsWith(String(rowNum)) ? 'bg-[#c7e0f4] text-[#004578]' : 'hover:bg-gray-200'
                        }`}
                      >
                        {rowNum}
                      </td>
                    )}

                    {/* Row Cells */}
                    {Array.from({ length: NUM_COLS }).map((_, cIdx) => {
                      const colLetter = colIndexToLetter(cIdx);
                      const cellKey = `${colLetter}${rowNum}`;
                      const cell = sheetData[cellKey];

                      // Merge handling
                      if (cell?.mergedWith) {
                        return null; // Covered by parent merge cell
                      }

                      const isSelected = selectedCell === cellKey;
                      const isInRange = selectedRange.includes(cellKey);
                      const isEditing = isSelected && isEditingCell;

                      // Display Value
                      let displayVal = '';
                      if (showFormulasMode && cell?.formula) {
                        displayVal = cell.formula;
                      } else {
                        const rawVal = getCellValue(cellKey, sheetData, new Set(), namedRanges);
                        displayVal = formatCellValue(cell, rawVal);
                      }

                      // Check conditional formatting
                      let appliedBg = cell?.bg;
                      let appliedColor = cell?.color;
                      conditionalRules.forEach(rule => {
                        if (expandRange(rule.range).includes(cellKey)) {
                          const n = parseFloat(String(getCellValue(cellKey, sheetData)));
                          const v1 = parseFloat(rule.val1);
                          if (rule.type === 'greater' && n > v1) {
                            appliedBg = rule.bg;
                            appliedColor = rule.color;
                          } else if (rule.type === 'less' && n < v1) {
                            appliedBg = rule.bg;
                            appliedColor = rule.color;
                          } else if (rule.type === 'equal' && n === v1) {
                            appliedBg = rule.bg;
                            appliedColor = rule.color;
                          }
                        }
                      });

                      // Border styles
                      let borderClasses = showGridlines ? 'border border-[#e1dfdd]' : 'border border-transparent';
                      if (cell?.border === 'all') borderClasses = 'border border-gray-600';
                      else if (cell?.border === 'box') borderClasses = 'border-2 border-gray-800';
                      else if (cell?.border === 'thick-bottom') borderClasses = 'border-b-2 border-b-gray-800';
                      else if (cell?.border === 'double-bottom') borderClasses = 'border-b-4 border-b-double border-b-gray-800';
                      else if (cell?.border === 'bottom') borderClasses = 'border-b border-b-gray-800';
                      else if (cell?.border === 'none') borderClasses = 'border-none';

                      return (
                        <td
                          key={cellKey}
                          onClick={e => handleCellClick(cellKey, e)}
                          onDoubleClick={() => handleCellDoubleClick(cellKey)}
                          colSpan={cell?.mergeColSpan || 1}
                          rowSpan={cell?.mergeRowSpan || 1}
                          className={`h-6 px-1.5 py-0.5 text-xs transition-none relative outline-none select-none ${borderClasses} ${
                            isInRange && !isSelected ? 'bg-[#e7f1fb]/70' : ''
                          } ${isSelected ? 'ring-2 ring-[#107c41] ring-inset z-10' : ''}`}
                          style={{
                            fontFamily: cell?.fontFamily || 'inherit',
                            fontSize: cell?.fontSize ? `${cell.fontSize}px` : '12px',
                            fontWeight: cell?.bold ? 'bold' : 'normal',
                            fontStyle: cell?.italic ? 'italic' : 'normal',
                            textDecoration: [
                              cell?.underline ? 'underline' : '',
                              cell?.strikethrough ? 'line-through' : ''
                            ].filter(Boolean).join(' ') || undefined,
                            textAlign: cell?.align || (typeof cell?.value === 'number' ? 'right' : 'right'),
                            verticalAlign: cell?.verticalAlign || 'middle',
                            backgroundColor: isSelected ? undefined : appliedBg,
                            color: appliedColor || '#242424',
                            whiteSpace: cell?.wrapText ? 'normal' : 'nowrap',
                          }}
                        >
                          {/* Inline cell editing input */}
                          {isEditing ? (
                            <input
                              ref={cellEditorRef}
                              type="text"
                              defaultValue={formulaInput}
                              onChange={e => setFormulaInput(e.target.value)}
                              onBlur={() => commitCellEdit(formulaInput)}
                              className="w-full h-full bg-white outline-none border-none p-0 text-xs font-mono"
                              autoFocus
                            />
                          ) : (
                            <div className="truncate w-full h-full flex items-center justify-between">
                              {/* Sparkline mini chart */}
                              {cell?.sparkline ? (
                                <div className="w-full h-4 flex items-center justify-center">
                                  {cell.sparkline === 'line' ? (
                                    <svg className="w-full h-4 stroke-emerald-600 fill-none" viewBox="0 0 100 20">
                                      <polyline points="0,15 25,5 50,12 75,3 100,8" strokeWidth="2" />
                                    </svg>
                                  ) : (
                                    <div className="flex items-end gap-1 h-3 w-full justify-center">
                                      <div className="w-1.5 bg-blue-500 h-2 rounded-xs" />
                                      <div className="w-1.5 bg-blue-500 h-3 rounded-xs" />
                                      <div className="w-1.5 bg-blue-500 h-1 rounded-xs" />
                                      <div className="w-1.5 bg-blue-500 h-2.5 rounded-xs" />
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="truncate">{displayVal}</span>
                              )}

                              {/* Comment indicator (red triangle in top right/left) */}
                              {cell?.comment && (
                                <div
                                  className="absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-bl-sm cursor-help"
                                  title={`تعليق (${cell.commentAuthor || 'مستخدم'}): ${cell.comment}`}
                                />
                              )}
                            </div>
                          )}

                          {/* Fill handle at bottom corner of active selection */}
                          {isSelected && !isEditing && (
                            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#107c41] border border-white cursor-crosshair z-20" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Floating Interactive Charts */}
          {charts.map(chart => (
            <div
              key={chart.id}
              className="absolute bg-white rounded-lg shadow-xl border-2 border-emerald-600 overflow-hidden z-20 p-3 select-none"
              style={{ left: chart.x, top: chart.y, width: chart.width, height: chart.height }}
            >
              <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-2 bg-gray-50 -m-3 p-2 px-3">
                <div className="flex items-center gap-1.5 font-bold text-xs text-gray-800">
                  <Move className="w-3.5 h-3.5 text-gray-400 cursor-move" />
                  <span>{chart.title}</span>
                  <span className="text-[10px] text-gray-400 font-mono">({chart.range})</span>
                </div>
                <button
                  onClick={() => {
                    const filtered = charts.filter(c => c.id !== chart.id);
                    setCharts(filtered);
                    AppStorage.set(`${AppStorage.KEYS.CHARTS}_${activeSheetId}`, filtered);
                  }}
                  className="p-1 hover:bg-red-50 text-red-500 rounded cursor-pointer"
                  title="حذف المخطط"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Chart SVG Rendering */}
              <div className="w-full h-[calc(100%-35px)] flex flex-col items-center justify-center">
                {chart.type === 'column' && (
                  <div className="w-full h-full flex items-end justify-around gap-2 px-4 pb-2 pt-4">
                    <div className="flex-1 bg-emerald-600 rounded-t-sm h-[60%] flex items-center justify-center text-white text-[9px] font-bold">Q1</div>
                    <div className="flex-1 bg-emerald-500 rounded-t-sm h-[75%] flex items-center justify-center text-white text-[9px] font-bold">Q2</div>
                    <div className="flex-1 bg-emerald-600 rounded-t-sm h-[85%] flex items-center justify-center text-white text-[9px] font-bold">Q3</div>
                    <div className="flex-1 bg-emerald-700 rounded-t-sm h-[95%] flex items-center justify-center text-white text-[9px] font-bold">Q4</div>
                  </div>
                )}
                {chart.type === 'line' && (
                  <svg className="w-full h-full stroke-emerald-600 fill-none" viewBox="0 0 400 200">
                    <polyline points="20,150 100,100 200,120 300,40 380,20" strokeWidth="3" />
                    <circle cx="20" cy="150" r="4" className="fill-emerald-700" />
                    <circle cx="100" cy="100" r="4" className="fill-emerald-700" />
                    <circle cx="200" cy="120" r="4" className="fill-emerald-700" />
                    <circle cx="300" cy="40" r="4" className="fill-emerald-700" />
                    <circle cx="380" cy="20" r="4" className="fill-emerald-700" />
                  </svg>
                )}
                {chart.type === 'pie' && (
                  <div className="relative w-36 h-36 rounded-full border-4 border-white shadow-md bg-[conic-gradient(#107c41_0%_35%,#0078d4_35%_65%,#f59e0b_65%_85%,#ef4444_85%_100%)]" />
                )}
                {chart.type === 'area' && (
                  <svg className="w-full h-full stroke-emerald-600" viewBox="0 0 400 200">
                    <polygon points="20,180 20,150 100,100 200,120 300,40 380,20 380,180" className="fill-emerald-100" />
                    <polyline points="20,150 100,100 200,120 300,40 380,20" strokeWidth="2" fill="none" />
                  </svg>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spreadsheet Bottom Sheet Tabs Bar & Status Bar */}
      <div className="flex items-center justify-between px-2 bg-[#f3f2f1] border-t border-gray-300 text-xs text-gray-700 h-9 shrink-0 select-none">
        {/* Sheet Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto py-1">
          {Object.entries(workbook).map(([sheetId, tab]) => {
            const isActive = sheetId === activeSheetId;
            return (
              <div
                key={sheetId}
                onClick={() => {
                  setActiveSheetId(sheetId);
                  AppStorage.set(AppStorage.KEYS.ACTIVE_SHEET_KEY, sheetId);
                }}
                onDoubleClick={() => handleRenameSheetTab(sheetId)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-t-sm cursor-pointer border-t-2 font-semibold text-[11px] transition ${
                  isActive
                    ? 'bg-white text-[#107c41] border-t-[#107c41] shadow-xs'
                    : 'bg-[#edebe9] text-gray-700 border-t-transparent hover:bg-gray-200'
                }`}
              >
                <span>{tab.label || sheetId}</span>
                {Object.keys(workbook).length > 1 && (
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleDeleteSheetTab(sheetId);
                    }}
                    className="hover:text-red-600 rounded p-0.5 ml-1 text-gray-400"
                    title="حذف ورقة العمل"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}

          <button
            onClick={handleAddSheetTab}
            className="p-1 hover:bg-gray-200 rounded text-gray-700 cursor-pointer ml-1"
            title="إضافة ورقة عمل جديدة"
          >
            <Plus className="w-4 h-4 text-emerald-700 font-bold" />
          </button>
        </div>

        {/* Calculation Stats & Zoom Controls */}
        <div className="flex items-center gap-3 text-[11px]">
          {/* Real Auto-Calculating Statistics */}
          {selectionStats && selectionStats.numCount > 0 && (
            <div className="hidden md:flex items-center gap-2 bg-emerald-50 text-[#107c41] px-2 py-0.5 rounded border border-emerald-200 font-semibold text-[10px]">
              <span>العدد: {selectionStats.count}</span>
              <span>|</span>
              <span>المتوسط: {selectionStats.avg}</span>
              <span>|</span>
              <span>المجموع: {selectionStats.sum}</span>
              <span>|</span>
              <span>الحد الأدنى: {selectionStats.min}</span>
              <span>|</span>
              <span>الحد الأقصى: {selectionStats.max}</span>
            </div>
          )}

          {/* Mode Indicator */}
          <span className="text-gray-500 font-medium">
            {isEditingCell ? 'وضع التحرير' : 'جاهز'}
          </span>

          <span className="text-gray-300">|</span>

          {/* Zoom Slider */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
              className="p-0.5 hover:bg-gray-200 rounded cursor-pointer"
              title="تصغير"
            >
              -
            </button>
            <input
              type="range"
              min="50"
              max="200"
              step="5"
              value={zoomLevel}
              onChange={e => setZoomLevel(parseInt(e.target.value, 10))}
              className="w-16 h-1 accent-[#107c41] cursor-pointer"
            />
            <button
              onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))}
              className="p-0.5 hover:bg-gray-200 rounded cursor-pointer"
              title="تكبير"
            >
              +
            </button>
            <span className="w-9 text-left font-mono font-bold text-[10px]">{zoomLevel}%</span>
          </div>
        </div>
      </div>

      {/* Modals */}
      <InsertFunctionModal
        isOpen={isInsertFnOpen}
        onClose={() => setIsInsertFnOpen(false)}
        onInsertFunction={syntax => {
          setFormulaInput(syntax);
          commitCellEdit(syntax);
        }}
      />

      <NameManagerModal
        isOpen={isNameMgrOpen}
        onClose={() => setIsNameMgrOpen(false)}
        namedRanges={namedRanges}
        onSaveNamedRanges={ranges => {
          setNamedRanges(ranges);
          AppStorage.set(AppStorage.KEYS.NAMED_RANGES, ranges);
          onNotify?.('تم تحديث وحفظ أسماء النطاقات بنجاح', 'success');
        }}
        currentRangeStr={selectedRange.length > 1 ? `${selectedRange[0]}:${selectedRange[selectedRange.length - 1]}` : selectedCell}
      />

      <DataValidationModal
        isOpen={isDataValOpen}
        onClose={() => setIsDataValOpen(false)}
        targetRange={selectedRange.length > 1 ? `${selectedRange[0]}:${selectedRange[selectedRange.length - 1]}` : selectedCell}
        onApplyValidation={rule => {
          setDataValidationRules(prev => [...prev, rule]);
          onNotify?.('تم تطبيق شروط التحقق من صحة البيانات بنجاح', 'success');
        }}
        onClearValidation={() => {
          setDataValidationRules([]);
          onNotify?.('تم مسح قواعد التحقق من صحة البيانات', 'info');
        }}
      />

      <RemoveDuplicatesModal
        isOpen={isRemoveDupOpen}
        onClose={() => setIsRemoveDupOpen(false)}
        minColIdx={Math.min(...selectedRange.map(c => parseCellCoordinate(c).colIdx))}
        maxColIdx={Math.max(...selectedRange.map(c => parseCellCoordinate(c).colIdx))}
        onRemoveDuplicates={handleRemoveDuplicates}
      />

      <GoalSeekModal
        isOpen={isGoalSeekOpen}
        onClose={() => setIsGoalSeekOpen(false)}
        activeCell={selectedCell}
        onRunGoalSeek={handleRunGoalSeek}
      />

      <TextToColumnsModal
        isOpen={isTextToColsOpen}
        onClose={() => setIsTextToColsOpen(false)}
        onSplitText={handleSplitTextToColumns}
      />

      <PivotTableModal
        isOpen={isPivotOpen}
        onClose={() => setIsPivotOpen(false)}
        data={sheetData}
        sourceRange={selectedRange.length > 1 ? `${selectedRange[0]}:${selectedRange[selectedRange.length - 1]}` : 'A1:B10'}
        onCreatePivot={(summary, metric) => {
          // Create new sheet with pivot summary
          const newSheetId = `pivot_${Date.now()}`;
          const pData: SheetData = {
            A1: { value: 'الفئة المستخرجة', bold: true, bg: '#7719aa', color: '#fff' },
            B1: { value: `${metric} المحسوب`, bold: true, bg: '#7719aa', color: '#fff' },
          };
          summary.forEach((item, idx) => {
            const r = idx + 2;
            pData[`A${r}`] = { value: item.rowLabel, bold: true };
            pData[`B${r}`] = { value: item.value, format: 'number' };
          });
          const newWb = {
            ...workbook,
            [newSheetId]: { id: newSheetId, label: 'جدول محوري Pivot', data: pData, rtl: isRTL }
          };
          updateWorkbook(newWb);
          setActiveSheetId(newSheetId);
          onNotify?.('تم توليد ورقة الجدول المحوري بنجاح', 'success');
        }}
      />

      <ChartModal
        isOpen={isChartModalOpen}
        onClose={() => setIsChartModalOpen(false)}
        targetRange={selectedRange.length > 1 ? `${selectedRange[0]}:${selectedRange[selectedRange.length - 1]}` : 'A1:B6'}
        initialType={chartModalType}
        onInsertChart={newChart => {
          const updated = [...charts, newChart];
          setCharts(updated);
          AppStorage.set(`${AppStorage.KEYS.CHARTS}_${activeSheetId}`, updated);
          onNotify?.(`تم إدراج مخطط (${newChart.title}) على ورقة العمل`, 'success');
        }}
      />

      <ConditionalFormattingModal
        isOpen={isCondFormatOpen}
        onClose={() => setIsCondFormatOpen(false)}
        targetRange={selectedRange.length > 1 ? `${selectedRange[0]}:${selectedRange[selectedRange.length - 1]}` : selectedCell}
        onApplyRule={rule => {
          setConditionalRules(prev => [...prev, rule]);
          onNotify?.('تم تطبيق قاعدة التنسيق الشرطي', 'success');
        }}
      />

      <ProtectSheetModal
        isOpen={isProtectOpen}
        onClose={() => setIsProtectOpen(false)}
        isProtected={isSheetProtected}
        onToggleProtect={pwd => {
          if (isSheetProtected) {
            if (pwd === sheetPassword) {
              setIsSheetProtected(false);
              setSheetPassword('');
              onNotify?.('تم إلغاء حماية ورقة العمل', 'info');
            } else {
              alert('كلمة المرور غير صحيحة!');
            }
          } else {
            setIsSheetProtected(true);
            setSheetPassword(pwd);
            onNotify?.('تم تفعيل حماية ورقة العمل بنجاح', 'success');
          }
        }}
      />

      <FindReplaceModal
        isOpen={isFindReplaceOpen}
        onClose={() => setIsFindReplaceOpen(false)}
        onFind={handleFind}
        onReplace={handleReplace}
      />

      <SpellCheckModal
        isOpen={isSpellCheckOpen}
        onClose={() => setIsSpellCheckOpen(false)}
        data={sheetData}
        onCorrectWord={(cKey, oldW, newW) => {
          const val = String(sheetData[cKey]?.value || '');
          handleUpdateStyle('value', val.replace(oldW, newW));
          onNotify?.('تم تصحيح الكلمة بنجاح', 'success');
        }}
      />
    </div>
  );
};
