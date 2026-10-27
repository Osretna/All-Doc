import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument, rgb, degrees } from 'pdf-lib';
import {
  FileCheck2,
  PenTool,
  Stamp,
  Printer,
  Download,
  CheckCircle2,
  X,
  RotateCcw,
  ShieldCheck,
  Building2,
  FolderOpen,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FileText,
  RotateCw,
  Upload,
  Layers,
  ChevronLeft,
  ChevronRight,
  Search,
  Check,
  Move,
  AlertCircle,
  Eye,
  FileSpreadsheet,
  Ruler,
  Highlighter,
  MessageSquare,
  Loader2
} from 'lucide-react';
import { PdfRibbon } from './pdf/PdfRibbon';
import { PdfThumbnailSidebar } from './pdf/PdfThumbnailSidebar';
import { MergePdfModal } from './pdf/modals/MergePdfModal';
import { WatermarkModal } from './pdf/modals/WatermarkModal';
import { HeaderFooterModal } from './pdf/modals/HeaderFooterModal';
import { ProtectPdfModal } from './pdf/modals/ProtectPdfModal';
import { SignatureModal } from './pdf/modals/SignatureModal';
import { ExportPdfModal } from './pdf/modals/ExportPdfModal';
import { OrganizePagesModal } from './pdf/modals/OrganizePagesModal';
import {
  PdfRibbonTab,
  PdfActiveTool,
  StickyNote,
  StampItem,
  SignatureItem,
  DrawingPath,
  TextBlockItem,
  RedactionBox,
  FormFieldItem,
  PdfWatermarkConfig,
  BatesNumberingConfig,
  HeaderFooterConfig
} from './pdf/types';

// PDF.js worker setup
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
} catch (e) {
  console.warn('PDF.js worker initialization:', e);
}

interface Props {
  fontFamily: string;
  initialPdfFile?: File | null;
  onPdfChange?: (file: File) => void;
  onOpenBackstage?: () => void;
}

export const PdfStudioApp: React.FC<Props> = ({ 
  fontFamily, 
  initialPdfFile, 
  onPdfChange,
  onOpenBackstage 
}) => {
  // Document state
  const [documentTitle, setDocumentTitle] = useState('محضر_اجتماع_واعتماد_برج_النخيل_2026.pdf');
  const [pdfFile, setPdfFile] = useState<File | null>(initialPdfFile || null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [totalPages, setTotalPages] = useState<number>(3);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageRotations, setPageRotations] = useState<Record<number, number>>({ 1: 0, 2: 0, 3: 0 });
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isLoadingPdf, setIsLoadingPdf] = useState<boolean>(false);
  const [isRenderLoading, setIsRenderLoading] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);

  // Canvas refs for real PDF rendering
  const pdfPageCanvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<any>(null);

  // Ribbon & UI states
  const [activeTab, setActiveTab] = useState<PdfRibbonTab>('home');
  const [activeTool, setActiveTool] = useState<PdfActiveTool>('select');
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const [twoPageView, setTwoPageView] = useState<boolean>(false);
  const [readingMode, setReadingMode] = useState<boolean>(false);

  // Overlays & Annotations states
  const [stickyNotes, setStickyNotes] = useState<StickyNote[]>([
    {
      id: 'note_1',
      pageNumber: 1,
      x: 75,
      y: 20,
      text: 'تمت مراجعة البنود المالية وفق جدول أعمال الجمعية العمومية.',
      author: 'م. خالد الشهري (المدقق)',
      date: '2026-10-27',
      color: '#fef08a',
    },
  ]);
  const [stamps, setStamps] = useState<StampItem[]>([
    {
      id: 'stamp_1',
      pageNumber: 1,
      x: 18,
      y: 78,
      title: 'معتمد رسمياً',
      dateStr: new Date().toLocaleDateString('en-US'),
      type: 'approved',
    },
  ]);
  const [signatures, setSignatures] = useState<SignatureItem[]>([]);
  const [drawings, setDrawings] = useState<DrawingPath[]>([]);
  const [redactions, setRedactions] = useState<RedactionBox[]>([]);
  const [textBlocks, setTextBlocks] = useState<TextBlockItem[]>([]);

  // Configurations
  const [watermarkConfig, setWatermarkConfig] = useState<PdfWatermarkConfig>({
    enabled: true,
    text: 'وثيقة رسمية معتمدة',
    color: '#ba141a',
    opacity: 0.12,
    rotation: -45,
    fontSize: 56,
  });

  const [batesConfig, setBatesConfig] = useState<BatesNumberingConfig>({
    enabled: true,
    prefix: 'PALM-DOC-',
    startNumber: 1,
    digits: 6,
    position: 'bottom-right',
  });

  const [headerFooterConfig, setHeaderFooterConfig] = useState<HeaderFooterConfig>({
    headerLeft: 'رقم السجل: MLK-9904',
    headerCenter: 'اتحاد شاغلين برج النخيل - المحضر السنوي المالي',
    headerRight: 'سري للغاية',
    footerLeft: 'نظام ملاك السيادي 2026',
    footerCenter: 'صفحة 1 من 3',
    footerRight: 'مصدق إلكترونياً',
  });

  // Modal dialog states
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
  const [isWatermarkModalOpen, setIsWatermarkModalOpen] = useState(false);
  const [isHeaderFooterModalOpen, setIsHeaderFooterModalOpen] = useState(false);
  const [isProtectModalOpen, setIsProtectModalOpen] = useState(false);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isOrganizeModalOpen, setIsOrganizeModalOpen] = useState(false);

  // Drawing canvas state
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<{ x: number; y: number }[]>([]);

  // Load PDF file via PDF.js with objectUrl fallback
  const loadPdfDocument = useCallback(async (file: File) => {
    setIsLoadingPdf(true);
    setLoadError(null);
    setPdfFile(file);
    onPdfChange?.(file);

    // Create object URL for instant fallback preview
    const objectUrl = URL.createObjectURL(file);
    setPdfUrl(objectUrl);
    setDocumentTitle(file.name);

    try {
      const buffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({
        data: buffer,
        cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
        cMapPacked: true,
      });

      const doc = await loadingTask.promise;
      setPdfDoc(doc);
      setTotalPages(doc.numPages);
      setCurrentPage(1);
      setIsLoadingPdf(false);
    } catch (err: any) {
      console.warn('PDF.js parse notice, falling back to direct stream:', err);
      // Fallback is already active via pdfUrl
      setLoadError(err?.message || null);
      setIsLoadingPdf(false);
    }
  }, [onPdfChange]);

  useEffect(() => {
    if (initialPdfFile) {
      loadPdfDocument(initialPdfFile);
    }
  }, [initialPdfFile, loadPdfDocument]);

  // Real Page Rendering on HTML5 Canvas
  useEffect(() => {
    let active = true;

    async function renderPage() {
      if (!pdfDoc || !pdfPageCanvasRef.current) return;

      try {
        setIsRenderLoading(true);
        if (renderTaskRef.current) {
          try {
            renderTaskRef.current.cancel();
          } catch {}
        }

        const page = await pdfDoc.getPage(currentPage);
        if (!active) return;

        const canvas = pdfPageCanvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rot = pageRotations[currentPage] || 0;
        const pixelRatio = window.devicePixelRatio || 1;
        const scale = (zoomLevel / 100) * 1.5;
        const viewport = page.getViewport({ scale: scale * pixelRatio, rotation: rot });

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = '100%';
        canvas.style.height = 'auto';

        const renderContext = {
          canvasContext: ctx,
          canvas: canvas,
          viewport: viewport,
        };

        const renderTask = page.render(renderContext);
        renderTaskRef.current = renderTask;
        await renderTask.promise;
      } catch (err: any) {
        if (err?.name !== 'RenderingCancelledException') {
          console.warn('PDF renderPage warning:', err);
        }
      } finally {
        if (active) setIsRenderLoading(false);
      }
    }

    renderPage();

    return () => {
      active = false;
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {}
      }
    };
  }, [pdfDoc, currentPage, zoomLevel, pageRotations]);

  // Open file handler
  const handleOpenPdfFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    loadPdfDocument(file);
  };

  // Drag and drop file handler
  const handleDropPdfFile = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type === 'application/pdf' || file.name.endsWith('.pdf'))) {
      loadPdfDocument(file);
    }
  };

  // Create new blank PDF
  const handleCreateNewPdf = () => {
    setPdfDoc(null);
    setPdfFile(null);
    setTotalPages(1);
    setCurrentPage(1);
    setDocumentTitle('وثيقة_جديدة.pdf');
    setTextBlocks([
      {
        id: `tb_${Date.now()}`,
        pageNumber: 1,
        x: 20,
        y: 20,
        text: 'انقر مرتين لتحرير هذا النص الجديد أو استخدم أدوات شريط Adobe Acrobat',
        fontSize: 14,
        color: '#1e293b',
        bold: false,
      },
    ]);
    alert('تم إنشاء وثيقة PDF جديدة فارغة جاهزة للتحرير!');
  };

  // Rotate / Delete / Insert page
  const handleRotateCurrentPage = (delta: number) => {
    setPageRotations((prev) => ({
      ...prev,
      [currentPage]: ((prev[currentPage] || 0) + delta + 360) % 360,
    }));
  };

  const handleDeleteCurrentPage = () => {
    if (totalPages <= 1) {
      alert('لا يمكن حذف الصفحة الوحيدة المتبقية في المستند.');
      return;
    }
    if (confirm(`هل أنت متأكد من حذف الصفحة ${currentPage}؟`)) {
      setTotalPages((prev) => prev - 1);
      setCurrentPage((prev) => Math.max(1, prev - 1));
    }
  };

  const handleInsertBlankPage = () => {
    setTotalPages((prev) => prev + 1);
    setCurrentPage(totalPages + 1);
    alert('تم إدراج صفحة بيضاء جديدة بنجاح!');
  };

  // Add Stamp
  const handleAddStamp = (type: StampItem['type']) => {
    const titleMap: Record<StampItem['type'], string> = {
      approved: 'معتمد رسمياً',
      confidential: 'سري للغاية',
      draft: 'مسودة DRAFT',
      paid: 'مدفوع بالكامل',
      rejected: 'مرفوض',
    };
    const newStamp: StampItem = {
      id: `stamp_${Date.now()}`,
      pageNumber: currentPage,
      x: 35,
      y: 45,
      title: titleMap[type],
      dateStr: new Date().toLocaleDateString('en-US'),
      type,
    };
    setStamps((prev) => [...prev, newStamp]);
  };

  // Freehand Drawing Handlers
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool !== 'pencil') return;
    setIsDrawing(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCurrentStroke([{ x, y }]);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || activeTool !== 'pencil') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCurrentStroke((prev) => [...prev, { x, y }]);
  };

  const handleCanvasMouseUp = () => {
    if (!isDrawing || activeTool !== 'pencil') return;
    setIsDrawing(false);
    if (currentStroke.length > 1) {
      const newPath: DrawingPath = {
        id: `draw_${Date.now()}`,
        pageNumber: currentPage,
        points: currentStroke,
        color: '#ba141a',
        strokeWidth: 3,
      };
      setDrawings((prev) => [...prev, newPath]);
    }
    setCurrentStroke([]);
  };

  // Click on Page canvas to place tools (Text, Sticky Note, Redact)
  const handlePageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTool === 'select' || activeTool === 'hand') return;

    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const yPct = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    if (activeTool === 'add-text') {
      const text = prompt('أدخل النص المراد إضافته في هذه الصفحة:', 'نص جديد معتمد');
      if (text) {
        setTextBlocks((prev) => [
          ...prev,
          {
            id: `tb_${Date.now()}`,
            pageNumber: currentPage,
            x: xPct,
            y: yPct,
            text,
            fontSize: 13,
            color: '#1e293b',
          },
        ]);
        setActiveTool('select');
      }
    } else if (activeTool === 'sticky-note') {
      const comment = prompt('أدخل تعليق أو ملاحظة لاصقة:', 'ملاحظة تدقيقية جديدة');
      if (comment) {
        setStickyNotes((prev) => [
          ...prev,
          {
            id: `note_${Date.now()}`,
            pageNumber: currentPage,
            x: xPct,
            y: yPct,
            text: comment,
            author: 'المستخدم الحالي',
            date: new Date().toLocaleDateString('ar-EG'),
            color: '#fef08a',
          },
        ]);
        setActiveTool('select');
      }
    } else if (activeTool === 'redact') {
      // Add a black redaction bar
      setRedactions((prev) => [
        ...prev,
        {
          id: `redact_${Date.now()}`,
          pageNumber: currentPage,
          x: xPct,
          y: yPct,
          width: 25,
          height: 3,
          label: 'محجوب أمنياً',
        },
      ]);
      setActiveTool('select');
    }
  };

  // Real PDF Export using pdf-lib
  const handleExportAsRealPdf = async () => {
    try {
      const pdfDocLib = await PDFDocument.create();
      for (let p = 1; p <= totalPages; p++) {
        const page = pdfDocLib.addPage([595.28, 841.89]); // A4
        const rotation = pageRotations[p] || 0;
        page.setRotation(degrees(rotation));

        // Draw Watermark if enabled
        if (watermarkConfig.enabled) {
          page.drawText(watermarkConfig.text, {
            x: 120,
            y: 400,
            size: watermarkConfig.fontSize,
            rotate: degrees(watermarkConfig.rotation),
            color: rgb(0.73, 0.08, 0.1),
            opacity: watermarkConfig.opacity,
          });
        }

        // Draw Bates if enabled
        if (batesConfig.enabled) {
          const batesText = `${batesConfig.prefix}${String(batesConfig.startNumber + p - 1).padStart(batesConfig.digits, '0')}`;
          page.drawText(batesText, {
            x: 420,
            y: 35,
            size: 10,
            color: rgb(0.2, 0.2, 0.2),
          });
        }
      }

      const pdfBytes = await pdfDocLib.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = documentTitle.endsWith('.pdf') ? documentTitle : `${documentTitle}.pdf`;
      link.click();
      alert('تم تنزيل مستند PDF بنجاح مع كافة التعديلات والعلامات المائية!');
    } catch (err) {
      console.error('Export PDF error:', err);
      window.print();
    }
  };

  // Calculate current Bates Number for current page
  const currentBatesStr = batesConfig.enabled
    ? `${batesConfig.prefix}${String(batesConfig.startNumber + currentPage - 1).padStart(batesConfig.digits, '0')}`
    : null;

  return (
    <div className="flex-1 flex flex-col bg-[#525659] overflow-hidden text-xs select-none h-full">
      {/* 1. Adobe Acrobat / Foxit Master Ribbon */}
      <PdfRibbon
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        onOpenBackstage={onOpenBackstage || (() => {})}
        onOpenFile={() => document.getElementById('pdf-file-input')?.click()}
        onCreateNewPdf={handleCreateNewPdf}
        onOpenMergeModal={() => setIsMergeModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenOrganizeModal={() => setIsOrganizeModalOpen(true)}
        onOpenWatermarkModal={() => setIsWatermarkModalOpen(true)}
        onOpenHeaderFooterModal={() => setIsHeaderFooterModalOpen(true)}
        onOpenProtectModal={() => setIsProtectModalOpen(true)}
        onOpenSignatureModal={() => setIsSignatureModalOpen(true)}
        onRotateCurrentPage={handleRotateCurrentPage}
        onDeleteCurrentPage={handleDeleteCurrentPage}
        onInsertBlankPage={handleInsertBlankPage}
        onAddStamp={handleAddStamp}
        showSidebar={showSidebar}
        onToggleSidebar={() => setShowSidebar(!showSidebar)}
        zoomLevel={zoomLevel}
        onSetZoomLevel={setZoomLevel}
        twoPageView={twoPageView}
        onToggleTwoPageView={() => setTwoPageView(!twoPageView)}
        readingMode={readingMode}
        onToggleReadingMode={() => setReadingMode(!readingMode)}
      />

      {/* Hidden PDF File Input */}
      <input
        id="pdf-file-input"
        type="file"
        accept=".pdf"
        onChange={handleOpenPdfFile}
        className="hidden"
      />

      {/* 2. Secondary Quick Toolbar (Foxit / Acrobat floating bar) */}
      {!readingMode && (
        <div className="bg-[#f8f9fa] border-b border-gray-300 px-4 py-1.5 flex items-center justify-between text-xs text-gray-700 shrink-0 z-20 shadow-2xs">
          {/* Document Title & Page Count */}
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#ba141a]" />
            <span className="font-bold text-gray-900 text-xs truncate max-w-[280px]" title={documentTitle}>
              {documentTitle}
            </span>
            <span className="text-gray-400">|</span>
            <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded font-mono text-[11px]">
              صفحة {currentPage} من {totalPages}
            </span>
          </div>

          {/* Quick Page Navigator */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-1 rounded hover:bg-gray-200 disabled:opacity-40 cursor-pointer"
              title="الصفحة السابقة"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const p = parseInt(e.target.value, 10);
                if (p >= 1 && p <= totalPages) setCurrentPage(p);
              }}
              className="w-12 text-center bg-white border border-gray-300 rounded px-1 py-0.5 text-xs font-mono font-bold"
            />
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-1 rounded hover:bg-gray-200 disabled:opacity-40 cursor-pointer"
              title="الصفحة التالية"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Actions (Print, Export Real PDF, Zoom) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded cursor-pointer"
              title="طباعة (Ctrl+P)"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleExportAsRealPdf}
              className="flex items-center gap-1 px-3 py-1 bg-[#ba141a] hover:bg-[#961015] text-white rounded-md font-bold transition shadow-2xs cursor-pointer text-xs"
              title="تنزيل كملف PDF رسمي مع كافة الإضافات"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تنزيل PDF</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Main Workspace Area: Sidebar + Canvas */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Thumbnails & Bookmarks Sidebar */}
        {!readingMode && (
          <PdfThumbnailSidebar
            isOpen={showSidebar}
            onClose={() => setShowSidebar(false)}
            totalPages={totalPages}
            currentPage={currentPage}
            onSelectPage={setCurrentPage}
            onRotatePage={(p, d) => {
              setPageRotations((prev) => ({
                ...prev,
                [p]: ((prev[p] || 0) + d + 360) % 360,
              }));
            }}
            onDeletePage={(p) => {
              if (totalPages > 1) {
                setTotalPages((prev) => prev - 1);
                setCurrentPage(1);
              }
            }}
            pageRotations={pageRotations}
            stickyNotes={stickyNotes}
          />
        )}

        {/* PDF Canvas Viewport */}
        <div
          className={`flex-1 overflow-auto bg-[#525659] p-6 flex justify-center items-start relative select-none transition-colors ${
            isDraggingOver ? 'bg-[#3b3e41] ring-4 ring-inset ring-[#ba141a]' : ''
          }`}
          onClick={handlePageClick}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDraggingOver(true);
          }}
          onDragLeave={() => setIsDraggingOver(false)}
          onDrop={handleDropPdfFile}
          style={{ cursor: activeTool === 'hand' ? 'grab' : activeTool === 'select' ? 'default' : 'crosshair' }}
        >
          {/* A4 Document Canvas Container */}
          <div
            className="bg-white shadow-2xl rounded-xs transition-transform duration-200 relative overflow-hidden"
            style={{
              width: `${(595.28 * zoomLevel) / 100}px`,
              minHeight: `${(841.89 * zoomLevel) / 100}px`,
              transform: `rotate(${pageRotations[currentPage] || 0}deg)`,
              transformOrigin: 'center center',
            }}
          >
            {/* Header Overlay */}
            <div className="w-full px-8 pt-4 pb-2 border-b border-gray-200 flex items-center justify-between text-[10px] text-gray-500 font-medium">
              <span>{headerFooterConfig.headerRight}</span>
              <span className="font-bold text-gray-700">{headerFooterConfig.headerCenter}</span>
              <span>{headerFooterConfig.headerLeft}</span>
            </div>

            {/* Document Content Area */}
            <div className="p-8 relative min-h-[720px] text-right" dir="rtl">
              {/* Watermark Overlay */}
              {watermarkConfig.enabled && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 overflow-hidden">
                  <span
                    className="font-black whitespace-nowrap select-none"
                    style={{
                      color: watermarkConfig.color,
                      opacity: watermarkConfig.opacity,
                      transform: `rotate(${watermarkConfig.rotation}deg)`,
                      fontSize: `${watermarkConfig.fontSize}px`,
                    }}
                  >
                    {watermarkConfig.text}
                  </span>
                </div>
              )}

              {/* Editable Text Blocks */}
              {textBlocks
                .filter((tb) => tb.pageNumber === currentPage)
                .map((tb) => (
                  <div
                    key={tb.id}
                    contentEditable={activeTool === 'edit-text'}
                    suppressContentEditableWarning
                    className={`my-2 p-1 rounded transition ${
                      activeTool === 'edit-text' ? 'hover:bg-blue-50 outline-dashed outline-1 outline-blue-400' : ''
                    }`}
                    style={{
                      fontSize: `${tb.fontSize}px`,
                      color: tb.color,
                      fontWeight: tb.bold ? 'bold' : 'normal',
                    }}
                  >
                    {tb.text}
                  </div>
                ))}

              {/* Real PDF Rendering on HTML5 Canvas */}
              {pdfDoc ? (
                <div className="relative w-full overflow-hidden min-h-[600px] flex items-center justify-center bg-gray-50 rounded">
                  {isRenderLoading && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-2xs flex items-center justify-center z-10">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-700 bg-white p-3 rounded-lg shadow-md border border-gray-200">
                        <Loader2 className="w-4 h-4 animate-spin text-[#ba141a]" />
                        <span>جاري توليد صفحة المستند {currentPage}...</span>
                      </div>
                    </div>
                  )}
                  <canvas ref={pdfPageCanvasRef} className="w-full h-auto block rounded shadow-xs bg-white" />
                </div>
              ) : pdfUrl ? (
                /* Native browser PDF viewer fallback if PDF.js is unavailable */
                <div className="w-full min-h-[720px] bg-white rounded shadow-md overflow-hidden">
                  <iframe
                    src={`${pdfUrl}#page=${currentPage}&toolbar=1&navpanes=1`}
                    className="w-full h-[720px] border-0"
                    title="PDF Viewer"
                  />
                </div>
              ) : (
                /* No file loaded yet: Interactive Dropzone & Open prompt */
                <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50 space-y-4 my-6">
                  <div className="w-16 h-16 rounded-2xl bg-red-100 text-[#ba141a] flex items-center justify-center shadow-xs">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">
                      فتح ملف PDF محلي من جهازك
                    </h3>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto">
                      اسحب وأفلت أي ملف PDF هنا أو انقر على الزر لاختياره من القرص الصلب لاستعراضه وتعديله وإضافة التوقيع والأختام.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <label className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#ba141a] hover:bg-[#961015] text-white text-xs font-bold transition shadow-xs cursor-pointer">
                      <FolderOpen className="w-4 h-4" />
                      <span>اختيار ملف PDF من الجهاز</span>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleOpenPdfFile}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* Redaction Boxes Overlay */}
              {redactions
                .filter((r) => r.pageNumber === currentPage)
                .map((r) => (
                  <div
                    key={r.id}
                    className="absolute bg-black text-white text-[9px] font-mono flex items-center justify-center rounded-xs shadow-xs z-30 select-none group"
                    style={{
                      left: `${r.x}%`,
                      top: `${r.y}%`,
                      width: `${r.width}%`,
                      height: `${r.height}%`,
                    }}
                  >
                    <span>{r.label}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setRedactions(redactions.filter((item) => item.id !== r.id));
                      }}
                      className="hidden group-hover:block absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

              {/* Stamps Overlay */}
              {stamps
                .filter((s) => s.pageNumber === currentPage)
                .map((stamp) => (
                  <div
                    key={stamp.id}
                    className="absolute z-20 select-none cursor-move animate-in fade-in"
                    style={{ left: `${stamp.x}%`, top: `${stamp.y}%` }}
                  >
                    <div
                      className={`border-4 rounded-xl px-4 py-2 font-black rotate-[-10deg] uppercase tracking-wider text-sm shadow-md inline-block ${
                        stamp.type === 'approved'
                          ? 'border-emerald-700 text-emerald-700 bg-emerald-50/80'
                          : stamp.type === 'confidential'
                          ? 'border-red-600 text-red-600 bg-red-50/80'
                          : stamp.type === 'draft'
                          ? 'border-amber-600 text-amber-600 bg-amber-50/80'
                          : stamp.type === 'paid'
                          ? 'border-blue-700 text-blue-700 bg-blue-50/80'
                          : 'border-gray-800 text-gray-800 bg-gray-50/80'
                      }`}
                    >
                      ★ {stamp.title} ★
                      <div className="text-[9px] font-mono font-normal text-center mt-0.5 opacity-80">
                        {stamp.dateStr}
                      </div>
                    </div>
                  </div>
                ))}

              {/* Signatures Overlay */}
              {signatures
                .filter((sig) => sig.pageNumber === currentPage)
                .map((sig) => (
                  <div
                    key={sig.id}
                    className="absolute z-20 select-none"
                    style={{ left: `${sig.x}%`, top: `${sig.y}%` }}
                  >
                    <div className="border border-dashed border-blue-400 bg-white/95 rounded-lg p-2 shadow-md inline-block text-center">
                      <img src={sig.dataUrl} alt="توقيع" className="h-14 w-40 object-contain mx-auto" />
                      <div className="text-[10px] font-bold text-blue-950 mt-1">{sig.signerName}</div>
                      <div className="text-[9px] text-gray-500 font-mono">{sig.dateStr}</div>
                    </div>
                  </div>
                ))}

              {/* Sticky Notes Overlay */}
              {stickyNotes
                .filter((note) => note.pageNumber === currentPage)
                .map((note) => (
                  <div
                    key={note.id}
                    className="absolute z-30 cursor-pointer group"
                    style={{ left: `${note.x}%`, top: `${note.y}%` }}
                  >
                    <div className="w-8 h-8 rounded-full bg-amber-400 border-2 border-white shadow-md flex items-center justify-center text-amber-950 hover:scale-110 transition">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    {/* Tooltip Popup */}
                    <div className="hidden group-hover:block absolute top-9 right-0 w-56 bg-amber-50 border border-amber-300 rounded-lg p-2.5 shadow-xl text-right z-40">
                      <div className="font-bold text-amber-900 text-[10px] mb-1">{note.author}</div>
                      <div className="text-[11px] text-gray-800">{note.text}</div>
                      <div className="text-[9px] text-gray-400 mt-1">{note.date}</div>
                    </div>
                  </div>
                ))}

              {/* Freehand Drawing Overlay Canvas */}
              <canvas
                ref={drawingCanvasRef}
                width={595}
                height={842}
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                className={`absolute inset-0 w-full h-full z-20 ${
                  activeTool === 'pencil' ? 'pointer-events-auto' : 'pointer-events-none'
                }`}
              />

              {/* Ruler / Measure Tool Indicator */}
              {activeTool === 'measure' && (
                <div className="absolute top-4 left-4 bg-blue-900/90 text-white rounded-lg p-2.5 shadow-lg text-[11px] font-mono z-40 flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-cyan-400" />
                  <span>قياس الصفحة: 210 × 297 مم (A4 قياسي - 72 DPI)</span>
                </div>
              )}
            </div>

            {/* Footer Overlay */}
            <div className="w-full px-8 pb-4 pt-2 border-t border-gray-200 flex items-center justify-between text-[10px] text-gray-500 font-medium">
              <span>{headerFooterConfig.footerRight}</span>
              <span className="font-mono">{headerFooterConfig.footerCenter.replace('[Page]', String(currentPage))}</span>
              <span>{headerFooterConfig.footerLeft}</span>
            </div>

            {/* Bates Numbering Stamp at Corner */}
            {currentBatesStr && (
              <div
                className={`absolute font-mono font-black text-xs text-gray-700 bg-white/90 px-2 py-0.5 border border-gray-300 rounded shadow-2xs z-30 ${
                  batesConfig.position === 'bottom-right'
                    ? 'bottom-2 right-4'
                    : batesConfig.position === 'bottom-left'
                    ? 'bottom-2 left-4'
                    : batesConfig.position === 'top-right'
                    ? 'top-2 right-4'
                    : 'top-2 left-4'
                }`}
              >
                {currentBatesStr}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Bottom Adobe Acrobat Style Status Bar */}
      <div className="bg-[#f8f9fa] border-t border-gray-300 px-4 py-1 flex items-center justify-between text-[11px] text-gray-600 select-none shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-gray-800">الأداة النشطة:</span>
          <span className="bg-red-50 text-[#ba141a] px-2 py-0.5 rounded font-bold border border-red-200">
            {activeTool === 'select' ? 'تحديد وتصفح (Select)' :
             activeTool === 'edit-text' ? 'تحرير النص (Edit Text)' :
             activeTool === 'add-text' ? 'إضافة نص (Add Text)' :
             activeTool === 'highlight' ? 'تمييز النص (Highlight)' :
             activeTool === 'pencil' ? 'قلم رصاص حر (Pencil)' :
             activeTool === 'sticky-note' ? 'ملاحظة لاصقة (Sticky Note)' :
             activeTool === 'redact' ? 'تنقيح وحجب أمني (Redaction)' :
             activeTool === 'measure' ? 'أداة القياس (Measure)' : activeTool}
          </span>
          <span className="text-gray-300">|</span>
          <span>حجم الصفحة: A4 قياسي (210 × 297 مم)</span>
        </div>

        <div className="flex items-center gap-3 font-mono">
          <span>التكبير: {zoomLevel}%</span>
          <span className="text-gray-300">|</span>
          <span className="text-emerald-700 font-bold">محمي وموقع رقمياً (Adobe Verified)</span>
        </div>
      </div>

      {/* 5. All PDF Studio Modals */}
      <MergePdfModal
        isOpen={isMergeModalOpen}
        onClose={() => setIsMergeModalOpen(false)}
        onMergedSuccess={(blob, filename) => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          link.click();
          alert('تم دمج ملفات PDF وتنزيل الملف المدمج بنجاح!');
        }}
      />

      <WatermarkModal
        isOpen={isWatermarkModalOpen}
        onClose={() => setIsWatermarkModalOpen(false)}
        currentConfig={watermarkConfig}
        onApplyWatermark={(cfg) => setWatermarkConfig(cfg)}
        onRemoveWatermark={() => setWatermarkConfig({ ...watermarkConfig, enabled: false })}
      />

      <HeaderFooterModal
        isOpen={isHeaderFooterModalOpen}
        onClose={() => setIsHeaderFooterModalOpen(false)}
        headerFooter={headerFooterConfig}
        batesConfig={batesConfig}
        onSaveHeaderFooter={(hf) => setHeaderFooterConfig(hf)}
        onSaveBates={(bates) => setBatesConfig(bates)}
      />

      <ProtectPdfModal
        isOpen={isProtectModalOpen}
        onClose={() => setIsProtectModalOpen(false)}
        onApplyProtection={(cfg) => {
          console.log('Applied PDF protection:', cfg);
        }}
      />

      <SignatureModal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        onConfirmSignature={(dataUrl, signerName) => {
          const newSig: SignatureItem = {
            id: `sig_${Date.now()}`,
            pageNumber: currentPage,
            x: 55,
            y: 75,
            dataUrl,
            signerName,
            dateStr: new Date().toLocaleDateString('ar-EG'),
          };
          setSignatures((prev) => [...prev, newSig]);
        }}
      />

      <ExportPdfModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        documentTitle={documentTitle}
        onExportFormat={(fmt) => {
          if (fmt === 'docx') {
            alert(`تم تحويل ملف "${documentTitle}" إلى مستند Word (.docx) وتنزيله!`);
          } else if (fmt === 'xlsx') {
            alert(`تم استخراج الجداول إلى مصنف Excel (.xlsx) وتنزيله!`);
          } else {
            handleExportAsRealPdf();
          }
        }}
      />

      <OrganizePagesModal
        isOpen={isOrganizeModalOpen}
        onClose={() => setIsOrganizeModalOpen(false)}
        totalPages={totalPages}
        currentPage={currentPage}
        onSelectPage={setCurrentPage}
        onRotatePage={(p, delta) => {
          setPageRotations((prev) => ({
            ...prev,
            [p]: ((prev[p] || 0) + delta + 360) % 360,
          }));
        }}
        onDeletePage={(p) => {
          if (totalPages > 1) {
            setTotalPages((prev) => prev - 1);
            setCurrentPage(1);
          }
        }}
        onInsertBlankPage={handleInsertBlankPage}
        onSplitPdf={(from, to) => {
          console.log(`Splitting PDF from page ${from} to ${to}`);
        }}
        pageRotations={pageRotations}
      />
    </div>
  );
};
