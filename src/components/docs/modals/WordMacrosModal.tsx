import React from 'react';
import { X, Play, Code2, Sparkles, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRunMacro: (macroName: string) => void;
}

export const WordMacrosModal: React.FC<Props> = ({ isOpen, onClose, onRunMacro }) => {
  if (!isOpen) return null;

  const macros = [
    {
      id: 'FormatReportHeader',
      name: 'FormatReportHeader',
      desc: 'إدراج ترويسة تقرير معتمدة رسمية في أعلى الصفحة مع التاريخ الحالي وشعار الجناح السيادي.',
      color: 'blue'
    },
    {
      id: 'InsertFormalSignature',
      name: 'InsertFormalSignature',
      desc: 'إدراج صندوق توقيع واعتماد رسمي ثلاثي مع خطوط التوقيع والأختام الرسمية.',
      color: 'emerald'
    },
    {
      id: 'ConvertTablesToZebra',
      name: 'ConvertTablesToZebra',
      desc: 'تنسيق كافة الجداول الموجودة في المستند بنمط ألوان رسمي حديث (صفوف متبادلة).',
      color: 'purple'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-300 w-full max-w-md flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        <div className="flex items-center justify-between px-4 py-3 bg-[#004578] text-white">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5" />
            <h3 className="font-bold text-sm">وحدات ماكرو المستند (Word Macros)</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded cursor-pointer transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3 text-xs text-gray-700">
          <p className="text-gray-500">
            وحدات الماكرو الجاهزة لتنفيذ إجراءات تنسيق وأتمتة متقدمة بنقرة واحدة:
          </p>

          <div className="space-y-2">
            {macros.map(m => (
              <div
                key={m.id}
                className="p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50/30 transition flex items-start justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="font-mono font-bold text-blue-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>{m.name}</span>
                  </div>
                  <p className="text-[11px] text-gray-600 leading-relaxed">{m.desc}</p>
                </div>
                <button
                  onClick={() => {
                    onRunMacro(m.id);
                    onClose();
                  }}
                  className="px-3 py-1.5 bg-[#004578] hover:bg-[#00345b] text-white font-bold rounded text-xs flex items-center gap-1 shrink-0 cursor-pointer shadow-2xs transition"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>تشغيل</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 py-2.5 bg-gray-100 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-medium cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
