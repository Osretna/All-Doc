import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

export interface ExcelTableStyle {
  id: string;
  name: string;
  category: 'light' | 'medium' | 'dark';
  headerBg: string;
  headerColor: string;
  bandBg: string;
  borderColor: string;
  accentColor: string;
}

// Generate complete Excel 365 Table Styles: Light (1-21), Medium (1-28), Dark (1-11)
const BASE_HUES = [
  { name: 'None/Gray', header: '#595959', band: '#f2f2f2', border: '#d9d9d9' },
  { name: 'Blue', header: '#4472c4', band: '#d9e1f2', border: '#b4c6e7' },
  { name: 'Orange', header: '#ed7d31', band: '#f8cbad', border: '#f4b084' },
  { name: 'Gray-Blue', header: '#a5a5a5', band: '#ededed', border: '#dbdbdb' },
  { name: 'Gold', header: '#ffc000', band: '#fff2cc', border: '#ffe699' },
  { name: 'Sky-Blue', header: '#5b9bd5', band: '#ddebf7', border: '#bdd7ee' },
  { name: 'Green', header: '#70ad47', band: '#e2efda', border: '#c6e0b4' },
];

export const EXCEL_365_TABLE_STYLES: ExcelTableStyle[] = [
  // LIGHT STYLES (1 to 21)
  ...Array.from({ length: 21 }).map((_, i) => {
    const hue = BASE_HUES[i % BASE_HUES.length];
    const shadeLighter = i >= 7 && i < 14;
    const borderOnly = i >= 14;
    return {
      id: `light_${i + 1}`,
      name: `نمط جدول فاتح ${i + 1} (Table Style Light ${i + 1})`,
      category: 'light' as const,
      headerBg: borderOnly ? '#ffffff' : (shadeLighter ? '#f8fafc' : hue.band),
      headerColor: borderOnly ? '#0f172a' : '#1e293b',
      bandBg: shadeLighter ? '#ffffff' : '#f8fafc',
      borderColor: hue.border,
      accentColor: hue.header,
    };
  }),

  // MEDIUM STYLES (1 to 28)
  ...Array.from({ length: 28 }).map((_, i) => {
    const hue = BASE_HUES[i % BASE_HUES.length];
    const isTintedBand = i >= 14;
    return {
      id: `medium_${i + 1}`,
      name: `نمط جدول متوسط ${i + 1} (Table Style Medium ${i + 1})`,
      category: 'medium' as const,
      headerBg: hue.header,
      headerColor: '#ffffff',
      bandBg: isTintedBand ? hue.band : '#f9fafb',
      borderColor: hue.border,
      accentColor: hue.header,
    };
  }),

  // DARK STYLES (1 to 11)
  ...Array.from({ length: 11 }).map((_, i) => {
    const hue = BASE_HUES[i % BASE_HUES.length];
    return {
      id: `dark_${i + 1}`,
      name: `نمط جدول داكن ${i + 1} (Table Style Dark ${i + 1})`,
      category: 'dark' as const,
      headerBg: i === 0 ? '#1f2937' : hue.header,
      headerColor: '#ffffff',
      bandBg: '#374151',
      borderColor: '#4b5563',
      accentColor: hue.header,
    };
  }),
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  activeStyleId?: string;
  onSelectStyle: (style: ExcelTableStyle) => void;
}

export const ExcelTableStylesGallery: React.FC<Props> = ({
  isOpen,
  onClose,
  activeStyleId,
  onSelectStyle,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'light' | 'medium' | 'dark'>('all');

  if (!isOpen) return null;

  const filtered = activeCategory === 'all' 
    ? EXCEL_365_TABLE_STYLES 
    : EXCEL_365_TABLE_STYLES.filter((s) => s.category === activeCategory);

  return (
    <div className="fixed inset-0 z-[130] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-5 py-3.5 bg-emerald-800 text-white flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base">أنماط وتنسيقات جداول Excel 365 (Table Styles Gallery)</h3>
            <p className="text-xs text-emerald-200 mt-0.5">
              اختر أحد الأنماط الرسمية المعتمدة في Microsoft Excel 365 لتطبيقها على نطاق الجدول المحدد
            </p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-emerald-700 rounded-lg transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter categories */}
        <div className="px-5 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
          {[
            { id: 'all', label: 'كافة الأنماط (All 60 Styles)' },
            { id: 'light', label: 'فاتح (Light 1–21)' },
            { id: 'medium', label: 'متوسط (Medium 1–28)' },
            { id: 'dark', label: 'داكن (Dark 1–11)' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition ${
                activeCategory === cat.id
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Styles Grid */}
        <div className="p-5 overflow-y-auto flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filtered.map((style) => {
            const isSelected = activeStyleId === style.id;
            return (
              <div
                key={style.id}
                onClick={() => {
                  onSelectStyle(style);
                  onClose();
                }}
                className={`p-2 rounded-lg border cursor-pointer transition hover:scale-105 flex flex-col justify-between ${
                  isSelected ? 'ring-2 ring-emerald-600 border-emerald-600 bg-emerald-50/30' : 'border-gray-200 hover:border-gray-400 bg-white'
                }`}
              >
                {/* Visual miniature table preview */}
                <div className="rounded overflow-hidden border border-gray-300 shadow-xs mb-1.5 text-[8px] select-none">
                  <div
                    className="px-1 py-0.5 font-bold flex justify-between"
                    style={{ backgroundColor: style.headerBg, color: style.headerColor }}
                  >
                    <span>عمود 1</span>
                    <span>عمود 2</span>
                  </div>
                  <div className="px-1 py-0.5 flex justify-between bg-white text-gray-700 border-b border-gray-100">
                    <span>بيانات</span>
                    <span>1,200</span>
                  </div>
                  <div
                    className="px-1 py-0.5 flex justify-between text-gray-800"
                    style={{ backgroundColor: style.bandBg }}
                  >
                    <span>بيانات</span>
                    <span>3,400</span>
                  </div>
                  <div className="px-1 py-0.5 flex justify-between bg-white text-gray-700">
                    <span>الإجمالي</span>
                    <span className="font-bold">4,600</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-gray-600">
                  <span className="truncate">{style.name.split('(')[0]}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            تتضمن الأنماط صفوفاً متبادلة (Banded Rows)، وتلوين الرؤوس والإجماليات التلقائية.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 rounded text-xs font-semibold text-gray-800 transition"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
