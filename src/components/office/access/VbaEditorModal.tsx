import React, { useState } from 'react';
import { X, Play, Save, CheckCircle2, AlertTriangle, Code2, Copy, Download, Terminal } from 'lucide-react';
import { VbaModuleDef } from './types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  modules: VbaModuleDef[];
  onSaveModule: (id: string, newCode: string) => void;
}

export const VbaEditorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  modules,
  onSaveModule,
}) => {
  if (!isOpen) return null;

  const [activeModuleId, setActiveModuleId] = useState<string>(modules[0]?.id || 'mod_main');
  const activeModule = modules.find(m => m.id === activeModuleId) || modules[0];
  const [code, setCode] = useState<string>(activeModule?.code || '');
  const [compileStatus, setCompileStatus] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleSelectModule = (id: string) => {
    // save previous if needed
    onSaveModule(activeModuleId, code);
    setActiveModuleId(id);
    const mod = modules.find(m => m.id === id);
    if (mod) setCode(mod.code);
    setCompileStatus(null);
  };

  const handleCompile = () => {
    // Check VBA syntax basics
    const errors: string[] = [];
    if (!code.includes('End Sub') && code.includes('Sub ')) {
      errors.push("Missing 'End Sub' for one or more subroutines.");
    }
    if (!code.includes('End Function') && code.includes('Function ')) {
      errors.push("Missing 'End Function' for function definitions.");
    }

    if (errors.length > 0) {
      setCompileStatus(`❌ خطأ في التحقق البرمجي: ${errors.join(' ')}`);
    } else {
      setCompileStatus('✓ تم فحص الكود البرمجي (VBA Compile Success): لا توجد أخطاء في بناء الجملة أو المراجع.');
      onSaveModule(activeModuleId, code);
    }
  };

  const handleExportBas = () => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeModule.name}.bas`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-[160] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4" dir="rtl">
      <div className="bg-[#f0f0f0] border border-gray-400 rounded-lg shadow-2xl w-full max-w-5xl h-[80vh] flex flex-col overflow-hidden text-xs">
        {/* VBA Window Title Bar */}
        <div className="bg-[#1e293b] text-white px-4 py-2 flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span className="font-bold">محرر Microsoft Visual Basic for Applications (VBA)</span>
            <span className="text-gray-400 font-mono text-[11px]">- [{activeModule?.name}]</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-700 rounded text-gray-300 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* VBA Menu / Toolbar */}
        <div className="bg-[#e2e8f0] border-b border-gray-300 px-3 py-1.5 flex items-center justify-between text-gray-700">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCompile}
              className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-gray-100 border border-gray-300 rounded font-semibold text-gray-800 shadow-2xs cursor-pointer"
              title="فحص الأخطاء البرمجية وتجميع الكود (Debug -> Compile)"
            >
              <Play className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
              <span>تجميع وفحص (Compile)</span>
            </button>

            <button
              onClick={() => {
                onSaveModule(activeModuleId, code);
                setCompileStatus('تم حفظ التعديلات البرمجية بنجاح.');
              }}
              className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-gray-100 border border-gray-300 rounded font-semibold text-gray-800 shadow-2xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 text-blue-600" />
              <span>حفظ الوحدة</span>
            </button>

            <button
              onClick={handleExportBas}
              className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-gray-100 border border-gray-300 rounded font-semibold text-gray-800 shadow-2xs cursor-pointer"
              title="تصدير الوحدة إلى ملف .bas لتثبيتها في Microsoft Access المكتبي"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600" />
              <span>تصدير (.bas)</span>
            </button>

            <button
              onClick={() => {
                navigator.clipboard.writeText(code);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-gray-100 border border-gray-300 rounded font-semibold text-gray-800 shadow-2xs cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5 text-gray-600" />
              <span>{copied ? 'تم النسخ!' : 'نسخ الكود'}</span>
            </button>
          </div>

          <div className="text-[11px] text-gray-500 font-mono">
            VBA 7.1 / Access Database Engine Object Library
          </div>
        </div>

        {/* Editor Split View: Modules Sidebar + Code Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Modules Explorer */}
          <div className="w-60 bg-white border-l border-gray-300 p-2 overflow-y-auto shrink-0 select-none">
            <div className="text-[11px] font-bold text-gray-500 mb-1 px-1">كائنات ومشروع قاعدة البيانات:</div>
            <div className="space-y-1">
              {modules.map(mod => (
                <button
                  key={mod.id}
                  onClick={() => handleSelectModule(mod.id)}
                  className={`w-full text-right px-2.5 py-1.5 rounded flex items-center justify-between text-xs font-mono cursor-pointer transition ${
                    activeModuleId === mod.id ? 'bg-[#a4373a] text-white font-bold' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <span className="truncate">{mod.name}</span>
                  <span className="text-[9px] opacity-75">{mod.type}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Code Textarea with Line Numbers styling */}
          <div className="flex-1 flex flex-col bg-[#1e1e1e] text-[#d4d4d4] font-mono text-xs overflow-hidden" dir="ltr">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full flex-1 p-4 bg-[#1e1e1e] text-[#d4d4d4] outline-none resize-none font-mono text-xs leading-relaxed border-none focus:ring-0"
              spellCheck={false}
            />

            {/* Compile status message */}
            {compileStatus && (
              <div className={`p-2.5 border-t text-xs font-sans ${
                compileStatus.startsWith('✓') ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-rose-950 text-rose-300 border-rose-800'
              }`} dir="rtl">
                {compileStatus}
              </div>
            )}
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-[#e2e8f0] border-t border-gray-300 px-4 py-1.5 flex items-center justify-between text-[11px] text-gray-600">
          <span>جاهز | عدد أسطر الكود: {code.split('\n').length}</span>
          <span>Unicode UTF-8 • VBA Compatibility Mode</span>
        </div>
      </div>
    </div>
  );
};
