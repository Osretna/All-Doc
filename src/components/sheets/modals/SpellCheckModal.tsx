import React, { useState } from 'react';
import { X, CheckCircle, Sparkles } from 'lucide-react';
import { SheetData } from '../../../types/office';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: SheetData;
  onCorrectWord: (cellKey: string, oldWord: string, newWord: string) => void;
}

export const SpellCheckModal: React.FC<Props> = ({
  isOpen,
  onClose,
  data,
  onCorrectWord,
}) => {
  if (!isOpen) return null;

  // Find common typos in Arabic
  const commonCorrections: { [wrong: string]: string } = {
    'اللة': 'الله',
    'انشاء الله': 'إن شاء الله',
    'مسؤل': 'مسؤول',
    'شئ': 'شيء',
    'ايميل': 'بريد إلكتروني',
    'تلفون': 'هاتف',
    'أستاذ': 'أستاذ',
    'ادارة': 'إدارة',
    'اجمالي': 'إجمالي',
    'تقرير': 'تقرير',
  };

  const detected: { cellKey: string; wrong: string; suggestion: string }[] = [];
  Object.entries(data).forEach(([cellKey, cell]) => {
    const text = String(cell.value || '');
    Object.entries(commonCorrections).forEach(([wrong, suggestion]) => {
      if (text.includes(wrong) && wrong !== suggestion) {
        detected.push({ cellKey, wrong, suggestion });
      }
    });
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-300 w-full max-w-md flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        <div className="flex items-center justify-between px-4 py-3 bg-[#107c41] text-white">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <h3 className="font-bold text-sm">التدقيق اللغوي والإملائي (Proofing)</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded cursor-pointer transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3 text-xs text-gray-700">
          {detected.length === 0 ? (
            <div className="text-center py-6 space-y-2">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
              <p className="font-bold text-emerald-800 text-sm">اكتمل التدقيق بنجاح!</p>
              <p className="text-gray-500">لم يتم العثور على أي أخطاء إملائية أو لغوية شائعة في ورقة العمل.</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="font-bold text-gray-800">الكلمات والملاحظات المقترح تصحيحها:</p>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {detected.map((item, idx) => (
                  <div key={idx} className="p-2.5 border border-amber-200 bg-amber-50 rounded flex items-center justify-between">
                    <div>
                      <div className="font-mono text-[10px] text-gray-500">خلية: {item.cellKey}</div>
                      <div className="text-red-700 font-bold line-through">{item.wrong}</div>
                      <div className="text-emerald-700 font-bold">الاقتراح: {item.suggestion}</div>
                    </div>
                    <button
                      onClick={() => onCorrectWord(item.cellKey, item.wrong, item.suggestion)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-xs cursor-pointer shadow-xs"
                    >
                      تصحيح
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-4 py-2.5 bg-gray-100 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-1.5 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-medium cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
