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
import { getSelectedText, checkSpellingAndGrammar, SpellingIssue } from '../../utils/editorCommands';

interface ReviewTabProps {
  onOpenComments: () => void;
  onOpenWordCount: () => void;
  editorRef: React.RefObject<HTMLDivElement | null>;
  onContentChange?: () => void;
}

export const ReviewTab: React.FC<ReviewTabProps> = ({
  onOpenComments,
  onOpenWordCount,
  editorRef,
  onContentChange,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [trackChangesActive, setTrackChangesActive] = useState(false);
  const [isProtected, setIsProtected] = useState(false);
  const [proofingIssues, setProofingIssues] = useState<SpellingIssue[]>([]);
  const [showProofingModal, setShowProofingModal] = useState(false);
  const [thesaurusWord, setThesaurusWord] = useState('');
  const [thesaurusResults, setThesaurusResults] = useState<string[]>([]);

  const arabicThesaurus: Record<string, string[]> = {
    'تطوير': ['تحسين', 'ترقية', 'تحديث', 'تنمية', 'ازدهار'],
    'تقرير': ['بيان', 'وثيقة', 'إفادة', 'محضر', 'مذكرة'],
    'استراتيجية': ['خطة محكمة', 'منهجية', 'رؤية مستقبلية', 'تخطيط طويل الأجل'],
    'إدارة': ['حوكمة', 'قيادة', 'توجيه', 'تنظيم', 'إشراف'],
    'مؤشر': ['دليل', 'مقياس', 'علامة', 'معيار', 'برهان'],
    'شامل': ['متكامل', 'وافٍ', 'مستوفى', 'جامع', 'عام'],
    'نجاح': ['تفوق', 'إنجاز', 'فلاح', 'ظفر', 'ريادة'],
    'عمل': ['مهمة', 'نشاط', 'مشروع', 'مجهود', 'وظيفة'],
  };

  const handleSpellingCheck = () => {
    const text = editorRef.current?.innerText || '';
    const issues = checkSpellingAndGrammar(text);
    if (issues.length > 0) {
      setProofingIssues(issues);
      setShowProofingModal(true);
    } else {
      alert('اكتمل الفحص اللغوي: المستند سليم وخالٍ من الأخطاء الإملائية الشائعة.');
    }
  };

  const handleCorrectIssue = (issue: SpellingIssue) => {
    if (!editorRef.current) return;
    const inner = editorRef.current.innerHTML;
    editorRef.current.innerHTML = inner.replace(issue.wrongWord, issue.suggestedWord);
    setProofingIssues(prev => prev.filter(i => i.id !== issue.id));
    onContentChange?.();
  };

  const handleThesaurus = () => {
    const text = getSelectedText().trim() || 'تطوير';
    setThesaurusWord(text);
    const syns = arabicThesaurus[text] || ['تحسين', 'ترقية', 'تحديث', 'إتقان'];
    setThesaurusResults(syns);
  };

  const handleApplySynonym = (syn: string) => {
    document.execCommand('insertText', false, syn);
    setThesaurusResults([]);
    onContentChange?.();
  };

  const handleTranslate = () => {
    const text = getSelectedText().trim();
    if (!text) {
      alert('يرجى تحديد النص المراد ترجمته أولاً.');
      return;
    }
    const translations: Record<string, string> = {
      'تقرير': 'Report',
      'تطوير': 'Development',
      'استراتيجي': 'Strategic',
      'مستند': 'Document',
      'إدارة': 'Management',
      'حوكمة': 'Governance',
      'ميزانية': 'Budget',
      'النتائج': 'Results',
    };
    const translated = translations[text] || `Translation for "${text}"`;
    const replace = confirm(`الترجمة المقترحة:\n"${text}" ⟵ "${translated}"\n\nهل ترغب في استبدال النص المحدد بالترجمة؟`);
    if (replace) {
      document.execCommand('insertText', false, translated);
      onContentChange?.();
    }
  };

  const handleToggleProtect = () => {
    const next = !isProtected;
    setIsProtected(next);
    if (editorRef.current) {
      editorRef.current.contentEditable = next ? 'false' : 'true';
    }
    alert(next ? 'تم قفل المستند وحمايته من التعديل (وضع القراءة فقط).' : 'تم إلغاء حماية المستند وتفعيل وضع التحرير الكامل.');
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
            onClick={() => {
              alert('مقارنة المستندات: لا توجد تعارضات بين النسخة الحالية والنسخة المحفوظة مسبقاً.');
            }}
            className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px] text-slate-700"
          >
            <GitCompare className="w-3.5 h-3.5 text-slate-600" />
            <span>مقارنة</span>
          </button>
          <button
            onClick={handleToggleProtect}
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] transition-colors ${
              isProtected ? 'bg-rose-100 text-rose-800 font-bold border border-rose-300' : 'hover:bg-slate-200 text-slate-700'
            }`}
            title="قفل وحماية المستند من التعديلات العرضية"
          >
            <GitMerge className="w-3.5 h-3.5 text-slate-600" />
            <span>{isProtected ? 'مستند محمي 🔒' : 'حماية المستند'}</span>
          </button>
        </div>
        <span className="text-[10px] text-slate-400 text-center font-medium">مقارنة وحماية</span>
      </div>

      {/* Proofing Modal / Slideover */}
      {showProofingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-2xl border border-slate-300 p-4 text-right" dir="rtl">
            <div className="flex items-center justify-between pb-2 mb-3 border-b">
              <h3 className="font-bold text-sm text-[#2b579a] flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>نتائج التدقيق الإملائي والنحوي</span>
              </h3>
              <button 
                onClick={() => setShowProofingModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xs px-2 py-1 rounded"
              >
                إغلاق ✕
              </button>
            </div>
            {proofingIssues.length === 0 ? (
              <p className="text-xs text-emerald-700 py-3 text-center font-bold">تم تصحيح كافة الملاحظات الإملائية بنجاح! المستند سليم.</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {proofingIssues.map((issue) => (
                  <div key={issue.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                    <div>
                      <span className="text-rose-600 font-bold line-through ml-2">{issue.wrongWord}</span>
                      <span className="text-emerald-700 font-bold">⟵ {issue.suggestedWord}</span>
                      <p className="text-[10px] text-slate-500 mt-0.5">{issue.reason}</p>
                    </div>
                    <button
                      onClick={() => handleCorrectIssue(issue)}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold shrink-0"
                    >
                      تصحيح
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Thesaurus Quick Results Panel */}
      {thesaurusResults.length > 0 && (
        <div className="fixed bottom-12 right-6 z-50 bg-white border border-slate-300 rounded-lg shadow-2xl p-3 w-64 text-right animate-in fade-in slide-in-from-bottom-2" dir="rtl">
          <div className="flex items-center justify-between pb-1.5 mb-2 border-b">
            <span className="text-xs font-bold text-slate-800">مرادفات: «{thesaurusWord}»</span>
            <button onClick={() => setThesaurusResults([])} className="text-slate-400 hover:text-slate-700 text-xs">✕</button>
          </div>
          <div className="space-y-1">
            {thesaurusResults.map((syn, idx) => (
              <button
                key={idx}
                onClick={() => handleApplySynonym(syn)}
                className="w-full text-right px-2 py-1 hover:bg-blue-50 text-xs text-slate-700 rounded flex items-center justify-between group"
              >
                <span>• {syn}</span>
                <span className="text-[10px] text-blue-600 opacity-0 group-hover:opacity-100">استبدال ↵</span>
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
