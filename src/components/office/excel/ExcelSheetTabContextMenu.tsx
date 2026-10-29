import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  Copy,
  Code,
  Lock,
  Palette,
  EyeOff,
  Eye,
  CheckSquare,
  ChevronRight,
  X
} from 'lucide-react';

interface Props {
  x: number;
  y: number;
  sheetKey: string;
  sheetLabel: string;
  isOnlySheet: boolean;
  hasHiddenSheets: boolean;
  onClose: () => void;
  onInsert: () => void;
  onDelete: (key: string) => void;
  onRename: (key: string) => void;
  onMoveOrCopy: (key: string) => void;
  onViewCode: (key: string) => void;
  onProtectSheet: (key: string) => void;
  onSetTabColor: (key: string, color?: string) => void;
  onHide: (key: string) => void;
  onUnhide: () => void;
  onSelectAllSheets: () => void;
}

const TAB_COLORS = [
  { name: 'بدون لون (Automatic)', value: undefined },
  { name: 'أحمر داكن', value: '#c00000' },
  { name: 'أحمر', value: '#ff0000' },
  { name: 'برتقالي', value: '#ffc000' },
  { name: 'أصفر', value: '#ffff00' },
  { name: 'أخضر فاتح', value: '#92d050' },
  { name: 'أخضر إكسل', value: '#107c41' },
  { name: 'أزرق سماوي', value: '#00b0f0' },
  { name: 'أزرق', value: '#0070c0' },
  { name: 'أزرق داكن', value: '#002060' },
  { name: 'بنفسجي', value: '#7030a0' },
];

export const ExcelSheetTabContextMenu: React.FC<Props> = ({
  x,
  y,
  sheetKey,
  sheetLabel,
  isOnlySheet,
  hasHiddenSheets,
  onClose,
  onInsert,
  onDelete,
  onRename,
  onMoveOrCopy,
  onViewCode,
  onProtectSheet,
  onSetTabColor,
  onHide,
  onUnhide,
  onSelectAllSheets,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [colorFlyoutOpen, setColorFlyoutOpen] = useState(false);

  useEffect(() => {
    const handleDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handleDown);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleDown);
      document.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  // Adjust menu position so it doesn't overflow bottom or right of screen
  const menuWidth = 190;
  const menuHeight = 270;
  const posX = Math.max(10, Math.min(x, window.innerWidth - menuWidth - 15));
  const posY = Math.max(10, Math.min(y - menuHeight, window.innerHeight - menuHeight - 15));

  return (
    <div
      ref={menuRef}
      className="fixed z-[9999] bg-white border border-[#c8c8c8] rounded-xs shadow-xl py-1 w-[185px] text-[12px] text-slate-800 font-sans select-none drop-shadow-2xl"
      style={{
        left: `${posX}px`,
        top: `${posY}px`,
        fontFamily: "'Segoe UI', Tahoma, Arial, sans-serif",
      }}
      dir="ltr"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Insert... */}
      <button
        onClick={() => { onInsert(); onClose(); }}
        className="w-full px-3 py-1 flex items-center gap-2.5 hover:bg-[#e5f1fb] text-left cursor-pointer group"
      >
        <span className="w-4 text-center text-slate-600 font-bold text-xs">+</span>
        <span><span className="underline">I</span>nsert...</span>
      </button>

      {/* Delete */}
      <button
        onClick={() => {
          if (isOnlySheet) {
            alert('لا يمكن حذف ورقة العمل الأخيرة؛ يجب أن يحتوي المصنف على ورقة عمل مرئية واحدة على الأقل.');
            onClose();
            return;
          }
          if (confirm(`هل أنت متأكد من حذف ورقة العمل "${sheetLabel}" نهائياً؟`)) {
            onDelete(sheetKey);
          }
          onClose();
        }}
        className={`w-full px-3 py-1 flex items-center gap-2.5 text-left cursor-pointer group ${
          isOnlySheet ? 'text-slate-400 cursor-not-allowed' : 'hover:bg-[#e5f1fb]'
        }`}
      >
        <div className="w-4 h-4 flex items-center justify-center text-red-600">
          <Trash2 className="w-3.5 h-3.5" />
        </div>
        <span><span className="underline">D</span>elete</span>
      </button>

      {/* Rename */}
      <button
        onClick={() => { onRename(sheetKey); onClose(); }}
        className="w-full px-3 py-1 flex items-center gap-2.5 hover:bg-[#e5f1fb] text-left cursor-pointer group"
      >
        <div className="w-4 h-4 flex items-center justify-center text-slate-600">
          <Edit2 className="w-3 h-3" />
        </div>
        <span><span className="underline">R</span>ename</span>
      </button>

      {/* Move or Copy... */}
      <button
        onClick={() => { onMoveOrCopy(sheetKey); onClose(); }}
        className="w-full px-3 py-1 flex items-center gap-2.5 hover:bg-[#e5f1fb] text-left cursor-pointer group"
      >
        <div className="w-4 h-4 flex items-center justify-center text-slate-600">
          <Copy className="w-3 h-3" />
        </div>
        <span><span className="underline">M</span>ove or Copy...</span>
      </button>

      {/* Separator */}
      <div className="h-[1px] bg-[#e0e0e0] my-1" />

      {/* View Code */}
      <button
        onClick={() => { onViewCode(sheetKey); onClose(); }}
        className="w-full px-3 py-1 flex items-center gap-2.5 hover:bg-[#e5f1fb] text-left cursor-pointer group"
      >
        <div className="w-4 h-4 flex items-center justify-center text-slate-600">
          <Code className="w-3.5 h-3.5" />
        </div>
        <span><span className="underline">V</span>iew Code</span>
      </button>

      {/* Protect Sheet... */}
      <button
        onClick={() => { onProtectSheet(sheetKey); onClose(); }}
        className="w-full px-3 py-1 flex items-center gap-2.5 hover:bg-[#e5f1fb] text-left cursor-pointer group"
      >
        <div className="w-4 h-4 flex items-center justify-center text-amber-600">
          <Lock className="w-3.5 h-3.5" />
        </div>
        <span><span className="underline">P</span>rotect Sheet...</span>
      </button>

      {/* Tab Color ▸ */}
      <div
        className="relative"
        onMouseEnter={() => setColorFlyoutOpen(true)}
        onMouseLeave={() => setColorFlyoutOpen(false)}
      >
        <button
          onClick={() => setColorFlyoutOpen(!colorFlyoutOpen)}
          className="w-full px-3 py-1 flex items-center justify-between hover:bg-[#e5f1fb] text-left cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 flex items-center justify-center text-emerald-600">
              <Palette className="w-3.5 h-3.5" />
            </div>
            <span><span className="underline">T</span>ab Color</span>
          </div>
          <ChevronRight className="w-3 h-3 text-slate-500" />
        </button>

        {/* Tab Color Palette Flyout */}
        {colorFlyoutOpen && (
          <div
            className="absolute left-[98%] bottom-0 bg-white border border-[#c8c8c8] rounded-xs shadow-xl p-2 w-[160px] z-50 text-xs"
            onMouseDown={(e) => e.preventDefault()}
          >
            <div className="text-[10px] text-slate-500 font-bold mb-1.5 px-1">ألوان علامات التبويب:</div>
            <div className="grid grid-cols-5 gap-1.5 mb-2">
              {TAB_COLORS.filter(c => c.value).map((c) => (
                <button
                  key={c.value}
                  onClick={() => {
                    onSetTabColor(sheetKey, c.value);
                    onClose();
                  }}
                  className="w-5 h-5 rounded-xs border border-slate-300 hover:scale-115 transition cursor-pointer"
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
            </div>
            <button
              onClick={() => {
                onSetTabColor(sheetKey, undefined);
                onClose();
              }}
              className="w-full text-left px-1.5 py-1 hover:bg-[#e5f1fb] text-[11px] text-slate-700 rounded-xs block border-t border-slate-100"
            >
              بدون لون (No Color)
            </button>
          </div>
        )}
      </div>

      {/* Separator */}
      <div className="h-[1px] bg-[#e0e0e0] my-1" />

      {/* Hide */}
      <button
        onClick={() => {
          if (isOnlySheet) {
            alert('لا يمكن إخفاء ورقة العمل الوحيدة؛ يجب أن يحتوي المصنف على ورقة عمل واحدة مرئية على الأقل.');
            onClose();
            return;
          }
          onHide(sheetKey);
          onClose();
        }}
        className={`w-full px-3 py-1 flex items-center gap-2.5 text-left cursor-pointer group ${
          isOnlySheet ? 'text-slate-400 cursor-not-allowed' : 'hover:bg-[#e5f1fb]'
        }`}
      >
        <div className="w-4 h-4 flex items-center justify-center text-slate-500">
          <EyeOff className="w-3.5 h-3.5" />
        </div>
        <span><span className="underline">H</span>ide</span>
      </button>

      {/* Unhide... */}
      <button
        onClick={() => {
          if (!hasHiddenSheets) {
            alert('لا توجد أوراق عمل مخفية في هذا المصنف.');
            onClose();
            return;
          }
          onUnhide();
          onClose();
        }}
        className={`w-full px-3 py-1 flex items-center gap-2.5 text-left cursor-pointer group ${
          !hasHiddenSheets ? 'text-slate-400 cursor-not-allowed' : 'hover:bg-[#e5f1fb]'
        }`}
      >
        <div className="w-4 h-4 flex items-center justify-center text-slate-500">
          <Eye className="w-3.5 h-3.5" />
        </div>
        <span><span className="underline">U</span>nhide...</span>
      </button>

      {/* Separator */}
      <div className="h-[1px] bg-[#e0e0e0] my-1" />

      {/* Select All Sheets */}
      <button
        onClick={() => { onSelectAllSheets(); onClose(); }}
        className="w-full px-3 py-1 flex items-center gap-2.5 hover:bg-[#e5f1fb] text-left cursor-pointer group"
      >
        <div className="w-4 h-4 flex items-center justify-center text-slate-500">
          <CheckSquare className="w-3.5 h-3.5" />
        </div>
        <span><span className="underline">S</span>elect All Sheets</span>
      </button>
    </div>
  );
};
