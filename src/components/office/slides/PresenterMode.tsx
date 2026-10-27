import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Clock,
  PenTool,
  Highlighter,
  Eraser,
  Grid,
  Maximize2,
  Volume2,
  Subtitles,
  Sparkles,
  Layers,
  Circle
} from 'lucide-react';
import { PowerPointSlideData } from './types';

interface Props {
  slides: PowerPointSlideData[];
  initialSlideIndex: number;
  onClose: () => void;
}

export const PresenterMode: React.FC<Props> = ({
  slides,
  initialSlideIndex,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(initialSlideIndex);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);
  const [isBlackScreen, setIsBlackScreen] = useState<boolean>(false);
  const [isWhiteScreen, setIsWhiteScreen] = useState<boolean>(false);
  const [laserPointer, setLaserPointer] = useState<{ x: number; y: number } | null>(null);
  const [isLaserActive, setIsLaserActive] = useState<boolean>(false);
  const [isPenActive, setIsPenActive] = useState<boolean>(false);
  const [isHighlighterActive, setIsHighlighterActive] = useState<boolean>(false);
  const [penColor, setPenColor] = useState<string>('#ef4444');
  const [notesFontSize, setNotesFontSize] = useState<number>(14);
  const [showThumbDrawer, setShowThumbDrawer] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef<boolean>(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  // Live Timer
  useEffect(() => {
    if (isTimerPaused) return;
    const interval = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerPaused]);

  // Keyboard navigation & Black/White screen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'b' || e.key === 'B' || e.key === '.') {
        e.preventDefault();
        setIsBlackScreen((prev) => !prev);
        setIsWhiteScreen(false);
        return;
      }
      if (e.key === 'w' || e.key === 'W' || e.key === ',') {
        e.preventDefault();
        setIsWhiteScreen((prev) => !prev);
        setIsBlackScreen(false);
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        setIsBlackScreen(false);
        setIsWhiteScreen(false);
        setCurrentIndex((prev) => Math.min(slides.length - 1, prev + 1));
        return;
      }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        setIsBlackScreen(false);
        setIsWhiteScreen(false);
        setCurrentIndex((prev) => Math.max(0, prev - 1));
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length, onClose]);

  // Drawing Canvas Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPenActive && !isHighlighterActive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    isDrawingRef.current = true;
    lastPointRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isLaserActive) {
      setLaserPointer({ x: e.clientX, y: e.clientY });
    }

    if (!isDrawingRef.current || (!isPenActive && !isHighlighterActive)) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const currentPoint = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    ctx.beginPath();
    if (lastPointRef.current) {
      ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    }
    ctx.lineTo(currentPoint.x, currentPoint.y);
    ctx.strokeStyle = isHighlighterActive ? 'rgba(250, 204, 21, 0.4)' : penColor;
    ctx.lineWidth = isHighlighterActive ? 14 : 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    lastPointRef.current = currentPoint;
  };

  const handleMouseUp = () => {
    isDrawingRef.current = false;
    lastPointRef.current = null;
  };

  const clearDrawings = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentSlide = slides[currentIndex] || slides[0];
  const nextSlide = slides[currentIndex + 1] || null;

  // Determine transition CSS class
  const transitionType = currentSlide.transitionConfig?.type || currentSlide.transition || 'fade';
  const getTransitionStyle = () => {
    if (transitionType === 'morph') {
      return 'transition-all duration-700 ease-in-out';
    }
    if (transitionType === 'push') {
      return 'animate-in slide-in-from-right duration-500';
    }
    if (transitionType === 'wipe') {
      return 'animate-in fade-in duration-700';
    }
    if (transitionType === 'zoom') {
      return 'animate-in zoom-in-90 duration-500';
    }
    return 'animate-in fade-in duration-300';
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1e1e1e] text-white flex flex-col select-none overflow-hidden font-sans">
      {/* Laser Pointer dot */}
      {isLaserActive && laserPointer && (
        <div
          className="pointer-events-none fixed w-4 h-4 rounded-full bg-red-500 shadow-[0_0_14px_6px_rgba(239,68,68,0.9)] z-[300] -translate-x-1/2 -translate-y-1/2"
          style={{ left: laserPointer.x, top: laserPointer.y }}
        />
      )}

      {/* Black / White Screen overlays */}
      {isBlackScreen && (
        <div className="fixed inset-0 z-[280] bg-black flex items-center justify-center text-gray-500 text-xs font-mono">
          شاشة سوداء مؤقتة (اضغط B أو . للعودة)
        </div>
      )}
      {isWhiteScreen && (
        <div className="fixed inset-0 z-[280] bg-white flex items-center justify-center text-gray-400 text-xs font-mono">
          شاشة بيضاء مؤقتة (اضغط W أو , للعودة)
        </div>
      )}

      {/* Top Header: Clock, Timer, Controls */}
      <div className="h-12 bg-[#2d2d2d] border-b border-gray-700 px-6 flex items-center justify-between text-xs">
        {/* Left: Presentation Time & Current Clock */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="font-mono text-sm font-bold">{formatTime(elapsedSeconds)}</span>
            <button
              onClick={() => setIsTimerPaused(!isTimerPaused)}
              className="p-1 hover:bg-white/10 rounded cursor-pointer"
              title={isTimerPaused ? 'استئناف الوقت' : 'إيقاف مؤقت'}
            >
              {isTimerPaused ? <Play className="w-3.5 h-3.5 fill-white" /> : <Pause className="w-3.5 h-3.5 fill-white" />}
            </button>
            <button
              onClick={() => setElapsedSeconds(0)}
              className="p-1 hover:bg-white/10 rounded cursor-pointer"
              title="إعادة ضبط الوقت"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="border-r border-gray-600 h-4" />

          <div className="text-gray-300 font-mono">
            الساعة الآن: {new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        {/* Center: Slide indicator */}
        <div className="font-bold text-gray-200">
          الشريحة {currentIndex + 1} من {slides.length}
        </div>

        {/* Right: Exit Presenter View */}
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 rounded font-bold text-gray-200 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
          <span>إنهاء عرض الشرائح (Esc)</span>
        </button>
      </div>

      {/* Main Dual-Screen Presenter Body */}
      <div className="flex-1 flex overflow-hidden p-4 gap-4">
        {/* LEFT COLUMN: Main Current Big Slide Canvas with Interactive Pen */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="relative flex-1 rounded-xl overflow-hidden border border-gray-700 shadow-2xl flex items-center justify-center bg-black">
            {/* Slide Content Box */}
            <div
              key={currentSlide.id}
              className={`w-full h-full p-8 md:p-12 flex flex-col justify-between text-right relative overflow-hidden bg-cover bg-center ${getTransitionStyle()}`}
              style={{
                backgroundColor: currentSlide.backgroundColor || '#003366',
                backgroundImage: currentSlide.backgroundImage ? `url(${currentSlide.backgroundImage})` : undefined,
                fontFamily: currentSlide.fontFamily || 'Cairo',
              }}
            >
              {/* Slide Title */}
              <div>
                <h1 className="text-2xl md:text-4xl font-black text-sky-300 mb-2">
                  {currentSlide.title}
                </h1>
                <h3 className="text-base md:text-xl text-white/80 font-medium">
                  {currentSlide.subtitle}
                </h3>
              </div>

              {/* Slide Body */}
              <div className="space-y-3 my-auto">
                {currentSlide.body.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm md:text-lg text-white/90">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Slide Footer */}
              <div className="border-t border-white/10 pt-2 flex justify-between text-[10px] text-white/40">
                <span>عرض تقديمي سيادي 100% بدون إنترنت</span>
                <span>{currentIndex + 1} / {slides.length}</span>
              </div>
            </div>

            {/* In-Slide Drawing Canvas overlay */}
            <canvas
              ref={canvasRef}
              width={960}
              height={540}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              className={`absolute inset-0 w-full h-full z-20 ${
                isLaserActive
                  ? 'cursor-none'
                  : isPenActive || isHighlighterActive
                  ? 'cursor-crosshair'
                  : 'pointer-events-none'
              }`}
            />
          </div>

          {/* Interactive Presenter Toolbar below current slide */}
          <div className="h-12 flex items-center justify-between px-2 pt-2 text-xs">
            <div className="flex items-center gap-1.5 bg-[#2d2d2d] px-3 py-1 rounded-lg border border-gray-700">
              <button
                onClick={() => {
                  setIsLaserActive(!isLaserActive);
                  setIsPenActive(false);
                  setIsHighlighterActive(false);
                }}
                className={`p-1.5 rounded transition cursor-pointer ${
                  isLaserActive ? 'bg-red-600 text-white shadow-xs' : 'text-gray-300 hover:bg-white/10'
                }`}
                title="مؤشر الليزر (Laser Pointer)"
              >
                <Circle className="w-4 h-4 fill-current" />
              </button>

              <button
                onClick={() => {
                  setIsPenActive(!isPenActive);
                  setIsLaserActive(false);
                  setIsHighlighterActive(false);
                }}
                className={`p-1.5 rounded transition cursor-pointer ${
                  isPenActive ? 'bg-[#d83b01] text-white shadow-xs' : 'text-gray-300 hover:bg-white/10'
                }`}
                title="قلم الحبر للرسم والشرح (Pen)"
              >
                <PenTool className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setIsHighlighterActive(!isHighlighterActive);
                  setIsLaserActive(false);
                  setIsPenActive(false);
                }}
                className={`p-1.5 rounded transition cursor-pointer ${
                  isHighlighterActive ? 'bg-yellow-500 text-black font-bold' : 'text-gray-300 hover:bg-white/10'
                }`}
                title="قلم التمييز الفسفوري (Highlighter)"
              >
                <Highlighter className="w-4 h-4" />
              </button>

              <button
                onClick={clearDrawings}
                className="p-1.5 text-gray-300 hover:bg-white/10 rounded transition cursor-pointer"
                title="مسح كافة الرسومات على الشريحة"
              >
                <Eraser className="w-4 h-4" />
              </button>

              <div className="border-r border-gray-600 h-4 mx-1" />

              {/* Black / White Screen buttons */}
              <button
                onClick={() => setIsBlackScreen(!isBlackScreen)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer ${
                  isBlackScreen ? 'bg-white text-black font-bold' : 'bg-black text-gray-300 border border-gray-600'
                }`}
                title="شاشة سوداء (Shortcut: B)"
              >
                B
              </button>
              <button
                onClick={() => setIsWhiteScreen(!isWhiteScreen)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer ${
                  isWhiteScreen ? 'bg-black text-white font-bold' : 'bg-white text-black border border-gray-300'
                }`}
                title="شاشة بيضاء (Shortcut: W)"
              >
                W
              </button>

              <button
                onClick={() => setShowThumbDrawer(!showThumbDrawer)}
                className="p-1.5 text-gray-300 hover:bg-white/10 rounded transition cursor-pointer"
                title="عرض مصغرات كافة الشرائح للقفز المباشر"
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Next / Prev */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                disabled={currentIndex === 0}
                className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-20 rounded-lg font-bold text-xs transition cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
                <span>السابقة</span>
              </button>

              <button
                onClick={() => setCurrentIndex((i) => Math.min(slides.length - 1, i + 1))}
                disabled={currentIndex === slides.length - 1}
                className="flex items-center gap-1.5 px-5 py-2 bg-[#d83b01] hover:bg-[#b33000] disabled:opacity-20 rounded-lg font-bold text-xs text-white shadow transition cursor-pointer"
              >
                <span>الشريحة التالية</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Next Slide Preview + Speaker Notes */}
        <div className="w-80 md:w-96 flex flex-col gap-4">
          {/* Next Slide Preview Box */}
          <div className="bg-[#2d2d2d] rounded-xl p-3 border border-gray-700 flex flex-col">
            <div className="text-[11px] font-bold text-gray-400 mb-1.5 flex items-center justify-between">
              <span>الشريحة القادمة:</span>
              <span className="text-sky-400">{nextSlide ? `${currentIndex + 2} / ${slides.length}` : 'نهاية العرض'}</span>
            </div>

            <div className="aspect-video rounded-lg overflow-hidden border border-gray-600 bg-black flex items-center justify-center p-3 text-center">
              {nextSlide ? (
                <div className="w-full h-full flex flex-col justify-center">
                  <div className="font-bold text-xs text-white truncate">{nextSlide.title}</div>
                  <div className="text-[10px] text-gray-400 truncate mt-1">{nextSlide.subtitle}</div>
                </div>
              ) : (
                <div className="text-gray-500 text-xs font-mono">
                  لا توجد شرائح إضافية (نهاية العرض)
                </div>
              )}
            </div>
          </div>

          {/* Speaker Notes Box */}
          <div className="flex-1 bg-[#2d2d2d] rounded-xl p-4 border border-gray-700 flex flex-col text-right overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-700 pb-2 mb-3">
              <span className="text-xs font-bold text-amber-300">ملاحظات مقدم العرض (Speaker Notes):</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setNotesFontSize((s) => Math.max(10, s - 2))}
                  className="px-2 py-0.5 bg-white/10 hover:bg-white/20 rounded text-[10px] cursor-pointer"
                >
                  A-
                </button>
                <button
                  onClick={() => setNotesFontSize((s) => Math.min(24, s + 2))}
                  className="px-2 py-0.5 bg-white/10 hover:bg-white/20 rounded text-[10px] font-bold cursor-pointer"
                >
                  A+
                </button>
              </div>
            </div>

            <div
              className="flex-1 overflow-y-auto leading-relaxed text-gray-200"
              style={{ fontSize: `${notesFontSize}px` }}
            >
              {currentSlide.notes ? (
                <div>{currentSlide.notes}</div>
              ) : (
                <div className="text-gray-500 italic text-xs">
                  لا توجد ملاحظات مسجلة لهذه الشريحة.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Slide Thumbnails Drawer (when Grid icon clicked) */}
      {showThumbDrawer && (
        <div className="fixed inset-x-0 bottom-0 h-40 bg-[#181818]/95 backdrop-blur-md border-t border-gray-700 z-50 p-3 flex items-center gap-3 overflow-x-auto animate-in slide-in-from-bottom">
          {slides.map((s, idx) => (
            <div
              key={s.id}
              onClick={() => {
                setCurrentIndex(idx);
                setShowThumbDrawer(false);
              }}
              className={`h-full aspect-video rounded-lg p-2 text-center flex flex-col justify-between border-2 cursor-pointer transition shrink-0 ${
                idx === currentIndex ? 'border-[#d83b01] bg-white/10' : 'border-gray-700 hover:border-gray-500 bg-[#242424]'
              }`}
            >
              <div className="text-[10px] font-bold text-white truncate">{idx + 1}. {s.title}</div>
              <div className="text-[8px] text-gray-400">{s.subtitle}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
