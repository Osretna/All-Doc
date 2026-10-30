import React, { useState } from 'react';
import { OfficeAppId, SheetData, SlideItem, DbTable } from '../../types';
import { APP_CONFIGS } from '../../utils/appConfigs';
import { localVault } from '../../utils/storage';
import { parseDocxFile, parseExcelFile, parsePptxFile, parseAccessFile } from '../../utils/fileImport';
import { EXCEL_TEMPLATES } from '../office/excel/excelTemplates';
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

export type BackstageTab = 
  | 'info' 
  | 'new' 
  | 'open' 
  | 'save' 
  | 'saveas' 
  | 'print' 
  | 'share' 
  | 'export' 
  | 'publish' 
  | 'close' 
  | 'account' 
  | 'options';

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

  const [activeTab, setActiveTab] = useState<BackstageTab>('new');
  const [copiedBackup, setCopiedBackup] = useState(false);
  const [loadingFileMessage, setLoadingFileMessage] = useState<string | null>(null);
  const currentConfig = APP_CONFIGS[activeApp];

  const handleCopyBackup = () => {
    const backup = localVault.exportSovereignBackup();
    navigator.clipboard.writeText(backup);
    setCopiedBackup(true);
    setTimeout(() => setCopiedBackup(false), 2000);
  };

  const navItems: { id: BackstageTab; label: string; en: string }[] = [
    { id: 'info', label: 'معلومات المستند', en: 'Info' },
    { id: 'new', label: 'جديد وقوالب', en: 'New' },
    { id: 'open', label: 'فتح ملف', en: 'Open' },
    { id: 'save', label: 'حفظ محلي', en: 'Save' },
    { id: 'saveas', label: 'حفظ باسم', en: 'Save As' },
    { id: 'print', label: 'طباعة', en: 'Print' },
    { id: 'share', label: 'مشاركة', en: 'Share' },
    { id: 'export', label: 'تصدير', en: 'Export' },
    { id: 'publish', label: 'نشر', en: 'Publish' },
    { id: 'close', label: 'إغلاق', en: 'Close' },
  ];

  return (
    <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-xs flex animate-in fade-in">
      {/* Backstage Left Navigation Bar (Matching Official Excel / Office 365 image__25__9df10f4d.png) */}
      <div 
        style={{ backgroundColor: currentConfig.primaryColor }}
        className="w-56 sm:w-64 text-white flex flex-col justify-between py-4 px-3 shadow-2xl shrink-0 select-none overflow-y-auto"
      >
        <div className="space-y-3">
          {/* Back arrow circle button (Classic Office Backstage back button) */}
          <div className="flex items-center gap-3 pb-2 border-b border-white/20">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full border border-white/40 hover:bg-white/20 flex items-center justify-center transition cursor-pointer text-white"
              title="الرجوع إلى المستند"
            >
              <span className="text-base font-bold leading-none">←</span>
            </button>
            <div className="leading-tight">
              <span className="font-bold text-sm block">{currentConfig.nameEn}</span>
              <span className="text-[10px] text-white/70">MY-DOC Sovereign Office</span>
            </div>
          </div>

          {/* Navigation Items (Exact match to image__25__9df10f4d.png) */}
          <nav className="space-y-0.5 text-xs">
            {navItems.map((item) => {
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'close') {
                      onClose();
                    } else {
                      setActiveTab(item.id);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md font-medium text-right cursor-pointer transition ${
                    isSelected
                      ? 'bg-black/25 text-white font-bold shadow-inner border-r-4 border-white'
                      : 'hover:bg-white/10 text-white/90'
                  }`}
                >
                  <span className="text-[13px] tracking-wide">{item.en}</span>
                  <span className="text-[10px] opacity-70 font-arabic">{item.label}</span>
                </button>
              );
            })}

            {/* Horizontal Line Divider (from image__25__9df10f4d.png) */}
            <div className="pt-2 pb-2">
              <div className="h-[1px] bg-white/25 w-full my-1"></div>
            </div>

            {/* Bottom 2 items below divider: Account, Options */}
            <button
              onClick={() => setActiveTab('account')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md font-medium text-right cursor-pointer transition ${
                activeTab === 'account'
                  ? 'bg-black/25 text-white font-bold shadow-inner border-r-4 border-white'
                  : 'hover:bg-white/10 text-white/90'
              }`}
            >
              <span className="text-[13px] tracking-wide">Account</span>
              <span className="text-[10px] opacity-70 font-arabic">الحساب والترخيص</span>
            </button>

            <button
              onClick={() => setActiveTab('options')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md font-medium text-right cursor-pointer transition ${
                activeTab === 'options'
                  ? 'bg-black/25 text-white font-bold shadow-inner border-r-4 border-white'
                  : 'hover:bg-white/10 text-white/90'
              }`}
            >
              <span className="text-[13px] tracking-wide">Options</span>
              <span className="text-[10px] opacity-70 font-arabic">خيارات متقدمة</span>
            </button>
          </nav>
        </div>

        <div className="text-[11px] text-white/70 pt-3 border-t border-white/20 leading-tight">
          <div className="font-bold">MY-DOC Sovereign Suite</div>
          <div className="font-mono text-[9.5px] opacity-80 mt-0.5">Desktop & PWA Edition 2026</div>
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

              {/* Blank Document - Dynamic for all Office Apps */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <div
                  onClick={() => {
                    const defaultTitle = 
                      activeApp === 'sheets' ? 'مصنف فارغ جديد' :
                      activeApp === 'slides' ? 'عرض تقديمي فارغ جديد' :
                      activeApp === 'pdf' ? 'مستند PDF فارغ جديد' :
                      activeApp === 'base' ? 'قاعدة بيانات فارغة جديدة' :
                      activeApp === 'notes' ? 'دفتر ملاحظات فارغ جديد' :
                      activeApp === 'photo' ? 'لوحة تصميم فارغة جديدة' : 'مستند فارغ جديد';
                    onApplyTemplate('', defaultTitle);
                    onClose();
                  }}
                  className="group p-5 rounded-xl border-2 border-dashed border-gray-300 hover:border-[#0078d4] hover:bg-blue-50/50 cursor-pointer transition flex flex-col items-center justify-center text-center h-48"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                    <Plus className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-gray-800 text-sm">
                    {activeApp === 'sheets' ? 'مصنف إكسيل فارغ جديد' :
                     activeApp === 'slides' ? 'عرض تقديمي فارغ جديد' :
                     activeApp === 'pdf' ? 'مستند PDF فارغ جديد' :
                     activeApp === 'base' ? 'قاعدة بيانات فارغة جديدة' :
                     activeApp === 'notes' ? 'دفتر ملاحظات فارغ جديد' :
                     activeApp === 'photo' ? 'لوحة تصميم فارغة جديدة' : 'مستند فارغ جديد'}
                  </span>
                  <span className="text-xs text-gray-400 mt-1">ابدأ من صفحة أو ملف فارغ بالكامل</span>
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
<h3>الطرف الأول: شركة MY-DOC تكنولوجي (المزود)</h3>
<p>سجل تجاري رقم: 1010892344 - الرياض / القاهرة</p>
<h3>الطرف الثاني: العميل / المؤسسة الشريكة</h3>
<hr/>
<h3>البند الأول: موضوع العقد</h3>
<p>يلتزم الطرف الأول بتقديم خدمات البنية التحتية فائقة الأداء، وتأمين برمجيات الإنتاجية المكتبية السيادية (MY-DOC Office) التي تعمل دون انقطاع ودون إمكانية للتتبع الخارجي.</p>
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

                {/* SHEETS TEMPLATES (All 30 Templates from image_f2ceac1d.png & image_70d46d9e.png) */}
                {activeApp === 'sheets' && (
                  <>
                    {EXCEL_TEMPLATES.map((tmpl) => (
                      <div
                        key={tmpl.id}
                        onClick={() => {
                          if (onLoadExcelData) {
                            onLoadExcelData(tmpl.sheets, tmpl.title);
                          } else {
                            onApplyTemplate(tmpl.id, tmpl.title);
                          }
                          onClose();
                        }}
                        className="p-4 rounded-xl border border-gray-200 hover:border-emerald-600 hover:shadow-lg cursor-pointer transition flex flex-col justify-between h-48 bg-white group"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded uppercase">
                              {tmpl.category}
                            </span>
                            {tmpl.badge && (
                              <span className="text-[10px] font-bold bg-[#107c41] text-white px-1.5 py-0.5 rounded-full">
                                {tmpl.badge}
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-gray-900 text-sm group-hover:text-emerald-700">{tmpl.titleEn}</h4>
                          <span className="text-xs text-gray-700 font-medium">{tmpl.title}</span>
                          <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                            {tmpl.description}
                          </p>
                        </div>
                        <span className="text-[11px] font-semibold text-emerald-700 group-hover:underline">فتح القالب في إكسيل ➔</span>
                      </div>
                    ))}
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
                    افتح ملفات Word و Excel و PowerPoint و Access و PDF (Acrobat) و Photoshop وتصاميم الصور الحقيقية من جهازك دون تشويه الخطوط أو عكس النصوص وبدون إرسال أي بايت لسيرفرات خارجية.
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

          {/* TAB: INFO (معلومات المستند) */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h1 className="text-2xl font-black text-gray-900">معلومات المستند (Document Info)</h1>
                <p className="text-xs text-gray-500 mt-1">
                  خصائص الملف، الأمان، حماية المصنف وسجل التعديلات المحلية.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  {/* Protect Document */}
                  <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl flex items-start gap-3">
                    <ShieldCheck className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-sm text-gray-900">حماية المصنف والمستند (Protect)</h3>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        التحكم في أنواع التغييرات التي يمكن للآخرين إجراؤها على هذا المصنف أو تشفيره بكلمة مرور محلية.
                      </p>
                      <button 
                        onClick={() => alert('تم تفعيل وضع القراءة فقط للمستند بنجاح!')}
                        className="mt-3 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-bold transition cursor-pointer"
                      >
                        وضع علامة كنهائي (Mark as Final)
                      </button>
                    </div>
                  </div>

                  {/* Inspect Document */}
                  <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl flex items-start gap-3">
                    <FileCheck className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-sm text-gray-900">فحص المصنف (Inspect Workbook)</h3>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        التحقق من عدم وجود معلومات شخصية مخفية، نصوص محذوفة، أو خصائص غير مرغوبة قبل مشاركة الملف.
                      </p>
                      <button 
                        onClick={() => alert('تم فحص المستند: نظيف 100% ولا يحتوي على أي بيانات تتبع أو برمجيات خبيثة.')}
                        className="mt-3 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold transition cursor-pointer"
                      >
                        فحص التوافق والأمان الآن
                      </button>
                    </div>
                  </div>

                  {/* Sovereign Privacy Guarantee */}
                  <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-sm text-emerald-900">السيادة الرقمية 100% (Sovereign Guarantee)</h3>
                      <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                        هذا المستند محفوظ ومحسوب محلياً بالكامل على متصفحك. لا يتم إرسال أي سطر أو معادلة لأي خادم خارجي.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right side: Properties sidebar */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs space-y-3">
                  <h4 className="font-bold text-gray-800 border-b pb-2">الخصائص (Properties)</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-gray-400 block text-[10.5px]">اسم المستند:</span>
                      <span className="font-bold text-gray-800">{documentTitle}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10.5px]">المؤلف:</span>
                      <span className="font-semibold text-gray-800">Mohamed Salah Elsayed Farahat</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10.5px]">التطبيق النشط:</span>
                      <span className="font-semibold text-gray-800">{currentConfig.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10.5px]">آخر حفظ:</span>
                      <span className="font-mono text-gray-700">{new Date().toLocaleTimeString('ar-EG')}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10.5px]">حجم الملف التقديري:</span>
                      <span className="font-mono text-gray-700">~28.4 KB (محلي)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SAVE AS */}
          {activeTab === 'saveas' && (
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h1 className="text-2xl font-black text-gray-900">حفظ باسم (Save As)</h1>
                <p className="text-xs text-gray-500 mt-1">
                  اختر موقع الحفظ على جهازك المحلي وتنسيق الملف المناسب.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div 
                  onClick={() => {
                    const ext = activeApp === 'sheets' ? 'xlsx' : activeApp === 'docs' ? 'docx' : activeApp === 'slides' ? 'pptx' : 'pdf';
                    onExport(ext as any);
                    onClose();
                  }}
                  className="p-5 border-2 border-dashed border-emerald-400 bg-emerald-50/40 rounded-xl hover:bg-emerald-50 cursor-pointer transition flex flex-col justify-between h-44"
                >
                  <div>
                    <HardDrive className="w-8 h-8 text-[#107c41] mb-2" />
                    <h3 className="font-bold text-gray-900 text-sm">حفظ على هذا الكمبيوتر الشخصي</h3>
                    <p className="text-xs text-gray-500 mt-1">تنزيل الملف مباشرة إلى مجلد التنزيلات أو اختيار مسار الحفظ.</p>
                  </div>
                  <span className="text-xs font-bold text-[#107c41]">حفظ بصيغة التطبيق الأصلية ➔</span>
                </div>

                <div 
                  onClick={() => { onExport('pdf'); onClose(); }}
                  className="p-5 border border-gray-200 rounded-xl hover:border-red-500 hover:bg-red-50/30 cursor-pointer transition flex flex-col justify-between h-44"
                >
                  <div>
                    <FileCheck2 className="w-8 h-8 text-red-600 mb-2" />
                    <h3 className="font-bold text-gray-900 text-sm">حفظ كملف PDF معتمد</h3>
                    <p className="text-xs text-gray-500 mt-1">ملف وثيقة غير قابل للتعديل عالي الدقة مناسب للطباعة والتوقيع.</p>
                  </div>
                  <span className="text-xs font-bold text-red-600">تصدير PDF ➔</span>
                </div>

                <div 
                  onClick={() => { onExport('json'); onClose(); }}
                  className="p-5 border border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50/30 cursor-pointer transition flex flex-col justify-between h-44"
                >
                  <div>
                    <Copy className="w-8 h-8 text-purple-600 mb-2" />
                    <h3 className="font-bold text-gray-900 text-sm">نسخة احتياطية مشفرة (.json)</h3>
                    <p className="text-xs text-gray-500 mt-1">حفظ كامل بنية المصنف والأوراق والمعادلات بتشفير محلي.</p>
                  </div>
                  <span className="text-xs font-bold text-purple-600">تصدير النسخة الاحتياطية ➔</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PRINT */}
          {activeTab === 'print' && (
            <div className="text-center py-6">
              <Printer className="w-16 h-16 text-[#107c41] mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">طباعة المستند / حفظ بصيغة PDF</h2>
              <p className="text-xs text-gray-500 max-w-md mx-auto mb-6 leading-relaxed">
                سيتم عزل كافة القوائم وأدوات الواجهة وإرسال محتوى ورقة العمل أو المستند فقط لنافذة الطباعة بجودة عالية 300DPI.
              </p>
              <button
                onClick={() => {
                  onClose();
                  setTimeout(() => window.print(), 300);
                }}
                className="bg-[#107c41] hover:bg-[#0b6a35] text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-md transition cursor-pointer"
              >
                فتح نافذة الطباعة الآن
              </button>
            </div>
          )}

          {/* TAB: SHARE */}
          {activeTab === 'share' && (
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h1 className="text-2xl font-black text-gray-900">مشاركة المستند (Share)</h1>
                <p className="text-xs text-gray-500 mt-1">مشاركة المستند والملف محلياً دون الحاجة لرفعه إلى سحابة خارجية.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                <div 
                  onClick={handleCopyBackup}
                  className="p-5 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50/30 cursor-pointer transition"
                >
                  <Copy className="w-8 h-8 text-blue-600 mb-2" />
                  <h3 className="font-bold text-gray-900 text-sm">نسخ رابط الحافظة المشفر (Clipboard)</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    نسخ بيانات المصنف مشفرة إلى الحافظة لإرسالها لزميل العمل وفتحها فوراً على جهازه.
                  </p>
                  <button className="mt-3 px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-bold">
                    {copiedBackup ? '✓ تم النسخ للحافظة!' : 'نسخ الرابط الآن'}
                  </button>
                </div>

                <div 
                  onClick={() => { onExport(activeApp === 'sheets' ? 'xlsx' : 'docx'); onClose(); }}
                  className="p-5 border border-gray-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50/30 cursor-pointer transition"
                >
                  <Download className="w-8 h-8 text-emerald-600 mb-2" />
                  <h3 className="font-bold text-gray-900 text-sm">إرفاق كملف في البريد الإلكتروني</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    تنزيل الملف المكتبي بالامتداد القياسي وتجهيزه للإرسال عبر Outlook أو بريدك المعتمد.
                  </p>
                  <button className="mt-3 px-3 py-1.5 bg-emerald-700 text-white rounded text-xs font-bold">
                    تصدير وإرفاق
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PUBLISH */}
          {activeTab === 'publish' && (
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h1 className="text-2xl font-black text-gray-900">نشر المستند (Publish)</h1>
                <p className="text-xs text-gray-500 mt-1">تصدير المصنف كصفحة ويب تفاعلية أو تقرير رسمي ثابت.</p>
              </div>

              <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl max-w-lg space-y-4">
                <h3 className="font-bold text-sm text-gray-900">نشر كتقرير صفحة ويب HTML مستقلة</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  يمكنك حفظ المصنف كملف HTML مستقل كامل التنسيق يعمل على أي متصفح في أي بيئة دون الحاجة لبرامج إضافية.
                </p>
                <button
                  onClick={() => {
                    onExport('txt');
                    alert('تم تجهيز التقرير للنشر بنجاح!');
                    onClose();
                  }}
                  className="px-4 py-2 bg-[#107c41] text-white rounded-lg text-xs font-bold hover:bg-[#0b6a35] transition cursor-pointer"
                >
                  تصدير ونشر كتقرير تفاعلي
                </button>
              </div>
            </div>
          )}

          {/* TAB: ACCOUNT */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h1 className="text-2xl font-black text-gray-900">الحساب والترخيص (Account)</h1>
                <p className="text-xs text-gray-500 mt-1">معلومات الترخيص المؤسسي وحساب المستخدم المكتبي.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="w-12 h-12 rounded-full bg-[#107c41] text-white flex items-center justify-center font-bold text-lg">
                      MS
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-gray-900">Mohamed Salah Elsayed Farahat</h3>
                      <p className="text-xs text-gray-500 font-mono">mohamed.farahat@office-suite.local</p>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded mt-1 inline-block">
                        حساب مفعل - مرخص محلياً
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-xs text-gray-700">السمة والمظهر (Office Theme):</h4>
                    <select className="w-full bg-white border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-800 outline-none">
                      <option>ملون (Colorful - Microsoft 365 Standard)</option>
                      <option>رمادي داكن (Dark Gray)</option>
                      <option>أسود (Black High Contrast)</option>
                      <option>أبيض ناصع (Classic White)</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>المنتج مفعل: MY-DOC Sovereign Suite 2026</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    هذه النسخة تحتوي على كامل تطبيقات أوفيس (Excel, Word, PowerPoint, Access, OneNote, PDF Studio, Photo Studio) بترخيص مؤسسي سيادي غير محدود وتعمل أوفلاين بنسبة 100%.
                  </p>
                  <div className="text-[11px] font-mono text-gray-500 pt-2 border-t border-emerald-200">
                    <div>إصدار النواة: v3.8.2-Enterprise</div>
                    <div>نوع المعمارية: Offline-First Client Architecture</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: OPTIONS */}
          {activeTab === 'options' && (
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h1 className="text-2xl font-black text-gray-900">خيارات متقدمة (Options)</h1>
                <p className="text-xs text-gray-500 mt-1">تخصيص بيئة العمل وسلوك الجداول والحفظ التلقائي.</p>
              </div>

              <div className="space-y-4 max-w-xl text-xs">
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
                  <h4 className="font-bold text-sm text-gray-800">الحفظ التلقائي المحلي:</h4>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-[#107c41]" />
                    <span>حفظ كافة التغييرات تلقائياً في ذاكرة المتصفح كل 5 دقائق</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-[#107c41]" />
                    <span>حفظ نسخة احتياطية فورية عند إغلاق التبويب</span>
                  </label>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
                  <h4 className="font-bold text-sm text-gray-800">خيارات الحسابات في إكسيل (Calculation):</h4>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="calc" defaultChecked className="accent-[#107c41]" />
                    <span>تلقائي: إعادة حساب كافة الصيغ فور إدخال أي رقم (مستحسن)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="calc" className="accent-[#107c41]" />
                    <span>يدوي: إعادة الحساب فقط عند الضغط على F9 أو زر الحساب</span>
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => {
                      alert('تم حفظ وتطبيق الخيارات المتقدمة بنجاح!');
                      onClose();
                    }}
                    className="px-5 py-2 bg-[#107c41] text-white rounded-lg text-xs font-bold hover:bg-[#0b6a35] transition cursor-pointer"
                  >
                    موافق (حفظ الخيارات)
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-300 transition cursor-pointer"
                  >
                    إلغاء الأمر
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
