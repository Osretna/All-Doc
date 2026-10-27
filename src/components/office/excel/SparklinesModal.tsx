import React, { useState } from 'react';
import { Activity, BarChart2, TrendingUp, X } from 'lucide-react';

interface SparklinesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertSparkline: (type: 'line' | 'column' | 'winloss', targetCell: string) => void;
  selectedCell: string;
}

export const SparklinesModal: React.FC<SparklinesModalProps> = ({
  isOpen,
  onClose,
  onInsertSparkline,
  selectedCell,
}) => {
  const [type, setType] = useState<'line' | 'column' | 'winloss'>('line');
  const [dataRange, setDataRange] = useState('B4:D4');
  const [locationRange, setLocationRange] = useState(selectedCell);

  if (!isOpen) return null;

  const handleApply = () => {
    onInsertSparkline(type, locationRange);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4" dir="rtl">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl border border-gray-300 overflow-hidden text-right">
        <div className="flex items-center justify-between px-4 py-3 bg-[#107c41] text-white">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-white" />
            <span className="font-bold text-sm">إدراج خط سباركلاين (Sparkline)</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded text-white/90">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          <div>
            <label className="block mb-1.5 font-bold text-gray-700">نوع مخطط السباركلاين:</label>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { id: 'line', label: 'خطي (Line)', icon: <TrendingUp className="w-4 h-4 text-blue-600 mb-1 mx-auto" /> },
                { id: 'column', label: 'عمودي (Column)', icon: <BarChart2 className="w-4 h-4 text-emerald-600 mb-1 mx-auto" /> },
                { id: 'winloss', label: 'ربح/خسارة', icon: <Activity className="w-4 h-4 text-amber-600 mb-1 mx-auto" /> },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setType(s.id as any)}
                  className={`p-2 rounded border text-center transition ${
                    type === s.id
                      ? 'border-[#107c41] bg-emerald-50 text-emerald-950 font-bold'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {s.icon}
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">نطاق بيانات السلسلة (Data Range):</label>
            <input
              type="text"
              value={dataRange}
              onChange={(e) => setDataRange(e.target.value)}
              className="w-full px-3 py-1.5 border border-gray-300 rounded focus:border-[#107c41] outline-none font-mono"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">نطاق الموضع (Location Range):</label>
            <input
              type="text"
              value={locationRange}
              onChange={(e) => setLocationRange(e.target.value)}
              className="w-full px-3 py-1.5 border border-gray-300 rounded focus:border-[#107c41] outline-none font-mono"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 p-3 bg-gray-50 border-t border-gray-200 text-xs">
          <button
            onClick={handleApply}
            className="px-5 py-1.5 bg-[#107c41] hover:bg-[#0c6233] text-white rounded font-bold shadow-sm transition"
          >
            موافق
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
          >
            إلغاء الأمر
          </button>
        </div>
      </div>
    </div>
  );
};
