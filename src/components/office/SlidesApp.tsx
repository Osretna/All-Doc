import React, { useState, useEffect, useRef } from 'react';
import { SlideItem } from '../../types';
import { localVault } from '../../utils/storage';
import {
  Plus,
  Trash2,
  Copy,
  Play,
  Maximize2,
  ChevronRight,
  ChevronLeft,
  X,
  Palette,
  Sparkles,
  Presentation,
  ShieldCheck,
  Building2,
  Server,
  PenTool,
  RotateCcw,
  Shapes,
  Layout,
  Layers,
  Circle,
  Square,
  ArrowRight,
  Star,
  FileUp
} from 'lucide-react';
import { parsePptxFile } from '../../utils/fileImport';

interface Props {
  fontFamily: string;
  zoomLevel: number;
  initialSlides?: SlideItem[];
  onSlidesChange?: (slides: SlideItem[]) => void;
}

const INITIAL_SLIDES: SlideItem[] = [
  {
    id: 's1',
    title: 'شركة إنفينيتي تكنولوجي',
    subtitle: 'الاستضافة السحابية الفائقة وجناح الأوفيس السيادي المكتبي',
    body: [
      'سيرفرات سحابية Shared & VPS بنظام ملفات ZFS وأقراص NVMe فائقة السرعة',
      'جناح أوفيس متكامل يعمل 100% بدون إنترنت وبدون تتبع أو تسجيل حسابات',
      'نظام "ملاك" لإدارة اتحادات الشاغلين والمجمعات العقارية الحديثة',
    ],
    layout: 'title',
    notes: 'مقدمة العرض: التأكيد على مفهوم السيادة الرقمية وعدم ارتباط العميل بأي طرف ثالث.',
    theme: 'blue',
    transition: 'fade',
  },
  {
    id: 's2',
    title: 'لماذا يحتاج العالم إلى "الأوفيس السيادي"؟',
    subtitle: 'تحرر كامل من اشتراكات الشركات الاحتكارية وحماية البيانات',
    body: [
      'حماية البيانات: لا تغادر ملفاتك جهازك أبداً ولا تخضع للمسح أو التدريب للذكاء الاصطناعي.',
      'تشغيل دائم أوفلاين: جاهز للعمل أثناء انقطاع الإنترنت أو أثناء السفر.',
      'توافق كامل مع ملفات Microsoft Office (.docx / .xlsx / .pptx).',
      'قابل للتنصيب المباشر (PWA) على أجهزة الكمبيوتر (Windows/Mac) والهواتف الذكية.',
    ],
    layout: 'content',
    notes: 'تسليط الضوء على الأمان السيادي لشركات المحاماة، المحاسبة، والجهات الحكومية.',
    theme: 'emerald',
    transition: 'push',
  },
  {
    id: 's3',
    title: 'نظام "ملاك" للاتحادات العقارية',
    subtitle: 'إدارة ذكية ومؤتمتة للأبراج والمجمعات السكنية',
    body: [
      'سجل شامل للوحدات والملاك ومستحقات الصيانة الدورية.',
      'تقارير مالية وجداول مصروفات معتمدة متوافقة مع جداول Infinity Sheets.',
      'إصدار محاضر اجتماعات الجمعيات العمومية وسندات الصرف بضغطة زر.',
    ],
    layout: 'split',
    notes: 'شرح كيف يرتبط نظام ملاك بجناح الأوفيس والاستضافة السحابية لإنفينيتي.',
    theme: 'amber',
    transition: 'wipe',
  },
  {
    id: 's4',
    title: 'مقارنة الحلول السيادية بالحلول السحابية العامة',
    subtitle: 'تحليل تكلفة الملكية الإجمالية وحماية الخصوصية',
    body: [
      'حلول عامة: تكاليف اشتراكات شهرية باهظة + خضوع لشروط خصوصية أجنبية.',
      'حلول إنفينيتي السيادية: امتلاك كامل للبنية التحتية، zero telemetry، وسرعة استجابة فائقة.',
    ],
    layout: 'comparison',
    notes: 'مقارنة فنية ومالية تساعد متخذ القرار على الاستثمار في البنية السيادية.',
    theme: 'dark',
    transition: 'zoom',
  },
];

export const SlidesApp: React.FC<Props> = ({ 
  fontFamily, 
  zoomLevel,
  initialSlides,
  onSlidesChange
}) => {
  const [slides, setSlides] = useState<SlideItem[]>(() => {
    return initialSlides || localVault.get<SlideItem[]>(localVault.KEYS.SLIDES_DATA, INITIAL_SLIDES);
  });

  // Sync when initialSlides changes externally (e.g. from Backstage file open)
  useEffect(() => {
    if (initialSlides && initialSlides.length > 0) {
      setSlides(initialSlides);
      setCurrentSlideIndex(0);
    }
  }, [initialSlides]);

  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isPresenterMode, setIsPresenterMode] = useState<boolean>(false);
  const [presentationTime, setPresentationTime] = useState<number>(0);
  const [laserPointer, setLaserPointer] = useState<{ x: number; y: number } | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [showLayoutMenu, setShowLayoutMenu] = useState<boolean>(false);

  const presenterCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleOpenPptx = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const parsed = await parsePptxFile(file);
      if (parsed.length > 0) {
        setSlides(parsed);
        setCurrentSlideIndex(0);
        localVault.set(localVault.KEYS.SLIDES_DATA, parsed);
        onSlidesChange?.(parsed);
        alert(`تم فتح عرض PowerPoint "${file.name}" بنجاح مع الصور والتنسيقات الأصلية!`);
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء فتح ملف PowerPoint.');
    }
  };

  useEffect(() => {
    localVault.set(localVault.KEYS.SLIDES_DATA, slides);
    onSlidesChange?.(slides);
  }, [slides]);

  // Timer in presenter mode
  useEffect(() => {
    let timer: any;
    if (isPresenterMode) {
      timer = setInterval(() => setPresentationTime((t) => t + 1), 1000);
    } else {
      setPresentationTime(0);
      setLaserPointer(null);
    }
    return () => clearInterval(timer);
  }, [isPresenterMode]);

  const currentSlide = slides[currentSlideIndex] || slides[0];

  const handleUpdateCurrentSlide = (field: keyof SlideItem, val: any) => {
    setSlides((prev) => {
      const copy = [...prev];
      copy[currentSlideIndex] = {
        ...copy[currentSlideIndex],
        [field]: val,
      };
      return copy;
    });
  };

  const handleAddSlide = (layout: SlideItem['layout'] = 'content') => {
    const newSlide: SlideItem = {
      id: `s_${Date.now()}`,
      title: 'عنوان الشريحة الجديد',
      subtitle: 'وصف مختصر أو فكرة رئيسية',
      body: ['النقطة الأولى في العرض التوضيحي', 'النقطة الثانية مع شرح إضافي', 'النقطة الثالثة والتوصيات'],
      layout,
      notes: 'ملاحظات مقدم العرض التقديمي...',
      theme: 'blue',
      transition: 'fade',
    };
    const nextList = [...slides, newSlide];
    setSlides(nextList);
    setCurrentSlideIndex(nextList.length - 1);
    setShowLayoutMenu(false);
  };

  const handleDuplicateSlide = (idx: number) => {
    const original = slides[idx];
    const copy: SlideItem = {
      ...original,
      id: `s_${Date.now()}`,
      title: `${original.title} (نسخة)`,
    };
    const nextList = [...slides.slice(0, idx + 1), copy, ...slides.slice(idx + 1)];
    setSlides(nextList);
    setCurrentSlideIndex(idx + 1);
  };

  const handleDeleteSlide = (idx: number) => {
    if (slides.length <= 1) return;
    const nextList = slides.filter((_, i) => i !== idx);
    setSlides(nextList);
    setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1));
  };

  const getThemeStyles = (theme: SlideItem['theme']) => {
    switch (theme) {
      case 'emerald':
        return {
          bg: 'bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950',
          titleColor: 'text-emerald-400',
          cardBg: 'bg-white/10 backdrop-blur-md',
        };
      case 'amber':
        return {
          bg: 'bg-gradient-to-br from-amber-950 via-stone-900 to-black',
          titleColor: 'text-amber-400',
          cardBg: 'bg-white/10 backdrop-blur-md',
        };
      case 'dark':
        return {
          bg: 'bg-gradient-to-br from-slate-950 via-zinc-900 to-black',
          titleColor: 'text-cyan-400',
          cardBg: 'bg-white/5 backdrop-blur-md',
        };
      case 'purple':
        return {
          bg: 'bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-950',
          titleColor: 'text-purple-300',
          cardBg: 'bg-white/10 backdrop-blur-md',
        };
      case 'crimson':
        return {
          bg: 'bg-gradient-to-br from-rose-950 via-red-950 to-slate-950',
          titleColor: 'text-rose-400',
          cardBg: 'bg-white/10 backdrop-blur-md',
        };
      case 'blue':
      default:
        return {
          bg: 'bg-gradient-to-br from-[#003366] via-[#0f2444] to-[#0a1128]',
          titleColor: 'text-sky-400',
          cardBg: 'bg-white/10 backdrop-blur-md',
        };
    }
  };

  const activeTheme = getThemeStyles(currentSlide.theme);

  // Presenter laser pointer mouse move
  const handlePresenterMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setLaserPointer({ x: e.clientX, y: e.clientY });
  };

  return (
    <div className="flex-1 flex bg-[#ece9e6] overflow-hidden select-none">
      {/* 1. Left Thumbnail Deck (PowerPoint Slide Navigator) */}
      <div className="w-56 sm:w-64 bg-[#f3f2f1] border-l border-gray-300 flex flex-col p-3 overflow-y-auto shrink-0 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-gray-300">
          <span className="text-xs font-bold text-gray-700">الشرائح ({slides.length})</span>
          
          <div className="relative">
            <button
              onClick={() => setShowLayoutMenu(!showLayoutMenu)}
              className="flex items-center gap-1 bg-[#d83b01] text-white px-2 py-1 rounded text-xs font-semibold hover:bg-[#b33000] transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>شريحة جديدة</span>
            </button>

            {showLayoutMenu && (
              <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-xl p-2 z-50 w-48 text-right space-y-1">
                <div className="text-[10px] font-bold text-gray-400 mb-1">اختر تخطيط الشريحة:</div>
                <button
                  onClick={() => handleAddSlide('title')}
                  className="w-full text-right p-1.5 rounded hover:bg-orange-50 text-xs font-medium"
                >
                  شريحة عنوان (Title Slide)
                </button>
                <button
                  onClick={() => handleAddSlide('content')}
                  className="w-full text-right p-1.5 rounded hover:bg-orange-50 text-xs font-medium"
                >
                  عنوان ومحتوى (Content)
                </button>
                <button
                  onClick={() => handleAddSlide('comparison')}
                  className="w-full text-right p-1.5 rounded hover:bg-orange-50 text-xs font-medium"
                >
                  مقارنة عمودين (Comparison)
                </button>
                <button
                  onClick={() => handleAddSlide('split')}
                  className="w-full text-right p-1.5 rounded hover:bg-orange-50 text-xs font-medium"
                >
                  شريحة تقرير ونظام ملاك
                </button>
              </div>
            )}
          </div>
        </div>

        {slides.map((s, idx) => {
          const isSelected = idx === currentSlideIndex;
          const thumbTheme = getThemeStyles(s.theme);

          return (
            <div
              key={s.id}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`p-2 rounded-lg border-2 cursor-pointer transition relative group ${
                isSelected ? 'border-[#d83b01] shadow-md bg-white' : 'border-gray-200 hover:border-gray-300 bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1">
                <span className="font-bold">شريحة {idx + 1}</span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDuplicateSlide(idx);
                    }}
                    className="p-0.5 hover:text-blue-600"
                    title="تكرار الشريحة"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                  {slides.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSlide(idx);
                      }}
                      className="p-0.5 hover:text-red-600"
                      title="حذف الشريحة"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Mini Slide Preview with Wallpaper Support */}
              <div 
                className={`aspect-video rounded p-2 text-[9px] text-white overflow-hidden shadow-inner relative flex items-center justify-center text-center ${thumbTheme.bg}`}
                style={{
                  backgroundImage: s.backgroundImage ? `url(${s.backgroundImage})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {s.backgroundImage && s.hasCardFrame ? (
                  <div className="bg-white/95 border border-black px-2 py-1 text-[8.5px] text-black font-serif font-black uppercase truncate max-w-[85%] shadow-xs">
                    {s.title}
                  </div>
                ) : (
                  <div>
                    <div className="font-bold truncate text-sky-200">{s.title}</div>
                    <div className="text-[7.5px] opacity-70 truncate">{s.subtitle}</div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Start Presentation Button in Sidebar */}
        <div className="pt-2">
          <button
            onClick={() => setIsPresenterMode(true)}
            className="w-full bg-[#d83b01] hover:bg-[#b33000] text-white font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow transition cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>بدء العرض التقديمي (F5)</span>
          </button>
        </div>
      </div>

      {/* 2. Main Slide Editor Workspace */}
      <div className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-8 items-center justify-start">
        {/* Slide Controls Bar */}
        <div className="w-full max-w-4xl flex items-center justify-between mb-3 text-xs bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-bold">السمة:</span>
            {(['blue', 'emerald', 'amber', 'dark', 'purple', 'crimson'] as SlideItem['theme'][]).map((t) => (
              <button
                key={t}
                onClick={() => handleUpdateCurrentSlide('theme', t)}
                className={`w-5 h-5 rounded-full border-2 transition cursor-pointer ${
                  currentSlide.theme === t ? 'border-gray-900 scale-110 shadow-xs' : 'border-transparent'
                }`}
                style={{
                  backgroundColor:
                    t === 'blue'
                      ? '#0078d4'
                      : t === 'emerald'
                      ? '#107c41'
                      : t === 'amber'
                      ? '#d97706'
                      : t === 'purple'
                      ? '#7719aa'
                      : t === 'crimson'
                      ? '#be123c'
                      : '#1e293b',
                }}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 px-3 py-1 bg-white border border-orange-300 hover:bg-orange-50 text-orange-900 rounded text-xs font-bold cursor-pointer transition shadow-2xs">
              <FileUp className="w-3.5 h-3.5 text-orange-600" />
              <span>فتح عرض PowerPoint (.pptx)</span>
              <input
                type="file"
                accept=".pptx"
                onChange={handleOpenPptx}
                className="hidden"
              />
            </label>

            <span className="text-gray-500">الانتقال:</span>
            <select
              value={currentSlide.transition || 'fade'}
              onChange={(e) => handleUpdateCurrentSlide('transition', e.target.value)}
              className="bg-gray-50 border border-gray-300 rounded px-2 py-0.5 text-xs outline-none"
            >
              <option value="fade">تضاؤل (Fade)</option>
              <option value="push">دفع (Push)</option>
              <option value="wipe">مسح (Wipe)</option>
              <option value="zoom">تكبير (Zoom)</option>
            </select>

            <button
              onClick={() => setIsPresenterMode(true)}
              className="bg-[#d83b01] text-white px-3 py-1 rounded text-xs font-bold hover:bg-[#b33000] flex items-center gap-1.5 transition cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>ملء الشاشة</span>
            </button>
          </div>
        </div>

        {/* 16:9 Widescreen Active Slide Canvas with Wallpaper & Card Layout Support */}
        <div
          className={`w-full max-w-4xl aspect-video rounded-xl shadow-2xl p-8 sm:p-12 text-right relative flex flex-col justify-between overflow-hidden transition-all duration-300 ${
            currentSlide.backgroundImage ? '' : activeTheme.bg
          }`}
          style={{
            fontFamily: currentSlide.fontFamily || fontFamily,
            backgroundImage: currentSlide.backgroundImage ? `url(${currentSlide.backgroundImage})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: currentSlide.backgroundColor || undefined,
          }}
        >
          {/* Subtle Ambient Decorative Circles (only when no custom background) */}
          {!currentSlide.backgroundImage && (
            <>
              <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
            </>
          )}

          {/* Slide Top Branding */}
          <div className={`flex items-center justify-between text-xs select-none pb-4 ${
            currentSlide.backgroundImage ? 'text-gray-800' : 'text-white/60 border-b border-white/10'
          }`}>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className={`font-bold tracking-wider ${currentSlide.backgroundImage ? 'text-gray-900 bg-white/80 px-2 py-0.5 rounded shadow-2xs' : 'text-white'}`}>
                INFINITY SOVEREIGN TECH
              </span>
            </div>
            <span className={`font-mono ${currentSlide.backgroundImage ? 'text-gray-900 bg-white/80 px-2 py-0.5 rounded shadow-2xs' : 'text-white/50'}`}>
              الشريحة {currentSlideIndex + 1} / {slides.length}
            </span>
          </div>

          {/* Slide Content: Check if centered framed card layout (e.g. from PPTX template) */}
          {currentSlide.hasCardFrame ? (
            <div
              className="my-auto mx-auto max-w-lg w-full p-8 sm:p-10 text-center rounded-xs shadow-2xl relative"
              style={{
                backgroundColor: currentSlide.cardBg || '#ffffff',
                border: currentSlide.cardBorder || '2px solid #111827',
                fontFamily: currentSlide.fontFamily || "'Times New Roman', Georgia, serif",
              }}
            >
              <input
                type="text"
                value={currentSlide.title}
                onChange={(e) => handleUpdateCurrentSlide('title', e.target.value)}
                className="w-full bg-transparent font-serif font-black text-2xl sm:text-4xl text-center text-gray-900 outline-none uppercase tracking-wider mb-2"
                placeholder="TITLE LOREM IPSUM"
              />
              <input
                type="text"
                value={currentSlide.subtitle}
                onChange={(e) => handleUpdateCurrentSlide('subtitle', e.target.value)}
                className="w-full bg-transparent text-sm sm:text-base text-center text-gray-700 outline-none font-normal"
                placeholder="Sit Dolor Amet"
              />
              {currentSlide.body && currentSlide.body.length > 0 && currentSlide.body[0] !== 'نقطة مستوردة من العرض التقديمي' && (
                <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-600 space-y-1">
                  {currentSlide.body.map((b, i) => (
                    <div key={i}>{b}</div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="my-auto space-y-4">
              <input
                type="text"
                value={currentSlide.title}
                onChange={(e) => handleUpdateCurrentSlide('title', e.target.value)}
                className={`w-full bg-transparent border-b border-transparent hover:border-white/20 focus:border-white/50 font-black text-2xl sm:text-4xl outline-none transition text-right ${activeTheme.titleColor}`}
                placeholder="اكتب عنوان الشريحة الرئيسي..."
              />

              <input
                type="text"
                value={currentSlide.subtitle}
                onChange={(e) => handleUpdateCurrentSlide('subtitle', e.target.value)}
                className="w-full bg-transparent border-b border-transparent hover:border-white/20 focus:border-white/50 text-white/80 text-sm sm:text-lg font-medium outline-none transition text-right"
                placeholder="اكتب العنوان الفرعي أو الفكرة..."
              />

              {currentSlide.layout === 'comparison' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
                  <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 space-y-2">
                    <h4 className="font-bold text-sky-300 text-sm">البدائل الاحتكارية العامة:</h4>
                    <p className="text-white/80 text-xs leading-relaxed">{currentSlide.body[0]}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 space-y-2">
                    <h4 className="font-bold text-emerald-300 text-sm">جناح إنفينيتي السيادي 100%:</h4>
                    <p className="text-white/90 text-xs leading-relaxed">{currentSlide.body[1]}</p>
                  </div>
                </div>
              ) : (
                <div className="pt-4 space-y-2.5">
                  {currentSlide.body.map((item, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-3 group">
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-400 mt-2 shrink-0 group-hover:scale-125 transition" />
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const newBody = [...currentSlide.body];
                          newBody[bIdx] = e.target.value;
                          handleUpdateCurrentSlide('body', newBody);
                        }}
                        className="w-full bg-transparent border-b border-transparent hover:border-white/20 focus:border-white/40 text-white/90 text-sm sm:text-base outline-none transition"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Slide Footer */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-white/40 select-none">
            <span>Infinity Sovereign Office Suite 2026</span>
            <span>محفوظ ومحمي محلياً 100%</span>
          </div>
        </div>

        {/* Presenter Notes Bar at Bottom */}
        <div className="w-full max-w-4xl mt-4 bg-white p-4 rounded-xl border border-gray-200 shadow-xs text-right">
          <label className="block text-xs font-bold text-gray-700 mb-1">
            ملاحظات مقدم العرض (Presenter Notes - تظهر فقط لك في وضع العرض):
          </label>
          <textarea
            value={currentSlide.notes}
            onChange={(e) => handleUpdateCurrentSlide('notes', e.target.value)}
            rows={2}
            className="w-full bg-gray-50 border border-gray-300 rounded p-2 text-xs text-gray-800 outline-none focus:border-[#d83b01]"
            placeholder="اكتب الملاحظات والنقاط التي تريد تذكرها أثناء الشرح..."
          />
        </div>
      </div>

      {/* 3. FULLSCREEN PRESENTER MODE WITH VIRTUAL LASER POINTER */}
      {isPresenterMode && (
        <div 
          onMouseMove={handlePresenterMouseMove}
          className="fixed inset-0 z-[200] bg-black text-white flex flex-col justify-between p-6 sm:p-10 animate-in fade-in select-none cursor-crosshair overflow-hidden"
        >
          {/* Virtual Laser Pointer dot */}
          {laserPointer && (
            <div
              className="pointer-events-none fixed w-4 h-4 rounded-full bg-red-500 shadow-[0_0_12px_4px_rgba(239,68,68,0.8)] z-[250] -translate-x-1/2 -translate-y-1/2"
              style={{ left: laserPointer.x, top: laserPointer.y }}
            />
          )}

          {/* Top Bar with Timer and Close */}
          <div className="flex items-center justify-between border-b border-white/20 pb-4">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
              <span className="font-mono text-sm">
                وقت العرض: {Math.floor(presentationTime / 60)}:{('0' + (presentationTime % 60)).slice(-2)}
              </span>
            </div>

            <div className="text-sm font-bold text-gray-300">
              الشريحة {currentSlideIndex + 1} من {slides.length}
            </div>

            <button
              onClick={() => setIsPresenterMode(false)}
              className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white transition flex items-center gap-1.5 text-xs cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>إنهاء العرض (Esc)</span>
            </button>
          </div>

          {/* Active Big Slide Canvas */}
          <div 
            className="my-auto max-w-5xl mx-auto w-full aspect-video rounded-2xl shadow-2xl p-10 sm:p-16 flex flex-col justify-between border border-white/20 relative overflow-hidden"
            style={{ 
              fontFamily: currentSlide.fontFamily || fontFamily,
              backgroundImage: currentSlide.backgroundImage ? `url(${currentSlide.backgroundImage})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: currentSlide.backgroundImage ? undefined : (activeTheme.bg.includes('gradient') ? undefined : '#003366'),
            }}
          >
            {currentSlide.hasCardFrame ? (
              <div 
                className="my-auto mx-auto max-w-xl w-full p-10 sm:p-14 text-center rounded-xs shadow-2xl relative"
                style={{
                  backgroundColor: currentSlide.cardBg || '#ffffff',
                  border: currentSlide.cardBorder || '2.5px solid #111827',
                  fontFamily: currentSlide.fontFamily || "'Times New Roman', Georgia, serif"
                }}
              >
                <h1 className="font-serif font-black text-3xl sm:text-5xl text-center text-gray-950 uppercase tracking-widest mb-3">
                  {currentSlide.title}
                </h1>
                <h3 className="text-base sm:text-xl text-center text-gray-800 font-normal">
                  {currentSlide.subtitle}
                </h3>
                {currentSlide.body && currentSlide.body.length > 0 && currentSlide.body[0] !== 'نقطة مستوردة من العرض التقديمي' && (
                  <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-700 space-y-2">
                    {currentSlide.body.map((b, i) => (
                      <div key={i}>{b}</div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-right my-auto">
                <h1 className={`text-3xl sm:text-5xl font-black mb-3 ${activeTheme.titleColor}`}>
                  {currentSlide.title}
                </h1>
                <h3 className="text-xl sm:text-2xl text-white/80 font-medium mb-8">
                  {currentSlide.subtitle}
                </h3>

                <div className="space-y-4">
                  {currentSlide.body.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 text-lg sm:text-2xl text-white/95">
                      <span className="w-3 h-3 rounded-full bg-sky-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={`flex items-center justify-between text-xs pt-6 border-t ${currentSlide.backgroundImage ? 'border-black/20 text-gray-900 bg-white/70 px-3 py-1 rounded' : 'border-white/10 text-white/40'}`}>
              <span>Infinity Sovereign Office Presenter</span>
              <span>مؤشر الليزر الافتراضي نشط بالماوس (F5)</span>
            </div>
          </div>

          {/* Bottom Presenter Controls */}
          <div className="flex items-center justify-between border-t border-white/20 pt-4">
            <button
              onClick={() => setCurrentSlideIndex((i) => Math.min(slides.length - 1, i + 1))}
              disabled={currentSlideIndex >= slides.length - 1}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/15 hover:bg-white/25 disabled:opacity-30 rounded-lg text-sm font-bold transition cursor-pointer"
            >
              <span>الشريحة التالية ➔</span>
            </button>

            <div className="text-center text-xs text-white/60">
              {currentSlide.notes && (
                <div className="bg-white/10 px-4 py-2 rounded-lg max-w-lg">
                  <span className="font-bold text-amber-300">ملاحظة للمقدم: </span>
                  <span>{currentSlide.notes}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setCurrentSlideIndex((i) => Math.max(0, i - 1))}
              disabled={currentSlideIndex <= 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/15 hover:bg-white/25 disabled:opacity-30 rounded-lg text-sm font-bold transition cursor-pointer"
            >
              <span>⬅ الشريحة السابقة</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
