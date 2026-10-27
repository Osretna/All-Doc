import React, { useState, useRef } from 'react';
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
  Building2
} from 'lucide-react';

interface Props {
  fontFamily: string;
}

export const PdfStudioApp: React.FC<Props> = ({ fontFamily }) => {
  const [showSignModal, setShowSignModal] = useState<boolean>(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [activeStamp, setActiveStamp] = useState<string | null>('معتمد رسمياً');
  const [notes, setNotes] = useState<string>('تمت المراجعة والاعتماد بموجب محضر اجتماع اتحاد الشاغلين رقم 44 لسنة 2026.');

  const signCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

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

  return (
    <div className="flex-1 flex flex-col bg-[#525659] overflow-y-auto text-xs select-none">
      {/* Top Acrobat Toolbar */}
      <div className="bg-[#323639] text-white px-4 py-2 flex items-center justify-between border-b border-black/30 shadow-md">
        <div className="flex items-center gap-2">
          <FileCheck2 className="w-5 h-5 text-red-500" />
          <span className="font-bold text-sm">Infinity PDF Studio (Acrobat Sovereign)</span>
          <span className="text-gray-400">|</span>
          <span className="text-gray-300">محضر_اعتماد_ملاك_2026.pdf</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSignModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer transition shadow"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>توقيع إلكتروني</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white cursor-pointer transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>طباعة</span>
          </button>
        </div>
      </div>

      {/* Main Document Preview Canvas */}
      <div className="flex-1 p-6 sm:p-10 flex justify-center items-start">
        <div className="w-full max-w-3xl bg-white rounded shadow-2xl p-10 sm:p-14 text-right text-gray-900 relative min-h-[700px] flex flex-col justify-between">
          {/* Document Header */}
          <div>
            <div className="flex items-center justify-between border-b-2 border-red-600 pb-4 mb-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-gray-900">شهادة اعتماد سند الصرف والميزانية</h1>
                <p className="text-xs text-gray-500 mt-1">نظام ملاك لإدارة اتحادات الملاك والعقارات</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-black text-xl">
                PDF
              </div>
            </div>

            {/* Document Content */}
            <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-gray-700">
              <p>
                <strong>رقم الاعتماد:</strong> CERT-MLK-8890 | <strong>تاريخ الإصدار:</strong> 2026-10-26
              </p>
              <p>
                يشهد مجلس إدارة اتحاد شاغلين <strong>برج النخيل السكني</strong> بأنه قد تمت مراجعة كافة الفواتير وسندات الصرف الخاصة بأعمال صيانة المصاعد والإنارة والتشغيل للشهر الحالي، وقد تم إيداع المبالغ في الحساب البنكي المعتمد للاتحاد.
              </p>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
                <div className="flex justify-between font-bold">
                  <span>إجمالي إيرادات اشتراكات الشاغلين:</span>
                  <span className="text-emerald-700 font-mono">18,500 ر.س</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>إجمالي مصروفات الصيانة والحراسة:</span>
                  <span className="text-red-700 font-mono">6,270 ر.س</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t border-gray-200 text-blue-900">
                  <span>الفائض المرحل لحساب الطوارئ:</span>
                  <span className="font-mono">12,230 ر.س</span>
                </div>
              </div>

              {/* Note / Annotation */}
              <div className="p-3 bg-amber-50 border-r-4 border-amber-500 rounded text-amber-900 text-xs">
                <strong>ملاحظة رئيس الاتحاد:</strong> {notes}
              </div>
            </div>
          </div>

          {/* Stamps & Signature Section */}
          <div className="pt-8 border-t border-gray-200 flex items-end justify-between mt-8">
            {/* Stamp Badge */}
            <div>
              {activeStamp && (
                <div className="border-4 border-red-600 rounded-xl px-4 py-2 font-black text-red-600 rotate-[-8deg] uppercase tracking-wider text-sm shadow-xs inline-block">
                  ★ {activeStamp} ★
                </div>
              )}
            </div>

            {/* Signature Box */}
            <div className="text-center">
              <span className="text-xs text-gray-500 block mb-1">توقيع رئيس مجلس الإدارة المعتمد:</span>
              {signatureData ? (
                <div className="border border-dashed border-gray-300 rounded p-1 inline-block bg-white">
                  <img src={signatureData} alt="التوقيع الرقمي" className="h-16 w-44 object-contain" />
                </div>
              ) : (
                <button
                  onClick={() => setShowSignModal(true)}
                  className="px-4 py-2 border-2 border-dashed border-blue-400 rounded-lg text-blue-600 font-bold hover:bg-blue-50 text-xs cursor-pointer"
                >
                  + انقر هنا لإضافة التوقيع الرقمي
                </button>
              )}
              <span className="block text-[10px] text-gray-400 mt-1">توقيع مشفر بالمعايير السيادية</span>
            </div>
          </div>
        </div>
      </div>

      {/* Signature Modal */}
      {showSignModal && (
        <div className="fixed inset-0 z-[150] bg-black/70 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6 text-right">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <h3 className="font-bold text-gray-900 text-base">رسم التوقيع الإلكتروني الحي</h3>
              <button onClick={() => setShowSignModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-500 my-2">ارسم توقيعك بالفأرة أو بإصبعك على شاشة اللمس للهاتف أو الحاسوب:</p>

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
              className="w-full h-40 bg-gray-50 border-2 border-dashed border-blue-300 rounded-lg cursor-crosshair touch-none"
            />

            <div className="flex items-center justify-between mt-4">
              <button
                onClick={clearSignature}
                className="flex items-center gap-1 text-xs text-gray-600 hover:text-red-600 p-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>مسح وإعادة الرسم</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowSignModal(false)}
                  className="px-3 py-1.5 rounded border border-gray-300 text-xs text-gray-700"
                >
                  إلغاء
                </button>
                <button
                  onClick={saveSignature}
                  className="px-4 py-1.5 rounded bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
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
