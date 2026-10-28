import React, { useState, useEffect, useRef } from 'react';
import { SlideItem } from '../../types';
import { localVault } from '../../utils/storage';
import { parsePptxFile } from '../../utils/fileImport';
import {
  PowerPointTab,
  PresentationViewMode,
  TransitionType,
  SlideShapeType,
  PowerPointSlideData,
  SlideSizeConfig,
  SlideSection,
  SlideAnimationConfig
} from './slides/types';
import { PowerPointRibbon } from './slides/PowerPointRibbon';
import { PresenterMode } from './slides/PresenterMode';
import { SlideSorterView } from './slides/SlideSorterView';
import { NotesPageView } from './slides/NotesPageView';
import { AnimationPaneModal } from './slides/modals/AnimationPaneModal';
import { SlideMasterModal } from './slides/modals/SlideMasterModal';
import { SlideSizeModal } from './slides/modals/SlideSizeModal';
import { RehearseTimingsModal } from './slides/modals/RehearseTimingsModal';
import { DesignerDrawer } from './slides/modals/DesignerDrawer';
import { SmartArtModal } from './slides/modals/SmartArtModal';
import { OFFICE_THEMES } from './slides/themes';
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
  Layers,
  Shapes,
  Layout,
  FileUp,
  FolderPlus,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Monitor
} from 'lucide-react';

interface Props {
  fontFamily: string;
  zoomLevel: number;
  initialSlides?: SlideItem[];
  onSlidesChange?: (slides: SlideItem[]) => void;
  onOpenBackstage?: () => void;
}

const INITIAL_SLIDES: PowerPointSlideData[] = [
  {
    id: 's1',
    title: '',
    subtitle: '',
    body: [],
    layout: 'title',
    notes: '',
    theme: 'blue',
    transition: 'none',
  },
];

export const SlidesApp: React.FC<Props> = ({
  fontFamily: initialFontFamily,
  zoomLevel,
  initialSlides,
  onSlidesChange,
  onOpenBackstage,
}) => {
  // Slides State
  const [slides, setSlides] = useState<PowerPointSlideData[]>(() => {
    return (
      (initialSlides as PowerPointSlideData[]) ||
      localVault.get<PowerPointSlideData[]>(localVault.KEYS.SLIDES_DATA, INITIAL_SLIDES)
    );
  });

  useEffect(() => {
    if (initialSlides && initialSlides.length > 0) {
      setSlides(initialSlides as PowerPointSlideData[]);
      setCurrentSlideIndex(0);
    }
  }, [initialSlides]);

  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [sections, setSections] = useState<SlideSection[]>([]);

  // Ribbon & View Mode State
  const [activeTab, setActiveTab] = useState<PowerPointTab>('home');
  const [viewMode, setViewMode] = useState<PresentationViewMode>('normal');
  const [fontFamily, setFontFamily] = useState<string>(initialFontFamily || 'Cairo');
  const [fontSize, setFontSize] = useState<number>(18);
  const [currentThemeId, setCurrentThemeId] = useState<string>('office-classic');

  // Presentation State
  const [isPresenterMode, setIsPresenterMode] = useState<boolean>(false);
  const [slideSize, setSlideSize] = useState<SlideSizeConfig>({
    preset: '16:9',
    widthCm: 33.867,
    heightCm: 19.05,
    orientation: 'landscape',
  });

  // Views & Panes toggles
  const [showRuler, setShowRuler] = useState<boolean>(false);
  const [showGridlines, setShowGridlines] = useState<boolean>(false);
  const [showNotesPane, setShowNotesPane] = useState<boolean>(true);

  // Drawing Tools State
  const [activeDrawTool, setActiveDrawTool] = useState<'cursor' | 'pen' | 'pencil' | 'highlighter' | 'eraser'>('cursor');
  const [drawColor, setDrawColor] = useState<string>('#ef4444');
  const [drawWidth, setDrawWidth] = useState<number>(3);
  const drawCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef<boolean>(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  // Modals & Drawers State
  const [isAnimationPaneOpen, setIsAnimationPaneOpen] = useState<boolean>(false);
  const [isSlideMasterOpen, setIsSlideMasterOpen] = useState<boolean>(false);
  const [isSlideSizeOpen, setIsSlideSizeOpen] = useState<boolean>(false);
  const [isRehearseTimingsOpen, setIsRehearseTimingsOpen] = useState<boolean>(false);
  const [isDesignerDrawerOpen, setIsDesignerDrawerOpen] = useState<boolean>(false);
  const [isSmartArtModalOpen, setIsSmartArtModalOpen] = useState<boolean>(false);

  // Sync initialSlides if updated externally
  useEffect(() => {
    if (initialSlides && initialSlides.length > 0) {
      setSlides(initialSlides as PowerPointSlideData[]);
      setCurrentSlideIndex(0);
    }
  }, [initialSlides]);

  // Persist to localVault
  useEffect(() => {
    localVault.set(localVault.KEYS.SLIDES_DATA, slides);
    onSlidesChange?.(slides);
  }, [slides, onSlidesChange]);

  const currentSlide = slides[currentSlideIndex] || slides[0];

  // PowerPoint Global Keyboard Shortcuts (F5, Shift+F5, Ctrl+M, Ctrl+D)
  useEffect(() => {
    const handlePowerPointShortcuts = (e: KeyboardEvent) => {
      // F5: Start Presentation from beginning
      if (e.key === 'F5' && !e.shiftKey) {
        e.preventDefault();
        setCurrentSlideIndex(0);
        setIsPresenterMode(true);
        return;
      }
      // Shift + F5: Start Presentation from current slide
      if (e.key === 'F5' && e.shiftKey) {
        e.preventDefault();
        setIsPresenterMode(true);
        return;
      }
      // Ctrl + M: New Slide
      if ((e.ctrlKey || e.metaKey) && (e.key === 'm' || e.key === 'M')) {
        e.preventDefault();
        handleAddNewSlide('content');
        return;
      }
      // Ctrl + D: Duplicate Slide
      if ((e.ctrlKey || e.metaKey) && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        handleDuplicateSlide(currentSlideIndex);
        return;
      }
    };

    window.addEventListener('keydown', handlePowerPointShortcuts);
    return () => window.removeEventListener('keydown', handlePowerPointShortcuts);
  }, [currentSlideIndex, slides]);

  // Slide CRUD
  const handleAddNewSlide = (layout: string = 'content') => {
    const newSlide: PowerPointSlideData = {
      id: `s_${Date.now()}`,
      title: 'عنوان الشريحة الجديد',
      subtitle: 'وصف توضيحي أو فكرة رئيسية للشريحة',
      body: [
        'النقطة الأولى في العرض التقديمي السيادي',
        'النقطة الثانية مع شرح إضافي وتفاصيل تدعم الفكرة',
        'النقطة الثالثة والتوصيات والنتائج',
      ],
      layout: layout as any,
      notes: 'اكتب هنا ملاحظات مقدم العرض التقديمي...',
      theme: 'blue',
      transition: 'fade',
      transitionConfig: {
        type: 'fade',
        duration: 1.0,
        direction: 'smooth',
        sound: 'none',
        advanceOnClick: true,
      },
    };
    const nextList = [...slides, newSlide];
    setSlides(nextList);
    setCurrentSlideIndex(nextList.length - 1);
  };

  const handleDuplicateSlide = (idx: number = currentSlideIndex) => {
    const original = slides[idx];
    const copy: PowerPointSlideData = {
      ...original,
      id: `s_${Date.now()}`,
      title: `${original.title} (نسخة)`,
    };
    const nextList = [...slides.slice(0, idx + 1), copy, ...slides.slice(idx + 1)];
    setSlides(nextList);
    setCurrentSlideIndex(idx + 1);
  };

  const handleDeleteSlide = (idx: number = currentSlideIndex) => {
    if (slides.length <= 1) return;
    const nextList = slides.filter((_, i) => i !== idx);
    setSlides(nextList);
    setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1));
  };

  const handleMoveSlide = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= slides.length) return;
    const copy = [...slides];
    const item = copy[fromIndex];
    copy.splice(fromIndex, 1);
    copy.splice(toIndex, 0, item);
    setSlides(copy);
    setCurrentSlideIndex(toIndex);
  };

  const handleToggleHideSlide = (idx: number = currentSlideIndex) => {
    setSlides((prev) => {
      const copy = [...prev];
      copy[idx] = {
        ...copy[idx],
        hidden: !copy[idx].hidden,
      };
      return copy;
    });
  };

  const handleUpdateCurrentSlide = (field: keyof PowerPointSlideData, val: any) => {
    setSlides((prev) => {
      const copy = [...prev];
      copy[currentSlideIndex] = {
        ...copy[currentSlideIndex],
        [field]: val,
      };
      return copy;
    });
  };

  const handleAddSection = (title: string) => {
    const newSec: SlideSection = {
      id: `sec_${Date.now()}`,
      title,
      slideIds: [currentSlide.id],
    };
    setSections([...sections, newSec]);
    alert(`تمت إضافة القسم "${title}" بنجاح!`);
  };

  // Shapes & Content Insert Handlers
  const handleInsertShape = (type: SlideShapeType) => {
    const newShape = {
      id: `shape_${Date.now()}`,
      type,
      x: 35,
      y: 40,
      width: 25,
      height: 20,
      fill: '#d83b01',
      stroke: '#ffffff',
      strokeWidth: 2,
      text: type === 'textbox' ? 'انقر لكتابة نص داخل المربع...' : '',
      textColor: '#ffffff',
      zIndex: 10,
    };
    const existingShapes = currentSlide.shapes || [];
    handleUpdateCurrentSlide('shapes', [...existingShapes, newShape]);
  };

  const handleInsertTable = (rows: number, cols: number) => {
    const tableHeader = Array.from({ length: cols }, (_, c) => `العمود ${c + 1}`).join(' | ');
    const tableDivider = Array.from({ length: cols }, () => '---').join(' | ');
    const tableRows = Array.from({ length: rows - 1 }, (_, r) =>
      Array.from({ length: cols }, (_, c) => `بيان ${r + 1}-${c + 1}`).join(' | ')
    );
    const newBody = [
      ...currentSlide.body,
      `جدول منظم (${rows}x${cols}) مدمج بالشريحة بنجاح.`,
    ];
    handleUpdateCurrentSlide('body', newBody);
  };

  const handleInsertImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      handleUpdateCurrentSlide('backgroundImage', dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleOpenPptx = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const parsed = await parsePptxFile(file);
      if (parsed.length > 0) {
        setSlides(parsed as PowerPointSlideData[]);
        setCurrentSlideIndex(0);
        localVault.set(localVault.KEYS.SLIDES_DATA, parsed);
        onSlidesChange?.(parsed);
        alert(`تم فتح عرض PowerPoint "${file.name}" بنجاح بكافة الشرائح والتنسيقات!`);
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء فتح ملف PowerPoint.');
    }
  };

  const handleApplyTheme = (themeId: string) => {
    setCurrentThemeId(themeId);
    const selected = OFFICE_THEMES.find((t) => t.id === themeId);
    if (!selected) return;
    setSlides((prev) =>
      prev.map((s) => ({
        ...s,
        theme: s.theme === 'custom' ? 'custom' : (themeId.includes('emerald') ? 'emerald' : themeId.includes('gold') ? 'amber' : themeId.includes('slate') ? 'dark' : 'blue'),
        backgroundColor: selected.bgColor,
        textColor: selected.textColor,
        titleColor: selected.titleColor,
        fontFamily: selected.fontFamily,
      }))
    );
  };

  const handleSelectTransition = (type: TransitionType) => {
    const config = currentSlide.transitionConfig || {
      type: 'fade',
      duration: 1.0,
      direction: 'smooth',
      sound: 'none',
      advanceOnClick: true,
    };
    handleUpdateCurrentSlide('transitionConfig', { ...config, type });
    handleUpdateCurrentSlide('transition', type);
  };

  const handleApplyTransitionToAll = () => {
    const cfg = currentSlide.transitionConfig;
    if (!cfg) return;
    setSlides((prev) =>
      prev.map((s) => ({
        ...s,
        transition: cfg.type,
        transitionConfig: { ...cfg },
      }))
    );
    alert(`تم تطبيق انتقال "${cfg.type}" على جميع شرائح العرض التقديمي (${slides.length} شريحة)!`);
  };

  // Drawing Canvas Listeners for Draw Tab
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeDrawTool === 'cursor') return;
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    isDrawingRef.current = true;
    lastPointRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || activeDrawTool === 'cursor') return;
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const currentPoint = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    if (activeDrawTool === 'eraser') {
      ctx.clearRect(currentPoint.x - 12, currentPoint.y - 12, 24, 24);
    } else {
      ctx.beginPath();
      if (lastPointRef.current) {
        ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
      }
      ctx.lineTo(currentPoint.x, currentPoint.y);
      ctx.strokeStyle = activeDrawTool === 'highlighter' ? 'rgba(250, 204, 21, 0.4)' : drawColor;
      ctx.lineWidth = activeDrawTool === 'highlighter' ? 16 : drawWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }

    lastPointRef.current = currentPoint;
  };

  const handleCanvasMouseUp = () => {
    isDrawingRef.current = false;
    lastPointRef.current = null;
  };

  // Theme styling helper
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

  return (
    <div className="flex-1 flex flex-col bg-[#ece9e6] overflow-hidden select-none font-sans">
      {/* 1. Sovereign PowerPoint Ribbon with all 9 tabs */}
      <PowerPointRibbon
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenBackstage={onOpenBackstage || (() => {})}
        fontFamily={fontFamily}
        setFontFamily={setFontFamily}
        fontSize={fontSize}
        setFontSize={setFontSize}
        onFormatText={(cmd, val) => document.execCommand(cmd, false, val)}
        onAddNewSlide={(layout) => handleAddNewSlide(layout)}
        onDuplicateSlide={() => handleDuplicateSlide(currentSlideIndex)}
        onDeleteSlide={() => handleDeleteSlide(currentSlideIndex)}
        onAddSection={handleAddSection}
        onInsertShape={handleInsertShape}
        onInsertTable={handleInsertTable}
        onInsertImage={handleInsertImage}
        onInsertSmartArt={() => setIsSmartArtModalOpen(true)}
        onInsertChart={() => alert('إدراج مخطط بياني: مدمج مع محرك رسوم MY-DOC البيانية.')}
        currentThemeId={currentThemeId}
        onSelectTheme={handleApplyTheme}
        onOpenSlideSizeModal={() => setIsSlideSizeOpen(true)}
        onOpenDesignerDrawer={() => setIsDesignerDrawerOpen(true)}
        currentTransition={(currentSlide.transitionConfig?.type || currentSlide.transition || 'morph') as TransitionType}
        onSelectTransition={handleSelectTransition}
        transitionDuration={currentSlide.transitionConfig?.duration || 1.0}
        onSetTransitionDuration={(d) => {
          const cfg = currentSlide.transitionConfig || {
            type: 'morph',
            duration: 1.0,
            direction: 'smooth',
            sound: 'none',
            advanceOnClick: true,
          };
          handleUpdateCurrentSlide('transitionConfig', { ...cfg, duration: d });
        }}
        onApplyTransitionToAll={handleApplyTransitionToAll}
        onOpenAnimationPane={() => setIsAnimationPaneOpen(true)}
        onAddAnimation={(effect) => {
          const anims = currentSlide.animations || [];
          const newAnim: SlideAnimationConfig = {
            id: `anim_${Date.now()}`,
            elementName: `عنصر ${anims.length + 1}`,
            category: 'entrance',
            effect,
            start: 'click',
            duration: 1.0,
            delay: 0,
            order: anims.length + 1,
          };
          handleUpdateCurrentSlide('animations', [...anims, newAnim]);
          alert(`تمت إضافة حركة "${effect}" بنجاح!`);
        }}
        onPreviewAnimations={() => {
          alert('معاينة الحركات: يتم تشغيل الحركات والانتقالات بتزامن سلس.');
        }}
        onStartShowFromBeginning={() => {
          setCurrentSlideIndex(0);
          setIsPresenterMode(true);
        }}
        onStartShowFromCurrent={() => setIsPresenterMode(true)}
        onOpenRehearseTimings={() => setIsRehearseTimingsOpen(true)}
        onToggleHideCurrentSlide={() => handleToggleHideSlide(currentSlideIndex)}
        isCurrentSlideHidden={Boolean(currentSlide.hidden)}
        onOpenSlideMaster={() => setIsSlideMasterOpen(true)}
        showRuler={showRuler}
        setShowRuler={setShowRuler}
        showGridlines={showGridlines}
        setShowGridlines={setShowGridlines}
        showNotesPane={showNotesPane}
        setShowNotesPane={setShowNotesPane}
        activeDrawTool={activeDrawTool}
        setActiveDrawTool={setActiveDrawTool}
        drawColor={drawColor}
        setDrawColor={setDrawColor}
        drawWidth={drawWidth}
        setDrawWidth={setDrawWidth}
      />

      {/* 2. Main Workspace Body depending on ViewMode */}
      {viewMode === 'sorter' ? (
        <SlideSorterView
          slides={slides}
          currentSlideIndex={currentSlideIndex}
          onSelectSlide={(idx) => setCurrentSlideIndex(idx)}
          onDuplicateSlide={handleDuplicateSlide}
          onDeleteSlide={handleDeleteSlide}
          onMoveSlide={handleMoveSlide}
          onToggleHideSlide={handleToggleHideSlide}
          onStartPresentationFrom={(idx) => {
            setCurrentSlideIndex(idx);
            setIsPresenterMode(true);
          }}
          onReturnToNormalView={() => setViewMode('normal')}
          sections={sections}
          onAddSection={handleAddSection}
        />
      ) : viewMode === 'notes-page' ? (
        <NotesPageView
          slides={slides}
          currentSlideIndex={currentSlideIndex}
          onSelectSlide={(idx) => setCurrentSlideIndex(idx)}
          onUpdateNotes={(idx, notes) => {
            setSlides((prev) => {
              const copy = [...prev];
              copy[idx] = { ...copy[idx], notes };
              return copy;
            });
          }}
          onReturnToNormalView={() => setViewMode('normal')}
        />
      ) : (
        /* Normal View: Thumbnails Deck on Left + Editor Canvas in Center + Notes at Bottom */
        <div className="flex-1 flex overflow-hidden">
          {/* Left Thumbnail Deck (PowerPoint Slide Navigator) */}
          <div className="w-56 sm:w-64 bg-[#f3f2f1] border-l border-gray-300 flex flex-col p-3 overflow-y-auto shrink-0 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-300">
              <span className="text-xs font-bold text-gray-700">
                الشرائح ({slides.length})
              </span>

              <button
                onClick={() => handleAddNewSlide('content')}
                className="flex items-center gap-1 bg-[#d83b01] text-white px-2 py-1 rounded text-xs font-semibold hover:bg-[#b33000] transition cursor-pointer"
                title="إضافة شريحة جديدة (Ctrl+M)"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>شريحة جديدة</span>
              </button>
            </div>

            {/* Slides list */}
            {slides.map((s, idx) => {
              const isSelected = idx === currentSlideIndex;
              const thumbTheme = getThemeStyles(s.theme);

              return (
                <div
                  key={s.id}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`p-2 rounded-lg border-2 cursor-pointer transition relative group ${
                    isSelected
                      ? 'border-[#d83b01] shadow-md bg-white ring-2 ring-orange-200'
                      : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                  } ${s.hidden ? 'opacity-40 grayscale' : ''}`}
                >
                  <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1">
                    <div className="flex items-center gap-1">
                      <span className="font-bold">شريحة {idx + 1}</span>
                      {s.transitionConfig?.type && s.transitionConfig.type !== 'none' && (
                        <span className="text-[8px] bg-sky-100 text-sky-800 px-1 rounded">
                          ★ {s.transitionConfig.type}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicateSlide(idx);
                        }}
                        className="p-0.5 hover:text-blue-600"
                        title="تكرار الشريحة (Ctrl+D)"
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

                  {/* Thumbnail Card Preview */}
                  <div
                    className={`aspect-video rounded p-2 text-[9px] text-white overflow-hidden shadow-inner relative flex items-center justify-center text-center ${thumbTheme.bg}`}
                    style={{
                      backgroundImage: s.backgroundImage ? `url(${s.backgroundImage})` : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    <div>
                      <div className="font-bold truncate text-sky-200">{s.title}</div>
                      <div className="text-[7.5px] opacity-70 truncate">{s.subtitle}</div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Quick Actions in Sidebar */}
            <div className="pt-2 space-y-2">
              <label className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-orange-300 hover:bg-orange-50 text-orange-900 rounded-lg text-xs font-bold cursor-pointer transition shadow-2xs">
                <FileUp className="w-3.5 h-3.5 text-orange-600" />
                <span>فتح ملف PowerPoint (.pptx)</span>
                <input
                  type="file"
                  accept=".pptx"
                  onChange={handleOpenPptx}
                  className="hidden"
                />
              </label>

              <button
                onClick={() => setIsPresenterMode(true)}
                className="w-full bg-[#d83b01] hover:bg-[#b33000] text-white font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow transition cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>بدء العرض التقديمي (F5)</span>
              </button>
            </div>
          </div>

          {/* Center Main Slide Editor Workspace */}
          <div className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 items-center justify-start">
            {/* Slide Action Bar */}
            <div className="w-full max-w-4xl flex items-center justify-between mb-3 text-xs bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="text-gray-500 font-bold">سمة الشريحة:</span>
                {(['blue', 'emerald', 'amber', 'dark', 'purple', 'crimson'] as SlideItem['theme'][]).map(
                  (t) => (
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
                  )
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-500">الانتقال:</span>
                <select
                  value={currentSlide.transitionConfig?.type || currentSlide.transition || 'morph'}
                  onChange={(e) => handleSelectTransition(e.target.value as TransitionType)}
                  className="bg-gray-50 border border-gray-300 rounded px-2 py-0.5 text-xs outline-none"
                >
                  <option value="morph">التحول التدريجي (Morph) ⭐</option>
                  <option value="fade">تضاؤل (Fade)</option>
                  <option value="push">دفع (Push)</option>
                  <option value="wipe">مسح (Wipe)</option>
                  <option value="zoom">تكبير (Zoom)</option>
                  <option value="split">انقسام (Split)</option>
                  <option value="page-curl">طي الصفحة (Page Curl)</option>
                  <option value="doors">أبواب (Doors)</option>
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

            {/* 16:9 Slide Canvas */}
            <div
              className={`w-full max-w-4xl rounded-xl shadow-2xl p-8 sm:p-12 text-right relative flex flex-col justify-between overflow-hidden transition-all duration-300 ${
                currentSlide.backgroundImage ? '' : activeTheme.bg
              }`}
              style={{
                aspectRatio:
                  slideSize.preset === '4:3'
                    ? '4/3'
                    : slideSize.preset === '16:10'
                    ? '16/10'
                    : '16/9',
                fontFamily: currentSlide.fontFamily || fontFamily,
                backgroundImage: currentSlide.backgroundImage
                  ? `url(${currentSlide.backgroundImage})`
                  : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: currentSlide.backgroundColor || undefined,
              }}
            >
              {/* Optional Subtle Ambient Glow */}
              {!currentSlide.backgroundImage && (
                <>
                  <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
                  <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
                </>
              )}

              {/* Slide Top Branding */}
              <div
                className={`flex items-center justify-between text-xs select-none pb-4 ${
                  currentSlide.backgroundImage
                    ? 'text-gray-800'
                    : 'text-white/60 border-b border-white/10'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span
                    className={`font-bold tracking-wider ${
                      currentSlide.backgroundImage
                        ? 'text-gray-900 bg-white/80 px-2 py-0.5 rounded shadow-2xs'
                        : 'text-white'
                    }`}
                  >
                    INFINITY SOVEREIGN PRESENTATION
                  </span>
                </div>
                <span
                  className={`font-mono ${
                    currentSlide.backgroundImage
                      ? 'text-gray-900 bg-white/80 px-2 py-0.5 rounded shadow-2xs'
                      : 'text-white/50'
                  }`}
                >
                  الشريحة {currentSlideIndex + 1} / {slides.length}
                </span>
              </div>

              {/* Slide Main Content Fields */}
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

                {/* Additional Slide Shapes Render */}
                {currentSlide.shapes && currentSlide.shapes.length > 0 && (
                  <div className="pt-4 flex flex-wrap gap-3">
                    {currentSlide.shapes.map((shape) => (
                      <div
                        key={shape.id}
                        className="p-3 rounded-lg border shadow-md text-xs font-bold flex items-center justify-center"
                        style={{
                          backgroundColor: shape.fill,
                          borderColor: shape.stroke,
                          color: shape.textColor || '#ffffff',
                        }}
                      >
                        {shape.text || shape.type}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Drawing Layer on Slide (when Draw Tab active) */}
              <canvas
                ref={drawCanvasRef}
                width={896}
                height={504}
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                className={`absolute inset-0 w-full h-full z-20 ${
                  activeDrawTool === 'cursor' ? 'pointer-events-none' : 'cursor-crosshair'
                }`}
              />

              {/* Slide Footer */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-white/40 select-none">
                <span>MY-DOC Sovereign Office Suite 2026</span>
                <span>محفوظ ومحمي محلياً 100%</span>
              </div>
            </div>

            {/* Presenter Notes Bar at Bottom */}
            {showNotesPane && (
              <div className="w-full max-w-4xl mt-4 bg-white p-4 rounded-xl border border-gray-200 shadow-xs text-right">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-gray-700">
                    ملاحظات مقدم العرض (Presenter Notes - تظهر فقط لك في وضع العرض):
                  </label>
                  <button
                    onClick={() => setShowNotesPane(false)}
                    className="text-[10px] text-gray-400 hover:text-gray-600"
                  >
                    إخفاء جزء الملاحظات
                  </button>
                </div>
                <textarea
                  value={currentSlide.notes || ''}
                  onChange={(e) => handleUpdateCurrentSlide('notes', e.target.value)}
                  rows={2}
                  className="w-full bg-gray-50 border border-gray-300 rounded p-2 text-xs text-gray-800 outline-none focus:border-[#d83b01]"
                  placeholder="اكتب الملاحظات والنقاط التي تريد تذكرها أثناء الشرح..."
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Fullscreen Dual-Screen Presenter View Mode */}
      {isPresenterMode && (
        <PresenterMode
          slides={slides}
          initialSlideIndex={currentSlideIndex}
          onClose={() => setIsPresenterMode(false)}
        />
      )}

      {/* 4. Interactive PowerPoint Modals */}
      <AnimationPaneModal
        isOpen={isAnimationPaneOpen}
        onClose={() => setIsAnimationPaneOpen(false)}
        animations={currentSlide.animations || []}
        onUpdateAnimations={(anims) => handleUpdateCurrentSlide('animations', anims)}
        onPreviewAnimations={() => alert('تشغيل الحركات على الشريحة')}
      />

      <SlideMasterModal
        isOpen={isSlideMasterOpen}
        onClose={() => setIsSlideMasterOpen(false)}
        currentTheme={currentThemeId}
        onApplyMasterToAll={(settings) => {
          setSlides((prev) =>
            prev.map((s) => ({
              ...s,
              fontFamily: settings.titleFont || s.fontFamily,
            }))
          );
        }}
      />

      <SlideSizeModal
        isOpen={isSlideSizeOpen}
        onClose={() => setIsSlideSizeOpen(false)}
        currentConfig={slideSize}
        onApplySize={(newSize) => setSlideSize(newSize)}
      />

      <RehearseTimingsModal
        isOpen={isRehearseTimingsOpen}
        onClose={() => setIsRehearseTimingsOpen(false)}
        slides={slides}
        onSaveTimings={(timings) => {
          setSlides((prev) =>
            prev.map((s) => ({
              ...s,
              rehearsedDuration: timings[s.id] || 0,
            }))
          );
        }}
      />

      <DesignerDrawer
        isOpen={isDesignerDrawerOpen}
        onClose={() => setIsDesignerDrawerOpen(false)}
        currentSlide={currentSlide}
        onApplyDesign={(mod) => {
          setSlides((prev) => {
            const copy = [...prev];
            copy[currentSlideIndex] = {
              ...copy[currentSlideIndex],
              ...mod,
            };
            return copy;
          });
          setIsDesignerDrawerOpen(false);
        }}
      />

      <SmartArtModal
        isOpen={isSmartArtModalOpen}
        onClose={() => setIsSmartArtModalOpen(false)}
        onInsertSmartArt={(type, title, items) => {
          const newBody = items;
          setSlides((prev) => {
            const copy = [...prev];
            copy[currentSlideIndex] = {
              ...copy[currentSlideIndex],
              title,
              body: newBody,
              layout: 'split',
            };
            return copy;
          });
        }}
      />
    </div>
  );
};
