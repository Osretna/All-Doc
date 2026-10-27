import React from 'react';
import { 
  BookOpen, 
  FileText, 
  Globe, 
  Minus, 
  Plus, 
  Check, 
  Disc, 
  Languages 
} from 'lucide-react';
import { ViewMode, DocumentStats } from '../types/word';

interface StatusBarProps {
  stats: DocumentStats;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  zoom: number;
  onZoomChange: (newZoom: number) => void;
  onOpenWordCount: () => void;
  onOpenNavigationPane: () => void;
  language: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  stats,
  viewMode,
  onViewModeChange,
  zoom,
  onZoomChange,
  onOpenWordCount,
  onOpenNavigationPane,
  language,
}) => {
  return (
    <footer 
      className="h-6 bg-[#2b579a] text-white flex items-center justify-between px-3 select-none text-[11px] shrink-0 border-t border-[#20447c] z-30"
      dir="rtl"
    >
      {/* Left side (in RTL: Right side): Document Stats & Language */}
      <div className="flex items-center gap-3">
        {/* Page Count */}
        <button
          onClick={onOpenNavigationPane}
          className="hover:bg-white/15 px-2 py-0.5 rounded transition-colors text-white/90 hover:text-white"
          title="انقر لفتح جزء التنقل بين الصفحات"
        >
          <span>صفحة 1 من {stats.pages}</span>
        </button>

        {/* Word Count */}
        <button
          onClick={onOpenWordCount}
          className="hover:bg-white/15 px-2 py-0.5 rounded transition-colors text-white/90 hover:text-white font-mono tabular-nums"
          title="انقر لعرض إحصائيات المستند الكاملة"
        >
          <span>{stats.words.toLocaleString('ar-EG')} كلمة</span>
        </button>

        {/* Spelling status */}
        <div 
          className="flex items-center gap-1 text-white/80 px-1 py-0.5" 
          title="تم تدقيق المستند إملائياً ولا توجد أخطاء"
        >
          <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/30 flex items-center justify-center">
            <Check className="w-2.5 h-2.5 text-emerald-300" />
          </div>
          <span className="hidden sm:inline text-[10px]">خالٍ من الأخطاء</span>
        </div>

        {/* Language */}
        <button
          onClick={() => alert('لغة التدقيق الحالية: العربية (مصر)')}
          className="hidden md:flex items-center gap-1 hover:bg-white/15 px-2 py-0.5 rounded transition-colors text-white/90"
        >
          <Languages className="w-3 h-3 text-white/70" />
          <span>{language}</span>
        </button>

        {/* Macro record indicator */}
        <button
          onClick={() => alert('وحدات ماكرو جاهزة للتسجيل والتشغيل')}
          className="hidden lg:flex items-center gap-1 hover:bg-white/15 px-1 py-0.5 rounded transition-colors text-white/70"
          title="لا يتم تسجيل أي ماكرو حالياً"
        >
          <Disc className="w-3 h-3" />
        </button>
      </div>

      {/* Right side (in RTL: Left side): View Mode Shortcuts & Zoom */}
      <div className="flex items-center gap-2">
        {/* View Mode Shortcuts */}
        <div className="flex items-center gap-0.5 pl-2 ml-2 border-l border-white/20">
          <button
            onClick={() => onViewModeChange('read')}
            className={`p-1 rounded transition-colors ${
              viewMode === 'read' ? 'bg-white/25 text-white font-bold' : 'hover:bg-white/15 text-white/80'
            }`}
            title="وضع القراءة"
          >
            <BookOpen className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onViewModeChange('print')}
            className={`p-1 rounded transition-colors ${
              viewMode === 'print' ? 'bg-white/25 text-white font-bold' : 'hover:bg-white/15 text-white/80'
            }`}
            title="تخطيط الطباعة"
          >
            <FileText className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onViewModeChange('web')}
            className={`p-1 rounded transition-colors ${
              viewMode === 'web' ? 'bg-white/25 text-white font-bold' : 'hover:bg-white/15 text-white/80'
            }`}
            title="تخطيط الويب"
          >
            <Globe className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1" dir="ltr">
          <button
            onClick={() => onZoomChange(Math.max(20, zoom - 10))}
            className="p-1 hover:bg-white/15 rounded text-white/80 hover:text-white transition-colors"
            title="تصغير"
          >
            <Minus className="w-3 h-3" />
          </button>

          <input
            type="range"
            min="50"
            max="180"
            step="5"
            value={zoom}
            onChange={(e) => onZoomChange(parseInt(e.target.value, 10))}
            className="w-16 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-white"
            title={`مستوى التكبير: ${zoom}%`}
          />

          <button
            onClick={() => onZoomChange(Math.min(200, zoom + 10))}
            className="p-1 hover:bg-white/15 rounded text-white/80 hover:text-white transition-colors"
            title="تكبير"
          >
            <Plus className="w-3 h-3" />
          </button>

          <button
            onClick={() => onZoomChange(100)}
            className="w-9 font-mono text-[10px] text-right hover:bg-white/15 px-1 py-0.5 rounded transition-colors"
            title="إعادة التعيين إلى 100%"
          >
            {zoom}%
          </button>
        </div>
      </div>
    </footer>
  );
};
