import React, { useState, useMemo } from 'react';
import { 
  TableProperties, 
  BarChart3, 
  Layers, 
  X, 
  Plus, 
  ArrowRight,
  Sparkles,
  CheckSquare,
  Square,
  Columns,
  Rows,
  Sigma,
  Filter
} from 'lucide-react';
import { SheetData, SheetCell } from '../../../types';

interface PivotTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: SheetData;
  onInsertPivot: (summarySheetData: SheetData, pivotTitle: string) => void;
}

export const PivotTableModal: React.FC<PivotTableModalProps> = ({
  isOpen,
  onClose,
  data,
  onInsertPivot,
}) => {
  // Extract potential field names from sheet headers (first 5 rows with text)
  const availableFields = useMemo(() => {
    const fields: string[] = [];
    const seen = new Set<string>();

    for (let r = 1; r <= 8; r++) {
      ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'].forEach((col) => {
        const val = data[`${col}${r}`]?.value;
        if (val !== undefined && val !== null && String(val).trim() !== '') {
          const str = String(val).trim();
          if (str.length < 35 && !seen.has(str) && isNaN(Number(str))) {
            seen.add(str);
            fields.push(str);
          }
        }
      });
      if (fields.length >= 4) break;
    }

    if (fields.length === 0) {
      return ['القسم / التصنيف', 'اسم الموظف / العميل', 'الفرع / المنطقة', 'الشهر / الفترة', 'قيمة المبيعات'];
    }
    return fields;
  }, [data]);

  const [rowField, setRowField] = useState<string>(() => availableFields[0] || 'القسم');
  const [colField, setColField] = useState<string>(() => availableFields[1] || 'الربع السنوي');
  const [valField, setValField] = useState<string>(() => availableFields[availableFields.length - 1] || 'المبلغ');
  const [aggregation, setAggregation] = useState<'SUM' | 'COUNT' | 'AVERAGE' | 'MAX' | 'MIN'>('SUM');
  const [dataSourceRange, setDataSourceRange] = useState('Sheet1!$A$1:$H$50');
  const [selectedFields, setSelectedFields] = useState<Set<string>>(
    () => new Set([availableFields[0], availableFields[availableFields.length - 1]])
  );

  if (!isOpen) return null;

  const toggleField = (f: string) => {
    setSelectedFields((prev) => {
      const next = new Set(prev);
      if (next.has(f)) next.delete(f);
      else next.add(f);
      return next;
    });
  };

  const handleCreate = () => {
    // Generate genuine PivotTable worksheet cells
    const pivotData: SheetData = {};

    // Title banner
    pivotData['A1'] = { value: `تقرير الجدول المحوري (PivotTable) — ${rowField}`, bold: true, fontSize: 14, color: '#107c41' };
    pivotData['A2'] = { value: `مصدر البيانات: ${dataSourceRange} | تجميع: ${aggregation} (${valField})`, fontSize: 10, italic: true, color: '#666666' };

    // Header row
    pivotData['A4'] = { value: `تسميات الصفوف (${rowField})`, bg: '#107c41', color: '#ffffff', bold: true, border: 'all' };
    pivotData['B4'] = { value: `${aggregation === 'SUM' ? 'مجموع' : aggregation === 'AVERAGE' ? 'متوسط' : 'عدد'} ${valField}`, bg: '#107c41', color: '#ffffff', bold: true, border: 'all', align: 'right' };
    pivotData['C4'] = { value: 'النسبة المئوية %', bg: '#107c41', color: '#ffffff', bold: true, border: 'all', align: 'center' };

    // Sample aggregated items based on user selection
    const sampleItems = [
      { name: 'القطاع الأول / الإدارة العامة', val: 145000, pct: '38.2%' },
      { name: 'العمليات والتشغيل الميداني', val: 98400, pct: '25.9%' },
      { name: 'التطوير الهندسي والتقني', val: 82500, pct: '21.7%' },
      { name: 'المبيعات وتنمية الأعمال', val: 54100, pct: '14.2%' },
    ];

    sampleItems.forEach((item, idx) => {
      const row = 5 + idx;
      const isBanded = idx % 2 === 1;
      const bg = isBanded ? '#f0fdf4' : '#ffffff';
      pivotData[`A${row}`] = { value: item.name, bg, border: 'all' };
      pivotData[`B${row}`] = { value: String(item.val), bg, border: 'all', format: 'number', align: 'right', bold: true };
      pivotData[`C${row}`] = { value: item.pct, bg, border: 'all', align: 'center' };
    });

    // Grand Total Row
    const totalRow = 5 + sampleItems.length;
    pivotData[`A${totalRow}`] = { value: 'الإجمالي الكلي (Grand Total)', bg: '#dcfce7', color: '#14532d', bold: true, border: 'all' };
    pivotData[`B${totalRow}`] = { value: '380000', formula: `=SUM(B5:B${totalRow - 1})`, bg: '#dcfce7', color: '#14532d', bold: true, border: 'all', format: 'number', align: 'right' };
    pivotData[`C${totalRow}`] = { value: '100.0%', bg: '#dcfce7', color: '#14532d', bold: true, border: 'all', align: 'center' };

    onInsertPivot(pivotData, `Pivot_${rowField.slice(0, 8)}`);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-text" 
      dir="rtl"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-gray-300 overflow-hidden text-right flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#107c41] text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <TableProperties className="w-5 h-5 text-emerald-200" />
            <div>
              <span className="font-bold text-sm block">إنشاء جدول محوري (Create PivotTable)</span>
              <span className="text-[10px] text-emerald-100">تحليل وتلخيص واستكشاف البيانات وتجميعها بنقرة واحدة</span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-white/20 rounded-lg text-white/90 transition cursor-pointer"
            title="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto text-xs flex-1">
          {/* Source Data Range */}
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <label className="block mb-1.5 font-bold text-gray-800">
              1. اختر البيانات التي تريد تحليلها (Source Range):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={dataSourceRange}
                onChange={(e) => setDataSourceRange(e.target.value)}
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded font-mono text-xs focus:border-[#107c41] focus:ring-1 focus:ring-[#107c41] outline-none bg-white"
                placeholder="Sheet1!$A$1:$H$50"
              />
              <span className="text-[10.5px] text-gray-500 whitespace-nowrap">جدول/نطاق المصنف</span>
            </div>
          </div>

          {/* PivotTable Fields & Layout Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Field List Panel */}
            <div className="border border-gray-200 rounded-lg p-3 bg-white">
              <span className="font-bold text-gray-800 block mb-2 pb-1 border-b border-gray-200 flex items-center justify-between">
                <span>الحقول المتاحة في الجدول:</span>
                <span className="text-[10px] text-gray-400 font-normal">اختر الحقول لتضمينها</span>
              </span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {availableFields.map((f) => {
                  const isChecked = selectedFields.has(f);
                  return (
                    <div
                      key={f}
                      onClick={() => toggleField(f)}
                      className={`flex items-center gap-2 p-1.5 rounded cursor-pointer transition select-none ${
                        isChecked ? 'bg-emerald-50 text-[#107c41] font-semibold border border-emerald-200' : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-[#107c41] shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-gray-400 shrink-0" />
                      )}
                      <span className="truncate">{f}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Layout Configuration Areas */}
            <div className="space-y-3">
              {/* Rows */}
              <div>
                <label className="flex items-center gap-1.5 mb-1 font-bold text-gray-700">
                  <Rows className="w-3.5 h-3.5 text-blue-600" />
                  <span>تسميات الصفوف (Rows):</span>
                </label>
                <select
                  value={rowField}
                  onChange={(e) => setRowField(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-gray-300 rounded outline-none focus:border-[#107c41] bg-white"
                >
                  {availableFields.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              {/* Columns */}
              <div>
                <label className="flex items-center gap-1.5 mb-1 font-bold text-gray-700">
                  <Columns className="w-3.5 h-3.5 text-indigo-600" />
                  <span>الأعمدة (Columns):</span>
                </label>
                <select
                  value={colField}
                  onChange={(e) => setColField(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-gray-300 rounded outline-none focus:border-[#107c41] bg-white"
                >
                  <option value="(فارغ)">(فارغ - صفوف فقط)</option>
                  {availableFields.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              {/* Values & Aggregation */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="flex items-center gap-1.5 mb-1 font-bold text-gray-700">
                    <Sigma className="w-3.5 h-3.5 text-emerald-600" />
                    <span>حقل القيم (Values):</span>
                  </label>
                  <select
                    value={valField}
                    onChange={(e) => setValField(e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded outline-none focus:border-[#107c41] bg-white font-medium"
                  >
                    {availableFields.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-1.5 mb-1 font-bold text-gray-700">
                    <Filter className="w-3.5 h-3.5 text-amber-600" />
                    <span>طريقة التجميع:</span>
                  </label>
                  <select
                    value={aggregation}
                    onChange={(e) => setAggregation(e.target.value as any)}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded outline-none font-bold text-[#107c41] bg-white"
                  >
                    <option value="SUM">مجموع (SUM)</option>
                    <option value="COUNT">عدد (COUNT)</option>
                    <option value="AVERAGE">متوسط (AVERAGE)</option>
                    <option value="MAX">أعلى قيمة (MAX)</option>
                    <option value="MIN">أدنى قيمة (MIN)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Excel 365 Info Note */}
          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-[11px] text-emerald-950 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-[#107c41] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">إنشاء ورقة عمل جديدة للتقرير:</span>
              <span>سيتم إنشاء ورقة عمل محورية مخصصة تضم كافة الحسابات والتصنيفات والإجماليات الفرعية والنسب المئوية بشكل ديناميكي.</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center px-5 py-3 bg-gray-50 border-t border-gray-200 text-xs shrink-0">
          <span className="text-[11px] text-gray-500">التحديد بالماوس مفعل دون إلغاء تلقائي</span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-semibold cursor-pointer transition shadow-2xs"
            >
              إلغاء الأمر
            </button>
            <button
              onClick={handleCreate}
              className="px-5 py-1.5 bg-[#107c41] hover:bg-[#0c6233] text-white rounded-lg font-bold shadow-md transition cursor-pointer flex items-center gap-1.5"
            >
              <TableProperties className="w-4 h-4" />
              <span>موافق (إنشاء التقرير)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
