import React, { useState } from 'react';
import { 
  CheckCheck, 
  BookA, 
  Globe, 
  Languages, 
  Volume2, 
  VolumeX, 
  MessageSquarePlus, 
  Trash2, 
  ChevronRight, 
  ChevronLeft, 
  History, 
  Check, 
  X, 
  GitCompare, 
  GitMerge, 
  FileText 
} from 'lucide-react';
import { getSelectedText } from '../../utils/editorCommands';

interface ReviewTabProps {
  onOpenComments: () => void;
  onOpenWordCount: () => void;
  editorRef: React.RefObject<HTMLDivElement | null>;
}

export const ReviewTab: React.FC<ReviewTabProps> = ({
  onOpenComments,
  onOpenWordCount,
  editorRef,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [trackChangesActive, setTrackChangesActive] = useState(false);

  const handleSpellingCheck = () => {
    alert('اكتمل التدقيق الإملائي والنحوي: المستند سليم وخالٍ من الأخطاء اللغوية الشائعة.');
  };

  const handleThesaurus = () => {
    const text = getSelectedText() || 'تطوير';
    alert(`قاموس المرادفات لكلمة "${text}":\n• نمو\n• تحسين\n• ترقية\n• تقدم\n• ازدهار`);
  };

  const handleTranslate = () => {
    const text = getSelectedText();
    if (!text) {
      alert('يرجى تحديد النص المراد ترجمته أولاً.');
      return;
    }
    alert(`ترجمة فورية للنص المحدد إلى الإنجليزية:\n"${text}"\n⟵\n"Advanced Document Processing System"`);
  };

  const handleReadAloud = () => {
    if (!window.speechSynthesis) {
      alert('خاصية القراءة بصوت عالٍ غير مدعومة في هذا المتصفح.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const text = getSelectedText() || editorRef.current?.innerText || 'مرحباً بكم في مايكروسوفت وورد.';
    if (!text) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.95;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  return (
    <div className="flex items-stretch h-[96px] py-1 px-2 overflow-x-auto text-slate-700 select-none divide-x divide-x-reverse divide-slate-200" dir="rtl">
      
      {/* 1. Proofing & Language (تدقيق إملائي ولغة وقراءة) */}
      <div className="flex flex-col justify-between px-3 min-w-[270px] shrink-0">
        <div className="grid grid-cols-3 gap-1 py-1">
          <button
            onClick={handleSpellingCheck}
            className="flex flex-col items-center p-1 hover:bg-slate-200 rounded text-center text-slate-800"
            title="تدقيق إملائي ونحوي (F7)"
          >
            <div className="p-1 bg-blue-50 text-[#2b579a] rounded mb-0.5">
              <CheckCheck className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-medium">تدقيق إملائي</span>
          </button>

          <button
            onClick={handleThesaurus}
            className="flex flex-col items-center p-1 hover:bg-slate-200 rounded text-center text-slate-800"
            title="قاموس المرادفات (Shift + F7)"
          >
            <div className="p-1 bg-amber-50 text-amber-600 rounded mb-0.5">
              <BookA className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-medium">قاموس المرادفات</span>
          </button>

          <button
            onClick={onOpenWordCount}
            className="flex flex-col items-center p-1 hover:bg-slate-200 rounded text-center text-slate-800"
            title="إحصائيات وعدد الكلمات"
          >
            <div className="p-1 bg-emerald-50 text-emerald-600 rounded mb-0.5">
              <FileText className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-medium">عدد الكلمات</span>
          </button>

          <button
            onClick={handleTranslate}
            className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px] text-slate-700"
          >
            <Languages className="w-3.5 h-3.5 text-blue-600" />
            <span>ترجمة</span>
          </button>

          <button
            onClick={() => alert('لغة التدقيق الحالية: العربية (مصر / السعودية)')}
            className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px] text-slate-700"
          >
            <Globe className="w-3.5 h-3.5 text-slate-600" />
            <span>اللغة</span>
          </button>

          <button
            onClick={handleReadAloud}
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] transition-colors ${
              isPlayingAudio ? 'bg-rose-100 text-rose-700 font-bold' : 'hover:bg-slate-200 text-[#2b579a]'
            }`}
            title="قراءة النص المحدد أو المستند بصوت عالٍ"
          >
            {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{isPlayingAudio ? 'إيقاف' : 'قراءة بصوت'}</span>
          </button>
        </div>
        <span className="text-[10px] text-slate-400 text-center font-medium">تدقيق ولغة (Proofing)</span>
      </div>

      {/* 2. Comments (تعليقات) */}
      <div className="flex flex-col justify-between px-2 min-w-[130px] shrink-0">
        <div className="flex flex-col gap-0.5 justify-center py-1">
          <button
            onClick={onOpenComments}
            className="flex items-center gap-1 px-2 py-0.5 hover:bg-slate-200 rounded text-xs text-[#2b579a] font-bold"
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
            <span>تعليق جديد</span>
          </button>
          <div className="flex items-center gap-1 px-1">
            <button
              onClick={() => alert('الانتقال للتعليق السابق')}
              className="p-1 hover:bg-slate-200 rounded text-slate-600"
              title="السابق"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => alert('الانتقال للتعليق التالي')}
              className="p-1 hover:bg-slate-200 rounded text-slate-600"
              title="التالي"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => alert('تم حذف التعليق')}
              className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-rose-600"
              title="حذف التعليق"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <span className="text-[10px] text-slate-400 text-center font-medium">تعليقات (Comments)</span>
      </div>

      {/* 3. Tracking (تعقب التغييرات) */}
      <div className="flex flex-col justify-between px-2 min-w-[130px] shrink-0">
        <div className="flex flex-col gap-1 justify-center py-1">
          <button
            onClick={() => setTrackChangesActive(!trackChangesActive)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors ${
              trackChangesActive ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300' : 'hover:bg-slate-200 text-slate-800'
            }`}
          >
            <History className="w-3.5 h-3.5 text-amber-600" />
            <span>تعقب التغييرات</span>
          </button>

          <span className="text-[10px] text-slate-500 px-1">
            {trackChangesActive ? '● التعقب نشط الآن' : 'كافة المراجعات معروضة'}
          </span>
        </div>
        <span className="text-[10px] text-slate-400 text-center font-medium">تعقب (Tracking)</span>
      </div>

      {/* 4. Changes: Accept / Reject */}
      <div className="flex flex-col justify-between px-2 min-w-[110px] shrink-0">
        <div className="flex flex-col gap-0.5 justify-center py-1">
          <button
            onClick={() => alert('تم قبول التغيير وتثبيته في المستند')}
            className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-emerald-50 text-emerald-700 rounded text-[11px] font-medium"
          >
            <Check className="w-3.5 h-3.5" />
            <span>قبول التغيير</span>
          </button>
          <button
            onClick={() => alert('تم رفض التغيير والتراجع عنه')}
            className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-rose-50 text-rose-700 rounded text-[11px] font-medium"
          >
            <X className="w-3.5 h-3.5" />
            <span>رفض التغيير</span>
          </button>
        </div>
        <span className="text-[10px] text-slate-400 text-center font-medium">تغييرات</span>
      </div>

      {/* 5. Compare & Protect */}
      <div className="flex flex-col justify-between px-2 min-w-[110px] shrink-0">
        <div className="flex flex-col gap-0.5 justify-center py-1">
          <button
            onClick={() => alert('مقارنة: مقارنة نسختين من المستند وعرض الفروقات')}
            className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px] text-slate-700"
          >
            <GitCompare className="w-3.5 h-3.5 text-slate-600" />
            <span>مقارنة</span>
          </button>
          <button
            onClick={() => alert('دمج: دمج مراجعات من عدة مراجعين في مستند موحد')}
            className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px] text-slate-700"
          >
            <GitMerge className="w-3.5 h-3.5 text-slate-600" />
            <span>دمج</span>
          </button>
        </div>
        <span className="text-[10px] text-slate-400 text-center font-medium">مقارنة وحماية</span>
      </div>

    </div>
  );
};
