import React, { useState } from 'react';
import { X, Check, Monitor, Smartphone, Maximize } from 'lucide-react';
import { SlideSizeConfig } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentConfig: SlideSizeConfig;
  onApplySize: (config: SlideSizeConfig) => void;
}

export const SlideSizeModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentConfig,
  onApplySize,
}) => {
  const [preset, setPreset] = useState<SlideSizeConfig['preset']>(currentConfig.preset || '16:9');
  const [orientation, setOrientation] = useState<'landscape' | 'portrait'>(
    currentConfig.orientation || 'landscape'
  );
  const [widthCm, setWidthCm] = useState<number>(currentConfig.widthCm || 33.867);
  const [heightCm, setHeightCm] = useState<number>(currentConfig.heightCm || 19.05);

  if (!isOpen) return null;

  const handleSelectPreset = (p: SlideSizeConfig['preset']) => {
    setPreset(p);
    if (p === '16:9') {
      setWidthCm(33.867);
      setHeightCm(19.05);
    } else if (p === '16:10') {
      setWidthCm(30.48);
      setHeightCm(19.05);
    } else if (p === '4:3') {
      setWidthCm(25.4);
      setHeightCm(19.05);
    }
  };

  const handleSave = () => {
    onApplySize({
      preset,
      widthCm,
      heightCm,
      orientation,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden text-right animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-[#d83b01] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Monitor className="w-5 h-5" />
            <h3 className="font-bold text-sm">حجم الشريحة (Slide Size)</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded transition cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-2">أبعاد الشاشة الموصى بها:</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleSelectPreset('16:9')}
                className={`p-3 rounded-lg border text-center transition cursor-pointer ${
                  preset === '16:9'
                    ? 'border-[#d83b01] bg-orange-50 font-bold text-[#d83b01]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-sm font-bold">16:9</div>
                <div className="text-[10px] text-gray-500">شاشة عريضة (افتراضي)</div>
              </button>

              <button
                onClick={() => handleSelectPreset('16:10')}
                className={`p-3 rounded-lg border text-center transition cursor-pointer ${
                  preset === '16:10'
                    ? 'border-[#d83b01] bg-orange-50 font-bold text-[#d83b01]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-sm font-bold">16:10</div>
                <div className="text-[10px] text-gray-500">شاشات حاسوب حديثة</div>
              </button>

              <button
                onClick={() => handleSelectPreset('4:3')}
                className={`p-3 rounded-lg border text-center transition cursor-pointer ${
                  preset === '4:3'
                    ? 'border-[#d83b01] bg-orange-50 font-bold text-[#d83b01]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-sm font-bold">4:3</div>
                <div className="text-[10px] text-gray-500">شاشات تقليدية وأجهزة عرض</div>
              </button>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-3">
            <label className="block font-bold text-gray-700 mb-2">اتجاه الشريحة:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setOrientation('landscape')}
                className={`p-2 rounded border flex items-center justify-center gap-2 transition cursor-pointer ${
                  orientation === 'landscape'
                    ? 'border-[#d83b01] bg-orange-50 font-bold text-[#d83b01]'
                    : 'border-gray-200'
                }`}
              >
                <Monitor className="w-4 h-4" />
                <span>أفقي (Landscape)</span>
              </button>
              <button
                onClick={() => setOrientation('portrait')}
                className={`p-2 rounded border flex items-center justify-center gap-2 transition cursor-pointer ${
                  orientation === 'portrait'
                    ? 'border-[#d83b01] bg-orange-50 font-bold text-[#d83b01]'
                    : 'border-gray-200'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>عمودي (Portrait)</span>
              </button>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-3 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-600 mb-1">العرض (سم):</label>
              <input
                type="number"
                step="0.1"
                value={widthCm}
                onChange={(e) => {
                  setWidthCm(parseFloat(e.target.value) || 0);
                  setPreset('custom');
                }}
                className="w-full border border-gray-300 rounded p-1.5 bg-gray-50 text-center"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">الارتفاع (سم):</label>
              <input
                type="number"
                step="0.1"
                value={heightCm}
                onChange={(e) => {
                  setHeightCm(parseFloat(e.target.value) || 0);
                  setPreset('custom');
                }}
                className="w-full border border-gray-300 rounded p-1.5 bg-gray-50 text-center"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 text-xs font-bold transition cursor-pointer"
          >
            إلغاء
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 bg-[#d83b01] hover:bg-[#b33000] text-white rounded text-xs font-bold transition flex items-center gap-1 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>تأكيد الحجم</span>
          </button>
        </div>
      </div>
    </div>
  );
};
