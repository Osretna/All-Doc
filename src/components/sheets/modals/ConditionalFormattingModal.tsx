import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { ConditionalRule } from '../../../types/office';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  targetRange: string;
  onApplyRule: (rule: ConditionalRule) => void;
}

export const ConditionalFormattingModal: React.FC<Props> = ({
  isOpen,
  onClose,
  targetRange,
  onApplyRule,
}) => {
  const [ruleType, setRuleType] = useState<'greater' | 'less' | 'between' | 'equal' | 'duplicate'>('greater');
  const [val1, setVal1] = useState('100');
  const [val2, setVal2] = useState('500');
  const [presetColor, setPresetColor] = useState('red');

  if (!isOpen) return null;

  const colorPresets: { [k: string]: { bg: string; color: string; label: string } } = {
    red: { bg: '#fee2e2', color: '#991b1b', label: 'تعبئة حمراء فاتحة مع نص أحمر داكن' },
    green: { bg: '#dcfce7', color: '#166534', label: 'تعبئة خضراء فاتحة مع نص أخضر داكن' },
    yellow: { bg: '#fef9c3', color: '#854d0e', label: 'تعبئة صفراء مع نص أصفر داكن' },
    blue: { bg: '#dbeafe', color: '#1e40af', label: 'تعبئة زرقاء مع نص أزرق داكن' },
  };

  const handleApply = () => {
    const preset = colorPresets[presetColor];
    const rule: ConditionalRule = {
      id: `rule_${Date.now()}`,
      range: targetRange,
      type: ruleType,
      val1,
      val2: ruleType === 'between' ? val2 : undefined,
      bg: preset.bg,
      color: preset.color,
    };
    onApplyRule(rule);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-300 w-full max-w-md flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        <div className="flex items-center justify-between px-4 py-3 bg-[#107c41] text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-bold text-sm">التنسيق الشرطي (Conditional Formatting)</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded cursor-pointer transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3 text-xs text-gray-700">
          <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded text-emerald-800">
            النطاق المستهدف: <strong className="font-mono">{targetRange || 'الخلية النشطة'}</strong>
          </div>

          <div>
            <label className="block font-bold mb-1">نوع القاعدة:</label>
            <select
              value={ruleType}
              onChange={e => setRuleType(e.target.value as any)}
              className="w-full border border-gray-300 rounded px-2.5 py-1.5 bg-white text-xs outline-none focus:border-[#107c41]"
            >
              <option value="greater">تمييز الخلايا الأكبر من (Greater Than)</option>
              <option value="less">تمييز الخلايا الأصغر من (Less Than)</option>
              <option value="between">تمييز الخلايا بين قيمتين (Between)</option>
              <option value="equal">تمييز الخلايا المساوية لـ (Equal To)</option>
              <option value="duplicate">تمييز القيم المكررة (Duplicate Values)</option>
            </select>
          </div>

          {ruleType !== 'duplicate' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-gray-600 mb-0.5">القيمة:</label>
                <input
                  type="text"
                  value={val1}
                  onChange={e => setVal1(e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1 text-xs outline-none"
                />
              </div>
              {ruleType === 'between' && (
                <div>
                  <label className="block text-[11px] text-gray-600 mb-0.5">وحتى القيمة:</label>
                  <input
                    type="text"
                    value={val2}
                    onChange={e => setVal2(e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-xs outline-none"
                  />
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block font-bold mb-1">نمط التنسيق اللوني:</label>
            <div className="space-y-1.5">
              {Object.entries(colorPresets).map(([key, style]) => (
                <label
                  key={key}
                  className={`flex items-center justify-between p-2 rounded border cursor-pointer transition ${
                    presetColor === key ? 'border-emerald-600 ring-1 ring-emerald-600' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: style.bg, color: style.color }}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="preset"
                      checked={presetColor === key}
                      onChange={() => setPresetColor(key)}
                    />
                    <span className="font-semibold text-xs">{style.label}</span>
                  </div>
                  <span className="font-bold font-mono">123</span>
                </label>
              ))}
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
            onClick={handleApply}
            className="px-5 py-1.5 rounded bg-[#107c41] hover:bg-[#0e6b37] text-white font-bold text-xs cursor-pointer shadow-xs"
          >
            تطبيق التنسيق
          </button>
        </div>
      </div>
    </div>
  );
};
