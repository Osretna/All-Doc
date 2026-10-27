import React from 'react';
import { X, UploadCloud, Printer, Save, CheckCircle2, ShieldAlert } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 no-print" dir="rtl">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
              ✓
            </div>
            <h3 className="font-extrabold text-lg text-slate-800">
              دليل ميزات حزمة أوفيس المتكاملة (Office Suite Pro)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-sm text-slate-700 leading-relaxed">
          {/* Feature 1: Professional Upload */}
          <div className="flex gap-4 items-start bg-blue-50/60 p-4 rounded-xl border border-blue-100">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base mb-1">
                1. رفع واستيراد الملفات باحترافية كاملة لكافة التطبيقات:
              </h4>
              <p className="text-slate-600 text-xs sm:text-sm">
                تم تفعيل معالجات خاصة تقرأ محتويات الملفات بدقة:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-xs text-slate-700">
                <li><strong>Word:</strong> يدعم ملفات <code className="bg-white px-1 rounded text-blue-600 font-mono">.docx</code> و <code className="bg-white px-1 rounded text-blue-600 font-mono">.txt</code> مع استخراج التنسيقات والجداول والصور.</li>
                <li><strong>Excel:</strong> يدعم ملفات <code className="bg-white px-1 rounded text-emerald-600 font-mono">.xlsx</code> و <code className="bg-white px-1 rounded text-emerald-600 font-mono">.csv</code> مع قراءة كافة أوراق العمل والمعادلات الرياضية.</li>
                <li><strong>PowerPoint:</strong> يدعم ملفات <code className="bg-white px-1 rounded text-orange-600 font-mono">.pptx</code> مع استخراج الشرائح والعناوين والنقاط وعرضها بملء الشاشة.</li>
                <li><strong>Access:</strong> يدعم قواعد بيانات <code className="bg-white px-1 rounded text-red-900 font-mono">.accdb</code> و <code className="bg-white px-1 rounded text-red-900 font-mono">.mdb</code> و <code className="bg-white px-1 rounded text-red-900 font-mono">.sql</code> مع الجداول والعلاقات واستعلامات SQL.</li>
                <li><strong>PDF:</strong> يدعم ملفات <code className="bg-white px-1 rounded text-red-600 font-mono">.pdf</code> مع التكبير والتصغير وتطبيق الأختام المعتمدة.</li>
              </ul>
            </div>
          </div>

          {/* Feature 2: Print isolated content */}
          <div className="flex gap-4 items-start bg-emerald-50/60 p-4 rounded-xl border border-emerald-100">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base mb-1">
                2. طباعة المحتوى فقط (عزل تام لواجهة التطبيق):
              </h4>
              <p className="text-slate-600 text-xs sm:text-sm">
                عند النقر على زر <strong>"طباعة المحتوى فقط"</strong> في أي تطبيق، يقوم النظام بعزل وثيقتك وإرسال صفحات المستند/الجدول/الشرائح فقط إلى الطابعة، دون طباعة أشرطة الأدوات، الأزرار، القوائم الجانبية، أو عنوان المتصفح.
              </p>
            </div>
          </div>

          {/* Feature 3: Direct Save with Original Extension */}
          <div className="flex gap-4 items-start bg-amber-50/60 p-4 rounded-xl border border-amber-100">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0">
              <Save className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base mb-1">
                3. الحفظ المباشر على الجهاز في أي مسار وبالامتداد الأصلي:
              </h4>
              <p className="text-slate-600 text-xs sm:text-sm">
                تم دمج واجهة <strong>File System Access</strong> التي تفتح نافذة نظام التشغيل لحفظ الملف وتتيح لك اختيار المجلد المناسب لك (سطح المكتب، التنزيلات، المستندات، القرص D)، مع التثبيت الصارم للامتداد الأصلي الأول:
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="bg-white px-2 py-1 rounded border border-blue-200 text-blue-700 text-xs font-mono font-bold">.docx للوورد</span>
                <span className="bg-white px-2 py-1 rounded border border-emerald-200 text-emerald-700 text-xs font-mono font-bold">.xlsx للإكسل</span>
                <span className="bg-white px-2 py-1 rounded border border-orange-200 text-orange-700 text-xs font-mono font-bold">.pptx للباوربوينت</span>
                <span className="bg-white px-2 py-1 rounded border border-red-200 text-red-900 text-xs font-mono font-bold">.accdb للأكسس</span>
                <span className="bg-white px-2 py-1 rounded border border-red-200 text-red-700 text-xs font-mono font-bold">.pdf للبي دي إف</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-colors cursor-pointer"
          >
            فهمت، إغلاق الدليل
          </button>
        </div>
      </div>
    </div>
  );
};
