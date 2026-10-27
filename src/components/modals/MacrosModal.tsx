import React, { useState } from 'react';
import { Play, Plus, Trash2, X, Code2 } from 'lucide-react';

interface MacrosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRunMacro: (macroName: string) => void;
}

export const MacrosModal: React.FC<MacrosModalProps> = ({
  isOpen,
  onClose,
  onRunMacro,
}) => {
  const [selectedMacro, setSelectedMacro] = useState<string>('FormatReportHeader');
  const [macros, setMacros] = useState([
    { name: 'FormatReportHeader', description: 'تنسيق ترويسة التقرير وتوسيطها مع خط غامق وتاريخ اليوم' },
    { name: 'CleanExtraSpaces', description: 'إزالة المسافات المزدوجة وضبط تباعد الفقرات' },
    { name: 'ApplyCorporateTheme', description: 'تطبيق ألوان الهوية المؤسسية (الأزرق والرمادي الداكن)' },
    { name: 'InsertFormalSignature', description: 'إدراج خانة التوقيع والختم الرسمي في نهاية الصفحة' },
  ]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4">
      <div 
        className="w-full max-w-lg bg-white rounded-lg shadow-2xl border border-slate-300 overflow-hidden text-right"
        dir="rtl"
      >
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#2b579a] text-white">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-white" />
            <span className="font-semibold text-sm">وحدات ماكرو (Macros)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded text-white/90 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3 text-xs">
          <div>
            <label className="block mb-1 font-medium text-slate-700">اسم الماكرو (Macro name):</label>
            <input
              type="text"
              value={selectedMacro}
              onChange={(e) => setSelectedMacro(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono text-slate-800 focus:border-[#2b579a] outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 border border-slate-300 rounded h-44 overflow-y-auto bg-slate-50 p-1">
              {macros.map((m) => (
                <button
                  key={m.name}
                  onClick={() => setSelectedMacro(m.name)}
                  className={`w-full text-right px-2.5 py-1.5 rounded transition-colors text-xs font-mono flex items-center justify-between ${
                    selectedMacro === m.name
                      ? 'bg-[#2b579a] text-white font-bold'
                      : 'text-slate-800 hover:bg-slate-200'
                  }`}
                >
                  <span>{m.name}</span>
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  onRunMacro(selectedMacro);
                  onClose();
                }}
                className="px-3 py-1.5 bg-[#2b579a] hover:bg-[#20447c] text-white rounded font-medium shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>تشغيل (Run)</span>
              </button>
              <button
                onClick={() => alert(`محرر Visual Basic for Applications (VBA) لوحدة الماكرو: ${selectedMacro}`)}
                className="px-3 py-1.5 bg-slate-100 border border-slate-300 hover:bg-slate-200 text-slate-700 rounded transition-colors"
              >
                تحرير (Edit)
              </button>
              <button
                onClick={() => {
                  const newName = prompt('أدخل اسم الماكرو الجديد:', 'MyNewMacro');
                  if (newName) {
                    setMacros([...macros, { name: newName, description: 'ماكرو مخصص من قبل المستخدم' }]);
                    setSelectedMacro(newName);
                  }
                }}
                className="px-3 py-1.5 bg-slate-100 border border-slate-300 hover:bg-slate-200 text-slate-700 rounded transition-colors flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إنشاء (Create)</span>
              </button>
              <button
                onClick={() => {
                  setMacros(macros.filter(m => m.name !== selectedMacro));
                  if (macros.length > 1) setSelectedMacro(macros[0].name);
                }}
                className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 rounded transition-colors flex items-center justify-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>حذف</span>
              </button>
            </div>
          </div>

          <div className="p-2.5 bg-slate-100 rounded border border-slate-200 text-slate-600 text-[11px]">
            <span className="font-bold text-slate-800">الوصف: </span>
            {macros.find(m => m.name === selectedMacro)?.description || 'ماكرو آلي لمعالجة المستند.'}
          </div>
        </div>

        <div className="flex justify-end p-3 bg-slate-50 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-slate-300 text-xs text-slate-700 rounded hover:bg-slate-100 transition-colors"
          >
            إلغاء الأمر
          </button>
        </div>
      </div>
    </div>
  );
};
