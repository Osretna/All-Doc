import React, { useRef, useEffect, useState } from 'react';
import { localVault } from '../../utils/storage';
import { parseDocxFile } from '../../utils/fileImport';
import { 
  FileText, 
  Printer, 
  Download, 
  Upload,
  CheckCircle2, 
  ShieldCheck,
  FolderOpen
} from 'lucide-react';

interface Props {
  fontFamily: string;
  fontSize: number;
  zoomLevel: number;
  setWordCount: (c: number) => void;
  setCharCount: (c: number) => void;
  initialContent?: string;
  onContentChange?: (content: string) => void;
}

const DEFAULT_DOC_CONTENT = `
<div style="text-align: center; border-bottom: 2px solid #0078d4; padding-bottom: 15px; margin-bottom: 25px;">
  <h1 style="color: #0078d4; font-size: 26px; margin-bottom: 6px; font-weight: 800;">شركة إنفينيتي تكنولوجي للحلول السحابية المتقدمة</h1>
  <p style="color: #605e5c; font-size: 13px; margin: 0;">تقرير فني واستراتيجي: جناح الأوفيس المكتبي السيادي (Infinity Sovereign Office)</p>
</div>

<h2 style="color: #106ebe; font-size: 18px; margin-top: 20px; border-right: 4px solid #0078d4; padding-right: 10px;">1. ملخص المشروع والرؤية السيادية</h2>
<p style="line-height: 1.8; text-align: justify;">
يقدم هذا المشروع نموذجاً متفرداً يجمع بين <strong>البنية التحتية السحابية القوية</strong> (استضافة Shared + VPS بنظام ملفات ZFS وأقراص NVMe فائقة السرعة مع حماية ModSecurity) وبين <strong>جناح تطبيقات مكتبية سيادي متكامل</strong> يحاكي ويتفوق على تطبيقات مايكروسوفت أوفيس (Word, Excel, PowerPoint, OneNote, Access, Acrobat, Photoshop).
</p>

<div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px 16px; margin: 15px 0;">
  <strong style="color: #166534; display: block; margin-bottom: 4px;">✓ ميزة السيادة الكاملة (100% Offline & Sovereign):</strong>
  <span style="color: #15803d; font-size: 13px;">
    تعمل جميع التطبيقات في وضع عدم الاتصال بالكامل بدون أي تتبع أو إرسال بيانات إلى خوادم خارجية، مع قابلية التنصيب كتطبيق مكتبي (PWA) على أجهزة الكمبيوتر والهواتف الذكية.
  </span>
</div>

<h2 style="color: #106ebe; font-size: 18px; margin-top: 25px; border-right: 4px solid #0078d4; padding-right: 10px;">2. جدول مقارنة التطبيقات بمجموعة Microsoft 365</h2>
<table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px;">
  <thead>
    <tr style="background-color: #0078d4; color: white;">
      <th style="padding: 10px; border: 1px solid #0078d4; text-align: right;">تطبيق Infinity</th>
      <th style="padding: 10px; border: 1px solid #0078d4; text-align: right;">المقابل في MS Office</th>
      <th style="padding: 10px; border: 1px solid #0078d4; text-align: right;">الوظيفة والمزايا السيادية</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background-color: #ffffff;">
      <td style="padding: 8px 10px; border: 1px solid #e1dfdd; font-weight: bold; color: #0078d4;">Infinity Docs</td>
      <td style="padding: 8px 10px; border: 1px solid #e1dfdd;">Microsoft Word</td>
      <td style="padding: 8px 10px; border: 1px solid #e1dfdd;">محرر نصوص غني، تخطيط A4، قوالب عربية، دعم RTL فائق، تصدير .docx و PDF</td>
    </tr>
    <tr style="background-color: #f9fafb;">
      <td style="padding: 8px 10px; border: 1px solid #e1dfdd; font-weight: bold; color: #107c41;">Infinity Sheets</td>
      <td style="padding: 8px 10px; border: 1px solid #e1dfdd;">Microsoft Excel</td>
      <td style="padding: 8px 10px; border: 1px solid #e1dfdd;">أكثر من 100 دالة رياضية ومالية، رسوم بيانية تفاعلية، جداول مصروفات اتحاد ملاك</td>
    </tr>
    <tr style="background-color: #ffffff;">
      <td style="padding: 8px 10px; border: 1px solid #e1dfdd; font-weight: bold; color: #d83b01;">Infinity Slides</td>
      <td style="padding: 8px 10px; border: 1px solid #e1dfdd;">Microsoft PowerPoint</td>
      <td style="padding: 8px 10px; border: 1px solid #e1dfdd;">عروض تقديمية 16:9، وضع عارض كامل الشاشة، أشكال متقدمة، قوالب خليجية</td>
    </tr>
  </tbody>
</table>
`;

export const DocsApp: React.FC<Props> = ({
  fontFamily,
  fontSize,
  zoomLevel,
  setWordCount,
  setCharCount,
  initialContent,
  onContentChange,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef<boolean>(false);
  const lastInternalHtml = useRef<string>('');

  // Initialize editor content once or on external content update
  useEffect(() => {
    if (!editorRef.current) return;

    if (!isInitialized.current) {
      const initial = initialContent !== undefined 
        ? initialContent 
        : localVault.get<string>(localVault.KEYS.DOCS_CONTENT, DEFAULT_DOC_CONTENT);

      editorRef.current.innerHTML = initial;
      lastInternalHtml.current = initial;
      isInitialized.current = true;
      updateCounts();
      return;
    }

    // CRITICAL: Only update innerHTML if content changed externally (template/open file).
    // NEVER overwrite innerHTML during active user typing as that resets caret position to 0!
    if (initialContent !== undefined && initialContent !== lastInternalHtml.current) {
      editorRef.current.innerHTML = initialContent;
      lastInternalHtml.current = initialContent;
      updateCounts();
    }
  }, [initialContent]);

  const updateCounts = () => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText || '';
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    setWordCount(words);
    setCharCount(chars);
  };

  const handleInput = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    // Record internal HTML so useEffect doesn't echo-replace it and disrupt caret
    lastInternalHtml.current = html;
    localVault.set(localVault.KEYS.DOCS_CONTENT, html);
    updateCounts();
    onContentChange?.(html);
  };

  // Keyboard navigation & Ctrl+Backspace full word delete handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Ctrl + Backspace: Delete full word backwards cleanly
    if ((e.ctrlKey || e.altKey) && e.key === 'Backspace') {
      e.preventDefault();
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        // @ts-ignore - modify is supported in WebKit, Blink, and Firefox
        if (typeof sel.modify === 'function') {
          // @ts-ignore
          sel.modify('extend', 'backward', 'word');
          document.execCommand('delete', false);
        } else {
          document.execCommand('delete', false);
        }
      }
      handleInput();
      return;
    }

    // Ctrl + B: Bold
    if ((e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B')) {
      e.preventDefault();
      document.execCommand('bold', false);
      handleInput();
      return;
    }

    // Ctrl + I: Italic
    if ((e.ctrlKey || e.metaKey) && (e.key === 'i' || e.key === 'I')) {
      e.preventDefault();
      document.execCommand('italic', false);
      handleInput();
      return;
    }

    // Ctrl + U: Underline
    if ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U')) {
      e.preventDefault();
      document.execCommand('underline', false);
      handleInput();
      return;
    }

    // Ctrl + Z: Undo
    if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z') && !e.shiftKey) {
      e.preventDefault();
      document.execCommand('undo', false);
      handleInput();
      return;
    }

    // Ctrl + Y: Redo
    if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || e.key === 'Y' || (e.shiftKey && (e.key === 'z' || e.key === 'Z')))) {
      e.preventDefault();
      document.execCommand('redo', false);
      handleInput();
      return;
    }

    // Ctrl + A: Select All
    if ((e.ctrlKey || e.metaKey) && (e.key === 'a' || e.key === 'A')) {
      // Allow browser native select all
      return;
    }
  };

  // Direct file opener for .docx, .doc, .txt, .html
  const handleOpenLocalDoc = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      let parsedHtml = '';
      if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
        parsedHtml = await parseDocxFile(file);
      } else {
        const text = await file.text();
        if (text.includes('<html') || text.includes('<p') || text.includes('<div')) {
          parsedHtml = text;
        } else {
          parsedHtml = `<p style="white-space: pre-wrap;">${text}</p>`;
        }
      }

      if (editorRef.current) {
        editorRef.current.innerHTML = parsedHtml;
        localVault.set(localVault.KEYS.DOCS_CONTENT, parsedHtml);
        updateCounts();
        onContentChange?.(parsedHtml);
        alert(`تم فتح وقراءة المستند "${file.name}" بنجاح!`);
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء قراءة الملف. تأكد من سلامة ملف Word.');
    }
  };

  return (
    <div className="flex-1 bg-[#eaeaea] overflow-y-auto p-4 sm:p-8 flex flex-col items-center">
      {/* Top Quick Bar: File Open & Ruler Action */}
      <div className="w-full max-w-[210mm] mb-2 flex items-center justify-between text-xs text-gray-600 no-print">
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-300 hover:border-blue-500 rounded-lg cursor-pointer text-xs font-bold text-gray-800 shadow-2xs transition">
            <Upload className="w-3.5 h-3.5 text-blue-600" />
            <span>فتح مستند Word (.docx / .txt)</span>
            <input
              type="file"
              accept=".docx,.doc,.txt,.html"
              onChange={handleOpenLocalDoc}
              className="hidden"
            />
          </label>
        </div>

        <div className="text-[11px] text-gray-500">
          دعم كامل لكتابة العربية (RTL) واختصارات Word
        </div>
      </div>

      {/* Container with Zoom Scaler */}
      <div 
        style={{ 
          transform: `scale(${zoomLevel / 100})`, 
          transformOrigin: 'top center',
          transition: 'transform 0.15s ease-out'
        }}
        className="w-full flex justify-center pb-20"
      >
        {/* Microsoft Word A4 Page Canvas */}
        <div className="office-page-canvas p-10 sm:p-14 rounded-xs border border-gray-300 transition-all text-right relative">
          {/* Subtle Top Margin Ruler Marks */}
          <div className="absolute top-0 right-0 left-0 h-4 border-b border-gray-200 flex justify-between px-6 text-[9px] text-gray-300 select-none no-print">
            <span>0</span>
            <span>5</span>
            <span>10</span>
            <span>15</span>
            <span>20</span>
          </div>

          {/* Editable Document Canvas with Native RTL and zero cursor jumping */}
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            dir="rtl"
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            style={{ 
              fontFamily: fontFamily, 
              fontSize: `${fontSize}px`,
              lineHeight: 1.8,
              minHeight: '260mm',
              outline: 'none',
              direction: 'rtl',
              textAlign: 'right',
              unicodeBidi: 'plaintext'
            }}
            className="text-gray-900 focus:outline-none focus:ring-0 selection:bg-blue-100"
          />

          {/* Page Footer Simulation */}
          <div className="mt-16 pt-4 border-t border-gray-200 flex items-center justify-between text-[11px] text-gray-400 select-none">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Infinity Sovereign Office - وثيقة محمية محلياً</span>
            </div>
            <span>صفحة 1 من 1</span>
          </div>
        </div>
      </div>
    </div>
  );
};
