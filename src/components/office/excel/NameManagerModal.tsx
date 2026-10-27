import React, { useState } from 'react';
import { Tag, Plus, Trash2, X, Check } from 'lucide-react';

interface NameItem {
  name: string;
  refersTo: string;
  scope: string;
  comment?: string;
}

interface NameManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  names: NameItem[];
  onAddName: (item: NameItem) => void;
  onDeleteName: (name: string) => void;
}

export const NameManagerModal: React.FC<NameManagerModalProps> = ({
  isOpen,
  onClose,
  names,
  onAddName,
  onDeleteName,
}) => {
  const [selectedName, setSelectedName] = useState<string>(names[0]?.name || '');
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRefersTo, setNewRefersTo] = useState('Sheet1!$B$4:$B$8');

  if (!isOpen) return null;

  const handleSaveNew = () => {
    if (!newName.trim()) return;
    onAddName({
      name: newName.trim(),
      refersTo: newRefersTo.trim(),
      scope: 'المصنف بأكمله',
    });
    setNewName('');
    setIsAdding(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4" dir="rtl">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-gray-300 overflow-hidden text-right">
        <div className="flex items-center justify-between px-4 py-3 bg-[#107c41] text-white">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-white" />
            <span className="font-bold text-sm">مدير الأسماء (Name Manager)</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded text-white/90">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-3 text-xs">
          <div className="flex gap-2">
            <button
              onClick={() => setIsAdding(true)}
              className="px-3 py-1.5 bg-[#107c41] hover:bg-[#0c6233] text-white rounded font-bold flex items-center gap-1 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>جديد...</span>
            </button>
            <button
              onClick={() => {
                if (selectedName) onDeleteName(selectedName);
              }}
              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded font-medium flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>حذف</span>
            </button>
          </div>

          {isAdding && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg space-y-2">
              <span className="font-bold text-emerald-900 block">إضافة اسم نطاق جديد:</span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1 text-[11px] text-gray-700">الاسم المعرّف:</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="مثال: ميزانية_الصيانة"
                    className="w-full px-2.5 py-1 border border-gray-300 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-[11px] text-gray-700">يشير إلى (Refers to):</label>
                  <input
                    type="text"
                    value={newRefersTo}
                    onChange={(e) => setNewRefersTo(e.target.value)}
                    className="w-full px-2.5 py-1 border border-gray-300 rounded font-mono text-left"
                    dir="ltr"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-1.5 pt-1">
                <button
                  onClick={handleSaveNew}
                  className="px-3 py-1 bg-[#107c41] text-white rounded font-bold"
                >
                  حفظ
                </button>
                <button
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1 bg-white border border-gray-300 rounded text-gray-700"
                >
                  إلغاء
                </button>
              </div>
            </div>
          )}

          {/* Table of Defined Names */}
          <div className="border border-gray-300 rounded h-44 overflow-y-auto bg-gray-50/50">
            <table className="w-full text-right text-xs border-collapse">
              <thead>
                <tr className="bg-gray-200 text-gray-700 font-bold border-b border-gray-300">
                  <th className="p-2 border-l border-gray-300">الاسم (Name)</th>
                  <th className="p-2 border-l border-gray-300">يشير إلى</th>
                  <th className="p-2">النطاق</th>
                </tr>
              </thead>
              <tbody>
                {names.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-6 text-gray-400">
                      لا توجد أسماء معرفة في هذا المصنف حالياً.
                    </td>
                  </tr>
                ) : (
                  names.map((item) => (
                    <tr
                      key={item.name}
                      onClick={() => setSelectedName(item.name)}
                      className={`cursor-pointer transition ${
                        selectedName === item.name ? 'bg-emerald-100 text-emerald-950 font-bold' : 'hover:bg-gray-100'
                      }`}
                    >
                      <td className="p-2 border-l border-gray-200 font-mono">{item.name}</td>
                      <td className="p-2 border-l border-gray-200 font-mono text-left dir-ltr" dir="ltr">{item.refersTo}</td>
                      <td className="p-2 text-gray-600">{item.scope}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end p-3 bg-gray-50 border-t border-gray-200 text-xs">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#107c41] hover:bg-[#0c6233] text-white rounded font-bold shadow-sm transition"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
