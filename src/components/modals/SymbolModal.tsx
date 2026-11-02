import React, { useState } from 'react';
import { Pi, X } from 'lucide-react';

interface SymbolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertSymbol: (symbol: string) => void;
  initialTab?: 'symbol' | 'equation';
}

export const SymbolModal: React.FC<SymbolModalProps> = ({
  isOpen,
  onClose,
  onInsertSymbol,
  initialTab = 'symbol',
}) => {
  const [tab, setTab] = useState<'symbol' | 'equation'>(initialTab);

  if (!isOpen) return null;

  const symbols = [
    '©', '®', '™', '§', '¶', '•', '–', '—', '‰', '°',
    '€', '$', '£', '¥', '₹', '₽', '₩', '₺', '¢', '﷼',
    '±', '≠', '≤', '≥', '≈', '≡', '×', '÷', '√', '∞',
    'α', 'β', 'γ', 'δ', 'ε', 'θ', 'λ', 'μ', 'π', 'σ',
    'φ', 'ω', 'Δ', 'Ω', '∑', '∏', '∫', '∂', '∇', '∈',
    '←', '↑', '→', '↓', '↔', '⇒', '⇔', '✓', '✔', '✗',
    '★', '☆', '✦', '✧', '♦', '♠', '♣', '♥', '♪', '♫',
    '﷽', 'ﷺ', 'ﷻ', '۝', '۞', '﴾', '﴿', 'ﷻ', 'ؓ', 'ؒ'
  ];

  const equations = [
    { name: 'مساحة الدائرة', formula: 'A = π r²' },
    { name: 'نظرية فيثاغورس', formula: 'a² + b² = c²' },
    { name: 'القانون العام لحل المعادلات', formula: 'x = (-b ± √(b² - 4ac)) / (2a)' },
    { name: 'قانون أينشتاين للطاقة', formula: 'E = m c²' },
    { name: 'مجموع متتالية', formula: '∑(i=1 to n) i = n(n+1)/2' },
    { name: 'تكامل تفاضلي', formula: '∫ f(x) dx = F(x) + C' },
    { name: 'قانون نيوتن الثاني', formula: 'F = m · a' },
    { name: 'دالة الجيب وجيب التمام', formula: 'sin²(θ) + cos²(θ) = 1' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4">
      <div 
        className="w-full max-w-md bg-white rounded-lg shadow-2xl border border-slate-300 overflow-hidden text-right"
        dir="rtl"
      >
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#2b579a] text-white">
          <div className="flex items-center gap-2">
            <Pi className="w-4 h-4 text-white" />
            <span className="font-semibold text-sm">
              {tab === 'symbol' ? 'إدراج رمز (Insert Symbol)' : 'إدراج معادلة (Insert Equation)'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded text-white/90 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-medium">
          <button
            onClick={() => setTab('symbol')}
            className={`flex-1 py-2 text-center border-b-2 transition-colors ${
              tab === 'symbol'
                ? 'border-[#2b579a] text-[#2b579a] bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            رموز خاصة (Symbols)
          </button>
          <button
            onClick={() => setTab('equation')}
            className={`flex-1 py-2 text-center border-b-2 transition-colors ${
              tab === 'equation'
                ? 'border-[#2b579a] text-[#2b579a] bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            معادلات وصيغ رياضية (Equations)
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 max-h-80 overflow-y-auto">
          {tab === 'symbol' ? (
            <div className="grid grid-cols-8 gap-1.5 text-center">
              {symbols.map((sym, i) => (
                <button
                  key={i}
                  onClick={() => {
                    onInsertSymbol(sym);
                    onClose();
                  }}
                  className="w-9 h-9 flex items-center justify-center text-base hover:bg-blue-100 hover:text-[#2b579a] border border-slate-200 hover:border-blue-400 rounded transition-colors font-serif"
                  title={sym}
                >
                  {sym}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-slate-500 mb-2">انقر فوق أي صيغة لإدراجها في مكان المؤشر:</p>
              {equations.map((eq, i) => (
                <button
                  key={i}
                  onClick={() => {
                    onInsertSymbol(`<span class="inline-block px-2.5 py-1 my-1 bg-slate-100 border border-slate-300 rounded font-mono text-sm text-[#2b579a] dir-ltr" dir="ltr">${eq.formula}</span> `);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded border border-slate-200 hover:border-[#2b579a] hover:bg-blue-50/50 transition-colors text-right group"
                >
                  <span className="text-xs font-semibold text-slate-700">{eq.name}</span>
                  <span className="font-mono text-xs text-[#2b579a] group-hover:font-bold dir-ltr" dir="ltr">
                    {eq.formula}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end p-3 bg-slate-50 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-slate-300 text-xs text-slate-700 rounded hover:bg-slate-100 transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
