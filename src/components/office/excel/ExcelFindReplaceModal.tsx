import React, { useState } from 'react';
import { X, Search, Replace, ArrowRight, ArrowLeft } from 'lucide-react';
import { SheetData } from '../../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: SheetData;
  onSelectCell: (cellId: string) => void;
  onReplaceCell: (cellId: string, newValue: string) => void;
  onReplaceAll: (searchTerm: string, replaceTerm: string) => void;
}

export const ExcelFindReplaceModal: React.FC<Props> = ({
  isOpen,
  onClose,
  data,
  onSelectCell,
  onReplaceCell,
  onReplaceAll,
}) => {
  const [activeTab, setActiveTab] = useState<'find' | 'replace'>('find');
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [matchCase, setMatchCase] = useState(false);
  const [matchEntireCell, setMatchEntireCell] = useState(false);
  const [matchResults, setMatchResults] = useState<{ cellId: string; value: string }[]>([]);
  const [currentMatchIdx, setCurrentMatchIdx] = useState(0);

  if (!isOpen) return null;

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setMatchResults([]);
      return;
    }

    const term = matchCase ? searchTerm : searchTerm.toLowerCase();
    const results: { cellId: string; value: string }[] = [];

    Object.keys(data).forEach((cellId) => {
      const cell = data[cellId];
      if (cell && cell.value !== undefined && cell.value !== null) {
        const valStr = String(cell.value);
        const compareStr = matchCase ? valStr : valStr.toLowerCase();

        let matches = false;
        if (matchEntireCell) {
          matches = compareStr === term;
        } else {
          matches = compareStr.includes(term);
        }

        if (matches) {
          results.push({ cellId, value: valStr });
        }
      }
    });

    setMatchResults(results);
    setCurrentMatchIdx(0);
    if (results.length > 0) {
      onSelectCell(results[0].cellId);
    }
  };

  const handleNextMatch = () => {
    if (matchResults.length === 0) return;
    const nextIdx = (currentMatchIdx + 1) % matchResults.length;
    setCurrentMatchIdx(nextIdx);
    onSelectCell(matchResults[nextIdx].cellId);
  };

  const handlePrevMatch = () => {
    if (matchResults.length === 0) return;
    const prevIdx = (currentMatchIdx - 1 + matchResults.length) % matchResults.length;
    setCurrentMatchIdx(prevIdx);
    onSelectCell(matchResults[prevIdx].cellId);
  };

  const handleReplaceCurrent = () => {
    if (matchResults.length === 0) return;
    const target = matchResults[currentMatchIdx];
    const oldVal = target.value;
    const regex = new RegExp(searchTerm, matchCase ? 'g' : 'gi');
    const newVal = oldVal.replace(regex, replaceTerm);
    onReplaceCell(target.cellId, newVal);

    // Refresh search
    handleSearch();
  };

  const handleExecuteReplaceAll = () => {
    if (!searchTerm.trim()) return;
    onReplaceAll(searchTerm, replaceTerm);
    setMatchResults([]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-[#107c41] text-white px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            <h3 className="font-bold text-xs">بحث واستبدال (Find and Replace)</h3>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded transition">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-gray-200 bg-gray-50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('find')}
            className={`flex-1 py-2 text-center transition ${
              activeTab === 'find'
                ? 'bg-white text-[#107c41] border-b-2 border-[#107c41]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            بحث (Find)
          </button>
          <button
            onClick={() => setActiveTab('replace')}
            className={`flex-1 py-2 text-center transition ${
              activeTab === 'replace'
                ? 'bg-white text-[#107c41] border-b-2 border-[#107c41]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            استبدال (Replace)
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3 text-xs">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">البحث عن:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="أدخل النص أو الرقم للبحث..."
                className="flex-1 border border-gray-300 rounded px-2.5 py-1.5 outline-none focus:border-[#107c41]"
                autoFocus
              />
              <button
                onClick={handleSearch}
                className="px-3 py-1.5 bg-[#107c41] text-white rounded font-bold hover:bg-[#0e6b37] transition"
              >
                بحث
              </button>
            </div>
          </div>

          {activeTab === 'replace' && (
            <div>
              <label className="block text-gray-700 font-semibold mb-1">استبدال بـ:</label>
              <input
                type="text"
                value={replaceTerm}
                onChange={(e) => setReplaceTerm(e.target.value)}
                placeholder="النص البديل الجديد..."
                className="w-full border border-gray-300 rounded px-2.5 py-1.5 outline-none focus:border-[#107c41]"
              />
            </div>
          )}

          {/* Options */}
          <div className="space-y-1.5 pt-1">
            <label className="flex items-center gap-1.5 text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={matchCase}
                onChange={(e) => setMatchCase(e.target.checked)}
                className="accent-[#107c41] rounded"
              />
              <span>مطابقة حالة الأحرف (Match Case)</span>
            </label>
            <label className="flex items-center gap-1.5 text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={matchEntireCell}
                onChange={(e) => setMatchEntireCell(e.target.checked)}
                className="accent-[#107c41] rounded"
              />
              <span>مطابقة محتوى الخلية بأكمله (Match entire cell contents)</span>
            </label>
          </div>

          {/* Results count & navigator */}
          {matchResults.length > 0 && (
            <div className="bg-emerald-50 border border-emerald-200 rounded p-2.5 flex items-center justify-between">
              <span className="font-bold text-emerald-900">
                النتيجة {currentMatchIdx + 1} من {matchResults.length} (خلية{' '}
                <span className="font-mono underline">{matchResults[currentMatchIdx].cellId}</span>)
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrevMatch}
                  className="p-1 rounded bg-white border border-gray-300 hover:bg-emerald-100"
                  title="السابق"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleNextMatch}
                  className="p-1 rounded bg-white border border-gray-300 hover:bg-emerald-100"
                  title="التالي"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="bg-gray-50 border-t border-gray-200 px-4 py-2.5 flex items-center justify-between text-xs">
          <button
            onClick={onClose}
            className="px-3 py-1.5 border border-gray-300 rounded font-semibold text-gray-600 hover:bg-gray-100"
          >
            إغلاق
          </button>
          <div className="flex items-center gap-2">
            {activeTab === 'replace' && (
              <>
                <button
                  onClick={handleReplaceCurrent}
                  disabled={matchResults.length === 0}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded font-bold text-gray-800 disabled:opacity-40"
                >
                  استبدال
                </button>
                <button
                  onClick={handleExecuteReplaceAll}
                  className="px-3 py-1.5 bg-[#107c41] hover:bg-[#0e6b37] text-white rounded font-bold"
                >
                  استبدال الكل
                </button>
              </>
            )}
            {activeTab === 'find' && (
              <button
                onClick={handleNextMatch}
                disabled={matchResults.length === 0}
                className="px-3 py-1.5 bg-[#107c41] text-white rounded font-bold hover:bg-[#0e6b37] disabled:opacity-40"
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
