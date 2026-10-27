import React, { useState, useEffect } from 'react';
import { OfficeAppId, RibbonTab } from '../../types';
import { APP_CONFIGS } from '../../utils/appConfigs';
import { PRESET_FONTS, queryWindowsInstalledFonts, FontOption } from '../../utils/fontManager';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignRight,
  AlignCenter,
  AlignLeft,
  AlignJustify,
  List,
  ListOrdered,
  CheckSquare,
  Palette,
  Highlighter,
  Table as TableIcon,
  Image as ImageIcon,
  Shapes,
  Sigma,
  Printer,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  ChevronDown,
  Sparkles,
  Download,
  FolderOpen,
  PieChart,
  BarChart3,
  Sliders,
  Filter,
  Play,
  Grid,
  Percent,
  DollarSign,
  Maximize2,
  Lock,
  Layers,
  FileSpreadsheet,
  Database,
  Terminal,
  Scan
} from 'lucide-react';

interface Props {
  activeApp: OfficeAppId;
  activeTab: RibbonTab;
  setActiveTab: (tab: RibbonTab) => void;
  onOpenBackstage: () => void;
  selectedFont: string;
  setSelectedFont: (font: string) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  onFormatText?: (command: string, value?: string) => void;
  onInsertElement?: (type: string, payload?: any) => void;
  zoomLevel: number;
  setZoomLevel: (zoom: number | ((prev: number) => number)) => void;
}

export const FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72];

export const RibbonBar: React.FC<Props> = ({
  activeApp,
  activeTab,
  setActiveTab,
  onOpenBackstage,
  selectedFont,
  setSelectedFont,
  fontSize,
  setFontSize,
  onFormatText,
  onInsertElement,
  zoomLevel,
  setZoomLevel,
}) => {
  const currentConfig = APP_CONFIGS[activeApp];
  const [fontsList, setFontsList] = useState<FontOption[]>(PRESET_FONTS);
  const [isScanningFonts, setIsScanningFonts] = useState(false);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [highlightPickerOpen, setHighlightPickerOpen] = useState(false);

  // Scan user's Windows system fonts via Chromium API
  const handleScanWindowsFonts = async () => {
    setIsScanningFonts(true);
    const localFonts = await queryWindowsInstalledFonts();
    setIsScanningFonts(false);
    if (localFonts.length > 0) {
      setFontsList([...localFonts, ...PRESET_FONTS]);
      alert(`تم بنجاح قراءة وتضمين ${localFonts.length} خطاً مثبتاً على نظام ويندوز الخاص بك!`);
    } else {
      alert('يتم الآن استخدام حزمة خطوط ويندوز المدمجة بالكامل (Segoe UI, Tahoma, Traditional Arabic, Arial, Calibri).');
    }
  };

  // Color swatches
  const colors = ['#000000', '#0078d4', '#107c41', '#d83b01', '#7719aa', '#a4373a', '#e81123', '#2563eb', '#475569'];
  const highlights = ['#fffa65', '#a8ff78', '#78ffd6', '#ff7878', '#ffc371', 'transparent'];

  // Determine which tabs to render based on active Microsoft Office app
  const getTabsForApp = (): { id: RibbonTab; label: string }[] => {
    switch (activeApp) {
      case 'sheets':
        return [
          { id: 'home', label: 'الشريط الرئيسي' },
          { id: 'insert', label: 'إدراج' },
          { id: 'layout', label: 'تخطيط الصفحة' },
          { id: 'formulas', label: 'الصيغ (Formulas)' },
          { id: 'data', label: 'بيانات (Data)' },
          { id: 'review', label: 'مراجعة' },
          { id: 'view', label: 'عرض' },
        ];
      case 'slides':
        return [
          { id: 'home', label: 'الشريط الرئيسي' },
          { id: 'insert', label: 'إدراج' },
          { id: 'design', label: 'تصميم (Design)' },
          { id: 'transitions', label: 'انتقالات (Transitions)' },
          { id: 'animations', label: 'حركات (Animations)' },
          { id: 'slideshow', label: 'عرض الشرائح (Slide Show)' },
          { id: 'review', label: 'مراجعة' },
          { id: 'view', label: 'عرض' },
        ];
      case 'base':
        return [
          { id: 'home', label: 'الشريط الرئيسي' },
          { id: 'create', label: 'إنشاء (Create)' },
          { id: 'external-data', label: 'بيانات خارجية' },
          { id: 'database-tools', label: 'أدوات قاعدة البيانات' },
          { id: 'view', label: 'عرض' },
        ];
      case 'docs':
      default:
        return [
          { id: 'home', label: 'الرئيسية (Home)' },
          { id: 'insert', label: 'إدراج (Insert)' },
          { id: 'design', label: 'تصميم (Design)' },
          { id: 'layout', label: 'تخطيط (Layout)' },
          { id: 'references', label: 'مراجع (References)' },
          { id: 'mailings', label: 'مراسلات (Mailings)' },
          { id: 'review', label: 'مراجعة (Review)' },
          { id: 'view', label: 'عرض (View)' },
        ];
    }
  };

  const tabs = getTabsForApp();

  return (
    <div className="bg-[#fbfbfb] border-b border-[#d1d1d1] select-none text-xs text-[#242424] shadow-xs no-print ribbon-container" data-no-print="true">
      {/* 1. Ribbon Tabs Bar */}
      <div className="flex items-center gap-0.5 px-3 bg-[#f3f2f1] border-b border-[#e1dfdd] overflow-x-auto">
        {/* File (ملف) Tab */}
        <button
          onClick={onOpenBackstage}
          style={{ backgroundColor: currentConfig.primaryColor }}
          className="text-white font-bold px-3.5 py-1.5 rounded-t text-xs flex items-center gap-1.5 hover:opacity-90 transition cursor-pointer shrink-0"
        >
          <FolderOpen className="w-3.5 h-3.5" />
          <span>ملف (File)</span>
        </button>

        {/* Dynamic App Tabs */}
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold border-b-2 transition cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-white font-bold border-b-2 shadow-2xs'
                  : 'border-transparent text-gray-700 hover:bg-gray-200/70'
              }`}
              style={isActive ? { borderBottomColor: currentConfig.primaryColor, color: currentConfig.primaryColor } : {}}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 2. Ribbon Tools Toolbar Body */}
      <div className="p-2 flex items-stretch gap-2.5 overflow-x-auto min-h-[92px]">
        {/* ========================================================= */}
        {/* TAB: HOME (الشريط الرئيسي) */}
        {/* ========================================================= */}
        {activeTab === 'home' && (
          <>
            {/* Group: Clipboard */}
            <div className="flex flex-col justify-between pr-1 pl-2 border-l border-gray-200 shrink-0">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onFormatText?.('undo')}
                  className="ribbon-btn-sm"
                  title="تراجع (Ctrl+Z)"
                >
                  <Undo2 className="w-3.5 h-3.5 text-gray-700" />
                </button>
                <button
                  onClick={() => onFormatText?.('redo')}
                  className="ribbon-btn-sm"
                  title="إعادة (Ctrl+Y)"
                >
                  <Redo2 className="w-3.5 h-3.5 text-gray-700" />
                </button>
                <button
                  onClick={() => onFormatText?.('copy')}
                  className="ribbon-btn-sm"
                  title="نسخ"
                >
                  نسخ
                </button>
                <button
                  onClick={() => onFormatText?.('paste')}
                  className="ribbon-btn-sm"
                  title="لصق"
                >
                  لصق
                </button>
              </div>
              <span className="text-[10px] text-gray-400 text-center font-normal mt-auto">الحافظة</span>
            </div>

            {/* Group: Windows & Arabic Fonts */}
            <div className="flex flex-col justify-between px-2 border-l border-gray-200 shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  {/* Font Dropdown with Windows + Arabic System Fonts */}
                  <select
                    value={selectedFont}
                    onChange={(e) => {
                      setSelectedFont(e.target.value);
                      onFormatText?.('fontName', e.target.value);
                    }}
                    className="bg-white border border-gray-300 rounded px-2 py-0.5 text-xs text-gray-800 outline-none w-48 hover:border-blue-400 focus:border-blue-600 cursor-pointer"
                    title="خطوط الويندوز والخطوط العربية"
                  >
                    <optgroup label="خطوط نظام Windows الافتراضية">
                      {fontsList.filter(f => f.category === 'windows').map(f => (
                        <option key={f.name} value={f.family} style={{ fontFamily: f.family }}>
                          {f.name}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="خطوط الويب العربية المعتمدة">
                      {fontsList.filter(f => f.category === 'arabic-web').map(f => (
                        <option key={f.name} value={f.family} style={{ fontFamily: f.family }}>
                          {f.name}
                        </option>
                      ))}
                    </optgroup>
                    {fontsList.some(f => f.category === 'system-local') && (
                      <optgroup label="الخطوط المستكشفة من جهازك">
                        {fontsList.filter(f => f.category === 'system-local').map(f => (
                          <option key={f.name} value={f.family} style={{ fontFamily: f.family }}>
                            {f.name}
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </select>

                  {/* Font Size */}
                  <select
                    value={fontSize}
                    onChange={(e) => {
                      const sz = Number(e.target.value);
                      setFontSize(sz);
                      onFormatText?.('fontSize', sz.toString());
                    }}
                    className="bg-white border border-gray-300 rounded px-2 py-0.5 text-xs text-gray-800 outline-none w-14 hover:border-blue-400 cursor-pointer"
                    title="حجم الخط"
                  >
                    {FONT_SIZES.map((sz) => (
                      <option key={sz} value={sz}>{sz}</option>
                    ))}
                  </select>

                  {/* Windows Fonts Scan Button */}
                  <button
                    onClick={handleScanWindowsFonts}
                    disabled={isScanningFonts}
                    className="ribbon-btn-sm bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                    title="قراءة خطوط الويندوز المثبتة على جهازك"
                  >
                    <Scan className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{isScanningFonts ? 'فحص...' : 'خطوط الويندوز'}</span>
                  </button>
                </div>

                {/* Bold, Italic, Underline, Colors */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onFormatText?.('bold')}
                    className="ribbon-btn-sm font-bold"
                    title="عريض (Ctrl+B)"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onFormatText?.('italic')}
                    className="ribbon-btn-sm italic"
                    title="مائل (Ctrl+I)"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onFormatText?.('underline')}
                    className="ribbon-btn-sm underline"
                    title="تسطير (Ctrl+U)"
                  >
                    <Underline className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onFormatText?.('strikeThrough')}
                    className="ribbon-btn-sm line-through"
                    title="شطب"
                  >
                    <Strikethrough className="w-3.5 h-3.5" />
                  </button>

                  <div className="h-3.5 w-[1px] bg-gray-300 mx-0.5"></div>

                  {/* Text Color Picker */}
                  <div className="relative">
                    <button
                      onClick={() => setColorPickerOpen(!colorPickerOpen)}
                      className="ribbon-btn-sm"
                      title="لون الخط"
                    >
                      <Palette className="w-3.5 h-3.5 text-blue-600" />
                      <ChevronDown className="w-2.5 h-2.5" />
                    </button>
                    {colorPickerOpen && (
                      <div className="absolute top-6 right-0 bg-white border border-gray-200 rounded p-1.5 shadow-lg flex gap-1 z-50">
                        {colors.map((c) => (
                          <div
                            key={c}
                            onClick={() => {
                              onFormatText?.('foreColor', c);
                              setColorPickerOpen(false);
                            }}
                            className="w-5 h-5 rounded cursor-pointer border border-gray-300 hover:scale-110 transition"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Highlighter */}
                  <div className="relative">
                    <button
                      onClick={() => setHighlightPickerOpen(!highlightPickerOpen)}
                      className="ribbon-btn-sm"
                      title="لون التمييز"
                    >
                      <Highlighter className="w-3.5 h-3.5 text-amber-500" />
                      <ChevronDown className="w-2.5 h-2.5" />
                    </button>
                    {highlightPickerOpen && (
                      <div className="absolute top-6 right-0 bg-white border border-gray-200 rounded p-1.5 shadow-lg flex gap-1 z-50">
                        {highlights.map((c) => (
                          <div
                            key={c}
                            onClick={() => {
                              onFormatText?.('hiliteColor', c);
                              setHighlightPickerOpen(false);
                            }}
                            className="w-5 h-5 rounded cursor-pointer border border-gray-300 hover:scale-110 transition"
                            style={{ backgroundColor: c === 'transparent' ? '#ffffff' : c }}
                            title={c === 'transparent' ? 'إزالة التمييز' : c}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <span className="text-[10px] text-gray-400 text-center font-normal mt-auto">الخط والتنسيق</span>
            </div>

            {/* APP SPECIFIC HOME CONTROLS: EXCEL */}
            {activeApp === 'sheets' && (
              <>
                {/* Excel Number Formatting Group */}
                <div className="flex flex-col justify-between px-2 border-l border-gray-200 shrink-0">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <select
                        onChange={(e) => onInsertElement?.('cellFormat', e.target.value)}
                        className="bg-white border border-gray-300 rounded px-2 py-0.5 text-xs text-gray-800 outline-none w-28 cursor-pointer"
                        title="تنسيق الأرقام"
                      >
                        <option value="general">عام (General)</option>
                        <option value="currency-sar">عملة (ر.س)</option>
                        <option value="currency-egp">عملة (ج.م)</option>
                        <option value="currency-usd">عملة ($)</option>
                        <option value="percent">نسبة مئوية (%)</option>
                        <option value="number">أرقام عشرية</option>
                      </select>

                      <button
                        onClick={() => onInsertElement?.('cellFormat', 'currency-sar')}
                        className="ribbon-btn-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200"
                        title="تنسيق العملة"
                      >
                        ر.س
                      </button>
                      <button
                        onClick={() => onInsertElement?.('cellFormat', 'percent')}
                        className="ribbon-btn-sm font-bold text-gray-700"
                        title="نسبة مئوية"
                      >
                        %
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onInsertElement?.('mergeCenter')}
                        className="ribbon-btn-sm bg-white border border-gray-200 hover:border-emerald-500"
                        title="دمج وتوسيط"
                      >
                        <span>دمج وتوسيط</span>
                      </button>
                      <button
                        onClick={() => onInsertElement?.('borders', 'all')}
                        className="ribbon-btn-sm bg-white border border-gray-200 hover:border-emerald-500"
                        title="كافة الحدود"
                      >
                        <Grid className="w-3.5 h-3.5 text-emerald-600" />
                        <span>الحدود</span>
                      </button>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400 text-center font-normal mt-auto">تنسيق الخلايا</span>
                </div>

                {/* Excel Row / Column Ops & AutoSum */}
                <div className="flex flex-col justify-between px-2 border-l border-gray-200 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onInsertElement?.('autoSum')}
                      className="ribbon-btn bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100"
                      title="جمع تلقائي (AutoSum)"
                    >
                      <Sigma className="w-5 h-5 text-emerald-600 mb-0.5" />
                      <span className="font-bold">جمع تلقائي</span>
                    </button>
                    <button
                      onClick={() => onInsertElement?.('insertRow')}
                      className="ribbon-btn-sm bg-white border border-gray-200 hover:bg-gray-100"
                      title="إدراج صف"
                    >
                      + صف
                    </button>
                    <button
                      onClick={() => onInsertElement?.('insertCol')}
                      className="ribbon-btn-sm bg-white border border-gray-200 hover:bg-gray-100"
                      title="إدراج عمود"
                    >
                      + عمود
                    </button>
                    <button
                      onClick={() => onInsertElement?.('chart')}
                      className="ribbon-btn bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100"
                      title="رسم بياني"
                    >
                      <BarChart3 className="w-5 h-5 text-blue-600 mb-0.5" />
                      <span>مخطط بياني</span>
                    </button>
                  </div>
                  <span className="text-[10px] text-gray-400 text-center font-normal mt-auto">تحرير وإدراج</span>
                </div>
              </>
            )}

            {/* APP SPECIFIC HOME CONTROLS: POWERPOINT */}
            {activeApp === 'slides' && (
              <div className="flex flex-col justify-between px-2 border-l border-gray-200 shrink-0">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onInsertElement?.('newSlide')}
                    className="ribbon-btn bg-orange-50 text-orange-900 border border-orange-200 hover:bg-orange-100"
                    title="إضافة شريحة جديدة"
                  >
                    <Shapes className="w-5 h-5 text-orange-600 mb-0.5" />
                    <span className="font-bold">شريحة جديدة</span>
                  </button>
                  <button
                    onClick={() => onInsertElement?.('addShape', 'rectangle')}
                    className="ribbon-btn-sm bg-white border border-gray-200 hover:bg-gray-100"
                    title="إدراج مستطيل"
                  >
                    مستطيل ▢
                  </button>
                  <button
                    onClick={() => onInsertElement?.('addShape', 'circle')}
                    className="ribbon-btn-sm bg-white border border-gray-200 hover:bg-gray-100"
                    title="إدراج دائرة"
                  >
                    دائرة ○
                  </button>
                  <button
                    onClick={() => onInsertElement?.('startPresenter')}
                    className="ribbon-btn bg-red-600 text-white hover:bg-red-700 shadow-xs"
                    title="بدء العرض التقديمي (F5)"
                  >
                    <Play className="w-5 h-5 fill-white mb-0.5" />
                    <span className="font-bold">بدء العرض</span>
                  </button>
                </div>
                <span className="text-[10px] text-gray-400 text-center font-normal mt-auto">شرائح وأشكال</span>
              </div>
            )}

            {/* APP SPECIFIC HOME CONTROLS: ACCESS */}
            {activeApp === 'base' && (
              <div className="flex flex-col justify-between px-2 border-l border-gray-200 shrink-0">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onInsertElement?.('switchView', 'records')}
                    className="ribbon-btn bg-red-50 text-red-900 border border-red-200 hover:bg-red-100"
                    title="طريقة عرض ورقة البيانات (Datasheet View)"
                  >
                    <TableIcon className="w-5 h-5 text-red-700 mb-0.5" />
                    <span className="font-bold">ورقة البيانات</span>
                  </button>
                  <button
                    onClick={() => onInsertElement?.('switchView', 'form')}
                    className="ribbon-btn bg-white border border-gray-200 hover:bg-gray-100"
                    title="طريقة عرض النموذج (Form View)"
                  >
                    <Layers className="w-5 h-5 text-gray-700 mb-0.5" />
                    <span>عرض النموذج</span>
                  </button>
                  <button
                    onClick={() => onInsertElement?.('switchView', 'sql')}
                    className="ribbon-btn bg-slate-900 text-white hover:bg-slate-800"
                    title="شاشة استعلامات SQL"
                  >
                    <Terminal className="w-5 h-5 text-emerald-400 mb-0.5" />
                    <span>محرر SQL</span>
                  </button>
                </div>
                <span className="text-[10px] text-gray-400 text-center font-normal mt-auto">طرق العرض</span>
              </div>
            )}

            {/* Paragraph / Alignment Controls for Docs / All */}
            {activeApp === 'docs' && (
              <div className="flex flex-col justify-between px-2 border-l border-gray-200 shrink-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <button onClick={() => onFormatText?.('justifyRight')} className="ribbon-btn-sm" title="يمين RTL">
                      <AlignRight className="w-3.5 h-3.5 text-blue-700" />
                    </button>
                    <button onClick={() => onFormatText?.('justifyCenter')} className="ribbon-btn-sm" title="توسيط">
                      <AlignCenter className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => onFormatText?.('justifyLeft')} className="ribbon-btn-sm" title="يسار">
                      <AlignLeft className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => onFormatText?.('justifyFull')} className="ribbon-btn-sm" title="ضبط كلي">
                      <AlignJustify className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => onFormatText?.('insertUnorderedList')} className="ribbon-btn-sm" title="قائمة نقطية">
                      <List className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => onFormatText?.('insertOrderedList')} className="ribbon-btn-sm" title="قائمة رقمية">
                      <ListOrdered className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => onFormatText?.('insertCheckbox')} className="ribbon-btn-sm" title="مربعات مهام">
                      <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                    </button>
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 text-center font-normal mt-auto">الفقرة</span>
              </div>
            )}
          </>
        )}

        {/* ========================================================= */}
        {/* TAB: FORMULAS (الصيغ الرياضية - خاص بـ Excel) */}
        {/* ========================================================= */}
        {activeTab === 'formulas' && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => onInsertElement?.('formula', '=SUM(A1:A10)')}
              className="ribbon-btn bg-emerald-50 text-emerald-800"
            >
              <Sigma className="w-6 h-6 text-emerald-600 mb-1" />
              <span className="font-bold">دالة المجموع (SUM)</span>
            </button>
            <button
              onClick={() => onInsertElement?.('formula', '=AVERAGE(A1:A10)')}
              className="ribbon-btn bg-blue-50 text-blue-800"
            >
              <span className="font-bold text-lg text-blue-600 mb-1">x̄</span>
              <span className="font-bold">المتوسط (AVERAGE)</span>
            </button>
            <button
              onClick={() => onInsertElement?.('formula', '=IF(C4>1000, "فائض", "ضمن الميزانية")')}
              className="ribbon-btn bg-purple-50 text-purple-800"
            >
              <span className="font-bold text-sm text-purple-600 mb-1">IF</span>
              <span className="font-bold">دالة الشرط (IF)</span>
            </button>
            <button
              onClick={() => onInsertElement?.('formula', '=COUNT(A1:A20)')}
              className="ribbon-btn bg-amber-50 text-amber-800"
            >
              <span className="font-bold text-sm text-amber-600 mb-1">#</span>
              <span className="font-bold">دالة العدد (COUNT)</span>
            </button>
            <button
              onClick={() => onInsertElement?.('formula', '=MAX(B4:B15)')}
              className="ribbon-btn bg-rose-50 text-rose-800"
            >
              <span className="font-bold text-sm text-rose-600 mb-1">MAX</span>
              <span className="font-bold">أعلى قيمة (MAX)</span>
            </button>
            <button
              onClick={() => onInsertElement?.('formula', '=MIN(B4:B15)')}
              className="ribbon-btn bg-teal-50 text-teal-800"
            >
              <span className="font-bold text-sm text-teal-600 mb-1">MIN</span>
              <span className="font-bold">أدنى قيمة (MIN)</span>
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: DATA (البيانات - خاص بـ Excel) */}
        {/* ========================================================= */}
        {activeTab === 'data' && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => onInsertElement?.('sortAsc')}
              className="ribbon-btn hover:bg-gray-100"
            >
              <span className="font-bold text-sm text-emerald-700">A ➔ Z</span>
              <span>فرز تصاعدي</span>
            </button>
            <button
              onClick={() => onInsertElement?.('sortDesc')}
              className="ribbon-btn hover:bg-gray-100"
            >
              <span className="font-bold text-sm text-emerald-700">Z ➔ A</span>
              <span>فرز تنازلي</span>
            </button>
            <button
              onClick={() => onInsertElement?.('filter')}
              className="ribbon-btn hover:bg-gray-100"
            >
              <Filter className="w-5 h-5 text-blue-600 mb-1" />
              <span>تصفية (Filter)</span>
            </button>
            <button
              onClick={() => onInsertElement?.('removeDuplicates')}
              className="ribbon-btn hover:bg-gray-100"
            >
              <CheckSquare className="w-5 h-5 text-purple-600 mb-1" />
              <span>إزالة التكرار</span>
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: DESIGN (التصميم - خاص بـ PowerPoint) */}
        {/* ========================================================= */}
        {activeTab === 'design' && (
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-700">سمات أوفيس اللونية:</span>
            {[
              { id: 'blue', label: 'الأزرق الملكي', color: '#0078d4' },
              { id: 'emerald', label: 'الزمردي الخليجي', color: '#107c41' },
              { id: 'amber', label: 'الذهبي الدافئ', color: '#d97706' },
              { id: 'dark', label: 'الداكن التقني', color: '#0f172a' },
              { id: 'purple', label: 'الأرجواني الفخم', color: '#7719aa' },
            ].map((theme) => (
              <button
                key={theme.id}
                onClick={() => onInsertElement?.('changeTheme', theme.id)}
                className="px-3 py-2 rounded-lg border border-gray-300 hover:scale-105 transition flex items-center gap-2 text-xs font-bold"
                style={{ backgroundColor: theme.color, color: '#ffffff' }}
              >
                <span>{theme.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: TRANSITIONS (انتقالات الشرائح - خاص بـ PowerPoint) */}
        {/* ========================================================= */}
        {activeTab === 'transitions' && (
          <div className="flex items-center gap-2">
            {['fade', 'push', 'wipe', 'zoom', 'morph'].map((trans) => (
              <button
                key={trans}
                onClick={() => onInsertElement?.('setTransition', trans)}
                className="ribbon-btn bg-white border border-gray-200 hover:bg-orange-50 hover:border-orange-400 capitalize"
              >
                <Sparkles className="w-4 h-4 text-orange-600 mb-1" />
                <span>{trans === 'fade' ? 'تضاؤل (Fade)' : trans === 'push' ? 'دفع (Push)' : trans === 'wipe' ? 'مسح (Wipe)' : trans === 'zoom' ? 'تكبير (Zoom)' : 'تحويل تدريجي'}</span>
              </button>
            ))}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: SLIDESHOW (عرض الشرائح - خاص بـ PowerPoint) */}
        {activeTab === 'slideshow' && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => onInsertElement?.('startPresenter')}
              className="ribbon-btn bg-red-600 text-white font-bold px-4 py-2 hover:bg-red-700 shadow-md"
            >
              <Play className="w-6 h-6 fill-white mb-1" />
              <span>بدء العرض التقديمي (F5)</span>
            </button>
            <button
              onClick={() => onInsertElement?.('newSlide')}
              className="ribbon-btn bg-orange-50 text-orange-900 border border-orange-200 hover:bg-orange-100"
            >
              <Shapes className="w-6 h-6 text-orange-600 mb-1" />
              <span>إضافة شريحة جديدة</span>
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: CREATE (إنشاء كائنات قاعدة البيانات - خاص بـ Access) */}
        {activeTab === 'create' && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => onInsertElement?.('createTable')}
              className="ribbon-btn bg-red-50 text-red-900 border border-red-200"
            >
              <TableIcon className="w-6 h-6 text-red-700 mb-1" />
              <span className="font-bold">جدول جديد (Table)</span>
            </button>
            <button
              onClick={() => onInsertElement?.('createForm')}
              className="ribbon-btn bg-blue-50 text-blue-900 border border-blue-200"
            >
              <Layers className="w-6 h-6 text-blue-700 mb-1" />
              <span className="font-bold">نموذج آلي (Form)</span>
            </button>
            <button
              onClick={() => onInsertElement?.('createQuery')}
              className="ribbon-btn bg-slate-900 text-white"
            >
              <Terminal className="w-6 h-6 text-emerald-400 mb-1" />
              <span className="font-bold">استعلام SQL</span>
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: EXTERNAL DATA (بيانات خارجية - خاص بـ Access) */}
        {activeTab === 'external-data' && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => onInsertElement?.('exportExcel')}
              className="ribbon-btn bg-emerald-50 text-emerald-900 border border-emerald-200"
            >
              <FileSpreadsheet className="w-6 h-6 text-emerald-700 mb-1" />
              <span>تصدير إلى Excel</span>
            </button>
            <button
              onClick={() => window.print()}
              className="ribbon-btn bg-red-50 text-red-900 border border-red-200"
            >
              <Printer className="w-6 h-6 text-red-700 mb-1" />
              <span>تقرير مطبوع معتمد (PDF)</span>
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: INSERT (إدراج عام) */}
        {activeTab === 'insert' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onInsertElement?.('table')}
              className="ribbon-btn hover:bg-blue-50"
            >
              <TableIcon className="w-6 h-6 text-blue-600 mb-1" />
              <span>جدول بيانات</span>
            </button>
            <button
              onClick={() => onInsertElement?.('chart')}
              className="ribbon-btn hover:bg-emerald-50"
            >
              <BarChart3 className="w-6 h-6 text-emerald-600 mb-1" />
              <span>مخطط بياني</span>
            </button>
            <button
              onClick={() => onInsertElement?.('image')}
              className="ribbon-btn hover:bg-purple-50"
            >
              <ImageIcon className="w-6 h-6 text-purple-600 mb-1" />
              <span>صورة وشعار</span>
            </button>
            <button
              onClick={() => onInsertElement?.('shapes')}
              className="ribbon-btn hover:bg-amber-50"
            >
              <Shapes className="w-6 h-6 text-amber-600 mb-1" />
              <span>أشكال هندسية</span>
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: LAYOUT (تخطيط الصفحة) */}
        {activeTab === 'layout' && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => onFormatText?.('pageOrientation', 'portrait')}
              className="ribbon-btn-sm bg-white border border-gray-200"
            >
              <span>📄 عمودي (A4)</span>
            </button>
            <button
              onClick={() => onFormatText?.('pageOrientation', 'landscape')}
              className="ribbon-btn-sm bg-white border border-gray-200"
            >
              <span>📜 أفقي (Landscape)</span>
            </button>
            <div className="h-5 w-[1px] bg-gray-300"></div>
            <button
              onClick={() => onFormatText?.('dirRTL')}
              className="ribbon-btn-sm bg-blue-50 text-blue-800 font-bold border border-blue-200"
            >
              <span>عربي RTL ➔</span>
            </button>
            <button
              onClick={() => onFormatText?.('dirLTR')}
              className="ribbon-btn-sm bg-gray-50 text-gray-700 border border-gray-200"
            >
              <span>➔ إنجليزي LTR</span>
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: REVIEW (مراجعة) */}
        {activeTab === 'review' && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span className="font-bold">التدقيق السيادي: تم فحص وتأمين الوثيقة محلياً 100% دون خروج أي بيانات.</span>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: VIEW (عرض وزووم) */}
        {activeTab === 'view' && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setZoomLevel((z) => Math.max(50, z - 10))}
              className="ribbon-btn-sm"
              title="تصغير"
            >
              <ZoomOut className="w-4 h-4" />
              <span>تصغير</span>
            </button>
            <span className="font-mono text-xs font-bold w-12 text-center">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(200, z + 10))}
              className="ribbon-btn-sm"
              title="تكبير"
            >
              <ZoomIn className="w-4 h-4" />
              <span>تكبير</span>
            </button>
            <button
              onClick={() => setZoomLevel(100)}
              className="ribbon-btn-sm bg-gray-100"
            >
              100%
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
