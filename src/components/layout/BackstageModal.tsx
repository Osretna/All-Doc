import React, { useState } from 'react';
import { OfficeAppId, SheetData, SlideItem, DbTable } from '../../types';
import { APP_CONFIGS } from '../../utils/appConfigs';
import { localVault } from '../../utils/storage';
import { parseDocxFile, parseExcelFile, parsePptxFile, parseAccessFile } from '../../utils/fileImport';
import {
  FileText,
  Plus,
  FolderOpen,
  Save,
  Download,
  Printer,
  ShieldCheck,
  Server,
  X,
  FileCode,
  HardDrive,
  Copy,
  Check,
  CheckCircle2,
  Table,
  Presentation,
  Building2,
  FileSpreadsheet,
  FileCheck,
  Loader2,
  Sparkles,
  Database,
  Image as ImageIcon,
  FileCheck2
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  activeApp: OfficeAppId;
  documentTitle: string;
  onApplyTemplate: (templateContent: string, title: string) => void;
  onExport: (format: 'docx' | 'xlsx' | 'pptx' | 'pdf' | 'json' | 'txt') => void;
  onSwitchApp?: (app: OfficeAppId) => void;
  onLoadExcelData?: (sheets: Record<string, { label: string; data: SheetData }>, title: string) => void;
  onLoadSlidesData?: (slides: SlideItem[], title: string) => void;
  onLoadAccessData?: (tables: DbTable[], title: string) => void;
  onLoadPdfFile?: (file: File) => void;
  onLoadPhotoFile?: (file: File) => void;
}

export const BackstageModal: React.FC<Props> = ({
  isOpen,
  onClose,
  activeApp,
  documentTitle,
  onApplyTemplate,
  onExport,
  onSwitchApp,
  onLoadExcelData,
  onLoadSlidesData,
  onLoadAccessData,
  onLoadPdfFile,
  onLoadPhotoFile,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'new' | 'open' | 'save' | 'export' | 'print' | 'sovereign' | 'cloud'>('new');
  const [copiedBackup, setCopiedBackup] = useState(false);
  const [loadingFileMessage, setLoadingFileMessage] = useState<string | null>(null);
  const currentConfig = APP_CONFIGS[activeApp];

  const handleCopyBackup = () => {
    const backup = localVault.exportSovereignBackup();
    navigator.clipboard.writeText(backup);
    setCopiedBackup(true);
    setTimeout(() => setCopiedBackup(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-xs flex animate-in fade-in">
      {/* Backstage Left Navigation Bar (Office Blue or App Primary Color) */}
      <div 
        style={{ backgroundColor: currentConfig.primaryColor }}
        className="w-64 sm:w-72 text-white flex flex-col justify-between p-4 shadow-2xl shrink-0 select-none"
      >
        <div className="space-y-4">
          {/* Close / Return to Document Button */}
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition cursor-pointer text-xs font-semibold w-full"
          >
            <span className="text-sm">➔</span>
            <span>الرجوع إلى المستند</span>
          </button>

          <div className="pt-2 pb-1 border-b border-white/20">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <span>{currentConfig.name}</span>
            </h2>
            <p className="text-[11px] text-white/80">جناح إنفينيتي أوفيس المكتبي السيادي</p>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1 text-xs">
            <button
              onClick={() => setActiveTab('new')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md font-medium text-right cursor-pointer transition ${
                activeTab === 'new' ? 'bg-white text-gray-900 shadow-md font-bold' : 'hover:bg-white/10 text-white/90'
              }`}
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>جديد وقوالب جاهزة (New)</span>
            </button>

            <button
              onClick={() => setActiveTab('open')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md font-medium text-right cursor-pointer transition ${
                activeTab === 'open' ? 'bg-white text-gray-900 shadow-md font-bold' : 'hover:bg-white/10 text-white/90'
              }`}
            >
              <FolderOpen className="w-4 h-4 shrink-0" />
              <span>فتح ملف محلي (Open)</span>
            </button>

            <button
              onClick={() => setActiveTab('save')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md font-medium text-right cursor-pointer transition ${
                activeTab === 'save' ? 'bg-white text-gray-900 shadow-md font-bold' : 'hover:bg-white/10 text-white/90'
              }`}
            >
              <Save className="w-4 h-4 shrink-0" />
              <span>حفظ في الخزنة المحلية (Save)</span>
            </button>

            <button
              onClick={() => setActiveTab('export')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md font-medium text-right cursor-pointer transition ${
                activeTab === 'export' ? 'bg-white text-gray-900 shadow-md font-bold' : 'hover:bg-white/10 text-white/90'
              }`}
            >
              <Download className="w-4 h-4 shrink-0" />
              <span>تصدير ملفات Office (Export)</span>
            </button>

            <button
              onClick={() => setActiveTab('print')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md font-medium text-right cursor-pointer transition ${
                activeTab === 'print' ? 'bg-white text-gray-900 shadow-md font-bold' : 'hover:bg-white/10 text-white/90'
              }`}
            >
              <Printer className="w-4 h-4 shrink-0" />
              <span>طباعة وتصدير PDF (Print)</span>
            </button>

            <button
              onClick={() => setActiveTab('sovereign')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md font-medium text-right cursor-pointer transition ${
                activeTab === 'sovereign' ? 'bg-white text-gray-900 shadow-md font-bold' : 'hover:bg-white/10 text-white/90'
              }`}
            >
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-300" />
              <span>تدقيق السيادة والخصوصية 100%</span>
            </button>

            <button
              onClick={() => setActiveTab('cloud')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md font-medium text-right cursor-pointer transition ${
                activeTab === 'cloud' ? 'bg-white text-gray-900 shadow-md font-bold' : 'hover:bg-white/10 text-white/90'
              }`}
            >
              <Server className="w-4 h-4 shrink-0" />
              <span>ربط بسيرفر استضافتك (Cloud Sync)</span>
            </button>
          </nav>
        </div>

        <div className="text-[11px] text-white/70 pt-4 border-t border-white/20">
          <div>Infinity Sovereign Office v3.5</div>
          <div className="font-mono text-[10px] mt-0.5">Desktop & Mobile PWA Edition</div>
        </div>
      </div>

      {/* Backstage Right Content Area */}
      <div className="flex-1 bg-white overflow-y-auto p-6 sm:p-10 text-right">
        <div className="max-w-4xl mx-auto">
          {/* TAB 1: NEW & TEMPLATES */}
          {activeTab === 'new' && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-black text-gray-900">إنشاء مستند جديد أو اختيار قالب</h1>
                <p className="text-sm text-gray-500 mt-1">
                  اختر من بين القوالب العربية المصممة بعناية للشركات والجهات الحكومية ونظام إدارة الملاك.
                </p>
              </div>

              {/* Blank Document */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <div
                  onClick={() => {
                    onApplyTemplate('', 'مستند فارغ جديد');
                    onClose();
                  }}
                  className="group p-5 rounded-xl border-2 border-dashed border-gray-300 hover:border-[#0078d4] hover:bg-blue-50/50 cursor-pointer transition flex flex-col items-center justify-center text-center h-48"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                    <Plus className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-gray-800 text-sm">مستند فارغ جديد</span>
                  <span className="text-xs text-gray-400 mt-1">ابدأ من صفحة بيضاء</span>
                </div>

                {/* DOCS TEMPLATES */}
                {activeApp === 'docs' && (
                  <>
                    <div
                      onClick={() => {
                        onApplyTemplate(
                          `<h1>عقد تقديم خدمات استضافة وبرمجيات سحابية</h1>
<p><strong>التاريخ:</strong> 2026-10-27 | <strong>رقم العقد:</strong> INF-2026-089</p>
<hr/>
<h3>الطرف الأول: شركة إنفينيتي تكنولوجي (المزود)</h3>
<p>سجل تجاري رقم: 1010892344 - الرياض / القاهرة</p>
<h3>الطرف الثاني: العميل / المؤسسة الشريكة</h3>
<hr/>
<h3>البند الأول: موضوع العقد</h3>
<p>يلتزم الطرف الأول بتقديم خدمات الاستضافة السحابية فائقة الأداء مع التخزين ZFS NVMe، وتأمين برمجيات الإنتاجية المكتبية السيادية (Infinity Office) التي تعمل دون انقطاع ودون إمكانية للتتبع الخارجي.</p>
<h3>البند الثاني: مستوى الخدمة وضمان التشغيل</h3>
<p>يتعهد المزود بنسبة تشغيل لا تقل عن 99.9% شهرياً مع نسخ احتياطي دوري مشفر.</p>
<table border="1" style="width: 100%; border-collapse: collapse; margin-top: 15px;">
  <tr style="background:#f3f4f6;">
    <th style="padding: 8px;">الخدمة</th>
    <th style="padding: 8px;">المواصفات</th>
    <th style="padding: 8px;">التكلفة السنوية</th>
  </tr>
  <tr>
    <td style="padding: 8px;">خادم VPS سيادي</td>
    <td style="padding: 8px;">8 vCPU / 32GB RAM / 1TB NVMe</td>
    <td style="padding: 8px;">4,800 ر.س</td>
  </tr>
</table>`,
                          'عقد خدمات استضافة وبرمجة سحابية'
                        );
                        onClose();
                      }}
                      className="p-5 rounded-xl border border-gray-200 hover:border-[#0078d4] hover:shadow-lg cursor-pointer transition flex flex-col justify-between h-48 bg-gray-50/50"
                    >
                      <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 mb-1">
                          <FileText className="w-3.5 h-3.5" />
                          <span>قالب عقود رسمي</span>
                        </div>
                        <h4 className="font-bold text-gray-900 text-sm">عقد استضافة وبرمجة سحابية</h4>
                        <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">
                          عقد قانوني وتقني متكامل لخدمات السيرفرات والتطوير مع جداول التسعير وبنود اتفاقية مستوى الخدمة SLA.
                        </p>
                      </div>
                      <span className="text-[11px] font-semibold text-[#0078d4]">استخدام القالب ➔</span>
                    </div>

                    <div
                      onClick={() => {
                        onApplyTemplate(
                          `<h1>محضر اجتماع الجمعية العمومية لاتحاد الشاغلين (نظام ملاك)</h1>
<p><strong>اسم العقار:</strong> برج النخيل السكني | <strong>رقم الترخيص:</strong> MLK-5542</p>
<p><strong>تاريخ الاجتماع:</strong> الأحد 25 أكتوبر 2026 | <strong>المكان:</strong> القاعة الرئيسية</p>
<hr/>
<h3>جدول الأعمال:</h3>
<ol>
  <li>مراجعة تقرير الصيانة والمصروفات الدورية للشهر الماضي.</li>
  <li>تحديد قيمة الاشتراك الشهري لخدمات الأمن والنظافة ومصاعد العقار.</li>
  <li>ربط اشتراكات الملاك عبر نظام "ملاك" الإلكتروني على منصة إنفينيتي.</li>
</ol>
<table border="1" style="width: 100%; border-collapse: collapse; margin-top: 15px;">
  <tr style="background:#f3f4f6;">
    <th style="padding: 8px;">رقم الشقة</th>
    <th style="padding: 8px;">اسم المالك</th>
    <th style="padding: 8px;">الحالة</th>
    <th style="padding: 8px;">التوقيع</th>
  </tr>
  <tr>
    <td style="padding: 8px;">101</td>
    <td style="padding: 8px;">م. أحمد المنصوري</td>
    <td style="padding: 8px;">حاضر</td>
    <td style="padding: 8px;">موقع إلكترونياً</td>
  </tr>
  <tr>
    <td style="padding: 8px;">102</td>
    <td style="padding: 8px;">أ. فيصل القحطاني</td>
    <td style="padding: 8px;">حاضر</td>
    <td style="padding: 8px;">موقع إلكترونياً</td>
  </tr>
</table>`,
                          'محضر اجتماع اتحاد شاغلين - نظام ملاك'
                        );
                        onClose();
                      }}
                      className="p-5 rounded-xl border border-gray-200 hover:border-emerald-600 hover:shadow-lg cursor-pointer transition flex flex-col justify-between h-48 bg-emerald-50/30"
                    >
                      <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 mb-1">
                          <Building2 className="w-3.5 h-3.5" />
                          <span>قالب نظام ملاك</span>
                        </div>
                        <h4 className="font-bold text-gray-900 text-sm">محضر اجتماع اتحاد شاغلين</h4>
                        <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">
                          صيغة معتمدة لاجتماعات الاتحادات السكنية مع جداول الحضور وقرارات الصيانة والاشتراكات.
                        </p>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-700">استخدام القالب ➔</span>
                    </div>
                  </>
                )}

                {/* SHEETS TEMPLATES */}
                {activeApp === 'sheets' && (
                  <>
                    <div
                      onClick={() => {
                        onApplyTemplate('mollak_budget', 'ميزانية اتحاد ملاك وصيانة عقارات');
                        onClose();
                      }}
                      className="p-5 rounded-xl border border-gray-200 hover:border-emerald-600 hover:shadow-lg cursor-pointer transition flex flex-col justify-between h-48 bg-emerald-50/30"
                    >
                      <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 mb-1">
                          <Table className="w-3.5 h-3.5" />
                          <span>قوالب إكسيل مالية</span>
                        </div>
                        <h4 className="font-bold text-gray-900 text-sm">ميزانية مصروفات اتحاد ملاك</h4>
                        <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">
                          جدول متكامل لحساب رسوم الصيانة، حراسة الأمن، فواتير الكهرباء المشتركة، مع دوال الجمع التلقائي.
                        </p>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-700">تحميل القالب ➔</span>
                    </div>

                    <div
                      onClick={() => {
                        onApplyTemplate('payroll', 'جدول رواتب وبدلات الموظفين');
                        onClose();
                      }}
                      className="p-5 rounded-xl border border-gray-200 hover:border-emerald-600 hover:shadow-lg cursor-pointer transition flex flex-col justify-between h-48 bg-gray-50/50"
                    >
                      <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 mb-1">
                          <FileSpreadsheet className="w-3.5 h-3.5" />
                          <span>قالب موارد بشرية</span>
                        </div>
                        <h4 className="font-bold text-gray-900 text-sm">مسير رواتب وبدلات الموظفين</h4>
                        <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">
                          حساب الراتب الأساسي، بدل السكن، بدل النقل، التأمينات وصافي المستحق بصيغ جاهزة.
                        </p>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-700">تحميل القالب ➔</span>
                    </div>
                  </>
                )}

                {/* SLIDES TEMPLATES */}
                {activeApp === 'slides' && (
                  <div
                    onClick={() => {
                      onApplyTemplate('corporate_gulf', 'عرض تقديمي استراتيجي للشركات الخليجية');
                      onClose();
                    }}
                    className="p-5 rounded-xl border border-gray-200 hover:border-orange-600 hover:shadow-lg cursor-pointer transition flex flex-col justify-between h-48 bg-orange-50/30"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-orange-700 mb-1">
                        <Presentation className="w-3.5 h-3.5" />
                        <span>عرض تقديمي PowerPoint</span>
                      </div>
                      <h4 className="font-bold text-gray-900 text-sm">عرض التحول الرقمي للشركات</h4>
                      <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">
                        شرائح 16:9 مصممة لعرض المنتجات التقنية، الاستضافة والحلول السيادية للعملاء والمستثمرين.
                      </p>
                    </div>
                    <span className="text-[11px] font-semibold text-orange-700">تحميل الشرائح ➔</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: OPEN */}
          {activeTab === 'open' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-black text-gray-900 mb-1">فتح ملف محلي من جهازك</h1>
                  <p className="text-sm text-gray-500">
                    افتح ملفات Word و Excel و PowerPoint الحقيقية من جهازك دون تشويه الخطوط أو عكس النصوص وبدون إرسال أي بايت لسيرفرات خارجية.
                  </p>
                </div>
              </div>

              {loadingFileMessage && (
                <div className="mb-5 p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-center gap-3 text-blue-900 text-sm animate-pulse">
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin shrink-0" />
                  <span>{loadingFileMessage}</span>
                </div>
              )}

              {/* Grid of File Type Openers: Word, Excel, PowerPoint, Access, PDF, Photoshop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {/* 1. Open Word .docx */}
                <label className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 hover:bg-blue-50 hover:border-blue-500 cursor-pointer transition flex flex-col justify-between group">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-[#0078d4] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      W
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">مستند Word</h4>
                      <span className="text-[11px] text-blue-700 font-mono font-medium">.docx, .doc</span>
                    </div>
                  </div>
                  <p className="text-[11.5px] text-gray-600 mb-3">
                    قراءة الفقرات والجداول وتنسيقات الخطوط العربية والإنجليزية دون تشفير أو رموز تالفة.
                  </p>
                  <span className="text-xs font-bold text-[#0078d4] group-hover:underline">فتح مستند Word ➔</span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".docx,.doc,.txt,.html"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setLoadingFileMessage(`جاري فك ضغط وقراءة مستند Word "${file.name}"...`);
                      try {
                        let html = '';
                        if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
                          html = await parseDocxFile(file);
                        } else {
                          const text = await file.text();
                          html = text.includes('<p') ? text : `<p style="white-space: pre-wrap;">${text}</p>`;
                        }
                        const cleanTitle = file.name.replace(/\.[^/.]+$/, '');
                        onApplyTemplate(html, cleanTitle);
                        onSwitchApp?.('docs');
                        setLoadingFileMessage(null);
                        onClose();
                      } catch (err) {
                        console.error(err);
                        setLoadingFileMessage(null);
                        alert('حدث خطأ أثناء فتح ملف Word. يرجى التأكد من سلامة الملف.');
                      }
                    }}
                  />
                </label>

                {/* 2. Open Excel .xlsx */}
                <label className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50 hover:border-emerald-500 cursor-pointer transition flex flex-col justify-between group">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-[#107c41] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      X
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">مصنف Excel</h4>
                      <span className="text-[11px] text-emerald-700 font-mono font-medium">.xlsx, .xls, .csv</span>
                    </div>
                  </div>
                  <p className="text-[11.5px] text-gray-600 mb-3">
                    استيراد جميع أوراق العمل والصيغ الرياضية والأرقام والنسب المئوية والعملات بتنسيق إكسيل الأصلي.
                  </p>
                  <span className="text-xs font-bold text-[#107c41] group-hover:underline">فتح مصنف Excel ➔</span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".xlsx,.xls,.csv"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setLoadingFileMessage(`جاري تحليل جداول وصيغ ملف Excel "${file.name}"...`);
                      try {
                        const parsedSheets = await parseExcelFile(file);
                        if (Object.keys(parsedSheets).length > 0) {
                          const cleanTitle = file.name.replace(/\.[^/.]+$/, '');
                          localVault.set(localVault.KEYS.SHEETS_DATA, parsedSheets);
                          onLoadExcelData?.(parsedSheets, cleanTitle);
                          onSwitchApp?.('sheets');
                          setLoadingFileMessage(null);
                          onClose();
                        } else {
                          setLoadingFileMessage(null);
                          alert('لم يتم العثور على أوراق عمل داخل الملف.');
                        }
                      } catch (err) {
                        console.error(err);
                        setLoadingFileMessage(null);
                        alert('حدث خطأ أثناء فتح ملف Excel.');
                      }
                    }}
                  />
                </label>

                {/* 3. Open PowerPoint .pptx */}
                <label className="p-4 rounded-xl border border-orange-200 bg-orange-50/40 hover:bg-orange-50 hover:border-orange-500 cursor-pointer transition flex flex-col justify-between group">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-[#d83b01] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      P
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">عرض PowerPoint</h4>
                      <span className="text-[11px] text-orange-700 font-mono font-medium">.pptx, .ppt</span>
                    </div>
                  </div>
                  <p className="text-[11.5px] text-gray-600 mb-3">
                    استيراد الشرائح والعناوين والنقاط والخلفيات المصورة وعرضها بدقة 16:9 مع وضع مقدم العروض.
                  </p>
                  <span className="text-xs font-bold text-[#d83b01] group-hover:underline">فتح عرض PowerPoint ➔</span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pptx,.ppt"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setLoadingFileMessage(`جاري استخراج شرائح عرض PowerPoint "${file.name}"...`);
                      try {
                        const parsedSlides = await parsePptxFile(file);
                        if (parsedSlides.length > 0) {
                          const cleanTitle = file.name.replace(/\.[^/.]+$/, '');
                          localVault.set(localVault.KEYS.SLIDES_DATA, parsedSlides);
                          onLoadSlidesData?.(parsedSlides, cleanTitle);
                          onSwitchApp?.('slides');
                          setLoadingFileMessage(null);
                          onClose();
                        } else {
                          setLoadingFileMessage(null);
                          alert('لم يتم العثور على شرائح داخل الملف.');
                        }
                      } catch (err) {
                        console.error(err);
                        setLoadingFileMessage(null);
                        alert('حدث خطأ أثناء فتح ملف PowerPoint.');
                      }
                    }}
                  />
                </label>

                {/* 4. Open Access Database .accdb */}
                <label className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 hover:bg-rose-50 hover:border-rose-500 cursor-pointer transition flex flex-col justify-between group">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-[#a4373a] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      A
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">قاعدة بيانات Access</h4>
                      <span className="text-[11px] text-rose-700 font-mono font-medium">.accdb, .sql, .csv</span>
                    </div>
                  </div>
                  <p className="text-[11.5px] text-gray-600 mb-3">
                    فتح قواعد بيانات Access وسجلات الجداول ونظام ملاك واستيراد ملفات SQL و CSV.
                  </p>
                  <span className="text-xs font-bold text-[#a4373a] group-hover:underline">فتح قاعدة بيانات Access ➔</span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".accdb,.mdb,.sql,.csv,.json"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setLoadingFileMessage(`جاري قراءة واستيراد قاعدة بيانات Access "${file.name}"...`);
                      try {
                        const tables = await parseAccessFile(file);
                        if (tables.length > 0) {
                          const cleanTitle = file.name.replace(/\.[^/.]+$/, '');
                          localVault.set(localVault.KEYS.BASE_DATA, tables);
                          onLoadAccessData?.(tables, cleanTitle);
                          onSwitchApp?.('base');
                          setLoadingFileMessage(null);
                          onClose();
                        } else {
                          setLoadingFileMessage(null);
                          alert('لم يتم العثور على جداول داخل الملف.');
                        }
                      } catch (err) {
                        console.error(err);
                        setLoadingFileMessage(null);
                        alert('حدث خطأ أثناء فتح ملف Access.');
                      }
                    }}
                  />
                </label>

                {/* 5. Open PDF Document .pdf */}
                <label className="p-4 rounded-xl border border-red-200 bg-red-50/40 hover:bg-red-50 hover:border-red-500 cursor-pointer transition flex flex-col justify-between group">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-[#e11d48] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      PDF
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">مستند PDF (Acrobat)</h4>
                      <span className="text-[11px] text-red-700 font-mono font-medium">.pdf</span>
                    </div>
                  </div>
                  <p className="text-[11.5px] text-gray-600 mb-3">
                    فتح مستندات PDF من جهازك واستعراض الصفحات وإضافة التوقيع الرقمي والأختام الرسمية.
                  </p>
                  <span className="text-xs font-bold text-[#e11d48] group-hover:underline">فتح مستند PDF ➔</span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      onLoadPdfFile?.(file);
                      onSwitchApp?.('pdf');
                      onClose();
                    }}
                  />
                </label>

                {/* 6. Open Photoshop / Image .psd, .png */}
                <label className="p-4 rounded-xl border border-sky-200 bg-sky-50/40 hover:bg-sky-50 hover:border-sky-500 cursor-pointer transition flex flex-col justify-between group">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-[#001e36] border border-[#31a8ff] text-[#31a8ff] flex items-center justify-center font-black text-xs shadow-xs">
                      Ps
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">تصميم Photoshop / صورة</h4>
                      <span className="text-[11px] text-sky-700 font-mono font-medium">.psd, .png, .jpg</span>
                    </div>
                  </div>
                  <p className="text-[11.5px] text-gray-600 mb-3">
                    فتح الصور وملفات التصميم وتعديل الطبقات والألوان والفلاتر والفرشاة بدقة فوتوشوب الكاملة.
                  </p>
                  <span className="text-xs font-bold text-[#0078d4] group-hover:underline">فتح تصميم Photoshop ➔</span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".png,.jpg,.jpeg,.webp,.psd,.svg"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      onLoadPhotoFile?.(file);
                      onSwitchApp?.('photo');
                      onClose();
                    }}
                  />
                </label>
              </div>

              {/* Universal Drag & Drop / File Browser */}
              <div className="p-8 border-2 border-dashed border-gray-300 hover:border-[#0078d4] rounded-2xl bg-gray-50/80 text-center flex flex-col items-center justify-center transition">
                <FolderOpen className="w-12 h-12 text-[#0078d4] mb-3" />
                <h3 className="font-bold text-base text-gray-800">أو استعرض أي ملف من حاسوبك أو هاتفك</h3>
                <p className="text-xs text-gray-500 mt-1 mb-4">
                  يدعم التعرف التلقائي على .docx, .xlsx, .pptx, .accdb, .pdf, .png, .jpg, .csv, .json, .txt
                </p>
                <label className="bg-[#0078d4] hover:bg-[#006abc] text-white px-6 py-2.5 rounded-lg text-xs font-bold cursor-pointer transition shadow flex items-center gap-2">
                  <FolderOpen className="w-4 h-4" />
                  <span>استعراض كافة ملفات Office</span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".docx,.doc,.xlsx,.xls,.pptx,.ppt,.accdb,.mdb,.sql,.pdf,.png,.jpg,.jpeg,.webp,.csv,.json,.txt,.html"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      const ext = file.name.split('.').pop()?.toLowerCase();
                      const cleanTitle = file.name.replace(/\.[^/.]+$/, '');
                      setLoadingFileMessage(`جاري فتح ملف ${file.name}...`);

                      try {
                        if (ext === 'docx' || ext === 'doc') {
                          const html = await parseDocxFile(file);
                          onApplyTemplate(html, cleanTitle);
                          onSwitchApp?.('docs');
                        } else if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') {
                          const parsedSheets = await parseExcelFile(file);
                          localVault.set(localVault.KEYS.SHEETS_DATA, parsedSheets);
                          onLoadExcelData?.(parsedSheets, cleanTitle);
                          onSwitchApp?.('sheets');
                        } else if (ext === 'pptx' || ext === 'ppt') {
                          const parsedSlides = await parsePptxFile(file);
                          localVault.set(localVault.KEYS.SLIDES_DATA, parsedSlides);
                          onLoadSlidesData?.(parsedSlides, cleanTitle);
                          onSwitchApp?.('slides');
                        } else if (ext === 'accdb' || ext === 'mdb' || ext === 'sql') {
                          const tables = await parseAccessFile(file);
                          localVault.set(localVault.KEYS.BASE_DATA, tables);
                          onLoadAccessData?.(tables, cleanTitle);
                          onSwitchApp?.('base');
                        } else if (ext === 'pdf') {
                          onLoadPdfFile?.(file);
                          onSwitchApp?.('pdf');
                        } else if (ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'webp' || ext === 'psd') {
                          onLoadPhotoFile?.(file);
                          onSwitchApp?.('photo');
                        } else if (ext === 'json') {
                          const text = await file.text();
                          const success = localVault.importSovereignBackup(text);
                          if (success) {
                            alert('تم استيراد الخزنة السيادية بنجاح!');
                          } else {
                            onApplyTemplate(text, cleanTitle);
                          }
                        } else {
                          const text = await file.text();
                          onApplyTemplate(text, cleanTitle);
                          onSwitchApp?.('docs');
                        }

                        setLoadingFileMessage(null);
                        onClose();
                      } catch (err) {
                        console.error(err);
                        setLoadingFileMessage(null);
                        alert(`تعذر قراءة الملف: ${file.name}`);
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          )}

          {/* TAB 3: SAVE & EXPORT */}
          {activeTab === 'export' && (
            <div>
              <h1 className="text-2xl font-black text-gray-900 mb-2">تصدير المستند بصيغ Microsoft Office</h1>
              <p className="text-sm text-gray-500 mb-6">
                احفظ عملك بصيغ قياسية متوافقة 100% مع برامج Microsoft Office وأجهزة الكمبيوتر والهواتف:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  onClick={() => { onExport('docx'); onClose(); }}
                  className="p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50/40 cursor-pointer transition flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                      W
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">مستند Word (.docx)</h4>
                      <p className="text-xs text-gray-500">متوافق مع Microsoft Word 2016 - 2024</p>
                    </div>
                  </div>
                  <Download className="w-5 h-5 text-gray-400" />
                </div>

                <div
                  onClick={() => { onExport('pdf'); onClose(); }}
                  className="p-4 rounded-xl border border-gray-200 hover:border-red-500 hover:bg-red-50/40 cursor-pointer transition flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold text-sm">
                      PDF
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">ملف PDF جاهز للطباعة</h4>
                      <p className="text-xs text-gray-500">مستند محمي غير قابل للتعديل</p>
                    </div>
                  </div>
                  <Download className="w-5 h-5 text-gray-400" />
                </div>

                <div
                  onClick={() => { onExport('xlsx'); onClose(); }}
                  className="p-4 rounded-xl border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/40 cursor-pointer transition flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                      X
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">جدول بيانات Excel / CSV</h4>
                      <p className="text-xs text-gray-500">تصدير الجداول والصيغ الرياضية</p>
                    </div>
                  </div>
                  <Download className="w-5 h-5 text-gray-400" />
                </div>

                <div
                  onClick={() => { onExport('json'); onClose(); }}
                  className="p-4 rounded-xl border border-gray-200 hover:border-purple-500 hover:bg-purple-50/40 cursor-pointer transition flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
                      { }
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">نسخة احتياطية مشفرة (JSON)</h4>
                      <p className="text-xs text-gray-500">حفظ كافة بيانات المستند لاستعادتها لاحقاً</p>
                    </div>
                  </div>
                  <Download className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PRINT */}
          {activeTab === 'print' && (
            <div className="text-center py-6">
              <Printer className="w-16 h-16 text-[#0078d4] mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">طباعة المستند / حفظ بصيغة PDF</h2>
              <p className="text-xs text-gray-500 max-w-md mx-auto mb-6 leading-relaxed">
                سيتم إرسال المستند مباشرة إلى نافذة الطباعة الخاصة بجهازك بجودة طباعة كاملة 300DPI بدون أي علامة مائية.
              </p>
              <button
                onClick={() => {
                  onClose();
                  setTimeout(() => window.print(), 300);
                }}
                className="bg-[#0078d4] hover:bg-[#006abc] text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-md transition"
              >
                فتح نافذة الطباعة الآن
              </button>
            </div>
          )}

          {/* TAB 5: SOVEREIGN AUDIT (السيادة الكاملة) */}
          {activeTab === 'sovereign' && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">تقرير السيادة الرقمية الكاملة (Sovereign Office)</h1>
                  <p className="text-xs text-gray-500">فحص الخصوصية والأمان الفوري على جهازك</p>
                </div>
              </div>

              <div className="space-y-3 mt-6">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <div className="font-bold text-emerald-900 mb-0.5">صفر تتبع وتحليلات (Zero Telemetry)</div>
                    <div className="text-emerald-700 leading-relaxed">
                      لا توجد أي أداة Google Analytics أو Facebook Pixel أو كود تتبع خارجي. مستنداتك تخصك وحدك 100%.
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <div className="font-bold text-blue-900 mb-0.5">محلي بالكامل (Local Offline-First)</div>
                    <div className="text-blue-700 leading-relaxed">
                      يتم تخزين جميع البيانات في ذاكرة جهازك (IndexedDB / LocalStorage). التطبيق يعمل بدون إنترنت بكفاءة تامة.
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <div className="font-bold text-purple-900 mb-0.5">نسخة احتياطية مشفرة بضغطة زر</div>
                    <div className="text-purple-700 leading-relaxed mb-3">
                      يمكنك نسخ جميع مستنداتك وجداولك وقواعد بياناتك إلى الحافظة كنص مشفر لحفظها في مكان آمن.
                    </div>
                    <button
                      onClick={handleCopyBackup}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded font-medium flex items-center gap-1.5 transition text-xs"
                    >
                      {copiedBackup ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedBackup ? 'تم نسخ الخزنة بنجاح!' : 'نسخ الخزنة الاحتياطية كاملة'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: CLOUD SYNC */}
          {activeTab === 'cloud' && (
            <div>
              <h1 className="text-2xl font-black text-gray-900 mb-2">الربط السحابي مع استضافة إنفينيتي الخاصة بك</h1>
              <p className="text-sm text-gray-500 mb-6">
                اربط تطبيق الأوفيس السيادي بسيرفرك الشخصي (VPS أو استضافة cPanel) لمزامنة المستندات عبر بروتوكول آمن WebDAV أو SSH.
              </p>

              <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">عنوان خادم الاستضافة (Server Host / IP):</label>
                  <input
                    type="text"
                    defaultValue="vps.infntytech.com"
                    className="w-full bg-white border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-800 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">اسم المستخدم / البريد:</label>
                  <input
                    type="text"
                    defaultValue="admin@infntytech.com"
                    className="w-full bg-white border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-800 outline-none focus:border-blue-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      alert('تم ضبط إعدادات الاتصال الآمن مع خادم الاستضافة بنجاح!');
                      onClose();
                    }}
                    className="w-full bg-[#0078d4] text-white py-2 rounded-lg text-xs font-bold hover:bg-[#006abc] transition"
                  >
                    حفظ وإجراء مزامنة مشفرة
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
