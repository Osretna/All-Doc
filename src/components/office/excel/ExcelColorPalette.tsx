import React, { useState } from 'react';

export interface ThemePalette {
  name: string;
  nameAr: string;
  colors: string[]; // 10 base columns
}

export const EXCEL_365_THEMES: ThemePalette[] = [
  {
    name: 'Office (Default 365)',
    nameAr: 'أوفيس (الافتراضي 365)',
    colors: ['#ffffff', '#000000', '#e7e6e6', '#44546a', '#4472c4', '#ed7d31', '#a5a5a5', '#ffc000', '#5b9bd5', '#70ad47'],
  },
  {
    name: 'Facet',
    nameAr: 'وجهي (Facet)',
    colors: ['#ffffff', '#000000', '#e2e9e9', '#0d2229', '#0f6b7a', '#7a421d', '#57757a', '#c7983e', '#23899e', '#3b9161'],
  },
  {
    name: 'Integral',
    nameAr: 'تكامل (Integral)',
    colors: ['#ffffff', '#000000', '#e5ecf0', '#1b2c3f', '#1b5f8c', '#a64d1f', '#6c7c8c', '#d99b26', '#3582b8', '#2b8f5b'],
  },
  {
    name: 'Ion',
    nameAr: 'أيون (Ion)',
    colors: ['#ffffff', '#000000', '#ececf0', '#252033', '#664c8f', '#a63e26', '#7a708a', '#d49b2c', '#8566b8', '#2e997a'],
  },
  {
    name: 'Organic',
    nameAr: 'عضوي (Organic)',
    colors: ['#ffffff', '#000000', '#edece8', '#292b23', '#4d6938', '#995926', '#757a6e', '#bf9e2c', '#6d8f52', '#789438'],
  },
  {
    name: 'Retrospect',
    nameAr: 'استرجاع (Retrospect)',
    colors: ['#ffffff', '#000000', '#eeeae6', '#3b2f29', '#8c4830', '#a87532', '#8c786e', '#cc9f43', '#b36647', '#4a8563'],
  },
  {
    name: 'Slice',
    nameAr: 'شريحة (Slice)',
    colors: ['#ffffff', '#000000', '#edf0e8', '#293321', '#3f7324', '#0d6b7d', '#6e7a63', '#4a9930', '#1c94ab', '#b87d23'],
  },
  {
    name: 'Wisp',
    nameAr: 'خصلة (Wisp)',
    colors: ['#ffffff', '#000000', '#eef0ef', '#26332d', '#407a5f', '#4f7587', '#6b7a73', '#5ca683', '#6ea1b8', '#87a354'],
  },
  {
    name: 'Wood Type',
    nameAr: 'نوع الخشب (Wood Type)',
    colors: ['#ffffff', '#000000', '#ece8e3', '#33291f', '#785433', '#8f4b2b', '#827566', '#a87e47', '#a67649', '#667844'],
  },
];

export const STANDARD_COLORS = [
  '#c00000', // Dark Red
  '#ff0000', // Red
  '#ffc000', // Orange
  '#ffff00', // Yellow
  '#92d050', // Light Green
  '#00b050', // Green
  '#00b0f0', // Light Blue
  '#0070c0', // Blue
  '#002060', // Dark Blue
  '#7030a0', // Purple
];

// Generates 5 tint/shade variations for a base hex color
function generateShades(hex: string): string[] {
  // If black or white, provide special gray scale steps
  if (hex.toLowerCase() === '#ffffff') {
    return ['#ffffff', '#f2f2f2', '#d9d9d9', '#bfbfbf', '#a6a6a6', '#7f7f7f'];
  }
  if (hex.toLowerCase() === '#000000') {
    return ['#000000', '#7f7f7f', '#595959', '#3f3f3f', '#262626', '#0d0d0d'];
  }

  // Basic color tint/shade interpolation
  const num = parseInt(hex.replace('#', ''), 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;

  const blend = (r1: number, g1: number, b1: number, factor: number, toWhite: boolean) => {
    const target = toWhite ? 255 : 0;
    const nr = Math.round(r1 + (target - r1) * factor);
    const ng = Math.round(g1 + (target - g1) * factor);
    const nb = Math.round(b1 + (target - b1) * factor);
    return `#${((1 << 24) + (nr << 16) + (ng << 8) + nb).toString(16).slice(1)}`;
  };

  return [
    hex,
    blend(r, g, b, 0.8, true),  // Lighter 80%
    blend(r, g, b, 0.6, true),  // Lighter 60%
    blend(r, g, b, 0.4, true),  // Lighter 40%
    blend(r, g, b, 0.25, false), // Darker 25%
    blend(r, g, b, 0.5, false),  // Darker 50%
  ];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectColor: (color: string) => void;
  title: string;
}

export const ExcelColorPalette: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectColor,
  title,
}) => {
  const [selectedThemeIdx, setSelectedThemeIdx] = useState<number>(0);
  const currentTheme = EXCEL_365_THEMES[selectedThemeIdx];

  if (!isOpen) return null;

  return (
    <div 
      className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-2xl p-2.5 z-60 w-64 text-xs select-none animate-in fade-in"
      style={{ direction: 'ltr' }}
    >
      <div className="flex items-center justify-between pb-1.5 border-b border-gray-200 mb-2">
        <span className="font-bold text-gray-800 text-[11px]">{title}</span>
        <select
          value={selectedThemeIdx}
          onChange={(e) => setSelectedThemeIdx(parseInt(e.target.value, 10))}
          className="text-[10px] bg-gray-50 border border-gray-300 rounded px-1 py-0.5 outline-none font-medium text-emerald-800"
          title="اختر حزمة ألوان Excel 365 (Theme)"
        >
          {EXCEL_365_THEMES.map((th, idx) => (
            <option key={th.name} value={idx}>{th.nameAr}</option>
          ))}
        </select>
      </div>

      {/* Automatic / No Fill button */}
      <button
        onClick={() => { onSelectColor(''); onClose(); }}
        className="w-full flex items-center gap-2 px-2 py-1 mb-2 hover:bg-gray-100 rounded border border-gray-200 text-left font-medium text-[11px]"
      >
        <span className="w-3.5 h-3.5 border border-red-500 rounded-xs flex items-center justify-center text-[10px] text-red-500 font-bold">✕</span>
        <span>بدون لون / تلقائي (No Fill / Auto)</span>
      </button>

      {/* Theme Colors Matrix (10 columns x 6 rows) */}
      <div className="mb-2.5">
        <div className="text-[10px] font-bold text-gray-500 mb-1">ألوان النسق (Theme Colors):</div>
        <div className="grid grid-cols-10 gap-0.5">
          {/* Top row: 10 base theme colors */}
          {currentTheme.colors.map((c, colIdx) => (
            <button
              key={`base_${colIdx}`}
              onClick={() => { onSelectColor(c); onClose(); }}
              className="w-5 h-5 rounded-xs border border-gray-300 hover:scale-125 transition-transform cursor-pointer"
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}

          {/* Rows 1-5: Shade/tint matrix */}
          {[1, 2, 3, 4, 5].map((shadeIdx) => (
            <React.Fragment key={`row_${shadeIdx}`}>
              {currentTheme.colors.map((c, colIdx) => {
                const shade = generateShades(c)[shadeIdx];
                return (
                  <button
                    key={`shade_${colIdx}_${shadeIdx}`}
                    onClick={() => { onSelectColor(shade); onClose(); }}
                    className="w-5 h-3.5 border border-gray-200 hover:scale-125 transition-transform cursor-pointer"
                    style={{ backgroundColor: shade }}
                    title={shade}
                  />
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Standard Colors (10 classic Excel colors) */}
      <div className="pt-1.5 border-t border-gray-200">
        <div className="text-[10px] font-bold text-gray-500 mb-1">الألوان القياسية (Standard Colors):</div>
        <div className="grid grid-cols-10 gap-0.5">
          {STANDARD_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => { onSelectColor(c); onClose(); }}
              className="w-5 h-5 rounded-xs border border-gray-300 hover:scale-125 transition-transform cursor-pointer"
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
