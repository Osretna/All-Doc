import React from 'react';
import { BookOpen, ZoomIn, ZoomOut, FileText, CheckCircle2 } from 'lucide-react';

interface Props {
  stats: {
    words: number;
    charactersWithSpaces: number;
  };
  viewMode: 'print' | 'read' | 'web' | 'outline' | 'draft';
  onViewModeChange: (mode: 'print' | 'read' | 'web' | 'outline' | 'draft') => void;
  zoom: number;
  onZoomChange: (z: number) => void;
  onOpenWordCount: () => void;
  onOpenNavigationPane: () => void;
  language?: string;
}

export const WordStatusBar: React.FC<Props> = ({
  stats,
  viewMode,
  onViewModeChange,
  zoom,
  onZoomChange,
  onOpenWordCount,
  onOpenNavigationPane,
  language = 'العربية (مصر)',
}) => {
  return (
    <div className="h-6 bg-[#004578] text-white px-3 flex items-center justify-between text-[11px] select-none shrink-0 no-print status-bar-container">
      {/* Left side stats */}
      <div className="flex items-center gap-3">
        <span
          onClick={onOpenNavigationPane}
          className="hover:bg-white/10 px-1.5 py-0.5 rounded cursor-pointer transition"
          title="الانتقال إلى صفحات المستند"
        >
          صفحة 1 من 1
        </span>
        <span className="text-white/40">|</span>
        <span
          onClick={onOpenWordCount}
          className="hover:bg-white/10 px-1.5 py-0.5 rounded cursor-pointer transition font-mono font-bold"
          title="إحصائيات الكلمات والأحرف"
        >
          {stats.words} كلمة
        </span>
        <span className="text-white/40">|</span>
        <span className="flex items-center gap-1 text-white/90">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          <span>{language}</span>
        </span>
      </div>

      {/* Right side view modes & zoom */}
      <div className="flex items-center gap-3">
        {/* View mode icons */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => onViewModeChange('read')}
            className={`p-1 rounded cursor-pointer ${viewMode === 'read' ? 'bg-white/20' : 'hover:bg-white/10'}`}
            title="وضع القراءة"
          >
            <BookOpen className="w-3 h-3" />
          </button>
          <button
            onClick={() => onViewModeChange('print')}
            className={`p-1 rounded cursor-pointer ${viewMode === 'print' ? 'bg-white/20' : 'hover:bg-white/10'}`}
            title="تخطيط الطباعة"
          >
            <FileText className="w-3 h-3" />
          </button>
        </div>

        <span className="text-white/40">|</span>

        {/* Zoom controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onZoomChange(Math.max(50, zoom - 10))}
            className="p-0.5 hover:bg-white/10 rounded cursor-pointer"
            title="تصغير"
          >
            <ZoomOut className="w-3 h-3" />
          </button>

          <input
            type="range"
            min="50"
            max="200"
            step="5"
            value={zoom}
            onChange={e => onZoomChange(parseInt(e.target.value, 10))}
            className="w-16 h-1 accent-white cursor-pointer"
          />

          <button
            onClick={() => onZoomChange(Math.min(200, zoom + 10))}
            className="p-0.5 hover:bg-white/10 rounded cursor-pointer"
            title="تكبير"
          >
            <ZoomIn className="w-3 h-3" />
          </button>

          <span
            onClick={() => onZoomChange(100)}
            className="w-9 font-mono font-bold text-center hover:bg-white/10 rounded px-1 cursor-pointer"
            title="إعادة التعيين إلى 100%"
          >
            {zoom}%
          </span>
        </div>
      </div>
    </div>
  );
};
