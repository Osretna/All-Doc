import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  X,
  History,
  Copy,
  Wand2,
  CheckCircle2
} from 'lucide-react';

interface Props {
  fontFamily: string;
  initialPhotoFile?: File | null;
  onPhotoChange?: (file: File) => void;
  newCanvasSignal?: number;
}

type PhotoshopTool = 
  | 'move'        // V
  | 'marquee'     // M
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
  blendMode: 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'difference';
}

interface HistoryStep {
  name: string;
  imageData: ImageData;
  time: string;
}

interface MarqueeSelection {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  active: boolean;
}

interface CropSelection {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  active: boolean;
}

export const PhotoStudioApp: React.FC<Props> = ({ 
  fontFamily, 
  initialPhotoFile, 
  onPhotoChange,
  newCanvasSignal
}) => {
  // Photoshop Tools State
  const [activeTool, setActiveTool] = useState<PhotoshopTool>('brush');
  const [primaryColor, setPrimaryColor] = useState<string>('#38bdf8');
  const [secondaryColor, setSecondaryColor] = useState<string>('#0f172a');
  const [brushSize, setBrushSize] = useState<number>(14);
  const [brushOpacity, setBrushOpacity] = useState<number>(100);
  const [shapeType, setShapeType] = useState<'rect' | 'circle' | 'line'>('rect');
  const [textInput, setTextInput] = useState<string>('MY-DOC SOVEREIGN STUDIO');

  // Adjustments & Filters
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [saturation, setSaturation] = useState<number>(100);
  const [grayscale, setGrayscale] = useState<number>(0);
  const [sepia, setSepia] = useState<number>(0);
  const [blur, setBlur] = useState<number>(0);
  const [invert, setInvert] = useState<number>(0);
  const [hueRotate, setHueRotate] = useState<number>(0);
  const [rotation, setRotation] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Pan / Offset for Hand & Move tools
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Layers Panel
  const [layers, setLayers] = useState<LayerItem[]>([
    { id: 'layer-3', name: 'طبقة النصوص والشعار (Text)', visible: true, opacity: 100, blendMode: 'normal' },
    { id: 'layer-2', name: 'طبقة الرسوم والفرشاة (Art)', visible: true, opacity: 100, blendMode: 'normal' },
    { id: 'layer-1', name: 'خلفية التصميم الأساسية (Background)', visible: true, opacity: 100, blendMode: 'normal' },
  ]);
  const [activeLayerId, setActiveLayerId] = useState<string>('layer-2');
  const [activeRightTab, setActiveRightTab] = useState<'layers' | 'adjustments' | 'history'>('layers');

  // Marquee Selection & Crop Selection
  const [marquee, setMarquee] = useState<MarqueeSelection>({ startX: 0, startY: 0, endX: 0, endY: 0, active: false });
  const [cropBox, setCropBox] = useState<CropSelection>({ startX: 0, startY: 0, endX: 0, endY: 0, active: false });
  const [sampledColorToast, setSampledColorToast] = useState<string | null>(null);

  // Clone Stamp Source Point
  const [stampSource, setStampSource] = useState<{ x: number; y: number } | null>(null);

  // Interactive Canvas & History
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [historySteps, setHistorySteps] = useState<HistoryStep[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState<number>(-1);

  // Save current canvas state to history stack
  const saveCanvasState = useCallback((actionName = 'تعديل') => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const now = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const newStep: HistoryStep = {
        name: actionName,
        imageData: imgData,
        time: now,
      };

      setHistorySteps((prev) => {
        const sliced = prev.slice(0, currentHistoryIndex + 1);
        return [...sliced, newStep];
      });
      setCurrentHistoryIndex((prev) => prev + 1);
    } catch (e) {
      console.warn('Could not save history snapshot:', e);
    }
  }, [currentHistoryIndex]);

  // Jump to specific history step
  const handleJumpToHistory = (index: number) => {
    if (index >= 0 && index < historySteps.length) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const target = historySteps[index];
      canvas.width = target.imageData.width;
      canvas.height = target.imageData.height;
      ctx.putImageData(target.imageData, 0, 0);
      setCurrentHistoryIndex(index);
    }
  };

  const handleUndo = () => {
    if (currentHistoryIndex > 0) {
      handleJumpToHistory(currentHistoryIndex - 1);
    }
  };

  const handleRedo = () => {
    if (currentHistoryIndex < historySteps.length - 1) {
      handleJumpToHistory(currentHistoryIndex + 1);
    }
  };

  // Load image from file
  const loadImageFromFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        saveCanvasState(`فتح ملف: ${file.name}`);
        setCropBox({ startX: 0, startY: 0, endX: 0, endY: 0, active: false });
        setMarquee({ startX: 0, startY: 0, endX: 0, endY: 0, active: false });
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

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

    // Default clean blank Photoshop canvas
    canvas.width = 820;
    canvas.height = 540;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const initialSnapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const now = new Date().toLocaleTimeString('ar-EG');
    setHistorySteps([{ name: 'لوحة رسم جديدة فارغة', imageData: initialSnapshot, time: now }]);
    setCurrentHistoryIndex(0);
  }, []);

  // Sync external file if changed
  useEffect(() => {
    if (initialPhotoFile) {
      loadImageFromFile(initialPhotoFile);
    }
  }, [initialPhotoFile]);

  // Handle new blank canvas signal from Backstage / File menu
  useEffect(() => {
    if (!newCanvasSignal) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = 820;
    canvas.height = 540;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const snap = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistorySteps([{ name: 'لوحة بيضاء جديدة', imageData: snap, time: new Date().toLocaleTimeString('ar-EG') }]);
    setCurrentHistoryIndex(0);
    setPanOffset({ x: 0, y: 0 });
    setCropBox({ startX: 0, startY: 0, endX: 0, endY: 0, active: false });
    setMarquee({ startX: 0, startY: 0, endX: 0, endY: 0, active: false });
  }, [newCanvasSignal]);

  // Canvas Mouse Coordinates mapped to actual canvas resolution
  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: Math.round((e.clientX - rect.left) * scaleX),
      y: Math.round((e.clientY - rect.top) * scaleY),
    };
  };

  // MOUSE DOWN HANDLER FOR ALL TOOLS
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCanvasCoords(e);

    // 1. Hand Tool: Pan viewport
    if (activeTool === 'hand') {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
      return;
    }

    // 2. Zoom Tool: Click zooms in, Alt+click zooms out
    if (activeTool === 'zoom') {
      if (e.altKey) {
        setZoomLevel((z) => Math.max(z - 20, 30));
      } else {
        setZoomLevel((z) => Math.min(z + 20, 300));
      }
      return;
    }

    // 3. Eyedropper Tool: Sample pixel color
    if (activeTool === 'eyedropper') {
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1)}`;
      setPrimaryColor(hex);
      setSampledColorToast(`تم اختيار اللون: ${hex}`);
      setTimeout(() => setSampledColorToast(null), 2500);
      return;
    }

    // 4. Paint Bucket Tool: Fill canvas or active marquee with foreground color
    if (activeTool === 'bucket') {
      ctx.fillStyle = primaryColor;
      ctx.globalAlpha = brushOpacity / 100;
      if (marquee.active) {
        const minX = Math.min(marquee.startX, marquee.endX);
        const minY = Math.min(marquee.startY, marquee.endY);
        const w = Math.abs(marquee.endX - marquee.startX);
        const h = Math.abs(marquee.endY - marquee.startY);
        ctx.fillRect(minX, minY, w, h);
      } else {
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.globalAlpha = 1.0;
      saveCanvasState('تعبئة بلون (Paint Bucket)');
      return;
    }

    // 5. Marquee Selection Tool: Start selection box
    if (activeTool === 'marquee') {
      setIsDrawing(true);
      setMarquee({ startX: x, startY: y, endX: x, endY: y, active: true });
      return;
    }

    // 6. Crop Tool: Start crop rectangle
    if (activeTool === 'crop') {
      setIsDrawing(true);
      setCropBox({ startX: x, startY: y, endX: x, endY: y, active: true });
      return;
    }

    // 7. Clone Stamp Tool: Alt+click defines source point; normal click stamps
    if (activeTool === 'stamp') {
      if (e.altKey) {
        setStampSource({ x, y });
        setSampledColorToast(`تم تحديد مصدر الختم عند: X=${x}, Y=${y}`);
        setTimeout(() => setSampledColorToast(null), 2500);
        return;
      }
      if (stampSource) {
        setIsDrawing(true);
        const w = brushSize * 3;
        const h = brushSize * 3;
        try {
          const sample = ctx.getImageData(stampSource.x - w / 2, stampSource.y - h / 2, w, h);
          ctx.putImageData(sample, x - w / 2, y - h / 2);
          saveCanvasState('أداة الختم (Clone Stamp)');
        } catch (err) {
          console.warn('Stamp sample boundary error:', err);
        }
      } else {
        alert('يرجى الضغط على زر Alt + النقر بالفأرة لاختيار منطقة النسخ (Source Point) أولاً.');
      }
      return;
    }

    // 8. Text Tool: Place text at clicked position
    if (activeTool === 'text') {
      ctx.font = `bold ${brushSize * 2}px "${fontFamily}", Cairo, sans-serif`;
      ctx.fillStyle = primaryColor;
      ctx.globalAlpha = brushOpacity / 100;
      ctx.textAlign = 'right';
      ctx.fillText(textInput, x, y);
      ctx.globalAlpha = 1.0;
      saveCanvasState(`إدراج نص: "${textInput}"`);
      return;
    }

    // 9. Shape Tool: Draw rect, circle, or line
    if (activeTool === 'shape') {
      ctx.fillStyle = primaryColor;
      ctx.strokeStyle = secondaryColor;
      ctx.lineWidth = 3;
      ctx.globalAlpha = brushOpacity / 100;

      if (shapeType === 'rect') {
        const w = brushSize * 5;
        const h = brushSize * 3.5;
        ctx.fillRect(x - w / 2, y - h / 2, w, h);
        ctx.strokeRect(x - w / 2, y - h / 2, w, h);
      } else if (shapeType === 'circle') {
        ctx.beginPath();
        ctx.arc(x, y, brushSize * 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else if (shapeType === 'line') {
        ctx.beginPath();
        ctx.moveTo(x - brushSize * 3, y);
        ctx.lineTo(x + brushSize * 3, y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1.0;
      saveCanvasState(`رسم شكل هندسي (${shapeType})`);
      return;
    }

    // 10. Brush & Eraser Tools: Start freehand stroke
    if (activeTool === 'brush' || activeTool === 'eraser') {
      setIsDrawing(true);
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  // MOUSE MOVE HANDLER
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // Hand pan
    if (isPanning && activeTool === 'hand') {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
      return;
    }

    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCanvasCoords(e);

    // Marquee tool drag
    if (activeTool === 'marquee') {
      setMarquee((prev) => ({ ...prev, endX: x, endY: y, active: true }));
      return;
    }

    // Crop tool drag
    if (activeTool === 'crop') {
      setCropBox((prev) => ({ ...prev, endX: x, endY: y, active: true }));
      return;
    }

    // Brush tool
    if (activeTool === 'brush') {
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = brushOpacity / 100;
      ctx.lineTo(x, y);
      ctx.stroke();
    } 
    // Eraser tool
    else if (activeTool === 'eraser') {
      ctx.strokeStyle = secondaryColor; // Erase to secondary/background color
      ctx.lineWidth = brushSize * 1.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  // MOUSE UP HANDLER
  const handleMouseUp = () => {
    if (isPanning) {
      setIsPanning(false);
    }

    if (isDrawing) {
      setIsDrawing(false);
      if (activeTool === 'brush') {
        saveCanvasState('رسم بالفرشاة');
      } else if (activeTool === 'eraser') {
        saveCanvasState('مسح بالممحاة');
      }
    }
  };

  // Apply Crop Action
  const applyCrop = () => {
    if (!cropBox.active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const minX = Math.max(0, Math.min(cropBox.startX, cropBox.endX));
    const minY = Math.max(0, Math.min(cropBox.startY, cropBox.endY));
    const w = Math.min(canvas.width - minX, Math.abs(cropBox.endX - cropBox.startX));
    const h = Math.min(canvas.height - minY, Math.abs(cropBox.endY - cropBox.startY));

    if (w < 10 || h < 10) {
      alert('مساحة الاقتصاص صغيرة جداً.');
      return;
    }

    const croppedData = ctx.getImageData(minX, minY, w, h);
    canvas.width = w;
    canvas.height = h;
    ctx.putImageData(croppedData, 0, 0);

    setCropBox({ startX: 0, startY: 0, endX: 0, endY: 0, active: false });
    saveCanvasState(`اقتصاص الكانفاس (${w}x${h})`);
  };

  // Delete / Clear selected Marquee area
  const clearMarqueeSelection = () => {
    if (!marquee.active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const minX = Math.min(marquee.startX, marquee.endX);
    const minY = Math.min(marquee.startY, marquee.endY);
    const w = Math.abs(marquee.endX - marquee.startX);
    const h = Math.abs(marquee.endY - marquee.startY);

    ctx.fillStyle = secondaryColor;
    ctx.fillRect(minX, minY, w, h);
    saveCanvasState('مسح التحديد (Delete Selection)');
  };

  // Fill Marquee area with Foreground Color (Alt+Backspace)
  const fillMarqueeWithForeground = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = primaryColor;
    if (marquee.active) {
      const minX = Math.min(marquee.startX, marquee.endX);
      const minY = Math.min(marquee.startY, marquee.endY);
      const w = Math.abs(marquee.endX - marquee.startX);
      const h = Math.abs(marquee.endY - marquee.startY);
      ctx.fillRect(minX, minY, w, h);
    } else {
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    saveCanvasState('تعبئة باللون الأمامي');
  };

  // Bake CSS Filters into Canvas Pixels so Export preserves them perfectly
  const bakeFiltersIntoCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    // Apply filter string directly to 2D context
    const filterStr = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) grayscale(${grayscale}%) sepia(${sepia}%) blur(${blur}px) invert(${invert}%) hue-rotate(${hueRotate}deg)`;
    tempCtx.filter = filterStr;
    tempCtx.drawImage(canvas, 0, 0);

    // Reset filter states and redraw onto main canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(tempCanvas, 0, 0);

    resetAllFilters();
    saveCanvasState('تثبيت الفلاتر والتعديلات نهائياً على الصورة');
    alert('تم تثبيت وحفظ كافة التعديلات والفلاتر بنجاح داخل بكسلات الصورة!');
  };

  // Quick 1-Click Filter Presets
  const applyPresetFilter = (preset: 'cyberpunk' | 'warm' | 'bw' | 'vivid' | 'cool') => {
    if (preset === 'cyberpunk') {
      setBrightness(115);
      setContrast(130);
      setSaturation(160);
      setHueRotate(180);
      setInvert(0);
    } else if (preset === 'warm') {
      setBrightness(105);
      setContrast(110);
      setSaturation(125);
      setSepia(35);
      setHueRotate(0);
    } else if (preset === 'bw') {
      setBrightness(105);
      setContrast(140);
      setGrayscale(100);
      setSaturation(0);
      setSepia(0);
    } else if (preset === 'vivid') {
      setBrightness(108);
      setContrast(120);
      setSaturation(150);
      setGrayscale(0);
    } else if (preset === 'cool') {
      setBrightness(102);
      setContrast(115);
      setSaturation(110);
      setHueRotate(200);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      loadImageFromFile(file);
      onPhotoChange?.(file);
    }
  };

  const exportImage = (format: 'png' | 'jpeg' | 'webp') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create export canvas with baked-in filters if not already baked
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    const expCtx = exportCanvas.getContext('2d');
    if (!expCtx) return;

    const filterStr = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) grayscale(${grayscale}%) sepia(${sepia}%) blur(${blur}px) invert(${invert}%) hue-rotate(${hueRotate}deg)`;
    expCtx.filter = filterStr;
    expCtx.drawImage(canvas, 0, 0);

    const link = document.createElement('a');
    link.download = `mydoc_photoshop_design.${format === 'jpeg' ? 'jpg' : format}`;
    link.href = exportCanvas.toDataURL(`image/${format}`, 0.95);
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
    setHueRotate(0);
    setRotation(0);
    setZoomLevel(100);
  };

  // Adobe Photoshop Keyboard Shortcuts
  useEffect(() => {
    const handlePhotoshopKeys = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA');
      if (isInput) return;

      // 1. Ctrl + J : Duplicate active layer
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && (e.key === 'j' || e.key === 'J')) {
        e.preventDefault();
        const active = layers.find((l) => l.id === activeLayerId) || layers[0];
        const newLayer: LayerItem = {
          ...active,
          id: `layer-${Date.now()}`,
          name: `${active.name} (نسخة)`,
        };
        setLayers([newLayer, ...layers]);
        setActiveLayerId(newLayer.id);
        alert(`تم تكرار الطبقة "${active.name}" بنجاح (Ctrl+J)!`);
        return;
      }

      // 2. Ctrl + Alt + Shift + E : Stamp Visible
      if ((e.ctrlKey || e.metaKey) && e.altKey && e.shiftKey && (e.key === 'e' || e.key === 'E')) {
        e.preventDefault();
        bakeFiltersIntoCanvas();
        return;
      }

      // 3. Delete or Backspace: Clear marquee selection
      if ((e.key === 'Delete' || e.key === 'Backspace') && marquee.active) {
        e.preventDefault();
        clearMarqueeSelection();
        return;
      }

      // 4. Alt + Backspace : Fill with Foreground Color
      if (e.altKey && e.key === 'Backspace') {
        e.preventDefault();
        fillMarqueeWithForeground();
        return;
      }

      // 5. Escape: Deselect marquee
      if (e.key === 'Escape') {
        setMarquee({ startX: 0, startY: 0, endX: 0, endY: 0, active: false });
        setCropBox({ startX: 0, startY: 0, endX: 0, endY: 0, active: false });
        return;
      }

      // 6. Tool shortcut single-keys
      switch (e.key.toLowerCase()) {
        case 'b': setActiveTool('brush'); break;
        case 'e': setActiveTool('eraser'); break;
        case 'v': setActiveTool('move'); break;
        case 'm': setActiveTool('marquee'); break;
        case 'c': setActiveTool('crop'); break;
        case 'i': setActiveTool('eyedropper'); break;
        case 'g': setActiveTool('bucket'); break;
        case 's': setActiveTool('stamp'); break;
        case 't': setActiveTool('text'); break;
        case 'u': setActiveTool('shape'); break;
        case 'h': setActiveTool('hand'); break;
        case 'z': setActiveTool('zoom'); break;
        case 'x': {
          const temp = primaryColor;
          setPrimaryColor(secondaryColor);
          setSecondaryColor(temp);
          break;
        }
        case '[': setBrushSize((s) => Math.max(s - 3, 2)); break;
        case ']': setBrushSize((s) => Math.min(s + 3, 100)); break;
      }
    };

    window.addEventListener('keydown', handlePhotoshopKeys);
    return () => window.removeEventListener('keydown', handlePhotoshopKeys);
  }, [layers, activeLayerId, primaryColor, secondaryColor, marquee, cropBox]);

  // Active layer object
  const activeLayer = layers.find((l) => l.id === activeLayerId) || layers[0];

  return (
    <div className="flex-1 flex flex-col bg-[#1e1e1e] overflow-hidden text-gray-200 select-none text-xs">
      {/* 1. Adobe Photoshop Authentic Dark Title & Menu Bar */}
      <div className="bg-[#181818] px-3 sm:px-4 py-1.5 flex flex-wrap items-center justify-between border-b border-[#2d2d2d] shadow-sm gap-2 shrink-0 z-30">
        {/* Left: Photoshop Icon & File Info */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-[#001e36] border border-[#31a8ff] text-[#31a8ff] flex items-center justify-center font-black text-xs shadow-xs">
            Ps
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-sm text-white">
              <span className="truncate max-w-[200px] sm:max-w-xs">
                {initialPhotoFile ? initialPhotoFile.name : 'MY-DOC_Design_Artboard_2026.psd'}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-900/60 text-sky-300 border border-sky-700 font-mono">
                @ {zoomLevel}% (RGB/8)
              </span>
            </div>
            <span className="text-[10px] text-gray-400">
              Photoshop CC 2026 Sovereign Edition | الأداة الحالية: {activeTool.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Center: Quick Undo / Redo & Sample Toast */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleUndo}
            disabled={currentHistoryIndex <= 0}
            className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 cursor-pointer text-gray-300"
            title="تراجع (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleRedo}
            disabled={currentHistoryIndex >= historySteps.length - 1}
            className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 cursor-pointer text-gray-300"
            title="إعادة (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          {sampledColorToast && (
            <div className="bg-sky-950 border border-sky-500 text-sky-300 px-2.5 py-1 rounded-full text-[11px] animate-in fade-in flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: primaryColor }} />
              <span>{sampledColorToast}</span>
            </div>
          )}
        </div>

        {/* Right: Actions (Open Local Image/PSD, Export PNG/JPG) */}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1 px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer transition border border-white/10 shadow-xs">
            <FolderOpen className="w-3.5 h-3.5 text-sky-400" />
            <span>فتح صورة / تصميم من جهازك</span>
            <input
              type="file"
              accept=".png,.jpg,.jpeg,.webp,.psd,.svg"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>

          <button
            onClick={() => exportImage('png')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white font-bold cursor-pointer transition shadow-xs"
            title="تصدير بدقة PNG الشفافة"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تصدير PNG</span>
          </button>

          <button
            onClick={() => exportImage('jpeg')}
            className="px-2.5 py-1.5 rounded bg-gray-700 hover:bg-gray-600 text-white font-bold cursor-pointer transition shadow-xs text-xs"
            title="تصدير JPG"
          >
            JPG
          </button>
        </div>
      </div>

      {/* 2. Photoshop Contextual Options Bar (Dynamic per active tool) */}
      <div className="bg-[#262626] border-b border-[#333333] px-3 py-1.5 flex flex-wrap items-center gap-3 text-xs shrink-0 select-none text-gray-300">
        <span className="font-bold text-white capitalize bg-gray-700 px-2 py-0.5 rounded text-[11px]">
          {activeTool}
        </span>

        {/* Brush & Eraser Options */}
        {(activeTool === 'brush' || activeTool === 'eraser' || activeTool === 'shape') && (
          <>
            <div className="flex items-center gap-1.5">
              <span className="text-gray-400">الحجم:</span>
              <input
                type="range"
                min="2"
                max="80"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-20 h-1 bg-gray-700 rounded accent-sky-400 cursor-pointer"
              />
              <span className="font-mono text-[10px] w-6">{brushSize}px</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-gray-400">العتامة (Opacity):</span>
              <input
                type="range"
                min="10"
                max="100"
                value={brushOpacity}
                onChange={(e) => setBrushOpacity(Number(e.target.value))}
                className="w-16 h-1 bg-gray-700 rounded accent-sky-400 cursor-pointer"
              />
              <span className="font-mono text-[10px] w-7">{brushOpacity}%</span>
            </div>
          </>
        )}

        {/* Text Tool Options */}
        {activeTool === 'text' && (
          <div className="flex items-center gap-2">
            <span className="text-gray-400">النص:</span>
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="bg-[#1a1a1a] border border-gray-600 rounded px-2 py-0.5 text-xs text-white outline-none w-48"
              placeholder="اكتب النص هنا ثم انقر على الكانفاس..."
            />
            <span className="text-[10px] text-gray-400">انقر بالفأرة على الكانفاس لوضع النص</span>
          </div>
        )}

        {/* Shape Options */}
        {activeTool === 'shape' && (
          <div className="flex items-center gap-1">
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
              دائرة
            </button>
            <button
              onClick={() => setShapeType('line')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${shapeType === 'line' ? 'bg-sky-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              خط مستقيم
            </button>
          </div>
        )}

        {/* Marquee Options */}
        {activeTool === 'marquee' && marquee.active && (
          <div className="flex items-center gap-2">
            <span className="text-sky-400 font-mono text-[11px]">
              تحديد: {Math.abs(marquee.endX - marquee.startX)}x{Math.abs(marquee.endY - marquee.startY)}px
            </span>
            <button
              onClick={clearMarqueeSelection}
              className="px-2 py-0.5 rounded bg-red-800 hover:bg-red-700 text-white text-[10px] font-bold cursor-pointer"
            >
              مسح التحديد (Del)
            </button>
            <button
              onClick={fillMarqueeWithForeground}
              className="px-2 py-0.5 rounded bg-sky-700 hover:bg-sky-600 text-white text-[10px] font-bold cursor-pointer"
            >
              تعبئة التحديد
            </button>
          </div>
        )}

        {/* Crop Options */}
        {activeTool === 'crop' && cropBox.active && (
          <div className="flex items-center gap-2 bg-black/40 px-2 py-0.5 rounded border border-gray-600">
            <span className="text-yellow-400 font-mono text-[11px]">
              اقتصاص: {Math.abs(cropBox.endX - cropBox.startX)}x{Math.abs(cropBox.endY - cropBox.startY)}px
            </span>
            <button
              onClick={applyCrop}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>تنفيذ الاقتصاص ✓</span>
            </button>
            <button
              onClick={() => setCropBox({ startX: 0, startY: 0, endX: 0, endY: 0, active: false })}
              className="p-1 hover:text-red-400 cursor-pointer"
              title="إلغاء الاقتصاص"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Zoom & Pan Controls */}
        <div className="mr-auto flex items-center gap-2">
          <button onClick={() => setZoomLevel((z) => Math.max(z - 15, 30))} className="p-1 hover:text-white" title="تصغير">
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-[10px] text-gray-300">{zoomLevel}%</span>
          <button onClick={() => setZoomLevel((z) => Math.min(z + 15, 300))} className="p-1 hover:text-white" title="تكبير">
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setZoomLevel(100);
              setPanOffset({ x: 0, y: 0 });
            }}
            className="px-1.5 py-0.5 rounded bg-gray-700 hover:bg-gray-600 text-[10px]"
            title="إعادة ضبط حجم العرض والمركز"
          >
            100%
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
        <div className="w-12 bg-[#262626] border-l border-[#333333] flex flex-col items-center py-2 gap-1 shrink-0 z-10 select-none">
          {[
            { id: 'move' as PhotoshopTool, icon: MousePointer, title: 'أداة التحريك (V: Move Tool)' },
            { id: 'marquee' as PhotoshopTool, icon: Square, title: 'أداة التحديد المستطيل (M: Marquee)' },
            { id: 'crop' as PhotoshopTool, icon: Crop, title: 'أداة الاقتصاص (C: Crop)' },
            { id: 'eyedropper' as PhotoshopTool, icon: Pipette, title: 'أداة الماصة واختيار اللون (I: Eyedropper)' },
            { id: 'brush' as PhotoshopTool, icon: Brush, title: 'أداة الفرشاة للرسم (B: Brush Tool)' },
            { id: 'eraser' as PhotoshopTool, icon: Eraser, title: 'أداة الممحاة (E: Eraser Tool)' },
            { id: 'bucket' as PhotoshopTool, icon: PaintBucket, title: 'أداة سطل الدهان (G: Paint Bucket)' },
            { id: 'stamp' as PhotoshopTool, icon: Stamp, title: 'أداة الختم والنسخ (S: Clone Stamp)' },
            { id: 'text' as PhotoshopTool, icon: Type, title: 'أداة النص (T: Horizontal Type)' },
            { id: 'shape' as PhotoshopTool, icon: Circle, title: 'أداة الأشكال الهندسية (U: Shapes)' },
            { id: 'hand' as PhotoshopTool, icon: Hand, title: 'أداة اليد لتحريك العرض (H: Hand Tool)' },
            { id: 'zoom' as PhotoshopTool, icon: ZoomIn, title: 'أداة التكبير والتصغير (Z: Zoom Tool)' },
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
              className="text-[9px] text-gray-500 hover:text-white p-0.5 cursor-pointer"
              title="تبديل الألوان (X)"
            >
              ⇄
            </button>
          </div>
        </div>

        {/* Center: Interactive Photoshop Canvas Viewport */}
        <div className="flex-1 bg-[#121212] overflow-auto flex items-center justify-center p-6 relative">
          <div
            className="transition-transform duration-100 shadow-2xl border border-[#333333] rounded overflow-hidden relative"
            style={{
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
              filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) grayscale(${grayscale}%) sepia(${sepia}%) blur(${blur}px) invert(${invert}%) hue-rotate(${hueRotate}deg)`,
            }}
          >
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              className={`block bg-transparent select-none ${
                activeTool === 'brush' ? 'cursor-crosshair' :
                activeTool === 'eraser' ? 'cursor-cell' :
                activeTool === 'eyedropper' ? 'cursor-pointer' :
                activeTool === 'bucket' ? 'cursor-copy' :
                activeTool === 'text' ? 'cursor-text' :
                activeTool === 'hand' ? 'cursor-grab' :
                activeTool === 'marquee' || activeTool === 'crop' ? 'cursor-crosshair' :
                activeTool === 'zoom' ? 'cursor-zoom-in' : 'cursor-default'
              }`}
            />

            {/* Overlaid Animated Marquee Selection Box */}
            {marquee.active && (
              <div
                style={{
                  left: `${Math.min(marquee.startX, marquee.endX)}px`,
                  top: `${Math.min(marquee.startY, marquee.endY)}px`,
                  width: `${Math.abs(marquee.endX - marquee.startX)}px`,
                  height: `${Math.abs(marquee.endY - marquee.startY)}px`,
                }}
                className="absolute border-2 border-dashed border-white pointer-events-none shadow-sm animate-pulse z-20"
              />
            )}

            {/* Overlaid Crop Boundary Box */}
            {cropBox.active && (
              <div
                style={{
                  left: `${Math.min(cropBox.startX, cropBox.endX)}px`,
                  top: `${Math.min(cropBox.startY, cropBox.endY)}px`,
                  width: `${Math.abs(cropBox.endX - cropBox.startX)}px`,
                  height: `${Math.abs(cropBox.endY - cropBox.startY)}px`,
                }}
                className="absolute border-2 border-yellow-400 bg-yellow-400/10 pointer-events-none shadow-xl z-20"
              />
            )}
          </div>
        </div>

        {/* Right: Photoshop Collapsible Panels Dock */}
        <div className="w-64 sm:w-72 bg-[#252526] border-r border-[#333333] flex flex-col shrink-0 select-none">
          {/* Panel Header Tabs (Layers, Adjustments, History) */}
          <div className="flex items-center border-b border-[#333333] bg-[#2d2d2d] text-[11px] font-bold">
            <button
              onClick={() => setActiveRightTab('layers')}
              className={`flex-1 py-2 flex items-center justify-center gap-1.5 transition cursor-pointer ${
                activeRightTab === 'layers' ? 'bg-[#252526] text-white border-b-2 border-sky-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>الطبقات</span>
            </button>
            <button
              onClick={() => setActiveRightTab('adjustments')}
              className={`flex-1 py-2 flex items-center justify-center gap-1.5 transition cursor-pointer ${
                activeRightTab === 'adjustments' ? 'bg-[#252526] text-white border-b-2 border-sky-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>الفلاتر</span>
            </button>
            <button
              onClick={() => setActiveRightTab('history')}
              className={`flex-1 py-2 flex items-center justify-center gap-1.5 transition cursor-pointer ${
                activeRightTab === 'history' ? 'bg-[#252526] text-white border-b-2 border-sky-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>التاريخ</span>
            </button>
          </div>

          {/* Panel 1: Layers Panel */}
          {activeRightTab === 'layers' && (
            <div className="flex-1 flex flex-col p-3 overflow-y-auto justify-between space-y-4">
              <div className="space-y-3">
                {/* Active Layer Controls (Opacity & Blend Mode) */}
                <div className="p-2.5 bg-[#1e1e1e] rounded-lg border border-gray-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-400">عتامة الطبقة:</span>
                    <span className="font-mono text-sky-400 text-[10px]">{activeLayer.opacity}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={activeLayer.opacity}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setLayers((prev) =>
                        prev.map((l) => (l.id === activeLayerId ? { ...l, opacity: val } : l))
                      );
                    }}
                    className="w-full h-1 bg-gray-700 rounded accent-sky-400 cursor-pointer"
                  />

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-gray-400">نمط الدمج:</span>
                    <select
                      value={activeLayer.blendMode}
                      onChange={(e) => {
                        const mode = e.target.value as any;
                        setLayers((prev) =>
                          prev.map((l) => (l.id === activeLayerId ? { ...l, blendMode: mode } : l))
                        );
                      }}
                      className="bg-[#2d2d2d] border border-gray-700 rounded px-1.5 py-0.5 text-[10px] text-white outline-none cursor-pointer"
                    >
                      <option value="normal">عادي (Normal)</option>
                      <option value="multiply">ضرب (Multiply)</option>
                      <option value="screen">شاشة (Screen)</option>
                      <option value="overlay">تراكب (Overlay)</option>
                      <option value="darken">تغميق (Darken)</option>
                      <option value="lighten">تفتيح (Lighten)</option>
                      <option value="difference">فرق (Difference)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-400 pb-1 border-b border-gray-700">
                  <span>قائمة الطبقات النشطة:</span>
                  <span className="font-mono text-[10px]">({layers.length})</span>
                </div>

                {/* Layer Items List */}
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
                            className="text-gray-400 hover:text-white p-0.5 cursor-pointer"
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

              {/* Add Layer / Duplicate / Delete Layer actions */}
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
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#333333] hover:bg-gray-700 text-gray-200 text-[11px] font-bold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-400" />
                  <span>طبقة</span>
                </button>

                <button
                  onClick={() => {
                    const active = layers.find((l) => l.id === activeLayerId) || layers[0];
                    const copy: LayerItem = {
                      ...active,
                      id: `layer-${Date.now()}`,
                      name: `${active.name} (نسخة)`,
                    };
                    setLayers([copy, ...layers]);
                    setActiveLayerId(copy.id);
                  }}
                  className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-white cursor-pointer"
                  title="تكرار الطبقة النشطة (Ctrl+J)"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    if (layers.length > 1) {
                      setLayers((prev) => prev.filter((l) => l.id !== activeLayerId));
                      setActiveLayerId(layers[0].id);
                    }
                  }}
                  className="p-1.5 rounded hover:bg-red-950/40 text-gray-400 hover:text-red-400 cursor-pointer"
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
                <button onClick={resetAllFilters} className="text-[10px] text-sky-400 hover:underline cursor-pointer">
                  إعادة ضبط
                </button>
              </div>

              {/* 1-Click Instant Presets */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-gray-400 font-bold block">فلاتر سينمائية سريعة:</span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => applyPresetFilter('cyberpunk')}
                    className="p-1.5 rounded bg-[#1e1e1e] hover:bg-[#2d2d2d] border border-purple-500/40 text-purple-300 font-bold text-[10px] cursor-pointer"
                  >
                    ⚡ سايبربنك نيون
                  </button>
                  <button
                    onClick={() => applyPresetFilter('warm')}
                    className="p-1.5 rounded bg-[#1e1e1e] hover:bg-[#2d2d2d] border border-amber-500/40 text-amber-300 font-bold text-[10px] cursor-pointer"
                  >
                    ☀️ دافئ رترو
                  </button>
                  <button
                    onClick={() => applyPresetFilter('bw')}
                    className="p-1.5 rounded bg-[#1e1e1e] hover:bg-[#2d2d2d] border border-gray-500/40 text-gray-300 font-bold text-[10px] cursor-pointer"
                  >
                    🖤 أبيض وأسود
                  </button>
                  <button
                    onClick={() => applyPresetFilter('vivid')}
                    className="p-1.5 rounded bg-[#1e1e1e] hover:bg-[#2d2d2d] border border-emerald-500/40 text-emerald-300 font-bold text-[10px] cursor-pointer"
                  >
                    🎨 ألوان حيوية
                  </button>
                </div>
              </div>

              {/* Sliders */}
              <div className="space-y-2 pt-2 border-t border-gray-700">
                <div>
                  <div className="flex justify-between mb-0.5">
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
                  <div className="flex justify-between mb-0.5">
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
                  <div className="flex justify-between mb-0.5">
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
                  <div className="flex justify-between mb-0.5">
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
                  <div className="flex justify-between mb-0.5">
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
                  <div className="flex justify-between mb-0.5">
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
                  <div className="flex justify-between mb-0.5">
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

              {/* Bake Filters Permanently onto Canvas */}
              <div className="pt-3 border-t border-gray-700">
                <button
                  onClick={bakeFiltersIntoCanvas}
                  className="w-full py-2 bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white rounded font-bold text-xs cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                  title="تثبيت الفلاتر نهائياً على بكسلات الكانفاس ليتم حفظها وتصديرها"
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span>تثبيت التعديلات نهائياً على الصورة</span>
                </button>
              </div>
            </div>
          )}

          {/* Panel 3: Real Interactive History Panel */}
          {activeRightTab === 'history' && (
            <div className="flex-1 p-3 overflow-y-auto space-y-2 text-[11px]">
              <div className="flex items-center justify-between pb-1 border-b border-gray-700">
                <span className="font-bold text-gray-300">سجل العمليات (History):</span>
                <span className="font-mono text-[10px] text-gray-500">{historySteps.length} عملية</span>
              </div>

              <div className="space-y-1">
                {historySteps.map((step, idx) => {
                  const isActive = idx === currentHistoryIndex;
                  return (
                    <div
                      key={`${step.name}-${idx}`}
                      onClick={() => handleJumpToHistory(idx)}
                      className={`p-2 rounded flex items-center justify-between cursor-pointer transition ${
                        isActive
                          ? 'bg-sky-900/80 border border-sky-400 text-white font-bold'
                          : 'bg-[#1e1e1e] border border-gray-800 text-gray-400 hover:text-gray-200 hover:bg-[#282828]'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <History className={`w-3.5 h-3.5 ${isActive ? 'text-sky-300' : 'text-gray-500'}`} />
                        <span className="truncate">{step.name}</span>
                      </div>
                      <span className="text-[9px] font-mono text-gray-500">{step.time}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
