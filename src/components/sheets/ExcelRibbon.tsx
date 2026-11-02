import React, { useState } from 'react';
import {
  Clipboard,
  Scissors,
  Copy,
  Paintbrush,
  ChevronDown,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Grid,
  PaintBucket,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  WrapText,
  Merge,
  Percent,
  DollarSign,
  Plus,
  Minus,
  Table as TableIcon,
  BarChart2,
  PieChart,
  LineChart,
  AreaChart,
  Image as ImageIcon,
  MessageSquare,
  FunctionSquare,
  Sparkles,
  Columns,
  Trash2,
  Search,
  CheckCircle2,
  FileSpreadsheet,
  Lock,
  Unlock,
  Eye,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Layers,
  Check,
  SplitSquareVertical,
  Target,
  ArrowUpDown,
  Filter,
  Play,
  RotateCcw,
  Sparkle
} from 'lucide-react';
import { SheetCell } from '../../types/office';

interface Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenFileMenu: () => void;
  selectedCellKey: string;
  currentCell?: SheetCell;
  isFormatPainterActive: boolean;
  onToggleFormatPainter: () => void;
  onCut: () => void;
  onCopy: () => void;
  onPaste: (special?: 'values' | 'formats' | 'formulas') => void;
  onUpdateStyle: (key: keyof SheetCell, value: any) => void;
  onClearFormatting: () => void;
  onClearContents: () => void;
  onClearAll: () => void;
  onInsertRow: () => void;
  onInsertColumn: () => void;
  onDeleteRow: () => void;
  onDeleteColumn: () => void;
  onAutoSum: (fn: 'SUM' | 'AVERAGE' | 'COUNT' | 'MAX' | 'MIN') => void;
  onSort: (direction: 'asc' | 'desc') => void;
  onToggleFilter: () => void;
  isFilterActive: boolean;
  onOpenFindReplace: () => void;
  onOpenInsertFunction: () => void;
  onInsertSparkline: (type: 'line' | 'bar') => void;
  onOpenConditionalFormatting: () => void;
  onOpenDataValidation: () => void;
  onOpenRemoveDuplicates: () => void;
  onOpenTextToColumns: () => void;
  onOpenGoalSeek: () => void;
  onOpenNameManager: () => void;
  onOpenPivotTable: () => void;
  onOpenChartModal: (type?: 'column' | 'line' | 'pie' | 'area') => void;
  onOpenProtectSheet: () => void;
  isSheetProtected: boolean;
  onOpenSpellCheck: () => void;
  onAddComment: () => void;
  onDeleteComment: () => void;
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
  freezeState: 'none' | 'topRow' | 'firstCol' | 'selection';
  onSetFreezePanes: (type: 'none' | 'topRow' | 'firstCol' | 'selection') => void;
  zoomLevel: number;
  onSetZoomLevel: (zoom: number) => void;
  onRecalculateAll: () => void;
  onInsertImage: () => void;
  onCreateTable: () => void;
}

const FONT_FAMILIES = [
  'Calibri',
  'Arial',
  'Segoe UI',
  'Times New Roman',
  'Tahoma',
  'Cairo',
  'Tajawal',
  'Almarai',
  'Amiri',
  'IBM Plex Sans Arabic',
];

const FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 36, 48];

const COLOR_PALETTE = [
  '#000000', '#ffffff', '#107c41', '#0078d4', '#d83b01', '#7719aa', '#a4373a', '#e81123',
  '#f3f4f6', '#fee2e2', '#dcfce7', '#dbeafe', '#fef9c3', '#f3e8ff', '#ffedd5', '#e0e7ff',
  '#1e293b', '#475569', '#059669', '#0284c7', '#ea580c', '#9333ea', '#dc2626', '#4f46e5'
];

export const ExcelRibbon: React.FC<Props> = ({
  activeTab,
  onTabChange,
  onOpenFileMenu,
  selectedCellKey,
  currentCell,
  isFormatPainterActive,
  onToggleFormatPainter,
  onCut,
  onCopy,
  onPaste,
  onUpdateStyle,
  onClearFormatting,
  onClearContents,
  onClearAll,
  onInsertRow,
  onInsertColumn,
  onDeleteRow,
  onDeleteColumn,
  onAutoSum,
  onSort,
  onToggleFilter,
  isFilterActive,
  onOpenFindReplace,
  onOpenInsertFunction,
  onInsertSparkline,
  onOpenConditionalFormatting,
  onOpenDataValidation,
  onOpenRemoveDuplicates,
  onOpenTextToColumns,
  onOpenGoalSeek,
  onOpenNameManager,
  onOpenPivotTable,
  onOpenChartModal,
  onOpenProtectSheet,
  isSheetProtected,
  onOpenSpellCheck,
  onAddComment,
  onDeleteComment,
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
  onCreateTable,
}) => {
  // Dropdown states
  const [pasteMenuOpen, setPasteMenuOpen] = useState(false);
  const [bordersMenuOpen, setBordersMenuOpen] = useState(false);
  const [fillColorOpen, setFillColorOpen] = useState(false);
  const [textColorOpen, setTextColorOpen] = useState(false);
  const [autoSumMenuOpen, setAutoSumMenuOpen] = useState(false);
  const [clearMenuOpen, setClearMenuOpen] = useState(false);
  const [freezeMenuOpen, setFreezeMenuOpen] = useState(false);
  const [sparklineMenuOpen, setSparklineMenuOpen] = useState(false);
  const [chartsMenuOpen, setChartsMenuOpen] = useState(false);
  const [numberFormatOpen, setNumberFormatOpen] = useState(false);

  const curFont = currentCell?.fontFamily || 'Calibri';
  const curSize = currentCell?.fontSize || 11;
  const isBold = !!currentCell?.bold;
  const isItalic = !!currentCell?.italic;
  const isUnderline = !!currentCell?.underline;
  const isStrikethrough = !!currentCell?.strikethrough;

  const tabs = [
    { id: 'home', label: 'الرئيسية' },
    { id: 'insert', label: 'إدراج' },
    { id: 'layout', label: 'تخطيط الصفحة' },
    { id: 'formulas', label: 'صيغ' },
    { id: 'data', label: 'بيانات' },
    { id: 'review', label: 'مراجعة' },
    { id: 'view', label: 'عرض' },
  ];

  return (
    <div className="bg-[#f3f2f1] border-b border-gray-300 select-none text-gray-800 text-xs shrink-0 z-30 ribbon-container">
      {/* Tabs Header */}
      <div className="flex items-center gap-0.5 px-3 pt-1 border-b border-gray-300 bg-[#f3f2f1]">
        <button
          onClick={onOpenFileMenu}
          className="px-4 py-1.5 bg-[#107c41] hover:bg-[#0e6b37] text-white font-bold rounded-t-sm transition flex items-center gap-1.5 cursor-pointer shadow-xs text-xs"
        >
          <span>ملف</span>
        </button>

        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-3.5 py-1.5 font-semibold text-xs rounded-t-sm transition cursor-pointer relative ${
                isActive
                  ? 'bg-white text-[#107c41] font-bold border-t-2 border-t-[#107c41] shadow-2xs'
                  : 'text-gray-700 hover:bg-gray-200/70 hover:text-gray-900'
              }`}
            >
              {tab.label}
              {isActive && (
                <div className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-white z-10" />
              )}
            </button>
          );
        })}

        <div className="flex-1" />

        <div className="flex items-center gap-2 text-[11px] text-gray-600 px-2 pb-1">
          <span className="bg-emerald-100 text-[#107c41] px-2 py-0.5 rounded font-mono font-bold">
            {selectedCellKey || 'A1'}
          </span>
          <span className="text-gray-400">|</span>
          <span className="font-semibold">Excel Sovereign Suite</span>
        </div>
      </div>

      {/* Ribbon Command Strip */}
      <div className="bg-white px-3 py-1.5 min-h-[92px] flex items-stretch gap-2 overflow-x-auto shadow-inner">
        {/* ===================== HOME TAB ===================== */}
        {activeTab === 'home' && (
          <div className="flex items-stretch gap-2.5">
            {/* Clipboard Group */}
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2">
              <div className="flex items-center gap-1">
                <div className="relative">
                  <button
                    onClick={() => onPaste()}
                    className="flex flex-col items-center justify-center p-1.5 hover:bg-emerald-50 rounded cursor-pointer text-gray-700 hover:text-[#107c41]"
                    title="لصق (Ctrl+V)"
                  >
                    <Clipboard className="w-5 h-5 text-[#107c41]" />
                    <span className="text-[10px] font-semibold mt-0.5">لصق</span>
                  </button>
                  <button
                    onClick={() => setPasteMenuOpen(!pasteMenuOpen)}
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 p-0.5 hover:bg-gray-200 rounded text-gray-500"
                    title="خيارات اللصق الخاص"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  {pasteMenuOpen && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-xl py-1 z-50 w-36 text-right">
                      <button
                        onClick={() => { onPaste('values'); setPasteMenuOpen(false); }}
                        className="w-full px-3 py-1 text-right hover:bg-emerald-50 text-[11px] block"
                      >
                        لصق قيم فقط (Values)
                      </button>
                      <button
                        onClick={() => { onPaste('formats'); setPasteMenuOpen(false); }}
                        className="w-full px-3 py-1 text-right hover:bg-emerald-50 text-[11px] block"
                      >
                        لصق تنسيقات فقط
                      </button>
                      <button
                        onClick={() => { onPaste('formulas'); setPasteMenuOpen(false); }}
                        className="w-full px-3 py-1 text-right hover:bg-emerald-50 text-[11px] block"
                      >
                        لصق صيغ فقط
                      </button>
                    </div>
                  )}
                </div>

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
                        ? 'bg-amber-100 border-amber-400 text-amber-900 font-bold shadow-xs'
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
                <div className="flex items-center gap-1">
                  <select
                    value={curFont}
                    onChange={e => onUpdateStyle('fontFamily', e.target.value)}
                    className="border border-gray-300 rounded px-1.5 py-0.5 text-[11px] bg-white outline-none w-28"
                  >
                    {FONT_FAMILIES.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>

                  <select
                    value={curSize}
                    onChange={e => onUpdateStyle('fontSize', parseInt(e.target.value, 10))}
                    className="border border-gray-300 rounded px-1 py-0.5 text-[11px] bg-white outline-none w-14"
                  >
                    {FONT_SIZES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => onUpdateStyle('fontSize', curSize + 1)}
                    className="p-1 hover:bg-gray-100 rounded text-gray-700 font-bold text-xs"
                    title="تكبير حجم الخط"
                  >
                    A↑
                  </button>
                  <button
                    onClick={() => onUpdateStyle('fontSize', Math.max(6, curSize - 1))}
                    className="p-1 hover:bg-gray-100 rounded text-gray-700 font-bold text-[10px]"
                    title="تصغير حجم الخط"
                  >
                    A↓
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onUpdateStyle('bold', !isBold)}
                    className={`p-1 rounded font-bold ${isBold ? 'bg-gray-300 text-black' : 'hover:bg-gray-100 text-gray-700'}`}
                    title="عريض (Ctrl+B)"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onUpdateStyle('italic', !isItalic)}
                    className={`p-1 rounded italic ${isItalic ? 'bg-gray-300 text-black' : 'hover:bg-gray-100 text-gray-700'}`}
                    title="مائل (Ctrl+I)"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onUpdateStyle('underline', !isUnderline)}
                    className={`p-1 rounded underline ${isUnderline ? 'bg-gray-300 text-black' : 'hover:bg-gray-100 text-gray-700'}`}
                    title="تسطير (Ctrl+U)"
                  >
                    <Underline className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onUpdateStyle('strikethrough', !isStrikethrough)}
                    className={`p-1 rounded ${isStrikethrough ? 'bg-gray-300 text-black' : 'hover:bg-gray-100 text-gray-700'}`}
                    title="يتوسطه خط"
                  >
                    <Strikethrough className="w-3.5 h-3.5" />
                  </button>

                  <div className="h-4 w-[1px] bg-gray-200 mx-0.5" />

                  {/* Borders Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setBordersMenuOpen(!bordersMenuOpen)}
                      className="p-1 hover:bg-gray-100 rounded text-gray-700 flex items-center gap-0.5"
                      title="حدود الخلايا (Borders)"
                    >
                      <Grid className="w-3.5 h-3.5" />
                      <ChevronDown className="w-2.5 h-2.5" />
                    </button>
                    {bordersMenuOpen && (
                      <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-xl py-1 z-50 w-44 text-right">
                        {[
                          { id: 'all', label: 'كافة الحدود (All Borders)' },
                          { id: 'box', label: 'حدود خارجية مربعة' },
                          { id: 'thick-bottom', label: 'حد سفلي سميك' },
                          { id: 'double-bottom', label: 'حد سفلي مزدوج' },
                          { id: 'bottom', label: 'حد سفلي فقط' },
                          { id: 'none', label: 'بلا حدود (مسح الحدود)' },
                        ].map(b => (
                          <button
                            key={b.id}
                            onClick={() => {
                              onUpdateStyle('border', b.id as any);
                              setBordersMenuOpen(false);
                            }}
                            className="w-full px-3 py-1 text-right hover:bg-emerald-50 text-[11px] block"
                          >
                            {b.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Fill Color */}
                  <div className="relative">
                    <button
                      onClick={() => setFillColorOpen(!fillColorOpen)}
                      className="p-1 hover:bg-gray-100 rounded text-gray-700 flex items-center gap-0.5"
                      title="لون التعبئة"
                    >
                      <PaintBucket className="w-3.5 h-3.5" />
                      <ChevronDown className="w-2.5 h-2.5" />
                    </button>
                    {fillColorOpen && (
                      <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-xl p-2 z-50 w-48">
                        <div className="text-[10px] text-gray-500 mb-1 font-bold">لوحة ألوان التعبئة:</div>
                        <div className="grid grid-cols-6 gap-1">
                          {COLOR_PALETTE.map(c => (
                            <button
                              key={c}
                              onClick={() => {
                                onUpdateStyle('bg', c);
                                setFillColorOpen(false);
                              }}
                              className="w-5 h-5 rounded border border-gray-300 hover:scale-110 transition cursor-pointer"
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                        <button
                          onClick={() => {
                            onUpdateStyle('bg', undefined);
                            setFillColorOpen(false);
                          }}
                          className="w-full mt-2 text-center text-[10px] text-red-600 hover:bg-red-50 py-0.5 rounded cursor-pointer"
                        >
                          بلا تعبئة
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Text Color */}
                  <div className="relative">
                    <button
                      onClick={() => setTextColorOpen(!textColorOpen)}
                      className="p-1 hover:bg-gray-100 rounded flex items-center gap-0.5 font-bold text-xs"
                      title="لون النص"
                    >
                      <span className="underline decoration-red-500 decoration-2 font-bold">A</span>
                      <ChevronDown className="w-2.5 h-2.5" />
                    </button>
                    {textColorOpen && (
                      <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-xl p-2 z-50 w-48">
                        <div className="text-[10px] text-gray-500 mb-1 font-bold">لوحة ألوان النص:</div>
                        <div className="grid grid-cols-6 gap-1">
                          {COLOR_PALETTE.map(c => (
                            <button
                              key={c}
                              onClick={() => {
                                onUpdateStyle('color', c);
                                setTextColorOpen(false);
                              }}
                              className="w-5 h-5 rounded border border-gray-300 hover:scale-110 transition cursor-pointer"
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">الخط</div>
            </div>

            {/* Alignment Group */}
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2">
              <div className="space-y-1">
                {/* Vertical align */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onUpdateStyle('verticalAlign', 'top')}
                    className={`p-1 rounded ${currentCell?.verticalAlign === 'top' ? 'bg-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}
                    title="محاذاة لأعلى"
                  >
                    <span className="text-[11px] font-mono leading-none">↑</span>
                  </button>
                  <button
                    onClick={() => onUpdateStyle('verticalAlign', 'middle')}
                    className={`p-1 rounded ${currentCell?.verticalAlign === 'middle' || !currentCell?.verticalAlign ? 'bg-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}
                    title="محاذاة للوسط رأسياً"
                  >
                    <span className="text-[11px] font-mono leading-none">↕</span>
                  </button>
                  <button
                    onClick={() => onUpdateStyle('verticalAlign', 'bottom')}
                    className={`p-1 rounded ${currentCell?.verticalAlign === 'bottom' ? 'bg-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}
                    title="محاذاة لأسفل"
                  >
                    <span className="text-[11px] font-mono leading-none">↓</span>
                  </button>

                  <div className="h-4 w-[1px] bg-gray-200 mx-0.5" />

                  <button
                    onClick={() => onUpdateStyle('wrapText', !currentCell?.wrapText)}
                    className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] ${
                      currentCell?.wrapText ? 'bg-emerald-100 text-emerald-800 font-bold' : 'hover:bg-gray-100 text-gray-700'
                    }`}
                    title="التفاف النص داخل الخلية"
                  >
                    <WrapText className="w-3.5 h-3.5" />
                    <span>التفاف النص</span>
                  </button>
                </div>

                {/* Horizontal align */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onUpdateStyle('align', 'right')}
                    className={`p-1 rounded ${currentCell?.align === 'right' ? 'bg-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}
                    title="محاذاة لليمين"
                  >
                    <AlignRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onUpdateStyle('align', 'center')}
                    className={`p-1 rounded ${currentCell?.align === 'center' ? 'bg-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}
                    title="محاذاة للوسط"
                  >
                    <AlignCenter className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onUpdateStyle('align', 'left')}
                    className={`p-1 rounded ${currentCell?.align === 'left' ? 'bg-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}
                    title="محاذاة لليسار"
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                  </button>

                  <div className="h-4 w-[1px] bg-gray-200 mx-0.5" />

                  <button
                    onClick={() => {
                      // Merge & center toggle
                      if (currentCell?.isMergeParent) {
                        onUpdateStyle('isMergeParent', false);
                      } else {
                        onUpdateStyle('isMergeParent', true);
                        onUpdateStyle('mergeColSpan', 2);
                        onUpdateStyle('mergeRowSpan', 1);
                        onUpdateStyle('align', 'center');
                      }
                    }}
                    className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] ${
                      currentCell?.isMergeParent ? 'bg-emerald-100 text-emerald-800 font-bold' : 'hover:bg-gray-100 text-gray-700'
                    }`}
                    title="دمج وتوسيط الخلايا"
                  >
                    <Merge className="w-3.5 h-3.5" />
                    <span>دمج وتوسيط</span>
                  </button>
                </div>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">المحاذاة</div>
            </div>

            {/* Number Group */}
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2">
              <div className="space-y-1">
                <select
                  value={currentCell?.format || 'general'}
                  onChange={e => onUpdateStyle('format', e.target.value as any)}
                  className="border border-gray-300 rounded px-1.5 py-0.5 text-[11px] bg-white outline-none w-28"
                >
                  <option value="general">عام (General)</option>
                  <option value="number">رقم (Number)</option>
                  <option value="currency">عملة (ر.س)</option>
                  <option value="percent">نسبة مئوية (%)</option>
                  <option value="date">تاريخ (Date)</option>
                  <option value="text">نص (Text)</option>
                </select>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onUpdateStyle('format', 'currency')}
                    className="px-1.5 py-0.5 hover:bg-gray-100 rounded text-gray-700 font-bold text-xs"
                    title="تنسيق العملة (ر.س)"
                  >
                    ر.س
                  </button>
                  <button
                    onClick={() => onUpdateStyle('format', 'percent')}
                    className="p-1 hover:bg-gray-100 rounded text-gray-700"
                    title="تنسيق النسبة المئوية (%)"
                  >
                    <Percent className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => {
                      const curDecimals = currentCell?.decimalPlaces !== undefined ? currentCell.decimalPlaces : 2;
                      onUpdateStyle('decimalPlaces', curDecimals + 1);
                    }}
                    className="px-1 py-0.5 hover:bg-gray-100 rounded text-gray-700 font-mono text-[10px]"
                    title="زيادة المنازل العشرية"
                  >
                    .00→
                  </button>
                  <button
                    onClick={() => {
                      const curDecimals = currentCell?.decimalPlaces !== undefined ? currentCell.decimalPlaces : 2;
                      onUpdateStyle('decimalPlaces', Math.max(0, curDecimals - 1));
                    }}
                    className="px-1 py-0.5 hover:bg-gray-100 rounded text-gray-700 font-mono text-[10px]"
                    title="إنقاص المنازل العشرية"
                  >
                    ←.0
                  </button>
                </div>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">الرقم</div>
            </div>

            {/* Styles Group */}
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={onOpenConditionalFormatting}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-emerald-50 rounded cursor-pointer text-gray-700 hover:text-[#107c41]"
                  title="تنسيق شرطي"
                >
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span className="text-[10px] font-semibold mt-0.5">تنسيق شرطي</span>
                </button>

                <button
                  onClick={onCreateTable}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-emerald-50 rounded cursor-pointer text-gray-700 hover:text-[#107c41]"
                  title="تنسيق كجدول رسمي"
                >
                  <TableIcon className="w-4 h-4 text-blue-600" />
                  <span className="text-[10px] font-semibold mt-0.5">تنسيق كجدول</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">الأنماط</div>
            </div>

            {/* Cells Group */}
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2">
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <button
                    onClick={onInsertRow}
                    className="px-1.5 py-0.5 bg-gray-50 hover:bg-emerald-50 border border-gray-200 rounded text-[10px] font-medium text-gray-700 flex items-center gap-1"
                    title="إدراج صف جديد"
                  >
                    <Plus className="w-3 h-3 text-emerald-600" />
                    <span>إدراج صف</span>
                  </button>
                  <button
                    onClick={onInsertColumn}
                    className="px-1.5 py-0.5 bg-gray-50 hover:bg-emerald-50 border border-gray-200 rounded text-[10px] font-medium text-gray-700 flex items-center gap-1"
                    title="إدراج عمود جديد"
                  >
                    <Plus className="w-3 h-3 text-emerald-600" />
                    <span>إدراج عمود</span>
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={onDeleteRow}
                    className="px-1.5 py-0.5 bg-gray-50 hover:bg-red-50 border border-gray-200 rounded text-[10px] font-medium text-red-700 flex items-center gap-1"
                    title="حذف الصف الحالي"
                  >
                    <Trash2 className="w-3 h-3 text-red-500" />
                    <span>حذف صف</span>
                  </button>
                  <button
                    onClick={onDeleteColumn}
                    className="px-1.5 py-0.5 bg-gray-50 hover:bg-red-50 border border-gray-200 rounded text-[10px] font-medium text-red-700 flex items-center gap-1"
                    title="حذف العمود الحالي"
                  >
                    <Trash2 className="w-3 h-3 text-red-500" />
                    <span>حذف عمود</span>
                  </button>
                </div>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">خلايا</div>
            </div>

            {/* Editing Group */}
            <div className="flex flex-col justify-between">
              <div className="flex items-center gap-1">
                {/* AutoSum */}
                <div className="relative">
                  <button
                    onClick={() => onAutoSum('SUM')}
                    className="flex flex-col items-center justify-center p-1.5 hover:bg-emerald-50 rounded cursor-pointer text-gray-700 hover:text-[#107c41]"
                    title="جمع تلقائي (AutoSum)"
                  >
                    <span className="font-serif font-bold text-sm text-[#107c41]">∑</span>
                    <span className="text-[10px] font-semibold">مجموع تلقائي</span>
                  </button>
                  <button
                    onClick={() => setAutoSumMenuOpen(!autoSumMenuOpen)}
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 p-0.5 hover:bg-gray-200 rounded text-gray-500"
                  >
                    <ChevronDown className="w-2.5 h-2.5" />
                  </button>
                  {autoSumMenuOpen && (
                    <div className="absolute top-full right-0 mt-1 bg-white border border-gray-300 rounded shadow-xl py-1 z-50 w-36 text-right">
                      <button
                        onClick={() => { onAutoSum('SUM'); setAutoSumMenuOpen(false); }}
                        className="w-full px-3 py-1 text-right hover:bg-emerald-50 text-[11px] block font-bold"
                      >
                        المجموع (SUM)
                      </button>
                      <button
                        onClick={() => { onAutoSum('AVERAGE'); setAutoSumMenuOpen(false); }}
                        className="w-full px-3 py-1 text-right hover:bg-emerald-50 text-[11px] block"
                      >
                        المتوسط (AVERAGE)
                      </button>
                      <button
                        onClick={() => { onAutoSum('COUNT'); setAutoSumMenuOpen(false); }}
                        className="w-full px-3 py-1 text-right hover:bg-emerald-50 text-[11px] block"
                      >
                        عدد الأرقام (COUNT)
                      </button>
                      <button
                        onClick={() => { onAutoSum('MAX'); setAutoSumMenuOpen(false); }}
                        className="w-full px-3 py-1 text-right hover:bg-emerald-50 text-[11px] block"
                      >
                        الحد الأقصى (MAX)
                      </button>
                      <button
                        onClick={() => { onAutoSum('MIN'); setAutoSumMenuOpen(false); }}
                        className="w-full px-3 py-1 text-right hover:bg-emerald-50 text-[11px] block"
                      >
                        الحد الأدنى (MIN)
                      </button>
                    </div>
                  )}
                </div>

                {/* Sort & Filter */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onSort('asc')}
                      className="p-1 hover:bg-gray-100 rounded text-gray-700 flex items-center gap-0.5 text-[10px]"
                      title="فرز من أ إلى ي (تصاعدي)"
                    >
                      <ArrowUpDown className="w-3 h-3 text-blue-600" />
                      <span>أ←ي</span>
                    </button>
                    <button
                      onClick={() => onSort('desc')}
                      className="p-1 hover:bg-gray-100 rounded text-gray-700 flex items-center gap-0.5 text-[10px]"
                      title="فرز من ي إلى أ (تنازلي)"
                    >
                      <ArrowUpDown className="w-3 h-3 text-blue-600 rotate-180" />
                      <span>ي←أ</span>
                    </button>
                  </div>
                  <button
                    onClick={onToggleFilter}
                    className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] border ${
                      isFilterActive ? 'bg-blue-100 border-blue-400 text-blue-900 font-bold' : 'border-gray-200 hover:bg-gray-100 text-gray-700'
                    }`}
                    title="تصفية البيانات (AutoFilter)"
                  >
                    <Filter className="w-3 h-3 text-blue-600" />
                    <span>تصفية</span>
                  </button>
                </div>

                {/* Clear & Search */}
                <div className="flex flex-col gap-1">
                  <button
                    onClick={onOpenFindReplace}
                    className="p-1 hover:bg-gray-100 rounded text-gray-700 flex items-center gap-1 text-[10px]"
                    title="بحث واستبدال (Ctrl+F)"
                  >
                    <Search className="w-3.5 h-3.5 text-gray-600" />
                    <span>بحث</span>
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => setClearMenuOpen(!clearMenuOpen)}
                      className="p-1 hover:bg-gray-100 rounded text-gray-700 flex items-center gap-1 text-[10px]"
                      title="مسح"
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                      <span>مسح</span>
                      <ChevronDown className="w-2.5 h-2.5" />
                    </button>
                    {clearMenuOpen && (
                      <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-xl py-1 z-50 w-36 text-right">
                        <button
                          onClick={() => { onClearAll(); setClearMenuOpen(false); }}
                          className="w-full px-3 py-1 text-right hover:bg-red-50 text-[11px] block text-red-700 font-bold"
                        >
                          مسح الكل
                        </button>
                        <button
                          onClick={() => { onClearFormatting(); setClearMenuOpen(false); }}
                          className="w-full px-3 py-1 text-right hover:bg-gray-100 text-[11px] block"
                        >
                          مسح التنسيقات فقط
                        </button>
                        <button
                          onClick={() => { onClearContents(); setClearMenuOpen(false); }}
                          className="w-full px-3 py-1 text-right hover:bg-gray-100 text-[11px] block"
                        >
                          مسح المحتويات فقط
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">تحرير</div>
            </div>
          </div>
        )}

        {/* ===================== INSERT TAB ===================== */}
        {activeTab === 'insert' && (
          <div className="flex items-stretch gap-2.5">
            {/* Tables Group */}
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onOpenPivotTable}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-emerald-50 rounded cursor-pointer text-gray-700 hover:text-[#107c41]"
                  title="إنشاء جدول محوري PivotTable لتلخيص وتحليل البيانات المعقدة"
                >
                  <TableIcon className="w-5 h-5 text-purple-700" />
                  <span className="text-[10px] font-semibold mt-0.5">جدول محوري</span>
                  <span className="text-[8px] text-gray-400">PivotTable</span>
                </button>

                <button
                  onClick={onCreateTable}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-emerald-50 rounded cursor-pointer text-gray-700 hover:text-[#107c41]"
                  title="إنشاء جدول بيانات رسمي (Alt + T / Ctrl + T)"
                >
                  <TableIcon className="w-5 h-5 text-[#107c41]" />
                  <span className="text-[10px] font-semibold mt-0.5">جدول بيانات</span>
                  <span className="text-[8px] text-gray-400">Table (Alt+T)</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">جداول</div>
            </div>

            {/* Charts Group */}
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onOpenChartModal()}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-emerald-50 rounded cursor-pointer text-gray-700 hover:text-[#107c41]"
                  title="رسوم بيانية موصى بها مع كامل الأنواع (عمودي، دائري، خطي، مساحي...)"
                >
                  <BarChart2 className="w-5 h-5 text-blue-600" />
                  <span className="text-[10px] font-semibold mt-0.5">مخططات بيانية</span>
                  <span className="text-[8px] text-gray-400">Recommended Charts</span>
                </button>

                <div className="flex flex-col gap-1 justify-center">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onOpenChartModal('column')}
                      className="p-1 hover:bg-gray-100 rounded text-gray-700"
                      title="مخطط عمودي"
                    >
                      <BarChart2 className="w-3.5 h-3.5 text-blue-600" />
                    </button>
                    <button
                      onClick={() => onOpenChartModal('line')}
                      className="p-1 hover:bg-gray-100 rounded text-gray-700"
                      title="مخطط خطي"
                    >
                      <LineChart className="w-3.5 h-3.5 text-emerald-600" />
                    </button>
                    <button
                      onClick={() => onOpenChartModal('pie')}
                      className="p-1 hover:bg-gray-100 rounded text-gray-700"
                      title="مخطط دائري"
                    >
                      <PieChart className="w-3.5 h-3.5 text-amber-600" />
                    </button>
                  </div>
                  <div className="text-[10px] text-gray-500 font-mono text-center">عمودي | خطي | دائري</div>
                </div>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">رسوم بيانية</div>
            </div>

            {/* Sparklines Group */}
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onInsertSparkline('line')}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-emerald-50 rounded cursor-pointer text-gray-700 hover:text-[#107c41]"
                  title="إدراج خط سباركلاين مصغر داخل الخلية (Line Sparkline)"
                >
                  <LineChart className="w-4 h-4 text-emerald-600" />
                  <span className="text-[10px] font-semibold mt-0.5">سباركلاين خطي</span>
                </button>

                <button
                  onClick={() => onInsertSparkline('bar')}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-emerald-50 rounded cursor-pointer text-gray-700 hover:text-[#107c41]"
                  title="إدراج أعمدة سباركلاين مصغرة داخل الخلية (Bar Sparkline)"
                >
                  <BarChart2 className="w-4 h-4 text-blue-600" />
                  <span className="text-[10px] font-semibold mt-0.5">سباركلاين أعمدة</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">خطوط سباركلاين</div>
            </div>

            {/* Illustrations & Text */}
            <div className="flex flex-col justify-between">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onInsertImage}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-emerald-50 rounded cursor-pointer text-gray-700 hover:text-[#107c41]"
                  title="إدراج صورة في ورقة العمل"
                >
                  <ImageIcon className="w-5 h-5 text-emerald-600" />
                  <span className="text-[10px] font-semibold mt-0.5">إدراج صورة</span>
                </button>

                <button
                  onClick={onAddComment}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-emerald-50 rounded cursor-pointer text-gray-700 hover:text-[#107c41]"
                  title="إضافة تعليق للخلية النشطة"
                >
                  <MessageSquare className="w-5 h-5 text-amber-600" />
                  <span className="text-[10px] font-semibold mt-0.5">إضافة تعليق</span>
                </button>

                <button
                  onClick={onOpenInsertFunction}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-emerald-50 rounded cursor-pointer text-gray-700 hover:text-[#107c41]"
                  title="إدراج معادلة أو رمز رياضي"
                >
                  <FunctionSquare className="w-5 h-5 text-purple-600" />
                  <span className="text-[10px] font-semibold mt-0.5">دالة رياضية</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">عناصر وتوضيحات</div>
            </div>
          </div>
        )}

        {/* ===================== PAGE LAYOUT TAB ===================== */}
        {activeTab === 'layout' && (
          <div className="flex items-stretch gap-2.5">
            {/* Page Setup */}
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert('تم ضبط الهوامش على الوضع الافتراضي (عادي: 0.75 بوصة).')}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-emerald-50 rounded cursor-pointer text-gray-700 hover:text-[#107c41]"
                >
                  <span className="text-base">📐</span>
                  <span className="text-[10px] font-semibold mt-0.5">الهوامش</span>
                </button>

                <button
                  onClick={() => alert('تم ضبط اتجاه الورقة على الوضع الأفقي (Landscape) للطباعة.')}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-emerald-50 rounded cursor-pointer text-gray-700 hover:text-[#107c41]"
                >
                  <span className="text-base">🔄</span>
                  <span className="text-[10px] font-semibold mt-0.5">الاتجاه</span>
                </button>

                <button
                  onClick={() => alert('تم ضبط حجم الورق على A4 القياسي.')}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-emerald-50 rounded cursor-pointer text-gray-700 hover:text-[#107c41]"
                >
                  <span className="text-base">📄</span>
                  <span className="text-[10px] font-semibold mt-0.5">الحجم (A4)</span>
                </button>

                <button
                  onClick={onToggleRTL}
                  className={`flex flex-col items-center justify-center p-1.5 rounded cursor-pointer border ${
                    isRTL ? 'bg-emerald-50 border-emerald-300 text-[#107c41] font-bold' : 'border-transparent hover:bg-gray-100 text-gray-700'
                  }`}
                  title="تغيير اتجاه ورقة العمل بالكامل (يمين لليسار / يسار لليمين)"
                >
                  <SplitSquareVertical className="w-4 h-4 text-emerald-600" />
                  <span className="text-[10px] font-semibold mt-0.5">
                    {isRTL ? 'ورقة من اليمين لليسار' : 'ورقة من اليسار لليمين'}
                  </span>
                </button>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">إعداد الصفحة</div>
            </div>

            {/* Sheet Options */}
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2">
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 cursor-pointer text-gray-700">
                  <input
                    type="checkbox"
                    checked={showGridlines}
                    onChange={onToggleGridlines}
                    className="rounded text-[#107c41]"
                  />
                  <span>إظهار خطوط الشبكة</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-gray-700">
                  <input
                    type="checkbox"
                    checked={showHeadings}
                    onChange={onToggleHeadings}
                    className="rounded text-[#107c41]"
                  />
                  <span>إظهار عناوين الأعمدة والصفوف</span>
                </label>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">خيارات الورقة</div>
            </div>

            {/* Print */}
            <div className="flex flex-col justify-between">
              <button
                onClick={() => window.print()}
                className="flex flex-col items-center justify-center p-1.5 hover:bg-emerald-50 rounded cursor-pointer text-gray-700 hover:text-[#107c41]"
                title="طباعة ورقة العمل المحددة"
              >
                <span className="text-base">🖨️</span>
                <span className="text-[10px] font-semibold mt-0.5">طباعة الورقة</span>
              </button>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">طباعة وترتيب</div>
            </div>
          </div>
        )}

        {/* ===================== FORMULAS TAB ===================== */}
        {activeTab === 'formulas' && (
          <div className="flex items-stretch gap-2.5">
            {/* Function Library */}
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onOpenInsertFunction}
                  className="flex flex-col items-center justify-center p-1.5 bg-emerald-50 hover:bg-emerald-100 rounded cursor-pointer text-[#107c41] font-bold border border-emerald-200"
                  title="إدراج دالة رياضية من مكتبة دوال Excel (Shift+F3)"
                >
                  <span className="font-serif italic font-black text-sm">fx</span>
                  <span className="text-[10px] mt-0.5">إدراج دالة</span>
                </button>

                <div className="grid grid-cols-3 gap-1">
                  <button
                    onClick={() => onAutoSum('SUM')}
                    className="px-2 py-1 bg-gray-50 hover:bg-gray-100 rounded text-[10px] font-semibold text-gray-700 text-center"
                    title="دوال رياضيات: SUM, ROUND, ABS, SQRT"
                  >
                    رياضيات (SUM)
                  </button>
                  <button
                    onClick={() => onOpenInsertFunction()}
                    className="px-2 py-1 bg-gray-50 hover:bg-gray-100 rounded text-[10px] font-semibold text-gray-700 text-center"
                    title="دوال منطقية: IF, IFERROR, AND, OR"
                  >
                    منطقية (IF)
                  </button>
                  <button
                    onClick={() => onOpenInsertFunction()}
                    className="px-2 py-1 bg-gray-50 hover:bg-gray-100 rounded text-[10px] font-semibold text-gray-700 text-center"
                    title="دوال بحث ومراجع: VLOOKUP, XLOOKUP, INDEX, MATCH"
                  >
                    بحث (VLOOKUP)
                  </button>
                  <button
                    onClick={() => onOpenInsertFunction()}
                    className="px-2 py-1 bg-gray-50 hover:bg-gray-100 rounded text-[10px] font-semibold text-gray-700 text-center"
                    title="دوال مالية: PMT, FV, PV, RATE, NPER"
                  >
                    مالية (PMT)
                  </button>
                  <button
                    onClick={() => onOpenInsertFunction()}
                    className="px-2 py-1 bg-gray-50 hover:bg-gray-100 rounded text-[10px] font-semibold text-gray-700 text-center"
                    title="دوال نصوص: CONCAT, UPPER, LOWER, TRIM"
                  >
                    نصية (CONCAT)
                  </button>
                  <button
                    onClick={() => onOpenInsertFunction()}
                    className="px-2 py-1 bg-gray-50 hover:bg-gray-100 rounded text-[10px] font-semibold text-gray-700 text-center"
                    title="دوال تاريخ: TODAY, NOW, DATE"
                  >
                    تاريخ ووقت
                  </button>
                </div>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">مكتبة الدوال</div>
            </div>

            {/* Defined Names */}
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2">
              <button
                onClick={onOpenNameManager}
                className="flex flex-col items-center justify-center p-1.5 hover:bg-emerald-50 rounded cursor-pointer text-gray-700 hover:text-[#107c41]"
                title="مدير الأسماء (Name Manager) لتعريف وإدارة أسماء النطاقات"
              >
                <TableIcon className="w-5 h-5 text-emerald-600" />
                <span className="text-[10px] font-semibold mt-0.5">مدير الأسماء</span>
                <span className="text-[8px] text-gray-400">Name Manager</span>
              </button>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">أسماء معرفة</div>
            </div>

            {/* Formula Auditing */}
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2">
              <div className="space-y-1">
                <button
                  onClick={onToggleShowFormulas}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-medium border ${
                    showFormulasMode ? 'bg-amber-100 border-amber-400 text-amber-900 font-bold' : 'border-transparent hover:bg-gray-100 text-gray-700'
                  }`}
                  title="إظهار الصيغ بدلاً من القيم المحسوبة في ورقة العمل"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-700" />
                  <span>إظهار الصيغ</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">تدقيق الصيغ</div>
            </div>

            {/* Calculation */}
            <div className="flex flex-col justify-between">
              <button
                onClick={onRecalculateAll}
                className="flex flex-col items-center justify-center p-1.5 hover:bg-emerald-50 rounded cursor-pointer text-gray-700 hover:text-[#107c41]"
                title="إعادة حساب كافة المعادلات والصيغ في جميع أوراق العمل الآن (F9)"
              >
                <Play className="w-5 h-5 text-emerald-600" />
                <span className="text-[10px] font-semibold mt-0.5">حساب الآن</span>
                <span className="text-[8px] text-gray-400">(F9) Calculate</span>
              </button>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">حساب</div>
            </div>
          </div>
        )}

        {/* ===================== DATA TAB ===================== */}
        {activeTab === 'data' && (
          <div className="flex items-stretch gap-2.5">
            {/* Sort & Filter */}
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onSort('asc')}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-emerald-50 rounded cursor-pointer text-gray-700 hover:text-[#107c41]"
                  title="فرز تصاعدي"
                >
                  <ArrowUpDown className="w-4 h-4 text-blue-600" />
                  <span className="text-[10px] font-semibold mt-0.5">فرز أ ← ي</span>
                </button>

                <button
                  onClick={() => onSort('desc')}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-emerald-50 rounded cursor-pointer text-gray-700 hover:text-[#107c41]"
                  title="فرز تنازلي"
                >
                  <ArrowUpDown className="w-4 h-4 text-blue-600 rotate-180" />
                  <span className="text-[10px] font-semibold mt-0.5">فرز ي ← أ</span>
                </button>

                <button
                  onClick={onToggleFilter}
                  className={`flex flex-col items-center justify-center p-1.5 rounded cursor-pointer border ${
                    isFilterActive ? 'bg-blue-100 border-blue-400 text-blue-900 font-bold' : 'border-transparent hover:bg-gray-100 text-gray-700'
                  }`}
                  title="تصفية البيانات"
                >
                  <Filter className="w-4 h-4 text-blue-600" />
                  <span className="text-[10px] font-semibold mt-0.5">تصفية</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">فرز وتصفية</div>
            </div>

            {/* Data Tools */}
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onOpenTextToColumns}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-emerald-50 rounded cursor-pointer text-gray-700 hover:text-[#107c41]"
                  title="تحويل النص إلى أعمدة (Text to Columns)"
                >
                  <Columns className="w-4 h-4 text-emerald-600" />
                  <span className="text-[10px] font-semibold mt-0.5">نص إلى أعمدة</span>
                </button>

                <button
                  onClick={onOpenRemoveDuplicates}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-emerald-50 rounded cursor-pointer text-gray-700 hover:text-[#107c41]"
                  title="إزالة الصفوف المكررة (Remove Duplicates)"
                >
                  <Copy className="w-4 h-4 text-amber-600" />
                  <span className="text-[10px] font-semibold mt-0.5">إزالة التكرارات</span>
                </button>

                <button
                  onClick={onOpenDataValidation}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-emerald-50 rounded cursor-pointer text-gray-700 hover:text-[#107c41]"
                  title="التحقق من صحة البيانات وقوائم الاختيار المنسدلة (Data Validation)"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-[10px] font-semibold mt-0.5">صحة البيانات</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">أدوات البيانات</div>
            </div>

            {/* Forecast & What-If */}
            <div className="flex flex-col justify-between">
              <button
                onClick={onOpenGoalSeek}
                className="flex flex-col items-center justify-center p-1.5 hover:bg-emerald-50 rounded cursor-pointer text-gray-700 hover:text-[#107c41]"
                title="تحليل ماذا لو واسترجاع القيمة المستهدفة (Goal Seek / What-If Analysis)"
              >
                <Target className="w-5 h-5 text-purple-700" />
                <span className="text-[10px] font-semibold mt-0.5">تحليل ماذا لو</span>
                <span className="text-[8px] text-gray-400">Goal Seek</span>
              </button>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">التنبؤ والمخطط التفصيلي</div>
            </div>
          </div>
        )}

        {/* ===================== REVIEW TAB ===================== */}
        {activeTab === 'review' && (
          <div className="flex items-stretch gap-2.5">
            {/* Proofing */}
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2">
              <button
                onClick={onOpenSpellCheck}
                className="flex flex-col items-center justify-center p-1.5 hover:bg-emerald-50 rounded cursor-pointer text-gray-700 hover:text-[#107c41]"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="text-[10px] font-semibold mt-0.5">تدقيق إملائي</span>
              </button>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">تدقيق ولغة</div>
            </div>

            {/* Comments */}
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onAddComment}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-emerald-50 rounded cursor-pointer text-gray-700 hover:text-[#107c41]"
                >
                  <MessageSquare className="w-5 h-5 text-amber-600" />
                  <span className="text-[10px] font-semibold mt-0.5">تعليق جديد</span>
                </button>
                <button
                  onClick={onDeleteComment}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-red-50 rounded cursor-pointer text-gray-700 hover:text-red-600"
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                  <span className="text-[10px] font-semibold mt-0.5">حذف التعليق</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">تعليقات وملاحظات</div>
            </div>

            {/* Protect */}
            <div className="flex flex-col justify-between">
              <button
                onClick={onOpenProtectSheet}
                className="flex flex-col items-center justify-center p-1.5 hover:bg-emerald-50 rounded cursor-pointer text-gray-700 hover:text-[#107c41]"
                title="حماية ورقة العمل بكلمة مرور"
              >
                {isSheetProtected ? (
                  <Lock className="w-5 h-5 text-red-600" />
                ) : (
                  <Unlock className="w-5 h-5 text-emerald-600" />
                )}
                <span className="text-[10px] font-semibold mt-0.5">
                  {isSheetProtected ? 'الورقة محمية' : 'حماية الورقة'}
                </span>
              </button>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">حماية ومشاركة</div>
            </div>
          </div>
        )}

        {/* ===================== VIEW TAB ===================== */}
        {activeTab === 'view' && (
          <div className="flex items-stretch gap-2.5">
            {/* Show / Hide */}
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2">
              <div className="space-y-1">
                <label className="flex items-center gap-1.5 cursor-pointer text-gray-700">
                  <input
                    type="checkbox"
                    checked={showFormulaBar}
                    onChange={onToggleFormulaBar}
                    className="rounded text-[#107c41]"
                  />
                  <span>شريط الصيغة (Formula Bar)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-gray-700">
                  <input
                    type="checkbox"
                    checked={showGridlines}
                    onChange={onToggleGridlines}
                    className="rounded text-[#107c41]"
                  />
                  <span>خطوط الشبكة (Gridlines)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-gray-700">
                  <input
                    type="checkbox"
                    checked={showHeadings}
                    onChange={onToggleHeadings}
                    className="rounded text-[#107c41]"
                  />
                  <span>عناوين الصفوف والأعمدة</span>
                </label>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">إظهار</div>
            </div>

            {/* Zoom */}
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onSetZoomLevel(100)}
                  className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded font-mono text-[11px] font-bold"
                >
                  100%
                </button>
                <button
                  onClick={() => onSetZoomLevel(Math.min(200, zoomLevel + 10))}
                  className="p-1 hover:bg-gray-100 rounded text-gray-700"
                  title="تكبير"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onSetZoomLevel(Math.max(50, zoomLevel - 10))}
                  className="p-1 hover:bg-gray-100 rounded text-gray-700"
                  title="تصغير"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">تكبير / تصغير</div>
            </div>

            {/* Freeze Panes */}
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2">
              <div className="relative">
                <button
                  onClick={() => setFreezeMenuOpen(!freezeMenuOpen)}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-emerald-50 rounded cursor-pointer text-gray-700 hover:text-[#107c41]"
                  title="تجميد الأجزاء لمنع تحرك الصفوف أو الأعمدة أثناء التمرير"
                >
                  <Layers className="w-5 h-5 text-blue-600" />
                  <span className="text-[10px] font-semibold mt-0.5">تجميد الأجزاء</span>
                  <span className="text-[8px] text-gray-400">Freeze Panes</span>
                </button>
                {freezeMenuOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-xl py-1 z-50 w-44 text-right">
                    <button
                      onClick={() => { onSetFreezePanes('topRow'); setFreezeMenuOpen(false); }}
                      className="w-full px-3 py-1.5 text-right hover:bg-emerald-50 text-[11px] block"
                    >
                      تجميد الصف العلوي
                    </button>
                    <button
                      onClick={() => { onSetFreezePanes('firstCol'); setFreezeMenuOpen(false); }}
                      className="w-full px-3 py-1.5 text-right hover:bg-emerald-50 text-[11px] block"
                    >
                      تجميد العمود الأول
                    </button>
                    <button
                      onClick={() => { onSetFreezePanes('selection'); setFreezeMenuOpen(false); }}
                      className="w-full px-3 py-1.5 text-right hover:bg-emerald-50 text-[11px] block"
                    >
                      تجميد عند الخلية المحددة
                    </button>
                    <button
                      onClick={() => { onSetFreezePanes('none'); setFreezeMenuOpen(false); }}
                      className="w-full px-3 py-1.5 text-right hover:bg-gray-100 text-[11px] block text-red-600 font-bold"
                    >
                      إلغاء تجميد الأجزاء
                    </button>
                  </div>
                )}
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">تجميد النوافذ</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
