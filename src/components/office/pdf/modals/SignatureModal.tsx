import React, { useState, useRef } from 'react';
import { X, PenTool, Type, Upload, RotateCcw, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSignature: (dataUrl: string, signerName: string) => void;
}

export const SignatureModal: React.FC<Props> = ({ isOpen, onClose, onConfirmSignature }) => {
  const [mode, setMode] = useState<'draw' | 'type' | 'upload'>('draw');
  const [typedName, setTypedName] = useState('م. خالد الشهري');
  const [signerTitle, setSignerTitle] = useState('المفوض بالتوقيع والاعتماد');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  if (!isOpen) return null;

  // Drawing helpers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#1e3a8a'; // Dark blue signature ink
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onConfirmSignature(event.target.result as string, signerTitle);
        onClose();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApply = () => {
    if (mode === 'draw') {
      const canvas = canvasRef.current;
      if (!canvas || !hasDrawn) {
        alert('يرجى رسم التوقيع أولاً أو اختيار نمط آخر.');
        return;
      }
      const dataUrl = canvas.toDataURL('image/png');
      onConfirmSignature(dataUrl, signerTitle);
      onClose();
    } else if (mode === 'type') {
      // Render typed signature into canvas to get dataUrl
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = 400;
      tempCanvas.height = 140;
      const ctx = tempCanvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff00';
        ctx.fillRect(0, 0, 400, 140);
        ctx.font = 'italic bold 36px "Brush Script MT", cursive, Cairo, sans-serif';
        ctx.fillStyle = '#1e3a8a';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(typedName, 200, 60);

        ctx.font = '12px Cairo, sans-serif';
        ctx.fillStyle = '#64748b';
        ctx.fillText(`توقيع رقمي موثق - ${new Date().toLocaleDateString('ar-EG')}`, 200, 105);

        const dataUrl = tempCanvas.toDataURL('image/png');
        onConfirmSignature(dataUrl, typedName);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 text-right">
        {/* Header */}
        <div className="bg-[#ba141a] text-white px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PenTool className="w-5 h-5" />
            <h3 className="font-bold text-sm">التوقيع الإلكتروني الحي (Fill & Sign)</h3>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded transition cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-gray-200 bg-gray-50 text-xs font-semibold">
          <button
            onClick={() => setMode('draw')}
            className={`flex-1 py-2 text-center transition cursor-pointer ${
              mode === 'draw'
                ? 'bg-white text-[#ba141a] border-b-2 border-[#ba141a] font-bold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            رسم باليد (Draw)
          </button>
          <button
            onClick={() => setMode('type')}
            className={`flex-1 py-2 text-center transition cursor-pointer ${
              mode === 'type'
                ? 'bg-white text-[#ba141a] border-b-2 border-[#ba141a] font-bold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            كتابة بالاسم (Type)
          </button>
          <button
            onClick={() => setMode('upload')}
            className={`flex-1 py-2 text-center transition cursor-pointer ${
              mode === 'upload'
                ? 'bg-white text-[#ba141a] border-b-2 border-[#ba141a] font-bold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            رفع صورة توقيع (Upload)
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-3.5 text-xs">
          {mode === 'draw' && (
            <div>
              <div className="flex items-center justify-between mb-1.5 text-gray-600">
                <span>ارسم توقيعك بالفأرة أو القلم الضوئي:</span>
                <button
                  onClick={handleClear}
                  className="flex items-center gap-1 text-red-600 hover:underline cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>مسح</span>
                </button>
              </div>
              <canvas
                ref={canvasRef}
                width={380}
                height={150}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-36 bg-slate-50 border-2 border-dashed border-red-300 rounded-lg cursor-crosshair touch-none"
              />
            </div>
          )}

          {mode === 'type' && (
            <div className="space-y-3">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">الاسم الكامل للتوقيع:</label>
                <input
                  type="text"
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-[#ba141a]"
                />
              </div>
              {/* Type Preview */}
              <div className="border border-gray-200 rounded-lg p-5 bg-slate-50 text-center select-none min-h-[90px] flex flex-col items-center justify-center">
                <span className="font-serif italic text-2xl text-blue-900 font-bold block mb-1">
                  {typedName || 'التوقيع'}
                </span>
                <span className="text-[10px] text-gray-400">توقيع رقمي مصدق سيادياً</span>
              </div>
            </div>
          )}

          {mode === 'upload' && (
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <span className="block text-gray-600 mb-2">اختر صورة التوقيع بتنسيق PNG شفاف أو JPG:</span>
              <label className="inline-block px-4 py-1.5 bg-[#ba141a] text-white rounded-lg font-bold cursor-pointer hover:bg-[#961015]">
                تصفح الملفات
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={handleUploadImage}
                  className="hidden"
                />
              </label>
            </div>
          )}

          <div>
            <label className="block text-gray-600 text-[11px] mb-1">صفة أو مسمى الموقع (اختياري):</label>
            <input
              type="text"
              value={signerTitle}
              onChange={(e) => setSignerTitle(e.target.value)}
              placeholder="مثال: المدير التنفيذي / رئيس المجلس"
              className="w-full border border-gray-300 rounded px-2.5 py-1 text-xs"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-5 py-3 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            إلغاء
          </button>
          <button
            onClick={handleApply}
            className="px-5 py-1.5 rounded-lg bg-[#ba141a] hover:bg-[#961015] text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>اعتماد وإدراج التوقيع</span>
          </button>
        </div>
      </div>
    </div>
  );
};
