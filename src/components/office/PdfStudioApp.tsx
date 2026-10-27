import React, { useState, useRef, useEffect } from 'react';
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
  Sparkles
} from 'lucide-react';

interface Props {
  fontFamily: string;
  initialPdfFile?: File | null;
  onPdfChange?: (file: File) => void;
}

export const PdfStudioApp: React.FC<Props> = ({ fontFamily, initialPdfFile, onPdfChange }) => {
  const [pdfFile, setPdfFile] = useState<File | null>(initialPdfFile || null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'native_pdf' | 'certificate'>('certificate');

  // Annotation & Signature states
  const [showSignModal, setShowSignModal] = useState<boolean>(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [activeStamp, setActiveStamp] = useState<string | null>('معتمد رسمياً');
  const [notes, setNotes] = useState<string>('تمت المراجعة والاعتماد المالي بموجب محضر اجتماع اتحاد شاغلين برج النخيل لسنة 2026.');
  const [rotation, setRotation] = useState<number>(0);

  const signCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Sync external pdf file
  useEffect(() => {
    if (initialPdfFile) {
      setPdfFile(initialPdfFile);
      const url = URL.createObjectURL(initialPdfFile);
      setPdfBlobUrl(url);
      setViewMode('native_pdf');
      return () => URL.revokeObjectURL(url);
    }
  }, [initialPdfFile]);

  // Handle local PDF file upload
  const handleOpenPdfFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      alert('يرجى اختيار ملف بصيغة PDF (.pdf).');
      return;
    }

    if (pdfBlobUrl) {
      URL.revokeObjectURL(pdfBlobUrl);
    }

    const url = URL.createObjectURL(file);
    setPdfFile(file);
    setPdfBlobUrl(url);
    setViewMode('native_pdf');
    onPdfChange?.(file);
  };

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
    setSignatureData(canvas.toDataURL());
    setShowSignModal(false);
  };

  const downloadCurrentPdf = () => {
    if (pdfBlobUrl && pdfFile) {
      const link = document.createElement('a');
      link.href = pdfBlobUrl;
      link.download = pdfFile.name;
      link.click();
    } else {
      window.print();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#383b3d] overflow-hidden text-xs select-none">
      {/* 1. Adobe Acrobat Authentic Dark Ribbon / Toolbar */}
      <div className="bg-[#242628] text-white px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between border-b border-black/40 shadow-md gap-2 shrink-0 z-20">
        {/* Left: Acrobat Logo & Document Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-[#e11d48] text-white flex items-center justify-center font-black text-xs shadow-xs">
            PDF
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-sm">
              <span className="truncate max-w-[200px] sm:max-w-xs">
                {pdfFile ? pdfFile.name : 'محضر_اعتماد_ملاك_والاستضافة_2026.pdf'}
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

        {/* Center: View Switcher (Native PDF View vs Official Certificate & Signatures) */}
        <div className="flex items-center gap-1 bg-[#1a1b1c] p-0.5 rounded-lg border border-gray-700">
          <button
            onClick={() => setViewMode('certificate')}
            className={`px-2.5 py-1 rounded text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
              viewMode === 'certificate' ? 'bg-[#e11d48] text-white shadow-xs' : 'text-gray-300 hover:text-white'
            }`}
          >
            <Stamp className="w-3.5 h-3.5" />
            <span>شهادة الاعتماد والتوقيع</span>
          </button>

          {pdfBlobUrl && (
            <button
              onClick={() => setViewMode('native_pdf')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                viewMode === 'native_pdf' ? 'bg-[#e11d48] text-white shadow-xs' : 'text-gray-300 hover:text-white'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>مستعرض ملف PDF الأصلي</span>
            </button>
          )}
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
            title="رسم توقيع إلكتروني واعتماده على المستند"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>توقيع حي</span>
          </button>

          {/* Stamp selector */}
          <select
            value={activeStamp || ''}
            onChange={(e) => setActiveStamp(e.target.value || null)}
            className="bg-[#1a1b1c] border border-gray-700 text-white rounded-lg px-2 py-1 text-xs outline-none cursor-pointer focus:border-red-500"
            title="اختيار الختم الرسمي"
          >
            <option value="معتمد رسمياً">ختم: معتمد رسمياً ★</option>
            <option value="صورة طبق الأصل">ختم: صورة طبق الأصل ✓</option>
            <option value="تم التدقيق والمراجعة">ختم: تم التدقيق والمراجعة</option>
            <option value="سري للغاية">ختم: سري للغاية 🔒</option>
            <option value="مدفوع بالكامل">ختم: مدفوع بالكامل 💰</option>
          </select>

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

      {/* 2. Main Workspace Canvas / PDF Viewer */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* If Native PDF mode and pdfBlobUrl is loaded */}
        {viewMode === 'native_pdf' && pdfBlobUrl ? (
          <div className="flex-1 w-full h-full bg-[#525659] p-2 sm:p-4 flex flex-col items-center justify-center">
            <iframe
              src={pdfBlobUrl}
              className="w-full h-full max-w-5xl rounded-lg shadow-2xl bg-white border border-gray-700"
              title="Acrobat Native PDF Viewer"
            />
          </div>
        ) : (
          /* Certificate / Annotation View */
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col items-center justify-start bg-[#525659]">
            {/* If no user PDF loaded yet, show intuitive Acrobat Dropzone Banner */}
            {!pdfBlobUrl && (
              <div className="w-full max-w-3xl mb-4 p-4 rounded-xl bg-[#2a2c2e] border-2 border-dashed border-red-500/50 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center">
                    <Upload className="w-5 h-5 animate-bounce" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">استعراض أي ملف PDF من جهاز الكمبيوتر أو الهاتف</h4>
                    <p className="text-[11px] text-gray-400">
                      قراءة كاملة لكافة صفحات ومخططات ملفات PDF وتطبيق التوقيعات الرقمية والأختام الرسمية محلياً.
                    </p>
                  </div>
                </div>
                <label className="bg-[#e11d48] hover:bg-[#be123c] text-white px-4 py-2 rounded-lg font-bold text-xs cursor-pointer transition shadow-md shrink-0 flex items-center gap-2">
                  <FolderOpen className="w-4 h-4" />
                  <span>اختيار ملف PDF محلي</span>
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={handleOpenPdfFile}
                  />
                </label>
              </div>
            )}

            {/* Document Sheet (High-Resolution A4 Layout) */}
            <div className="w-full max-w-3xl bg-white rounded-lg shadow-2xl p-8 sm:p-14 text-right text-gray-900 relative min-h-[750px] flex flex-col justify-between border border-gray-300">
              {/* Document Header */}
              <div>
                <div className="flex items-center justify-between border-b-2 border-red-600 pb-4 mb-6">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black text-gray-900">شهادة اعتماد سند الصرف والميزانية السيادية</h1>
                    <p className="text-xs text-gray-500 mt-1">نظام ملاك لإدارة العقارات واتحادات الشاغلين - استضافة إنفينيتي تكنولوجي</p>
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

      {/* 3. Electronic Signature Canvas Modal */}
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
