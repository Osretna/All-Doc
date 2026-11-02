import React, { useState } from 'react';
import { CheckCircle2, ListFilter, X } from 'lucide-react';

interface DataValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyValidation: (options: string[]) => void;
}

export const DataValidationModal: React.FC<DataValidationModalProps> = ({
  isOpen,
  onClose,
  onApplyValidation,
}) => {
  const [valType, setValType] = useState<'list' | 'wholeNumber' | 'date' | 'textLength'>('list');
  const [listValues, setListValues] = useState('مسدد, مستحق, متأخر, معفى');
  const [errorMessage, setErrorMessage] = useState('القيمة المدخلة غير مسموح بها في هذه الخلية.');

  if (!isOpen) return null;

  const handleApply = () => {
    if (valType === 'list') {
      const opts = listValues.split(/[,،]+/).map(s => s.trim()).filter(Boolean);
      onApplyValidation(opts);
    } else {
      onApplyValidation(['قيمة صحيحة']);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4" dir="rtl">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-gray-300 overflow-hidden text-right">
        <div className="flex items-center justify-between px-4 py-3 bg-[#107c41] text-white">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-white" />
            <span className="font-bold text-sm">التحقق من صحة البيانات (Data Validation)</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded text-white/90">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          <div>
            <label className="block mb-1 font-bold text-gray-700">معيار السماح (Allow):</label>
            <select
              value={valType}
              onChange={(e) => setValType(e.target.value as any)}
              className="w-full px-3 py-1.5 border border-gray-300 rounded outline-none font-medium"
            >
              <option value="list">قائمة منسدلة (Dropdown List)</option>
              <option value="wholeNumber">عدد صحيح (Whole Number)</option>
              <option value="date">تاريخ محدد (Date)</option>
              <option value="textLength">طول النص (Text Length)</option>
            </select>
          </div>

          {valType === 'list' && (
            <div>
              <label className="block mb-1 font-medium text-gray-700">عناصر القائمة (مفصولة بفواصل):</label>
              <input
                type="text"
                value={listValues}
                onChange={(e) => setListValues(e.target.value)}
                placeholder="مثال: مسدد, مستحق, متأخر"
                className="w-full px-3 py-1.5 border border-gray-300 rounded focus:border-[#107c41] outline-none"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">
                ستظهر هذه العناصر في قائمة منسدلة سهلة الاختيار داخل الخلية.
              </span>
            </div>
          )}

          <div>
            <label className="block mb-1 font-medium text-gray-700">رسالة تنبيه الخطأ (Error Alert):</label>
            <input
              type="text"
              value={errorMessage}
              onChange={(e) => setErrorMessage(e.target.value)}
              className="w-full px-3 py-1.5 border border-gray-300 rounded focus:border-[#107c41] outline-none text-gray-700"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 p-3 bg-gray-50 border-t border-gray-200 text-xs">
          <button
            onClick={handleApply}
            className="px-5 py-1.5 bg-[#107c41] hover:bg-[#0c6233] text-white rounded font-bold shadow-sm transition"
          >
            تطبيق
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
