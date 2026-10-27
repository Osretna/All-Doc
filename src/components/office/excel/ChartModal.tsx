import React, { useState } from 'react';
import { X, BarChart3, PieChart, TrendingUp, ScatterChart, BarChart2, Layers } from 'lucide-react';
import { SheetData } from '../../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedRange: string[];
  data: SheetData;
  activeSheetTitle: string;
}

export type ChartType = 'column' | 'bar' | 'line' | 'pie' | 'area' | 'scatter' | 'combo';

export const ChartModal: React.FC<Props> = ({
  isOpen,
  onClose,
  selectedRange,
  data,
  activeSheetTitle,
}) => {
  const [chartType, setChartType] = useState<ChartType>('column');
  const [chartTitle, setChartTitle] = useState('مخطط بياني تحليلي');
  const [showValues, setShowValues] = useState(true);

  if (!isOpen) return null;

  // Extract data from selected range or default fallback
  const items: { label: string; val: number }[] = [];

  if (selectedRange && selectedRange.length > 1) {
    selectedRange.forEach((cid) => {
      const cell = data[cid];
      if (cell && cell.value) {
        const num = parseFloat(String(cell.value).replace(/[^0-9.-]+/g, ''));
        if (!isNaN(num)) {
          // Find adjacent label in column A or same row
          const m = cid.match(/([A-Z]+)(\d+)/);
          const row = m ? m[2] : '1';
          const label = data[`A${row}`]?.value || `عنصر ${row}`;
          items.push({ label, val: num });
        }
      }
    });
  }

  // Fallback if no numeric range selected
  const chartItems = items.length > 0 ? items.slice(0, 10) : [
    { label: 'صيانة المصاعد', val: 1200 },
    { label: 'الأمن والحراسة', val: 2500 },
    { label: 'فاتورة الكهرباء', val: 920 },
    { label: 'أعمال النظافة', val: 650 },
    { label: 'صندوق الطوارئ', val: 1000 },
  ];

  const maxVal = Math.max(...chartItems.map((i) => i.val), 1);
  const totalVal = chartItems.reduce((acc, curr) => acc + curr.val, 0) || 1;

  const chartColors = [
    '#107c41', '#2563eb', '#d97706', '#9333ea', '#dc2626',
    '#0891b2', '#4f46e5', '#ca8a04', '#059669', '#be185d'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-[#107c41] text-white px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            <h3 className="font-bold text-sm">إدراج مخطط بياني (Microsoft Excel Charts)</h3>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Chart Type Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">نوع المخطط:</label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {[
                { type: 'column', label: 'عمودي', icon: BarChart3 },
                { type: 'bar', label: 'شريطي', icon: BarChart2 },
                { type: 'line', label: 'خطي', icon: TrendingUp },
                { type: 'pie', label: 'دائري', icon: PieChart },
                { type: 'area', label: 'مساحي', icon: Layers },
                { type: 'scatter', label: 'مبعثر', icon: ScatterChart },
                { type: 'combo', label: 'مركب', icon: BarChart3 },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = chartType === item.type;
                return (
                  <button
                    key={item.type}
                    onClick={() => setChartType(item.type as ChartType)}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg border text-xs font-semibold transition ${
                      isSelected
                        ? 'border-[#107c41] bg-emerald-50 text-[#107c41] ring-2 ring-emerald-500/30'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 mb-1" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title & Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">عنوان المخطط:</label>
              <input
                type="text"
                value={chartTitle}
                onChange={(e) => setChartTitle(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs outline-none focus:border-[#107c41]"
              />
            </div>
            <div className="flex items-center gap-3 pt-5">
              <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showValues}
                  onChange={(e) => setShowValues(e.target.checked)}
                  className="accent-[#107c41] rounded"
                />
                <span>إظهار تسميات البيانات (القيم)</span>
              </label>
            </div>
          </div>

          {/* Chart Preview Area */}
          <div className="border border-gray-200 rounded-lg p-5 bg-slate-50 min-h-[260px] flex flex-col justify-between">
            <div className="text-center font-bold text-gray-800 text-sm mb-4 border-b border-gray-200 pb-2">
              {chartTitle} <span className="text-xs font-normal text-gray-500">({activeSheetTitle})</span>
            </div>

            {/* Column Chart */}
            {(chartType === 'column' || chartType === 'combo') && (
              <div className="flex items-end justify-around h-48 gap-3 pt-6 px-4">
                {chartItems.map((item, idx) => {
                  const heightPercent = Math.max(10, Math.round((item.val / maxVal) * 100));
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                      {showValues && (
                        <span className="text-[10px] font-bold text-gray-600 transition group-hover:text-[#107c41]">
                          {item.val.toLocaleString()}
                        </span>
                      )}
                      <div
                        className="w-full max-w-[48px] rounded-t-md transition-all duration-300 group-hover:opacity-85 shadow-xs"
                        style={{
                          height: `${heightPercent}%`,
                          backgroundColor: chartColors[idx % chartColors.length],
                        }}
                      />
                      <span className="text-[10px] text-gray-700 text-center truncate w-full mt-1 font-medium" title={item.label}>
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Bar Chart (Horizontal) */}
            {chartType === 'bar' && (
              <div className="space-y-2 py-2">
                {chartItems.map((item, idx) => {
                  const widthPercent = Math.max(8, Math.round((item.val / maxVal) * 100));
                  return (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      <span className="w-28 text-left truncate text-gray-700 font-medium">{item.label}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-5 overflow-hidden flex items-center">
                        <div
                          className="h-full rounded-full transition-all duration-300 flex items-center justify-end px-2 text-[10px] text-white font-bold"
                          style={{
                            width: `${widthPercent}%`,
                            backgroundColor: chartColors[idx % chartColors.length],
                          }}
                        >
                          {showValues && item.val.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Line / Area Chart */}
            {(chartType === 'line' || chartType === 'area') && (
              <div className="h-48 flex flex-col justify-end px-4">
                <div className="relative h-36 flex items-end justify-between border-b border-l border-gray-300">
                  {chartItems.map((item, idx) => {
                    const bottomPercent = Math.round((item.val / maxVal) * 85);
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center justify-end relative h-full">
                        <div
                          className="w-3 h-3 rounded-full bg-[#107c41] border-2 border-white shadow-sm absolute z-10"
                          style={{ bottom: `${bottomPercent}%` }}
                        />
                        {showValues && (
                          <span
                            className="absolute text-[9px] font-bold text-gray-700"
                            style={{ bottom: `calc(${bottomPercent}% + 14px)` }}
                          >
                            {item.val.toLocaleString()}
                          </span>
                        )}
                        <span className="text-[10px] text-gray-600 truncate w-full text-center mt-2 absolute -bottom-5">
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Pie Chart */}
            {chartType === 'pie' && (
              <div className="flex flex-col sm:flex-row items-center justify-around gap-4 py-2">
                <div className="relative w-36 h-36 rounded-full border-4 border-white shadow-md flex items-center justify-center bg-conic from-emerald-600 via-blue-600 to-amber-500">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center font-bold text-xs text-gray-700 shadow-inner">
                    100%
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {chartItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <div
                        className="w-3 h-3 rounded-xs shrink-0"
                        style={{ backgroundColor: chartColors[idx % chartColors.length] }}
                      />
                      <span className="text-gray-700 truncate max-w-[120px]">{item.label}</span>
                      <span className="text-gray-500 font-mono text-[10px]">
                        ({Math.round((item.val / totalVal) * 100)}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Scatter Chart */}
            {chartType === 'scatter' && (
              <div className="h-44 border-b border-l border-gray-300 relative p-4 flex items-center justify-around">
                {chartItems.map((item, idx) => {
                  const bottom = Math.round((item.val / maxVal) * 80);
                  return (
                    <div
                      key={idx}
                      className="absolute w-4 h-4 rounded-full bg-indigo-600 border-2 border-white shadow-md cursor-pointer hover:scale-125 transition"
                      style={{
                        bottom: `${bottom}%`,
                        left: `${(idx / (chartItems.length - 1 || 1)) * 80 + 10}%`,
                      }}
                      title={`${item.label}: ${item.val}`}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-5 py-3 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            تم استخراج البيانات من {chartItems.length} صفوف نشطة
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100"
            >
              إلغاء
            </button>
            <button
              onClick={() => {
                alert(`تم إدراج المخطط "${chartTitle}" في ورقة العمل بنجاح!`);
                onClose();
              }}
              className="px-4 py-1.5 rounded-lg bg-[#107c41] hover:bg-[#0e6b37] text-white text-xs font-bold transition shadow-xs"
            >
              تأكيد وإدراج المخطط
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
