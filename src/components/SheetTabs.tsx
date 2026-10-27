import React, { useState } from 'react';
import { Plus, X, Edit2, Sheet as SheetIcon } from 'lucide-react';
import { Sheet } from '../types/excel';

interface SheetTabsProps {
  sheets: Sheet[];
  activeSheetId: string;
  onSelectSheet: (id: string) => void;
  onAddSheet: () => void;
  onRenameSheet: (id: string, newName: string) => void;
  onDeleteSheet: (id: string) => void;
}

export const SheetTabs: React.FC<SheetTabsProps> = ({
  sheets,
  activeSheetId,
  onSelectSheet,
  onAddSheet,
  onRenameSheet,
  onDeleteSheet
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleStartRename = (sheet: Sheet) => {
    setEditingId(sheet.id);
    setEditingName(sheet.name);
  };

  const handleFinishRename = (id: string) => {
    if (editingName.trim()) {
      onRenameSheet(id, editingName.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="bg-slate-200 border-t border-slate-300 px-2 py-1 flex items-center justify-between text-xs select-none shadow-inner">
      {/* Sheet Tabs List */}
      <div className="flex items-center gap-1 overflow-x-auto py-0.5">
        {sheets.map((sheet) => {
          const isActive = sheet.id === activeSheetId;
          const isEditingThis = editingId === sheet.id;

          return (
            <div
              key={sheet.id}
              onClick={() => onSelectSheet(sheet.id)}
              onDoubleClick={() => handleStartRename(sheet)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-t border transition cursor-pointer text-xs font-medium ${
                isActive
                  ? 'bg-white text-emerald-800 border-slate-300 border-b-transparent shadow-xs font-bold border-t-2 border-t-emerald-600'
                  : 'bg-slate-300/70 text-slate-700 hover:bg-slate-300 border-transparent hover:border-slate-300'
              }`}
            >
              <SheetIcon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600' : 'text-slate-500'}`} />

              {isEditingThis ? (
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onBlur={() => handleFinishRename(sheet.id)}
                  onKeyDown={(e) => e.key === 'Enter' && handleFinishRename(sheet.id)}
                  autoFocus
                  className="w-24 px-1 py-0.5 text-xs bg-white text-slate-900 border border-emerald-500 rounded outline-none"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span>{sheet.name}</span>
              )}

              {/* Delete Sheet Button (if more than 1 sheet) */}
              {sheets.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`هل أنت متأكد من حذف ورقة "${sheet.name}"؟`)) {
                      onDeleteSheet(sheet.id);
                    }
                  }}
                  className="p-0.5 rounded hover:bg-slate-200 text-slate-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                  title="حذف الورقة"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}

        {/* Add Sheet (+) */}
        <button
          onClick={onAddSheet}
          className="flex items-center justify-center p-1.5 rounded-full hover:bg-slate-300 text-slate-600 hover:text-emerald-700 transition"
          title="إضافة ورقة عمل جديدة"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Info indicator */}
      <div className="text-[11px] text-slate-500 font-mono hidden sm:block">
        الورقات: {sheets.length} | جاهز
      </div>
    </div>
  );
};
