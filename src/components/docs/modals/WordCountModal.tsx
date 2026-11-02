import React from 'react';
import { X, FileText, CheckCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  stats: {
    words: number;
    charactersNoSpaces: number;
    charactersWithSpaces: number;
    paragraphs: number;
    lines: number;
  };
}

export const WordCountModal: React.FC<Props> = ({ isOpen, onClose, stats }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-300 w-full max-w-xs flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        <div className="flex items-center justify-between px-4 py-3 bg-[#004578] text-white">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            <h3 className="font-bold text-sm">عدد الكلمات والإحصائيات</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded cursor-pointer transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-2 text-xs text-gray-700">
          <div className="flex justify-between py-1.5 border-b border-gray-100 font-bold text-gray-900">
            <span>الصفحات:</span>
            <span>1</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-gray-100">
            <span>الكلمات:</span>
            <span className="font-mono font-bold text-[#004578]">{stats.words}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-gray-100">
            <span>الأحرف (دون مسافات):</span>
            <span className="font-mono">{stats.charactersNoSpaces}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-gray-100">
            <span>الأحرف (مع المسافات):</span>
            <span className="font-mono">{stats.charactersWithSpaces}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-gray-100">
            <span>الفقرات:</span>
            <span className="font-mono">{stats.paragraphs}</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span>الأسطر التقريبية:</span>
            <span className="font-mono">{stats.lines}</span>
          </div>
        </div>

        <div className="px-4 py-2.5 bg-gray-100 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-1.5 rounded bg-[#004578] hover:bg-[#00345b] text-white font-bold text-xs cursor-pointer shadow-xs"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
