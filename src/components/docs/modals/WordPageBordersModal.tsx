import React, { useState } from 'react';
import { X, Square, Shield } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  config: { style: string; width: number; color: string; enabled: boolean };
  onApplyBorder: (cfg: { style: string; width: number; color: string; enabled: boolean }) => void;
}

export const WordPageBordersModal: React.FC<Props> = ({
  isOpen,
  onClose,
  config,
  onApplyBorder,
}) => {
  const [enabled, setEnabled] = useState(config.enabled ?? false);
  const [style, setStyle] = useState(config.style || 'solid');
  const [width, setWidth] = useState(config.width || 2);
  const [color, setColor] = useState(config.color || '#0f172a');

  if (!isOpen) return null;

  const handleApply = () => {
    onApplyBorder({ style, width, color, enabled });
    onClose();
  };

  const handleClear = () => {
    onApplyBorder({ style: 'none', width: 0, color: 'transparent', enabled: false });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-300 w-full max-w-sm flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        <div className="flex items-center justify-between px-4 py-3 bg-[#004578] text-white">
          <div className="flex items-center gap-2">
            <Square className="w-5 h-5" />
            <h3 className="font-bold text-sm">حدود وإطارات الصفحة (Page Borders)</h3>
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
            <span>تفعيل إطار الصفحة الخارجي</span>
          </label>

          <div className="space-y-3">
            <div>
              <label className="block text-gray-600 font-medium mb-1">نوع الإطار:</label>
              <select
                value={style}
                onChange={e => setStyle(e.target.value)}
                disabled={!enabled}
                className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-[#004578] disabled:bg-gray-100"
              >
                <option value="solid">خط مصمت كلاسيكي (Solid Line)</option>
                <option value="double">خط مزدوج رسمي (Double Line)</option>
                <option value="dashed">خط متقطع (Dashed)</option>
                <option value="dotted">خط نقطي (Dotted)</option>
                <option value="groove">إطار بارز غائر (Groove)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-600 font-medium mb-1">سماكة الخط (العرض):</label>
                <select
                  value={width}
                  onChange={e => setWidth(parseInt(e.target.value, 10))}
                  disabled={!enabled}
                  className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-[#004578] disabled:bg-gray-100"
                >
                  <option value={1}>1 نقطة (رفيع)</option>
                  <option value={2}>2 نقطة (عادي)</option>
                  <option value={3}>3 نقطة (متوسط)</option>
                  <option value={4}>4 نقطة (سميك)</option>
                  <option value={6}>6 نقطة (عريض)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-600 font-medium mb-1">لون الإطار:</label>
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
            </div>

            {/* Preview Box */}
            <div className="border border-gray-200 rounded p-4 bg-gray-50 flex items-center justify-center">
              <div
                className="w-32 h-40 bg-white shadow-xs flex items-center justify-center text-[10px] text-gray-400 font-bold"
                style={{
                  border: enabled ? `${width}px ${style} ${color}` : '1px dashed #cbd5e1'
                }}
              >
                معاينة الإطار
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-2.5 bg-gray-100 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={handleClear}
            className="text-red-600 hover:text-red-700 text-xs font-bold cursor-pointer"
          >
            إلغاء الإطار
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-medium cursor-pointer"
            >
              إلغاء
            </button>
            <button
              onClick={handleApply}
              className="px-5 py-1.5 rounded bg-[#004578] hover:bg-[#00345b] text-white font-bold text-xs cursor-pointer shadow-xs"
            >
              تطبيق الإطار
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
