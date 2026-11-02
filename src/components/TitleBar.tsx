import React, { useState } from 'react';
import { 
  Save, 
  RotateCcw, 
  RotateCw, 
  Printer, 
  Search, 
  User, 
  Minus, 
  Square, 
  X,
  ChevronDown,
  CloudCheck,
  Share2,
  FileText
} from 'lucide-react';

interface TitleBarProps {
  documentTitle: string;
  onTitleChange: (newTitle: string) => void;
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onPrint: () => void;
  onOpenSearch: () => void;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  documentTitle,
  onTitleChange,
  onSave,
  onUndo,
  onRedo,
  onPrint,
  onOpenSearch,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(documentTitle);
  const [saveToast, setSaveToast] = useState(false);

  const handleSaveClick = () => {
    onSave();
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const submitTitle = () => {
    setIsEditingTitle(false);
    if (titleInput.trim()) {
      onTitleChange(titleInput.trim());
    } else {
      setTitleInput(documentTitle);
    }
  };

  return (
    <header 
      className="h-10 bg-[#2b579a] text-white flex items-center justify-between px-3 select-none text-xs border-b border-[#20447c] shadow-xs z-30"
      dir="rtl"
    >
      {/* Zone 1: Quick Access Toolbar + Word Icon */}
      <div className="flex items-center gap-1">
        {/* Word Document Icon */}
        <div className="flex items-center gap-1.5 pl-2 ml-1 border-l border-white/20">
          <div className="w-5 h-5 bg-white text-[#2b579a] rounded flex items-center justify-center font-bold text-xs shadow-xs">
            W
          </div>
          <span className="font-semibold hidden sm:inline tracking-tight text-white/95">Word</span>
        </div>

        {/* Quick Access Toolbar */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={handleSaveClick}
            className="p-1.5 hover:bg-white/15 rounded text-white/90 hover:text-white transition-colors relative"
            title="حفظ (Ctrl + S)"
          >
            <Save className="w-3.5 h-3.5" />
            {saveToast && (
              <span className="absolute -bottom-7 right-0 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded shadow whitespace-nowrap z-50">
                تم الحفظ!
              </span>
            )}
          </button>
          <button
            onClick={onUndo}
            className="p-1.5 hover:bg-white/15 rounded text-white/90 hover:text-white transition-colors"
            title="تراجع (Ctrl + Z)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onRedo}
            className="p-1.5 hover:bg-white/15 rounded text-white/90 hover:text-white transition-colors"
            title="إعادة (Ctrl + Y)"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onPrint}
            className="p-1.5 hover:bg-white/15 rounded text-white/90 hover:text-white transition-colors"
            title="طباعة سريعة (Ctrl + P)"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Zone 2: Title and Status Center */}
      <div className="flex items-center gap-2 max-w-md">
        {isEditingTitle ? (
          <input
            type="text"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            onBlur={submitTitle}
            onKeyDown={(e) => e.key === 'Enter' && submitTitle()}
            autoFocus
            className="bg-white text-slate-900 px-2 py-0.5 rounded text-xs font-medium outline-none text-center shadow-inner"
          />
        ) : (
          <button
            onClick={() => setIsEditingTitle(true)}
            className="hover:bg-white/15 px-2.5 py-1 rounded font-medium flex items-center gap-1.5 text-white/95 hover:text-white transition-colors"
            title="انقر لتعديل اسم المستند"
          >
            <span className="font-bold">{documentTitle}</span>
            <span className="text-[10px] text-white/70 font-normal">- تم الحفظ</span>
          </button>
        )}
      </div>

      {/* Zone 3: Search + User + Controls */}
      <div className="flex items-center gap-2">
        {/* Tell me search */}
        <button
          onClick={onOpenSearch}
          className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/15 hover:bg-white/25 rounded text-white/80 hover:text-white transition-colors text-[11px]"
        >
          <Search className="w-3.5 h-3.5" />
          <span>أخبرني بما تريد القيام به... (Alt + Q)</span>
        </button>

        {/* Share Button */}
        <button
          onClick={() => {
            if (navigator.clipboard) {
              navigator.clipboard.writeText(window.location.href);
              alert('تم نسخ رابط مشاركة المستند إلى الحافظة!');
            }
          }}
          className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-white/15 hover:bg-white/25 rounded text-white text-[11px] font-medium transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>مشاركة</span>
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-1 p-1 hover:bg-white/15 rounded cursor-pointer" title="حساب المستخدم">
          <div className="w-6 h-6 rounded-full bg-blue-300 text-[#2b579a] flex items-center justify-center font-bold text-xs">
            أ
          </div>
        </div>

        {/* Window Controls */}
        <div className="flex items-center gap-0.5 mr-1 border-r border-white/20 pr-1">
          <button 
            className="p-1 hover:bg-white/15 text-white/80 hover:text-white transition-colors rounded"
            title="تصغير"
          >
            <Minus className="w-3 h-3" />
          </button>
          <button 
            className="p-1 hover:bg-white/15 text-white/80 hover:text-white transition-colors rounded"
            title="تكبير / استعادة"
          >
            <Square className="w-2.5 h-2.5" />
          </button>
          <button 
            className="p-1 hover:bg-rose-600 text-white/80 hover:text-white transition-colors rounded"
            title="إغلاق"
            onClick={() => {
              if (confirm('هل تريد حفظ التغييرات قبل الخروج؟')) {
                onSave();
              }
            }}
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    </header>
  );
};
