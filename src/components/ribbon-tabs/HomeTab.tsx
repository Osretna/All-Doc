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
  Baseline, 
  Eraser, 
  CaseSensitive,
  List, 
  ListOrdered, 
  ListTree, 
  Indent, 
  Outdent, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify, 
  PaintBucket, 
  Square,
  Search, 
  Replace, 
  MousePointer2, 
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { executeCommand, insertHTMLAtCursor } from '../../utils/editorCommands';

interface HomeTabProps {
  onOpenFind: () => void;
  onOpenReplace: () => void;
  onOpenStylesPane?: () => void;
  onOpenBordersDialog?: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  onOpenFind,
  onOpenReplace,
  onOpenStylesPane,
  onOpenBordersDialog,
}) => {
  const [fontFamily, setFontFamily] = useState('Cairo');
  const [fontSize, setFontSize] = useState('14');
  const [fontColor, setFontColor] = useState('#000000');
  const [highlightColor, setHighlightColor] = useState('#fef08a');
  const [isFormatPainterActive, setIsFormatPainterActive] = useState(false);
  const [savedFormat, setSavedFormat] = useState<any>(null);

  const applyFontFamily = (val: string) => {
    setFontFamily(val);
    executeCommand('fontName', val);
  };

  const applyFontSize = (val: string) => {
    setFontSize(val);
    executeCommand('fontSize', '4'); // standard size
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const span = document.createElement('span');
      span.style.fontSize = `${val}px`;
      const range = selection.getRangeAt(0);
      try {
        range.surroundContents(span);
      } catch {
        executeCommand('fontSize', '4');
      }
    }
  };

  const handleGrowFont = () => {
    const next = Math.min(72, parseInt(fontSize, 10) + 2);
    applyFontSize(next.toString());
  };

  const handleShrinkFont = () => {
    const next = Math.max(8, parseInt(fontSize, 10) - 2);
    applyFontSize(next.toString());
  };

  const handleFormatPainter = () => {
    if (!isFormatPainterActive) {
      setIsFormatPainterActive(true);
    } else {
      setIsFormatPainterActive(false);
    }
  };

  const handleCopy = () => {
    executeCommand('copy');
  };

  const handleCut = () => {
    executeCommand('cut');
  };

  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        insertHTMLAtCursor(text.replace(/\n/g, '<br>'));
      } else {
        executeCommand('paste');
      }
    } catch {
      executeCommand('paste');
    }
  };

  const applyStylePreset = (styleType: string) => {
    switch (styleType) {
      case 'normal':
        executeCommand('formatBlock', '<p>');
        executeCommand('removeFormat');
        break;
      case 'h1':
        executeCommand('formatBlock', '<h1>');
        break;
      case 'h2':
        executeCommand('formatBlock', '<h2>');
        break;
      case 'h3':
        executeCommand('formatBlock', '<h3>');
        break;
      case 'quote':
        executeCommand('formatBlock', '<blockquote>');
        break;
      case 'subtitle':
        insertHTMLAtCursor('<p class="text-lg text-slate-500 font-medium mb-2 border-b border-slate-200 pb-1">عنوان فرعي</p>');
        break;
    }
  };

  return (
    <div className="flex items-stretch h-[96px] py-1 px-2 overflow-x-auto text-slate-700 select-none divide-x divide-x-reverse divide-slate-200" dir="rtl">
      
      {/* 1. Clipboard (الحافظة) */}
      <div className="flex flex-col justify-between px-2 min-w-[155px] shrink-0">
        <div className="flex items-start gap-1">
          {/* Big Paste Button */}
          <button
            onClick={handlePaste}
            className="flex flex-col items-center justify-center p-1.5 hover:bg-slate-200/80 rounded transition-colors text-slate-800 group"
            title="لصق (Ctrl + V)"
          >
            <div className="w-8 h-8 rounded bg-blue-50 text-[#2b579a] flex items-center justify-center border border-blue-200 group-hover:bg-blue-100 transition-colors shadow-2xs">
              <Clipboard className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-medium mt-1">لصق</span>
          </button>

          {/* Cut, Copy, Format Painter */}
          <div className="flex flex-col gap-0.5 justify-center">
            <button
              onClick={handleCut}
              className="flex items-center gap-1.5 px-2 py-0.5 hover:bg-slate-200/80 rounded text-[11px] text-slate-700 hover:text-slate-900 transition-colors"
              title="قص (Ctrl + X)"
            >
              <Scissors className="w-3.5 h-3.5 text-slate-500" />
              <span>قص</span>
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2 py-0.5 hover:bg-slate-200/80 rounded text-[11px] text-slate-700 hover:text-slate-900 transition-colors"
              title="نسخ (Ctrl + C)"
            >
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>نسخ</span>
            </button>
            <button
              onClick={handleFormatPainter}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] transition-colors ${
                isFormatPainterActive
                  ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300'
                  : 'hover:bg-slate-200/80 text-slate-700'
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

      {/* 2. Font (خط) */}
      <div className="flex flex-col justify-between px-3 min-w-[260px] shrink-0">
        <div className="space-y-1.5">
          {/* Top row: font family + size + grow/shrink + clear */}
          <div className="flex items-center gap-1">
            <select
              value={fontFamily}
              onChange={(e) => applyFontFamily(e.target.value)}
              className="h-6 text-xs bg-white border border-slate-300 rounded px-1.5 font-medium outline-none focus:border-[#2b579a] w-32"
            >
              <option value="Cairo">Cairo (افتراضي عربي)</option>
              <option value="Amiri">Amiri (أميري كلاسيكي)</option>
              <option value="Tajawal">Tajawal (تجوال)</option>
              <option value="Segoe UI">Segoe UI</option>
              <option value="Arial">Arial</option>
              <option value="Calibri">Calibri</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New (آلة كاتبة)</option>
            </select>

            <select
              value={fontSize}
              onChange={(e) => applyFontSize(e.target.value)}
              className="h-6 text-xs bg-white border border-slate-300 rounded px-1 font-mono outline-none focus:border-[#2b579a] w-14"
            >
              {['8', '9', '10', '11', '12', '14', '16', '18', '20', '24', '28', '36', '48', '72'].map((sz) => (
                <option key={sz} value={sz}>{sz}</option>
              ))}
            </select>

            <button
              onClick={handleGrowFont}
              className="w-6 h-6 flex items-center justify-center hover:bg-slate-200 rounded text-xs font-bold text-slate-700"
              title="تكبير حجم الخط (Ctrl + Shift + >)"
            >
              A<span className="text-[9px]">▲</span>
            </button>
            <button
              onClick={handleShrinkFont}
              className="w-6 h-6 flex items-center justify-center hover:bg-slate-200 rounded text-xs font-medium text-slate-700"
              title="تصغير حجم الخط (Ctrl + Shift + <)"
            >
              A<span className="text-[9px]">▼</span>
            </button>

            <button
              onClick={() => {
                const s = window.getSelection()?.toString();
                if (s) {
                  const upper = s.toUpperCase() === s ? s.toLowerCase() : s.toUpperCase();
                  insertHTMLAtCursor(upper);
                }
              }}
              className="w-6 h-6 flex items-center justify-center hover:bg-slate-200 rounded text-slate-600"
              title="تغيير حالة الأحرف (Aa)"
            >
              <CaseSensitive className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => executeCommand('removeFormat')}
              className="w-6 h-6 flex items-center justify-center hover:bg-slate-200 rounded text-slate-600"
              title="مسح كافة التنسيقات (Clear All Formatting)"
            >
              <Eraser className="w-3.5 h-3.5 text-rose-600" />
            </button>
          </div>

          {/* Bottom row: Bold, Italic, Underline, Strikethrough, Subscript, Superscript, Double Underline, Highlight, Font Color */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => executeCommand('bold')}
              className="w-6 h-6 flex items-center justify-center hover:bg-slate-200 rounded text-slate-700 font-bold"
              title="عريض (Ctrl + B)"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => executeCommand('italic')}
              className="w-6 h-6 flex items-center justify-center hover:bg-slate-200 rounded text-slate-700"
              title="مائل (Ctrl + I)"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => executeCommand('underline')}
              className="w-6 h-6 flex items-center justify-center hover:bg-slate-200 rounded text-slate-700"
              title="تسطير تحته خط (Ctrl + U)"
            >
              <Underline className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => executeCommand('strikeThrough')}
              className="w-6 h-6 flex items-center justify-center hover:bg-slate-200 rounded text-slate-700"
              title="يتوسطه خط (Strikethrough)"
            >
              <Strikethrough className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => executeCommand('subscript')}
              className="w-6 h-6 flex items-center justify-center hover:bg-slate-200 rounded text-slate-700"
              title="خط سفلي (X₂)"
            >
              <Subscript className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => executeCommand('superscript')}
              className="w-6 h-6 flex items-center justify-center hover:bg-slate-200 rounded text-slate-700"
              title="خط علوي (X²)"
            >
              <Superscript className="w-3.5 h-3.5" />
            </button>

            {/* Double underline */}
            <button
              onClick={() => {
                const s = window.getSelection()?.toString();
                if (s) {
                  insertHTMLAtCursor(`<span style="text-decoration: underline double;">${s}</span>`);
                } else {
                  executeCommand('underline');
                }
              }}
              className="w-6 h-6 flex items-center justify-center hover:bg-slate-200 rounded text-slate-700 font-bold text-xs"
              title="خط سفلي مزدوج (Double Underline)"
            >
              <span className="border-b-2 border-double border-slate-800">U</span>
            </button>

            {/* Highlight color */}
            <label 
              className="w-6 h-6 flex items-center justify-center hover:bg-slate-200 rounded cursor-pointer relative"
              title="لون تمييز النص (Highlight)"
            >
              <Highlighter className="w-3.5 h-3.5 text-amber-500" />
              <input
                type="color"
                value={highlightColor}
                onChange={(e) => {
                  setHighlightColor(e.target.value);
                  executeCommand('hiliteColor', e.target.value);
                }}
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
              />
            </label>

            {/* Font color */}
            <label 
              className="w-6 h-6 flex items-center justify-center hover:bg-slate-200 rounded cursor-pointer relative"
              title="لون الخط (Font Color)"
            >
              <Baseline className="w-3.5 h-3.5 text-rose-600" />
              <input
                type="color"
                value={fontColor}
                onChange={(e) => {
                  setFontColor(e.target.value);
                  executeCommand('foreColor', e.target.value);
                }}
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
              />
            </label>
          </div>
        </div>
        <span className="text-[10px] text-slate-400 text-center font-medium">خط (Font)</span>
      </div>

      {/* 3. Paragraph (فقرة) */}
      <div className="flex flex-col justify-between px-3 min-w-[240px] shrink-0">
        <div className="space-y-1.5">
          {/* Top row: Bullets, Numbering, Multilevel, Decrease/Increase indent, Sort, Pilcrow */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => executeCommand('insertUnorderedList')}
              className="w-6 h-6 flex items-center justify-center hover:bg-slate-200 rounded text-slate-700"
              title="تعداد نقطي (Bullets)"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => executeCommand('insertOrderedList')}
              className="w-6 h-6 flex items-center justify-center hover:bg-slate-200 rounded text-slate-700"
              title="تعداد رقمي (Numbering)"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                insertHTMLAtCursor('<ol style="list-style-type: upper-alpha; margin-right: 20px;"><li>عنصر المستوى الأول<ol style="list-style-type: decimal; margin-right: 20px;"><li>عنصر متفرع فرعي</li></ol></li></ol>');
              }}
              className="w-6 h-6 flex items-center justify-center hover:bg-slate-200 rounded text-slate-700"
              title="قائمة متعددة المستويات (Multilevel List)"
            >
              <ListTree className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => executeCommand('outdent')}
              className="w-6 h-6 flex items-center justify-center hover:bg-slate-200 rounded text-slate-700"
              title="تقليل المسافة البادئة"
            >
              <Outdent className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => executeCommand('indent')}
              className="w-6 h-6 flex items-center justify-center hover:bg-slate-200 rounded text-slate-700"
              title="زيادة المسافة البادئة"
            >
              <Indent className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                // Show/hide pilcrow marks
                document.body.classList.toggle('show-pilcrows');
              }}
              className="w-6 h-6 flex items-center justify-center hover:bg-slate-200 rounded text-slate-700 font-serif font-bold text-xs"
              title="إظهار الكل / علامات الفقرات (¶)"
            >
              ¶
            </button>
          </div>

          {/* Bottom row: Alignments (Right, Center, Left, Justify), Line Spacing, Shading, Borders */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => executeCommand('justifyRight')}
              className="w-6 h-6 flex items-center justify-center hover:bg-slate-200 rounded text-slate-700"
              title="محاذاة إلى اليمين (Ctrl + R)"
            >
              <AlignRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => executeCommand('justifyCenter')}
              className="w-6 h-6 flex items-center justify-center hover:bg-slate-200 rounded text-slate-700"
              title="توسيط (Ctrl + E)"
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => executeCommand('justifyLeft')}
              className="w-6 h-6 flex items-center justify-center hover:bg-slate-200 rounded text-slate-700"
              title="محاذاة إلى اليسار (Ctrl + L)"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => executeCommand('justifyFull')}
              className="w-6 h-6 flex items-center justify-center hover:bg-slate-200 rounded text-slate-700"
              title="ضبط (Justify - Ctrl + J)"
            >
              <AlignJustify className="w-3.5 h-3.5" />
            </button>

            {/* Line spacing dropdown */}
            <select
              onChange={(e) => {
                const val = e.target.value;
                const sel = window.getSelection();
                if (sel && sel.anchorNode) {
                  let p = sel.anchorNode as HTMLElement;
                  while (p && p.tagName !== 'P' && p.tagName !== 'DIV' && p.parentElement) {
                    p = p.parentElement;
                  }
                  if (p && p.style) p.style.lineHeight = val;
                }
              }}
              className="h-6 text-[10px] bg-white border border-slate-300 rounded px-1 text-slate-700 outline-none w-14"
              title="تباعد الأسطر والفقرات"
              defaultValue="1.5"
            >
              <option value="1.0">1.0</option>
              <option value="1.15">1.15</option>
              <option value="1.5">1.5</option>
              <option value="2.0">2.0</option>
              <option value="2.5">2.5</option>
              <option value="3.0">3.0</option>
            </select>

            {/* Shading */}
            <label 
              className="w-6 h-6 flex items-center justify-center hover:bg-slate-200 rounded cursor-pointer relative"
              title="تظليل الفقرة (Shading)"
            >
              <PaintBucket className="w-3.5 h-3.5 text-indigo-600" />
              <input
                type="color"
                onChange={(e) => {
                  const sel = window.getSelection();
                  if (sel && sel.anchorNode) {
                    let el = sel.anchorNode as HTMLElement;
                    while (el && el.tagName !== 'P' && el.tagName !== 'DIV' && el.parentElement) {
                      el = el.parentElement;
                    }
                    if (el && el.style) el.style.backgroundColor = e.target.value;
                  }
                }}
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
              />
            </label>

            {/* Borders */}
            <button
              onClick={onOpenBordersDialog}
              className="w-6 h-6 flex items-center justify-center hover:bg-slate-200 rounded text-slate-700"
              title="حدود وإطارات (Borders)"
            >
              <Square className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <span className="text-[10px] text-slate-400 text-center font-medium">فقرة (Paragraph)</span>
      </div>

      {/* 4. Styles (أنماط) */}
      <div className="flex flex-col justify-between px-3 min-w-[280px] shrink-0">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <button
            onClick={() => applyStylePreset('normal')}
            className="flex flex-col items-center justify-center w-16 h-12 border border-slate-300 hover:border-[#2b579a] rounded p-1 bg-white hover:bg-blue-50/50 transition-colors shrink-0 text-center"
          >
            <span className="text-xs font-normal text-slate-800">AaBbCc</span>
            <span className="text-[10px] text-slate-500 font-medium">عادي (Normal)</span>
          </button>
          <button
            onClick={() => applyStylePreset('h1')}
            className="flex flex-col items-center justify-center w-16 h-12 border border-slate-300 hover:border-[#2b579a] rounded p-1 bg-white hover:bg-blue-50/50 transition-colors shrink-0 text-center"
          >
            <span className="text-xs font-bold text-[#2b579a]">AaBbCc</span>
            <span className="text-[10px] text-[#2b579a] font-medium">عنوان 1</span>
          </button>
          <button
            onClick={() => applyStylePreset('h2')}
            className="flex flex-col items-center justify-center w-16 h-12 border border-slate-300 hover:border-[#2b579a] rounded p-1 bg-white hover:bg-blue-50/50 transition-colors shrink-0 text-center"
          >
            <span className="text-xs font-semibold text-slate-800">AaBbCc</span>
            <span className="text-[10px] text-slate-600 font-medium">عنوان 2</span>
          </button>
          <button
            onClick={() => applyStylePreset('subtitle')}
            className="flex flex-col items-center justify-center w-16 h-12 border border-slate-300 hover:border-[#2b579a] rounded p-1 bg-white hover:bg-blue-50/50 transition-colors shrink-0 text-center"
          >
            <span className="text-xs italic text-slate-500">AaBbCc</span>
            <span className="text-[10px] text-slate-500 font-medium">عنوان فرعي</span>
          </button>
          <button
            onClick={() => applyStylePreset('quote')}
            className="flex flex-col items-center justify-center w-16 h-12 border border-slate-300 hover:border-[#2b579a] rounded p-1 bg-white hover:bg-blue-50/50 transition-colors shrink-0 text-center"
          >
            <span className="text-xs text-indigo-700 italic font-serif">“Aa”</span>
            <span className="text-[10px] text-slate-500 font-medium">اقتباس</span>
          </button>
        </div>
        <span className="text-[10px] text-slate-400 text-center font-medium">الأنماط (Styles)</span>
      </div>

      {/* 5. Editing (تحرير) */}
      <div className="flex flex-col justify-between px-2 min-w-[120px] shrink-0">
        <div className="flex flex-col gap-0.5 justify-center py-0.5">
          <button
            onClick={onOpenFind}
            className="flex items-center gap-2 px-2 py-1 hover:bg-slate-200/80 rounded text-slate-700 text-xs transition-colors"
            title="بحث (Ctrl + F)"
          >
            <Search className="w-3.5 h-3.5 text-[#2b579a]" />
            <span>بحث</span>
          </button>
          <button
            onClick={onOpenReplace}
            className="flex items-center gap-2 px-2 py-1 hover:bg-slate-200/80 rounded text-slate-700 text-xs transition-colors"
            title="استبدال (Ctrl + H)"
          >
            <Replace className="w-3.5 h-3.5 text-[#2b579a]" />
            <span>استبدال</span>
          </button>
          <button
            onClick={() => executeCommand('selectAll')}
            className="flex items-center gap-2 px-2 py-1 hover:bg-slate-200/80 rounded text-slate-700 text-xs transition-colors"
            title="تحديد الكل (Ctrl + A)"
          >
            <MousePointer2 className="w-3.5 h-3.5 text-slate-600" />
            <span>تحديد الكل</span>
          </button>
        </div>
        <span className="text-[10px] text-slate-400 text-center font-medium">تحرير (Editing)</span>
      </div>

    </div>
  );
};
