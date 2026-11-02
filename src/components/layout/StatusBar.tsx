import React from 'react';
import { OfficeAppId } from '../../types';
import { ShieldCheck, BookOpen, Layout, Globe, ZoomIn, ZoomOut, CheckCircle2 } from 'lucide-react';

interface Props {
  activeApp: OfficeAppId;
  wordCount: number;
  charCount: number;
  zoomLevel: number;
  setZoomLevel: (zoom: number | ((prev: number) => number)) => void;
  pageNumber?: number;
  totalPages?: number;
}

export const StatusBar: React.FC<Props> = ({
  activeApp,
  wordCount,
  charCount,
  zoomLevel,
  setZoomLevel,
  pageNumber = 1,
  totalPages = 1,
}) => {
  return (
    <div className="bg-[#f3f2f1] border-t border-[#d1d1d1] px-3 py-1 select-none flex items-center justify-between text-[11px] text-[#605e5c] h-7 shrink-0 no-print">
      {/* Left items */}
      <div className="flex items-center gap-3">
        {activeApp === 'docs' && (
          <div className="hover:bg-gray-200/80 px-1.5 py-0.5 rounded cursor-pointer transition">
            صفحة {pageNumber} من {totalPages}
          </div>
        )}

        <div className="hover:bg-gray-200/80 px-1.5 py-0.5 rounded cursor-pointer transition">
          {wordCount.toLocaleString('ar-EG')} كلمة
        </div>

        <div className="hidden sm:inline hover:bg-gray-200/80 px-1.5 py-0.5 rounded cursor-pointer transition">
          {charCount.toLocaleString('ar-EG')} حرف
        </div>

        <div className="h-3 w-[1px] bg-gray-300"></div>

        <div className="flex items-center gap-1 hover:bg-gray-200/80 px-1.5 py-0.5 rounded cursor-pointer transition text-gray-700">
          <Globe className="w-3 h-3 text-[#0078d4]" />
          <span>العربية (مصر / الخليج العربي)</span>
        </div>
      </div>

      {/* Center item: Sovereign Status */}
      <div className="hidden md:flex items-center gap-1.5 text-emerald-700 font-medium">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>الوضع السيادي نشط (بياناتك لا تخرج من هذا الجهاز)</span>
      </div>

      {/* Right items: Zoom & Layout Controls */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoomLevel((z) => Math.max(50, z - 10))}
            className="hover:text-black p-0.5 rounded hover:bg-gray-200 cursor-pointer"
            title="تصغير الزووم"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <input
            type="range"
            min="50"
            max="200"
            step="5"
            value={zoomLevel}
            onChange={(e) => setZoomLevel(Number(e.target.value))}
            className="w-16 h-1 bg-gray-300 rounded appearance-none cursor-pointer accent-[#0078d4]"
          />

          <button
            onClick={() => setZoomLevel((z) => Math.min(200, z + 10))}
            className="hover:text-black p-0.5 rounded hover:bg-gray-200 cursor-pointer"
            title="تكبير الزووم"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <span 
            onClick={() => setZoomLevel(100)}
            className="font-mono font-semibold w-9 text-center hover:bg-gray-200 px-1 py-0.5 rounded cursor-pointer"
            title="إعادة ضبط 100%"
          >
            {zoomLevel}%
          </span>
        </div>
      </div>
    </div>
  );
};
