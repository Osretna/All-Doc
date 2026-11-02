import React, { useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  DollarSign,
  Percent,
  Hash,
  Palette,
  Type,
  PlusCircle,
  MinusCircle,
  Sigma,
  Trash2,
  ChevronDown
} from 'lucide-react';
import { CellStyle } from '../types/excel';

interface ToolbarProps {
  currentStyle?: CellStyle;
  onApplyStyle: (styleUpdate: Partial<CellStyle>) => void;
  onInsertFormula: (formulaName: 'SUM' | 'AVERAGE' | 'COUNT' | 'MAX' | 'MIN') => void;
  onInsertRow: () => void;
  onInsertColumn: () => void;
  onDeleteRow: () => void;
  onDeleteColumn: () => void;
  onClearCell: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  currentStyle = {},
  onApplyStyle,
  onInsertFormula,
  onInsertRow,
  onInsertColumn,
  onDeleteRow,
  onDeleteColumn,
  onClearCell
}) => {
  const [showFormulaMenu, setShowFormulaMenu] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState<'font' | 'bg' | null>(null);

  const colors = [
    '#ffffff', '#000000', '#ef4444', '#f97316', '#eab308',
    '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
    '#fee2e2', '#ffedd5', '#fef9c3', '#dcfce7', '#cffafe',
    '#dbeafe', '#ede9fe', '#fce7f3', '#f1f5f9', '#cbd5e1'
  ];

  return (
    <div className="bg-slate-100 border-b border-slate-300 px-3 py-1 flex flex-wrap items-center gap-1.5 text-slate-700 select-none text-xs">
      {/* Font Styles */}
      <div className="flex items-center bg-white border border-slate-300 rounded shadow-xs p-0.5">
        <button
          onClick={() => onApplyStyle({ bold: !currentStyle.bold })}
          className={`p-1 rounded hover:bg-slate-100 transition ${
            currentStyle.bold ? 'bg-emerald-100 text-emerald-800 font-bold' : ''
          }`}
          title="عريض (Bold)"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => onApplyStyle({ italic: !currentStyle.italic })}
          className={`p-1 rounded hover:bg-slate-100 transition ${
            currentStyle.italic ? 'bg-emerald-100 text-emerald-800' : ''
          }`}
          title="مائل (Italic)"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={() => onApplyStyle({ underline: !currentStyle.underline })}
          className={`p-1 rounded hover:bg-slate-100 transition ${
            currentStyle.underline ? 'bg-emerald-100 text-emerald-800' : ''
          }`}
          title="تسطير (Underline)"
        >
          <Underline className="w-4 h-4" />
        </button>
      </div>

      <div className="h-5 w-px bg-slate-300 mx-0.5" />

      {/* Colors: Text & Fill */}
      <div className="flex items-center gap-1 bg-white border border-slate-300 rounded shadow-xs p-0.5 relative">
        {/* Text Color */}
        <div className="relative">
          <button
            onClick={() => setShowColorPicker(showColorPicker === 'font' ? null : 'font')}
            className="flex items-center gap-0.5 p-1 rounded hover:bg-slate-100"
            title="لون الخط"
          >
            <Type className="w-4 h-4" style={{ color: currentStyle.color || '#000000' }} />
            <ChevronDown className="w-2.5 h-2.5 opacity-60" />
          </button>
          {showColorPicker === 'font' && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowColorPicker(null)} />
              <div className="absolute top-full left-0 mt-1 p-2 bg-white rounded shadow-xl border border-slate-200 z-40 w-44 grid grid-cols-5 gap-1.5">
                {colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      onApplyStyle({ color: c });
                      setShowColorPicker(null);
                    }}
                    className="w-6 h-6 rounded border border-slate-300 hover:scale-110 transition shadow-xs"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Fill Color */}
        <div className="relative">
          <button
            onClick={() => setShowColorPicker(showColorPicker === 'bg' ? null : 'bg')}
            className="flex items-center gap-0.5 p-1 rounded hover:bg-slate-100"
            title="لون التعبئة / الخلفية"
          >
            <Palette className="w-4 h-4 text-slate-700" />
            <span
              className="w-2.5 h-2.5 rounded-full border border-slate-400"
              style={{ backgroundColor: currentStyle.backgroundColor || '#ffffff' }}
            />
          </button>
          {showColorPicker === 'bg' && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowColorPicker(null)} />
              <div className="absolute top-full left-0 mt-1 p-2 bg-white rounded shadow-xl border border-slate-200 z-40 w-44 grid grid-cols-5 gap-1.5">
                {colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      onApplyStyle({ backgroundColor: c });
                      setShowColorPicker(null);
                    }}
                    className="w-6 h-6 rounded border border-slate-300 hover:scale-110 transition shadow-xs"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="h-5 w-px bg-slate-300 mx-0.5" />

      {/* Alignment */}
      <div className="flex items-center bg-white border border-slate-300 rounded shadow-xs p-0.5">
        <button
          onClick={() => onApplyStyle({ align: 'right' })}
          className={`p-1 rounded hover:bg-slate-100 transition ${
            currentStyle.align === 'right' ? 'bg-emerald-100 text-emerald-800' : ''
          }`}
          title="محاذاة لليمين"
        >
          <AlignRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => onApplyStyle({ align: 'center' })}
          className={`p-1 rounded hover:bg-slate-100 transition ${
            currentStyle.align === 'center' ? 'bg-emerald-100 text-emerald-800' : ''
          }`}
          title="محاذاة للوسط"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          onClick={() => onApplyStyle({ align: 'left' })}
          className={`p-1 rounded hover:bg-slate-100 transition ${
            currentStyle.align === 'left' ? 'bg-emerald-100 text-emerald-800' : ''
          }`}
          title="محاذاة لليسار"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
      </div>

      <div className="h-5 w-px bg-slate-300 mx-0.5" />

      {/* Number Formats */}
      <div className="flex items-center bg-white border border-slate-300 rounded shadow-xs p-0.5">
        <button
          onClick={() => onApplyStyle({ format: currentStyle.format === 'currency' ? 'text' : 'currency' })}
          className={`px-1.5 py-1 rounded hover:bg-slate-100 flex items-center gap-1 font-semibold text-[11px] ${
            currentStyle.format === 'currency' ? 'bg-emerald-100 text-emerald-800' : ''
          }`}
          title="تنسيق العملة (ج.م / $)"
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>عملة</span>
        </button>
        <button
          onClick={() => onApplyStyle({ format: currentStyle.format === 'percent' ? 'text' : 'percent' })}
          className={`px-1.5 py-1 rounded hover:bg-slate-100 flex items-center gap-1 font-semibold text-[11px] ${
            currentStyle.format === 'percent' ? 'bg-emerald-100 text-emerald-800' : ''
          }`}
          title="تنسيق النسبة المئوية (%)"
        >
          <Percent className="w-3.5 h-3.5" />
          <span>نسبة %</span>
        </button>
        <button
          onClick={() => onApplyStyle({ format: currentStyle.format === 'number' ? 'text' : 'number' })}
          className={`px-1.5 py-1 rounded hover:bg-slate-100 flex items-center gap-1 font-semibold text-[11px] ${
            currentStyle.format === 'number' ? 'bg-emerald-100 text-emerald-800' : ''
          }`}
          title="تنسيق رقمي مع فواصل"
        >
          <Hash className="w-3.5 h-3.5" />
          <span>رقم</span>
        </button>
      </div>

      <div className="h-5 w-px bg-slate-300 mx-0.5" />

      {/* Quick Auto-Sum & Formulas Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowFormulaMenu(!showFormulaMenu)}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded shadow-xs transition"
          title="إدراج معادلة سريعة (جمع، متوسط، أعلى قيمة...)"
        >
          <Sigma className="w-4 h-4" />
          <span>دالة جمع ∑</span>
          <ChevronDown className="w-3 h-3 opacity-80" />
        </button>

        {showFormulaMenu && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setShowFormulaMenu(false)} />
            <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-xl border border-slate-200 py-1 z-40 text-xs text-slate-800 font-medium">
              <button
                onClick={() => {
                  onInsertFormula('SUM');
                  setShowFormulaMenu(false);
                }}
                className="w-full text-right px-3 py-1.5 hover:bg-emerald-50 flex items-center justify-between"
              >
                <span>الجمع الإجمالي (SUM)</span>
                <span className="font-mono text-emerald-600 font-bold">=SUM()</span>
              </button>
              <button
                onClick={() => {
                  onInsertFormula('AVERAGE');
                  setShowFormulaMenu(false);
                }}
                className="w-full text-right px-3 py-1.5 hover:bg-emerald-50 flex items-center justify-between"
              >
                <span>المتوسط الحسابي (AVERAGE)</span>
                <span className="font-mono text-emerald-600 font-bold">=AVERAGE()</span>
              </button>
              <button
                onClick={() => {
                  onInsertFormula('COUNT');
                  setShowFormulaMenu(false);
                }}
                className="w-full text-right px-3 py-1.5 hover:bg-emerald-50 flex items-center justify-between"
              >
                <span>عدد الخانات (COUNT)</span>
                <span className="font-mono text-emerald-600 font-bold">=COUNT()</span>
              </button>
              <button
                onClick={() => {
                  onInsertFormula('MAX');
                  setShowFormulaMenu(false);
                }}
                className="w-full text-right px-3 py-1.5 hover:bg-emerald-50 flex items-center justify-between"
              >
                <span>أعلى قيمة (MAX)</span>
                <span className="font-mono text-emerald-600 font-bold">=MAX()</span>
              </button>
              <button
                onClick={() => {
                  onInsertFormula('MIN');
                  setShowFormulaMenu(false);
                }}
                className="w-full text-right px-3 py-1.5 hover:bg-emerald-50 flex items-center justify-between"
              >
                <span>أقل قيمة (MIN)</span>
                <span className="font-mono text-emerald-600 font-bold">=MIN()</span>
              </button>
            </div>
          </>
        )}
      </div>

      <div className="h-5 w-px bg-slate-300 mx-0.5" />

      {/* Grid Management: Rows and Columns */}
      <div className="flex items-center gap-1 bg-white border border-slate-300 rounded shadow-xs p-0.5">
        <button
          onClick={onInsertRow}
          className="px-2 py-0.5 hover:bg-slate-100 rounded text-slate-700 flex items-center gap-1 text-[11px]"
          title="إضافة صف جديد"
        >
          <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span>صف +</span>
        </button>
        <button
          onClick={onInsertColumn}
          className="px-2 py-0.5 hover:bg-slate-100 rounded text-slate-700 flex items-center gap-1 text-[11px]"
          title="إضافة عمود جديد"
        >
          <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span>عمود +</span>
        </button>
        <button
          onClick={onDeleteRow}
          className="px-2 py-0.5 hover:bg-red-50 rounded text-slate-700 hover:text-red-600 flex items-center gap-1 text-[11px]"
          title="حذف الصف المحدد"
        >
          <MinusCircle className="w-3.5 h-3.5 text-red-500" />
          <span>حذف صف</span>
        </button>
        <button
          onClick={onDeleteColumn}
          className="px-2 py-0.5 hover:bg-red-50 rounded text-slate-700 hover:text-red-600 flex items-center gap-1 text-[11px]"
          title="حذف العمود المحدد"
        >
          <MinusCircle className="w-3.5 h-3.5 text-red-500" />
          <span>حذف عمود</span>
        </button>
      </div>

      {/* Clear cell */}
      <button
        onClick={onClearCell}
        className="p-1 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition ml-auto"
        title="مسح محتوى الخانة"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};
