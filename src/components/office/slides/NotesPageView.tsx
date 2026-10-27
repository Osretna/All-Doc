import React from 'react';
import { PowerPointSlideData } from './types';
import { ChevronRight, ChevronLeft, Printer, FileText } from 'lucide-react';

interface Props {
  slides: PowerPointSlideData[];
  currentSlideIndex: number;
  onSelectSlide: (index: number) => void;
  onUpdateNotes: (slideIndex: number, notes: string) => void;
  onReturnToNormalView: () => void;
}

export const NotesPageView: React.FC<Props> = ({
  slides,
  currentSlideIndex,
  onSelectSlide,
  onUpdateNotes,
  onReturnToNormalView,
}) => {
  const currentSlide = slides[currentSlideIndex] || slides[0];

  return (
    <div className="flex-1 flex flex-col bg-gray-200 overflow-y-auto items-center p-6 select-none">
      {/* Top Toolbar */}
      <div className="w-full max-w-2xl flex items-center justify-between mb-4 bg-white px-4 py-2 rounded-lg border border-gray-300 shadow-xs text-xs">
        <div className="flex items-center gap-2 font-bold text-gray-800">
          <FileText className="w-4 h-4 text-[#d83b01]" />
          <span>صفحة الملاحظات (Notes Page View)</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() => onSelectSlide(Math.max(0, currentSlideIndex - 1))}
              disabled={currentSlideIndex === 0}
              className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="font-mono">
              {currentSlideIndex + 1} / {slides.length}
            </span>
            <button
              onClick={() => onSelectSlide(Math.min(slides.length - 1, currentSlideIndex + 1))}
              disabled={currentSlideIndex === slides.length - 1}
              className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded font-semibold text-gray-700 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>طباعة الملاحظات</span>
          </button>

          <button
            onClick={onReturnToNormalView}
            className="px-3 py-1 bg-[#d83b01] text-white rounded font-bold hover:bg-[#b33000] cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>

      {/* Printable Sheet Simulation (Standard A4 with Slide on top, Notes on bottom) */}
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded border border-gray-300 p-8 flex flex-col justify-between aspect-[1/1.414] text-right">
        {/* Top Header */}
        <div className="text-[10px] text-gray-400 border-b border-gray-200 pb-2 flex justify-between">
          <span>عرض تقديمي سيادي - أوفيس 2026</span>
          <span>شريحة {currentSlideIndex + 1}</span>
        </div>

        {/* Slide Mini Render */}
        <div
          className="w-full aspect-video rounded-lg shadow-md p-6 text-white flex flex-col justify-between my-4 relative overflow-hidden bg-cover bg-center"
          style={{
            backgroundColor: currentSlide.backgroundColor || '#003366',
            backgroundImage: currentSlide.backgroundImage ? `url(${currentSlide.backgroundImage})` : undefined,
            fontFamily: currentSlide.fontFamily || 'Cairo',
          }}
        >
          <div>
            <h3 className="text-xl font-black text-sky-200">{currentSlide.title}</h3>
            <h5 className="text-sm text-white/80">{currentSlide.subtitle}</h5>
          </div>
          <div className="space-y-1 text-xs text-white/90">
            {currentSlide.body.map((b, i) => (
              <div key={i}>• {b}</div>
            ))}
          </div>
          <div className="text-[9px] text-white/40">Infinity Sovereign Slides</div>
        </div>

        {/* Large Editable Notes Box */}
        <div className="flex-1 flex flex-col pt-4 border-t-2 border-dashed border-gray-300">
          <label className="text-xs font-bold text-gray-700 mb-2">
            ملاحظات المتحدث المطبوعة للشريحة:
          </label>
          <textarea
            value={currentSlide.notes || ''}
            onChange={(e) => onUpdateNotes(currentSlideIndex, e.target.value)}
            placeholder="اكتب هنا التفاصيل الكاملة، الأرقام والإحصائيات، والنقاط التي ستقولها أثناء تقديم هذه الشريحة..."
            className="flex-1 w-full p-4 bg-gray-50 border border-gray-300 rounded-lg text-xs leading-relaxed text-gray-800 outline-none focus:border-[#d83b01] resize-none"
          />
        </div>

        {/* Sheet Footer */}
        <div className="text-[10px] text-gray-400 pt-3 border-t border-gray-200 flex justify-between">
          <span>تاريخ الطباعة: {new Date().toLocaleDateString('ar-EG')}</span>
          <span>صفحة {currentSlideIndex + 1}</span>
        </div>
      </div>
    </div>
  );
};
