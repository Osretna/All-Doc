import React, { useState } from 'react';
import { Plus, Trash2, Play, Image as ImageIcon, Layout, Type } from 'lucide-react';
import { AppStorage } from '../../utils/storage';

interface Slide {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  bg?: string;
}

const DEFAULT_SLIDES: Slide[] = [
  {
    id: 's1',
    title: 'عرض تقديمي استراتيجي',
    subtitle: 'الجناح المكتبي السيادي MY-DOC Sovereign Suite 2026',
    content: '• كفاءة إنتاجية 100% بدون اتصال بالإنترنت\n• خصوصية وأمان سيادي مطلق لكافة المستندات\n• توافق كامل مع معايير مايكروسوفت أوفيس العالمية',
    bg: '#004578',
  },
  {
    id: 's2',
    title: 'الخطة التشغيلية والأهداف',
    subtitle: 'أبرز الإنجازات المحققة في الربع الحالي',
    content: '1. إطلاق منصة الجداول الحسابية فائقة الدقة\n2. دعم حزمة الخطوط العربية المتكاملة\n3. نظام حفظ محلي مشفر على أجهزة المستخدمين',
    bg: '#107c41',
  }
];

export const PowerPointApp: React.FC = () => {
  const [slides, setSlides] = useState<Slide[]>(() => {
    return AppStorage.get(AppStorage.KEYS.SLIDES_DATA, DEFAULT_SLIDES);
  });
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [isSlideShow, setIsSlideShow] = useState(false);

  const currentSlide = slides[activeSlideIdx] || slides[0];

  const updateSlide = (key: keyof Slide, val: string) => {
    const updated = slides.map((s, i) => i === activeSlideIdx ? { ...s, [key]: val } : s);
    setSlides(updated);
    AppStorage.set(AppStorage.KEYS.SLIDES_DATA, updated);
  };

  const addSlide = () => {
    const newSlide: Slide = {
      id: `s_${Date.now()}`,
      title: 'شريحة جديدة',
      subtitle: 'انقر لتعديل العنوان الفرعي',
      content: 'أدخل محتوى ونقاط الشريحة هنا...',
      bg: '#ffffff'
    };
    const updated = [...slides, newSlide];
    setSlides(updated);
    setActiveSlideIdx(updated.length - 1);
    AppStorage.set(AppStorage.KEYS.SLIDES_DATA, updated);
  };

  const deleteSlide = (idx: number) => {
    if (slides.length <= 1) return;
    const updated = slides.filter((_, i) => i !== idx);
    setSlides(updated);
    setActiveSlideIdx(Math.max(0, idx - 1));
    AppStorage.set(AppStorage.KEYS.SLIDES_DATA, updated);
  };

  if (isSlideShow) {
    return (
      <div
        className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-12 text-white select-none cursor-pointer"
        onClick={() => {
          if (activeSlideIdx < slides.length - 1) {
            setActiveSlideIdx(activeSlideIdx + 1);
          } else {
            setIsSlideShow(false);
          }
        }}
      >
        <div className="absolute top-4 right-4 bg-black/60 px-3 py-1 rounded text-xs text-white/70">
          اضغط للمتابعة أو Escape للخروج (شريحة {activeSlideIdx + 1} من {slides.length})
        </div>
        <div className="max-w-4xl text-center space-y-6">
          <h1 className="text-5xl font-black">{currentSlide.title}</h1>
          {currentSlide.subtitle && <p className="text-2xl text-blue-300">{currentSlide.subtitle}</p>}
          <div className="text-xl whitespace-pre-line text-gray-200 mt-8 text-right max-w-2xl mx-auto leading-relaxed">
            {currentSlide.content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#e5e7eb] select-none">
      {/* PowerPoint Ribbon */}
      <div className="bg-[#f3f2f1] border-b border-gray-300 p-2 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={addSlide}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#d83b01] hover:bg-[#b03000] text-white font-bold rounded cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>شريحة جديدة</span>
          </button>

          <button
            onClick={() => setIsSlideShow(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded cursor-pointer border border-gray-300"
          >
            <Play className="w-4 h-4 text-emerald-600" />
            <span>بدء عرض الشرائح (F5)</span>
          </button>
        </div>

        <div className="text-xs text-gray-500 font-bold">
          PowerPoint Sovereign Edition
        </div>
      </div>

      {/* Main Workspace: Slide thumbnails + Stage */}
      <div className="flex-1 flex overflow-hidden">
        {/* Thumbnails Sidebar */}
        <div className="w-48 bg-gray-200 border-l border-gray-300 overflow-y-auto p-3 space-y-3 shrink-0">
          {slides.map((s, idx) => (
            <div
              key={s.id}
              onClick={() => setActiveSlideIdx(idx)}
              className={`p-2 rounded border-2 cursor-pointer transition relative group bg-white shadow-xs ${
                activeSlideIdx === idx ? 'border-[#d83b01] ring-1 ring-[#d83b01]' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="text-[10px] text-gray-400 font-mono mb-1 flex justify-between">
                <span>{idx + 1}</span>
                {slides.length > 1 && (
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      deleteSlide(idx);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div className="h-16 bg-slate-100 rounded p-1.5 text-[9px] overflow-hidden">
                <div className="font-bold truncate text-slate-800">{s.title}</div>
                <div className="text-slate-400 text-[8px] truncate">{s.subtitle}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Center Stage: Active Slide Canvas */}
        <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
          <div className="w-[800px] h-[450px] bg-white rounded-lg shadow-2xl p-10 flex flex-col justify-between border border-gray-300 relative">
            <div className="space-y-3">
              <input
                type="text"
                value={currentSlide.title}
                onChange={e => updateSlide('title', e.target.value)}
                className="w-full text-3xl font-black text-gray-900 border-b border-transparent hover:border-gray-300 focus:border-[#d83b01] outline-none pb-1 transition"
                placeholder="عنوان الشريحة..."
              />
              <input
                type="text"
                value={currentSlide.subtitle || ''}
                onChange={e => updateSlide('subtitle', e.target.value)}
                className="w-full text-lg font-bold text-gray-500 border-b border-transparent hover:border-gray-300 focus:border-[#d83b01] outline-none pb-1 transition"
                placeholder="العنوان الفرعي..."
              />
            </div>

            <textarea
              value={currentSlide.content}
              onChange={e => updateSlide('content', e.target.value)}
              rows={6}
              className="w-full text-base text-gray-700 border border-transparent hover:border-gray-300 focus:border-[#d83b01] rounded p-2 outline-none resize-none leading-relaxed"
              placeholder="اكتب نقاط ومحتوى الشريحة..."
            />

            <div className="flex justify-between items-center text-[11px] text-gray-400 border-t border-gray-100 pt-2">
              <span>MY-DOC Presentation</span>
              <span>شريحة {activeSlideIdx + 1} من {slides.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
