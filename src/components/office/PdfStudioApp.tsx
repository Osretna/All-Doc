import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
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
  FileSpreadsheet
} from 'lucide-react';

// Initialize PDF.js worker configuration
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
} catch (e) {
  console.warn('PDF.js worker initialization:', e);
}

interface Props {
  fontFamily: string;
  initialPdfFile?: File | null;
  onPdfChange?: (file: File) => void;
}

interface AnnotationItem {
  id: string;
  type: 'stamp' | 'signature';
  pageNumber: number;
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  content: string;
}

export const PdfStudioApp: React.FC<Props> = ({ fontFamily, initialPdfFile, onPdfChange }) => {
  const [pdfFile, setPdfFile] = useState<File | null>(initialPdfFile || null);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [isLoadingPdf, setIsLoadingPdf] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // View Mode: 'native_pdf' (PDF.js high-res canvas) vs 'certificate' (official certificate layout)
  const [viewMode, setViewMode] = useState<'native_pdf' | 'certificate'>('native_pdf');

  // Annotation & Signature states
  const [showSignModal, setShowSignModal] = useState<boolean>(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [activeStamp, setActiveStamp] = useState<string>('معتمد رسمياً');
  const [notes, setNotes] = useState<string>('تمت المراجعة والاعتماد المالي بموجب محضر اجتماع اتحاد شاغلين برج النخيل لسنة 2026.');
  const [annotations, setAnnotations] = useState<AnnotationItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<number[]>([]);

  // Canvas Refs
  const pageCanvasRef = useRef<HTMLCanvasElement>(null);
  const signCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const renderTaskRef = useRef<any>(null);

  // Load PDF file into PDF.js document proxy
  const loadPdfDocument = useCallback(async (file: File) => {
    setIsLoadingPdf(true);
    setLoadError(null);
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
      setViewMode('native_pdf');
      setIsLoadingPdf(false);
    } catch (err: any) {
      console.error('Failed to load PDF with PDF.js:', err);
      setLoadError(err?.message || 'تعذر فك تشفير وتوليد صفحات ملف PDF.');
      setIsLoadingPdf(false);
    }
  }, []);

  // Sync external pdf file
  useEffect(() => {
    if (initialPdfFile) {
      setPdfFile(initialPdfFile);
      loadPdfDocument(initialPdfFile);
    }
  }, [initialPdfFile, loadPdfDocument]);

  // Render current PDF page to HTML5 Canvas
  useEffect(() => {
    if (!pdfDoc || viewMode !== 'native_pdf') return;

    let isCancelled = false;

    const renderPage = async () => {
      try {
        if (renderTaskRef.current) {
          try {
            renderTaskRef.current.cancel();
          } catch (e) {
            // ignore cancel error
          }
        }

        const page = await pdfDoc.getPage(currentPage);
        if (isCancelled) return;

        const canvas = pageCanvasRef.current;
        if (!canvas) return;

        const scale = (zoomLevel / 100) * (window.devicePixelRatio > 1 ? 1.5 : 1.2);
        const viewport = page.getViewport({ scale, rotation });

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const renderContext = {
          canvasContext: ctx,
          viewport: viewport,
          canvas: canvas,
        };

        const task = page.render(renderContext);
        renderTaskRef.current = task;
        await task.promise;
      } catch (err: any) {
        if (err?.name !== 'RenderingCancelledException') {
          console.error('Error rendering page:', err);
        }
      }
    };

    renderPage();

    return () => {
      isCancelled = true;
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [pdfDoc, currentPage, zoomLevel, rotation, viewMode]);

  // Handle local PDF file upload
  const handleOpenPdfFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      alert('يرجى اختيار ملف بصيغة PDF (.pdf).');
      return;
    }

    setPdfFile(file);
    onPdfChange?.(file);
    loadPdfDocument(file);
  };

  // Stamp current PDF page
  const handleAddStampToPage = () => {
    if (!activeStamp) return;
    const newAnnot: AnnotationItem = {
      id: `stamp_${Date.now()}`,
      type: 'stamp',
      pageNumber: currentPage,
      x: 75,
      y: 15,
      content: activeStamp,
    };
    setAnnotations((prev) => [...prev, newAnnot]);
  };

  // Place signature on current PDF page
  const handleAddSignatureToPage = () => {
    if (!signatureData) {
      setShowSignModal(true);
      return;
    }
    const newAnnot: AnnotationItem = {
      id: `sig_${Date.now()}`,
      type: 'signature',
      pageNumber: currentPage,
      x: 70,
      y: 80,
      content: signatureData,
    };
    setAnnotations((prev) => [...prev, newAnnot]);
  };

  // Remove annotation
  const handleRemoveAnnotation = (id: string) => {
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
  };

  // Search inside PDF document
  const handleSearchPdf = async () => {
    if (!pdfDoc || !searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const matches: number[] = [];
    const q = searchQuery.toLowerCase();

    for (let p = 1; p <= pdfDoc.numPages; p++) {
      const page = await pdfDoc.getPage(p);
      const textContent = await page.getTextContent();
      const fullText = textContent.items
        .map((item: any) => item.str || '')
        .join(' ')
        .toLowerCase();

      if (fullText.includes(q)) {
        matches.push(p);
      }
    }

    setSearchResults(matches);
    if (matches.length > 0) {
      setCurrentPage(matches[0]);
    } else {
      alert(`لم يتم العثور على نتائج للبحث عن "${searchQuery}" داخل المستند.`);
    }
  };

  // Drawing Pad for Live Signature
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = signCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = signCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#003366';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = signCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignature = () => {
    const canvas = signCanvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL();
    setSignatureData(dataUrl);
    setShowSignModal(false);

    // If currently in native PDF view, place it onto the page
    if (viewMode === 'native_pdf') {
      const newAnnot: AnnotationItem = {
        id: `sig_${Date.now()}`,
        type: 'signature',
        pageNumber: currentPage,
        x: 65,
        y: 80,
        content: dataUrl,
      };
      setAnnotations((prev) => [...prev, newAnnot]);
    }
  };

  const downloadCurrentPdf = () => {
    if (pdfFile) {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(pdfFile);
      link.download = pdfFile.name;
      link.click();
    } else {
      window.print();
    }
  };

  // Annotations on current page
  const currentPageAnnotations = annotations.filter((a) => a.pageNumber === currentPage);

  return (
    <div className="flex-1 flex flex-col bg-[#383b3d] overflow-hidden text-xs select-none">
      {/* 1. Adobe Acrobat Dark Authentic Ribbon / Toolbar */}
      <div className="bg-[#242628] text-white px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between border-b border-black/40 shadow-md gap-2 shrink-0 z-20">
        {/* Left: Acrobat Logo & Document Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-[#e11d48] text-white flex items-center justify-center font-black text-xs shadow-xs">
            PDF
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-sm">
              <span className="truncate max-w-[200px] sm:max-w-xs text-white">
                {pdfFile ? pdfFile.name : 'تقرير_معتمد_ملاك_2026.pdf'}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700">
                سيادي 100%
              </span>
            </div>
            <span className="text-[10px] text-gray-400">
              Adobe Acrobat Desktop Experience | {pdfFile ? `${(pdfFile.size / 1024).toFixed(1)} KB` : 'مستند مالي معتمد'}
            </span>
          </div>
        </div>

        {/* Center: View Switcher (Native PDF.js Viewer vs Official Certificate) */}
        <div className="flex items-center gap-1 bg-[#1a1b1c] p-0.5 rounded-lg border border-gray-700">
          <button
            onClick={() => setViewMode('native_pdf')}
            className={`px-2.5 py-1 rounded text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'native_pdf' ? 'bg-[#e11d48] text-white shadow-xs' : 'text-gray-300 hover:text-white'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>مستعرض PDF الأصلي</span>
          </button>

          <button
            onClick={() => setViewMode('certificate')}
            className={`px-2.5 py-1 rounded text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'certificate' ? 'bg-[#e11d48] text-white shadow-xs' : 'text-gray-300 hover:text-white'
            }`}
          >
            <Stamp className="w-3.5 h-3.5" />
            <span>شهادة الاعتماد والتوقيع</span>
          </button>
        </div>

        {/* Right: Actions (Open PDF from device, Sign, Stamp, Print, Download) */}
        <div className="flex items-center gap-2">
          {/* Direct Device PDF File Opener */}
          <label className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer transition border border-white/10 shadow-xs">
            <FolderOpen className="w-3.5 h-3.5 text-red-400" />
            <span>فتح ملف PDF من جهازك</span>
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleOpenPdfFile}
            />
          </label>

          <button
            onClick={() => setShowSignModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer transition shadow-xs"
            title="رسم توقيع إلكتروني حي واعتماده على المستند"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>توقيع حي</span>
          </button>

          {/* Stamp selector */}
          <div className="flex items-center gap-1 bg-[#1a1b1c] rounded-lg p-0.5 border border-gray-700">
            <select
              value={activeStamp}
              onChange={(e) => setActiveStamp(e.target.value)}
              className="bg-transparent text-white px-2 py-1 text-xs outline-none cursor-pointer"
              title="اختيار الختم الرسمي"
            >
              <option value="معتمد رسمياً" className="bg-[#1a1b1c]">ختم: معتمد رسمياً ★</option>
              <option value="صورة طبق الأصل" className="bg-[#1a1b1c]">ختم: صورة طبق الأصل ✓</option>
              <option value="تم التدقيق والمراجعة" className="bg-[#1a1b1c]">ختم: تم التدقيق والمراجعة</option>
              <option value="سري للغاية" className="bg-[#1a1b1c]">ختم: سري للغاية 🔒</option>
              <option value="مدفوع بالكامل" className="bg-[#1a1b1c]">ختم: مدفوع بالكامل 💰</option>
            </select>
            {viewMode === 'native_pdf' && (
              <button
                onClick={handleAddStampToPage}
                className="px-2 py-1 bg-red-600 hover:bg-red-500 rounded text-white text-[11px] font-bold cursor-pointer"
                title="إضافة الختم على الصفحة الحالية"
              >
                + ختم
              </button>
            )}
          </div>

          <button
            onClick={() => window.print()}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer transition"
            title="طباعة المستند"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={downloadCurrentPdf}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer transition shadow-xs"
            title="تنزيل ملف PDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">تنزيل PDF</span>
          </button>
        </div>
      </div>

      {/* 2. Secondary Sub-Toolbar (PDF Controls: Page Navigation, Zoom, Rotate, Search) */}
      {viewMode === 'native_pdf' && pdfDoc && (
        <div className="bg-[#2d3032] text-gray-200 px-4 py-1.5 flex items-center justify-between border-b border-black/30 shrink-0 select-none text-xs">
          {/* Page Navigator */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage <= 1}
              className="p-1 rounded hover:bg-white/10 disabled:opacity-30 cursor-pointer"
              title="الصفحة السابقة"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1 font-mono text-xs">
              <input
                type="number"
                min={1}
                max={totalPages}
                value={currentPage}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (val >= 1 && val <= totalPages) setCurrentPage(val);
                }}
                className="w-10 bg-[#1a1b1c] border border-gray-600 rounded text-center py-0.5 text-white outline-none"
              />
              <span className="text-gray-400">/ {totalPages}</span>
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage >= totalPages}
              className="p-1 rounded hover:bg-white/10 disabled:opacity-30 cursor-pointer"
              title="الصفحة التالية"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Search inside Document */}
          <div className="flex items-center gap-1 bg-[#1a1b1c] rounded-lg px-2 py-0.5 border border-gray-700">
            <Search className="w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="بحث في نصوص الـ PDF..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchPdf()}
              className="bg-transparent text-white text-xs outline-none w-32 sm:w-44 placeholder-gray-500"
            />
            <button
              onClick={handleSearchPdf}
              className="text-[10px] bg-red-600 hover:bg-red-500 text-white px-1.5 py-0.5 rounded cursor-pointer font-bold"
            >
              بحث
            </button>
          </div>

          {/* Zoom and Rotation */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setZoomLevel((z) => Math.max(z - 15, 40))}
                className="p-1 rounded hover:bg-white/10 cursor-pointer"
                title="تصغير"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-xs text-gray-300 w-12 text-center">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 15, 250))}
                className="p-1 rounded hover:bg-white/10 cursor-pointer"
                title="تكبير"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(100)}
                className="px-1.5 py-0.5 rounded bg-gray-700 hover:bg-gray-600 text-[10px] cursor-pointer"
              >
                100%
              </button>
            </div>

            <button
              onClick={() => setRotation((r) => (r + 90) % 360)}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-gray-700 hover:bg-gray-600 text-xs cursor-pointer"
              title="تدوير الصفحة 90 درجة"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>تدوير</span>
            </button>

            {signatureData && (
              <button
                onClick={handleAddSignatureToPage}
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold cursor-pointer shadow-xs"
              >
                <PenTool className="w-3 h-3" />
                <span>+ وضع التوقيع</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* NATIVE PDF MODE */}
        {viewMode === 'native_pdf' ? (
          <div className="flex-1 overflow-auto bg-[#525659] p-4 sm:p-8 flex flex-col items-center justify-start relative">
            {isLoadingPdf && (
              <div className="absolute inset-0 bg-[#525659]/80 z-30 flex flex-col items-center justify-center text-white">
                <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                <p className="font-bold text-sm">جاري معالجة ورسم صفحات PDF عالية الدقة...</p>
              </div>
            )}

            {loadError && (
              <div className="w-full max-w-xl p-4 bg-red-950/80 border border-red-700 rounded-xl text-white flex items-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-red-400 shrink-0" />
                <div>
                  <h4 className="font-bold">تعذر عرض ملف PDF</h4>
                  <p className="text-xs text-red-200 mt-1">{loadError}</p>
                </div>
              </div>
            )}

            {/* If no PDF loaded yet, show intuitive Acrobat Dropzone Banner */}
            {!pdfDoc && !isLoadingPdf && (
              <div className="w-full max-w-2xl mt-8 p-8 rounded-2xl bg-[#2a2c2e] border-2 border-dashed border-red-500/50 text-white flex flex-col items-center text-center gap-4 shadow-2xl">
                <div className="w-16 h-16 rounded-2xl bg-red-600/20 text-red-400 flex items-center justify-center">
                  <Upload className="w-8 h-8 animate-bounce" />
                </div>
                <div>
                  <h3 className="font-black text-lg">فتح واستعراض أي مستند PDF محلياً</h3>
                  <p className="text-xs text-gray-400 mt-1 max-w-md">
                    يتم رسم وتوليد صفحات الـ PDF مباشرة بدقة فائقة وبدون أي سيرفرات أو أخطاء المتصفح، مع إمكانية التوقيع والختم والتنزيل.
                  </p>
                </div>

                <label className="bg-[#e11d48] hover:bg-[#be123c] text-white px-6 py-2.5 rounded-xl font-bold text-sm cursor-pointer transition shadow-lg flex items-center gap-2">
                  <FolderOpen className="w-5 h-5" />
                  <span>استعراض ملف PDF من جهازك</span>
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={handleOpenPdfFile}
                  />
                </label>

                <button
                  onClick={() => setViewMode('certificate')}
                  className="text-xs text-gray-400 hover:text-white underline mt-2"
                >
                  أو الانتقال إلى قالب "شهادة الاعتماد والتوقيع الجاهزة" ➔
                </button>
              </div>
            )}

            {/* High-Resolution Rendered PDF Canvas Container */}
            {pdfDoc && (
              <div className="relative shadow-2xl rounded-lg bg-white border border-gray-700 overflow-hidden select-none">
                <canvas
                  ref={pageCanvasRef}
                  className="block max-w-full"
                />

                {/* Overlaid Page Annotations (Stamps & Signatures) */}
                {currentPageAnnotations.map((annot) => (
                  <div
                    key={annot.id}
                    style={{
                      left: `${annot.x}%`,
                      top: `${annot.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    className="absolute z-20 group cursor-move select-none"
                  >
                    {annot.type === 'stamp' ? (
                      <div className="border-4 border-red-600 rounded-xl px-4 py-2 font-black text-red-600 rotate-[-8deg] uppercase tracking-wider text-xs shadow-md bg-white/80 backdrop-blur-2xs">
                        ★ {annot.content} ★
                        <button
                          onClick={() => handleRemoveAnnotation(annot.id)}
                          className="hidden group-hover:block absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-0.5 shadow-sm"
                          title="إزالة الختم"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-blue-500 rounded p-1 bg-white/90 shadow-lg">
                        <img src={annot.content} alt="توقيع" className="h-14 w-36 object-contain" />
                        <button
                          onClick={() => handleRemoveAnnotation(annot.id)}
                          className="hidden group-hover:block absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-0.5 shadow-sm"
                          title="إزالة التوقيع"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* CERTIFICATE / ANNOTATION VIEW */
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col items-center justify-start bg-[#525659]">
            {/* Document Sheet (High-Resolution A4 Layout) */}
            <div className="w-full max-w-3xl bg-white rounded-lg shadow-2xl p-8 sm:p-14 text-right text-gray-900 relative min-h-[750px] flex flex-col justify-between border border-gray-300">
              {/* Document Header */}
              <div>
                <div className="flex items-center justify-between border-b-2 border-red-600 pb-4 mb-6">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black text-gray-900">شهادة اعتماد سند الصرف والميزانية السيادية</h1>
                    <p className="text-xs text-gray-500 mt-1">نظام ملاك لإدارة العقارات واتحادات الشاغلين - MY-DOC Office</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-black text-xl shadow-xs">
                    PDF
                  </div>
                </div>

                {/* Document Content */}
                <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-gray-700">
                  <p>
                    <strong>رقم الاعتماد:</strong> CERT-MLK-8890 | <strong>تاريخ الإصدار:</strong> {new Date().toLocaleDateString('ar-EG')}
                  </p>
                  <p>
                    يشهد مجلس إدارة اتحاد شاغلين <strong>برج النخيل السكني والتقني</strong> بأنه قد تمت مراجعة كافة الفواتير وسندات الصرف الخاصة بأعمال صيانة المصاعد والإنارة والتشغيل وسيرفرات الاستضافة للشهر الحالي، وقد تم إيداع المبالغ في الحساب البنكي المعتمد للاتحاد.
                  </p>

                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-2 font-cairo">
                    <div className="flex justify-between font-bold">
                      <span>إجمالي إيرادات اشتراكات الشاغلين:</span>
                      <span className="text-emerald-700 font-mono">18,500 ر.س</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>إجمالي مصروفات الصيانة والحراسة:</span>
                      <span className="text-red-700 font-mono">6,270 ر.س</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>اشتراك استضافة السيرفر السحابي (VPS ZFS):</span>
                      <span className="text-blue-700 font-mono">450 ر.س</span>
                    </div>
                    <div className="flex justify-between font-bold pt-2 border-t border-gray-200 text-blue-900">
                      <span>الفائض المرحل لحساب الطوارئ والاحتياطي:</span>
                      <span className="font-mono">11,780 ر.س</span>
                    </div>
                  </div>

                  {/* Note / Annotation */}
                  <div className="p-3 bg-amber-50 border-r-4 border-amber-500 rounded text-amber-900 text-xs">
                    <strong>ملاحظة رئيس المجلس والمدقق:</strong> {notes}
                  </div>
                </div>
              </div>

              {/* Stamps & Signature Section */}
              <div className="pt-8 border-t border-gray-200 flex items-end justify-between mt-8">
                {/* Stamp Badge */}
                <div>
                  {activeStamp && (
                    <div className="border-4 border-red-600 rounded-xl px-4 py-2 font-black text-red-600 rotate-[-8deg] uppercase tracking-wider text-sm shadow-sm inline-block select-none animate-in fade-in">
                      ★ {activeStamp} ★
                      <div className="text-[9px] font-mono font-normal text-center text-red-500 mt-0.5">
                        {new Date().toLocaleDateString('en-US')}
                      </div>
                    </div>
                  )}
                </div>

                {/* Signature Box */}
                <div className="text-center">
                  <span className="text-xs text-gray-500 block mb-1">توقيع رئيس مجلس الإدارة والمدقق المعتمد:</span>
                  {signatureData ? (
                    <div className="border border-dashed border-gray-300 rounded p-1 inline-block bg-white shadow-xs">
                      <img src={signatureData} alt="التوقيع الرقمي" className="h-16 w-44 object-contain" />
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowSignModal(true)}
                      className="px-4 py-2 border-2 border-dashed border-blue-400 rounded-lg text-blue-600 font-bold hover:bg-blue-50 text-xs cursor-pointer transition shadow-2xs"
                    >
                      + انقر هنا لإضافة التوقيع الرقمي الحي
                    </button>
                  )}
                  <span className="block text-[10px] text-gray-400 mt-1">توقيع رقمي سيادي مشفر محلياً</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Electronic Signature Canvas Modal */}
      {showSignModal && (
        <div className="fixed inset-0 z-[150] bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6 text-right">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <PenTool className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-gray-900 text-base">رسم التوقيع الإلكتروني الحي</h3>
              </div>
              <button
                onClick={() => setShowSignModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-500 my-2.5">
              ارسم توقيعك بالفأرة على الحاسوب أو بإصبعك على شاشة اللمس للهاتف المحمول:
            </p>

            {/* Canvas */}
            <canvas
              ref={signCanvasRef}
              width={380}
              height={160}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-40 bg-gray-50 border-2 border-dashed border-blue-400 rounded-lg cursor-crosshair touch-none shadow-inner"
            />

            <div className="flex items-center justify-between mt-4">
              <button
                onClick={clearSignature}
                className="flex items-center gap-1 text-xs text-gray-600 hover:text-red-600 p-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>مسح وإعادة الرسم</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowSignModal(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-gray-300 text-xs text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  onClick={saveSignature}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 cursor-pointer shadow-xs"
                >
                  اعتماد التوقيع
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
