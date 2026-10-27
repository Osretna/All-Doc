import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { RibbonTab, PageSetup, WatermarkConfig, PageBorderConfig, ViewMode } from '../types/word';
import { HomeTab } from './ribbon-tabs/HomeTab';
import { InsertTab } from './ribbon-tabs/InsertTab';
import { DesignTab } from './ribbon-tabs/DesignTab';
import { LayoutTab } from './ribbon-tabs/LayoutTab';
import { ReferencesTab } from './ribbon-tabs/ReferencesTab';
import { MailingsTab } from './ribbon-tabs/MailingsTab';
import { ReviewTab } from './ribbon-tabs/ReviewTab';
import { ViewTab } from './ribbon-tabs/ViewTab';

interface RibbonProps {
  activeTab: RibbonTab;
  onTabChange: (tab: RibbonTab) => void;
  onOpenFileMenu: () => void;
  // Modals & triggers
  onOpenFind: () => void;
  onOpenReplace: () => void;
  onOpenTableModal: () => void;
  onOpenShapeModal: () => void;
  onOpenSymbolModal: (tab: 'symbol' | 'equation') => void;
  onOpenComments: () => void;
  onOpenWatermarkModal: () => void;
  onOpenPageBordersModal: () => void;
  pageColor: string;
  onPageColorChange: (color: string) => void;
  onApplyTheme: (themeName: string) => void;
  pageSetup: PageSetup;
  onUpdatePageSetup: (newSetup: Partial<PageSetup>) => void;
  onOpenWordCount: () => void;
  editorRef: React.RefObject<HTMLDivElement | null>;
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

export const Ribbon: React.FC<RibbonProps> = ({
  activeTab,
  onTabChange,
  onOpenFileMenu,
  onOpenFind,
  onOpenReplace,
  onOpenTableModal,
  onOpenShapeModal,
  onOpenSymbolModal,
  onOpenComments,
  onOpenWatermarkModal,
  onOpenPageBordersModal,
  pageColor,
  onPageColorChange,
  onApplyTheme,
  pageSetup,
  onUpdatePageSetup,
  onOpenWordCount,
  editorRef,
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
  const [isRibbonCollapsed, setIsRibbonCollapsed] = useState(false);

  const tabs: { id: RibbonTab; label: string; shortcut?: string }[] = [
    { id: 'home', label: 'الرئيسية (Home)' },
    { id: 'insert', label: 'إدراج (Insert)' },
    { id: 'design', label: 'تصميم (Design)' },
    { id: 'layout', label: 'تخطيط (Layout)' },
    { id: 'references', label: 'مراجع (References)' },
    { id: 'mailings', label: 'مراسلات (Mailings)' },
    { id: 'review', label: 'مراجعة (Review)' },
    { id: 'view', label: 'عرض (View)' },
  ];

  return (
    <div className="bg-[#f3f4f6] border-b border-slate-300 shadow-xs z-20 shrink-0" dir="rtl">
      {/* 1. Ribbon Tab Headers Row */}
      <div className="flex items-center justify-between px-2 pt-1 border-b border-slate-200">
        <div className="flex items-center gap-0.5 overflow-x-auto">
          {/* File (ملف) Button */}
          <button
            onClick={onOpenFileMenu}
            className="px-4 py-1.5 bg-[#2b579a] hover:bg-[#20447c] text-white font-bold text-xs rounded-t transition-colors shadow-2xs ml-2 flex items-center gap-1"
          >
            <span>ملف</span>
            <span className="text-[10px] text-blue-200">(File)</span>
          </button>

          {/* Ribbon Tabs */}
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  onTabChange(tab.id);
                  if (isRibbonCollapsed) setIsRibbonCollapsed(false);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-t transition-all relative border-t-2 ${
                  isActive
                    ? 'bg-white text-[#2b579a] font-bold border-[#2b579a] shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60 border-transparent'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Collapse Ribbon Toggle */}
        <button
          onClick={() => setIsRibbonCollapsed(!isRibbonCollapsed)}
          className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-800 transition-colors"
          title={isRibbonCollapsed ? 'توسيع الشريط (Ctrl + F1)' : 'طي الشريط (Ctrl + F1)'}
        >
          {isRibbonCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* 2. Ribbon Commands Area */}
      {!isRibbonCollapsed && (
        <div className="bg-white border-b border-slate-300 px-1 shadow-inner">
          {activeTab === 'home' && (
            <HomeTab
              onOpenFind={onOpenFind}
              onOpenReplace={onOpenReplace}
              onOpenBordersDialog={onOpenPageBordersModal}
            />
          )}

          {activeTab === 'insert' && (
            <InsertTab
              onOpenTableModal={onOpenTableModal}
              onOpenShapeModal={onOpenShapeModal}
              onOpenSymbolModal={onOpenSymbolModal}
              onOpenComments={onOpenComments}
            />
          )}

          {activeTab === 'design' && (
            <DesignTab
              onOpenWatermarkModal={onOpenWatermarkModal}
              onOpenPageBordersModal={onOpenPageBordersModal}
              pageColor={pageColor}
              onPageColorChange={onPageColorChange}
              onApplyTheme={onApplyTheme}
            />
          )}

          {activeTab === 'layout' && (
            <LayoutTab
              pageSetup={pageSetup}
              onUpdatePageSetup={onUpdatePageSetup}
            />
          )}

          {activeTab === 'references' && (
            <ReferencesTab />
          )}

          {activeTab === 'mailings' && (
            <MailingsTab />
          )}

          {activeTab === 'review' && (
            <ReviewTab
              onOpenComments={onOpenComments}
              onOpenWordCount={onOpenWordCount}
              editorRef={editorRef}
            />
          )}

          {activeTab === 'view' && (
            <ViewTab
              viewMode={viewMode}
              onViewModeChange={onViewModeChange}
              showRuler={showRuler}
              onToggleRuler={onToggleRuler}
              showGridlines={showGridlines}
              onToggleGridlines={onToggleGridlines}
              showNavigationPane={showNavigationPane}
              onToggleNavigationPane={onToggleNavigationPane}
              zoom={zoom}
              onZoomChange={onZoomChange}
              onOpenMacros={onOpenMacros}
            />
          )}
        </div>
      )}
    </div>
  );
};
