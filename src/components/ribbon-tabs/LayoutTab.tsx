import React from 'react';
import { 
  Square, 
  RotateCw, 
  Maximize2, 
  Columns, 
  Scissors, 
  Hash, 
  Minus,
  Indent, 
  Outdent, 
  Move, 
  WrapText, 
  BringToFront, 
  SendToBack, 
  AlignLeft, 
  Group, 
  RotateCcw 
} from 'lucide-react';
import { PageSetup, PageOrientation, PageSize } from '../../types/word';

interface LayoutTabProps {
  pageSetup: PageSetup;
  onUpdatePageSetup: (newSetup: Partial<PageSetup>) => void;
}

export const LayoutTab: React.FC<LayoutTabProps> = ({
  pageSetup,
  onUpdatePageSetup,
}) => {
  const setMargins = (preset: PageSetup['marginPreset']) => {
    switch (preset) {
      case 'normal':
        onUpdatePageSetup({
          marginPreset: 'normal',
          margins: { top: 2.54, bottom: 2.54, left: 2.54, right: 2.54 },
        });
        break;
      case 'narrow':
        onUpdatePageSetup({
          marginPreset: 'narrow',
          margins: { top: 1.27, bottom: 1.27, left: 1.27, right: 1.27 },
        });
        break;
      case 'wide':
        onUpdatePageSetup({
          marginPreset: 'wide',
          margins: { top: 2.54, bottom: 2.54, left: 5.08, right: 5.08 },
        });
        break;
    }
  };

  return (
    <div className="flex items-stretch h-[96px] py-1 px-2 overflow-x-auto text-slate-700 select-none divide-x divide-x-reverse divide-slate-200" dir="rtl">
      
      {/* 1. Page Setup (إعداد الصفحة) */}
      <div className="flex flex-col justify-between px-3 min-w-[320px] shrink-0">
        <div className="flex items-center gap-2 py-1">
          {/* Margins */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => {
                const nextPreset = pageSetup.marginPreset === 'normal' ? 'narrow' : pageSetup.marginPreset === 'narrow' ? 'wide' : 'normal';
                setMargins(nextPreset);
              }}
              className="flex flex-col items-center p-1 hover:bg-slate-200 rounded text-center"
              title="تغيير الهوامش"
            >
              <div className="p-1 bg-blue-50 text-[#2b579a] rounded mb-0.5">
                <Square className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-medium">الهوامش</span>
              <span className="text-[9px] text-slate-400">
                {pageSetup.marginPreset === 'normal' ? 'عادي' : pageSetup.marginPreset === 'narrow' ? 'ضيق' : 'عريض'}
              </span>
            </button>
          </div>

          {/* Orientation */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => {
                const next: PageOrientation = pageSetup.orientation === 'portrait' ? 'landscape' : 'portrait';
                onUpdatePageSetup({ orientation: next });
              }}
              className="flex flex-col items-center p-1 hover:bg-slate-200 rounded text-center"
              title="اتجاه الصفحة: عمودي / أفقي"
            >
              <div className="p-1 bg-amber-50 text-amber-600 rounded mb-0.5">
                <RotateCw className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-medium">الاتجاه</span>
              <span className="text-[9px] text-slate-400">
                {pageSetup.orientation === 'portrait' ? 'عمودي' : 'أفقي'}
              </span>
            </button>
          </div>

          {/* Paper Size */}
          <div className="flex flex-col items-center">
            <div className="flex flex-col items-center p-1 text-center">
              <div className="p-1 bg-emerald-50 text-emerald-600 rounded mb-0.5">
                <Maximize2 className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-medium">الحجم</span>
              <select
                value={pageSetup.size}
                onChange={(e) => onUpdatePageSetup({ size: e.target.value as PageSize })}
                className="text-[9px] bg-white border border-slate-300 rounded px-1 outline-none text-slate-700"
              >
                <option value="A4">A4 (21×29.7cm)</option>
                <option value="Letter">Letter</option>
                <option value="Legal">Legal</option>
                <option value="A3">A3 (كبير)</option>
                <option value="A5">A5 (كتيب)</option>
              </select>
            </div>
          </div>

          {/* Columns */}
          <div className="flex flex-col items-center">
            <div className="flex flex-col items-center p-1 text-center">
              <div className="p-1 bg-indigo-50 text-indigo-600 rounded mb-0.5">
                <Columns className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-medium">الأعمدة</span>
              <select
                value={pageSetup.columns}
                onChange={(e) => onUpdatePageSetup({ columns: parseInt(e.target.value, 10) as any })}
                className="text-[9px] bg-white border border-slate-300 rounded px-1 outline-none text-slate-700"
              >
                <option value={1}>عمود واحد</option>
                <option value={2}>عمودان</option>
                <option value={3}>3 أعمدة</option>
              </select>
            </div>
          </div>

          {/* Line numbers & breaks */}
          <div className="flex flex-col gap-0.5 pr-1 border-r border-slate-200">
            <button
              onClick={() => onUpdatePageSetup({ lineNumbers: !pageSetup.lineNumbers })}
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] ${pageSetup.lineNumbers ? 'bg-blue-100 text-[#2b579a] font-bold' : 'hover:bg-slate-200'}`}
            >
              <Hash className="w-3 h-3 text-slate-500" />
              <span>أرقام الأسطر</span>
            </button>
            <button
              onClick={() => alert('تم إدراج فاصل مقطعي للصفحة التالية')}
              className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px]"
            >
              <Scissors className="w-3 h-3 text-slate-500" />
              <span>فواصل الصفحات</span>
            </button>
            <button
              onClick={() => onUpdatePageSetup({ hyphenation: !pageSetup.hyphenation })}
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] ${pageSetup.hyphenation ? 'bg-blue-100 text-[#2b579a] font-bold' : 'hover:bg-slate-200'}`}
            >
              <Minus className="w-3 h-3 text-slate-500" />
              <span>واصلات (Hyphenation)</span>
            </button>
          </div>
        </div>
        <span className="text-[10px] text-slate-400 text-center font-medium">إعداد الصفحة (Page Setup)</span>
      </div>

      {/* 2. Paragraph (فقرة) - Indent & Spacing */}
      <div className="flex flex-col justify-between px-3 min-w-[190px] shrink-0">
        <div className="space-y-1.5 py-1 text-[11px]">
          <div className="flex items-center justify-between gap-2">
            <span className="text-slate-500">مسافة بادئة (يمين):</span>
            <input 
              type="number" 
              defaultValue="0" 
              step="0.5" 
              className="w-12 px-1 py-0.5 border border-slate-300 rounded font-mono text-[10px] text-center"
            />
            <span className="text-[9px] text-slate-400">سم</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-slate-500">تباعد (قبل / بعد):</span>
            <input 
              type="number" 
              defaultValue="8" 
              step="2" 
              className="w-12 px-1 py-0.5 border border-slate-300 rounded font-mono text-[10px] text-center"
            />
            <span className="text-[9px] text-slate-400">نقطة</span>
          </div>
        </div>
        <span className="text-[10px] text-slate-400 text-center font-medium">فقرة (Paragraph)</span>
      </div>

      {/* 3. Arrange (ترتيب) */}
      <div className="flex flex-col justify-between px-3 min-w-[240px] shrink-0">
        <div className="grid grid-cols-2 gap-1.5 py-1">
          <button
            onClick={() => alert('موضع العنصر: مضمن في السطر')}
            className="flex items-center gap-1.5 px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px]"
          >
            <Move className="w-3.5 h-3.5 text-blue-600" />
            <span>الموضع (Position)</span>
          </button>
          <button
            onClick={() => alert('التفاف النص: مشدود حول الشكل/الصورة')}
            className="flex items-center gap-1.5 px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px]"
          >
            <WrapText className="w-3.5 h-3.5 text-indigo-600" />
            <span>التفاف النص</span>
          </button>
          <button
            onClick={() => alert('إحضار العنصر إلى الأمام')}
            className="flex items-center gap-1.5 px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px]"
          >
            <BringToFront className="w-3.5 h-3.5 text-slate-600" />
            <span>إحضار للأمام</span>
          </button>
          <button
            onClick={() => alert('إرسال العنصر إلى الخلف')}
            className="flex items-center gap-1.5 px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px]"
          >
            <SendToBack className="w-3.5 h-3.5 text-slate-600" />
            <span>إرسال للخلف</span>
          </button>
          <button
            onClick={() => alert('تجميع الكائنات المحددة')}
            className="flex items-center gap-1.5 px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px]"
          >
            <Group className="w-3.5 h-3.5 text-slate-600" />
            <span>تجميع (Group)</span>
          </button>
          <button
            onClick={() => alert('استدارة العنصر 90 درجة')}
            className="flex items-center gap-1.5 px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px]"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
            <span>استدارة (Rotate)</span>
          </button>
        </div>
        <span className="text-[10px] text-slate-400 text-center font-medium">ترتيب (Arrange)</span>
      </div>

    </div>
  );
};
