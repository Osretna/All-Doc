import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  OfficeAppId, 
  MainNavSection, 
  RibbonTab as SuiteRibbonTab,
  SheetData, 
  SlideItem, 
  DbTable 
} from './types';
import { 
  RibbonTab as WordRibbonTab, 
  PageSetup, 
  WatermarkConfig, 
  PageBorderConfig, 
  DocumentComment, 
  DocumentStats, 
  DocumentMetadata, 
  ViewMode 
} from './types/word';
import { TitleBar } from './components/layout/TitleBar';
import { RibbonBar } from './components/layout/RibbonBar';
import { Ribbon as WordRibbon } from './components/Ribbon';
import { Ruler } from './components/Ruler';
import { DocumentCanvas } from './components/DocumentCanvas';
import { StatusBar as WordStatusBar } from './components/StatusBar';
import { StatusBar as LayoutStatusBar } from './components/layout/StatusBar';
import { BackstageModal } from './components/layout/BackstageModal';

// Suite Applications
import { SheetsApp } from './components/office/SheetsApp';
import { SlidesApp } from './components/office/SlidesApp';
import { NotesApp } from './components/office/NotesApp';
import { BaseApp } from './components/office/BaseApp';
import { PdfStudioApp } from './components/office/PdfStudioApp';
import { PhotoStudioApp } from './components/office/PhotoStudioApp';

// Cloud Views
import { HostingView } from './components/cloud/HostingView';
import { DomainsView } from './components/cloud/DomainsView';
import { EmailView } from './components/cloud/EmailView';
import { MollakView } from './components/cloud/MollakView';
import { CustomSolutionsView } from './components/cloud/CustomSolutionsView';
import { SovereignVaultView } from './components/cloud/SovereignVaultView';

// Word Modals
import { FindReplaceModal } from './components/modals/FindReplaceModal';
import { TablePickerModal } from './components/modals/TablePickerModal';
import { ShapePickerModal } from './components/modals/ShapePickerModal';
import { SymbolModal } from './components/modals/SymbolModal';
import { WatermarkModal } from './components/modals/WatermarkModal';
import { PageBordersModal } from './components/modals/PageBordersModal';
import { WordCountModal } from './components/modals/WordCountModal';
import { MacrosModal } from './components/modals/MacrosModal';
import { NavigationPane } from './components/modals/NavigationPane';
import { CommentsDrawer } from './components/modals/CommentsDrawer';
import { 
  executeCommand, 
  insertHTMLAtCursor, 
  calculateStats, 
  exportDocumentAsWord 
} from './utils/editorCommands';
import { saveFileDirectlyToDevice } from './utils/fileSaver';
import { printDocumentContent } from './utils/printHelper';
import { parseDocxFile, parseExcelFile, parsePptxFile, parseAccessFile } from './utils/fileImport';
import { localVault } from './utils/storage';
import { ToastContainer, ToastMessage } from './components/Toast';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { UploadCloud } from 'lucide-react';

export default function App() {
  // Navigation & Suite State (persisted across browser refresh so active app & data never get lost)
  const [activeSection, setActiveSectionState] = useState<MainNavSection>(() => localVault.get('infinity_office_active_section', 'office'));
  const [activeApp, setActiveAppState] = useState<OfficeAppId>(() => localVault.get(localVault.KEYS.ACTIVE_APP, 'sheets'));
  const [documentTitle, setDocumentTitleState] = useState<string>(() => localVault.get('infinity_office_doc_title', 'مصنف إكسيل 1 - Excel'));
  const [isBackstageOpen, setIsBackstageOpen] = useState<boolean>(false);

  const setActiveApp = (app: OfficeAppId) => {
    setActiveAppState(app);
    localVault.set(localVault.KEYS.ACTIVE_APP, app);
  };

  const setActiveSection = (sec: MainNavSection) => {
    setActiveSectionState(sec);
    localVault.set('infinity_office_active_section', sec);
  };

  const setDocumentTitle = (title: string) => {
    setDocumentTitleState(title);
    localVault.set('infinity_office_doc_title', title);
  };

  // Shared Suite File Data States (Excel, Slides, Access, PDF)
  const [excelData, setExcelDataState] = useState<Record<string, { label: string; data: SheetData }> | undefined>(() => {
    return localVault.get(localVault.KEYS.SHEETS_DATA, undefined);
  });
  const [slidesData, setSlidesDataState] = useState<SlideItem[] | undefined>(() => {
    return localVault.get(localVault.KEYS.SLIDES_DATA, undefined);
  });
  const [accessData, setAccessDataState] = useState<DbTable[] | undefined>(() => {
    return localVault.get(localVault.KEYS.BASE_DATA, undefined);
  });
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [notesSignal, setNotesSignal] = useState<number>(0);
  const [photoSignal, setPhotoSignal] = useState<number>(0);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isDraggingFile, setIsDraggingFile] = useState<boolean>(false);

  // Save State: true = Green Dot 🟢 (saved), false = Orange Dot 🟠 (unsaved)
  const [isSaved, setIsSaved] = useState<boolean>(true);
  const [autoSaveCountdown, setAutoSaveCountdown] = useState<number>(300); // 5 minutes in seconds

  const setExcelData = (data: Record<string, { label: string; data: SheetData }> | undefined) => {
    setExcelDataState(data);
    if (data) localVault.set(localVault.KEYS.SHEETS_DATA, data);
    setIsSaved(false);
  };

  const setSlidesData = (data: SlideItem[] | undefined) => {
    setSlidesDataState(data);
    if (data) localVault.set(localVault.KEYS.SLIDES_DATA, data);
    setIsSaved(false);
  };

  const setAccessData = (data: DbTable[] | undefined) => {
    setAccessDataState(data);
    if (data) localVault.set(localVault.KEYS.BASE_DATA, data);
    setIsSaved(false);
  };

  const addNotification = (text: string, type: 'success' | 'info' | 'error' = 'info') => {
    const newToast: ToastMessage = {
      id: `t_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      text,
      type,
    };
    setToasts(prev => [...prev, newToast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 4000);
  };

  // Common typography & zoom
  const [selectedFont, setSelectedFont] = useState<string>('Cairo');
  const [fontSize, setFontSize] = useState<number>(14);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Word (Docs) Specific State
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [wordRibbonTab, setWordRibbonTab] = useState<WordRibbonTab>('home');
  const [suiteRibbonTab, setSuiteRibbonTab] = useState<SuiteRibbonTab>('home');
  const [viewMode, setViewMode] = useState<ViewMode>('print');
  const [showRuler, setShowRuler] = useState<boolean>(true);
  const [showGridlines, setShowGridlines] = useState<boolean>(false);
  const [showNavigationPane, setShowNavigationPane] = useState<boolean>(false);
  const [showCommentsDrawer, setShowCommentsDrawer] = useState<boolean>(false);

  // Word Modals State
  const [isFindReplaceOpen, setIsFindReplaceOpen] = useState<boolean>(false);
  const [isTablePickerOpen, setIsTablePickerOpen] = useState<boolean>(false);
  const [isShapePickerOpen, setIsShapePickerOpen] = useState<boolean>(false);
  const [isSymbolModalOpen, setIsSymbolModalOpen] = useState<boolean>(false);
  const [symbolModalInitialTab, setSymbolModalInitialTab] = useState<'symbol' | 'equation'>('symbol');
  const [isWatermarkModalOpen, setIsWatermarkModalOpen] = useState<boolean>(false);
  const [isPageBordersModalOpen, setIsPageBordersModalOpen] = useState<boolean>(false);
  const [isWordCountModalOpen, setIsWordCountModalOpen] = useState<boolean>(false);
  const [isMacrosModalOpen, setIsMacrosModalOpen] = useState<boolean>(false);

  // Word Page Configuration
  const [pageSetup, setPageSetup] = useState<PageSetup>({
    orientation: 'portrait',
    size: 'A4',
    margins: { top: 2.54, bottom: 2.54, left: 2.54, right: 2.54 },
    marginPreset: 'normal',
    columns: 1,
    lineNumbers: false,
    hyphenation: false,
  });

  const [watermark, setWatermark] = useState<WatermarkConfig>({
    type: 'none',
    text: '',
    color: '#94a3b8',
    opacity: 0.15,
    layout: 'diagonal',
  });

  const [pageBorder, setPageBorder] = useState<PageBorderConfig>({
    enabled: false,
    style: 'solid',
    width: 2,
    color: '#2b579a',
  });

  const [pageColor, setPageColor] = useState<string>('#ffffff');

  const [comments, setComments] = useState<DocumentComment[]>([
    {
      id: 'c1',
      author: 'المدير التنفيذي',
      date: 'منذ ساعتين',
      text: 'يرجى مراجعة مؤشرات الأداء وجدول الميزانية قبل الاعتماد النهائي.',
      selectedTextSnippet: 'تقرير استراتيجي شامل',
      resolved: false,
    },
  ]);

  const [stats, setStats] = useState<DocumentStats>({
    pages: 1,
    words: 140,
    charactersNoSpaces: 720,
    charactersWithSpaces: 860,
    paragraphs: 6,
    lines: 18,
  });

  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([
    { id: 'h1', text: '1. المقدمة والأهداف العامة', level: 1 },
    { id: 'h2', text: '2. جدول مؤشرات الأداء والنتائج', level: 1 },
  ]);

  // Recalculate Word statistics dynamically & track save state
  const handleContentChange = useCallback(() => {
    setIsSaved(false);
    if (!editorRef.current) return;
    const text = editorRef.current.innerText || '';
    const html = editorRef.current.innerHTML || '';
    const newStats = calculateStats(text, html);
    setStats({
      ...newStats,
      pages: Math.max(1, Math.ceil(newStats.words / 250)),
    });

    // Update outline headings dynamically
    const headingEls = editorRef.current.querySelectorAll('h1, h2, h3');
    const newHeadings: { id: string; text: string; level: number }[] = [];
    headingEls.forEach((el, idx) => {
      const id = el.id || `heading-${idx}`;
      el.id = id;
      const level = parseInt(el.tagName.replace('H', ''), 10);
      newHeadings.push({
        id,
        text: el.textContent || `عنوان ${idx + 1}`,
        level,
      });
    });
    setHeadings(newHeadings);
  }, []);

  // Quick Manual Save (When clicking the Save button with green/orange dot)
  const handleQuickSave = useCallback(() => {
    if (activeApp === 'docs' && editorRef.current) {
      localVault.set(localVault.KEYS.DOCS_CONTENT, editorRef.current.innerHTML);
    } else if (activeApp === 'sheets' && excelData) {
      localVault.set(localVault.KEYS.SHEETS_DATA, excelData);
    } else if (activeApp === 'slides' && slidesData) {
      localVault.set(localVault.KEYS.SLIDES_DATA, slidesData);
    } else if (activeApp === 'base' && accessData) {
      localVault.set(localVault.KEYS.BASE_DATA, accessData);
    }
    localVault.set(localVault.KEYS.ACTIVE_APP, activeApp);
    localVault.set('infinity_office_active_section', activeSection);
    localVault.set('infinity_office_doc_title', documentTitle);
    setIsSaved(true);
    setAutoSaveCountdown(300);
    addNotification('تم حفظ جميع البيانات والتغييرات بنجاح! (الدائرة الخضراء مفعلة)', 'success');
  }, [activeApp, activeSection, documentTitle, excelData, slidesData, accessData]);

  // 5-Minute Auto-Save Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setAutoSaveCountdown((prev) => {
        if (prev <= 1) {
          if (activeApp === 'docs' && editorRef.current) {
            localVault.set(localVault.KEYS.DOCS_CONTENT, editorRef.current.innerHTML);
          } else if (activeApp === 'sheets' && excelData) {
            localVault.set(localVault.KEYS.SHEETS_DATA, excelData);
          } else if (activeApp === 'slides' && slidesData) {
            localVault.set(localVault.KEYS.SLIDES_DATA, slidesData);
          } else if (activeApp === 'base' && accessData) {
            localVault.set(localVault.KEYS.BASE_DATA, accessData);
          }
          localVault.set(localVault.KEYS.ACTIVE_APP, activeApp);
          localVault.set('infinity_office_active_section', activeSection);
          localVault.set('infinity_office_doc_title', documentTitle);
          setIsSaved(true);
          addNotification('تم الحفظ التلقائي بنجاح (كل 5 دقائق)', 'success');
          return 300;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeApp, activeSection, documentTitle, excelData, slidesData, accessData]);

  // Prevent data loss on accidental browser close or page refresh
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (activeApp === 'docs' && editorRef.current) {
        localVault.set(localVault.KEYS.DOCS_CONTENT, editorRef.current.innerHTML);
      } else if (activeApp === 'sheets' && excelData) {
        localVault.set(localVault.KEYS.SHEETS_DATA, excelData);
      }
      localVault.set(localVault.KEYS.ACTIVE_APP, activeApp);
      localVault.set('infinity_office_active_section', activeSection);
      localVault.set('infinity_office_doc_title', documentTitle);
      if (!isSaved) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [activeApp, activeSection, documentTitle, excelData, isSaved]);

  // Universal File Upload Handler (Word, Excel, PowerPoint, Access, PDF)
  const handleFileUpload = async (file: File) => {
    try {
      const fileName = file.name;
      const ext = fileName.split('.').pop()?.toLowerCase() || '';

      if (ext === 'docx' || ext === 'doc' || ext === 'txt' || (ext === 'html' && activeApp === 'docs')) {
        addNotification(`جاري قراءة واستيراد مستند Word "${fileName}"...`, 'info');
        let html = '';
        if (ext === 'docx' || ext === 'doc') {
          html = await parseDocxFile(file);
        } else {
          const raw = await file.text();
          html = raw.includes('<p') ? raw : `<p style="white-space: pre-wrap;">${raw}</p>`;
        }
        handleApplyTemplate(html, fileName);
        setActiveApp('docs');
        setActiveSection('office');
        addNotification(`تم فتح مستند Word "${fileName}" بنجاح مع كافة التنسيقات والجداول والفقرات!`, 'success');
      } else if (ext === 'xlsx' || ext === 'xls' || (ext === 'csv' && activeApp !== 'base')) {
        addNotification(`جاري قراءة وتحليل مصنف Excel "${fileName}"...`, 'info');
        const parsedSheets = await parseExcelFile(file);
        if (parsedSheets && Object.keys(parsedSheets).length > 0) {
          setExcelData(parsedSheets);
          localVault.set(localVault.KEYS.SHEETS_DATA, parsedSheets);
          setDocumentTitle(fileName);
          setActiveApp('sheets');
          setActiveSection('office');
          addNotification(`تم فتح ملف Excel "${fileName}" بنجاح بكافة أوراق العمل والصيغ الحسابية!`, 'success');
        } else {
          addNotification('تعذر استخراج أوراق العمل من ملف Excel', 'error');
        }
      } else if (ext === 'pptx' || ext === 'ppt') {
        addNotification(`جاري استخراج شرائح عرض PowerPoint "${fileName}"...`, 'info');
        const parsedSlides = await parsePptxFile(file);
        if (parsedSlides && parsedSlides.length > 0) {
          setSlidesData(parsedSlides);
          localVault.set(localVault.KEYS.SLIDES_DATA, parsedSlides);
          setDocumentTitle(fileName);
          setActiveApp('slides');
          setActiveSection('office');
          addNotification(`تم فتح عرض PowerPoint "${fileName}" بنجاح مع استخراج (${parsedSlides.length}) شريحة بتنسيقاتها!`, 'success');
        } else {
          addNotification('تعذر استخراج شرائح العرض من ملف PowerPoint', 'error');
        }
      } else if (ext === 'accdb' || ext === 'mdb' || ext === 'sql' || ext === 'json' || (ext === 'csv' && activeApp === 'base')) {
        addNotification(`جاري قراءة واستيراد قاعدة بيانات Access "${fileName}"...`, 'info');
        const tables = await parseAccessFile(file);
        if (tables && tables.length > 0) {
          setAccessData(tables);
          localVault.set(localVault.KEYS.BASE_DATA, tables);
          setDocumentTitle(fileName);
          setActiveApp('base');
          setActiveSection('office');
          addNotification(`تم فتح قاعدة بيانات Access "${fileName}" بنجاح مع استيراد الجداول والسجلات!`, 'success');
        } else {
          addNotification('تعذر قراءة الجداول من ملف Access', 'error');
        }
      } else if (ext === 'pdf') {
        addNotification(`جاري فتح مستند PDF "${fileName}"...`, 'info');
        setPdfFile(file);
        setDocumentTitle(fileName);
        setActiveApp('pdf');
        setActiveSection('office');
        addNotification(`تم فتح مستند PDF "${fileName}" بنجاح مع تفعيل أدوات التوقيع والأختام!`, 'success');
      } else {
        // Fallback: try as Word text
        const text = await file.text();
        handleApplyTemplate(`<p style="white-space: pre-wrap;">${text}</p>`, fileName);
        setActiveApp('docs');
        setActiveSection('office');
        addNotification(`تم استيراد الملف "${fileName}" بنجاح`, 'info');
      }
    } catch (err: unknown) {
      console.error('Error in handleFileUpload:', err);
      addNotification('حدث خطأ أثناء معالجة ورفع الملف. يرجى التأكد من سلامة صيغة الملف.', 'error');
    }
  };

  // Universal Save to Device at Chosen Location with Strict Primary Extension
  const handleSaveToDevice = async () => {
    try {
      addNotification('جاري حفظ الملف على جهازك بالامتداد الأصلي...', 'info');

      if (activeApp === 'docs') {
        const html = editorRef.current?.innerHTML || '<p>مستند فارغ</p>';
        const wordBlob = new Blob(
          [
            `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>${documentTitle}</title>
  <style>
    body { font-family: 'Cairo', Arial, sans-serif; direction: rtl; }
    table { border-collapse: collapse; width: 100%; }
    td, th { border: 1px solid #777; padding: 6px; }
  </style>
</head>
<body>
  ${html}
</body>
</html>`
          ],
          { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
        );

        const res = await saveFileDirectlyToDevice({
          filename: documentTitle,
          data: wordBlob,
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          primaryExtension: 'docx',
          description: 'مستند وورد (Microsoft Word)',
        });
        addNotification(`تم حفظ المستند بنجاح على جهازك باسم (${res.filename}) بالامتداد الأصلي .docx!`, 'success');

      } else if (activeApp === 'sheets') {
        const currentSheets = excelData || localVault.get<Record<string, { label: string; data: SheetData }>>(localVault.KEYS.SHEETS_DATA, {});
        const wb = XLSX.utils.book_new();

        Object.entries(currentSheets).forEach(([, sheetObj]) => {
          const aoa: (string | number)[][] = [];
          Object.entries(sheetObj.data || {}).forEach(([cellAddr, cell]) => {
            const decoded = XLSX.utils.decode_cell(cellAddr);
            while (aoa.length <= decoded.r) aoa.push([]);
            while (aoa[decoded.r].length <= decoded.c) aoa[decoded.r].push('');
            aoa[decoded.r][decoded.c] = cell.value ?? '';
          });
          const ws = XLSX.utils.aoa_to_sheet(aoa.length > 0 ? aoa : [['']]);
          XLSX.utils.book_append_sheet(wb, ws, sheetObj.label.slice(0, 31));
        });

        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const res = await saveFileDirectlyToDevice({
          filename: documentTitle,
          data: wbout,
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          primaryExtension: 'xlsx',
          description: 'مصنف إكسل (Microsoft Excel)',
        });
        addNotification(`تم حفظ جدول الإكسل بنجاح على جهازك باسم (${res.filename}) بالامتداد الأصلي .xlsx!`, 'success');

      } else if (activeApp === 'slides') {
        const curSlides = slidesData || localVault.get<SlideItem[]>(localVault.KEYS.SLIDES_DATA, []);
        const zip = new JSZip();
        zip.file('presentation.json', JSON.stringify({ title: documentTitle, slides: curSlides }, null, 2));
        zip.file('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="xml" ContentType="application/xml"/><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/></Types>`);
        const pptxBlob = await zip.generateAsync({ type: 'blob' });

        const res = await saveFileDirectlyToDevice({
          filename: documentTitle,
          data: pptxBlob,
          mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          primaryExtension: 'pptx',
          description: 'عرض تقديمي باور بوينت (PowerPoint)',
        });
        addNotification(`تم حفظ العرض التقديمي بنجاح على جهازك باسم (${res.filename}) بالامتداد الأصلي .pptx!`, 'success');

      } else if (activeApp === 'base') {
        const curTables = accessData || localVault.get<DbTable[]>(localVault.KEYS.BASE_DATA, []);
        const dbPackage = {
          databaseName: documentTitle,
          tables: curTables,
          exportDate: new Date().toISOString(),
        };
        const res = await saveFileDirectlyToDevice({
          filename: documentTitle,
          data: JSON.stringify(dbPackage, null, 2),
          mimeType: 'application/x-msaccess',
          primaryExtension: 'accdb',
          description: 'قاعدة بيانات أكسس (MS Access)',
        });
        addNotification(`تم حفظ قاعدة بيانات أكسس بنجاح على جهازك باسم (${res.filename}) بالامتداد الأصلي .accdb!`, 'success');

      } else if (activeApp === 'pdf') {
        let pdfData: Blob;
        if (pdfFile) {
          pdfData = pdfFile;
        } else {
          pdfData = new Blob(['%PDF-1.4\n%EOF'], { type: 'application/pdf' });
        }
        const res = await saveFileDirectlyToDevice({
          filename: documentTitle,
          data: pdfData,
          mimeType: 'application/pdf',
          primaryExtension: 'pdf',
          description: 'ملف وثيقة رقمية (Adobe PDF)',
        });
        addNotification(`تم حفظ ملف الـ PDF بنجاح على جهازك باسم (${res.filename}) بالامتداد الأصلي .pdf!`, 'success');

      } else {
        // Fallback for other apps (Notes, Photo)
        const res = await saveFileDirectlyToDevice({
          filename: documentTitle,
          data: 'Infinity Office Sovereign Document',
          mimeType: 'text/plain',
          primaryExtension: activeApp === 'photo' ? 'png' : 'txt',
          description: 'مستند سيادي',
        });
        addNotification(`تم حفظ الملف باسم (${res.filename}) بنجاح!`, 'success');
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes('إلغاء')) {
        addNotification('تم إلغاء عملية الحفظ بواسطة المستخدم', 'info');
      } else {
        console.error('Save error:', err);
        addNotification('حدث خطأ أثناء حفظ الملف على جهازك', 'error');
      }
    }
  };

  // Universal Isolated Document Print (Prints ONLY file content without app chrome)
  const handlePrintIsolated = () => {
    addNotification('جاري إرسال محتوى المستند فقط للطباعة (معزل عن أشرطة التطبيق)...', 'info');

    if (activeApp === 'docs') {
      const editorEl = document.getElementById('document-editor');
      if (editorEl) {
        printDocumentContent('document-editor', documentTitle);
        return;
      }
    } else if (activeApp === 'sheets') {
      const curSheets = excelData || localVault.get<Record<string, { label: string; data: SheetData }>>(localVault.KEYS.SHEETS_DATA, {});
      const activeSheetKey = Object.keys(curSheets)[0];
      const sheet = curSheets[activeSheetKey];
      if (sheet) {
        const tempDiv = document.createElement('div');
        tempDiv.id = 'temp-excel-print';
        tempDiv.style.display = 'none';

        let tableHtml = `<h2 style="font-size: 20px; font-weight: bold; margin-bottom: 10px;">${documentTitle} - ${sheet.label}</h2>`;
        tableHtml += '<table style="width: 100%; border-collapse: collapse; font-size: 13px;">';

        const aoa: string[][] = Array(35).fill(null).map(() => Array(12).fill(''));
        Object.entries(sheet.data || {}).forEach(([cellAddr, cell]) => {
          const d = XLSX.utils.decode_cell(cellAddr);
          if (d.r < 35 && d.c < 12) {
            aoa[d.r][d.c] = String(cell.value ?? '');
          }
        });

        aoa.forEach((row, r) => {
          tableHtml += '<tr>';
          row.forEach((val) => {
            const isHdr = r === 0;
            tableHtml += `<td style="border: 1px solid #71717a; padding: 6px 10px; ${isHdr ? 'background: #f1f5f9; font-weight: bold;' : ''}">${val}</td>`;
          });
          tableHtml += '</tr>';
        });
        tableHtml += '</table>';
        tempDiv.innerHTML = tableHtml;
        document.body.appendChild(tempDiv);
        printDocumentContent('temp-excel-print', documentTitle);
        setTimeout(() => tempDiv.remove(), 4000);
        return;
      }
    } else if (activeApp === 'slides') {
      const curSlides = slidesData || localVault.get<SlideItem[]>(localVault.KEYS.SLIDES_DATA, []);
      const tempDiv = document.createElement('div');
      tempDiv.id = 'temp-slides-print';
      tempDiv.style.display = 'none';

      let slidesHtml = '';
      curSlides.forEach((s, idx) => {
        slidesHtml += `
          <div class="slide-page" style="page-break-after: always; padding: 30px; border: 1px solid #cbd5e1; margin-bottom: 24px;">
            <div style="font-size: 12px; color: #64748b; margin-bottom: 8px;">الشريحة ${idx + 1} من ${curSlides.length}</div>
            <h1 style="font-size: 26px; font-weight: bold; margin-bottom: 12px; color: #0f172a;">${s.title}</h1>
            ${s.subtitle ? `<p style="font-size: 16px; color: #475569; margin-bottom: 16px;">${s.subtitle}</p>` : ''}
            ${s.body ? `<ul style="padding-right: 24px; font-size: 15px; line-height: 2;">${s.body.map(b => `<li>${b}</li>`).join('')}</ul>` : ''}
          </div>
        `;
      });
      tempDiv.innerHTML = slidesHtml;
      document.body.appendChild(tempDiv);
      printDocumentContent('temp-slides-print', documentTitle);
      setTimeout(() => tempDiv.remove(), 4000);
      return;
    } else if (activeApp === 'base') {
      const curTables = accessData || localVault.get<DbTable[]>(localVault.KEYS.BASE_DATA, []);
      const tbl = curTables[0];
      if (tbl) {
        const tempDiv = document.createElement('div');
        tempDiv.id = 'temp-base-print';
        tempDiv.style.display = 'none';

        let html = `<h2 style="font-size: 20px; font-weight: bold; margin-bottom: 10px;">${documentTitle} - تقرير سجلات ${tbl.label}</h2>`;
        html += '<table style="width: 100%; border-collapse: collapse; font-size: 13px;">';
        html += '<tr style="background: #f1f5f9; font-weight: bold;">';
        tbl.fields.forEach(f => {
          html += `<th style="border: 1px solid #71717a; padding: 8px 12px;">${f.label}</th>`;
        });
        html += '</tr>';

        tbl.records.forEach(rec => {
          html += '<tr>';
          tbl.fields.forEach(f => {
            html += `<td style="border: 1px solid #71717a; padding: 6px 12px;">${rec[f.name] ?? ''}</td>`;
          });
          html += '</tr>';
        });
        html += '</table>';
        tempDiv.innerHTML = html;
        document.body.appendChild(tempDiv);
        printDocumentContent('temp-base-print', documentTitle);
        setTimeout(() => tempDiv.remove(), 4000);
        return;
      }
    } else if (activeApp === 'pdf') {
      const pdfEl = document.getElementById('pdf-document-canvas-container');
      if (pdfEl) {
        printDocumentContent('pdf-document-canvas-container', documentTitle);
        return;
      }
    }

    // Standard fallback print
    window.print();
  };

  // Keyboard shortcuts listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSaveToDevice();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        handlePrintIsolated();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setIsFindReplaceOpen(true);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        setIsFindReplaceOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeApp, documentTitle, excelData, slidesData, accessData, pdfFile]);

  const handleInsertTable = (rows: number, cols: number) => {
    let tableHtml = '<table class="w-full border-collapse border border-slate-300 my-4 text-sm" contenteditable="true"><tbody>';
    for (let r = 0; r < rows; r++) {
      tableHtml += '<tr>';
      for (let c = 0; c < cols; c++) {
        if (r === 0) {
          tableHtml += `<th class="border border-slate-300 bg-slate-100 p-2 text-right font-bold text-slate-700">عمود ${c + 1}</th>`;
        } else {
          tableHtml += `<td class="border border-slate-300 p-2 text-right">خلية ${r},${c + 1}</td>`;
        }
      }
      tableHtml += '</tr>';
    }
    tableHtml += '</tbody></table><p><br></p>';
    insertHTMLAtCursor(tableHtml);
    handleContentChange();
  };

  const handleInsertQuickTable = (type: 'calendar' | 'matrix' | 'comparison') => {
    if (type === 'calendar') {
      const calHtml = `
        <table class="w-full border-collapse border border-slate-300 my-4 text-center text-xs">
          <thead>
            <tr class="bg-[#2b579a] text-white">
              <th class="p-2 border">السبت</th><th class="p-2 border">الأحد</th><th class="p-2 border">الاثنين</th>
              <th class="p-2 border">الثلاثاء</th><th class="p-2 border">الأربعاء</th><th class="p-2 border">الخميس</th><th class="p-2 border">الجمعة</th>
            </tr>
          </thead>
          <tbody>
            <tr><td class="p-2 border text-slate-400">29</td><td class="p-2 border text-slate-400">30</td><td class="p-2 border font-bold">1</td><td class="p-2 border font-bold">2</td><td class="p-2 border font-bold">3</td><td class="p-2 border font-bold">4</td><td class="p-2 border font-bold">5</td></tr>
            <tr><td class="p-2 border font-bold">6</td><td class="p-2 border font-bold">7</td><td class="p-2 border font-bold">8</td><td class="p-2 border font-bold">9</td><td class="p-2 border font-bold">10</td><td class="p-2 border font-bold">11</td><td class="p-2 border font-bold">12</td></tr>
          </tbody>
        </table>
        <p><br></p>
      `;
      insertHTMLAtCursor(calHtml);
    } else {
      handleInsertTable(4, 3);
    }
    handleContentChange();
  };

  const handleAddComment = (text: string, snippet?: string) => {
    const newComment: DocumentComment = {
      id: `c_${Date.now()}`,
      author: 'المستخدم الحالي',
      date: 'الآن',
      text,
      selectedTextSnippet: snippet,
      resolved: false,
    };
    setComments([newComment, ...comments]);
  };

  const handleApplyTemplate = (templateContent: string, title: string) => {
    setDocumentTitle(title);

    if (activeApp === 'docs') {
      if (editorRef.current) {
        editorRef.current.innerHTML = templateContent || '<p><br></p>';
        handleContentChange();
      }
      addNotification(`تم إنشاء مستند Word جديد "${title}"!`, 'success');
    } else if (activeApp === 'sheets') {
      let newSheets: Record<string, { label: string; data: SheetData }> = {
        sheet1: {
          label: 'ورقة 1',
          data: {},
        },
      };

      if (templateContent === 'mollak_budget') {
        newSheets = {
          sheet1: {
            label: 'ميزانية الملاك',
            data: {
              A1: { value: 'بند الصيانة / المصروف', bold: true, bg: '#f3f4f6' },
              B1: { value: 'المبلغ التقديري', bold: true, bg: '#f3f4f6' },
              C1: { value: 'المصروف الفعلي', bold: true, bg: '#f3f4f6' },
              D1: { value: 'الفارق', bold: true, bg: '#f3f4f6' },
              A2: { value: 'صيانة مصاعد' },
              B2: { value: '2500' },
              C2: { value: '2300' },
              D2: { value: '200', formula: '=B2-C2' },
              A3: { value: 'حراسة وأمن' },
              B3: { value: '4000' },
              C3: { value: '4000' },
              D3: { value: '0', formula: '=B3-C3' },
              A4: { value: 'كهرباء وإنارة عامة' },
              B4: { value: '1800' },
              C4: { value: '1950' },
              D4: { value: '-150', formula: '=B4-C4' },
              A5: { value: 'الإجمالي العام', bold: true, bg: '#dcfce7' },
              B5: { value: '8300', formula: '=SUM(B2:B4)', bold: true },
              C5: { value: '8250', formula: '=SUM(C2:C4)', bold: true },
              D5: { value: '50', formula: '=SUM(D2:D4)', bold: true },
            },
          },
        };
      } else if (templateContent === 'payroll') {
        newSheets = {
          sheet1: {
            label: 'مسير الرواتب',
            data: {
              A1: { value: 'اسم الموظف', bold: true, bg: '#f3f4f6' },
              B1: { value: 'الراتب الأساسي', bold: true, bg: '#f3f4f6' },
              C1: { value: 'بدل السكن', bold: true, bg: '#f3f4f6' },
              D1: { value: 'بدل النقل', bold: true, bg: '#f3f4f6' },
              E1: { value: 'إجمالي المستحق', bold: true, bg: '#dcfce7' },
              A2: { value: 'محمد المنصوري' },
              B2: { value: '8000' },
              C2: { value: '2000' },
              D2: { value: '1000' },
              E2: { value: '11000', formula: '=B2+C2+D2' },
              A3: { value: 'خالد العمري' },
              B3: { value: '6500' },
              C3: { value: '1625' },
              D3: { value: '800' },
              E3: { value: '8925', formula: '=B3+C3+D3' },
            },
          },
        };
      }

      setExcelData(newSheets);
      localVault.set(localVault.KEYS.SHEETS_DATA, newSheets);
      addNotification(`تم إنشاء مصنف Excel جديد "${title}" بنجاح!`, 'success');
    } else if (activeApp === 'slides') {
      const newSlides: SlideItem[] = [
        {
          id: `slide_${Date.now()}`,
          title: title || 'عرض تقديمي جديد',
          subtitle: 'انقر لتحرير العنوان أو إضافة عناصر جديدة',
          body: ['نقطة رئيسية أولى في العرض', 'نقطة توضيحية ثانية'],
          notes: '',
          theme: 'blue',
          layout: 'content',
        },
      ];
      setSlidesData(newSlides);
      localVault.set(localVault.KEYS.SLIDES_DATA, newSlides);
      addNotification(`تم إنشاء عرض PowerPoint جديد "${title}" بنجاح!`, 'success');
    } else if (activeApp === 'pdf') {
      setPdfFile(null);
      addNotification(`تم فتح صفحة ومستند PDF جديد فارغ للكتابة والإدراج!`, 'success');
    } else if (activeApp === 'base') {
      const newTables: DbTable[] = [
        {
          id: `tbl_${Date.now()}`,
          name: 'جدول_البيانات_1',
          label: 'جدول البيانات الرئيسي',
          fields: [
            { name: 'c1', label: 'المعرف', type: 'number', primaryKey: true },
            { name: 'c2', label: 'الاسم', type: 'text' },
            { name: 'c3', label: 'البيان', type: 'text' },
            { name: 'c4', label: 'التاريخ', type: 'date' },
          ],
          records: [
            { id: 'rec_1', c1: 1, c2: 'سجل افتراضي', c3: 'بدء إدخال البيانات', c4: '2026-10-27' },
          ],
        },
      ];
      setAccessData(newTables);
      localVault.set(localVault.KEYS.BASE_DATA, newTables);
      addNotification(`تم إنشاء قاعدة بيانات Access جديدة بنجاح!`, 'success');
    } else if (activeApp === 'notes') {
      setNotesSignal(s => s + 1);
      addNotification(`تم إنشاء دفتر ملاحظات جديد فارغ!`, 'success');
    } else if (activeApp === 'photo') {
      setPhotoSignal(s => s + 1);
      addNotification(`تم إنشاء لوحة تصميم فارغة جديدة!`, 'success');
    }
  };

  return (
    <div 
      className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 text-slate-800 font-sans select-none relative" 
      dir="rtl"
      onDragOver={(e) => { e.preventDefault(); setIsDraggingFile(true); }}
      onDragLeave={() => setIsDraggingFile(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDraggingFile(false);
        const f = e.dataTransfer.files?.[0];
        if (f) handleFileUpload(f);
      }}
    >
      {/* Universal Drag & Drop File Overlay */}
      {isDraggingFile && (
        <div className="absolute inset-0 z-[150] bg-blue-600/30 backdrop-blur-xs flex items-center justify-center border-4 border-dashed border-blue-600 pointer-events-none animate-in fade-in">
          <div className="bg-white px-8 py-6 rounded-2xl shadow-2xl text-center flex flex-col items-center">
            <UploadCloud className="w-16 h-16 text-blue-600 mb-3 animate-bounce" />
            <h3 className="text-xl font-bold text-slate-900">أفلت الملف هنا لفتحه مباشرة</h3>
            <p className="text-xs text-slate-500 mt-1">
              يدعم ملفات Word (.docx)، Excel (.xlsx)، PowerPoint (.pptx)، Access (.accdb)، و PDF باحترافية كاملة
            </p>
          </div>
        </div>
      )}

      {/* 1. Master Suite Launcher & Title Bar */}
      <TitleBar
        activeApp={activeApp}
        setActiveApp={(app) => {
          setActiveApp(app);
          setActiveSection('office');
        }}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        documentTitle={documentTitle}
        setDocumentTitle={setDocumentTitle}
        onOpenBackstage={() => setIsBackstageOpen(true)}
        onUploadFile={handleFileUpload}
        onSaveToDevice={handleSaveToDevice}
        onPrintIsolated={handlePrintIsolated}
        isSaved={isSaved}
        autoSaveCountdown={autoSaveCountdown}
        onQuickSave={handleQuickSave}
      />

      {/* 2. Main Workspace Body */}
      {activeSection === 'office' ? (
        <>
          {activeApp === 'docs' ? (
            /* Microsoft Word with Complete 8 Ribbon Tabs & Canvas */
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Word Dedicated Ribbon Tabs */}
              <WordRibbon
                activeTab={wordRibbonTab}
                onTabChange={setWordRibbonTab}
                onOpenFileMenu={() => setIsBackstageOpen(true)}
                onOpenFind={() => setIsFindReplaceOpen(true)}
                onOpenReplace={() => setIsFindReplaceOpen(true)}
                onOpenTableModal={() => setIsTablePickerOpen(true)}
                onOpenShapeModal={() => setIsShapePickerOpen(true)}
                onOpenSymbolModal={(t) => {
                  setSymbolModalInitialTab(t);
                  setIsSymbolModalOpen(true);
                }}
                onOpenComments={() => setShowCommentsDrawer(!showCommentsDrawer)}
                onOpenWatermarkModal={() => setIsWatermarkModalOpen(true)}
                onOpenPageBordersModal={() => setIsPageBordersModalOpen(true)}
                pageColor={pageColor}
                onPageColorChange={setPageColor}
                onApplyTheme={(themeName) => {
                  if (themeName.includes('Facet')) setPageColor('#f8fafc');
                  else if (themeName.includes('Organic')) setPageColor('#f0fdf4');
                  else if (themeName.includes('Retrospect')) setPageColor('#fefce8');
                  else setPageColor('#ffffff');
                }}
                pageSetup={pageSetup}
                onUpdatePageSetup={(up) => setPageSetup({ ...pageSetup, ...up })}
                onOpenWordCount={() => setIsWordCountModalOpen(true)}
                editorRef={editorRef}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                showRuler={showRuler}
                onToggleRuler={() => setShowRuler(!showRuler)}
                showGridlines={showGridlines}
                onToggleGridlines={() => setShowGridlines(!showGridlines)}
                showNavigationPane={showNavigationPane}
                onToggleNavigationPane={() => setShowNavigationPane(!showNavigationPane)}
                zoom={zoomLevel}
                onZoomChange={setZoomLevel}
                onOpenMacros={() => setIsMacrosModalOpen(true)}
              />

              {/* Horizontal Graduated Ruler */}
              <Ruler showRuler={showRuler} />

              {/* Document View Area: Navigation Pane + A4 Canvas + Comments Drawer */}
              <div className="flex-1 flex overflow-hidden relative">
                <NavigationPane
                  isOpen={showNavigationPane}
                  onClose={() => setShowNavigationPane(false)}
                  onSearch={(query) => {
                    if ((window as any).find && query) {
                      (window as any).find(query, false, false, true);
                    }
                  }}
                  headings={headings}
                />

                <DocumentCanvas
                  editorRef={editorRef}
                  onContentChange={handleContentChange}
                  pageSetup={pageSetup}
                  watermark={watermark}
                  pageBorder={pageBorder}
                  pageColor={pageColor}
                  viewMode={viewMode}
                  showGridlines={showGridlines}
                  zoom={zoomLevel}
                  onOpenCommentForSelection={(snippet) => {
                    setShowCommentsDrawer(true);
                    const text = prompt('أدخل تعليقك على هذا النص المحدد:', '');
                    if (text) {
                      handleAddComment(text, snippet);
                    }
                  }}
                />

                <CommentsDrawer
                  isOpen={showCommentsDrawer}
                  onClose={() => setShowCommentsDrawer(false)}
                  comments={comments}
                  onAddComment={(text) => handleAddComment(text)}
                  onDeleteComment={(id) => setComments(comments.filter(c => c.id !== id))}
                  onResolveComment={(id) => setComments(comments.map(c => c.id === id ? { ...c, resolved: !c.resolved } : c))}
                />
              </div>

              {/* Word Status Bar */}
              <WordStatusBar
                stats={stats}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                zoom={zoomLevel}
                onZoomChange={setZoomLevel}
                onOpenWordCount={() => setIsWordCountModalOpen(true)}
                onOpenNavigationPane={() => setShowNavigationPane(!showNavigationPane)}
                language="العربية (مصر)"
              />
            </div>
          ) : activeApp === 'sheets' ? (
            /* Microsoft Excel Sovereign Application */
            <div className="flex-1 flex flex-col overflow-hidden">
              <SheetsApp
                fontFamily={selectedFont}
                zoomLevel={zoomLevel}
                initialSheets={excelData}
                onSheetsChange={setExcelData}
                onOpenBackstage={() => setIsBackstageOpen(true)}
              />
            </div>
          ) : activeApp === 'slides' ? (
            /* Microsoft PowerPoint Sovereign Application */
            <div className="flex-1 flex flex-col overflow-hidden">
              <SlidesApp
                fontFamily={selectedFont}
                zoomLevel={zoomLevel}
                initialSlides={slidesData}
                onSlidesChange={setSlidesData}
                onOpenBackstage={() => setIsBackstageOpen(true)}
              />
            </div>
          ) : activeApp === 'pdf' ? (
            /* Adobe Acrobat / Foxit Sovereign PDF Application */
            <div className="flex-1 flex flex-col overflow-hidden">
                <PdfStudioApp
                  fontFamily={selectedFont}
                  initialPdfFile={pdfFile}
                  onPdfChange={setPdfFile}
                  onOpenBackstage={() => setIsBackstageOpen(true)}
                />
              </div>
          ) : activeApp === 'base' ? (
            /* Microsoft Access Sovereign Database Application with Full Ribbon */
            <div className="flex-1 flex flex-col overflow-hidden">
              <BaseApp
                fontFamily={selectedFont}
                initialTables={accessData}
                onTablesChange={setAccessData}
                onOpenBackstage={() => setIsBackstageOpen(true)}
              />
            </div>
          ) : (
            /* Other Office Applications (Notes, Photo) */
            <div className="flex-1 flex flex-col overflow-hidden">
              <RibbonBar
                activeApp={activeApp}
                activeTab={suiteRibbonTab}
                setActiveTab={setSuiteRibbonTab}
                onOpenBackstage={() => setIsBackstageOpen(true)}
                selectedFont={selectedFont}
                setSelectedFont={setSelectedFont}
                fontSize={fontSize}
                setFontSize={setFontSize}
                onFormatText={(cmd, val) => executeCommand(cmd, val)}
                onInsertElement={(type, payload) => {
                  console.log('Insert element in app:', type, payload);
                }}
                zoomLevel={zoomLevel}
                setZoomLevel={setZoomLevel}
              />

              <div className="flex-1 overflow-auto bg-gray-100">
                {activeApp === 'notes' && (
                  <NotesApp
                    fontFamily={selectedFont}
                    newNoteSignal={notesSignal}
                  />
                )}
                {activeApp === 'photo' && (
                  <PhotoStudioApp
                    fontFamily={selectedFont}
                    newCanvasSignal={photoSignal}
                  />
                )}
              </div>

              <LayoutStatusBar
                activeApp={activeApp}
                wordCount={stats.words}
                charCount={stats.charactersWithSpaces}
                zoomLevel={zoomLevel}
                setZoomLevel={setZoomLevel}
              />
            </div>
          )}
        </>
      ) : (
        /* Cloud Services Sections */
        <div className="flex-1 overflow-auto bg-gray-50">
          {activeSection === 'hosting' && <HostingView />}
          {activeSection === 'domains' && <DomainsView />}
          {activeSection === 'email' && <EmailView />}
          {activeSection === 'mollak' && (
            <MollakView 
              onOpenOfficeApp={(app) => {
                setActiveApp(app);
                setActiveSection('office');
              }} 
            />
          )}
          {activeSection === 'custom-solutions' && <CustomSolutionsView />}
          {activeSection === 'sovereign-vault' && <SovereignVaultView />}
        </div>
      )}

      {/* Office Backstage Modal */}
      <BackstageModal
        isOpen={isBackstageOpen}
        onClose={() => setIsBackstageOpen(false)}
        activeApp={activeApp}
        documentTitle={documentTitle}
        onApplyTemplate={handleApplyTemplate}
        onExport={(fmt) => {
          if (fmt === 'docx' || fmt === 'xlsx' || fmt === 'pptx') handleSaveToDevice();
          else handlePrintIsolated();
        }}
        onSwitchApp={(app) => {
          setActiveApp(app);
          setActiveSection('office');
        }}
        onLoadExcelData={(sheets, title) => {
          setExcelData(sheets);
          localVault.set(localVault.KEYS.SHEETS_DATA, sheets);
          setDocumentTitle(title);
          setActiveApp('sheets');
          setActiveSection('office');
          addNotification(`تم استيراد مصنف Excel "${title}" بنجاح!`, 'success');
        }}
        onLoadSlidesData={(slides, title) => {
          setSlidesData(slides);
          localVault.set(localVault.KEYS.SLIDES_DATA, slides);
          setDocumentTitle(title);
          setActiveApp('slides');
          setActiveSection('office');
          addNotification(`تم استيراد عرض PowerPoint "${title}" بنجاح!`, 'success');
        }}
        onLoadAccessData={(tables, title) => {
          setAccessData(tables);
          localVault.set(localVault.KEYS.BASE_DATA, tables);
          setDocumentTitle(title);
          setActiveApp('base');
          setActiveSection('office');
          addNotification(`تم استيراد قاعدة بيانات Access "${title}" بنجاح!`, 'success');
        }}
        onLoadPdfFile={(file) => {
          setPdfFile(file);
          setDocumentTitle(file.name);
          setActiveApp('pdf');
          setActiveSection('office');
          addNotification(`تم استيراد ملف PDF "${file.name}" بنجاح!`, 'success');
        }}
      />

      {/* Word Interactive Modals */}
      <FindReplaceModal
        isOpen={isFindReplaceOpen}
        onClose={() => setIsFindReplaceOpen(false)}
        editorRef={editorRef}
      />

      <TablePickerModal
        isOpen={isTablePickerOpen}
        onClose={() => setIsTablePickerOpen(false)}
        onInsertTable={handleInsertTable}
        onInsertQuickTable={handleInsertQuickTable}
      />

      <ShapePickerModal
        isOpen={isShapePickerOpen}
        onClose={() => setIsShapePickerOpen(false)}
        onSelectShape={(label, html) => {
          insertHTMLAtCursor(html);
          handleContentChange();
        }}
      />

      <SymbolModal
        isOpen={isSymbolModalOpen}
        onClose={() => setIsSymbolModalOpen(false)}
        onInsertSymbol={(sym) => {
          insertHTMLAtCursor(sym);
          handleContentChange();
        }}
        initialTab={symbolModalInitialTab}
      />

      <WatermarkModal
        isOpen={isWatermarkModalOpen}
        onClose={() => setIsWatermarkModalOpen(false)}
        config={watermark}
        onApplyWatermark={setWatermark}
      />

      <PageBordersModal
        isOpen={isPageBordersModalOpen}
        onClose={() => setIsPageBordersModalOpen(false)}
        config={pageBorder}
        onApplyBorder={setPageBorder}
      />

      <WordCountModal
        isOpen={isWordCountModalOpen}
        onClose={() => setIsWordCountModalOpen(false)}
        stats={stats}
      />

      <MacrosModal
        isOpen={isMacrosModalOpen}
        onClose={() => setIsMacrosModalOpen(false)}
        onRunMacro={(macroName) => {
          if (macroName === 'FormatReportHeader') {
            insertHTMLAtCursor(`<div class="text-center my-4 font-bold text-xl text-[#2b579a]">ترويسة تقرير معتمدة • ${new Date().toLocaleDateString('ar-EG')}</div>`);
          } else if (macroName === 'InsertFormalSignature') {
            insertHTMLAtCursor('<div class="mt-8 pt-4 border-t border-slate-400 text-xs font-bold text-center">التوقيع والاعتماد الرسمي<br><br>.......................................</div>');
          } else {
            alert(`تم تشغيل وحدة الماكرو ${macroName} بنجاح.`);
          }
          handleContentChange();
        }}
      />

      {/* Notifications Toast */}
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts(toasts.filter(t => t.id !== id))} />

    </div>
  );
}
