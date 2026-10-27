import React, { useRef, useEffect } from 'react';
import { FunctionSquare, Check, X, MousePointerClick } from 'lucide-react';

interface FormulaBarProps {
  activeCellLabel: string;
  formulaValue: string;
  onChangeFormula: (val: string) => void;
  onCommitFormula: () => void;
  onCancelFormula: () => void;
  isFormulaMode: boolean;
  onOpenFunctionsModal: () => void;
}

export const FormulaBar: React.FC<FormulaBarProps> = ({
  activeCellLabel,
  formulaValue,
  onChangeFormula,
  onCommitFormula,
  onCancelFormula,
  isFormulaMode,
  onOpenFunctionsModal
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onCommitFormula();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancelFormula();
    }
  };

  return (
    <div className="bg-white border-b border-slate-300 px-3 py-1 flex items-center gap-2 text-xs select-none shadow-2xs">
      {/* Active Cell Name Box */}
      <div
        className="w-16 h-7 bg-slate-50 border border-slate-300 rounded font-mono font-bold text-center flex items-center justify-center text-slate-800 shadow-inner"
        title="اسم وموقع الخانة النشطة"
      >
        {activeCellLabel || 'A1'}
      </div>

      {/* Buttons: Cancel & Commit */}
      <div className="flex items-center gap-0.5">
        <button
          onClick={onCancelFormula}
          className="w-6 h-7 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition"
          title="إلغاء (Escape)"
        >
          <X className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onCommitFormula}
          className="w-6 h-7 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition"
          title="تطبيق (Enter)"
        >
          <Check className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* fx Function Symbol Button */}
      <button
        onClick={onOpenFunctionsModal}
        className="flex items-center gap-1 px-1.5 h-7 rounded text-slate-600 hover:text-emerald-700 hover:bg-slate-100 font-serif italic font-bold border border-transparent hover:border-slate-300 transition"
        title="إدراج دالة رياضية fx"
      >
        <span className="text-sm font-bold text-slate-700">fx</span>
      </button>

      {/* Real-time Formula Bar Input */}
      <div className="relative flex-1 flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={formulaValue}
          onChange={(e) => onChangeFormula(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="أدخل قيمة أو معادلة (مثال: =SUM(A1:A5) أو =A1+B1 أو نص عادي)"
          className={`w-full h-7 px-2.5 rounded font-mono text-xs text-slate-900 border transition outline-none shadow-2xs ${
            isFormulaMode
              ? 'border-emerald-500 ring-2 ring-emerald-400/30 bg-emerald-50/20'
              : 'border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 bg-white'
          }`}
        />

        {/* Indicator if user is entering a formula */}
        {isFormulaMode && (
          <div className="absolute left-2 flex items-center gap-1 text-[11px] font-sans font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full pointer-events-none animate-pulse">
            <MousePointerClick className="w-3 h-3 text-emerald-600" />
            <span>انقر على أي خانة لاختيارها</span>
          </div>
        )}
      </div>
    </div>
  );
};
