import React, { useState, useRef } from 'react';
import { FileText, Highlighter, PenTool, Download, Printer, Plus, Trash2 } from 'lucide-react';

export const PdfApp: React.FC = () => {
  const [annotations, setAnnotations] = useState<{ id: string; text: string; x: number; y: number }[]>([]);
  const [activeTool, setActiveTool] = useState<'text' | 'signature'>('text');
  const sigCanvasRef = useRef<HTMLCanvasElement>(null);

  const addNote = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTool !== 'text') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const text = prompt('أدخل نص الملاحظة أو التعليق على مستند PDF:', 'ملاحظة معتمدة');
    if (text) {
      setAnnotations(prev => [...prev, { id: `note_${Date.now()}`, text, x, y }]);
    }
  };

  const clearSignature = () => {
    const cvs = sigCanvasRef.current;
    if (cvs) {
      const ctx = cvs.getContext('2d');
      ctx?.clearRect(0, 0, cvs.width, cvs.height);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-200 select-none">
      {/* PDF Ribbon */}
      <div className="bg-[#f3f2f1] border-b border-gray-300 p-2 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTool('text')}
            className={`px-3 py-1.5 rounded font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTool === 'text' ? 'bg-[#e81123] text-white' : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300'
            }`}
          >
            <Highlighter className="w-4 h-4" />
            <span>إضافة تعليق وملاحظة</span>
          </button>

          <button
            onClick={() => setActiveTool('signature')}
            className={`px-3 py-1.5 rounded font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTool === 'signature' ? 'bg-[#e81123] text-white' : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300'
            }`}
          >
            <PenTool className="w-4 h-4" />
            <span>توقيع إلكتروني</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-300 rounded font-bold cursor-pointer text-xs"
          >
            <Printer className="w-4 h-4 text-gray-700" />
            <span>طباعة PDF</span>
          </button>
        </div>
      </div>

      {/* PDF Page Stage */}
      <div className="flex-1 overflow-auto p-8 flex justify-center">
        <div
          onClick={addNote}
          className="w-[600px] min-h-[850px] bg-white rounded shadow-2xl p-12 border border-gray-300 relative cursor-crosshair text-gray-900 flex flex-col justify-between"
        >
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b-2 border-red-600 pb-3">
              <div>
                <h1 className="text-2xl font-black text-gray-900">مستند رسمي معتمد (PDF)</h1>
                <p className="text-xs text-gray-500">MY-DOC PDF Sovereign Acrobat Engine 2026</p>
              </div>
              <div className="text-right text-xs font-mono text-gray-400">
                REF-2026-SOV-01
              </div>
            </div>

            <div className="text-sm leading-relaxed space-y-4 text-gray-700 text-justify">
              <p>
                تم إنشاء هذا المستند الرسمي والمصادقة عليه عبر الجناح المكتبي السيادي. يتيح لك التطبيق تظليل النصوص، وإضافة الشروحات التوضيحية، وتثبيت التوقيعات الرقمية المعتمدة محلياً بدون إرسال أي بايت واحد لخوادم خارجية.
              </p>
              <p>
                انقر في أي مكان داخل هذه الصفحة لإضافة تعليق أو تظليل تفاعلي.
              </p>
            </div>
          </div>

          {/* Render annotations */}
          {annotations.map(ann => (
            <div
              key={ann.id}
              className="absolute bg-amber-100 border border-amber-400 text-amber-900 px-2 py-1 rounded text-xs shadow-md font-bold flex items-center gap-1 z-20"
              style={{ left: ann.x, top: ann.y }}
            >
              <span>{ann.text}</span>
              <button
                onClick={e => {
                  e.stopPropagation();
                  setAnnotations(prev => prev.filter(a => a.id !== ann.id));
                }}
                className="text-red-500 hover:text-red-700 ml-1"
              >
                ×
              </button>
            </div>
          ))}

          {/* Signature Box */}
          <div className="mt-8 pt-4 border-t border-gray-300 flex justify-between items-end">
            <div>
              <div className="text-[11px] text-gray-400 mb-1">توقيع المسؤول والاعتماد:</div>
              <canvas
                ref={sigCanvasRef}
                width={200}
                height={80}
                className="border border-dashed border-gray-400 rounded bg-gray-50"
              />
              <button
                onClick={clearSignature}
                className="text-[10px] text-red-600 hover:underline block mt-0.5"
              >
                مسح التوقيع
              </button>
            </div>
            <div className="text-xs text-gray-400 text-left font-mono">
              تاريخ الاعتماد: {new Date().toLocaleDateString('ar-EG')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
