import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { SheetCell } from '../../../types';

export type ExcelBorderType = 
  | 'bottom' 
  | 'top' 
  | 'left' 
  | 'right' 
  | 'none' 
  | 'all' 
  | 'outside' 
  | 'thick-outside' 
  | 'double-bottom' 
  | 'thick-bottom' 
  | 'top-bottom' 
  | 'top-thick-bottom' 
  | 'top-double-bottom';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectBorder: (border: ExcelBorderType, options?: { color?: string; style?: 'solid' | 'dashed' | 'dotted' | 'double' | 'thick' }) => void;
  onOpenFormatCells?: (tab: 'border') => void;
}

const LINE_COLORS = [
  '#000000', '#ffffff', '#e7e6e6', '#44546a', '#4472c4', '#ed7d31', '#a5a5a5', '#ffc000', '#5b9bd5', '#70ad47',
  '#c00000', '#ff0000', '#ffc000', '#ffff00', '#92d050', '#00b050', '#00b0f0', '#0070c0', '#002060', '#7030a0'
];

export const ExcelBorderDropdown: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectBorder,
  onOpenFormatCells,
}) => {
  const [activeSubmenu, setActiveSubmenu] = useState<'color' | 'style' | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('#000000');
  const [selectedStyle, setSelectedStyle] = useState<'solid' | 'dashed' | 'dotted' | 'double' | 'thick'>('solid');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-2xl py-1 z-50 w-60 text-xs text-gray-800 select-none animate-in fade-in"
      style={{ direction: 'ltr' }}
    >
      {/* Borders Section Header */}
      <div className="px-3 py-1 text-[11px] font-bold text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-100">
        Borders (الحدود)
      </div>

      {/* Standard Borders matching image_5925b41e.png */}
      <button
        onClick={() => { onSelectBorder('bottom', { color: selectedColor, style: selectedStyle }); onClose(); }}
        className="w-full px-3 py-1.5 flex items-center gap-2.5 hover:bg-emerald-50 text-left transition"
      >
        <span className="w-4 h-4 border border-dashed border-gray-400 border-b-2 border-b-black inline-block shrink-0" />
        <span><u>B</u>ottom Border (حد سفلي)</span>
      </button>

      <button
        onClick={() => { onSelectBorder('top', { color: selectedColor, style: selectedStyle }); onClose(); }}
        className="w-full px-3 py-1.5 flex items-center gap-2.5 hover:bg-emerald-50 text-left transition"
      >
        <span className="w-4 h-4 border border-dashed border-gray-400 border-t-2 border-t-black inline-block shrink-0" />
        <span><u>T</u>op Border (حد علوي)</span>
      </button>

      <button
        onClick={() => { onSelectBorder('left', { color: selectedColor, style: selectedStyle }); onClose(); }}
        className="w-full px-3 py-1.5 flex items-center gap-2.5 hover:bg-emerald-50 text-left transition"
      >
        <span className="w-4 h-4 border border-dashed border-gray-400 border-l-2 border-l-black inline-block shrink-0" />
        <span><u>L</u>eft Border (حد أيسر)</span>
      </button>

      <button
        onClick={() => { onSelectBorder('right', { color: selectedColor, style: selectedStyle }); onClose(); }}
        className="w-full px-3 py-1.5 flex items-center gap-2.5 hover:bg-emerald-50 text-left transition"
      >
        <span className="w-4 h-4 border border-dashed border-gray-400 border-r-2 border-r-black inline-block shrink-0" />
        <span><u>R</u>ight Border (حد أيمن)</span>
      </button>

      <div className="my-1 border-t border-gray-200" />

      <button
        onClick={() => { onSelectBorder('none'); onClose(); }}
        className="w-full px-3 py-1.5 flex items-center gap-2.5 hover:bg-emerald-50 text-left transition"
      >
        <span className="w-4 h-4 border border-dashed border-gray-300 inline-block shrink-0" />
        <span><u>N</u>o Border (بلا حدود)</span>
      </button>

      <button
        onClick={() => { onSelectBorder('all', { color: selectedColor, style: selectedStyle }); onClose(); }}
        className="w-full px-3 py-1.5 flex items-center gap-2.5 hover:bg-emerald-50 text-left transition font-semibold"
      >
        <span className="w-4 h-4 border-2 border-black grid grid-cols-2 grid-rows-2 inline-grid shrink-0">
          <span className="border border-black" /><span className="border border-black" />
          <span className="border border-black" /><span className="border border-black" />
        </span>
        <span><u>A</u>ll Borders (كافة الحدود)</span>
      </button>

      <button
        onClick={() => { onSelectBorder('outside', { color: selectedColor, style: selectedStyle }); onClose(); }}
        className="w-full px-3 py-1.5 flex items-center gap-2.5 hover:bg-emerald-50 text-left transition"
      >
        <span className="w-4 h-4 border border-black inline-block shrink-0" />
        <span><u>O</u>utside Borders (حدود خارجية)</span>
      </button>

      <button
        onClick={() => { onSelectBorder('thick-outside', { color: selectedColor, style: selectedStyle }); onClose(); }}
        className="w-full px-3 py-1.5 flex items-center gap-2.5 hover:bg-emerald-50 text-left transition"
      >
        <span className="w-4 h-4 border-[3px] border-black inline-block shrink-0" />
        <span><u>T</u>hick Outside Borders (حدود خارجية سميكة)</span>
      </button>

      <div className="my-1 border-t border-gray-200" />

      <button
        onClick={() => { onSelectBorder('double-bottom', { color: selectedColor, style: selectedStyle }); onClose(); }}
        className="w-full px-3 py-1.5 flex items-center gap-2.5 hover:bg-emerald-50 text-left transition"
      >
        <span className="w-4 h-4 border border-dashed border-gray-300 border-b-4 border-double border-b-black inline-block shrink-0" />
        <span>Bottom <u>D</u>ouble Border (حد سفلي مزدوج)</span>
      </button>

      <button
        onClick={() => { onSelectBorder('thick-bottom', { color: selectedColor, style: selectedStyle }); onClose(); }}
        className="w-full px-3 py-1.5 flex items-center gap-2.5 hover:bg-emerald-50 text-left transition"
      >
        <span className="w-4 h-4 border border-dashed border-gray-300 border-b-[3px] border-b-black inline-block shrink-0" />
        <span>T<u>h</u>ick Bottom Border (حد سفلي سميك)</span>
      </button>

      <button
        onClick={() => { onSelectBorder('top-bottom', { color: selectedColor, style: selectedStyle }); onClose(); }}
        className="w-full px-3 py-1.5 flex items-center gap-2.5 hover:bg-emerald-50 text-left transition"
      >
        <span className="w-4 h-4 border-t border-b border-black inline-block shrink-0" />
        <span>Top and <u>B</u>ottom Border (حد علوي وسفلي)</span>
      </button>

      <button
        onClick={() => { onSelectBorder('top-thick-bottom', { color: selectedColor, style: selectedStyle }); onClose(); }}
        className="w-full px-3 py-1.5 flex items-center gap-2.5 hover:bg-emerald-50 text-left transition"
      >
        <span className="w-4 h-4 border-t border-black border-b-[3px] border-b-black inline-block shrink-0" />
        <span>Top and Th<u>i</u>ck Bottom Border (حد علوي وسفلي سميك)</span>
      </button>

      <button
        onClick={() => { onSelectBorder('top-double-bottom', { color: selectedColor, style: selectedStyle }); onClose(); }}
        className="w-full px-3 py-1.5 flex items-center gap-2.5 hover:bg-emerald-50 text-left transition"
      >
        <span className="w-4 h-4 border-t border-black border-b-4 border-double border-b-black inline-block shrink-0" />
        <span>Top and Do<u>u</u>ble Bottom Border (حد علوي ومزدوج سفلي)</span>
      </button>

      {/* Draw Borders Section Header */}
      <div className="my-1 border-t border-gray-200" />
      <div className="px-3 py-1 text-[11px] font-bold text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-100">
        Draw Borders (رسم الحدود)
      </div>

      <button
        onClick={() => { onSelectBorder('outside', { color: selectedColor, style: selectedStyle }); onClose(); }}
        className="w-full px-3 py-1.5 flex items-center gap-2.5 hover:bg-emerald-50 text-left transition"
      >
        <span className="text-emerald-700 text-xs">✏️</span>
        <span><u>D</u>raw Border (رسم حد يدوي)</span>
      </button>

      <button
        onClick={() => { onSelectBorder('all', { color: selectedColor, style: selectedStyle }); onClose(); }}
        className="w-full px-3 py-1.5 flex items-center gap-2.5 hover:bg-emerald-50 text-left transition"
      >
        <span className="text-emerald-700 text-xs">🔲</span>
        <span>Draw Border <u>G</u>rid (رسم شبكة حدود)</span>
      </button>

      <button
        onClick={() => { onSelectBorder('none'); onClose(); }}
        className="w-full px-3 py-1.5 flex items-center gap-2.5 hover:bg-emerald-50 text-left transition text-red-600"
      >
        <span className="text-xs">🧹</span>
        <span><u>E</u>rase Border (ممحاة الحدود)</span>
      </button>

      {/* Line Color Submenu */}
      <div className="relative">
        <button
          onClick={() => setActiveSubmenu(activeSubmenu === 'color' ? null : 'color')}
          className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-emerald-50 text-left transition"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-4 h-4 rounded-xs border border-gray-300" style={{ backgroundColor: selectedColor }} />
            <span>Line <u>C</u>olor (لون خط الحدود)</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        </button>

        {activeSubmenu === 'color' && (
          <div className="absolute left-full top-0 ml-1 bg-white border border-gray-300 rounded shadow-xl p-2 z-60 w-48">
            <div className="text-[10px] font-bold text-gray-500 mb-1.5">اختر لون الحدود:</div>
            <div className="grid grid-cols-5 gap-1.5">
              {LINE_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setSelectedColor(c);
                    setActiveSubmenu(null);
                  }}
                  className={`w-6 h-6 rounded-xs border transition cursor-pointer hover:scale-110 ${
                    selectedColor === c ? 'ring-2 ring-emerald-500 border-white' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Line Style Submenu */}
      <div className="relative">
        <button
          onClick={() => setActiveSubmenu(activeSubmenu === 'style' ? null : 'style')}
          className="w-full px-3 py-1.5 flex items-center justify-between hover:bg-emerald-50 text-left transition"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-xs">━</span>
            <span>Line <u>S</u>tyle (نمط خط الحدود)</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        </button>

        {activeSubmenu === 'style' && (
          <div className="absolute left-full top-0 ml-1 bg-white border border-gray-300 rounded shadow-xl py-1 z-60 w-44">
            <div className="px-2 py-1 text-[10px] font-bold text-gray-500 border-b border-gray-100">أنماط الخطوط:</div>
            {[
              { id: 'solid', label: 'رفيع عادي (Thin)' },
              { id: 'medium', label: 'متوسط (Medium)' },
              { id: 'thick', label: 'سميك (Thick)' },
              { id: 'dashed', label: 'متقطع (Dashed)' },
              { id: 'dotted', label: 'منقط (Dotted)' },
              { id: 'double', label: 'مزدوج (Double)' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => {
                  setSelectedStyle(st.id as any);
                  setActiveSubmenu(null);
                }}
                className={`w-full px-3 py-1 text-left hover:bg-emerald-50 text-xs block ${
                  selectedStyle === st.id ? 'font-bold text-emerald-700 bg-emerald-50/50' : ''
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* More Borders Section */}
      <div className="my-1 border-t border-gray-200" />
      <button
        onClick={() => {
          onClose();
          if (onOpenFormatCells) onOpenFormatCells('border');
        }}
        className="w-full px-3 py-1.5 flex items-center gap-2.5 hover:bg-emerald-50 text-left transition font-semibold text-emerald-800"
      >
        <span className="text-xs">⊞</span>
        <span><u>M</u>ore Borders... (مزيد من تنسيقات الحدود)</span>
      </button>
    </div>
  );
};
