import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Search,
  FolderOpen,
  Save,
  Download,
  Printer,
  Share2,
  FileCode,
  ShieldCheck,
  X,
  Check,
  CheckCircle2,
  FileCheck2,
  Table,
  BarChart2,
  TrendingUp,
  Calendar,
  DollarSign,
  Calculator,
  Layers,
  ArrowRight
} from 'lucide-react';
import { SheetData } from '../../../types';
import { EXCEL_TEMPLATES, EXCEL_SUGGESTED_CATEGORIES, ExcelTemplateDefinition } from './excelTemplates';
import * as XLSX from 'xlsx';
import { parseExcelFile } from '../../../utils/fileImport';
import { saveFileDirectlyToDevice } from '../../../utils/fileSaver';

export type ExcelBackstageTab =
  | 'home'
  | 'new'
  | 'open'
  | 'info'
  | 'save'
  | 'saveas'
  | 'history'
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
  documentTitle: string;
  onSelectTemplate: (template: ExcelTemplateDefinition) => void;
  onLoadExcelData: (sheets: Record<string, { label: string; data: SheetData }>, title: string) => void;
  onExport: (format: 'xlsx' | 'xlsm' | 'xlsb' | 'xls' | 'csv' | 'tsv' | 'ods' | 'xml' | 'html' | 'pdf') => void;
  sheetsData?: Record<string, { label: string; data: SheetData }>;
  isSaved?: boolean;
  onQuickSave?: () => void;
}

export const ExcelBackstageModal: React.FC<Props> = ({
  isOpen,
  onClose,
  documentTitle,
  onSelectTemplate,
  onLoadExcelData,
  onExport,
  sheetsData,
  isSaved = true,
  onQuickSave,
}) => {
  const [activeTab, setActiveTab] = useState<ExcelBackstageTab>('new');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loadingMsg, setLoadingMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Filter templates
  const filteredTemplates = EXCEL_TEMPLATES.filter((tmpl) => {
    const matchesSearch = searchQuery === '' || 
      tmpl.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      tmpl.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || tmpl.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const navItems: { id: ExcelBackstageTab; label: string; en: string }[] = [
    { id: 'home', label: 'الرئيسية', en: 'Home' },
    { id: 'new', label: 'جديد وقوالب', en: 'New' },
    { id: 'open', label: 'فتح مصنف', en: 'Open' },
    { id: 'info', label: 'معلومات المصنف', en: 'Info' },
    { id: 'save', label: 'حفظ محلي', en: 'Save' },
    { id: 'saveas', label: 'حفظ باسم', en: 'Save As' },
    { id: 'history', label: 'السجل', en: 'History' },
    { id: 'print', label: 'طباعة', en: 'Print' },
    { id: 'share', label: 'مشاركة', en: 'Share' },
    { id: 'export', label: 'تصدير', en: 'Export' },
    { id: 'publish', label: 'نشر', en: 'Publish' },
    { id: 'close', label: 'إغلاق', en: 'Close' },
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoadingMsg(`جاري استيراد ملف "${file.name}" بكافة التنسيقات والألوان والصيغ...`);
    try {
      const parsed = await parseExcelFile(file);
      const cleanTitle = file.name.replace(/\.[^/.]+$/, '');
      onLoadExcelData(parsed, cleanTitle);
      setLoadingMsg(null);
      onClose();
    } catch (err) {
      console.error(err);
      setLoadingMsg('حدث خطأ أثناء فك تشفير الملف، تأكد من سلامة امتداد الملف.');
      setTimeout(() => setLoadingMsg(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-[140] bg-black/60 backdrop-blur-xs flex animate-in fade-in select-none">
      {/* Left Office 365 Green Sidebar (matching image_f2ceac1d.png) */}
      <div className="w-56 sm:w-60 bg-[#107c41] text-white flex flex-col justify-between py-4 px-3 shadow-2xl shrink-0 overflow-y-auto">
        <div className="space-y-3">
          {/* Back Button (Circle with arrow) */}
          <div className="flex items-center gap-3 pb-2 border-b border-white/20">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full border border-white/40 hover:bg-white/20 flex items-center justify-center transition cursor-pointer text-white"
              title="الرجوع إلى جدول البيانات"
            >
              <span className="text-lg font-bold leading-none">←</span>
            </button>
            <div>
              <span className="font-bold text-sm block">Excel 365</span>
              <span className="text-[10px] text-white/70">MY-DOC Sovereign Office</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-0.5 text-xs">
            {navItems.map((item) => {
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'close') {
                      onClose();
                    } else if (item.id === 'save') {
                      if (onQuickSave) onQuickSave();
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
                  <span className="text-[13px] tracking-wide font-sans">{item.en}</span>
                  <span className="text-[10px] opacity-70 font-cairo">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Options */}
        <div className="pt-3 border-t border-white/20 space-y-1 text-xs">
          <button
            onClick={() => setActiveTab('account')}
            className={`w-full text-left px-3 py-1.5 rounded transition ${activeTab === 'account' ? 'bg-black/25 font-bold' : 'hover:bg-white/10'}`}
          >
            Account (الحساب)
          </button>
          <button
            onClick={() => setActiveTab('options')}
            className={`w-full text-left px-3 py-1.5 rounded transition ${activeTab === 'options' ? 'bg-black/25 font-bold' : 'hover:bg-white/10'}`}
          >
            Options (الخيارات)
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white text-gray-900 overflow-y-auto p-8 relative">
        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition cursor-pointer"
          title="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {loadingMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold text-sm flex items-center gap-3 animate-pulse">
            <span className="text-lg">⏳</span>
            <span>{loadingMsg}</span>
          </div>
        )}

        {/* TAB 1: NEW & TEMPLATES (Exact match to image_f2ceac1d.png & image_70d46d9e.png) */}
        {(activeTab === 'new' || activeTab === 'home') && (
          <div>
            <div className="mb-6">
              <h1 className="text-3xl font-light text-gray-800 tracking-tight mb-2">New</h1>
            </div>

            {/* Top Featured Row: Blank workbook + Formula tutorial */}
            <div className="flex items-center gap-6 mb-8">
              {/* Blank workbook card */}
              <div
                onClick={() => {
                  onSelectTemplate(EXCEL_TEMPLATES[0]);
                  onClose();
                }}
                className="w-48 h-36 rounded-lg border border-gray-200 hover:border-emerald-600 hover:shadow-xl transition cursor-pointer flex flex-col justify-between p-3 bg-white group"
              >
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-24 h-16 border border-gray-300 rounded grid grid-cols-3 grid-rows-3 bg-gray-50 p-1 gap-0.5 group-hover:scale-105 transition-transform">
                    <div className="bg-emerald-100 border border-emerald-400 rounded-xs" />
                    <div className="border border-gray-200" /><div className="border border-gray-200" />
                    <div className="border border-gray-200" /><div className="border border-gray-200" /><div className="border border-gray-200" />
                    <div className="border border-gray-200" /><div className="border border-gray-200" /><div className="border border-gray-200" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold text-gray-800">Blank workbook</div>
                  <div className="text-[10px] text-gray-500">مصنف فارغ</div>
                </div>
              </div>

              {/* Get started with Formulas (Formula tutorial) */}
              <div
                onClick={() => {
                  onSelectTemplate(EXCEL_TEMPLATES[1]);
                  onClose();
                }}
                className="w-48 h-36 rounded-lg border border-gray-200 hover:border-emerald-600 hover:shadow-xl transition cursor-pointer flex flex-col justify-between overflow-hidden bg-white group"
              >
                <div className="p-3">
                  <div className="text-[10px] text-gray-500">Get started with</div>
                  <div className="text-sm font-bold text-emerald-800">Formulas</div>
                </div>
                <div className="h-14 bg-[#107c41] relative flex items-center justify-end px-3">
                  <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow font-bold text-emerald-800 italic font-serif text-sm">
                    fx
                  </div>
                </div>
                <div className="p-1.5 text-center bg-gray-50 border-t border-gray-100">
                  <div className="text-xs font-bold text-gray-800">Formula tutorial</div>
                  <div className="text-[10px] text-gray-500">دليل الصيغ والدوال</div>
                </div>
              </div>
            </div>

            {/* Search Bar matching image_f2ceac1d.png */}
            <div className="mb-4 max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for online templates (البحث عن قوالب إكسيل 365 عبر الإنترنت)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 pr-10 text-xs outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white"
                />
                <Search className="w-4 h-4 text-emerald-700 absolute right-3 top-2.5" />
              </div>
            </div>

            {/* Suggested searches pills matching image_f2ceac1d.png */}
            <div className="flex items-center gap-2 mb-6 flex-wrap text-xs">
              <span className="text-gray-500 font-bold">Suggested searches:</span>
              {EXCEL_SUGGESTED_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded transition cursor-pointer text-xs ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-700 text-white font-bold'
                      : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  {cat.en}
                </button>
              ))}
            </div>

            {/* Gallery Grid of all templates matching image_f2ceac1d.png & image_70d46d9e.png */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredTemplates.map((template) => {
                if (template.id === 'blank' || template.id === 'formula_tutorial') return null;
                return (
                  <div
                    key={template.id}
                    onClick={() => {
                      onSelectTemplate(template);
                      onClose();
                    }}
                    className="rounded-lg border border-gray-200 hover:border-emerald-600 hover:shadow-xl transition cursor-pointer flex flex-col justify-between overflow-hidden bg-white group h-44"
                  >
                    {/* Visual Card Upper Section */}
                    <div className="flex-1 p-2.5 flex flex-col justify-between bg-gradient-to-b from-gray-50 to-white relative">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase" style={{ backgroundColor: `${template.accentColor}15`, color: template.accentColor }}>
                          {template.category}
                        </span>
                        {template.badge && (
                          <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow" style={{ backgroundColor: template.accentColor }}>
                            {template.badge}
                          </span>
                        )}
                      </div>

                      <div className="my-auto text-center px-1">
                        <div className="font-bold text-xs text-gray-800 line-clamp-2">{template.titleEn}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">{template.title}</div>
                      </div>

                      <div className="w-full h-1 rounded-full mt-1" style={{ backgroundColor: template.accentColor }} />
                    </div>

                    {/* Card Footer */}
                    <div className="p-2 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[10px] text-gray-600 font-medium truncate">{template.titleEn}</span>
                      <ArrowRight className="w-3 h-3 text-emerald-700 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: OPEN */}
        {activeTab === 'open' && (
          <div>
            <h1 className="text-3xl font-light text-gray-800 tracking-tight mb-3">Open (فتح ملف)</h1>
            <p className="text-sm text-gray-600 mb-6">
              افتح أي مصنف إكسيل من جهازك بجميع التنسيقات والألوان والصيغ والدوال بدون فقدان أي بيانات.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
              <label className="p-6 rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 hover:bg-emerald-50 hover:border-emerald-600 cursor-pointer transition flex flex-col items-center justify-center text-center group">
                <FileSpreadsheet className="w-12 h-12 text-[#107c41] mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-gray-900 text-base mb-1">استعراض ملف من هذا الجهاز</h3>
                <p className="text-xs text-gray-600 mb-4">
                  يدعم: .xlsx, .xlsm, .xlsb, .xls, .xltx, .csv, .tsv, .ods, .xml, .html
                </p>
                <span className="px-4 py-2 bg-[#107c41] text-white rounded-lg text-xs font-bold shadow hover:bg-emerald-800 transition">
                  اختيار ملف إكسيل ➔
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept=".xlsx,.xlsm,.xlsb,.xls,.xltx,.csv,.tsv,.ods,.xml,.html,.htm,.txt"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          </div>
        )}

        {/* TAB 3: SAVE AS / EXPORT */}
        {(activeTab === 'saveas' || activeTab === 'export') && (
          <div>
            <h1 className="text-3xl font-light text-gray-800 tracking-tight mb-3">Save As & Export (حفظ باسم وتصدير)</h1>
            <p className="text-sm text-gray-600 mb-6">
              احفظ المصنف المحلي بجميع الامتدادات الرسمية لـ Excel 365 وافتحه على أجهزة الكمبيوتر والتطبيقات المحاسبية.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl">
              {[
                { ext: 'xlsx' as const, label: 'Excel Workbook (.xlsx)', desc: 'مصنف إكسيل الافتراضي الحديث المتوافق مع Office 365 وجميع الإصدارات.' },
                { ext: 'xlsm' as const, label: 'Excel Macro-Enabled (.xlsm)', desc: 'مصنف إكسيل يدعم الماكرو والأكواد البرمجية.' },
                { ext: 'xlsb' as const, label: 'Excel Binary Workbook (.xlsb)', desc: 'مصنف إكسيل ثنائي عالي السرعة للملفات الضخمة وملايين الصفوف.' },
                { ext: 'xls' as const, label: 'Excel 97-2003 Workbook (.xls)', desc: 'مصنف إكسيل المتوافق مع الإصدارات الكلاسيكية القديمة.' },
                { ext: 'csv' as const, label: 'CSV Comma Delimited (.csv)', desc: 'ملف قيم مفصولة بفواصل متوافق مع كافة قواعد البيانات والأنظمة.' },
                { ext: 'tsv' as const, label: 'Text Tab Delimited (.txt / .tsv)', desc: 'ملف نصي مفصول بعلامات جدولة.' },
                { ext: 'ods' as const, label: 'OpenDocument Spreadsheet (.ods)', desc: 'تنسيق الجداول المفتوحة LibreOffice و OpenOffice.' },
                { ext: 'xml' as const, label: 'XML Spreadsheet 2003 (.xml)', desc: 'هيكلية بيانات XML متكاملة للربط البرمجي.' },
                { ext: 'html' as const, label: 'Web Page (.html)', desc: 'صفحة ويب HTML تتضمن الجداول وتنسيقات الألوان.' },
                { ext: 'pdf' as const, label: 'PDF Document (.pdf)', desc: 'تصدير وطباعة المستند كملف PDF عالي الجودة والجاهز للمشاركة.' },
              ].map((item) => (
                <button
                  key={item.ext}
                  onClick={() => {
                    onExport(item.ext);
                    onClose();
                  }}
                  className="p-4 rounded-xl border border-gray-200 hover:border-emerald-600 hover:shadow-lg transition text-left cursor-pointer flex flex-col justify-between group bg-white"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-gray-900 text-sm group-hover:text-emerald-700">{item.label}</span>
                      <Download className="w-4 h-4 text-emerald-600 shrink-0" />
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2">{item.desc}</p>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 mt-3 block group-hover:underline">
                    حفظ وتنزيل الملف ➔
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: INFO */}
        {activeTab === 'info' && (
          <div>
            <h1 className="text-3xl font-light text-gray-800 tracking-tight mb-3">Info (معلومات المصنف)</h1>
            <div className="max-w-2xl bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <span className="text-sm font-bold text-gray-700">عنوان المصنف:</span>
                <span className="text-sm font-semibold text-emerald-800">{documentTitle}</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <span className="text-sm font-bold text-gray-700">عدد أوراق العمل:</span>
                <span className="text-sm font-semibold">{sheetsData ? Object.keys(sheetsData).length : 1} ورقة</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <span className="text-sm font-bold text-gray-700">الحد الأقصى للصفوف:</span>
                <span className="text-sm font-semibold text-emerald-800 font-mono">1,048,576 صف (Excel 365 Full Grid)</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <span className="text-sm font-bold text-gray-700">حالة الحفظ:</span>
                <span className="flex items-center gap-1.5 text-xs font-bold">
                  <span className={`w-2.5 h-2.5 rounded-full ${isSaved ? 'bg-emerald-500' : 'bg-orange-500'}`} />
                  <span>{isSaved ? 'محفوظ محلياً' : 'تغييرات غير محفوظة'}</span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
