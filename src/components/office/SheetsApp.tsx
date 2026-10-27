import React, { useState, useEffect } from 'react';
import { SheetData, SheetCell } from '../../types';
import { localVault } from '../../utils/storage';
import { 
  Sigma, 
  BarChart3, 
  PieChart, 
  Download, 
  Plus, 
  Trash2, 
  Check, 
  DollarSign, 
  Percent, 
  FileSpreadsheet,
  X,
  Grid,
  ArrowRightLeft,
  Eye,
  FunctionSquare,
  HelpCircle,
  TrendingUp
} from 'lucide-react';

interface Props {
  fontFamily: string;
  zoomLevel: number;
}

const COLS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'];
const ROWS_COUNT = 40;

const SHEET_PRESETS: Record<string, { label: string; data: SheetData }> = {
  sheet1: {
    label: 'ورقة 1: ميزانية ملاك',
    data: {
      'A1': { value: 'كشف ميزانية اتحاد شاغلين - برج النخيل (نظام ملاك)', bold: true, bg: '#107c41', color: '#ffffff', align: 'center' },
      'A3': { value: 'البند / المصروف', bold: true, bg: '#e2e8f0', align: 'right' },
      'B3': { value: 'الشهر السابق (ر.س)', bold: true, bg: '#e2e8f0', align: 'center' },
      'C3': { value: 'الشهر الحالي (ر.س)', bold: true, bg: '#e2e8f0', align: 'center' },
      'D3': { value: 'الميزانية المعتمدة', bold: true, bg: '#e2e8f0', align: 'center' },
      'E3': { value: 'نسبة الإنجاز', bold: true, bg: '#e2e8f0', align: 'center' },

      'A4': { value: 'صيانة المصاعد الدورية' },
      'B4': { value: '1200' },
      'C4': { value: '1200' },
      'D4': { value: '1500' },
      'E4': { value: '80%' },

      'A5': { value: 'خدمات الأمن والحراسة' },
      'B5': { value: '2500' },
      'C5': { value: '2500' },
      'D5': { value: '2500' },
      'E5': { value: '100%' },

      'A6': { value: 'فاتورة الكهرباء المشتركة' },
      'B6': { value: '850' },
      'C6': { value: '920' },
      'D6': { value: '1000' },
      'E6': { value: '92%' },

      'A7': { value: 'أعمال النظافة ومواد التعقيم' },
      'B7': { value: '600' },
      'C7': { value: '650' },
      'D7': { value: '700' },
      'E7': { value: '93%' },

      'A8': { value: 'صندوق الطوارئ والاحتياطي' },
      'B8': { value: '1000' },
      'C8': { value: '1000' },
      'D8': { value: '1000' },
      'E8': { value: '100%' },

      'A9': { value: 'الإجمالي العام للمصروفات', bold: true, bg: '#dcfce7', align: 'right' },
      'B9': { value: '6150', formula: '=SUM(B4:B8)', bold: true, bg: '#dcfce7' },
      'C9': { value: '6270', formula: '=SUM(C4:C8)', bold: true, bg: '#dcfce7' },
      'D9': { value: '6700', formula: '=SUM(D4:D8)', bold: true, bg: '#dcfce7' },
      'E9': { value: '93%', bold: true, bg: '#dcfce7' },
    },
  },
  sheet2: {
    label: 'ورقة 2: مسير الرواتب والبدلات',
    data: {
      'A1': { value: 'مسير رواتب موظفي إنفينيتي تكنولوجي لتقنية المعلومات', bold: true, bg: '#1e293b', color: '#ffffff', align: 'center' },
      'A3': { value: 'اسم الموظف', bold: true, bg: '#e2e8f0' },
      'B3': { value: 'الراتب الأساسي', bold: true, bg: '#e2e8f0' },
      'C3': { value: 'بدل سكن', bold: true, bg: '#e2e8f0' },
      'D3': { value: 'بدل نقل', bold: true, bg: '#e2e8f0' },
      'E3': { value: 'خصم التأمينات', bold: true, bg: '#e2e8f0' },
      'F3': { value: 'صافي الراتب', bold: true, bg: '#e2e8f0' },

      'A4': { value: 'م. خالد الشهري' },
      'B4': { value: '14000' },
      'C4': { value: '3500' },
      'D4': { value: '1000' },
      'E4': { value: '1400' },
      'F4': { value: '17100', formula: '=SUM(B4:D4)-E4', bold: true },

      'A5': { value: 'أ. سارة المنصور' },
      'B5': { value: '11500' },
      'C5': { value: '2875' },
      'D5': { value: '1000' },
      'E5': { value: '1150' },
      'F5': { value: '14225', formula: '=SUM(B5:D5)-E5', bold: true },

      'A6': { value: 'م. ياسر القاضي' },
      'B6': { value: '16000' },
      'C6': { value: '4000' },
      'D6': { value: '1200' },
      'E6': { value: '1600' },
      'F6': { value: '19600', formula: '=SUM(B6:D6)-E6', bold: true },

      'A7': { value: 'إجمالي كتلة الرواتب الشهرية', bold: true, bg: '#fef08a' },
      'B7': { value: '41500', formula: '=SUM(B4:B6)', bold: true },
      'C7': { value: '10375', formula: '=SUM(C4:C6)', bold: true },
      'D7': { value: '3200', formula: '=SUM(D4:D6)', bold: true },
      'E7': { value: '4150', formula: '=SUM(E4:E6)', bold: true },
      'F7': { value: '50925', formula: '=SUM(F4:F6)', bold: true, bg: '#fef08a' },
    },
  },
  sheet3: {
    label: 'ورقة 3: تكاليف سيرفرات VPS',
    data: {
      'A1': { value: 'تكاليف البنية التحتية السحابية ZFS NVMe', bold: true, bg: '#0369a1', color: '#ffffff', align: 'center' },
      'A3': { value: 'الخادم السحابي', bold: true, bg: '#e2e8f0' },
      'B3': { value: 'المواصفات', bold: true, bg: '#e2e8f0' },
      'C3': { value: 'التكلفة بالدولار ($)', bold: true, bg: '#e2e8f0' },
      'D3': { value: 'المعادل بالريال (ر.س)', bold: true, bg: '#e2e8f0' },

      'A4': { value: 'SRV-ZFS-01 (الرياض)' },
      'B4': { value: '16 vCPU / 64GB RAM' },
      'C4': { value: '120' },
      'D4': { value: '450', formula: '=C4*3.75' },

      'A5': { value: 'SRV-ZFS-02 (دبي)' },
      'B5': { value: '8 vCPU / 32GB RAM' },
      'C5': { value: '80' },
      'D5': { value: '300', formula: '=C5*3.75' },

      'A6': { value: 'الإجمالي السحابي', bold: true, bg: '#e0f2fe' },
      'B6': { value: '24 Cores / 96GB' },
      'C6': { value: '200', formula: '=SUM(C4:C5)', bold: true },
      'D6': { value: '750', formula: '=SUM(D4:D5)', bold: true, bg: '#e0f2fe' },
    },
  },
};

export const SheetsApp: React.FC<Props> = ({ fontFamily, zoomLevel }) => {
  const [activeSheetKey, setActiveSheetKey] = useState<string>('sheet1');
  const [sheets, setSheets] = useState<Record<string, { label: string; data: SheetData }>>(() => {
    return localVault.get<Record<string, { label: string; data: SheetData }>>(
      localVault.KEYS.SHEETS_DATA,
      SHEET_PRESETS
    );
  });

  const [selectedCell, setSelectedCell] = useState<string>('A4');
  const [formulaInput, setFormulaInput] = useState<string>('');
  const [isRTL, setIsRTL] = useState<boolean>(true);
  const [showGridlines, setShowGridlines] = useState<boolean>(true);
  const [showChart, setShowChart] = useState<boolean>(false);
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');
  const [showFxHelper, setShowFxHelper] = useState<boolean>(false);

  const currentSheet = sheets[activeSheetKey] || sheets['sheet1'];
  const data = currentSheet.data;

  useEffect(() => {
    const cell = data[selectedCell];
    setFormulaInput(cell?.formula || cell?.value || '');
  }, [selectedCell, data, activeSheetKey]);

  const saveSheets = (newSheets: Record<string, { label: string; data: SheetData }>) => {
    setSheets(newSheets);
    localVault.set(localVault.KEYS.SHEETS_DATA, newSheets);
  };

  const evaluateFormula = (expr: string, currentData: SheetData): string => {
    if (!expr.startsWith('=')) return expr;
    const upper = expr.toUpperCase().trim();

    // Check SUM
    const sumMatch = upper.match(/^=SUM\(([A-Z])(\d+):([A-Z])(\d+)\)$/);
    if (sumMatch) {
      const colStart = sumMatch[1];
      const rowStart = parseInt(sumMatch[2], 10);
      const colEnd = sumMatch[3];
      const rowEnd = parseInt(sumMatch[4], 10);

      let sum = 0;
      if (colStart === colEnd) {
        for (let r = rowStart; r <= rowEnd; r++) {
          const val = parseFloat(currentData[`${colStart}${r}`]?.value || '0');
          if (!isNaN(val)) sum += val;
        }
      }
      return sum.toString();
    }

    // Check AVERAGE
    const avgMatch = upper.match(/^=AVERAGE\(([A-Z])(\d+):([A-Z])(\d+)\)$/);
    if (avgMatch) {
      const col = avgMatch[1];
      const r1 = parseInt(avgMatch[2], 10);
      const r2 = parseInt(avgMatch[4], 10);
      let sum = 0;
      let count = 0;
      for (let r = r1; r <= r2; r++) {
        const val = parseFloat(currentData[`${col}${r}`]?.value || '0');
        if (!isNaN(val)) {
          sum += val;
          count++;
        }
      }
      return count > 0 ? (sum / count).toFixed(2) : '0';
    }

    // Direct arithmetic e.g. =SUM(B4:D4)-E4 or =C4*3.75
    try {
      let mathStr = upper.replace(/^=/, '');
      // Replace SUM(B4:D4) inside expression
      mathStr = mathStr.replace(/SUM\(([A-Z])(\d+):([A-Z])(\d+)\)/g, (_, col1, r1, col2, r2) => {
        let subSum = 0;
        for (let r = parseInt(r1, 10); r <= parseInt(r2, 10); r++) {
          const val = parseFloat(currentData[`${col1}${r}`]?.value || '0');
          if (!isNaN(val)) subSum += val;
        }
        return subSum.toString();
      });

      mathStr = mathStr.replace(/([A-Z]\d+)/g, (match) => {
        const val = parseFloat(currentData[match]?.value || '0');
        return isNaN(val) ? '0' : val.toString();
      });

      if (/^[\d+\-*/. ()]+$/.test(mathStr)) {
        // eslint-disable-next-line no-eval
        const res = Function(`'use strict'; return (${mathStr})`)();
        return typeof res === 'number' ? (Number.isInteger(res) ? res.toString() : res.toFixed(2)) : String(res);
      }
    } catch {
      return '#ERROR!';
    }

    return expr;
  };

  const handleCellChange = (cellId: string, rawVal: string) => {
    const isFormula = rawVal.startsWith('=');
    const computedVal = isFormula ? evaluateFormula(rawVal, data) : rawVal;

    const nextData = {
      ...data,
      [cellId]: {
        ...(data[cellId] || {}),
        value: computedVal,
        formula: isFormula ? rawVal : undefined,
      },
    };

    const updatedSheets = {
      ...sheets,
      [activeSheetKey]: {
        ...currentSheet,
        data: nextData,
      },
    };
    saveSheets(updatedSheets);
  };

  const handleFormat = (prop: keyof SheetCell, value: any) => {
    const cell = data[selectedCell] || { value: '' };
    const nextData = {
      ...data,
      [selectedCell]: {
        ...cell,
        [prop]: value,
      },
    };
    saveSheets({
      ...sheets,
      [activeSheetKey]: {
        ...currentSheet,
        data: nextData,
      },
    });
  };

  const handleAddSheet = () => {
    const newKey = `sheet_${Date.now()}`;
    const newSheet = {
      label: `ورقة ${Object.keys(sheets).length + 1}: جديدة`,
      data: {
        'A1': { value: 'ورقة عمل جديدة', bold: true, bg: '#107c41', color: '#ffffff' },
      },
    };
    const updated = { ...sheets, [newKey]: newSheet };
    saveSheets(updated);
    setActiveSheetKey(newKey);
  };

  const exportCSV = () => {
    let csv = '';
    for (let r = 1; r <= 20; r++) {
      const rowVals = COLS.map((c) => `"${data[`${c}${r}`]?.value || ''}"`);
      csv += rowVals.join(',') + '\n';
    }
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentSheet.label.replace(/\s+/g, '_')}.csv`;
    link.click();
  };

  // Chart data extraction
  const chartItems = [
    { label: data['A4']?.value || 'بند 1', val: parseFloat(data['C4']?.value || data['B4']?.value || '0') },
    { label: data['A5']?.value || 'بند 2', val: parseFloat(data['C5']?.value || data['B5']?.value || '0') },
    { label: data['A6']?.value || 'بند 3', val: parseFloat(data['C6']?.value || data['B6']?.value || '0') },
    { label: data['A7']?.value || 'بند 4', val: parseFloat(data['C7']?.value || data['B7']?.value || '0') },
    { label: data['A8']?.value || 'بند 5', val: parseFloat(data['C8']?.value || data['B8']?.value || '0') },
  ].filter((i) => i.val > 0);

  const maxChartVal = Math.max(...chartItems.map((i) => i.val), 100);

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden text-xs select-none">
      {/* 1. Authentic Excel Formula Bar */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-[#f3f2f1] border-b border-gray-300">
        {/* Active Cell Reference box */}
        <div className="w-16 px-2 py-1 bg-white border border-gray-300 rounded font-mono font-bold text-center text-gray-900 shadow-2xs">
          {selectedCell}
        </div>

        {/* fx symbol button with popup helper */}
        <button
          onClick={() => setShowFxHelper(!showFxHelper)}
          className="font-serif italic font-bold text-emerald-800 text-sm px-2 py-0.5 rounded hover:bg-emerald-100 transition cursor-pointer"
          title="معالج الدوال الرياضية (fx Function Builder)"
        >
          fx
        </button>

        {/* Formula Input */}
        <input
          type="text"
          value={formulaInput}
          onChange={(e) => {
            setFormulaInput(e.target.value);
            handleCellChange(selectedCell, e.target.value);
          }}
          placeholder="أدخل صيغة رياضية مثل =SUM(B4:B8) أو =AVERAGE(C4:C8) أو =C4*1.15"
          className="flex-1 bg-white border border-gray-300 rounded px-3 py-1 text-xs text-gray-800 outline-none focus:border-[#107c41] focus:ring-1 focus:ring-[#107c41]"
        />

        {/* Right Quick Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleFormat('bold', !data[selectedCell]?.bold)}
            className={`px-2 py-1 rounded border cursor-pointer font-bold ${
              data[selectedCell]?.bold ? 'bg-emerald-100 border-emerald-400 text-emerald-800' : 'bg-white border-gray-300'
            }`}
            title="تغميق الخط (Ctrl+B)"
          >
            B
          </button>
          <button
            onClick={() => handleFormat('format', 'currency-sar')}
            className="px-2 py-1 rounded border border-gray-300 bg-white hover:bg-gray-100 cursor-pointer text-emerald-700 font-bold"
            title="تنسيق العملة (ر.س)"
          >
            ر.س
          </button>
          <button
            onClick={() => handleFormat('format', 'percent')}
            className="px-2 py-1 rounded border border-gray-300 bg-white hover:bg-gray-100 cursor-pointer text-gray-700 font-bold"
            title="نسبة مئوية (%)"
          >
            %
          </button>
          <button
            onClick={() => setIsRTL(!isRTL)}
            className="px-2 py-1 rounded border border-gray-300 bg-white hover:bg-gray-100 cursor-pointer text-gray-700 flex items-center gap-1"
            title="تغيير اتجاه ورقة العمل (يمين لليسار / يسار لليمين)"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isRTL ? 'RTL' : 'LTR'}</span>
          </button>
          <button
            onClick={() => setShowChart(!showChart)}
            className="px-2.5 py-1 rounded border border-emerald-600 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1 cursor-pointer"
            title="توليد مخطط بياني فوري"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>مخطط بياني</span>
          </button>
          <button
            onClick={exportCSV}
            className="px-2 py-1 rounded border border-gray-300 bg-white hover:bg-gray-100 cursor-pointer text-gray-700"
            title="تصدير كملف CSV"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* fx Functions Helper Popover */}
      {showFxHelper && (
        <div className="bg-emerald-50 border-b border-emerald-200 p-2.5 flex items-center gap-2 overflow-x-auto text-[11px] animate-in fade-in">
          <span className="font-bold text-emerald-900 shrink-0">معالج الدوال السريعة:</span>
          {[
            { name: '=SUM(B4:B8)', desc: 'مجموع الخلايا' },
            { name: '=AVERAGE(C4:C8)', desc: 'المتوسط الحسابي' },
            { name: '=IF(C4>1000, "فائض", "ضمن الحد")', desc: 'دالة الشرط' },
            { name: '=COUNT(A4:A20)', desc: 'عدد القيم' },
            { name: '=MAX(C4:C8)', desc: 'أعلى قيمة' },
            { name: '=MIN(C4:C8)', desc: 'أدنى قيمة' },
          ].map((fx) => (
            <button
              key={fx.name}
              onClick={() => {
                setFormulaInput(fx.name);
                handleCellChange(selectedCell, fx.name);
                setShowFxHelper(false);
              }}
              className="bg-white hover:bg-emerald-100 border border-emerald-300 text-emerald-900 px-2 py-1 rounded font-mono font-bold whitespace-nowrap shadow-2xs cursor-pointer"
            >
              {fx.name} <span className="text-[9px] text-gray-500 font-normal">({fx.desc})</span>
            </button>
          ))}
        </div>
      )}

      {/* 2. Main Spreadsheet Grid */}
      <div 
        className="flex-1 overflow-auto bg-gray-100 p-1"
        style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: isRTL ? 'top right' : 'top left' }}
      >
        <table className={`border-collapse bg-white shadow-xs min-w-full ${isRTL ? 'text-right' : 'text-left'}`}>
          <thead>
            <tr className="bg-[#f3f2f1] text-gray-600 font-semibold text-[11px]">
              <th className="w-10 p-1 border border-gray-300 text-center bg-[#eae8e6]">#</th>
              {COLS.map((col) => (
                <th key={col} className="p-1 border border-gray-300 text-center min-w-[110px] w-28">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: ROWS_COUNT }).map((_, rIdx) => {
              const rowNum = rIdx + 1;
              return (
                <tr key={rowNum} className="hover:bg-emerald-50/20">
                  {/* Row Number */}
                  <td className="p-1 border border-gray-300 text-center bg-[#f3f2f1] text-gray-500 font-mono text-[10px]">
                    {rowNum}
                  </td>

                  {/* Columns */}
                  {COLS.map((col) => {
                    const cellId = `${col}${rowNum}`;
                    const cell = data[cellId];
                    const isSelected = selectedCell === cellId;

                    return (
                      <td
                        key={cellId}
                        onClick={() => setSelectedCell(cellId)}
                        className={`p-1 relative transition-all ${
                          showGridlines ? 'border border-gray-300' : 'border border-transparent'
                        } ${
                          isSelected ? 'outline-2 outline-[#107c41] z-10 bg-emerald-50/60 shadow-xs' : ''
                        }`}
                        style={{
                          backgroundColor: cell?.bg,
                          color: cell?.color,
                          fontWeight: cell?.bold ? 'bold' : 'normal',
                          textAlign: cell?.align || (isRTL ? 'right' : 'left'),
                          fontFamily: fontFamily,
                        }}
                      >
                        <input
                          type="text"
                          value={cell?.value || ''}
                          onChange={(e) => handleCellChange(cellId, e.target.value)}
                          onFocus={() => setSelectedCell(cellId)}
                          className={`w-full bg-transparent outline-none text-xs px-1 text-inherit font-inherit ${
                            isRTL ? 'text-right' : 'text-left'
                          }`}
                        />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 3. Interactive Chart Modal */}
      {showChart && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-gray-200 p-6 text-right">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-gray-900">مخطط إكسيل البياني المعتمد (Excel Chart)</h3>
              </div>
              <button
                onClick={() => setShowChart(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-gray-500">تم استخراج البيانات تلقائياً من أعمدة ورقة العمل الحالية</span>
              <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded">
                <button
                  onClick={() => setChartType('bar')}
                  className={`px-2 py-0.5 rounded text-xs font-semibold cursor-pointer ${
                    chartType === 'bar' ? 'bg-white text-emerald-700 shadow-xs' : 'text-gray-600'
                  }`}
                >
                  أعمدة (Bar Chart)
                </button>
                <button
                  onClick={() => setChartType('pie')}
                  className={`px-2 py-0.5 rounded text-xs font-semibold cursor-pointer ${
                    chartType === 'pie' ? 'bg-white text-emerald-700 shadow-xs' : 'text-gray-600'
                  }`}
                >
                  دائري (Pie Chart)
                </button>
              </div>
            </div>

            {/* Rendered Bars */}
            <div className="mt-6 space-y-3.5">
              {chartItems.map((item, idx) => {
                const pct = Math.round((item.val / maxChartVal) * 100);
                const barColors = ['#107c41', '#0078d4', '#d83b01', '#7719aa', '#0284c7'];
                const color = barColors[idx % barColors.length];

                return (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium text-gray-700">
                      <span>{item.label}</span>
                      <span className="font-mono font-bold text-gray-900">{item.val.toLocaleString('ar-EG')} ر.س</span>
                    </div>
                    <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 shadow-inner"
                        style={{ width: `${pct}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setShowChart(false)}
                className="bg-[#107c41] text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-[#0b6a35] transition cursor-pointer"
              >
                إغلاق المخطط
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Multi-Sheet Tabs Bar (Real Microsoft Excel Sheet Switcher) */}
      <div className="flex items-center justify-between px-3 py-1 bg-[#f3f2f1] border-t border-gray-300 text-[11px] text-gray-600">
        <div className="flex items-center gap-1 overflow-x-auto">
          {Object.entries(sheets).map(([key, s]) => {
            const isActive = key === activeSheetKey;
            return (
              <button
                key={key}
                onClick={() => setActiveSheetKey(key)}
                className={`px-3 py-1 font-bold rounded-t transition cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-white text-emerald-800 border-t-2 border-emerald-600 shadow-xs'
                    : 'hover:bg-gray-200 text-gray-600'
                }`}
              >
                {s.label}
              </button>
            );
          })}

          <button
            onClick={handleAddSheet}
            className="p-1 hover:bg-gray-200 rounded text-gray-700 cursor-pointer"
            title="إضافة ورقة عمل جديدة (+)"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="text-[10px] text-gray-500 font-mono hidden sm:inline">
          Excel Sovereign Engine | Ready | 100% Offline
        </div>
      </div>
    </div>
  );
};
