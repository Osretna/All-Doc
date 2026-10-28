import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';
import { DataValidationRule } from '../../../types/office';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  targetRange: string;
  onApplyValidation: (rule: DataValidationRule) => void;
  onClearValidation: () => void;
}

export const DataValidationModal: React.FC<Props> = ({
  isOpen,
  onClose,
  targetRange,
  onApplyValidation,
  onClearValidation,
}) => {
  const [valType, setValType] = useState<'list' | 'whole' | 'decimal' | 'textLength'>('list');
  const [listValues, setListValues] = useState('مكتمل, قيد التنفيذ, ملغي, معلق');
  const [minValue, setMinValue] = useState('0');
  const [maxValue, setMaxValue] = useState('100');
  const [criteria, setCriteria] = useState<'between' | 'greater' | 'less' | 'equal'>('between');
  const [errorMsg, setErrorMsg] = useState('القيمة المدخلة غير مسموح بها حسب شروط التحقق.');

  if (!isOpen) return null;

  const handleApply = () => {
    const rule: DataValidationRule = {
      id: `val_${Date.now()}`,
      range: targetRange,
      type: valType,
      criteria,
      min: minValue,
      max: maxValue,
      values: valType === 'list' ? listValues.split(',').map(s => s.trim()).filter(Boolean) : undefined,
      errorMessage: errorMsg,
    };
    onApplyValidation(rule);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-300 w-full max-w-md flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        <div className="flex items-center justify-between px-4 py-3 bg-[#107c41] text-white">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="font-bold text-sm">التحقق من صحة البيانات (Data Validation)</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded cursor-pointer transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3 text-xs">
          <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded text-emerald-800">
            النطاق المحدد للتطبيق: <strong className="font-mono">{targetRange || 'الخلية النشطة'}</strong>
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-1">معيار السماح (Allow):</label>
            <select
              value={valType}
              onChange={e => setValType(e.target.value as any)}
              className="w-full border border-gray-300 rounded px-2.5 py-1.5 bg-white text-xs outline-none focus:border-[#107c41]"
            >
              <option value="list">قائمة منسدلة من خيارات محددة (Dropdown List)</option>
              <option value="whole">عدد صحيح (Whole Number)</option>
              <option value="decimal">عدد عشري (Decimal)</option>
              <option value="textLength">طول النص (Text Length)</option>
            </select>
          </div>

          {valType === 'list' ? (
            <div>
              <label className="block text-gray-700 font-medium mb-1">العناصر المتاحة (افصل بينها بفاصلة ,):</label>
              <textarea
                value={listValues}
                onChange={e => setListValues(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded p-2 text-xs outline-none focus:border-[#107c41]"
                placeholder="مثال: نعم, لا, ربما"
              />
              <span className="text-[10px] text-gray-500">ستظهر هذه الخيارات في قائمة منسدلة داخل الخلايا المحددة.</span>
            </div>
          ) : (
            <div className="space-y-2">
              <div>
                <label className="block text-gray-700 font-medium mb-1">الشرط:</label>
                <select
                  value={criteria}
                  onChange={e => setCriteria(e.target.value as any)}
                  className="w-full border border-gray-300 rounded px-2 py-1 bg-white text-xs outline-none"
                >
                  <option value="between">بين (Between)</option>
                  <option value="greater">أكبر من (Greater than)</option>
                  <option value="less">أصغر من (Less than)</option>
                  <option value="equal">يساوي (Equal to)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-gray-600 mb-0.5">الحد الأدنى:</label>
                  <input
                    type="number"
                    value={minValue}
                    onChange={e => setMinValue(e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                  />
                </div>
                {criteria === 'between' && (
                  <div>
                    <label className="block text-[11px] text-gray-600 mb-0.5">الحد الأقصى:</label>
                    <input
                      type="number"
                      value={maxValue}
                      onChange={e => setMaxValue(e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          <div>
            <label className="block text-gray-700 font-medium mb-1">رسالة التنبيه عند إدخال خاطئ:</label>
            <input
              type="text"
              value={errorMsg}
              onChange={e => setErrorMsg(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
            />
          </div>
        </div>

        <div className="px-4 py-2.5 bg-gray-100 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={() => {
              onClearValidation();
              onClose();
            }}
            className="text-red-600 hover:text-red-700 text-xs font-bold cursor-pointer"
          >
            مسح الكل
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
              className="px-5 py-1.5 rounded bg-[#107c41] hover:bg-[#0e6b37] text-white font-bold text-xs cursor-pointer shadow-xs"
            >
              موافق (تطبيق)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
