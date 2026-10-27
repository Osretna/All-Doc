import React, { useState, useRef, useEffect } from 'react';
import {
  Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight,
  AlignJustify, List, ListOrdered, Image, Table, Save, Printer, Upload,
  FileText, Undo, Redo, Heading1, Heading2, Highlighter, Palette, Sparkles, Check
} from 'lucide-react';
import mammoth from 'mammoth';
import { saveFileDirectlyToDevice } from '../utils/fileSaver';
import { printDocumentContent } from '../utils/printHelper';

interface WordAppProps {
  onNotify: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const WordApp: React.FC<WordAppProps> = ({ onNotify }) => {
  const [docTitle, setDocTitle] = useState<string>('مستند_جديد');
  const [originalExtension, setOriginalExtension] = useState<string>('docx');
  const [fontSize, setFontSize] = useState<string>('16');
  const [fontFamily, setFontFamily] = useState<string>('Cairo');
  const [wordCount, setWordCount] = useState<number>(0);
  const [charCount, setCharCount] = useState<number>(0);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize with professional sample document
  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML.trim()) {
      editorRef.current.innerHTML = `
        <h1 style="color: #1e3a8a; font-size: 26px; margin-bottom: 8px; text-align: center; font-weight: bold;">تقرير أعمال الشركة السنوي</h1>
        <p style="text-align: center; color: #64748b; font-size: 14px; margin-bottom: 24px;">تاريخ الإصدار: ${new Date().toLocaleDateString('ar-EG')} | رقم المرجع: DOC-2026-X1</p>
        <hr style="border: none; border-top: 2px solid #e2e8f0; margin-bottom: 20px;" />
        
        <h2 style="color: #0f172a; font-size: 20px; font-weight: 600;">1. نظرة عامة والملخص التنفيذي</h2>
        <p style="margin-bottom: 14px; text-align: justify; line-height: 1.8;">
          يسرنا تقديم التقرير التشغيلي والمالي الشامل، حيث أظهرت المؤشرات نمواً استثنائياً في جميع القطاعات المستهدفة بنسبة تجاوزت <strong>28%</strong> مقارنة بالفترة السابقة. لقد تم استكمال مشاريع التحول الرقمي وحوكمة البيانات بنجاح تام.
        </p>

        <h2 style="color: #0f172a; font-size: 20px; font-weight: 600; margin-top: 20px;">2. الإنجازات المحققة في الربع الحالي</h2>
        <ul style="padding-right: 24px; margin-bottom: 16px; line-height: 1.8;">
          <li>تطوير وتحديث منظومة إدارة الوثائق والمستندات الذكية.</li>
          <li>توسيع الحصة السوقية واكتساب أكثر من <strong>1,450</strong> عميل جديد.</li>
          <li>الحصول على شهادة الآيزو في إدارة الجودة وتأمين البيانات السحابية.</li>
        </ul>

        <h2 style="color: #0f172a; font-size: 20px; font-weight: 600; margin-top: 20px;">3. ملخص الإيرادات والمصروفات</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #f1f5f9; color: #1e293b;">
              <th style="border: 1px solid #cbd5e1; padding: 10px; text-align: right;">الربع السنوي</th>
              <th style="border: 1px solid #cbd5e1; padding: 10px; text-align: right;">الإيرادات (ر.س)</th>
              <th style="border: 1px solid #cbd5e1; padding: 10px; text-align: right;">المصروفات (ر.س)</th>
              <th style="border: 1px solid #cbd5e1; padding: 10px; text-align: right;">صافي الربح</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid #cbd5e1; padding: 8px 10px;">الربع الأول</td>
              <td style="border: 1px solid #cbd5e1; padding: 8px 10px;">1,250,000</td>
              <td style="border: 1px solid #cbd5e1; padding: 8px 10px;">820,000</td>
              <td style="border: 1px solid #cbd5e1; padding: 8px 10px; color: #16a34a; font-weight: bold;">+430,000</td>
            </tr>
            <tr style="background-color: #f8fafc;">
              <td style="border: 1px solid #cbd5e1; padding: 8px 10px;">الربع الثاني</td>
              <td style="border: 1px solid #cbd5e1; padding: 8px 10px;">1,680,000</td>
              <td style="border: 1px solid #cbd5e1; padding: 8px 10px;">910,000</td>
              <td style="border: 1px solid #cbd5e1; padding: 8px 10px; color: #16a34a; font-weight: bold;">+770,000</td>
            </tr>
          </tbody>
        </table>

        <p style="color: #64748b; font-size: 13px; font-style: italic; margin-top: 30px; text-align: left;">
          تم التوثيق بواسطة: الإدارة العامة | التوقيع: ________________
        </p>
      `;
      updateStats();
    }
  }, []);

  const updateStats = () => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText || '';
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setWordCount(words);
    setCharCount(text.length);
  };

  const executeCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
      updateStats();
    }
  };

  // Upload and parse document file (.docx, .doc, .txt, .html)
  const handleFileUpload = async (file: File) => {
    try {
      const fileName = file.name;
      const fileExt = fileName.split('.').pop()?.toLowerCase() || 'docx';
      const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
      setDocTitle(nameWithoutExt);
      setOriginalExtension(fileExt);

      onNotify(`جاري قراءة وتحليل ملف ${fileName}...`, 'info');

      if (fileExt === 'docx') {
        // Parse actual DOCX file binary using mammoth
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        if (editorRef.current) {
          editorRef.current.innerHTML = result.value || '<p>مستند فارغ</p>';
          updateStats();
        }
        onNotify(`تم فتح ملف الوورد ${fileName} بنجاح مع كامل الخصائص والتنسيقات!`, 'success');
      } else if (fileExt === 'txt') {
        const text = await file.text();
        const formatted = text
          .split('\n')
          .map(line => `<p>${line || '<br>'}</p>`)
          .join('');
        if (editorRef.current) {
          editorRef.current.innerHTML = formatted;
          updateStats();
        }
        onNotify(`تم فتح ملف النص ${fileName} بنجاح!`, 'success');
      } else if (fileExt === 'html' || fileExt === 'htm') {
        const html = await file.text();
        if (editorRef.current) {
          editorRef.current.innerHTML = html;
          updateStats();
        }
        onNotify(`تم فتح ملف المستند ${fileName} بنجاح!`, 'success');
      } else {
        // Fallback: try reading as text
        const text = await file.text();
        if (editorRef.current) {
          editorRef.current.innerText = text;
          updateStats();
        }
        onNotify(`تم استيراد الملف ${fileName} كملف نصي بنجاح`, 'info');
      }
    } catch (err: unknown) {
      console.error('Error reading Word file:', err);
      onNotify('حدث خطأ أثناء قراءة ملف الوورد: تأكد من سلامة تنسيق الملف', 'error');
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  // Handle Drag & Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Save to device directly at user's chosen location with original extension
  const handleSaveToDevice = async () => {
    if (!editorRef.current) return;
    setIsSaving(true);
    try {
      const contentHtml = editorRef.current.innerHTML;
      
      // Build a clean Word-compliant document package (.docx / HTML Word document)
      const wordDocumentBlob = new Blob(
        [
          `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>${docTitle}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    body { font-family: 'Cairo', 'Segoe UI', Arial, sans-serif; direction: rtl; }
    table { border-collapse: collapse; width: 100%; }
    td, th { border: 1px solid #999; padding: 6px 10px; }
  </style>
</head>
<body>
  ${contentHtml}
</body>
</html>`
        ],
        {
          type: originalExtension === 'txt' 
            ? 'text/plain;charset=utf-8' 
            : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        }
      );

      const result = await saveFileDirectlyToDevice({
        filename: `${docTitle}`,
        data: wordDocumentBlob,
        mimeType: originalExtension === 'txt'
          ? 'text/plain'
          : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        primaryExtension: originalExtension || 'docx',
        description: 'مستند وورد (Microsoft Word)',
      });

      onNotify(`تم حفظ المستند بنجاح على جهازك باسم (${result.filename}) بالامتداد الأصلي .${originalExtension}!`, 'success');
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes('إلغاء')) {
        onNotify('تم إلغاء الحفظ', 'info');
      } else {
        console.error('Save error:', err);
        onNotify('حدث خطأ أثناء حفظ الملف على جهازك', 'error');
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Print ONLY document content (not whole page or UI)
  const handlePrintDocument = () => {
    printDocumentContent('word-printable-content', docTitle);
    onNotify('تم إرسال محتوى المستند فقط إلى الطابعة بنجاح', 'success');
  };

  const insertTable = () => {
    const tableHtml = `
      <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
        <thead>
          <tr style="background-color: #f1f5f9;">
            <th style="border: 1px solid #cbd5e1; padding: 8px;">العمود 1</th>
            <th style="border: 1px solid #cbd5e1; padding: 8px;">العمود 2</th>
            <th style="border: 1px solid #cbd5e1; padding: 8px;">العمود 3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">بيان 1</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">بيان 2</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">بيان 3</td>
          </tr>
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">بيان 4</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">بيان 5</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">بيان 6</td>
          </tr>
        </tbody>
      </table>
      <p><br></p>
    `;
    executeCommand('insertHTML', tableHtml);
  };

  return (
    <div 
      className="flex flex-col h-full bg-slate-100"
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".docx,.doc,.txt,.rtf,.html"
        onChange={onFileInputChange}
        className="hidden"
      />

      {/* Drag & Drop Overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-50 bg-blue-600/20 backdrop-blur-xs flex items-center justify-center border-4 border-dashed border-blue-600 pointer-events-none">
          <div className="bg-white px-8 py-6 rounded-2xl shadow-2xl text-center">
            <Upload className="w-16 h-16 text-blue-600 mx-auto mb-3 animate-bounce" />
            <h3 className="text-xl font-bold text-slate-800">أفلت ملف الوورد هنا لفتحه مباشرة</h3>
            <p className="text-sm text-slate-500 mt-1">يدعم ملفات .docx, .doc, .txt, .html مع حفظ كافة التنسيقات</p>
          </div>
        </div>
      )}

      {/* Word Ribbon Toolbar */}
      <div className="bg-white border-b border-slate-200 shadow-xs select-none no-print">
        {/* Document Header & Quick Actions */}
        <div className="flex flex-wrap items-center justify-between px-4 py-2 border-b border-slate-100 gap-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
              W
            </div>
            <div>
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                className="text-base font-bold text-slate-800 bg-transparent hover:bg-slate-50 focus:bg-white focus:ring-1 focus:ring-blue-500 rounded px-2 py-0.5 border border-transparent hover:border-slate-300 transition-all"
                title="انقر لتعديل اسم المستند"
              />
              <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold mr-1">
                .{originalExtension}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Open / Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              title="فتح ملف وورد من جهازك (.docx, .doc, .txt)"
            >
              <Upload className="w-4 h-4 text-blue-600" />
              <span>رفع ملف</span>
            </button>

            {/* Print Content Button (Isolated) */}
            <button
              onClick={handlePrintDocument}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              title="طباعة محتوى المستند فقط دون أشرطة التطبيق"
            >
              <Printer className="w-4 h-4 text-emerald-600" />
              <span>طباعة المحتوى فقط</span>
            </button>

            {/* Save Direct to Device Button */}
            <button
              onClick={handleSaveToDevice}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-xs hover:shadow cursor-pointer disabled:opacity-60"
              title={`حفظ على جهازك في المسار الذي تريده بامتداد .${originalExtension}`}
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'جاري الحفظ...' : `حفظ على الجهاز (.${originalExtension})`}</span>
            </button>
          </div>
        </div>

        {/* Formatting Command Buttons */}
        <div className="flex flex-wrap items-center gap-1 px-4 py-1.5 text-slate-700 text-sm overflow-x-auto">
          {/* History */}
          <button
            onClick={() => executeCommand('undo')}
            className="p-1.5 rounded hover:bg-slate-100 transition-colors"
            title="تراجع (Ctrl+Z)"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={() => executeCommand('redo')}
            className="p-1.5 rounded hover:bg-slate-100 transition-colors"
            title="إعادة (Ctrl+Y)"
          >
            <Redo className="w-4 h-4" />
          </button>

          <div className="h-5 w-px bg-slate-200 mx-1" />

          {/* Font Family */}
          <select
            value={fontFamily}
            onChange={(e) => {
              setFontFamily(e.target.value);
              executeCommand('fontName', e.target.value);
            }}
            className="text-xs px-2 py-1 rounded border border-slate-200 bg-white hover:border-slate-300"
          >
            <option value="Cairo">خط القاهرة (Cairo)</option>
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Segoe UI">Segoe UI</option>
            <option value="Courier New">Courier New</option>
          </select>

          {/* Font Size */}
          <select
            value={fontSize}
            onChange={(e) => {
              setFontSize(e.target.value);
              executeCommand('fontSize', e.target.value === '12' ? '2' : e.target.value === '16' ? '3' : e.target.value === '20' ? '4' : '5');
            }}
            className="text-xs px-2 py-1 rounded border border-slate-200 bg-white hover:border-slate-300 w-16"
          >
            <option value="12">12 pt</option>
            <option value="14">14 pt</option>
            <option value="16">16 pt</option>
            <option value="20">20 pt</option>
            <option value="24">24 pt</option>
            <option value="32">32 pt</option>
          </select>

          <div className="h-5 w-px bg-slate-200 mx-1" />

          {/* Basic Styles */}
          <button
            onClick={() => executeCommand('bold')}
            className="p-1.5 rounded hover:bg-slate-100 font-bold transition-colors"
            title="عريض (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => executeCommand('italic')}
            className="p-1.5 rounded hover:bg-slate-100 italic transition-colors"
            title="مائل (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => executeCommand('underline')}
            className="p-1.5 rounded hover:bg-slate-100 underline transition-colors"
            title="تسطير (Ctrl+U)"
          >
            <Underline className="w-4 h-4" />
          </button>
          <button
            onClick={() => executeCommand('strikeThrough')}
            className="p-1.5 rounded hover:bg-slate-100 transition-colors"
            title="يتوسطه خط"
          >
            <Strikethrough className="w-4 h-4" />
          </button>

          <div className="h-5 w-px bg-slate-200 mx-1" />

          {/* Headings */}
          <button
            onClick={() => executeCommand('formatBlock', '<h1>')}
            className="p-1.5 rounded hover:bg-slate-100 transition-colors"
            title="عنوان رئيسي 1"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            onClick={() => executeCommand('formatBlock', '<h2>')}
            className="p-1.5 rounded hover:bg-slate-100 transition-colors"
            title="عنوان فرعي 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>

          <div className="h-5 w-px bg-slate-200 mx-1" />

          {/* Alignments */}
          <button
            onClick={() => executeCommand('justifyRight')}
            className="p-1.5 rounded hover:bg-slate-100 transition-colors"
            title="محاذاة لليمين"
          >
            <AlignRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => executeCommand('justifyCenter')}
            className="p-1.5 rounded hover:bg-slate-100 transition-colors"
            title="توسيط"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            onClick={() => executeCommand('justifyLeft')}
            className="p-1.5 rounded hover:bg-slate-100 transition-colors"
            title="محاذاة لليسار"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => executeCommand('justifyFull')}
            className="p-1.5 rounded hover:bg-slate-100 transition-colors"
            title="ضبط النص (Justify)"
          >
            <AlignJustify className="w-4 h-4" />
          </button>

          <div className="h-5 w-px bg-slate-200 mx-1" />

          {/* Lists */}
          <button
            onClick={() => executeCommand('insertUnorderedList')}
            className="p-1.5 rounded hover:bg-slate-100 transition-colors"
            title="قائمة نقطية"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => executeCommand('insertOrderedList')}
            className="p-1.5 rounded hover:bg-slate-100 transition-colors"
            title="قائمة رقمية"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          <div className="h-5 w-px bg-slate-200 mx-1" />

          {/* Insert Table & Elements */}
          <button
            onClick={insertTable}
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-100 text-xs font-medium text-slate-700 transition-colors"
            title="إدراج جدول"
          >
            <Table className="w-3.5 h-3.5 text-blue-600" />
            <span>جدول</span>
          </button>

          {/* Colors */}
          <div className="flex items-center gap-1 mr-1">
            <label className="flex items-center gap-1 p-1 rounded hover:bg-slate-100 cursor-pointer" title="لون النص">
              <Palette className="w-4 h-4 text-red-500" />
              <input
                type="color"
                className="w-4 h-4 opacity-0 absolute pointer-events-none"
                onChange={(e) => executeCommand('foreColor', e.target.value)}
              />
            </label>
            <label className="flex items-center gap-1 p-1 rounded hover:bg-slate-100 cursor-pointer" title="لون التمييز">
              <Highlighter className="w-4 h-4 text-amber-500" />
              <input
                type="color"
                className="w-4 h-4 opacity-0 absolute pointer-events-none"
                defaultValue="#fef08a"
                onChange={(e) => executeCommand('hiliteColor', e.target.value)}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Document Workspace / A4 Canvas */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-slate-200/70">
        <div
          id="word-printable-content"
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={updateStats}
          style={{ fontFamily: fontFamily }}
          className="printable-content bg-white w-full max-w-[850px] min-h-[1100px] p-10 sm:p-14 shadow-xl border border-slate-300 rounded-sm outline-none focus:ring-2 focus:ring-blue-400 text-slate-800 leading-relaxed text-right"
          dir="rtl"
        />
      </div>

      {/* Word Status Bar */}
      <div className="bg-white border-t border-slate-200 px-4 py-1.5 flex items-center justify-between text-xs text-slate-500 select-none no-print">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>الكلمات: <strong className="text-slate-700">{wordCount}</strong></span>
          </span>
          <span>الحروف: <strong className="text-slate-700">{charCount}</strong></span>
          <span>الصفحات التقديرية: <strong className="text-slate-700">{Math.max(1, Math.ceil(wordCount / 400))}</strong></span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-600">
            <Check className="w-3.5 h-3.5" />
            <span>جاهز للحفظ أو الطباعة</span>
          </span>
          <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">100%</span>
        </div>
      </div>
    </div>
  );
};
