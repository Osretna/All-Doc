import React from 'react';
import {
  AccessRibbonTab,
  AccessViewMode
} from './types';
import {
  Table as TableIcon,
  Edit2,
  Layers,
  Terminal,
  FileText,
  Copy,
  Scissors,
  Clipboard,
  ArrowUpAZ,
  ArrowDownZA,
  Filter,
  FilterX,
  Plus,
  Save,
  Trash2,
  RotateCcw,
  Sigma,
  Search,
  ArrowRight,
  ArrowLeft,
  ChevronsRight,
  ChevronsLeft,
  Database,
  Network,
  ShieldCheck,
  FileSpreadsheet,
  Download,
  Upload,
  Code2,
  Wrench,
  CheckCircle2,
  Key,
  FolderOpen,
  Printer,
  Sparkles,
  Play
} from 'lucide-react';

interface Props {
  activeTab: AccessRibbonTab;
  onTabChange: (tab: AccessRibbonTab) => void;
  viewMode: AccessViewMode;
  onViewModeChange: (mode: AccessViewMode) => void;
  onOpenFileMenu: () => void;
  // Clipboard
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
  // Sort & Filter
  onSortAsc: () => void;
  onSortDesc: () => void;
  onClearSort: () => void;
  onToggleFilter: () => void;
  onClearFilter: () => void;
  hasActiveFilter: boolean;
  // Records
  onNewRecord: () => void;
  onSaveRecord: () => void;
  onDeleteRecord: () => void;
  onRefreshAll: () => void;
  showTotalsRow: boolean;
  onToggleTotals: () => void;
  // Find & Nav
  onOpenFind: () => void;
  onFirstRecord: () => void;
  onPrevRecord: () => void;
  onNextRecord: () => void;
  onLastRecord: () => void;
  // Create
  onNewTable: () => void;
  onOpenQueryWizard: () => void;
  onOpenFormWizard: () => void;
  onOpenReportWizard: () => void;
  onOpenVbaEditor: () => void;
  // Tools
  onOpenRelationships: () => void;
  onOpenDocumenter: () => void;
  onCompactRepair: () => void;
  // External
  onImportFile: () => void;
  onExportExcel: () => void;
  onExportPdf: () => void;
  onExportAccdb: () => void;
  onRunCurrentSql?: () => void;
}

export const AccessRibbon: React.FC<Props> = ({
  activeTab,
  onTabChange,
  viewMode,
  onViewModeChange,
  onOpenFileMenu,
  onCopy,
  onCut,
  onPaste,
  onSortAsc,
  onSortDesc,
  onClearSort,
  onToggleFilter,
  onClearFilter,
  hasActiveFilter,
  onNewRecord,
  onSaveRecord,
  onDeleteRecord,
  onRefreshAll,
  showTotalsRow,
  onToggleTotals,
  onOpenFind,
  onFirstRecord,
  onPrevRecord,
  onNextRecord,
  onLastRecord,
  onNewTable,
  onOpenQueryWizard,
  onOpenFormWizard,
  onOpenReportWizard,
  onOpenVbaEditor,
  onOpenRelationships,
  onOpenDocumenter,
  onCompactRepair,
  onImportFile,
  onExportExcel,
  onExportPdf,
  onExportAccdb,
  onRunCurrentSql,
}) => {
  return (
    <div className="bg-[#f3f2f1] border-b border-[#e1dfdd] select-none text-[#323130] text-xs shadow-2xs no-print">
      {/* 1. Ribbon Tabs Header */}
      <div className="flex items-center px-2 pt-1 border-b border-gray-200 bg-[#edebe9] overflow-x-auto">
        {/* Backstage File Tab */}
        <button
          onClick={onOpenFileMenu}
          className="bg-[#a4373a] hover:bg-[#832629] text-white font-bold px-3 py-1.5 rounded-t text-xs flex items-center gap-1.5 transition cursor-pointer shrink-0 ml-1"
        >
          <FolderOpen className="w-3.5 h-3.5" />
          <span>ملف (File)</span>
        </button>

        {/* Master Access Tabs */}
        <button
          onClick={() => onTabChange('home')}
          className={`px-3 py-1.5 font-bold transition text-xs border-t-2 shrink-0 cursor-pointer ${
            activeTab === 'home'
              ? 'bg-[#f3f2f1] text-[#a4373a] border-[#a4373a] shadow-xs'
              : 'border-transparent text-gray-700 hover:bg-gray-200'
          }`}
        >
          الصفحة الرئيسية (Home)
        </button>

        <button
          onClick={() => onTabChange('create')}
          className={`px-3 py-1.5 font-bold transition text-xs border-t-2 shrink-0 cursor-pointer ${
            activeTab === 'create'
              ? 'bg-[#f3f2f1] text-[#a4373a] border-[#a4373a] shadow-xs'
              : 'border-transparent text-gray-700 hover:bg-gray-200'
          }`}
        >
          إنشاء (Create)
        </button>

        <button
          onClick={() => onTabChange('external')}
          className={`px-3 py-1.5 font-bold transition text-xs border-t-2 shrink-0 cursor-pointer ${
            activeTab === 'external'
              ? 'bg-[#f3f2f1] text-[#a4373a] border-[#a4373a] shadow-xs'
              : 'border-transparent text-gray-700 hover:bg-gray-200'
          }`}
        >
          بيانات خارجية (External Data)
        </button>

        <button
          onClick={() => onTabChange('tools')}
          className={`px-3 py-1.5 font-bold transition text-xs border-t-2 shrink-0 cursor-pointer ${
            activeTab === 'tools'
              ? 'bg-[#f3f2f1] text-[#a4373a] border-[#a4373a] shadow-xs'
              : 'border-transparent text-gray-700 hover:bg-gray-200'
          }`}
        >
          أدوات قاعدة البيانات (Database Tools)
        </button>

        {/* Contextual Tabs based on current view */}
        {viewMode === 'records' && (
          <button
            onClick={() => onTabChange('table-fields')}
            className={`px-3 py-1.5 font-bold transition text-xs border-t-2 shrink-0 cursor-pointer ml-auto bg-amber-50 ${
              activeTab === 'table-fields'
                ? 'bg-[#f3f2f1] text-amber-900 border-amber-600 shadow-xs'
                : 'border-amber-400 text-amber-800 hover:bg-amber-100'
            }`}
          >
            أدوات الجدول: الحقول (Table Tools)
          </button>
        )}

        {viewMode === 'sql' && (
          <button
            onClick={() => onTabChange('query-design')}
            className={`px-3 py-1.5 font-bold transition text-xs border-t-2 shrink-0 cursor-pointer ml-auto bg-blue-50 ${
              activeTab === 'query-design'
                ? 'bg-[#f3f2f1] text-blue-900 border-blue-600 shadow-xs'
                : 'border-blue-400 text-blue-800 hover:bg-blue-100'
            }`}
          >
            أدوات الاستعلام: التصميم و SQL (Query Tools)
          </button>
        )}
      </div>

      {/* 2. Ribbon Commands Area */}
      <div className="p-1.5 px-3 flex items-center gap-2 overflow-x-auto min-h-[72px]">
        {/* ================= TAB 1: HOME ================= */}
        {activeTab === 'home' && (
          <>
            {/* Group: Views */}
            <div className="flex flex-col items-center border-l border-gray-300 pl-2 shrink-0">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onViewModeChange('records')}
                  className={`flex flex-col items-center p-1.5 rounded transition cursor-pointer min-w-[50px] ${
                    viewMode === 'records' ? 'bg-[#a4373a] text-white font-bold' : 'hover:bg-gray-200'
                  }`}
                  title="عرض ورقة البيانات (Datasheet View)"
                >
                  <TableIcon className="w-5 h-5 mb-0.5" />
                  <span className="text-[10px]">ورقة البيانات</span>
                </button>
                <button
                  onClick={() => onViewModeChange('design')}
                  className={`flex flex-col items-center p-1.5 rounded transition cursor-pointer min-w-[50px] ${
                    viewMode === 'design' ? 'bg-[#a4373a] text-white font-bold' : 'hover:bg-gray-200'
                  }`}
                  title="عرض التصميم (Design View)"
                >
                  <Edit2 className="w-5 h-5 mb-0.5" />
                  <span className="text-[10px]">التصميم</span>
                </button>
              </div>
              <span className="text-[9px] text-gray-400 font-bold mt-1">طرق العرض</span>
            </div>

            {/* Group: Clipboard */}
            <div className="flex flex-col items-center border-l border-gray-300 pl-2 shrink-0">
              <div className="flex items-center gap-1">
                <button
                  onClick={onPaste}
                  className="flex flex-col items-center p-1.5 hover:bg-gray-200 rounded transition cursor-pointer min-w-[42px]"
                  title="لصق (Ctrl+V)"
                >
                  <Clipboard className="w-5 h-5 text-gray-700 mb-0.5" />
                  <span className="text-[10px]">لصق</span>
                </button>
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={onCut}
                    className="flex items-center gap-1 px-2 py-0.5 hover:bg-gray-200 rounded text-[11px] cursor-pointer"
                    title="قص (Ctrl+X)"
                  >
                    <Scissors className="w-3.5 h-3.5 text-gray-600" />
                    <span>قص</span>
                  </button>
                  <button
                    onClick={onCopy}
                    className="flex items-center gap-1 px-2 py-0.5 hover:bg-gray-200 rounded text-[11px] cursor-pointer"
                    title="نسخ (Ctrl+C)"
                  >
                    <Copy className="w-3.5 h-3.5 text-gray-600" />
                    <span>نسخ</span>
                  </button>
                </div>
              </div>
              <span className="text-[9px] text-gray-400 font-bold mt-1">الحافظة (Clipboard)</span>
            </div>

            {/* Group: Sort & Filter */}
            <div className="flex flex-col items-center border-l border-gray-300 pl-2 shrink-0">
              <div className="flex items-center gap-1">
                <button
                  onClick={onSortAsc}
                  className="flex flex-col items-center p-1.5 hover:bg-gray-200 rounded transition cursor-pointer min-w-[46px]"
                  title="فرز تصاعدي (أ إلى ي / من الأصغر للأكبر)"
                >
                  <ArrowUpAZ className="w-5 h-5 text-gray-700 mb-0.5" />
                  <span className="text-[10px]">تصاعدي</span>
                </button>
                <button
                  onClick={onSortDesc}
                  className="flex flex-col items-center p-1.5 hover:bg-gray-200 rounded transition cursor-pointer min-w-[46px]"
                  title="فرز تنازلي (ي إلى أ / من الأكبر للأصغر)"
                >
                  <ArrowDownZA className="w-5 h-5 text-gray-700 mb-0.5" />
                  <span className="text-[10px]">تنازلي</span>
                </button>
                <button
                  onClick={onClearSort}
                  className="flex flex-col items-center p-1.5 hover:bg-gray-200 rounded transition cursor-pointer min-w-[46px]"
                  title="إلغاء الفرز واستعادة الترتيب الافتراضي"
                >
                  <RotateCcw className="w-5 h-5 text-gray-700 mb-0.5" />
                  <span className="text-[10px]">إلغاء الفرز</span>
                </button>
                <div className="h-8 w-px bg-gray-200 mx-0.5" />
                <button
                  onClick={onToggleFilter}
                  className={`flex flex-col items-center p-1.5 rounded transition cursor-pointer min-w-[46px] ${
                    hasActiveFilter ? 'bg-amber-100 text-amber-900 font-bold' : 'hover:bg-gray-200'
                  }`}
                  title="تصفية حسب التحديد الحالي"
                >
                  <Filter className="w-5 h-5 text-blue-600 mb-0.5" />
                  <span className="text-[10px]">تصفية بالتحديد</span>
                </button>
                <button
                  onClick={onClearFilter}
                  disabled={!hasActiveFilter}
                  className="flex flex-col items-center p-1.5 hover:bg-gray-200 rounded transition cursor-pointer min-w-[46px] disabled:opacity-40"
                  title="مسح كافة عوامل التصفية"
                >
                  <FilterX className="w-5 h-5 text-gray-500 mb-0.5" />
                  <span className="text-[10px]">مسح التصفية</span>
                </button>
              </div>
              <span className="text-[9px] text-gray-400 font-bold mt-1">الفرز والتصفية (Sort & Filter)</span>
            </div>

            {/* Group: Records */}
            <div className="flex flex-col items-center border-l border-gray-300 pl-2 shrink-0">
              <div className="flex items-center gap-1">
                <button
                  onClick={onNewRecord}
                  className="flex flex-col items-center p-1.5 bg-red-50 hover:bg-red-100 text-red-950 rounded transition cursor-pointer min-w-[46px] font-bold"
                  title="إضافة سجل جديد (Ctrl++)"
                >
                  <Plus className="w-5 h-5 text-[#a4373a] mb-0.5" />
                  <span className="text-[10px]">جديد</span>
                </button>
                <button
                  onClick={onSaveRecord}
                  className="flex flex-col items-center p-1.5 hover:bg-gray-200 rounded transition cursor-pointer min-w-[46px]"
                  title="حفظ السجل الحالي (Shift+Enter)"
                >
                  <Save className="w-5 h-5 text-emerald-600 mb-0.5" />
                  <span className="text-[10px]">حفظ</span>
                </button>
                <button
                  onClick={onDeleteRecord}
                  className="flex flex-col items-center p-1.5 hover:bg-red-50 text-red-600 rounded transition cursor-pointer min-w-[46px]"
                  title="حذف السجل المحدد (Ctrl+-)"
                >
                  <Trash2 className="w-5 h-5 mb-0.5" />
                  <span className="text-[10px]">حذف</span>
                </button>
                <button
                  onClick={onRefreshAll}
                  className="flex flex-col items-center p-1.5 hover:bg-gray-200 rounded transition cursor-pointer min-w-[46px]"
                  title="تحديث كافة السجلات ومصادر البيانات (F5)"
                >
                  <RotateCcw className="w-5 h-5 text-blue-600 mb-0.5" />
                  <span className="text-[10px]">تحديث الكل</span>
                </button>
                <button
                  onClick={onToggleTotals}
                  className={`flex flex-col items-center p-1.5 rounded transition cursor-pointer min-w-[46px] ${
                    showTotalsRow ? 'bg-emerald-100 text-emerald-900 font-bold' : 'hover:bg-gray-200'
                  }`}
                  title="إظهار / إخفاء صف الإجماليات (Σ Totals)"
                >
                  <Sigma className="w-5 h-5 text-emerald-700 mb-0.5" />
                  <span className="text-[10px]">الإجماليات (Σ)</span>
                </button>
              </div>
              <span className="text-[9px] text-gray-400 font-bold mt-1">السجلات (Records)</span>
            </div>

            {/* Group: Find & Navigation */}
            <div className="flex flex-col items-center pl-2 shrink-0">
              <div className="flex items-center gap-1">
                <button
                  onClick={onOpenFind}
                  className="flex flex-col items-center p-1.5 hover:bg-gray-200 rounded transition cursor-pointer min-w-[44px]"
                  title="بحث واستبدال داخل السجلات (Ctrl+F)"
                >
                  <Search className="w-5 h-5 text-gray-700 mb-0.5" />
                  <span className="text-[10px]">بحث</span>
                </button>
                <div className="flex items-center gap-0.5 bg-gray-100 p-1 rounded">
                  <button onClick={onFirstRecord} className="p-1 hover:bg-white rounded" title="أول سجل"><ChevronsRight className="w-3.5 h-3.5" /></button>
                  <button onClick={onPrevRecord} className="p-1 hover:bg-white rounded" title="السجل السابق"><ArrowRight className="w-3.5 h-3.5" /></button>
                  <button onClick={onNextRecord} className="p-1 hover:bg-white rounded" title="السجل التالي"><ArrowLeft className="w-3.5 h-3.5" /></button>
                  <button onClick={onLastRecord} className="p-1 hover:bg-white rounded" title="آخر سجل"><ChevronsLeft className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <span className="text-[9px] text-gray-400 font-bold mt-1">البحث والتنقل (Find & Nav)</span>
            </div>
          </>
        )}

        {/* ================= TAB 2: CREATE ================= */}
        {activeTab === 'create' && (
          <>
            {/* Group: Tables */}
            <div className="flex flex-col items-center border-l border-gray-300 pl-2 shrink-0">
              <div className="flex items-center gap-1">
                <button
                  onClick={onNewTable}
                  className="flex flex-col items-center p-1.5 hover:bg-gray-200 rounded transition cursor-pointer min-w-[50px]"
                  title="إنشاء جدول جديد فارغ"
                >
                  <TableIcon className="w-5 h-5 text-[#a4373a] mb-0.5" />
                  <span className="text-[10px]">جدول جديد</span>
                </button>
                <button
                  onClick={() => onViewModeChange('design')}
                  className="flex flex-col items-center p-1.5 hover:bg-gray-200 rounded transition cursor-pointer min-w-[50px]"
                  title="فتح تصميم الجدول وضبط أنواع البيانات"
                >
                  <Edit2 className="w-5 h-5 text-blue-600 mb-0.5" />
                  <span className="text-[10px]">تصميم الجدول</span>
                </button>
              </div>
              <span className="text-[9px] text-gray-400 font-bold mt-1">الجداول (Tables)</span>
            </div>

            {/* Group: Queries */}
            <div className="flex flex-col items-center border-l border-gray-300 pl-2 shrink-0">
              <div className="flex items-center gap-1">
                <button
                  onClick={onOpenQueryWizard}
                  className="flex flex-col items-center p-1.5 hover:bg-gray-200 rounded transition cursor-pointer min-w-[55px] font-bold text-[#a4373a]"
                  title="معالج الاستعلامات لإنشاء استعلامات Select, Update, Delete"
                >
                  <Sparkles className="w-5 h-5 text-amber-500 mb-0.5" />
                  <span className="text-[10px]">معالج الاستعلامات</span>
                </button>
                <button
                  onClick={() => onViewModeChange('sql')}
                  className="flex flex-col items-center p-1.5 hover:bg-gray-200 rounded transition cursor-pointer min-w-[50px]"
                  title="محرر استعلامات SQL الفوري"
                >
                  <Terminal className="w-5 h-5 text-slate-800 mb-0.5" />
                  <span className="text-[10px]">محرر SQL View</span>
                </button>
              </div>
              <span className="text-[9px] text-gray-400 font-bold mt-1">الاستعلامات (Queries)</span>
            </div>

            {/* Group: Forms */}
            <div className="flex flex-col items-center border-l border-gray-300 pl-2 shrink-0">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onViewModeChange('form')}
                  className="flex flex-col items-center p-1.5 hover:bg-gray-200 rounded transition cursor-pointer min-w-[46px]"
                  title="نموذج بطاقة مفردة للسجل"
                >
                  <Layers className="w-5 h-5 text-blue-600 mb-0.5" />
                  <span className="text-[10px]">نموذج عادي</span>
                </button>
                <button
                  onClick={() => onViewModeChange('split-form')}
                  className="flex flex-col items-center p-1.5 hover:bg-gray-200 rounded transition cursor-pointer min-w-[52px]"
                  title="نموذج مقسم (ورقة بيانات بالأسفل وبطاقة بالأعلى)"
                >
                  <TableIcon className="w-5 h-5 text-indigo-600 mb-0.5" />
                  <span className="text-[10px]">نموذج مقسم</span>
                </button>
                <button
                  onClick={onOpenFormWizard}
                  className="flex flex-col items-center p-1.5 hover:bg-gray-200 rounded transition cursor-pointer min-w-[52px]"
                  title="معالج النماذج التفاعلي"
                >
                  <Sparkles className="w-5 h-5 text-blue-500 mb-0.5" />
                  <span className="text-[10px]">معالج النماذج</span>
                </button>
              </div>
              <span className="text-[9px] text-gray-400 font-bold mt-1">النماذج (Forms)</span>
            </div>

            {/* Group: Reports */}
            <div className="flex flex-col items-center border-l border-gray-300 pl-2 shrink-0">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onViewModeChange('report')}
                  className="flex flex-col items-center p-1.5 hover:bg-gray-200 rounded transition cursor-pointer min-w-[50px]"
                  title="تقرير معتمد جاهز للطباعة والتصدير"
                >
                  <FileText className="w-5 h-5 text-emerald-600 mb-0.5" />
                  <span className="text-[10px]">تقرير معتمد</span>
                </button>
                <button
                  onClick={onOpenReportWizard}
                  className="flex flex-col items-center p-1.5 hover:bg-gray-200 rounded transition cursor-pointer min-w-[55px]"
                  title="معالج التقارير المجمعة والملخصة"
                >
                  <Sparkles className="w-5 h-5 text-emerald-500 mb-0.5" />
                  <span className="text-[10px]">معالج التقارير</span>
                </button>
              </div>
              <span className="text-[9px] text-gray-400 font-bold mt-1">التقارير (Reports)</span>
            </div>

            {/* Group: Macros & Code */}
            <div className="flex flex-col items-center pl-2 shrink-0">
              <div className="flex items-center gap-1">
                <button
                  onClick={onOpenVbaEditor}
                  className="flex flex-col items-center p-1.5 bg-slate-100 hover:bg-slate-200 rounded transition cursor-pointer min-w-[55px] font-bold text-gray-900"
                  title="فتح محرر Visual Basic for Applications (VBA)"
                >
                  <Code2 className="w-5 h-5 text-emerald-700 mb-0.5" />
                  <span className="text-[10px]">محرر VBA</span>
                </button>
              </div>
              <span className="text-[9px] text-gray-400 font-bold mt-1">البرمجة والماكرو</span>
            </div>
          </>
        )}

        {/* ================= TAB 3: EXTERNAL DATA ================= */}
        {activeTab === 'external' && (
          <>
            {/* Group: Import & Link */}
            <div className="flex flex-col items-center border-l border-gray-300 pl-2 shrink-0">
              <div className="flex items-center gap-1">
                <button
                  onClick={onImportFile}
                  className="flex flex-col items-center p-1.5 hover:bg-gray-200 rounded transition cursor-pointer min-w-[52px]"
                  title="استيراد جداول من ملف Excel (.xlsx, .xls, .csv)"
                >
                  <FileSpreadsheet className="w-5 h-5 text-emerald-600 mb-0.5" />
                  <span className="text-[10px]">من Excel</span>
                </button>
                <button
                  onClick={onImportFile}
                  className="flex flex-col items-center p-1.5 hover:bg-gray-200 rounded transition cursor-pointer min-w-[52px]"
                  title="استيراد من ملف نصي أو CSV"
                >
                  <FileText className="w-5 h-5 text-blue-600 mb-0.5" />
                  <span className="text-[10px]">ملف نصي</span>
                </button>
                <button
                  onClick={onImportFile}
                  className="flex flex-col items-center p-1.5 hover:bg-gray-200 rounded transition cursor-pointer min-w-[52px]"
                  title="استيراد من قاعدة بيانات Access أخرى (.accdb, .mdb)"
                >
                  <Database className="w-5 h-5 text-[#a4373a] mb-0.5" />
                  <span className="text-[10px]">من Access</span>
                </button>
                <button
                  onClick={onImportFile}
                  className="flex flex-col items-center p-1.5 hover:bg-gray-200 rounded transition cursor-pointer min-w-[52px]"
                  title="استيراد كائنات SQL أو JSON"
                >
                  <Terminal className="w-5 h-5 text-slate-800 mb-0.5" />
                  <span className="text-[10px]">SQL / JSON</span>
                </button>
              </div>
              <span className="text-[9px] text-gray-400 font-bold mt-1">استيراد وربط (Import & Link)</span>
            </div>

            {/* Group: Export */}
            <div className="flex flex-col items-center pl-2 shrink-0">
              <div className="flex items-center gap-1">
                <button
                  onClick={onExportExcel}
                  className="flex flex-col items-center p-1.5 hover:bg-gray-200 rounded transition cursor-pointer min-w-[52px] font-bold text-emerald-800"
                  title="تصدير الجدول النشط إلى ملف Excel (.xlsx)"
                >
                  <FileSpreadsheet className="w-5 h-5 text-emerald-600 mb-0.5" />
                  <span className="text-[10px]">تصدير Excel</span>
                </button>
                <button
                  onClick={onExportPdf}
                  className="flex flex-col items-center p-1.5 hover:bg-gray-200 rounded transition cursor-pointer min-w-[52px]"
                  title="تصدير السجلات إلى مستند PDF معتمد"
                >
                  <Printer className="w-5 h-5 text-red-600 mb-0.5" />
                  <span className="text-[10px]">تصدير PDF</span>
                </button>
                <button
                  onClick={onExportAccdb}
                  className="flex flex-col items-center p-1.5 bg-red-50 hover:bg-red-100 rounded transition cursor-pointer min-w-[55px] font-bold text-[#a4373a]"
                  title="تصدير وحفظ قاعدة البيانات كاملة كملف Access (.accdb)"
                >
                  <Download className="w-5 h-5 text-[#a4373a] mb-0.5" />
                  <span className="text-[10px]">تصدير ACCDB</span>
                </button>
              </div>
              <span className="text-[9px] text-gray-400 font-bold mt-1">تصدير البيانات (Export)</span>
            </div>
          </>
        )}

        {/* ================= TAB 4: DATABASE TOOLS ================= */}
        {activeTab === 'tools' && (
          <>
            {/* Group: Relationships */}
            <div className="flex flex-col items-center border-l border-gray-300 pl-2 shrink-0">
              <div className="flex items-center gap-1">
                <button
                  onClick={onOpenRelationships}
                  className="flex flex-col items-center p-1.5 bg-red-50 hover:bg-red-100 text-[#a4373a] rounded transition cursor-pointer min-w-[65px] font-bold shadow-2xs"
                  title="فتح نافذة مخطط العلاقات العلائقية وفرض التكامل المرجعي"
                >
                  <Network className="w-5 h-5 text-[#a4373a] mb-0.5" />
                  <span className="text-[10px]">مخطط العلاقات</span>
                </button>
              </div>
              <span className="text-[9px] text-gray-400 font-bold mt-1">العلاقات (Relationships)</span>
            </div>

            {/* Group: Analyze */}
            <div className="flex flex-col items-center border-l border-gray-300 pl-2 shrink-0">
              <div className="flex items-center gap-1">
                <button
                  onClick={onOpenDocumenter}
                  className="flex flex-col items-center p-1.5 hover:bg-gray-200 rounded transition cursor-pointer min-w-[65px]"
                  title="توثيق قاعدة البيانات الهندسية وطباعة مواصفات الجداول"
                >
                  <FileText className="w-5 h-5 text-blue-600 mb-0.5" />
                  <span className="text-[10px]">توثيق القاعدة</span>
                </button>
                <button
                  onClick={onOpenDocumenter}
                  className="flex flex-col items-center p-1.5 hover:bg-gray-200 rounded transition cursor-pointer min-w-[60px]"
                  title="تحليل الأداء وفحص سلامة المفاتيح والفهارس"
                >
                  <ShieldCheck className="w-5 h-5 text-emerald-600 mb-0.5" />
                  <span className="text-[10px]">محلل الأداء</span>
                </button>
              </div>
              <span className="text-[9px] text-gray-400 font-bold mt-1">التحليل والتوثيق (Analyze)</span>
            </div>

            {/* Group: Database Management */}
            <div className="flex flex-col items-center pl-2 shrink-0">
              <div className="flex items-center gap-1">
                <button
                  onClick={onCompactRepair}
                  className="flex flex-col items-center p-1.5 hover:bg-gray-200 rounded transition cursor-pointer min-w-[65px] font-bold text-gray-800"
                  title="ضغط وإصلاح قاعدة البيانات واستعادة المساحات غير المستخدمة"
                >
                  <Wrench className="w-5 h-5 text-amber-600 mb-0.5" />
                  <span className="text-[10px]">ضغط وإصلاح</span>
                </button>
                <button
                  onClick={onOpenVbaEditor}
                  className="flex flex-col items-center p-1.5 hover:bg-gray-200 rounded transition cursor-pointer min-w-[55px]"
                  title="محرر وحدات Visual Basic"
                >
                  <Code2 className="w-5 h-5 text-emerald-700 mb-0.5" />
                  <span className="text-[10px]">Visual Basic</span>
                </button>
              </div>
              <span className="text-[9px] text-gray-400 font-bold mt-1">إدارة القاعدة (Manage)</span>
            </div>
          </>
        )}

        {/* ================= CONTEXTUAL TAB: TABLE TOOLS ================= */}
        {activeTab === 'table-fields' && (
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center border-l border-gray-300 pl-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onViewModeChange('design')}
                  className="flex flex-col items-center p-1.5 bg-amber-100 text-amber-900 rounded font-bold min-w-[50px]"
                >
                  <Edit2 className="w-5 h-5 mb-0.5" />
                  <span className="text-[10px]">تصميم الحقول</span>
                </button>
              </div>
              <span className="text-[9px] text-gray-400 font-bold mt-1">عرض الحقول</span>
            </div>

            <div className="text-xs text-amber-950 font-medium bg-amber-50/80 p-2 rounded border border-amber-200">
              أدوات تصميم الحقول نشطة: يمكنك إضافة أو تعديل نوع البيانات والمفتاح الأساسي والقيمة الافتراضية من وضع التصميم.
            </div>
          </div>
        )}

        {/* ================= CONTEXTUAL TAB: QUERY TOOLS ================= */}
        {activeTab === 'query-design' && (
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center border-l border-gray-300 pl-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={onRunCurrentSql}
                  className="flex flex-col items-center p-1.5 bg-red-600 hover:bg-red-700 text-white rounded font-bold min-w-[55px] shadow-xs cursor-pointer"
                  title="تنفيذ استعلام SQL الحالي (Run !)"
                >
                  <Play className="w-5 h-5 fill-white mb-0.5" />
                  <span className="text-[10px]">تشغيل (!)</span>
                </button>
              </div>
              <span className="text-[9px] text-gray-400 font-bold mt-1">تنفيذ</span>
            </div>

            <div className="text-xs text-blue-950 font-medium bg-blue-50/80 p-2 rounded border border-blue-200">
              محرر استعلامات SQL متصل مباشرة بقاعدة البيانات: يمكنك كتابة استعلامات SELECT, INSERT, UPDATE, DELETE وتشغيلها فورياً.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
