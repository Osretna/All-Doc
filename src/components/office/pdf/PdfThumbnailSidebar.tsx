import React, { useState } from 'react';
import { Layers, Bookmark, MessageSquare, RotateCw, Trash2, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { StickyNote } from './types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  totalPages: number;
  currentPage: number;
  onSelectPage: (page: number) => void;
  onRotatePage: (page: number, delta: number) => void;
  onDeletePage: (page: number) => void;
  pageRotations: Record<number, number>;
  stickyNotes: StickyNote[];
}

export const PdfThumbnailSidebar: React.FC<Props> = ({
  isOpen,
  onClose,
  totalPages,
  currentPage,
  onSelectPage,
  onRotatePage,
  onDeletePage,
  pageRotations,
  stickyNotes,
}) => {
  const [activeTab, setActiveTab] = useState<'thumbnails' | 'bookmarks' | 'comments'>('thumbnails');

  if (!isOpen) return null;

  return (
    <div className="w-56 bg-white border-l border-gray-300 flex flex-col shrink-0 text-right select-none z-20 shadow-md">
      {/* Sidebar Header & Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50 text-[11px] font-semibold">
        <button
          onClick={() => setActiveTab('thumbnails')}
          className={`flex-1 py-2 flex items-center justify-center gap-1 transition cursor-pointer ${
            activeTab === 'thumbnails'
              ? 'bg-white text-[#ba141a] border-b-2 border-[#ba141a] font-bold'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          title="الصفحات المصغرة"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>الصفحات</span>
        </button>

        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`flex-1 py-2 flex items-center justify-center gap-1 transition cursor-pointer ${
            activeTab === 'bookmarks'
              ? 'bg-white text-[#ba141a] border-b-2 border-[#ba141a] font-bold'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          title="الإشارات المرجعية"
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>إشارات</span>
        </button>

        <button
          onClick={() => setActiveTab('comments')}
          className={`flex-1 py-2 flex items-center justify-center gap-1 transition cursor-pointer ${
            activeTab === 'comments'
              ? 'bg-white text-[#ba141a] border-b-2 border-[#ba141a] font-bold'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          title="قائمة التعليقات"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>تعليقات</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50">
        {/* Thumbnails Tab */}
        {activeTab === 'thumbnails' && (
          <div className="space-y-3">
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              const isCurrent = pageNum === currentPage;
              const rotation = pageRotations[pageNum] || 0;

              return (
                <div
                  key={pageNum}
                  onClick={() => onSelectPage(pageNum)}
                  className={`bg-white rounded-lg p-2.5 border-2 transition cursor-pointer flex flex-col items-center justify-between group shadow-2xs ${
                    isCurrent
                      ? 'border-[#ba141a] ring-2 ring-red-500/20 shadow-xs'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {/* Miniature Sheet Visual */}
                  <div
                    className="w-24 h-32 bg-white border border-gray-300 rounded shadow-2xs my-1 flex flex-col justify-between p-2 text-[7px] text-gray-400 overflow-hidden transition-transform duration-300"
                    style={{ transform: `rotate(${rotation}deg)` }}
                  >
                    <div className="h-1.5 w-3/4 bg-red-100 rounded" />
                    <div className="space-y-1">
                      <div className="h-1 w-full bg-gray-200 rounded" />
                      <div className="h-1 w-5/6 bg-gray-200 rounded" />
                      <div className="h-1 w-full bg-gray-200 rounded" />
                    </div>
                    <div className="h-1 w-1/2 bg-gray-300 rounded mx-auto" />
                  </div>

                  {/* Page Footer Info */}
                  <div className="w-full flex items-center justify-between pt-1 border-t border-gray-100 text-[10px] text-gray-600">
                    <span className="font-bold">صفحة {pageNum}</span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRotatePage(pageNum, 90);
                        }}
                        className="p-0.5 hover:bg-gray-100 rounded text-gray-500"
                        title="تدوير"
                      >
                        <RotateCw className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeletePage(pageNum);
                        }}
                        className="p-0.5 hover:bg-red-50 rounded text-red-600"
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
        )}

        {/* Bookmarks Tab */}
        {activeTab === 'bookmarks' && (
          <div className="space-y-2 text-xs">
            <span className="text-gray-500 text-[11px] block font-semibold">فهرس الإشارات المرجعية:</span>
            {[
              { page: 1, title: 'المقدمة ومحضر الاجتماع' },
              { page: 2, title: 'جدول الأعمال والمصروفات' },
              { page: 3, title: 'التوصيات والقرارات الرسمية' },
              { page: 4, title: 'محضر التوقيعات والاعتماد' },
            ].map((bm) => (
              <button
                key={bm.page}
                onClick={() => onSelectPage(Math.min(totalPages, bm.page))}
                className="w-full text-right p-2 rounded hover:bg-white border border-transparent hover:border-gray-200 flex items-center justify-between text-gray-800"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <Bookmark className="w-3 h-3 text-[#ba141a] shrink-0" />
                  <span className="truncate">{bm.title}</span>
                </div>
                <span className="text-[10px] font-mono text-gray-400">ص {bm.page}</span>
              </button>
            ))}
          </div>
        )}

        {/* Comments Tab */}
        {activeTab === 'comments' && (
          <div className="space-y-2.5 text-xs">
            <span className="text-gray-500 text-[11px] block font-semibold">
              التعليقات والملاحظات ({stickyNotes.length}):
            </span>
            {stickyNotes.length === 0 ? (
              <div className="text-center text-gray-400 text-xs py-6">
                لا توجد ملاحظات مضافة بعد.
                <br />
                استخدم أداة "ملاحظة لاصقة" لإضافة تعليق.
              </div>
            ) : (
              stickyNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => onSelectPage(note.pageNumber)}
                  className="bg-amber-50 border border-amber-300 rounded-lg p-2.5 text-right shadow-2xs hover:shadow-xs transition cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1 text-[10px] text-amber-900 font-bold">
                    <span>{note.author}</span>
                    <span className="font-mono text-gray-400">ص {note.pageNumber}</span>
                  </div>
                  <div className="text-[11px] text-gray-800 line-clamp-2">{note.text}</div>
                  <div className="text-[9px] text-gray-400 mt-1">{note.date}</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
