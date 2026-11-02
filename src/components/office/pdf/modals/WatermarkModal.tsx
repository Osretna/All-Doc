import React, { useState } from 'react';
import { X, Droplet, Check } from 'lucide-react';
import { PdfWatermarkConfig } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentConfig: PdfWatermarkConfig;
  onApplyWatermark: (config: PdfWatermarkConfig) => void;
  onRemoveWatermark: () => void;
}

export const WatermarkModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentConfig,
  onApplyWatermark,
  onRemoveWatermark,
}) => {
  const [text, setText] = useState(currentConfig.text || 'سري للغاية');
  const [color, setColor] = useState(currentConfig.color || '#dc2626');
  const [opacity, setOpacity] = useState(currentConfig.opacity || 0.25);
  const [rotation, setRotation] = useState(currentConfig.rotation || -45);
  const [fontSize, setFontSize] = useState(currentConfig.fontSize || 54);

  if (!isOpen) return null;

  const presets = ['سري للغاية', 'مسودة - DRAFT', 'معتمد رسمياً', 'نسخة للمراجعة', 'CONFIDENTIAL'];

  const handleApply = () => {
    onApplyWatermark({
      enabled: true,
      text,
      color,
      opacity,
      rotation,
      fontSize,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 text-right">
        {/* Header */}
        <div className="bg-[#ba141a] text-white px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplet className="w-5 h-5" />
            <h3 className="font-bold text-sm">إضافة علامة مائية (Watermark)</h3>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded transition cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Preset Buttons */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1.5">نصوص جاهزة شائعة:</label>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setText(preset)}
                  className={`px-2.5 py-1 rounded-full border text-[11px] font-medium transition cursor-pointer ${
                    text === preset
                      ? 'bg-red-50 border-[#ba141a] text-[#ba141a] font-bold'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Text */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">نص العلامة المائية:</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-1.5 outline-none focus:border-[#ba141a]"
            />
          </div>

          {/* Controls */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">الشفافية: {Math.round(opacity * 100)}%</label>
              <input
                type="range"
                min="0.1"
                max="0.8"
                step="0.05"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="w-full accent-[#ba141a]"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">زاوية الدوران: {rotation}°</label>
              <input
                type="range"
                min="-90"
                max="90"
                step="15"
                value={rotation}
                onChange={(e) => setRotation(parseInt(e.target.value, 10))}
                className="w-full accent-[#ba141a]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">حجم الخط: {fontSize}px</label>
              <input
                type="range"
                min="24"
                max="80"
                step="4"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                className="w-full accent-[#ba141a]"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">لون العلامة المائية:</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                />
                <span className="font-mono text-gray-600">{color}</span>
              </div>
            </div>
          </div>

          {/* Preview Box */}
          <div className="border border-gray-300 rounded-lg p-6 bg-slate-50 flex items-center justify-center min-h-[110px] relative overflow-hidden select-none">
            <span
              className="font-black whitespace-nowrap pointer-events-none"
              style={{
                color,
                opacity,
                transform: `rotate(${rotation}deg)`,
                fontSize: `${fontSize * 0.6}px`,
              }}
            >
              {text || 'معاينة'}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-5 py-3 flex items-center justify-between">
          <button
            onClick={() => {
              onRemoveWatermark();
              onClose();
            }}
            className="text-xs text-red-600 hover:underline font-semibold"
          >
            إزالة العلامة المائية
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              إلغاء
            </button>
            <button
              onClick={handleApply}
              className="px-5 py-1.5 rounded-lg bg-[#ba141a] hover:bg-[#961015] text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              تطبيق على كافة الصفحات
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
