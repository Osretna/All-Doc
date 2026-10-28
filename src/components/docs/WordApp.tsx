import React, { useRef, useState, useEffect, useCallback } from 'react';
import { WordRibbon } from './WordRibbon';
import { WordRuler } from './WordRuler';
import { WordEditor } from './WordEditor';
import { WordStatusBar } from './WordStatusBar';
import { WordFindReplaceModal } from './modals/WordFindReplaceModal';
import { WordTableModal } from './modals/WordTableModal';
import { WordShapeModal } from './modals/WordShapeModal';
import { WordSymbolModal } from './modals/WordSymbolModal';
import { WordWatermarkModal } from './modals/WordWatermarkModal';
import { WordPageBordersModal } from './modals/WordPageBordersModal';
import { WordCountModal } from './modals/WordCountModal';
import { WordMacrosModal } from './modals/WordMacrosModal';
import { WordNavigationPane } from './modals/WordNavigationPane';
import { WordCommentsPane, DocComment } from './modals/WordCommentsPane';
import { AppStorage } from '../../utils/storage';

interface Props {
  onNotify?: (msg: string, type?: 'success' | 'info' | 'error') => void;
  onOpenBackstage?: () => void;
}

const DEFAULT_DOC_HTML = `
  <h1 style="text-align: center; color: #004578; font-weight: 800; font-size: 28px; margin-bottom: 8px;">تقرير استراتيجي معتمد • MY-DOC 2026</h1>
  <p style="text-align: center; color: #64748b; font-size: 14px; margin-bottom: 24px;">الجناح المكتبي السيادي المتكامل بنسبة 100% بدون إنترنت</p>
  <hr style="border: 0; border-top: 2px solid #004578; margin-bottom: 24px;" />
  <h2 style="color: #0f172a; font-size: 20px; font-weight: bold; margin-bottom: 12px;">1. مقدمة الوثيقة الرسمية</h2>
  <p style="text-align: justify; line-height: 1.8; margin-bottom: 16px;">
    يرحب بكم نظام معالجة المستندات المتقدم <strong>Word Sovereign Suite</strong>. تم تصميم هذا التطبيق لتقديم تجربة تحرير وثائق وعقود وتقارير فائقة الدقة متطابقة كلياً مع معايير مايكروسوفت أوفيس، مع الحفاظ الكامل على السيادة الرقمية والخصوصية والأمان على أجهزتكم مباشرة.
  </p>
  <h2 style="color: #0f172a; font-size: 20px; font-weight: bold; margin-bottom: 12px;">2. الميزات الحية المدعومة في الأشرطة</h2>
  <p style="text-align: justify; line-height: 1.8; margin-bottom: 16px;">
    كافة التبويبات أعلاه (الرئيسية، إدراج، تصميم، تخطيط، مراجع، مراسلات، مراجعة، وعرض) أصبحت تفاعلية وحقيقية بالكامل: يمكنك إدراج الجداول، الأشكال، الرموز والمعادلات الرياضية، تطبيق العلامة المائية وحدود الصفحة، توليد الفهارس التلقائية، الاستماع للنص صوتياً، وإجراء التدقيق الإملائي والإحصائي.
  </p>
`;

export const WordApp: React.FC<Props> = ({ onNotify, onOpenBackstage }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  // Active Ribbon Tab
  const [activeTab, setActiveTab] = useState('home');

  // Page Setup state
  const [pageSetup, setPageSetup] = useState({
    margins: { top: 2.54, bottom: 2.54, left: 2.54, right: 2.54 },
    orientation: 'portrait' as 'portrait' | 'landscape',
    size: 'A4',
    columns: 1,
  });

  // Design state
  const [pageColor, setPageColor] = useState('#ffffff');
  const [watermark, setWatermark] = useState({ text: '', enabled: false, color: '#94a3b8', opacity: 0.15 });
  const [pageBorder, setPageBorder] = useState({ style: 'solid', width: 2, color: '#0f172a', enabled: false });

  // View state
  const [viewMode, setViewMode] = useState<'print' | 'read' | 'web' | 'outline' | 'draft'>('print');
  const [showRuler, setShowRuler] = useState(true);
  const [showGridlines, setShowGridlines] = useState(false);
  const [showNavigationPane, setShowNavigationPane] = useState(false);
  const [zoom, setZoom] = useState(100);

  // Modals state
  const [isFindOpen, setIsFindOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isShapeModalOpen, setIsShapeModalOpen] = useState(false);
  const [isSymbolModalOpen, setIsSymbolModalOpen] = useState(false);
  const [symbolModalInitialTab, setSymbolModalInitialTab] = useState<'symbol' | 'equation'>('symbol');
  const [isWatermarkOpen, setIsWatermarkOpen] = useState(false);
  const [isPageBorderOpen, setIsPageBorderOpen] = useState(false);
  const [isWordCountOpen, setIsWordCountOpen] = useState(false);
  const [isMacrosOpen, setIsMacrosOpen] = useState(false);
  const [isCommentsPaneOpen, setIsCommentsPaneOpen] = useState(false);

  // Comments & Headings
  const [comments, setComments] = useState<DocComment[]>([]);
  const [headings, setHeadings] = useState<{ text: string; level: number; id: string }[]>([]);

  // Statistics
  const [stats, setStats] = useState({
    words: 0,
    charactersNoSpaces: 0,
    charactersWithSpaces: 0,
    paragraphs: 1,
    lines: 1,
  });

  // Load initial document content from storage
  useEffect(() => {
    const saved = AppStorage.get(AppStorage.KEYS.DOCS_CONTENT, DEFAULT_DOC_HTML);
    if (editorRef.current) {
      editorRef.current.innerHTML = saved;
      updateDocumentStats();
      extractHeadings();
    }
  }, []);

  // Update statistics
  const updateDocumentStats = useCallback(() => {
    if (editorRef.current) {
      const text = editorRef.current.innerText || '';
      const words = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
      const charsWithSpaces = text.length;
      const charsNoSpaces = text.replace(/\s+/g, '').length;
      const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0).length || 1;
      const lines = Math.max(1, Math.ceil(words / 10));

      setStats({
        words,
        charactersNoSpaces: charsNoSpaces,
        charactersWithSpaces: charsWithSpaces,
        paragraphs,
        lines,
      });

      // Save to storage
      AppStorage.set(AppStorage.KEYS.DOCS_CONTENT, editorRef.current.innerHTML);
    }
  }, []);

  const extractHeadings = useCallback(() => {
    if (editorRef.current) {
      const nodes = Array.from(editorRef.current.querySelectorAll('h1, h2, h3'));
      const list = nodes.map((n, i) => {
        const level = n.tagName === 'H1' ? 1 : n.tagName === 'H2' ? 2 : 3;
        return {
          text: n.textContent || '',
          level,
          id: `heading_${i}`,
        };
      });
      setHeadings(list);
    }
  }, []);

  const handleContentChange = () => {
    updateDocumentStats();
    extractHeadings();
  };

  // Insert HTML helper
  const insertHtml = (html: string) => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) {
      if (editorRef.current) {
        editorRef.current.innerHTML += html;
        handleContentChange();
      }
      return;
    }
    const range = sel.getRangeAt(0);
    range.deleteContents();
    const div = document.createElement('div');
    div.innerHTML = html;
    const frag = document.createDocumentFragment();
    let node: ChildNode | null;
    let lastNode: ChildNode | null = null;
    while ((node = div.firstChild)) {
      lastNode = frag.appendChild(node);
    }
    range.insertNode(frag);
    if (lastNode) {
      range.setStartAfter(lastNode);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
    handleContentChange();
  };

  const handleInsertTable = (rows: number, cols: number) => {
    let tableHtml = '<table style="width: 100%; border-collapse: collapse; margin: 16px 0; border: 1px solid #cbd5e1;">';
    tableHtml += '<thead><tr style="background: #f1f5f9;">';
    for (let c = 1; c <= cols; c++) {
      tableHtml += `<th style="border: 1px solid #cbd5e1; padding: 8px; font-weight: bold; text-align: center;">عمود ${c}</th>`;
    }
    tableHtml += '</tr></thead><tbody>';
    for (let r = 1; r <= rows - 1; r++) {
      tableHtml += '<tr>';
      for (let c = 1; c <= cols; c++) {
        tableHtml += `<td style="border: 1px solid #cbd5e1; padding: 8px;">بيانات ${r},${c}</td>`;
      }
      tableHtml += '</tr>';
    }
    tableHtml += '</tbody></table><p><br></p>';
    insertHtml(tableHtml);
    onNotify?.(`تم إدراج جدول (${rows} صفوف × ${cols} أعمدة) بنجاح`, 'success');
  };

  const handleRunMacro = (macroId: string) => {
    if (macroId === 'FormatReportHeader') {
      insertHtml(`
        <div style="text-align: center; margin: 20px 0; padding-bottom: 12px; border-bottom: 3px double #004578;">
          <h2 style="color: #004578; font-size: 24px; font-weight: 800; margin: 0;">ترويسة تقرير معتمدة رسمياً</h2>
          <p style="color: #64748b; font-size: 12px; margin-top: 4px;">المملكة العربية السعودية • الجناح المكتبي السيادي • ${new Date().toLocaleDateString('ar-EG')}</p>
        </div>
      `);
      onNotify?.('تم تشغيل ماكرو ترويسة التقرير الرسمية بنجاح', 'success');
    } else if (macroId === 'InsertFormalSignature') {
      insertHtml(`
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #94a3b8; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; text-align: center; font-size: 13px;">
          <div>
            <div style="font-weight: bold; margin-bottom: 35px;">إعداد وتدقيق:</div>
            <div style="border-top: 1px dashed #cbd5e1; padding-top: 4px;">التوقيع: .....................</div>
          </div>
          <div>
            <div style="font-weight: bold; margin-bottom: 35px;">مراجعة المدير المالي:</div>
            <div style="border-top: 1px dashed #cbd5e1; padding-top: 4px;">التوقيع: .....................</div>
          </div>
          <div>
            <div style="font-weight: bold; margin-bottom: 35px;">الاعتماد والختم الرسمي:</div>
            <div style="border-top: 1px dashed #cbd5e1; padding-top: 4px;">الختم: .....................</div>
          </div>
        </div>
      `);
      onNotify?.('تم تشغيل ماكرو إدراج الاعتماد والتوقيع الثلاثي بنجاح', 'success');
    } else if (macroId === 'ConvertTablesToZebra') {
      if (editorRef.current) {
        const rows = editorRef.current.querySelectorAll('tr');
        rows.forEach((row, i) => {
          if (i > 0) {
            row.style.backgroundColor = i % 2 === 0 ? '#f8fafc' : '#ffffff';
          }
        });
        handleContentChange();
        onNotify?.('تم تنسيق كافة جداول المستند بنمط ألوان مخطط بنجاح', 'success');
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#e5e7eb] select-none relative">
      {/* Word Ribbon Header and Command Strip */}
      <WordRibbon
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenFileMenu={() => onOpenBackstage?.()}
        onOpenFind={() => setIsFindOpen(true)}
        onOpenReplace={() => setIsFindOpen(true)}
        onOpenTableModal={() => setIsTableModalOpen(true)}
        onOpenShapeModal={() => setIsShapeModalOpen(true)}
        onOpenSymbolModal={t => {
          setSymbolModalInitialTab(t || 'symbol');
          setIsSymbolModalOpen(true);
        }}
        onOpenComments={() => setIsCommentsPaneOpen(true)}
        onOpenWatermarkModal={() => setIsWatermarkOpen(true)}
        onOpenPageBordersModal={() => setIsPageBorderOpen(true)}
        pageColor={pageColor}
        onPageColorChange={setPageColor}
        onApplyTheme={themeName => {
          if (themeName.includes('Facet')) setPageColor('#f8fafc');
          else if (themeName.includes('Organic')) setPageColor('#f0fdf4');
          else if (themeName.includes('Retrospect')) setPageColor('#fefce8');
          else setPageColor('#ffffff');
          onNotify?.(`تم تطبيق نسق (${themeName}) بنجاح`, 'success');
        }}
        pageSetup={pageSetup}
        onUpdatePageSetup={cfg => {
          setPageSetup(prev => ({ ...prev, ...cfg }));
          onNotify?.('تم تحديث إعدادات الصفحة والهوامش', 'info');
        }}
        onOpenWordCount={() => setIsWordCountOpen(true)}
        editorRef={editorRef}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showRuler={showRuler}
        onToggleRuler={() => setShowRuler(!showRuler)}
        showGridlines={showGridlines}
        onToggleGridlines={() => setShowGridlines(!showGridlines)}
        showNavigationPane={showNavigationPane}
        onToggleNavigationPane={() => setShowNavigationPane(!showNavigationPane)}
        zoom={zoom}
        onZoomChange={setZoom}
        onOpenMacros={() => setIsMacrosOpen(true)}
      />

      {/* Horizontal Ruler */}
      <WordRuler showRuler={showRuler} />

      {/* Main Workspace: Navigation Pane + Editor Canvas + Comments Pane */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Navigation Pane */}
        <WordNavigationPane
          isOpen={showNavigationPane}
          onClose={() => setShowNavigationPane(false)}
          onSearch={query => {
            if ((window as any).find && query) {
              (window as any).find(query, false, false, true);
            }
          }}
          headings={headings}
        />

        {/* Word Document Paper Editor */}
        <WordEditor
          editorRef={editorRef}
          onContentChange={handleContentChange}
          pageSetup={pageSetup}
          watermark={watermark}
          pageBorder={pageBorder}
          pageColor={pageColor}
          viewMode={viewMode}
          showGridlines={showGridlines}
          zoom={zoom}
          onOpenCommentForSelection={selectedTxt => {
            setIsCommentsPaneOpen(true);
            const userComm = prompt(`أدخل تعليقك على هذا النص المحدد: "${selectedTxt}"`, '');
            if (userComm) {
              const newComm: DocComment = {
                id: `comm_${Date.now()}`,
                selectedText: selectedTxt,
                comment: userComm,
                author: 'مستخدم Sovereign',
                date: new Date().toLocaleDateString('ar-EG'),
                resolved: false,
              };
              setComments(prev => [...prev, newComm]);
              onNotify?.('تمت إضافة التعليق بنجاح', 'success');
            }
          }}
        />

        {/* Comments Sidebar Pane */}
        <WordCommentsPane
          isOpen={isCommentsPaneOpen}
          onClose={() => setIsCommentsPaneOpen(false)}
          comments={comments}
          onAddComment={comm => {
            const newComm: DocComment = {
              id: `comm_${Date.now()}`,
              comment: comm,
              author: 'مستخدم Sovereign',
              date: new Date().toLocaleDateString('ar-EG'),
              resolved: false,
            };
            setComments(prev => [...prev, newComm]);
            onNotify?.('تم نشر التعليق بنجاح', 'success');
          }}
          onDeleteComment={id => {
            setComments(prev => prev.filter(c => c.id !== id));
            onNotify?.('تم حذف التعليق', 'info');
          }}
          onResolveComment={id => {
            setComments(prev => prev.map(c => c.id === id ? { ...c, resolved: !c.resolved } : c));
          }}
        />
      </div>

      {/* Word Bottom Status Bar */}
      <WordStatusBar
        stats={stats}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        zoom={zoom}
        onZoomChange={setZoom}
        onOpenWordCount={() => setIsWordCountOpen(true)}
        onOpenNavigationPane={() => setShowNavigationPane(!showNavigationPane)}
        language="العربية (مصر)"
      />

      {/* Modals */}
      <WordFindReplaceModal
        isOpen={isFindOpen}
        onClose={() => setIsFindOpen(false)}
        editorRef={editorRef}
      />

      <WordTableModal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
        onInsertTable={handleInsertTable}
      />

      <WordShapeModal
        isOpen={isShapeModalOpen}
        onClose={() => setIsShapeModalOpen(false)}
        onSelectShape={(name, html) => {
          insertHtml(html);
          onNotify?.(`تم إدراج شكل (${name}) في المستند`, 'success');
        }}
      />

      <WordSymbolModal
        isOpen={isSymbolModalOpen}
        onClose={() => setIsSymbolModalOpen(false)}
        initialTab={symbolModalInitialTab}
        onInsertSymbol={sym => {
          insertHtml(sym);
          onNotify?.('تم إدراج الرمز بنجاح', 'success');
        }}
      />

      <WordWatermarkModal
        isOpen={isWatermarkOpen}
        onClose={() => setIsWatermarkOpen(false)}
        config={watermark}
        onApplyWatermark={cfg => {
          setWatermark({
            text: cfg.text,
            enabled: cfg.enabled,
            color: cfg.color || '#94a3b8',
            opacity: cfg.opacity ?? 0.15,
          });
          onNotify?.(cfg.enabled ? `تم تفعيل العلامة المائية (${cfg.text})` : 'تم إزالة العلامة المائية', 'info');
        }}
      />

      <WordPageBordersModal
        isOpen={isPageBorderOpen}
        onClose={() => setIsPageBorderOpen(false)}
        config={pageBorder}
        onApplyBorder={cfg => {
          setPageBorder(cfg);
          onNotify?.(cfg.enabled ? 'تم تطبيق إطار الصفحة الخارجي' : 'تم إلغاء إطار الصفحة', 'info');
        }}
      />

      <WordCountModal
        isOpen={isWordCountOpen}
        onClose={() => setIsWordCountOpen(false)}
        stats={stats}
      />

      <WordMacrosModal
        isOpen={isMacrosOpen}
        onClose={() => setIsMacrosOpen(false)}
        onRunMacro={handleRunMacro}
      />
    </div>
  );
};
