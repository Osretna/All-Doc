import React, { useState, useRef, useEffect } from 'react';
import {
  Image as ImageIcon,
  Sliders,
  RotateCw,
  FlipHorizontal,
  Download,
  Upload,
  Sparkles,
  Maximize2
} from 'lucide-react';

interface Props {
  fontFamily: string;
}

export const PhotoStudioApp: React.FC<Props> = ({ fontFamily }) => {
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [grayscale, setGrayscale] = useState<number>(0);
  const [sepia, setSepia] = useState<number>(0);
  const [blur, setBlur] = useState<number>(0);
  const [rotation, setRotation] = useState<number>(0);
  const [watermarkText, setWatermarkText] = useState<string>('INFINITY SOVEREIGN TECH');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Draw procedural modern sample tech graphic on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw background gradient
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(0.5, '#1e293b');
    grad.addColorStop(1, '#0284c7');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw tech circular rings
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 140, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 90, 0, Math.PI * 2);
    ctx.stroke();

    // Central Brand Text
    ctx.font = 'bold 32px Cairo, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('INFINITY TECHNOLOGY', canvas.width / 2, canvas.height / 2 - 10);

    ctx.font = '600 16px Cairo, sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('SOVEREIGN PHOTO STUDIO', canvas.width / 2, canvas.height / 2 + 30);

    // Watermark
    if (watermarkText) {
      ctx.font = '12px Cairo, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fillText(watermarkText, canvas.width / 2, canvas.height - 25);
    }
  }, [watermarkText]);

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'infinity_photo_edit.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          if (!canvas) return;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const resetFilters = () => {
    setBrightness(100);
    setContrast(100);
    setGrayscale(0);
    setSepia(0);
    setBlur(0);
    setRotation(0);
  };

  return (
    <div className="flex-1 flex bg-[#1e1e1e] text-white overflow-hidden text-xs select-none">
      {/* Left Control Panel: Filters & Adjustments */}
      <div className="w-64 sm:w-72 bg-[#252526] border-l border-[#333333] p-4 flex flex-col justify-between overflow-y-auto shrink-0 space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#333333]">
            <div className="flex items-center gap-2 font-bold text-sky-400">
              <Sliders className="w-4 h-4" />
              <span>فلاتر وتعديلات الصور</span>
            </div>
            <button
              onClick={resetFilters}
              className="text-[10px] text-gray-400 hover:text-white transition"
            >
              إعادة ضبط
            </button>
          </div>

          {/* Filter Sliders */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span>السطوع (Brightness)</span>
                <span className="font-mono text-sky-400">{brightness}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="200"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-full h-1 bg-gray-700 rounded accent-sky-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span>التباين (Contrast)</span>
                <span className="font-mono text-sky-400">{contrast}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="200"
                value={contrast}
                onChange={(e) => setContrast(Number(e.target.value))}
                className="w-full h-1 bg-gray-700 rounded accent-sky-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span>أبيض وأسود (Grayscale)</span>
                <span className="font-mono text-sky-400">{grayscale}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={grayscale}
                onChange={(e) => setGrayscale(Number(e.target.value))}
                className="w-full h-1 bg-gray-700 rounded accent-sky-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span>تأثير عتيق (Sepia)</span>
                <span className="font-mono text-sky-400">{sepia}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sepia}
                onChange={(e) => setSepia(Number(e.target.value))}
                className="w-full h-1 bg-gray-700 rounded accent-sky-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span>ضبابية (Blur)</span>
                <span className="font-mono text-sky-400">{blur}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={blur}
                onChange={(e) => setBlur(Number(e.target.value))}
                className="w-full h-1 bg-gray-700 rounded accent-sky-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Watermark / Text overlay */}
          <div className="pt-2 border-t border-[#333333]">
            <label className="block text-[11px] text-gray-300 mb-1">العلامة المائية / النص:</label>
            <input
              type="text"
              value={watermarkText}
              onChange={(e) => setWatermarkText(e.target.value)}
              className="w-full bg-[#1e1e1e] border border-gray-700 rounded px-2 py-1 text-xs text-white outline-none focus:border-sky-400"
            />
          </div>

          {/* Rotation & Tools */}
          <div className="flex gap-2">
            <button
              onClick={() => setRotation((r) => (r + 90) % 360)}
              className="flex-1 bg-[#333333] hover:bg-gray-700 py-1.5 rounded flex items-center justify-center gap-1 text-[11px] transition"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>تدوير 90°</span>
            </button>
          </div>
        </div>

        {/* Upload & Export */}
        <div className="space-y-2 pt-3 border-t border-[#333333]">
          <label className="w-full bg-[#333333] hover:bg-gray-700 py-2 rounded flex items-center justify-center gap-1.5 cursor-pointer text-xs font-semibold transition">
            <Upload className="w-3.5 h-3.5" />
            <span>رفع صورة من جهازك</span>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>

          <button
            onClick={downloadImage}
            className="w-full bg-sky-600 hover:bg-sky-500 text-white py-2 rounded flex items-center justify-center gap-1.5 text-xs font-bold transition shadow"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تنزيل الصورة المعدلة (PNG)</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 p-6 sm:p-10 flex items-center justify-center overflow-auto bg-[#121212]">
        <div
          className="rounded-lg shadow-2xl overflow-hidden transition-all duration-200 border border-gray-800"
          style={{
            filter: `brightness(${brightness}%) contrast(${contrast}%) grayscale(${grayscale}%) sepia(${sepia}%) blur(${blur}px)`,
            transform: `rotate(${rotation}deg)`,
          }}
        >
          <canvas ref={canvasRef} width={640} height={420} className="max-w-full h-auto block" />
        </div>
      </div>
    </div>
  );
};
