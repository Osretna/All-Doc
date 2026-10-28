import React, { useRef, useState, useEffect } from 'react';
import { Paintbrush, Square, Circle, Type, Download, Trash2, Sliders } from 'lucide-react';

export const PhotoshopApp: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<'brush' | 'rect' | 'circle'>('brush');
  const [color, setColor] = useState('#107c41');
  const [brushSize, setBrushSize] = useState(6);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const cvs = canvasRef.current;
    if (cvs) {
      const ctx = cvs.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, cvs.width, cvs.height);

        // Draw initial sovereign graphic
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        for (let i = 0; i < cvs.width; i += 20) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, cvs.height);
          ctx.stroke();
        }

        ctx.font = 'bold 24px Cairo, sans-serif';
        ctx.fillStyle = '#0f172a';
        ctx.textAlign = 'center';
        ctx.fillText('MY-DOC PHOTO STUDIO CC 2026', cvs.width / 2, cvs.height / 2 - 10);
        ctx.font = '14px Cairo, sans-serif';
        ctx.fillStyle = '#64748b';
        ctx.fillText('لوحة رسم وتصميم جرافيكي سيادية', cvs.width / 2, cvs.height / 2 + 20);
      }
    }
  }, []);

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;
    const rect = cvs.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;
    const rect = cvs.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === 'brush') {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const endDraw = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const cvs = canvasRef.current;
    if (cvs) {
      const ctx = cvs.getContext('2d');
      ctx?.clearRect(0, 0, cvs.width, cvs.height);
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, cvs.width, cvs.height);
      }
    }
  };

  const downloadImage = () => {
    const cvs = canvasRef.current;
    if (cvs) {
      const link = document.createElement('a');
      link.download = 'تصميم_MY-DOC.png';
      link.href = cvs.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-900 text-white select-none">
      {/* Photoshop Ribbon */}
      <div className="bg-[#1e293b] border-b border-slate-700 p-2 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTool('brush')}
            className={`p-1.5 rounded flex items-center gap-1 font-bold ${
              tool === 'brush' ? 'bg-[#002050] border border-blue-500 text-white' : 'hover:bg-slate-800 text-gray-300'
            }`}
          >
            <Paintbrush className="w-4 h-4 text-sky-400" />
            <span>فرشاة الرسم</span>
          </button>

          <div className="flex items-center gap-1 border-r border-slate-700 pr-2">
            <span className="text-gray-400 text-[10px]">اللون:</span>
            <input
              type="color"
              value={color}
              onChange={e => setColor(e.target.value)}
              className="w-6 h-6 rounded border-none bg-transparent cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-2 border-r border-slate-700 pr-2">
            <span className="text-gray-400 text-[10px]">الحجم:</span>
            <input
              type="range"
              min="1"
              max="50"
              value={brushSize}
              onChange={e => setBrushSize(Number(e.target.value))}
              className="w-20 accent-sky-500"
            />
            <span className="text-[10px] font-mono">{brushSize}px</span>
          </div>

          <button
            onClick={clearCanvas}
            className="p-1.5 hover:bg-red-950 text-red-400 rounded flex items-center gap-1 text-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>مسح اللوحة</span>
          </button>
        </div>

        <button
          onClick={downloadImage}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded cursor-pointer shadow-xs text-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>تصدير الصورة (PNG)</span>
        </button>
      </div>

      {/* Canvas workspace */}
      <div className="flex-1 overflow-auto p-8 flex items-center justify-center bg-slate-950">
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          className="bg-white rounded-lg shadow-2xl cursor-crosshair border border-slate-700"
        />
      </div>
    </div>
  );
};
