import React, { useState } from 'react';
import { 
  OfficeAppId, 
  MainNavSection 
} from '../../types';
import { APP_CONFIGS } from '../../utils/appConfigs';
import { PWAInstallButton } from '../pwa/PWAInstallButton';
import { 
  FileText, 
  Table, 
  Presentation, 
  Notebook, 
  Database, 
  FileCheck2, 
  Image as ImageIcon, 
  ShieldCheck, 
  Search, 
  ChevronDown, 
  Cloud, 
  Server, 
  Globe, 
  Building2, 
  Sparkles,
  FolderOpen,
  LayoutGrid
} from 'lucide-react';

interface Props {
  activeApp: OfficeAppId;
  setActiveApp: (app: OfficeAppId) => void;
  activeSection: MainNavSection;
  setActiveSection: (sec: MainNavSection) => void;
  documentTitle: string;
  setDocumentTitle: (title: string) => void;
  onOpenBackstage: () => void;
  onUploadFile?: (file: File) => void;
  onSaveToDevice?: () => void;
  onPrintIsolated?: () => void;
}

export const TitleBar: React.FC<Props> = ({
  activeApp,
  setActiveApp,
  activeSection,
  setActiveSection,
  documentTitle,
  setDocumentTitle,
  onOpenBackstage,
  onUploadFile,
  onSaveToDevice,
  onPrintIsolated,
}) => {
  const [appMenuOpen, setAppMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [showSearchTips, setShowSearchTips] = useState(false);

  const currentConfig = APP_CONFIGS[activeApp];

  const getAppIcon = (id: OfficeAppId, size = 'w-4 h-4') => {
    switch (id) {
      case 'docs': return <FileText className={size} />;
      case 'sheets': return <Table className={size} />;
      case 'slides': return <Presentation className={size} />;
      case 'notes': return <Notebook className={size} />;
      case 'base': return <Database className={size} />;
      case 'pdf': return <FileCheck2 className={size} />;
      case 'photo': return <ImageIcon className={size} />;
    }
  };

  const officeAppsList: { id: OfficeAppId; label: string; en: string; color: string; badge: string }[] = [
    { id: 'docs', label: 'Word (المستندات)', en: 'Word', color: '#0078d4', badge: 'W' },
    { id: 'sheets', label: 'Excel (الجداول)', en: 'Excel', color: '#107c41', badge: 'X' },
    { id: 'slides', label: 'PowerPoint (العروض)', en: 'PowerPoint', color: '#d83b01', badge: 'P' },
    { id: 'base', label: 'Access (قواعد البيانات)', en: 'Access', color: '#a4373a', badge: 'A' },
    { id: 'notes', label: 'OneNote (الملاحظات)', en: 'OneNote', color: '#7719aa', badge: 'N' },
    { id: 'pdf', label: 'PDF Studio (أكروبات)', en: 'Acrobat', color: '#e81123', badge: 'PDF' },
    { id: 'photo', label: 'Photo Studio (فوتوشوب)', en: 'Photoshop', color: '#002050', badge: 'PS' },
  ];

  return (
    <div className="bg-[#f3f2f1] border-b border-[#e1dfdd] select-none text-[#323130] text-xs">
      {/* 1. Master Microsoft 365 App Launcher Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2 overflow-x-auto">
          {/* Brand Logo & Waffle Menu */}
          <div 
            onClick={() => {
              setActiveSection('office');
              setAppMenuOpen(!appMenuOpen);
            }}
            className="flex items-center gap-2 cursor-pointer pr-1 pl-2 hover:bg-gray-100 rounded-lg py-1 transition"
            title="قائمة تطبيقات مايكروسوفت أوفيس"
          >
            <div className="p-1 rounded text-gray-700 hover:text-black">
              <LayoutGrid className="w-4 h-4 text-[#0078d4]" />
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded bg-gradient-to-tr from-[#0078d4] via-[#00a4ef] to-[#107c41] flex items-center justify-center text-white font-extrabold text-xs shadow-xs">
                ∞
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-black text-[13px] tracking-tight text-gray-900">MY-DOC</span>
                <span className="text-[8px] text-[#0078d4] font-bold">SOVEREIGN SUITE</span>
              </div>
            </div>
          </div>

          <div className="h-5 w-[1px] bg-gray-200 mx-1 hidden sm:block"></div>

          {/* Direct Office Suite App Tabs (Word, Excel, PowerPoint, Access, OneNote, PDF, Photo) */}
          <div className="flex items-center gap-1">
            {officeAppsList.map((app) => {
              const isActive = activeSection === 'office' && activeApp === app.id;
              return (
                <button
                  key={app.id}
                  onClick={() => {
                    setActiveSection('office');
                    setActiveApp(app.id);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition cursor-pointer shrink-0 border ${
                    isActive
                      ? 'text-white shadow-sm border-transparent'
                      : 'bg-gray-50/80 hover:bg-gray-100 text-gray-700 border-gray-200'
                  }`}
                  style={isActive ? { backgroundColor: app.color } : {}}
                  title={`فتح تطبيق ${app.label}`}
                >
                  <span
                    className={`w-4 h-4 rounded text-[9px] font-black flex items-center justify-center ${
                      isActive ? 'bg-white text-gray-900' : 'text-white'
                    }`}
                    style={!isActive ? { backgroundColor: app.color } : {}}
                  >
                    {app.badge}
                  </span>
                  <span>{app.en}</span>
                </button>
              );
            })}
          </div>

          <div className="h-5 w-[1px] bg-gray-200 mx-1 hidden lg:block"></div>

          {/* Cloud Portal Switcher Button */}
          <button
            onClick={() => setActiveSection('hosting')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeSection !== 'office'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Cloud className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">منصة السحابة والاستضافة</span>
            <span className="sm:hidden">السحابة</span>
          </button>
        </div>

        {/* Right Status & PWA Install Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Sovereign Badge */}
          <div 
            onClick={() => setActiveSection('sovereign-vault')}
            className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-[11px] font-bold cursor-pointer hover:bg-emerald-100 transition"
            title="الوضع السيادي: 100% أوفلاين مع حفظ محلي مشفر"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>سيادي 100% أوفلاين</span>
          </div>

          {/* PWA Install Button */}
          <PWAInstallButton variant="compact" />
        </div>
      </div>

      {/* 2. Office Document Context Bar (Active when in Office mode) */}
      {activeSection === 'office' && (
        <div 
          className="flex items-center justify-between px-3 py-1.5 relative border-b text-white transition-colors duration-200"
          style={{ backgroundColor: currentConfig.primaryColor }}
        >
          {/* Left: App Title & Inline Renaming */}
          <div className="flex items-center gap-3">
            {/* Quick File Menu Button */}
            <button
              onClick={onOpenBackstage}
              className="bg-white/20 hover:bg-white/30 text-white font-bold px-3 py-1 rounded text-xs flex items-center gap-1.5 cursor-pointer transition shadow-2xs"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>ملف (File)</span>
            </button>

            {/* Current App Badge */}
            <div className="flex items-center gap-1.5 text-white/90 font-bold text-xs">
              {getAppIcon(activeApp, 'w-4 h-4')}
              <span>{currentConfig.name}</span>
            </div>

            <div className="h-4 w-[1px] bg-white/20 hidden sm:block"></div>

            {/* Document Title Editable */}
            <div className="flex items-center gap-1.5">
              {isEditingTitle ? (
                <input
                  type="text"
                  value={documentTitle}
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  onBlur={() => setIsEditingTitle(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                  autoFocus
                  className="bg-white text-gray-900 border border-white px-2 py-0.5 rounded text-xs outline-none w-52 font-bold shadow-inner"
                />
              ) : (
                <div 
                  onClick={() => setIsEditingTitle(true)}
                  className="font-bold text-white hover:bg-white/20 px-2 py-0.5 rounded cursor-pointer transition flex items-center gap-1.5 text-xs"
                  title="انقر لتعديل اسم الملف"
                >
                  <span className="truncate max-w-[200px] sm:max-w-[320px]">{documentTitle}</span>
                  <span className="text-[10px] text-white/70">✎</span>
                </div>
              )}
              <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-medium hidden sm:inline">
                محفوظ محلياً ✓
              </span>
            </div>
          </div>

          {/* Center: Tell Me Search */}
          <div className="hidden md:flex items-center relative w-64 lg:w-80">
            <Search className="w-3.5 h-3.5 absolute right-2.5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="أخبرني بما تريد القيام به في هذا التطبيق..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSearchTips(true)}
              onBlur={() => setTimeout(() => setShowSearchTips(false), 250)}
              className="w-full bg-white text-gray-800 placeholder-gray-400 rounded-md pr-8 pl-3 py-1 text-xs outline-none shadow-xs"
            />

            {showSearchTips && (
              <div className="absolute top-8 right-0 left-0 bg-white border border-gray-200 rounded-md shadow-xl p-2.5 z-50 text-right text-gray-800">
                <div className="text-[10px] font-bold text-gray-400 mb-1">إجراءات سريعة لتطبيق {currentConfig.name}:</div>
                <div 
                  onClick={() => { onOpenBackstage(); setShowSearchTips(false); }}
                  className="p-1.5 rounded hover:bg-gray-100 cursor-pointer flex items-center gap-2 text-xs"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-blue-600" />
                  <span>تصفح القوالب العربية الجاهزة</span>
                </div>
                <div 
                  onClick={() => { window.print(); setShowSearchTips(false); }}
                  className="p-1.5 rounded hover:bg-gray-100 cursor-pointer flex items-center gap-2 text-xs"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                  <span>طباعة فورية / تصدير PDF معتمد</span>
                </div>
              </div>
            )}
          </div>

          {/* Right: Quick Upload, Save As to Device, and Isolated Print Controls */}
          <div className="flex items-center gap-2 text-white/95">
            {/* Upload File Button */}
            {onUploadFile && (
              <label 
                className="bg-white/20 hover:bg-white/30 text-white font-bold px-2.5 py-1 rounded text-xs flex items-center gap-1.5 cursor-pointer transition shadow-2xs"
                title={`رفع واستيراد ملف ${currentConfig.name} مع الحفاظ على كافة الخصائص`}
              >
                <FolderOpen className="w-3.5 h-3.5 text-white" />
                <span>رفع ملف</span>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-mono">
                  {activeApp === 'docs' ? '.docx' : activeApp === 'sheets' ? '.xlsx' : activeApp === 'slides' ? '.pptx' : activeApp === 'base' ? '.accdb' : activeApp === 'pdf' ? '.pdf' : 'ملف'}
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept={
                    activeApp === 'docs'
                      ? '.docx,.doc,.txt,.html'
                      : activeApp === 'sheets'
                      ? '.xlsx,.xls,.csv'
                      : activeApp === 'slides'
                      ? '.pptx,.ppt'
                      : activeApp === 'base'
                      ? '.accdb,.mdb,.sql,.csv,.json'
                      : activeApp === 'pdf'
                      ? '.pdf'
                      : '*/*'
                  }
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f && onUploadFile) onUploadFile(f);
                    e.target.value = '';
                  }}
                />
              </label>
            )}

            {/* Save As Directly to Local Device */}
            {onSaveToDevice && (
              <button
                onClick={onSaveToDevice}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1 rounded text-xs flex items-center gap-1.5 cursor-pointer transition shadow-xs hover:shadow"
                title={`حفظ على جهازك في أي مسار تريده بالامتداد الأصلي (.${activeApp === 'docs' ? 'docx' : activeApp === 'sheets' ? 'xlsx' : activeApp === 'slides' ? 'pptx' : activeApp === 'base' ? 'accdb' : activeApp === 'pdf' ? 'pdf' : 'dat'})`}
              >
                <span>💾 حفظ على الجهاز</span>
                <span className="text-[10px] bg-black/20 px-1 py-0.2 rounded font-mono">
                  .{activeApp === 'docs' ? 'docx' : activeApp === 'sheets' ? 'xlsx' : activeApp === 'slides' ? 'pptx' : activeApp === 'base' ? 'accdb' : activeApp === 'pdf' ? 'pdf' : 'dat'}
                </span>
              </button>
            )}

            {/* Print Content Only Button */}
            <button
              onClick={() => {
                if (onPrintIsolated) {
                  onPrintIsolated();
                } else {
                  window.print();
                }
              }}
              className="hover:bg-white/20 bg-white/10 px-2.5 py-1 rounded transition text-xs font-bold flex items-center gap-1 cursor-pointer"
              title="طباعة محتوى الملف فقط مع عزل كامل لواجهة التطبيق والقوائم"
            >
              <span>🖨️ طباعة المحتوى فقط</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Cloud & Hosting Subnavigation Bar (Active when in Cloud mode) */}
      {activeSection !== 'office' && (
        <div className="flex items-center gap-2 px-3 py-1.5 overflow-x-auto bg-[#faf9f8] border-t border-gray-200">
          <button
            onClick={() => setActiveSection('hosting')}
            className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition ${
              activeSection === 'hosting' ? 'bg-[#0078d4] text-white' : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>الاستضافة السحابية & VPS</span>
          </button>
          <button
            onClick={() => setActiveSection('domains')}
            className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition ${
              activeSection === 'domains' ? 'bg-[#0078d4] text-white' : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>حجز النطاقات (Domains)</span>
          </button>
          <button
            onClick={() => setActiveSection('email')}
            className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition ${
              activeSection === 'email' ? 'bg-[#0078d4] text-white' : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>البريد الاحترافي</span>
          </button>
          <button
            onClick={() => setActiveSection('mollak')}
            className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition ${
              activeSection === 'mollak' ? 'bg-[#107c41] text-white' : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>نظام "ملاك" للعقارات</span>
          </button>
          <button
            onClick={() => setActiveSection('custom-solutions')}
            className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition ${
              activeSection === 'custom-solutions' ? 'bg-[#7719aa] text-white' : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>طلب تصميم وحلول برمجية</span>
          </button>
          <button
            onClick={() => setActiveSection('sovereign-vault')}
            className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition ${
              activeSection === 'sovereign-vault' ? 'bg-[#0f172a] text-white' : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>خزنة السيادة والخصوصية</span>
          </button>
        </div>
      )}
    </div>
  );
};
