import React, { useState, useEffect, useRef } from 'react';
import {
  Scissors,
  Copy,
  Clipboard,
  Sparkles,
  Plus,
  Trash2,
  Eraser,
  BarChart2,
  Filter,
  ArrowUpDown,
  MessageSquarePlus,
  TableProperties,
  ListFilter,
  Bookmark,
  Link,
  ChevronRight,
  Bold,
  Italic,
  AlignCenter,
  PaintBucket,
  Grid,
  Paintbrush,
  DollarSign,
  Percent,
} from 'lucide-react';
import { SheetCell } from '../../../types';

export interface ExcelContextMenuProps {
  type: 'cell' | 'row' | 'col';
  x: number;
  y: number;
  cellId: string;
  rowNum?: number;
  colName?: string;
  cellData?: SheetCell;
  columnUniqueValues?: string[];
  onClose: () => void;
  onCut: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onPasteSpecial: (mode: 'values' | 'formulas' | 'formats') => void;
  onClearContents: () => void;
  onInsertRow?: (r?: number) => void;
  onDeleteRow?: (r?: number) => void;
  onInsertCol?: (c?: string) => void;
  onDeleteCol?: (c?: string) => void;
  onFormatRange: (key: keyof SheetCell, value: any) => void;
  onSetAlignment: (hAlign: 'right' | 'center' | 'left', vAlign?: 'top' | 'middle' | 'bottom') => void;
  onSort: (dir: 'asc' | 'desc') => void;
  onFilterByValue?: (val: string) => void;
  onInsertComment?: () => void;
  onOpenNameManager?: () => void;
  onOpenQuickAnalysis?: () => void;
  onSetRowHeight?: (r: number, height: number) => void;
  onSetColWidth?: (col: string, width: number) => void;
  onHideRow?: (r: number) => void;
  onUnhideRows?: () => void;
  onHideCol?: (col: string) => void;
  onUnhideCols?: () => void;
  onPickDropdownValue?: (val: string) => void;
}

export const ExcelContextMenu: React.FC<ExcelContextMenuProps> = ({
  type,
  x,
  y,
  cellId,
  rowNum,
  colName,
  cellData,
  columnUniqueValues = [],
  onClose,
  onCut,
  onCopy,
  onPaste,
  onPasteSpecial,
  onClearContents,
  onInsertRow,
  onDeleteRow,
  onInsertCol,
  onDeleteCol,
  onFormatRange,
  onSetAlignment,
  onSort,
  onFilterByValue,
  onInsertComment,
  onOpenNameManager,
  onOpenQuickAnalysis,
  onSetRowHeight,
  onSetColWidth,
  onHideRow,
  onUnhideRows,
  onHideCol,
  onUnhideCols,
  onPickDropdownValue,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [showFilterSubmenu, setShowFilterSubmenu] = useState(false);
  const [showSortSubmenu, setShowSortSubmenu] = useState(false);
  const [showDropdownSubmenu, setShowDropdownSubmenu] = useState(false);
  const [showPasteSubmenu, setShowPasteSubmenu] = useState(false);

  // Position bounds safety check
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x, y });

  useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      let adjX = x;
      let adjY = y;
      if (adjX + rect.width > window.innerWidth) {
        adjX = Math.max(10, window.innerWidth - rect.width - 15);
      }
      if (adjY + rect.height > window.innerHeight) {
        adjY = Math.max(10, window.innerHeight - rect.height - 15);
      }
      setCoords({ x: adjX, y: adjY });
    }
  }, [x, y]);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    window.addEventListener('mousedown', handleOutsideClick);
    return () => window.removeEventListener('mousedown', handleOutsideClick);
  }, [onClose]);

  const currentFontSize = cellData?.fontSize || 11;
  const currentFontFamily = cellData?.fontFamily || 'Calibri';

  return (
    <div
      ref={menuRef}
      style={{ top: `${coords.y}px`, left: `${coords.x}px` }}
      className="fixed z-100 bg-white border border-gray-300 rounded shadow-2xl text-[12px] text-gray-800 font-sans select-none w-64 divide-y divide-gray-200 animate-in fade-in zoom-in-95 duration-100"
      dir="ltr"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* 1. MINI TOOLBAR (Excel 365 exact layout) */}
      <div className="p-1.5 bg-[#fbfbfb] border-b border-gray-200 space-y-1">
        {/* Row 1: Font, Size, A^, Av, Currency, %, Comma */}
        <div className="flex items-center gap-1 justify-between">
          <select
            value={currentFontFamily}
            onChange={(e) => onFormatRange('fontFamily', e.target.value)}
            className="border border-gray-300 rounded px-1 py-0.5 text-[11px] bg-white text-gray-800 w-24 outline-none focus:border-[#107c41]"
          >
            <option value="Calibri">Calibri</option>
            <option value="Arial">Arial</option>
            <option value="Segoe UI">Segoe UI</option>
            <option value="Tahoma">Tahoma</option>
            <option value="Cairo">Cairo</option>
            <option value="Tajawal">Tajawal</option>
          </select>

          <select
            value={currentFontSize}
            onChange={(e) => onFormatRange('fontSize', parseInt(e.target.value, 10))}
            className="border border-gray-300 rounded px-1 py-0.5 text-[11px] bg-white text-gray-800 w-12 outline-none focus:border-[#107c41]"
          >
            {[8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <button
            onClick={() => onFormatRange('fontSize', currentFontSize + 1)}
            className="p-1 hover:bg-gray-200 rounded text-gray-700 font-bold text-[10px]"
            title="Increase Font Size"
          >
            A↑
          </button>
          <button
            onClick={() => onFormatRange('fontSize', Math.max(8, currentFontSize - 1))}
            className="p-1 hover:bg-gray-200 rounded text-gray-700 text-[10px]"
            title="Decrease Font Size"
          >
            A↓
          </button>

          <button
            onClick={() => onFormatRange('format', 'currency')}
            className="p-1 hover:bg-gray-200 rounded text-gray-700 font-bold"
            title="Accounting / Currency Format ($)"
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-800" />
          </button>
          <button
            onClick={() => onFormatRange('format', 'percent')}
            className="p-1 hover:bg-gray-200 rounded text-gray-700 font-bold"
            title="Percent Style (%)"
          >
            <Percent className="w-3.5 h-3.5 text-gray-700" />
          </button>
          <button
            onClick={() => onFormatRange('format', 'number')}
            className="p-1 hover:bg-gray-200 rounded text-gray-700 font-bold text-[11px]"
            title="Comma Style (,)"
          >
            ,
          </button>
        </div>

        {/* Row 2: Bold, Italic, Align Center, Fill Color, Font Color, Borders, Decimals, Format Painter */}
        <div className="flex items-center gap-1 justify-between pt-0.5">
          <button
            onClick={() => onFormatRange('bold', !cellData?.bold)}
            className={`p-1 rounded cursor-pointer ${
              cellData?.bold ? 'bg-emerald-100 text-[#107c41] font-black' : 'hover:bg-gray-200 text-gray-700'
            }`}
            title="Bold"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onFormatRange('italic', !cellData?.italic)}
            className={`p-1 rounded cursor-pointer ${
              cellData?.italic ? 'bg-emerald-100 text-[#107c41]' : 'hover:bg-gray-200 text-gray-700'
            }`}
            title="Italic"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onSetAlignment('center')}
            className={`p-1 rounded cursor-pointer ${
              cellData?.align === 'center' ? 'bg-emerald-100 text-[#107c41]' : 'hover:bg-gray-200 text-gray-700'
            }`}
            title="Center Alignment"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>

          {/* Fill Color */}
          <label className="p-1 hover:bg-gray-200 rounded cursor-pointer relative" title="Fill Color">
            <PaintBucket className="w-3.5 h-3.5 text-amber-500" />
            <input
              type="color"
              defaultValue={cellData?.bg || '#fef08a'}
              onChange={(e) => onFormatRange('bg', e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </label>

          {/* Font Color */}
          <label className="p-1 hover:bg-gray-200 rounded cursor-pointer relative" title="Font Color">
            <span className="font-black text-red-600 text-[11px] underline">A</span>
            <input
              type="color"
              defaultValue={cellData?.color || '#dc2626'}
              onChange={(e) => onFormatRange('color', e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </label>

          {/* Borders */}
          <button
            onClick={() => onFormatRange('border', cellData?.border === 'all' ? 'none' : 'all')}
            className="p-1 hover:bg-gray-200 rounded text-gray-700"
            title="All Borders"
          >
            <Grid className="w-3.5 h-3.5 text-gray-600" />
          </button>

          {/* Decimals Decrease / Increase */}
          <button
            onClick={() => onFormatRange('decimalPlaces', Math.max(0, (cellData?.decimalPlaces || 2) - 1))}
            className="p-0.5 hover:bg-gray-200 rounded text-[9px] font-mono text-gray-700"
            title="Decrease Decimal (.0)"
          >
            .00→
          </button>
          <button
            onClick={() => onFormatRange('decimalPlaces', Math.min(8, (cellData?.decimalPlaces || 2) + 1))}
            className="p-0.5 hover:bg-gray-200 rounded text-[9px] font-mono text-gray-700"
            title="Increase Decimal (.00)"
          >
            →.00
          </button>

          {/* Format Painter */}
          <button
            onClick={() => onFormatRange('bold', true)}
            className="p-1 hover:bg-gray-200 rounded text-gray-700"
            title="Format Painter"
          >
            <Paintbrush className="w-3.5 h-3.5 text-amber-700" />
          </button>
        </div>
      </div>

      {/* 2. CONTEXT MENU ITEMS */}
      <div className="py-1">
        {/* Cut */}
        <button
          onClick={() => { onCut(); onClose(); }}
          className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-gray-100 transition cursor-pointer text-left"
        >
          <div className="flex items-center gap-2">
            <Scissors className="w-3.5 h-3.5 text-gray-600" />
            <span>Cut</span>
          </div>
          <span className="text-[10px] text-gray-400">Ctrl+X</span>
        </button>

        {/* Copy */}
        <button
          onClick={() => { onCopy(); onClose(); }}
          className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-gray-100 transition cursor-pointer text-left"
        >
          <div className="flex items-center gap-2">
            <Copy className="w-3.5 h-3.5 text-gray-600" />
            <span>Copy</span>
          </div>
          <span className="text-[10px] text-gray-400">Ctrl+C</span>
        </button>

        {/* Paste Options */}
        <div className="px-3 py-1 border-t border-gray-100">
          <div className="text-[10px] font-bold text-gray-500 mb-1 flex items-center gap-1.5">
            <Clipboard className="w-3.5 h-3.5 text-amber-600" />
            <span>Paste Options:</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => { onPaste(); onClose(); }}
              className="p-1.5 border border-gray-300 hover:border-[#107c41] hover:bg-emerald-50 rounded flex items-center gap-1 text-[11px] font-medium"
              title="Paste (Normal)"
            >
              <Clipboard className="w-4 h-4 text-[#107c41]" />
              <span>Paste</span>
            </button>
            <button
              onClick={() => { onPasteSpecial('values'); onClose(); }}
              className="p-1.5 border border-gray-300 hover:border-[#107c41] hover:bg-emerald-50 rounded flex items-center gap-1 text-[11px] text-gray-700"
              title="Paste Values Only (123)"
            >
              <span className="font-bold text-[10px] text-emerald-800">123</span>
              <span>Values</span>
            </button>
            <button
              onClick={() => { onPasteSpecial('formulas'); onClose(); }}
              className="p-1.5 border border-gray-300 hover:border-[#107c41] hover:bg-emerald-50 rounded flex items-center gap-1 text-[11px] text-gray-700"
              title="Paste Formulas (fx)"
            >
              <span className="font-bold font-mono text-[10px] text-[#107c41]">fx</span>
              <span>Formulas</span>
            </button>
          </div>
        </div>

        {/* ROW-SPECIFIC CONTEXT MENU ITEMS */}
        {type === 'row' && (
          <div className="border-t border-gray-100 pt-1">
            <button
              onClick={() => { onInsertRow?.(rowNum); onClose(); }}
              className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-gray-100 transition cursor-pointer text-left font-medium text-emerald-900"
            >
              <Plus className="w-3.5 h-3.5 text-[#107c41]" />
              <span>Insert Row Above</span>
            </button>
            <button
              onClick={() => { onDeleteRow?.(rowNum); onClose(); }}
              className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-gray-100 transition cursor-pointer text-left text-red-600"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-500" />
              <span>Delete Row</span>
            </button>
            <button
              onClick={() => { onClearContents(); onClose(); }}
              className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-gray-100 transition cursor-pointer text-left text-gray-700"
            >
              <Eraser className="w-3.5 h-3.5 text-gray-500" />
              <span>Clear Contents</span>
            </button>
            <div className="border-t border-gray-100 my-1" />
            <button
              onClick={() => {
                const heightInput = prompt('Enter Row Height in pixels (Default: 24):', '28');
                if (heightInput && !isNaN(parseInt(heightInput, 10)) && rowNum) {
                  onSetRowHeight?.(rowNum, parseInt(heightInput, 10));
                }
                onClose();
              }}
              className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-gray-100 transition cursor-pointer text-left text-gray-700"
            >
              <TableProperties className="w-3.5 h-3.5 text-gray-600" />
              <span>Row Height...</span>
            </button>
            <button
              onClick={() => {
                if (rowNum) onHideRow?.(rowNum);
                onClose();
              }}
              className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-gray-100 transition cursor-pointer text-left text-gray-700"
            >
              <span>Hide</span>
            </button>
            <button
              onClick={() => {
                onUnhideRows?.();
                onClose();
              }}
              className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-gray-100 transition cursor-pointer text-left text-gray-700"
            >
              <span>Unhide</span>
            </button>
          </div>
        )}

        {/* COL-SPECIFIC CONTEXT MENU ITEMS */}
        {type === 'col' && (
          <div className="border-t border-gray-100 pt-1">
            <button
              onClick={() => { onInsertCol?.(colName); onClose(); }}
              className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-gray-100 transition cursor-pointer text-left font-medium text-emerald-900"
            >
              <Plus className="w-3.5 h-3.5 text-[#107c41]" />
              <span>Insert Column Left</span>
            </button>
            <button
              onClick={() => { onDeleteCol?.(colName); onClose(); }}
              className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-gray-100 transition cursor-pointer text-left text-red-600"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-500" />
              <span>Delete Column</span>
            </button>
            <button
              onClick={() => { onClearContents(); onClose(); }}
              className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-gray-100 transition cursor-pointer text-left text-gray-700"
            >
              <Eraser className="w-3.5 h-3.5 text-gray-500" />
              <span>Clear Contents</span>
            </button>
            <div className="border-t border-gray-100 my-1" />
            <button
              onClick={() => {
                const widthInput = prompt('Enter Column Width in pixels (Default: 110):', '140');
                if (widthInput && !isNaN(parseInt(widthInput, 10)) && colName) {
                  onSetColWidth?.(colName, parseInt(widthInput, 10));
                }
                onClose();
              }}
              className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-gray-100 transition cursor-pointer text-left text-gray-700"
            >
              <TableProperties className="w-3.5 h-3.5 text-gray-600" />
              <span>Column Width...</span>
            </button>
            <button
              onClick={() => {
                if (colName) onHideCol?.(colName);
                onClose();
              }}
              className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-gray-100 transition cursor-pointer text-left text-gray-700"
            >
              <span>Hide</span>
            </button>
            <button
              onClick={() => {
                onUnhideCols?.();
                onClose();
              }}
              className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-gray-100 transition cursor-pointer text-left text-gray-700"
            >
              <span>Unhide</span>
            </button>
          </div>
        )}

        {/* CELL CONTEXT MENU ITEMS (Image 2) */}
        {type === 'cell' && (
          <>
            <div className="border-t border-gray-100 my-1" />

            {/* Smart Lookup */}
            <button
              onClick={() => {
                const val = cellData?.value ? String(cellData.value) : cellId;
                alert(`Smart Lookup (بحث ذكي):\nالخلية: ${cellId}\nالقيمة: ${val}\nالصيغة: ${cellData?.formula || 'لا توجد صيغة'}`);
                onClose();
              }}
              className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-gray-100 transition cursor-pointer text-left"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>Smart Lookup</span>
            </button>

            <div className="border-t border-gray-100 my-1" />

            {/* Insert... */}
            <button
              onClick={() => { onInsertRow?.(); onClose(); }}
              className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-gray-100 transition cursor-pointer text-left"
            >
              <Plus className="w-3.5 h-3.5 text-[#107c41]" />
              <span>Insert... (Row Above)</span>
            </button>

            {/* Delete... */}
            <button
              onClick={() => { onDeleteRow?.(); onClose(); }}
              className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-gray-100 transition cursor-pointer text-left text-red-600"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-500" />
              <span>Delete... (Row)</span>
            </button>

            {/* Clear Contents */}
            <button
              onClick={() => { onClearContents(); onClose(); }}
              className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-gray-100 transition cursor-pointer text-left text-gray-700"
            >
              <Eraser className="w-3.5 h-3.5 text-gray-500" />
              <span>Clear Contents</span>
            </button>

            <div className="border-t border-gray-100 my-1" />

            {/* Quick Analysis */}
            <button
              onClick={() => { onOpenQuickAnalysis?.(); onClose(); }}
              className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-gray-100 transition cursor-pointer text-left"
            >
              <BarChart2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Quick Analysis</span>
            </button>

            {/* Filter > */}
            <div className="relative">
              <button
                onMouseEnter={() => setShowFilterSubmenu(true)}
                className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-gray-100 transition cursor-pointer text-left"
              >
                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-gray-600" />
                  <span>Filter</span>
                </div>
                <ChevronRight className="w-3 h-3 text-gray-400" />
              </button>

              {showFilterSubmenu && (
                <div
                  onMouseLeave={() => setShowFilterSubmenu(false)}
                  className="absolute left-full top-0 w-52 bg-white border border-gray-300 rounded shadow-xl py-1 z-60"
                >
                  <button
                    onClick={() => {
                      if (cellData?.value) onFilterByValue?.(String(cellData.value));
                      onClose();
                    }}
                    className="w-full px-3 py-1.5 hover:bg-emerald-50 text-[11px] text-left block"
                  >
                    Filter by Selected Cell's Value
                  </button>
                  <button
                    onClick={() => {
                      onFilterByValue?.('');
                      onClose();
                    }}
                    className="w-full px-3 py-1.5 hover:bg-emerald-50 text-[11px] text-left block"
                  >
                    Clear Filter
                  </button>
                </div>
              )}
            </div>

            {/* Sort > */}
            <div className="relative">
              <button
                onMouseEnter={() => setShowSortSubmenu(true)}
                className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-gray-100 transition cursor-pointer text-left"
              >
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-3.5 h-3.5 text-gray-600" />
                  <span>Sort</span>
                </div>
                <ChevronRight className="w-3 h-3 text-gray-400" />
              </button>

              {showSortSubmenu && (
                <div
                  onMouseLeave={() => setShowSortSubmenu(false)}
                  className="absolute left-full top-0 w-48 bg-white border border-gray-300 rounded shadow-xl py-1 z-60"
                >
                  <button
                    onClick={() => { onSort('asc'); onClose(); }}
                    className="w-full px-3 py-1.5 hover:bg-emerald-50 text-[11px] text-left block"
                  >
                    Sort Smallest to Largest (A to Z)
                  </button>
                  <button
                    onClick={() => { onSort('desc'); onClose(); }}
                    className="w-full px-3 py-1.5 hover:bg-emerald-50 text-[11px] text-left block"
                  >
                    Sort Largest to Smallest (Z to A)
                  </button>
                </div>
              )}
            </div>

            <div className="border-t border-gray-100 my-1" />

            {/* Insert Comment */}
            <button
              onClick={() => { onInsertComment?.(); onClose(); }}
              className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-gray-100 transition cursor-pointer text-left"
            >
              <MessageSquarePlus className="w-3.5 h-3.5 text-teal-600" />
              <span>Insert Comment</span>
            </button>

            {/* Format Cells... */}
            <button
              onClick={() => {
                onFormatRange('bg', '#fef08a');
                onClose();
              }}
              className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-gray-100 transition cursor-pointer text-left font-medium"
            >
              <TableProperties className="w-3.5 h-3.5 text-gray-700" />
              <span>Format Cells...</span>
            </button>

            {/* Pick From Drop-down List... */}
            {columnUniqueValues.length > 0 && (
              <div className="relative">
                <button
                  onMouseEnter={() => setShowDropdownSubmenu(true)}
                  className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-gray-100 transition cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2">
                    <ListFilter className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Pick From Drop-down List...</span>
                  </div>
                  <ChevronRight className="w-3 h-3 text-gray-400" />
                </button>

                {showDropdownSubmenu && (
                  <div
                    onMouseLeave={() => setShowDropdownSubmenu(false)}
                    className="absolute left-full top-0 w-44 bg-white border border-gray-300 rounded shadow-xl py-1 z-60 max-h-48 overflow-y-auto"
                  >
                    {columnUniqueValues.map((uv, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          onPickDropdownValue?.(uv);
                          onClose();
                        }}
                        className="w-full px-3 py-1 hover:bg-emerald-50 text-[11px] text-left truncate block"
                      >
                        {uv}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Define Name... */}
            <button
              onClick={() => { onOpenNameManager?.(); onClose(); }}
              className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-gray-100 transition cursor-pointer text-left"
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-700" />
              <span>Define Name...</span>
            </button>

            {/* Hyperlink... */}
            <button
              onClick={() => {
                const url = prompt('Enter Hyperlink URL:', 'https://');
                if (url) {
                  onFormatRange('value', url);
                  onFormatRange('color', '#2563eb');
                  onFormatRange('underline', true);
                }
                onClose();
              }}
              className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-gray-100 transition cursor-pointer text-left"
            >
              <Link className="w-3.5 h-3.5 text-blue-600" />
              <span>Hyperlink...</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
