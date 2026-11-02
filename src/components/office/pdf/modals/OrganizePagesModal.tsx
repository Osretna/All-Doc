import React, { useState } from 'react';
import { X, RotateCw, RotateCcw, Trash2, Plus, Scissors, Copy, Check, FileText } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  totalPages: number;
  currentPage: number;
  onSelectPage: (page: number) => void;
  onRotatePage: (page: number, delta: number) => void;
  onDeletePage: (page: number) => void;
  onInsertBlankPage: (afterPage: number) => void;
  onSplitPdf: (fromPage: number, toPage: number) => void;
  pageRotations: Record<number, number>;
}

export const OrganizePagesModal: React.FC<Props> = ({
  isOpen,
  onClose,
  totalPages,
  currentPage,
  onSelectPage,
  onRotatePage,
  onDeletePage,
  onInsertBlankPage,
  onSplitPdf,
  pageRotations,
}) => {
  const [selectedPages, setSelectedPages] = useState<number[]>([currentPage]);
  const [splitFrom, setSplitFrom] = useState(1);
  const [splitTo, setSplitTo] = useState(Math.min(totalPages, 2));

  if (!isOpen) return null;

  const togglePageSelection = (p: number) => {
    if (selectedPages.includes(p)) {
      if (selectedPages.length > 1) {
        setSelectedPages(selectedPages.filter((x) => x !== p));
      }
    } else {
      setSelectedPages([...selectedPages, p]);
    }
  };

  const handleRotateSelected = (delta: number) => {
    selectedPages.forEach((p) => onRotatePage(p, delta));
  };

  const handleDeleteSelected = () => {
    if (totalPages <= 1) {
      alert('لا يمكن حذف الصفحة الوحيدة المتبقية في المستند.');
      return;
    }
    if (confirm(`هل أنت متأكد من حذف ${selectedPages.length} صفحة من المستند؟`)) {
      selectedPages.sort((a, b) => b - a).forEach((p) => onDeletePage(p));
      setSelectedPages([1]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 text-right flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-[#ba141a] text-white px-5 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            <h3 className="font-bold text-sm">تنظيم وتنسيق صفحات PDF (Organize Pages)</h3>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded transition cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="bg-gray-50 border-b border-gray-200 px-5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleRotateSelected(90)}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-white border border-gray-300 rounded hover:bg-red-50 hover:text-[#ba141a] font-semibold text-gray-700 cursor-pointer shadow-2xs"
              title="تدوير الصفحات المحددة 90 درجة لليمين"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>تدوير 90° لليمين</span>
            </button>
            <button
              onClick={() => handleRotateSelected(-90)}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-white border border-gray-300 rounded hover:bg-red-50 hover:text-[#ba141a] font-semibold text-gray-700 cursor-pointer shadow-2xs"
              title="تدوير الصفحات المحددة 90 درجة لليسار"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>تدوير 90° لليسار</span>
            </button>
            <button
              onClick={() => onInsertBlankPage(selectedPages[0] || 1)}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-white border border-gray-300 rounded hover:bg-emerald-50 hover:text-emerald-700 font-semibold text-gray-700 cursor-pointer shadow-2xs"
              title="إدراج صفحة فارغة جديدة"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-600" />
              <span>إدراج صفحة فارغة</span>
            </button>
            <button
              onClick={handleDeleteSelected}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-white border border-red-300 rounded hover:bg-red-50 text-red-700 font-semibold cursor-pointer shadow-2xs"
              title="حذف الصفحات المحددة"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>حذف ({selectedPages.length})</span>
            </button>
          </div>

          {/* Split Section */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-gray-200">
            <Scissors className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-[11px] text-gray-600">تقسيم من صفحة:</span>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={splitFrom}
              onChange={(e) => setSplitFrom(parseInt(e.target.value, 10) || 1)}
              className="w-12 border border-gray-300 rounded px-1 py-0.5 text-center text-xs"
            />
            <span className="text-[11px] text-gray-600">إلى:</span>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={splitTo}
              onChange={(e) => setSplitTo(parseInt(e.target.value, 10) || 1)}
              className="w-12 border border-gray-300 rounded px-1 py-0.5 text-center text-xs"
            />
            <button
              onClick={() => {
                onSplitPdf(splitFrom, splitTo);
                alert(`تم استخراج وتقسيم الصفحات من ${splitFrom} إلى ${splitTo} كملف مستقل بنجاح!`);
              }}
              className="px-2.5 py-1 bg-[#ba141a] text-white rounded text-xs font-bold hover:bg-[#961015] cursor-pointer"
            >
              تقسيم
            </button>
          </div>
        </div>

        {/* Pages Grid */}
        <div className="p-5 overflow-y-auto flex-1 bg-slate-100">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              const isSelected = selectedPages.includes(pageNum);
              const rotation = pageRotations[pageNum] || 0;

              return (
                <div
                  key={pageNum}
                  onClick={() => togglePageSelection(pageNum)}
                  className={`bg-white rounded-xl p-3 border-2 transition cursor-pointer flex flex-col items-center justify-between group shadow-sm hover:shadow-md relative ${
                    isSelected
                      ? 'border-[#ba141a] ring-2 ring-red-500/20'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {/* Selection Checkmark */}
                  <div
                    className={`absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${
                      isSelected ? 'bg-[#ba141a]' : 'bg-gray-200 text-gray-400 group-hover:bg-gray-300'
                    }`}
                  >
                    {pageNum}
                  </div>

                  {/* Thumbnail Card */}
                  <div
                    className="w-28 h-36 bg-white border border-gray-300 rounded shadow-xs my-2 flex flex-col justify-between p-2 text-[8px] text-gray-400 overflow-hidden transition-transform duration-300"
                    style={{ transform: `rotate(${rotation}deg)` }}
                  >
                    <div className="h-2 w-3/4 bg-gray-200 rounded" />
                    <div className="space-y-1">
                      <div className="h-1.5 w-full bg-gray-100 rounded" />
                      <div className="h-1.5 w-5/6 bg-gray-100 rounded" />
                      <div className="h-1.5 w-full bg-gray-100 rounded" />
                      <div className="h-1.5 w-4/6 bg-gray-100 rounded" />
                    </div>
                    <div className="h-2 w-1/3 bg-gray-200 rounded mx-auto" />
                  </div>

                  {/* Page Controls */}
                  <div className="w-full flex items-center justify-between pt-1 border-t border-gray-100 text-[11px]">
                    <span className="font-bold text-gray-700">صفحة {pageNum}</span>
                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRotatePage(pageNum, 90);
                        }}
                        className="p-1 hover:bg-gray-100 rounded text-gray-600"
                        title="تدوير"
                      >
                        <RotateCw className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeletePage(pageNum);
                        }}
                        className="p-1 hover:bg-red-50 rounded text-red-600"
                        title="حذف"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-5 py-3 flex items-center justify-between shrink-0">
          <span className="text-xs text-gray-500">
            تم تحديد {selectedPages.length} من أصل {totalPages} صفحات
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (selectedPages[0]) onSelectPage(selectedPages[0]);
                onClose();
              }}
              className="px-5 py-1.5 rounded-lg bg-[#ba141a] hover:bg-[#961015] text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              تم وإغلاق المنظم
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
