import React from 'react';
import { 
  BookOpen, 
  FileText, 
  Globe, 
  ListTree, 
  FileCode, 
  Ruler, 
  Grid3X3, 
  PanelRight, 
  ZoomIn, 
  Percent, 
  File, 
  Files, 
  Maximize, 
  AppWindow, 
  Split, 
  Columns, 
  Code2 
} from 'lucide-react';
import { ViewMode } from '../../types/word';

interface ViewTabProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  showRuler: boolean;
  onToggleRuler: () => void;
  showGridlines: boolean;
  onToggleGridlines: () => void;
  showNavigationPane: boolean;
  onToggleNavigationPane: () => void;
  zoom: number;
  onZoomChange: (newZoom: number) => void;
  onOpenMacros: () => void;
}

export const ViewTab: React.FC<ViewTabProps> = ({
  viewMode,
  onViewModeChange,
  showRuler,
  onToggleRuler,
  showGridlines,
  onToggleGridlines,
  showNavigationPane,
  onToggleNavigationPane,
  zoom,
  onZoomChange,
  onOpenMacros,
}) => {
  return (
    <div className="flex items-stretch h-[96px] py-1 px-2 overflow-x-auto text-slate-700 select-none divide-x divide-x-reverse divide-slate-200" dir="rtl">
      
      {/* 1. Views (طرق العرض) */}
      <div className="flex flex-col justify-between px-3 min-w-[270px] shrink-0">
        <div className="flex items-center gap-1.5 py-1">
          <button
            onClick={() => onViewModeChange('read')}
            className={`flex flex-col items-center p-1 rounded text-center transition-colors ${
              viewMode === 'read' ? 'bg-blue-100 text-[#2b579a] font-bold' : 'hover:bg-slate-200 text-slate-700'
            }`}
            title="وضع القراءة في ملء الشاشة"
          >
            <BookOpen className="w-4 h-4 mb-1" />
            <span className="text-[10px]">وضع القراءة</span>
          </button>

          <button
            onClick={() => onViewModeChange('print')}
            className={`flex flex-col items-center p-1 rounded text-center transition-colors ${
              viewMode === 'print' ? 'bg-blue-100 text-[#2b579a] font-bold' : 'hover:bg-slate-200 text-slate-700'
            }`}
            title="تخطيط الطباعة (الافتراضي مع حواف الورقة)"
          >
            <FileText className="w-4 h-4 mb-1" />
            <span className="text-[10px]">تخطيط الطباعة</span>
          </button>

          <button
            onClick={() => onViewModeChange('web')}
            className={`flex flex-col items-center p-1 rounded text-center transition-colors ${
              viewMode === 'web' ? 'bg-blue-100 text-[#2b579a] font-bold' : 'hover:bg-slate-200 text-slate-700'
            }`}
            title="تخطيط الويب (عرض مستمر)"
          >
            <Globe className="w-4 h-4 mb-1" />
            <span className="text-[10px]">تخطيط الويب</span>
          </button>

          <button
            onClick={() => onViewModeChange('outline')}
            className={`flex flex-col items-center p-1 rounded text-center transition-colors ${
              viewMode === 'outline' ? 'bg-blue-100 text-[#2b579a] font-bold' : 'hover:bg-slate-200 text-slate-700'
            }`}
            title="مخطط تفصيلي"
          >
            <ListTree className="w-4 h-4 mb-1" />
            <span className="text-[10px]">مخطط تفصيلي</span>
          </button>

          <button
            onClick={() => onViewModeChange('draft')}
            className={`flex flex-col items-center p-1 rounded text-center transition-colors ${
              viewMode === 'draft' ? 'bg-blue-100 text-[#2b579a] font-bold' : 'hover:bg-slate-200 text-slate-700'
            }`}
            title="مسودة سريعة"
          >
            <FileCode className="w-4 h-4 mb-1" />
            <span className="text-[10px]">مسودة</span>
          </button>
        </div>
        <span className="text-[10px] text-slate-400 text-center font-medium">طرق العرض (Views)</span>
      </div>

      {/* 2. Show (إظهار) */}
      <div className="flex flex-col justify-between px-3 min-w-[150px] shrink-0">
        <div className="space-y-1 py-1 text-xs">
          <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
            <input
              type="checkbox"
              checked={showRuler}
              onChange={onToggleRuler}
              className="rounded border-slate-300 text-[#2b579a] focus:ring-[#2b579a]"
            />
            <span className="text-[11px] font-medium">المسطرة (Ruler)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
            <input
              type="checkbox"
              checked={showGridlines}
              onChange={onToggleGridlines}
              className="rounded border-slate-300 text-[#2b579a] focus:ring-[#2b579a]"
            />
            <span className="text-[11px] font-medium">خطوط الشبكة</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
            <input
              type="checkbox"
              checked={showNavigationPane}
              onChange={onToggleNavigationPane}
              className="rounded border-slate-300 text-[#2b579a] focus:ring-[#2b579a]"
            />
            <span className="text-[11px] font-medium">جزء التنقل</span>
          </label>
        </div>
        <span className="text-[10px] text-slate-400 text-center font-medium">إظهار (Show)</span>
      </div>

      {/* 3. Zoom (تكبير/تصغير) */}
      <div className="flex flex-col justify-between px-3 min-w-[210px] shrink-0">
        <div className="flex items-center gap-1.5 py-1">
          <button
            onClick={() => onZoomChange(100)}
            className="flex flex-col items-center p-1 hover:bg-slate-200 rounded text-center text-slate-800"
            title="إعادة التكبير إلى 100%"
          >
            <div className="p-1 bg-blue-50 text-[#2b579a] rounded mb-0.5">
              <Percent className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold">100%</span>
          </button>

          <button
            onClick={() => onZoomChange(Math.min(200, zoom + 20))}
            className="flex flex-col items-center p-1 hover:bg-slate-200 rounded text-center text-slate-800"
            title="تكبير"
          >
            <ZoomIn className="w-4 h-4 mb-0.5 text-slate-600" />
            <span className="text-[10px]">تكبير</span>
          </button>

          <button
            onClick={() => onZoomChange(90)}
            className="flex flex-col items-center p-1 hover:bg-slate-200 rounded text-center text-slate-800"
            title="صفحة واحدة"
          >
            <File className="w-4 h-4 mb-0.5 text-slate-600" />
            <span className="text-[10px]">صفحة واحدة</span>
          </button>

          <button
            onClick={() => onZoomChange(70)}
            className="flex flex-col items-center p-1 hover:bg-slate-200 rounded text-center text-slate-800"
            title="صفحات متعددة"
          >
            <Files className="w-4 h-4 mb-0.5 text-slate-600" />
            <span className="text-[10px]">متعددة</span>
          </button>

          <button
            onClick={() => onZoomChange(125)}
            className="flex flex-col items-center p-1 hover:bg-slate-200 rounded text-center text-slate-800"
            title="عرض الصفحة"
          >
            <Maximize className="w-4 h-4 mb-0.5 text-slate-600" />
            <span className="text-[10px]">ملاءمة</span>
          </button>
        </div>
        <span className="text-[10px] text-slate-400 text-center font-medium">تكبير/تصغير (Zoom)</span>
      </div>

      {/* 4. Window (إطار / نافذة) */}
      <div className="flex flex-col justify-between px-3 min-w-[200px] shrink-0">
        <div className="grid grid-cols-2 gap-1 py-1">
          <button
            onClick={() => window.open(window.location.href, '_blank')}
            className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px]"
          >
            <AppWindow className="w-3.5 h-3.5 text-slate-600" />
            <span>نافذة جديدة</span>
          </button>
          <button
            onClick={() => alert('ترتيب النوافذ جنباً إلى جنب')}
            className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px]"
          >
            <Columns className="w-3.5 h-3.5 text-slate-600" />
            <span>ترتيب الكل</span>
          </button>
          <button
            onClick={() => alert('تم تقسيم إطار العرض لمراجعة جزءين مختلفين من المستند معاً')}
            className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px]"
          >
            <Split className="w-3.5 h-3.5 text-slate-600" />
            <span>تقسيم</span>
          </button>
          <button
            onClick={() => alert('التمرير المتزامن مفعل')}
            className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px]"
          >
            <FileText className="w-3.5 h-3.5 text-slate-600" />
            <span>جنباً إلى جنب</span>
          </button>
        </div>
        <span className="text-[10px] text-slate-400 text-center font-medium">نافذة (Window)</span>
      </div>

      {/* 5. Macros (وحدات ماكرو) */}
      <div className="flex flex-col justify-between px-2 min-w-[85px] shrink-0">
        <button
          onClick={onOpenMacros}
          className="flex flex-col items-center justify-center p-2 hover:bg-slate-200 rounded text-slate-800 group my-auto"
          title="وحدات ماكرو (Alt + F8)"
        >
          <div className="w-8 h-8 rounded bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200 group-hover:bg-indigo-100 transition-colors">
            <Code2 className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-medium mt-1">وحدات ماكرو</span>
        </button>
        <span className="text-[10px] text-slate-400 text-center font-medium">ماكرو (Macros)</span>
      </div>

    </div>
  );
};
