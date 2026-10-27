import React, { useState } from 'react';
import { Sigma, Search, X, Check, BookOpen } from 'lucide-react';
import { EXCEL_FUNCTIONS, ExcelFunctionDef } from '../../../utils/excelEngine';

interface InsertFunctionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFunction: (syntax: string) => void;
  initialCategory?: string;
}

export const InsertFunctionModal: React.FC<InsertFunctionModalProps> = ({
  isOpen,
  onClose,
  onSelectFunction,
  initialCategory = 'All',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState(initialCategory);
  const [selectedFunc, setSelectedFunc] = useState<ExcelFunctionDef>(EXCEL_FUNCTIONS[0]);

  if (!isOpen) return null;

  const categories = [
    { id: 'All', label: 'الكل (جميع الدوال)' },
    { id: 'Math', label: 'رياضيات ومثلثات (Math & Trig)' },
    { id: 'Statistical', label: 'إحصائية (Statistical)' },
    { id: 'Financial', label: 'مالية (Financial)' },
    { id: 'Logical', label: 'منطقية (Logical)' },
    { id: 'Lookup', label: 'بحث ومرجع (Lookup & Reference)' },
    { id: 'Text', label: 'نص (Text)' },
    { id: 'DateTime', label: 'تاريخ ووقت (Date & Time)' },
    { id: 'Info', label: 'معلومات (Information)' },
  ];

  const filtered = EXCEL_FUNCTIONS.filter((fn) => {
    const matchesCat = selectedCat === 'All' || fn.category === selectedCat;
    const matchesQuery = !searchQuery || 
      fn.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      fn.desc.includes(searchQuery);
    return matchesCat && matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4" dir="rtl">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-gray-300 overflow-hidden text-right">
        <div className="flex items-center justify-between px-4 py-3 bg-[#107c41] text-white">
          <div className="flex items-center gap-2">
            <Sigma className="w-5 h-5 text-white" />
            <span className="font-bold text-sm">إدراج دالة (Insert Function - fx)</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded text-white/90">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-3 text-xs">
          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="اكتب اسم الدالة أو وظيفتها (مثل SUM, VLOOKUP, IF)..."
              className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded focus:border-[#107c41] outline-none text-xs"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-2" />
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <label className="font-medium text-gray-700 shrink-0">تحديد الفئة:</label>
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="flex-1 px-2.5 py-1.5 border border-gray-300 rounded outline-none font-medium text-gray-800"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Function list box */}
          <div className="border border-gray-300 rounded h-40 overflow-y-auto bg-gray-50/70 p-1">
            {filtered.map((fn) => (
              <button
                key={fn.name}
                type="button"
                onClick={() => setSelectedFunc(fn)}
                className={`w-full text-right px-3 py-1.5 rounded transition text-xs font-mono flex items-center justify-between ${
                  selectedFunc.name === fn.name
                    ? 'bg-[#107c41] text-white font-bold shadow-xs'
                    : 'text-gray-800 hover:bg-gray-200/70'
                }`}
              >
                <span>{fn.name}</span>
                <span className={`text-[10px] ${selectedFunc.name === fn.name ? 'text-emerald-100' : 'text-gray-400'}`}>
                  {fn.category}
                </span>
              </button>
            ))}
          </div>

          {/* Function Details Box */}
          {selectedFunc && (
            <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-lg text-emerald-950 space-y-1">
              <div className="font-mono font-bold text-sm text-[#107c41] dir-ltr" dir="ltr">
                ={selectedFunc.syntax}
              </div>
              <p className="text-[11px] leading-relaxed text-gray-700">{selectedFunc.desc}</p>
              <div className="text-[10px] text-gray-500 font-mono">
                مثال: <span className="font-bold text-gray-800">{selectedFunc.example}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 p-3 bg-gray-50 border-t border-gray-200 text-xs">
          <button
            onClick={() => {
              if (selectedFunc) {
                onSelectFunction(selectedFunc.example || `=${selectedFunc.name}()`);
              }
              onClose();
            }}
            className="px-5 py-1.5 bg-[#107c41] hover:bg-[#0c6233] text-white rounded font-bold shadow-sm transition"
          >
            إدراج في الخلية
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
          >
            إلغاء الأمر
          </button>
        </div>
      </div>
    </div>
  );
};
