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
  const insertTableOfContents = () => {
    insertHTMLAtCursor(`
      <div class="my-6 p-4 bg-slate-50 border border-slate-300 rounded-lg" contenteditable="false">
        <div class="flex items-center justify-between border-b border-slate-300 pb-2 mb-3">
          <h3 class="font-bold text-sm text-[#2b579a]">جدول المحتويات (Table of Contents)</h3>
          <span class="text-[10px] text-slate-400">تحديث تلقائي</span>
        </div>
        <div class="space-y-1.5 text-xs">
          <div class="flex justify-between border-b border-dotted border-slate-300 pb-1">
            <span>1. المقدمة والأهداف العامة .................................................</span>
            <span class="font-mono font-bold text-slate-600">1</span>
          </div>
          <div class="flex justify-between border-b border-dotted border-slate-300 pb-1">
            <span>2. خطة العمل ومنهجية التنفيذ .........................................</span>
            <span class="font-mono font-bold text-slate-600">2</span>
          </div>
          <div class="flex justify-between border-b border-dotted border-slate-300 pb-1">
            <span>3. النتائج والتوصيات المستقبلية .......................................</span>
            <span class="font-mono font-bold text-slate-600">3</span>
          </div>
          <div class="flex justify-between border-b border-dotted border-slate-300 pb-1">
            <span>4. قائمة المراجع والمصادر المعتمدة ....................................</span>
            <span class="font-mono font-bold text-slate-600">4</span>
          </div>
        </div>
      </div>
      <p><br></p>
    `);
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
              onClick={() => alert('تمت إضافة النص المحدد إلى جدول المحتويات كعنوان من المستوى الأول')}
              className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px]"
            >
              <PlusCircle className="w-3 h-3 text-emerald-600" />
              <span>إضافة نص</span>
            </button>
            <button
              onClick={() => alert('تم تحديث جدول المحتويات بنجاح بناءً على العناوين الحالية')}
              className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px]"
            >
              <RefreshCw className="w-3 h-3 text-blue-600" />
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
            onClick={() => alert('تم إدراج جدول الأشكال والمخططات التوضيحية')}
            className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px]"
          >
            <ListFilter className="w-3.5 h-3.5 text-slate-600" />
            <span>قائمة الأشكال</span>
          </button>
          <button
            onClick={() => alert('تم وضع علامة على الإدخال في الفهرس')}
            className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px]"
          >
            <FileText className="w-3.5 h-3.5 text-slate-600" />
            <span>إدراج فهرس</span>
          </button>
          <button
            onClick={() => alert('تم إدراج جدول السلطات والمراجع القضائية/القانونية')}
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
