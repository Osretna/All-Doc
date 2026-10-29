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
import { WordContextMenu } from './docs/WordContextMenu';
import { WordFontModal } from './docs/modals/WordFontModal';
import { WordParagraphModal } from './docs/modals/WordParagraphModal';
import { WordSmartLookupModal } from './docs/modals/WordSmartLookupModal';
import { WordTranslateModal } from './docs/modals/WordTranslateModal';
import { WordHyperlinkModal } from './docs/modals/WordHyperlinkModal';

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
  initialHtml?: string;
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
  initialHtml,
}) => {
  const [miniToolbarPos, setMiniToolbarPos] = useState<{ x: number; y: number } | null>(null);
  const [selectedSnippet, setSelectedSnippet] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const savedRangeRef = useRef<Range | null>(null);

  // Word Selection Right-Click Context Menu states
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null);
  const [contextSelectedText, setContextSelectedText] = useState('');
  const [contextTableElement, setContextTableElement] = useState<HTMLTableElement | null>(null);

  // Modals triggered from Word Context Menu
  const [isFontModalOpen, setIsFontModalOpen] = useState(false);
  const [isParagraphModalOpen, setIsParagraphModalOpen] = useState(false);
  const [isSmartLookupOpen, setIsSmartLookupOpen] = useState(false);
  const [isTranslateOpen, setIsTranslateOpen] = useState(false);
  const [isHyperlinkOpen, setIsHyperlinkOpen] = useState(false);

  // Format Painter state
  const [formatPainterStyle, setFormatPainterStyle] = useState<{
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    fontStyle: string;
    color: string;
    backgroundColor: string;
  } | null>(null);

  useEffect(() => {
    if (editorRef.current && initialHtml !== undefined) {
      editorRef.current.innerHTML = initialHtml || '<p><br></p>';
      onContentChange();
    }
  }, [initialHtml]);

  // Save current selection range helper
  const captureCurrentRange = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
      const txt = sel.toString();
      setContextSelectedText(txt);
      return { sel, range: savedRangeRef.current, text: txt };
    }
    return null;
  };

  // Restore saved selection range helper
  const restoreRange = () => {
    if (savedRangeRef.current) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedRangeRef.current);
      }
    }
  };

  // Handle right-click context menu (onContextMenu)
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const sel = window.getSelection();
    let txt = sel ? sel.toString().trim() : '';

    // If no text was explicitly highlighted, try selecting the word under the cursor
    if (!txt && (document as any).caretRangeFromPoint) {
      const caretRange = (document as any).caretRangeFromPoint(e.clientX, e.clientY);
      if (caretRange && editorRef.current?.contains(caretRange.startContainer)) {
        sel?.removeAllRanges();
        sel?.addRange(caretRange);
        try {
          (sel as any)?.modify?.('move', 'backward', 'word');
          (sel as any)?.modify?.('extend', 'forward', 'word');
          txt = sel?.toString().trim() || '';
        } catch {
          // ignore
        }
      }
    }

    if (sel && sel.rangeCount > 0) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    }
    const targetEl = e.target as HTMLElement;
    const tableEl = targetEl?.closest('table') || null;
    setContextTableElement(tableEl);
    setContextSelectedText(txt);
    setSelectedSnippet(txt);
    setMiniToolbarPos(null); // Full context menu already includes the top mini toolbar
    setContextMenuPos({ x: e.clientX, y: e.clientY });
  };

  // Handle selection for floating mini-toolbar & context menu
  const handleMouseUp = () => {
    captureCurrentRange();

    // If Format Painter is primed, apply it to newly selected text!
    if (formatPainterStyle) {
      const sel = window.getSelection();
      if (sel && !sel.isCollapsed && sel.rangeCount > 0) {
        const span = document.createElement('span');
        span.style.fontFamily = formatPainterStyle.fontFamily;
        span.style.fontSize = formatPainterStyle.fontSize;
        span.style.fontWeight = formatPainterStyle.fontWeight;
        span.style.fontStyle = formatPainterStyle.fontStyle;
        span.style.color = formatPainterStyle.color;
        if (formatPainterStyle.backgroundColor && formatPainterStyle.backgroundColor !== 'rgba(0, 0, 0, 0)') {
          span.style.backgroundColor = formatPainterStyle.backgroundColor;
        }

        const range = sel.getRangeAt(0);
        try {
          range.surroundContents(span);
        } catch {
          document.execCommand('fontName', false, formatPainterStyle.fontFamily);
          document.execCommand('foreColor', false, formatPainterStyle.color);
        }
        setFormatPainterStyle(null);
        onContentChange();
        return;
      }
    }

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

      // Also trigger the complete floating context menu if text is selected
      const targetEl = range.startContainer.parentElement;
      setContextTableElement(targetEl?.closest('table') || null);
      setContextSelectedText(text);
      setContextMenuPos({
        x: Math.min(window.innerWidth - 280, Math.max(10, rect.right + 12)),
        y: Math.max(10, rect.top - 10),
      });
    }
  };

  // Execute formatting command safely on current or saved range
  const handleExecCommand = (cmd: string, val: string = '') => {
    restoreRange();
    try {
      document.execCommand(cmd, false, val);
      onContentChange();
    } catch (err) {
      console.error(`Command error ${cmd}:`, err);
    }
  };

  // Replace selected text with a new string (e.g. from Synonyms or Translate)
  const handleReplaceSelectedText = (newText: string) => {
    restoreRange();
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      const textNode = document.createTextNode(newText);
      range.insertNode(textNode);
      range.setStartAfter(textNode);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
      onContentChange();
    } else {
      document.execCommand('insertText', false, newText);
      onContentChange();
    }
  };

  // Arm Format Painter
  const handleArmFormatPainter = () => {
    const sel = window.getSelection();
    if (sel && sel.anchorNode) {
      const parentEl =
        sel.anchorNode.nodeType === Node.ELEMENT_NODE
          ? (sel.anchorNode as HTMLElement)
          : sel.anchorNode.parentElement;
      if (parentEl) {
        const computed = window.getComputedStyle(parentEl);
        setFormatPainterStyle({
          fontFamily: computed.fontFamily,
          fontSize: computed.fontSize,
          fontWeight: computed.fontWeight,
          fontStyle: computed.fontStyle,
          color: computed.color,
          backgroundColor: computed.backgroundColor,
        });
      }
    }
    setContextMenuPos(null);
  };

  // Apply Font Modal options
  const handleApplyFont = (cfg: {
    fontFamily: string;
    fontSize: string;
    isBold: boolean;
    isItalic: boolean;
    color: string;
    underline: boolean;
    strikethrough: boolean;
    superscript: boolean;
    subscript: boolean;
  }) => {
    restoreRange();
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const span = document.createElement('span');
      span.style.fontFamily = cfg.fontFamily;
      span.style.fontSize = `${cfg.fontSize}px`;
      span.style.fontWeight = cfg.isBold ? 'bold' : 'normal';
      span.style.fontStyle = cfg.isItalic ? 'italic' : 'normal';
      span.style.color = cfg.color;
      span.style.textDecoration = `${cfg.underline ? 'underline' : ''} ${
        cfg.strikethrough ? 'line-through' : ''
      }`.trim() || 'none';
      span.style.verticalAlign = cfg.superscript ? 'super' : cfg.subscript ? 'sub' : 'baseline';

      try {
        const range = sel.getRangeAt(0);
        range.surroundContents(span);
      } catch {
        document.execCommand('fontName', false, cfg.fontFamily);
        document.execCommand('foreColor', false, cfg.color);
        if (cfg.isBold) document.execCommand('bold');
        if (cfg.isItalic) document.execCommand('italic');
        if (cfg.underline) document.execCommand('underline');
        if (cfg.strikethrough) document.execCommand('strikeThrough');
      }
      onContentChange();
    }
  };

  // Apply Paragraph Modal options
  const handleApplyParagraph = (cfg: {
    alignment: 'right' | 'center' | 'left' | 'justify';
    lineSpacing: string;
    indentLeft: number;
    indentRight: number;
    spaceBefore: number;
    spaceAfter: number;
    direction: 'rtl' | 'ltr';
  }) => {
    restoreRange();
    const sel = window.getSelection();
    let targetBlock: HTMLElement | null = null;

    if (sel && sel.anchorNode) {
      let curr: Node | null = sel.anchorNode;
      while (curr && curr !== editorRef.current) {
        if (
          curr.nodeType === Node.ELEMENT_NODE &&
          ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'DIV', 'LI', 'BLOCKQUOTE'].includes(
            (curr as HTMLElement).tagName
          )
        ) {
          targetBlock = curr as HTMLElement;
          break;
        }
        curr = curr.parentNode;
      }
    }

    if (targetBlock) {
      targetBlock.style.textAlign = cfg.alignment;
      targetBlock.style.lineHeight = cfg.lineSpacing;
      targetBlock.style.marginRight = `${cfg.indentRight}px`;
      targetBlock.style.marginLeft = `${cfg.indentLeft}px`;
      targetBlock.style.marginTop = `${cfg.spaceBefore}px`;
      targetBlock.style.marginBottom = `${cfg.spaceAfter}px`;
      targetBlock.style.direction = cfg.direction;
      onContentChange();
    } else {
      document.execCommand('justify' + cfg.alignment.charAt(0).toUpperCase() + cfg.alignment.slice(1));
      onContentChange();
    }
  };

  // Apply Hyperlink Modal options
  const handleApplyHyperlink = (url: string, display: string) => {
    restoreRange();
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      const a = document.createElement('a');
      a.href = url.startsWith('http') ? url : `https://${url}`;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.innerText = display || contextSelectedText || url;
      a.style.color = '#0078d7';
      a.style.textDecoration = 'underline';

      range.deleteContents();
      range.insertNode(a);
      range.setStartAfter(a);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
      onContentChange();
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
      onContextMenu={handleContextMenu}
    >
      {/* Word Right-Click Context Menu with Mini Toolbar */}
      {contextMenuPos && (
        <WordContextMenu
          position={contextMenuPos}
          selectedText={contextSelectedText}
          onClose={() => setContextMenuPos(null)}
          onExecCommand={handleExecCommand}
          onOpenFontModal={() => {
            setContextMenuPos(null);
            setIsFontModalOpen(true);
          }}
          onOpenParagraphModal={() => {
            setContextMenuPos(null);
            setIsParagraphModalOpen(true);
          }}
          onOpenSmartLookup={() => {
            setContextMenuPos(null);
            setIsSmartLookupOpen(true);
          }}
          onOpenTranslate={() => {
            setContextMenuPos(null);
            setIsTranslateOpen(true);
          }}
          onOpenHyperlink={() => {
            setContextMenuPos(null);
            setIsHyperlinkOpen(true);
          }}
          onOpenNewComment={() => {
            setContextMenuPos(null);
            onOpenCommentForSelection(contextSelectedText || selectedSnippet);
          }}
          onReplaceSelectedText={handleReplaceSelectedText}
          onFormatPainter={handleArmFormatPainter}
          tableElement={contextTableElement}
        />
      )}

      {/* Floating Mini Toolbar (shown on simple text highlight when context menu is closed) */}
      {miniToolbarPos && !contextMenuPos && (
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
            onContextMenu={handleContextMenu}
            onKeyDown={(e) => {
              if (e.key === 'Backspace' || e.key === 'Delete') {
                const sel = window.getSelection();
                if (sel && sel.anchorNode) {
                  const node = sel.anchorNode.nodeType === Node.ELEMENT_NODE 
                    ? (sel.anchorNode as HTMLElement) 
                    : sel.anchorNode.parentElement;
                  const table = node?.closest('table');
                  if (table) {
                    const selText = sel.toString().trim();
                    const tableText = table.innerText.trim();
                    // If table text is fully selected or empty
                    if (selText.length > 0 && selText === tableText) {
                      e.preventDefault();
                      table.remove();
                      onContentChange();
                      return;
                    }
                  }
                }
              }
            }}
            className={`word-editor relative z-10 text-base leading-relaxed text-slate-800 focus:outline-none min-h-[700px] select-text ${
              viewMode === 'outline' ? 'outline-mode' : ''
            }`}
            style={columnStyle}
          >
            {initialHtml !== undefined ? null : (
              <p><br /></p>
            )}
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

      {/* Context Menu Modals */}
      <WordFontModal
        isOpen={isFontModalOpen}
        onClose={() => setIsFontModalOpen(false)}
        onApply={handleApplyFont}
        initialValues={{
          fontFamily: 'Cairo',
          fontSize: '14',
          color: '#0f172a',
        }}
      />

      <WordParagraphModal
        isOpen={isParagraphModalOpen}
        onClose={() => setIsParagraphModalOpen(false)}
        onApply={handleApplyParagraph}
      />

      <WordSmartLookupModal
        isOpen={isSmartLookupOpen}
        onClose={() => setIsSmartLookupOpen(false)}
        selectedText={contextSelectedText}
        onInsertText={handleReplaceSelectedText}
      />

      <WordTranslateModal
        isOpen={isTranslateOpen}
        onClose={() => setIsTranslateOpen(false)}
        selectedText={contextSelectedText}
        onReplaceText={handleReplaceSelectedText}
      />

      <WordHyperlinkModal
        isOpen={isHyperlinkOpen}
        onClose={() => setIsHyperlinkOpen(false)}
        selectedText={contextSelectedText}
        onInsertLink={handleApplyHyperlink}
      />
    </div>
  );
};
