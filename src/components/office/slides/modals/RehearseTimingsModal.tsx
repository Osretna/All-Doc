import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, ChevronRight, Check, Clock } from 'lucide-react';
import { PowerPointSlideData } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  slides: PowerPointSlideData[];
  onSaveTimings: (recordedTimings: { [slideId: string]: number }) => void;
}

export const RehearseTimingsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  slides,
  onSaveTimings,
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [slideSeconds, setSlideSeconds] = useState<number>(0);
  const [totalSeconds, setTotalSeconds] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [timings, setTimings] = useState<{ [slideId: string]: number }>({});

  useEffect(() => {
    if (!isOpen) return;
    setCurrentIdx(0);
    setSlideSeconds(0);
    setTotalSeconds(0);
    setIsPaused(false);
    setTimings({});
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || isPaused) return;
    const interval = setInterval(() => {
      setSlideSeconds((s) => s + 1);
      setTotalSeconds((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, isPaused]);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleNextSlide = () => {
    const currentSlide = slides[currentIdx];
    const newTimings = { ...timings, [currentSlide.id]: slideSeconds };
    setTimings(newTimings);

    if (currentIdx < slides.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSlideSeconds(0);
    } else {
      // Rehearsal finished
      setIsPaused(true);
      const totalRecorded = totalSeconds;
      if (
        window.confirm(
          `اكتمل تمرين العرض التقديمي!\nإجمالي وقت العرض: ${formatTime(totalRecorded)}\nهل تريد حفظ توقيتات الشرائح الجديدة واستخدامها أثناء عرض الشرائح التلقائي؟`
        )
      ) {
        onSaveTimings(newTimings);
      }
      onClose();
    }
  };

  const handleRestartSlide = () => {
    setTotalSeconds((prev) => Math.max(0, prev - slideSeconds));
    setSlideSeconds(0);
  };

  const activeSlide = slides[currentIdx] || slides[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-between p-6 select-none animate-in fade-in">
      {/* Floating Rehearsal Toolbar (authentic PowerPoint Rehearsal widget) */}
      <div className="bg-[#2d2d2d] text-white border border-gray-600 rounded-lg px-4 py-2.5 shadow-2xl flex items-center gap-4 text-xs font-mono">
        <div className="flex items-center gap-1.5 font-sans font-bold text-orange-400">
          <Clock className="w-4 h-4" />
          <span>تمرين على أوقات العرض</span>
        </div>

        <button
          onClick={handleNextSlide}
          className="flex items-center gap-1 px-3 py-1 bg-white/10 hover:bg-white/20 rounded font-bold text-white transition cursor-pointer"
          title="التالي (Next Slide)"
        >
          <span>التالي</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setIsPaused(!isPaused)}
          className="p-1 hover:bg-white/10 rounded transition cursor-pointer"
          title={isPaused ? 'استئناف' : 'إيقاف مؤقت'}
        >
          {isPaused ? <Play className="w-4 h-4 fill-white" /> : <Pause className="w-4 h-4 fill-white" />}
        </button>

        <div className="flex items-center gap-2 bg-black/40 px-2.5 py-1 rounded border border-white/10">
          <span className="text-gray-400 font-sans text-[11px]">وقت الشريحة:</span>
          <span className="text-emerald-400 font-bold">{formatTime(slideSeconds)}</span>
        </div>

        <button
          onClick={handleRestartSlide}
          className="p-1 hover:bg-white/10 rounded transition cursor-pointer"
          title="إعادة بدء الشريحة الحالية"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-2 bg-black/40 px-2.5 py-1 rounded border border-white/10">
          <span className="text-gray-400 font-sans text-[11px]">الوقت الكلي:</span>
          <span className="text-sky-400 font-bold">{formatTime(totalSeconds)}</span>
        </div>

        <button
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded text-gray-400 hover:text-white transition cursor-pointer"
          title="إنهاء التمرين"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Slide Preview in Center */}
      <div className="my-auto max-w-4xl w-full aspect-video rounded-xl bg-slate-900 border border-white/20 p-8 flex flex-col justify-between text-right text-white shadow-2xl relative">
        <div className="text-xs text-white/50 border-b border-white/10 pb-2 flex justify-between items-center">
          <span>شريحة {currentIdx + 1} من {slides.length}</span>
          <span>{activeSlide.title}</span>
        </div>

        <div className="my-auto space-y-3">
          <h2 className="text-3xl font-black text-sky-300">{activeSlide.title}</h2>
          <h4 className="text-lg text-white/80">{activeSlide.subtitle}</h4>
          <div className="space-y-1.5 pt-4">
            {activeSlide.body.map((b, i) => (
              <div key={i} className="text-sm text-white/90 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-amber-300 bg-amber-950/40 border border-amber-500/20 p-2 rounded">
          {activeSlide.notes || 'لا توجد ملاحظات لهذه الشريحة.'}
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="text-xs text-gray-400 font-sans">
        تحدث بطبيعتك واشرح المحتوى، ثم انقر على "التالي" للانتقال للشريحة اللاحقة وتسجيل التوقيت بدقة.
      </div>
    </div>
  );
};
