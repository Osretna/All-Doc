import React, { useState } from 'react';
import { X, Check, AlignRight, AlignCenter, AlignLeft, AlignJustify } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onApply: (config: {
    alignment: 'right' | 'center' | 'left' | 'justify';
    lineSpacing: string;
    indentLeft: number;
    indentRight: number;
    spaceBefore: number;
    spaceAfter: number;
    direction: 'rtl' | 'ltr';
  }) => void;
  initialValues?: {
    alignment?: 'right' | 'center' | 'left' | 'justify';
    lineSpacing?: string;
  };
}

export const WordParagraphModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onApply,
  initialValues,
}) => {
  const [alignment, setAlignment] = useState<'right' | 'center' | 'left' | 'justify'>(
    initialValues?.alignment || 'right'
  );
  const [direction, setDirection] = useState<'rtl' | 'ltr'>('rtl');
  const [lineSpacing, setLineSpacing] = useState(initialValues?.lineSpacing || '1.5');
  const [indentLeft, setIndentLeft] = useState(0);
  const [indentRight, setIndentRight] = useState(0);
  const [spaceBefore, setSpaceBefore] = useState(0);
  const [spaceAfter, setSpaceAfter] = useState(8);

  if (!isOpen) return null;

  const handleSave = () => {
    onApply({
      alignment,
      lineSpacing,
      indentLeft,
      indentRight,
      spaceBefore,
      spaceAfter,
      direction,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none">
      <div
        className="bg-[#f0f2f5] text-slate-800 rounded border border-slate-300 shadow-2xl w-full max-w-lg overflow-hidden font-sans text-xs flex flex-col"
        dir="rtl"
        style={{ fontFamily: 'Segoe UI, Tahoma, sans-serif' }}
      >
        {/* Title Bar */}
        <div className="bg-[#ffffff] px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-slate-800">فقرة (Paragraph)</span>
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
          {/* General Alignment & Direction */}
          <div className="bg-white p-3 rounded border border-slate-200 space-y-3">
            <div className="text-[11px] font-bold text-slate-700">عام (General):</div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">المحاذاة:</label>
                <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setAlignment('right')}
                    className={`p-1.5 rounded flex justify-center items-center ${
                      alignment === 'right' ? 'bg-blue-600 text-white' : 'hover:bg-slate-200 text-slate-700'
                    }`}
                    title="يمين"
                  >
                    <AlignRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setAlignment('center')}
                    className={`p-1.5 rounded flex justify-center items-center ${
                      alignment === 'center' ? 'bg-blue-600 text-white' : 'hover:bg-slate-200 text-slate-700'
                    }`}
                    title="توسيط"
                  >
                    <AlignCenter className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setAlignment('left')}
                    className={`p-1.5 rounded flex justify-center items-center ${
                      alignment === 'left' ? 'bg-blue-600 text-white' : 'hover:bg-slate-200 text-slate-700'
                    }`}
                    title="يسار"
                  >
                    <AlignLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setAlignment('justify')}
                    className={`p-1.5 rounded flex justify-center items-center ${
                      alignment === 'justify' ? 'bg-blue-600 text-white' : 'hover:bg-slate-200 text-slate-700'
                    }`}
                    title="ضبط (Justify)"
                  >
                    <AlignJustify className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">اتجاه النص:</label>
                <select
                  value={direction}
                  onChange={e => setDirection(e.target.value as 'rtl' | 'ltr')}
                  className="w-full bg-white border border-slate-300 rounded px-2 py-1.5 text-xs focus:outline-blue-500"
                >
                  <option value="rtl">من اليمين لليسار (RTL)</option>
                  <option value="ltr">من اليسار لليمين (LTR)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Indentation & Spacing */}
          <div className="bg-white p-3 rounded border border-slate-200 space-y-3">
            <div className="text-[11px] font-bold text-slate-700">المسافة البادئة والتباعد (Indentation & Spacing):</div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">مسافة بادئة قبل النص (سم):</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.5"
                  value={indentRight}
                  onChange={e => setIndentRight(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs focus:outline-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">مسافة بادئة بعد النص (سم):</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.5"
                  value={indentLeft}
                  onChange={e => setIndentLeft(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs focus:outline-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">تباعد الأسطر:</label>
                <select
                  value={lineSpacing}
                  onChange={e => setLineSpacing(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs focus:outline-blue-500"
                >
                  <option value="1.0">مفرد (1.0)</option>
                  <option value="1.15">1.15 أسطر</option>
                  <option value="1.5">1.5 سطر</option>
                  <option value="2.0">مزدوج (2.0)</option>
                  <option value="2.5">2.5 سطر</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">تباعد بعد الفقرة (نقطة):</label>
                <input
                  type="number"
                  min="0"
                  max="72"
                  step="2"
                  value={spaceAfter}
                  onChange={e => setSpaceAfter(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs focus:outline-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Preview Box */}
          <div className="pt-1">
            <span className="text-[11px] font-semibold text-slate-600 block mb-1">معاينة (Preview):</span>
            <div className="bg-white border border-slate-300 rounded p-3 h-24 overflow-hidden text-xs">
              <p
                style={{
                  textAlign: alignment,
                  direction,
                  lineHeight: lineSpacing,
                  paddingRight: `${indentRight * 15}px`,
                  paddingLeft: `${indentLeft * 15}px`,
                  marginBottom: `${spaceAfter}px`,
                }}
                className="text-slate-800 leading-normal"
              >
                هذا نموذج لمعاينة شكل وتنسيق الفقرة داخل المحرر المكتبي بعد تطبيق التباعد والمحاذاة والمسافات البادئة المحددة بدقة.
              </p>
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
