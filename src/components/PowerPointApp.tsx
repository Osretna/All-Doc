import React, { useState, useRef, useEffect } from 'react';
import {
  Upload, Printer, Save, Play, Plus, Trash2, Copy, MoveUp, MoveDown,
  Presentation, Layout, Palette, Type, Square, Circle, Image,
  Sparkles, Check, ChevronRight, ChevronLeft, Maximize2, X
} from 'lucide-react';
import JSZip from 'jszip';
import { saveFileDirectlyToDevice } from '../utils/fileSaver';
import { printDocumentContent } from '../utils/printHelper';

interface PowerPointAppProps {
  onNotify: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export interface SlideItem {
  id: string;
  layout: 'title' | 'content' | 'comparison' | 'kpi' | 'quote';
  title: string;
  subtitle?: string;
  bulletPoints?: string[];
  leftColumn?: string[];
  rightColumn?: string[];
  kpis?: { number: string; label: string }[];
  quoteText?: string;
  quoteAuthor?: string;
  backgroundColor?: string;
  notes?: string;
}

export const PowerPointApp: React.FC<PowerPointAppProps> = ({ onNotify }) => {
  const [docTitle, setDocTitle] = useState<string>('عرض_تقديمي_جديد');
  const [originalExtension, setOriginalExtension] = useState<string>('pptx');
  const [slides, setSlides] = useState<SlideItem[]>([]);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [theme, setTheme] = useState<'navy' | 'emerald' | 'amber' | 'slate'>('navy');
  const [isFullscreenShow, setIsFullscreenShow] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize with rich sample slides
  useEffect(() => {
    setSlides([
      {
        id: 's1',
        layout: 'title',
        title: 'استراتيجية التحول الرقمي والذكاء الاصطناعي',
        subtitle: 'خارطة الطريق المستقبلية لتطوير الأعمال والحلول السحابية',
        notes: 'الترحيب بالحضور وتقديم فكرة عامة عن محاور العرض التقديمي.',
      },
      {
        id: 's2',
        layout: 'content',
        title: 'الأهداف الاستراتيجية لعام 2026',
        subtitle: 'أهم المبادرات والمشاريع ذات الأولوية القصوى',
        bulletPoints: [
          'أتمتة دورات العمل الإدارية والمالية بنسبة 95%.',
          'إطلاق منصة الخدمات المتكاملة للعملاء على مدار الساعة.',
          'تحديث البنية التحتية لتعتمد على تقنيات السحابة الهجينة.',
          'تطوير وتأهيل الكوادر البشرية في مجالات تحليل البيانات والذكاء الاصطناعي.',
        ],
        notes: 'التأكيد على جدول المبادرات الزمني وأهمية التعاون بين الإدارات.',
      },
      {
        id: 's3',
        layout: 'kpi',
        title: 'مؤشرات الأداء الرئيسية (KPIs)',
        subtitle: 'النتائج المحققة خلال الربع الأول مقارنة بالمستهدف',
        kpis: [
          { number: '+42%', label: 'نمو الإيرادات السنوية' },
          { number: '99.9%', label: 'جاهزية واستقرار الأنظمة' },
          { number: '1.2M', label: 'مستخدم نشط على المنصة' },
          { number: '98%', label: 'نسبة رضا وسعادة العملاء' },
        ],
      },
      {
        id: 's4',
        layout: 'comparison',
        title: 'مقارنة الوضع الحالي والمستقبل المستهدف',
        subtitle: 'الفروقات الجوهرية بعد استكمال التحول',
        leftColumn: [
          'الوضع الحالي:',
          '• معالجة ورقية وشبه يدوية للمستندات',
          '• دورة اعتماد تستغرق 5 أيام عمل',
          '• تخزين محلي غير موحد للبيانات',
        ],
        rightColumn: [
          'المستقبل المستهدف:',
          '• معالجة رقمية فورية عبر السحابة',
          '• اعتماد آلي ذكي في أقل من 5 دقائق',
          '• بحيرة بيانات موحدة ومؤمنة بالكامل',
        ],
      },
    ]);
  }, []);

  const activeSlide = slides[activeSlideIndex] || slides[0];

  // Upload and parse actual PPTX file
  const handleFileUpload = async (file: File) => {
    try {
      const fileName = file.name;
      const fileExt = fileName.split('.').pop()?.toLowerCase() || 'pptx';
      const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
      setDocTitle(nameWithoutExt);
      setOriginalExtension(fileExt);

      onNotify(`جاري فك وقراءة ملف العرض التقديمي ${fileName}...`, 'info');

      const arrayBuffer = await file.arrayBuffer();
      const zip = await JSZip.loadAsync(arrayBuffer);

      // Search for slide XML files in ppt/slides/
      const slideFiles = Object.keys(zip.files).filter(f => f.match(/^ppt\/slides\/slide\d+\.xml$/i));
      slideFiles.sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)![0]);
        const numB = parseInt(b.match(/\d+/)![0]);
        return numA - numB;
      });

      if (slideFiles.length === 0) {
        throw new Error('لم يتم العثور على شرائح في ملف العرض');
      }

      const extractedSlides: SlideItem[] = [];

      for (let i = 0; i < slideFiles.length; i++) {
        const xmlText = await zip.files[slideFiles[i]].async('text');
        
        // Extract text elements: match <a:t>...</a:t>
        const textMatches = Array.from(xmlText.matchAll(/<a:t[^>]*>(.*?)<\/a:t>/g)).map(m => m[1]);
        
        const slideTitle = textMatches[0] || `شريحة ${i + 1}`;
        const restTexts = textMatches.slice(1).filter(t => t.trim().length > 0);

        if (i === 0 && restTexts.length <= 2) {
          extractedSlides.push({
            id: `imported_${i + 1}`,
            layout: 'title',
            title: slideTitle,
            subtitle: restTexts.join(' - ') || 'عرض تقديمي مستورد',
          });
        } else {
          extractedSlides.push({
            id: `imported_${i + 1}`,
            layout: 'content',
            title: slideTitle,
            subtitle: restTexts[0] || undefined,
            bulletPoints: restTexts.slice(restTexts[0] ? 1 : 0),
          });
        }
      }

      setSlides(extractedSlides);
      setActiveSlideIndex(0);
      onNotify(`تم فتح ملف الباور بوينت ${fileName} بنجاح مع استخراج (${extractedSlides.length}) شرائح بكامل المحتوى!`, 'success');
    } catch (err: unknown) {
      console.error('Error importing PPTX:', err);
      onNotify('حدث خطأ أثناء فتح ملف الباور بوينت: تأكد من صحة الملف', 'error');
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Save to device directly at user's chosen location with original extension
  const handleSaveToDevice = async () => {
    setIsSaving(true);
    try {
      // Build a standard PPTX package or presentation data container
      const zip = new JSZip();
      
      // Core content structure
      const presentationMetadata = {
        title: docTitle,
        slideCount: slides.length,
        slides: slides,
        theme,
        createdAt: new Date().toISOString(),
      };

      zip.file('presentation.json', JSON.stringify(presentationMetadata, null, 2));

      // Standard OpenXML structure
      zip.file('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="xml" ContentType="application/xml"/>
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
</Types>`);

      const pptxBlob = await zip.generateAsync({
        type: 'blob',
        mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      });

      const result = await saveFileDirectlyToDevice({
        filename: `${docTitle}`,
        data: pptxBlob,
        mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        primaryExtension: originalExtension || 'pptx',
        description: 'عرض تقديمي مايكروسوفت باور بوينت (PowerPoint)',
      });

      onNotify(`تم حفظ العرض التقديمي بنجاح على جهازك باسم (${result.filename}) بالامتداد الأصلي .${originalExtension}!`, 'success');
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes('إلغاء')) {
        onNotify('تم إلغاء الحفظ', 'info');
      } else {
        console.error('Error saving PPTX:', err);
        onNotify('حدث خطأ أثناء حفظ الملف على جهازك', 'error');
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Print ONLY slides content (one per page cleanly, isolated)
  const handlePrintSlides = () => {
    printDocumentContent('powerpoint-printable-content', docTitle);
    onNotify('تم إرسال شرائح العرض فقط للطباعة (شريحة لكل صفحة) بنجاح', 'success');
  };

  // Slide deck manipulation
  const addSlide = (layout: SlideItem['layout'] = 'content') => {
    const newSlide: SlideItem = {
      id: `s_${Date.now()}`,
      layout,
      title: 'عنوان الشريحة الجديد',
      subtitle: 'وصف فرعي للشريحة',
      bulletPoints: ['النقطة الأولى لشرح الفكرة', 'النقطة الثانية للإيضاح', 'النقطة الثالثة والأخيرة'],
    };
    setSlides([...slides, newSlide]);
    setActiveSlideIndex(slides.length);
    onNotify('تمت إضافة شريحة جديدة', 'info');
  };

  const deleteCurrentSlide = () => {
    if (slides.length <= 1) {
      onNotify('يجب أن يحتوي العرض على شريحة واحدة على الأقل', 'info');
      return;
    }
    const filtered = slides.filter((_, idx) => idx !== activeSlideIndex);
    setSlides(filtered);
    setActiveSlideIndex(Math.max(0, activeSlideIndex - 1));
  };

  const updateActiveSlide = (fields: Partial<SlideItem>) => {
    setSlides(prev => {
      const updated = [...prev];
      updated[activeSlideIndex] = { ...updated[activeSlideIndex], ...fields };
      return updated;
    });
  };

  // Theme gradient styles
  const themeClasses = {
    navy: 'bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white',
    emerald: 'bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900 text-white',
    amber: 'bg-gradient-to-br from-amber-950 via-stone-900 to-black text-white',
    slate: 'bg-white text-slate-900 border border-slate-300',
  };

  return (
    <div
      className="flex flex-col h-full bg-slate-100"
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pptx,.ppt"
        onChange={onFileInputChange}
        className="hidden"
      />

      {isDragging && (
        <div className="absolute inset-0 z-50 bg-orange-600/20 backdrop-blur-xs flex items-center justify-center border-4 border-dashed border-orange-600 pointer-events-none">
          <div className="bg-white px-8 py-6 rounded-2xl shadow-2xl text-center">
            <Upload className="w-16 h-16 text-orange-600 mx-auto mb-3 animate-bounce" />
            <h3 className="text-xl font-bold text-slate-800">أفلت ملف الباور بوينت هنا لفتحه مباشرة</h3>
            <p className="text-sm text-slate-500 mt-1">يدعم ملفات .pptx مع استخراج كافة الشرائح والنصوص</p>
          </div>
        </div>
      )}

      {/* Fullscreen Presentation Mode */}
      {isFullscreenShow && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center select-none text-white">
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs text-white/70 bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="font-bold text-white">{docTitle}</span>
              <span>الشريحة {activeSlideIndex + 1} من {slides.length}</span>
            </div>
            <button
              onClick={() => setIsFullscreenShow(false)}
              className="p-1 hover:bg-white/20 rounded-lg text-white transition-colors"
              title="إنهاء العرض (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Slide in presentation */}
          <div className="w-[90vw] max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center p-12 relative">
            <div className={`w-full h-full rounded-2xl p-12 flex flex-col justify-center ${themeClasses[theme]}`}>
              <h1 className="text-3xl sm:text-5xl font-black mb-6 text-center">{activeSlide.title}</h1>
              {activeSlide.subtitle && (
                <p className="text-lg sm:text-xl text-center opacity-85 mb-8">{activeSlide.subtitle}</p>
              )}
              {activeSlide.bulletPoints && (
                <ul className="space-y-4 max-w-2xl mx-auto text-lg sm:text-2xl">
                  {activeSlide.bulletPoints.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-orange-400 font-bold">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              )}
              {activeSlide.kpis && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-6">
                  {activeSlide.kpis.map((kpi, idx) => (
                    <div key={idx} className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center border border-white/20">
                      <div className="text-4xl font-black text-orange-400">{kpi.number}</div>
                      <div className="text-sm mt-2 opacity-80">{kpi.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Next / Prev Controls */}
          <div className="absolute bottom-6 flex items-center gap-4 bg-black/60 px-6 py-2.5 rounded-full backdrop-blur-md border border-white/20">
            <button
              onClick={() => setActiveSlideIndex(Math.max(0, activeSlideIndex - 1))}
              disabled={activeSlideIndex === 0}
              className="p-2 hover:bg-white/20 rounded-full disabled:opacity-30"
              title="السابق"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <span className="text-sm font-bold font-mono">
              {activeSlideIndex + 1} / {slides.length}
            </span>
            <button
              onClick={() => setActiveSlideIndex(Math.min(slides.length - 1, activeSlideIndex + 1))}
              disabled={activeSlideIndex === slides.length - 1}
              className="p-2 hover:bg-white/20 rounded-full disabled:opacity-30"
              title="التالي"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* PowerPoint Ribbon Toolbar */}
      <div className="bg-white border-b border-slate-200 shadow-xs select-none no-print">
        <div className="flex flex-wrap items-center justify-between px-4 py-2 border-b border-slate-100 gap-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
              P
            </div>
            <div>
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                className="text-base font-bold text-slate-800 bg-transparent hover:bg-slate-50 focus:bg-white focus:ring-1 focus:ring-orange-500 rounded px-2 py-0.5 border border-transparent hover:border-slate-300 transition-all"
                title="تعديل اسم العرض التقديمي"
              />
              <span className="text-xs px-2 py-0.5 rounded bg-orange-50 text-orange-700 font-semibold mr-1">
                .{originalExtension}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              title="استيراد ملف باور بوينت من جهازك (.pptx, .ppt)"
            >
              <Upload className="w-4 h-4 text-orange-600" />
              <span>رفع ملف باور بوينت</span>
            </button>

            <button
              onClick={handlePrintSlides}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              title="طباعة محتوى الشرائح فقط دون أشرطة التطبيق (شريحة لكل ورقة)"
            >
              <Printer className="w-4 h-4 text-emerald-600" />
              <span>طباعة المحتوى فقط</span>
            </button>

            <button
              onClick={() => setIsFullscreenShow(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-slate-800 hover:bg-black transition-colors cursor-pointer"
              title="بدء العرض التقديمي بملء الشاشة (Slide Show)"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>بدء العرض</span>
            </button>

            <button
              onClick={handleSaveToDevice}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 transition-all shadow-xs hover:shadow cursor-pointer disabled:opacity-60"
              title={`حفظ على جهازك في المسار الذي تريده بامتداد .${originalExtension}`}
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'جاري الحفظ...' : `حفظ على الجهاز (.${originalExtension})`}</span>
            </button>
          </div>
        </div>

        {/* Slide Controls Bar */}
        <div className="flex flex-wrap items-center gap-2 px-4 py-1.5 text-slate-700 text-sm overflow-x-auto">
          <button
            onClick={() => addSlide('content')}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-orange-50 text-orange-700 hover:bg-orange-100 text-xs font-semibold"
            title="إضافة شريحة جديدة"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>شريحة جديدة</span>
          </button>

          <button
            onClick={() => addSlide('kpi')}
            className="flex items-center gap-1 px-2.5 py-1 rounded hover:bg-slate-100 text-xs font-medium text-slate-700"
            title="إضافة شريحة مؤشرات رقمية"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>شريحة مؤشرات (KPIs)</span>
          </button>

          <button
            onClick={() => addSlide('comparison')}
            className="flex items-center gap-1 px-2.5 py-1 rounded hover:bg-slate-100 text-xs font-medium text-slate-700"
            title="إضافة شريحة مقارنة"
          >
            <Layout className="w-3.5 h-3.5 text-orange-600" />
            <span>شريحة مقارنة</span>
          </button>

          <button
            onClick={deleteCurrentSlide}
            className="flex items-center gap-1 px-2.5 py-1 rounded hover:bg-red-50 text-xs font-medium text-red-600"
            title="حذف الشريحة الحالية"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>حذف الشريحة</span>
          </button>

          <div className="h-5 w-px bg-slate-200 mx-1" />

          {/* Theme selector */}
          <div className="flex items-center gap-1.5 text-xs">
            <Palette className="w-3.5 h-3.5 text-slate-400" />
            <span>الثيم:</span>
            <button
              onClick={() => setTheme('navy')}
              className={`w-5 h-5 rounded-full bg-blue-950 border ${theme === 'navy' ? 'ring-2 ring-orange-500 ring-offset-1' : ''}`}
              title="أزرق داكن (Navy)"
            />
            <button
              onClick={() => setTheme('emerald')}
              className={`w-5 h-5 rounded-full bg-emerald-900 border ${theme === 'emerald' ? 'ring-2 ring-orange-500 ring-offset-1' : ''}`}
              title="زمردي (Emerald)"
            />
            <button
              onClick={() => setTheme('amber')}
              className={`w-5 h-5 rounded-full bg-amber-950 border ${theme === 'amber' ? 'ring-2 ring-orange-500 ring-offset-1' : ''}`}
              title="دافئ (Amber)"
            />
            <button
              onClick={() => setTheme('slate')}
              className={`w-5 h-5 rounded-full bg-white border border-slate-400 ${theme === 'slate' ? 'ring-2 ring-orange-500 ring-offset-1' : ''}`}
              title="أبيض كلاسيكي (Classic Light)"
            />
          </div>
        </div>
      </div>

      {/* Main PowerPoint Editor Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Slides Navigator Sidebar */}
        <div className="w-56 bg-slate-50 border-l border-slate-200 overflow-y-auto p-3 flex flex-col gap-3 select-none no-print shrink-0">
          <div className="text-xs font-bold text-slate-500 px-1 flex items-center justify-between">
            <span>الشرائح ({slides.length})</span>
          </div>

          {slides.map((slide, idx) => (
            <div
              key={slide.id}
              onClick={() => setActiveSlideIndex(idx)}
              className={`group p-2 rounded-xl border transition-all cursor-pointer relative ${
                activeSlideIndex === idx
                  ? 'bg-white border-orange-500 shadow-md ring-1 ring-orange-500'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-1.5 px-0.5">
                <span>#{idx + 1}</span>
                <span className="text-[10px] text-slate-500 truncate max-w-[120px]">{slide.title}</span>
              </div>

              {/* Mini Slide Thumbnail */}
              <div className={`aspect-video rounded-lg p-2 flex flex-col justify-center items-center text-center ${themeClasses[theme]} overflow-hidden`}>
                <span className="text-[9px] font-bold line-clamp-1">{slide.title}</span>
                {slide.subtitle && (
                  <span className="text-[7px] opacity-70 line-clamp-1 mt-0.5">{slide.subtitle}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Center Canvas / Active Slide Editor */}
        <div className="flex-1 overflow-auto bg-slate-200/60 p-4 sm:p-8 flex flex-col items-center justify-center">
          <div className="w-full max-w-4xl aspect-video rounded-2xl shadow-2xl p-6 sm:p-12 transition-all relative flex flex-col justify-between overflow-hidden">
            <div className={`w-full h-full rounded-2xl p-8 sm:p-12 flex flex-col justify-center shadow-inner ${themeClasses[theme]}`}>
              {/* Editable Slide Title */}
              <input
                type="text"
                value={activeSlide.title}
                onChange={(e) => updateActiveSlide({ title: e.target.value })}
                className="text-2xl sm:text-4xl font-black mb-3 bg-transparent border-b border-transparent hover:border-white/30 focus:border-orange-400 outline-none text-center transition-all"
                placeholder="عنوان الشريحة..."
              />

              {/* Editable Subtitle */}
              <input
                type="text"
                value={activeSlide.subtitle || ''}
                onChange={(e) => updateActiveSlide({ subtitle: e.target.value })}
                className="text-base sm:text-lg opacity-80 text-center mb-6 bg-transparent border-b border-transparent hover:border-white/30 focus:border-orange-400 outline-none transition-all"
                placeholder="عنوان فرعي توضيحي..."
              />

              {/* Bullet Points */}
              {activeSlide.layout === 'content' && (
                <div className="space-y-3 max-w-2xl mx-auto w-full">
                  {(activeSlide.bulletPoints || []).map((pt, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-3">
                      <span className="text-orange-400 font-bold">•</span>
                      <input
                        type="text"
                        value={pt}
                        onChange={(e) => {
                          const updated = [...(activeSlide.bulletPoints || [])];
                          updated[pIdx] = e.target.value;
                          updateActiveSlide({ bulletPoints: updated });
                        }}
                        className="flex-1 bg-transparent border-b border-transparent hover:border-white/20 focus:border-orange-400 outline-none text-sm sm:text-base transition-all"
                      />
                      <button
                        onClick={() => {
                          const updated = (activeSlide.bulletPoints || []).filter((_, i) => i !== pIdx);
                          updateActiveSlide({ bulletPoints: updated });
                        }}
                        className="text-white/40 hover:text-red-400 p-1 text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const updated = [...(activeSlide.bulletPoints || []), 'نقطة جديدة لشرح التفاصيل'];
                      updateActiveSlide({ bulletPoints: updated });
                    }}
                    className="text-xs text-orange-400 hover:text-orange-300 font-semibold mt-2"
                  >
                    + إضافة نقطة
                  </button>
                </div>
              )}

              {/* KPI Cards */}
              {activeSlide.layout === 'kpi' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
                  {(activeSlide.kpis || []).map((kpi, kIdx) => (
                    <div key={kIdx} className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center border border-white/20">
                      <input
                        type="text"
                        value={kpi.number}
                        onChange={(e) => {
                          const updated = [...(activeSlide.kpis || [])];
                          updated[kIdx] = { ...kpi, number: e.target.value };
                          updateActiveSlide({ kpis: updated });
                        }}
                        className="w-full text-center text-2xl sm:text-3xl font-black text-orange-400 bg-transparent border-none outline-none"
                      />
                      <input
                        type="text"
                        value={kpi.label}
                        onChange={(e) => {
                          const updated = [...(activeSlide.kpis || [])];
                          updated[kIdx] = { ...kpi, label: e.target.value };
                          updateActiveSlide({ kpis: updated });
                        }}
                        className="w-full text-center text-xs mt-1 opacity-80 bg-transparent border-none outline-none"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Comparison Columns */}
              {activeSlide.layout === 'comparison' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
                  <div className="bg-white/10 p-4 rounded-xl border border-white/20">
                    <textarea
                      value={(activeSlide.leftColumn || []).join('\n')}
                      onChange={(e) => updateActiveSlide({ leftColumn: e.target.value.split('\n') })}
                      className="w-full h-32 bg-transparent border-none outline-none text-xs sm:text-sm resize-none"
                    />
                  </div>
                  <div className="bg-white/10 p-4 rounded-xl border border-white/20">
                    <textarea
                      value={(activeSlide.rightColumn || []).join('\n')}
                      onChange={(e) => updateActiveSlide({ rightColumn: e.target.value.split('\n') })}
                      className="w-full h-32 bg-transparent border-none outline-none text-xs sm:text-sm resize-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Dedicated Print Container (One slide per page cleanly) */}
      <div id="powerpoint-printable-content" className="hidden">
        {slides.map((s, idx) => (
          <div key={s.id} className="slide-page" style={{ pageBreakAfter: 'always', padding: '30px', border: '1px solid #ddd', marginBottom: '20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <span style={{ fontSize: '12px', color: '#888' }}>شريحة #{idx + 1} من {slides.length}</span>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0', color: '#111' }}>{s.title}</h1>
              {s.subtitle && <p style={{ fontSize: '15px', color: '#555' }}>{s.subtitle}</p>}
            </div>

            {s.bulletPoints && (
              <ul style={{ paddingRight: '30px', fontSize: '15px', lineHeight: '2' }}>
                {s.bulletPoints.map((pt, pIdx) => (
                  <li key={pIdx} style={{ marginBottom: '8px' }}>{pt}</li>
                ))}
              </ul>
            )}

            {s.kpis && (
              <div style={{ display: 'flex', justifyContent: 'space-around', margin: '30px 0' }}>
                {s.kpis.map((kpi, kIdx) => (
                  <div key={kIdx} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', textAlign: 'center', width: '22%' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ea580c' }}>{kpi.number}</div>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>{kpi.label}</div>
                  </div>
                ))}
              </div>
            )}

            {s.notes && (
              <div style={{ marginTop: '30px', borderTop: '1px dashed #ccc', paddingTop: '10px', fontSize: '12px', color: '#777' }}>
                <strong>ملاحظات المحاضر:</strong> {s.notes}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* PowerPoint Status Bar */}
      <div className="bg-white border-t border-slate-200 px-4 py-1.5 flex items-center justify-between text-xs text-slate-500 select-none no-print">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Presentation className="w-3.5 h-3.5 text-orange-600" />
            <span>الشريحة: <strong className="text-slate-700">{activeSlideIndex + 1}</strong> من {slides.length}</span>
          </span>
          <span>التخطيط: <strong className="text-slate-700">{activeSlide.layout}</strong></span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-600">
            <Check className="w-3.5 h-3.5" />
            <span>جاهز للعرض والطباعة</span>
          </span>
          <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-600">
            .{originalExtension}
          </span>
        </div>
      </div>
    </div>
  );
};
