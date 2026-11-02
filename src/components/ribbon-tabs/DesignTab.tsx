import React from 'react';
import { 
  Palette, 
  Type, 
  Sparkles, 
  ShieldAlert, 
  Paintbrush, 
  Frame, 
  Check, 
  Layers, 
  SlidersHorizontal 
} from 'lucide-react';

interface DesignTabProps {
  onOpenWatermarkModal: () => void;
  onOpenPageBordersModal: () => void;
  pageColor: string;
  onPageColorChange: (color: string) => void;
  onApplyTheme: (themeName: string) => void;
}

export const DesignTab: React.FC<DesignTabProps> = ({
  onOpenWatermarkModal,
  onOpenPageBordersModal,
  pageColor,
  onPageColorChange,
  onApplyTheme,
}) => {
  const themes = [
    { name: 'Office (افتراضي)', primary: '#2b579a', font: 'Cairo' },
    { name: 'Facet (عصري)', primary: '#0284c7', font: 'Segoe UI' },
    { name: 'Integral (تقني)', primary: '#4f46e5', font: 'Tajawal' },
    { name: 'Ion (رسمي)', primary: '#059669', font: 'Amiri' },
    { name: 'Organic (أخضر هادئ)', primary: '#15803d', font: 'Cairo' },
    { name: 'Retrospect (دافئ)', primary: '#d97706', font: 'Amiri' },
  ];

  const pageColors = [
    { label: 'أبيض (افتراضي)', color: '#ffffff' },
    { label: 'عاجي دافئ', color: '#fefce8' },
    { label: 'رمادي خفيف', color: '#f8fafc' },
    { label: 'أزرق سماوي', color: '#f0f9ff' },
    { label: 'ورق قديم', color: '#fbf7ee' },
    { label: 'داكن مريح للعين', color: '#1e293b' },
  ];

  const [activePaletteIndex, setActivePaletteIndex] = React.useState(0);
  const [activeFontPairIndex, setActiveFontPairIndex] = React.useState(0);
  const [activeSpacingIndex, setActiveSpacingIndex] = React.useState(0);

  const palettes = [
    { name: 'Office 365 الأزرق', primary: '#2b579a', secondary: '#3b82f6', accent: '#f59e0b' },
    { name: 'الزمردي الحديث', primary: '#059669', secondary: '#10b981', accent: '#065f46' },
    { name: 'الأرجواني الملكي', primary: '#7c3aed', secondary: '#8b5cf6', accent: '#f43f5e' },
    { name: 'الكهرماني الدافئ', primary: '#d97706', secondary: '#f59e0b', accent: '#b45309' },
    { name: 'الفحمي الأنيق', primary: '#1e293b', secondary: '#475569', accent: '#64748b' },
  ];

  const fontPairs = [
    { label: 'Cairo + Tajawal', heading: 'Cairo', body: 'Tajawal' },
    { label: 'Amiri (أميري تراثي)', heading: 'Amiri', body: 'Amiri' },
    { label: 'Segoe UI الحديث', heading: 'Segoe UI', body: 'Segoe UI' },
  ];

  const spacings = ['1.6', '1.8', '2.0', '1.4'];

  const applyColorPalette = () => {
    const nextIdx = (activePaletteIndex + 1) % palettes.length;
    setActivePaletteIndex(nextIdx);
    const pal = palettes[nextIdx];
    const editor = document.getElementById('document-editor');
    if (editor) {
      const h1s = editor.querySelectorAll('h1');
      h1s.forEach(h => (h as HTMLElement).style.color = pal.primary);
      const ths = editor.querySelectorAll('th');
      ths.forEach(th => (th as HTMLElement).style.backgroundColor = pal.primary);
      const bqs = editor.querySelectorAll('blockquote');
      bqs.forEach(bq => (bq as HTMLElement).style.borderRightColor = pal.primary);
    }
  };

  const applyFontPairing = () => {
    const nextIdx = (activeFontPairIndex + 1) % fontPairs.length;
    setActiveFontPairIndex(nextIdx);
    const fp = fontPairs[nextIdx];
    const editor = document.getElementById('document-editor');
    if (editor) {
      editor.style.fontFamily = fp.body;
      const headings = editor.querySelectorAll('h1, h2, h3');
      headings.forEach(h => (h as HTMLElement).style.fontFamily = fp.heading);
    }
  };

  const applyParagraphSpacing = () => {
    const nextIdx = (activeSpacingIndex + 1) % spacings.length;
    setActiveSpacingIndex(nextIdx);
    const sp = spacings[nextIdx];
    const editor = document.getElementById('document-editor');
    if (editor) {
      editor.style.lineHeight = sp;
    }
  };

  const applyEffects = () => {
    const editor = document.getElementById('document-editor');
    if (editor) {
      const tables = editor.querySelectorAll('table, figure, blockquote');
      tables.forEach(t => {
        (t as HTMLElement).classList.toggle('shadow-md');
        (t as HTMLElement).classList.toggle('rounded-lg');
      });
    }
  };

  const handleSetAsDefault = () => {
    try {
      localStorage.setItem('infinity_office_design_preset', JSON.stringify({
        palette: palettes[activePaletteIndex].name,
        font: fontPairs[activeFontPairIndex].label,
        spacing: spacings[activeSpacingIndex],
        pageColor,
      }));
      alert('تم حفظ إعدادات التصميم الحالية كنسق افتراضي للمستندات الجديدة.');
    } catch {
      // fallback
    }
  };

  return (
    <div className="flex items-stretch h-[96px] py-1 px-2 overflow-x-auto text-slate-700 select-none divide-x divide-x-reverse divide-slate-200" dir="rtl">
      
      {/* 1. Themes (النسق) */}
      <div className="flex flex-col justify-between px-2 min-w-[130px] shrink-0">
        <div className="flex items-center gap-1.5 py-1">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#2b579a] via-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Palette className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-800">نسق المستند</span>
            <select
              onChange={(e) => onApplyTheme(e.target.value)}
              className="text-[11px] bg-white border border-slate-300 rounded px-1.5 py-0.5 mt-0.5 outline-none font-medium text-slate-700"
            >
              {themes.map((t) => (
                <option key={t.name} value={t.name}>{t.name}</option>
              ))}
            </select>
          </div>
        </div>
        <span className="text-[10px] text-slate-400 text-center font-medium">النسق (Themes)</span>
      </div>

      {/* 2. Document Formatting: Colors, Fonts, Paragraph Spacing, Effects */}
      <div className="flex flex-col justify-between px-3 min-w-[260px] shrink-0">
        <div className="grid grid-cols-2 gap-2 py-1">
          <button
            onClick={applyColorPalette}
            className="flex items-center gap-1.5 px-2 py-1 hover:bg-slate-200 rounded text-[11px] text-slate-700"
            title={`تغيير ألوان المستند (الحالي: ${palettes[activePaletteIndex].name})`}
          >
            <div className="flex gap-0.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: palettes[activePaletteIndex].primary }}></span>
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: palettes[activePaletteIndex].secondary }}></span>
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: palettes[activePaletteIndex].accent }}></span>
            </div>
            <span>الألوان (Colors)</span>
          </button>

          <button
            onClick={applyFontPairing}
            className="flex items-center gap-1.5 px-2 py-1 hover:bg-slate-200 rounded text-[11px] text-slate-700"
            title={`تغيير خطوط النسق (الحالي: ${fontPairs[activeFontPairIndex].label})`}
          >
            <Type className="w-3.5 h-3.5 text-slate-600" />
            <span>الخطوط (Fonts)</span>
          </button>

          <button
            onClick={applyParagraphSpacing}
            className="flex items-center gap-1.5 px-2 py-1 hover:bg-slate-200 rounded text-[11px] text-slate-700"
            title={`تباعد الأسطر والفقرات: ${spacings[activeSpacingIndex]}`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600" />
            <span>تباعد الفقرات</span>
          </button>

          <button
            onClick={applyEffects}
            className="flex items-center gap-1.5 px-2 py-1 hover:bg-slate-200 rounded text-[11px] text-slate-700"
            title="تبديل تأثيرات الظلال والحواف للعناصر"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>تأثيرات (Effects)</span>
          </button>
        </div>
        <span className="text-[10px] text-slate-400 text-center font-medium">تنسيق المستند</span>
      </div>

      {/* 3. Set as Default */}
      <div className="flex flex-col justify-between px-2 min-w-[90px] shrink-0">
        <button
          onClick={handleSetAsDefault}
          className="flex flex-col items-center justify-center p-2 hover:bg-slate-200 rounded text-slate-700 group my-auto"
          title="تعيين كافتراضي"
        >
          <Check className="w-4 h-4 text-emerald-600 mb-1" />
          <span className="text-[10px] font-medium text-center">تعيين كافتراضي</span>
        </button>
        <span className="text-[10px] text-slate-400 text-center font-medium">افتراضي</span>
      </div>

      {/* 4. Page Background: Watermark, Page Color, Page Borders */}
      <div className="flex flex-col justify-between px-3 min-w-[230px] shrink-0">
        <div className="flex items-center gap-2 py-1">
          {/* Watermark */}
          <button
            onClick={onOpenWatermarkModal}
            className="flex flex-col items-center p-1.5 hover:bg-slate-200 rounded text-slate-700 text-center"
            title="علامة مائية"
          >
            <div className="p-1.5 bg-blue-50 text-[#2b579a] rounded mb-1">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-medium">علامة مائية</span>
          </button>

          {/* Page Color */}
          <div className="flex flex-col items-center p-1">
            <div className="relative group">
              <label 
                className="flex flex-col items-center p-1.5 hover:bg-slate-200 rounded cursor-pointer text-slate-700"
                title="تغيير لون خلفية الصفحة"
              >
                <div className="p-1.5 bg-amber-50 text-amber-600 rounded mb-1">
                  <Paintbrush className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-medium">لون الصفحة</span>
                <input
                  type="color"
                  value={pageColor.startsWith('#') ? pageColor : '#ffffff'}
                  onChange={(e) => onPageColorChange(e.target.value)}
                  className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Page Borders */}
          <button
            onClick={onOpenPageBordersModal}
            className="flex flex-col items-center p-1.5 hover:bg-slate-200 rounded text-slate-700 text-center"
            title="حدود وإطارات الصفحة"
          >
            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded mb-1">
              <Frame className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-medium">حدود الصفحة</span>
          </button>
        </div>
        <span className="text-[10px] text-slate-400 text-center font-medium">خلفية الصفحة (Page Background)</span>
      </div>

    </div>
  );
};
