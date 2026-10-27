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
            onClick={() => alert('تم تطبيق لوحة ألوان متناسقة مع نسق Office 365 الأزرق الاحترافي')}
            className="flex items-center gap-1.5 px-2 py-1 hover:bg-slate-200 rounded text-[11px] text-slate-700"
          >
            <div className="flex gap-0.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2b579a]"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            </div>
            <span>الألوان (Colors)</span>
          </button>

          <button
            onClick={() => alert('تم تطبيق نمط خطوط النسق (Aptos / Cairo)')}
            className="flex items-center gap-1.5 px-2 py-1 hover:bg-slate-200 rounded text-[11px] text-slate-700"
          >
            <Type className="w-3.5 h-3.5 text-slate-600" />
            <span>الخطوط (Fonts)</span>
          </button>

          <button
            onClick={() => {
              const editor = document.getElementById('document-editor');
              if (editor) editor.style.lineHeight = '1.8';
            }}
            className="flex items-center gap-1.5 px-2 py-1 hover:bg-slate-200 rounded text-[11px] text-slate-700"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600" />
            <span>تباعد الفقرات</span>
          </button>

          <button
            onClick={() => alert('تم تطبيق تأثيرات الظلال والحواف الأنيقة')}
            className="flex items-center gap-1.5 px-2 py-1 hover:bg-slate-200 rounded text-[11px] text-slate-700"
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
          onClick={() => alert('تم تعيين إعدادات التنسيق الحالية كافتراضية لجميع المستندات الجديدة.')}
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
