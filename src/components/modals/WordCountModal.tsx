import React from 'react';
import { FileText, X } from 'lucide-react';
import { DocumentStats } from '../../types/word';

interface WordCountModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: DocumentStats;
}

export const WordCountModal: React.FC<WordCountModalProps> = ({
  isOpen,
  onClose,
  stats,
}) => {
  if (!isOpen) return null;

  const rows = [
    { label: 'الصفحات (Pages)', value: stats.pages },
    { label: 'الكلمات (Words)', value: stats.words },
    { label: 'الأحرف (دون مسافات)', value: stats.charactersNoSpaces },
    { label: 'الأحرف (مع المسافات)', value: stats.charactersWithSpaces },
    { label: 'الفقرات (Paragraphs)', value: stats.paragraphs },
    { label: 'الأسطر (Lines التقريبية)', value: stats.lines },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4">
      <div 
        className="w-full max-w-sm bg-white rounded-lg shadow-2xl border border-slate-300 overflow-hidden text-right"
        dir="rtl"
      >
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#2b579a] text-white">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-white" />
            <span className="font-semibold text-sm">عدد الكلمات (Word Count)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded text-white/90 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3 text-xs">
          <div className="space-y-1.5 border border-slate-200 rounded p-3 bg-slate-50/70">
            <span className="font-bold text-slate-800 block mb-2 border-b border-slate-200 pb-1">
              إحصائيات المستند:
            </span>
            {rows.map((row, i) => (
              <div key={i} className="flex items-center justify-between py-1 border-b border-dashed border-slate-200 last:border-none">
                <span className="text-slate-600">{row.label}</span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  {row.value.toLocaleString('ar-EG')}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="includeNotes"
              defaultChecked
              className="rounded border-slate-300 text-[#2b579a] focus:ring-[#2b579a]"
            />
            <label htmlFor="includeNotes" className="text-slate-600 cursor-pointer text-[11px]">
              تضمين مربعات النص والحواشي السفلية والتعليقات الختامية
            </label>
          </div>
        </div>

        <div className="flex justify-end p-3 bg-slate-50 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-5 py-1.5 bg-[#2b579a] hover:bg-[#20447c] text-white rounded text-xs font-medium shadow-sm transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
