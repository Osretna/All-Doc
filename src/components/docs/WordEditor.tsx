import React, { useState, useEffect, useRef } from 'react';
import { WordContextMenu } from './WordContextMenu';
import { WordFontModal } from './modals/WordFontModal';
import { WordParagraphModal } from './modals/WordParagraphModal';
import { WordSmartLookupModal } from './modals/WordSmartLookupModal';
import { WordTranslateModal } from './modals/WordTranslateModal';
import { WordHyperlinkModal } from './modals/WordHyperlinkModal';

interface Props {
  editorRef: React.RefObject<HTMLDivElement | null>;
  onContentChange: () => void;
  pageSetup: {
    margins: { top: number; bottom: number; left: number; right: number };
    orientation: 'portrait' | 'landscape';
    size: string;
    columns: number;
  };
  watermark: { text: string; enabled: boolean; color?: string; opacity?: number };
  pageBorder: { style: string; width: number; color: string; enabled: boolean };
  pageColor: string;
  viewMode: 'print' | 'read' | 'web' | 'outline' | 'draft';
  showGridlines: boolean;
  zoom: number;
  onOpenCommentForSelection: (selectedText: string) => void;
}

export const WordEditor: React.FC<Props> = ({
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
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const savedRangeRef = useRef<Range | null>(null);

  // Context Menu state
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null);
  const [selectedText, setSelectedText] = useState('');

  // Modals triggered from Context Menu
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

  // Save current selection range helper
  const captureCurrentRange = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
      const txt = sel.toString();
      setSelectedText(txt);
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
    if (!txt && document.caretRangeFromPoint) {
      const caretRange = document.caretRangeFromPoint(e.clientX, e.clientY);
      if (caretRange && editorRef.current?.contains(caretRange.startContainer)) {
        sel?.removeAllRanges();
        sel?.addRange(caretRange);
        // Expand to word boundaries if possible
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
    setSelectedText(txt);
    setContextMenuPos({ x: e.clientX, y: e.clientY });
  };

  // Format Painter application on mouseup
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
      }
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
          ['P', 'H1', 'H2', 'H3', 'DIV', 'LI', 'BLOCKQUOTE'].includes((curr as HTMLElement).tagName)
        ) {
          targetBlock = curr as HTMLElement;
          break;
        }
        curr = curr.parentNode;
      }
    }

    if (!targetBlock && editorRef.current) {
      targetBlock = editorRef.current;
    }

    if (targetBlock) {
      targetBlock.style.textAlign = cfg.alignment;
      targetBlock.style.lineHeight = cfg.lineSpacing;
      targetBlock.style.direction = cfg.direction;
      targetBlock.style.paddingRight = `${cfg.indentRight * 15}px`;
      targetBlock.style.paddingLeft = `${cfg.indentLeft * 15}px`;
      targetBlock.style.marginTop = `${cfg.spaceBefore}px`;
      targetBlock.style.marginBottom = `${cfg.spaceAfter}px`;
      onContentChange();
    }
  };

  // Apply Hyperlink
  const handleApplyHyperlink = (text: string, url: string) => {
    restoreRange();
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = text || url;
      a.style.color = '#0066cc';
      a.style.textDecoration = 'underline';
      a.style.cursor = 'pointer';

      const range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(a);
      range.setStartAfter(a);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
      onContentChange();
    } else {
      document.execCommand('createLink', false, url);
      onContentChange();
    }
  };

  const isLandscape = pageSetup.orientation === 'landscape';
  const widthPx = isLandscape ? '1123px' : '794px';
  const minHeightPx = isLandscape ? '794px' : '1123px';
  const padTop = `${pageSetup.margins.top * 37.8}px`;
  const padBottom = `${pageSetup.margins.bottom * 37.8}px`;
  const padLeft = `${pageSetup.margins.left * 37.8}px`;
  const padRight = `${pageSetup.margins.right * 37.8}px`;

  const columnStyle: React.CSSProperties = {
    columnCount: pageSetup.columns,
    columnGap: '28px',
    columnRule: pageSetup.columns > 1 ? '1px dashed #cbd5e1' : 'none',
  };

  return (
    <div
      ref={containerRef}
      className={`flex-1 overflow-auto bg-[#e5e7eb] p-8 flex justify-center relative select-none ${
        showGridlines ? 'bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]' : ''
      } ${formatPainterStyle ? 'cursor-crosshair' : ''}`}
      onMouseUp={handleMouseUp}
      onContextMenu={handleContextMenu}
    >
      {/* Authentic Microsoft Word Context Menu + Mini Toolbar on Right Click */}
      <WordContextMenu
        position={contextMenuPos}
        onClose={() => setContextMenuPos(null)}
        selectedText={selectedText}
        onExecCommand={handleExecCommand}
        onOpenFontModal={() => setIsFontModalOpen(true)}
        onOpenParagraphModal={() => setIsParagraphModalOpen(true)}
        onOpenSmartLookup={() => setIsSmartLookupOpen(true)}
        onOpenTranslate={() => setIsTranslateOpen(true)}
        onOpenHyperlink={() => setIsHyperlinkOpen(true)}
        onOpenNewComment={() => {
          onOpenCommentForSelection(selectedText || 'المستند');
          setContextMenuPos(null);
        }}
        onReplaceSelectedText={handleReplaceSelectedText}
        onFormatPainter={handleArmFormatPainter}
      />

      {/* The Printable Page Canvas */}
      <div
        className="office-page-canvas relative transition-transform duration-150 select-text"
        style={{
          width: widthPx,
          minHeight: minHeightPx,
          backgroundColor: pageColor || '#ffffff',
          paddingTop: padTop,
          paddingBottom: padBottom,
          paddingLeft: padLeft,
          paddingRight: padRight,
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'top center',
          border: pageBorder.enabled ? `${pageBorder.width}px ${pageBorder.style} ${pageBorder.color}` : undefined,
          boxShadow: '0 8px 30px rgba(0,0,0,0.12), 0 0 1px rgba(0,0,0,0.2)',
        }}
      >
        {/* Watermark Overlay */}
        {watermark.enabled && watermark.text && (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10 overflow-hidden"
            style={{ opacity: watermark.opacity || 0.2 }}
          >
            <div
              className="text-6xl sm:text-7xl font-black transform -rotate-45 whitespace-nowrap text-center uppercase tracking-widest"
              style={{ color: watermark.color || '#94a3b8' }}
            >
              {watermark.text}
            </div>
          </div>
        )}

        {/* ContentEditable Document Area */}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={onContentChange}
          dir="rtl"
          className="outline-none min-h-[600px] text-gray-900 leading-relaxed text-base prose prose-slate max-w-none"
          style={columnStyle}
        />
      </div>

      {/* Modals triggered from Context Menu */}
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
        selectedText={selectedText}
        onInsertText={handleReplaceSelectedText}
      />

      <WordTranslateModal
        isOpen={isTranslateOpen}
        onClose={() => setIsTranslateOpen(false)}
        selectedText={selectedText}
        onReplaceText={handleReplaceSelectedText}
      />

      <WordHyperlinkModal
        isOpen={isHyperlinkOpen}
        onClose={() => setIsHyperlinkOpen(false)}
        selectedText={selectedText}
        onInsertLink={handleApplyHyperlink}
      />
    </div>
  );
};
