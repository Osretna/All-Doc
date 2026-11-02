import React, { useState } from 'react';
import { Frame, X } from 'lucide-react';
import { PageBorderConfig } from '../../types/word';

interface PageBordersModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: PageBorderConfig;
  onApplyBorder: (config: PageBorderConfig) => void;
}

export const PageBordersModal: React.FC<PageBordersModalProps> = ({
  isOpen,
  onClose,
  config,
  onApplyBorder,
}) => {
  const [enabled, setEnabled] = useState(config.enabled);
  const [style, setStyle] = useState<PageBorderConfig['style']>(config.style || 'solid');
  const [width, setWidth] = useState(config.width || 2);
  const [color, setColor] = useState(config.color || '#2b579a');

  if (!isOpen) return null;

  const handleApply = () => {
    onApplyBorder({
      enabled,
      style,
      width,
      color,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4">
      <div 
        className="w-full max-w-md bg-white rounded-lg shadow-2xl border border-slate-300 overflow-hidden text-right"
        dir="rtl"
      >
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#2b579a] text-white">
          <div className="flex items-center gap-2">
            <Frame className="w-4 h-4 text-white" />
            <span className="font-semibold text-sm">حدود الصفحة (Page Borders)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded text-white/90 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4 text-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
            <input
              type="checkbox"
              id="enableBorder"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="rounded border-slate-300 text-[#2b579a] focus:ring-[#2b579a]"
            />
            <label htmlFor="enableBorder" className="font-bold text-slate-800 cursor-pointer">
              تفعيل إطار/حدود حول الصفحة (Apply Border)
            </label>
          </div>

          {enabled && (
            <div className="space-y-3">
              <div>
                <label className="block mb-1 font-medium text-slate-700">نمط الخط (Style):</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'solid', label: 'خط مصمت (Solid)', preview: 'border-solid' },
                    { id: 'double', label: 'خط مزدوج (Double)', preview: 'border-double' },
                    { id: 'dashed', label: 'خط متقطع (Dashed)', preview: 'border-dashed' },
                    { id: 'groove', label: 'إطار مخدد (Groove)', preview: 'border-solid border-2' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setStyle(s.id as any)}
                      className={`p-2 border rounded text-right flex items-center justify-between ${
                        style === s.id
                          ? 'border-[#2b579a] bg-blue-50/70 text-[#2b579a] font-bold'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{s.label}</span>
                      <span className={`w-8 h-2 border-b-2 ${s.preview} border-current`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block mb-1 font-medium text-slate-700">سُمك الحد (Width):</label>
                  <select
                    value={width}
                    onChange={(e) => setWidth(parseInt(e.target.value, 10))}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded focus:border-[#2b579a] outline-none"
                  >
                    <option value={1}>1 نقطة (1 pt)</option>
                    <option value={2}>2 نقطة (2 pt)</option>
                    <option value={3}>3 نقطة (3 pt)</option>
                    <option value={4}>4.5 نقطة (4.5 pt)</option>
                    <option value={6}>6 نقطة (6 pt - عريض)</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-medium text-slate-700">لون الإطار (Color):</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                    />
                    <span className="font-mono text-slate-600">{color}</span>
                  </div>
                </div>
              </div>

              {/* Live Preview */}
              <div className="pt-2">
                <label className="block mb-1 font-medium text-slate-700">معاينة:</label>
                <div 
                  className="w-full h-20 bg-slate-50 flex items-center justify-center text-slate-400 text-[11px]"
                  style={{
                    border: `${width}px ${style} ${color}`,
                  }}
                >
                  معاينة إطار الصفحة المباشرة
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 p-3 bg-slate-50 border-t border-slate-200 text-xs">
          <button
            onClick={handleApply}
            className="px-4 py-1.5 bg-[#2b579a] hover:bg-[#20447c] text-white rounded font-medium shadow-sm transition-colors"
          >
            تطبيق
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded hover:bg-slate-100 transition-colors"
          >
            إلغاء الأمر
          </button>
        </div>
      </div>
    </div>
  );
};
