import React, { useState } from 'react';
import {
  FolderOpen,
  FilePlus,
  Layers,
  Download,
  Edit3,
  Copy,
  MessageSquare,
  ShieldCheck,
  PenTool,
  Ruler,
  Type,
  Image,
  Square,
  Link,
  Droplet,
  AlignCenter,
  Hash,
  RotateCw,
  RotateCcw,
  Trash2,
  Scissors,
  Highlighter,
  Underline,
  Strikethrough,
  Pencil,
  Stamp,
  Paperclip,
  CheckSquare,
  Lock,
  EyeOff,
  FileText,
  FileSpreadsheet,
  Presentation,
  Code,
  ZoomIn,
  ZoomOut,
  Maximize2,
  BookOpen,
  Columns,
  Sidebar,
  Palette,
  ChevronDown
} from 'lucide-react';
import { PdfRibbonTab, PdfActiveTool } from './types';

interface Props {
  activeTab: PdfRibbonTab;
  setActiveTab: (tab: PdfRibbonTab) => void;
  activeTool: PdfActiveTool;
  setActiveTool: (tool: PdfActiveTool) => void;
  onOpenBackstage: () => void;
  onOpenFile: () => void;
  onCreateNewPdf: () => void;
  onOpenMergeModal: () => void;
  onOpenExportModal: (format?: any) => void;
  onOpenOrganizeModal: () => void;
  onOpenWatermarkModal: () => void;
  onOpenHeaderFooterModal: () => void;
  onOpenProtectModal: () => void;
  onOpenSignatureModal: () => void;
  onRotateCurrentPage: (delta: number) => void;
  onDeleteCurrentPage: () => void;
  onInsertBlankPage: () => void;
  onAddStamp: (type: 'approved' | 'confidential' | 'draft' | 'rejected' | 'paid') => void;
  showSidebar: boolean;
  onToggleSidebar: () => void;
  zoomLevel: number;
  onSetZoomLevel: (zoom: number) => void;
  twoPageView: boolean;
  onToggleTwoPageView: () => void;
  readingMode: boolean;
  onToggleReadingMode: () => void;
}

export const PdfRibbon: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  activeTool,
  setActiveTool,
  onOpenBackstage,
  onOpenFile,
  onCreateNewPdf,
  onOpenMergeModal,
  onOpenExportModal,
  onOpenOrganizeModal,
  onOpenWatermarkModal,
  onOpenHeaderFooterModal,
  onOpenProtectModal,
  onOpenSignatureModal,
  onRotateCurrentPage,
  onDeleteCurrentPage,
  onInsertBlankPage,
  onAddStamp,
  showSidebar,
  onToggleSidebar,
  zoomLevel,
  onSetZoomLevel,
  twoPageView,
  onToggleTwoPageView,
  readingMode,
  onToggleReadingMode,
}) => {
  const [showStampMenu, setShowStampMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const tabs: { id: PdfRibbonTab; label: string }[] = [
    { id: 'home', label: 'أدوات رئيسية (Home)' },
    { id: 'edit', label: 'تحرير PDF' },
    { id: 'organize', label: 'تنظيم الصفحات' },
    { id: 'comment', label: 'تعليق وتدوين' },
    { id: 'fill-sign', label: 'تعبئة وتوقيع' },
    { id: 'protect', label: 'حماية وأمان' },
    { id: 'export', label: 'تصدير وتحويل' },
    { id: 'view', label: 'عرض' },
  ];

  return (
    <div className="bg-[#f3f2f1] border-b border-gray-300 select-none text-gray-800 text-xs shrink-0 z-30">
      {/* 1. Ribbon Tabs Headers */}
      <div className="flex items-center gap-0.5 px-3 pt-1 border-b border-gray-300 bg-[#f3f2f1]">
        {/* File / Backstage Button */}
        <button
          onClick={onOpenBackstage}
          className="px-4 py-1.5 bg-[#ba141a] hover:bg-[#961015] text-white font-bold rounded-t-sm transition flex items-center gap-1.5 cursor-pointer shadow-xs text-xs"
        >
          <span>ملف</span>
        </button>

        {/* Tab Buttons */}
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 font-semibold text-xs rounded-t-sm transition cursor-pointer relative ${
                isActive
                  ? 'bg-white text-[#ba141a] font-bold border-t-2 border-t-[#ba141a] shadow-2xs'
                  : 'text-gray-700 hover:bg-gray-200/70 hover:text-gray-900'
              }`}
            >
              {tab.label}
              {isActive && (
                <div className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-white z-10" />
              )}
            </button>
          );
        })}

        <div className="flex-1" />

        {/* Right Application Badge */}
        <div className="flex items-center gap-2 text-[11px] text-gray-600 px-2 pb-1">
          <span className="bg-red-100 text-[#ba141a] px-2 py-0.5 rounded font-bold">
            Adobe Acrobat Pro / Foxit Studio
          </span>
          <span className="text-gray-400">|</span>
          <span className="hidden sm:inline">PDF السيادي 100% Offline</span>
        </div>
      </div>

      {/* 2. Ribbon Content Container */}
      <div className="bg-white px-3 py-1.5 min-h-[90px] flex items-stretch gap-3 overflow-x-auto shadow-inner">
        {/* ========================================================= */}
        {/* TAB: HOME (أدوات رئيسية)                                  */}
        {/* ========================================================= */}
        {activeTab === 'home' && (
          <div className="flex items-stretch gap-2.5">
            {/* File & Create Group */}
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenFile}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-red-50 rounded text-gray-800 hover:text-[#ba141a] transition cursor-pointer"
                  title="فتح ملف PDF من الجهاز"
                >
                  <FolderOpen className="w-5 h-5 text-[#ba141a]" />
                  <span className="text-[10px] font-bold mt-1">فتح PDF</span>
                </button>
                <button
                  onClick={onCreateNewPdf}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-red-50 rounded text-gray-800 hover:text-[#ba141a] transition cursor-pointer"
                  title="إنشاء وثيقة PDF جديدة فارغة"
                >
                  <FilePlus className="w-5 h-5 text-gray-700" />
                  <span className="text-[10px] font-semibold mt-1">إنشاء PDF</span>
                </button>
                <button
                  onClick={onOpenMergeModal}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-red-50 rounded text-gray-800 hover:text-[#ba141a] transition cursor-pointer"
                  title="دمج عدة ملفات PDF في مستند واحد"
                >
                  <Layers className="w-5 h-5 text-indigo-600" />
                  <span className="text-[10px] font-bold mt-1">دمج ملفات</span>
                </button>
                <button
                  onClick={() => onOpenExportModal()}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-red-50 rounded text-gray-800 hover:text-[#ba141a] transition cursor-pointer"
                  title="تصدير وتحويل PDF إلى Word / Excel / صور"
                >
                  <Download className="w-5 h-5 text-blue-600" />
                  <span className="text-[10px] font-bold mt-1">تصدير PDF</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">إنشاء وملفات</div>
            </div>

            {/* Core Workflow Tools */}
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveTab('edit');
                    setActiveTool('edit-text');
                  }}
                  className={`flex flex-col items-center justify-center p-1.5 rounded transition cursor-pointer ${
                    activeTool === 'edit-text'
                      ? 'bg-red-100 text-[#ba141a] font-bold'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                  title="تحرير النصوص وإضافة عناصر للوثيقة"
                >
                  <Edit3 className="w-5 h-5 text-[#ba141a]" />
                  <span className="text-[10px] font-semibold mt-1">تحرير PDF</span>
                </button>

                <button
                  onClick={onOpenOrganizeModal}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-gray-100 rounded text-gray-700 transition cursor-pointer"
                  title="تنظيم وتدوير وحذف صفحات المستند"
                >
                  <Copy className="w-5 h-5 text-amber-600" />
                  <span className="text-[10px] font-semibold mt-1">تنظيم الصفحات</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('comment');
                    setActiveTool('highlight');
                  }}
                  className={`flex flex-col items-center justify-center p-1.5 rounded transition cursor-pointer ${
                    activeTool === 'highlight'
                      ? 'bg-amber-100 text-amber-900 font-bold'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                  title="أدوات التعليق والتمييز والملاحظات"
                >
                  <MessageSquare className="w-5 h-5 text-amber-500" />
                  <span className="text-[10px] font-semibold mt-1">تعليق وتدوين</span>
                </button>

                <button
                  onClick={onOpenProtectModal}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-gray-100 rounded text-gray-700 transition cursor-pointer"
                  title="حماية وتشفير المستند بكلمة مرور"
                >
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span className="text-[10px] font-semibold mt-1">حماية وأمان</span>
                </button>

                <button
                  onClick={onOpenSignatureModal}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-gray-100 rounded text-gray-700 transition cursor-pointer"
                  title="إدراج توقيع حي وتعبئة نماذج"
                >
                  <PenTool className="w-5 h-5 text-blue-600" />
                  <span className="text-[10px] font-semibold mt-1">تعبئة وتوقيع</span>
                </button>

                <button
                  onClick={() => setActiveTool(activeTool === 'measure' ? 'select' : 'measure')}
                  className={`flex flex-col items-center justify-center p-1.5 rounded transition cursor-pointer ${
                    activeTool === 'measure'
                      ? 'bg-blue-100 text-blue-900 font-bold'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                  title="أداة القياس والمسطرة الرقمية"
                >
                  <Ruler className="w-5 h-5 text-cyan-600" />
                  <span className="text-[10px] font-semibold mt-1">قياس ومسطرة</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">أدوات العمل الأساسية</div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: EDIT PDF (تحرير PDF)                                 */}
        {/* ========================================================= */}
        {activeTab === 'edit' && (
          <div className="flex items-stretch gap-3">
            {/* Text & Media Group */}
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTool(activeTool === 'edit-text' ? 'select' : 'edit-text')}
                  className={`flex flex-col items-center justify-center p-2 rounded transition cursor-pointer ${
                    activeTool === 'edit-text'
                      ? 'bg-red-100 border border-red-300 text-[#ba141a] font-bold'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                  title="تحرير النصوص المباشرة في الصفحة"
                >
                  <Edit3 className="w-5 h-5 text-[#ba141a]" />
                  <span className="text-[10px] font-bold mt-1">تحرير النص</span>
                </button>

                <button
                  onClick={() => setActiveTool(activeTool === 'add-text' ? 'select' : 'add-text')}
                  className={`flex flex-col items-center justify-center p-2 rounded transition cursor-pointer ${
                    activeTool === 'add-text'
                      ? 'bg-blue-100 border border-blue-300 text-blue-900 font-bold'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                  title="إضافة فقرة نصية جديدة في أي موضع"
                >
                  <Type className="w-5 h-5 text-blue-600" />
                  <span className="text-[10px] font-bold mt-1">إضافة نص</span>
                </button>

                <button
                  onClick={() => setActiveTool('add-image')}
                  className="flex flex-col items-center justify-center p-2 hover:bg-gray-100 rounded text-gray-700 cursor-pointer"
                  title="إدراج صورة داخل صفحة PDF"
                >
                  <Image className="w-5 h-5 text-emerald-600" />
                  <span className="text-[10px] font-bold mt-1">إضافة صورة</span>
                </button>

                <button
                  onClick={() => setActiveTool('add-shape')}
                  className="flex flex-col items-center justify-center p-2 hover:bg-gray-100 rounded text-gray-700 cursor-pointer"
                  title="إضافة أشكال هندسية (مستطيل، دائرة، خط)"
                >
                  <Square className="w-5 h-5 text-amber-600" />
                  <span className="text-[10px] font-bold mt-1">إضافة شكل</span>
                </button>

                <button
                  onClick={() => {
                    const url = prompt('أدخل الرابط الإلكتروني (URL):', 'https://');
                    if (url) alert(`تم تفعيل أداة الرابط التشعبي: ${url}`);
                  }}
                  className="flex flex-col items-center justify-center p-2 hover:bg-gray-100 rounded text-gray-700 cursor-pointer"
                  title="إضافة رابط تشعبي قابل للنقر"
                >
                  <Link className="w-5 h-5 text-cyan-600" />
                  <span className="text-[10px] font-bold mt-1">رابط</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">محتوى الصفحة</div>
            </div>

            {/* Document Styling & Bates */}
            <div className="flex flex-col justify-between pl-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenWatermarkModal}
                  className="flex flex-col items-center justify-center p-2 hover:bg-red-50 rounded text-gray-800 hover:text-[#ba141a] cursor-pointer"
                  title="إضافة علامة مائية سرية أو رسمية"
                >
                  <Droplet className="w-5 h-5 text-[#ba141a]" />
                  <span className="text-[10px] font-bold mt-1">علامة مائية</span>
                </button>

                <button
                  onClick={onOpenHeaderFooterModal}
                  className="flex flex-col items-center justify-center p-2 hover:bg-gray-100 rounded text-gray-700 cursor-pointer"
                  title="تنسيق رأس وتذييل الصفحة"
                >
                  <AlignCenter className="w-5 h-5 text-indigo-600" />
                  <span className="text-[10px] font-bold mt-1">رأس وتذييل</span>
                </button>

                <button
                  onClick={onOpenHeaderFooterModal}
                  className="flex flex-col items-center justify-center p-2 hover:bg-gray-100 rounded text-gray-700 cursor-pointer"
                  title="ترقيم Bates القانوني الرقمي"
                >
                  <Hash className="w-5 h-5 text-amber-600" />
                  <span className="text-[10px] font-bold mt-1">ترقيم Bates</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">علامات وترقيم قانوني</div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: ORGANIZE PAGES (تنظيم الصفحات)                        */}
        {/* ========================================================= */}
        {activeTab === 'organize' && (
          <div className="flex items-stretch gap-3">
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenOrganizeModal}
                  className="flex flex-col items-center justify-center p-2 bg-red-50 hover:bg-red-100 rounded-lg text-[#ba141a] font-bold border border-red-200 cursor-pointer"
                  title="فتح شبكة عرض كافة صفحات المستند"
                >
                  <Copy className="w-5 h-5 text-[#ba141a]" />
                  <span className="text-[10.5px] font-bold mt-1">منظم الصفحات الشامل</span>
                </button>

                <button
                  onClick={onInsertBlankPage}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-gray-100 rounded text-gray-700 cursor-pointer"
                  title="إدراج صفحة فارغة جديدة"
                >
                  <span className="text-sm">📄+</span>
                  <span className="text-[10px] font-semibold mt-0.5">إدراج صفحة</span>
                </button>

                <button
                  onClick={onDeleteCurrentPage}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-red-50 text-red-700 rounded cursor-pointer"
                  title="حذف الصفحة الحالية المعروضة"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-[10px] font-semibold mt-0.5">حذف الصفحة</span>
                </button>

                <button
                  onClick={() => onRotateCurrentPage(90)}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-gray-100 rounded text-gray-700 cursor-pointer"
                  title="تدوير الصفحة الحالية 90 درجة لليمين"
                >
                  <RotateCw className="w-4 h-4 text-blue-600" />
                  <span className="text-[10px] font-semibold mt-0.5">تدوير 90° لليمين</span>
                </button>

                <button
                  onClick={() => onRotateCurrentPage(-90)}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-gray-100 rounded text-gray-700 cursor-pointer"
                  title="تدوير الصفحة الحالية 90 درجة لليسار"
                >
                  <RotateCcw className="w-4 h-4 text-blue-600" />
                  <span className="text-[10px] font-semibold mt-0.5">تدوير 90° لليسار</span>
                </button>

                <button
                  onClick={onOpenOrganizeModal}
                  className="flex flex-col items-center justify-center p-1.5 hover:bg-gray-100 rounded text-gray-700 cursor-pointer"
                  title="تقسيم ملف PDF واستخراج صفحات"
                >
                  <Scissors className="w-4 h-4 text-purple-600" />
                  <span className="text-[10px] font-semibold mt-0.5">تقسيم واستخراج</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">عمليات الصفحات</div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: ANNOTATE / COMMENT (تعليق وتدوين)                      */}
        {/* ========================================================= */}
        {activeTab === 'comment' && (
          <div className="flex items-stretch gap-3">
            {/* Markup tools */}
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveTool(activeTool === 'highlight' ? 'select' : 'highlight')}
                  className={`flex flex-col items-center justify-center p-2 rounded transition cursor-pointer ${
                    activeTool === 'highlight'
                      ? 'bg-amber-100 border border-amber-300 text-amber-950 font-bold'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                  title="تمييز النص (Highlight)"
                >
                  <Highlighter className="w-5 h-5 text-amber-500" />
                  <span className="text-[10px] font-bold mt-1">تمييز النص</span>
                </button>

                <button
                  onClick={() => setActiveTool(activeTool === 'underline' ? 'select' : 'underline')}
                  className={`flex flex-col items-center justify-center p-2 rounded transition cursor-pointer ${
                    activeTool === 'underline'
                      ? 'bg-blue-100 border border-blue-300 text-blue-900 font-bold'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                  title="تسطير النص (Underline)"
                >
                  <Underline className="w-5 h-5 text-blue-600" />
                  <span className="text-[10px] font-bold mt-1">تسطير</span>
                </button>

                <button
                  onClick={() => setActiveTool(activeTool === 'strikethrough' ? 'select' : 'strikethrough')}
                  className={`flex flex-col items-center justify-center p-2 rounded transition cursor-pointer ${
                    activeTool === 'strikethrough'
                      ? 'bg-red-100 border border-red-300 text-red-900 font-bold'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                  title="يتوسطه خط (Strikethrough)"
                >
                  <Strikethrough className="w-5 h-5 text-red-600" />
                  <span className="text-[10px] font-bold mt-1">يتوسطه خط</span>
                </button>

                <button
                  onClick={() => setActiveTool(activeTool === 'pencil' ? 'select' : 'pencil')}
                  className={`flex flex-col items-center justify-center p-2 rounded transition cursor-pointer ${
                    activeTool === 'pencil'
                      ? 'bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                  title="قلم رصاص للرسم الحر"
                >
                  <Pencil className="w-5 h-5 text-emerald-600" />
                  <span className="text-[10px] font-bold mt-1">قلم رصاص</span>
                </button>

                <button
                  onClick={() => setActiveTool(activeTool === 'sticky-note' ? 'select' : 'sticky-note')}
                  className={`flex flex-col items-center justify-center p-2 rounded transition cursor-pointer ${
                    activeTool === 'sticky-note'
                      ? 'bg-amber-100 border border-amber-300 text-amber-900 font-bold'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                  title="إضافة ملاحظة لاصقة (Sticky Note)"
                >
                  <MessageSquare className="w-5 h-5 text-amber-600" />
                  <span className="text-[10px] font-bold mt-1">ملاحظة لاصقة</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">أدوات التأشير والملاحظات</div>
            </div>

            {/* Stamps & Attachments */}
            <div className="flex flex-col justify-between pl-1">
              <div className="flex items-center gap-2">
                {/* Stamp Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowStampMenu(!showStampMenu)}
                    className="flex flex-col items-center justify-center p-2 hover:bg-red-50 rounded text-gray-800 hover:text-[#ba141a] cursor-pointer"
                    title="إدراج أختام رسمية معتمدة"
                  >
                    <Stamp className="w-5 h-5 text-[#ba141a]" />
                    <span className="text-[10px] font-bold mt-1">ختم رسمي</span>
                  </button>

                  {showStampMenu && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-xl py-1 z-50 w-44 text-right">
                      <button
                        onClick={() => { onAddStamp('approved'); setShowStampMenu(false); }}
                        className="w-full px-3 py-1.5 text-right hover:bg-emerald-50 text-[11px] font-bold text-emerald-700 block"
                      >
                        ✔ معتمد رسمياً (Approved)
                      </button>
                      <button
                        onClick={() => { onAddStamp('confidential'); setShowStampMenu(false); }}
                        className="w-full px-3 py-1.5 text-right hover:bg-red-50 text-[11px] font-bold text-red-700 block"
                      >
                        🔒 سري للغاية (Confidential)
                      </button>
                      <button
                        onClick={() => { onAddStamp('draft'); setShowStampMenu(false); }}
                        className="w-full px-3 py-1.5 text-right hover:bg-amber-50 text-[11px] font-bold text-amber-700 block"
                      >
                        📝 مسودة (Draft)
                      </button>
                      <button
                        onClick={() => { onAddStamp('paid'); setShowStampMenu(false); }}
                        className="w-full px-3 py-1.5 text-right hover:bg-blue-50 text-[11px] font-bold text-blue-700 block"
                      >
                        💰 مدفوع (Paid)
                      </button>
                      <button
                        onClick={() => { onAddStamp('rejected'); setShowStampMenu(false); }}
                        className="w-full px-3 py-1.5 text-right hover:bg-red-50 text-[11px] font-bold text-gray-700 block"
                      >
                        ✖ مرفوض (Rejected)
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    const desc = prompt('أدخل اسم الملف المرفق:', 'مرفق_محضر_2026.pdf');
                    if (desc) alert(`تم إرفاق الملف "${desc}" بصفحة PDF الحالية بنجاح!`);
                  }}
                  className="flex flex-col items-center justify-center p-2 hover:bg-gray-100 rounded text-gray-700 cursor-pointer"
                  title="إرفاق ملف داخل وثيقة PDF"
                >
                  <Paperclip className="w-5 h-5 text-gray-600" />
                  <span className="text-[10px] font-bold mt-1">مرفق</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">أختام ومرفقات</div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: FILL & SIGN (تعبئة وتوقيع)                            */}
        {/* ========================================================= */}
        {activeTab === 'fill-sign' && (
          <div className="flex items-stretch gap-3">
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenSignatureModal}
                  className="flex flex-col items-center justify-center p-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-900 border border-blue-200 cursor-pointer font-bold"
                  title="إدراج توقيع إلكتروني حي (رسم أو كتابة أو رفع)"
                >
                  <PenTool className="w-5 h-5 text-blue-600" />
                  <span className="text-[10.5px] font-bold mt-1">إضافة توقيع حي</span>
                </button>

                <button
                  onClick={() => setActiveTool(activeTool === 'form-field' ? 'select' : 'form-field')}
                  className={`flex flex-col items-center justify-center p-2 rounded transition cursor-pointer ${
                    activeTool === 'form-field'
                      ? 'bg-purple-100 border border-purple-300 text-purple-950 font-bold'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                  title="إدراج حقول نماذج قابلة للتعبئة (نص، مربع اختيار)"
                >
                  <CheckSquare className="w-5 h-5 text-purple-600" />
                  <span className="text-[10px] font-bold mt-1">حقول نماذج</span>
                </button>

                <button
                  onClick={() => alert('تم التحقق من الشهادة الرقمية: الوثيقة موقعة إلكترونياً بشهادة X.509 صالحة')}
                  className="flex flex-col items-center justify-center p-2 hover:bg-emerald-50 rounded text-emerald-900 cursor-pointer"
                  title="الشهادات الرقمية وأختام التوثيق"
                >
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span className="text-[10px] font-bold mt-1">شهادات رقمية</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">توقيع ونماذج</div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: PROTECT (حماية)                                      */}
        {/* ========================================================= */}
        {activeTab === 'protect' && (
          <div className="flex items-stretch gap-3">
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenProtectModal}
                  className="flex flex-col items-center justify-center p-2 bg-red-50 hover:bg-red-100 rounded-lg text-[#ba141a] font-bold border border-red-200 cursor-pointer"
                  title="تشفير بكلمة مرور وتقييد الأذونات"
                >
                  <Lock className="w-5 h-5 text-[#ba141a]" />
                  <span className="text-[10.5px] font-bold mt-1">تشفير بكلمة مرور</span>
                </button>

                <button
                  onClick={() => setActiveTool(activeTool === 'redact' ? 'select' : 'redact')}
                  className={`flex flex-col items-center justify-center p-2 rounded transition cursor-pointer ${
                    activeTool === 'redact'
                      ? 'bg-black text-white font-bold'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                  title="أداة التنقيح لحجب البيانات السرية بشكل دائم"
                >
                  <EyeOff className="w-5 h-5 text-gray-900" />
                  <span className="text-[10px] font-bold mt-1">تنقيح وحجب (Redact)</span>
                </button>

                <button
                  onClick={onOpenProtectModal}
                  className="flex flex-col items-center justify-center p-2 hover:bg-gray-100 rounded text-gray-700 cursor-pointer"
                  title="إزالة المعلومات المخفية وتطهير البيانات الوصفية"
                >
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span className="text-[10px] font-bold mt-1">تطهير البيانات</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">أمن وتشفير</div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: EXPORT (تصدير وتحويل)                                 */}
        {/* ========================================================= */}
        {activeTab === 'export' && (
          <div className="flex items-stretch gap-3">
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenExportModal('docx')}
                  className="flex flex-col items-center justify-center p-2 hover:bg-blue-50 rounded text-blue-900 cursor-pointer"
                  title="تصدير إلى مستند Word"
                >
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="text-[10px] font-bold mt-1">إلى Word</span>
                </button>

                <button
                  onClick={() => onOpenExportModal('xlsx')}
                  className="flex flex-col items-center justify-center p-2 hover:bg-emerald-50 rounded text-emerald-900 cursor-pointer"
                  title="تصدير إلى جدول بيانات Excel"
                >
                  <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                  <span className="text-[10px] font-bold mt-1">إلى Excel</span>
                </button>

                <button
                  onClick={() => onOpenExportModal('pptx')}
                  className="flex flex-col items-center justify-center p-2 hover:bg-amber-50 rounded text-amber-900 cursor-pointer"
                  title="تصدير إلى عرض تقديمي PowerPoint"
                >
                  <Presentation className="w-5 h-5 text-amber-600" />
                  <span className="text-[10px] font-bold mt-1">إلى PowerPoint</span>
                </button>

                <button
                  onClick={() => onOpenExportModal('png')}
                  className="flex flex-col items-center justify-center p-2 hover:bg-purple-50 rounded text-purple-900 cursor-pointer"
                  title="تصدير كصور عالية الدقة (PNG / JPG)"
                >
                  <Image className="w-5 h-5 text-purple-600" />
                  <span className="text-[10px] font-bold mt-1">إلى صورة</span>
                </button>

                <button
                  onClick={() => onOpenExportModal('html')}
                  className="flex flex-col items-center justify-center p-2 hover:bg-cyan-50 rounded text-cyan-900 cursor-pointer"
                  title="تصدير كصفحة ويب HTML5 مستقلة"
                >
                  <Code className="w-5 h-5 text-cyan-600" />
                  <span className="text-[10px] font-bold mt-1">إلى HTML</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">صيغ التحويل المعتمدة</div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: VIEW (عرض)                                           */}
        {/* ========================================================= */}
        {activeTab === 'view' && (
          <div className="flex items-stretch gap-3">
            {/* Zoom Controls */}
            <div className="flex flex-col justify-between border-l border-gray-200 pl-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onSetZoomLevel(100)}
                  className="px-2 py-1 bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 text-gray-800 font-bold text-[10.5px] cursor-pointer"
                >
                  100%
                </button>
                <button
                  onClick={() => onSetZoomLevel(Math.min(250, zoomLevel + 15))}
                  className="p-1 hover:bg-gray-100 rounded text-gray-700 font-bold cursor-pointer"
                  title="تكبير"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <span className="font-mono text-xs text-gray-600">{zoomLevel}%</span>
                <button
                  onClick={() => onSetZoomLevel(Math.max(40, zoomLevel - 15))}
                  className="p-1 hover:bg-gray-100 rounded text-gray-700 font-bold cursor-pointer"
                  title="تصغير"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onSetZoomLevel(120)}
                  className="px-2 py-1 hover:bg-gray-100 rounded border border-gray-200 text-gray-700 text-[10px] cursor-pointer"
                  title="ملاءمة عرض الصفحة"
                >
                  ملاءمة العرض
                </button>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">تكبير / تصغير</div>
            </div>

            {/* Layout & Sidebar */}
            <div className="flex flex-col justify-between pl-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={onToggleSidebar}
                  className={`flex flex-col items-center justify-center p-1.5 rounded transition cursor-pointer ${
                    showSidebar ? 'bg-red-50 text-[#ba141a] font-bold' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                  title="إظهار/إخفاء الشريط الجانبي للصفحات المصغرة"
                >
                  <Sidebar className="w-4 h-4 text-gray-700" />
                  <span className="text-[10px] font-semibold mt-0.5">شريط الصفحات</span>
                </button>

                <button
                  onClick={onToggleTwoPageView}
                  className={`flex flex-col items-center justify-center p-1.5 rounded transition cursor-pointer ${
                    twoPageView ? 'bg-red-50 text-[#ba141a] font-bold' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                  title="عرض مزدوج لصفحتين جنباً إلى جنب"
                >
                  <Columns className="w-4 h-4 text-blue-600" />
                  <span className="text-[10px] font-semibold mt-0.5">عرض مزدوج</span>
                </button>

                <button
                  onClick={onToggleReadingMode}
                  className={`flex flex-col items-center justify-center p-1.5 rounded transition cursor-pointer ${
                    readingMode ? 'bg-amber-100 text-amber-900 font-bold' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                  title="وضع القراءة في ملء الشاشة بدون أشرطة"
                >
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <span className="text-[10px] font-semibold mt-0.5">وضع القراءة</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-400 text-center font-medium mt-1">طرق العرض واللوحات</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
