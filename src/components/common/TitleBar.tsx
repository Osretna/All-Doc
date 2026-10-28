import React, { useState } from 'react';
import {
  Save,
  Printer,
  Download,
  Upload,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  FileText
} from 'lucide-react';
import { OfficeAppId, OfficeSection } from '../../types/office';

interface Props {
  activeApp: OfficeAppId;
  setActiveApp: (app: OfficeAppId) => void;
  activeSection: OfficeSection;
  setActiveSection: (sec: OfficeSection) => void;
  documentTitle: string;
  setDocumentTitle: (title: string) => void;
  onOpenBackstage: () => void;
  onUploadFile: (file: File) => void;
  onSaveToDevice: () => void;
  onPrintIsolated: () => void;
  isSaved?: boolean;
  autoSaveCountdown?: number;
  onQuickSave: () => void;
}

export const APPS_CONFIG: { id: OfficeAppId; label: string; en: string; color: string; badge: string }[] = [
  { id: 'docs', label: 'Word (المستندات)', en: 'Word', color: '#0078d4', badge: 'W' },
  { id: 'sheets', label: 'Excel (الجداول)', en: 'Excel', color: '#107c41', badge: 'X' },
  { id: 'slides', label: 'PowerPoint (العروض)', en: 'PowerPoint', color: '#d83b01', badge: 'P' },
  { id: 'base', label: 'Access (قواعد البيانات)', en: 'Access', color: '#a4373a', badge: 'A' },
  { id: 'notes', label: 'OneNote (الملاحظات)', en: 'OneNote', color: '#7719aa', badge: 'N' },
  { id: 'pdf', label: 'PDF Studio (أكروبات)', en: 'Acrobat', color: '#e81123', badge: 'PDF' },
  { id: 'photo', label: 'Photo Studio (فوتوشوب)', en: 'Photoshop', color: '#002050', badge: 'PS' }
];

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
  isSaved = true,
  autoSaveCountdown = 300,
  onQuickSave,
}) => {
  const currentAppConfig = APPS_CONFIG.find(a => a.id === activeApp) || APPS_CONFIG[1];

  return (
    <div className="bg-[#f3f2f1] border-b border-[#e1dfdd] select-none text-[#323130] text-xs no-print title-bar-container" data-no-print="true">
      {/* Top Header Row */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-white border-b border-gray-200">
        {/* Left: Suite Logo & App Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {/* Logo */}
          <div
            onClick={onOpenBackstage}
            className="flex items-center gap-2 cursor-pointer pr-1 pl-2 hover:bg-gray-100 rounded-lg py-1 transition shrink-0"
            title="فتح قائمة ملف و إدارة المستندات"
          >
            <div className="w-6 h-6 rounded bg-gradient-to-tr from-[#0078d4] via-[#00a4ef] to-[#107c41] flex items-center justify-center text-white font-extrabold text-xs shadow-xs">
              ∞
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-black text-[13px] tracking-tight text-gray-900">MY-DOC</span>
              <span className="text-[8px] text-[#0078d4] font-bold">SOVEREIGN SUITE</span>
            </div>
          </div>

          <div className="h-5 w-[1px] bg-gray-200 mx-1 hidden sm:block" />

          {/* Office Apps Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {APPS_CONFIG.map(app => {
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
                      ? 'text-white shadow-xs border-transparent'
                      : 'bg-gray-50/80 hover:bg-gray-100 text-gray-700 border-gray-200'
                  }`}
                  style={isActive ? { backgroundColor: app.color } : {}}
                  title={`فتح تطبيق ${app.label}`}
                >
                  <span
                    className={`w-4 h-4 rounded text-[9px] font-black flex items-center justify-center ${
                      isActive ? 'bg-white text-gray-900' : 'text-white'
                    }`}
                    style={isActive ? {} : { backgroundColor: app.color }}
                  >
                    {app.badge}
                  </span>
                  <span>{app.en}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Sovereign Vault Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <div
            onClick={() => setActiveSection('sovereign-vault')}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-[11px] font-bold cursor-pointer hover:bg-emerald-100 transition"
            title="الوضع السيادي: 100% أوفلاين مع حفظ محلي مشفر"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>سيادي 100% أوفلاين</span>
          </div>
        </div>
      </div>

      {/* Second Row: Quick Action Toolbar & Document Name */}
      <div className="flex items-center justify-between px-3 py-1 bg-[#f3f2f1] text-[11px] quick-toolbar">
        {/* Quick Toolbar Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={onQuickSave}
            className="p-1 hover:bg-gray-200 rounded text-gray-700 flex items-center gap-1 cursor-pointer"
            title="حفظ سريع (Ctrl+S)"
          >
            <Save className="w-3.5 h-3.5 text-emerald-700" />
            <span className="font-semibold text-[10px]">حفظ</span>
          </button>

          <button
            onClick={onSaveToDevice}
            className="p-1 hover:bg-gray-200 rounded text-gray-700 flex items-center gap-1 cursor-pointer"
            title="تصدير وحفظ على جهازك"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline text-[10px]">تصدير</span>
          </button>

          <label className="p-1 hover:bg-gray-200 rounded text-gray-700 flex items-center gap-1 cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-purple-600" />
            <span className="hidden sm:inline text-[10px]">فتح ملف</span>
            <input
              type="file"
              className="hidden"
              onChange={e => {
                const f = e.target.files?.[0];
                if (f) onUploadFile(f);
                e.target.value = '';
              }}
            />
          </label>

          <button
            onClick={onPrintIsolated}
            className="p-1 hover:bg-gray-200 rounded text-gray-700 flex items-center gap-1 cursor-pointer"
            title="طباعة (Ctrl+P)"
          >
            <Printer className="w-3.5 h-3.5 text-gray-600" />
            <span className="hidden sm:inline text-[10px]">طباعة</span>
          </button>
        </div>

        {/* Center: Document Title Input */}
        <div className="flex items-center gap-1.5 flex-1 max-w-sm mx-4">
          <input
            type="text"
            value={documentTitle}
            onChange={e => setDocumentTitle(e.target.value)}
            className="w-full text-center font-bold text-xs bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-gray-300 focus:border-blue-500 rounded px-2 py-0.5 outline-none text-gray-800 transition"
            title="انقر لتعديل اسم المستند"
          />
        </div>

        {/* Right: AutoSave Status */}
        <div className="flex items-center gap-2 text-gray-500 text-[10px]">
          <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-gray-200">
            {isSaved ? (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-700 font-medium">تم الحفظ تلقائياً</span>
              </>
            ) : (
              <>
                <Clock className="w-3 h-3 text-amber-500 animate-spin" />
                <span>جاري الحفظ...</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
