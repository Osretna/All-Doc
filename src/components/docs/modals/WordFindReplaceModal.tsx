import React, { useState } from 'react';
import { X, Search, Replace } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editorRef: React.RefObject<HTMLDivElement | null>;
}

export const WordFindReplaceModal: React.FC<Props> = ({ isOpen, onClose, editorRef }) => {
  const [tab, setTab] = useState<'find' | 'replace'>('find');
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');

  if (!isOpen) return null;

  const handleFind = () => {
    if (!findText) return;
    if ((window as any).find) {
      const found = (window as any).find(findText, false, false, true);
      if (!found) {
        alert(`لم يتم العثور على "${findText}" في المستند.`);
      }
    }
  };

  const handleReplace = (all: boolean) => {
    if (!findText || !editorRef.current) return;
    const content = editorRef.current.innerHTML;
    if (!content.includes(findText)) {
      alert(`لم يتم العثور على "${findText}" للاستبدال.`);
      return;
    }

    if (all) {
      editorRef.current.innerHTML = content.replaceAll(findText, replaceText);
      alert(`تم استبدال كافة التكرارات بنجاح.`);
    } else {
      editorRef.current.innerHTML = content.replace(findText, replaceText);
      alert(`تم استبدال النص.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-300 w-full max-w-sm flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        <div className="flex items-center justify-between px-4 py-3 bg-[#004578] text-white">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            <h3 className="font-bold text-sm">البحث والاستبدال في المستند</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded cursor-pointer transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex border-b border-gray-200 bg-gray-50 text-xs font-bold">
          <button
            onClick={() => setTab('find')}
            className={`flex-1 py-2 text-center border-b-2 cursor-pointer transition ${
              tab === 'find' ? 'border-[#004578] text-[#004578] bg-white' : 'border-transparent text-gray-500'
            }`}
          >
            بحث (Find)
          </button>
          <button
            onClick={() => setTab('replace')}
            className={`flex-1 py-2 text-center border-b-2 cursor-pointer transition ${
              tab === 'replace' ? 'border-[#004578] text-[#004578] bg-white' : 'border-transparent text-gray-500'
            }`}
          >
            استبدال (Replace)
          </button>
        </div>

        <div className="p-4 space-y-3 text-xs text-gray-700">
          <div>
            <label className="block font-medium mb-1">البحث عن:</label>
            <input
              type="text"
              value={findText}
              onChange={e => setFindText(e.target.value)}
              className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-[#004578]"
              placeholder="اكتب الكلمة أو العبارة المراد البحث عنها..."
              autoFocus
            />
          </div>

          {tab === 'replace' && (
            <div>
              <label className="block font-medium mb-1">استبدال بـ:</label>
              <input
                type="text"
                value={replaceText}
                onChange={e => setReplaceText(e.target.value)}
                className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-[#004578]"
                placeholder="النص الجديد البديل..."
              />
            </div>
          )}
        </div>

        <div className="px-4 py-2.5 bg-gray-100 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-medium cursor-pointer"
          >
            إغلاق
          </button>
          <div className="flex items-center gap-1.5">
            {tab === 'replace' ? (
              <>
                <button
                  onClick={() => handleReplace(false)}
                  className="px-3 py-1.5 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-medium cursor-pointer"
                >
                  استبدال
                </button>
                <button
                  onClick={() => handleReplace(true)}
                  className="px-3.5 py-1.5 rounded bg-[#004578] hover:bg-[#00345b] text-white font-bold text-xs cursor-pointer shadow-xs"
                >
                  استبدال الكل
                </button>
              </>
            ) : (
              <button
                onClick={handleFind}
                className="px-5 py-1.5 rounded bg-[#004578] hover:bg-[#00345b] text-white font-bold text-xs cursor-pointer shadow-xs"
              >
                بحث عن التالي
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
