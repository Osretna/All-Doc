import React, { useState } from 'react';
import { X, Search, Check, Sparkles } from 'lucide-react';

interface FunctionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFunction: (syntax: string) => void;
}

interface FunctionItem {
  name: string;
  syntax: string;
  description: string;
  example: string;
  category: 'رياضية' | 'إحصائية' | 'منطقية';
}

const FUNCTIONS_LIST: FunctionItem[] = [
  {
    name: 'SUM',
    syntax: '=SUM(',
    description: 'تقوم بجمع الأرقام أو النطاقات المحددة لحساب الإجمالي.',
    example: '=SUM(A1:A10) أو =SUM(A1, B2, C3)',
    category: 'رياضية'
  },
  {
    name: 'AVERAGE',
    syntax: '=AVERAGE(',
    description: 'تحسب المتوسط الحسابي للقيم المحددة.',
    example: '=AVERAGE(B2:B20)',
    category: 'إحصائية'
  },
  {
    name: 'COUNT',
    syntax: '=COUNT(',
    description: 'تقوم بحساب عدد الخانات التي تحتوي على أرقام.',
    example: '=COUNT(A1:A50)',
    category: 'إحصائية'
  },
  {
    name: 'MAX',
    syntax: '=MAX(',
    description: 'تستخرج أعلى وأكبر قيمة رقمية من النطاق.',
    example: '=MAX(C1:C15)',
    category: 'إحصائية'
  },
  {
    name: 'MIN',
    syntax: '=MIN(',
    description: 'تستخرج أصغر وأقل قيمة رقمية من النطاق.',
    example: '=MIN(C1:C15)',
    category: 'إحصائية'
  },
  {
    name: 'IF',
    syntax: '=IF(',
    description: 'دالة شرطية ترجع قيمة أولى إذا تحقق الشرط، وقيمة ثانية إذا لم يتحقق.',
    example: '=IF(A1 > 50, "ناجح", "راسب")',
    category: 'منطقية'
  }
];

export const FunctionsModal: React.FC<FunctionsModalProps> = ({
  isOpen,
  onClose,
  onSelectFunction
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');

  if (!isOpen) return null;

  const filtered = FUNCTIONS_LIST.filter((fn) => {
    const matchesSearch =
      fn.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fn.description.includes(searchTerm);
    const matchesCat =
      selectedCategory === 'الكل' || fn.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-lg shadow-2xl border border-slate-300 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-emerald-800 text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-300" />
            <h2 className="font-bold text-sm">مكتبة الدوال والمعادلات (fx)</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-emerald-700 text-emerald-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Search & Filter */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              <input
                type="text"
                placeholder="ابحث عن دالة (مثال: SUM, AVERAGE)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-3 pr-9 py-1.5 text-xs border border-slate-300 rounded-md focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs border border-slate-300 rounded-md px-2 py-1.5 bg-slate-50 text-slate-700 outline-none"
            >
              <option value="الكل">جميع الفئات</option>
              <option value="رياضية">رياضية</option>
              <option value="إحصائية">إحصائية</option>
              <option value="منطقية">منطقية</option>
            </select>
          </div>

          {/* List of Functions */}
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-md max-h-60 overflow-y-auto">
            {filtered.map((fn) => (
              <div
                key={fn.name}
                onClick={() => {
                  onSelectFunction(fn.syntax);
                  onClose();
                }}
                className="p-2.5 hover:bg-emerald-50 cursor-pointer transition flex items-center justify-between group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-emerald-800 font-mono">
                      {fn.name}
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                      {fn.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">{fn.description}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    مثال: {fn.example}
                  </p>
                </div>
                <button
                  className="px-2.5 py-1 text-xs bg-emerald-600 group-hover:bg-emerald-700 text-white rounded font-medium shadow-xs transition"
                >
                  إدراج
                </button>
              </div>
            ))}
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded p-2.5 text-[11px] text-emerald-800">
            💡 <strong>ملاحظة هامة:</strong> بمجرد إدراج الدالة، يمكنك النقر بنقرة واحدة (Single Click) على أي خانة في الجدول لإضافتها مباشرة إلى المعادلة دون الحاجة للنقر المزدوج!
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-4 py-2 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded transition"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
