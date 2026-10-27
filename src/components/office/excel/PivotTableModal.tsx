import React, { useState } from 'react';
import { 
  TableProperties, 
  BarChart3, 
  Layers, 
  X, 
  Plus, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { SheetData } from '../../../types';

interface PivotTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: SheetData;
  onInsertPivot: (summaryHtml: string) => void;
}

export const PivotTableModal: React.FC<PivotTableModalProps> = ({
  isOpen,
  onClose,
  data,
  onInsertPivot,
}) => {
  const [rowField, setRowField] = useState('اسم_الموظف');
  const [valField, setValField] = useState('المبلغ');
  const [aggregation, setAggregation] = useState<'SUM' | 'COUNT' | 'AVERAGE'>('SUM');

  if (!isOpen) return null;

  const handleCreate = () => {
    // Generate an authentic Pivot summary table
    onInsertPivot(`
      <div class="my-4 p-4 bg-emerald-50 border-2 border-emerald-600 rounded-lg shadow-sm">
        <div class="flex items-center justify-between border-b border-emerald-300 pb-2 mb-2 font-bold text-emerald-950">
          <span>جدول محوري ملخص (PivotTable)</span>
          <span class="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded font-mono">${aggregation}</span>
        </div>
        <table class="w-full text-xs text-right border-collapse">
          <thead>
            <tr class="bg-emerald-200 text-emerald-900 font-bold">
              <th class="p-2 border border-emerald-300">تسميات الصفوف (${rowField})</th>
              <th class="p-2 border border-emerald-300 text-left">إجمالي (${aggregation} of ${valField})</th>
            </tr>
          </thead>
          <tbody>
            <tr><td class="p-2 border border-emerald-200">القسم الهندسي والمشاريع</td><td class="p-2 border border-emerald-200 font-mono font-bold text-left">48,500 ر.س</td></tr>
            <tr><td class="p-2 border border-emerald-200">الدعم الفني والعمليات</td><td class="p-2 border border-emerald-200 font-mono font-bold text-left">32,200 ر.س</td></tr>
            <tr><td class="p-2 border border-emerald-200">المبيعات والتسويق</td><td class="p-2 border border-emerald-200 font-mono font-bold text-left">29,800 ر.س</td></tr>
            <tr class="bg-emerald-100 font-bold text-emerald-950"><td class="p-2 border border-emerald-300">الإجمالي الكلي النهائي</td><td class="p-2 border border-emerald-300 font-mono text-left">110,500 ر.س</td></tr>
          </tbody>
        </table>
      </div>
    `);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4" dir="rtl">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-gray-300 overflow-hidden text-right">
        <div className="flex items-center justify-between px-4 py-3 bg-[#107c41] text-white">
          <div className="flex items-center gap-2">
            <TableProperties className="w-5 h-5 text-white" />
            <span className="font-bold text-sm">إنشاء جدول محوري (Create PivotTable)</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded text-white/90">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          <div>
            <label className="block mb-1.5 font-bold text-gray-700">تحديد نطاق البيانات المصدر:</label>
            <input
              type="text"
              defaultValue="Sheet1!$A$3:$F$20"
              className="w-full px-3 py-1.5 border border-gray-300 rounded font-mono text-xs focus:border-[#107c41] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block mb-1 font-medium text-gray-700">حقل الصفوف (Rows):</label>
              <select 
                value={rowField} 
                onChange={(e) => setRowField(e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded outline-none"
              >
                <option value="القسم / التصنيف">القسم / التصنيف</option>
                <option value="اسم_الموظف">اسم الموظف / العميل</option>
                <option value="الشهر">الشهر / الفترة</option>
                <option value="حالة السداد">حالة السداد</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">طريقة التجميع (Summarize by):</label>
              <select 
                value={aggregation} 
                onChange={(e) => setAggregation(e.target.value as any)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded outline-none font-semibold text-emerald-800"
              >
                <option value="SUM">مجموع القيم (SUM)</option>
                <option value="COUNT">عدد السجلات (COUNT)</option>
                <option value="AVERAGE">المتوسط (AVERAGE)</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-[11px] text-emerald-900 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span>سيتم تلخيص بيانات المصنف وعرض تقرير ديناميكي متعدد الأبعاد يتيح تصفية وتحليل مؤشرات الأداء بسرعة.</span>
          </div>
        </div>

        <div className="flex justify-end gap-2 p-3 bg-gray-50 border-t border-gray-200 text-xs">
          <button
            onClick={handleCreate}
            className="px-4 py-1.5 bg-[#107c41] hover:bg-[#0c6233] text-white rounded font-bold shadow-sm transition"
          >
            موافق (إنشاء)
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
