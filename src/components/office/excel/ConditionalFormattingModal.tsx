import React, { useState } from 'react';
import { Palette, Sparkles, X, Check } from 'lucide-react';

interface ConditionalFormattingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyRule: (rule: { type: string; value: string; color: string; bg: string }) => void;
  onClearRules: () => void;
}

export const ConditionalFormattingModal: React.FC<ConditionalFormattingModalProps> = ({
  isOpen,
  onClose,
  onApplyRule,
  onClearRules,
}) => {
  const [ruleType, setRuleType] = useState<'greater' | 'less' | 'equal' | 'databars' | 'colorscale'>('greater');
  const [val, setVal] = useState('1000');
  const [presetColor, setPresetColor] = useState<'green' | 'red' | 'yellow'>('green');

  if (!isOpen) return null;

  const handleApply = () => {
    let color = '#15803d';
    let bg = '#dcfce7';
    if (presetColor === 'red') {
      color = '#b91c1c';
      bg = '#fee2e2';
    } else if (presetColor === 'yellow') {
      color = '#a16207';
      bg = '#fef9c3';
    }

    onApplyRule({
      type: ruleType,
      value: val,
      color,
      bg,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4" dir="rtl">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-gray-300 overflow-hidden text-right">
        <div className="flex items-center justify-between px-4 py-3 bg-[#107c41] text-white">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-white" />
            <span className="font-bold text-sm">التنسيق الشرطي (Conditional Formatting)</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded text-white/90">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          <div>
            <label className="block mb-1.5 font-bold text-gray-700">اختر قاعدة التنسيق:</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'greater', label: 'أكبر من (Greater Than)' },
                { id: 'less', label: 'أصغر من (Less Than)' },
                { id: 'equal', label: 'يساوي (Equal To)' },
                { id: 'databars', label: 'أشرطة البيانات (Data Bars)' },
                { id: 'colorscale', label: 'مقاييس الألوان المتدرجة' },
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRuleType(r.id as any)}
                  className={`p-2 rounded border text-right transition font-medium ${
                    ruleType === r.id
                      ? 'border-[#107c41] bg-emerald-50 text-emerald-900 font-bold'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {(ruleType === 'greater' || ruleType === 'less' || ruleType === 'equal') && (
            <div>
              <label className="block mb-1 font-medium text-gray-700">القيمة المرجعية:</label>
              <input
                type="text"
                value={val}
                onChange={(e) => setVal(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded focus:border-[#107c41] outline-none font-mono"
              />
            </div>
          )}

          <div>
            <label className="block mb-1 font-medium text-gray-700">تنسيق وتعبئة الخلايا المتطابقة:</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPresetColor('green')}
                className={`flex-1 py-1.5 px-2 rounded border text-center font-bold ${
                  presetColor === 'green' ? 'border-emerald-700 ring-2 ring-emerald-300' : 'border-gray-200'
                } bg-emerald-100 text-emerald-900`}
              >
                تعبئة خضراء
              </button>
              <button
                type="button"
                onClick={() => setPresetColor('red')}
                className={`flex-1 py-1.5 px-2 rounded border text-center font-bold ${
                  presetColor === 'red' ? 'border-red-700 ring-2 ring-red-300' : 'border-gray-200'
                } bg-red-100 text-red-900`}
              >
                تعبئة حمراء
              </button>
              <button
                type="button"
                onClick={() => setPresetColor('yellow')}
                className={`flex-1 py-1.5 px-2 rounded border text-center font-bold ${
                  presetColor === 'yellow' ? 'border-amber-700 ring-2 ring-amber-300' : 'border-gray-200'
                } bg-amber-100 text-amber-900`}
              >
                تعبئة صفراء
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 border-t border-gray-200 text-xs">
          <button
            onClick={() => {
              onClearRules();
              onClose();
            }}
            className="text-red-600 hover:text-red-800 font-medium underline"
          >
            مسح كافة القواعد الحالية
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleApply}
              className="px-4 py-1.5 bg-[#107c41] hover:bg-[#0c6233] text-white rounded font-bold shadow-sm transition"
            >
              تطبيق القاعدة
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
    </div>
  );
};
