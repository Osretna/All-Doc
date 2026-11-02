import React, { useState, useMemo, useEffect } from 'react';
import { X, BarChart3, PieChart, TrendingUp, ScatterChart, BarChart2, Layers } from 'lucide-react';
import { SheetData } from '../../../types';

export type ChartType = 'column' | 'bar' | 'line' | 'pie' | 'area' | 'scatter' | 'combo';

export interface ChartDefinition {
  id: string;
  title: string;
  type: ChartType;
  items: { label: string; val: number }[];
  createdAt: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedRange: string[];
  data: SheetData;
  activeSheetTitle: string;
  onInsertChart?: (chart: ChartDefinition) => void;
}

// Helpers for coordinate parsing
const parseCellCoord = (cid: string) => {
  const m = cid.match(/^([A-Z]+)(\d+)$/);
  if (!m) return { col: 'A', colIdx: 0, row: 1 };
  const col = m[1];
  let colIdx = 0;
  for (let i = 0; i < col.length; i++) {
    colIdx = colIdx * 26 + (col.charCodeAt(i) - 64);
  }
  return { col, colIdx: colIdx - 1, row: parseInt(m[2], 10) };
};

const colIndexToLetters = (idx: number): string => {
  let temp = idx;
  let letter = '';
  while (temp >= 0) {
    letter = String.fromCharCode((temp % 26) + 65) + letter;
    temp = Math.floor(temp / 26) - 1;
  }
  return letter;
};

// Robust number cleaner for Excel cells (handles currency, negatives with parens e.g. (1,200), commas, percentages)
const parseCleanNumber = (val: any): number | null => {
  if (val === undefined || val === null) return null;
  const s = String(val).trim();
  if (!s) return null;

  const isNegParen = /^\(.*\)$/.test(s);
  const stripped = s.replace(/[^0-9.-]+/g, '');
  if (!stripped || stripped === '-' || stripped === '.') return null;
  let num = parseFloat(stripped);
  if (isNaN(num)) return null;
  if (isNegParen && num > 0) num = -num;
  return num;
};

export const ChartModal: React.FC<Props> = ({
  isOpen,
  onClose,
  selectedRange,
  data,
  activeSheetTitle,
  onInsertChart,
}) => {
  const [chartType, setChartType] = useState<ChartType>('column');
  const [chartTitle, setChartTitle] = useState('');
  const [showValues, setShowValues] = useState(true);

  // Extract REAL data from mouse-selected cells or active table
  const extraction = useMemo(() => {
    if (!isOpen) {
      return { items: [], detectedTitle: '', isRealData: false, totalScannedRows: 0 };
    }

    // 1. Gather all cells to analyze
    let cellsToScan = selectedRange && selectedRange.length > 0 ? [...selectedRange] : [];

    // If single cell or empty range, scan outward to detect contiguous table
    if (cellsToScan.length <= 1) {
      const baseCell = cellsToScan[0] || 'A1';
      const baseP = parseCellCoord(baseCell);

      let minC = baseP.colIdx;
      let maxC = baseP.colIdx;
      let minR = baseP.row;
      let maxR = baseP.row;

      // Expand horizontally
      while (minC > 0 && data[`${colIndexToLetters(minC - 1)}${baseP.row}`]?.value) {
        minC--;
      }
      while (minC <= 50 && data[`${colIndexToLetters(maxC + 1)}${baseP.row}`]?.value) {
        maxC++;
      }
      // Expand vertically
      while (minR > 1 && data[`${colIndexToLetters(baseP.colIdx)}${minR - 1}`]?.value) {
        minR--;
      }
      while (minR <= 500 && data[`${colIndexToLetters(baseP.colIdx)}${maxR + 1}`]?.value) {
        maxR++;
      }

      if (maxR > minR || maxC > minC) {
        cellsToScan = [];
        for (let r = minR; r <= maxR; r++) {
          for (let c = minC; c <= maxC; c++) {
            cellsToScan.push(`${colIndexToLetters(c)}${r}`);
          }
        }
      }
    }

    if (cellsToScan.length === 0) {
      return { items: [], detectedTitle: '', isRealData: false, totalScannedRows: 0 };
    }

    // Sort cells by row, then column
    const parsedCells = cellsToScan.map(parseCellCoord);
    const colIndices = Array.from(new Set(parsedCells.map((p) => p.colIdx))).sort((a, b) => a - b);
    const rowNumbers = Array.from(new Set(parsedCells.map((p) => p.row))).sort((a, b) => a - b);

    let detectedTitle = '';
    const extractedItems: { label: string; val: number }[] = [];

    // CASE 1: Multiple columns selected (e.g. 2 or more columns, like Category and Amount)
    if (colIndices.length >= 2) {
      // Check if first row contains headers
      const topRow = rowNumbers[0];
      const headerTexts: Record<number, string> = {};
      let topRowHasText = false;

      colIndices.forEach((cIdx) => {
        const val = String(data[`${colIndexToLetters(cIdx)}${topRow}`]?.value || '').trim();
        if (val) {
          headerTexts[cIdx] = val;
          if (isNaN(Number(val.replace(/[^0-9.-]+/g, '')))) {
            topRowHasText = true;
          }
        }
      });

      const startRowIdx = topRowHasText && rowNumbers.length > 1 ? 1 : 0;

      // Identify label column vs numeric column
      // Count numeric cells per column (excluding header)
      let labelColIdx = colIndices[0];
      let valColIdx = colIndices[1];
      let maxNumCount = -1;

      colIndices.forEach((cIdx) => {
        let numCount = 0;
        for (let rIdx = startRowIdx; rIdx < rowNumbers.length; rIdx++) {
          const r = rowNumbers[rIdx];
          const num = parseCleanNumber(data[`${colIndexToLetters(cIdx)}${r}`]?.value);
          if (num !== null) numCount++;
        }
        if (numCount > maxNumCount) {
          maxNumCount = numCount;
          valColIdx = cIdx;
        }
      });

      // Label column is the first non-value column with text
      const candidateLabelCol = colIndices.find((c) => c !== valColIdx);
      if (candidateLabelCol !== undefined) {
        labelColIdx = candidateLabelCol;
      }

      if (headerTexts[valColIdx]) {
        detectedTitle = headerTexts[valColIdx];
      }

      for (let rIdx = startRowIdx; rIdx < rowNumbers.length; rIdx++) {
        const r = rowNumbers[rIdx];
        const rawVal = data[`${colIndexToLetters(valColIdx)}${r}`]?.value;
        const num = parseCleanNumber(rawVal);
        if (num !== null) {
          const rawLabel = String(data[`${colIndexToLetters(labelColIdx)}${r}`]?.value || '').trim();
          const label = rawLabel || `عنصر ${r}`;
          extractedItems.push({ label, val: num });
        }
      }
    }
    // CASE 2: Single column selected (vertical data)
    else if (colIndices.length === 1) {
      const cIdx = colIndices[0];
      const colLetter = colIndexToLetters(cIdx);
      const topRow = rowNumbers[0];
      const topVal = data[`${colLetter}${topRow}`]?.value;
      const topNum = parseCleanNumber(topVal);

      let startRowIdx = 0;
      if (topNum === null && String(topVal || '').trim()) {
        detectedTitle = String(topVal).trim();
        startRowIdx = 1;
      }

      // Check adjacent columns for labels: left column first, then right column, then column A
      const leftColLetter = cIdx > 0 ? colIndexToLetters(cIdx - 1) : null;
      const rightColLetter = colIndexToLetters(cIdx + 1);

      for (let rIdx = startRowIdx; rIdx < rowNumbers.length; rIdx++) {
        const r = rowNumbers[rIdx];
        const num = parseCleanNumber(data[`${colLetter}${r}`]?.value);
        if (num !== null) {
          let label = '';
          if (leftColLetter && data[`${leftColLetter}${r}`]?.value) {
            label = String(data[`${leftColLetter}${r}`]?.value).trim();
          } else if (rightColLetter && data[`${rightColLetter}${r}`]?.value) {
            label = String(data[`${rightColLetter}${r}`]?.value).trim();
          } else if (data[`A${r}`]?.value) {
            label = String(data[`A${r}`]?.value).trim();
          } else {
            label = `صف ${r}`;
          }
          extractedItems.push({ label, val: num });
        }
      }
    }
    // CASE 3: Single row selected (horizontal data e.g. months)
    else if (rowNumbers.length === 1) {
      const r = rowNumbers[0];
      const rowAbove = r > 1 ? r - 1 : null;

      colIndices.forEach((cIdx) => {
        const colLetter = colIndexToLetters(cIdx);
        const num = parseCleanNumber(data[`${colLetter}${r}`]?.value);
        if (num !== null) {
          let label = '';
          if (rowAbove && data[`${colLetter}${rowAbove}`]?.value) {
            label = String(data[`${colLetter}${rowAbove}`]?.value).trim();
          } else {
            label = colLetter;
          }
          extractedItems.push({ label, val: num });
        }
      });
    }

    if (extractedItems.length > 0) {
      return {
        items: extractedItems.slice(0, 25),
        detectedTitle: detectedTitle || `تحليل بيانات (${activeSheetTitle})`,
        isRealData: true,
        totalScannedRows: extractedItems.length,
      };
    }

    // Fallback neutral sample only if sheet cells had zero numbers
    return {
      items: [
        { label: 'عنصر 1', val: 50 },
        { label: 'عنصر 2', val: 80 },
        { label: 'عنصر 3', val: 65 },
        { label: 'عنصر 4', val: 95 },
        { label: 'عنصر 5', val: 70 },
      ],
      detectedTitle: `مخطط بياني (${activeSheetTitle})`,
      isRealData: false,
      totalScannedRows: 5,
    };
  }, [isOpen, selectedRange, data, activeSheetTitle]);

  // Sync title when modal opens or extracted data changes
  useEffect(() => {
    if (isOpen && extraction.detectedTitle) {
      setChartTitle(extraction.detectedTitle);
    }
  }, [isOpen, extraction.detectedTitle]);

  if (!isOpen) return null;

  const chartItems = extraction.items;
  const maxVal = Math.max(...chartItems.map((i) => i.val), 1);
  const minVal = Math.min(...chartItems.map((i) => i.val), 0);
  const totalVal = chartItems.reduce((acc, curr) => acc + Math.max(0, curr.val), 0) || 1;

  const chartColors = [
    '#107c41', '#2563eb', '#d97706', '#9333ea', '#dc2626',
    '#0891b2', '#4f46e5', '#ca8a04', '#059669', '#be185d',
    '#0284c7', '#ea580c', '#16a34a', '#7c3aed', '#db2777'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-[#107c41] text-white px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-100" />
            <div>
              <h3 className="font-bold text-sm">إدراج مخطط بياني (Microsoft Excel Charts)</h3>
              <p className="text-[10px] text-emerald-100 font-medium">
                بيانات حقيقية مستخرجة من التحديد بالماوس في ورقة العمل
              </p>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded transition cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Chart Type Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">نوع المخطط المطلوب:</label>
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
                    className={`flex flex-col items-center justify-center p-2 rounded-lg border text-xs font-semibold transition cursor-pointer ${
                      isSelected
                        ? 'border-[#107c41] bg-emerald-50 text-[#107c41] ring-2 ring-emerald-500/30 font-bold shadow-xs'
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">عنوان المخطط:</label>
              <input
                type="text"
                value={chartTitle}
                onChange={(e) => setChartTitle(e.target.value)}
                placeholder="عنوان المخطط التحليلي..."
                className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs outline-none focus:border-[#107c41] font-bold text-gray-800"
              />
            </div>
            <div className="flex items-center gap-3 pb-1">
              <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showValues}
                  onChange={(e) => setShowValues(e.target.checked)}
                  className="accent-[#107c41] rounded"
                />
                <span className="font-medium">إظهار تسميات البيانات (القيم الرقمية)</span>
              </label>
            </div>
          </div>

          {/* Chart Preview Canvas */}
          <div className="border border-gray-200 rounded-lg p-4 bg-slate-50 min-h-[270px] flex flex-col justify-between">
            <div className="text-center font-bold text-gray-800 text-sm mb-3 border-b border-gray-200 pb-2 flex items-center justify-center gap-2">
              <span>{chartTitle || 'مخطط بياني تحليلي'}</span>
              <span className="text-xs font-normal text-gray-500">({activeSheetTitle})</span>
            </div>

            {/* 1. COLUMN CHART */}
            {chartType === 'column' && (
              <div className="flex items-end justify-around h-48 gap-2 pt-6 px-2">
                {chartItems.map((item, idx) => {
                  const heightPercent = Math.max(8, Math.round((Math.max(0, item.val) / maxVal) * 88));
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group min-w-[28px]">
                      {showValues && (
                        <span className="text-[10px] font-bold text-gray-700 transition group-hover:text-[#107c41]">
                          {item.val.toLocaleString()}
                        </span>
                      )}
                      <div
                        className="w-full max-w-[44px] rounded-t-md transition-all duration-300 group-hover:opacity-85 shadow-xs"
                        style={{
                          height: `${heightPercent}%`,
                          backgroundColor: chartColors[idx % chartColors.length],
                        }}
                        title={`${item.label}: ${item.val.toLocaleString()}`}
                      />
                      <span className="text-[9.5px] text-gray-700 text-center truncate w-full mt-1 font-medium" title={item.label}>
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 2. BAR CHART (Horizontal) */}
            {chartType === 'bar' && (
              <div className="space-y-2 py-2 max-h-52 overflow-y-auto px-2">
                {chartItems.map((item, idx) => {
                  const widthPercent = Math.max(8, Math.round((Math.max(0, item.val) / maxVal) * 92));
                  return (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      <span className="w-28 text-left truncate text-gray-700 font-medium" title={item.label}>
                        {item.label}
                      </span>
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

            {/* 3. LINE CHART (Real SVG Connected Line) */}
            {chartType === 'line' && (
              <div className="h-48 flex flex-col justify-end px-2">
                <div className="relative h-36 border-b border-l border-gray-300">
                  <svg className="w-full h-full overflow-visible">
                    {(() => {
                      const count = chartItems.length;
                      const pts = chartItems.map((item, idx) => {
                        const x = count <= 1 ? 50 : (idx / (count - 1)) * 96 + 2;
                        const y = 92 - (Math.max(0, item.val) / maxVal) * 82;
                        return { x, y, val: item.val, label: item.label };
                      });
                      const polylinePts = pts.map((p) => `${p.x}%,${p.y}%`).join(' ');

                      return (
                        <>
                          <polyline
                            fill="none"
                            stroke="#107c41"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            points={polylinePts}
                          />
                          {pts.map((p, idx) => (
                            <g key={idx}>
                              <circle
                                cx={`${p.x}%`}
                                cy={`${p.y}%`}
                                r="4.5"
                                fill="#ffffff"
                                stroke="#107c41"
                                strokeWidth="2.5"
                              />
                              {showValues && (
                                <text
                                  x={`${p.x}%`}
                                  y={`calc(${p.y}% - 8px)`}
                                  fontSize="9.5"
                                  textAnchor="middle"
                                  fill="#107c41"
                                  fontWeight="bold"
                                >
                                  {p.val.toLocaleString()}
                                </text>
                              )}
                            </g>
                          ))}
                        </>
                      );
                    })()}
                  </svg>
                </div>
                <div className="flex justify-between text-[9.5px] text-gray-600 pt-1">
                  {chartItems.map((item, idx) => (
                    <span key={idx} className="truncate max-w-[60px] text-center font-medium" title={item.label}>
                      {item.label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 4. AREA CHART (SVG Polygon Gradient Fill) */}
            {chartType === 'area' && (
              <div className="h-48 flex flex-col justify-end px-2">
                <div className="relative h-36 border-b border-l border-gray-300">
                  <svg className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#107c41" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#107c41" stopOpacity="0.05" />
                      </linearGradient>
                    </defs>
                    {(() => {
                      const count = chartItems.length;
                      const pts = chartItems.map((item, idx) => {
                        const x = count <= 1 ? 50 : (idx / (count - 1)) * 96 + 2;
                        const y = 92 - (Math.max(0, item.val) / maxVal) * 82;
                        return { x, y, val: item.val, label: item.label };
                      });
                      const polylinePts = pts.map((p) => `${p.x}%,${p.y}%`).join(' ');
                      const polygonPts = `${pts[0].x}%,100% ` + polylinePts + ` ${pts[pts.length - 1].x}%,100%`;

                      return (
                        <>
                          <polygon fill="url(#areaGradient)" points={polygonPts} />
                          <polyline
                            fill="none"
                            stroke="#107c41"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            points={polylinePts}
                          />
                          {pts.map((p, idx) => (
                            <g key={idx}>
                              <circle cx={`${p.x}%`} cy={`${p.y}%`} r="3.5" fill="#107c41" />
                              {showValues && (
                                <text
                                  x={`${p.x}%`}
                                  y={`calc(${p.y}% - 8px)`}
                                  fontSize="9.5"
                                  textAnchor="middle"
                                  fill="#1e293b"
                                  fontWeight="bold"
                                >
                                  {p.val.toLocaleString()}
                                </text>
                              )}
                            </g>
                          ))}
                        </>
                      );
                    })()}
                  </svg>
                </div>
                <div className="flex justify-between text-[9.5px] text-gray-600 pt-1">
                  {chartItems.map((item, idx) => (
                    <span key={idx} className="truncate max-w-[60px] text-center font-medium" title={item.label}>
                      {item.label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 5. PIE / DONUT CHART (Accurate SVG Segments & Legend) */}
            {chartType === 'pie' && (
              <div className="flex flex-col sm:flex-row items-center justify-around gap-4 py-2">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    {(() => {
                      let accumulatedPercent = 0;
                      return chartItems.map((item, idx) => {
                        const percent = Math.max(0, item.val) / totalVal;
                        const strokeDasharray = `${percent * 100} ${100 - percent * 100}`;
                        const strokeDashoffset = -accumulatedPercent * 100;
                        accumulatedPercent += percent;

                        return (
                          <circle
                            key={idx}
                            cx="50"
                            cy="50"
                            r="35"
                            fill="transparent"
                            stroke={chartColors[idx % chartColors.length]}
                            strokeWidth="20"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                            pathLength="100"
                            className="transition-all hover:opacity-80"
                          >
                            <title>{`${item.label}: ${item.val.toLocaleString()} (${Math.round(percent * 100)}%)`}</title>
                          </circle>
                        );
                      });
                    })()}
                  </svg>
                  <div className="absolute w-14 h-14 rounded-full bg-white flex flex-col items-center justify-center font-bold text-[11px] text-gray-800 shadow-sm pointer-events-none">
                    <span>100%</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs max-h-48 overflow-y-auto px-2">
                  {chartItems.map((item, idx) => {
                    const percent = Math.round((Math.max(0, item.val) / totalVal) * 100);
                    return (
                      <div key={idx} className="flex items-center gap-1.5">
                        <div
                          className="w-3 h-3 rounded-xs shrink-0"
                          style={{ backgroundColor: chartColors[idx % chartColors.length] }}
                        />
                        <span className="text-gray-700 truncate max-w-[120px] font-medium" title={item.label}>
                          {item.label}
                        </span>
                        <span className="text-gray-500 font-mono text-[10px] font-bold">
                          ({percent}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 6. SCATTER CHART */}
            {chartType === 'scatter' && (
              <div className="h-44 border-b border-l border-gray-300 relative p-4 flex items-center justify-around">
                {chartItems.map((item, idx) => {
                  const bottom = Math.max(5, Math.round((Math.max(0, item.val) / maxVal) * 80));
                  const left = (idx / (chartItems.length - 1 || 1)) * 80 + 10;
                  return (
                    <div
                      key={idx}
                      className="absolute w-4 h-4 rounded-full bg-indigo-600 border-2 border-white shadow-md cursor-pointer hover:scale-125 transition flex items-center justify-center group"
                      style={{
                        bottom: `${bottom}%`,
                        left: `${left}%`,
                      }}
                      title={`${item.label}: ${item.val.toLocaleString()}`}
                    >
                      {showValues && (
                        <span className="absolute -top-4 text-[9px] font-bold text-indigo-700 whitespace-nowrap bg-white/80 px-1 rounded shadow-2xs">
                          {item.val.toLocaleString()}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* 7. COMBO CHART (Columns + Trend Line) */}
            {chartType === 'combo' && (
              <div className="relative h-48 px-2 flex items-end justify-around border-b border-l border-gray-300">
                <div className="absolute inset-0 flex items-end justify-around px-2 z-10 pointer-events-none">
                  {chartItems.map((item, idx) => {
                    const heightPercent = Math.max(8, Math.round((Math.max(0, item.val) / maxVal) * 85));
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full">
                        <div
                          className="w-full max-w-[32px] rounded-t-sm shadow-xs opacity-75"
                          style={{
                            height: `${heightPercent}%`,
                            backgroundColor: chartColors[idx % chartColors.length],
                          }}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Overlaid Line */}
                <svg className="w-full h-full overflow-visible absolute inset-0 z-20 pointer-events-none">
                  {(() => {
                    const count = chartItems.length;
                    const pts = chartItems.map((item, idx) => {
                      const x = count <= 1 ? 50 : (idx / (count - 1)) * 88 + 6;
                      const y = 92 - (Math.max(0, item.val) / maxVal) * 82;
                      return { x, y, val: item.val };
                    });
                    const polylinePts = pts.map((p) => `${p.x}%,${p.y}%`).join(' ');

                    return (
                      <>
                        <polyline
                          fill="none"
                          stroke="#ea580c"
                          strokeWidth="2.5"
                          points={polylinePts}
                        />
                        {pts.map((p, idx) => (
                          <circle
                            key={idx}
                            cx={`${p.x}%`}
                            cy={`${p.y}%`}
                            r="3.5"
                            fill="#ffffff"
                            stroke="#ea580c"
                            strokeWidth="2"
                          />
                        ))}
                      </>
                    );
                  })()}
                </svg>

                {/* Bottom Labels */}
                <div className="w-full flex justify-between absolute -bottom-5 text-[9.5px] text-gray-600 px-2">
                  {chartItems.map((item, idx) => (
                    <span key={idx} className="truncate max-w-[50px] text-center font-medium" title={item.label}>
                      {item.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-gray-600 font-medium">
              {extraction.isRealData
                ? `تم استخراج ${chartItems.length} نقطة بيانات حقيقية من الخلايا المحددة بالماوس`
                : `تم توليد معاينة بيانية نموذجية (${chartItems.length} عناصر)`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              إلغاء
            </button>
            <button
              onClick={() => {
                if (onInsertChart) {
                  onInsertChart({
                    id: 'chart_' + Date.now(),
                    title: chartTitle || 'مخطط بياني تحليلي',
                    type: chartType,
                    items: chartItems,
                    createdAt: Date.now(),
                  });
                }
                onClose();
              }}
              className="px-4 py-1.5 rounded-lg bg-[#107c41] hover:bg-[#0e6b37] text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <span>تأكيد وإدراج المخطط</span>
              <span>✓</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
