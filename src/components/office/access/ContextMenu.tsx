import React, { useEffect, useRef } from 'react';
import { Copy, Trash2, Edit2, Filter, FilterX, Eye, Download, Play, Table } from 'lucide-react';

export interface ContextMenuProps {
  x: number;
  y: number;
  type: 'record' | 'object' | 'field';
  data: any;
  onClose: () => void;
  onAction: (action: string, payload: any) => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  type,
  data,
  onClose,
  onAction,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="fixed z-[200] bg-white border border-gray-300 rounded-lg shadow-xl py-1 text-xs text-gray-700 min-w-[180px] animate-in fade-in select-none"
      style={{
        top: Math.min(y, window.innerHeight - 250),
        left: Math.min(x, window.innerWidth - 200),
      }}
      dir="rtl"
    >
      {type === 'record' && (
        <>
          <button
            onClick={() => { onAction('filter_by_selection', data); onClose(); }}
            className="w-full text-right px-3 py-1.5 hover:bg-red-50 hover:text-[#a4373a] flex items-center gap-2 cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <span>تصفية حسب هذا التحديد (Filter by Selection)</span>
          </button>
          <button
            onClick={() => { onAction('clear_filter', null); onClose(); }}
            className="w-full text-right px-3 py-1.5 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
          >
            <FilterX className="w-3.5 h-3.5 text-gray-500" />
            <span>إزالة عامل التصفية (Remove Filter)</span>
          </button>
          <div className="h-px bg-gray-200 my-1" />
          <button
            onClick={() => { onAction('copy_record', data); onClose(); }}
            className="w-full text-right px-3 py-1.5 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5 text-gray-500" />
            <span>نسخ السجل (Copy Record)</span>
          </button>
          <button
            onClick={() => { onAction('delete_record', data); onClose(); }}
            className="w-full text-right px-3 py-1.5 hover:bg-red-50 text-red-600 flex items-center gap-2 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-600" />
            <span>حذف السجل (Delete Record)...</span>
          </button>
        </>
      )}

      {type === 'object' && (
        <>
          <button
            onClick={() => { onAction('open_object', data); onClose(); }}
            className="w-full text-right px-3 py-1.5 hover:bg-gray-100 flex items-center gap-2 font-bold cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#a4373a]" />
            <span>فتح ورقة البيانات (Open Datasheet)</span>
          </button>
          <button
            onClick={() => { onAction('design_object', data); onClose(); }}
            className="w-full text-right px-3 py-1.5 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5 text-blue-600" />
            <span>عرض التصميم (Design View)</span>
          </button>
          <div className="h-px bg-gray-200 my-1" />
          <button
            onClick={() => { onAction('export_excel', data); onClose(); }}
            className="w-full text-right px-3 py-1.5 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>تصدير إلى Excel (.xlsx)</span>
          </button>
          <button
            onClick={() => { onAction('rename_object', data); onClose(); }}
            className="w-full text-right px-3 py-1.5 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
          >
            <span>إعادة تسمية (Rename)</span>
          </button>
          <button
            onClick={() => { onAction('delete_object', data); onClose(); }}
            className="w-full text-right px-3 py-1.5 hover:bg-red-50 text-red-600 flex items-center gap-2 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>حذف الجدول (Delete Table)...</span>
          </button>
        </>
      )}
    </div>
  );
};
