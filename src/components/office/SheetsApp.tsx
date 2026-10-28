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
import { ChartModal, ChartDefinition } from './excel/ChartModal';
import { ExcelFindReplaceModal } from './excel/ExcelFindReplaceModal';
import { TextToColumnsModal } from './excel/TextToColumnsModal';
import { GoalSeekModal } from './excel/GoalSeekModal';
import { ExcelContextMenu } from './excel/ExcelContextMenu';
import { FormatCellsModal, FormatCellsTab, FormatCellsConfig } from './excel/FormatCellsModal';
import { 
  Plus, 
  FileUp, 
  ArrowRightLeft,
  X,
  TrendingUp,
  BarChart2,
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';

interface Props {
  fontFamily: string;
  zoomLevel: number;
  initialSheets?: Record<string, { label: string; data: SheetData }>;
  onSheetsChange?: (sheets: Record<string, { label: string; data: SheetData }>) => void;
  onOpenBackstage?: () => void;
}

const generateCols = (): string[] => {
  const list: string[] = [];
  for (let i = 0; i < 26; i++) {
    list.push(String.fromCharCode(65 + i));
  }
  for (let i = 0; i < 26; i++) {
    list.push('A' + String.fromCharCode(65 + i));
  }
  return list;
};

export const COLS = generateCols();
export const MAX_EXCEL_ROWS = 1048576;

const DEFAULT_EXCEL_BLANK: Record<string, { label: string; data: SheetData }> = {
  sheet1: {
    label: 'ورقة 1',
    data: {},
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
  const [activeSheetKey, setActiveSheetKeyState] = useState<string>(() => {
    return localVault.get('infinity_office_active_sheet_key', 'sheet1');
  });

  const setActiveSheetKey = (key: string) => {
    setActiveSheetKeyState(key);
    localVault.set('infinity_office_active_sheet_key', key);
  };

  const [sheets, setSheets] = useState<Record<string, { label: string; data: SheetData }>>(() => {
    return initialSheets || localVault.get<Record<string, { label: string; data: SheetData }>>(
      localVault.KEYS.SHEETS_DATA,
      DEFAULT_EXCEL_BLANK
    );
  });

  // Ribbon state
  const [activeRibbonTab, setActiveRibbonTab] = useState<ExcelRibbonTab>('home');
  const [zoom, setZoom] = useState<number>(initialZoom || 100);

  // Selection & cell states
  const [selectedCell, setSelectedCellState] = useState<string>(() => {
    return localVault.get('infinity_office_selected_cell', 'A4');
  });

  const setSelectedCell = (cellId: string) => {
    setSelectedCellState(cellId);
    localVault.set('infinity_office_selected_cell', cellId);
  };

  const [formulaInput, setFormulaInput] = useState<string>('');
  const [selectedRange, setSelectedRange] = useState<string[]>(['A4']);
  const [isDraggingRange, setIsDraggingRange] = useState<boolean>(false);
  const [dragStartCell, setDragStartCell] = useState<string | null>(null);
  const [dragCurrentCell, setDragCurrentCell] = useState<string | null>(null);

  // Fill Handle (Drag to Fill / Auto-fill down) state
  const [isDraggingFillHandle, setIsDraggingFillHandle] = useState<boolean>(false);
  const [fillDragEndRow, setFillDragEndRow] = useState<number | null>(null);

  // Table Design (Table Tools) states
  const [tableName, setTableName] = useState<string>('Table1');
  const [hasHeaderRow, setHasHeaderRow] = useState<boolean>(true);
  const [hasTotalRow, setHasTotalRow] = useState<boolean>(false);
  const [hasBandedRows, setHasBandedRows] = useState<boolean>(true);
  const [hasFirstColumn, setHasFirstColumn] = useState<boolean>(false);
  const [hasLastColumn, setHasLastColumn] = useState<boolean>(false);
  const [hasBandedColumns, setHasBandedColumns] = useState<boolean>(false);
  const [hasFilterButton, setHasFilterButton] = useState<boolean>(true);
  const [activeTableStyle, setActiveTableStyle] = useState<string>('green');

  // Formula Range Selection (single click or drag reference)
  const [isDraggingFormulaRange, setIsDraggingFormulaRange] = useState<boolean>(false);
  const [formulaDragStartCell, setFormulaDragStartCell] = useState<string | null>(null);
  const [formulaReferencedRange, setFormulaReferencedRange] = useState<string[]>([]);

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
  const gridContainerRef = useRef<HTMLDivElement>(null);

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
  const [isFormatCellsOpen, setIsFormatCellsOpen] = useState(false);
  const [formatCellsTab, setFormatCellsTab] = useState<FormatCellsTab>('number');
  const [definedNames, setDefinedNames] = useState<{ name: string; refersTo: string; scope: string; comment?: string }[]>([
    { name: 'ميزانية_الصيانة', refersTo: 'ورقة 1!$B$4:$B$8', scope: 'المصنف' },
    { name: 'إجمالي_المصروفات', refersTo: 'ورقة 1!$B$9:$E$9', scope: 'المصنف' },
    { name: 'رواتب_الموظفين', refersTo: 'ورقة 2!$B$4:$F$6', scope: 'المصنف' },
  ]);
  const [visibleRowCount, setVisibleRowCount] = useState<number>(100);
  const [tableNotification, setTableNotification] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const floatingImageInputRef = useRef<HTMLInputElement>(null);

  // Column and Row Drag Selection state
  const [isDraggingColHeader, setIsDraggingColHeader] = useState<boolean>(false);
  const [colDragStartIdx, setColDragStartIdx] = useState<number | null>(null);
  const [isDraggingRowHeader, setIsDraggingRowHeader] = useState<boolean>(false);
  const [rowDragStartNum, setRowDragStartNum] = useState<number | null>(null);

  // Hidden Rows, Hidden Cols, Custom Heights & Widths
  const [hiddenRows, setHiddenRows] = useState<Set<number>>(new Set());
  const [hiddenCols, setHiddenCols] = useState<Set<string>>(new Set());
  const [rowHeights, setRowHeights] = useState<Record<number, number>>({});
  const [colWidths, setColWidths] = useState<Record<string, number>>({});

  // Interactive Column & Row Resize Divider States with '+' handles
  const [resizingCol, setResizingCol] = useState<{ col: string; startX: number; startWidth: number } | null>(null);
  const [resizingRow, setResizingRow] = useState<{ row: number; startY: number; startHeight: number } | null>(null);
  const [hoveredColDivider, setHoveredColDivider] = useState<string | null>(null);
  const [hoveredRowDivider, setHoveredRowDivider] = useState<number | null>(null);

  useEffect(() => {
    if (!resizingCol && !resizingRow) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (resizingCol) {
        const delta = isRTL ? (resizingCol.startX - e.clientX) : (e.clientX - resizingCol.startX);
        const newWidth = Math.max(45, Math.min(800, resizingCol.startWidth + delta));
        setColWidths((prev) => ({ ...prev, [resizingCol.col]: Math.round(newWidth) }));
      } else if (resizingRow) {
        const delta = e.clientY - resizingRow.startY;
        const newHeight = Math.max(20, Math.min(400, resizingRow.startHeight + delta));
        setRowHeights((prev) => ({ ...prev, [resizingRow.row]: Math.round(newHeight) }));
      }
    };

    const handleMouseUp = () => {
      setResizingCol(null);
      setResizingRow(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizingCol, resizingRow, isRTL]);

  // Context Menu state (Excel 365 style with Mini Toolbar)
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    type: 'cell' | 'row' | 'col';
    x: number;
    y: number;
    cellId: string;
    rowNum?: number;
    colName?: string;
  } | null>(null);

  // Office 365 Movable Floating Objects (Charts, Shapes, Images)
  const [floatingObjects, setFloatingObjects] = useState<Array<{
    id: string;
    type: 'chart' | 'shape' | 'image';
    shapeType?: 'rect' | 'rounded-rect' | 'circle' | 'arrow-right' | 'arrow-left' | 'callout' | 'star' | 'diamond';
    title?: string;
    text?: string;
    imageSrc?: string;
    x: number;
    y: number;
    width: number;
    height: number;
    chartDef?: ChartDefinition;
    bg?: string;
    color?: string;
  }>>(() => {
    const saved = localVault.get<any[]>('infinity_office_excel_floating_' + activeSheetKey, []);
    if (saved && saved.length > 0) return saved;
    const legacyCharts = localVault.get<ChartDefinition[]>('infinity_office_excel_charts_' + activeSheetKey, []);
    if (legacyCharts && legacyCharts.length > 0) {
      return legacyCharts.map((ch, idx) => ({
        id: ch.id,
        type: 'chart' as const,
        title: ch.title,
        x: 60 + idx * 30,
        y: 80 + idx * 30,
        width: 460,
        height: 280,
        chartDef: ch,
      }));
    }
    return [];
  });
  const [selectedFloatingId, setSelectedFloatingId] = useState<string | null>(null);
  const [editingShapeTextId, setEditingShapeTextId] = useState<string | null>(null);
  const [draggingObjId, setDraggingObjId] = useState<string | null>(null);
  const [resizingObjId, setResizingObjId] = useState<string | null>(null);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number }>({ mouseX: 0, mouseY: 0, startX: 0, startY: 0 });
  const resizeStartRef = useRef<{ mouseX: number; mouseY: number; startW: number; startH: number }>({ mouseX: 0, mouseY: 0, startW: 0, startH: 0 });

  // Sync floating objects when activeSheetKey changes
  useEffect(() => {
    const saved = localVault.get<any[]>('infinity_office_excel_floating_' + activeSheetKey, []);
    if (saved && saved.length > 0) {
      setFloatingObjects(saved);
    } else {
      const legacyCharts = localVault.get<ChartDefinition[]>('infinity_office_excel_charts_' + activeSheetKey, []);
      if (legacyCharts && legacyCharts.length > 0) {
        setFloatingObjects(legacyCharts.map((ch, idx) => ({
          id: ch.id,
          type: 'chart' as const,
          title: ch.title,
          x: 60 + idx * 30,
          y: 80 + idx * 30,
          width: 460,
          height: 280,
          chartDef: ch,
        })));
      } else {
        setFloatingObjects([]);
      }
    }
  }, [activeSheetKey]);

  // Window listeners for dragging and resizing floating objects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const scale = zoom / 100;
      if (draggingObjId) {
        const dx = (e.clientX - dragStartRef.current.mouseX) / scale;
        const dy = (e.clientY - dragStartRef.current.mouseY) / scale;
        const newX = Math.max(0, Math.round(dragStartRef.current.startX + dx));
        const newY = Math.max(0, Math.round(dragStartRef.current.startY + dy));
        setFloatingObjects((prev) =>
          prev.map((obj) => (obj.id === draggingObjId ? { ...obj, x: newX, y: newY } : obj))
        );
      } else if (resizingObjId) {
        const dx = (e.clientX - resizeStartRef.current.mouseX) / scale;
        const dy = (e.clientY - resizeStartRef.current.mouseY) / scale;
        const newW = Math.max(100, Math.round(resizeStartRef.current.startW + dx));
        const newH = Math.max(60, Math.round(resizeStartRef.current.startH + dy));
        setFloatingObjects((prev) =>
          prev.map((obj) => (obj.id === resizingObjId ? { ...obj, width: newW, height: newH } : obj))
        );
      }
    };

    const handleMouseUp = () => {
      if (draggingObjId || resizingObjId) {
        setDraggingObjId(null);
        setResizingObjId(null);
        setFloatingObjects((current) => {
          localVault.set('infinity_office_excel_floating_' + activeSheetKey, current);
          return current;
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingObjId, resizingObjId, zoom, activeSheetKey]);

  // Global mouseup to release column/row header and cell range drag
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDraggingRange(false);
      setIsDraggingColHeader(false);
      setColDragStartIdx(null);
      setIsDraggingRowHeader(false);
      setRowDragStartNum(null);
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

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

  // Apply Format Cells Config from FormatCellsModal (Number, Alignment, Font, Border, Fill, Protection)
  const handleApplyFormatCells = (cfg: FormatCellsConfig) => {
    const nextData = { ...data };
    const targetCells = selectedRange.length > 0 ? selectedRange : [selectedCell];

    // Map category to SheetCell format
    let cellFormat: SheetCell['format'] = undefined;
    if (cfg.category === 'currency') {
      if (cfg.currencySymbol === 'EGP') cellFormat = 'currency-egp';
      else if (cfg.currencySymbol === '$') cellFormat = 'currency-usd';
      else cellFormat = 'currency-sar';
    } else if (cfg.category === 'percentage') {
      cellFormat = 'percent';
    } else if (cfg.category === 'number') {
      cellFormat = 'number';
    } else if (cfg.category === 'accounting') {
      cellFormat = 'accounting';
    } else if (cfg.category === 'date') {
      cellFormat = 'date';
    } else if (cfg.category === 'fraction') {
      cellFormat = 'fraction';
    } else if (cfg.category === 'scientific') {
      cellFormat = 'scientific';
    } else if (cfg.category === 'text') {
      cellFormat = 'text';
    }

    // Map border
    let cellBorder: SheetCell['border'] = undefined;
    if (cfg.borderTop && cfg.borderBottom && cfg.borderLeft && cfg.borderRight) {
      cellBorder = 'all';
    } else if (cfg.borderBottom && cfg.borderStyle === 'thick') {
      cellBorder = 'thick-bottom';
    } else if (cfg.borderBottom && cfg.borderStyle === 'double') {
      cellBorder = 'double-bottom';
    } else if (cfg.borderBottom) {
      cellBorder = 'bottom';
    } else if (cfg.borderTop) {
      cellBorder = 'top';
    } else if (cfg.borderLeft) {
      cellBorder = 'left';
    } else if (cfg.borderRight) {
      cellBorder = 'right';
    }

    targetCells.forEach((cid) => {
      const existing = nextData[cid] || { value: '' };
      nextData[cid] = {
        ...existing,
        format: cellFormat !== undefined ? cellFormat : existing.format,
        decimalPlaces: cfg.decimalPlaces,
        currencySymbol: cfg.currencySymbol || existing.currencySymbol,
        negativeFormat: cfg.negativeFormat,
        dateFormat: cfg.dateFormat,
        customFormat: cfg.customFormat,

        // Alignment
        align: cfg.horizontalAlign === 'center' ? 'center' : cfg.horizontalAlign === 'left' ? 'left' : cfg.horizontalAlign === 'right' ? 'right' : existing.align,
        verticalAlign: cfg.verticalAlign === 'justify' ? 'middle' : cfg.verticalAlign,
        wrapText: cfg.wrapText,
        textRotation: cfg.textRotation,
        shrinkToFit: cfg.shrinkToFit,
        textDirection: cfg.textDirection,

        // Font
        fontFamily: cfg.fontFamily,
        fontSize: cfg.fontSize,
        bold: cfg.fontStyle === 'bold' || cfg.fontStyle === 'bold-italic',
        italic: cfg.fontStyle === 'italic' || cfg.fontStyle === 'bold-italic',
        color: cfg.color,
        underline: cfg.underline !== 'none',
        strikethrough: cfg.strikethrough,

        // Border
        border: cellBorder !== undefined ? cellBorder : existing.border,

        // Fill
        bg: cfg.fillColor && cfg.fillColor !== 'transparent' ? cfg.fillColor : existing.bg,

        // Protection
        locked: cfg.locked,
        hidden: cfg.hidden,
      };
    });

    const fullyComputed = recalculateSheet(nextData);
    saveSheets({ ...sheets, [activeSheetKey]: { ...currentSheet, data: fullyComputed } });
    setIsFormatCellsOpen(false);
  };

  // Toggle Wrap Text
  const handleToggleWrapText = () => {
    const currentWrap = activeCellData?.wrapText;
    handleFormatRange('wrapText', !currentWrap);
  };

  // Merge and Center (Toggle Support)
  const handleMergeAndCenter = () => {
    // If active cell is already merged or is a parent, UNMERGE it
    if (activeCellData?.isMergeParent || activeCellData?.mergedWith) {
      const parentId = activeCellData.mergedWith || selectedCell;
      const nextData = { ...data };
      Object.keys(nextData).forEach((cid) => {
        if (cid === parentId || nextData[cid]?.mergedWith === parentId) {
          const { isMergeParent, mergeColSpan, mergeRowSpan, mergedWith, ...rest } = nextData[cid];
          nextData[cid] = rest;
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
      return;
    }

    if (selectedRange.length <= 1) {
      alert('يرجى تحديد نطاق من خليتين أو أكثر للدمج والتوسيط (يمكنك التحديد بالسحب بالماوس أو بالضغط على Shift مع الأسهم).');
      return;
    }

    const { minColIdx, maxColIdx, minRow, maxRow } = rangeBounds;
    const parentCellId = `${COLS[minColIdx]}${minRow}`;
    const colSpan = maxColIdx - minColIdx + 1;
    const rowSpan = maxRow - minRow + 1;

    // Pick content: if parent is empty, grab the first non-empty cell in range so data is not lost
    let preservedValue = data[parentCellId]?.value ?? '';
    let preservedFormula = data[parentCellId]?.formula;
    if (!preservedValue) {
      for (const cid of selectedRange) {
        if (data[cid]?.value) {
          preservedValue = data[cid].value;
          preservedFormula = data[cid].formula;
          break;
        }
      }
    }

    const nextData = { ...data };
    selectedRange.forEach((cid) => {
      if (cid === parentCellId) {
        nextData[cid] = {
          ...(nextData[cid] || {}),
          value: preservedValue,
          formula: preservedFormula,
          isMergeParent: true,
          mergeColSpan: colSpan,
          mergeRowSpan: rowSpan,
          align: 'center',
          verticalAlign: 'middle',
        };
      } else {
        nextData[cid] = {
          ...(nextData[cid] || {}),
          mergedWith: parentCellId,
          value: '',
          formula: undefined,
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
    setSelectedCell(parentCellId);
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
  const handleInsertRow = (targetRowParam?: number) => {
    const targetRow = targetRowParam !== undefined ? targetRowParam : parseCellCoord(selectedCell).row;
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
  const handleInsertCol = (targetColParam?: string) => {
    const targetColIdx = targetColParam ? COLS.indexOf(targetColParam) : parseCellCoord(selectedCell).colIdx;
    if (targetColIdx === -1) return;
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
  const handleDeleteRow = (targetRowParam?: number) => {
    const targetRow = targetRowParam !== undefined ? targetRowParam : parseCellCoord(selectedCell).row;
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
  const handleDeleteCol = (targetColParam?: string) => {
    const targetColIdx = targetColParam ? COLS.indexOf(targetColParam) : parseCellCoord(selectedCell).colIdx;
    if (targetColIdx === -1) return;
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

  // Select Entire Sheet (Top-corner button)
  const handleSelectAllSheet = () => {
    const allCells: string[] = [];
    for (let r = 1; r <= visibleRowCount; r++) {
      for (const col of COLS) {
        allCells.push(`${col}${r}`);
      }
    }
    setSelectedCell('A1');
    setSelectedRange(allCells);
  };

  // Column Header selection and drag
  const handleColHeaderMouseDown = (cIdx: number, e: React.MouseEvent) => {
    const col = COLS[cIdx];
    if (e.button === 2) {
      e.preventDefault();
      setContextMenu({
        visible: true,
        type: 'col',
        x: e.clientX,
        y: e.clientY,
        cellId: `${col}1`,
        colName: col,
      });
      return;
    }
    if (e.button !== 0) return;

    setIsDraggingColHeader(true);
    setColDragStartIdx(cIdx);
    const colCells: string[] = [];
    for (let r = 1; r <= visibleRowCount; r++) {
      colCells.push(`${col}${r}`);
    }
    setSelectedCell(`${col}1`);
    setSelectedRange(colCells);
  };

  const handleColHeaderMouseEnter = (cIdx: number) => {
    if (!isDraggingColHeader || colDragStartIdx === null) return;
    const minC = Math.min(colDragStartIdx, cIdx);
    const maxC = Math.max(colDragStartIdx, cIdx);
    const cells: string[] = [];
    for (let r = 1; r <= visibleRowCount; r++) {
      for (let c = minC; c <= maxC; c++) {
        cells.push(`${COLS[c]}${r}`);
      }
    }
    setSelectedRange(cells);
  };

  // Row Header selection and drag
  const handleRowHeaderMouseDown = (rowNum: number, e: React.MouseEvent) => {
    if (e.button === 2) {
      e.preventDefault();
      setContextMenu({
        visible: true,
        type: 'row',
        x: e.clientX,
        y: e.clientY,
        cellId: `A${rowNum}`,
        rowNum,
      });
      return;
    }
    if (e.button !== 0) return;

    setIsDraggingRowHeader(true);
    setRowDragStartNum(rowNum);
    const rowCells: string[] = [];
    for (const col of COLS) {
      rowCells.push(`${col}${rowNum}`);
    }
    setSelectedCell(`A${rowNum}`);
    setSelectedRange(rowCells);
  };

  const handleRowHeaderMouseEnter = (rowNum: number) => {
    if (!isDraggingRowHeader || rowDragStartNum === null) return;
    const minR = Math.min(rowDragStartNum, rowNum);
    const maxR = Math.max(rowDragStartNum, rowNum);
    const cells: string[] = [];
    for (let r = minR; r <= maxR; r++) {
      for (const col of COLS) {
        cells.push(`${col}${r}`);
      }
    }
    setSelectedRange(cells);
  };

  // Get unique values in a column for "Pick From Drop-down List..."
  const getColumnUniqueValues = (cellId: string): string[] => {
    const coord = parseCellCoord(cellId);
    const col = COLS[coord.colIdx];
    const set = new Set<string>();
    for (let r = 1; r <= visibleRowCount; r++) {
      const val = data[`${col}${r}`]?.value;
      if (val !== undefined && val !== null && String(val).trim() !== '') {
        set.add(String(val).trim());
      }
    }
    return Array.from(set);
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
    for (let r = 4; r <= Math.min(visibleRowCount + 50, MAX_EXCEL_ROWS); r++) {
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

    // Write TSV to system clipboard so user can paste outside or across sheets
    try {
      const { minColIdx, maxColIdx, minRow, maxRow } = rangeBounds;
      const rows: string[] = [];
      for (let r = minRow; r <= maxRow; r++) {
        const rowVals: string[] = [];
        for (let c = minColIdx; c <= maxColIdx; c++) {
          const cid = `${COLS[c]}${r}`;
          rowVals.push(data[cid]?.value ?? '');
        }
        rows.push(rowVals.join('\t'));
      }
      navigator.clipboard?.writeText(rows.join('\n'));
    } catch {
      // ignore
    }
  };

  const handlePaste = async () => {
    // 1. Try reading from system clipboard first
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim().length > 0) {
          const rawLines = text.replace(/\r\n/g, '\n').split('\n');
          const rows = rawLines.map((l) => l.split('\t'));
          const startP = parseCellCoord(selectedCell);
          const nextData = { ...data };

          rows.forEach((rowCells, rOffset) => {
            const targetRow = startP.row + rOffset;
            if (targetRow <= MAX_EXCEL_ROWS) {
              rowCells.forEach((val, cOffset) => {
                const targetColIdx = startP.colIdx + cOffset;
                if (targetColIdx < COLS.length) {
                  const targetCid = `${COLS[targetColIdx]}${targetRow}`;
                  const isFormula = val.startsWith('=');
                  const computedVal = isFormula
                    ? evaluateExcelFormula(val, nextData, sheets)
                    : val;
                  nextData[targetCid] = {
                    ...(nextData[targetCid] || { value: '' }),
                    value: computedVal,
                    formula: isFormula ? val : undefined,
                  };
                }
              });
            }
          });

          const fullyComputed = recalculateSheet(nextData);
          saveSheets({ ...sheets, [activeSheetKey]: { ...currentSheet, data: fullyComputed } });
          setTableNotification(`تم لصق البيانات (${rows.length} صفوف) بنجاح من الحافظة!`);
          setTimeout(() => setTableNotification(null), 3500);
          return;
        }
      }
    } catch (err) {
      console.warn('System clipboard read fallback:', err);
    }

    // 2. Fallback to internal clipboard
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
      if (newColIdx >= 0 && newColIdx < COLS.length && newRow >= 1 && newRow <= MAX_EXCEL_ROWS) {
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
    setTableNotification('تم لصق الخلايا بنجاح!');
    setTimeout(() => setTableNotification(null), 3000);
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
      if (newColIdx >= 0 && newColIdx < COLS.length && newRow >= 1 && newRow <= MAX_EXCEL_ROWS) {
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

  // Create Table (Alt + T or Ctrl + T)
  const handleCreateTable = () => {
    let startColIdx = rangeBounds.minColIdx;
    let endColIdx = rangeBounds.maxColIdx;
    let startRow = rangeBounds.minRow;
    let endRow = rangeBounds.maxRow;

    // If single cell, format a smart 4x5 table around it
    if (startColIdx === endColIdx && startRow === endRow) {
      endColIdx = Math.min(COLS.length - 1, startColIdx + 3);
      endRow = Math.min(MAX_EXCEL_ROWS, startRow + 4);
    }

    const nextData = { ...data };
    const allCells: string[] = [];

    // Header row formatting
    for (let c = startColIdx; c <= endColIdx; c++) {
      const col = COLS[c];
      const cellId = `${col}${startRow}`;
      allCells.push(cellId);
      const existing = nextData[cellId];
      nextData[cellId] = {
        ...(existing || { value: '' }),
        value: existing?.value ? existing.value : `عمود ${c - startColIdx + 1}`,
        bold: true,
        bg: '#107c41',
        color: '#ffffff',
        align: 'center',
        border: 'all',
      };
    }

    // Body rows with zebra striping
    for (let r = startRow + 1; r <= endRow; r++) {
      const isZebra = (r - startRow) % 2 === 0;
      for (let c = startColIdx; c <= endColIdx; c++) {
        const col = COLS[c];
        const cellId = `${col}${r}`;
        allCells.push(cellId);
        const existing = nextData[cellId];
        nextData[cellId] = {
          ...(existing || { value: '' }),
          bg: isZebra ? '#f8fafc' : '#ffffff',
          color: existing?.color || '#1e293b',
          border: 'all',
          align: existing?.align || 'center',
        };
      }
    }

    setShowFilterActive(true);
    setSelectedRange(allCells);
    saveSheets({ ...sheets, [activeSheetKey]: { ...currentSheet, data: nextData } });
    
    setTableNotification(`تم إنشاء وتنسيق جدول Excel القياسي بنجاح بنطاق (${COLS[startColIdx]}${startRow}:${COLS[endColIdx]}${endRow})! الاختصار المعتمد: Alt + T (أو Ctrl + T)`);
    setTimeout(() => setTableNotification(null), 5000);
  };

  // Image Upload Handler
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        const nextData = {
          ...data,
          [selectedCell]: {
            ...(data[selectedCell] || { value: '' }),
            image: dataUrl,
            value: data[selectedCell]?.value || file.name.replace(/\.[^/.]+$/, ''),
          },
        };
        saveSheets({ ...sheets, [activeSheetKey]: { ...currentSheet, data: nextData } });
        setTableNotification(`تم إدراج الصورة بنجاح في الخلية ${selectedCell}!`);
        setTimeout(() => setTableNotification(null), 4000);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Insert Movable Floating Chart Handler (Office 365)
  const handleInsertChart = (chart: ChartDefinition) => {
    const newFloatingChart = {
      id: chart.id || 'chart_' + Date.now(),
      type: 'chart' as const,
      title: chart.title,
      x: 80,
      y: 90,
      width: 480,
      height: 290,
      chartDef: chart,
    };
    const updated = [...floatingObjects, newFloatingChart];
    setFloatingObjects(updated);
    setSelectedFloatingId(newFloatingChart.id);
    localVault.set('infinity_office_excel_floating_' + activeSheetKey, updated);
    setTableNotification(`تم إدراج المخطط البياني "${chart.title}" كعنصر حر عائم في ورقة العمل بنجاح! يمكنك نقله بحرية بالماوس إلى أي مكان.`);
    setTimeout(() => setTableNotification(null), 5000);
  };

  // Insert Movable Floating Shape Handler (Office 365)
  const handleInsertShape = (shapeType: 'rect' | 'rounded-rect' | 'circle' | 'arrow-right' | 'arrow-left' | 'callout' | 'star' | 'diamond') => {
    const shapeLabels: Record<string, string> = {
      'rect': 'مستطيل توضيحي',
      'rounded-rect': 'مستطيل مستدير',
      'circle': 'دائرة بيانية',
      'diamond': 'معين شرطي',
      'arrow-right': 'مؤشر للأمام',
      'arrow-left': 'مؤشر للخلف',
      'callout': 'ملاحظة توضيحية',
      'star': 'نجمة تميز',
    };
    const newShape = {
      id: 'shape_' + Date.now(),
      type: 'shape' as const,
      shapeType,
      title: shapeLabels[shapeType] || 'شكل',
      text: shapeLabels[shapeType] || 'شكل توضيحي',
      x: 120,
      y: 110,
      width: 180,
      height: 90,
      bg: shapeType === 'circle' ? '#0284c7' : (shapeType === 'diamond' ? '#7c3aed' : '#107c41'),
      color: '#ffffff',
    };
    const updated = [...floatingObjects, newShape];
    setFloatingObjects(updated);
    setSelectedFloatingId(newShape.id);
    localVault.set('infinity_office_excel_floating_' + activeSheetKey, updated);
    setTableNotification(`تم إدراج الشكل (${newShape.title}) بنجاح! يمكنك سحبه بالماوس أو تحريكه وتغيير أبعاده بحرية.`);
    setTimeout(() => setTableNotification(null), 5000);
  };

  // Floating Image File Upload
  const handleFloatingImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        const newImgObj = {
          id: 'image_' + Date.now(),
          type: 'image' as const,
          title: file.name.replace(/\.[^/.]+$/, ''),
          imageSrc: dataUrl,
          x: 100,
          y: 90,
          width: 280,
          height: 190,
        };
        const updated = [...floatingObjects, newImgObj];
        setFloatingObjects(updated);
        setSelectedFloatingId(newImgObj.id);
        localVault.set('infinity_office_excel_floating_' + activeSheetKey, updated);
        setTableNotification(`تم إدراج الصورة الحرة بنجاح! يمكنك سحبها ونقلها لأي موضع تريده في ورقة العمل.`);
        setTimeout(() => setTableNotification(null), 5000);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleDeleteFloatingObject = (objId: string) => {
    const updated = floatingObjects.filter((c) => c.id !== objId);
    setFloatingObjects(updated);
    if (selectedFloatingId === objId) setSelectedFloatingId(null);
    localVault.set('infinity_office_excel_floating_' + activeSheetKey, updated);
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

    // Check if user is typing or entering a formula and clicked another cell to reference it (Excel behavior)
    // Works with a single click immediately WITHOUT needing double-click!
    const isFormulaMode = formulaInput.trim().startsWith('=');

    if (isFormulaMode && cellId !== selectedCell) {
      e.preventDefault();
      e.stopPropagation();

      const trimmed = formulaInput.trim();
      let updated = formulaInput;

      // Handle formula functions like "=SUM" without "(" yet
      if (/^=[A-Za-z]+$/i.test(trimmed)) {
        updated = `${trimmed}(${cellId}`;
      } else if (trimmed === '=') {
        updated = `=${cellId}`;
      } else if (['=', '(', '+', '-', '*', '/', ',', ':', '^'].some((op) => trimmed.endsWith(op))) {
        updated = formulaInput + cellId;
      } else if (trimmed.endsWith(')')) {
        updated = formulaInput.slice(0, -1) + ',' + cellId + ')';
      } else if (/[A-Za-z]+[0-9]+(:[A-Za-z]+[0-9]+)?$/.test(trimmed)) {
        // Replace previous cell coordinate with the newly clicked one
        updated = trimmed.replace(/[A-Za-z]+[0-9]+(:[A-Za-z]+[0-9]+)?$/, cellId);
      } else {
        updated = formulaInput + '+' + cellId;
      }

      setFormulaInput(updated);
      handleCellChange(selectedCell, updated);
      setIsEditingCell(true);
      setShowAutocomplete(false);

      // Start drag tracking for range reference (e.g., A1:A5)
      setIsDraggingFormulaRange(true);
      setFormulaDragStartCell(cellId);
      setFormulaReferencedRange([cellId]);
      return;
    }

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
      setIsEditingCell(false);
      setSelectedCell(cellId);
      setSelectedRange([cellId]);
      return;
    }

    // Normal cell click: select cell without showing blinking cursor/input immediately!
    setIsEditingCell(false);
    setIsDraggingRange(true);
    setDragStartCell(cellId);
    setDragCurrentCell(cellId);
    setSelectedCell(cellId);
    setSelectedRange([cellId]);
  };

  const getCellsInRange = (startCell: string, endCell: string): string[] => {
    const c1 = parseCellCoord(startCell);
    const c2 = parseCellCoord(endCell);
    const minC = Math.min(c1.colIdx, c2.colIdx);
    const maxC = Math.max(c1.colIdx, c2.colIdx);
    const minR = Math.min(c1.row, c2.row);
    const maxR = Math.max(c1.row, c2.row);
    const cells: string[] = [];
    for (let r = minR; r <= maxR; r++) {
      for (let c = minC; c <= maxC; c++) {
        cells.push(`${COLS[c]}${r}`);
      }
    }
    return cells;
  };

  // Excel-style Keyboard Navigation & Direct Typing
  const handleGridKeyDown = (e: React.KeyboardEvent) => {
    // 0. Table Creation Shortcut: Alt + T or Ctrl + T
    if ((e.altKey && e.key.toLowerCase() === 't') || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 't')) {
      e.preventDefault();
      e.stopPropagation();
      handleCreateTable();
      return;
    }

    // Format Cells Shortcut: Ctrl + 1 or Cmd + 1
    if ((e.ctrlKey || e.metaKey) && e.key === '1') {
      e.preventDefault();
      e.stopPropagation();
      setFormatCellsTab('number');
      setIsFormatCellsOpen(true);
      return;
    }

    // 1. Direct formula operator & character typing without mouse
    if (formulaInput.trim().startsWith('=')) {
      if (e.key === 'Enter') {
        e.preventDefault();
        // Auto-close missing parentheses if any (e.g. =SUM(G8+G7)
        let finalFormula = formulaInput.trim();
        const openCount = (finalFormula.match(/\(/g) || []).length;
        const closeCount = (finalFormula.match(/\)/g) || []).length;
        if (openCount > closeCount) {
          finalFormula += ')'.repeat(openCount - closeCount);
        }
        setFormulaInput(finalFormula);
        handleCellChange(selectedCell, finalFormula);
        setIsEditingCell(false);
        setShowAutocomplete(false);
        const coords = parseCellCoord(selectedCell);
        if (coords.row < MAX_EXCEL_ROWS) {
          const nextRow = coords.row + 1;
          if (nextRow >= visibleRowCount) {
            setVisibleRowCount((v) => Math.min(MAX_EXCEL_ROWS, nextRow + 50));
          }
          const nextId = `${COLS[coords.colIdx]}${nextRow}`;
          setSelectedCell(nextId);
          setSelectedRange([nextId]);
        }
        setTimeout(() => gridContainerRef.current?.focus(), 0);
        return;
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setIsEditingCell(false);
        setShowAutocomplete(false);
        setFormulaInput(data[selectedCell]?.formula || data[selectedCell]?.value || '');
        setTimeout(() => gridContainerRef.current?.focus(), 0);
        return;
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        const updated = formulaInput.length > 1 ? formulaInput.slice(0, -1) : '';
        setFormulaInput(updated);
        handleCellChange(selectedCell, updated);
        return;
      } else if (['+', '-', '*', '/', '^', '%', '(', ')', ',', ':'].includes(e.key) || (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey)) {
        // Direct typing of math operator (+, -, *, /) or characters after picking a cell
        e.preventDefault();
        const updated = formulaInput + e.key;
        setFormulaInput(updated);
        handleCellChange(selectedCell, updated);
        setIsEditingCell(true);
        return;
      }
    }

    if (isEditingCell) return;

    const coords = parseCellCoord(selectedCell);
    let nextColIdx = coords.colIdx;
    let nextRow = coords.row;

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      nextRow = Math.max(1, coords.row - 1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      nextRow = Math.min(MAX_EXCEL_ROWS, coords.row + 1);
      if (nextRow >= visibleRowCount) {
        setVisibleRowCount((v) => Math.min(MAX_EXCEL_ROWS, nextRow + 50));
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (isRTL) {
        nextColIdx = Math.min(COLS.length - 1, coords.colIdx + 1);
      } else {
        nextColIdx = Math.max(0, coords.colIdx - 1);
      }
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (isRTL) {
        nextColIdx = Math.max(0, coords.colIdx - 1);
      } else {
        nextColIdx = Math.min(COLS.length - 1, coords.colIdx + 1);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      nextColIdx = Math.min(COLS.length - 1, coords.colIdx + 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      nextRow = Math.min(MAX_EXCEL_ROWS, coords.row + 1);
      if (nextRow >= visibleRowCount) {
        setVisibleRowCount((v) => Math.min(MAX_EXCEL_ROWS, nextRow + 50));
      }
    } else if (e.key === 'F2') {
      e.preventDefault();
      setIsEditingCell(true);
      return;
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      const nextData = { ...data };
      selectedRange.forEach((cid) => {
        delete nextData[cid];
      });
      const updatedSheets = {
        ...sheets,
        [activeSheetKey]: { ...currentSheet, data: nextData },
      };
      saveSheets(updatedSheets);
      setFormulaInput('');
      return;
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      // Direct typing into unselected cell starts edit mode immediately
      e.preventDefault();
      setIsEditingCell(true);
      handleCellChange(selectedCell, e.key);
      handleFormulaInputChange(e.key);
      return;
    } else {
      return;
    }

    const nextCellId = `${COLS[nextColIdx]}${nextRow}`;
    if (e.shiftKey) {
      const startCell = dragStartCell || selectedCell;
      const range = getCellsInRange(startCell, nextCellId);
      setSelectedCell(nextCellId);
      setSelectedRange(range);
    } else {
      setDragStartCell(nextCellId);
      setSelectedCell(nextCellId);
      setSelectedRange([nextCellId]);
    }
    setTimeout(() => gridContainerRef.current?.focus(), 0);
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

      // Sequence Progression for Months & Days (Arabic & English)
      const ARABIC_DAYS = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
      const ARABIC_DAYS_ALT = ['السبت', 'الاحد', 'الإثنين', 'الثلاثاء', 'الاربعاء', 'الخميس', 'الجمعة'];
      const ENGLISH_DAYS = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      const ENGLISH_DAYS_SHORT = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
      const ARABIC_MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
      const ARABIC_MONTHS_ALT = ['يناير', 'فبراير', 'مارس', 'ابريل', 'مايو', 'يونيو', 'يوليو', 'اغسطس', 'سبتمبر', 'اكتوبر', 'نوفمبر', 'ديسمبر'];
      const HIJRI_MONTHS = ['محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'];
      const ENGLISH_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const ENGLISH_MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      const ALL_SEQUENCES = [
        ARABIC_DAYS, ARABIC_DAYS_ALT, ENGLISH_DAYS, ENGLISH_DAYS_SHORT,
        ARABIC_MONTHS, ARABIC_MONTHS_ALT, HIJRI_MONTHS, ENGLISH_MONTHS, ENGLISH_MONTHS_SHORT
      ];

      // Extract raw strings from source rows
      const rawValues: string[] = [];
      for (let r = srcMinRow; r <= srcMaxRow; r++) {
        rawValues.push(String(data[`${col}${r}`]?.value ?? '').trim());
      }

      // Check if source values match a known sequence
      let matchedSeq: string[] | null = null;
      let lastMatchIdx = -1;
      let seqStep = 1;

      for (const seq of ALL_SEQUENCES) {
        const indices = rawValues.map(v => seq.indexOf(v));
        if (indices.every(idx => idx !== -1)) {
          matchedSeq = seq;
          lastMatchIdx = indices[indices.length - 1];
          if (indices.length >= 2) {
            seqStep = (indices[indices.length - 1] - indices[0]) / (indices.length - 1);
            if (seqStep <= 0) seqStep = 1;
          }
          break;
        }
      }

      if (matchedSeq && lastMatchIdx !== -1) {
        // CASE 1: Sequence progression (Months / Days)
        const lastCell = data[`${col}${srcMaxRow}`];
        for (let r = srcMaxRow + 1; r <= targetEndRow; r++) {
          const offset = r - srcMaxRow;
          const nextIdx = (lastMatchIdx + Math.round(seqStep * offset)) % matchedSeq.length;
          const safeIdx = (nextIdx + matchedSeq.length) % matchedSeq.length;
          nextData[`${col}${r}`] = {
            ...(lastCell || { value: '' }),
            value: matchedSeq[safeIdx],
            formula: undefined,
          };
        }
      } else if (allNumbers && numValues.length >= 2) {
        // CASE 2: Arithmetic sequence for 2 or more numbers
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
    if (isDraggingFormulaRange && formulaDragStartCell) {
      const range = calculateCellsBetween(formulaDragStartCell, cellId);
      setFormulaReferencedRange(range);
      const rangeStr = `${formulaDragStartCell}:${cellId}`;
      const trimmed = formulaInput.trim();
      const updated = trimmed.replace(
        new RegExp(`(${formulaDragStartCell}|[A-Za-z]+[0-9]+:[A-Za-z]+[0-9]+)$`),
        rangeStr
      );
      setFormulaInput(updated);
      handleCellChange(selectedCell, updated);
      return;
    }

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
    setIsDraggingFormulaRange(false);

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
    // Real-time synchronization: typing in formula bar writes directly to active cell
    handleCellChange(selectedCell, val);

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
      } else if (val.trim() === '=') {
        const popular = ['SUM', 'AVERAGE', 'IF', 'VLOOKUP', 'COUNT', 'MAX', 'MIN', 'ROUND', 'CONCAT'];
        const filtered = EXCEL_FUNCTIONS.filter((f) => popular.includes(f.name));
        setMatchingFunctions(filtered);
        setSelectedFunctionIndex(0);
        setShowAutocomplete(true);
        setCurrentFunctionSyntax(null);
        return;
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
    let newVal = currentVal;
    if (/(?:=|[+\-*/,(])\s*([A-Za-z]+)$/.test(currentVal)) {
      newVal = currentVal.replace(/(?:=|[+\-*/,(])\s*([A-Za-z]+)$/, (m) => {
        const leadingChar = m.charAt(0);
        return ['=', '+', '-', '*', '/', '(', ','].includes(leadingChar)
          ? `${leadingChar}${fn.name}(`
          : `=${fn.name}(`;
      });
    } else if (currentVal.trim() === '=') {
      newVal = `=${fn.name}(`;
    } else {
      newVal = `${currentVal}${fn.name}(`;
    }

    setFormulaInput(newVal);
    handleCellChange(selectedCell, newVal);
    setShowAutocomplete(false);
    setCurrentFunctionSyntax(`${fn.syntax} — ${fn.desc}`);
    if (!isEditingCell) {
      formulaInputRef.current?.focus();
    }
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

  // Table Design Palette & Styles
  const TABLE_STYLES_MAP: Record<string, { headerBg: string; headerColor: string; bandBg: string; border: string }> = {
    green: { headerBg: '#107c41', headerColor: '#ffffff', bandBg: '#f0fdf4', border: '#bbf7d0' },
    dark: { headerBg: '#1f2937', headerColor: '#ffffff', bandBg: '#f3f4f6', border: '#e5e7eb' },
    'light-blue': { headerBg: '#0284c7', headerColor: '#ffffff', bandBg: '#f0f9ff', border: '#bae6fd' },
    'warm-orange': { headerBg: '#ea580c', headerColor: '#ffffff', bandBg: '#fff7ed', border: '#fed7aa' },
    gray: { headerBg: '#4b5563', headerColor: '#ffffff', bandBg: '#f9fafb', border: '#e5e7eb' },
    gold: { headerBg: '#ca8a04', headerColor: '#ffffff', bandBg: '#fefce8', border: '#fef08a' },
    'deep-blue': { headerBg: '#1e40af', headerColor: '#ffffff', bandBg: '#eff6ff', border: '#bfdbfe' },
  };

  const handleApplyTableStyle = (styleName: string) => {
    setActiveTableStyle(styleName);
    const preset = TABLE_STYLES_MAP[styleName] || TABLE_STYLES_MAP.green;
    const nextData = { ...data };

    for (let r = rangeBounds.minRow; r <= rangeBounds.maxRow; r++) {
      const isHeader = hasHeaderRow && r === rangeBounds.minRow;
      const isTotal = hasTotalRow && r === rangeBounds.maxRow;
      const isBanded = hasBandedRows && !isHeader && !isTotal && (r % 2 === 1);

      for (let c = rangeBounds.minColIdx; c <= rangeBounds.maxColIdx; c++) {
        const cellId = `${COLS[c]}${r}`;
        const isFirstCol = hasFirstColumn && c === rangeBounds.minColIdx;
        const isLastCol = hasLastColumn && c === rangeBounds.maxColIdx;

        let bg = undefined;
        let color = undefined;
        let bold = undefined;

        if (isHeader) {
          bg = preset.headerBg;
          color = preset.headerColor;
          bold = true;
        } else if (isTotal) {
          bg = '#f8fafc';
          bold = true;
        } else if (isBanded) {
          bg = preset.bandBg;
        }

        if (isFirstCol || isLastCol) {
          bold = true;
        }

        nextData[cellId] = {
          ...(nextData[cellId] || { value: '' }),
          bg: bg !== undefined ? bg : nextData[cellId]?.bg,
          color: color !== undefined ? color : nextData[cellId]?.color,
          bold: bold !== undefined ? bold : nextData[cellId]?.bold,
          border: 'all',
        };
      }
    }

    const updatedSheets = {
      ...sheets,
      [activeSheetKey]: { ...currentSheet, data: nextData },
    };
    saveSheets(updatedSheets);
  };

  const handleToggleTotalRow = () => {
    const nextState = !hasTotalRow;
    setHasTotalRow(nextState);

    if (nextState) {
      const totalRow = rangeBounds.maxRow + 1;
      const nextData = { ...data };
      const firstCol = COLS[rangeBounds.minColIdx];
      nextData[`${firstCol}${totalRow}`] = {
        value: 'الإجمالي (Total)',
        bold: true,
        align: 'right',
        border: 'double-bottom',
        bg: '#f8fafc',
      };

      for (let c = rangeBounds.minColIdx + 1; c <= rangeBounds.maxColIdx; c++) {
        const col = COLS[c];
        const sumFormula = `=SUM(${col}${rangeBounds.minRow + 1}:${col}${rangeBounds.maxRow})`;
        nextData[`${col}${totalRow}`] = {
          value: evaluateExcelFormula(sumFormula, nextData, sheets),
          formula: sumFormula,
          bold: true,
          border: 'double-bottom',
          bg: '#f8fafc',
        };
      }

      const updatedSheets = {
        ...sheets,
        [activeSheetKey]: { ...currentSheet, data: recalculateSheet(nextData) },
      };
      saveSheets(updatedSheets);
    }
  };

  const handleCommitFormula = () => {
    let finalFormula = formulaInput.trim();
    if (finalFormula.startsWith('=')) {
      const openCount = (finalFormula.match(/\(/g) || []).length;
      const closeCount = (finalFormula.match(/\)/g) || []).length;
      if (openCount > closeCount) {
        finalFormula += ')'.repeat(openCount - closeCount);
      }
    }
    setFormulaInput(finalFormula);
    handleCellChange(selectedCell, finalFormula);
    setIsEditingCell(false);
    setShowAutocomplete(false);
    setFormulaReferencedRange([]);
    setTimeout(() => gridContainerRef.current?.focus(), 0);
  };

  const handleCancelFormulaEdit = () => {
    const orig = data[selectedCell]?.formula || data[selectedCell]?.value || '';
    setFormulaInput(orig);
    setIsEditingCell(false);
    setShowAutocomplete(false);
    setFormulaReferencedRange([]);
    setTimeout(() => gridContainerRef.current?.focus(), 0);
  };

  // Global keydown listener to allow continuous typing into cell immediately after Enter / navigation
  useEffect(() => {
    const handleGlobalGridKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInsideOtherInput = activeEl && (
        activeEl.tagName === 'INPUT' ||
        activeEl.tagName === 'TEXTAREA' ||
        activeEl.getAttribute('contenteditable') === 'true'
      );
      if (isInsideOtherInput) return;

      if (!gridContainerRef.current) return;

      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setIsEditingCell(true);
        handleCellChange(selectedCell, e.key);
        handleFormulaInputChange(e.key);
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
        handleClear('contents');
      }
    };

    window.addEventListener('keydown', handleGlobalGridKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalGridKeyDown);
  }, [selectedCell, isEditingCell, data, sheets, activeSheetKey]);

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
        onInsertImage={() => imageInputRef.current?.click()}
        onInsertFloatingImage={() => floatingImageInputRef.current?.click()}
        onInsertShape={(shapeType) => handleInsertShape(shapeType)}
        onCreateTable={handleCreateTable}
        tableName={tableName}
        onTableNameChange={setTableName}
        hasHeaderRow={hasHeaderRow}
        onToggleHeaderRow={() => setHasHeaderRow(!hasHeaderRow)}
        hasTotalRow={hasTotalRow}
        onToggleTotalRow={handleToggleTotalRow}
        hasBandedRows={hasBandedRows}
        onToggleBandedRows={() => setHasBandedRows(!hasBandedRows)}
        hasFirstColumn={hasFirstColumn}
        onToggleFirstColumn={() => setHasFirstColumn(!hasFirstColumn)}
        hasLastColumn={hasLastColumn}
        onToggleLastColumn={() => setHasLastColumn(!hasLastColumn)}
        hasBandedColumns={hasBandedColumns}
        onToggleBandedColumns={() => setHasBandedColumns(!hasBandedColumns)}
        hasFilterButton={hasFilterButton}
        onToggleFilterButton={() => setHasFilterButton(!hasFilterButton)}
        onApplyTableStyle={handleApplyTableStyle}
        activeTableStyle={activeTableStyle}
        onOpenFormatCells={(tab) => {
          setFormatCellsTab(tab || 'number');
          setIsFormatCellsOpen(true);
        }}
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

          {/* Cancel Button (✕) */}
          <button
            onClick={handleCancelFormulaEdit}
            className="w-6 h-6 flex items-center justify-center font-bold rounded text-gray-500 hover:text-red-600 hover:bg-red-50 cursor-pointer transition text-xs border border-gray-300 bg-white"
            title="إلغاء الأمر (Cancel / Esc)"
          >
            ✕
          </button>

          {/* Commit / Enter Button (✓) */}
          <button
            onClick={handleCommitFormula}
            className="w-6 h-6 flex items-center justify-center font-bold rounded text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100 cursor-pointer transition text-xs font-mono border border-emerald-400 bg-emerald-50"
            title="إدخال وحساب الصيغة (Enter / Commit)"
          >
            ✓
          </button>

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
              onKeyDown={(e) => {
                if (showAutocomplete && matchingFunctions.length > 0) {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setSelectedFunctionIndex((i) => Math.min(matchingFunctions.length - 1, i + 1));
                    return;
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setSelectedFunctionIndex((i) => Math.max(0, i - 1));
                    return;
                  } else if (e.key === 'Tab' || (e.key === 'Enter' && selectedFunctionIndex >= 0)) {
                    e.preventDefault();
                    handleSelectFunction(matchingFunctions[selectedFunctionIndex]);
                    return;
                  } else if (e.key === 'Escape') {
                    setShowAutocomplete(false);
                    return;
                  }
                }

                if (e.key === 'Enter') {
                  e.preventDefault();
                  let finalFormula = formulaInput.trim();
                  if (finalFormula.startsWith('=')) {
                    const openCount = (finalFormula.match(/\(/g) || []).length;
                    const closeCount = (finalFormula.match(/\)/g) || []).length;
                    if (openCount > closeCount) {
                      finalFormula += ')'.repeat(openCount - closeCount);
                    }
                  }
                  setFormulaInput(finalFormula);
                  handleCellChange(selectedCell, finalFormula);
                  setShowAutocomplete(false);
                  const coords = parseCellCoord(selectedCell);
                  if (coords.row < MAX_EXCEL_ROWS) {
                    const nextRow = coords.row + 1;
                    if (nextRow >= visibleRowCount) {
                      setVisibleRowCount((v) => Math.min(MAX_EXCEL_ROWS, nextRow + 50));
                    }
                    const nextId = `${COLS[coords.colIdx]}${nextRow}`;
                    setSelectedCell(nextId);
                    setSelectedRange([nextId]);
                  }
                  setTimeout(() => gridContainerRef.current?.focus(), 0);
                } else if (e.key === 'Escape') {
                  e.preventDefault();
                  setShowAutocomplete(false);
                  setFormulaInput(data[selectedCell]?.formula || data[selectedCell]?.value || '');
                  setTimeout(() => gridContainerRef.current?.focus(), 0);
                }
              }}
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

      {/* Toast Notification for Table / Image / Chart actions */}
      {tableNotification && (
        <div className="bg-emerald-700 text-white px-4 py-2 text-xs font-bold flex items-center justify-between shadow-md transition-all animate-in fade-in slide-in-from-top-1 z-30">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>{tableNotification}</span>
          </div>
          <button onClick={() => setTableNotification(null)} className="hover:bg-white/20 p-1 rounded cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 3. Main Spreadsheet Grid & Floating Objects Canvas (Excel 365) */}
      <div 
        ref={gridContainerRef}
        tabIndex={0}
        onKeyDown={handleGridKeyDown}
        onMouseUp={handleGridMouseUp}
        onScroll={(e) => {
          const target = e.currentTarget;
          if (target.scrollTop + target.clientHeight >= target.scrollHeight - 350) {
            setVisibleRowCount((prev) => Math.min(MAX_EXCEL_ROWS, prev + 100));
          }
        }}
        className="flex-1 overflow-auto bg-gray-100 p-1 relative outline-none focus:ring-0"
        style={{ transform: `scale(${zoom / 100})`, transformOrigin: isRTL ? 'top right' : 'top left' }}
      >
        {/* Office 365 Movable Floating Objects Layer (Charts, Shapes, Images) */}
        {floatingObjects.map((obj) => {
          const isSelected = selectedFloatingId === obj.id;
          return (
            <div
              key={obj.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFloatingId(obj.id);
              }}
              style={{
                position: 'absolute',
                left: `${obj.x}px`,
                top: `${obj.y}px`,
                width: `${obj.width}px`,
                height: `${obj.height}px`,
                zIndex: isSelected ? 40 : 25,
              }}
              className={`select-none rounded-lg transition-shadow ${
                isSelected
                  ? 'ring-2 ring-[#107c41] shadow-2xl bg-white'
                  : 'hover:ring-1 hover:ring-gray-400 shadow-lg bg-white/95'
              }`}
            >
              {/* Top Drag Handle Bar (Office 365 Header) */}
              <div
                onMouseDown={(e) => {
                  if (e.button !== 0) return;
                  e.stopPropagation();
                  setDraggingObjId(obj.id);
                  setSelectedFloatingId(obj.id);
                  dragStartRef.current = {
                    mouseX: e.clientX,
                    mouseY: e.clientY,
                    startX: obj.x,
                    startY: obj.y,
                  };
                }}
                className={`px-2 py-1.5 flex items-center justify-between border-b cursor-move rounded-t-lg ${
                  isSelected ? 'bg-emerald-50 border-emerald-300' : 'bg-gray-100/90 border-gray-200'
                }`}
                title="اسحب بالماوس لتحريك العنصر ونقله إلى أي مكان في ورقة العمل"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 truncate">
                  {obj.type === 'chart' && <BarChart2 className="w-3.5 h-3.5 text-[#107c41]" />}
                  {obj.type === 'shape' && <span className="text-xs">🔷</span>}
                  {obj.type === 'image' && <span className="text-xs">🖼️</span>}
                  <span className="truncate">{obj.title || 'عنصر عائم'}</span>
                </div>

                <div className="flex items-center gap-1">
                  {obj.type === 'chart' && obj.chartDef && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-[#107c41] font-bold">
                      {obj.chartDef.type}
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFloatingObject(obj.id);
                    }}
                    className="p-1 hover:bg-red-50 text-red-500 rounded cursor-pointer transition"
                    title="حذف العنصر من ورقة العمل"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Object Body */}
              <div className="p-2 w-full h-[calc(100%-34px)] overflow-hidden flex flex-col justify-center items-center">
                {/* 1. CHART RENDERER */}
                {obj.type === 'chart' && obj.chartDef && (
                  <div className="w-full h-full flex flex-col justify-between">
                    {obj.chartDef.type === 'pie' ? (
                      <div className="w-full h-full flex items-center justify-around gap-2 p-1">
                        <svg viewBox="0 0 100 100" className="w-28 h-28 shrink-0">
                          {(() => {
                            const total = obj.chartDef.items.reduce((s, i) => s + (i.val || 0), 0) || 1;
                            const colors = ['#107c41', '#0284c7', '#f59e0b', '#ec4899', '#8b5cf6', '#14b8a6', '#64748b'];
                            let accumulatedPercent = 0;
                            return obj.chartDef.items.slice(0, 6).map((item, idx) => {
                              const percent = (item.val || 0) / total;
                              const startAngle = accumulatedPercent * 2 * Math.PI;
                              accumulatedPercent += percent;
                              const endAngle = accumulatedPercent * 2 * Math.PI;
                              const x1 = 50 + 40 * Math.sin(startAngle);
                              const y1 = 50 - 40 * Math.cos(startAngle);
                              const x2 = 50 + 40 * Math.sin(endAngle);
                              const y2 = 50 - 40 * Math.cos(endAngle);
                              const largeArc = percent > 0.5 ? 1 : 0;
                              const pathData = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`;
                              return (
                                <path
                                  key={idx}
                                  d={pathData}
                                  fill={colors[idx % colors.length]}
                                  stroke="#ffffff"
                                  strokeWidth="1.5"
                                  className="hover:opacity-85 transition-opacity"
                                />
                              );
                            });
                          })()}
                        </svg>
                        <div className="flex flex-col gap-1 overflow-y-auto max-h-full text-[10px]">
                          {obj.chartDef.items.slice(0, 5).map((it, idx) => {
                            const colors = ['#107c41', '#0284c7', '#f59e0b', '#ec4899', '#8b5cf6', '#14b8a6', '#64748b'];
                            return (
                              <div key={idx} className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-xs shrink-0" style={{ backgroundColor: colors[idx % colors.length] }} />
                                <span className="truncate max-w-[80px] font-semibold text-gray-700">{it.label}:</span>
                                <span className="font-mono text-gray-900 font-bold">{it.val}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : obj.chartDef.type === 'line' || obj.chartDef.type === 'area' ? (
                      <div className="w-full h-full flex flex-col justify-between p-2">
                        <svg viewBox="0 0 300 120" className="w-full h-full">
                          {(() => {
                            const maxVal = Math.max(...obj.chartDef.items.map((i) => i.val), 1);
                            const pts = obj.chartDef.items.slice(0, 10).map((it, idx, arr) => {
                              const x = arr.length > 1 ? (idx / (arr.length - 1)) * 280 + 10 : 150;
                              const y = 110 - (it.val / maxVal) * 90;
                              return { x, y, label: it.label, val: it.val };
                            });
                            const polylinePts = pts.map((p) => `${p.x},${p.y}`).join(' ');
                            return (
                              <>
                                {obj.chartDef.type === 'area' && (
                                  <polygon
                                    points={`10,115 ${polylinePts} 290,115`}
                                    fill="#107c41"
                                    fillOpacity="0.2"
                                  />
                                )}
                                <polyline
                                  fill="none"
                                  stroke="#107c41"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  points={polylinePts}
                                />
                                {pts.map((p, idx) => (
                                  <g key={idx}>
                                    <circle cx={p.x} cy={p.y} r="4" fill="#ffffff" stroke="#107c41" strokeWidth="2" />
                                    <text x={p.x} y={p.y - 7} fontSize="9" textAnchor="middle" fill="#107c41" fontWeight="bold">
                                      {p.val}
                                    </text>
                                  </g>
                                ))}
                              </>
                            );
                          })()}
                        </svg>
                        <div className="flex justify-between text-[9px] text-gray-500 border-t border-gray-200 pt-1">
                          {obj.chartDef.items.slice(0, 6).map((it, idx) => (
                            <span key={idx} className="truncate max-w-[50px] text-center" title={it.label}>{it.label}</span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      /* Column / Bar Chart */
                      <div className="w-full h-full flex items-end justify-between gap-1.5 pt-2 pb-1 border-b border-gray-200">
                        {(() => {
                          const maxVal = Math.max(...obj.chartDef.items.map((i) => i.val), 1);
                          return obj.chartDef.items.slice(0, 10).map((it, idx) => {
                            const heightPercent = Math.max(10, Math.round((it.val / maxVal) * 88));
                            return (
                              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                                <span className="text-[9px] font-mono text-gray-700 font-bold mb-0.5">
                                  {it.val}
                                </span>
                                <div
                                  className="w-full bg-[#107c41] rounded-t-xs hover:bg-emerald-500 transition-all cursor-pointer shadow-xs"
                                  style={{ height: `${heightPercent}%` }}
                                  title={`${it.label}: ${it.val}`}
                                />
                                <span className="text-[8.5px] text-gray-600 truncate w-full text-center mt-1 font-medium" title={it.label}>
                                  {it.label}
                                </span>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    )}
                  </div>
                )}

                {/* 2. SHAPE RENDERER */}
                {obj.type === 'shape' && (
                  <div
                    onDoubleClick={() => setEditingShapeTextId(obj.id)}
                    style={{ backgroundColor: obj.bg || '#107c41', color: obj.color || '#ffffff' }}
                    className={`w-full h-full flex items-center justify-center p-3 text-center font-bold text-xs shadow-md transition ${
                      obj.shapeType === 'rounded-rect'
                        ? 'rounded-2xl'
                        : obj.shapeType === 'circle'
                        ? 'rounded-full'
                        : obj.shapeType === 'diamond'
                        ? 'rounded-xs rotate-45 scale-75'
                        : 'rounded-sm'
                    }`}
                  >
                    <div className={obj.shapeType === 'diamond' ? '-rotate-45' : ''}>
                      {editingShapeTextId === obj.id ? (
                        <input
                          autoFocus
                          type="text"
                          defaultValue={obj.text || ''}
                          onBlur={(e) => {
                            const val = e.target.value;
                            setFloatingObjects((prev) =>
                              prev.map((o) => (o.id === obj.id ? { ...o, text: val } : o))
                            );
                            setEditingShapeTextId(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              (e.target as HTMLInputElement).blur();
                            }
                          }}
                          className="bg-white/90 text-gray-900 text-xs px-2 py-1 rounded outline-none border border-white text-center font-bold"
                        />
                      ) : (
                        <span>{obj.text || obj.title || 'شكل'}</span>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. IMAGE RENDERER */}
                {obj.type === 'image' && obj.imageSrc && (
                  <img
                    src={obj.imageSrc}
                    alt={obj.title || 'صورة'}
                    className="w-full h-full object-contain pointer-events-none rounded select-none"
                  />
                )}
              </div>

              {/* Office 365 Resize Handle at Bottom-Right Corner */}
              {isSelected && (
                <>
                  <div
                    onMouseDown={(e) => {
                      if (e.button !== 0) return;
                      e.stopPropagation();
                      setResizingObjId(obj.id);
                      resizeStartRef.current = {
                        mouseX: e.clientX,
                        mouseY: e.clientY,
                        startW: obj.width,
                        startH: obj.height,
                      };
                    }}
                    className="absolute -bottom-2 -left-2 w-4 h-4 bg-white border-2 border-[#107c41] rounded-xs cursor-sw-resize shadow-md hover:scale-125 transition-transform z-50"
                    title="تغيير أبعاد وحجم العنصر"
                  />
                  <div
                    onMouseDown={(e) => {
                      if (e.button !== 0) return;
                      e.stopPropagation();
                      setResizingObjId(obj.id);
                      resizeStartRef.current = {
                        mouseX: e.clientX,
                        mouseY: e.clientY,
                        startW: obj.width,
                        startH: obj.height,
                      };
                    }}
                    className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border-2 border-[#107c41] rounded-xs cursor-se-resize shadow-md hover:scale-125 transition-transform z-50"
                    title="تغيير أبعاد وحجم العنصر"
                  />
                </>
              )}
            </div>
          );
        })}
        <table className={`border-collapse bg-white shadow-xs min-w-full ${isRTL ? 'text-right' : 'text-left'}`}>
          {showHeadings && (
            <thead className={freezeState === 'row' || freezeState === 'both' ? 'sticky top-0 z-20 shadow-xs' : ''}>
              <tr className="bg-[#f3f2f1] text-gray-600 font-semibold text-[11px]">
                {/* Excel Top-Corner Select All Button */}
                <th 
                  onClick={handleSelectAllSheet}
                  className={`w-10 p-1 border border-gray-300 text-center bg-[#eae8e6] hover:bg-emerald-100 cursor-pointer transition-colors select-none ${
                    (freezeState === 'col' || freezeState === 'both') ? 'sticky right-0 z-30' : ''
                  }`}
                  title="تحديد المصنف بالكامل (Select All)"
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-gray-500 hover:text-[#107c41]" viewBox="0 0 16 16" fill="currentColor">
                      <polygon points="2,14 14,14 14,2" />
                    </svg>
                  </div>
                </th>
                {COLS.map((col, cIdx) => {
                  if (hiddenCols.has(col)) return null;
                  const isColInRange = cIdx >= rangeBounds.minColIdx && cIdx <= rangeBounds.maxColIdx;
                  const colW = colWidths[col] || 110;
                  return (
                    <th 
                      key={col} 
                      onMouseDown={(e) => handleColHeaderMouseDown(cIdx, e)}
                      onMouseEnter={() => handleColHeaderMouseEnter(cIdx)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        setContextMenu({
                          visible: true,
                          type: 'col',
                          x: e.clientX,
                          y: e.clientY,
                          cellId: `${col}1`,
                          colName: col,
                        });
                      }}
                      className={`p-1 border border-gray-300 text-center select-none transition-colors relative group/colheader ${
                        isColInRange ? 'bg-emerald-100 text-[#107c41] font-bold border-b-2 border-b-[#107c41]' : 'bg-[#f3f2f1] hover:bg-gray-200 text-gray-700'
                      } ${
                        (freezeState === 'col' || freezeState === 'both') && cIdx === 0 ? 'sticky right-10 z-20 shadow-xs' : ''
                      }`}
                      style={{
                        width: `${colW}px`,
                        minWidth: `${colW}px`,
                        cursor: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%23000' d='M8 13L2 6h12z'/%3E%3C/svg%3E\") 8 13, pointer",
                      }}
                      title={`تحديد وتظليل العمود ${col} بالكامل (انقر أو اسحب لتحديد عدة أعمدة)`}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>{col}</span>
                        {showFilterActive && (
                          <button
                            onClick={() => handleSort('asc')}
                            className="text-[9px] text-emerald-800 bg-white border border-gray-300 rounded px-1 hover:bg-emerald-50 cursor-pointer"
                            title="تصفية وفرز العمود"
                          >
                            ▼
                          </button>
                        )}
                      </div>

                      {/* Interactive Column Resize Divider with '+' Handle */}
                      <div
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setResizingCol({
                            col,
                            startX: e.clientX,
                            startWidth: colW,
                          });
                        }}
                        onMouseEnter={() => setHoveredColDivider(col)}
                        onMouseLeave={() => setHoveredColDivider(null)}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          setColWidths((prev) => ({ ...prev, [col]: 110 }));
                        }}
                        className={`absolute top-0 bottom-0 ${isRTL ? 'left-0 -translate-x-1/2' : 'right-0 translate-x-1/2'} w-3 z-30 cursor-col-resize flex items-center justify-center group/resize`}
                        title={`تكبير وتصغير مساحة العمود ${col} (اسحب للتكبير أو التصغير، انقر مرتين للضبط الافتراضي)`}
                      >
                        {/* Divider Line */}
                        <div
                          className={`w-0.5 h-full transition-colors ${
                            resizingCol?.col === col || hoveredColDivider === col
                              ? 'bg-[#107c41]'
                              : 'bg-transparent group-hover/resize:bg-[#107c41]/50'
                          }`}
                        />
                        {/* '+' Badge Indicator */}
                        <div
                          className={`absolute w-4 h-4 rounded-full bg-[#107c41] text-white flex items-center justify-center text-[10px] font-bold shadow-lg transition-all ${
                            resizingCol?.col === col || hoveredColDivider === col
                              ? 'opacity-100 scale-110 ring-2 ring-emerald-300'
                              : 'opacity-0 group-hover/resize:opacity-100 scale-95'
                          }`}
                        >
                          +
                        </div>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
          )}
          <tbody>
            {Array.from({ length: visibleRowCount }).map((_, rIdx) => {
              const rowNum = rIdx + 1;
              if (hiddenRows.has(rowNum)) return null;
              const isRowInRange = rowNum >= rangeBounds.minRow && rowNum <= rangeBounds.maxRow;

              return (
                <tr 
                  key={rowNum} 
                  className="hover:bg-emerald-50/20"
                  style={{ height: rowHeights[rowNum] ? `${rowHeights[rowNum]}px` : undefined }}
                >
                  {/* Row Header */}
                  {showHeadings && (
                    <td 
                      onMouseDown={(e) => handleRowHeaderMouseDown(rowNum, e)}
                      onMouseEnter={() => handleRowHeaderMouseEnter(rowNum)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        setContextMenu({
                          visible: true,
                          type: 'row',
                          x: e.clientX,
                          y: e.clientY,
                          cellId: `A${rowNum}`,
                          rowNum,
                        });
                      }}
                      className={`p-1 border border-gray-300 text-center text-gray-500 font-mono text-[10px] select-none transition-colors relative group/rowheader ${
                        isRowInRange ? 'bg-emerald-100 text-[#107c41] font-bold border-r-2 border-r-[#107c41]' : 'bg-[#f3f2f1] hover:bg-gray-200'
                      } ${
                        (freezeState === 'col' || freezeState === 'both') ? 'sticky right-0 z-10 bg-[#f3f2f1]' : ''
                      }`}
                      style={{
                        cursor: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%23000' d='M13 8L6 2v12z'/%3E%3C/svg%3E\") 13 8, pointer",
                        height: rowHeights[rowNum] ? `${rowHeights[rowNum]}px` : undefined,
                      }}
                      title={`تحديد الصف ${rowNum} بالكامل (انقر أو اسحب لتحديد عدة صفوف)`}
                    >
                      <span>{rowNum}</span>

                      {/* Interactive Row Resize Divider with '+' Handle */}
                      <div
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setResizingRow({
                            row: rowNum,
                            startY: e.clientY,
                            startHeight: rowHeights[rowNum] || 24,
                          });
                        }}
                        onMouseEnter={() => setHoveredRowDivider(rowNum)}
                        onMouseLeave={() => setHoveredRowDivider(null)}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          setRowHeights((prev) => ({ ...prev, [rowNum]: 24 }));
                        }}
                        className="absolute bottom-0 inset-x-0 h-3 z-30 cursor-row-resize flex items-center justify-center translate-y-1/2 group/rowresize"
                        title={`تكبير وتصغير مساحة الصف ${rowNum} (اسحب لتغيير الارتفاع، انقر مرتين للضبط الافتراضي)`}
                      >
                        {/* Divider Line */}
                        <div
                          className={`h-0.5 w-full transition-colors ${
                            resizingRow?.row === rowNum || hoveredRowDivider === rowNum
                              ? 'bg-[#107c41]'
                              : 'bg-transparent group-hover/rowresize:bg-[#107c41]/50'
                          }`}
                        />
                        {/* '+' Badge Indicator */}
                        <div
                          className={`absolute w-3.5 h-3.5 rounded-full bg-[#107c41] text-white flex items-center justify-center text-[9px] font-bold shadow-lg transition-all ${
                            resizingRow?.row === rowNum || hoveredRowDivider === rowNum
                              ? 'opacity-100 scale-110 ring-2 ring-emerald-300'
                              : 'opacity-0 group-hover/rowresize:opacity-100 scale-95'
                          }`}
                        >
                          +
                        </div>
                      </div>
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

                    const effectiveAlign = cell?.align || (isRTL ? 'right' : 'left');
                    const flexJustify = effectiveAlign === 'center' ? 'center' : (effectiveAlign === 'right' ? 'flex-end' : 'flex-start');
                    const isReferencedInFormula = formulaReferencedRange.includes(cellId);

                    return (
                      <td
                        key={cellId}
                        tabIndex={isSelected ? 0 : -1}
                        colSpan={cell?.mergeColSpan || 1}
                        rowSpan={cell?.mergeRowSpan || 1}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          if (!selectedRange.includes(cellId)) {
                            setSelectedCell(cellId);
                            setSelectedRange([cellId]);
                          }
                          setContextMenu({
                            visible: true,
                            type: 'cell',
                            x: e.clientX,
                            y: e.clientY,
                            cellId,
                          });
                        }}
                        onMouseDown={(e) => {
                          if (e.button === 2) {
                            e.preventDefault();
                            return;
                          }
                          handleGridCellMouseDown(cellId, e);
                        }}
                        onMouseEnter={() => handleGridCellMouseEnter(cellId)}
                        className={`p-1 relative transition-all select-none ${
                          showGridlines ? 'border border-gray-300' : 'border border-transparent'
                        } ${isStickyCol ? 'sticky right-10 z-10 bg-white' : ''}`}
                        style={{
                          backgroundColor: isFillPreviewRow
                            ? 'rgba(16, 124, 65, 0.08)'
                            : (isReferencedInFormula
                              ? 'rgba(0, 120, 212, 0.12)'
                              : (inRange && !isSelected
                                ? 'rgba(16, 124, 65, 0.12)'
                                : (cell?.bg || (isSelected ? '#ffffff' : undefined)))),
                          color: cell?.color,
                          fontWeight: cell?.bold ? 'bold' : 'normal',
                          fontStyle: cell?.italic ? 'italic' : 'normal',
                          textDecoration: [
                            cell?.underline ? 'underline' : '',
                            cell?.strikethrough ? 'line-through' : '',
                          ].filter(Boolean).join(' ') || undefined,
                          textAlign: effectiveAlign,
                          verticalAlign: cell?.verticalAlign || 'middle',
                          fontFamily: cell?.fontFamily || fontFamily,
                          fontSize: cell?.fontSize ? `${cell.fontSize}px` : undefined,
                          whiteSpace: cell?.wrapText ? 'normal' : 'nowrap',
                          borderTop: isTopBorder ? '2px solid #107c41' : cellBorderStyle.borderTop || cellBorderStyle.border,
                          borderBottom: isBottomBorder ? '2px solid #107c41' : cellBorderStyle.borderBottom || cellBorderStyle.border,
                          borderRight: isRightBorder ? '2px solid #107c41' : cellBorderStyle.borderRight || cellBorderStyle.border,
                          borderLeft: isLeftBorder ? '2px solid #107c41' : cellBorderStyle.borderLeft || cellBorderStyle.border,
                          outline: isReferencedInFormula
                            ? '2px dashed #0078d4'
                            : (isFillPreviewRow
                              ? '1px dashed #107c41'
                              : (isSelected && selectedRange.length <= 1 ? '2px solid #107c41' : undefined)),
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
                          <div 
                            className="relative w-full h-full flex items-center"
                            style={{ justifyContent: flexJustify }}
                          >
                            {isSelected && isEditingCell ? (
                              <input
                                ref={(el) => {
                                  if (el) {
                                    el.focus();
                                    const len = el.value.length;
                                    el.setSelectionRange(len, len);
                                  }
                                }}
                                type="text"
                                value={
                                  showFormulasMode && cell?.formula
                                    ? cell.formula
                                    : (cell?.formula || formatCellValue(cell))
                                }
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
                                      return;
                                    } else if (e.key === 'ArrowUp') {
                                      e.preventDefault();
                                      setSelectedFunctionIndex((i) => Math.max(0, i - 1));
                                      return;
                                    } else if (e.key === 'Enter' || e.key === 'Tab') {
                                      e.preventDefault();
                                      handleSelectFunction(matchingFunctions[selectedFunctionIndex]);
                                      return;
                                    } else if (e.key === 'Escape') {
                                      setShowAutocomplete(false);
                                      return;
                                    }
                                  }

                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    let finalFormula = formulaInput.trim();
                                    if (finalFormula.startsWith('=')) {
                                      const openCount = (finalFormula.match(/\(/g) || []).length;
                                      const closeCount = (finalFormula.match(/\)/g) || []).length;
                                      if (openCount > closeCount) {
                                        finalFormula += ')'.repeat(openCount - closeCount);
                                      }
                                    }
                                    setFormulaInput(finalFormula);
                                    handleCellChange(cellId, finalFormula);
                                    setIsEditingCell(false);
                                    setShowAutocomplete(false);
                                    setFormulaReferencedRange([]);
                                    const coords = parseCellCoord(cellId);
                                    if (coords.row < MAX_EXCEL_ROWS) {
                                      const nextRow = coords.row + 1;
                                      if (nextRow >= visibleRowCount) {
                                        setVisibleRowCount((v) => Math.min(MAX_EXCEL_ROWS, nextRow + 50));
                                      }
                                      const nextId = `${COLS[coords.colIdx]}${nextRow}`;
                                      setSelectedCell(nextId);
                                      setSelectedRange([nextId]);
                                      const nextCell = data[nextId];
                                      setFormulaInput(nextCell?.formula || nextCell?.value || '');
                                    }
                                    setTimeout(() => gridContainerRef.current?.focus(), 10);
                                  } else if (e.key === 'Tab') {
                                    e.preventDefault();
                                    setIsEditingCell(false);
                                    setShowAutocomplete(false);
                                    setFormulaReferencedRange([]);
                                    const coords = parseCellCoord(cellId);
                                    if (coords.colIdx < COLS.length - 1) {
                                      const nextId = `${COLS[coords.colIdx + 1]}${coords.row}`;
                                      setSelectedCell(nextId);
                                      setSelectedRange([nextId]);
                                      const nextCell = data[nextId];
                                      setFormulaInput(nextCell?.formula || nextCell?.value || '');
                                    }
                                    setTimeout(() => gridContainerRef.current?.focus(), 10);
                                  } else if (e.key === 'Escape') {
                                    setIsEditingCell(false);
                                    setShowAutocomplete(false);
                                    setFormulaReferencedRange([]);
                                    setTimeout(() => gridContainerRef.current?.focus(), 10);
                                  }
                                }}
                                className={`w-full bg-white border border-[#107c41] outline-none text-xs px-1 text-gray-900 font-mono shadow-xs z-30`}
                                style={{
                                  textAlign: effectiveAlign,
                                }}
                              />
                            ) : (
                              <div
                                onDoubleClick={() => setIsEditingCell(true)}
                                className={`w-full px-1 truncate text-xs select-none flex items-center gap-1.5`}
                                style={{
                                  textAlign: effectiveAlign,
                                  justifyContent: flexJustify,
                                }}
                              >
                                {cell?.image && (
                                  <img
                                    src={cell.image}
                                    alt="خلية"
                                    className="w-5 h-5 rounded object-cover border border-emerald-600 shrink-0 shadow-2xs"
                                    title="صورة مدرجة في الخلية"
                                  />
                                )}
                                <span 
                                  className="truncate"
                                  style={{
                                    textAlign: effectiveAlign,
                                    width: effectiveAlign === 'center' ? '100%' : undefined,
                                    display: 'inline-block',
                                  }}
                                >
                                  {showFormulasMode && cell?.formula ? cell.formula : formatCellValue(cell)}
                                </span>
                              </div>
                            )}

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

      {/* Active Column / Row Resizing Feedback Badge */}
      {resizingCol && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 bg-[#107c41] text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-2xl flex items-center gap-2 animate-in fade-in">
          <span>العمود {resizingCol.col}:</span>
          <span>العرض {colWidths[resizingCol.col] || 110} بكسل</span>
        </div>
      )}
      {resizingRow && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 bg-[#107c41] text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-2xl flex items-center gap-2 animate-in fade-in">
          <span>الصف {resizingRow.row}:</span>
          <span>الارتفاع {rowHeights[resizingRow.row] || 24} بكسل</span>
        </div>
      )}

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
            <div className="text-[10px] text-gray-500 font-mono hidden sm:flex items-center gap-2">
              <span className="text-[#107c41] font-bold">● جاهز (Ready)</span>
              <span>|</span>
              <span>الصفوف: {visibleRowCount.toLocaleString('ar-EG')} من 1,048,576 (Excel 365)</span>
              <span>|</span>
              <span>الأعمدة: A إلى AZ (52 عمود)</span>
            </div>
          )}
        </div>
      </div>

      {/* Hidden File Input for Image Insertion */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageFileUpload}
        className="hidden"
      />
      <input
        ref={floatingImageInputRef}
        type="file"
        accept="image/*"
        onChange={handleFloatingImageUpload}
        className="hidden"
      />

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

          for (let r = 4; r <= Math.min(visibleRowCount + 50, MAX_EXCEL_ROWS); r++) {
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
        onInsertChart={handleInsertChart}
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

      {/* 6. Excel 365 Right-Click Context Menu + Mini Toolbar */}
      {contextMenu && contextMenu.visible && (
        <ExcelContextMenu
          type={contextMenu.type}
          x={contextMenu.x}
          y={contextMenu.y}
          cellId={contextMenu.cellId}
          rowNum={contextMenu.rowNum}
          colName={contextMenu.colName}
          cellData={data[contextMenu.cellId]}
          columnUniqueValues={getColumnUniqueValues(contextMenu.cellId)}
          onClose={() => setContextMenu(null)}
          onCut={handleCut}
          onCopy={handleCopy}
          onPaste={handlePaste}
          onPasteSpecial={handlePasteSpecial}
          onClearContents={() => handleClear('contents')}
          onInsertRow={(r) => handleInsertRow(r)}
          onDeleteRow={(r) => handleDeleteRow(r)}
          onInsertCol={(c) => handleInsertCol(c)}
          onDeleteCol={(c) => handleDeleteCol(c)}
          onFormatRange={handleFormatRange}
          onSetAlignment={handleSetAlignment}
          onSort={handleSort}
          onFilterByValue={(val) => {
            if (!val) {
              setShowFilterActive(false);
              return;
            }
            setShowFilterActive(true);
            setTableNotification(`تم تطبيق التصفية على القيمة "${val}" بنجاح!`);
            setTimeout(() => setTableNotification(null), 3500);
          }}
          onInsertComment={() => {
            const currentComment = data[contextMenu.cellId]?.comment || '';
            const newComment = prompt('أدخل التعليق أو الملاحظة للخلية (Insert Comment):', currentComment);
            if (newComment !== null) {
              handleFormatRange('comment', newComment);
            }
          }}
          onOpenNameManager={() => setIsNameManagerOpen(true)}
          onOpenQuickAnalysis={() => setIsChartModalOpen(true)}
          onSetRowHeight={(r, h) => setRowHeights((prev) => ({ ...prev, [r]: h }))}
          onSetColWidth={(c, w) => setColWidths((prev) => ({ ...prev, [c]: w }))}
          onHideRow={(r) => setHiddenRows((prev) => new Set(prev).add(r))}
          onUnhideRows={() => setHiddenRows(new Set())}
          onHideCol={(c) => setHiddenCols((prev) => new Set(prev).add(c))}
          onUnhideCols={() => setHiddenCols(new Set())}
          onPickDropdownValue={(val) => handleCellChange(contextMenu.cellId, val)}
          onOpenFormatCells={(tab) => {
            setFormatCellsTab(tab || 'number');
            setIsFormatCellsOpen(true);
          }}
        />
      )}

      {/* 7. Excel Official Format Cells Modal (Number, Alignment, Font, Border, Fill, Protection) */}
      <FormatCellsModal
        isOpen={isFormatCellsOpen}
        initialTab={formatCellsTab}
        currentCell={data[selectedCell]}
        cellAddress={selectedCell}
        sampleValue={data[selectedCell]?.value || '1234.56'}
        onClose={() => setIsFormatCellsOpen(false)}
        onApply={handleApplyFormatCells}
      />
    </div>
  );
};
