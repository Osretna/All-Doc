import React, { useState } from 'react';
import { X, Tag, Plus, Trash2, Edit2, Check } from 'lucide-react';
import { NamedRange } from '../../../types/office';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  namedRanges: NamedRange[];
  onSaveNamedRanges: (ranges: NamedRange[]) => void;
  currentRangeStr: string;
}

export const NameManagerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  namedRanges,
  onSaveNamedRanges,
  currentRangeStr
}) => {
  const [list, setList] = useState<NamedRange[]>(namedRanges);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRef, setNewRef] = useState(currentRangeStr || 'ورقة 1!$A$1:$A$10');
  const [scope, setScope] = useState('المصنف');

  if (!isOpen) return null;

  const handleAdd = () => {
    if (!newName.trim()) return;
    const cleanName = newName.trim().replace(/\s+/g, '_');
    const updated = [...list, { name: cleanName, refersTo: newRef, scope }];
    setList(updated);
    onSaveNamedRanges(updated);
    setIsAdding(false);
    setNewName('');
  };

  const handleDelete = (index: number) => {
    const updated = list.filter((_, i) => i !== index);
    setList(updated);
    onSaveNamedRanges(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-300 w-full max-w-lg flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        <div className="flex items-center justify-between px-4 py-3 bg-[#107c41] text-white">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5" />
            <h3 className="font-bold text-sm">مدير الأسماء (Name Manager)</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded cursor-pointer transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">يمكنك تسمية النطاقات لاستخدامها مباشرة داخل المعادلات الحسابية.</p>
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="flex items-center gap-1 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>اسم جديد...</span>
            </button>
          </div>

          {isAdding && (
            <div className="bg-emerald-50 border border-emerald-200 rounded p-3 space-y-2">
              <div className="font-bold text-emerald-900 text-xs">إضافة نطاق مسمى جديد:</div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-gray-700 mb-0.5">اسم النطاق (بدون مسافات):</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder="مثال: المبيعات_الإجمالية"
                    className="w-full px-2 py-1 border border-gray-300 rounded bg-white text-xs outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-700 mb-0.5">يشير إلى (Refers to):</label>
                  <input
                    type="text"
                    value={newRef}
                    onChange={e => setNewRef(e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded bg-white text-xs font-mono outline-none focus:border-emerald-600"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1 rounded bg-gray-200 text-gray-700 text-[11px] font-medium"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleAdd}
                  className="px-3 py-1 rounded bg-[#107c41] text-white text-[11px] font-bold"
                >
                  حفظ الاسم
                </button>
              </div>
            </div>
          )}

          {/* List Table */}
          <div className="border border-gray-200 rounded overflow-hidden">
            <table className="w-full text-right text-xs">
              <thead className="bg-gray-100 text-gray-600 border-b border-gray-200 text-[11px]">
                <tr>
                  <th className="p-2 font-bold">الاسم</th>
                  <th className="p-2 font-bold">يشير إلى</th>
                  <th className="p-2 font-bold">النطاق</th>
                  <th className="p-2 font-bold text-center">إجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {list.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition">
                    <td className="p-2 font-mono font-bold text-emerald-800">{item.name}</td>
                    <td className="p-2 font-mono text-gray-600 dir-ltr text-right">{item.refersTo}</td>
                    <td className="p-2 text-gray-500">{item.scope}</td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => handleDelete(idx)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded cursor-pointer"
                        title="حذف الاسم"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {list.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-gray-400">
                      لا توجد أسماء معرفة حالياً. انقر على "اسم جديد" لإنشاء اسم نطاق.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="px-4 py-2.5 bg-gray-100 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-1.5 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs cursor-pointer transition"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
