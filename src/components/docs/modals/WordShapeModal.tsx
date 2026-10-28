import React from 'react';
import { X, Square, Circle, Triangle, ArrowRight, Star, Heart, MessageSquare, Shield, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectShape: (shapeName: string, shapeHtml: string) => void;
}

export const WordShapeModal: React.FC<Props> = ({ isOpen, onClose, onSelectShape }) => {
  if (!isOpen) return null;

  const shapes = [
    {
      name: 'مستطيل',
      html: '<div style="width: 140px; height: 80px; background-color: #2563eb; border: 2px solid #1d4ed8; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; color: white; font-weight: bold; margin: 10px;" contenteditable="true">مستطيل</div>'
    },
    {
      name: 'مستطيل مستدير الحواف',
      html: '<div style="width: 140px; height: 80px; background-color: #10b981; border: 2px solid #059669; border-radius: 20px; display: inline-flex; align-items: center; justify-content: center; color: white; font-weight: bold; margin: 10px;" contenteditable="true">شكل انسيابي</div>'
    },
    {
      name: 'دائرة',
      html: '<div style="width: 90px; height: 90px; background-color: #f59e0b; border: 2px solid #d97706; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; color: white; font-weight: bold; margin: 10px;" contenteditable="true">دائرة</div>'
    },
    {
      name: 'شارة وبادج رسمي',
      html: '<div style="display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background-color: #0f172a; color: white; border-radius: 9999px; font-weight: bold; font-size: 13px; margin: 10px; border: 2px solid #38bdf8;" contenteditable="true">★ شارة اعتماد رسمية ★</div>'
    },
    {
      name: 'مربع ملاحظة وتنبيه',
      html: '<div style="padding: 12px 16px; background-color: #fef3c7; border-right: 4px solid #f59e0b; border-radius: 4px; color: #92400e; font-size: 13px; margin: 12px 0;" contenteditable="true"><strong>ملاحظة هامة:</strong> اكتب نص التنبيه أو التوجيه هنا.</div>'
    },
    {
      name: 'صندوق اقتباس مميز',
      html: '<blockquote style="padding: 12px 20px; margin: 16px 0; border-right: 4px solid #004578; background: #f8fafc; font-style: italic; color: #334155;" contenteditable="true">"اكتب نص الاقتباس أو الكلمة الافتتاحية للمستند هنا."</blockquote>'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-300 w-full max-w-md flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        <div className="flex items-center justify-between px-4 py-3 bg-[#004578] text-white">
          <div className="flex items-center gap-2">
            <Square className="w-5 h-5" />
            <h3 className="font-bold text-sm">إدراج أشكال توضيحية (Shapes)</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded cursor-pointer transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3 text-xs text-gray-700 max-h-96 overflow-y-auto">
          <p className="text-gray-500">اختر الشكل الهندسي أو العنصر التوضيحي لإدراجه مباشرة في المستند:</p>
          <div className="grid grid-cols-2 gap-3">
            {shapes.map((s, idx) => (
              <div
                key={idx}
                onClick={() => {
                  onSelectShape(s.name, s.html);
                  onClose();
                }}
                className="p-3 border border-gray-200 rounded-lg hover:border-blue-600 hover:shadow-md cursor-pointer transition flex flex-col items-center justify-center text-center gap-2 group bg-gray-50/50 hover:bg-blue-50/30"
              >
                <div className="w-8 h-8 rounded bg-white shadow-2xs flex items-center justify-center text-blue-600 group-hover:scale-110 transition">
                  <Square className="w-5 h-5" />
                </div>
                <span className="font-bold text-gray-800 text-xs">{s.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 py-2.5 bg-gray-100 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-medium cursor-pointer"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
};
