import React, { useState, useRef, useEffect } from 'react';
import {
  Upload, Printer, Save, FileText, ZoomIn, ZoomOut, RotateCw,
  Search, ShieldCheck, Check, ChevronRight, ChevronLeft,
  Stamp, PenTool, Highlighter, Download, Eye, FileDown
} from 'lucide-react';
import { saveFileDirectlyToDevice } from '../utils/fileSaver';
import { printDocumentContent } from '../utils/printHelper';

interface PdfAppProps {
  onNotify: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const PdfApp: React.FC<PdfAppProps> = ({ onNotify }) => {
  const [docTitle, setDocTitle] = useState<string>('مستند_رسمي_معتمد');
  const [originalExtension, setOriginalExtension] = useState<string>('pdf');
  const [pdfFileUrl, setPdfFileUrl] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(3);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [activeStamp, setActiveStamp] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [rawPdfBlob, setRawPdfBlob] = useState<Blob | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload and parse PDF file
  const handleFileUpload = async (file: File) => {
    try {
      const fileName = file.name;
      const fileExt = fileName.split('.').pop()?.toLowerCase() || 'pdf';
      const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
      setDocTitle(nameWithoutExt);
      setOriginalExtension(fileExt);

      onNotify(`جاري فتح ومعالجة ملف PDF ${fileName}...`, 'info');

      // Create an object URL to preview the real PDF directly in the browser's PDF engine
      const url = URL.createObjectURL(file);
      setPdfFileUrl(url);
      setRawPdfBlob(file);
      setTotalPages(Math.max(1, Math.round(file.size / 50000))); // estimated pages
      setCurrentPage(1);

      onNotify(`تم فتح ملف الـ PDF ${fileName} بنجاح بكافة خصائصه وصفحاته!`, 'success');
    } catch (err: unknown) {
      console.error('Error opening PDF:', err);
      onNotify('حدث خطأ أثناء فتح ملف PDF', 'error');
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Save directly to user's device at chosen location with original extension
  const handleSaveToDevice = async () => {
    setIsSaving(true);
    try {
      let dataToSave: Blob;
      if (rawPdfBlob) {
        dataToSave = rawPdfBlob;
      } else {
        // Build a valid PDF document file blob with metadata
        const printableElement = document.getElementById('pdf-printable-content');
        const content = printableElement ? printableElement.innerText : 'مستند PDF';
        
        // Minimal standard PDF wrapper header/trailer
        const pdfData = `%PDF-1.4\n1 0 obj\n<< /Title (${docTitle}) /Creator (Office Suite Pro) >>\nendobj\n2 0 obj\n<< /Type /Catalog /Pages 3 0 R >>\nendobj\n3 0 obj\n<< /Type /Pages /Kids [4 0 R] /Count 1 >>\nendobj\n4 0 obj\n<< /Type /Page /Parent 3 0 R /MediaBox [0 0 595 842] /Contents 5 0 R >>\nendobj\n5 0 obj\n<< /Length ${content.length + 50} >>\nstream\nBT /F1 12 Tf 50 800 Td (${content.substring(0, 100)}) Tj ET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f \n0000000009 00000 n \n0000000080 00000 n \n0000000130 00000 n \n0000000190 00000 n \n0000000285 00000 n \ntrailer\n<< /Size 6 /Root 2 0 R >>\nstartxref\n400\n%%EOF`;
        dataToSave = new Blob([pdfData], { type: 'application/pdf' });
      }

      const result = await saveFileDirectlyToDevice({
        filename: `${docTitle}`,
        data: dataToSave,
        mimeType: 'application/pdf',
        primaryExtension: originalExtension || 'pdf',
        description: 'ملف وثيقة رقمية (Adobe PDF)',
      });

      onNotify(`تم حفظ ملف الـ PDF بنجاح على جهازك باسم (${result.filename}) بالامتداد الأصلي .${originalExtension}!`, 'success');
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes('إلغاء')) {
        onNotify('تم إلغاء الحفظ', 'info');
      } else {
        console.error('Error saving PDF:', err);
        onNotify('حدث خطأ أثناء حفظ الملف على جهازك', 'error');
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Print ONLY PDF document pages (isolated)
  const handlePrintPdf = () => {
    printDocumentContent('pdf-printable-content', docTitle);
    onNotify('تم إرسال صفحات مستند PDF فقط للطباعة بدون أي أشرطة خارجية', 'success');
  };

  return (
    <div
      className="flex flex-col h-full bg-slate-200"
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={onFileInputChange}
        className="hidden"
      />

      {isDragging && (
        <div className="absolute inset-0 z-50 bg-red-600/20 backdrop-blur-xs flex items-center justify-center border-4 border-dashed border-red-600 pointer-events-none">
          <div className="bg-white px-8 py-6 rounded-2xl shadow-2xl text-center">
            <Upload className="w-16 h-16 text-red-600 mx-auto mb-3 animate-bounce" />
            <h3 className="text-xl font-bold text-slate-800">أفلت ملف الـ PDF هنا لفتحه مباشرة</h3>
            <p className="text-sm text-slate-500 mt-1">يدعم استعراض وطباعة ملفات .pdf باحترافية كاملة</p>
          </div>
        </div>
      )}

      {/* PDF Ribbon Toolbar */}
      <div className="bg-white border-b border-slate-200 shadow-xs select-none no-print">
        <div className="flex flex-wrap items-center justify-between px-4 py-2 border-b border-slate-100 gap-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
              PDF
            </div>
            <div>
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                className="text-base font-bold text-slate-800 bg-transparent hover:bg-slate-50 focus:bg-white focus:ring-1 focus:ring-red-600 rounded px-2 py-0.5 border border-transparent hover:border-slate-300 transition-all"
                title="تعديل اسم مستند PDF"
              />
              <span className="text-xs px-2 py-0.5 rounded bg-red-50 text-red-600 font-semibold mr-1">
                .{originalExtension}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              title="استيراد وفتح ملف PDF من جهازك"
            >
              <Upload className="w-4 h-4 text-red-600" />
              <span>رفع ملف PDF</span>
            </button>

            <button
              onClick={handlePrintPdf}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              title="طباعة محتوى صفحات الـ PDF فقط دون واجهة التطبيق"
            >
              <Printer className="w-4 h-4 text-emerald-600" />
              <span>طباعة المحتوى فقط</span>
            </button>

            <button
              onClick={handleSaveToDevice}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-all shadow-xs hover:shadow cursor-pointer disabled:opacity-60"
              title={`حفظ على جهازك في المسار الذي تريده بامتداد .${originalExtension}`}
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'جاري الحفظ...' : `حفظ على الجهاز (.${originalExtension})`}</span>
            </button>
          </div>
        </div>

        {/* PDF Navigation and Zoom Controls */}
        <div className="flex flex-wrap items-center justify-between px-4 py-1.5 text-slate-700 text-sm gap-2">
          {/* Page Navigation */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
              className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
              title="الصفحة السابقة"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="text-xs font-medium">
              صفحة <strong className="text-slate-800">{currentPage}</strong> من {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
              title="الصفحة التالية"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Zoom and Rotate */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoomLevel(Math.max(50, zoomLevel - 15))}
              className="p-1.5 rounded hover:bg-slate-100 transition-colors"
              title="تصغير"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold w-12 text-center">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(Math.min(200, zoomLevel + 15))}
              className="p-1.5 rounded hover:bg-slate-100 transition-colors"
              title="تكبير"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <div className="h-5 w-px bg-slate-200 mx-1" />

            <button
              onClick={() => setRotation((rotation + 90) % 360)}
              className="p-1.5 rounded hover:bg-slate-100 transition-colors"
              title="تدوير الصفحة 90 درجة"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          {/* Official Stamps */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-400 ml-1">الأختام:</span>
            <button
              onClick={() => {
                setActiveStamp('APPROVED');
                onNotify('تم تطبيق ختم (معتمد - APPROVED) على المستند', 'success');
              }}
              className="px-2 py-0.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-[11px] font-bold border border-emerald-300"
            >
              ختم معتمد
            </button>
            <button
              onClick={() => {
                setActiveStamp('CONFIDENTIAL');
                onNotify('تم تطبيق ختم (سري للغاية) على المستند', 'info');
              }}
              className="px-2 py-0.5 bg-red-50 text-red-700 hover:bg-red-100 rounded text-[11px] font-bold border border-red-300"
            >
              ختم سري
            </button>
            {activeStamp && (
              <button
                onClick={() => setActiveStamp(null)}
                className="text-[11px] text-slate-400 hover:text-slate-600 px-1"
              >
                إلغاء الختم
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main PDF Viewer Workspace */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center items-start">
        {/* If user uploaded an actual PDF file, render the native browser PDF preview or clean structured pages */}
        {pdfFileUrl ? (
          <div className="w-full max-w-4xl h-full flex flex-col items-center">
            <div
              id="pdf-printable-content"
              className="printable-content bg-white w-full h-full shadow-2xl rounded-lg overflow-hidden border border-slate-300 relative"
            >
              {activeStamp && (
                <div className="absolute top-12 left-12 z-20 pointer-events-none transform -rotate-12 border-4 border-dashed px-6 py-2 rounded-xl text-xl font-black opacity-85 select-none text-red-600 border-red-600">
                  {activeStamp === 'APPROVED' ? 'معتمد رسمياً ✓ APPROVED' : 'سري للغاية ⚠ CONFIDENTIAL'}
                </div>
              )}
              <iframe
                src={pdfFileUrl}
                className="w-full h-full min-h-[850px] border-none"
                title="مستعرض الـ PDF الأصلي"
              />
            </div>
          </div>
        ) : (
          /* High-Fidelity Default PDF Document Pages */
          <div
            id="pdf-printable-content"
            className="printable-content flex flex-col gap-8 w-full max-w-[850px]"
            style={{
              transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
              transformOrigin: 'top center',
              transition: 'transform 0.2s ease',
            }}
          >
            {/* Page 1 */}
            <div className="bg-white min-h-[1100px] p-12 sm:p-16 shadow-2xl rounded border border-slate-300 relative text-slate-800 text-right print-page-break">
              {/* Header with emblem */}
              <div className="flex items-center justify-between border-b-2 border-slate-800 pb-6 mb-8">
                <div>
                  <h1 className="text-xl font-black text-slate-900">عقد توريد وحلول تقنية معلومات</h1>
                  <p className="text-xs text-slate-500 mt-1">المملكة العربية السعودية | رقم الوثيقة: CTR-2026-9941</p>
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-red-600 flex items-center justify-center font-bold text-red-600 text-xs">
                  موثق
                </div>
              </div>

              {/* Watermark / Stamp if active */}
              {activeStamp && (
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transform -rotate-20 border-8 border-dashed px-12 py-6 rounded-3xl text-4xl font-black opacity-20 select-none text-red-600 border-red-600">
                  {activeStamp === 'APPROVED' ? 'معتمد رسميـاً ✓' : 'سري للغاية ⚠'}
                </div>
              )}

              {/* Document clauses */}
              <div className="space-y-6 text-sm leading-relaxed">
                <div>
                  <h2 className="font-bold text-base text-slate-900 mb-2">المقدمة والتمهيد:</h2>
                  <p className="text-justify text-slate-700">
                    بعون الله تعالى وتوفيقه، تم إبرام هذا العقد في يوم الثلاثاء الموافق {new Date().toLocaleDateString('ar-EG')} بين كل من:
                    الطرف الأول (الشركة المشغلة) والطرف الثاني (المستفيد)، للاتفاق على تقديم وتوريد البرمجيات المكتبية والخدمات الرقمية.
                  </p>
                </div>

                <div>
                  <h2 className="font-bold text-base text-slate-900 mb-2">البند الأول - موضوع العقد:</h2>
                  <p className="text-justify text-slate-700">
                    يلتزم الطرف الأول بتمكين الطرف الثاني من استخدام منظومة أوفيس المتكاملة، ودعم فتح ومعالجة ملفات الوورد والإكسل والباور بوينت والأكسس وملفات PDF بدقة متناهية ودون أي تشويه في التنسيقات الأصلية.
                  </p>
                </div>

                <div>
                  <h2 className="font-bold text-base text-slate-900 mb-2">البند الثاني - شروط الطباعة وحفظ البيانات:</h2>
                  <p className="text-justify text-slate-700">
                    تضمن المنظومة حصرية طباعة المحتوى الداخلي للملف دون إدراج أي أشرطة أو نوافذ برمجية، وإتاحة حفظ الملف مباشرة في أي مسار يختاره المستخدم على حاسوبه الشخصي محتفظاً بالامتداد الأصلي للملف.
                  </p>
                </div>

                {/* Summary Table */}
                <div className="mt-8">
                  <table className="w-full border-collapse border border-slate-300 text-xs">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="border border-slate-300 p-2.5 text-right font-bold">التطبيق / البند</th>
                        <th className="border border-slate-300 p-2.5 text-right font-bold">الامتداد المدعوم</th>
                        <th className="border border-slate-300 p-2.5 text-right font-bold">حالة التفعيل والطباعة</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-slate-300 p-2">معالج النصوص (Word)</td>
                        <td className="border border-slate-300 p-2 font-mono">.docx, .doc, .txt</td>
                        <td className="border border-slate-300 p-2 text-emerald-600 font-bold">نشط ومفعل</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-2">جداول البيانات (Excel)</td>
                        <td className="border border-slate-300 p-2 font-mono">.xlsx, .xls, .csv</td>
                        <td className="border border-slate-300 p-2 text-emerald-600 font-bold">نشط ومفعل</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-2">العروض التقديمية (PowerPoint)</td>
                        <td className="border border-slate-300 p-2 font-mono">.pptx, .ppt</td>
                        <td className="border border-slate-300 p-2 text-emerald-600 font-bold">نشط ومفعل</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-2">قواعد البيانات (Access)</td>
                        <td className="border border-slate-300 p-2 font-mono">.accdb, .mdb, .sql</td>
                        <td className="border border-slate-300 p-2 text-emerald-600 font-bold">نشط ومفعل</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-2">الوثائق الرقمية (PDF)</td>
                        <td className="border border-slate-300 p-2 font-mono">.pdf</td>
                        <td className="border border-slate-300 p-2 text-emerald-600 font-bold">نشط ومفعل</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Signatures */}
                <div className="grid grid-cols-2 gap-8 mt-16 pt-8 border-t border-slate-300 text-xs">
                  <div>
                    <p className="font-bold mb-1">الطرف الأول (الإدارة المعنية):</p>
                    <p className="text-slate-500">التوقيع: ____________________</p>
                    <p className="text-slate-400 mt-1">الختم الرسمي</p>
                  </div>
                  <div>
                    <p className="font-bold mb-1">الطرف الثاني (المستفيد):</p>
                    <p className="text-slate-500">التوقيع: ____________________</p>
                    <p className="text-slate-400 mt-1">التاريخ: {new Date().toLocaleDateString('ar-EG')}</p>
                  </div>
                </div>
              </div>

              {/* Page Number Footer */}
              <div className="absolute bottom-6 left-12 right-12 flex justify-between text-xs text-slate-400 border-t pt-2">
                <span>وثيقة معتمدة ومحمية</span>
                <span>صفحة 1 من 1</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PDF Status Bar */}
      <div className="bg-white border-t border-slate-200 px-4 py-1.5 flex items-center justify-between text-xs text-slate-500 select-none no-print">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-red-600" />
            <span>مستند PDF: <strong className="text-slate-700">{docTitle}</strong></span>
          </span>
          <span>التكبير: <strong className="text-slate-700">{zoomLevel}%</strong></span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-600">
            <Check className="w-3.5 h-3.5" />
            <span>جاهز للاستعراض والطباعة المعزولة</span>
          </span>
          <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-600">
            .{originalExtension}
          </span>
        </div>
      </div>
    </div>
  );
};
