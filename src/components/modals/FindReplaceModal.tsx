import React, { useState } from 'react';
import { Search, Replace, X, ChevronRight, ChevronLeft, Check } from 'lucide-react';

interface FindReplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  editorRef: React.RefObject<HTMLDivElement | null>;
}

export const FindReplaceModal: React.FC<FindReplaceModalProps> = ({
  isOpen,
  onClose,
  editorRef,
}) => {
  const [activeTab, setActiveTab] = useState<'find' | 'replace'>('find');
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [matchCase, setMatchCase] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  if (!isOpen) return null;

  const handleFind = () => {
    if (!findText || !editorRef.current) return;
    const editor = editorRef.current;
    const content = editor.innerText;
    const regex = new RegExp(findText, matchCase ? 'g' : 'gi');
    const matches = content.match(regex);
    if (matches && matches.length > 0) {
      setStatusMessage(`تم العثور على ${matches.length} تطابق في المستند`);
      // Use window.find if available
      if ((window as any).find) {
        (window as any).find(findText, matchCase, false, true, false, false, false);
      }
    } else {
      setStatusMessage('لم يتم العثور على تطابقات');
    }
  };

  const handleReplace = () => {
    if (!findText || !editorRef.current) return;
    const editor = editorRef.current;
    const innerHTML = editor.innerHTML;
    const regex = new RegExp(findText, matchCase ? '' : 'i');
    if (regex.test(innerHTML)) {
      editor.innerHTML = innerHTML.replace(regex, replaceText);
      setStatusMessage('تم استبدال أول تطابق بنجاح');
    } else {
      setStatusMessage('لم يتم العثور على أي تطابق للاستبدال');
    }
  };

  const handleReplaceAll = () => {
    if (!findText || !editorRef.current) return;
    const editor = editorRef.current;
    const innerHTML = editor.innerHTML;
    const regex = new RegExp(findText, matchCase ? 'g' : 'gi');
    const matches = innerHTML.match(regex);
    if (matches) {
      editor.innerHTML = innerHTML.replace(regex, replaceText);
      setStatusMessage(`تم استبدال ${matches.length} موضع بنجاح`);
    } else {
      setStatusMessage('لم يتم العثور على عناصر مطابقة');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4">
      <div 
        className="w-full max-w-md bg-white rounded-lg shadow-2xl border border-slate-300 overflow-hidden text-right select-text"
        dir="rtl"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#2b579a] text-white">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-white" />
            <span className="font-semibold text-sm">بحث واستبدال (Find and Replace)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded text-white/90 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 bg-slate-100/70 text-xs font-medium">
          <button
            onClick={() => setActiveTab('find')}
            className={`flex-1 py-2 text-center border-b-2 transition-colors ${
              activeTab === 'find'
                ? 'border-[#2b579a] text-[#2b579a] bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            بحث
          </button>
          <button
            onClick={() => setActiveTab('replace')}
            className={`flex-1 py-2 text-center border-b-2 transition-colors ${
              activeTab === 'replace'
                ? 'border-[#2b579a] text-[#2b579a] bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            استبدال
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4 text-xs">
          <div>
            <label className="block mb-1 font-medium text-slate-700">البحث عن:</label>
            <input
              type="text"
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
              placeholder="اكتب النص المراد البحث عنه..."
              className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-[#2b579a] focus:ring-1 focus:ring-[#2b579a] outline-none text-slate-800"
              autoFocus
            />
          </div>

          {activeTab === 'replace' && (
            <div>
              <label className="block mb-1 font-medium text-slate-700">استبدال بـ:</label>
              <input
                type="text"
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
                placeholder="النص البديل..."
                className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-[#2b579a] focus:ring-1 focus:ring-[#2b579a] outline-none text-slate-800"
              />
            </div>
          )}

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="matchCase"
              checked={matchCase}
              onChange={(e) => setMatchCase(e.target.checked)}
              className="rounded border-slate-300 text-[#2b579a] focus:ring-[#2b579a]"
            />
            <label htmlFor="matchCase" className="text-slate-600 cursor-pointer">
              مطابقة حالة الأحرف (Match Case)
            </label>
          </div>

          {statusMessage && (
            <div className="p-2 bg-blue-50 border border-blue-200 text-blue-800 rounded text-xs flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-2 px-4 py-3 bg-slate-50 border-t border-slate-200 text-xs">
          {activeTab === 'find' ? (
            <button
              onClick={handleFind}
              className="px-4 py-1.5 bg-[#2b579a] hover:bg-[#20447c] text-white rounded font-medium shadow-sm transition-colors"
            >
              بحث عن التالي
            </button>
          ) : (
            <>
              <button
                onClick={handleFind}
                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded font-medium transition-colors"
              >
                بحث عن التالي
              </button>
              <button
                onClick={handleReplace}
                className="px-3 py-1.5 bg-[#2b579a] hover:bg-[#20447c] text-white rounded font-medium shadow-sm transition-colors"
              >
                استبدال
              </button>
              <button
                onClick={handleReplaceAll}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded font-medium shadow-sm transition-colors"
              >
                استبدال الكل
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded transition-colors"
          >
            إلغاء الأمر
          </button>
        </div>
      </div>
    </div>
  );
};
