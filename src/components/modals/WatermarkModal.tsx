import React, { useState } from 'react';
import { ShieldAlert, X } from 'lucide-react';
import { WatermarkConfig } from '../../types/word';

interface WatermarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: WatermarkConfig;
  onApplyWatermark: (config: WatermarkConfig) => void;
}

export const WatermarkModal: React.FC<WatermarkModalProps> = ({
  isOpen,
  onClose,
  config,
  onApplyWatermark,
}) => {
  const [selectedType, setSelectedType] = useState<WatermarkConfig['type']>(config.type);
  const [customText, setCustomText] = useState(config.text || 'مسودة');
  const [color, setColor] = useState(config.color || '#94a3b8');
  const [opacity, setOpacity] = useState(config.opacity || 0.15);
  const [layout, setLayout] = useState<'diagonal' | 'horizontal'>(config.layout || 'diagonal');

  if (!isOpen) return null;

  const presets = [
    { type: 'none', label: 'بلا علامة مائية', text: '' },
    { type: 'draft', label: 'مسودة (DRAFT)', text: 'مـسـودة' },
    { type: 'confidential', label: 'سري للغاية (CONFIDENTIAL)', text: 'سـري للـغايـة' },
    { type: 'urgent', label: 'عاجل وهام (URGENT)', text: 'عـاجـل' },
    { type: 'custom', label: 'نص مخصص...', text: customText },
  ];

  const handleSave = () => {
    let finalTxt = customText;
    if (selectedType === 'draft') finalTxt = 'مـسـودة';
    else if (selectedType === 'confidential') finalTxt = 'سـري للـغايـة';
    else if (selectedType === 'urgent') finalTxt = 'عـاجـل';
    else if (selectedType === 'none') finalTxt = '';

    onApplyWatermark({
      type: selectedType,
      text: finalTxt,
      color,
      opacity,
      layout,
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
            <ShieldAlert className="w-4 h-4 text-white" />
            <span className="font-semibold text-sm">علامة مائية مطبوعة (Watermark)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded text-white/90 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4 text-xs">
          <div className="space-y-2">
            <label className="font-bold text-slate-700 block">اختر نوع العلامة المائية:</label>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((p) => (
                <button
                  key={p.type}
                  type="button"
                  onClick={() => setSelectedType(p.type as any)}
                  className={`p-2.5 rounded border text-right transition-all ${
                    selectedType === p.type
                      ? 'border-[#2b579a] bg-blue-50/70 text-[#2b579a] font-bold shadow-xs'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {selectedType === 'custom' && (
            <div>
              <label className="block mb-1 font-medium text-slate-700">النص المخصص:</label>
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-[#2b579a] outline-none"
              />
            </div>
          )}

          {selectedType !== 'none' && (
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
              <div>
                <label className="block mb-1 font-medium text-slate-700">التخطيط:</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setLayout('diagonal')}
                    className={`flex-1 py-1 px-2 border rounded ${layout === 'diagonal' ? 'bg-[#2b579a] text-white border-[#2b579a]' : 'border-slate-300 text-slate-700'}`}
                  >
                    قطري (مائل)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLayout('horizontal')}
                    className={`flex-1 py-1 px-2 border rounded ${layout === 'horizontal' ? 'bg-[#2b579a] text-white border-[#2b579a]' : 'border-slate-300 text-slate-700'}`}
                  >
                    أفقي
                  </button>
                </div>
              </div>

              <div>
                <label className="block mb-1 font-medium text-slate-700">الشفافية:</label>
                <input
                  type="range"
                  min="0.05"
                  max="0.4"
                  step="0.05"
                  value={opacity}
                  onChange={(e) => setOpacity(parseFloat(e.target.value))}
                  className="w-full accent-[#2b579a]"
                />
                <span className="text-[10px] text-slate-500">{(opacity * 100).toFixed(0)}%</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 p-3 bg-slate-50 border-t border-slate-200 text-xs">
          <button
            onClick={handleSave}
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
