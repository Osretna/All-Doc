import React, { useState } from 'react';
import { X, Sparkles, Hash } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onInsertSymbol: (symbol: string) => void;
  initialTab?: 'symbol' | 'equation';
}

const COMMON_SYMBOLS = [
  '©', '®', '™', '§', '¶', '•', '★', '☆', '✓', '✗', '➜', '➔',
  '±', '×', '÷', '≠', '≈', '≤', '≥', '∞', '∑', '∏', '√', '∫',
  'α', 'β', 'γ', 'δ', 'ε', 'θ', 'λ', 'μ', 'π', 'σ', 'φ', 'ω',
  '€', '$', '£', '¥', '₹', '₽', 'ر.س', 'ج.م', 'د.إ', 'د.ك', '٪'
];

const EQUATIONS = [
  { name: 'نظرية فيثاغورس', html: '<span class="font-serif italic text-base">a² + b² = c²</span>' },
  { name: 'مساحة الدائرة', html: '<span class="font-serif italic text-base">A = π r²</span>' },
  { name: 'معادلة الدرجة الثانية', html: '<span class="font-serif italic text-base">x = (-b ± √(b² - 4ac)) / 2a</span>' },
  { name: 'معادلة أينشتاين للطاقة', html: '<span class="font-serif italic text-base">E = m c²</span>' },
  { name: 'قانون أوم الكهربائي', html: '<span class="font-serif italic text-base">V = I × R</span>' },
];

export const WordSymbolModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onInsertSymbol,
  initialTab = 'symbol'
}) => {
  const [tab, setTab] = useState<'symbol' | 'equation'>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-300 w-full max-w-md flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        <div className="flex items-center justify-between px-4 py-3 bg-[#004578] text-white">
          <div className="flex items-center gap-2">
            <span className="font-serif font-black text-sm">Ω / π</span>
            <h3 className="font-bold text-sm">إدراج رمز أو معادلة رياضية</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded cursor-pointer transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex border-b border-gray-200 bg-gray-50 text-xs font-bold">
          <button
            onClick={() => setTab('symbol')}
            className={`flex-1 py-2 text-center border-b-2 cursor-pointer transition ${
              tab === 'symbol' ? 'border-[#004578] text-[#004578] bg-white' : 'border-transparent text-gray-500'
            }`}
          >
            رموز خاصة (Symbols)
          </button>
          <button
            onClick={() => setTab('equation')}
            className={`flex-1 py-2 text-center border-b-2 cursor-pointer transition ${
              tab === 'equation' ? 'border-[#004578] text-[#004578] bg-white' : 'border-transparent text-gray-500'
            }`}
          >
            معادلات رياضية (Equations)
          </button>
        </div>

        <div className="p-4 space-y-3 text-xs text-gray-700">
          {tab === 'symbol' ? (
            <div>
              <p className="text-gray-500 mb-2">انقر على أي رمز لإدراجه فوراً في موضع المؤشر:</p>
              <div className="grid grid-cols-6 gap-2 p-2 bg-gray-50 rounded border border-gray-200 max-h-60 overflow-y-auto">
                {COMMON_SYMBOLS.map(sym => (
                  <button
                    key={sym}
                    onClick={() => {
                      onInsertSymbol(sym);
                      onClose();
                    }}
                    className="h-10 rounded bg-white border border-gray-300 hover:border-blue-600 hover:bg-blue-50 text-lg font-serif font-bold text-gray-800 flex items-center justify-center cursor-pointer transition shadow-2xs"
                  >
                    {sym}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              <p className="text-gray-500">اختر من المعادلات القياسية المجهزة:</p>
              {EQUATIONS.map(eq => (
                <div
                  key={eq.name}
                  onClick={() => {
                    onInsertSymbol(`&nbsp;${eq.html}&nbsp;`);
                    onClose();
                  }}
                  className="p-3 border border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50/50 cursor-pointer transition flex items-center justify-between group"
                >
                  <span className="font-bold text-gray-800">{eq.name}</span>
                  <div
                    className="dir-ltr text-gray-700 font-mono text-sm group-hover:text-blue-700"
                    dangerouslySetInnerHTML={{ __html: eq.html }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-4 py-2.5 bg-gray-100 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-medium cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
