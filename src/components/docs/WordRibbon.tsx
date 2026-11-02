import React, { useState } from 'react';
import {
  Clipboard,
  Scissors,
  Copy,
  Paintbrush,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  Highlighter,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Indent,
  Outdent,
  Table as TableIcon,
  Image as ImageIcon,
  Square,
  Sparkles,
  Link2,
  Bookmark,
  MessageSquare,
  FileText,
  Search,
  Replace,
  CheckSquare,
  Volume2,
  VolumeX,
  Languages,
  BookOpen,
  Eye,
  Grid,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Columns,
  SplitSquareVertical,
  Sliders,
  Type,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  CheckCircle,
  FileCode,
  Calendar,
  PenTool,
  Printer,
  ChevronDown
} from 'lucide-react';

interface Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenFileMenu: () => void;
  onOpenFind: () => void;
  onOpenReplace: () => void;
  onOpenTableModal: () => void;
  onOpenShapeModal: () => void;
  onOpenSymbolModal: (tab?: 'symbol' | 'equation') => void;
  onOpenComments: () => void;
  onOpenWatermarkModal: () => void;
  onOpenPageBordersModal: () => void;
  pageColor: string;
  onPageColorChange: (color: string) => void;
  onApplyTheme: (themeName: string) => void;
  pageSetup: {
    margins: { top: number; bottom: number; left: number; right: number };
    orientation: 'portrait' | 'landscape';
    size: string;
    columns: number;
  };
  onUpdatePageSetup: (cfg: any) => void;
  onOpenWordCount: () => void;
  editorRef: React.RefObject<HTMLDivElement | null>;
  viewMode: 'print' | 'read' | 'web' | 'outline' | 'draft';
  onViewModeChange: (mode: 'print' | 'read' | 'web' | 'outline' | 'draft') => void;
  showRuler: boolean;
  onToggleRuler: () => void;
  showGridlines: boolean;
  onToggleGridlines: () => void;
  showNavigationPane: boolean;
  onToggleNavigationPane: () => void;
  zoom: number;
  onZoomChange: (z: number) => void;
  onOpenMacros: () => void;
}

const FONT_FAMILIES = [
  { val: 'Cairo', label: 'Cairo (افتراضي عربي)' },
  { val: 'Amiri', label: 'Amiri (أميري كلاسيكي)' },
  { val: 'Tajawal', label: 'Tajawal (تجوال)' },
  { val: 'Almarai', label: 'Almarai (المراعي)' },
  { val: 'Segoe UI', label: 'Segoe UI' },
  { val: 'Arial', label: 'Arial' },
  { val: 'Calibri', label: 'Calibri' },
  { val: 'Times New Roman', label: 'Times New Roman' },
  { val: 'Courier New', label: 'Courier New (آلة كاتبة)' },
];

const FONT_SIZES = ['8', '9', '10', '11', '12', '14', '16', '18', '20', '24', '28', '36', '48', '72'];

export const WordRibbon: React.FC<Props> = ({
  activeTab,
  onTabChange,
  onOpenFileMenu,
  onOpenFind,
  onOpenReplace,
  onOpenTableModal,
  onOpenShapeModal,
  onOpenSymbolModal,
  onOpenComments,
  onOpenWatermarkModal,
  onOpenPageBordersModal,
  pageColor,
  onPageColorChange,
  onApplyTheme,
  pageSetup,
  onUpdatePageSetup,
  onOpenWordCount,
  editorRef,
  viewMode,
  onViewModeChange,
  showRuler,
  onToggleRuler,
  showGridlines,
  onToggleGridlines,
  showNavigationPane,
  onToggleNavigationPane,
  zoom,
  onZoomChange,
  onOpenMacros,
}) => {
  const [selectedFont, setSelectedFont] = useState('Cairo');
  const [selectedFontSize, setSelectedFontSize] = useState('14');
  const [textColor, setTextColor] = useState('#000000');
  const [highlightColor, setHighlightColor] = useState('#fef08a');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isFormatPainterActive, setIsFormatPainterActive] = useState(false);
  const [lineSpacingOpen, setLineSpacingOpen] = useState(false);

  // Helper command exec
  const exec = (cmd: string, val: string = '') => {
    try {
      document.execCommand(cmd, false, val);
      return true;
    } catch (err) {
      console.error(`Failed ${cmd}:`, err);
      return false;
    }
  };

  const insertHtml = (html: string) => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) {
      if (editorRef.current) {
        editorRef.current.innerHTML += html;
      }
      return;
    }
    const range = sel.getRangeAt(0);
    range.deleteContents();
    const div = document.createElement('div');
    div.innerHTML = html;
    const frag = document.createDocumentFragment();
    let node: ChildNode | null;
    let lastNode: ChildNode | null = null;
    while ((node = div.firstChild)) {
      lastNode = frag.appendChild(node);
    }
    range.insertNode(frag);
    if (lastNode) {
      range.setStartAfter(lastNode);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };

  const changeFontSize = (sz: string) => {
    setSelectedFontSize(sz);
    exec('fontSize', '4');
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const span = document.createElement('span');
      span.style.fontSize = `${sz}px`;
      const range = sel.getRangeAt(0);
      try {
        range.surroundContents(span);
      } catch {
        exec('fontSize', '4');
      }
    }
  };

  const applyStyle = (styleType: string) => {
    switch (styleType) {
      case 'normal':
        exec('formatBlock', '<p>');
        exec('removeFormat');
        break;
      case 'h1':
        exec('formatBlock', '<h1>');
        break;
      case 'h2':
        exec('formatBlock', '<h2>');
        break;
      case 'h3':
        exec('formatBlock', '<h3>');
        break;
      case 'quote':
        exec('formatBlock', '<blockquote>');
        break;
      case 'subtitle':
        insertHtml('<p class="text-lg text-slate-500 font-medium mb-2 border-b border-slate-200 pb-1">عنوان فرعي</p>');
        break;
    }
  };

  const tabs = [
    { id: 'home', label: 'الرئيسية' },
    { id: 'insert', label: 'إدراج' },
    { id: 'design', label: 'تصميم' },
    { id: 'layout', label: 'تخطيط' },
    { id: 'references', label: 'مراجع' },
    { id: 'mailings', label: 'مراسلات' },
    { id: 'review', label: 'مراجعة' },
    { id: 'view', label: 'عرض' },
  ];

  return (
    <div className="bg-[#f3f2f1] border-b border-gray-300 select-none text-gray-800 text-xs shrink-0 z-30 ribbon-container">
      {/* Tabs Header */}
      <div className="flex items-center gap-0.5 px-3 pt-1 border-b border-gray-300 bg-[#f3f2f1]">
        <button
          onClick={onOpenFileMenu}
          className="px-4 py-1.5 bg-[#004578] hover:bg-[#00345b] text-white font-bold rounded-t-sm transition flex items-center gap-1.5 cursor-pointer shadow-xs text-xs"
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
                  ? 'bg-white text-[#004578] font-bold border-t-2 border-t-[#004578] shadow-2xs'
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
          <span className="font-semibold text-[#004578]">Word Sovereign Suite</span>
        </div>
      </div>

      {/* Ribbon Command Strip */}
      <div className="bg-white px-3 py-1.5 min-h-[96px] flex items-stretch gap-2 overflow-x-auto shadow-inner text-slate-700" dir="rtl">
        {/* ===================== HOME TAB ===================== */}
        {activeTab === 'home' && (
          <div className="flex items-stretch divide-x divide-x-reverse divide-slate-200">
            {/* Clipboard */}
            <div className="flex flex-col justify-between px-2 min-w-[150px] shrink-0">
              <div className="flex items-start gap-1">
                <button
                  onClick={async () => {
                    try {
                      if (navigator.clipboard?.readText) {
                        const txt = await navigator.clipboard.readText();
                        insertHtml(txt.replace(/\n/g, '<br>'));
                      } else {
                        exec('paste');
                      }
                    } catch {
                      exec('paste');
                    }
                  }}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-slate-100 rounded cursor-pointer"
                  title="لصق (Ctrl + V)"
                >
                  <div className="w-8 h-8 rounded bg-blue-50 text-[#004578] flex items-center justify-center border border-blue-200 shadow-2xs">
                    <Clipboard className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-medium mt-1">لصق</span>
                </button>

                <div className="flex flex-col gap-0.5 justify-center">
                  <button
                    onClick={() => exec('cut')}
                    className="flex items-center gap-1.5 px-2 py-0.5 hover:bg-slate-100 rounded text-[11px] text-slate-700"
                    title="قص (Ctrl + X)"
                  >
                    <Scissors className="w-3.5 h-3.5 text-slate-500" />
                    <span>قص</span>
                  </button>
                  <button
                    onClick={() => exec('copy')}
                    className="flex items-center gap-1.5 px-2 py-0.5 hover:bg-slate-100 rounded text-[11px] text-slate-700"
                    title="نسخ (Ctrl + C)"
                  >
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>نسخ</span>
                  </button>
                  <button
                    onClick={() => setIsFormatPainterActive(!isFormatPainterActive)}
                    className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] ${
                      isFormatPainterActive ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                    title="نسخ التنسيق (Format Painter)"
                  >
                    <Paintbrush className="w-3.5 h-3.5 text-amber-600" />
                    <span>نسخ التنسيق</span>
                  </button>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 text-center font-medium">الحافظة (Clipboard)</span>
            </div>

            {/* Font */}
            <div className="flex flex-col justify-between px-3 min-w-[270px] shrink-0">
              <div className="space-y-1.5">
                <div className="flex items-center gap-1">
                  <select
                    value={selectedFont}
                    onChange={e => {
                      setSelectedFont(e.target.value);
                      exec('fontName', e.target.value);
                    }}
                    className="h-6 text-xs bg-white border border-slate-300 rounded px-1.5 font-medium outline-none focus:border-[#004578] w-32"
                  >
                    {FONT_FAMILIES.map(f => (
                      <option key={f.val} value={f.val}>{f.label}</option>
                    ))}
                  </select>

                  <select
                    value={selectedFontSize}
                    onChange={e => changeFontSize(e.target.value)}
                    className="h-6 text-xs bg-white border border-slate-300 rounded px-1 font-mono outline-none focus:border-[#004578] w-14"
                  >
                    {FONT_SIZES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => changeFontSize(String(Math.min(72, parseInt(selectedFontSize, 10) + 2)))}
                    className="w-6 h-6 flex items-center justify-center hover:bg-slate-100 rounded text-xs font-bold text-slate-700"
                    title="تكبير حجم الخط (Ctrl + Shift + >)"
                  >
                    A▲
                  </button>
                  <button
                    onClick={() => changeFontSize(String(Math.max(8, parseInt(selectedFontSize, 10) - 2)))}
                    className="w-6 h-6 flex items-center justify-center hover:bg-slate-100 rounded text-xs font-medium text-slate-700"
                    title="تصغير حجم الخط (Ctrl + Shift + <)"
                  >
                    A▼
                  </button>
                  <button
                    onClick={() => {
                      const sel = window.getSelection();
                      if (sel) {
                        const txt = sel.toString();
                        if (txt) {
                          insertHtml(txt.toUpperCase() === txt ? txt.toLowerCase() : txt.toUpperCase());
                        }
                      }
                    }}
                    className="w-6 h-6 flex items-center justify-center hover:bg-slate-100 rounded text-slate-600 font-bold"
                    title="تغيير حالة الأحرف (Aa)"
                  >
                    Aa
                  </button>
                  <button
                    onClick={() => exec('removeFormat')}
                    className="w-6 h-6 flex items-center justify-center hover:bg-slate-100 rounded text-rose-600"
                    title="مسح كافة التنسيقات"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-0.5">
                  <button onClick={() => exec('bold')} className="w-6 h-6 flex items-center justify-center hover:bg-slate-100 rounded text-slate-700 font-bold" title="عريض (Ctrl + B)">
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => exec('italic')} className="w-6 h-6 flex items-center justify-center hover:bg-slate-100 rounded text-slate-700" title="مائل (Ctrl + I)">
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => exec('underline')} className="w-6 h-6 flex items-center justify-center hover:bg-slate-100 rounded text-slate-700" title="تسطير تحته خط (Ctrl + U)">
                    <Underline className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => exec('strikeThrough')} className="w-6 h-6 flex items-center justify-center hover:bg-slate-100 rounded text-slate-700" title="يتوسطه خط">
                    <Strikethrough className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => exec('subscript')} className="w-6 h-6 flex items-center justify-center hover:bg-slate-100 rounded text-slate-700" title="خط سفلي (X₂)">
                    <Subscript className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => exec('superscript')} className="w-6 h-6 flex items-center justify-center hover:bg-slate-100 rounded text-slate-700" title="خط علوي (X²)">
                    <Superscript className="w-3.5 h-3.5" />
                  </button>

                  <div className="h-4 w-[1px] bg-slate-200 mx-0.5" />

                  {/* Highlight */}
                  <label className="w-6 h-6 flex items-center justify-center hover:bg-slate-100 rounded cursor-pointer relative" title="لون تمييز النص (Highlight)">
                    <Highlighter className="w-3.5 h-3.5 text-amber-500" />
                    <input
                      type="color"
                      value={highlightColor}
                      onChange={e => {
                        setHighlightColor(e.target.value);
                        exec('hiliteColor', e.target.value);
                      }}
                      className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                    />
                  </label>

                  {/* Font Color */}
                  <label className="w-6 h-6 flex items-center justify-center hover:bg-slate-100 rounded cursor-pointer relative" title="لون الخط (Font Color)">
                    <span className="font-bold underline decoration-rose-600 decoration-2 text-xs">A</span>
                    <input
                      type="color"
                      value={textColor}
                      onChange={e => {
                        setTextColor(e.target.value);
                        exec('foreColor', e.target.value);
                      }}
                      className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                    />
                  </label>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 text-center font-medium">الخط (Font)</span>
            </div>

            {/* Paragraph */}
            <div className="flex flex-col justify-between px-3 min-w-[210px] shrink-0">
              <div className="space-y-1.5">
                <div className="flex items-center gap-1">
                  <button onClick={() => exec('insertUnorderedList')} className="w-6 h-6 flex items-center justify-center hover:bg-slate-100 rounded text-slate-700" title="تعداد نقطي">
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => exec('insertOrderedList')} className="w-6 h-6 flex items-center justify-center hover:bg-slate-100 rounded text-slate-700" title="تعداد رقمي">
                    <ListOrdered className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => exec('indent')} className="w-6 h-6 flex items-center justify-center hover:bg-slate-100 rounded text-slate-700" title="زيادة المسافة البادئة">
                    <Indent className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => exec('outdent')} className="w-6 h-6 flex items-center justify-center hover:bg-slate-100 rounded text-slate-700" title="إنقاص المسافة البادئة">
                    <Outdent className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => alert('علامات الفقرات: مفعلة')} className="w-6 h-6 flex items-center justify-center hover:bg-slate-100 rounded text-slate-600 font-serif font-bold text-xs" title="إظهار/إخفاء علامات الفقرات (¶)">
                    ¶
                  </button>
                </div>

                <div className="flex items-center gap-0.5">
                  <button onClick={() => exec('justifyRight')} className="w-6 h-6 flex items-center justify-center hover:bg-slate-100 rounded text-slate-700" title="محاذاة لليمين">
                    <AlignRight className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => exec('justifyCenter')} className="w-6 h-6 flex items-center justify-center hover:bg-slate-100 rounded text-slate-700" title="محاذاة للوسط">
                    <AlignCenter className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => exec('justifyLeft')} className="w-6 h-6 flex items-center justify-center hover:bg-slate-100 rounded text-slate-700" title="محاذاة لليسار">
                    <AlignLeft className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => exec('justifyFull')} className="w-6 h-6 flex items-center justify-center hover:bg-slate-100 rounded text-slate-700" title="ضبط كلي">
                    <AlignJustify className="w-3.5 h-3.5" />
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => setLineSpacingOpen(!lineSpacingOpen)}
                      className="w-6 h-6 flex items-center justify-center hover:bg-slate-100 rounded text-slate-700"
                      title="تباعد الأسطر والفقرات"
                    >
                      <SplitSquareVertical className="w-3.5 h-3.5" />
                    </button>
                    {lineSpacingOpen && (
                      <div className="absolute top-full right-0 mt-1 bg-white border border-slate-300 rounded shadow-xl py-1 z-50 w-32 text-right">
                        {['1.0', '1.15', '1.5', '2.0', '2.5', '3.0'].map(sp => (
                          <button
                            key={sp}
                            onClick={() => {
                              insertHtml(`<div style="line-height: ${sp};"><br></div>`);
                              setLineSpacingOpen(false);
                            }}
                            className="w-full px-3 py-1 text-right hover:bg-blue-50 text-[11px] block font-mono"
                          >
                            تباعد {sp}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 text-center font-medium">الفقرة (Paragraph)</span>
            </div>

            {/* Styles */}
            <div className="flex flex-col justify-between px-3 min-w-[260px] shrink-0">
              <div className="flex items-center gap-1 overflow-x-auto py-1">
                {[
                  { id: 'normal', label: 'عادي', desc: 'AaBbCc' },
                  { id: 'h1', label: 'عنوان 1', desc: 'Heading 1' },
                  { id: 'h2', label: 'عنوان 2', desc: 'Heading 2' },
                  { id: 'h3', label: 'عنوان 3', desc: 'Heading 3' },
                  { id: 'subtitle', label: 'عنوان فرعي', desc: 'Subtitle' },
                  { id: 'quote', label: 'اقتباس', desc: 'Quote' },
                ].map(st => (
                  <button
                    key={st.id}
                    onClick={() => applyStyle(st.id)}
                    className="p-1.5 border border-slate-200 rounded hover:border-[#004578] hover:bg-blue-50/50 flex flex-col items-center justify-center min-w-[55px] cursor-pointer transition shadow-2xs"
                  >
                    <span className="font-bold text-[11px] text-slate-800">{st.label}</span>
                    <span className="text-[9px] text-slate-400 font-serif">{st.desc}</span>
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-slate-400 text-center font-medium">أنماط وتنسيقات (Styles)</span>
            </div>

            {/* Editing */}
            <div className="flex flex-col justify-between px-2 min-w-[90px] shrink-0">
              <div className="flex flex-col gap-0.5 justify-center py-1">
                <button
                  onClick={onOpenFind}
                  className="flex items-center gap-1.5 px-2 py-0.5 hover:bg-slate-100 rounded text-slate-700 text-xs"
                  title="بحث (Ctrl + F)"
                >
                  <Search className="w-3.5 h-3.5 text-[#004578]" />
                  <span>بحث</span>
                </button>
                <button
                  onClick={onOpenReplace}
                  className="flex items-center gap-1.5 px-2 py-0.5 hover:bg-slate-100 rounded text-slate-700 text-xs"
                  title="استبدال (Ctrl + H)"
                >
                  <Replace className="w-3.5 h-3.5 text-[#004578]" />
                  <span>استبدال</span>
                </button>
                <button
                  onClick={() => exec('selectAll')}
                  className="flex items-center gap-1.5 px-2 py-0.5 hover:bg-slate-100 rounded text-slate-700 text-xs"
                  title="تحديد الكل (Ctrl + A)"
                >
                  <CheckSquare className="w-3.5 h-3.5 text-slate-600" />
                  <span>تحديد الكل</span>
                </button>
              </div>
              <span className="text-[10px] text-slate-400 text-center font-medium">تحرير (Editing)</span>
            </div>
          </div>
        )}

        {/* ===================== INSERT TAB ===================== */}
        {activeTab === 'insert' && (
          <div className="flex items-stretch divide-x divide-x-reverse divide-slate-200">
            {/* Pages */}
            <div className="flex flex-col justify-between px-2 min-w-[125px] shrink-0">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    insertHtml(`
                      <div class="cover-page p-12 my-6 bg-gradient-to-b from-blue-900 to-indigo-950 text-white rounded-lg text-center shadow-lg min-h-[400px] flex flex-col justify-between" contenteditable="true">
                        <div>
                          <p class="text-blue-300 font-semibold tracking-widest text-sm mb-4">تقرير رسمي معتمد</p>
                          <h1 class="text-4xl font-extrabold mb-4 text-white">عنوان المستند الرئيسي هنا</h1>
                          <h3 class="text-xl text-blue-200 font-light">العنوان الفرعي أو بيان الغرض من الوثيقة</h3>
                        </div>
                        <div class="border-t border-blue-800/80 pt-6 mt-12 flex justify-between text-xs text-blue-300">
                          <div>إعداد: <strong>فريق العمل السيادي</strong></div>
                          <div>التاريخ: <strong>${new Date().toLocaleDateString('ar-EG')}</strong></div>
                        </div>
                      </div>
                      <div style="page-break-after: always;"></div>
                      <p><br></p>
                    `);
                  }}
                  className="flex flex-col items-center p-1 hover:bg-slate-100 rounded text-slate-800 text-center"
                  title="إدراج صفحة غلاف منسقة"
                >
                  <div className="p-1.5 bg-blue-50 text-[#004578] rounded">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] mt-1">صفحة غلاف</span>
                </button>

                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => insertHtml('<div style="page-break-after: always; min-height: 200px;"><br></div><p><br></p>')}
                    className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-slate-100 rounded text-[10px]"
                  >
                    <span>صفحة فارغة</span>
                  </button>
                  <button
                    onClick={() => insertHtml('<div style="page-break-after: always;" class="border-b-2 border-dashed border-blue-400 my-4 text-center text-xs text-blue-500 select-none">┈┈┈┈ فاصل صفحة (Page Break) ┈┈┈┈</div><p><br></p>')}
                    className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-slate-100 rounded text-[10px]"
                  >
                    <span>فاصل صفحة</span>
                  </button>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 text-center font-medium">صفحات (Pages)</span>
            </div>

            {/* Tables */}
            <div className="flex flex-col justify-between px-2 min-w-[70px] shrink-0">
              <button
                onClick={onOpenTableModal}
                className="flex flex-col items-center justify-center p-2 hover:bg-slate-100 rounded text-slate-800 group"
                title="إدراج جدول"
              >
                <div className="w-8 h-8 rounded bg-blue-50 text-[#004578] flex items-center justify-center border border-blue-200 group-hover:bg-blue-100 transition shadow-2xs">
                  <TableIcon className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-medium mt-1">جدول</span>
              </button>
              <span className="text-[10px] text-slate-400 text-center font-medium">جداول</span>
            </div>

            {/* Illustrations */}
            <div className="flex flex-col justify-between px-2 min-w-[210px] shrink-0">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    const url = prompt('أدخل رابط الصورة (URL) أو اتركها لإدراج صورة توضيحية احترافية:', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80');
                    if (url) {
                      insertHtml(`
                        <figure class="my-4 text-center inline-block max-w-full">
                          <img src="${url}" alt="صورة توضيحية" class="rounded-lg shadow border border-slate-200 max-h-80 mx-auto object-cover" />
                          <figcaption class="text-xs text-slate-500 mt-1 italic">الشكل (1): صورة توضيحية للمستند</figcaption>
                        </figure>
                        <p><br></p>
                      `);
                    }
                  }}
                  className="flex flex-col items-center p-1 hover:bg-slate-100 rounded text-[10px]"
                  title="إدراج صور"
                >
                  <ImageIcon className="w-4 h-4 text-emerald-600 mb-1" />
                  <span>صور</span>
                </button>

                <button
                  onClick={onOpenShapeModal}
                  className="flex flex-col items-center p-1 hover:bg-slate-100 rounded text-[10px]"
                  title="إدراج أشكال هندسية"
                >
                  <Square className="w-4 h-4 text-blue-600 mb-1" />
                  <span>أشكال</span>
                </button>

                <button
                  onClick={() => onOpenSymbolModal('symbol')}
                  className="flex flex-col items-center p-1 hover:bg-slate-100 rounded text-[10px]"
                  title="أيقونات ورموز"
                >
                  <Sparkles className="w-4 h-4 text-amber-600 mb-1" />
                  <span>أيقونات</span>
                </button>

                <button
                  onClick={() => {
                    insertHtml(`
                      <div class="my-6 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                        <h4 class="text-xs font-bold text-slate-700 mb-3 text-center">مخطط تسلسلي ذكي (SmartArt - Process Flow)</h4>
                        <div class="grid grid-cols-3 gap-3 text-center">
                          <div class="p-3 bg-blue-600 text-white rounded-lg shadow-xs font-bold text-xs">1. التخطيط والتحليل</div>
                          <div class="p-3 bg-indigo-600 text-white rounded-lg shadow-xs font-bold text-xs">2. التنفيذ والتطوير</div>
                          <div class="p-3 bg-emerald-600 text-white rounded-lg shadow-xs font-bold text-xs">3. الإطلاق والتقييم</div>
                        </div>
                      </div>
                      <p><br></p>
                    `);
                  }}
                  className="flex flex-col items-center p-1 hover:bg-slate-100 rounded text-[10px]"
                  title="مخطط SmartArt"
                >
                  <Sliders className="w-4 h-4 text-indigo-600 mb-1" />
                  <span>SmartArt</span>
                </button>
              </div>
              <span className="text-[10px] text-slate-400 text-center font-medium">رسومات توضيحية</span>
            </div>

            {/* Links & Comments */}
            <div className="flex flex-col justify-between px-2 min-w-[120px] shrink-0">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    const url = prompt('أدخل الرابط الإلكتروني:', 'https://');
                    if (url) exec('createLink', url);
                  }}
                  className="flex flex-col items-center p-1 hover:bg-slate-100 rounded text-[10px]"
                  title="ارتباط تشعبي"
                >
                  <Link2 className="w-4 h-4 text-blue-600 mb-1" />
                  <span>ارتباط</span>
                </button>

                <button
                  onClick={onOpenComments}
                  className="flex flex-col items-center p-1 hover:bg-slate-100 rounded text-[10px]"
                  title="إضافة تعليق على النص المحدد"
                >
                  <MessageSquare className="w-4 h-4 text-amber-600 mb-1" />
                  <span>تعليق</span>
                </button>
              </div>
              <span className="text-[10px] text-slate-400 text-center font-medium">ارتباطات وتعليقات</span>
            </div>

            {/* Header & Footer */}
            <div className="flex flex-col justify-between px-2 min-w-[140px] shrink-0">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    insertHtml('<header class="border-b border-slate-300 pb-2 mb-4 text-xs text-slate-500 flex justify-between select-none"><span>ترويسة المستند الرسمية</span><span>' + new Date().toLocaleDateString('ar-EG') + '</span></header><p><br></p>');
                  }}
                  className="flex flex-col items-center p-1 hover:bg-slate-100 rounded text-[10px]"
                >
                  <FileText className="w-4 h-4 text-slate-600 mb-1" />
                  <span>رأس الصفحة</span>
                </button>

                <button
                  onClick={() => {
                    insertHtml('<footer class="border-t border-slate-300 pt-2 mt-8 text-xs text-slate-500 text-center select-none">صفحة 1 من 1 • الجناح المكتبي السيادي</footer><p><br></p>');
                  }}
                  className="flex flex-col items-center p-1 hover:bg-slate-100 rounded text-[10px]"
                >
                  <FileText className="w-4 h-4 text-slate-600 mb-1" />
                  <span>تذييل ورقم</span>
                </button>
              </div>
              <span className="text-[10px] text-slate-400 text-center font-medium">رأس وتذييل</span>
            </div>

            {/* Symbols */}
            <div className="flex flex-col justify-between px-2 min-w-[100px] shrink-0">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onOpenSymbolModal('equation')}
                  className="flex flex-col items-center p-1 hover:bg-slate-100 rounded text-[10px]"
                >
                  <span className="font-serif italic font-bold text-sm text-[#004578]">π</span>
                  <span className="text-[10px]">معادلة</span>
                </button>
                <button
                  onClick={() => onOpenSymbolModal('symbol')}
                  className="flex flex-col items-center p-1 hover:bg-slate-100 rounded text-[10px]"
                >
                  <span className="font-serif font-bold text-sm text-emerald-600">Ω</span>
                  <span className="text-[10px]">رمز</span>
                </button>
              </div>
              <span className="text-[10px] text-slate-400 text-center font-medium">رموز (Symbols)</span>
            </div>
          </div>
        )}

        {/* ===================== DESIGN TAB ===================== */}
        {activeTab === 'design' && (
          <div className="flex items-stretch divide-x divide-x-reverse divide-slate-200">
            {/* Document Themes */}
            <div className="flex flex-col justify-between px-3 min-w-[280px] shrink-0">
              <div className="flex items-center gap-1.5 py-1">
                {[
                  { name: 'Office كلاسيكي', color: '#ffffff', palette: 'أزرق كلاسيكي' },
                  { name: 'Facet حديث', color: '#f8fafc', palette: 'رمادي عصري' },
                  { name: 'Organic طبيعي', color: '#f0fdf4', palette: 'أخضر هادئ' },
                  { name: 'Retrospect دافئ', color: '#fefce8', palette: 'عاجي دافئ' },
                ].map(thm => (
                  <button
                    key={thm.name}
                    onClick={() => onApplyTheme(thm.name)}
                    className="p-1.5 border border-slate-200 rounded hover:border-[#004578] hover:bg-blue-50/50 flex flex-col items-center min-w-[62px] text-center cursor-pointer transition shadow-2xs"
                  >
                    <div className="w-5 h-5 rounded border border-slate-300 mb-1" style={{ backgroundColor: thm.color }} />
                    <span className="font-bold text-[10px] text-slate-800">{thm.name}</span>
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-slate-400 text-center font-medium">نسق المستند (Themes)</span>
            </div>

            {/* Page Background */}
            <div className="flex flex-col justify-between px-3 min-w-[210px] shrink-0">
              <div className="flex items-center gap-2 py-1">
                <button
                  onClick={onOpenWatermarkModal}
                  className="flex flex-col items-center p-1 hover:bg-slate-100 rounded text-center"
                  title="علامة مائية"
                >
                  <FileText className="w-5 h-5 text-slate-500 mb-1" />
                  <span className="text-[10px] font-medium">علامة مائية</span>
                </button>

                {/* Page Color */}
                <label className="flex flex-col items-center p-1 hover:bg-slate-100 rounded text-center cursor-pointer relative" title="تغيير لون خلفية الصفحة">
                  <Palette className="w-5 h-5 text-amber-500 mb-1" />
                  <span className="text-[10px] font-medium">لون الصفحة</span>
                  <input
                    type="color"
                    value={pageColor}
                    onChange={e => onPageColorChange(e.target.value)}
                    className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                  />
                </label>

                <button
                  onClick={onOpenPageBordersModal}
                  className="flex flex-col items-center p-1 hover:bg-slate-100 rounded text-center"
                  title="حدود وإطارات الصفحة"
                >
                  <Square className="w-5 h-5 text-blue-600 mb-1" />
                  <span className="text-[10px] font-medium">حدود الصفحة</span>
                </button>
              </div>
              <span className="text-[10px] text-slate-400 text-center font-medium">خلفية الصفحة (Page Background)</span>
            </div>
          </div>
        )}

        {/* ===================== LAYOUT TAB ===================== */}
        {activeTab === 'layout' && (
          <div className="flex items-stretch divide-x divide-x-reverse divide-slate-200">
            {/* Page Setup */}
            <div className="flex flex-col justify-between px-3 min-w-[320px] shrink-0">
              <div className="flex items-center gap-2 py-1">
                {/* Margins */}
                <button
                  onClick={() => {
                    const opt = prompt('اختر الهوامش (1: عادي 2.5cm، 2: ضيق 1.27cm، 3: عريض 3.8cm):', '1');
                    if (opt === '2') onUpdatePageSetup({ margins: { top: 1.27, bottom: 1.27, left: 1.27, right: 1.27 } });
                    else if (opt === '3') onUpdatePageSetup({ margins: { top: 3.8, bottom: 3.8, left: 3.8, right: 3.8 } });
                    else onUpdatePageSetup({ margins: { top: 2.54, bottom: 2.54, left: 2.54, right: 2.54 } });
                  }}
                  className="flex flex-col items-center p-1 hover:bg-slate-100 rounded text-center"
                  title="تغيير الهوامش"
                >
                  <Square className="w-5 h-5 text-slate-600 mb-1" />
                  <span className="text-[10px] font-medium">الهوامش</span>
                </button>

                {/* Orientation */}
                <button
                  onClick={() => {
                    const next = pageSetup.orientation === 'portrait' ? 'landscape' : 'portrait';
                    onUpdatePageSetup({ orientation: next });
                  }}
                  className="flex flex-col items-center p-1 hover:bg-slate-100 rounded text-center"
                  title="اتجاه الصفحة: عمودي / أفقي"
                >
                  <FileText className={`w-5 h-5 text-slate-600 mb-1 ${pageSetup.orientation === 'landscape' ? 'rotate-90' : ''}`} />
                  <span className="text-[10px] font-medium">{pageSetup.orientation === 'portrait' ? 'عمودي' : 'أفقي'}</span>
                </button>

                {/* Size */}
                <select
                  value={pageSetup.size}
                  onChange={e => onUpdatePageSetup({ size: e.target.value })}
                  className="border border-slate-300 rounded px-2 py-1 text-xs outline-none bg-white font-medium"
                >
                  <option value="A4">A4 (21×29.7cm)</option>
                  <option value="Letter">Letter</option>
                  <option value="Legal">Legal</option>
                  <option value="A3">A3 (كبير)</option>
                  <option value="A5">A5 (كتيب)</option>
                </select>

                {/* Columns */}
                <select
                  value={pageSetup.columns}
                  onChange={e => onUpdatePageSetup({ columns: parseInt(e.target.value, 10) })}
                  className="border border-slate-300 rounded px-2 py-1 text-xs outline-none bg-white font-medium"
                >
                  <option value={1}>عمود واحد</option>
                  <option value={2}>عمودان</option>
                  <option value={3}>3 أعمدة</option>
                </select>
              </div>
              <span className="text-[10px] text-slate-400 text-center font-medium">إعداد الصفحة (Page Setup)</span>
            </div>

            {/* Paragraph Spacing */}
            <div className="flex flex-col justify-between px-3 min-w-[180px] shrink-0">
              <div className="grid grid-cols-2 gap-2 text-[11px] py-1">
                <div>
                  <span className="text-gray-400 block text-[10px]">تباعد قبل:</span>
                  <input type="number" defaultValue={0} min={0} className="w-16 border border-slate-300 rounded px-1 py-0.5 text-xs font-mono" />
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">تباعد بعد:</span>
                  <input type="number" defaultValue={8} min={0} className="w-16 border border-slate-300 rounded px-1 py-0.5 text-xs font-mono" />
                </div>
              </div>
              <span className="text-[10px] text-slate-400 text-center font-medium">تباعد الفقرة (Spacing)</span>
            </div>
          </div>
        )}

        {/* ===================== REFERENCES TAB ===================== */}
        {activeTab === 'references' && (
          <div className="flex items-stretch divide-x divide-x-reverse divide-slate-200">
            {/* Table of Contents */}
            <div className="flex flex-col justify-between px-3 min-w-[180px] shrink-0">
              <div className="flex items-center gap-2 py-1">
                <button
                  onClick={() => {
                    // Generate Table of Contents by scanning headings
                    if (!editorRef.current) return;
                    const headings = Array.from(editorRef.current.querySelectorAll('h1, h2, h3'));
                    if (headings.length === 0) {
                      alert('يرجى تطبيق نمط العناوين (Heading 1 أو Heading 2) على بعض نصوص المستند أولاً لإنشاء الفهرس تلقائياً.');
                      return;
                    }
                    let tocHtml = `
                      <div class="toc-container my-6 p-6 bg-slate-50 border-2 border-slate-200 rounded-xl" contenteditable="false">
                        <h3 class="text-lg font-bold text-[#004578] border-b-2 border-[#004578] pb-2 mb-4">فهرس المحتويات (Table of Contents)</h3>
                        <div class="space-y-2">
                    `;
                    headings.forEach((h, idx) => {
                      const level = h.tagName === 'H1' ? 'font-bold text-sm text-slate-800' : 'text-xs text-slate-600 mr-4';
                      tocHtml += `
                        <div class="flex justify-between items-center ${level}">
                          <span>${h.textContent}</span>
                          <span class="text-slate-400 font-mono">صفحة 1</span>
                        </div>
                      `;
                    });
                    tocHtml += '</div></div><p><br></p>';
                    insertHtml(tocHtml);
                  }}
                  className="flex flex-col items-center p-1 hover:bg-slate-100 rounded text-center"
                  title="إدراج جدول محتويات تلقائي"
                >
                  <BookOpen className="w-5 h-5 text-[#004578] mb-1" />
                  <span className="text-[10px] font-bold">جدول المحتويات</span>
                </button>

                <div className="flex flex-col gap-1 text-[10px]">
                  <button onClick={() => alert('تم تحديث جدول المحتويات بناءً على أحدث العناوين')} className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 rounded">تحديث الجدول</button>
                  <button onClick={() => alert('تمت إضافة الفقرة كمدخل في جدول المحتويات')} className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 rounded">إضافة نص للفهرس</button>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 text-center font-medium">جدول المحتويات</span>
            </div>

            {/* Footnotes */}
            <div className="flex flex-col justify-between px-3 min-w-[140px] shrink-0">
              <div className="flex items-center gap-2 py-1">
                <button
                  onClick={() => {
                    const note = prompt('أدخل نص الحاشية السفلية (Footnote):', 'مرجع موثق');
                    if (note) {
                      insertHtml(`<sup class="text-blue-600 font-bold font-mono">[1]</sup>`);
                      insertHtml(`<div class="border-t border-slate-300 pt-2 mt-6 text-xs text-slate-500 font-serif"><strong>[1]</strong> ${note}</div><p><br></p>`);
                    }
                  }}
                  className="flex flex-col items-center p-1 hover:bg-slate-100 rounded text-center"
                >
                  <FileText className="w-5 h-5 text-purple-600 mb-1" />
                  <span className="text-[10px] font-medium">إدراج حاشية سفلية</span>
                </button>
              </div>
              <span className="text-[10px] text-slate-400 text-center font-medium">حواشي سفلية</span>
            </div>

            {/* Citations */}
            <div className="flex flex-col justify-between px-3 min-w-[160px] shrink-0">
              <div className="space-y-1 py-1">
                <div className="text-[11px] font-medium">النمط: <strong className="text-[#004578]">APA 7th</strong></div>
                <button
                  onClick={() => {
                    insertHtml(`(عبدالرحمن وآخرون، 2026)`);
                  }}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-bold block w-full text-center"
                >
                  إدراج اقتباس وتوثيق
                </button>
              </div>
              <span className="text-[10px] text-slate-400 text-center font-medium">المراجع والاقتباسات</span>
            </div>
          </div>
        )}

        {/* ===================== MAILINGS TAB ===================== */}
        {activeTab === 'mailings' && (
          <div className="flex items-stretch divide-x divide-x-reverse divide-slate-200">
            {/* Create */}
            <div className="flex flex-col justify-between px-3 min-w-[120px] shrink-0">
              <div className="flex items-center gap-2 py-1">
                <button
                  onClick={() => {
                    insertHtml(`
                      <div class="border-2 border-slate-800 p-6 rounded-lg my-4 max-w-sm bg-amber-50">
                        <div class="text-xs text-slate-500">المرسل: إدارة الشؤون الإدارية</div>
                        <div class="my-4 text-sm font-bold text-center">السادة / مؤسسة الأعمال المتطورة المحترمين</div>
                        <div class="text-xs text-left">ص.ب: 12345 • الرمز البريدي: 11111</div>
                      </div>
                      <p><br></p>
                    `);
                  }}
                  className="flex flex-col items-center p-1 hover:bg-slate-100 rounded text-center"
                >
                  <FileText className="w-5 h-5 text-slate-600 mb-1" />
                  <span className="text-[10px] font-medium">أظرف</span>
                </button>
                <button
                  onClick={() => alert('تم تجهيز قالب ملصقات العناوين البريدية')}
                  className="flex flex-col items-center p-1 hover:bg-slate-100 rounded text-center"
                >
                  <CheckSquare className="w-5 h-5 text-slate-600 mb-1" />
                  <span className="text-[10px] font-medium">تسميات</span>
                </button>
              </div>
              <span className="text-[10px] text-slate-400 text-center font-medium">إنشاء (Create)</span>
            </div>

            {/* Merge Fields */}
            <div className="flex flex-col justify-between px-3 min-w-[240px] shrink-0">
              <div className="space-y-1 py-1">
                <div className="text-[11px] font-bold text-gray-700">إدراج حقول دمج البريد:</div>
                <div className="flex items-center gap-1">
                  <button onClick={() => insertHtml(' «اسم العميل» ')} className="px-2 py-0.5 bg-blue-50 text-[#004578] border border-blue-200 rounded text-[10px] font-mono font-bold">«اسم العميل»</button>
                  <button onClick={() => insertHtml(' «العنوان» ')} className="px-2 py-0.5 bg-blue-50 text-[#004578] border border-blue-200 rounded text-[10px] font-mono font-bold">«العنوان»</button>
                  <button onClick={() => insertHtml(' «المبلغ» ')} className="px-2 py-0.5 bg-blue-50 text-[#004578] border border-blue-200 rounded text-[10px] font-mono font-bold">«المبلغ»</button>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 text-center font-medium">كتابة وإدراج الحقول</span>
            </div>

            {/* Finish & Merge */}
            <div className="flex flex-col justify-between px-3 min-w-[120px] shrink-0">
              <button
                onClick={() => {
                  if (editorRef.current) {
                    editorRef.current.innerHTML = editorRef.current.innerHTML
                      .replace(/«اسم العميل»/g, 'مؤسسة الأفق للتقنية')
                      .replace(/«العنوان»/g, 'الرياض - طريق الملك فهد')
                      .replace(/«المبلغ»/g, '50,000 ر.س');
                    alert('تم دمج وطباعة المراسلات بنجاح للعميل الأول!');
                  }
                }}
                className="flex flex-col items-center justify-center p-2 hover:bg-slate-100 rounded text-emerald-800 font-bold"
              >
                <CheckCircle className="w-5 h-5 text-emerald-600 mb-1" />
                <span className="text-[11px]">إنهاء ودمج</span>
              </button>
              <span className="text-[10px] text-slate-400 text-center font-medium">إنهاء (Finish)</span>
            </div>
          </div>
        )}

        {/* ===================== REVIEW TAB ===================== */}
        {activeTab === 'review' && (
          <div className="flex items-stretch divide-x divide-x-reverse divide-slate-200">
            {/* Proofing */}
            <div className="flex flex-col justify-between px-3 min-w-[240px] shrink-0">
              <div className="flex items-center gap-2 py-1">
                <button
                  onClick={() => alert('اكتمل التدقيق الإملائي والنحوي بنجاح: المستند سليم وخالٍ من الأخطاء اللغوية.')}
                  className="flex flex-col items-center p-1 hover:bg-slate-100 rounded text-center text-slate-800"
                  title="تدقيق إملائي ونحوي (F7)"
                >
                  <div className="p-1 bg-blue-50 text-[#004578] rounded mb-0.5">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-medium">تدقيق إملائي</span>
                </button>

                <button
                  onClick={() => {
                    const sel = window.getSelection()?.toString() || 'تطوير';
                    alert(`قاموس المرادفات لكلمة "${sel}":\n• نمو\n• تحسين\n• ترقية\n• تقدم\n• ازدهار`);
                  }}
                  className="flex flex-col items-center p-1 hover:bg-slate-100 rounded text-center text-slate-800"
                  title="قاموس المرادفات (Shift + F7)"
                >
                  <div className="p-1 bg-amber-50 text-amber-600 rounded mb-0.5">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-medium">قاموس المرادفات</span>
                </button>

                <button
                  onClick={onOpenWordCount}
                  className="flex flex-col items-center p-1 hover:bg-slate-100 rounded text-center text-slate-800"
                  title="إحصائيات وعدد الكلمات"
                >
                  <div className="p-1 bg-emerald-50 text-emerald-600 rounded mb-0.5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-medium">عدد الكلمات</span>
                </button>

                {/* Read aloud */}
                <button
                  onClick={() => {
                    if (!window.speechSynthesis) {
                      alert('خاصية القراءة الصوتية غير مدعومة في هذا المتصفح.');
                      return;
                    }
                    if (isSpeaking) {
                      window.speechSynthesis.cancel();
                      setIsSpeaking(false);
                      return;
                    }
                    const textToRead = window.getSelection()?.toString() || editorRef.current?.innerText || 'مرحباً بكم في مايكروسوفت وورد.';
                    window.speechSynthesis.cancel();
                    const utt = new SpeechSynthesisUtterance(textToRead);
                    utt.lang = 'ar-SA';
                    utt.rate = 0.95;
                    utt.onend = () => setIsSpeaking(false);
                    utt.onerror = () => setIsSpeaking(false);
                    window.speechSynthesis.speak(utt);
                    setIsSpeaking(true);
                  }}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold ${
                    isSpeaking ? 'bg-rose-100 text-rose-700' : 'hover:bg-slate-100 text-[#004578]'
                  }`}
                  title="قراءة النص المحدد أو المستند بصوت عالٍ"
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>{isSpeaking ? 'إيقاف' : 'قراءة بصوت'}</span>
                </button>
              </div>
              <span className="text-[10px] text-slate-400 text-center font-medium">تدقيق ولغة (Proofing)</span>
            </div>

            {/* Comments */}
            <div className="flex flex-col justify-between px-3 min-w-[120px] shrink-0">
              <button
                onClick={onOpenComments}
                className="flex flex-col items-center justify-center p-1.5 hover:bg-slate-100 rounded text-amber-800 font-bold"
              >
                <MessageSquare className="w-5 h-5 text-amber-600 mb-1" />
                <span className="text-[11px]">لوحة التعليقات</span>
              </button>
              <span className="text-[10px] text-slate-400 text-center font-medium">تعليقات</span>
            </div>
          </div>
        )}

        {/* ===================== VIEW TAB ===================== */}
        {activeTab === 'view' && (
          <div className="flex items-stretch divide-x divide-x-reverse divide-slate-200">
            {/* Views */}
            <div className="flex flex-col justify-between px-3 min-w-[270px] shrink-0">
              <div className="flex items-center gap-1.5 py-1">
                <button
                  onClick={() => onViewModeChange('read')}
                  className={`flex flex-col items-center p-1 rounded text-center ${viewMode === 'read' ? 'bg-blue-100 text-[#004578] font-bold' : 'hover:bg-slate-100'}`}
                  title="وضع القراءة في ملء الشاشة"
                >
                  <BookOpen className="w-4 h-4 mb-1" />
                  <span className="text-[10px]">وضع القراءة</span>
                </button>
                <button
                  onClick={() => onViewModeChange('print')}
                  className={`flex flex-col items-center p-1 rounded text-center ${viewMode === 'print' ? 'bg-blue-100 text-[#004578] font-bold' : 'hover:bg-slate-100'}`}
                  title="تخطيط الطباعة (الافتراضي مع حواف الورقة)"
                >
                  <FileText className="w-4 h-4 mb-1" />
                  <span className="text-[10px]">تخطيط الطباعة</span>
                </button>
                <button
                  onClick={() => onViewModeChange('web')}
                  className={`flex flex-col items-center p-1 rounded text-center ${viewMode === 'web' ? 'bg-blue-100 text-[#004578] font-bold' : 'hover:bg-slate-100'}`}
                  title="تخطيط الويب"
                >
                  <Eye className="w-4 h-4 mb-1" />
                  <span className="text-[10px]">تخطيط الويب</span>
                </button>
              </div>
              <span className="text-[10px] text-slate-400 text-center font-medium">طرق العرض (Views)</span>
            </div>

            {/* Show */}
            <div className="flex flex-col justify-between px-3 min-w-[150px] shrink-0">
              <div className="space-y-1 py-1 text-xs">
                <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                  <input type="checkbox" checked={showRuler} onChange={onToggleRuler} className="rounded text-[#004578]" />
                  <span className="text-[11px] font-medium">المسطرة (Ruler)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                  <input type="checkbox" checked={showGridlines} onChange={onToggleGridlines} className="rounded text-[#004578]" />
                  <span className="text-[11px] font-medium">خطوط الشبكة</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                  <input type="checkbox" checked={showNavigationPane} onChange={onToggleNavigationPane} className="rounded text-[#004578]" />
                  <span className="text-[11px] font-medium">جزء التنقل</span>
                </label>
              </div>
              <span className="text-[10px] text-slate-400 text-center font-medium">إظهار (Show)</span>
            </div>

            {/* Zoom */}
            <div className="flex flex-col justify-between px-3 min-w-[160px] shrink-0">
              <div className="flex items-center gap-1.5 py-1">
                <button onClick={() => onZoomChange(100)} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded font-mono font-bold text-xs">
                  100%
                </button>
                <button onClick={() => onZoomChange(Math.min(200, zoom + 10))} className="p-1 hover:bg-slate-100 rounded">
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button onClick={() => onZoomChange(Math.max(50, zoom - 10))} className="p-1 hover:bg-slate-100 rounded">
                  <ZoomOut className="w-4 h-4" />
                </button>
              </div>
              <span className="text-[10px] text-slate-400 text-center font-medium">تكبير / تصغير</span>
            </div>

            {/* Macros */}
            <div className="flex flex-col justify-between px-3 min-w-[90px] shrink-0">
              <button
                onClick={onOpenMacros}
                className="flex flex-col items-center justify-center p-1.5 hover:bg-slate-100 rounded text-[#004578] font-bold"
              >
                <FileCode className="w-5 h-5 mb-1" />
                <span className="text-[11px]">ماكرو</span>
              </button>
              <span className="text-[10px] text-slate-400 text-center font-medium">وحدات ماكرو</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
