import React, { useState, useEffect } from 'react';
import { 
  OfficeAppId, 
  MainNavSection, 
  RibbonTab,
  SheetData,
  SlideItem
} from './types';
import { APP_CONFIGS } from './utils/appConfigs';
import { TitleBar } from './components/layout/TitleBar';
import { RibbonBar } from './components/layout/RibbonBar';
import { StatusBar } from './components/layout/StatusBar';
import { BackstageModal } from './components/layout/BackstageModal';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';

// Office Applications
import { DocsApp } from './components/office/DocsApp';
import { SheetsApp } from './components/office/SheetsApp';
import { SlidesApp } from './components/office/SlidesApp';
import { NotesApp } from './components/office/NotesApp';
import { BaseApp } from './components/office/BaseApp';
import { PdfStudioApp } from './components/office/PdfStudioApp';
import { PhotoStudioApp } from './components/office/PhotoStudioApp';

// Cloud Platform Hub Views
import { HostingView } from './components/cloud/HostingView';
import { DomainsView } from './components/cloud/DomainsView';
import { EmailView } from './components/cloud/EmailView';
import { MollakView } from './components/cloud/MollakView';
import { CustomSolutionsView } from './components/cloud/CustomSolutionsView';
import { SovereignVaultView } from './components/cloud/SovereignVaultView';

export default function App() {
  const [activeApp, setActiveApp] = useState<OfficeAppId>('docs');
  const [activeSection, setActiveSection] = useState<MainNavSection>('office');
  const [activeTab, setActiveTab] = useState<RibbonTab>('home');
  const [isBackstageOpen, setIsBackstageOpen] = useState<boolean>(false);

  // Document & Typography States
  const [documentTitle, setDocumentTitle] = useState<string>('تقرير مشروع إنفينيتي تكنولوجي والأوفيس السيادي');
  const [selectedFont, setSelectedFont] = useState<string>("'Segoe UI', 'Cairo', sans-serif");
  const [fontSize, setFontSize] = useState<number>(14);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Statistics
  const [wordCount, setWordCount] = useState<number>(342);
  const [charCount, setCharCount] = useState<number>(2410);

  // Document Content State for DocsApp, SheetsApp, and SlidesApp
  const [docContent, setDocContent] = useState<string | undefined>(undefined);
  const [excelSheets, setExcelSheets] = useState<Record<string, { label: string; data: SheetData }> | undefined>(undefined);
  const [slidesList, setSlidesList] = useState<SlideItem[] | undefined>(undefined);

  // Automatically reset tab to home when switching applications
  const handleSwitchApp = (app: OfficeAppId) => {
    setActiveApp(app);
    setActiveTab('home');

    // Contextual document titles
    if (app === 'docs' && documentTitle.includes('مصنف') || documentTitle.includes('عرض') || documentTitle.includes('قاعدة بيانات')) {
      setDocumentTitle('مستند رسمي - Infinity Word');
    } else if (app === 'sheets') {
      setDocumentTitle('مصنف جداول وميزانية ملاك - Infinity Excel');
    } else if (app === 'slides') {
      setDocumentTitle('عرض تقديمي استراتيجي - Infinity PowerPoint');
    } else if (app === 'base') {
      setDocumentTitle('قاعدة بيانات نظام ملاك والعقارات - Infinity Access');
    } else if (app === 'notes') {
      setDocumentTitle('دفتر الملاحظات والمذكرات الصوتية - Infinity OneNote');
    } else if (app === 'pdf') {
      setDocumentTitle('مستند PDF معتمد وموقع - Infinity PDF Studio');
    } else if (app === 'photo') {
      setDocumentTitle('تصميم وتعديل الصور - Infinity Photo Studio');
    }
  };

  // Keyboard shortcuts (Ctrl+S, F5, Ctrl+P)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        alert('تم حفظ الملف والخزنة السيادية محلياً بنجاح!');
      }
      if (e.key === 'F5' && activeApp === 'slides') {
        e.preventDefault();
        // Slides will listen to F5 via its presenter mode
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeApp]);

  // Format text command handler for WYSIWYG
  const handleFormatText = (command: string, value?: string) => {
    if (command === 'pageOrientation' || command === 'pageMargins') {
      alert(`تم تطبيق إعداد: ${command} (${value}) بنجاح.`);
      return;
    }
    if (command === 'dirRTL') {
      document.execCommand('styleWithCSS', false, 'true');
      const selection = window.getSelection();
      if (selection && selection.anchorNode) {
        const el = selection.anchorNode.parentElement;
        if (el) el.dir = 'rtl';
      }
      return;
    }
    if (command === 'dirLTR') {
      const selection = window.getSelection();
      if (selection && selection.anchorNode) {
        const el = selection.anchorNode.parentElement;
        if (el) el.dir = 'ltr';
      }
      return;
    }

    try {
      document.execCommand(command, false, value);
    } catch (e) {
      console.warn('execCommand warning:', e);
    }
  };

  const handleInsertElement = (type: string, payload?: any) => {
    if (type === 'table') {
      const tableHtml = `
        <table border="1" style="width: 100%; border-collapse: collapse; margin: 15px 0;">
          <tr style="background-color: #f3f4f6;">
            <th style="padding: 8px; border: 1px solid #d1d5db;">البند / الوصف</th>
            <th style="padding: 8px; border: 1px solid #d1d5db;">الكمية</th>
            <th style="padding: 8px; border: 1px solid #d1d5db;">السعر (ر.س)</th>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #d1d5db;">اشتراك سيرفر سحابي</td>
            <td style="padding: 8px; border: 1px solid #d1d5db;">1</td>
            <td style="padding: 8px; border: 1px solid #d1d5db;">450</td>
          </tr>
        </table>
      `;
      document.execCommand('insertHTML', false, tableHtml);
    } else if (type === 'signature') {
      const sigHtml = `
        <div style="margin: 20px 0; border: 2px dashed #0078d4; border-radius: 8px; padding: 12px; display: inline-block;">
          <strong style="color: #0078d4;">★ توقيع واعتماد إلكتروني رسمي</strong>
          <div style="font-family: 'Cairo'; font-size: 11px; color: #4b5563; margin-top: 4px;">
            شركة إنفينيتي تكنولوجي - معتمد في ${new Date().toLocaleDateString('ar-EG')}
          </div>
        </div>
      `;
      document.execCommand('insertHTML', false, sigHtml);
    } else if (type === 'chart') {
      alert('تم فتح أداة الرسوم البيانية. يمكنك أيضاً استخدام Infinity Sheets لتوليد رسوم بيانية أكثر تفصيلاً.');
    } else if (type === 'image') {
      const url = prompt('أدخل رابط الصورة أو ارفعها من ملف:', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600');
      if (url) {
        document.execCommand('insertImage', false, url);
      }
    } else if (type === 'startPresenter') {
      handleSwitchApp('slides');
    }
  };

  const handleApplyTemplate = (templateContent: string, newTitle: string) => {
    if (activeApp === 'docs') {
      setDocContent(templateContent);
    }
    setDocumentTitle(newTitle);
  };

  const handleExport = (format: 'docx' | 'xlsx' | 'pptx' | 'pdf' | 'json' | 'txt') => {
    if (format === 'pdf') {
      window.print();
      return;
    }

    let mime = 'text/plain';
    let ext = 'txt';
    let data = '';

    if (format === 'docx') {
      mime = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      ext = 'docx';
      data = docContent || 'Infinity Sovereign Document Content';
    } else if (format === 'xlsx') {
      mime = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      ext = 'xlsx';
      data = 'ColA,ColB,ColC\n100,200,300';
    } else if (format === 'json') {
      mime = 'application/json';
      ext = 'json';
      data = JSON.stringify({
        title: documentTitle,
        app: activeApp,
        exportedAt: new Date().toISOString(),
        content: docContent,
      }, null, 2);
    }

    const blob = new Blob([data], { type: `${mime};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${documentTitle.replace(/\s+/g, '_')}.${ext}`;
    link.click();
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#f3f4f6] text-[#242424] antialiased select-none font-cairo">
      {/* 1. Microsoft 365 Authentic Title Bar */}
      <TitleBar
        activeApp={activeApp}
        setActiveApp={handleSwitchApp}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        documentTitle={documentTitle}
        setDocumentTitle={setDocumentTitle}
        onOpenBackstage={() => setIsBackstageOpen(true)}
      />

      {/* 2. Microsoft Office Ribbon Toolbar (Visible when in Office suite mode) */}
      {activeSection === 'office' && (
        <RibbonBar
          activeApp={activeApp}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenBackstage={() => setIsBackstageOpen(true)}
          selectedFont={selectedFont}
          setSelectedFont={setSelectedFont}
          fontSize={fontSize}
          setFontSize={setFontSize}
          onFormatText={handleFormatText}
          onInsertElement={handleInsertElement}
          zoomLevel={zoomLevel}
          setZoomLevel={setZoomLevel}
        />
      )}

      {/* 3. Main Workspace Area */}
      <main className="flex-1 flex overflow-hidden relative">
        {activeSection === 'office' ? (
          <>
            {activeApp === 'docs' && (
              <DocsApp
                fontFamily={selectedFont}
                fontSize={fontSize}
                zoomLevel={zoomLevel}
                setWordCount={setWordCount}
                setCharCount={setCharCount}
                initialContent={docContent}
                onContentChange={(html) => setDocContent(html)}
              />
            )}
            {activeApp === 'sheets' && (
              <SheetsApp 
                fontFamily={selectedFont} 
                zoomLevel={zoomLevel} 
                initialSheets={excelSheets}
                onSheetsChange={setExcelSheets}
              />
            )}
            {activeApp === 'slides' && (
              <SlidesApp 
                fontFamily={selectedFont} 
                zoomLevel={zoomLevel} 
                initialSlides={slidesList}
                onSlidesChange={setSlidesList}
              />
            )}
            {activeApp === 'notes' && (
              <NotesApp fontFamily={selectedFont} />
            )}
            {activeApp === 'base' && (
              <BaseApp fontFamily={selectedFont} />
            )}
            {activeApp === 'pdf' && (
              <PdfStudioApp fontFamily={selectedFont} />
            )}
            {activeApp === 'photo' && (
              <PhotoStudioApp fontFamily={selectedFont} />
            )}
          </>
        ) : (
          <>
            {activeSection === 'hosting' && <HostingView />}
            {activeSection === 'domains' && <DomainsView />}
            {activeSection === 'email' && <EmailView />}
            {activeSection === 'mollak' && (
              <MollakView
                onOpenOfficeApp={(app) => {
                  setActiveSection('office');
                  handleSwitchApp(app);
                }}
              />
            )}
            {activeSection === 'custom-solutions' && <CustomSolutionsView />}
            {activeSection === 'sovereign-vault' && <SovereignVaultView />}
          </>
        )}
      </main>

      {/* 4. Microsoft Office Status Bar (when in Office mode) */}
      {activeSection === 'office' && (
        <StatusBar
          activeApp={activeApp}
          wordCount={wordCount}
          charCount={charCount}
          zoomLevel={zoomLevel}
          setZoomLevel={setZoomLevel}
        />
      )}

      {/* 5. Backstage View Modal (File menu) */}
      <BackstageModal
        isOpen={isBackstageOpen}
        onClose={() => setIsBackstageOpen(false)}
        activeApp={activeApp}
        documentTitle={documentTitle}
        onApplyTemplate={handleApplyTemplate}
        onExport={handleExport}
        onSwitchApp={handleSwitchApp}
        onLoadExcelData={(sheets, title) => {
          setExcelSheets(sheets);
          setDocumentTitle(title);
        }}
        onLoadSlidesData={(slides, title) => {
          setSlidesList(slides);
          setDocumentTitle(title);
        }}
      />

      {/* 6. Offline Sovereign PWA Toast Indicator */}
      <OfflineIndicator />
    </div>
  );
}
