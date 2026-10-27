import React from 'react';
import {
  FileText, FileSpreadsheet, Presentation, Database, FileCheck,
  Grid, Sparkles, Printer, Save, UploadCloud, Info
} from 'lucide-react';

export type ActiveApp = 'word' | 'excel' | 'powerpoint' | 'access' | 'pdf';

interface HeaderProps {
  activeApp: ActiveApp;
  onSelectApp: (app: ActiveApp) => void;
  onOpenHelpModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeApp, onSelectApp, onOpenHelpModal }) => {
  const apps = [
    {
      id: 'word' as ActiveApp,
      title: 'وورد (Word)',
      ext: '.docx',
      icon: FileText,
      color: 'bg-blue-600',
      activeText: 'text-blue-700',
      activeBg: 'bg-blue-50 border-blue-600/30',
    },
    {
      id: 'excel' as ActiveApp,
      title: 'إكسل (Excel)',
      ext: '.xlsx',
      icon: FileSpreadsheet,
      color: 'bg-emerald-600',
      activeText: 'text-emerald-700',
      activeBg: 'bg-emerald-50 border-emerald-600/30',
    },
    {
      id: 'powerpoint' as ActiveApp,
      title: 'باور بوينت (PowerPoint)',
      ext: '.pptx',
      icon: Presentation,
      color: 'bg-orange-600',
      activeText: 'text-orange-700',
      activeBg: 'bg-orange-50 border-orange-600/30',
    },
    {
      id: 'access' as ActiveApp,
      title: 'أكسس (Access)',
      ext: '.accdb',
      icon: Database,
      color: 'bg-red-900',
      activeText: 'text-red-950',
      activeBg: 'bg-red-50 border-red-900/30',
    },
    {
      id: 'pdf' as ActiveApp,
      title: 'بيدي إف (PDF)',
      ext: '.pdf',
      icon: FileCheck,
      color: 'bg-red-600',
      activeText: 'text-red-700',
      activeBg: 'bg-red-50 border-red-600/30',
    },
  ];

  return (
    <header className="bg-slate-900 text-white select-none border-b border-slate-800 shrink-0 no-print" dir="rtl">
      {/* Top Application Bar */}
      <div className="flex items-center justify-between px-3 sm:px-6 py-2">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Grid className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg tracking-tight">Office Suite Pro</span>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full font-semibold">
                حزمة أوفيس المتكاملة
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              معالجة ورفع المستندات باحترافية • طباعة المحتوى فقط • حفظ مباشر على الجهاز بالامتداد الأصلي
            </p>
          </div>
        </div>

        {/* Feature Badges & Help */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenHelpModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors border border-slate-700 cursor-pointer"
            title="دليل الميزات ورفع وحفظ الملفات"
          >
            <Info className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">دليل الاستخدام والميزات</span>
          </button>
        </div>
      </div>

      {/* Office Suite App Tabs */}
      <div className="flex items-center px-2 sm:px-6 bg-slate-950/70 border-t border-slate-800/80 overflow-x-auto gap-1 sm:gap-2 py-1.5">
        {apps.map(app => {
          const Icon = app.icon;
          const isActive = activeApp === app.id;

          return (
            <button
              key={app.id}
              onClick={() => onSelectApp(app.id)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border shrink-0 ${
                isActive
                  ? 'bg-white text-slate-900 shadow-md border-white'
                  : 'bg-transparent text-slate-400 border-transparent hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-lg ${app.color} flex items-center justify-center text-white shrink-0 shadow-xs`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span>{app.title}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  isActive ? 'bg-slate-100 text-slate-700' : 'bg-slate-800 text-slate-500'
                }`}
              >
                {app.ext}
              </span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
