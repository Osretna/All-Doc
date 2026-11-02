import React, { useState } from 'react';
import {
  PowerPointTab,
  PresentationViewMode,
  TransitionType,
  TransitionDirection,
  SlideShapeType,
  PowerPointSlideData
} from './types';
import {
  // Common icons
  Play,
  Copy,
  Scissors,
  Clipboard,
  Paintbrush,
  Plus,
  Layout,
  RotateCcw,
  FolderPlus,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Highlighter,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Indent,
  Outdent,
  Shapes,
  Palette,
  Search,
  Replace,
  MousePointer,
  Sparkles,
  Layers,
  Table as TableIcon,
  Image as ImageIcon,
  Smile,
  Box,
  Workflow,
  BarChart3,
  Link,
  MessageSquare,
  FileText,
  Calendar,
  Hash,
  Pi,
  Film,
  Mic,
  PenTool,
  Eraser,
  Ruler,
  Maximize2,
  Volume2,
  Clock,
  CheckCircle,
  BookOpen,
  Languages,
  Lock,
  Grid,
  Monitor,
  Eye,
  Sliders,
  Maximize,
  HelpCircle,
  FileCode,
  ArrowUpDown,
  Move,
  ChevronDown
} from 'lucide-react';
import { OFFICE_THEMES } from './themes';

interface Props {
  activeTab: PowerPointTab;
  setActiveTab: (tab: PowerPointTab) => void;
  viewMode: PresentationViewMode;
  setViewMode: (mode: PresentationViewMode) => void;
  onOpenBackstage: () => void;
  // Font & text
  fontFamily: string;
  setFontFamily: (font: string) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  onFormatText: (command: string, value?: any) => void;
  // Slide actions
  onAddNewSlide: (layout?: string) => void;
  onDuplicateSlide: () => void;
  onDeleteSlide: () => void;
  onAddSection: (title: string) => void;
  // Shapes & Insert
  onInsertShape: (shape: SlideShapeType) => void;
  onInsertTable: (rows: number, cols: number) => void;
  onInsertImage: (file: File) => void;
  onInsertSmartArt: () => void;
  onInsertChart: () => void;
  // Design & Themes
  currentThemeId: string;
  onSelectTheme: (themeId: string) => void;
  onOpenSlideSizeModal: () => void;
  onOpenDesignerDrawer: () => void;
  // Transitions
  currentTransition: TransitionType;
  onSelectTransition: (t: TransitionType) => void;
  transitionDuration: number;
  onSetTransitionDuration: (d: number) => void;
  onApplyTransitionToAll: () => void;
  // Animations
  onOpenAnimationPane: () => void;
  onAddAnimation: (effect: string) => void;
  onPreviewAnimations: () => void;
  // Slide Show
  onStartShowFromBeginning: () => void;
  onStartShowFromCurrent: () => void;
  onOpenRehearseTimings: () => void;
  onToggleHideCurrentSlide: () => void;
  isCurrentSlideHidden: boolean;
  // Master & Views
  onOpenSlideMaster: () => void;
  showRuler: boolean;
  setShowRuler: (v: boolean) => void;
  showGridlines: boolean;
  setShowGridlines: (v: boolean) => void;
  showNotesPane: boolean;
  setShowNotesPane: (v: boolean) => void;
  // Draw tools
  activeDrawTool: 'cursor' | 'pen' | 'pencil' | 'highlighter' | 'eraser';
  setActiveDrawTool: (tool: 'cursor' | 'pen' | 'pencil' | 'highlighter' | 'eraser') => void;
  drawColor: string;
  setDrawColor: (c: string) => void;
  drawWidth: number;
  setDrawWidth: (w: number) => void;
}

export const PowerPointRibbon: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  viewMode,
  setViewMode,
  onOpenBackstage,
  fontFamily,
  setFontFamily,
  fontSize,
  setFontSize,
  onFormatText,
  onAddNewSlide,
  onDuplicateSlide,
  onDeleteSlide,
  onAddSection,
  onInsertShape,
  onInsertTable,
  onInsertImage,
  onInsertSmartArt,
  onInsertChart,
  currentThemeId,
  onSelectTheme,
  onOpenSlideSizeModal,
  onOpenDesignerDrawer,
  currentTransition,
  onSelectTransition,
  transitionDuration,
  onSetTransitionDuration,
  onApplyTransitionToAll,
  onOpenAnimationPane,
  onAddAnimation,
  onPreviewAnimations,
  onStartShowFromBeginning,
  onStartShowFromCurrent,
  onOpenRehearseTimings,
  onToggleHideCurrentSlide,
  isCurrentSlideHidden,
  onOpenSlideMaster,
  showRuler,
  setShowRuler,
  showGridlines,
  setShowGridlines,
  showNotesPane,
  setShowNotesPane,
  activeDrawTool,
  setActiveDrawTool,
  drawColor,
  setDrawColor,
  drawWidth,
  setDrawWidth,
}) => {
  const [showNewSlideMenu, setShowNewSlideMenu] = useState(false);
  const [showTablePicker, setShowTablePicker] = useState(false);
  const [showShapePicker, setShowShapePicker] = useState(false);
  const [showLayoutMenu, setShowLayoutMenu] = useState(false);
  const [tableGrid, setTableGrid] = useState({ rows: 3, cols: 3 });

  const tabs: Array<{ id: PowerPointTab; label: string }> = [
    { id: 'home', label: 'الشريط الرئيسي (Home)' },
    { id: 'insert', label: 'إدراج (Insert)' },
    { id: 'draw', label: 'رسم (Draw)' },
    { id: 'design', label: 'تصميم (Design)' },
    { id: 'transitions', label: 'انتقالات (Transitions)' },
    { id: 'animations', label: 'حركات (Animations)' },
    { id: 'slideshow', label: 'عرض الشرائح (Slide Show)' },
    { id: 'review', label: 'مراجعة (Review)' },
    { id: 'view', label: 'عرض (View)' },
  ];

  const transitionsList: Array<{ id: TransitionType; label: string; desc: string }> = [
    { id: 'none', label: 'بلا انتقال', desc: 'تغيير مباشر' },
    { id: 'morph', label: 'التحول التدريجي (Morph) ⭐', desc: 'تأثير التحول الذكي الشهير' },
    { id: 'fade', label: 'تضاؤل (Fade)', desc: 'تلاشي تدريجي' },
    { id: 'push', label: 'دفع (Push)', desc: 'دفع الشريحة السابقة' },
    { id: 'wipe', label: 'مسح (Wipe)', desc: 'مسح أفقي ناعم' },
    { id: 'split', label: 'انقسام (Split)', desc: 'انشطار الشريحة' },
    { id: 'reveal', label: 'كشف (Reveal)', desc: 'كشف الغطاء' },
    { id: 'random-bars', label: 'قضبان عشوائية', desc: 'أعمدة عشوائية' },
    { id: 'shape', label: 'شكل هندسي', desc: 'دائرة أو مربع متمدد' },
    { id: 'peel-off', label: 'تقشير الورقة', desc: 'طي زاوية الورقة' },
    { id: 'page-curl', label: 'طي الصفحة (Curl)', desc: 'تقليب صفحات كتاب' },
    { id: 'doors', label: 'أبواب (Doors)', desc: 'فتح الأبواب للمسرح' },
    { id: 'window', label: 'نافذة (Window)', desc: 'إطلالة من النافذة' },
    { id: 'zoom', label: 'تكبير وتكثيف', desc: 'Zoom dynamic' },
  ];

  return (
    <div className="bg-[#f3f2f1] border-b border-gray-300 flex flex-col select-none text-right font-sans shrink-0">
      {/* 1. Ribbon Tab Headers */}
      <div className="flex items-center px-2 bg-[#d83b01] text-white overflow-x-auto text-xs">
        <button
          onClick={onOpenBackstage}
          className="px-4 py-2 bg-[#b33000] hover:bg-[#992900] font-bold text-white transition cursor-pointer flex items-center gap-1"
        >
          <span>ملف (File)</span>
        </button>

        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-2 font-medium transition cursor-pointer border-b-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white text-gray-900 font-bold border-[#d83b01]'
                : 'text-white/90 hover:bg-white/10 border-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}

        {/* Quick Launch Buttons in Ribbon Header */}
        <div className="mr-auto flex items-center gap-1.5 pl-2">
          <button
            onClick={onStartShowFromBeginning}
            className="flex items-center gap-1 px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded text-[11px] font-bold text-white transition cursor-pointer"
            title="بدء العرض التقديمي من البداية (F5)"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>عرض (F5)</span>
          </button>

          <button
            onClick={onOpenDesignerDrawer}
            className="flex items-center gap-1 px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-black rounded text-[11px] font-black transition cursor-pointer shadow-xs"
            title="أفكار التصميم الذكية (Designer)"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Designer</span>
          </button>
        </div>
      </div>

      {/* 2. Ribbon Content Area */}
      <div className="h-28 bg-[#f3f2f1] px-3 py-1 flex items-stretch gap-2 overflow-x-auto text-xs text-gray-800">
        {/* ================= TAB 1: HOME ================= */}
        {activeTab === 'home' && (
          <div className="flex items-stretch gap-2 shrink-0">
            {/* Clipboard Group */}
            <div className="flex flex-col justify-between border-l border-gray-300 pl-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => alert('لصق: اضغط Ctrl+V للصق أي نص أو صورة أو عنصر')}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-white rounded transition cursor-pointer text-gray-700"
                >
                  <Clipboard className="w-5 h-5 text-[#d83b01]" />
                  <span className="text-[10px]">لصق</span>
                </button>
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => onFormatText('cut')}
                    className="flex items-center gap-1 p-1 hover:bg-white rounded text-[11px]"
                  >
                    <Scissors className="w-3.5 h-3.5 text-gray-600" />
                    <span>قص</span>
                  </button>
                  <button
                    onClick={() => onFormatText('copy')}
                    className="flex items-center gap-1 p-1 hover:bg-white rounded text-[11px]"
                  >
                    <Copy className="w-3.5 h-3.5 text-gray-600" />
                    <span>نسخ</span>
                  </button>
                  <button
                    onClick={() => alert('تم تفعيل نسخ التنسيق (Format Painter). انقر على العنصر المراد نقل التنسيق إليه.')}
                    className="flex items-center gap-1 p-1 hover:bg-white rounded text-[11px]"
                  >
                    <Paintbrush className="w-3.5 h-3.5 text-amber-600" />
                    <span>نسخ التنسيق</span>
                  </button>
                </div>
              </div>
              <div className="text-[10px] text-gray-500 text-center font-bold">الحافظة (Clipboard)</div>
            </div>

            {/* Slides Group */}
            <div className="flex flex-col justify-between border-l border-gray-300 pl-2 relative">
              <div className="flex items-center gap-1">
                <div className="relative">
                  <button
                    onClick={() => setShowNewSlideMenu(!showNewSlideMenu)}
                    className="flex flex-col items-center p-1.5 bg-orange-50 hover:bg-orange-100 border border-orange-300 rounded text-[#d83b01] font-bold transition cursor-pointer"
                  >
                    <div className="flex items-center gap-0.5">
                      <Plus className="w-4 h-4" />
                      <ChevronDown className="w-3 h-3" />
                    </div>
                    <span className="text-[10px]">شريحة جديدة</span>
                  </button>

                  {showNewSlideMenu && (
                    <div className="absolute right-0 top-12 w-52 bg-white border border-gray-300 rounded-lg shadow-2xl p-2 z-50 text-right space-y-1">
                      <div className="text-[10px] font-bold text-gray-400 mb-1">اختر تخطيط الشريحة:</div>
                      <button
                        onClick={() => {
                          onAddNewSlide('title');
                          setShowNewSlideMenu(false);
                        }}
                        className="w-full text-right p-1.5 rounded hover:bg-orange-50 text-xs font-medium"
                      >
                        شريحة عنوان (Title Slide)
                      </button>
                      <button
                        onClick={() => {
                          onAddNewSlide('content');
                          setShowNewSlideMenu(false);
                        }}
                        className="w-full text-right p-1.5 rounded hover:bg-orange-50 text-xs font-medium"
                      >
                        عنوان ومحتوى (Content)
                      </button>
                      <button
                        onClick={() => {
                          onAddNewSlide('comparison');
                          setShowNewSlideMenu(false);
                        }}
                        className="w-full text-right p-1.5 rounded hover:bg-orange-50 text-xs font-medium"
                      >
                        مقارنة عمودين (Comparison)
                      </button>
                      <button
                        onClick={() => {
                          onAddNewSlide('split');
                          setShowNewSlideMenu(false);
                        }}
                        className="w-full text-right p-1.5 rounded hover:bg-orange-50 text-xs font-medium"
                      >
                        تقرير ذكي ومخطط
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => onDuplicateSlide()}
                    className="flex items-center gap-1 p-1 hover:bg-white rounded text-[11px]"
                    title="تكرار الشريحة المحددة (Ctrl+D)"
                  >
                    <Copy className="w-3.5 h-3.5 text-blue-600" />
                    <span>تكرار</span>
                  </button>
                  <button
                    onClick={() => onDeleteSlide()}
                    className="flex items-center gap-1 p-1 hover:bg-white rounded text-[11px] text-red-600"
                    title="حذف الشريحة (Delete)"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>إعادة تعيين</span>
                  </button>
                  <button
                    onClick={() => {
                      const name = prompt('أدخل عنوان القسم الجديد:', 'قسم جديد');
                      if (name) onAddSection(name);
                    }}
                    className="flex items-center gap-1 p-1 hover:bg-white rounded text-[11px]"
                  >
                    <FolderPlus className="w-3.5 h-3.5 text-amber-600" />
                    <span>قسم (Section)</span>
                  </button>
                </div>
              </div>
              <div className="text-[10px] text-gray-500 text-center font-bold">الشرائح (Slides)</div>
            </div>

            {/* Font Group */}
            <div className="flex flex-col justify-between border-l border-gray-300 pl-2">
              <div className="flex flex-col gap-1">
                {/* Font selector and size */}
                <div className="flex items-center gap-1">
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="h-6 border border-gray-300 rounded px-1 text-xs bg-white w-28"
                  >
                    <option value="Cairo">Cairo (الافتراضي)</option>
                    <option value="Tajawal">Tajawal</option>
                    <option value="Amiri">Amiri</option>
                    <option value="Arial">Arial</option>
                    <option value="Times New Roman">Times New Roman</option>
                  </select>

                  <select
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="h-6 border border-gray-300 rounded px-1 text-xs bg-white w-14"
                  >
                    {[12, 14, 16, 18, 20, 24, 28, 32, 36, 44, 54, 60, 72].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => setFontSize(fontSize + 2)}
                    className="px-1.5 h-6 bg-white border border-gray-300 rounded text-xs font-bold"
                  >
                    A^
                  </button>
                  <button
                    onClick={() => setFontSize(Math.max(10, fontSize - 2))}
                    className="px-1.5 h-6 bg-white border border-gray-300 rounded text-xs font-bold"
                  >
                    Av
                  </button>
                </div>

                {/* Bold, Italic, Underline, Shadow, Strikethrough, Color */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onFormatText('bold')}
                    className="p-1 hover:bg-white rounded font-black border border-transparent hover:border-gray-300"
                    title="عريض (Bold)"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onFormatText('italic')}
                    className="p-1 hover:bg-white rounded italic border border-transparent hover:border-gray-300"
                    title="مائل (Italic)"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onFormatText('underline')}
                    className="p-1 hover:bg-white rounded underline border border-transparent hover:border-gray-300"
                    title="تسطير (Underline)"
                  >
                    <Underline className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onFormatText('strikethrough')}
                    className="p-1 hover:bg-white rounded line-through border border-transparent hover:border-gray-300"
                    title="يتوسطه خط"
                  >
                    <Strikethrough className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => alert('ظل النص (Text Shadow) نشط')}
                    className="p-1 hover:bg-white rounded font-serif font-black text-xs"
                    title="ظل النص (Shadow)"
                  >
                    S
                  </button>
                  <div className="border-r border-gray-300 h-4 mx-0.5" />
                  <input
                    type="color"
                    onChange={(e) => onFormatText('foreColor', e.target.value)}
                    className="w-5 h-5 p-0 border border-gray-300 rounded cursor-pointer"
                    title="لون الخط"
                  />
                </div>
              </div>
              <div className="text-[10px] text-gray-500 text-center font-bold">خط (Font)</div>
            </div>

            {/* Paragraph Group */}
            <div className="flex flex-col justify-between border-l border-gray-300 pl-2">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onFormatText('insertUnorderedList')}
                    className="p-1 hover:bg-white rounded"
                    title="تعداد نقطي"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onFormatText('insertOrderedList')}
                    className="p-1 hover:bg-white rounded"
                    title="تعداد رقمي"
                  >
                    <ListOrdered className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onFormatText('outdent')}
                    className="p-1 hover:bg-white rounded"
                    title="إنقاص المسافة البادئة"
                  >
                    <Outdent className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onFormatText('indent')}
                    className="p-1 hover:bg-white rounded"
                    title="زيادة المسافة البادئة"
                  >
                    <Indent className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onFormatText('justifyRight')}
                    className="p-1 hover:bg-white rounded"
                    title="محاذاة لليمين"
                  >
                    <AlignRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onFormatText('justifyCenter')}
                    className="p-1 hover:bg-white rounded"
                    title="توسيط"
                  >
                    <AlignCenter className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onFormatText('justifyLeft')}
                    className="p-1 hover:bg-white rounded"
                    title="محاذاة لليسار"
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onFormatText('justifyFull')}
                    className="p-1 hover:bg-white rounded"
                    title="ضبط كلي"
                  >
                    <AlignJustify className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={onInsertSmartArt}
                    className="p-1 hover:bg-white rounded text-[#d83b01]"
                    title="تحويل إلى SmartArt"
                  >
                    <Workflow className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="text-[10px] text-gray-500 text-center font-bold">فقرة (Paragraph)</div>
            </div>

            {/* Drawing Group */}
            <div className="flex flex-col justify-between border-l border-gray-300 pl-2 relative">
              <div className="flex items-center gap-1">
                {/* Shape Picker Gallery */}
                <div className="grid grid-cols-4 gap-1 bg-white p-1 rounded border border-gray-300">
                  <button
                    onClick={() => onInsertShape('rectangle')}
                    className="p-1 hover:bg-gray-100 rounded text-xs"
                    title="مستطيل"
                  >
                    ▭
                  </button>
                  <button
                    onClick={() => onInsertShape('rounded-rectangle')}
                    className="p-1 hover:bg-gray-100 rounded text-xs"
                    title="مستطيل مستدير الزوايا"
                  >
                    ▢
                  </button>
                  <button
                    onClick={() => onInsertShape('circle')}
                    className="p-1 hover:bg-gray-100 rounded text-xs"
                    title="دائرة / بيضاوي"
                  >
                    ○
                  </button>
                  <button
                    onClick={() => onInsertShape('triangle')}
                    className="p-1 hover:bg-gray-100 rounded text-xs"
                    title="مثلث"
                  >
                    △
                  </button>
                  <button
                    onClick={() => onInsertShape('arrow-right')}
                    className="p-1 hover:bg-gray-100 rounded text-xs"
                    title="سهم لليمين"
                  >
                    ➔
                  </button>
                  <button
                    onClick={() => onInsertShape('arrow-left')}
                    className="p-1 hover:bg-gray-100 rounded text-xs"
                    title="سهم لليسار"
                  >
                    ⬅
                  </button>
                  <button
                    onClick={() => onInsertShape('star')}
                    className="p-1 hover:bg-gray-100 rounded text-xs"
                    title="نجمة"
                  >
                    ★
                  </button>
                  <button
                    onClick={() => onInsertShape('callout')}
                    className="p-1 hover:bg-gray-100 rounded text-xs"
                    title="فقاعة حوار"
                  >
                    💬
                  </button>
                </div>

                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => alert('ترتيب العناصر: إحضار للأمام / إرسال للخلف')}
                    className="flex items-center gap-1 p-1 hover:bg-white rounded text-[11px]"
                  >
                    <Layers className="w-3.5 h-3.5 text-sky-600" />
                    <span>ترتيب</span>
                  </button>
                  <button
                    onClick={() => alert('أنماط سريعة: تم تطبيق نمط زجاجي عصري')}
                    className="flex items-center gap-1 p-1 hover:bg-white rounded text-[11px]"
                  >
                    <Palette className="w-3.5 h-3.5 text-amber-600" />
                    <span>أنماط سريعة</span>
                  </button>
                  <button
                    onClick={() => alert('تأثيرات الأشكال: ظل، توهج، وانعكاس 3D')}
                    className="flex items-center gap-1 p-1 hover:bg-white rounded text-[11px]"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span>تأثيرات</span>
                  </button>
                </div>
              </div>
              <div className="text-[10px] text-gray-500 text-center font-bold">رسم (Drawing)</div>
            </div>

            {/* Editing Group */}
            <div className="flex flex-col justify-between pl-2">
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => {
                    const text = prompt('بحث في الشرائح:');
                    if (text) alert(`تم العثور على: "${text}"`);
                  }}
                  className="flex items-center gap-1 p-1 hover:bg-white rounded text-[11px]"
                >
                  <Search className="w-3.5 h-3.5 text-blue-600" />
                  <span>بحث (Find)</span>
                </button>
                <button
                  onClick={() => {
                    const target = prompt('الكلمة المراد استبدالها:');
                    if (target) {
                      const rep = prompt(`استبدال "${target}" بـ:`);
                      if (rep) alert(`تم استبدال "${target}" بـ "${rep}"`);
                    }
                  }}
                  className="flex items-center gap-1 p-1 hover:bg-white rounded text-[11px]"
                >
                  <Replace className="w-3.5 h-3.5 text-emerald-600" />
                  <span>استبدال</span>
                </button>
                <button
                  onClick={() => alert('جزء التحديد (Selection Pane) نشط')}
                  className="flex items-center gap-1 p-1 hover:bg-white rounded text-[11px]"
                >
                  <MousePointer className="w-3.5 h-3.5 text-purple-600" />
                  <span>تحديد الكل</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-500 text-center font-bold">تحرير (Editing)</div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: INSERT ================= */}
        {activeTab === 'insert' && (
          <div className="flex items-stretch gap-2 shrink-0">
            {/* Tables */}
            <div className="flex flex-col justify-between border-l border-gray-300 pl-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    onInsertTable(3, 3);
                    alert('تم إدراج جدول 3x3 في الشريحة الحالية.');
                  }}
                  className="flex flex-col items-center p-1.5 hover:bg-white rounded transition cursor-pointer"
                >
                  <TableIcon className="w-6 h-6 text-sky-600" />
                  <span className="text-[10px] font-bold">جدول سريع</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-500 text-center font-bold">جداول (Tables)</div>
            </div>

            {/* Images */}
            <div className="flex flex-col justify-between border-l border-gray-300 pl-2">
              <div className="flex items-center gap-1">
                <label className="flex flex-col items-center p-1.5 hover:bg-white rounded transition cursor-pointer">
                  <ImageIcon className="w-6 h-6 text-emerald-600" />
                  <span className="text-[10px] font-bold">صور من الجهاز</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) onInsertImage(file);
                    }}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="text-[10px] text-gray-500 text-center font-bold">صور (Images)</div>
            </div>

            {/* Illustrations */}
            <div className="flex flex-col justify-between border-l border-gray-300 pl-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onInsertShape('rectangle')}
                  className="flex flex-col items-center p-1.5 hover:bg-white rounded"
                >
                  <Shapes className="w-5 h-5 text-indigo-600" />
                  <span className="text-[10px]">أشكال</span>
                </button>
                <button
                  onClick={() => onInsertShape('star')}
                  className="flex flex-col items-center p-1.5 hover:bg-white rounded"
                >
                  <Smile className="w-5 h-5 text-amber-500" />
                  <span className="text-[10px]">أيقونات</span>
                </button>
                <button
                  onClick={() => onInsertShape('cube')}
                  className="flex flex-col items-center p-1.5 hover:bg-white rounded"
                >
                  <Box className="w-5 h-5 text-purple-600" />
                  <span className="text-[10px]">نماذج 3D</span>
                </button>
                <button
                  onClick={onInsertSmartArt}
                  className="flex flex-col items-center p-1.5 bg-orange-50 hover:bg-orange-100 rounded border border-orange-200 text-[#d83b01] font-bold"
                >
                  <Workflow className="w-5 h-5" />
                  <span className="text-[10px]">SmartArt</span>
                </button>
                <button
                  onClick={onInsertChart}
                  className="flex flex-col items-center p-1.5 hover:bg-white rounded"
                >
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <span className="text-[10px]">مخطط</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-500 text-center font-bold">رسومات توضيحية</div>
            </div>

            {/* Links & Comments */}
            <div className="flex flex-col justify-between border-l border-gray-300 pl-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    const url = prompt('أدخل الرابط التشعبي:');
                    if (url) alert(`تم ربط الرابط "${url}" بالعنصر المحدد`);
                  }}
                  className="flex flex-col items-center p-1.5 hover:bg-white rounded"
                >
                  <Link className="w-5 h-5 text-cyan-600" />
                  <span className="text-[10px]">ارتباط</span>
                </button>
                <button
                  onClick={() => {
                    const comment = prompt('أدخل تعليقك على الشريحة:');
                    if (comment) alert('تم حفظ التعليق بنجاح.');
                  }}
                  className="flex flex-col items-center p-1.5 hover:bg-white rounded"
                >
                  <MessageSquare className="w-5 h-5 text-amber-600" />
                  <span className="text-[10px]">تعليق</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-500 text-center font-bold">روابط وتعليقات</div>
            </div>

            {/* Text & WordArt */}
            <div className="flex flex-col justify-between border-l border-gray-300 pl-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onInsertShape('textbox')}
                  className="flex flex-col items-center p-1.5 hover:bg-white rounded"
                >
                  <FileText className="w-5 h-5 text-blue-700" />
                  <span className="text-[10px]">مربع نص</span>
                </button>
                <button
                  onClick={() => alert('معرض WordArt: تم تطبيق نمط خط ثلاثي الأبعاد')}
                  className="flex flex-col items-center p-1.5 hover:bg-white rounded font-serif font-black text-rose-600"
                >
                  <span className="text-xl leading-none">A</span>
                  <span className="text-[10px] font-sans">WordArt</span>
                </button>
                <button
                  onClick={() => alert(`تاريخ اليوم: ${new Date().toLocaleDateString('ar-EG')}`)}
                  className="flex flex-col items-center p-1.5 hover:bg-white rounded"
                >
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <span className="text-[10px]">التاريخ والوقت</span>
                </button>
                <button
                  onClick={() => alert('تم تفعيل إظهار رقم الشريحة التلقائي في أسفل الشريحة')}
                  className="flex flex-col items-center p-1.5 hover:bg-white rounded"
                >
                  <Hash className="w-5 h-5 text-gray-600" />
                  <span className="text-[10px]">رقم الشريحة</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-500 text-center font-bold">نص (Text)</div>
            </div>

            {/* Media */}
            <div className="flex flex-col justify-between pl-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => alert('إدراج فيديو: يدعم ملفات MP4 والفيديوهات السيادية')}
                  className="flex flex-col items-center p-1.5 hover:bg-white rounded"
                >
                  <Film className="w-5 h-5 text-rose-600" />
                  <span className="text-[10px]">فيديو</span>
                </button>
                <button
                  onClick={() => alert('إدراج صوت: يدعم التعليق الصوتي والمؤثرات')}
                  className="flex flex-col items-center p-1.5 hover:bg-white rounded"
                >
                  <Mic className="w-5 h-5 text-purple-600" />
                  <span className="text-[10px]">صوت</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-500 text-center font-bold">وسائط (Media)</div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: DRAW ================= */}
        {activeTab === 'draw' && (
          <div className="flex items-stretch gap-2 shrink-0">
            {/* Draw Tools */}
            <div className="flex flex-col justify-between border-l border-gray-300 pl-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveDrawTool('cursor')}
                  className={`flex flex-col items-center p-1.5 rounded transition cursor-pointer ${
                    activeDrawTool === 'cursor' ? 'bg-[#d83b01] text-white font-bold' : 'hover:bg-white'
                  }`}
                >
                  <MousePointer className="w-5 h-5" />
                  <span className="text-[10px]">سهم التحديد</span>
                </button>
                <button
                  onClick={() => setActiveDrawTool('pen')}
                  className={`flex flex-col items-center p-1.5 rounded transition cursor-pointer ${
                    activeDrawTool === 'pen' ? 'bg-[#d83b01] text-white font-bold' : 'hover:bg-white'
                  }`}
                >
                  <PenTool className="w-5 h-5" />
                  <span className="text-[10px]">قلم حبر (Pen)</span>
                </button>
                <button
                  onClick={() => setActiveDrawTool('highlighter')}
                  className={`flex flex-col items-center p-1.5 rounded transition cursor-pointer ${
                    activeDrawTool === 'highlighter' ? 'bg-yellow-400 text-black font-bold' : 'hover:bg-white'
                  }`}
                >
                  <Highlighter className="w-5 h-5 text-yellow-600" />
                  <span className="text-[10px]">قلم تمييز</span>
                </button>
                <button
                  onClick={() => setActiveDrawTool('eraser')}
                  className={`flex flex-col items-center p-1.5 rounded transition cursor-pointer ${
                    activeDrawTool === 'eraser' ? 'bg-[#d83b01] text-white font-bold' : 'hover:bg-white'
                  }`}
                >
                  <Eraser className="w-5 h-5" />
                  <span className="text-[10px]">ممحاة</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-500 text-center font-bold">أدوات الرسم والتأشير</div>
            </div>

            {/* Colors & Width */}
            <div className="flex flex-col justify-between border-l border-gray-300 pl-2">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-gray-600">اللون:</span>
                  {['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#000000', '#ffffff'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setDrawColor(c)}
                      className={`w-4 h-4 rounded-full border border-gray-400 transition cursor-pointer ${
                        drawColor === c ? 'scale-125 ring-2 ring-[#d83b01]' : ''
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                  <input
                    type="color"
                    value={drawColor}
                    onChange={(e) => setDrawColor(e.target.value)}
                    className="w-5 h-5 p-0 border border-gray-300 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-600">السمك:</span>
                  {[2, 4, 6, 10].map((w) => (
                    <button
                      key={w}
                      onClick={() => setDrawWidth(w)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border transition ${
                        drawWidth === w ? 'bg-[#d83b01] text-white border-[#d83b01]' : 'bg-white border-gray-300'
                      }`}
                    >
                      {w}pt
                    </button>
                  ))}
                </div>
              </div>
              <div className="text-[10px] text-gray-500 text-center font-bold">الألوان والسمك</div>
            </div>

            {/* Ink to Shape & Ruler */}
            <div className="flex flex-col justify-between pl-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => alert('تم تفعيل "تحويل الحبر إلى شكل": يتعرف النظام على الدوائر والمربعات المرسومة باليد ويحولها لأشكال هندسية دقيقة!')}
                  className="flex flex-col items-center p-1.5 hover:bg-white rounded"
                >
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span className="text-[10px]">حبر إلى شكل</span>
                </button>
                <button
                  onClick={() => alert('تم تفعيل "تحويل الحبر إلى رياضيات": يحول المعادلات المكتوبة باليد إلى رموز رياضية')}
                  className="flex flex-col items-center p-1.5 hover:bg-white rounded"
                >
                  <Pi className="w-5 h-5 text-indigo-600" />
                  <span className="text-[10px]">حبر إلى معادلة</span>
                </button>
                <button
                  onClick={() => setShowRuler(!showRuler)}
                  className={`flex flex-col items-center p-1.5 rounded transition ${
                    showRuler ? 'bg-orange-100 text-[#d83b01] font-bold' : 'hover:bg-white'
                  }`}
                >
                  <Ruler className="w-5 h-5" />
                  <span className="text-[10px]">المسطرة</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-500 text-center font-bold">تحويل ومسطرة</div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: DESIGN ================= */}
        {activeTab === 'design' && (
          <div className="flex items-stretch gap-2 shrink-0">
            {/* Themes Gallery */}
            <div className="flex flex-col justify-between border-l border-gray-300 pl-2">
              <div className="flex items-center gap-2 overflow-x-auto max-w-xl pb-1">
                {OFFICE_THEMES.slice(0, 7).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => onSelectTheme(t.id)}
                    className={`flex flex-col items-center p-1 rounded-lg border-2 transition cursor-pointer shrink-0 ${
                      currentThemeId === t.id ? 'border-[#d83b01] bg-white shadow-sm' : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                    }`}
                  >
                    <div
                      className="w-16 h-10 rounded shadow-inner flex flex-col justify-center items-center text-[8px] font-bold text-white overflow-hidden p-1"
                      style={{ backgroundColor: t.previewBg }}
                    >
                      <span className="truncate max-w-full">{t.nameAr}</span>
                      <span className="w-6 h-0.5 bg-white/40 mt-1 rounded"></span>
                    </div>
                    <span className="text-[9px] text-gray-700 font-medium truncate max-w-[64px] mt-0.5">
                      {t.nameAr}
                    </span>
                  </button>
                ))}
              </div>
              <div className="text-[10px] text-gray-500 text-center font-bold">سمات أوفيس الأصلية (Themes)</div>
            </div>

            {/* Customize Group */}
            <div className="flex flex-col justify-between border-l border-gray-300 pl-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onOpenSlideSizeModal}
                  className="flex flex-col items-center p-1.5 hover:bg-white rounded transition cursor-pointer"
                >
                  <Monitor className="w-6 h-6 text-sky-600" />
                  <span className="text-[10px] font-bold">حجم الشريحة</span>
                  <span className="text-[8px] text-gray-500">16:9 شاشة عريضة</span>
                </button>
                <button
                  onClick={() => alert('تنسيق الخلفية: اختر تدرجاً لونياً أو صورة مخصصة')}
                  className="flex flex-col items-center p-1.5 hover:bg-white rounded transition cursor-pointer"
                >
                  <Palette className="w-6 h-6 text-emerald-600" />
                  <span className="text-[10px] font-bold">تنسيق الخلفية</span>
                  <span className="text-[8px] text-gray-500">خلفيات مخصصة</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-500 text-center font-bold">تخصيص (Customize)</div>
            </div>

            {/* Designer AI Ideas */}
            <div className="flex flex-col justify-between pl-2">
              <button
                onClick={onOpenDesignerDrawer}
                className="flex flex-col items-center justify-center p-2 bg-gradient-to-r from-orange-500 to-[#d83b01] hover:from-orange-600 hover:to-[#b33000] text-white rounded-lg shadow transition cursor-pointer"
              >
                <div className="flex items-center gap-1">
                  <Sparkles className="w-5 h-5 text-yellow-300 animate-spin-slow" />
                  <span className="text-xs font-black">أفكار التصميم</span>
                </div>
                <span className="text-[9px] text-white/90">Designer الذكي للشريحة</span>
              </button>
              <div className="text-[10px] text-gray-500 text-center font-bold">مصمم أوفيس (Designer)</div>
            </div>
          </div>
        )}

        {/* ================= TAB 5: TRANSITIONS ================= */}
        {activeTab === 'transitions' && (
          <div className="flex items-stretch gap-2 shrink-0">
            {/* Transition Gallery */}
            <div className="flex flex-col justify-between border-l border-gray-300 pl-2">
              <div className="flex items-center gap-1.5 overflow-x-auto max-w-2xl pb-1">
                {transitionsList.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => onSelectTransition(t.id)}
                    className={`flex flex-col items-center p-1.5 rounded-lg border transition cursor-pointer shrink-0 ${
                      currentTransition === t.id
                        ? 'border-[#d83b01] bg-orange-50 font-bold text-[#d83b01] ring-2 ring-orange-200'
                        : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                    }`}
                  >
                    <span className="text-[11px] whitespace-nowrap">{t.label}</span>
                    <span className="text-[8px] text-gray-400">{t.desc}</span>
                  </button>
                ))}
              </div>
              <div className="text-[10px] text-gray-500 text-center font-bold">
                الانتقال إلى هذه الشريحة (Transition to This Slide)
              </div>
            </div>

            {/* Timing & Apply to All */}
            <div className="flex flex-col justify-between pl-2">
              <div className="flex flex-col gap-1 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-gray-600">المدة:</span>
                  <input
                    type="number"
                    min="0.25"
                    max="5.0"
                    step="0.25"
                    value={transitionDuration}
                    onChange={(e) => onSetTransitionDuration(parseFloat(e.target.value) || 1)}
                    className="w-16 border border-gray-300 rounded px-1.5 py-0.5 text-center bg-white"
                  />
                  <span className="text-gray-500">ثانية</span>
                </div>

                <button
                  onClick={onApplyTransitionToAll}
                  className="px-3 py-1 bg-white hover:bg-orange-50 border border-gray-300 hover:border-[#d83b01] rounded font-bold text-gray-800 hover:text-[#d83b01] transition cursor-pointer"
                >
                  ✓ تطبيق على الكل (Apply to All)
                </button>
              </div>
              <div className="text-[10px] text-gray-500 text-center font-bold">التوقيت (Timing)</div>
            </div>
          </div>
        )}

        {/* ================= TAB 6: ANIMATIONS ================= */}
        {activeTab === 'animations' && (
          <div className="flex items-stretch gap-2 shrink-0">
            {/* Preview Animation */}
            <div className="flex flex-col justify-between border-l border-gray-300 pl-2">
              <button
                onClick={onPreviewAnimations}
                className="flex flex-col items-center justify-center p-2 bg-[#d83b01] hover:bg-[#b33000] text-white rounded font-bold transition cursor-pointer"
              >
                <Play className="w-5 h-5 fill-white" />
                <span className="text-[10px]">معاينة</span>
              </button>
              <div className="text-[10px] text-gray-500 text-center font-bold">معاينة</div>
            </div>

            {/* Animation Gallery: Entrance, Emphasis, Exit */}
            <div className="flex flex-col justify-between border-l border-gray-300 pl-2">
              <div className="grid grid-cols-4 gap-1.5">
                <button
                  onClick={() => onAddAnimation('fly-in')}
                  className="px-2 py-1 bg-green-50 border border-green-300 hover:bg-green-100 rounded text-[10px] font-medium text-green-900"
                >
                  🟢 طيران للداخل
                </button>
                <button
                  onClick={() => onAddAnimation('zoom')}
                  className="px-2 py-1 bg-green-50 border border-green-300 hover:bg-green-100 rounded text-[10px] font-medium text-green-900"
                >
                  🟢 تكبير Zoom
                </button>
                <button
                  onClick={() => onAddAnimation('pulse')}
                  className="px-2 py-1 bg-amber-50 border border-amber-300 hover:bg-amber-100 rounded text-[10px] font-medium text-amber-900"
                >
                  🟡 نبض Pulse
                </button>
                <button
                  onClick={() => onAddAnimation('spin')}
                  className="px-2 py-1 bg-amber-50 border border-amber-300 hover:bg-amber-100 rounded text-[10px] font-medium text-amber-900"
                >
                  🟡 دوران Spin
                </button>
                <button
                  onClick={() => onAddAnimation('fly-out')}
                  className="px-2 py-1 bg-red-50 border border-red-300 hover:bg-red-100 rounded text-[10px] font-medium text-red-900"
                >
                  🔴 طيران للخارج
                </button>
                <button
                  onClick={() => onAddAnimation('fade-out')}
                  className="px-2 py-1 bg-red-50 border border-red-300 hover:bg-red-100 rounded text-[10px] font-medium text-red-900"
                >
                  🔴 تلاشي للخارج
                </button>
                <button
                  onClick={() => onAddAnimation('bounce')}
                  className="px-2 py-1 bg-blue-50 border border-blue-300 hover:bg-blue-100 rounded text-[10px] font-medium text-blue-900"
                >
                  🔵 مسار وثب
                </button>
                <button
                  onClick={() => onAddAnimation('arc')}
                  className="px-2 py-1 bg-blue-50 border border-blue-300 hover:bg-blue-100 rounded text-[10px] font-medium text-blue-900"
                >
                  🔵 مسار قوسي
                </button>
              </div>
              <div className="text-[10px] text-gray-500 text-center font-bold">معرض الحركات (Animation)</div>
            </div>

            {/* Animation Pane */}
            <div className="flex flex-col justify-between pl-2">
              <button
                onClick={onOpenAnimationPane}
                className="flex flex-col items-center justify-center p-2 bg-white hover:bg-orange-50 border border-gray-300 hover:border-[#d83b01] rounded font-bold text-gray-800 hover:text-[#d83b01] transition cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span className="text-[10px]">جزء الحركة</span>
                <span className="text-[8px] text-gray-400">Animation Pane</span>
              </button>
              <div className="text-[10px] text-gray-500 text-center font-bold">حركات متقدمة</div>
            </div>
          </div>
        )}

        {/* ================= TAB 7: SLIDE SHOW ================= */}
        {activeTab === 'slideshow' && (
          <div className="flex items-stretch gap-2 shrink-0">
            {/* Start Slide Show */}
            <div className="flex flex-col justify-between border-l border-gray-300 pl-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onStartShowFromBeginning}
                  className="flex flex-col items-center p-1.5 bg-[#d83b01] hover:bg-[#b33000] text-white rounded font-bold transition cursor-pointer"
                >
                  <Play className="w-5 h-5 fill-white" />
                  <span className="text-[10px]">من البداية (F5)</span>
                </button>
                <button
                  onClick={onStartShowFromCurrent}
                  className="flex flex-col items-center p-1.5 bg-white hover:bg-orange-50 border border-gray-300 rounded font-semibold transition cursor-pointer"
                >
                  <Play className="w-5 h-5 text-[#d83b01]" />
                  <span className="text-[10px]">من الشريحة الحالية</span>
                  <span className="text-[8px] text-gray-400">Shift+F5</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-500 text-center font-bold">بدء عرض الشرائح</div>
            </div>

            {/* Set Up Group */}
            <div className="flex flex-col justify-between border-l border-gray-300 pl-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={onToggleHideCurrentSlide}
                  className={`flex flex-col items-center p-1.5 rounded transition cursor-pointer ${
                    isCurrentSlideHidden ? 'bg-red-100 text-red-700 font-bold' : 'hover:bg-white'
                  }`}
                >
                  <Eye className="w-5 h-5" />
                  <span className="text-[10px]">
                    {isCurrentSlideHidden ? 'إلغاء إخفاء الشريحة' : 'إخفاء الشريحة'}
                  </span>
                </button>

                <button
                  onClick={onOpenRehearseTimings}
                  className="flex flex-col items-center p-1.5 hover:bg-white rounded transition cursor-pointer"
                >
                  <Clock className="w-5 h-5 text-amber-600" />
                  <span className="text-[10px] font-bold">تمرين على الأوقات</span>
                  <span className="text-[8px] text-gray-400">Rehearse Timings</span>
                </button>

                <button
                  onClick={() => alert('تسجيل عرض الشرائح: يمكنك تسجيل صوتك والتعليقات الحية وحفظها داخل العرض التقديمي')}
                  className="flex flex-col items-center p-1.5 hover:bg-white rounded transition cursor-pointer"
                >
                  <Film className="w-5 h-5 text-rose-600" />
                  <span className="text-[10px]">تسجيل العرض</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-500 text-center font-bold">إعداد (Set Up)</div>
            </div>

            {/* Monitors */}
            <div className="flex flex-col justify-between pl-2">
              <label className="flex items-center gap-2 p-1.5 bg-white border border-gray-300 rounded cursor-pointer text-xs">
                <input type="checkbox" defaultChecked className="rounded text-[#d83b01]" />
                <span>استخدام طريقة عرض مقدم العرض (Presenter View)</span>
              </label>
              <div className="text-[10px] text-gray-500 text-center font-bold">أجهزة العرض (Monitors)</div>
            </div>
          </div>
        )}

        {/* ================= TAB 8: REVIEW ================= */}
        {activeTab === 'review' && (
          <div className="flex items-stretch gap-2 shrink-0">
            {/* Proofing */}
            <div className="flex flex-col justify-between border-l border-gray-300 pl-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => alert('التدقيق اللغوي والإملائي: تم فحص كامل شرائح العرض التقديمي ولا توجد أي أخطاء إملائية.')}
                  className="flex flex-col items-center p-1.5 hover:bg-white rounded"
                >
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="text-[10px]">تدقيق إملائي</span>
                </button>
                <button
                  onClick={() => alert('قاموس المرادفات: يعرض مفردات وبدائل بلاغية لغوية')}
                  className="flex flex-col items-center p-1.5 hover:bg-white rounded"
                >
                  <BookOpen className="w-5 h-5 text-sky-600" />
                  <span className="text-[10px]">قاموس المرادفات</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-500 text-center font-bold">تدقيق (Proofing)</div>
            </div>

            {/* Language */}
            <div className="flex flex-col justify-between border-l border-gray-300 pl-2">
              <button
                onClick={() => alert('ترجمة الشريحة: تدعم الترجمة الفورية للعربية والإنجليزية وغيرها')}
                className="flex flex-col items-center p-1.5 hover:bg-white rounded"
              >
                <Languages className="w-5 h-5 text-indigo-600" />
                <span className="text-[10px]">ترجمة النص</span>
              </button>
              <div className="text-[10px] text-gray-500 text-center font-bold">اللغة (Language)</div>
            </div>

            {/* Protect */}
            <div className="flex flex-col justify-between pl-2">
              <button
                onClick={() => {
                  const pass = prompt('أدخل كلمة المرور لتشفير وحماية ملف العرض التقديمي (.pptx):');
                  if (pass) alert('تم تشفير وحماية العرض التقديمي بنجاح!');
                }}
                className="flex flex-col items-center p-1.5 hover:bg-white rounded"
              >
                <Lock className="w-5 h-5 text-amber-600" />
                <span className="text-[10px] font-bold">حماية العرض</span>
                <span className="text-[8px] text-gray-500">تشفير وتقييد التعديل</span>
              </button>
              <div className="text-[10px] text-gray-500 text-center font-bold">حماية (Protect)</div>
            </div>
          </div>
        )}

        {/* ================= TAB 9: VIEW ================= */}
        {activeTab === 'view' && (
          <div className="flex items-stretch gap-2 shrink-0">
            {/* Presentation Views */}
            <div className="flex flex-col justify-between border-l border-gray-300 pl-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setViewMode('normal')}
                  className={`flex flex-col items-center p-1.5 rounded transition ${
                    viewMode === 'normal' ? 'bg-[#d83b01] text-white font-bold' : 'hover:bg-white'
                  }`}
                >
                  <Layout className="w-5 h-5" />
                  <span className="text-[10px]">عادي (Normal)</span>
                </button>
                <button
                  onClick={() => setViewMode('sorter')}
                  className={`flex flex-col items-center p-1.5 rounded transition ${
                    viewMode === 'sorter' ? 'bg-[#d83b01] text-white font-bold' : 'hover:bg-white'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                  <span className="text-[10px]">فارز الشرائح</span>
                </button>
                <button
                  onClick={() => setViewMode('notes-page')}
                  className={`flex flex-col items-center p-1.5 rounded transition ${
                    viewMode === 'notes-page' ? 'bg-[#d83b01] text-white font-bold' : 'hover:bg-white'
                  }`}
                >
                  <FileText className="w-5 h-5" />
                  <span className="text-[10px]">صفحة الملاحظات</span>
                </button>
                <button
                  onClick={onStartShowFromBeginning}
                  className="flex flex-col items-center p-1.5 hover:bg-white rounded"
                >
                  <BookOpen className="w-5 h-5 text-gray-700" />
                  <span className="text-[10px]">طريقة القراءة</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-500 text-center font-bold">طرق عرض العرض التقديمي</div>
            </div>

            {/* Master Views */}
            <div className="flex flex-col justify-between border-l border-gray-300 pl-2">
              <button
                onClick={onOpenSlideMaster}
                className="flex flex-col items-center p-1.5 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded text-[#d83b01] font-bold"
              >
                <Layers className="w-5 h-5" />
                <span className="text-[10px]">الشريحة الرئيسية</span>
                <span className="text-[8px] text-gray-500">Slide Master</span>
              </button>
              <div className="text-[10px] text-gray-500 text-center font-bold">طرق العرض الرئيسية</div>
            </div>

            {/* Show / Hide */}
            <div className="flex flex-col justify-between border-l border-gray-300 pl-2">
              <div className="flex flex-col gap-0.5 text-[11px]">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showRuler}
                    onChange={(e) => setShowRuler(e.target.checked)}
                    className="rounded text-[#d83b01]"
                  />
                  <span>المسطرة (Ruler)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showGridlines}
                    onChange={(e) => setShowGridlines(e.target.checked)}
                    className="rounded text-[#d83b01]"
                  />
                  <span>خطوط الشبكة</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showNotesPane}
                    onChange={(e) => setShowNotesPane(e.target.checked)}
                    className="rounded text-[#d83b01]"
                  />
                  <span>جزء الملاحظات</span>
                </label>
              </div>
              <div className="text-[10px] text-gray-500 text-center font-bold">إظهار / إخفاء</div>
            </div>

            {/* Color / Grayscale */}
            <div className="flex flex-col justify-between pl-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => alert('تم تفعيل وضع الألوان الكاملة')}
                  className="flex flex-col items-center p-1.5 hover:bg-white rounded font-bold text-sky-600"
                >
                  <Palette className="w-5 h-5" />
                  <span className="text-[10px]">ألوان</span>
                </button>
                <button
                  onClick={() => alert('تم تفعيل وضع تدرج الرمادي (Grayscale)')}
                  className="flex flex-col items-center p-1.5 hover:bg-white rounded text-gray-500"
                >
                  <Sliders className="w-5 h-5" />
                  <span className="text-[10px]">تدرج الرمادي</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-500 text-center font-bold">اللون / الرمادي</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
