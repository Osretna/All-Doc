import React, { useState, useEffect, useRef } from 'react';
import {
  Scissors,
  Copy,
  Clipboard,
  ChevronRight,
  ChevronDown,
  Globe,
  MessageSquare,
  Sparkles,
  Languages,
  Check,
  Paintbrush,
  List,
  ListOrdered,
  Type,
  AlignLeft,
  ArrowRight,
} from 'lucide-react';

interface Props {
  position: { x: number; y: number } | null;
  onClose: () => void;
  selectedText: string;
  onExecCommand: (cmd: string, val?: string) => void;
  onOpenFontModal: () => void;
  onOpenParagraphModal: () => void;
  onOpenSmartLookup: () => void;
  onOpenTranslate: () => void;
  onOpenHyperlink: () => void;
  onOpenNewComment: () => void;
  onReplaceSelectedText: (newText: string) => void;
  onFormatPainter?: () => void;
}

const COMMON_SYNONYMS: Record<string, string[]> = {
  تقرير: ['بيان', 'محضر', 'كشف', 'إفادة', 'مستند'],
  وثيقة: ['صك', 'مستند', 'سند', 'عقد', 'إثبات'],
  عقد: ['اتفاق', 'معاهدة', 'ميثاق', 'صك', 'بروتوكول'],
  نظام: ['منظومة', 'نسق', 'قواعد', 'ترتيب', 'منهج'],
  استراتيجية: ['خطة', 'رؤية', 'منهجية', 'سياسة عمل', 'تدبير'],
  سيادة: ['استقلال', 'سلطة عليا', 'حصانة', 'حاكمية', 'تمكين'],
  مقدمة: ['تمهيد', 'مدخل', 'فاتحة', 'توطئة', 'استهلال'],
  خاتمة: ['خلاصة', 'نهاية', 'ملخص', 'استنتاج', 'ختام'],
  رسمي: ['معتمد', 'موثق', 'حكومي', 'قانوني', 'نظامي'],
  كبير: ['ضخم', 'عظيم', 'هائل', 'جسيم', 'واسع'],
  سريع: ['عاجل', 'فوري', 'خاطف', 'مبادر', 'ناجز'],
  جديد: ['حديث', 'مستحدث', 'معاصر', 'مبتكر', 'طازج'],
  مهم: ['ضروري', 'جوهري', 'بالغ الأهمية', 'حيوي', 'أساسي'],
  عمل: ['مهمة', 'نشاط', 'وظيفة', 'شغل', 'إجراء'],
  تطوير: ['تحسين', 'ترقية', 'تحديث', 'تنمية', 'إنماء'],
  بيانات: ['معلومات', 'إحصاءات', 'أرقام', 'حقائق', 'مدخلات'],
  // English words
  report: ['summary', 'statement', 'briefing', 'account', 'dispatch'],
  document: ['file', 'record', 'paper', 'manuscript', 'certificate'],
  system: ['structure', 'framework', 'scheme', 'organization', 'setup'],
  strategy: ['plan', 'masterplan', 'tactic', 'blueprint', 'approach'],
  important: ['critical', 'essential', 'crucial', 'vital', 'significant'],
  fast: ['rapid', 'quick', 'swift', 'speedy', 'prompt'],
  good: ['excellent', 'superior', 'effective', 'favorable', 'prime'],
};

const FONT_LIST = [
  'Arial',
  'Calibri',
  'Cairo',
  'Amiri',
  'Segoe UI',
  'Times New Roman',
  'Tahoma',
  'Georgia',
];

const SIZE_LIST = ['8', '9', '10', '11', '12', '14', '16', '18', '20', '24', '28', '36', '48'];

const HIGHLIGHT_COLORS = [
  '#ffff00', // Yellow
  '#00ff00', // Bright Green
  '#00ffff', // Cyan
  '#ff00ff', // Pink/Magenta
  '#0000ff', // Blue
  '#ff0000', // Red
  '#000080', // Dark Blue
  '#008080', // Teal
  '#008000', // Green
  '#800080', // Purple
  '#800000', // Maroon
  '#808000', // Olive
  '#808080', // Gray
  '#c0c0c0', // Silver
  '#000000', // Black
];

const TEXT_COLORS = [
  '#000000',
  '#ffffff',
  '#c00000',
  '#ff0000',
  '#ffc000',
  '#ffff00',
  '#92d050',
  '#00b050',
  '#00b0f0',
  '#0070c0',
  '#002060',
  '#7030a0',
];

export const WordContextMenu: React.FC<Props> = ({
  position,
  onClose,
  selectedText,
  onExecCommand,
  onOpenFontModal,
  onOpenParagraphModal,
  onOpenSmartLookup,
  onOpenTranslate,
  onOpenHyperlink,
  onOpenNewComment,
  onReplaceSelectedText,
  onFormatPainter,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [synonymsSubmenuOpen, setSynonymsSubmenuOpen] = useState(false);
  const [highlightPickerOpen, setHighlightPickerOpen] = useState(false);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [stylesDropdownOpen, setStylesDropdownOpen] = useState(false);
  const [currentFont, setCurrentFont] = useState('Arial');
  const [currentSize, setCurrentSize] = useState('11');
  const [activeHighlight, setActiveHighlight] = useState('#ffff00');
  const [activeTextColor, setActiveTextColor] = useState('#ff0000');
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  // Close on outside click or escape
  useEffect(() => {
    const handleDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handleDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!position) return null;

  // Clamped coordinates to stay within screen
  const menuWidth = 270;
  const menuHeight = 440;
  let posX = position.x;
  let posY = position.y;

  if (posX + menuWidth > window.innerWidth - 10) {
    posX = window.innerWidth - menuWidth - 15;
  }
  if (posX < 10) posX = 10;

  if (posY + menuHeight > window.innerHeight - 10) {
    posY = window.innerHeight - menuHeight - 15;
  }
  if (posY < 10) posY = 10;

  // Helper to execute and close or keep focus
  const handleAction = (cmd: string, val?: string) => {
    onExecCommand(cmd, val);
  };

  // Clipboard operations
  const handleCut = async () => {
    try {
      if (selectedText) {
        await navigator.clipboard.writeText(selectedText);
        onExecCommand('delete');
        setCopiedNotification('تم القص');
      } else {
        document.execCommand('cut');
      }
    } catch {
      document.execCommand('cut');
    }
    setTimeout(() => onClose(), 250);
  };

  const handleCopy = async () => {
    try {
      if (selectedText) {
        await navigator.clipboard.writeText(selectedText);
        setCopiedNotification('تم النسخ');
      } else {
        document.execCommand('copy');
      }
    } catch {
      document.execCommand('copy');
    }
    setTimeout(() => onClose(), 250);
  };

  const handlePaste = async (mode: 'source' | 'merge' | 'text') => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        if (mode === 'text') {
          // Paste pure unformatted text
          onExecCommand('insertText', text);
        } else if (mode === 'merge') {
          onExecCommand('insertText', text);
        } else {
          // Keep source formatting
          onExecCommand('insertHTML', text);
        }
      } else {
        document.execCommand('paste');
      }
    } catch {
      document.execCommand('paste');
    }
    onClose();
  };

  // Look up synonyms for the trimmed word
  const cleanWord = selectedText.trim().toLowerCase();
  const synonymsList =
    COMMON_SYNONYMS[cleanWord] ||
    Object.entries(COMMON_SYNONYMS).find(([k]) => cleanWord.includes(k) || k.includes(cleanWord))?.[1] ||
    ['(بديل 1) ' + selectedText, '(بديل 2) ' + selectedText];

  return (
    <div
      ref={menuRef}
      className="fixed z-[9999] select-none text-slate-800 font-sans text-xs flex flex-col gap-1 drop-shadow-2xl"
      style={{
        left: `${posX}px`,
        top: `${posY}px`,
        fontFamily: "'Segoe UI', Tahoma, Arial, sans-serif",
      }}
      dir="ltr"
    >
      {/* -------------------- 1. Floating Mini Toolbar -------------------- */}
      <div
        className="bg-white border border-[#c8c8c8] rounded-xs shadow-md p-1 flex flex-col gap-1 w-[265px]"
        onMouseDown={e => e.preventDefault()}
      >
        {/* Row 1: Font dropdown, Size dropdown, Grow font, Shrink font, Format Painter, Styles */}
        <div className="flex items-center gap-0.5">
          {/* Font Family selector */}
          <div className="relative">
            <select
              value={currentFont}
              onChange={e => {
                setCurrentFont(e.target.value);
                handleAction('fontName', e.target.value);
              }}
              className="h-6 w-[100px] border border-transparent hover:border-[#a0a0a0] focus:border-[#0078d7] rounded-xs px-1 text-[11px] bg-white cursor-pointer truncate outline-hidden"
            >
              {FONT_LIST.map(f => (
                <option key={f} value={f}>
                  {f} {f === 'Arial' ? '(Body CS)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Font Size selector */}
          <div className="relative">
            <select
              value={currentSize}
              onChange={e => {
                setCurrentSize(e.target.value);
                handleAction('fontSize', '4'); // fallback
                const sel = window.getSelection();
                if (sel && sel.rangeCount > 0) {
                  const span = document.createElement('span');
                  span.style.fontSize = `${e.target.value}px`;
                  try {
                    const range = sel.getRangeAt(0);
                    range.surroundContents(span);
                  } catch {
                    handleAction('fontSize', '4');
                  }
                }
              }}
              className="h-6 w-[44px] border border-transparent hover:border-[#a0a0a0] focus:border-[#0078d7] rounded-xs px-1 text-[11px] bg-white cursor-pointer outline-hidden"
            >
              {SIZE_LIST.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Grow Font button A^ */}
          <button
            onClick={() => {
              const nextSize = String(Math.min(72, Number(currentSize) + 2));
              setCurrentSize(nextSize);
              handleAction('fontSize', '4');
            }}
            title="Grow Font (تكبير حجم الخط)"
            className="w-6 h-6 flex items-center justify-center hover:bg-[#e5f1fb] hover:border hover:border-[#0078d7] rounded-xs text-slate-800 text-[11px] font-bold cursor-pointer transition"
          >
            <span className="flex items-start text-xs font-serif leading-none">
              A<span className="text-[9px] -mt-0.5 font-bold">▲</span>
            </span>
          </button>

          {/* Shrink Font button Av */}
          <button
            onClick={() => {
              const nextSize = String(Math.max(8, Number(currentSize) - 2));
              setCurrentSize(nextSize);
              handleAction('fontSize', '3');
            }}
            title="Shrink Font (تصغير حجم الخط)"
            className="w-6 h-6 flex items-center justify-center hover:bg-[#e5f1fb] hover:border hover:border-[#0078d7] rounded-xs text-slate-800 text-[11px] font-bold cursor-pointer transition"
          >
            <span className="flex items-end text-xs font-serif leading-none">
              A<span className="text-[9px] -mb-0.5 font-bold">▼</span>
            </span>
          </button>

          {/* Format Painter button (brush) */}
          <button
            onClick={() => {
              onFormatPainter?.();
              setCopiedNotification('نسخ التنسيق نشط');
            }}
            title="Format Painter (نسخ التنسيق)"
            className="w-6 h-6 flex items-center justify-center hover:bg-[#e5f1fb] hover:border hover:border-[#0078d7] rounded-xs text-amber-700 cursor-pointer transition"
          >
            <Paintbrush className="w-3.5 h-3.5" />
          </button>

          {/* Quick Styles Button */}
          <div className="relative">
            <button
              onClick={() => setStylesDropdownOpen(!stylesDropdownOpen)}
              title="Styles (الأنماط)"
              className="h-6 px-1 flex items-center gap-0.5 hover:bg-[#e5f1fb] hover:border hover:border-[#0078d7] rounded-xs text-slate-800 text-[10px] cursor-pointer"
            >
              <div className="flex flex-col items-center leading-none">
                <span className="text-blue-700 font-extrabold text-[11px]">A</span>
              </div>
              <ChevronDown className="w-2.5 h-2.5 text-slate-500" />
            </button>

            {stylesDropdownOpen && (
              <div className="absolute top-7 right-0 bg-white border border-[#c8c8c8] shadow-lg rounded-xs py-1 w-32 z-50 divide-y divide-slate-100">
                <button
                  onClick={() => {
                    handleAction('formatBlock', '<p>');
                    setStylesDropdownOpen(false);
                  }}
                  className="w-full text-left px-2 py-1 hover:bg-[#e5f1fb] text-slate-800 text-xs block"
                >
                  Normal (عادي)
                </button>
                <button
                  onClick={() => {
                    handleAction('formatBlock', '<h1>');
                    setStylesDropdownOpen(false);
                  }}
                  className="w-full text-left px-2 py-1 hover:bg-[#e5f1fb] text-blue-800 font-bold text-sm block"
                >
                  Heading 1 (عنوان 1)
                </button>
                <button
                  onClick={() => {
                    handleAction('formatBlock', '<h2>');
                    setStylesDropdownOpen(false);
                  }}
                  className="w-full text-left px-2 py-1 hover:bg-[#e5f1fb] text-blue-700 font-semibold text-xs block"
                >
                  Heading 2 (عنوان 2)
                </button>
                <button
                  onClick={() => {
                    handleAction('formatBlock', '<blockquote>');
                    setStylesDropdownOpen(false);
                  }}
                  className="w-full text-left px-2 py-1 hover:bg-[#e5f1fb] text-slate-600 italic text-xs block"
                >
                  Quote (اقتباس)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Row 2: Bold, Italic, Underline, Highlight, Font Color, Bullets, Numbering, Styles label */}
        <div className="flex items-center gap-0.5">
          {/* Bold */}
          <button
            onClick={() => handleAction('bold')}
            title="Bold (عريض)"
            className="w-6 h-6 flex items-center justify-center hover:bg-[#e5f1fb] hover:border hover:border-[#0078d7] rounded-xs font-bold text-slate-900 text-xs cursor-pointer"
          >
            B
          </button>

          {/* Italic */}
          <button
            onClick={() => handleAction('italic')}
            title="Italic (مائل)"
            className="w-6 h-6 flex items-center justify-center hover:bg-[#e5f1fb] hover:border hover:border-[#0078d7] rounded-xs italic font-serif text-slate-900 text-xs cursor-pointer"
          >
            I
          </button>

          {/* Underline */}
          <button
            onClick={() => handleAction('underline')}
            title="Underline (تسطير)"
            className="w-6 h-6 flex items-center justify-center hover:bg-[#e5f1fb] hover:border hover:border-[#0078d7] rounded-xs underline font-medium text-slate-900 text-xs cursor-pointer"
          >
            U
          </button>

          {/* Text Highlight Color button with yellow bar underneath and popup */}
          <div className="relative">
            <button
              onClick={() => handleAction('hiliteColor', activeHighlight)}
              onContextMenu={e => {
                e.preventDefault();
                setHighlightPickerOpen(!highlightPickerOpen);
              }}
              title="Text Highlight Color (تمييز النص)"
              className="h-6 px-1 flex items-center gap-0.5 hover:bg-[#e5f1fb] hover:border hover:border-[#0078d7] rounded-xs cursor-pointer"
            >
              <div className="flex flex-col items-center">
                <span className="text-[11px] font-bold text-slate-800 leading-none">ab</span>
                <div
                  className="w-3.5 h-[3px] rounded-xs mt-[1px]"
                  style={{ backgroundColor: activeHighlight }}
                />
              </div>
              <ChevronDown
                className="w-2.5 h-2.5 text-slate-500"
                onClick={e => {
                  e.stopPropagation();
                  setHighlightPickerOpen(!highlightPickerOpen);
                }}
              />
            </button>

            {/* Highlight color picker palette */}
            {highlightPickerOpen && (
              <div className="absolute top-7 left-0 bg-white border border-[#c8c8c8] shadow-lg rounded-xs p-1.5 z-50 grid grid-cols-5 gap-1 w-36">
                {HIGHLIGHT_COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => {
                      setActiveHighlight(c);
                      handleAction('hiliteColor', c);
                      setHighlightPickerOpen(false);
                    }}
                    className="w-5 h-5 rounded-xs border border-slate-300 hover:scale-110 transition cursor-pointer"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Font Color button with red bar underneath and popup */}
          <div className="relative">
            <button
              onClick={() => handleAction('foreColor', activeTextColor)}
              onContextMenu={e => {
                e.preventDefault();
                setColorPickerOpen(!colorPickerOpen);
              }}
              title="Font Color (لون الخط)"
              className="h-6 px-1 flex items-center gap-0.5 hover:bg-[#e5f1fb] hover:border hover:border-[#0078d7] rounded-xs cursor-pointer"
            >
              <div className="flex flex-col items-center">
                <span className="text-[12px] font-bold text-slate-800 leading-none">A</span>
                <div
                  className="w-3.5 h-[3px] rounded-xs mt-[1px]"
                  style={{ backgroundColor: activeTextColor }}
                />
              </div>
              <ChevronDown
                className="w-2.5 h-2.5 text-slate-500"
                onClick={e => {
                  e.stopPropagation();
                  setColorPickerOpen(!colorPickerOpen);
                }}
              />
            </button>

            {/* Font color picker palette */}
            {colorPickerOpen && (
              <div className="absolute top-7 left-0 bg-white border border-[#c8c8c8] shadow-lg rounded-xs p-1.5 z-50 grid grid-cols-6 gap-1 w-40">
                {TEXT_COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => {
                      setActiveTextColor(c);
                      handleAction('foreColor', c);
                      setColorPickerOpen(false);
                    }}
                    className="w-5 h-5 rounded-xs border border-slate-300 hover:scale-110 transition cursor-pointer"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Bullets */}
          <button
            onClick={() => handleAction('insertUnorderedList')}
            title="Bullets (تعداد نقطي)"
            className="w-6 h-6 flex items-center justify-center hover:bg-[#e5f1fb] hover:border hover:border-[#0078d7] rounded-xs text-slate-700 cursor-pointer"
          >
            <List className="w-3.5 h-3.5" />
          </button>

          {/* Numbering */}
          <button
            onClick={() => handleAction('insertOrderedList')}
            title="Numbering (تعداد رقمي)"
            className="w-6 h-6 flex items-center justify-center hover:bg-[#e5f1fb] hover:border hover:border-[#0078d7] rounded-xs text-slate-700 cursor-pointer"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>

          {/* Styles text indicator */}
          <button
            onClick={() => setStylesDropdownOpen(!stylesDropdownOpen)}
            className="text-[10px] text-slate-600 hover:text-blue-700 px-1 hover:bg-[#e5f1fb] rounded-xs h-6 flex items-center"
          >
            Styles
          </button>
        </div>
      </div>

      {/* -------------------- 2. Word Context Menu -------------------- */}
      <div
        className="bg-white border border-[#c8c8c8] rounded-xs shadow-xl py-1 w-[220px] text-[12px] text-slate-800"
        onMouseDown={e => e.preventDefault()}
      >
        {copiedNotification && (
          <div className="px-3 py-1 bg-blue-50 text-blue-700 text-[11px] font-semibold flex items-center gap-1.5 border-b border-blue-100">
            <Check className="w-3 h-3 text-emerald-600" />
            <span>{copiedNotification}</span>
          </div>
        )}

        {/* Cut */}
        <button
          onClick={handleCut}
          className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-[#e5f1fb] text-left cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <Scissors className="w-4 h-4 text-slate-600 group-hover:text-blue-700" />
            <span>Cu<span className="underline">t</span></span>
          </div>
          <span className="text-[10px] text-slate-400">Ctrl+X</span>
        </button>

        {/* Copy */}
        <button
          onClick={handleCopy}
          className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-[#e5f1fb] text-left cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <Copy className="w-4 h-4 text-slate-600 group-hover:text-blue-700" />
            <span><span className="underline">C</span>opy</span>
          </div>
          <span className="text-[10px] text-slate-400">Ctrl+C</span>
        </button>

        {/* Paste Options Section */}
        <div className="px-3 pt-1.5 pb-1 flex flex-col gap-1">
          <div className="text-[11px] font-semibold text-slate-700 flex items-center gap-2">
            <Clipboard className="w-3.5 h-3.5 text-amber-600" />
            <span>Paste Options:</span>
          </div>
          <div className="flex items-center gap-2 pl-5 pt-0.5">
            {/* 1. Keep Source Formatting (clipboard + brush) */}
            <button
              onClick={() => handlePaste('source')}
              title="Keep Source Formatting (الاحتفاظ بتنسيق المصدر)"
              className="p-1 hover:bg-[#e5f1fb] hover:border hover:border-[#0078d7] rounded-xs border border-transparent flex items-center justify-center cursor-pointer group"
            >
              <div className="w-6 h-6 border border-amber-600 bg-amber-50 rounded-xs flex items-center justify-center relative shadow-xs">
                <Paintbrush className="w-3 h-3 text-amber-700" />
              </div>
            </button>

            {/* 2. Merge Formatting (clipboard + arrow) */}
            <button
              onClick={() => handlePaste('merge')}
              title="Merge Formatting (دمج التنسيق)"
              className="p-1 hover:bg-[#e5f1fb] hover:border hover:border-[#0078d7] rounded-xs border border-transparent flex items-center justify-center cursor-pointer group"
            >
              <div className="w-6 h-6 border border-blue-600 bg-blue-50 rounded-xs flex items-center justify-center relative shadow-xs">
                <ArrowRight className="w-3 h-3 text-blue-700" />
              </div>
            </button>

            {/* 3. Keep Text Only (clipboard + A) */}
            <button
              onClick={() => handlePaste('text')}
              title="Keep Text Only (الاحتفاظ بالنص فقط)"
              className="p-1 hover:bg-[#e5f1fb] hover:border hover:border-[#0078d7] rounded-xs border border-transparent flex items-center justify-center cursor-pointer group"
            >
              <div className="w-6 h-6 border border-slate-600 bg-slate-50 rounded-xs flex items-center justify-center relative shadow-xs">
                <span className="text-slate-800 font-bold text-xs">A</span>
              </div>
            </button>
          </div>
        </div>

        {/* Separator */}
        <div className="h-[1px] bg-[#e0e0e0] my-1" />

        {/* Font... */}
        <button
          onClick={() => {
            onOpenFontModal();
            onClose();
          }}
          className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-[#e5f1fb] text-left cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-4 h-4 text-center font-bold font-serif text-slate-800 group-hover:text-blue-700">
              A
            </span>
            <span><span className="underline">F</span>ont...</span>
          </div>
        </button>

        {/* Paragraph... */}
        <button
          onClick={() => {
            onOpenParagraphModal();
            onClose();
          }}
          className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-[#e5f1fb] text-left cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <AlignLeft className="w-4 h-4 text-slate-600 group-hover:text-blue-700" />
            <span><span className="underline">P</span>aragraph...</span>
          </div>
        </button>

        {/* Smart Lookup */}
        <button
          onClick={() => {
            onOpenSmartLookup();
            onClose();
          }}
          className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-[#e5f1fb] text-left cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 rounded-full border border-blue-600 flex items-center justify-center text-[10px] font-bold text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
              i
            </div>
            <span>Smart <span className="underline">L</span>ookup</span>
          </div>
        </button>

        {/* Synonyms Submenu item */}
        <div
          className="relative"
          onMouseEnter={() => setSynonymsSubmenuOpen(true)}
          onMouseLeave={() => setSynonymsSubmenuOpen(false)}
        >
          <button
            onClick={() => setSynonymsSubmenuOpen(!synonymsSubmenuOpen)}
            className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-[#e5f1fb] text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 pl-6">
              <span>S<span className="underline">y</span>nonyms</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {/* Submenu flyout */}
          {synonymsSubmenuOpen && (
            <div
              className="absolute left-[98%] top-0 bg-white border border-[#c8c8c8] rounded-xs shadow-xl py-1 w-[180px] z-50 text-xs"
              onMouseDown={e => e.preventDefault()}
            >
              <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                مرادفات مقترحة
              </div>
              {synonymsList.map((syn, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onReplaceSelectedText(syn);
                    onClose();
                  }}
                  className="w-full px-3 py-1.5 hover:bg-[#e5f1fb] hover:text-blue-700 text-slate-800 text-left block truncate cursor-pointer font-medium"
                >
                  {syn}
                </button>
              ))}
              <div className="h-[1px] bg-slate-100 my-1" />
              <button
                onClick={() => {
                  onOpenSmartLookup();
                  onClose();
                }}
                className="w-full px-3 py-1.5 hover:bg-[#e5f1fb] text-slate-600 text-left text-[11px] block cursor-pointer italic"
              >
                Thesaurus... (المعجم الكامل)
              </button>
            </div>
          )}
        </div>

        {/* Translate */}
        <button
          onClick={() => {
            onOpenTranslate();
            onClose();
          }}
          className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-[#e5f1fb] text-left cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <Languages className="w-4 h-4 text-blue-600" />
            <span>Tran<span className="underline">s</span>late</span>
          </div>
        </button>

        {/* Hyperlink... */}
        <button
          onClick={() => {
            onOpenHyperlink();
            onClose();
          }}
          className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-[#e5f1fb] text-left cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <Globe className="w-4 h-4 text-blue-600" />
            <span>Hyperlin<span className="underline">k</span>...</span>
          </div>
        </button>

        {/* New Comment */}
        <button
          onClick={() => {
            onOpenNewComment();
            onClose();
          }}
          className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-[#e5f1fb] text-left cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <MessageSquare className="w-4 h-4 text-slate-600 group-hover:text-emerald-700" />
              <span className="absolute -top-1 -right-1 text-emerald-600 font-extrabold text-[9px] leading-none">
                +
              </span>
            </div>
            <span>New Co<span className="underline">m</span>ment</span>
          </div>
        </button>
      </div>
    </div>
  );
};
