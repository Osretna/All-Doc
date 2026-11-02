import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onApply: (fontConfig: {
    fontFamily: string;
    fontSize: string;
    isBold: boolean;
    isItalic: boolean;
    color: string;
    underline: boolean;
    strikethrough: boolean;
    superscript: boolean;
    subscript: boolean;
  }) => void;
  initialValues?: {
    fontFamily?: string;
    fontSize?: string;
    isBold?: boolean;
    isItalic?: boolean;
    color?: string;
  };
}

const FONTS = [
  'Arial',
  'Calibri',
  'Cairo',
  'Amiri',
  'Tajawal',
  'Almarai',
  'Segoe UI',
  'Times New Roman',
  'Tahoma',
  'Courier New',
  'Georgia',
  'Verdana',
];

const FONT_STYLES = [
  { id: 'regular', label: 'عادي (Regular)' },
  { id: 'italic', label: 'مائل (Italic)' },
  { id: 'bold', label: 'عريض (Bold)' },
  { id: 'boldItalic', label: 'عريض ومائل (Bold Italic)' },
];

const SIZES = ['8', '9', '10', '11', '12', '14', '16', '18', '20', '22', '24', '26', '28', '36', '48', '72'];

export const WordFontModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onApply,
  initialValues,
}) => {
  const [fontFamily, setFontFamily] = useState(initialValues?.fontFamily || 'Arial');
  const [styleMode, setStyleMode] = useState<string>(
    initialValues?.isBold && initialValues?.isItalic
      ? 'boldItalic'
      : initialValues?.isBold
      ? 'bold'
      : initialValues?.isItalic
      ? 'italic'
      : 'regular'
  );
  const [fontSize, setFontSize] = useState(initialValues?.fontSize || '11');
  const [color, setColor] = useState(initialValues?.color || '#000000');
  const [underline, setUnderline] = useState(false);
  const [strikethrough, setStrikethrough] = useState(false);
  const [superscript, setSuperscript] = useState(false);
  const [subscript, setSubscript] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onApply({
      fontFamily,
      fontSize,
      isBold: styleMode === 'bold' || styleMode === 'boldItalic',
      isItalic: styleMode === 'italic' || styleMode === 'boldItalic',
      color,
      underline,
      strikethrough,
      superscript,
      subscript,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none">
      <div
        className="bg-[#f0f2f5] text-slate-800 rounded border border-slate-300 shadow-2xl w-full max-w-xl overflow-hidden font-sans text-xs flex flex-col"
        dir="rtl"
        style={{ fontFamily: 'Segoe UI, Tahoma, sans-serif' }}
      >
        {/* Title Bar */}
        <div className="bg-[#ffffff] px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-slate-800">خط (Font)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Top 3 Lists: Font, Font Style, Size */}
          <div className="grid grid-cols-12 gap-3">
            {/* Font column */}
            <div className="col-span-6 flex flex-col">
              <label className="text-[11px] font-semibold text-slate-600 mb-1">الخط:</label>
              <input
                type="text"
                value={fontFamily}
                onChange={e => setFontFamily(e.target.value)}
                className="bg-white border border-slate-300 rounded px-2 py-1 mb-1 text-xs focus:outline-blue-500"
              />
              <div className="bg-white border border-slate-300 rounded h-28 overflow-y-auto divide-y divide-slate-100 text-xs">
                {FONTS.map(f => (
                  <div
                    key={f}
                    onClick={() => setFontFamily(f)}
                    className={`px-2 py-1 cursor-pointer hover:bg-blue-50 ${
                      fontFamily.toLowerCase() === f.toLowerCase() ? 'bg-blue-600 text-white hover:bg-blue-600' : ''
                    }`}
                    style={{ fontFamily: f }}
                  >
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Font Style column */}
            <div className="col-span-3 flex flex-col">
              <label className="text-[11px] font-semibold text-slate-600 mb-1">نمط الخط:</label>
              <div className="bg-white border border-slate-300 rounded h-[142px] overflow-y-auto divide-y divide-slate-100 text-xs">
                {FONT_STYLES.map(s => (
                  <div
                    key={s.id}
                    onClick={() => setStyleMode(s.id)}
                    className={`px-2 py-1.5 cursor-pointer hover:bg-blue-50 ${
                      styleMode === s.id ? 'bg-blue-600 text-white hover:bg-blue-600' : ''
                    }`}
                  >
                    {s.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Font Size column */}
            <div className="col-span-3 flex flex-col">
              <label className="text-[11px] font-semibold text-slate-600 mb-1">الحجم:</label>
              <input
                type="text"
                value={fontSize}
                onChange={e => setFontSize(e.target.value)}
                className="bg-white border border-slate-300 rounded px-2 py-1 mb-1 text-xs focus:outline-blue-500"
              />
              <div className="bg-white border border-slate-300 rounded h-28 overflow-y-auto divide-y divide-slate-100 text-xs">
                {SIZES.map(sz => (
                  <div
                    key={sz}
                    onClick={() => setFontSize(sz)}
                    className={`px-2 py-1 cursor-pointer hover:bg-blue-50 ${
                      fontSize === sz ? 'bg-blue-600 text-white hover:bg-blue-600' : ''
                    }`}
                  >
                    {sz}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Color & Underline Row */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">لون الخط:</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={e => setColor(e.target.value)}
                  className="w-8 h-8 rounded border border-slate-300 cursor-pointer p-0.5 bg-white"
                />
                <span className="text-slate-600 text-xs">{color}</span>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">تسطير:</label>
              <label className="flex items-center gap-2 cursor-pointer mt-1.5">
                <input
                  type="checkbox"
                  checked={underline}
                  onChange={e => setUnderline(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs text-slate-700">تسطير أسفل الكلمات</span>
              </label>
            </div>
          </div>

          {/* Effects Section */}
          <div className="pt-2 border-t border-slate-200">
            <span className="text-[11px] font-semibold text-slate-600 block mb-2">تأثيرات (Effects):</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={strikethrough}
                  onChange={e => setStrikethrough(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-700">يتوسطه خط (Strikethrough)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={superscript}
                  onChange={e => {
                    setSuperscript(e.target.checked);
                    if (e.target.checked) setSubscript(false);
                  }}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-700">مرتفع (Superscript)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={subscript}
                  onChange={e => {
                    setSubscript(e.target.checked);
                    if (e.target.checked) setSuperscript(false);
                  }}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-700">منخفض (Subscript)</span>
              </label>
            </div>
          </div>

          {/* Preview Box */}
          <div className="pt-2 border-t border-slate-200">
            <span className="text-[11px] font-semibold text-slate-600 block mb-1">معاينة (Preview):</span>
            <div className="bg-white border border-slate-300 rounded p-4 h-24 flex items-center justify-center overflow-hidden">
              <span
                style={{
                  fontFamily,
                  fontSize: `${fontSize}px`,
                  color,
                  fontWeight: styleMode === 'bold' || styleMode === 'boldItalic' ? 'bold' : 'normal',
                  fontStyle: styleMode === 'italic' || styleMode === 'boldItalic' ? 'italic' : 'normal',
                  textDecoration: `${underline ? 'underline' : ''} ${strikethrough ? 'line-through' : ''}`.trim() || 'none',
                  verticalAlign: superscript ? 'super' : subscript ? 'sub' : 'baseline',
                }}
              >
                نموذج النص المكتبي المعاين - Office Suite
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-[#e9edf2] px-4 py-2.5 border-t border-slate-300 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded shadow-xs text-xs font-medium transition cursor-pointer"
          >
            إلغاء الأمر
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-1.5 bg-[#005a9e] hover:bg-[#004578] text-white rounded shadow-xs text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>موافق</span>
          </button>
        </div>
      </div>
    </div>
  );
};
