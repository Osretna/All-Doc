import React, { useState } from 'react';
import { 
  ArrowRight, 
  FileText, 
  FolderOpen, 
  Save, 
  Printer, 
  Download, 
  Info, 
  Settings, 
  FileSpreadsheet,
  FileCheck,
  Award,
  Sparkles
} from 'lucide-react';
import { DocumentStats, DocumentMetadata } from '../types/word';

interface BackstageViewProps {
  isOpen: boolean;
  onClose: () => void;
  metadata: DocumentMetadata;
  stats: DocumentStats;
  onNewDocument: (template: 'blank' | 'letter' | 'resume' | 'report') => void;
  onSave: () => void;
  onPrint: () => void;
  onExportWord: () => void;
  onExportPdf: () => void;
}

export const BackstageView: React.FC<BackstageViewProps> = ({
  isOpen,
  onClose,
  metadata,
  stats,
  onNewDocument,
  onSave,
  onPrint,
  onExportWord,
  onExportPdf,
}) => {
  const [activePane, setActivePane] = useState<'info' | 'new' | 'save' | 'print' | 'export'>('info');

  if (!isOpen) return null;

  const templates = [
    {
      id: 'blank' as const,
      title: 'مستند فارغ',
      subtitle: 'إنشاء مستند جديد من الصفر',
      icon: <FileText className="w-8 h-8 text-blue-600" />,
      color: 'bg-blue-50 border-blue-200 hover:border-blue-500',
    },
    {
      id: 'letter' as const,
      title: 'خطاب رسمي حكومي / إداري',
      subtitle: 'ترويسة رسمية وبيانات المرسل والمستقبل',
      icon: <FileCheck className="w-8 h-8 text-emerald-600" />,
      color: 'bg-emerald-50 border-emerald-200 hover:border-emerald-500',
    },
    {
      id: 'resume' as const,
      title: 'سيرة ذاتية احترافية (CV)',
      subtitle: 'تنسيق متناسق للخبرات والمهارات والتعليم',
      icon: <Award className="w-8 h-8 text-amber-600" />,
      color: 'bg-amber-50 border-amber-200 hover:border-amber-500',
    },
    {
      id: 'report' as const,
      title: 'تقرير مشروع وبحث أكاديمي',
      subtitle: 'صفحة غلاف، جدول محتويات، وجداول مقارنة',
      icon: <FileSpreadsheet className="w-8 h-8 text-purple-600" />,
      color: 'bg-purple-50 border-purple-200 hover:border-purple-500',
    },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex bg-[#2b579a] text-white select-none animate-in fade-in duration-150"
      dir="rtl"
    >
      {/* Backstage Left Navigation Bar */}
      <div className="w-64 bg-[#1f3f6e] flex flex-col justify-between p-3 border-l border-blue-900/50">
        <div>
          {/* Back button */}
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-3 mb-4 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold transition-all w-full text-right"
            title="الرجوع إلى المستند"
          >
            <ArrowRight className="w-5 h-5 text-white" />
            <span className="text-sm">العودة إلى المستند</span>
          </button>

          <nav className="space-y-1 text-sm font-medium">
            <button
              onClick={() => setActivePane('info')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded text-right transition-colors ${
                activePane === 'info' ? 'bg-[#2b579a] text-white font-bold' : 'text-blue-100 hover:bg-white/10'
              }`}
            >
              <Info className="w-4 h-4" />
              <span>معلومات (Info)</span>
            </button>

            <button
              onClick={() => setActivePane('new')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded text-right transition-colors ${
                activePane === 'new' ? 'bg-[#2b579a] text-white font-bold' : 'text-blue-100 hover:bg-white/10'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>جديد (New)</span>
            </button>

            <button
              onClick={() => {
                onSave();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded text-right text-blue-100 hover:bg-white/10 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>حفظ (Save)</span>
            </button>

            <button
              onClick={() => setActivePane('print')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded text-right transition-colors ${
                activePane === 'print' ? 'bg-[#2b579a] text-white font-bold' : 'text-blue-100 hover:bg-white/10'
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>طباعة (Print)</span>
            </button>

            <button
              onClick={() => setActivePane('export')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded text-right transition-colors ${
                activePane === 'export' ? 'bg-[#2b579a] text-white font-bold' : 'text-blue-100 hover:bg-white/10'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>تصدير (Export)</span>
            </button>
          </nav>
        </div>

        <div className="p-3 bg-black/20 rounded text-xs text-blue-200">
          <p className="font-semibold text-white mb-0.5">Microsoft Word 365</p>
          <p className="text-[10px]">الإصدار المتكامل للويب والمكتبي</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white text-slate-800 p-8 overflow-y-auto">
        {activePane === 'info' && (
          <div className="max-w-3xl space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-3">
              معلومات المستند (Document Info)
            </h2>

            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-4">
                <div className="p-4 border border-slate-200 rounded-lg bg-slate-50 flex items-start gap-3">
                  <div className="p-2.5 bg-blue-100 text-[#2b579a] rounded">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">{metadata.title || 'مستند 1'}</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      حفظ تلقائي مفعّل • تم الحفظ في التخزين المحلي الآمن
                    </p>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-lg p-4 space-y-2">
                  <h4 className="font-bold text-xs text-slate-700">حماية المستند (Protect Document)</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    تحكم في أنواع التغييرات التي يمكن للآخرين إجراؤها على هذا المستند.
                  </p>
                  <button 
                    onClick={() => alert('تم تفعيل وضع الحماية والمراجعة فقط')}
                    className="mt-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium border border-slate-300"
                  >
                    تقييد التحرير (Restrict Editing)
                  </button>
                </div>
              </div>

              {/* Document Properties Sidebar */}
              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/70 space-y-3 text-xs">
                <h4 className="font-bold text-slate-700 border-b border-slate-200 pb-2">خصائص (Properties)</h4>
                
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">الحجم</span>
                  <span className="font-mono font-medium">~ 34.5 KB</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">الصفحات</span>
                  <span className="font-mono font-medium">{stats.pages}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">الكلمات</span>
                  <span className="font-mono font-medium">{stats.words}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">إجمالي وقت التحرير</span>
                  <span className="font-mono font-medium">18 دقيقة</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">الكاتب</span>
                  <span className="font-medium text-[#2b579a]">{metadata.author || 'المستخدم الحالي'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">آخر تعديل</span>
                  <span className="text-slate-600 text-[11px]">{new Date().toLocaleTimeString('ar-EG')}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activePane === 'new' && (
          <div className="max-w-4xl space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-3">
              مستند جديد (New Document)
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {templates.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => {
                    onNewDocument(tpl.id);
                    onClose();
                  }}
                  className={`p-5 rounded-xl border text-right transition-all flex items-start gap-4 shadow-xs group ${tpl.color}`}
                >
                  <div className="p-3 bg-white rounded-lg shadow-xs group-hover:scale-105 transition-transform">
                    {tpl.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm group-hover:text-[#2b579a] transition-colors">
                      {tpl.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">{tpl.subtitle}</p>
                    <span className="inline-block mt-3 text-[11px] text-[#2b579a] font-bold">
                      فتح القالب الآن ⟵
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activePane === 'print' && (
          <div className="max-w-2xl space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-3">
              طباعة المستند (Print)
            </h2>
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
              <p className="text-sm text-slate-600">
                جاهز للطباعة على طابعتك المحلية أو حفظه كملف بتنسيق PDF عالي الدقة.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    onClose();
                    setTimeout(() => onPrint(), 200);
                  }}
                  className="px-6 py-2.5 bg-[#2b579a] hover:bg-[#20447c] text-white rounded-lg font-bold shadow-md transition-colors flex items-center gap-2"
                >
                  <Printer className="w-5 h-5" />
                  <span>بدء الطباعة الآن (Ctrl + P)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activePane === 'export' && (
          <div className="max-w-3xl space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-3">
              تصدير المستند (Export)
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 border border-slate-200 rounded-xl bg-slate-50 space-y-3">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <Download className="w-5 h-5 text-blue-600" />
                  <span>إنشاء مستند Word (.doc)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  تنزيل ملف متوافق كلياً مع جميع إصدارات Microsoft Word وبرامج Office.
                </p>
                <button
                  onClick={() => {
                    onExportWord();
                    onClose();
                  }}
                  className="px-4 py-2 bg-[#2b579a] hover:bg-[#20447c] text-white rounded font-medium text-xs shadow-sm"
                >
                  تنزيل بصيغة Word
                </button>
              </div>

              <div className="p-5 border border-slate-200 rounded-xl bg-slate-50 space-y-3">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <Printer className="w-5 h-5 text-rose-600" />
                  <span>إنشاء مستند PDF عالي الجودة</span>
                </h3>
                <p className="text-xs text-slate-500">
                  تصدير المستند بصيغة PDF قابلة للطباعة والنشر الإلكتروني.
                </p>
                <button
                  onClick={() => {
                    onExportPdf();
                    onClose();
                  }}
                  className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded font-medium text-xs shadow-sm"
                >
                  تصدير كـ PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
