import React, { useState, useEffect, useRef, useMemo } from 'react';
import { SheetData, SheetCell } from '../../types';
import { localVault } from '../../utils/storage';
import { evaluateExcelFormula, parseRange, EXCEL_FUNCTIONS, ExcelFunctionDef, shiftFormulaRowReferences } from '../../utils/excelEngine';
import { parseExcelFile } from '../../utils/fileImport';
import { ExcelRibbon, ExcelRibbonTab } from './excel/ExcelRibbon';
import { PivotTableModal } from './excel/PivotTableModal';
import { ConditionalFormattingModal } from './excel/ConditionalFormattingModal';
import { InsertFunctionModal } from './excel/InsertFunctionModal';
import { DataValidationModal } from './excel/DataValidationModal';
import { RemoveDuplicatesModal } from './excel/RemoveDuplicatesModal';
import { SparklinesModal } from './excel/SparklinesModal';
import { NameManagerModal } from './excel/NameManagerModal';
import { ChartModal } from './excel/ChartModal';
import { ExcelFindReplaceModal } from './excel/ExcelFindReplaceModal';
import { TextToColumnsModal } from './excel/TextToColumnsModal';
import { GoalSeekModal } from './excel/GoalSeekModal';
import { 
  Plus, 
  FileUp, 
  ArrowRightLeft,
  X,
  TrendingUp,
  BarChart2
} from 'lucide-react';

interface Props {
  fontFamily: string;
  zoomLevel: number;
  initialSheets?: Record<string, { label: string; data: SheetData }>;
  onSheetsChange?: (sheets: Record<string, { label: string; data: SheetData }>) => void;
  onOpenBackstage?: () => void;
}

const COLS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R'];
const ROWS_COUNT = 50;

const DEFAULT_EXCEL_PRESETS: Record<string, { label: string; data: SheetData }> = {
  sheet1: {
    label: 'ورقة 1: ميزانية ملاك والصيانة',
    data: {
      'A1': { value: 'كشف ميزانية اتحاد شاغلين - برج النخيل (نظام ملاك)', bold: true, bg: '#107c41', color: '#ffffff', align: 'center', fontSize: 13 },
      'A3': { value: 'البند / المصروف', bold: true, bg: '#e2e8f0', align: 'right', border: 'all' },
      'B3': { value: 'الشهر السابق (ر.س)', bold: true, bg: '#e2e8f0', align: 'center', border: 'all' },
      'C3': { value: 'الشهر الحالي (ر.س)', bold: true, bg: '#e2e8f0', align: 'center', border: 'all' },
      'D3': { value: 'الميزانية المعتمدة', bold: true, bg: '#e2e8f0', align: 'center', border: 'all' },
      'E3': { value: 'نسبة الإنجاز', bold: true, bg: '#e2e8f0', align: 'center', border: 'all' },

      'A4': { value: 'صيانة المصاعد الدورية', border: 'all' },
      'B4': { value: '1200', border: 'all', format: 'number' },
      'C4': { value: '1200', border: 'all', format: 'number' },
      'D4': { value: '1500', border: 'all', format: 'number' },
      'E4': { value: '80%', border: 'all', format: 'percent' },

      'A5': { value: 'خدمات الأمن والحراسة', border: 'all' },
      'B5': { value: '2500', border: 'all', format: 'number' },
      'C5': { value: '2500', border: 'all', format: 'number' },
      'D5': { value: '2500', border: 'all', format: 'number' },
      'E5': { value: '100%', border: 'all', format: 'percent' },

      'A6': { value: 'فاتورة الكهرباء المشتركة', border: 'all' },
      'B6': { value: '850', border: 'all', format: 'number' },
      'C6': { value: '920', border: 'all', format: 'number' },
      'D6': { value: '1000', border: 'all', format: 'number' },
      'E6': { value: '92%', border: 'all', format: 'percent' },

      'A7': { value: 'أعمال النظافة ومواد التعقيم', border: 'all' },
      'B7': { value: '600', border: 'all', format: 'number' },
      'C7': { value: '650', border: 'all', format: 'number' },
      'D7': { value: '700', border: 'all', format: 'number' },
      'E7': { value: '93%', border: 'all', format: 'percent' },

      'A8': { value: 'صندوق الطوارئ والاحتياطي', border: 'all' },
      'B8': { value: '1000', border: 'all', format: 'number' },
      'C8': { value: '1000', border: 'all', format: 'number' },
      'D8': { value: '1000', border: 'all', format: 'number' },
      'E8': { value: '100%', border: 'all', format: 'percent' },

      'A9': { value: 'الإجمالي العام للمصروفات', bold: true, bg: '#dcfce7', align: 'right', border: 'thick-bottom' },
      'B9': { value: '6150', formula: '=SUM(B4:B8)', bold: true, bg: '#dcfce7', border: 'thick-bottom', format: 'currency-sar' },
      'C9': { value: '6270', formula: '=SUM(C4:C8)', bold: true, bg: '#dcfce7', border: 'thick-bottom', format: 'currency-sar' },
      'D9': { value: '6700', formula: '=SUM(D4:D8)', bold: true, bg: '#dcfce7', border: 'thick-bottom', format: 'currency-sar' },
      'E9': { value: '93%', bold: true, bg: '#dcfce7', border: 'thick-bottom', format: 'percent' },
    },
  },
  sheet2: {
    label: 'ورقة 2: مسير رواتب الموظفين',
    data: {
      'A1': { value: 'مسير رواتب موظفي إنفينيتي تكنولوجي لتقنية المعلومات', bold: true, bg: '#1e293b', color: '#ffffff', align: 'center', fontSize: 13 },
      'A3': { value: 'اسم الموظف', bold: true, bg: '#e2e8f0', border: 'all' },
      'B3': { value: 'الراتب الأساسي', bold: true, bg: '#e2e8f0', border: 'all' },
      'C3': { value: 'بدل سكن', bold: true, bg: '#e2e8f0', border: 'all' },
      'D3': { value: 'بدل نقل', bold: true, bg: '#e2e8f0', border: 'all' },
      'E3': { value: 'خصم التأمينات', bold: true, bg: '#e2e8f0', border: 'all' },
      'F3': { value: 'صافي الراتب', bold: true, bg: '#e2e8f0', border: 'all' },

      'A4': { value: 'م. خالد الشهري', border: 'all' },
      'B4': { value: '14000', border: 'all', format: 'number' },
      'C4': { value: '3500', border: 'all', format: 'number' },
      'D4': { value: '1000', border: 'all', format: 'number' },
      'E4': { value: '1400', border: 'all', format: 'number' },
      'F4': { value: '17100', formula: '=SUM(B4:D4)-E4', bold: true, border: 'all', format: 'currency-sar' },

      'A5': { value: 'أ. سارة المنصور', border: 'all' },
      'B5': { value: '11500', border: 'all', format: 'number' },
      'C5': { value: '2875', border: 'all', format: 'number' },
      'D5': { value: '1000', border: 'all', format: 'number' },
      'E5': { value: '1150', border: 'all', format: 'number' },
      'F5': { value: '14225', formula: '=SUM(B5:D5)-E5', bold: true, border: 'all', format: 'currency-sar' },

      'A6': { value: 'م. ياسر القاضي', border: 'all' },
      'B6': { value: '16000', border: 'all', format: 'number' },
      'C6': { value: '4000', border: 'all', format: 'number' },
      'D6': { value: '1200', border: 'all', format: 'number' },
      'E6': { value: '1600', border: 'all', format: 'number' },
      'F6': { value: '19600', formula: '=SUM(B6:D6)-E6', bold: true, border: 'all', format: 'currency-sar' },

      'A7': { value: 'إجمالي كتلة الرواتب الشهرية', bold: true, bg: '#fef08a', border: 'thick-bottom' },
      'B7': { value: '41500', formula: '=SUM(B4:B6)', bold: true, border: 'thick-bottom', format: 'number' },
      'C7': { value: '10375', formula: '=SUM(C4:C6)', bold: true, border: 'thick-bottom', format: 'number' },
      'D7': { value: '3200', formula: '=SUM(D4:D6)', bold: true, border: 'thick-bottom', format: 'number' },
      'E7': { value: '4150', formula: '=SUM(E4:E6)', bold: true, border: 'thick-bottom', format: 'number' },
      'F7': { value: '50925', formula: '=SUM(F4:F6)', bold: true, bg: '#fef08a', border: 'thick-bottom', format: 'currency-sar' },
    },
  },
};

function parseCellCoord(cellId: string): { col: string; colIdx: number; row: number } {
  const match = cellId.match(/([A-Z]+)(\d+)/);
  if (!match) return { col: 'A', colIdx: 0, row: 1 };
  const col = match[1];
  const row = parseInt(match[2], 10);
  const colIdx = COLS.indexOf(col);
  return { col, colIdx: colIdx !== -1 ? colIdx : 0, row };
}

export const SheetsApp: React.FC<Props> = ({ 
  fontFamily, 
  zoomLevel: initialZoom,
  initialSheets,
  onSheetsChange,
  onOpenBackstage
}) => {
  const [activeSheetKey, setActiveSheetKey] = useState<string>('sheet1');
  const [sheets, setSheets] = useState<Record<string, { label: string; data: SheetData }>>(() => {
    return initialSheets || localVault.get<Record<string, { label: string; data: SheetData }>>(
      localVault.KEYS.SHEETS_DATA,
      DEFAULT_EXCEL_PRESETS
    );
  });

  // Ribbon state
  const [activeRibbonTab, setActiveRibbonTab] = useState<ExcelRibbonTab>('home');
  const [zoom, setZoom] = useState<number>(initialZoom || 100);

  // Selection & cell states
  const [selectedCell, setSelectedCell] = useState<string>('A4');
  const [formulaInput, setFormulaInput] = useState<string>('');
  const [selectedRange, setSelectedRange] = useState<string[]>(['A4']);
  const [isDraggingRange, setIsDraggingRange] = useState<boolean>(false);
  const [dragStartCell, setDragStartCell] = useState<string | null>(null);
  const [dragCurrentCell, setDragCurrentCell] = useState<string | null>(null);

  // Fill Handle (Drag to Fill / Auto-fill down) state
  const [isDraggingFillHandle, setIsDraggingFillHandle] = useState<boolean>(false);
  const [fillDragEndRow, setFillDragEndRow] = useState<number | null>(null);

  // View & UI controls
  const [isRTL, setIsRTL] = useState<boolean>(true);
  const [showFormulaBar, setShowFormulaBar] = useState<boolean>(true);
  const [showGridlines, setShowGridlines] = useState<boolean>(true);
  const [showHeadings, setShowHeadings] = useState<boolean>(true);
  const [showFormulasMode, setShowFormulasMode] = useState<boolean>(false);
  const [showFilterActive, setShowFilterActive] = useState<boolean>(false);
  const [freezeState, setFreezeState] = useState<'none' | 'row' | 'col' | 'both'>('none');

  // Clipboard & Format painter
  const [clipboard, setClipboard] = useState<{ cells: Record<string, SheetCell>; baseCell: string } | null>(null);
  const [isFormatPainterActive, setIsFormatPainterActive] = useState<boolean>(false);
  const [formatPainterSource, setFormatPainterSource] = useState<SheetCell | null>(null);

  // Autocomplete & fx
  const [matchingFunctions, setMatchingFunctions] = useState<ExcelFunctionDef[]>([]);
  const [selectedFunctionIndex, setSelectedFunctionIndex] = useState<number>(0);
  const [showAutocomplete, setShowAutocomplete] = useState<boolean>(false);
  const [currentFunctionSyntax, setCurrentFunctionSyntax] = useState<string | null>(null);
  const [isEditingCell, setIsEditingCell] = useState<boolean>(false);
  const [showFxHelper, setShowFxHelper] = useState<boolean>(false);
  const formulaInputRef = useRef<HTMLInputElement>(null);

  // Modal dialog states
  const [isPivotTableOpen, setIsPivotTableOpen] = useState(false);
  const [isConditionalFormattingOpen, setIsConditionalFormattingOpen] = useState(false);
  const [isInsertFunctionOpen, setIsInsertFunctionOpen] = useState(false);
  const [insertFunctionCategory, setInsertFunctionCategory] = useState<string | undefined>();
  const [isDataValidationOpen, setIsDataValidationOpen] = useState(false);
  const [isRemoveDuplicatesOpen, setIsRemoveDuplicatesOpen] = useState(false);
  const [isSparklinesOpen, setIsSparklinesOpen] = useState(false);
  const [isNameManagerOpen, setIsNameManagerOpen] = useState(false);
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);
  const [isFindReplaceOpen, setIsFindReplaceOpen] = useState(false);
  const [isTextToColumnsOpen, setIsTextToColumnsOpen] = useState(false);
  const [isGoalSeekOpen, setIsGoalSeekOpen] = useState(false);
  const [definedNames, setDefinedNames] = useState<{ name: string; refersTo: string; scope: string; comment?: string }[]>([
    { name: 'ميزانية_الصيانة', refersTo: 'ورقة 1!$B$4:$B$8', scope: 'المصنف' },
    { name: 'إجمالي_المصروفات', refersTo: 'ورقة 1!$B$9:$E$9', scope: 'المصنف' },
    { name: 'رواتب_الموظفين', refersTo: 'ورقة 2!$B$4:$F$6', scope: 'المصنف' },
  ]);

  // Active sheet & cell
  const currentSheet = sheets[activeSheetKey] || sheets[Object.keys(sheets)[0]];
  const data = currentSheet ? currentSheet.data : {};
  const activeCellData = data[selectedCell];

  // Sync external sheets if provided
  useEffect(() => {
    if (initialSheets && Object.keys(initialSheets).length > 0) {
      setSheets(initialSheets);
      setActiveSheetKey(Object.keys(initialSheets)[0]);
    }
  }, [initialSheets]);

  // Sync zoom prop
  useEffect(() => {
    if (initialZoom) setZoom(initialZoom);
  }, [initialZoom]);

  // Compute rectangular bounds of selected range
  const rangeBounds = useMemo(() => {
    if (!selectedRange || selectedRange.length === 0) {
      const p = parseCellCoord(selectedCell);
      return { minColIdx: p.colIdx, maxColIdx: p.colIdx, minRow: p.row, maxRow: p.row, rangeStr: selectedCell };
    }

    let minC = 999;
    let maxC = -1;
    let minR = 999;
    let maxR = -1;

    selectedRange.forEach((c) => {
      const p = parseCellCoord(c);
      if (p.colIdx < minC) minC = p.colIdx;
      if (p.colIdx > maxC) maxC = p.colIdx;
      if (p.row < minR) minR = p.row;
      if (p.row > maxR) maxR = p.row;
    });

    const start = `${COLS[minC]}${minR}`;
    const end = `${COLS[maxC]}${maxR}`;
    const rangeStr = start === end ? start : `${start}:${end}`;

    return { minColIdx: minC, maxColIdx: maxC, minRow: minR, maxRow: maxR, rangeStr };
  }, [selectedRange, selectedCell]);

  // Range Statistics (SUM, AVERAGE, COUNT)
  const rangeStats = useMemo(() => {
    if (selectedRange.length <= 1) return null;

    const nums: number[] = [];
    let filledCount = 0;

    selectedRange.forEach((cid) => {
      const c = data[cid];
      if (c && c.value !== undefined && c.value !== '') {
        filledCount++;
        const num = parseFloat(String(c.value).replace(/[^0-9.-]+/g, ''));
        if (!isNaN(num)) {
          nums.push(num);
        }
      }
    });

    if (nums.length === 0) return { count: filledCount, numsCount: 0, sum: 0, avg: 0, min: 0, max: 0 };

    const sum = nums.reduce((a, b) => a + b, 0);
    const avg = sum / nums.length;
    const min = Math.min(...nums);
    const max = Math.max(...nums);

    return {
      count: filledCount,
      numsCount: nums.length,
      sum: Math.round(sum * 100) / 100,
      avg: Math.round(avg * 100) / 100,
      min,
      max,
    };
  }, [selectedRange, data]);

  // Sync formula input on cell change
  useEffect(() => {
    if (!currentSheet) return;
    const cell = data[selectedCell];
    setFormulaInput(cell?.formula || cell?.value || '');
    setShowAutocomplete(false);
    setCurrentFunctionSyntax(null);
  }, [selectedCell, activeSheetKey]);

  // Save sheets helper
  const saveSheets = (newSheets: Record<string, { label: string; data: SheetData }>) => {
    setSheets(newSheets);
    localVault.set(localVault.KEYS.SHEETS_DATA, newSheets);
    onSheetsChange?.(newSheets);
  };

  // Recalculate sheet formulas
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
        ...(data[cellId] || { value: '' }),
        value: computedVal,
        formula: isFormula ? rawVal : undefined,
      },
    };

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

  // Bulk format application across entire selected range
  const handleFormatRange = (key: keyof SheetCell, value: any) => {
    const targets = selectedRange.length > 0 ? selectedRange : [selectedCell];
    const nextData = { ...data };

    targets.forEach((cid) => {
      nextData[cid] = {
        ...(nextData[cid] || { value: '' }),
        [key]: value,
      };
    });

    const updatedSheets = {
      ...sheets,
      [activeSheetKey]: {
        ...currentSheet,
        data: nextData,
      },
    };
    saveSheets(updatedSheets);
  };

  // Set borders
  const handleSetBorder = (borderType: SheetCell['border']) => {
    handleFormatRange('border', borderType);
  };

  // Set alignment
  const handleSetAlignment = (hAlign: 'right' | 'center' | 'left', vAlign?: 'top' | 'middle' | 'bottom') => {
    const targets = selectedRange.length > 0 ? selectedRange : [selectedCell];
    const nextData = { ...data };

    targets.forEach((cid) => {
      nextData[cid] = {
        ...(nextData[cid] || { value: '' }),
        align: hAlign,
        verticalAlign: vAlign || nextData[cid]?.verticalAlign,
      };
    });

    const updatedSheets = {
      ...sheets,
      [activeSheetKey]: {
        ...currentSheet,
        data: nextData,
      },
    };
    saveSheets(updatedSheets);
  };

  // Toggle Wrap Text
  const handleToggleWrapText = () => {
    const currentWrap = activeCellData?.wrapText;
    handleFormatRange('wrapText', !currentWrap);
  };

  // Merge and Center
  const handleMergeAndCenter = () => {
    if (selectedRange.length <= 1) {
      alert('يرجى تحديد نطاق من خليتين أو أكثر للدمج والتوسيط.');
      return;
    }

    const { minColIdx, maxColIdx, minRow, maxRow } = rangeBounds;
    const parentCellId = `${COLS[minColIdx]}${minRow}`;
    const colSpan = maxColIdx - minColIdx + 1;
    const rowSpan = maxRow - minRow + 1;

    const nextData = { ...data };
    selectedRange.forEach((cid) => {
      if (cid === parentCellId) {
        nextData[cid] = {
          ...(nextData[cid] || { value: '' }),
          isMergeParent: true,
          mergeColSpan: colSpan,
          mergeRowSpan: rowSpan,
          align: 'center',
          verticalAlign: 'middle',
        };
      } else {
        nextData[cid] = {
          ...(nextData[cid] || { value: '' }),
          mergedWith: parentCellId,
        };
      }
    });

    const updatedSheets = {
      ...sheets,
      [activeSheetKey]: {
        ...currentSheet,
        data: nextData,
      },
    };
    saveSheets(updatedSheets);
  };

  // Number format
  const handleSetNumberFormat = (fmt: SheetCell['format']) => {
    handleFormatRange('format', fmt);
  };

  // Decimal places
  const handleAdjustDecimals = (delta: number) => {
    const current = activeCellData?.decimalPlaces || 2;
    const next = Math.max(0, Math.min(8, current + delta));
    handleFormatRange('decimalPlaces', next);
  };

  // Insert Row
  const handleInsertRow = () => {
    const coord = parseCellCoord(selectedCell);
    const targetRow = coord.row;
    const nextData: SheetData = {};

    Object.keys(data).forEach((cid) => {
      const p = parseCellCoord(cid);
      if (p.row < targetRow) {
        nextData[cid] = data[cid];
      } else {
        nextData[`${p.col}${p.row + 1}`] = data[cid];
      }
    });

    const updatedSheets = {
      ...sheets,
      [activeSheetKey]: {
        ...currentSheet,
        data: nextData,
      },
    };
    saveSheets(updatedSheets);
  };

  // Insert Column
  const handleInsertCol = () => {
    const coord = parseCellCoord(selectedCell);
    const targetColIdx = coord.colIdx;
    const nextData: SheetData = {};

    Object.keys(data).forEach((cid) => {
      const p = parseCellCoord(cid);
      if (p.colIdx < targetColIdx) {
        nextData[cid] = data[cid];
      } else if (p.colIdx + 1 < COLS.length) {
        nextData[`${COLS[p.colIdx + 1]}${p.row}`] = data[cid];
      }
    });

    const updatedSheets = {
      ...sheets,
      [activeSheetKey]: {
        ...currentSheet,
        data: nextData,
      },
    };
    saveSheets(updatedSheets);
  };

  // Delete Row
  const handleDeleteRow = () => {
    const coord = parseCellCoord(selectedCell);
    const targetRow = coord.row;
    const nextData: SheetData = {};

    Object.keys(data).forEach((cid) => {
      const p = parseCellCoord(cid);
      if (p.row < targetRow) {
        nextData[cid] = data[cid];
      } else if (p.row > targetRow) {
        nextData[`${p.col}${p.row - 1}`] = data[cid];
      }
    });

    const updatedSheets = {
      ...sheets,
      [activeSheetKey]: {
        ...currentSheet,
        data: nextData,
      },
    };
    saveSheets(updatedSheets);
  };

  // Delete Column
  const handleDeleteCol = () => {
    const coord = parseCellCoord(selectedCell);
    const targetColIdx = coord.colIdx;
    const nextData: SheetData = {};

    Object.keys(data).forEach((cid) => {
      const p = parseCellCoord(cid);
      if (p.colIdx < targetColIdx) {
        nextData[cid] = data[cid];
      } else if (p.colIdx > targetColIdx) {
        nextData[`${COLS[p.colIdx - 1]}${p.row}`] = data[cid];
      }
    });

    const updatedSheets = {
      ...sheets,
      [activeSheetKey]: {
        ...currentSheet,
        data: nextData,
      },
    };
    saveSheets(updatedSheets);
  };

  // AutoSum
  const handleAutoSum = (type: 'SUM' | 'AVERAGE' | 'COUNT' | 'MAX' | 'MIN') => {
    if (selectedRange.length > 1) {
      const col = COLS[rangeBounds.minColIdx];
      const targetCell = `${col}${rangeBounds.maxRow + 1}`;
      const formula = `=${type}(${rangeBounds.rangeStr})`;
      handleCellChange(targetCell, formula);
      setSelectedCell(targetCell);
    } else {
      const p = parseCellCoord(selectedCell);
      if (p.row > 1) {
        const formula = `=${type}(${p.col}4:${p.col}${p.row - 1})`;
        handleCellChange(selectedCell, formula);
        setFormulaInput(formula);
      }
    }
  };

  // Clear
  const handleClear = (type: 'all' | 'formats' | 'contents') => {
    const targets = selectedRange.length > 0 ? selectedRange : [selectedCell];
    const nextData = { ...data };

    targets.forEach((cid) => {
      if (type === 'all') {
        delete nextData[cid];
      } else if (type === 'contents') {
        if (nextData[cid]) {
          nextData[cid] = { ...nextData[cid], value: '', formula: undefined };
        }
      } else if (type === 'formats') {
        if (nextData[cid]) {
          const val = nextData[cid].value;
          const f = nextData[cid].formula;
          nextData[cid] = { value: val, formula: f };
        }
      }
    });

    const updatedSheets = {
      ...sheets,
      [activeSheetKey]: {
        ...currentSheet,
        data: nextData,
      },
    };
    saveSheets(updatedSheets);
  };

  // Sort
  const handleSort = (dir: 'asc' | 'desc') => {
    const coord = parseCellCoord(selectedCell);
    const targetCol = coord.col;

    // Identify rows with data in this column
    const rowsToSort: { row: number; val: any }[] = [];
    for (let r = 4; r <= ROWS_COUNT; r++) {
      const cid = `${targetCol}${r}`;
      if (data[cid]?.value !== undefined) {
        rowsToSort.push({ row: r, val: data[cid].value });
      }
    }

    if (rowsToSort.length <= 1) return;

    rowsToSort.sort((a, b) => {
      const numA = parseFloat(String(a.val).replace(/[^0-9.-]+/g, ''));
      const numB = parseFloat(String(b.val).replace(/[^0-9.-]+/g, ''));
      if (!isNaN(numA) && !isNaN(numB)) {
        return dir === 'asc' ? numA - numB : numB - numA;
      }
      return dir === 'asc' 
        ? String(a.val).localeCompare(String(b.val), 'ar')
        : String(b.val).localeCompare(String(a.val), 'ar');
    });

    // Reassign row values across all active columns
    const nextData = { ...data };
    const origRows = rowsToSort.map((x) => x.row).sort((a, b) => a - b);

    origRows.forEach((destRow, idx) => {
      const srcRow = rowsToSort[idx].row;
      COLS.forEach((c) => {
        const srcCell = data[`${c}${srcRow}`];
        if (srcCell) {
          nextData[`${c}${destRow}`] = { ...srcCell };
        }
      });
    });

    const updatedSheets = {
      ...sheets,
      [activeSheetKey]: {
        ...currentSheet,
        data: nextData,
      },
    };
    saveSheets(updatedSheets);
  };

  // Clipboard operations
  const handleCut = () => {
    const targets = selectedRange.length > 0 ? selectedRange : [selectedCell];
    const clipped: Record<string, SheetCell> = {};
    const nextData = { ...data };

    targets.forEach((cid) => {
      if (nextData[cid]) {
        clipped[cid] = { ...nextData[cid] };
        delete nextData[cid];
      }
    });

    setClipboard({ cells: clipped, baseCell: targets[0] });
    const updatedSheets = {
      ...sheets,
      [activeSheetKey]: {
        ...currentSheet,
        data: nextData,
      },
    };
    saveSheets(updatedSheets);
  };

  const handleCopy = () => {
    const targets = selectedRange.length > 0 ? selectedRange : [selectedCell];
    const clipped: Record<string, SheetCell> = {};
    targets.forEach((cid) => {
      if (data[cid]) clipped[cid] = { ...data[cid] };
    });
    setClipboard({ cells: clipped, baseCell: targets[0] });
  };

  const handlePaste = () => {
    if (!clipboard) return;
    const baseP = parseCellCoord(clipboard.baseCell);
    const targetP = parseCellCoord(selectedCell);
    const dCol = targetP.colIdx - baseP.colIdx;
    const dRow = targetP.row - baseP.row;

    const nextData = { ...data };
    Object.keys(clipboard.cells).forEach((origCid) => {
      const origP = parseCellCoord(origCid);
      const newColIdx = origP.colIdx + dCol;
      const newRow = origP.row + dRow;
      if (newColIdx >= 0 && newColIdx < COLS.length && newRow >= 1 && newRow <= ROWS_COUNT) {
        const newCid = `${COLS[newColIdx]}${newRow}`;
        nextData[newCid] = { ...clipboard.cells[origCid] };
      }
    });

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

  const handlePasteSpecial = (type: 'values' | 'formats' | 'formulas') => {
    if (!clipboard) return;
    const baseP = parseCellCoord(clipboard.baseCell);
    const targetP = parseCellCoord(selectedCell);
    const dCol = targetP.colIdx - baseP.colIdx;
    const dRow = targetP.row - baseP.row;

    const nextData = { ...data };
    Object.keys(clipboard.cells).forEach((origCid) => {
      const origP = parseCellCoord(origCid);
      const newColIdx = origP.colIdx + dCol;
      const newRow = origP.row + dRow;
      if (newColIdx >= 0 && newColIdx < COLS.length && newRow >= 1 && newRow <= ROWS_COUNT) {
        const newCid = `${COLS[newColIdx]}${newRow}`;
        const src = clipboard.cells[origCid];
        const current = nextData[newCid] || { value: '' };

        if (type === 'values') {
          nextData[newCid] = { ...current, value: src.value, formula: undefined };
        } else if (type === 'formulas') {
          nextData[newCid] = { ...current, value: src.value, formula: src.formula };
        } else if (type === 'formats') {
          nextData[newCid] = {
            ...current,
            bg: src.bg,
            color: src.color,
            bold: src.bold,
            italic: src.italic,
            underline: src.underline,
            align: src.align,
            border: src.border,
            format: src.format,
          };
        }
      }
    });

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

  const handleToggleFormatPainter = () => {
    if (isFormatPainterActive) {
      setIsFormatPainterActive(false);
      setFormatPainterSource(null);
    } else {
      setIsFormatPainterActive(true);
      setFormatPainterSource(activeCellData ? { ...activeCellData } : null);
    }
  };

  // Recalculate All Sheets
  const handleRecalculateAll = () => {
    const updatedSheets = { ...sheets };
    Object.keys(updatedSheets).forEach((sKey) => {
      updatedSheets[sKey] = {
        ...updatedSheets[sKey],
        data: recalculateSheet(updatedSheets[sKey].data),
      };
    });
    saveSheets(updatedSheets);
    alert('تمت إعادة حساب كافة المعادلات والصيغ الرياضية في المصنف بنجاح!');
  };

  // Mouse Drag selection
  const calculateCellsBetween = (c1: string, c2: string): string[] => {
    const p1 = parseCellCoord(c1);
    const p2 = parseCellCoord(c2);
    const minC = Math.min(p1.colIdx, p2.colIdx);
    const maxC = Math.max(p1.colIdx, p2.colIdx);
    const minR = Math.min(p1.row, p2.row);
    const maxR = Math.max(p1.row, p2.row);

    const cells: string[] = [];
    for (let r = minR; r <= maxR; r++) {
      for (let c = minC; c <= maxC; c++) {
        cells.push(`${COLS[c]}${r}`);
      }
    }
    return cells;
  };

  const handleGridCellMouseDown = (cellId: string, e: React.MouseEvent) => {
    if (e.button !== 0) return;

    // Apply Format Painter if active
    if (isFormatPainterActive && formatPainterSource) {
      const nextData = {
        ...data,
        [cellId]: {
          ...(data[cellId] || { value: '' }),
          bg: formatPainterSource.bg,
          color: formatPainterSource.color,
          bold: formatPainterSource.bold,
          italic: formatPainterSource.italic,
          underline: formatPainterSource.underline,
          align: formatPainterSource.align,
          border: formatPainterSource.border,
          format: formatPainterSource.format,
        },
      };
      const updatedSheets = {
        ...sheets,
        [activeSheetKey]: { ...currentSheet, data: nextData },
      };
      saveSheets(updatedSheets);
      setIsFormatPainterActive(false);
      setFormatPainterSource(null);
      setSelectedCell(cellId);
      setSelectedRange([cellId]);
      return;
    }

    setIsDraggingRange(true);
    setDragStartCell(cellId);
    setDragCurrentCell(cellId);
    setSelectedCell(cellId);
    setSelectedRange([cellId]);
  };

  // Apply Fill Handle (Drag to Fill / Auto-fill down)
  const applyFillHandle = (
    srcMinRow: number,
    srcMaxRow: number,
    targetEndRow: number,
    minColIdx: number,
    maxColIdx: number
  ) => {
    if (targetEndRow <= srcMaxRow) return;

    const nextData = { ...data };
    const srcRowCount = srcMaxRow - srcMinRow + 1;

    for (let cIdx = minColIdx; cIdx <= maxColIdx; cIdx++) {
      const col = COLS[cIdx];

      // Check if source has 2 or more rows with numbers for arithmetic progression (e.g. 1, 2 -> 3, 4, 5... or 10, 20 -> 30, 40...)
      const numValues: number[] = [];
      let allNumbers = srcRowCount >= 2;

      for (let r = srcMinRow; r <= srcMaxRow; r++) {
        const cell = data[`${col}${r}`];
        const valStr = String(cell?.value ?? '').trim();
        const num = parseFloat(valStr.replace(/[^0-9.-]+/g, ''));
        if (cell?.formula || isNaN(num) || valStr === '') {
          allNumbers = false;
        } else {
          numValues.push(num);
        }
      }

      if (allNumbers && numValues.length >= 2) {
        // CASE 1: Arithmetic sequence for 2 or more numbers
        const step = (numValues[numValues.length - 1] - numValues[0]) / (numValues.length - 1);
        const lastCell = data[`${col}${srcMaxRow}`];
        let currentNum = numValues[numValues.length - 1];

        for (let r = srcMaxRow + 1; r <= targetEndRow; r++) {
          currentNum += step;
          const roundedVal = Number.isInteger(currentNum) ? currentNum : Number(currentNum.toFixed(4));
          nextData[`${col}${r}`] = {
            ...(lastCell || { value: '' }),
            value: String(roundedVal),
            formula: undefined,
          };
        }
      } else {
        // CASE 2: Single cell formula, number, or text
        for (let r = srcMaxRow + 1; r <= targetEndRow; r++) {
          const offset = r - srcMaxRow;
          const srcRowIndex = srcMinRow + ((offset - 1) % srcRowCount);
          const srcCell = data[`${col}${srcRowIndex}`];

          if (!srcCell) {
            nextData[`${col}${r}`] = { value: '' };
            continue;
          }

          if (srcCell.formula) {
            // Formula drag: adjust row references e.g. =A4+B4 -> =A5+B5 -> =A6+B6
            const deltaRow = r - srcRowIndex;
            const newFormula = shiftFormulaRowReferences(srcCell.formula, deltaRow);
            const computedVal = evaluateExcelFormula(newFormula, nextData, sheets);
            nextData[`${col}${r}`] = {
              ...srcCell,
              formula: newFormula,
              value: computedVal,
            };
          } else {
            const valStr = String(srcCell.value ?? '').trim();
            const trailingNumMatch = valStr.match(/^(.*?)(\d+)$/);

            if (trailingNumMatch) {
              // Text ending with number: e.g. "الشهر 1" -> "الشهر 2"
              const prefix = trailingNumMatch[1];
              const origNum = parseInt(trailingNumMatch[2], 10);
              const nextNum = origNum + offset;
              nextData[`${col}${r}`] = {
                ...srcCell,
                value: `${prefix}${nextNum}`,
              };
            } else {
              // Plain number or text: repeat/copy value
              nextData[`${col}${r}`] = {
                ...srcCell,
                value: srcCell.value,
              };
            }
          }
        }
      }
    }

    const fullyComputed = recalculateSheet(nextData);
    const updatedSheets = {
      ...sheets,
      [activeSheetKey]: {
        ...currentSheet,
        data: fullyComputed,
      },
    };
    saveSheets(updatedSheets);

    // Expand selection to include filled cells
    const newCells: string[] = [];
    for (let r = srcMinRow; r <= targetEndRow; r++) {
      for (let c = minColIdx; c <= maxColIdx; c++) {
        newCells.push(`${COLS[c]}${r}`);
      }
    }
    setSelectedRange(newCells);
  };

  const handleGridCellMouseEnter = (cellId: string) => {
    if (isDraggingFillHandle) {
      const coord = parseCellCoord(cellId);
      setFillDragEndRow(Math.max(rangeBounds.maxRow, coord.row));
      return;
    }

    if (!isDraggingRange || !dragStartCell) return;
    setDragCurrentCell(cellId);
    const cells = calculateCellsBetween(dragStartCell, cellId);
    setSelectedRange(cells);
  };

  const handleGridMouseUp = () => {
    setIsDraggingRange(false);

    if (isDraggingFillHandle) {
      setIsDraggingFillHandle(false);
      if (fillDragEndRow && fillDragEndRow > rangeBounds.maxRow) {
        applyFillHandle(
          rangeBounds.minRow,
          rangeBounds.maxRow,
          fillDragEndRow,
          rangeBounds.minColIdx,
          rangeBounds.maxColIdx
        );
      }
      setFillDragEndRow(null);
    }
  };

  // Autocomplete typing in formula bar or cell
  const handleFormulaInputChange = (val: string) => {
    setFormulaInput(val);

    if (val.startsWith('=')) {
      // Match function name token after '=', '+', '-', '*', '/', '(', or ','
      const match = val.match(/(?:=|[+\-*/,(])\s*([A-Za-z]+)$/);
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
    const currentVal = formulaInput.startsWith('=') ? formulaInput : `=${formulaInput}`;
    const newVal = currentVal.replace(/(?:=|[+\-*/,(])\s*([A-Za-z]+)$/, (m) => {
      const leadingChar = m.charAt(0);
      return leadingChar === '=' || leadingChar === '+' || leadingChar === '-' || leadingChar === '*' || leadingChar === '/' || leadingChar === '(' || leadingChar === ','
        ? `${leadingChar}${fn.name}(`
        : `=${fn.name}(`;
    });

    setFormulaInput(newVal);
    handleCellChange(selectedCell, newVal);
    setShowAutocomplete(false);
    setCurrentFunctionSyntax(`${fn.syntax} — ${fn.desc}`);
    formulaInputRef.current?.focus();
  };

  // Open Real Excel File (.xlsx, .csv)
  const handleOpenExcelFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const parsedSheets = await parseExcelFile(file);
      if (Object.keys(parsedSheets).length > 0) {
        saveSheets(parsedSheets);
        setActiveSheetKey(Object.keys(parsedSheets)[0]);
        setSelectedCell('A1');
        setSelectedRange(['A1']);
        alert(`تم فتح ملف Excel "${file.name}" واستيراد أوراق العمل بنجاح!`);
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء فتح ملف Excel.');
    }
  };

  const handleAddSheet = () => {
    const sheetCount = Object.keys(sheets).length + 1;
    const newKey = `sheet${sheetCount}`;
    const newSheets = {
      ...sheets,
      [newKey]: {
        label: `ورقة ${sheetCount}`,
        data: {},
      },
    };
    saveSheets(newSheets);
    setActiveSheetKey(newKey);
  };

  // Format cell display value based on number format
  const formatCellValue = (cell?: SheetCell): string => {
    if (!cell || cell.value === undefined || cell.value === null) return '';
    const valStr = String(cell.value);
    if (!cell.format || cell.format === 'text') return valStr;

    const num = parseFloat(valStr.replace(/[^0-9.-]+/g, ''));
    if (isNaN(num)) return valStr;

    const dec = cell.decimalPlaces !== undefined ? cell.decimalPlaces : 2;

    switch (cell.format) {
      case 'number':
        return num.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
      case 'currency-sar':
        return `${num.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec })} ر.س`;
      case 'currency-egp':
        return `${num.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec })} ج.م`;
      case 'currency-usd':
        return `$${num.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec })}`;
      case 'accounting':
        return `${num >= 0 ? '' : '('}${num.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec })}${num < 0 ? ')' : ''} ر.س`;
      case 'percent':
        return `${(num > 1 ? num : num * 100).toFixed(dec)}%`;
      case 'scientific':
        return num.toExponential(dec);
      default:
        return valStr;
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#f3f2f1] overflow-hidden text-xs select-none h-full">
      {/* 1. Official Microsoft Excel Ribbon Bar */}
      <ExcelRibbon
        activeTab={activeRibbonTab}
        setActiveTab={setActiveRibbonTab}
        onOpenBackstage={onOpenBackstage || (() => {})}
        activeCell={selectedCell}
        activeCellData={activeCellData}
        selectedRangeStr={rangeBounds.rangeStr}
        isFormatPainterActive={isFormatPainterActive}
        onToggleFormatPainter={handleToggleFormatPainter}
        onCut={handleCut}
        onCopy={handleCopy}
        onPaste={handlePaste}
        onPasteSpecial={handlePasteSpecial}
        onFormatRange={handleFormatRange}
        onSetBorder={handleSetBorder}
        onSetAlignment={handleSetAlignment}
        onToggleWrapText={handleToggleWrapText}
        onMergeAndCenter={handleMergeAndCenter}
        onSetNumberFormat={handleSetNumberFormat}
        onAdjustDecimals={handleAdjustDecimals}
        onInsertRow={handleInsertRow}
        onInsertCol={handleInsertCol}
        onDeleteRow={handleDeleteRow}
        onDeleteCol={handleDeleteCol}
        onAutoSum={handleAutoSum}
        onClear={handleClear}
        onSort={handleSort}
        onToggleFilter={() => setShowFilterActive(!showFilterActive)}
        isFilterActive={showFilterActive}
        onOpenFindReplace={(tab) => {
          setIsFindReplaceOpen(true);
        }}
        onOpenInsertFunction={(cat) => {
          setInsertFunctionCategory(cat);
          setIsInsertFunctionOpen(true);
        }}
        onOpenPivotTable={() => setIsPivotTableOpen(true)}
        onOpenCharts={() => setIsChartModalOpen(true)}
        onOpenSparklines={() => setIsSparklinesOpen(true)}
        onOpenConditionalFormatting={() => setIsConditionalFormattingOpen(true)}
        onOpenDataValidation={() => setIsDataValidationOpen(true)}
        onOpenRemoveDuplicates={() => setIsRemoveDuplicatesOpen(true)}
        onOpenTextToColumns={() => setIsTextToColumnsOpen(true)}
        onOpenGoalSeek={() => setIsGoalSeekOpen(true)}
        onOpenNameManager={() => setIsNameManagerOpen(true)}
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
        zoomLevel={zoom}
        onSetZoomLevel={setZoom}
        onRecalculateAll={handleRecalculateAll}
      />

      {/* 2. Excel Formula Bar */}
      {showFormulaBar && (
        <div className="bg-[#f3f2f1] px-3 py-1.5 flex flex-wrap items-center gap-2 border-b border-gray-300 shrink-0 z-20">
          {/* Name Box */}
          <div 
            className="w-24 px-2 py-1 bg-white border border-gray-300 rounded font-mono text-center font-bold text-gray-800 text-xs shadow-2xs"
            title="مربع اسم الخلية أو النطاق المحدد"
          >
            {isDraggingRange && dragStartCell && dragCurrentCell ? (
              <span className="text-[#107c41]">
                {rangeBounds.maxRow - rangeBounds.minRow + 1}R x {rangeBounds.maxColIdx - rangeBounds.minColIdx + 1}C
              </span>
            ) : selectedRange.length > 1 ? (
              <span className="text-[#107c41]">{rangeBounds.rangeStr}</span>
            ) : (
              selectedCell
            )}
          </div>

          {/* fx Button */}
          <button
            onClick={() => setIsInsertFunctionOpen(true)}
            className="px-2.5 py-1 flex items-center gap-1 font-bold rounded cursor-pointer transition bg-white border border-gray-300 text-emerald-800 hover:bg-emerald-50"
            title="إدراج دالة رياضية (fx)"
          >
            <span className="italic font-serif font-black text-sm">fx</span>
          </button>

          {/* Formula Input */}
          <div className="flex-1 relative">
            <input
              ref={formulaInputRef}
              type="text"
              dir="ltr"
              value={formulaInput}
              onChange={(e) => handleFormulaInputChange(e.target.value)}
              placeholder="=SUM(B4:B8), =AVERAGE(C4:C8), =IF(C4>1000,'فائض','ضمن الحد')"
              className="w-full bg-white border border-gray-300 rounded px-3 py-1 font-mono text-xs text-gray-900 outline-none focus:border-[#107c41] focus:ring-1 focus:ring-[#107c41] text-left"
              style={{ direction: 'ltr', textAlign: 'left' }}
            />

            {/* Excel Function Autocomplete Dropdown */}
            {showAutocomplete && matchingFunctions.length > 0 && (
              <div className="absolute left-0 top-full mt-1 w-96 max-h-64 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-2xl z-50 p-1 divide-y divide-gray-100 text-right">
                <div className="px-2.5 py-1.5 text-[10px] text-gray-500 font-bold bg-gray-50 flex items-center justify-between">
                  <span>اقتراحات دوال إكسيل التلقائية:</span>
                  <span className="font-mono text-[9px] text-[#107c41]">اضغط Tab أو Enter للإكمال</span>
                </div>
                {matchingFunctions.map((fn, idx) => (
                  <div
                    key={fn.name}
                    onClick={() => handleSelectFunction(fn)}
                    className={`p-2.5 rounded cursor-pointer text-xs transition ${
                      idx === selectedFunctionIndex
                        ? 'bg-emerald-100 text-emerald-950 font-bold border border-emerald-300'
                        : 'hover:bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-mono text-xs font-black text-[#107c41] tracking-wide">{fn.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-gray-200 text-gray-700 rounded font-normal">
                        {fn.category}
                      </span>
                    </div>
                    <div className="text-[11.5px] text-gray-600 line-clamp-1">{fn.desc}</div>
                    <div className="font-mono text-[10.5px] text-[#107c41] mt-1 font-semibold" dir="ltr" style={{ textAlign: 'left' }}>
                      {fn.syntax}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {currentFunctionSyntax && (
              <div className="absolute left-0 top-full mt-1 bg-emerald-50 border border-emerald-300 text-emerald-950 rounded-md px-3 py-1.5 text-[11px] shadow-lg z-40 flex items-center gap-2">
                <span className="font-bold text-[#107c41]">صيغة الدالة:</span>
                <span className="font-mono text-xs text-emerald-900 font-semibold" dir="ltr">{currentFunctionSyntax}</span>
              </div>
            )}
          </div>

          {/* Quick Open File */}
          <label className="flex items-center gap-1 px-2.5 py-1 rounded border border-gray-300 bg-white hover:bg-emerald-50 text-emerald-800 font-bold cursor-pointer transition shadow-2xs">
            <FileUp className="w-3.5 h-3.5 text-[#107c41]" />
            <span className="hidden sm:inline">فتح ملف (.xlsx)</span>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleOpenExcelFile}
              className="hidden"
            />
          </label>
        </div>
      )}

      {/* 3. Main Spreadsheet Grid */}
      <div 
        onMouseUp={handleGridMouseUp}
        className="flex-1 overflow-auto bg-gray-100 p-1 relative"
        style={{ transform: `scale(${zoom / 100})`, transformOrigin: isRTL ? 'top right' : 'top left' }}
      >
        <table className={`border-collapse bg-white shadow-xs min-w-full ${isRTL ? 'text-right' : 'text-left'}`}>
          {showHeadings && (
            <thead className={freezeState === 'row' || freezeState === 'both' ? 'sticky top-0 z-20 shadow-xs' : ''}>
              <tr className="bg-[#f3f2f1] text-gray-600 font-semibold text-[11px]">
                <th className={`w-10 p-1 border border-gray-300 text-center bg-[#eae8e6] ${
                  (freezeState === 'col' || freezeState === 'both') ? 'sticky right-0 z-30' : ''
                }`}>
                  #
                </th>
                {COLS.map((col, cIdx) => {
                  const isColInRange = cIdx >= rangeBounds.minColIdx && cIdx <= rangeBounds.maxColIdx;
                  return (
                    <th 
                      key={col} 
                      className={`p-1 border border-gray-300 text-center min-w-[110px] w-28 transition-colors ${
                        isColInRange ? 'bg-emerald-100 text-[#107c41] font-bold border-b-2 border-b-[#107c41]' : 'bg-[#f3f2f1]'
                      } ${
                        (freezeState === 'col' || freezeState === 'both') && cIdx === 0 ? 'sticky right-10 z-20 shadow-xs' : ''
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>{col}</span>
                        {showFilterActive && (
                          <button
                            onClick={() => handleSort('asc')}
                            className="text-[9px] text-emerald-800 bg-white border border-gray-300 rounded px-1 hover:bg-emerald-50"
                            title="تصفية وفرز العمود"
                          >
                            ▼
                          </button>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
          )}
          <tbody>
            {Array.from({ length: ROWS_COUNT }).map((_, rIdx) => {
              const rowNum = rIdx + 1;
              const isRowInRange = rowNum >= rangeBounds.minRow && rowNum <= rangeBounds.maxRow;

              return (
                <tr key={rowNum} className="hover:bg-emerald-50/20">
                  {/* Row Header */}
                  {showHeadings && (
                    <td 
                      className={`p-1 border border-gray-300 text-center text-gray-500 font-mono text-[10px] transition-colors ${
                        isRowInRange ? 'bg-emerald-100 text-[#107c41] font-bold border-r-2 border-r-[#107c41]' : 'bg-[#f3f2f1]'
                      } ${
                        (freezeState === 'col' || freezeState === 'both') ? 'sticky right-0 z-10 bg-[#f3f2f1]' : ''
                      }`}
                    >
                      {rowNum}
                    </td>
                  )}

                  {/* Columns */}
                  {COLS.map((col, cIdx) => {
                    const cellId = `${col}${rowNum}`;
                    const cell = data[cellId];

                    // If cell is merged under another parent, hide it
                    if (cell?.mergedWith) {
                      return null;
                    }

                    const isSelected = selectedCell === cellId;
                    const inRange = cIdx >= rangeBounds.minColIdx && cIdx <= rangeBounds.maxColIdx &&
                                    rowNum >= rangeBounds.minRow && rowNum <= rangeBounds.maxRow;

                    const isTopBorder = inRange && rowNum === rangeBounds.minRow;
                    const isBottomBorder = inRange && rowNum === rangeBounds.maxRow;
                    const isRightBorder = inRange && (isRTL ? cIdx === rangeBounds.minColIdx : cIdx === rangeBounds.maxColIdx);
                    const isLeftBorder = inRange && (isRTL ? cIdx === rangeBounds.maxColIdx : cIdx === rangeBounds.minColIdx);
                    const isBottomCorner = inRange && rowNum === rangeBounds.maxRow && (isRTL ? cIdx === rangeBounds.minColIdx : cIdx === rangeBounds.maxColIdx);

                    // Fill handle preview row check
                    const isFillPreviewRow = isDraggingFillHandle &&
                      fillDragEndRow !== null &&
                      rowNum > rangeBounds.maxRow &&
                      rowNum <= fillDragEndRow &&
                      cIdx >= rangeBounds.minColIdx &&
                      cIdx <= rangeBounds.maxColIdx;

                    // Border styling
                    let cellBorderStyle: React.CSSProperties = {};
                    if (cell?.border === 'all') {
                      cellBorderStyle = { border: '1px solid #94a3b8' };
                    } else if (cell?.border === 'outside') {
                      cellBorderStyle = { border: '2px solid #0f172a' };
                    } else if (cell?.border === 'thick-bottom') {
                      cellBorderStyle = { borderBottom: '3px solid #0f172a' };
                    } else if (cell?.border === 'double-bottom') {
                      cellBorderStyle = { borderBottom: '3px double #0f172a' };
                    } else if (cell?.border === 'bottom') {
                      cellBorderStyle = { borderBottom: '1px solid #0f172a' };
                    } else if (cell?.border === 'none') {
                      cellBorderStyle = { border: 'none' };
                    }

                    const isStickyCol = (freezeState === 'col' || freezeState === 'both') && cIdx === 0;

                    return (
                      <td
                        key={cellId}
                        colSpan={cell?.mergeColSpan || 1}
                        rowSpan={cell?.mergeRowSpan || 1}
                        onMouseDown={(e) => handleGridCellMouseDown(cellId, e)}
                        onMouseEnter={() => handleGridCellMouseEnter(cellId)}
                        className={`p-1 relative transition-all select-none ${
                          showGridlines ? 'border border-gray-300' : 'border border-transparent'
                        } ${isStickyCol ? 'sticky right-10 z-10 bg-white' : ''}`}
                        style={{
                          backgroundColor: isFillPreviewRow
                            ? 'rgba(16, 124, 65, 0.08)'
                            : (inRange && !isSelected
                              ? 'rgba(16, 124, 65, 0.12)'
                              : (cell?.bg || (isSelected ? '#ffffff' : undefined))),
                          color: cell?.color,
                          fontWeight: cell?.bold ? 'bold' : 'normal',
                          fontStyle: cell?.italic ? 'italic' : 'normal',
                          textDecoration: [
                            cell?.underline ? 'underline' : '',
                            cell?.strikethrough ? 'line-through' : '',
                          ].filter(Boolean).join(' ') || undefined,
                          textAlign: cell?.align || (isRTL ? 'right' : 'left'),
                          verticalAlign: cell?.verticalAlign || 'middle',
                          fontFamily: cell?.fontFamily || fontFamily,
                          fontSize: cell?.fontSize ? `${cell.fontSize}px` : undefined,
                          whiteSpace: cell?.wrapText ? 'normal' : 'nowrap',
                          borderTop: isTopBorder ? '2px solid #107c41' : cellBorderStyle.borderTop || cellBorderStyle.border,
                          borderBottom: isBottomBorder ? '2px solid #107c41' : cellBorderStyle.borderBottom || cellBorderStyle.border,
                          borderRight: isRightBorder ? '2px solid #107c41' : cellBorderStyle.borderRight || cellBorderStyle.border,
                          borderLeft: isLeftBorder ? '2px solid #107c41' : cellBorderStyle.borderLeft || cellBorderStyle.border,
                          outline: isFillPreviewRow
                            ? '1px dashed #107c41'
                            : (isSelected && selectedRange.length <= 1 ? '2px solid #107c41' : undefined),
                          zIndex: isSelected ? 15 : (inRange ? 5 : 1),
                        }}
                      >
                        {/* Display sparkline if present */}
                        {cell?.sparkline ? (
                          <div className="flex items-center gap-1 h-5 px-1 bg-emerald-50 rounded">
                            <TrendingUp className="w-3.5 h-3.5 text-[#107c41]" />
                            <span className="text-[10px] text-emerald-800 font-mono font-bold">Sparkline</span>
                          </div>
                        ) : (
                          <div className="relative w-full h-full flex items-center">
                            <input
                              type="text"
                              value={
                                showFormulasMode && cell?.formula
                                  ? cell.formula
                                  : (isSelected && isEditingCell && cell?.formula ? cell.formula : formatCellValue(cell))
                              }
                              onFocus={() => {
                                setSelectedCell(cellId);
                                setIsEditingCell(true);
                              }}
                              onBlur={() => {
                                setTimeout(() => setIsEditingCell(false), 200);
                              }}
                              onChange={(e) => {
                                handleCellChange(cellId, e.target.value);
                                handleFormulaInputChange(e.target.value);
                              }}
                              onKeyDown={(e) => {
                                if (showAutocomplete && matchingFunctions.length > 0) {
                                  if (e.key === 'ArrowDown') {
                                    e.preventDefault();
                                    setSelectedFunctionIndex((i) => Math.min(matchingFunctions.length - 1, i + 1));
                                  } else if (e.key === 'ArrowUp') {
                                    e.preventDefault();
                                    setSelectedFunctionIndex((i) => Math.max(0, i - 1));
                                  } else if (e.key === 'Enter' || e.key === 'Tab') {
                                    e.preventDefault();
                                    handleSelectFunction(matchingFunctions[selectedFunctionIndex]);
                                  } else if (e.key === 'Escape') {
                                    setShowAutocomplete(false);
                                  }
                                }
                              }}
                              className={`w-full bg-transparent outline-none text-xs px-1 text-inherit font-inherit ${
                                isRTL ? 'text-right' : 'text-left'
                              }`}
                            />

                            {/* In-Cell Floating Autocomplete Dropdown */}
                            {isSelected && isEditingCell && showAutocomplete && matchingFunctions.length > 0 && (
                              <div
                                className="absolute right-0 top-full mt-1 w-80 max-h-56 overflow-y-auto bg-white border-2 border-[#107c41] rounded-lg shadow-2xl z-50 p-1 divide-y divide-gray-100 text-right animate-in fade-in"
                                onMouseDown={(e) => e.stopPropagation()}
                              >
                                <div className="px-2 py-1 text-[10px] text-gray-500 font-bold bg-gray-50 flex items-center justify-between">
                                  <span>دوال إكسيل المقترحة:</span>
                                  <span className="font-mono text-[9px] text-[#107c41]">اضغط Tab أو Enter للإكمال</span>
                                </div>
                                {matchingFunctions.map((fn, idx) => (
                                  <div
                                    key={fn.name}
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleSelectFunction(fn);
                                    }}
                                    className={`p-2 rounded cursor-pointer text-xs transition ${
                                      idx === selectedFunctionIndex
                                        ? 'bg-emerald-100 text-emerald-950 font-bold border border-emerald-300'
                                        : 'hover:bg-gray-100 text-gray-800'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between mb-0.5">
                                      <span className="font-mono text-xs font-black text-[#107c41]">{fn.name}</span>
                                      <span className="text-[10px] px-1 py-0.5 bg-gray-200 text-gray-700 rounded font-normal">
                                        {fn.category}
                                      </span>
                                    </div>
                                    <div className="text-[11px] text-gray-600 line-clamp-1">{fn.desc}</div>
                                    <div className="font-mono text-[10px] text-[#107c41] mt-0.5 font-semibold" dir="ltr" style={{ textAlign: 'left' }}>
                                      {fn.syntax}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Comment Indicator */}
                        {cell?.comment && (
                          <div
                            className="absolute top-0 left-0 w-0 h-0 border-t-6 border-t-amber-500 border-r-6 border-r-transparent"
                            title={`تعليق: ${cell.comment}`}
                          />
                        )}

                        {/* Fill Handle for selection box */}
                        {isBottomCorner && (
                          <div 
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              setIsDraggingFillHandle(true);
                              setFillDragEndRow(rangeBounds.maxRow);
                            }}
                            className="absolute w-2.5 h-2.5 bg-[#107c41] border border-white z-30 cursor-crosshair bottom-[-3px] right-[-3px] hover:scale-125 transition-transform shadow-xs"
                            title="مقبض التعبئة التلقائية (Fill Handle) - اسحب لأسفل لتكرار القيم أو إكمال المتتاليات وتطبيق المعادلات"
                          />
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 4. Multi-Sheet Tabs Bar & Live Excel Status Bar */}
      <div className="flex items-center justify-between px-3 py-1 bg-[#f3f2f1] border-t border-gray-300 text-[11px] text-gray-700 select-none shrink-0">
        {/* Sheet Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {Object.entries(sheets).map(([key, s]) => {
            const isActive = key === activeSheetKey;
            return (
              <button
                key={key}
                onClick={() => setActiveSheetKey(key)}
                className={`px-3 py-1 font-bold rounded-t transition cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-white text-emerald-800 border-t-2 border-[#107c41] shadow-xs'
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

        {/* Live Selection Stats (SUM, AVERAGE, COUNT) */}
        <div className="flex items-center gap-3 font-medium text-gray-700">
          {rangeStats && rangeStats.count > 1 ? (
            <div className="flex items-center gap-2.5 bg-white border border-gray-300 px-3 py-0.5 rounded shadow-2xs text-[11px] font-mono text-emerald-900">
              {rangeStats.numsCount > 0 ? (
                <>
                  <span>
                    <strong>المتوسط:</strong> {rangeStats.avg.toLocaleString('ar-EG')}
                  </span>
                  <span className="text-gray-300">|</span>
                </>
              ) : null}
              <span>
                <strong>العدد:</strong> {rangeStats.count}
              </span>
              {rangeStats.numsCount > 0 ? (
                <>
                  <span className="text-gray-300">|</span>
                  <span className="font-bold text-[#107c41]">
                    <strong>المجموع:</strong> {rangeStats.sum.toLocaleString('ar-EG')}
                  </span>
                </>
              ) : null}
            </div>
          ) : (
            <div className="text-[10px] text-gray-500 font-mono hidden sm:inline">
              جاهز (Ready) | محرك Excel السيادي 100% Offline
            </div>
          )}
        </div>
      </div>

      {/* 5. All Excel Modals */}
      <PivotTableModal
        isOpen={isPivotTableOpen}
        onClose={() => setIsPivotTableOpen(false)}
        data={data}
        onInsertPivot={() => {
          alert('تم إنشاء تقرير الجدول المحوري (PivotTable) بنجاح!');
          setIsPivotTableOpen(false);
        }}
      />

      <ConditionalFormattingModal
        isOpen={isConditionalFormattingOpen}
        onClose={() => setIsConditionalFormattingOpen(false)}
        onApplyRule={(rule) => {
          const targets = selectedRange.length > 0 ? selectedRange : [selectedCell];
          const threshold = parseFloat(rule.value);
          const nextData = { ...data };

          targets.forEach((cid) => {
            const cell = nextData[cid];
            if (cell && cell.value) {
              const num = parseFloat(String(cell.value).replace(/[^0-9.-]+/g, ''));
              if (!isNaN(num)) {
                let matches = false;
                if (rule.type === 'greater' && num > threshold) matches = true;
                else if (rule.type === 'less' && num < threshold) matches = true;
                else if (rule.type === 'equal' && num === threshold) matches = true;
                else if (rule.type === 'databars' || rule.type === 'colorscale') matches = true;

                if (matches) {
                  nextData[cid] = {
                    ...cell,
                    bg: rule.bg,
                    color: rule.color,
                  };
                }
              }
            }
          });

          saveSheets({ ...sheets, [activeSheetKey]: { ...currentSheet, data: nextData } });
          setIsConditionalFormattingOpen(false);
        }}
        onClearRules={() => {
          handleFormatRange('bg', undefined);
          handleFormatRange('color', undefined);
          setIsConditionalFormattingOpen(false);
        }}
      />

      <InsertFunctionModal
        isOpen={isInsertFunctionOpen}
        onClose={() => setIsInsertFunctionOpen(false)}
        initialCategory={insertFunctionCategory}
        onSelectFunction={(syntax) => {
          const fnNameMatch = syntax.match(/^([A-Z]+)/);
          const fnName = fnNameMatch ? fnNameMatch[1] : 'SUM';
          const formula = `=${fnName}()`;
          setFormulaInput(formula);
          handleCellChange(selectedCell, formula);
          setIsInsertFunctionOpen(false);
        }}
      />

      <DataValidationModal
        isOpen={isDataValidationOpen}
        onClose={() => setIsDataValidationOpen(false)}
        onApplyValidation={(options) => {
          handleFormatRange('validation', { type: 'list', values: options });
          alert(`تم تطبيق قاعدة التحقق من صحة البيانات مع خيارات: ${options.join(', ')}`);
        }}
      />

      <RemoveDuplicatesModal
        isOpen={isRemoveDuplicatesOpen}
        onClose={() => setIsRemoveDuplicatesOpen(false)}
        columns={COLS.slice(0, 8)}
        onRemoveDuplicates={(selectedCols) => {
          const seen = new Set<string>();
          const nextData = { ...data };
          let removedCount = 0;

          for (let r = 4; r <= ROWS_COUNT; r++) {
            const key = selectedCols.map((c) => nextData[`${c}${r}`]?.value || '').join('|');
            if (key.trim()) {
              if (seen.has(key)) {
                selectedCols.forEach((c) => {
                  delete nextData[`${c}${r}`];
                });
                removedCount++;
              } else {
                seen.add(key);
              }
            }
          }

          const fullyComputed = recalculateSheet(nextData);
          saveSheets({ ...sheets, [activeSheetKey]: { ...currentSheet, data: fullyComputed } });
          alert(`تم فحص البيانات وإزالة ${removedCount} صفوف مكررة بنجاح!`);
          setIsRemoveDuplicatesOpen(false);
        }}
      />

      <SparklinesModal
        isOpen={isSparklinesOpen}
        onClose={() => setIsSparklinesOpen(false)}
        selectedCell={selectedCell}
        onInsertSparkline={(type, targetCell) => {
          const nextData = {
            ...data,
            [targetCell]: {
              ...(data[targetCell] || { value: '' }),
              sparkline: { type, range: rangeBounds.rangeStr },
            },
          };
          saveSheets({ ...sheets, [activeSheetKey]: { ...currentSheet, data: nextData } });
          alert(`تم إدراج خط سباركلاين (${type}) في الخلية ${targetCell} بنجاح!`);
        }}
      />

      <NameManagerModal
        isOpen={isNameManagerOpen}
        onClose={() => setIsNameManagerOpen(false)}
        names={definedNames}
        onAddName={(item) => setDefinedNames([...definedNames, item])}
        onDeleteName={(name) => setDefinedNames(definedNames.filter((n) => n.name !== name))}
      />

      <ChartModal
        isOpen={isChartModalOpen}
        onClose={() => setIsChartModalOpen(false)}
        selectedRange={selectedRange}
        data={data}
        activeSheetTitle={currentSheet.label}
      />

      <ExcelFindReplaceModal
        isOpen={isFindReplaceOpen}
        onClose={() => setIsFindReplaceOpen(false)}
        data={data}
        onSelectCell={(cid) => {
          setSelectedCell(cid);
          setSelectedRange([cid]);
        }}
        onReplaceCell={(cid, newVal) => {
          handleCellChange(cid, newVal);
        }}
        onReplaceAll={(searchTerm, replaceTerm) => {
          const nextData = { ...data };
          let replacedCount = 0;
          Object.keys(nextData).forEach((cid) => {
            const cell = nextData[cid];
            if (cell && cell.value && String(cell.value).includes(searchTerm)) {
              nextData[cid] = {
                ...cell,
                value: String(cell.value).replaceAll(searchTerm, replaceTerm),
              };
              replacedCount++;
            }
          });
          const fullyComputed = recalculateSheet(nextData);
          saveSheets({ ...sheets, [activeSheetKey]: { ...currentSheet, data: fullyComputed } });
          alert(`تم استبدال ${replacedCount} تكرار بنجاح!`);
        }}
      />

      <TextToColumnsModal
        isOpen={isTextToColumnsOpen}
        onClose={() => setIsTextToColumnsOpen(false)}
        selectedRange={selectedRange}
        data={data}
        onApplySplit={(splits) => {
          const nextData = { ...data };
          splits.forEach((item) => {
            nextData[item.targetCell] = {
              ...(nextData[item.targetCell] || { value: '' }),
              value: item.value,
            };
          });
          const fullyComputed = recalculateSheet(nextData);
          saveSheets({ ...sheets, [activeSheetKey]: { ...currentSheet, data: fullyComputed } });
        }}
      />

      <GoalSeekModal
        isOpen={isGoalSeekOpen}
        onClose={() => setIsGoalSeekOpen(false)}
        selectedCell={selectedCell}
        data={data}
        onApplyGoalSeek={(targetCell, val) => {
          handleCellChange(targetCell, String(val));
        }}
      />
    </div>
  );
};
