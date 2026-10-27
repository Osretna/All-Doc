import React from 'react';
import { X, Sparkles, Check, Palette, LayoutGrid } from 'lucide-react';
import { PowerPointSlideData } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentSlide: PowerPointSlideData;
  onApplyDesign: (modifiedProps: Partial<PowerPointSlideData>) => void;
}

export const DesignerDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  currentSlide,
  onApplyDesign,
}) => {
  if (!isOpen) return null;

  // 4 AI/Smart Design Ideas based on current slide content
  const designIdeas = [
    {
      id: 'idea-hero-gradient',
      title: 'بطاقة هيرو زجاجية (Glassmorphism)',
      desc: 'إطار عصري داكن مع توهج نيون وبطاقات إحصائية للمحتوى',
      props: {
        theme: 'blue' as const,
        layout: 'content' as const,
        hasCardFrame: false,
        backgroundColor: '#051329',
        textColor: '#e2e8f0',
        titleColor: '#38bdf8',
      },
      previewClasses: 'bg-gradient-to-br from-blue-950 to-slate-950 border-sky-500/30 text-sky-400',
    },
    {
      id: 'idea-split-cards',
      title: 'أعمدة كروت مقسمة (Split Cards)',
      desc: 'توزيع النقاط في مربعات مستقلة مع تأثير ثلاثي الأبعاد',
      props: {
        theme: 'emerald' as const,
        layout: 'split' as const,
        hasCardFrame: false,
        backgroundColor: '#022c22',
        textColor: '#ecfdf5',
        titleColor: '#34d399',
      },
      previewClasses: 'bg-gradient-to-br from-emerald-950 to-teal-950 border-emerald-500/30 text-emerald-400',
    },
    {
      id: 'idea-academic-framed',
      title: 'إطار فخم كلاسيكي (Editorial Frame)',
      desc: 'شريحة بإطار أرستقراطي رسمي مناسب للعروض التنفيذية والحكومية',
      props: {
        hasCardFrame: true,
        cardBg: '#ffffff',
        cardBorder: '2.5px solid #1e293b',
        fontFamily: "'Times New Roman', Georgia, serif",
      },
      previewClasses: 'bg-amber-100/40 border-stone-800 text-stone-900',
    },
    {
      id: 'idea-bold-minimal',
      title: 'عناوين عملاقة مينيمال (Bold Impact)',
      desc: 'خطوط ضخمة بألوان متباينة وخلفية أغمق للتركيز الذهني الفائق',
      props: {
        theme: 'dark' as const,
        layout: 'highlight' as const,
        backgroundColor: '#09090b',
        titleColor: '#f43f5e',
        textColor: '#f4f4f5',
      },
      previewClasses: 'bg-zinc-950 border-rose-500/40 text-rose-400',
    },
  ];

  return (
    <div className="fixed inset-y-0 left-0 w-84 bg-white border-r border-gray-300 shadow-2xl z-50 flex flex-col text-right animate-in slide-in-from-left duration-200 select-none">
      {/* Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-[#d83b01] to-[#e04f16] text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-200 animate-spin-slow" />
          <div>
            <h3 className="font-bold text-sm">أفكار التصميم (Designer)</h3>
            <span className="text-[10px] text-white/80">اقتراحات تصميمية ذكية وفورية للشريحة</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Ideas List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="text-[11px] text-gray-500 font-medium">
          اختر أحد النماذج أدناه لتطبيق التخطيط والخطوط المتناسقة تلقائياً:
        </div>

        {designIdeas.map((idea) => (
          <div
            key={idea.id}
            onClick={() => {
              onApplyDesign(idea.props);
            }}
            className="group border border-gray-200 hover:border-[#d83b01] rounded-xl p-3 bg-white hover:shadow-lg transition-all cursor-pointer space-y-2"
          >
            {/* Visual Thumbnail */}
            <div className={`aspect-video rounded-lg p-3 text-center flex flex-col justify-center border shadow-xs ${idea.previewClasses}`}>
              <div className="font-black text-xs truncate">{currentSlide.title || 'عنوان الشريحة'}</div>
              <div className="text-[9px] opacity-75 truncate mt-0.5">{currentSlide.subtitle || 'العنوان الفرعي'}</div>
              <div className="mt-2 flex justify-center gap-1">
                <span className="w-6 h-1 rounded bg-current opacity-40"></span>
                <span className="w-8 h-1 rounded bg-current opacity-60"></span>
                <span className="w-5 h-1 rounded bg-current opacity-30"></span>
              </div>
            </div>

            <div className="flex items-start justify-between pt-1">
              <div>
                <h4 className="text-xs font-bold text-gray-800 group-hover:text-[#d83b01] transition">
                  {idea.title}
                </h4>
                <p className="text-[10px] text-gray-500 leading-tight mt-0.5">{idea.desc}</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 bg-orange-50 text-[#d83b01] rounded font-bold group-hover:bg-[#d83b01] group-hover:text-white transition">
                تطبيق
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
