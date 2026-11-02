import React, { useState } from 'react';
import { X, Search, Bookmark, Heading, ListTree } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (text: string) => void;
  headings: { text: string; level: number; id: string }[];
}

export const WordNavigationPane: React.FC<Props> = ({
  isOpen,
  onClose,
  onSearch,
  headings,
}) => {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<'headings' | 'pages'>('headings');

  if (!isOpen) return null;

  return (
    <div className="w-64 bg-white border-l border-gray-300 flex flex-col h-full shadow-lg z-20 select-none animate-in slide-in-from-right duration-150">
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-1.5 font-bold text-xs text-gray-800">
          <ListTree className="w-4 h-4 text-[#004578]" />
          <span>جزء التنقل (Navigation)</span>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded text-gray-500">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-2 border-b border-gray-200">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              onSearch(e.target.value);
            }}
            placeholder="بحث في المستند..."
            className="w-full pr-8 pl-2 py-1.5 border border-gray-300 rounded text-xs outline-none focus:border-[#004578]"
          />
        </div>
      </div>

      <div className="flex border-b border-gray-200 text-xs font-bold bg-gray-50">
        <button
          onClick={() => setTab('headings')}
          className={`flex-1 py-1.5 text-center cursor-pointer ${
            tab === 'headings' ? 'border-b-2 border-[#004578] text-[#004578] bg-white' : 'text-gray-500'
          }`}
        >
          العناوين
        </button>
        <button
          onClick={() => setTab('pages')}
          className={`flex-1 py-1.5 text-center cursor-pointer ${
            tab === 'pages' ? 'border-b-2 border-[#004578] text-[#004578] bg-white' : 'text-gray-500'
          }`}
        >
          الصفحات
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1 text-xs">
        {tab === 'headings' ? (
          headings.length > 0 ? (
            headings.map((h, i) => (
              <div
                key={i}
                onClick={() => onSearch(h.text)}
                className={`p-1.5 rounded hover:bg-blue-50 text-gray-800 cursor-pointer transition ${
                  h.level === 1 ? 'font-bold text-gray-900 pr-1' : h.level === 2 ? 'pr-4 font-medium' : 'pr-7 text-gray-600'
                }`}
              >
                {h.text}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-8 text-[11px]">
              لم يتم العثور على عناوين منسقة في المستند.
            </div>
          )
        ) : (
          <div className="p-4 text-center">
            <div className="w-24 h-32 bg-gray-100 border border-gray-300 rounded mx-auto shadow-2xs flex items-center justify-center font-bold text-gray-500">
              1
            </div>
            <span className="text-[10px] text-gray-400 mt-2 block">صفحة 1</span>
          </div>
        )}
      </div>
    </div>
  );
};
