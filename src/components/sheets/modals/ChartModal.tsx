import React, { useState } from 'react';
import { X, BarChart3, LineChart, PieChart, AreaChart } from 'lucide-react';
import { SheetChart } from '../../../types/office';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  targetRange: string;
  initialType?: 'column' | 'line' | 'pie' | 'area';
  onInsertChart: (chart: SheetChart) => void;
}

export const ChartModal: React.FC<Props> = ({
  isOpen,
  onClose,
  targetRange,
  initialType = 'column',
  onInsertChart,
}) => {
  const [chartType, setChartType] = useState<'column' | 'line' | 'pie' | 'area'>(initialType);
  const [title, setTitle] = useState('مخطط تحليلي للبيانات');
  const [range, setRange] = useState(targetRange || 'A1:B6');

  if (!isOpen) return null;

  const handleCreate = () => {
    const newChart: SheetChart = {
      id: `chart_${Date.now()}`,
      type: chartType,
      title: title.trim() || 'رسم بياني',
      range: range.trim().toUpperCase(),
      x: 100,
      y: 80,
      width: 480,
      height: 300,
    };
    onInsertChart(newChart);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-300 w-full max-w-lg flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        <div className="flex items-center justify-between px-4 py-3 bg-[#107c41] text-white">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            <h3 className="font-bold text-sm">إدراج مخطط بياني (Insert Chart)</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded cursor-pointer transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4 text-xs text-gray-700">
          <div>
            <label className="block font-bold mb-2">اختر نوع المخطط:</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { type: 'column', label: 'عمودي', icon: BarChart3, desc: 'مقارنة فئات' },
                { type: 'line', label: 'خطي', icon: LineChart, desc: 'اتجاه عبر الزمن' },
                { type: 'pie', label: 'دائري', icon: PieChart, desc: 'نسب من الإجمالي' },
                { type: 'area', label: 'مساحي', icon: AreaChart, desc: 'تراكم الكميات' },
              ].map(item => {
                const Icon = item.icon;
                const active = chartType === item.type;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setChartType(item.type as any)}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition ${
                      active
                        ? 'border-[#107c41] bg-emerald-50 text-[#107c41] font-bold shadow-xs'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-7 h-7 mb-1" />
                    <span>{item.label}</span>
                    <span className="text-[10px] text-gray-400 font-normal">{item.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium mb-1">عنوان المخطط:</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-[#107c41]"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">نطاق البيانات (Data Range):</label>
              <input
                type="text"
                value={range}
                onChange={e => setRange(e.target.value)}
                className="w-full border border-gray-300 rounded px-2.5 py-1.5 font-mono text-xs uppercase outline-none focus:border-[#107c41]"
              />
            </div>
          </div>
        </div>

        <div className="px-4 py-2.5 bg-gray-100 border-t border-gray-200 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-medium cursor-pointer"
          >
            إلغاء
          </button>
          <button
            onClick={handleCreate}
            className="px-5 py-1.5 rounded bg-[#107c41] hover:bg-[#0e6b37] text-white font-bold text-xs cursor-pointer shadow-xs"
          >
            إدراج المخطط
          </button>
        </div>
      </div>
    </div>
  );
};
