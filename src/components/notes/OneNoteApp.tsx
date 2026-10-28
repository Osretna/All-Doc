import React, { useState } from 'react';
import { StickyNote, Plus, Trash2, FolderPlus, FilePlus } from 'lucide-react';
import { AppStorage } from '../../utils/storage';

interface NotePage {
  id: string;
  title: string;
  content: string;
  date: string;
}

interface NoteSection {
  id: string;
  name: string;
  color: string;
  pages: NotePage[];
}

const DEFAULT_SECTIONS: NoteSection[] = [
  {
    id: 'sec_1',
    name: 'ملاحظات سريعة',
    color: '#7719aa',
    pages: [
      {
        id: 'p_1',
        title: 'أفكار وملاحظات العمل اليومي',
        content: '• مراجعة بنود الميزانية السنوية مع الفريق.\n• التأكد من توافق خطوط المستندات الرسمية.\n• حفظ كافة الملفات محلياً بدون إنترنت.',
        date: '2026-10-27'
      }
    ]
  }
];

export const OneNoteApp: React.FC = () => {
  const [sections, setSections] = useState<NoteSection[]>(() => {
    return AppStorage.get(AppStorage.KEYS.NOTES_DATA, DEFAULT_SECTIONS);
  });
  const [activeSecId, setActiveSecId] = useState(sections[0]?.id || 'sec_1');
  const [activePageId, setActivePageId] = useState(sections[0]?.pages[0]?.id || 'p_1');

  const curSec = sections.find(s => s.id === activeSecId) || sections[0];
  const curPage = curSec?.pages.find(p => p.id === activePageId) || curSec?.pages[0];

  const updatePage = (key: keyof NotePage, val: string) => {
    const updated = sections.map(s => {
      if (s.id === activeSecId) {
        const pages = s.pages.map(p => (p.id === activePageId ? { ...p, [key]: val } : p));
        return { ...s, pages };
      }
      return s;
    });
    setSections(updated);
    AppStorage.set(AppStorage.KEYS.NOTES_DATA, updated);
  };

  const addPage = () => {
    const newPage: NotePage = {
      id: `p_${Date.now()}`,
      title: 'صفحة ملاحظة جديدة',
      content: '',
      date: new Date().toLocaleDateString('ar-EG')
    };
    const updated = sections.map(s => {
      if (s.id === activeSecId) {
        return { ...s, pages: [...s.pages, newPage] };
      }
      return s;
    });
    setSections(updated);
    setActivePageId(newPage.id);
    AppStorage.set(AppStorage.KEYS.NOTES_DATA, updated);
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-white select-none">
      {/* Sections column */}
      <div className="w-48 bg-[#f3f2f1] border-l border-gray-300 p-2 space-y-1 shrink-0">
        <div className="text-[11px] font-bold text-gray-500 mb-2 px-2">أقسام الدفتر</div>
        {sections.map(s => (
          <div
            key={s.id}
            onClick={() => {
              setActiveSecId(s.id);
              if (s.pages[0]) setActivePageId(s.pages[0].id);
            }}
            className={`p-2 rounded text-xs cursor-pointer font-bold transition flex items-center justify-between ${
              activeSecId === s.id ? 'bg-purple-100 text-[#7719aa] border border-purple-300' : 'hover:bg-gray-200 text-gray-700'
            }`}
          >
            <span>{s.name}</span>
          </div>
        ))}
      </div>

      {/* Pages column */}
      <div className="w-56 bg-gray-50 border-l border-gray-200 p-2 space-y-1 shrink-0">
        <div className="flex items-center justify-between px-2 mb-2">
          <span className="text-[11px] font-bold text-gray-500">الصفحات</span>
          <button
            onClick={addPage}
            className="p-1 hover:bg-gray-200 text-[#7719aa] rounded cursor-pointer"
            title="إضافة صفحة جديدة"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {curSec?.pages.map(p => (
          <div
            key={p.id}
            onClick={() => setActivePageId(p.id)}
            className={`p-2 rounded text-xs cursor-pointer transition ${
              activePageId === p.id ? 'bg-white shadow-xs font-bold text-[#7719aa] border-r-2 border-[#7719aa]' : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <div className="truncate">{p.title || 'بلا عنوان'}</div>
            <div className="text-[10px] text-gray-400 mt-0.5">{p.date}</div>
          </div>
        ))}
      </div>

      {/* Note Content Editor */}
      <div className="flex-1 flex flex-col p-8 overflow-auto bg-white">
        {curPage ? (
          <div className="max-w-3xl w-full mx-auto space-y-4">
            <input
              type="text"
              value={curPage.title}
              onChange={e => updatePage('title', e.target.value)}
              className="w-full text-2xl font-black text-gray-900 border-b border-gray-200 pb-2 outline-none focus:border-[#7719aa]"
              placeholder="عنوان الملاحظة..."
            />
            <div className="text-xs text-gray-400">{curPage.date}</div>
            <textarea
              value={curPage.content}
              onChange={e => updatePage('content', e.target.value)}
              rows={16}
              className="w-full text-sm leading-relaxed text-gray-800 outline-none resize-none border-none"
              placeholder="اكتب ملاحظاتك وتفاصيل الفكرة هنا بحرية..."
            />
          </div>
        ) : (
          <div className="text-center text-gray-400 py-20">لا توجد صفحة ملاحظات محددة.</div>
        )}
      </div>
    </div>
  );
};
