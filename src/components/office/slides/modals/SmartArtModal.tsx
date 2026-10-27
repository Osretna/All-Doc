import React, { useState } from 'react';
import { X, Check, Workflow, GitMerge, ArrowRight, RefreshCw, Network, Layers, Triangle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onInsertSmartArt: (smartArtType: string, title: string, items: string[]) => void;
}

const CATEGORIES = [
  { id: 'all', label: 'الكل' },
  { id: 'list', label: 'قائمة (List)' },
  { id: 'process', label: 'عملية (Process)' },
  { id: 'cycle', label: 'دورة (Cycle)' },
  { id: 'hierarchy', label: 'هيكل تنظيمي (Hierarchy)' },
  { id: 'relationship', label: 'علاقة (Relationship)' },
  { id: 'pyramid', label: 'هرمي (Pyramid)' },
];

export const SmartArtModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onInsertSmartArt,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('process-stepped');

  if (!isOpen) return null;

  const smartArtItems = [
    {
      id: 'process-stepped',
      category: 'process',
      title: 'عملية متتالية ذات أسهم (Step Process)',
      desc: 'عرض تقدم الخطوات والمراحل التنفيذية المتتابعة زمنياً',
      icon: <ArrowRight className="w-6 h-6 text-sky-500" />,
      defaultItems: ['المرحلة الأولى: التخطيط والتحليل', 'المرحلة الثانية: التنفيذ والتطوير', 'المرحلة الثالثة: الإطلاق والتقييم'],
    },
    {
      id: 'cycle-radial',
      category: 'cycle',
      title: 'دورة دائرية مستمرة (Radial Cycle)',
      desc: 'تمثيل العمليات التكرارية وحلقات التغذية الراجعة المستمرة',
      icon: <RefreshCw className="w-6 h-6 text-emerald-500" />,
      defaultItems: ['التخطيط', 'التنفيذ', 'المراجعة', 'التحسين'],
    },
    {
      id: 'hierarchy-org',
      category: 'hierarchy',
      title: 'هيكل تنظيمي إداري (Org Hierarchy)',
      desc: 'عرض شجرة الإدارة والمستويات الإشرافية في المؤسسة',
      icon: <Network className="w-6 h-6 text-purple-500" />,
      defaultItems: ['مجلس الإدارة', 'المدير التنفيذي', 'مدير العمليات', 'مدير التقنية'],
    },
    {
      id: 'list-bullet-cards',
      category: 'list',
      title: 'قائمة كروت ملونة (Vertical Block List)',
      desc: 'إبراز مجموعات البيانات غير المتسلسلة زمنياً في كتل أنيقة',
      icon: <Layers className="w-6 h-6 text-amber-500" />,
      defaultItems: ['الميزة الأولى: أمان تام 100%', 'الميزة الثانية: سيادة محلية كاملة', 'الميزة الثالثة: بدون اشتراكات'],
    },
    {
      id: 'relationship-venn',
      category: 'relationship',
      title: 'مخطط تقاطع وتكامل (Venn Integration)',
      desc: 'إظهار التداخل والتقارب بين مفاهيم متعددة ومجالات العمل',
      icon: <GitMerge className="w-6 h-6 text-indigo-500" />,
      defaultItems: ['التقنية والبرمجيات', 'الأمان السيادي', 'خدمات الأعمال'],
    },
    {
      id: 'pyramid-basic',
      category: 'pyramid',
      title: 'مخطط هرمي تنازلي (Basic Pyramid)',
      desc: 'عرض الأولويات والأهمية النسبية من الأساس إلى القمة',
      icon: <Triangle className="w-6 h-6 text-rose-500" />,
      defaultItems: ['القمة: الإستراتيجية العليا', 'الوسط: الإدارة التكتيكية', 'القاعدة: العمليات التشغيلية'],
    },
  ];

  const filtered =
    activeCategory === 'all'
      ? smartArtItems
      : smartArtItems.filter((item) => item.category === activeCategory);

  const currentItem = smartArtItems.find((s) => s.id === selectedType) || smartArtItems[0];

  const handleInsert = () => {
    onInsertSmartArt(currentItem.id, currentItem.title, currentItem.defaultItems);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full overflow-hidden text-right animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-[#d83b01] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Workflow className="w-5 h-5" />
            <h3 className="font-bold text-base">اختيار رسم SmartArt (SmartArt Graphics)</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 px-6 py-2.5 bg-gray-50 border-b border-gray-200 overflow-x-auto text-xs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#d83b01] text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Content Body: Two columns (Gallery + Preview details) */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-y-auto flex-1">
          {/* Gallery items */}
          <div className="md:col-span-2 grid grid-cols-2 gap-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedType(item.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition flex flex-col justify-between space-y-2 ${
                  selectedType === item.id
                    ? 'border-[#d83b01] bg-orange-50/60 ring-2 ring-orange-200 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-50 border border-gray-200">{item.icon}</div>
                  <div className="font-bold text-xs text-gray-900 leading-tight">{item.title}</div>
                </div>
                <div className="text-[10px] text-gray-500 leading-relaxed line-clamp-2">{item.desc}</div>
              </div>
            ))}
          </div>

          {/* Details & Live Preview Box */}
          <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 flex flex-col justify-between text-xs space-y-4">
            <div>
              <div className="font-bold text-sm text-gray-900 mb-1">{currentItem.title}</div>
              <p className="text-[11px] text-gray-600 leading-relaxed mb-4">{currentItem.desc}</p>

              <div className="text-[11px] font-bold text-gray-700 mb-2">عناصر المخطط المقترحة:</div>
              <div className="space-y-1.5">
                {currentItem.defaultItems.map((elem, i) => (
                  <div key={i} className="flex items-center gap-2 p-1.5 rounded bg-white border border-gray-200 text-gray-800 text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-[#d83b01] shrink-0"></span>
                    <span className="truncate">{elem}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[10px] text-gray-400 bg-white p-2 rounded border border-gray-200">
              يمكنك تعديل نصوص وألوان كل كتلة في SmartArt مباشرة من الشريحة.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-100 transition cursor-pointer"
          >
            إلغاء
          </button>
          <button
            onClick={handleInsert}
            className="px-5 py-2 bg-[#d83b01] hover:bg-[#b33000] text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>إدراج في الشريحة</span>
          </button>
        </div>
      </div>
    </div>
  );
};
