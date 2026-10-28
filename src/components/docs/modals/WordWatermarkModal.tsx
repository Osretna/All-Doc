import React, { useState } from 'react';
import { X, Droplet } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  config: { text: string; enabled: boolean; color?: string; opacity?: number };
  onApplyWatermark: (cfg: { text: string; enabled: boolean; color?: string; opacity?: number }) => void;
}

export const WordWatermarkModal: React.FC<Props> = ({
  isOpen,
  onClose,
  config,
  onApplyWatermark,
}) => {
  const [enabled, setEnabled] = useState(config.enabled ?? false);
  const [text, setText] = useState(config.text || 'مسودة');
  const [color, setColor] = useState(config.color || '#94a3b8');
  const [opacity, setOpacity] = useState(config.opacity || 0.2);

  if (!isOpen) return null;

  const presets = ['مسودة (DRAFT)', 'عاجل (URGENT)', 'سري للغاية (CONFIDENTIAL)', 'نسخة معتمدة', 'غير مصرح بالنشر'];

  const handleSave = () => {
    onApplyWatermark({ text: text.trim(), enabled, color, opacity });
    onClose();
  };

  const handleClear = () => {
    onApplyWatermark({ text: '', enabled: false });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-300 w-full max-w-sm flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        <div className="flex items-center justify-between px-4 py-3 bg-[#004578] text-white">
          <div className="flex items-center gap-2">
            <Droplet className="w-5 h-5" />
            <h3 className="font-bold text-sm">العلامة المائية (Watermark)</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded cursor-pointer transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4 text-xs text-gray-700">
          <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-900">
            <input
              type="checkbox"
              checked={enabled}
              onChange={e => setEnabled(e.target.checked)}
              className="rounded text-[#004578]"
            />
            <span>تفعيل العلامة المائية على كافة صفحات المستند</span>
          </label>

          <div className="space-y-3">
            <div>
              <label className="block text-gray-600 font-medium mb-1">نص العلامة المائية:</label>
              <input
                type="text"
                value={text}
                onChange={e => setText(e.target.value)}
                disabled={!enabled}
                className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-[#004578] disabled:bg-gray-100"
                placeholder="أدخل النص..."
              />
            </div>

            <div>
              <label className="block text-gray-500 text-[11px] mb-1">نماذج سريعة جاهزة:</label>
              <div className="flex flex-wrap gap-1">
                {presets.map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => { setText(p); setEnabled(true); }}
                    className="px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] cursor-pointer"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-gray-600 font-medium mb-1">اللون:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={color}
                    onChange={e => setColor(e.target.value)}
                    disabled={!enabled}
                    className="w-8 h-8 rounded border-none cursor-pointer"
                  />
                  <span className="font-mono text-[11px]">{color}</span>
                </div>
              </div>

              <div>
                <label className="block text-gray-600 font-medium mb-1">الشفافية: {Math.round(opacity * 100)}%</label>
                <input
                  type="range"
                  min="0.05"
                  max="0.8"
                  step="0.05"
                  value={opacity}
                  onChange={e => setOpacity(parseFloat(e.target.value))}
                  disabled={!enabled}
                  className="w-full accent-[#004578]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-2.5 bg-gray-100 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={handleClear}
            className="text-red-600 hover:text-red-700 text-xs font-bold cursor-pointer"
          >
            إزالة العلامة
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-medium cursor-pointer"
            >
              إلغاء
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-1.5 rounded bg-[#004578] hover:bg-[#00345b] text-white font-bold text-xs cursor-pointer shadow-xs"
            >
              تطبيق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
