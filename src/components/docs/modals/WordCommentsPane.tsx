import React, { useState } from 'react';
import { X, MessageSquare, Trash2, Check, CornerDownLeft, Plus } from 'lucide-react';

export interface DocComment {
  id: string;
  selectedText?: string;
  comment: string;
  author: string;
  date: string;
  resolved: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  comments: DocComment[];
  onAddComment: (comment: string) => void;
  onDeleteComment: (id: string) => void;
  onResolveComment: (id: string) => void;
}

export const WordCommentsPane: React.FC<Props> = ({
  isOpen,
  onClose,
  comments,
  onAddComment,
  onDeleteComment,
  onResolveComment,
}) => {
  const [newText, setNewText] = useState('');

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    onAddComment(newText.trim());
    setNewText('');
  };

  return (
    <div className="w-72 bg-white border-l border-gray-300 flex flex-col h-full shadow-lg z-20 select-none animate-in slide-in-from-right duration-150">
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-1.5 font-bold text-xs text-gray-800">
          <MessageSquare className="w-4 h-4 text-amber-600" />
          <span>التعليقات والملاحظات ({comments.length})</span>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded text-gray-500">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* New Comment Input */}
      <form onSubmit={handleAdd} className="p-3 border-b border-gray-200 bg-amber-50/50">
        <textarea
          value={newText}
          onChange={e => setNewText(e.target.value)}
          placeholder="أدخل تعليقك الجديد هنا..."
          rows={2}
          className="w-full text-xs p-2 border border-gray-300 rounded bg-white outline-none focus:border-amber-500 resize-none"
        />
        <div className="flex justify-end mt-1.5">
          <button
            type="submit"
            className="flex items-center gap-1 px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded cursor-pointer transition shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>نشر التعليق</span>
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {comments.map(c => (
          <div
            key={c.id}
            className={`p-3 rounded-lg border text-xs space-y-2 transition ${
              c.resolved ? 'bg-gray-50 border-gray-200 opacity-60' : 'bg-white border-amber-300 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-800">{c.author}</span>
              <span className="text-[10px] text-gray-400 font-mono">{c.date}</span>
            </div>

            {c.selectedText && (
              <div className="bg-amber-50 text-amber-900 border-r-2 border-amber-500 pr-2 py-0.5 text-[11px] italic">
                "{c.selectedText}"
              </div>
            )}

            <p className="text-gray-700 leading-relaxed">{c.comment}</p>

            <div className="flex items-center justify-end gap-2 pt-1 border-t border-gray-100">
              <button
                onClick={() => onResolveComment(c.id)}
                className={`p-1 rounded text-xs flex items-center gap-1 cursor-pointer ${
                  c.resolved ? 'text-gray-500' : 'text-emerald-700 hover:bg-emerald-50'
                }`}
                title={c.resolved ? 'إلغاء التحديد كمكتمل' : 'تحديد كمكتمل (Resolve)'}
              >
                <Check className="w-3.5 h-3.5" />
                <span className="text-[10px]">{c.resolved ? 'مكتمل' : 'حل التعليق'}</span>
              </button>

              <button
                onClick={() => onDeleteComment(c.id)}
                className="p-1 rounded text-red-500 hover:bg-red-50 text-xs cursor-pointer"
                title="حذف التعليق"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <div className="text-center text-gray-400 py-10 text-xs">
            لا توجد تعليقات حتى الآن. حدد نصاً واضغط على "تعليق جديد".
          </div>
        )}
      </div>
    </div>
  );
};
