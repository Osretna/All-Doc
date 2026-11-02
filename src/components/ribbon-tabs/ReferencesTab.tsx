import React from 'react';
import { 
  BookOpen, 
  PlusCircle, 
  RefreshCw, 
  Bookmark, 
  Quote, 
  Library, 
  Sliders, 
  FileCheck, 
  Captions, 
  ListFilter, 
  FileText, 
  Scale 
} from 'lucide-react';
import { insertHTMLAtCursor } from '../../utils/editorCommands';

export const ReferencesTab: React.FC = () => {
  const [citationStyle, setCitationStyle] = React.useState('APA');

  const buildTocHTML = () => {
    const editor = document.getElementById('document-editor');
    if (!editor) return '';
    const headings = editor.querySelectorAll('h1, h2, h3');
    if (headings.length === 0) {
      return `
        <div id="doc-table-of-contents" class="my-6 p-4 bg-slate-50 border border-slate-300 rounded-lg text-right" contenteditable="false">
          <div class="flex items-center justify-between border-b border-slate-300 pb-2 mb-3">
            <h3 class="font-bold text-sm text-[#2b579a]">فهرس المحتويات (Table of Contents)</h3>
            <span class="text-[10px] text-slate-400">تحديث تلقائي</span>
          </div>
          <p class="text-xs text-slate-500">لم يتم العثور على عناوين رئيسية (H1 أو H2). استخدم أنماط العناوين من التبويب الرئيسي لإدراجها تلقائياً هنا.</p>
        </div>
        <p><br></p>
      `;
    }

    let itemsHtml = '';
    headings.forEach((h, idx) => {
      const text = h.textContent?.trim() || `قسم ${idx + 1}`;
      const level = h.tagName === 'H1' ? 1 : h.tagName === 'H2' ? 2 : 3;
      const indentClass = level === 1 ? 'font-bold text-slate-800' : level === 2 ? 'pr-4 text-slate-700' : 'pr-8 text-slate-500';
      const pageNum = Math.min(idx + 1, 5);
      const hId = h.id || `heading_ref_${idx}`;
      h.id = hId;

      itemsHtml += `
        <div class="flex items-center justify-between border-b border-dotted border-slate-300 pb-1.5 pt-1 text-xs hover:bg-blue-50/50 rounded px-1 transition-colors cursor-pointer" onclick="document.getElementById('${hId}')?.scrollIntoView({ behavior: 'smooth' })">
          <span class="${indentClass}">• ${text}</span>
          <span class="font-mono text-slate-500 font-bold">${pageNum}</span>
        </div>
      `;
    });

    return `
      <div id="doc-table-of-contents" class="my-6 p-4 bg-slate-50/90 border border-slate-300 rounded-lg text-right" contenteditable="false">
        <div class="flex items-center justify-between border-b border-slate-300 pb-2 mb-3">
          <h3 class="font-bold text-sm text-[#2b579a]">جدول المحتويات (Table of Contents)</h3>
          <span class="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">محدث تلقائياً</span>
        </div>
        <div class="space-y-1">
          ${itemsHtml}
        </div>
      </div>
      <p><br></p>
    `;
  };

  const insertTableOfContents = () => {
    const html = buildTocHTML();
    insertHTMLAtCursor(html);
  };

  const handleUpdateTOC = () => {
    const existing = document.getElementById('doc-table-of-contents');
    if (existing) {
      const parent = existing.parentElement;
      if (parent) {
        const temp = document.createElement('div');
        temp.innerHTML = buildTocHTML();
        const newEl = temp.firstElementChild;
        if (newEl) {
          parent.replaceChild(newEl, existing);
          alert('تم تحديث جدول المحتويات بنجاح بناءً على العناوين الحالية في المستند!');
          return;
        }
      }
    }
    // If not found, insert one
    insertTableOfContents();
  };

  const handleAddTextToTOC = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
      document.execCommand('formatBlock', false, '<h2>');
      alert('تم تحويل النص المحدد إلى عنوان فرعي (مستوى 2) وجاهز للإدراج في جدول المحتويات.');
    } else {
      document.execCommand('formatBlock', false, '<h1>');
      alert('تم تطبيق نمط العنوان الرئيسي على الفقرة الحالية.');
    }
  };

  const insertFootnote = () => {
    const text = prompt('أدخل نص الحاشية السفلية (Footnote):', 'انظر المرجع السابق، ص 45.');
    if (text) {
      const footnoteId = Math.floor(Math.random() * 900 + 100);
      insertHTMLAtCursor(` <sup class="text-[#2b579a] font-bold cursor-pointer">[${footnoteId}]</sup> `);
      
      const footnotesContainer = document.getElementById('document-footnotes-container');
      if (footnotesContainer) {
        const item = document.createElement('div');
        item.className = 'text-xs text-slate-600 py-0.5 border-b border-slate-100 flex items-start gap-1';
        item.innerHTML = `<span class="font-bold text-[#2b579a]">[${footnoteId}]</span> <span>${text}</span>`;
        footnotesContainer.appendChild(item);
      }
    }
  };

  const insertCitation = () => {
    const author = prompt('اسم المؤلف أو الجهة:', 'د. أحمد محمود');
    const year = prompt('سنة النشر:', '2024');
    if (author) {
      insertHTMLAtCursor(` <span class="bg-blue-50 text-blue-900 border border-blue-200 px-1.5 py-0.5 rounded text-xs">(${author}، ${year || '2024'})</span> `);
    }
  };

  const insertBibliography = () => {
    insertHTMLAtCursor(`
      <div class="my-6 p-4 bg-slate-50 border border-slate-300 rounded-lg">
        <h3 class="font-bold text-sm text-[#2b579a] mb-2 border-b border-slate-300 pb-1">المراجع والمصادر (Bibliography)</h3>
        <ol class="list-decimal list-inside text-xs space-y-1 text-slate-700">
          <li>محمود، أحمد (2024)، <em>أسس الإدارة الحديثة وتطبيقات الذكاء الاصطناعي</em>، دار النشر الجامعي، القاهرة.</li>
          <li>Smith, J. (2023). <em>Advanced Document Processing & Ergonomics</em>, Academic Press, New York.</li>
        </ol>
      </div>
      <p><br></p>
    `);
  };

  return (
    <div className="flex items-stretch h-[96px] py-1 px-2 overflow-x-auto text-slate-700 select-none divide-x divide-x-reverse divide-slate-200" dir="rtl">
      
      {/* 1. Table of Contents (جدول المحتويات) */}
      <div className="flex flex-col justify-between px-2 min-w-[145px] shrink-0">
        <div className="flex items-center gap-1.5 py-1">
          <button
            onClick={insertTableOfContents}
            className="flex flex-col items-center p-1.5 hover:bg-slate-200 rounded text-slate-800 text-center"
            title="إدراج جدول محتويات"
          >
            <div className="p-1.5 bg-blue-50 text-[#2b579a] rounded mb-1">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-medium">جدول المحتويات</span>
          </button>

          <div className="flex flex-col gap-0.5">
            <button
              onClick={handleAddTextToTOC}
              className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px]"
              title="إضافة الفقرة أو النص المحدد كعنوان في جدول المحتويات"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>إضافة نص</span>
            </button>
            <button
              onClick={handleUpdateTOC}
              className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px]"
              title="تحديث جدول المحتويات ليعكس أحدث العناوين وأرقام الصفحات"
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
              <span>تحديث الجدول</span>
            </button>
          </div>
        </div>
        <span className="text-[10px] text-slate-400 text-center font-medium">جدول المحتويات</span>
      </div>

      {/* 2. Footnotes (حواشي سفلية وتعليقات ختامية) */}
      <div className="flex flex-col justify-between px-2 min-w-[130px] shrink-0">
        <div className="flex flex-col gap-1 justify-center py-1">
          <button
            onClick={insertFootnote}
            className="flex items-center gap-1.5 px-2 py-1 hover:bg-slate-200 rounded text-xs text-slate-800"
          >
            <Bookmark className="w-3.5 h-3.5 text-blue-600" />
            <span>إدراج حاشية سفلية</span>
          </button>
          <button
            onClick={() => {
              const text = prompt('نص التعليق الختامي في نهاية المستند:', 'انظر الوثيقة الملحقة رقم 3');
              if (text) {
                insertHTMLAtCursor(` <sup class="text-indigo-600 font-bold">[i]</sup> `);
              }
            }}
            className="flex items-center gap-1.5 px-2 py-1 hover:bg-slate-200 rounded text-xs text-slate-800"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            <span>تعليق ختامي</span>
          </button>
        </div>
        <span className="text-[10px] text-slate-400 text-center font-medium">حواشي سفلية</span>
      </div>

      {/* 3. Citations & Bibliography (اقتباسات ومراجع) */}
      <div className="flex flex-col justify-between px-3 min-w-[210px] shrink-0">
        <div className="grid grid-cols-2 gap-1.5 py-1">
          <button
            onClick={insertCitation}
            className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px]"
          >
            <Quote className="w-3.5 h-3.5 text-amber-600" />
            <span>إدراج اقتباس</span>
          </button>
          <button
            onClick={() => alert('إدارة المصادر: لديك مصادر مسجلة وفق معايير APA 7th')}
            className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px]"
          >
            <Library className="w-3.5 h-3.5 text-blue-600" />
            <span>إدارة المصادر</span>
          </button>
          <div className="flex items-center gap-1 px-1">
            <span className="text-[10px] text-slate-500">النمط:</span>
            <select className="text-[9px] bg-white border border-slate-300 rounded px-1 outline-none">
              <option value="APA">APA</option>
              <option value="MLA">MLA</option>
              <option value="Chicago">Chicago</option>
              <option value="IEEE">IEEE</option>
            </select>
          </div>
          <button
            onClick={insertBibliography}
            className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px] text-[#2b579a] font-bold"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>قائمة مراجع</span>
          </button>
        </div>
        <span className="text-[10px] text-slate-400 text-center font-medium">المراجع والاقتباسات</span>
      </div>

      {/* 4. Captions & Index & Table of Authorities */}
      <div className="flex flex-col justify-between px-3 min-w-[210px] shrink-0">
        <div className="grid grid-cols-2 gap-1.5 py-1">
          <button
            onClick={() => {
              const cap = prompt('نص التسمية التوضيحية:', 'جدول (1): ملخص الميزانية');
              if (cap) insertHTMLAtCursor(`<p class="text-xs text-slate-500 my-1 font-semibold text-center italic">${cap}</p>`);
            }}
            className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px]"
          >
            <Captions className="w-3.5 h-3.5 text-slate-600" />
            <span>إدراج تسمية توضيحية</span>
          </button>
          <button
            onClick={() => {
              const editor = document.getElementById('document-editor');
              const figures = editor?.querySelectorAll('figure, table') || [];
              let figHtml = `
                <div class="my-6 p-4 bg-slate-50 border border-slate-300 rounded-lg text-right" contenteditable="false">
                  <h3 class="font-bold text-sm text-[#2b579a] mb-2 border-b border-slate-300 pb-1">فهرس الجداول والأشكال التوضيحية</h3>
                  <div class="space-y-1.5 text-xs text-slate-700">
              `;
              if (figures.length > 0) {
                figures.forEach((f, idx) => {
                  const tag = f.tagName === 'TABLE' ? 'جدول' : 'شكل';
                  figHtml += `
                    <div class="flex justify-between border-b border-dotted border-slate-300 pb-1">
                      <span>• ${tag} (${idx + 1}): عنصر توضيحي معتمد</span>
                      <span class="font-mono text-slate-500 font-bold">${idx + 1}</span>
                    </div>
                  `;
                });
              } else {
                figHtml += `
                  <div class="flex justify-between border-b border-dotted border-slate-300 pb-1">
                    <span>• جدول (1): مؤشرات الأداء والنتائج التشغيلية</span>
                    <span class="font-mono text-slate-500 font-bold">1</span>
                  </div>
                `;
              }
              figHtml += `</div></div><p><br></p>`;
              insertHTMLAtCursor(figHtml);
            }}
            className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px]"
            title="إدراج جدول الأشكال والمخططات"
          >
            <ListFilter className="w-3.5 h-3.5 text-slate-600" />
            <span>قائمة الأشكال</span>
          </button>
          <button
            onClick={() => {
              insertHTMLAtCursor(`
                <div class="my-6 p-4 bg-slate-50 border border-slate-300 rounded-lg text-right">
                  <h3 class="font-bold text-sm text-[#2b579a] mb-2 border-b border-slate-300 pb-1">فهرس المصطلحات والموضوعات (Index)</h3>
                  <div class="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <strong class="text-blue-900 border-b block pb-0.5 mb-1">أ - ت</strong>
                      <p>التحول الرقمي: 1، 3</p>
                      <p>التخطيط الاستراتيجي: 2</p>
                    </div>
                    <div>
                      <strong class="text-blue-900 border-b block pb-0.5 mb-1">ح - م</strong>
                      <p>حوكمة البيانات: 1، 4</p>
                      <p>مؤشرات الأداء: 2، 3</p>
                    </div>
                  </div>
                </div>
                <p><br></p>
              `);
            }}
            className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px]"
          >
            <FileText className="w-3.5 h-3.5 text-slate-600" />
            <span>إدراج فهرس</span>
          </button>
          <button
            onClick={() => {
              insertHTMLAtCursor(`
                <div class="my-6 p-4 bg-slate-50 border border-slate-300 rounded-lg text-right">
                  <h3 class="font-bold text-sm text-[#2b579a] mb-2 border-b border-slate-300 pb-1">جدول السلطات والتشريعات المعتمدة (Table of Authorities)</h3>
                  <div class="space-y-1.5 text-xs text-slate-700">
                    <p>• قرار مجلس الإدارة رقم (42) لسنة 2024 بشأن اعتماد المعايير الرقمية ................ ص 2</p>
                    <p>• اللائحة التنفيذية لحماية البيانات والخصوصية الوطنية ................................ ص 3</p>
                  </div>
                </div>
                <p><br></p>
              `);
            }}
            className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px]"
          >
            <Scale className="w-3.5 h-3.5 text-indigo-600" />
            <span>جدول السلطات</span>
          </button>
        </div>
        <span className="text-[10px] text-slate-400 text-center font-medium">تسميات توضيحية وفهارس</span>
      </div>

    </div>
  );
};
