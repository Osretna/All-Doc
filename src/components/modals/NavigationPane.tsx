import React, { useState } from 'react';
import { Search, FileText, ListTree, X } from 'lucide-react';

interface NavigationPaneProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
  headings: { id: string; text: string; level: number }[];
}

export const NavigationPane: React.FC<NavigationPaneProps> = ({
  isOpen,
  onClose,
  onSearch,
  headings,
}) => {
  const [activeTab, setActiveTab] = useState<'headings' | 'pages' | 'results'>('headings');
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  return (
    <aside 
      className="w-72 bg-white border-l border-slate-300 flex flex-col shrink-0 text-right z-20 shadow-md select-none transition-all duration-200"
      dir="rtl"
    >
      {/* Pane Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-100 border-b border-slate-300">
        <span className="font-semibold text-xs text-slate-800">التنقل (Navigation)</span>
        <button
          onClick={onClose}
          className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-800 transition-colors"
          title="إغلاق جزء التنقل"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Search in doc */}
      <div className="p-2 border-b border-slate-200">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              onSearch(e.target.value);
              if (e.target.value) setActiveTab('results');
            }}
            placeholder="البحث في المستند..."
            className="w-full pl-7 pr-3 py-1.5 text-xs border border-slate-300 rounded focus:border-[#2b579a] focus:ring-1 focus:ring-[#2b579a] outline-none"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2.5" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50 text-[11px] font-medium">
        <button
          onClick={() => setActiveTab('headings')}
          className={`flex-1 py-1.5 text-center border-b-2 transition-colors flex items-center justify-center gap-1 ${
            activeTab === 'headings'
              ? 'border-[#2b579a] text-[#2b579a] bg-white font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <ListTree className="w-3 h-3" />
          <span>العناوين</span>
        </button>
        <button
          onClick={() => setActiveTab('pages')}
          className={`flex-1 py-1.5 text-center border-b-2 transition-colors flex items-center justify-center gap-1 ${
            activeTab === 'pages'
              ? 'border-[#2b579a] text-[#2b579a] bg-white font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-3 h-3" />
          <span>الصفحات</span>
        </button>
        <button
          onClick={() => setActiveTab('results')}
          className={`flex-1 py-1.5 text-center border-b-2 transition-colors ${
            activeTab === 'results'
              ? 'border-[#2b579a] text-[#2b579a] bg-white font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          النتائج
        </button>
      </div>

      {/* Pane Content */}
      <div className="flex-1 overflow-y-auto p-2 text-xs">
        {activeTab === 'headings' && (
          <div className="space-y-1">
            {headings.length === 0 ? (
              <p className="text-[11px] text-slate-400 text-center py-6">
                لم يتم إضافة عناوين بعد.<br />قم بتطبيق نمط Heading من تبويب الرئيسية.
              </p>
            ) : (
              headings.map((h, i) => (
                <div
                  key={i}
                  className="px-2 py-1.5 rounded hover:bg-blue-50 text-slate-700 hover:text-[#2b579a] cursor-pointer text-xs truncate"
                  style={{ paddingRight: `${(h.level - 1) * 12 + 8}px` }}
                  onClick={() => {
                    // scroll to heading if found
                    const el = document.getElementById(h.id);
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {h.text}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'pages' && (
          <div className="space-y-3 p-2">
            <div className="border border-slate-300 rounded p-3 bg-white shadow-sm flex flex-col items-center gap-1 cursor-pointer hover:border-[#2b579a]">
              <div className="w-24 h-32 bg-slate-100 border border-slate-200 rounded flex flex-col p-1 gap-1">
                <div className="h-2 bg-slate-300 rounded w-3/4"></div>
                <div className="h-1 bg-slate-200 rounded w-full"></div>
                <div className="h-1 bg-slate-200 rounded w-5/6"></div>
                <div className="h-1 bg-slate-200 rounded w-full"></div>
              </div>
              <span className="text-[11px] font-bold text-slate-700">صفحة 1</span>
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="text-slate-500 text-[11px] py-4 text-center">
            {query ? (
              <p>تم إبراز نتائج البحث عن &ldquo;{query}&rdquo; داخل محتوى المستند.</p>
            ) : (
              <p>اكتب في شريط البحث أعلاه لاستعراض النتائج.</p>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
