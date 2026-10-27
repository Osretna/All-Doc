import React, { useState, useRef, useEffect } from 'react';
import {
  Sliders,
  RotateCw,
  Download,
  Upload,
  Sparkles,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  FolderOpen,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  Layers,
  Palette,
  Undo2,
  Redo2,
  MousePointer,
  Square,
  Circle,
  Type,
  PaintBucket,
  Eraser,
  Brush,
  Scissors,
  Hand,
  Pipette,
  Stamp,
  Crop,
  Check,
  X
} from 'lucide-react';

interface Props {
  fontFamily: string;
  initialPhotoFile?: File | null;
  onPhotoChange?: (file: File) => void;
}

type PhotoshopTool = 
  | 'move'        // V
  | 'marquee'     // M
  | 'lasso'       // L
  | 'crop'        // C
  | 'eyedropper'  // I
  | 'brush'       // B
  | 'eraser'      // E
  | 'bucket'      // G
  | 'stamp'       // S
  | 'text'        // T
  | 'shape'       // U
  | 'hand'        // H
  | 'zoom';       // Z

interface LayerItem {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  blendMode: 'normal' | 'multiply' | 'screen' | 'overlay';
}

export const PhotoStudioApp: React.FC<Props> = ({ 
  fontFamily, 
  initialPhotoFile, 
  onPhotoChange 
}) => {
  // Photoshop Tools State
  const [activeTool, setActiveTool] = useState<PhotoshopTool>('brush');
  const [primaryColor, setPrimaryColor] = useState<string>('#38bdf8');
  const [secondaryColor, setSecondaryColor] = useState<string>('#0f172a');
  const [brushSize, setBrushSize] = useState<number>(12);
  const [brushOpacity, setBrushOpacity] = useState<number>(100);
  const [shapeType, setShapeType] = useState<'rect' | 'circle'>('rect');
  const [textInput, setTextInput] = useState<string>('INFINITY TECHNOLOGY');

  // Adjustments & Filters
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [saturation, setSaturation] = useState<number>(100);
  const [grayscale, setGrayscale] = useState<number>(0);
  const [sepia, setSepia] = useState<number>(0);
  const [blur, setBlur] = useState<number>(0);
  const [invert, setInvert] = useState<number>(0);
  const [rotation, setRotation] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Layers Panel
  const [layers, setLayers] = useState<LayerItem[]>([
    { id: 'layer-3', name: 'طبقة النصوص والشعار (Text)', visible: true, opacity: 100, blendMode: 'normal' },
    { id: 'layer-2', name: 'طبقة الرسوم والفرشاة (Art)', visible: true, opacity: 100, blendMode: 'normal' },
    { id: 'layer-1', name: 'خلفية التصميم الأساسية (Background)', visible: true, opacity: 100, blendMode: 'normal' },
  ]);
  const [activeLayerId, setActiveLayerId] = useState<string>('layer-2');
  const [activeRightTab, setActiveRightTab] = useState<'layers' | 'adjustments' | 'history'>('layers');

  // Interactive Canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Initialize sample tech graphic or load initial file
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (initialPhotoFile) {
      loadImageFromFile(initialPhotoFile);
      return;
    }

    // Default procedure Photoshop Artwork
    canvas.width = 800;
    canvas.height = 520;

    // Dark sleek gradient
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#0a0f1d');
    grad.addColorStop(0.5, '#0f172a');
    grad.addColorStop(1, '#0284c7');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Glowing Circles & Tech Grid
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 160, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 100, 0, Math.PI * 2);
    ctx.stroke();

    // Center Typography
    ctx.font = 'bold 36px "Segoe UI", Cairo, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('INFINITY TECHNOLOGY', canvas.width / 2, canvas.height / 2 - 12);

    ctx.font = '600 16px "Segoe UI", Cairo, sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('SOVEREIGN PHOTOSHOP STUDIO 2026', canvas.width / 2, canvas.height / 2 + 30);

    // Initial snapshot for history
    const initialSnapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory([initialSnapshot]);
    setHistoryIndex(0);
  }, []);

  // Sync external file if changed
  useEffect(() => {
    if (initialPhotoFile) {
      loadImageFromFile(initialPhotoFile);
    }
  }, [initialPhotoFile]);

  const loadImageFromFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        canvas.width = Math.max(img.width, 600);
        canvas.height = Math.max(img.height, 400);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        saveCanvasState();
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(0, historyIndex + 1), snapshot]);
    setHistoryIndex((prev) => prev + 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const targetIndex = historyIndex - 1;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.putImageData(history[targetIndex], 0, 0);
      setHistoryIndex(targetIndex);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const targetIndex = historyIndex + 1;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.putImageData(history[targetIndex], 0, 0);
      setHistoryIndex(targetIndex);
    }
  };

  // Canvas Mouse Coordinates
  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCanvasCoords(e);

    // Eyedropper Tool: Sample color under cursor
    if (activeTool === 'eyedropper') {
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1)}`;
      setPrimaryColor(hex);
      return;
    }

    // Paint Bucket Tool: Fill canvas with foreground color
    if (activeTool === 'bucket') {
      ctx.fillStyle = primaryColor;
      ctx.globalAlpha = brushOpacity / 100;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1.0;
      saveCanvasState();
      return;
    }

    // Text Tool: Place text at clicked position
    if (activeTool === 'text') {
      ctx.font = `bold ${brushSize * 2}px "Segoe UI", Cairo, sans-serif`;
      ctx.fillStyle = primaryColor;
      ctx.globalAlpha = brushOpacity / 100;
      ctx.fillText(textInput, x, y);
      ctx.globalAlpha = 1.0;
      saveCanvasState();
      return;
    }

    // Shape Tool: Draw rect or circle
    if (activeTool === 'shape') {
      ctx.fillStyle = primaryColor;
      ctx.strokeStyle = secondaryColor;
      ctx.lineWidth = 3;
      ctx.globalAlpha = brushOpacity / 100;
      if (shapeType === 'rect') {
        ctx.fillRect(x - brushSize * 2, y - brushSize * 1.5, brushSize * 4, brushSize * 3);
        ctx.strokeRect(x - brushSize * 2, y - brushSize * 1.5, brushSize * 4, brushSize * 3);
      } else {
        ctx.beginPath();
        ctx.arc(x, y, brushSize * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      ctx.globalAlpha = 1.0;
      saveCanvasState();
      return;
    }

    // Brush & Eraser Tools
    if (activeTool === 'brush' || activeTool === 'eraser') {
      setIsDrawing(true);
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCanvasCoords(e);

    if (activeTool === 'brush') {
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = brushOpacity / 100;
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (activeTool === 'eraser') {
      ctx.strokeStyle = '#0f172a'; // Erase to canvas background
      ctx.lineWidth = brushSize * 1.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveCanvasState();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      loadImageFromFile(file);
      onPhotoChange?.(file);
    }
  };

  const exportImage = (format: 'png' | 'jpeg') => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `infinity_photoshop_design.${format === 'jpeg' ? 'jpg' : 'png'}`;
    link.href = canvas.toDataURL(`image/${format}`, 0.95);
    link.click();
  };

  const resetAllFilters = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setGrayscale(0);
    setSepia(0);
    setBlur(0);
    setInvert(0);
    setRotation(0);
    setZoomLevel(100);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#1e1e1e] text-gray-200 overflow-hidden text-xs select-none font-cairo">
      {/* 1. Adobe Photoshop Top Menu Bar */}
      <div className="bg-[#262626] border-b border-[#333333] px-3 py-1.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded bg-[#001e36] border border-[#31a8ff] text-[#31a8ff] flex items-center justify-center font-black text-xs shadow-xs">
              Ps
            </div>
            <span className="font-bold text-white text-xs">Infinity Photoshop CC 2026</span>
          </div>

          <div className="hidden md:flex items-center gap-3 text-[11px] text-gray-300">
            <span className="hover:text-white cursor-pointer">ملف (File)</span>
            <span className="hover:text-white cursor-pointer">تحرير (Edit)</span>
            <span className="hover:text-white cursor-pointer">صورة (Image)</span>
            <span className="hover:text-white cursor-pointer">طبقة (Layer)</span>
            <span className="hover:text-white cursor-pointer">تحديد (Select)</span>
            <span className="hover:text-white cursor-pointer">فلاتر (Filter)</span>
            <span className="hover:text-white cursor-pointer">عرض (View)</span>
            <span className="hover:text-white cursor-pointer">نافذة (Window)</span>
          </div>
        </div>

        {/* Quick Actions (Open, Undo, Redo, Export) */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="p-1 rounded hover:bg-[#383838] disabled:opacity-40 text-gray-300 hover:text-white cursor-pointer"
            title="تراجع (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="p-1 rounded hover:bg-[#383838] disabled:opacity-40 text-gray-300 hover:text-white cursor-pointer"
            title="إعادة (Ctrl+Y)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>

          <label className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#333333] hover:bg-[#3d3d3d] text-white font-medium cursor-pointer transition border border-gray-700">
            <FolderOpen className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-[11px]">فتح صورة / تصميم</span>
            <input type="file" accept="image/*,.psd" className="hidden" onChange={handleFileUpload} />
          </label>

          <button
            onClick={() => exportImage('png')}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white font-bold cursor-pointer transition shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تصدير PNG</span>
          </button>
        </div>
      </div>

      {/* 2. Photoshop Context Tool Options Bar (Dynamically changes with active tool) */}
      <div className="bg-[#2d2d2d] border-b border-[#383838] px-3 py-1.5 flex flex-wrap items-center gap-4 text-[11px] shrink-0">
        <div className="flex items-center gap-2 text-sky-400 font-bold border-l border-gray-700 pl-3">
          <span className="capitalize">{activeTool} Tool</span>
        </div>

        {/* Brush & Eraser Options */}
        {(activeTool === 'brush' || activeTool === 'eraser') && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">حجم الفرشاة:</span>
              <input
                type="range"
                min="2"
                max="80"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-24 h-1 bg-gray-700 rounded accent-sky-400 cursor-pointer"
              />
              <span className="font-mono text-white text-[10px] w-6">{brushSize}px</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-400">الشفافية (Opacity):</span>
              <input
                type="range"
                min="10"
                max="100"
                value={brushOpacity}
                onChange={(e) => setBrushOpacity(Number(e.target.value))}
                className="w-20 h-1 bg-gray-700 rounded accent-sky-400 cursor-pointer"
              />
              <span className="font-mono text-white text-[10px] w-8">{brushOpacity}%</span>
            </div>
          </div>
        )}

        {/* Text Tool Options */}
        {activeTool === 'text' && (
          <div className="flex items-center gap-2">
            <span className="text-gray-400">النص المراد إدراجه:</span>
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="bg-[#1c1c1c] border border-gray-700 rounded px-2 py-0.5 text-xs text-white outline-none focus:border-sky-400 w-48"
            />
          </div>
        )}

        {/* Shape Tool Options */}
        {activeTool === 'shape' && (
          <div className="flex items-center gap-2">
            <span className="text-gray-400">نوع الشكل:</span>
            <button
              onClick={() => setShapeType('rect')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${shapeType === 'rect' ? 'bg-sky-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              مستطيل
            </button>
            <button
              onClick={() => setShapeType('circle')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${shapeType === 'circle' ? 'bg-sky-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              دائري
            </button>
          </div>
        )}

        {/* Zoom Controls */}
        <div className="mr-auto flex items-center gap-2">
          <button onClick={() => setZoomLevel((z) => Math.max(z - 15, 40))} className="p-1 hover:text-white">
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-[10px] text-gray-300">{zoomLevel}%</span>
          <button onClick={() => setZoomLevel((z) => Math.min(z + 15, 250))} className="p-1 hover:text-white">
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setRotation((r) => (r + 90) % 360)}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-gray-700 hover:bg-gray-600 text-[10px]"
            title="تدوير الكانفاس 90 درجة"
          >
            <RotateCw className="w-3 h-3" />
            <span>تدوير</span>
          </button>
        </div>
      </div>

      {/* 3. Main Workspace: Tool Strip (Left) + Canvas Center + Dock Panels (Right) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Photoshop Iconic Tool Strip */}
        <div className="w-12 bg-[#262626] border-l border-[#333333] flex flex-col items-center py-2 gap-1 shrink-0 z-10">
          {[
            { id: 'move' as PhotoshopTool, icon: MousePointer, title: 'أداة التحريك (V: Move Tool)' },
            { id: 'marquee' as PhotoshopTool, icon: Square, title: 'أداة التحديد المستطيل (M: Marquee)' },
            { id: 'crop' as PhotoshopTool, icon: Crop, title: 'أداة الاقتصاص (C: Crop)' },
            { id: 'eyedropper' as PhotoshopTool, icon: Pipette, title: 'أداة الماصة واختيار اللون (I: Eyedropper)' },
            { id: 'brush' as PhotoshopTool, icon: Brush, title: 'أداة الفرشاة للرسم (B: Brush Tool)' },
            { id: 'eraser' as PhotoshopTool, icon: Eraser, title: 'أداة الممحاة (E: Eraser Tool)' },
            { id: 'bucket' as PhotoshopTool, icon: PaintBucket, title: 'أداة سطل الدهان (G: Paint Bucket)' },
            { id: 'stamp' as PhotoshopTool, icon: Stamp, title: 'أداة الختم (S: Clone Stamp)' },
            { id: 'text' as PhotoshopTool, icon: Type, title: 'أداة النص (T: Horizontal Type)' },
            { id: 'shape' as PhotoshopTool, icon: Circle, title: 'أداة الأشكال الهندسية (U: Shapes)' },
            { id: 'hand' as PhotoshopTool, icon: Hand, title: 'أداة اليد لتحريك الكانفاس (H: Hand Tool)' },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = activeTool === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTool(t.id)}
                className={`w-8 h-8 rounded flex items-center justify-center transition cursor-pointer ${
                  isActive ? 'bg-[#3b3b3b] text-sky-400 shadow-inner border border-gray-600' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
                title={t.title}
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}

          {/* Foreground & Background Color Swatches */}
          <div className="mt-auto pt-3 border-t border-gray-700 flex flex-col items-center gap-1.5">
            <div className="relative w-8 h-8">
              {/* Secondary Color (Back) */}
              <input
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="absolute bottom-0 left-0 w-5 h-5 rounded cursor-pointer border border-gray-600 bg-transparent p-0"
                title="لون الخلفية (Background Color)"
              />
              {/* Primary Color (Front) */}
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="absolute top-0 right-0 w-5 h-5 rounded cursor-pointer border border-white shadow-xs bg-transparent p-0 z-10"
                title="اللون الأمامي للفرشاة والتعبئة (Foreground Color)"
              />
            </div>

            {/* Swap Colors Button (X) */}
            <button
              onClick={() => {
                const temp = primaryColor;
                setPrimaryColor(secondaryColor);
                setSecondaryColor(temp);
              }}
              className="text-[9px] text-gray-500 hover:text-white p-0.5"
              title="تبديل الألوان (X)"
            >
              ⇄
            </button>
          </div>
        </div>

        {/* Center: Interactive Photoshop Canvas Viewport */}
        <div className="flex-1 bg-[#121212] overflow-auto flex items-center justify-center p-6 relative">
          <div
            className="transition-all duration-150 shadow-2xl border border-[#333333] rounded overflow-hidden"
            style={{
              transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
              filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) grayscale(${grayscale}%) sepia(${sepia}%) blur(${blur}px) invert(${invert}%)`,
            }}
          >
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              className={`block bg-transparent ${
                activeTool === 'brush' ? 'cursor-crosshair' :
                activeTool === 'eraser' ? 'cursor-cell' :
                activeTool === 'eyedropper' ? 'cursor-pointer' :
                activeTool === 'bucket' ? 'cursor-copy' :
                activeTool === 'text' ? 'cursor-text' :
                activeTool === 'hand' ? 'cursor-grab' : 'cursor-default'
              }`}
            />
          </div>
        </div>

        {/* Right: Photoshop Collapsible Panels Dock */}
        <div className="w-64 sm:w-72 bg-[#252526] border-r border-[#333333] flex flex-col shrink-0">
          {/* Panel Header Tabs */}
          <div className="flex items-center border-b border-[#333333] bg-[#2d2d2d] text-[11px] font-bold">
            <button
              onClick={() => setActiveRightTab('layers')}
              className={`flex-1 py-2 flex items-center justify-center gap-1.5 transition ${
                activeRightTab === 'layers' ? 'bg-[#252526] text-white border-b-2 border-sky-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>الطبقات (Layers)</span>
            </button>
            <button
              onClick={() => setActiveRightTab('adjustments')}
              className={`flex-1 py-2 flex items-center justify-center gap-1.5 transition ${
                activeRightTab === 'adjustments' ? 'bg-[#252526] text-white border-b-2 border-sky-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>التعديلات (Adjustments)</span>
            </button>
          </div>

          {/* Panel 1: Layers Panel */}
          {activeRightTab === 'layers' && (
            <div className="flex-1 flex flex-col p-3 overflow-y-auto justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-gray-400 pb-1 border-b border-gray-700">
                  <span>قائمة الطبقات النشطة:</span>
                  <span className="font-mono text-[10px]">({layers.length})</span>
                </div>

                <div className="space-y-1.5">
                  {layers.map((layer) => {
                    const isSelected = activeLayerId === layer.id;
                    return (
                      <div
                        key={layer.id}
                        onClick={() => setActiveLayerId(layer.id)}
                        className={`p-2 rounded flex items-center justify-between cursor-pointer transition ${
                          isSelected ? 'bg-sky-950/80 border border-sky-500/60 text-white' : 'bg-[#1e1e1e] border border-gray-800 text-gray-300 hover:bg-[#2b2b2b]'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setLayers((prev) =>
                                prev.map((l) => (l.id === layer.id ? { ...l, visible: !l.visible } : l))
                              );
                            }}
                            className="text-gray-400 hover:text-white p-0.5"
                          >
                            {layer.visible ? <Eye className="w-3.5 h-3.5 text-sky-400" /> : <EyeOff className="w-3.5 h-3.5 text-gray-600" />}
                          </button>
                          <span className="truncate text-xs font-medium">{layer.name}</span>
                        </div>
                        <span className="text-[10px] text-gray-500 font-mono">{layer.blendMode}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Add Layer / Delete Layer actions */}
              <div className="pt-2 border-t border-gray-700 flex items-center justify-between">
                <button
                  onClick={() => {
                    const newLayer: LayerItem = {
                      id: `layer-${Date.now()}`,
                      name: `طبقة جديدة ${layers.length + 1}`,
                      visible: true,
                      opacity: 100,
                      blendMode: 'normal',
                    };
                    setLayers([newLayer, ...layers]);
                    setActiveLayerId(newLayer.id);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#333333] hover:bg-gray-700 text-gray-200 text-[11px] font-bold"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-400" />
                  <span>طبقة جديدة</span>
                </button>

                <button
                  onClick={() => {
                    if (layers.length > 1) {
                      setLayers((prev) => prev.filter((l) => l.id !== activeLayerId));
                      setActiveLayerId(layers[0].id);
                    }
                  }}
                  className="p-1.5 rounded hover:bg-red-950/40 text-gray-400 hover:text-red-400"
                  title="حذف الطبقة النشطة"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Panel 2: Adjustments & Live Filters */}
          {activeRightTab === 'adjustments' && (
            <div className="flex-1 p-3 overflow-y-auto space-y-3.5 text-[11px]">
              <div className="flex items-center justify-between pb-1 border-b border-gray-700">
                <span className="font-bold text-gray-300">تعديلات الإضاءة والألوان:</span>
                <button onClick={resetAllFilters} className="text-[10px] text-sky-400 hover:underline">
                  إعادة ضبط
                </button>
              </div>

              {/* Sliders */}
              <div>
                <div className="flex justify-between mb-1">
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
                <div className="flex justify-between mb-1">
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
                <div className="flex justify-between mb-1">
                  <span>التشبع (Saturation)</span>
                  <span className="font-mono text-sky-400">{saturation}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={saturation}
                  onChange={(e) => setSaturation(Number(e.target.value))}
                  className="w-full h-1 bg-gray-700 rounded accent-sky-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
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
                <div className="flex justify-between mb-1">
                  <span>تأثير سيبيا (Sepia)</span>
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
                <div className="flex justify-between mb-1">
                  <span>الضبابية (Blur)</span>
                  <span className="font-mono text-sky-400">{blur}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="12"
                  value={blur}
                  onChange={(e) => setBlur(Number(e.target.value))}
                  className="w-full h-1 bg-gray-700 rounded accent-sky-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>عكس الألوان (Invert)</span>
                  <span className="font-mono text-sky-400">{invert}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={invert}
                  onChange={(e) => setInvert(Number(e.target.value))}
                  className="w-full h-1 bg-gray-700 rounded accent-sky-400 cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
