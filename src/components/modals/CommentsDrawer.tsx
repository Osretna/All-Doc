import React, { useState } from 'react';
import { MessageSquare, Trash2, CheckCircle, Send, X } from 'lucide-react';
import { DocumentComment } from '../../types/word';

interface CommentsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  comments: DocumentComment[];
  onAddComment: (text: string) => void;
  onDeleteComment: (id: string) => void;
  onResolveComment: (id: string) => void;
}

export const CommentsDrawer: React.FC<CommentsDrawerProps> = ({
  isOpen,
  onClose,
  comments,
  onAddComment,
  onDeleteComment,
  onResolveComment,
}) => {
  const [newText, setNewText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    onAddComment(newText.trim());
    setNewText('');
  };

  return (
    <aside 
      className="w-80 bg-slate-50 border-r border-slate-300 flex flex-col shrink-0 text-right z-20 shadow-lg select-none"
      dir="rtl"
    >
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#2b579a] text-white">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-white" />
          <span className="font-semibold text-xs">التعليقات والمراجعات ({comments.length})</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded text-white/90 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* New comment input */}
      <form onSubmit={handleSubmit} className="p-3 border-b border-slate-200 bg-white">
        <label className="block mb-1 text-[11px] font-bold text-slate-700">إضافة تعليق جديد:</label>
        <div className="flex gap-1.5">
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="اكتب ملاحظتك أو تعليقك..."
            className="flex-1 px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:border-[#2b579a] outline-none"
          />
          <button
            type="submit"
            className="p-1.5 bg-[#2b579a] text-white rounded hover:bg-[#20447c] transition-colors"
            title="إرسال التعليق"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Comments list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {comments.length === 0 ? (
          <div className="text-center text-slate-400 text-xs py-8">
            لا توجد تعليقات حالياً.<br />يمكنك إضافة تعليق على أي نص محدد.
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className={`p-3 rounded-lg border text-xs shadow-2xs transition-all ${
                comment.resolved
                  ? 'bg-slate-100 border-slate-200 opacity-60'
                  : 'bg-white border-blue-200 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[#2b579a]">{comment.author}</span>
                <span className="text-[10px] text-slate-400">{comment.date}</span>
              </div>

              {comment.selectedTextSnippet && (
                <div className="p-1.5 mb-1.5 bg-amber-50 border-r-2 border-amber-400 text-[11px] text-amber-900 rounded-xs italic">
                  &ldquo;{comment.selectedTextSnippet}&rdquo;
                </div>
              )}

              <p className="text-slate-800 my-1 text-xs">{comment.text}</p>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 text-[11px]">
                <button
                  onClick={() => onResolveComment(comment.id)}
                  className={`flex items-center gap-1 transition-colors ${
                    comment.resolved ? 'text-emerald-600 font-bold' : 'text-slate-500 hover:text-emerald-600'
                  }`}
                  title={comment.resolved ? 'تم الحل' : 'وضع علامة تم الحل'}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{comment.resolved ? 'محلول' : 'حل'}</span>
                </button>
                <button
                  onClick={() => onDeleteComment(comment.id)}
                  className="text-slate-400 hover:text-rose-600 transition-colors"
                  title="حذف التعليق"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
};
