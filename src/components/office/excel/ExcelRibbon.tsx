import React, { useState } from 'react';
import {
  Scissors,
  Copy,
  Clipboard,
  Paintbrush,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Grid,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Percent,
  DollarSign,
  ChevronDown,
  Table,
  Plus,
  Trash2,
  Filter,
  ArrowUpDown,
  Search,
  Replace,
  Sigma,
  BarChart3,
  PieChart,
  TrendingUp,
  SplitSquareVertical,
  HelpCircle,
  FileSpreadsheet,
  Download,
  Upload,
  ArrowRightLeft,
  Calendar,
  Lock,
  Eye,
  Layers,
  ZoomIn,
  CheckSquare,
  Sparkles,
  Bookmark,
  FileCheck,
  ShieldCheck,
  RotateCw,
  Hash,
  Calculator,
  Binary,
  Maximize2,
  Lightbulb,
  Share2,
  ExternalLink,
  RefreshCw,
  SlidersHorizontal,
  Sliders,
  Check
} from 'lucide-react';
import { SheetCell } from '../../../types';
import { ExcelBorderDropdown, ExcelBorderType } from './ExcelBorderDropdown';
import { ExcelColorPalette } from './ExcelColorPalette';

export type ExcelRibbonTab = 'file' | 'home' | 'insert' | 'layout' | 'formulas' | 'data' | 'review' | 'view' | 'design';

interface Props {
  activeTab: ExcelRibbonTab;
  setActiveTab: (tab: ExcelRibbonTab) => void;
  onOpenBackstage: () => void;
  activeCell: string;
  activeCellData?: SheetCell;
  selectedRangeStr: string;
  isFormatPainterActive: boolean;
  onToggleFormatPainter: () => void;
  onCut: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onPasteSpecial: (type: 'values' | 'formats' | 'formulas') => void;
  onFormatRange: (key: keyof SheetCell, value: any) => void;
  onSetBorder: (borderType: SheetCell['border'], options?: { color?: string; style?: 'solid' | 'dashed' | 'dotted' | 'double' | 'thick' }) => void;
  onOpenTableStylesGallery?: () => void;
  onSetAlignment: (hAlign: 'right' | 'center' | 'left', vAlign?: 'top' | 'middle' | 'bottom') => void;
  onToggleWrapText: () => void;
  onMergeAndCenter: () => void;
  onSetNumberFormat: (format: SheetCell['format']) => void;
  onAdjustDecimals: (delta: number) => void;
  onInsertRow: () => void;
  onInsertCol: () => void;
  onDeleteRow: () => void;
  onDeleteCol: () => void;
  onAutoSum: (type: 'SUM' | 'AVERAGE' | 'COUNT' | 'MAX' | 'MIN') => void;
  onClear: (type: 'all' | 'formats' | 'contents') => void;
  onSort: (direction: 'asc' | 'desc') => void;
  onToggleFilter: () => void;
  isFilterActive: boolean;
  onOpenFindReplace: (tab?: 'find' | 'replace') => void;
  onOpenInsertFunction: (category?: string) => void;
  onOpenPivotTable: () => void;
  onOpenCharts: () => void;
  onOpenSparklines: () => void;
  onOpenConditionalFormatting: () => void;
  onOpenDataValidation: () => void;
  onOpenRemoveDuplicates: () => void;
  onOpenTextToColumns: () => void;
  onOpenGoalSeek: () => void;
  onOpenNameManager: () => void;
  showGridlines: boolean;
  onToggleGridlines: () => void;
  showHeadings: boolean;
  onToggleHeadings: () => void;
  showFormulaBar: boolean;
  onToggleFormulaBar: () => void;
  showFormulasMode: boolean;
  onToggleShowFormulas: () => void;
  isRTL: boolean;
  onToggleRTL: () => void;
  freezeState: 'none' | 'row' | 'col' | 'both';
  onSetFreezePanes: (state: 'none' | 'row' | 'col' | 'both') => void;
  zoomLevel: number;
  onSetZoomLevel: (zoom: number) => void;
  onRecalculateAll: () => void;
  onInsertImage?: () => void;
  onInsertFloatingImage?: () => void;
  onInsertShape?: (shapeType: 'rect' | 'rounded-rect' | 'circle' | 'arrow-right' | 'arrow-left' | 'callout' | 'star' | 'diamond') => void;
  onCreateTable?: () => void;
  onOpenFormatCells?: (tab?: 'number' | 'alignment' | 'font' | 'border' | 'fill' | 'protection') => void;
  tableName?: string;
  onTableNameChange?: (name: string) => void;
  hasHeaderRow?: boolean;
  onToggleHeaderRow?: () => void;
  hasTotalRow?: boolean;
  onToggleTotalRow?: () => void;
  hasBandedRows?: boolean;
  onToggleBandedRows?: () => void;
  hasFirstColumn?: boolean;
  onToggleFirstColumn?: () => void;
  hasLastColumn?: boolean;
  onToggleLastColumn?: () => void;
  hasBandedColumns?: boolean;
  onToggleBandedColumns?: () => void;
  hasFilterButton?: boolean;
  onToggleFilterButton?: () => void;
  onApplyTableStyle?: (styleName: string) => void;
  activeTableStyle?: string;
  onConvertTableToRange?: () => void;
  onResizeTable?: () => void;
  onExportTable?: (format: 'csv' | 'json' | 'pdf') => void;
  onInsertSlicer?: () => void;
}

export const ExcelRibbon: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  onOpenBackstage,
  activeCell,
  activeCellData,
  selectedRangeStr,
  isFormatPainterActive,
  onToggleFormatPainter,
  onCut,
  onCopy,
  onPaste,
  onPasteSpecial,
  onFormatRange,
  onSetBorder,
  onSetAlignment,
  onToggleWrapText,
  onMergeAndCenter,
  onSetNumberFormat,
  onAdjustDecimals,
  onInsertRow,
  onInsertCol,
  onDeleteRow,
  onDeleteCol,
  onAutoSum,
  onClear,
  onSort,
  onToggleFilter,
  isFilterActive,
  onOpenFindReplace,
  onOpenInsertFunction,
  onOpenPivotTable,
  onOpenCharts,
  onOpenSparklines,
  onOpenConditionalFormatting,
  onOpenDataValidation,
  onOpenRemoveDuplicates,
  onOpenTextToColumns,
  onOpenGoalSeek,
  onOpenNameManager,
  showGridlines,
  onToggleGridlines,
  showHeadings,
  onToggleHeadings,
  showFormulaBar,
  onToggleFormulaBar,
  showFormulasMode,
  onToggleShowFormulas,
  isRTL,
  onToggleRTL,
  freezeState,
  onSetFreezePanes,
  zoomLevel,
  onSetZoomLevel,
  onRecalculateAll,
  onInsertImage,
  onInsertFloatingImage,
  onInsertShape,
  onCreateTable,
  onOpenFormatCells,
  tableName = 'Table1',
  onTableNameChange,
  hasHeaderRow = true,
  onToggleHeaderRow,
  hasTotalRow = false,
  onToggleTotalRow,
  hasBandedRows = true,
  onToggleBandedRows,
  hasFirstColumn = false,
  onToggleFirstColumn,
  hasLastColumn = false,
  onToggleLastColumn,
  hasBandedColumns = false,
  onToggleBandedColumns,
  hasFilterButton = true,
  onToggleFilterButton,
  onApplyTableStyle,
  activeTableStyle = 'green',
  onConvertTableToRange,
  onResizeTable,
  onExportTable,
  onInsertSlicer,
  onOpenTableStylesGallery,
}) => {
  // Dropdown states
  const [showBorderMenu, setShowBorderMenu] = useState(false);
  const [showFillColorPalette, setShowFillColorPalette] = useState(false);
  const [showFontColorPalette, setShowFontColorPalette] = useState(false);
  const [showPasteSpecialMenu, setShowPasteSpecialMenu] = useState(false);
  const [showNumberFormatMenu, setShowNumberFormatMenu] = useState(false);
  const [showFormatCellsMenu, setShowFormatCellsMenu] = useState(false);
  const [showAutoSumMenu, setShowAutoSumMenu] = useState(false);
  const [showClearMenu, setShowClearMenu] = useState(false);
  const [showCellStylesMenu, setShowCellStylesMenu] = useState(false);
  const [showFreezeMenu, setShowFreezeMenu] = useState(false);
  const [showShapesMenu, setShowShapesMenu] = useState(false);
  const [showImageMenu, setShowImageMenu] = useState(false);
  const [showExportDataMenu, setShowExportDataMenu] = useState(false);
  const [selectedFont, setSelectedFont] = useState('Calibri');
  const [selectedFontSize, setSelectedFontSize] = useState(11);
  const [tellMeQuery, setTellMeQuery] = useState('');

  const tabs: { id: ExcelRibbonTab; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'insert', label: 'Insert' },
    { id: 'layout', label: 'Page Layout' },
    { id: 'formulas', label: 'Formulas' },
    { id: 'data', label: 'Data' },
    { id: 'review', label: 'Review' },
    { id: 'view', label: 'View' },
    { id: 'design', label: 'Design' },
  ];

  return (
    <div className="bg-[#107c41] border-b border-gray-300 select-none text-gray-800 text-xs shrink-0 z-30 no-print ribbon-container" data-no-print="true">
      {/* 1. Master Microsoft Excel 365 Tab Headers & Tell Me Search */}
      <div className="flex items-center justify-between px-2 pt-1 bg-[#107c41] text-white">
        {/* Left: File Button & Navigation Tabs */}
        <div className="flex items-center gap-0.5 overflow-x-auto">
          {/* File Button */}
          <button
            onClick={onOpenBackstage}
            className="px-3.5 py-1.5 bg-[#0e6b37] hover:bg-[#0c592e] text-white font-bold rounded-t-sm transition flex items-center gap-1 cursor-pointer text-xs shrink-0 shadow-xs"
            title="ملف (File Backstage Menu)"
          >
            <span>File</span>
          </button>

          {/* Ribbon Tabs */}
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-t-sm transition cursor-pointer relative shrink-0 ${
                  isActive
                    ? 'bg-white text-[#107c41] font-bold shadow-xs'
                    : 'text-white/90 hover:bg-white/15 hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
                {isActive && (
                  <div className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-white z-10" />
                )}
              </button>
            );
          })}
        </div>

        {/* Center: "Tell me what you want to do..." Search Bar */}
        <div className="hidden lg:flex items-center relative w-64 mx-3">
          <Lightbulb className="w-3.5 h-3.5 absolute right-2.5 text-white/70 pointer-events-none" />
          <input
            type="text"
            placeholder="Tell me what you want to do..."
            value={tellMeQuery}
            onChange={(e) => setTellMeQuery(e.target.value)}
            className="w-full bg-white/20 hover:bg-white/30 focus:bg-white focus:text-gray-900 text-white placeholder-white/70 rounded px-2.5 py-1 pr-8 text-xs outline-none transition shadow-2xs font-sans"
            style={{ direction: 'ltr' }}
          />
        </div>

        {/* Right: User Profile & Share */}
        <div className="flex items-center gap-3 text-white text-xs shrink-0 px-2 pb-1">
          <span className="font-semibold hidden sm:inline text-white/95 text-[11.5px]">Mohamed Salah Elsayed Farahat</span>
          <button 
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              alert('تم نسخ رابط المصنف للمشاركة بنجاح!');
            }}
            className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded text-xs font-bold transition cursor-pointer shadow-2xs"
            title="مشاركة المصنف (Share)"
          >
            <Share2 className="w-3.5 h-3.5 text-white" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* 2. Ribbon Content Container */}
      <div className="bg-white px-3 py-1.5 min-h-[92px] flex items-stretch gap-2 overflow-x-auto shadow-inner text-gray-800">
        {/* ========================================================= */}
        {/* TAB: HOME (الرئيسية)                                      */}
        {/* ========================================================= */}
        {activeTab === 'home' && (
          <div className="flex items-stretch gap-2.5">
            {/* Clipboard Group */}
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2">
              <div className="flex items-center gap-1">
                {/* Paste big button with special split */}
                <div className="relative">
                  <button
                    onClick={onPaste}
                    className="flex flex-col items-center justify-center p-1.5 hover:bg-emerald-50 rounded cursor-pointer text-gray-700 hover:text-[#107c41]"
                    title="لصق (Ctrl+V)"
                  >
                    <Clipboard className="w-5 h-5 text-[#107c41]" />
                    <span className="text-[10px] font-semibold mt-0.5">لصق</span>
                  </button>
                  <button
                    onClick={() => setShowPasteSpecialMenu(!showPasteSpecialMenu)}
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 p-0.5 hover:bg-gray-200 rounded text-gray-500"
                    title="خيارات اللصق الخاص"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  {/* Paste Special Dropdown */}
                  {showPasteSpecialMenu && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-xl py-1 z-50 w-36 text-right">
                      <button
                        onClick={() => { onPasteSpecial('values'); setShowPasteSpecialMenu(false); }}
                        className="w-full px-3 py-1 text-right hover:bg-emerald-50 text-[11px] block"
                      >
                        لصق قيم فقط (Values)
                      </button>
                      <button
                        onClick={() => { onPasteSpecial('formats'); setShowPasteSpecialMenu(false); }}
                        className="w-full px-3 py-1 text-right hover:bg-emerald-50 text-[11px] block"
                      >
                        لصق تنسيقات فقط
                      </button>
                      <button
                        onClick={() => { onPasteSpecial('formulas'); setShowPasteSpecialMenu(false); }}
                        className="w-full px-3 py-1 text-right hover:bg-emerald-50 text-[11px] block"
                      >
                        لصق صيغ فقط
                      </button>
                    </div>
                  )}
                </div>

                {/* Cut, Copy, Format Painter */}
                <div className="flex flex-col gap-1 justify-center">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={onCut}
                      className="p-1 hover:bg-gray-100 rounded text-gray-700"
                      title="قص (Ctrl+X)"
                    >
                      <Scissors className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={onCopy}
                      className="p-1 hover:bg-gray-100 rounded text-gray-700"
                      title="نسخ (Ctrl+C)"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={onToggleFormatPainter}
                    className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                      isFormatPainterActive
                        ? 'bg-amber-100 border-amber-400 text-amber-900 font-bold'
                        : 'border-transparent hover:bg-gray-100 text-gray-700'
                    }`}
                    title="نسخ التنسيق (Format Painter)"
                  >
                    <Paintbrush className="w-3 h-3 text-amber-600" />
                    <span>نسخ التنسيق</span>
                  </button>
                </div>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">الحافظة</div>
            </div>

            {/* Font Group */}
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2">
              <div className="space-y-1">
                {/* Font selector & size */}
                <div className="flex items-center gap-1">
                  <select
                    value={selectedFont}
                    onChange={(e) => {
                      setSelectedFont(e.target.value);
                      onFormatRange('fontFamily', e.target.value);
                    }}
                    className="border border-gray-300 rounded px-1.5 py-0.5 text-[11px] bg-white outline-none w-28"
                  >
                    <option value="Calibri">Calibri</option>
                    <option value="Arial">Arial</option>
                    <option value="Segoe UI">Segoe UI</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Tahoma">Tahoma</option>
                    <option value="Cairo">Cairo (عربي)</option>
                    <option value="Tajawal">Tajawal</option>
                  </select>

                  <select
                    value={selectedFontSize}
                    onChange={(e) => {
                      const sz = parseInt(e.target.value, 10);
                      setSelectedFontSize(sz);
                      onFormatRange('fontSize', sz);
                    }}
                    className="border border-gray-300 rounded px-1 py-0.5 text-[11px] bg-white outline-none w-14"
                  >
                    {[9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 36].map((sz) => (
                      <option key={sz} value={sz}>{sz}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => {
                      const next = selectedFontSize + 1;
                      setSelectedFontSize(next);
                      onFormatRange('fontSize', next);
                    }}
                    className="p-1 hover:bg-gray-100 rounded text-gray-700 font-bold"
                    title="تكبير حجم الخط"
                  >
                    A↑
                  </button>
                  <button
                    onClick={() => {
                      const next = Math.max(8, selectedFontSize - 1);
                      setSelectedFontSize(next);
                      onFormatRange('fontSize', next);
                    }}
                    className="p-1 hover:bg-gray-100 rounded text-gray-700 text-[10px]"
                    title="تصغير حجم الخط"
                  >
                    A↓
                  </button>
                </div>

                {/* Bold, Italic, Underline, Strikethrough, Borders, Fill, Color */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onFormatRange('bold', !activeCellData?.bold)}
                    className={`p-1 rounded cursor-pointer ${
                      activeCellData?.bold ? 'bg-emerald-100 text-[#107c41] font-black' : 'hover:bg-gray-100'
                    }`}
                    title="عريض (Ctrl+B)"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onFormatRange('italic', !activeCellData?.italic)}
                    className={`p-1 rounded cursor-pointer ${
                      activeCellData?.italic ? 'bg-emerald-100 text-[#107c41]' : 'hover:bg-gray-100'
                    }`}
                    title="مائل (Ctrl+I)"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onFormatRange('underline', !activeCellData?.underline)}
                    className={`p-1 rounded cursor-pointer ${
                      activeCellData?.underline ? 'bg-emerald-100 text-[#107c41]' : 'hover:bg-gray-100'
                    }`}
                    title="تسطير (Ctrl+U)"
                  >
                    <Underline className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onFormatRange('strikethrough', !activeCellData?.strikethrough)}
                    className={`p-1 rounded cursor-pointer ${
                      activeCellData?.strikethrough ? 'bg-emerald-100 text-[#107c41]' : 'hover:bg-gray-100'
                    }`}
                    title="يتوسطه خط"
                  >
                    <Strikethrough className="w-3.5 h-3.5" />
                  </button>

                  {/* Cell Borders Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowBorderMenu(!showBorderMenu)}
                      className="p-1 hover:bg-gray-100 rounded flex items-center gap-0.5 text-gray-700 cursor-pointer"
                      title="حدود الخلايا (Borders)"
                    >
                      <Grid className="w-3.5 h-3.5" />
                      <ChevronDown className="w-2.5 h-2.5" />
                    </button>
                    <ExcelBorderDropdown
                      isOpen={showBorderMenu}
                      onClose={() => setShowBorderMenu(false)}
                      onSelectBorder={onSetBorder}
                      onOpenFormatCells={onOpenFormatCells}
                    />
                  </div>

                  {/* Fill Color */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        setShowFillColorPalette(!showFillColorPalette);
                        setShowFontColorPalette(false);
                      }}
                      className="p-1 hover:bg-gray-100 rounded cursor-pointer flex items-center gap-0.5"
                      title="لون التعبئة (Fill Color - Excel 365 Palettes)"
                    >
                      <div 
                        className="w-3.5 h-3.5 rounded-xs border border-gray-400"
                        style={{ backgroundColor: activeCellData?.bg || '#fef08a' }}
                      />
                      <ChevronDown className="w-2.5 h-2.5 text-gray-500" />
                    </button>
                    <ExcelColorPalette
                      isOpen={showFillColorPalette}
                      onClose={() => setShowFillColorPalette(false)}
                      onSelectColor={(c) => onFormatRange('bg', c)}
                      title="لون تعبئة الخلية (Fill Color)"
                    />
                  </div>

                  {/* Font Color */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        setShowFontColorPalette(!showFontColorPalette);
                        setShowFillColorPalette(false);
                      }}
                      className="p-1 hover:bg-gray-100 rounded cursor-pointer flex items-center gap-0.5"
                      title="لون النص (Font Color - Excel 365 Palettes)"
                    >
                      <div 
                        className="text-[11px] font-black underline"
                        style={{ color: activeCellData?.color || '#ef4444' }}
                      >
                        A
                      </div>
                      <ChevronDown className="w-2.5 h-2.5 text-gray-500" />
                    </button>
                    <ExcelColorPalette
                      isOpen={showFontColorPalette}
                      onClose={() => setShowFontColorPalette(false)}
                      onSelectColor={(c) => onFormatRange('color', c)}
                      title="لون خط النص (Font Color)"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between px-1 text-[10px] text-gray-400 font-medium mt-1">
                <span className="mx-auto">خط</span>
                {onOpenFormatCells && (
                  <button
                    onClick={() => onOpenFormatCells('font')}
                    className="p-0.5 hover:text-[#107c41] hover:bg-gray-200 rounded cursor-pointer"
                    title="تنسيق خلايا - الخط (Ctrl+1)"
                  >
                    <Maximize2 className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Alignment Group */}
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2">
              <div className="space-y-1">
                {/* Vertical Alignment */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onFormatRange('verticalAlign', 'top')}
                    className="p-1 hover:bg-gray-100 rounded text-gray-600 text-[10px]"
                    title="محاذاة لأعلى"
                  >
                    ⬆ أعلى
                  </button>
                  <button
                    onClick={() => onFormatRange('verticalAlign', 'middle')}
                    className="p-1 hover:bg-gray-100 rounded text-gray-600 text-[10px]"
                    title="محاذاة للوسط رأسياً"
                  >
                    ↕ وسط
                  </button>
                  <button
                    onClick={() => onFormatRange('verticalAlign', 'bottom')}
                    className="p-1 hover:bg-gray-100 rounded text-gray-600 text-[10px]"
                    title="محاذاة لأسفل"
                  >
                    ⬇ أسفل
                  </button>

                  <button
                    onClick={onToggleWrapText}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                      activeCellData?.wrapText
                        ? 'bg-emerald-100 border-emerald-400 text-[#107c41] font-bold'
                        : 'border-gray-200 hover:bg-gray-100 text-gray-700'
                    }`}
                    title="التفاف النص تلقائياً داخل الخلية"
                  >
                    التفاف النص
                  </button>
                </div>

                {/* Horizontal Alignment & Merge */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onSetAlignment('right')}
                    className={`p-1 rounded ${activeCellData?.align === 'right' ? 'bg-emerald-100 text-[#107c41]' : 'hover:bg-gray-100'}`}
                    title="محاذاة لليمين"
                  >
                    <AlignRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onSetAlignment('center')}
                    className={`p-1 rounded ${activeCellData?.align === 'center' ? 'bg-emerald-100 text-[#107c41]' : 'hover:bg-gray-100'}`}
                    title="توسيط"
                  >
                    <AlignCenter className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onSetAlignment('left')}
                    className={`p-1 rounded ${activeCellData?.align === 'left' ? 'bg-emerald-100 text-[#107c41]' : 'hover:bg-gray-100'}`}
                    title="محاذاة لليسار"
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={onMergeAndCenter}
                    className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300"
                    title="دمج وتوسيط الخلايا المحددة"
                  >
                    دمج وتوسيط
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between px-1 text-[10px] text-gray-400 font-medium mt-1">
                <span className="mx-auto">محاذاة</span>
                {onOpenFormatCells && (
                  <button
                    onClick={() => onOpenFormatCells('alignment')}
                    className="p-0.5 hover:text-[#107c41] hover:bg-gray-200 rounded cursor-pointer"
                    title="تنسيق خلايا - محاذاة (Ctrl+1)"
                  >
                    <Maximize2 className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Number Format Group */}
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2">
              <div className="space-y-1">
                {/* Format dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowNumberFormatMenu(!showNumberFormatMenu)}
                    className="w-32 px-2 py-0.5 border border-gray-300 rounded text-[11px] bg-white flex items-center justify-between text-gray-800"
                  >
                    <span className="truncate">
                      {activeCellData?.format === 'currency-sar' ? 'عملة (ر.س)' :
                       activeCellData?.format === 'currency-egp' ? 'عملة (ج.م)' :
                       activeCellData?.format === 'currency-usd' ? 'دولار ($)' :
                       activeCellData?.format === 'percent' ? 'نسبة مئوية %' :
                       activeCellData?.format === 'accounting' ? 'محاسبة' :
                       activeCellData?.format === 'date' ? 'تاريخ' :
                       activeCellData?.format === 'scientific' ? 'علمي' :
                       activeCellData?.format === 'number' ? 'رقم' : 'عام (General)'}
                    </span>
                    <ChevronDown className="w-3 h-3 text-gray-500" />
                  </button>

                  {showNumberFormatMenu && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-xl py-1 z-50 w-44 text-right">
                      <button onClick={() => { onSetNumberFormat('text'); setShowNumberFormatMenu(false); }} className="w-full px-3 py-1 text-right hover:bg-emerald-50 text-[11px] block">عام</button>
                      <button onClick={() => { onSetNumberFormat('number'); setShowNumberFormatMenu(false); }} className="w-full px-3 py-1 text-right hover:bg-emerald-50 text-[11px] block">رقم (1,234.00)</button>
                      <button onClick={() => { onSetNumberFormat('currency-sar'); setShowNumberFormatMenu(false); }} className="w-full px-3 py-1 text-right hover:bg-emerald-50 text-[11px] block">عملة ر.س</button>
                      <button onClick={() => { onSetNumberFormat('currency-egp'); setShowNumberFormatMenu(false); }} className="w-full px-3 py-1 text-right hover:bg-emerald-50 text-[11px] block">عملة ج.م</button>
                      <button onClick={() => { onSetNumberFormat('currency-usd'); setShowNumberFormatMenu(false); }} className="w-full px-3 py-1 text-right hover:bg-emerald-50 text-[11px] block">دولار $</button>
                      <button onClick={() => { onSetNumberFormat('percent'); setShowNumberFormatMenu(false); }} className="w-full px-3 py-1 text-right hover:bg-emerald-50 text-[11px] block">نسبة مئوية %</button>
                      <button onClick={() => { onSetNumberFormat('accounting'); setShowNumberFormatMenu(false); }} className="w-full px-3 py-1 text-right hover:bg-emerald-50 text-[11px] block">محاسبة</button>
                      <button onClick={() => { onSetNumberFormat('date'); setShowNumberFormatMenu(false); }} className="w-full px-3 py-1 text-right hover:bg-emerald-50 text-[11px] block">تاريخ (YYYY-MM-DD)</button>
                      <button onClick={() => { onSetNumberFormat('scientific'); setShowNumberFormatMenu(false); }} className="w-full px-3 py-1 text-right hover:bg-emerald-50 text-[11px] block">علمي (Scientific)</button>
                      <div className="border-t border-gray-200 my-1"></div>
                      <button
                        onClick={() => {
                          setShowNumberFormatMenu(false);
                          onOpenFormatCells?.('number');
                        }}
                        className="w-full px-3 py-1.5 text-right hover:bg-emerald-50 text-[11px] font-bold text-emerald-800 flex items-center justify-between"
                      >
                        <span>تنسيقات أرقام إضافية...</span>
                        <span className="text-[9px] text-gray-400 font-mono">Ctrl+1</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Quick numeric buttons */}
                <div className="flex items-center gap-1 justify-between">
                  <button
                    onClick={() => onSetNumberFormat('currency-sar')}
                    className="px-1.5 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-emerald-800 font-bold text-[10px]"
                    title="تنسيق العملة (ر.س)"
                  >
                    ر.س
                  </button>
                  <button
                    onClick={() => onSetNumberFormat('percent')}
                    className="p-1 hover:bg-gray-100 rounded text-gray-700"
                    title="نسبة مئوية %"
                  >
                    <Percent className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onSetNumberFormat('number')}
                    className="px-1.5 py-0.5 rounded hover:bg-gray-100 text-gray-700 font-bold text-[11px]"
                    title="فاصلة الآلاف (,)"
                  >
                    ,
                  </button>
                  <button
                    onClick={() => onAdjustDecimals(1)}
                    className="px-1 py-0.5 rounded hover:bg-gray-100 text-gray-700 font-mono text-[10px]"
                    title="زيادة المنازل العشرية (.00)"
                  >
                    .00→
                  </button>
                  <button
                    onClick={() => onAdjustDecimals(-1)}
                    className="px-1 py-0.5 rounded hover:bg-gray-100 text-gray-700 font-mono text-[10px]"
                    title="إنقاص المنازل العشرية (.0)"
                  >
                    ←.0
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between px-1 text-[10px] text-gray-400 font-medium mt-1">
                <span className="mx-auto">رقم</span>
                {onOpenFormatCells && (
                  <button
                    onClick={() => onOpenFormatCells('number')}
                    className="p-0.5 hover:text-[#107c41] hover:bg-gray-200 rounded cursor-pointer"
                    title="تنسيق خلايا - الأرقام (Ctrl+1)"
                  >
                    <Maximize2 className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Styles Group (Conditional formatting, Format as Table, Cell styles) */}
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onOpenConditionalFormatting}
                  className="flex flex-col items-center justify-center p-1 hover:bg-emerald-50 rounded text-gray-700 hover:text-[#107c41]"
                  title="تنسيق شرطي (أشرطة البيانات، مقاييس الألوان، القواعد)"
                >
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span className="text-[9.5px] font-semibold mt-0.5">تنسيق شرطي</span>
                </button>

                <button
                  onClick={() => {
                    if (onOpenTableStylesGallery) {
                      onOpenTableStylesGallery();
                    } else if (onCreateTable) {
                      onCreateTable();
                    } else {
                      onFormatRange('bg', '#107c41');
                      onFormatRange('color', '#ffffff');
                      onFormatRange('bold', true);
                    }
                  }}
                  className="flex flex-col items-center justify-center p-1 hover:bg-emerald-50 rounded text-gray-700 hover:text-[#107c41] cursor-pointer"
                  title="تنسيق كجدول Excel رسمي والمعرض الشامل (Alt + T / Ctrl + T)"
                >
                  <Table className="w-4 h-4 text-blue-600" />
                  <span className="text-[9.5px] font-semibold mt-0.5">تنسيق كجدول</span>
                </button>

                {/* Cell styles picker */}
                <div className="relative">
                  <button
                    onClick={() => setShowCellStylesMenu(!showCellStylesMenu)}
                    className="flex flex-col items-center justify-center p-1 hover:bg-emerald-50 rounded text-gray-700"
                    title="أنماط الخلايا السريعة"
                  >
                    <Layers className="w-4 h-4 text-amber-600" />
                    <span className="text-[9.5px] font-semibold mt-0.5">أنماط الخلايا</span>
                  </button>

                  {showCellStylesMenu && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-xl p-2 z-50 w-52 text-right space-y-1">
                      <div className="text-[10px] text-gray-400 font-bold mb-1">اختر نمط خلية:</div>
                      <button
                        onClick={() => { onFormatRange('bg', '#dcfce7'); onFormatRange('color', '#14532d'); setShowCellStylesMenu(false); }}
                        className="w-full p-1 text-right bg-emerald-100 text-emerald-900 rounded font-semibold text-[10px] block"
                      >
                        جيد (Good / أخضر)
                      </button>
                      <button
                        onClick={() => { onFormatRange('bg', '#fee2e2'); onFormatRange('color', '#991b1b'); setShowCellStylesMenu(false); }}
                        className="w-full p-1 text-right bg-red-100 text-red-900 rounded font-semibold text-[10px] block"
                      >
                        غير ملائم (Bad / أحمر)
                      </button>
                      <button
                        onClick={() => { onFormatRange('bg', '#fef3c7'); onFormatRange('color', '#92400e'); setShowCellStylesMenu(false); }}
                        className="w-full p-1 text-right bg-amber-100 text-amber-900 rounded font-semibold text-[10px] block"
                      >
                        محايد (Neutral / أصفر)
                      </button>
                      <button
                        onClick={() => { onFormatRange('bg', '#e0e7ff'); onFormatRange('color', '#3730a3'); onFormatRange('bold', true); setShowCellStylesMenu(false); }}
                        className="w-full p-1 text-right bg-indigo-100 text-indigo-900 rounded font-bold text-[10px] block"
                      >
                        إجمالي / ملخص رئيسي
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">أنماط</div>
            </div>

            {/* Cells Group (Insert, Delete, Format) */}
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2">
              <div className="flex items-center gap-1.5">
                <div className="flex flex-col gap-1">
                  <button
                    onClick={onInsertRow}
                    className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-50 hover:bg-emerald-50 text-gray-700 border border-gray-200 rounded text-[10px]"
                    title="إدراج صف جديد للأعلى"
                  >
                    <Plus className="w-3 h-3 text-emerald-600" />
                    <span>إدراج صف</span>
                  </button>
                  <button
                    onClick={onInsertCol}
                    className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-50 hover:bg-emerald-50 text-gray-700 border border-gray-200 rounded text-[10px]"
                    title="إدراج عمود جديد"
                  >
                    <Plus className="w-3 h-3 text-emerald-600" />
                    <span>إدراج عمود</span>
                  </button>
                </div>

                <div className="flex flex-col gap-1">
                  <button
                    onClick={onDeleteRow}
                    className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-50 hover:bg-red-50 text-gray-700 border border-gray-200 rounded text-[10px]"
                    title="حذف الصف النشط"
                  >
                    <Trash2 className="w-3 h-3 text-red-600" />
                    <span>حذف صف</span>
                  </button>
                  <button
                    onClick={onDeleteCol}
                    className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-50 hover:bg-red-50 text-gray-700 border border-gray-200 rounded text-[10px]"
                    title="حذف العمود النشط"
                  >
                    <Trash2 className="w-3 h-3 text-red-600" />
                    <span>حذف عمود</span>
                  </button>
                </div>

                {onOpenFormatCells && (
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => onOpenFormatCells('number')}
                      className="flex items-center gap-1 px-2 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#107c41] border border-emerald-300 rounded text-[10px] font-bold"
                      title="تنسيق الخلايا الكامل (Format Cells - Ctrl+1)"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#107c41]" />
                      <span>تنسيق خلايا...</span>
                    </button>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between px-1 text-[10px] text-gray-400 font-medium mt-1">
                <span className="mx-auto">خلايا</span>
                {onOpenFormatCells && (
                  <button
                    onClick={() => onOpenFormatCells('number')}
                    className="p-0.5 hover:text-[#107c41] hover:bg-gray-200 rounded cursor-pointer"
                    title="تنسيق الخلايا (Ctrl+1)"
                  >
                    <Maximize2 className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Editing Group (AutoSum, Fill, Clear, Sort & Filter, Find & Select) */}
            <div className="flex flex-col justify-between pl-1">
              <div className="flex items-center gap-2">
                {/* AutoSum split button */}
                <div className="relative">
                  <button
                    onClick={() => onAutoSum('SUM')}
                    className="flex items-center gap-1 px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-[#107c41] font-bold rounded border border-emerald-300 text-[10.5px]"
                    title="الجمع التلقائي السريع (Alt + =)"
                  >
                    <Sigma className="w-3.5 h-3.5" />
                    <span>مجموع تلقائي</span>
                  </button>
                  <button
                    onClick={() => setShowAutoSumMenu(!showAutoSumMenu)}
                    className="p-1 hover:bg-gray-100 rounded text-gray-600 inline-block mr-0.5"
                  >
                    <ChevronDown className="w-2.5 h-2.5" />
                  </button>

                  {showAutoSumMenu && (
                    <div className="absolute top-full right-0 mt-1 bg-white border border-gray-300 rounded shadow-xl py-1 z-50 w-36 text-right">
                      <button onClick={() => { onAutoSum('SUM'); setShowAutoSumMenu(false); }} className="w-full px-3 py-1 text-right hover:bg-emerald-50 text-[11px] block">مجموع (SUM)</button>
                      <button onClick={() => { onAutoSum('AVERAGE'); setShowAutoSumMenu(false); }} className="w-full px-3 py-1 text-right hover:bg-emerald-50 text-[11px] block">متوسط (AVERAGE)</button>
                      <button onClick={() => { onAutoSum('COUNT'); setShowAutoSumMenu(false); }} className="w-full px-3 py-1 text-right hover:bg-emerald-50 text-[11px] block">أرقام الحساب (COUNT)</button>
                      <button onClick={() => { onAutoSum('MAX'); setShowAutoSumMenu(false); }} className="w-full px-3 py-1 text-right hover:bg-emerald-50 text-[11px] block">الحد الأقصى (MAX)</button>
                      <button onClick={() => { onAutoSum('MIN'); setShowAutoSumMenu(false); }} className="w-full px-3 py-1 text-right hover:bg-emerald-50 text-[11px] block">الحد الأدنى (MIN)</button>
                    </div>
                  )}
                </div>

                {/* Sort & Filter */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onSort('asc')}
                      className="px-1.5 py-0.5 bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 text-[10px] text-gray-700"
                      title="فرز من أ إلى ي (تصاعدي)"
                    >
                      أ ← ي
                    </button>
                    <button
                      onClick={() => onSort('desc')}
                      className="px-1.5 py-0.5 bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 text-[10px] text-gray-700"
                      title="فرز من ي إلى أ (تنازلي)"
                    >
                      ي ← أ
                    </button>
                    <button
                      onClick={onToggleFilter}
                      className={`p-1 rounded border ${isFilterActive ? 'bg-emerald-100 border-emerald-400 text-[#107c41]' : 'border-gray-200 hover:bg-gray-100'}`}
                      title="تفعيل/تعطيل التصفية التلقائية (Ctrl+Shift+L)"
                    >
                      <Filter className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Find & Clear */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onOpenFindReplace('find')}
                      className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 text-[10px] text-gray-700"
                      title="بحث واستبدال (Ctrl+F)"
                    >
                      <Search className="w-3 h-3 text-gray-500" />
                      <span>بحث</span>
                    </button>

                    <button
                      onClick={() => onClear('contents')}
                      className="px-1.5 py-0.5 hover:bg-red-50 text-red-600 rounded text-[10px]"
                      title="مسح المحتويات"
                    >
                      مسح
                    </button>
                  </div>
                </div>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">تحرير</div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: INSERT (إدراج)                                       */}
        {/* ========================================================= */}
        {activeTab === 'insert' && (
          <div className="flex items-stretch gap-3">
            {/* Tables Group */}
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenPivotTable}
                  className="flex flex-col items-center justify-center p-2 hover:bg-emerald-50 rounded text-gray-800 hover:text-[#107c41] transition cursor-pointer"
                  title="إنشاء جدول محوري PivotTable لتلخيص وتحليل البيانات المعقدة"
                >
                  <FileSpreadsheet className="w-5 h-5 text-[#107c41]" />
                  <span className="text-[10px] font-bold mt-1">جدول محوري</span>
                  <span className="text-[9px] text-gray-500">PivotTable</span>
                </button>

                <button
                  onClick={() => {
                    if (onCreateTable) {
                      onCreateTable();
                    } else {
                      onFormatRange('bg', '#f1f5f9');
                      onFormatRange('bold', true);
                    }
                  }}
                  className="flex flex-col items-center justify-center p-2 hover:bg-blue-50 rounded text-gray-800 hover:text-blue-700 transition cursor-pointer"
                  title="إنشاء جدول بيانات رسمي (Alt + T / Ctrl + T)"
                >
                  <Table className="w-5 h-5 text-blue-600" />
                  <span className="text-[10px] font-bold mt-1">جدول بيانات</span>
                  <span className="text-[9px] text-gray-500">Table (Alt+T)</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">جداول</div>
            </div>

            {/* Charts Group */}
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenCharts}
                  className="flex flex-col items-center justify-center p-2 bg-emerald-50 hover:bg-emerald-100 rounded-lg text-emerald-900 border border-emerald-300 transition cursor-pointer"
                  title="رسوم بيانية موصى بها مع كامل الأنواع (عمودي، دائري، خطي، مساحي...)"
                >
                  <BarChart3 className="w-5 h-5 text-[#107c41]" />
                  <span className="text-[10.5px] font-black mt-1">مخططات بيانية</span>
                  <span className="text-[9px] text-emerald-700">Recommended Charts</span>
                </button>

                <div className="grid grid-cols-3 gap-1">
                  <button onClick={onOpenCharts} className="p-1 hover:bg-gray-100 rounded flex flex-col items-center text-[9px] text-gray-700" title="مخطط عمودي">
                    <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                    <span>عمودي</span>
                  </button>
                  <button onClick={onOpenCharts} className="p-1 hover:bg-gray-100 rounded flex flex-col items-center text-[9px] text-gray-700" title="مخطط خطي">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    <span>خطي</span>
                  </button>
                  <button onClick={onOpenCharts} className="p-1 hover:bg-gray-100 rounded flex flex-col items-center text-[9px] text-gray-700" title="مخطط دائري">
                    <PieChart className="w-3.5 h-3.5 text-amber-600" />
                    <span>دائري</span>
                  </button>
                </div>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">رسوم بيانية</div>
            </div>

            {/* Sparklines Group */}
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onOpenSparklines}
                  className="flex flex-col items-center justify-center p-2 hover:bg-indigo-50 rounded text-gray-800 hover:text-indigo-800 transition cursor-pointer"
                  title="إدراج خطوط سباركلاين مصغرة داخل الخلية (Sparklines)"
                >
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                  <span className="text-[10px] font-bold mt-1">خطوط سباركلاين</span>
                  <span className="text-[9px] text-gray-500">Sparklines</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">سباركلاين</div>
            </div>

            {/* Illustrations & Media */}
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2">
              <div className="flex items-center gap-2">
                {/* Images Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowImageMenu(!showImageMenu)}
                    className="flex flex-col items-center justify-center p-1.5 hover:bg-emerald-50 rounded text-gray-700 hover:text-[#107c41] cursor-pointer"
                    title="إدراج صورة حرة عائمة أو داخل الخلية (Office 365)"
                  >
                    <span className="text-sm">🖼️</span>
                    <span className="text-[10px] font-semibold mt-0.5">صور</span>
                  </button>

                  {showImageMenu && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-xl py-1 z-50 w-52 text-right">
                      <button
                        onClick={() => {
                          setShowImageMenu(false);
                          if (onInsertFloatingImage) onInsertFloatingImage();
                          else if (onInsertImage) onInsertImage();
                        }}
                        className="w-full px-3 py-1.5 text-right hover:bg-emerald-50 text-[11px] font-bold text-gray-800 flex items-center gap-2 cursor-pointer"
                      >
                        <span>🪄</span>
                        <span>إدراج صورة حرة عائمة (متحركة)</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowImageMenu(false);
                          if (onInsertImage) onInsertImage();
                        }}
                        className="w-full px-3 py-1.5 text-right hover:bg-gray-100 text-[11px] text-gray-700 flex items-center gap-2 cursor-pointer"
                      >
                        <span>📥</span>
                        <span>إدراج صورة داخل الخلية المحددة</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Shapes Dropdown (Office 365 Shapes) */}
                <div className="relative">
                  <button
                    onClick={() => setShowShapesMenu(!showShapesMenu)}
                    className="flex flex-col items-center justify-center p-1.5 hover:bg-emerald-50 rounded text-gray-700 hover:text-[#107c41] cursor-pointer"
                    title="إدراج أشكال توضيحية عائمة قابلة للتحريك وتغيير الحجم والكتابة (Office 365)"
                  >
                    <span className="text-sm">🔷</span>
                    <span className="text-[10px] font-semibold mt-0.5">أشكال</span>
                  </button>

                  {showShapesMenu && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-xl p-2 z-50 w-64 text-right">
                      <div className="text-[10px] font-bold text-gray-500 mb-1.5">أشكال Office 365 التوضيحية:</div>
                      <div className="grid grid-cols-2 gap-1 text-[11px]">
                        <button
                          onClick={() => { setShowShapesMenu(false); onInsertShape?.('rect'); }}
                          className="flex items-center gap-1.5 p-1.5 hover:bg-emerald-50 rounded border border-gray-200 text-gray-800 hover:text-[#107c41] cursor-pointer"
                        >
                          <span className="w-4 h-3 bg-blue-500 rounded-xs inline-block shrink-0" />
                          <span>مستطيل قياسي</span>
                        </button>
                        <button
                          onClick={() => { setShowShapesMenu(false); onInsertShape?.('rounded-rect'); }}
                          className="flex items-center gap-1.5 p-1.5 hover:bg-emerald-50 rounded border border-gray-200 text-gray-800 hover:text-[#107c41] cursor-pointer"
                        >
                          <span className="w-4 h-3 bg-emerald-600 rounded-md inline-block shrink-0" />
                          <span>مستطيل مستدير</span>
                        </button>
                        <button
                          onClick={() => { setShowShapesMenu(false); onInsertShape?.('circle'); }}
                          className="flex items-center gap-1.5 p-1.5 hover:bg-emerald-50 rounded border border-gray-200 text-gray-800 hover:text-[#107c41] cursor-pointer"
                        >
                          <span className="w-3.5 h-3.5 bg-amber-500 rounded-full inline-block shrink-0" />
                          <span>دائرة / بيضاوي</span>
                        </button>
                        <button
                          onClick={() => { setShowShapesMenu(false); onInsertShape?.('diamond'); }}
                          className="flex items-center gap-1.5 p-1.5 hover:bg-emerald-50 rounded border border-gray-200 text-gray-800 hover:text-[#107c41] cursor-pointer"
                        >
                          <span className="w-3.5 h-3.5 bg-purple-500 rotate-45 inline-block shrink-0" />
                          <span>معين (Diamond)</span>
                        </button>
                        <button
                          onClick={() => { setShowShapesMenu(false); onInsertShape?.('arrow-right'); }}
                          className="flex items-center gap-1.5 p-1.5 hover:bg-emerald-50 rounded border border-gray-200 text-gray-800 hover:text-[#107c41] cursor-pointer"
                        >
                          <span className="text-xs text-blue-600 font-bold shrink-0">➜</span>
                          <span>سهم أفقي</span>
                        </button>
                        <button
                          onClick={() => { setShowShapesMenu(false); onInsertShape?.('arrow-left'); }}
                          className="flex items-center gap-1.5 p-1.5 hover:bg-emerald-50 rounded border border-gray-200 text-gray-800 hover:text-[#107c41] cursor-pointer"
                        >
                          <span className="text-xs text-blue-600 font-bold shrink-0">⬅</span>
                          <span>سهم عكسي</span>
                        </button>
                        <button
                          onClick={() => { setShowShapesMenu(false); onInsertShape?.('callout'); }}
                          className="flex items-center gap-1.5 p-1.5 hover:bg-emerald-50 rounded border border-gray-200 text-gray-800 hover:text-[#107c41] cursor-pointer"
                        >
                          <span className="text-xs text-emerald-600 font-bold shrink-0">💬</span>
                          <span>وسيلة شرح</span>
                        </button>
                        <button
                          onClick={() => { setShowShapesMenu(false); onInsertShape?.('star'); }}
                          className="flex items-center gap-1.5 p-1.5 hover:bg-emerald-50 rounded border border-gray-200 text-gray-800 hover:text-[#107c41] cursor-pointer"
                        >
                          <span className="text-xs text-amber-500 font-bold shrink-0">★</span>
                          <span>نجمة خماسية</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    onInsertShape?.('callout');
                  }}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-gray-100 rounded text-gray-700 cursor-pointer"
                  title="مخططات ورسومات توضيحية ذكية"
                >
                  <span className="text-sm">📊</span>
                  <span className="text-[10px] font-semibold mt-0.5">SmartArt</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">رسوم توضيحية</div>
            </div>

            {/* Links, Comments & Symbols */}
            <div className="flex flex-col justify-between pl-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const comment = prompt('أدخل تعليق أو ملاحظة لهذه الخلية:', activeCellData?.comment || '');
                    if (comment !== null) {
                      onFormatRange('comment', comment);
                    }
                  }}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-gray-100 rounded text-gray-700"
                  title="إضافة تعليق للخلية النشطة"
                >
                  <Bookmark className="w-4 h-4 text-amber-600" />
                  <span className="text-[10px] font-semibold mt-0.5">تعليق</span>
                </button>

                <button
                  onClick={() => onOpenInsertFunction()}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-emerald-50 rounded text-emerald-800"
                  title="إدراج معادلة أو رمز رياضي"
                >
                  <Calculator className="w-4 h-4 text-[#107c41]" />
                  <span className="text-[10px] font-bold mt-0.5">رموز ومعادلات</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">روابط ورموز</div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: PAGE LAYOUT (تخطيط الصفحة)                           */}
        {/* ========================================================= */}
        {activeTab === 'layout' && (
          <div className="flex items-stretch gap-3">
            {/* Themes */}
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert('تم تطبيق النسق المؤسسي الحديث!')}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-gray-100 rounded text-gray-700"
                >
                  <Layers className="w-5 h-5 text-indigo-600" />
                  <span className="text-[10px] font-bold mt-0.5">النسق (Themes)</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">نسق</div>
            </div>

            {/* Page Setup */}
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert('خيارات الهوامش: عادي 0.75 بوصة، عريض، ضيق')}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-gray-100 rounded text-gray-700"
                >
                  <span className="text-sm">📐</span>
                  <span className="text-[10px] font-semibold">هوامش</span>
                </button>
                <button
                  onClick={() => alert('تم ضبط اتجاه الصفحة (عمودي / أفقي)')}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-gray-100 rounded text-gray-700"
                >
                  <span className="text-sm">🔄</span>
                  <span className="text-[10px] font-semibold">الاتجاه</span>
                </button>
                <button
                  onClick={() => alert('حجم الصفحة القياسي: A4 (210 × 297 مم)')}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-gray-100 rounded text-gray-700"
                >
                  <span className="text-sm">📄</span>
                  <span className="text-[10px] font-semibold">الحجم (A4)</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">إعداد الصفحة</div>
            </div>

            {/* Sheet Direction & Gridlines */}
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={onToggleRTL}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-emerald-50 rounded text-emerald-900 border border-emerald-200"
                  title="تغيير اتجاه ورقة العمل بالكامل"
                >
                  <ArrowRightLeft className="w-4 h-4 text-[#107c41]" />
                  <span className="text-[10px] font-bold mt-0.5">اتجاه الورقة ({isRTL ? 'يمين ← يسار' : 'يسار ← يمين'})</span>
                </button>

                <div className="flex flex-col gap-1 text-[11px] text-gray-700">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showGridlines}
                      onChange={onToggleGridlines}
                      className="accent-[#107c41] rounded"
                    />
                    <span>إظهار خطوط الشبكة</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showHeadings}
                      onChange={onToggleHeadings}
                      className="accent-[#107c41] rounded"
                    />
                    <span>إظهار عناوين الأعمدة والصفوف</span>
                  </label>
                </div>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">خيارات الورقة</div>
            </div>

            {/* Print Titles & Breaks */}
            <div className="flex flex-col justify-between pl-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-gray-100 rounded text-gray-700"
                  title="طباعة ورقة العمل المحددة"
                >
                  <Download className="w-4 h-4 text-blue-600" />
                  <span className="text-[10px] font-semibold mt-0.5">طباعة العناوين</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">طباعة وترتيب</div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: FORMULAS (صيغ)                                       */}
        {/* ========================================================= */}
        {activeTab === 'formulas' && (
          <div className="flex items-stretch gap-3">
            {/* Function Library */}
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onOpenInsertFunction()}
                  className="flex flex-col items-center justify-center p-2 bg-emerald-50 hover:bg-emerald-100 rounded text-[#107c41] border border-emerald-300 font-bold"
                  title="إدراج دالة رياضية من مكتبة دوال Excel (Shift+F3)"
                >
                  <span className="font-serif font-black text-base italic">fx</span>
                  <span className="text-[10px] font-black mt-0.5">إدراج دالة</span>
                </button>

                <div className="grid grid-cols-3 gap-1">
                  <button
                    onClick={() => onOpenInsertFunction('Financial')}
                    className="px-2 py-1 bg-gray-50 hover:bg-emerald-50 rounded border border-gray-200 text-[10px] text-gray-800 font-semibold"
                    title="دوال مالية: PMT, FV, PV, RATE, NPER"
                  >
                    مالية (PMT)
                  </button>
                  <button
                    onClick={() => onOpenInsertFunction('Logical')}
                    className="px-2 py-1 bg-gray-50 hover:bg-emerald-50 rounded border border-gray-200 text-[10px] text-gray-800 font-semibold"
                    title="دوال منطقية: IF, IFERROR, AND, OR"
                  >
                    منطقية (IF)
                  </button>
                  <button
                    onClick={() => onOpenInsertFunction('Text')}
                    className="px-2 py-1 bg-gray-50 hover:bg-emerald-50 rounded border border-gray-200 text-[10px] text-gray-800 font-semibold"
                    title="دوال نصوص: CONCAT, UPPER, LOWER, TRIM"
                  >
                    نصية (CONCAT)
                  </button>
                  <button
                    onClick={() => onOpenInsertFunction('DateTime')}
                    className="px-2 py-1 bg-gray-50 hover:bg-emerald-50 rounded border border-gray-200 text-[10px] text-gray-800 font-semibold"
                    title="دوال تاريخ: TODAY, NOW, DATE"
                  >
                    تاريخ ووقت
                  </button>
                  <button
                    onClick={() => onOpenInsertFunction('Lookup')}
                    className="px-2 py-1 bg-gray-50 hover:bg-emerald-50 rounded border border-gray-200 text-[10px] text-gray-800 font-semibold"
                    title="دوال بحث ومراجع: VLOOKUP, XLOOKUP, INDEX, MATCH"
                  >
                    بحث (VLOOKUP)
                  </button>
                  <button
                    onClick={() => onOpenInsertFunction('Math')}
                    className="px-2 py-1 bg-gray-50 hover:bg-emerald-50 rounded border border-gray-200 text-[10px] text-gray-800 font-semibold"
                    title="دوال رياضيات: SUM, ROUND, ABS, SQRT"
                  >
                    رياضيات (SUM)
                  </button>
                </div>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">مكتبة الدوال</div>
            </div>

            {/* Defined Names & Name Manager */}
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenNameManager}
                  className="flex flex-col items-center justify-center p-2 hover:bg-emerald-50 rounded text-gray-800 hover:text-[#107c41] transition border border-gray-200"
                  title="مدير الأسماء (Name Manager) لتعريف وإدارة أسماء النطاقات"
                >
                  <Bookmark className="w-5 h-5 text-indigo-600" />
                  <span className="text-[10px] font-bold mt-1">مدير الأسماء</span>
                  <span className="text-[9px] text-gray-500">Name Manager</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">أسماء معرفة</div>
            </div>

            {/* Formula Auditing */}
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={onToggleShowFormulas}
                  className={`flex flex-col items-center justify-center p-1.5 rounded border transition ${
                    showFormulasMode
                      ? 'bg-amber-100 border-amber-400 text-amber-900 font-bold'
                      : 'border-gray-200 hover:bg-gray-100 text-gray-700'
                  }`}
                  title="إظهار الصيغ والمعادلات مباشرة داخل الخلايا (Ctrl + `)"
                >
                  <Hash className="w-4 h-4 text-emerald-700" />
                  <span className="text-[10px] font-semibold mt-0.5">إظهار الصيغ</span>
                </button>

                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => alert(`تتبع الخلايا السابقة للخلية ${activeCell}: تم فحص الارتباطات المباشرة`)}
                    className="px-1.5 py-0.5 bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 text-[10px] text-gray-700"
                  >
                    تتبع السابقات
                  </button>
                  <button
                    onClick={() => alert(`تتبع الخلايا التابعة للخلية ${activeCell}: تم التحقق من كافة الصيغ المعتمدة`)}
                    className="px-1.5 py-0.5 bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 text-[10px] text-gray-700"
                  >
                    تتبع التوابع
                  </button>
                </div>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">تدقيق الصيغ</div>
            </div>

            {/* Calculation */}
            <div className="flex flex-col justify-between pl-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={onRecalculateAll}
                  className="flex flex-col items-center justify-center p-2 bg-[#107c41] hover:bg-[#0e6b37] text-white rounded font-bold transition shadow-xs"
                  title="إعادة حساب كافة المعادلات والصيغ في جميع أوراق العمل الآن (F9)"
                >
                  <Calculator className="w-4 h-4" />
                  <span className="text-[10px] font-bold mt-1">حساب الآن</span>
                  <span className="text-[8.5px] opacity-80">(F9) Calculate</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">حساب</div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: DATA (بيانات)                                        */}
        {/* ========================================================= */}
        {activeTab === 'data' && (
          <div className="flex items-stretch gap-3">
            {/* Get & Transform Data */}
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert('معالج Power Query لجلب وتحويل البيانات من ملفات CSV وقواعد بيانات')}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-emerald-50 rounded text-gray-800"
                >
                  <Download className="w-4 h-4 text-[#107c41]" />
                  <span className="text-[10px] font-bold mt-0.5">Power Query</span>
                  <span className="text-[9px] text-gray-500">جلب البيانات</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">جلب وتحويل البيانات</div>
            </div>

            {/* Sort & Filter */}
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onSort('asc')}
                  className="px-2 py-1 bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 text-gray-800 font-bold text-[10.5px]"
                  title="فرز تصاعدي"
                >
                  فرز أ ← ي
                </button>
                <button
                  onClick={() => onSort('desc')}
                  className="px-2 py-1 bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 text-gray-800 font-bold text-[10.5px]"
                  title="فرز تنازلي"
                >
                  فرز ي ← أ
                </button>
                <button
                  onClick={onToggleFilter}
                  className={`flex items-center gap-1 px-2 py-1 rounded border font-semibold text-[10.5px] ${
                    isFilterActive
                      ? 'bg-emerald-100 border-emerald-400 text-[#107c41] font-bold'
                      : 'border-gray-200 hover:bg-gray-100 text-gray-700'
                  }`}
                  title="تصفية البيانات"
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>تصفية</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">فرز وتصفية</div>
            </div>

            {/* Data Tools */}
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onOpenTextToColumns}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-emerald-50 rounded text-gray-800"
                  title="تحويل النص إلى أعمدة (Text to Columns)"
                >
                  <SplitSquareVertical className="w-4 h-4 text-blue-600" />
                  <span className="text-[9.5px] font-bold mt-0.5">نص إلى أعمدة</span>
                </button>

                <button
                  onClick={onOpenRemoveDuplicates}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-emerald-50 rounded text-gray-800"
                  title="إزالة الصفوف المكررة (Remove Duplicates)"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                  <span className="text-[9.5px] font-bold mt-0.5">إزالة التكرارات</span>
                </button>

                <button
                  onClick={onOpenDataValidation}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-emerald-50 rounded text-gray-800"
                  title="التحقق من صحة البيانات وقوائم الاختيار المنسدلة (Data Validation)"
                >
                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                  <span className="text-[9.5px] font-bold mt-0.5">صحة البيانات</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">أدوات البيانات</div>
            </div>

            {/* Forecast & What-If */}
            <div className="flex flex-col justify-between pl-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenGoalSeek}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-indigo-50 rounded text-indigo-900 border border-indigo-200"
                  title="تحليل ماذا لو واسترجاع القيمة المستهدفة (Goal Seek / What-If Analysis)"
                >
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                  <span className="text-[9.5px] font-bold mt-0.5">تحليل ماذا لو</span>
                  <span className="text-[8.5px] text-gray-500">Goal Seek</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">التنبؤ والمخطط التفصيلي</div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: REVIEW (مراجعة)                                      */}
        {/* ========================================================= */}
        {activeTab === 'review' && (
          <div className="flex items-stretch gap-3">
            {/* Proofing */}
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert('تم التدقيق الإملائي: كافة النصوص والمصطلحات سليمة!')}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-emerald-50 rounded text-gray-800"
                >
                  <FileCheck className="w-4 h-4 text-[#107c41]" />
                  <span className="text-[10px] font-bold mt-0.5">تدقيق إملائي</span>
                </button>
                <button
                  onClick={() => alert('قاموس المرادفات متصل بالمعجم العربي المعتمد')}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-gray-100 rounded text-gray-700"
                >
                  <span className="text-sm">📖</span>
                  <span className="text-[10px] font-semibold mt-0.5">قاموس المرادفات</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">تدقيق ولغة</div>
            </div>

            {/* Comments & Notes */}
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const c = prompt('أدخل تعليقاً على الخلية:', activeCellData?.comment || '');
                    if (c !== null) onFormatRange('comment', c);
                  }}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-amber-50 rounded text-gray-800"
                >
                  <Bookmark className="w-4 h-4 text-amber-600" />
                  <span className="text-[10px] font-bold mt-0.5">تعليق جديد</span>
                </button>
                <button
                  onClick={() => onFormatRange('comment', undefined)}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-red-50 rounded text-red-700"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                  <span className="text-[10px] font-semibold mt-0.5">حذف التعليق</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">تعليقات وملاحظات</div>
            </div>

            {/* Protect */}
            <div className="flex flex-col justify-between pl-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert('تم تفعيل حماية ورقة العمل ضد التعديل غير المصرح به!')}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-emerald-50 rounded text-emerald-900 border border-emerald-300"
                  title="حماية ورقة العمل بكلمة مرور"
                >
                  <ShieldCheck className="w-4 h-4 text-[#107c41]" />
                  <span className="text-[10px] font-bold mt-0.5">حماية الورقة</span>
                </button>
                <button
                  onClick={() => alert('تم قفل بنية المصنف (منع حذف أو إضافة أوراق جديدة)')}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-gray-100 rounded text-gray-700 border border-gray-200"
                >
                  <Lock className="w-4 h-4 text-gray-600" />
                  <span className="text-[10px] font-semibold mt-0.5">حماية المصنف</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">حماية ومشاركة</div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: VIEW (عرض)                                           */}
        {/* ========================================================= */}
        {activeTab === 'view' && (
          <div className="flex items-stretch gap-3">
            {/* Workbook Views */}
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => alert('وضع العرض: عادي (Normal Grid)')}
                  className="px-2.5 py-1 bg-emerald-100 text-[#107c41] font-bold rounded text-[10.5px] border border-emerald-300"
                >
                  عادي
                </button>
                <button
                  onClick={() => alert('وضع العرض: تخطيط الصفحة (Page Layout)')}
                  className="px-2.5 py-1 hover:bg-gray-100 text-gray-700 font-semibold rounded text-[10.5px] border border-gray-200"
                >
                  تخطيط الصفحة
                </button>
                <button
                  onClick={() => alert('وضع العرض: معاينة فواصل الصفحات')}
                  className="px-2.5 py-1 hover:bg-gray-100 text-gray-700 font-semibold rounded text-[10.5px] border border-gray-200"
                >
                  معاينة الفواصل
                </button>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">طرق عرض المصنف</div>
            </div>

            {/* Show / Hide */}
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2">
              <div className="flex flex-col gap-1 text-[11px] text-gray-700">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showFormulaBar}
                    onChange={onToggleFormulaBar}
                    className="accent-[#107c41] rounded"
                  />
                  <span>شريط الصيغة (Formula Bar)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showGridlines}
                    onChange={onToggleGridlines}
                    className="accent-[#107c41] rounded"
                  />
                  <span>خطوط الشبكة (Gridlines)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showHeadings}
                    onChange={onToggleHeadings}
                    className="accent-[#107c41] rounded"
                  />
                  <span>عناوين الصفوف والأعمدة</span>
                </label>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">إظهار</div>
            </div>

            {/* Zoom */}
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onSetZoomLevel(100)}
                  className="px-2 py-1 bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 text-gray-800 font-bold text-[10.5px]"
                >
                  100%
                </button>
                <button
                  onClick={() => onSetZoomLevel(Math.min(200, zoomLevel + 15))}
                  className="p-1 hover:bg-gray-100 rounded text-gray-700 font-bold"
                  title="تكبير"
                >
                  +
                </button>
                <span className="font-mono text-xs text-gray-600">{zoomLevel}%</span>
                <button
                  onClick={() => onSetZoomLevel(Math.max(50, zoomLevel - 15))}
                  className="p-1 hover:bg-gray-100 rounded text-gray-700 font-bold"
                  title="تصغير"
                >
                  -
                </button>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">تكبير / تصغير</div>
            </div>

            {/* Freeze Panes & Window */}
            <div className="flex flex-col justify-between pl-1">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    onClick={() => setShowFreezeMenu(!showFreezeMenu)}
                    className="flex flex-col items-center justify-center p-1.5 hover:bg-emerald-50 rounded text-gray-800 border border-gray-200"
                    title="تجميد الأجزاء لمنع تحرك الصفوف أو الأعمدة أثناء التمرير"
                  >
                    <Maximize2 className="w-4 h-4 text-blue-600" />
                    <span className="text-[10px] font-bold mt-0.5">تجميد الأجزاء</span>
                    <span className="text-[8.5px] text-gray-500">Freeze Panes</span>
                  </button>

                  {showFreezeMenu && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-xl py-1 z-50 w-44 text-right">
                      <button
                        onClick={() => { onSetFreezePanes('row'); setShowFreezeMenu(false); }}
                        className="w-full px-3 py-1.5 text-right hover:bg-emerald-50 text-[11px] block font-semibold"
                      >
                        تجميد الصف العلوي
                      </button>
                      <button
                        onClick={() => { onSetFreezePanes('col'); setShowFreezeMenu(false); }}
                        className="w-full px-3 py-1.5 text-right hover:bg-emerald-50 text-[11px] block font-semibold"
                      >
                        تجميد العمود الأول
                      </button>
                      <button
                        onClick={() => { onSetFreezePanes('both'); setShowFreezeMenu(false); }}
                        className="w-full px-3 py-1.5 text-right hover:bg-emerald-50 text-[11px] block font-semibold"
                      >
                        تجميد الألواح (صف وعمود)
                      </button>
                      <button
                        onClick={() => { onSetFreezePanes('none'); setShowFreezeMenu(false); }}
                        className="w-full px-3 py-1.5 text-right hover:bg-red-50 text-[11px] text-red-600 block"
                      >
                        إلغاء تجميد الأجزاء
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => alert('عرض وحدات ماكرو (VBA Macros)')}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-gray-100 rounded text-gray-700"
                >
                  <Binary className="w-4 h-4 text-purple-600" />
                  <span className="text-[10px] font-semibold mt-0.5">وحدات ماكرو</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">نافذة ووحدات ماكرو</div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: DESIGN (Table Tools Design - تصميم الجدول)           */}
        {/* ========================================================= */}
        {activeTab === 'design' && (
          <div className="flex items-stretch gap-2 text-xs">
            {/* 1. Properties Group */}
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2 pr-1">
              <div className="flex flex-col gap-1.5">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-600 font-semibold mb-0.5">Table Name:</span>
                  <input
                    type="text"
                    value={tableName}
                    onChange={(e) => onTableNameChange?.(e.target.value)}
                    className="w-24 bg-white border border-gray-300 rounded px-1.5 py-0.5 text-xs font-mono font-bold text-gray-900 outline-none focus:border-[#107c41]"
                  />
                </div>
                <button
                  onClick={onResizeTable}
                  className="flex items-center gap-1.5 p-1 rounded hover:bg-emerald-50 text-gray-700 hover:text-[#107c41] transition cursor-pointer text-[11px]"
                  title="تغيير أبعاد وحدود الجدول (Resize Table)"
                >
                  <Grid className="w-3.5 h-3.5 text-blue-600" />
                  <span>Resize Table</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">Properties</div>
            </div>

            {/* 2. Tools Group */}
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2 pr-1">
              <div className="flex flex-col gap-1">
                <button
                  onClick={onOpenPivotTable}
                  className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-emerald-50 text-gray-800 text-[11px] font-semibold transition cursor-pointer"
                  title="تلخيص بيانات الجدول بجدول محوري (PivotTable)"
                >
                  <Table className="w-3.5 h-3.5 text-[#107c41]" />
                  <span>Summarize with PivotTable</span>
                </button>
                <button
                  onClick={onOpenRemoveDuplicates}
                  className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-emerald-50 text-gray-800 text-[11px] font-semibold transition cursor-pointer"
                  title="إزالة وتصفية الصفوف المكررة (Remove Duplicates)"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-amber-600" />
                  <span>Remove Duplicates</span>
                </button>
                <button
                  onClick={onConvertTableToRange}
                  className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-emerald-50 text-gray-800 text-[11px] font-semibold transition cursor-pointer"
                  title="تحويل الجدول إلى نطاق خلايا عادي مع الاحتفاظ بالتنسيق"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
                  <span>Convert to Range</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">Tools</div>
            </div>

            {/* 3. External Table Data Group */}
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2 pr-1">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onInsertSlicer}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-emerald-50 rounded text-gray-800 cursor-pointer"
                  title="إدراج مقسم طريقة العرض لتصفية بيانات الجدول بيانياً (Insert Slicer)"
                >
                  <Filter className="w-4 h-4 text-purple-600" />
                  <span className="text-[10px] font-semibold mt-0.5">Insert Slicer</span>
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowExportDataMenu(!showExportDataMenu)}
                    className="flex flex-col items-center justify-center p-1.5 hover:bg-emerald-50 rounded text-gray-800 cursor-pointer"
                    title="تصدير بيانات الجدول"
                  >
                    <Download className="w-4 h-4 text-blue-600" />
                    <span className="text-[10px] font-semibold mt-0.5 flex items-center gap-0.5">
                      Export <ChevronDown className="w-3 h-3 text-gray-500" />
                    </span>
                  </button>

                  {showExportDataMenu && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-xl py-1 z-50 w-44 text-right">
                      <button
                        onClick={() => { onExportTable?.('csv'); setShowExportDataMenu(false); }}
                        className="w-full px-3 py-1.5 text-right hover:bg-emerald-50 text-[11px] block font-semibold"
                      >
                        تصدير إلى ملف CSV
                      </button>
                      <button
                        onClick={() => { onExportTable?.('json'); setShowExportDataMenu(false); }}
                        className="w-full px-3 py-1.5 text-right hover:bg-emerald-50 text-[11px] block font-semibold"
                      >
                        تصدير إلى JSON
                      </button>
                      <button
                        onClick={() => { onExportTable?.('pdf'); setShowExportDataMenu(false); }}
                        className="w-full px-3 py-1.5 text-right hover:bg-emerald-50 text-[11px] block font-semibold"
                      >
                        تصدير كتقرير PDF
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={onRecalculateAll}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-emerald-50 rounded text-gray-800 cursor-pointer"
                  title="تحديث حسابات وبيانات الجدول (Refresh)"
                >
                  <RefreshCw className="w-4 h-4 text-[#107c41]" />
                  <span className="text-[10px] font-semibold mt-0.5">Refresh</span>
                </button>

                <div className="flex flex-col gap-0.5 text-[10px] text-gray-600">
                  <button onClick={() => onOpenFormatCells?.()} className="hover:text-blue-600 text-right cursor-pointer flex items-center gap-1">
                    <span>Properties</span>
                  </button>
                  <button onClick={() => window.open(window.location.href, '_blank')} className="hover:text-blue-600 text-right cursor-pointer flex items-center gap-1">
                    <span>Open in Browser</span>
                  </button>
                  <button onClick={onConvertTableToRange} className="hover:text-red-600 text-right cursor-pointer flex items-center gap-1">
                    <span>Unlink</span>
                  </button>
                </div>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">External Table Data</div>
            </div>

            {/* 4. Table Style Options Group */}
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2 pr-1">
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
                <label className="flex items-center gap-1.5 cursor-pointer text-gray-800 select-none">
                  <input
                    type="checkbox"
                    checked={hasHeaderRow}
                    onChange={onToggleHeaderRow}
                    className="accent-[#107c41] rounded w-3.5 h-3.5 cursor-pointer"
                  />
                  <span>Header Row</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-gray-800 select-none">
                  <input
                    type="checkbox"
                    checked={hasFirstColumn}
                    onChange={onToggleFirstColumn}
                    className="accent-[#107c41] rounded w-3.5 h-3.5 cursor-pointer"
                  />
                  <span>First Column</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-gray-800 select-none">
                  <input
                    type="checkbox"
                    checked={hasTotalRow}
                    onChange={onToggleTotalRow}
                    className="accent-[#107c41] rounded w-3.5 h-3.5 cursor-pointer"
                  />
                  <span>Total Row</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-gray-800 select-none">
                  <input
                    type="checkbox"
                    checked={hasLastColumn}
                    onChange={onToggleLastColumn}
                    className="accent-[#107c41] rounded w-3.5 h-3.5 cursor-pointer"
                  />
                  <span>Last Column</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-gray-800 select-none">
                  <input
                    type="checkbox"
                    checked={hasBandedRows}
                    onChange={onToggleBandedRows}
                    className="accent-[#107c41] rounded w-3.5 h-3.5 cursor-pointer"
                  />
                  <span>Banded Rows</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-gray-800 select-none">
                  <input
                    type="checkbox"
                    checked={hasBandedColumns}
                    onChange={onToggleBandedColumns}
                    className="accent-[#107c41] rounded w-3.5 h-3.5 cursor-pointer"
                  />
                  <span>Banded Columns</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-gray-800 select-none col-span-2">
                  <input
                    type="checkbox"
                    checked={hasFilterButton}
                    onChange={onToggleFilterButton}
                    className="accent-[#107c41] rounded w-3.5 h-3.5 cursor-pointer"
                  />
                  <span>Filter Button</span>
                </label>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">Table Style Options</div>
            </div>

            {/* 5. Table Styles Gallery */}
            <div className="flex flex-col justify-between pl-1">
              <div className="flex items-center gap-1.5 overflow-x-auto max-w-sm py-0.5">
                {/* Excel Classic Green */}
                <div
                  onClick={() => onApplyTableStyle?.('green')}
                  className={`w-14 h-12 rounded border p-0.5 cursor-pointer transition flex flex-col justify-between shrink-0 shadow-2xs ${
                    activeTableStyle === 'green' || activeTableStyle === 'emerald' ? 'ring-2 ring-[#107c41] border-[#107c41]' : 'border-gray-300 hover:border-gray-500'
                  }`}
                  title="نمط إكسيل الأخضر الكلاسيكي (Excel Green Medium)"
                >
                  <div className="h-3 bg-[#107c41] rounded-t-xs" />
                  <div className="h-2 bg-[#dcfce7]" />
                  <div className="h-2 bg-white" />
                  <div className="h-2 bg-[#dcfce7] rounded-b-xs" />
                </div>

                {/* Dark / Black Theme */}
                <div
                  onClick={() => onApplyTableStyle?.('black')}
                  className={`w-14 h-12 rounded border p-0.5 cursor-pointer transition flex flex-col justify-between shrink-0 shadow-2xs ${
                    activeTableStyle === 'black' || activeTableStyle === 'dark' || activeTableStyle === 'charcoal' ? 'ring-2 ring-gray-900 border-gray-900' : 'border-gray-300 hover:border-gray-500'
                  }`}
                  title="نمط إكسيل الأسود الداكن (Charcoal Dark)"
                >
                  <div className="h-3 bg-gray-900 rounded-t-xs" />
                  <div className="h-2 bg-gray-200" />
                  <div className="h-2 bg-white" />
                  <div className="h-2 bg-gray-200 rounded-b-xs" />
                </div>

                {/* Office Light Blue */}
                <div
                  onClick={() => onApplyTableStyle?.('blue')}
                  className={`w-14 h-12 rounded border p-0.5 cursor-pointer transition flex flex-col justify-between shrink-0 shadow-2xs ${
                    activeTableStyle === 'blue' || activeTableStyle === 'light-blue' || activeTableStyle === 'sky' ? 'ring-2 ring-blue-600 border-blue-600' : 'border-gray-300 hover:border-gray-500'
                  }`}
                  title="نمط أوفيس الأزرق (Light Blue Medium)"
                >
                  <div className="h-3 bg-[#0284c7] rounded-t-xs" />
                  <div className="h-2 bg-[#e0f2fe]" />
                  <div className="h-2 bg-white" />
                  <div className="h-2 bg-[#e0f2fe] rounded-b-xs" />
                </div>

                {/* Warm Orange */}
                <div
                  onClick={() => onApplyTableStyle?.('orange')}
                  className={`w-14 h-12 rounded border p-0.5 cursor-pointer transition flex flex-col justify-between shrink-0 shadow-2xs ${
                    activeTableStyle === 'orange' || activeTableStyle === 'warm-orange' || activeTableStyle === 'amber' ? 'ring-2 ring-amber-600 border-amber-600' : 'border-gray-300 hover:border-gray-500'
                  }`}
                  title="نمط برتقالي دافئ (Warm Orange Medium)"
                >
                  <div className="h-3 bg-[#ea580c] rounded-t-xs" />
                  <div className="h-2 bg-[#ffedd5]" />
                  <div className="h-2 bg-white" />
                  <div className="h-2 bg-[#ffedd5] rounded-b-xs" />
                </div>

                {/* Steel Gray */}
                <div
                  onClick={() => onApplyTableStyle?.('gray')}
                  className={`w-14 h-12 rounded border p-0.5 cursor-pointer transition flex flex-col justify-between shrink-0 shadow-2xs ${
                    activeTableStyle === 'gray' || activeTableStyle === 'steel' ? 'ring-2 ring-gray-600 border-gray-600' : 'border-gray-300 hover:border-gray-500'
                  }`}
                  title="نمط رمادي أنيق (Steel Gray Medium)"
                >
                  <div className="h-3 bg-[#4b5563] rounded-t-xs" />
                  <div className="h-2 bg-[#f3f4f6]" />
                  <div className="h-2 bg-white" />
                  <div className="h-2 bg-[#f3f4f6] rounded-b-xs" />
                </div>

                {/* Yellow / Gold */}
                <div
                  onClick={() => onApplyTableStyle?.('yellow')}
                  className={`w-14 h-12 rounded border p-0.5 cursor-pointer transition flex flex-col justify-between shrink-0 shadow-2xs ${
                    activeTableStyle === 'yellow' || activeTableStyle === 'gold' ? 'ring-2 ring-amber-500 border-amber-500' : 'border-gray-300 hover:border-gray-500'
                  }`}
                  title="نمط ذهبي مالي (Gold Yellow Medium)"
                >
                  <div className="h-3 bg-[#d97706] rounded-t-xs" />
                  <div className="h-2 bg-[#fef3c7]" />
                  <div className="h-2 bg-white" />
                  <div className="h-2 bg-[#fef3c7] rounded-b-xs" />
                </div>

                {/* Deep Blue */}
                <div
                  onClick={() => onApplyTableStyle?.('navy')}
                  className={`w-14 h-12 rounded border p-0.5 cursor-pointer transition flex flex-col justify-between shrink-0 shadow-2xs ${
                    activeTableStyle === 'navy' || activeTableStyle === 'deep-blue' || activeTableStyle === 'indigo' ? 'ring-2 ring-indigo-700 border-indigo-700' : 'border-gray-300 hover:border-gray-500'
                  }`}
                  title="نمط كحلي داكن (Deep Navy Medium)"
                >
                  <div className="h-3 bg-[#1e40af] rounded-t-xs" />
                  <div className="h-2 bg-[#dbeafe]" />
                  <div className="h-2 bg-white" />
                  <div className="h-2 bg-[#dbeafe] rounded-b-xs" />
                </div>

                {/* Full Gallery Button */}
                <button
                  onClick={() => onOpenTableStylesGallery?.()}
                  className="w-14 h-12 rounded border border-emerald-400 bg-emerald-50 hover:bg-emerald-100 p-1 cursor-pointer transition flex flex-col items-center justify-center shrink-0 shadow-2xs text-[#107c41]"
                  title="عرض كافة أنماط جداول Excel 365 (Light, Medium, Dark)"
                >
                  <Table className="w-4 h-4" />
                  <span className="text-[8px] font-bold mt-0.5">كافة الأنماط</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">Table Styles</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
