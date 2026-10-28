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
              onClick={() => {
                const sel = window.getSelection();
                if (sel && sel.rangeCount > 0) {
                  const range = sel.getRangeAt(0);
                  const div = document.createElement('div');
                  div.style.pageBreakAfter = 'always';
                  div.className = 'border-b-2 border-dashed border-blue-400 my-4 text-center text-xs text-blue-500 select-none';
                  div.innerText = '┈┈┈┈ فاصل مقطعي للصفحة التالية ┈┈┈┈';
                  range.insertNode(div);
                }
              }}
              className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px]"
              title="إدراج فاصل مقطعي للصفحة التالية"
            >
              <Scissors className="w-3 h-3 text-slate-500" />
              <span>فواصل الصفحات</span>
            </button>
            <button
              onClick={() => onUpdatePageSetup({ hyphenation: !pageSetup.hyphenation })}
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] ${pageSetup.hyphenation ? 'bg-blue-100 text-[#2b579a] font-bold' : 'hover:bg-slate-200'}`}
              title="تفعيل الواصلات التلقائية"
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
            onClick={() => {
              const editor = document.getElementById('document-editor');
              const el = editor?.querySelector('figure, table, img');
              if (el) {
                (el as HTMLElement).style.margin = (el as HTMLElement).style.margin === 'auto' ? '0' : 'auto';
                (el as HTMLElement).style.display = 'block';
              }
            }}
            className="flex items-center gap-1.5 px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px]"
            title="تبديل موضع العنصر المحدد في الصفحة"
          >
            <Move className="w-3.5 h-3.5 text-blue-600" />
            <span>الموضع (Position)</span>
          </button>
          <button
            onClick={() => {
              const editor = document.getElementById('document-editor');
              const img = editor?.querySelector('img, figure');
              if (img) {
                const currentFloat = (img as HTMLElement).style.float;
                (img as HTMLElement).style.float = currentFloat === 'right' ? 'none' : 'right';
                (img as HTMLElement).style.margin = currentFloat === 'right' ? '10px auto' : '0 0 14px 14px';
              }
            }}
            className="flex items-center gap-1.5 px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px]"
            title="التفاف النص حول الصورة أو الجدول"
          >
            <WrapText className="w-3.5 h-3.5 text-indigo-600" />
            <span>التفاف النص</span>
          </button>
          <button
            onClick={() => {
              const editor = document.getElementById('document-editor');
              const el = editor?.querySelector('figure, table, .cover-page');
              if (el) (el as HTMLElement).style.zIndex = '30';
            }}
            className="flex items-center gap-1.5 px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px]"
            title="إحضار العنصر للأمام"
          >
            <BringToFront className="w-3.5 h-3.5 text-slate-600" />
            <span>إحضار للأمام</span>
          </button>
          <button
            onClick={() => {
              const editor = document.getElementById('document-editor');
              const el = editor?.querySelector('figure, table, .cover-page');
              if (el) (el as HTMLElement).style.zIndex = '0';
            }}
            className="flex items-center gap-1.5 px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px]"
            title="إرسال العنصر للخلف"
          >
            <SendToBack className="w-3.5 h-3.5 text-slate-600" />
            <span>إرسال للخلف</span>
          </button>
          <button
            onClick={() => {
              const sel = window.getSelection();
              if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
                const range = sel.getRangeAt(0);
                const wrapper = document.createElement('div');
                wrapper.className = 'p-3 my-2 border border-dashed border-slate-400 rounded-lg bg-slate-50/50';
                try {
                  range.surroundContents(wrapper);
                } catch {
                  // surround fallback
                }
              }
            }}
            className="flex items-center gap-1.5 px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px]"
            title="تجميع العناصر المحددة داخل إطار موحد"
          >
            <Group className="w-3.5 h-3.5 text-slate-600" />
            <span>تجميع (Group)</span>
          </button>
          <button
            onClick={() => {
              const editor = document.getElementById('document-editor');
              const img = editor?.querySelector('img, figure');
              if (img) {
                const current = (img as any).__rotation || 0;
                const nextRot = (current + 90) % 360;
                (img as any).__rotation = nextRot;
                (img as HTMLElement).style.transform = `rotate(${nextRot}deg)`;
                (img as HTMLElement).style.transition = 'transform 0.2s ease';
              }
            }}
            className="flex items-center gap-1.5 px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px]"
            title="استدارة الصورة أو الشكل 90 درجة"
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
