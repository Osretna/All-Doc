import React, { useState, useEffect, useRef } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Highlighter, 
  Baseline, 
  List, 
  AlignRight, 
  AlignCenter, 
  Copy, 
  Scissors, 
  Clipboard, 
  MessageSquarePlus 
} from 'lucide-react';
import { PageSetup, WatermarkConfig, PageBorderConfig, ViewMode } from '../types/word';
import { executeCommand, insertHTMLAtCursor } from '../utils/editorCommands';

interface DocumentCanvasProps {
  editorRef: React.RefObject<HTMLDivElement | null>;
  onContentChange: () => void;
  pageSetup: PageSetup;
  watermark: WatermarkConfig;
  pageBorder: PageBorderConfig;
  pageColor: string;
  viewMode: ViewMode;
  showGridlines: boolean;
  zoom: number;
  onOpenCommentForSelection: (snippet: string) => void;
  isSplitView?: boolean;
  onToggleSplitView?: () => void;
  onViewModeChange?: (mode: ViewMode) => void;
}

export const DocumentCanvas: React.FC<DocumentCanvasProps> = ({
  editorRef,
  onContentChange,
  pageSetup,
  watermark,
  pageBorder,
  pageColor,
  viewMode,
  showGridlines,
  zoom,
  onOpenCommentForSelection,
  isSplitView = false,
  onToggleSplitView,
  onViewModeChange,
}) => {
  const [miniToolbarPos, setMiniToolbarPos] = useState<{ x: number; y: number } | null>(null);
  const [selectedSnippet, setSelectedSnippet] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle selection for floating mini-toolbar
  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.toString().trim()) {
      setMiniToolbarPos(null);
      return;
    }

    const text = selection.toString().trim();
    setSelectedSnippet(text);

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    if (rect) {
      setMiniToolbarPos({
        x: rect.left + rect.width / 2,
        y: Math.max(10, rect.top - 45),
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.mini-toolbar')) {
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) {
          setMiniToolbarPos(null);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Track and save caret/selection inside document editor for Ribbon paste & commands
  useEffect(() => {
    const handleSelectionChange = () => {
      const sel = window.getSelection();
      const editor = editorRef?.current || document.getElementById('document-editor');
      if (sel && sel.rangeCount > 0 && editor) {
        const r = sel.getRangeAt(0);
        if (editor.contains(r.commonAncestorContainer)) {
          (window as any).__lastWordEditorRange = r.cloneRange();
        }
      }
    };
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, [editorRef]);

  // Determine paper dimensions based on orientation and size
  const isLandscape = pageSetup.orientation === 'landscape';
  const paperWidth = isLandscape ? '1123px' : '794px';
  const paperMinHeight = isLandscape ? '794px' : '1123px';

  // Margins in px (1cm ≈ 37.8px)
  const padTop = `${pageSetup.margins.top * 37.8}px`;
  const padBottom = `${pageSetup.margins.bottom * 37.8}px`;
  const padLeft = `${pageSetup.margins.left * 37.8}px`;
  const padRight = `${pageSetup.margins.right * 37.8}px`;

  // Columns style
  const columnStyle: React.CSSProperties = {
    columnCount: pageSetup.columns,
    columnGap: '28px',
    columnRule: pageSetup.columns > 1 ? '1px dashed #cbd5e1' : 'none',
  };

  return (
    <div 
      ref={containerRef}
      className={`flex-1 overflow-auto bg-[#e5e7eb] p-6 relative transition-colors ${
        showGridlines ? 'show-gridlines' : ''
      }`}
      onMouseUp={handleMouseUp}
    >
      {/* Floating Mini Toolbar */}
      {miniToolbarPos && (
        <div 
          className="mini-toolbar fixed z-50 bg-white border border-slate-300 rounded-lg shadow-xl px-2 py-1 flex items-center gap-1 -translate-x-1/2 animate-in fade-in zoom-in-95 duration-100"
          style={{ top: `${miniToolbarPos.y}px`, left: `${miniToolbarPos.x}px` }}
          dir="rtl"
        >
          <button
            onClick={() => executeCommand('bold')}
            className="p-1 hover:bg-slate-100 rounded text-slate-700"
            title="عريض"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => executeCommand('italic')}
            className="p-1 hover:bg-slate-100 rounded text-slate-700"
            title="مائل"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => executeCommand('underline')}
            className="p-1 hover:bg-slate-100 rounded text-slate-700"
            title="تسطير"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => executeCommand('hiliteColor', '#fef08a')}
            className="p-1 hover:bg-slate-100 rounded text-amber-500"
            title="تمييز أصفر"
          >
            <Highlighter className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => executeCommand('foreColor', '#2b579a')}
            className="p-1 hover:bg-slate-100 rounded text-[#2b579a]"
            title="لون أزرق وورد"
          >
            <Baseline className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onOpenCommentForSelection(selectedSnippet)}
            className="p-1 hover:bg-blue-50 text-[#2b579a] rounded ml-1"
            title="إضافة تعليق"
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Reading Mode Exit Banner */}
      {viewMode === 'read' && (
        <div className="sticky top-0 z-40 bg-slate-900/90 text-white px-5 py-2 rounded-full shadow-xl flex items-center justify-between text-xs max-w-md mx-auto mb-4 backdrop-blur-xs select-none">
          <div className="flex items-center gap-2">
            <span className="text-base">📖</span>
            <span className="font-semibold">وضع القراءة المركز (Reading View)</span>
          </div>
          <button 
            onClick={() => onViewModeChange?.('print')}
            className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-xs font-bold transition-colors cursor-pointer"
          >
            العودة للتحرير ✕
          </button>
        </div>
      )}

      {/* Centered Document Paper Container with Zoom scale */}
      <div 
        className="mx-auto transition-transform origin-top flex flex-col items-center"
        style={{ transform: `scale(${zoom / 100})` }}
      >
        <div
          className={`print-page relative bg-white shadow-xl text-slate-800 transition-all ${
            viewMode === 'web' ? 'w-full max-w-5xl rounded-none shadow-none' : 'rounded-sm'
          }`}
          style={{
            width: viewMode === 'web' ? '100%' : paperWidth,
            minHeight: viewMode === 'web' ? 'auto' : paperMinHeight,
            paddingTop: viewMode === 'draft' ? '20px' : padTop,
            paddingBottom: viewMode === 'draft' ? '20px' : padBottom,
            paddingLeft: padLeft,
            paddingRight: padRight,
            backgroundColor: pageColor || '#ffffff',
            border: pageBorder.enabled 
              ? `${pageBorder.width}px ${pageBorder.style} ${pageBorder.color}` 
              : 'none',
          }}
          dir="rtl"
        >
          {/* Line Numbers Gutter */}
          {pageSetup.lineNumbers && (
            <div 
              className="absolute -right-8 top-16 bottom-16 w-6 select-none pointer-events-none text-left font-mono text-[10px] text-slate-400 flex flex-col justify-around" 
              aria-hidden="true"
            >
              {Array.from({ length: 25 }, (_, i) => (
                <span key={i}>{i + 1}</span>
              ))}
            </div>
          )}

          {/* Watermark Overlay */}
          {watermark.type !== 'none' && watermark.text && (
            <div 
              className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0"
              style={{ opacity: watermark.opacity }}
            >
              <span 
                className="font-extrabold text-7xl sm:text-8xl tracking-widest whitespace-nowrap"
                style={{
                  color: watermark.color,
                  transform: watermark.layout === 'diagonal' ? 'rotate(-40deg)' : 'none',
                }}
              >
                {watermark.text}
              </span>
            </div>
          )}

          {/* Header Zone (Header) */}
          {viewMode !== 'draft' && (
            <div 
              className="border-b border-slate-200/80 pb-2 mb-6 flex items-center justify-between text-xs text-slate-400 select-none"
              contentEditable={false}
            >
              <span id="doc-header-text" className="font-medium text-slate-500">
                مستند عمل رسمي • جمهورية مصر العربية
              </span>
              <span className="font-mono text-[10px] text-slate-400">
                {new Date().toLocaleDateString('ar-EG')}
              </span>
            </div>
          )}

          {/* Real Editable Document Body */}
          <div
            id="document-editor"
            ref={editorRef}
            contentEditable={viewMode !== 'read'}
            suppressContentEditableWarning
            onInput={onContentChange}
            className={`word-editor relative z-10 text-base leading-relaxed text-slate-800 focus:outline-none min-h-[700px] select-text ${
              viewMode === 'outline' ? 'outline-mode' : ''
            }`}
            style={columnStyle}
          >
            <h1 className="text-3xl font-extrabold text-[#2b579a] mb-3 pb-1 border-b-2 border-[#2b579a]/20">
              تقرير استراتيجي شامل: تطوير منظومة الأعمال الرقمية
            </h1>
            <p className="text-slate-500 font-medium mb-4 text-sm">
              وثيقة تنظيمية موحدة صادرة بتاريخ {new Date().toLocaleDateString('ar-EG')}
            </p>

            <h2 className="text-xl font-bold text-slate-800 mt-4 mb-2">
              1. المقدمة والأهداف العامة
            </h2>
            <p className="mb-3 text-justify leading-loose">
              يهدف هذا المستند إلى استعراض أحدث المعايير في تنظيم وإدارة المستندات الرقمية باستخدام أدوات مايكروسوفت وورد المتطورة. يتيح التطبيق تحكماً كاملاً في تنسيقات الخطوط، الفقرات، الجداول التفاعلية، الرسوم البيانية، وإدراج الوسائط مع دعم كامل للطباعة والتصدير بجودة عالية.
            </p>

            <h2 className="text-xl font-bold text-slate-800 mt-5 mb-2">
              2. جدول مؤشرات الأداء والنتائج
            </h2>
            
            <div className="my-4 overflow-x-auto" contentEditable="true">
              <table className="w-full border-collapse border border-slate-300 text-sm">
                <thead>
                  <tr className="bg-[#2b579a] text-white font-bold">
                    <th className="border border-slate-300 p-2.5 text-right">المرحلة</th>
                    <th className="border border-slate-300 p-2.5 text-right">المستهدف</th>
                    <th className="border border-slate-300 p-2.5 text-right">نسبة الإنجاز</th>
                    <th className="border border-slate-300 p-2.5 text-right">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-blue-50/40">
                    <td className="border border-slate-300 p-2">التصميم والواجهة Ribbon</td>
                    <td className="border border-slate-300 p-2">100% مطابقة لمعايير Office</td>
                    <td className="border border-slate-300 p-2 font-mono font-bold text-emerald-600">100%</td>
                    <td className="border border-slate-300 p-2 text-emerald-700 font-bold">مكتمل بنجاح</td>
                  </tr>
                  <tr className="bg-slate-50/50 hover:bg-blue-50/40">
                    <td className="border border-slate-300 p-2">أدوات التحرير والخطوط</td>
                    <td className="border border-slate-300 p-2">دعم كامل لجميع التنسيقات</td>
                    <td className="border border-slate-300 p-2 font-mono font-bold text-emerald-600">100%</td>
                    <td className="border border-slate-300 p-2 text-emerald-700 font-bold">مكتمل بنجاح</td>
                  </tr>
                  <tr className="hover:bg-blue-50/40">
                    <td className="border border-slate-300 p-2">التصدير والطباعة</td>
                    <td className="border border-slate-300 p-2">تصدير Word و PDF</td>
                    <td className="border border-slate-300 p-2 font-mono font-bold text-emerald-600">100%</td>
                    <td className="border border-slate-300 p-2 text-emerald-700 font-bold">مكتمل بنجاح</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <blockquote className="p-3 my-4 bg-blue-50/70 border-r-4 border-[#2b579a] text-slate-700 italic text-sm rounded-l">
              &ldquo;التفاصيل الدقيقة والالتزام بأعلى معايير تجربة المستخدم هي التي تجعل أداة التحرير تجربة سلسة وملهمة.&rdquo;
            </blockquote>

            <p className="mb-3 text-justify leading-loose">
              يمكنك البدء مباشرة في الكتابة، تحرير النصوص، إضافة جداول، تغيير اتجاه الورقة إلى أفقي أو عمودي من تبويب تخطيط، أو إضافة علامة مائية وحدود أنيقة من تبويب تصميم.
            </p>
          </div>

          {/* Footnotes Zone */}
          <div 
            id="document-footnotes-container"
            className="mt-8 pt-3 border-t border-slate-300/80 text-xs text-slate-500 space-y-1 select-text"
            contentEditable={false}
          >
            {/* Populated dynamically when user inserts footnotes */}
          </div>

          {/* Footer Zone (Footer) */}
          {viewMode !== 'draft' && (
            <div 
              className="border-t border-slate-200/80 pt-3 mt-8 flex items-center justify-between text-xs text-slate-400 select-none"
              contentEditable={false}
            >
              <span id="doc-footer-text">وثيقة معتمدة ومحمية بموجب حقوق النشر</span>
              <span className="font-mono">صفحة 1 من 1</span>
            </div>
          )}
        </div>

        {/* Real Split View Secondary Reading & Comparison Window */}
        {isSplitView && (
          <div className="w-full max-w-5xl mt-6 border-2 border-dashed border-blue-400 bg-white rounded-lg p-5 shadow-lg">
            <div className="flex items-center justify-between text-xs text-[#2b579a] font-bold mb-3 pb-2 border-b border-blue-200 select-none">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
                إطار العرض المنقسم (Split Window) - مراجعة وتصفح مواضع متعددة في المستند ذاته
              </span>
              <button 
                onClick={onToggleSplitView}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-0.5 rounded border border-red-200 text-[11px] transition-colors cursor-pointer"
              >
                إغلاق التقسيم ✕
              </button>
            </div>
            <div 
              className="max-h-72 overflow-y-auto p-4 bg-slate-50/70 rounded border border-slate-200 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: editorRef.current?.innerHTML || '<p class="text-slate-400">جاري تحميل المحتوى المنقسم...</p>' }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
