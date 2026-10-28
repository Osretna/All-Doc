import React, { useState } from 'react';
import { X, Search, FunctionSquare, Info } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onInsertFunction: (formulaSyntax: string) => void;
}

interface FunctionDoc {
  name: string;
  category: 'math' | 'logical' | 'lookup' | 'text' | 'date' | 'financial';
  syntax: string;
  description: string;
  example: string;
}

const FUNCTIONS_LIST: FunctionDoc[] = [
  { name: 'SUM', category: 'math', syntax: 'SUM(نطاق)', description: 'جمع جميع الأرقام في نطاق محدد من الخلايا.', example: '=SUM(A1:A10)' },
  { name: 'AVERAGE', category: 'math', syntax: 'AVERAGE(نطاق)', description: 'حساب المتوسط الحسابي للأرقام في النطاق المحدد.', example: '=AVERAGE(B2:B8)' },
  { name: 'COUNT', category: 'math', syntax: 'COUNT(نطاق)', description: 'حساب عدد الخلايا التي تحتوي على أرقام.', example: '=COUNT(A1:D20)' },
  { name: 'COUNTA', category: 'math', syntax: 'COUNTA(نطاق)', description: 'حساب عدد الخلايا غير الفارغة في النطاق.', example: '=COUNTA(A1:A50)' },
  { name: 'MAX', category: 'math', syntax: 'MAX(نطاق)', description: 'إرجاع أكبر قيمة رقمية موجودة في النطاق.', example: '=MAX(C1:C15)' },
  { name: 'MIN', category: 'math', syntax: 'MIN(نطاق)', description: 'إرجاع أصغر قيمة رقمية موجودة في النطاق.', example: '=MIN(C1:C15)' },
  { name: 'ROUND', category: 'math', syntax: 'ROUND(رقم, منازل)', description: 'تقريب الرقم لعدد محدد من المنازل العشرية.', example: '=ROUND(A1, 2)' },
  { name: 'SUMIF', category: 'math', syntax: 'SUMIF(نطاق_الشرط, الشرط, نطاق_الجمع)', description: 'جمع الخلايا المحددة بشرط معين (مثال: >100).', example: '=SUMIF(A1:A10, ">50", B1:B10)' },
  { name: 'COUNTIF', category: 'math', syntax: 'COUNTIF(النطاق, الشرط)', description: 'حساب عدد الخلايا التي تطابق شرطاً محدداً.', example: '=COUNTIF(C1:C20, "ناجح")' },
  { name: 'IF', category: 'logical', syntax: 'IF(شرط, قيمة_إذا_صواب, قيمة_إذا_خطأ)', description: 'فحص شرط منطقي وإرجاع قيمة بناءً على تحقق الشرط.', example: '=IF(B2>=50, "ناجح", "راسب")' },
  { name: 'IFERROR', category: 'logical', syntax: 'IFERROR(القيمة, قيمة_البديل)', description: 'إرجاع قيمة بديلة محددة في حالة وجود خطأ في المعادلة.', example: '=IFERROR(A1/B1, 0)' },
  { name: 'AND', category: 'logical', syntax: 'AND(شرط1, شرط2, ...)', description: 'إرجاع TRUE إذا كانت كافة الشروط صحيحة.', example: '=AND(A1>0, B1>0)' },
  { name: 'OR', category: 'logical', syntax: 'OR(شرط1, شرط2, ...)', description: 'إرجاع TRUE إذا كان أي من الشروط صحيحاً.', example: '=OR(A1>100, B1>100)' },
  { name: 'VLOOKUP', category: 'lookup', syntax: 'VLOOKUP(قيمة_البحث, جدول_البيانات, رقم_العمود, تطابق_تقريبي)', description: 'البحث عن قيمة في أول عمود من جدول وإرجاع قيمة من عمود محدد.', example: '=VLOOKUP(E2, A2:C50, 3, FALSE)' },
  { name: 'XLOOKUP', category: 'lookup', syntax: 'XLOOKUP(قيمة_البحث, نطاق_البحث, نطاق_الإرجاع, قيمة_البديل)', description: 'الدالة الحديثة المتقدمة للبحث في أي اتجاه بدقة فائقة.', example: '=XLOOKUP(F2, A2:A100, C2:C100, "غير موجود")' },
  { name: 'INDEX', category: 'lookup', syntax: 'INDEX(النطاق, رقم_الصف, رقم_العمود)', description: 'إرجاع قيمة الخلية الواقعة في تقاطع صف وعمود معينين.', example: '=INDEX(A1:D10, 3, 2)' },
  { name: 'MATCH', category: 'lookup', syntax: 'MATCH(قيمة_البحث, نطاق_البحث, نوع_المطابقة)', description: 'إرجاع الموضع النسبي لعنصر ما ضمن نطاق من الخلايا.', example: '=MATCH("أحمد", A1:A20, 0)' },
  { name: 'CONCAT', category: 'text', syntax: 'CONCAT(نص1, نص2, ...)', description: 'دمج سلسلتين نصيتين أو أكثر في نص واحد.', example: '=CONCAT(A1, " ", B1)' },
  { name: 'TEXT', category: 'text', syntax: 'TEXT(القيمة, التنسيق)', description: 'تحويل رقم إلى نص وتطبيق تنسيق مخصص عليه.', example: '=TEXT(A1, "0.00")' },
  { name: 'TRIM', category: 'text', syntax: 'TRIM(النص)', description: 'إزالة كافة المسافات الزائدة من النص.', example: '=TRIM(A1)' },
  { name: 'UPPER', category: 'text', syntax: 'UPPER(النص)', description: 'تحويل كافة الأحرف الإنجليزية إلى أحرف كبيرة.', example: '=UPPER(A1)' },
  { name: 'LOWER', category: 'text', syntax: 'LOWER(النص)', description: 'تحويل كافة الأحرف الإنجليزية إلى أحرف صغيرة.', example: '=LOWER(A1)' },
  { name: 'TODAY', category: 'date', syntax: 'TODAY()', description: 'إرجاع التاريخ الحالي للنظام.', example: '=TODAY()' },
  { name: 'NOW', category: 'date', syntax: 'NOW()', description: 'إرجاع التاريخ والوقت الحالي للنظام.', example: '=NOW()' },
  { name: 'DATE', category: 'date', syntax: 'DATE(سنة, شهر, يوم)', description: 'إنشاء قيمة تاريخ صالحة من أرقام السنة والشهر واليوم.', example: '=DATE(2026, 10, 27)' },
  { name: 'PMT', category: 'financial', syntax: 'PMT(الفائدة, عدد_الفترات, القيمة_الحالية)', description: 'حساب القسط الدوري لقرض أو استثمار بفائدة ثابتة.', example: '=PMT(0.05/12, 60, 200000)' },
];

export const InsertFunctionModal: React.FC<Props> = ({ isOpen, onClose, onInsertFunction }) => {
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedFn, setSelectedFn] = useState<FunctionDoc>(FUNCTIONS_LIST[0]);

  if (!isOpen) return null;

  const filtered = FUNCTIONS_LIST.filter(f => {
    const matchesCat = selectedCat === 'all' || f.category === selectedCat;
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase()) || f.description.includes(search);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-300 w-full max-w-xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#107c41] text-white">
          <div className="flex items-center gap-2">
            <FunctionSquare className="w-5 h-5" />
            <h3 className="font-bold text-sm">إدراج دالة (Insert Function - fx)</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded cursor-pointer transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3 text-xs text-gray-700">
          {/* Search & Category */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute right-2.5 top-2.5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="ابحث عن دالة بالاسم أو الوصف (مثال: SUM, IF, VLOOKUP)..."
                className="w-full pr-8 pl-3 py-1.5 border border-gray-300 rounded text-xs outline-none focus:border-[#107c41]"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-600">الفئة:</span>
              <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px]">
                {[
                  { id: 'all', label: 'الكل' },
                  { id: 'math', label: 'رياضيات وإحصاء' },
                  { id: 'logical', label: 'منطقية' },
                  { id: 'lookup', label: 'بحث ومراجع' },
                  { id: 'text', label: 'نصوص' },
                  { id: 'date', label: 'تاريخ ووقت' },
                  { id: 'financial', label: 'مالية' },
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCat(cat.id)}
                    className={`px-2.5 py-1 rounded cursor-pointer whitespace-nowrap transition ${
                      selectedCat === cat.id ? 'bg-[#107c41] text-white font-bold' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Function List & Details */}
          <div className="grid grid-cols-2 gap-3 border border-gray-200 rounded p-2 bg-gray-50/50">
            {/* List */}
            <div className="h-48 overflow-y-auto border border-gray-200 rounded bg-white p-1 space-y-0.5">
              {filtered.map(fn => (
                <div
                  key={fn.name}
                  onClick={() => setSelectedFn(fn)}
                  className={`px-2.5 py-1.5 rounded cursor-pointer font-mono font-bold text-xs flex items-center justify-between transition ${
                    selectedFn.name === fn.name ? 'bg-emerald-100 text-[#107c41] border border-emerald-300' : 'hover:bg-gray-100 text-gray-800'
                  }`}
                >
                  <span>{fn.name}</span>
                  <span className="text-[10px] text-gray-400 font-sans font-normal">{fn.category}</span>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="p-4 text-center text-gray-400 text-xs">لا توجد دالة تطابق البحث</div>
              )}
            </div>

            {/* Info */}
            <div className="p-3 bg-white border border-gray-200 rounded flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-[#107c41] font-bold text-sm font-mono">
                  <span>{selectedFn.name}</span>
                </div>
                <div className="bg-gray-100 p-1.5 rounded font-mono text-[11px] text-gray-800 dir-ltr text-left">
                  {selectedFn.syntax}
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed">{selectedFn.description}</p>
                <div className="text-[10px] text-gray-500">
                  <span className="font-bold text-gray-700">مثال: </span>
                  <code className="bg-amber-50 text-amber-800 px-1 py-0.5 rounded dir-ltr inline-block">{selectedFn.example}</code>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 p-1.5 rounded border border-emerald-200 mt-2">
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span>سيتم إدراج هيكل الدالة مباشرة في شريط الصيغ.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-gray-100 border-t border-gray-200 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium text-xs cursor-pointer transition"
          >
            إلغاء
          </button>
          <button
            onClick={() => {
              onInsertFunction(selectedFn.example);
              onClose();
            }}
            className="px-5 py-1.5 rounded bg-[#107c41] hover:bg-[#0e6b37] text-white font-bold text-xs cursor-pointer shadow-xs transition"
          >
            موافق (إدراج الدالة)
          </button>
        </div>
      </div>
    </div>
  );
};
