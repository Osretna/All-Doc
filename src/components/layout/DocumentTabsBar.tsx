import React, { useState } from 'react';
import { OfficeAppId, DocumentTabItem } from '../../types';
import {
  FileText,
  Table,
  Presentation,
  Notebook,
  Database,
  FileCheck2,
  Image as ImageIcon,
  Plus,
  X,
  FileUp,
  Sparkles,
  Edit2,
  Check
} from 'lucide-react';

interface Props {
  activeApp: OfficeAppId;
  tabs: DocumentTabItem[];
  activeTabId: string;
  onSelectTab: (tabId: string) => void;
  onCloseTab: (tabId: string) => void;
  onNewTab: () => void;
  onUploadFile?: (file: File) => void;
  onRenameTab?: (tabId: string, newTitle: string) => void;
}

export const DocumentTabsBar: React.FC<Props> = ({
  activeApp,
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onNewTab,
  onUploadFile,
  onRenameTab,
}) => {
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const getAppStyle = (app: OfficeAppId) => {
    switch (app) {
      case 'docs':
        return {
          color: '#0078d4',
          badge: 'W',
          name: 'Word',
          icon: <FileText className="w-3.5 h-3.5 text-[#0078d4]" />,
          accentBorder: 'border-t-[#0078d4]',
        };
      case 'sheets':
        return {
          color: '#107c41',
          badge: 'X',
          name: 'Excel',
          icon: <Table className="w-3.5 h-3.5 text-[#107c41]" />,
          accentBorder: 'border-t-[#107c41]',
        };
      case 'slides':
        return {
          color: '#d83b01',
          badge: 'P',
          name: 'PowerPoint',
          icon: <Presentation className="w-3.5 h-3.5 text-[#d83b01]" />,
          accentBorder: 'border-t-[#d83b01]',
        };
      case 'pdf':
        return {
          color: '#e81123',
          badge: 'PDF',
          name: 'PDF Studio',
          icon: <FileCheck2 className="w-3.5 h-3.5 text-[#e81123]" />,
          accentBorder: 'border-t-[#e81123]',
        };
      case 'base':
        return {
          color: '#a4373a',
          badge: 'A',
          name: 'Access',
          icon: <Database className="w-3.5 h-3.5 text-[#a4373a]" />,
          accentBorder: 'border-t-[#a4373a]',
        };
      case 'notes':
        return {
          color: '#7719aa',
          badge: 'N',
          name: 'OneNote',
          icon: <Notebook className="w-3.5 h-3.5 text-[#7719aa]" />,
          accentBorder: 'border-t-[#7719aa]',
        };
      case 'photo':
        return {
          color: '#002050',
          badge: 'PS',
          name: 'Photoshop',
          icon: <ImageIcon className="w-3.5 h-3.5 text-[#002050]" />,
          accentBorder: 'border-t-[#002050]',
        };
    }
  };

  const handleStartRename = (tab: DocumentTabItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTabId(tab.id);
    setEditingTitle(tab.title);
  };

  const handleFinishRename = (tabId: string) => {
    if (editingTitle.trim() && onRenameTab) {
      onRenameTab(tabId, editingTitle.trim());
    }
    setEditingTabId(null);
  };

  const currentAppStyle = getAppStyle(activeApp);

  return (
    <div className="bg-[#edebe9] border-b border-[#d2d0ce] px-2 flex items-center justify-between text-xs select-none h-9 overflow-x-auto no-print">
      {/* Left side: Tabs List & Add New Button */}
      <div className="flex items-center gap-1 overflow-x-auto max-w-[85vw] py-1">
        {tabs.filter((t) => t.appId === activeApp).map((tab) => {
          const isActive = tab.id === activeTabId;
          const isEditing = editingTabId === tab.id;
          const tabStyle = getAppStyle(tab.appId);

          return (
            <div
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              onDoubleClick={(e) => handleStartRename(tab, e)}
              className={`group flex items-center gap-2 px-3 py-1 rounded-t-md text-xs font-medium cursor-pointer transition-all border-t-2 shrink-0 ${
                isActive
                  ? `bg-white text-gray-900 shadow-xs ${tabStyle.accentBorder} font-bold z-10`
                  : 'bg-[#e1dfdd] hover:bg-[#f3f2f1] text-gray-700 border-t-transparent'
              }`}
              style={{ minWidth: '120px', maxWidth: '220px' }}
              title={`مستند: ${tab.title} (انقر نقراً مزدوجاً لإعادة التسمية)`}
            >
              <div className="shrink-0">{tabStyle.icon}</div>

              {isEditing ? (
                <div
                  className="flex items-center gap-1 flex-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleFinishRename(tab.id);
                      if (e.key === 'Escape') setEditingTabId(null);
                    }}
                    autoFocus
                    className="w-full bg-white border border-blue-500 rounded px-1 py-0.5 text-xs text-gray-900 outline-none"
                  />
                  <button
                    onClick={() => handleFinishRename(tab.id)}
                    className="p-0.5 text-emerald-600 hover:bg-emerald-50 rounded"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <span className="truncate flex-1 text-[11px]">{tab.title}</span>
              )}

              {/* Close Tab Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(tab.id);
                }}
                className="p-0.5 rounded hover:bg-gray-200 text-gray-500 hover:text-red-600 transition shrink-0 opacity-70 group-hover:opacity-100"
                title="إغلاق هذا الملف (X)"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}

        {/* Plus (+) Button for New Blank Document */}
        <button
          onClick={onNewTab}
          className="p-1.5 hover:bg-white text-gray-700 hover:text-[#107c41] rounded-md transition cursor-pointer flex items-center justify-center shrink-0 border border-transparent hover:border-gray-300 shadow-2xs"
          title={`فتح ملف جديد فارغ في ${currentAppStyle.name} (+)`}
        >
          <Plus className="w-4 h-4 font-bold" />
        </button>

        {/* Open/Upload File Button directly from tab bar */}
        {onUploadFile && (
          <label className="p-1.5 hover:bg-white text-gray-700 hover:text-blue-600 rounded-md transition cursor-pointer flex items-center justify-center shrink-0 border border-transparent hover:border-gray-300 shadow-2xs" title="فتح ملف من هذا الجهاز كصفحة عمل جديدة">
            <FileUp className="w-4 h-4" />
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  onUploadFile(file);
                  e.target.value = '';
                }
              }}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Right side: Active app indicator badge */}
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold text-gray-600 bg-white/70 border border-gray-200 shrink-0">
        <span
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: currentAppStyle.color }}
        />
        <span>{tabs.length} ملفات مفتوحة</span>
      </div>
    </div>
  );
};
