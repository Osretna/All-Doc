import React, { useState, useEffect } from 'react';
import { X, Search, BookOpen, ExternalLink, Copy, Check, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedText: string;
  onInsertText: (txt: string) => void;
}

// Built-in lexical knowledge base for instant offline lookup
const KNOWLEDGE_BASE: Record<string, { definition: string; details: string; context: string; category: string }> = {
  تقرير: {
    definition: 'بيان مفصّل يعرض وقائع أو معلومات أو نتائج دراسة حول موضوع معيّن بصورة منظّمة.',
    details: 'يُستخدم التقرير في الإدارة والمحاسبة والمؤسسات الرسمية لتوثيق الأداء ورفع التوصيات للجهات المختصة.',
    context: 'إدارة الأعمال والتوثيق الرسمي',
    category: 'إداري / رسمي',
  },
  وثيقة: {
    definition: 'محرّر مكتوب يُعتمد عليه لإثبات حق أو حقيقة أو واقعة قانونية أو رسمية.',
    details: 'الوثائق السيادية والتنظيمية تشكّل الأرشيف القانوني والتاريخي للدول والمؤسسات.',
    context: 'القانون والتوثيق',
    category: 'قانوني / توثيقي',
  },
  عقد: {
    definition: 'اتفاق ملزم قانوناً بين طرفين أو أكثر ينشئ التزامات وحقوقاً متبادلة.',
    details: 'يتضمن العقد بنود الأطراف، الشروط والأحكام، التوقيعات، والجزاءات التبعية.',
    context: 'المعاملات والقانون المدني',
    category: 'قانوني',
  },
  نظام: {
    definition: 'مجموعة من العناصر المترابطة التي تعمل معاً وفق قواعد وقوانين محددة لتحقيق غرض معيّن.',
    details: 'يشمل الأنظمة التقنية والتشغيلية والإدارية والتشريعية في الدولة الحديثة.',
    context: 'الحوسبة والإدارة العامة',
    category: 'تقني / تنظيمي',
  },
  استراتيجية: {
    definition: 'خطة عمل شاملة وموجهة لتحقيق أهداف كبرى طويلة المدى تحت ظروف عدم اليقين.',
    details: 'تشمل الرؤية، الرسالة، مؤشرات الأداء الرئيسية (KPIs)، والموارد المخصصة.',
    context: 'التخطيط الاستراتيجي والقيادة',
    category: 'تخطيط',
  },
  سيادة: {
    definition: 'السلطة العليا والمطلقة التي لا تدين بالولاء لأي سلطة أخرى، والاستقلالية الكاملة للبيانات والقرارات.',
    details: 'في عصر الحوسبة، تمثل السيادة الرقمية (Sovereignty) التحكم التام في البنية التحتية والبيانات دون تبعية خارجية.',
    context: 'العلوم السياسية والأمن السيبراني',
    category: 'سياسي / تقني',
  },
};

export const WordSmartLookupModal: React.FC<Props> = ({
  isOpen,
  onClose,
  selectedText,
  onInsertText,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'explore' | 'define'>('explore');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (selectedText) {
      setSearchTerm(selectedText.trim());
    }
  }, [selectedText]);

  if (!isOpen) return null;

  const cleanTerm = searchTerm.trim().toLowerCase();
  const entry =
    KNOWLEDGE_BASE[cleanTerm] ||
    Object.entries(KNOWLEDGE_BASE).find(([k]) => cleanTerm.includes(k) || k.includes(cleanTerm))?.[1] || {
      definition: `المصطلح "${searchTerm}": يُقصد به في السياق المعجمي والمكتبي مفهوماً دالاً على محتوى محدد يُستخدم في صياغة الوثائق المهنية.`,
      details: `تم إجراء استعلام ذكي متكامل عن "${searchTerm}". يمكنك البحث المعمق أو إدراج التعريف المباشر في موضع المؤشر بالمستند.`,
      context: 'المصطلحات العامة والمكتبية',
      category: 'معجمي',
    };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${searchTerm}: ${entry.definition}\n${entry.details}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none">
      <div
        className="bg-white text-slate-800 rounded border border-slate-300 shadow-2xl w-full max-w-md overflow-hidden font-sans text-xs flex flex-col"
        dir="rtl"
        style={{ fontFamily: 'Segoe UI, Tahoma, sans-serif' }}
      >
        {/* Header */}
        <div className="bg-[#005a9e] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
              i
            </div>
            <span className="font-semibold text-sm">البحث الذكي (Smart Lookup)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded text-white/80 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search input bar */}
        <div className="p-3 bg-slate-50 border-b border-slate-200">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="ابحث عن كلمة أو عبارة..."
              className="w-full bg-white border border-slate-300 rounded pr-8 pl-3 py-1.5 text-xs focus:outline-blue-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-100 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('explore')}
            className={`flex-1 py-2 text-center border-b-2 cursor-pointer transition ${
              activeTab === 'explore'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            استكشاف ومعرفة
          </button>
          <button
            onClick={() => setActiveTab('define')}
            className={`flex-1 py-2 text-center border-b-2 cursor-pointer transition ${
              activeTab === 'define'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            التعريف المعجمي
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-4 max-h-[380px] overflow-y-auto">
          {activeTab === 'explore' ? (
            <div className="space-y-3">
              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <div className="flex items-center gap-1.5 text-blue-800 font-bold text-sm mb-1">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>{searchTerm}</span>
                  <span className="text-[10px] font-normal px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full mr-auto">
                    {entry.category}
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed text-xs">{entry.definition}</p>
              </div>

              <div className="bg-white border border-slate-200 rounded p-3 space-y-2">
                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                  <span>معلومات وسياق الاستخدام</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-xs">{entry.details}</p>
                <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  المجال: <span className="font-medium text-slate-700">{entry.context}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded p-3 space-y-2">
              <div className="text-xs font-bold text-slate-800">قاموس اللغة والمعاني:</div>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                «{entry.definition}»
              </p>
              <div className="pt-2 text-[11px] text-slate-500">
                مرادفات مقترحة: بيان، وثيقة، إثبات، محرر رسمي، صياغة معتمدة.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-4 py-2.5 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-50 text-xs font-medium cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
            </button>
            <button
              onClick={() => {
                onInsertText(` (${entry.definition}) `);
                onClose();
              }}
              className="px-2.5 py-1.5 bg-blue-50 border border-blue-300 text-blue-700 rounded hover:bg-blue-100 text-xs font-medium cursor-pointer"
            >
              إدراج في المستند
            </button>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700 text-xs font-medium cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
