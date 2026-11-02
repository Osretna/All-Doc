import React from 'react';
import { 
  Square, 
  Circle, 
  Triangle, 
  Star, 
  Heart, 
  ArrowRight, 
  ArrowLeft, 
  ArrowUp, 
  ArrowDown, 
  MessageSquare, 
  Bookmark, 
  Diamond,
  X 
} from 'lucide-react';

interface ShapePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectShape: (shapeType: string, shapeSvg: string) => void;
}

export const ShapePickerModal: React.FC<ShapePickerModalProps> = ({
  isOpen,
  onClose,
  onSelectShape,
}) => {
  if (!isOpen) return null;

  const shapeCategories = [
    {
      title: 'مستطيلات وأشكال أساسية',
      items: [
        { id: 'rect', label: 'مستطيل', icon: <Square className="w-5 h-5" />, html: '<div class="inline-block p-4 my-2 bg-blue-100 border-2 border-blue-500 rounded text-center text-blue-900 font-medium">مستطيل توضيحي (اكتب هنا)</div>' },
        { id: 'rounded-rect', label: 'مستطيل مستدير الزوايا', icon: <Square className="w-5 h-5 rounded-lg" />, html: '<div class="inline-block p-4 my-2 bg-indigo-50 border-2 border-indigo-400 rounded-xl text-center text-indigo-900 font-medium shadow-sm">مستطيل مستدير الزوايا</div>' },
        { id: 'circle', label: 'دائرة / شكل بيضاوي', icon: <Circle className="w-5 h-5" />, html: '<div class="inline-flex items-center justify-center w-24 h-24 my-2 bg-emerald-100 border-2 border-emerald-500 rounded-full text-center text-emerald-900 text-xs font-medium">دائرة</div>' },
        { id: 'triangle', label: 'مثلث', icon: <Triangle className="w-5 h-5" />, html: '<div class="inline-block p-3 my-2 bg-amber-100 border border-amber-400 text-amber-900 font-medium rounded">▲ مثلث توضيحي</div>' },
        { id: 'diamond', label: 'شكل معيني', icon: <Diamond className="w-5 h-5" />, html: '<div class="inline-block p-3 my-2 bg-cyan-100 border border-cyan-400 text-cyan-900 font-medium rounded">◆ معيني</div>' },
      ],
    },
    {
      title: 'أسهم ورموز كتلية',
      items: [
        { id: 'arrow-right', label: 'سهم لليمين', icon: <ArrowRight className="w-5 h-5" />, html: '<span class="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded font-bold">➜ مرحلة تالية</span>' },
        { id: 'arrow-left', label: 'سهم لليسار', icon: <ArrowLeft className="w-5 h-5" />, html: '<span class="inline-flex items-center gap-1 px-3 py-1 bg-slate-700 text-white rounded font-bold">⬅ مرحلة سابقة</span>' },
        { id: 'arrow-up', label: 'سهم لأعلى', icon: <ArrowUp className="w-5 h-5" />, html: '<span class="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 text-white rounded font-bold">⬆ نمو وتصاعد</span>' },
        { id: 'arrow-down', label: 'سهم لأسفل', icon: <ArrowDown className="w-5 h-5" />, html: '<span class="inline-flex items-center gap-1 px-3 py-1 bg-rose-600 text-white rounded font-bold">⬇ انخفاض</span>' },
      ],
    },
    {
      title: 'نجوم ووسائل شرح (Callouts)',
      items: [
        { id: 'star', label: 'نجمة خماسية', icon: <Star className="w-5 h-5" />, html: '<div class="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-400 text-amber-950 rounded-md font-bold shadow-sm">★ نقطة هامة تميز هذا المشروع</div>' },
        { id: 'heart', label: 'قلب', icon: <Heart className="w-5 h-5" />, html: '<span class="text-rose-600 text-xl font-bold">♥</span>' },
        { id: 'callout', label: 'وسيلة شرح (فقاعة كلام)', icon: <MessageSquare className="w-5 h-5" />, html: '<div class="inline-block p-3 my-2 bg-amber-50 border border-amber-300 rounded-lg text-amber-900 text-xs shadow-sm relative">💬 ملاحظة هامة: يرجى مراجعة هذه الفقرة بدقة قبل الطباعة.</div>' },
        { id: 'ribbon-banner', label: 'شريط عنوان', icon: <Bookmark className="w-5 h-5" />, html: '<div class="p-3 my-2 bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 text-white font-bold text-center rounded shadow">★ عنوان بارز في المستند ★</div>' },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4">
      <div 
        className="w-full max-w-lg bg-white rounded-lg shadow-2xl border border-slate-300 overflow-hidden text-right"
        dir="rtl"
      >
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#2b579a] text-white">
          <span className="font-semibold text-sm">إدراج أشكال (Insert Shapes)</span>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded text-white/90 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4 max-h-[75vh] overflow-y-auto">
          {shapeCategories.map((cat, idx) => (
            <div key={idx} className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 border-b border-slate-200 pb-1">
                {cat.title}
              </h4>
              <div className="grid grid-cols-4 gap-2">
                {cat.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectShape(item.label, item.html);
                      onClose();
                    }}
                    className="flex flex-col items-center justify-center gap-1.5 p-3 rounded border border-slate-200 hover:border-[#2b579a] hover:bg-blue-50/50 text-slate-700 hover:text-[#2b579a] transition-all text-xs group"
                  >
                    <div className="text-slate-600 group-hover:text-[#2b579a] transition-colors">
                      {item.icon}
                    </div>
                    <span className="text-[11px] truncate w-full text-center">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end p-3 bg-slate-50 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-slate-300 text-xs text-slate-700 rounded hover:bg-slate-100 transition-colors"
          >
            إلغاء الأمر
          </button>
        </div>
      </div>
    </div>
  );
};
