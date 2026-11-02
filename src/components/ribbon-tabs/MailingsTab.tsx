import React, { useState } from 'react';
import { 
  Mail, 
  Tag, 
  Users, 
  FileText, 
  Eye, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Send 
} from 'lucide-react';
import { insertHTMLAtCursor } from '../../utils/editorCommands';

export const MailingsTab: React.FC = () => {
  const [recordIndex, setRecordIndex] = useState(1);
  const [isPreviewActive, setIsPreviewActive] = useState(false);

  const recipients = [
    { name: 'م. أحمد حسن المنشاوي', address: 'القاهرة - التجمع الخامس', phone: '01012345678', amount: '12,500 ر.س', date: '01/03/2026' },
    { name: 'د. سارة عبد الرحمن', address: 'الرياض - حي العليا', phone: '0559876543', amount: '18,200 ر.س', date: '05/03/2026' },
    { name: 'أ. طارق عبد العزيز', address: 'جدة - حي الشاطئ', phone: '0501122334', amount: '9,450 ر.س', date: '10/03/2026' },
    { name: 'م. عمر إبراهيم الفاسي', address: 'الدمام - حي الشاطئ', phone: '0543322110', amount: '24,000 ر.س', date: '15/03/2026' },
    { name: 'أ. مريم يوسف الصالح', address: 'دبي - الخليج التجاري', phone: '0567788990', amount: '15,750 ر.س', date: '20/03/2026' },
  ];

  const totalRecords = recipients.length;

  const insertMergeField = (fieldName: string) => {
    insertHTMLAtCursor(` <span class="bg-blue-100 text-[#2b579a] font-mono px-1.5 py-0.5 rounded text-xs border border-blue-300 mail-merge-field" data-field="${fieldName}">«${fieldName}»</span> `);
  };

  const updatePreviewInEditor = (recIdx: number) => {
    const editor = document.getElementById('document-editor');
    if (!editor) return;
    const rec = recipients[recIdx - 1];

    const fields = editor.querySelectorAll('.mail-merge-field');
    fields.forEach((f) => {
      const fieldType = f.getAttribute('data-field');
      if (fieldType === 'اسم_العميل' || fieldType === 'اسم العميل') f.textContent = rec.name;
      else if (fieldType === 'العنوان') f.textContent = rec.address;
      else if (fieldType === 'رقم_الهاتف' || fieldType === 'رقم الهاتف') f.textContent = rec.phone;
      else if (fieldType === 'المبلغ_المستحق' || fieldType === 'المبلغ') f.textContent = rec.amount;
    });
  };

  const restoreFieldsInEditor = () => {
    const editor = document.getElementById('document-editor');
    if (!editor) return;
    const fields = editor.querySelectorAll('.mail-merge-field');
    fields.forEach((f) => {
      const fieldType = f.getAttribute('data-field');
      if (fieldType) f.textContent = `«${fieldType}»`;
    });
  };

  const handleTogglePreview = () => {
    const nextState = !isPreviewActive;
    setIsPreviewActive(nextState);
    if (nextState) {
      updatePreviewInEditor(recordIndex);
    } else {
      restoreFieldsInEditor();
    }
  };

  const handleNavigateRecord = (newIdx: number) => {
    setRecordIndex(newIdx);
    if (isPreviewActive) {
      updatePreviewInEditor(newIdx);
    }
  };

  const handleInsertEnvelope = () => {
    insertHTMLAtCursor(`
      <div class="my-6 p-6 border-2 border-slate-400 bg-slate-50/70 rounded-lg max-w-xl mx-auto shadow-sm" contenteditable="true">
        <div class="text-right text-xs text-slate-500 mb-8 border-b pb-2">
          <strong>المرسل:</strong> الإدارة المركزية - MY-DOC Sovereign Suite<br>
          جمهورية مصر العربية
        </div>
        <div class="text-center my-6 p-4 bg-white border border-slate-300 rounded shadow-2xs max-w-xs mx-auto">
          <p class="text-xs text-slate-400 mb-1">إلى السيد المكرم:</p>
          <h4 class="font-bold text-sm text-[#2b579a]">«اسم العميل»</h4>
          <p class="text-xs text-slate-600 mt-1">«العنوان»</p>
          <p class="text-[11px] font-mono text-slate-500 mt-1">هاتف: «رقم الهاتف»</p>
        </div>
      </div>
      <p><br></p>
    `);
  };

  const handleInsertLabels = () => {
    insertHTMLAtCursor(`
      <table class="w-full border-collapse border border-slate-300 my-4 text-center text-xs">
        <tbody>
          <tr>
            <td class="p-3 border bg-slate-50"><strong class="text-blue-900">«اسم العميل»</strong><br>«العنوان»<br>«رقم الهاتف»</td>
            <td class="p-3 border bg-slate-50"><strong class="text-blue-900">«اسم العميل»</strong><br>«العنوان»<br>«رقم الهاتف»</td>
          </tr>
          <tr>
            <td class="p-3 border bg-slate-50"><strong class="text-blue-900">«اسم العميل»</strong><br>«العنوان»<br>«رقم الهاتف»</td>
            <td class="p-3 border bg-slate-50"><strong class="text-blue-900">«اسم العميل»</strong><br>«العنوان»<br>«رقم الهاتف»</td>
          </tr>
        </tbody>
      </table>
      <p><br></p>
    `);
  };

  const handleStartMerge = () => {
    insertHTMLAtCursor(`
      <div class="my-4 p-6 bg-white border border-slate-200 rounded-lg shadow-2xs leading-loose" contenteditable="true">
        <p class="text-left text-xs text-slate-400 mb-4">التاريخ: ${new Date().toLocaleDateString('ar-EG')}</p>
        <p class="font-bold text-slate-800">السيد المحترم / <span class="bg-blue-100 text-[#2b579a] font-mono px-1.5 py-0.5 rounded text-xs border border-blue-300 mail-merge-field" data-field="اسم_العميل">«اسم العميل»</span></p>
        <p class="text-slate-600 text-sm">العنوان: <span class="bg-blue-100 text-[#2b579a] font-mono px-1.5 py-0.5 rounded text-xs border border-blue-300 mail-merge-field" data-field="العنوان">«العنوان»</span></p>
        <p class="my-3 text-justify">
          تحية طيبة وبعد،،،<br>
          يسرنا إحاطتكم علماً بصدور الفاتورة رقم (INV-2026-X) بقيمة مستحقة قدرها <strong class="text-emerald-700 font-mono"><span class="bg-blue-100 text-[#2b579a] font-mono px-1.5 py-0.5 rounded text-xs border border-blue-300 mail-merge-field" data-field="المبلغ_المستحق">«المبلغ»</span></strong>.
          يرجى التكرم بسداد المبلغ أو التواصل على رقمكم المسجل لدينا <span class="bg-blue-100 text-[#2b579a] font-mono px-1.5 py-0.5 rounded text-xs border border-blue-300 mail-merge-field" data-field="رقم_الهاتف">«رقم الهاتف»</span>.
        </p>
        <p class="mt-6 text-slate-700 font-bold">وتفضلوا بقبول فائق الاحترام والتقدير،،،</p>
      </div>
      <p><br></p>
    `);
  };

  const handleFinishAndMerge = () => {
    const editor = document.getElementById('document-editor');
    if (!editor) return;
    const baseContent = editor.innerHTML;

    let fullMergedHtml = '';
    recipients.forEach((rec, idx) => {
      let pageHtml = baseContent
        .replace(/«اسم_العميل»|«اسم العميل»/g, rec.name)
        .replace(/«العنوان»/g, rec.address)
        .replace(/«رقم_الهاتف»|«رقم الهاتف»/g, rec.phone)
        .replace(/«المبلغ_المستحق»|«المبلغ»/g, rec.amount);

      fullMergedHtml += `
        <div class="merged-record-page" style="page-break-after: always; margin-bottom: 24px;">
          ${pageHtml}
        </div>
      `;
    });

    editor.innerHTML = fullMergedHtml;
    alert(`تم إتمام الدمج بنجاح لعدد (${recipients.length}) مستندات بعدد العملاء! تم توليد جميع الصفحات وجاهزة للطباعة أو الحفظ.`);
  };

  return (
    <div className="flex items-stretch h-[96px] py-1 px-2 overflow-x-auto text-slate-700 select-none divide-x divide-x-reverse divide-slate-200" dir="rtl">
      
      {/* 1. Create (إنشاء: أظرف وتسميات) */}
      <div className="flex flex-col justify-between px-2 min-w-[120px] shrink-0">
        <div className="flex items-center gap-1 py-1">
          <button
            onClick={handleInsertEnvelope}
            className="flex flex-col items-center p-1.5 hover:bg-slate-200 rounded text-center text-slate-800"
            title="إدراج مظروف مراسلات بريدي"
          >
            <div className="p-1 bg-blue-50 text-[#2b579a] rounded mb-1">
              <Mail className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-medium">أظرف</span>
          </button>
          <button
            onClick={handleInsertLabels}
            className="flex flex-col items-center p-1.5 hover:bg-slate-200 rounded text-center text-slate-800"
            title="إنشاء ملصقات وتسميات العناوين"
          >
            <div className="p-1 bg-amber-50 text-amber-600 rounded mb-1">
              <Tag className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-medium">تسميات</span>
          </button>
        </div>
        <span className="text-[10px] text-slate-400 text-center font-medium">إنشاء (Create)</span>
      </div>

      {/* 2. Start Mail Merge (بدء دمج المراسلات وتحديد المستلمين) */}
      <div className="flex flex-col justify-between px-2 min-w-[130px] shrink-0">
        <div className="flex flex-col gap-1 justify-center py-1">
          <button
            onClick={handleStartMerge}
            className="flex items-center gap-1.5 px-2 py-1 hover:bg-slate-200 rounded text-xs text-slate-800"
            title="بدء نموذج خطاب دمج بريد"
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>بدء دمج البريد</span>
          </button>
          <button
            onClick={() => {
              const names = recipients.map((r, i) => `${i + 1}. ${r.name} (${r.address})`).join('\n');
              alert(`قائمة المستلمين المسجلين (${recipients.length} عملاء):\n\n${names}`);
            }}
            className="flex items-center gap-1.5 px-2 py-1 hover:bg-slate-200 rounded text-xs text-slate-800"
            title="عرض وتحديد قائمة المستلمين"
          >
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span>تحديد المستلمين</span>
          </button>
        </div>
        <span className="text-[10px] text-slate-400 text-center font-medium">بدء دمج البريد</span>
      </div>

      {/* 3. Write & Insert Fields (كتابة وإدراج الحقول) */}
      <div className="flex flex-col justify-between px-3 min-w-[190px] shrink-0">
        <div className="grid grid-cols-2 gap-1 py-1">
          <button
            onClick={() => insertMergeField('اسم_العميل')}
            className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px]"
          >
            <span>«اسم العميل»</span>
          </button>
          <button
            onClick={() => insertMergeField('العنوان')}
            className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px]"
          >
            <span>«العنوان»</span>
          </button>
          <button
            onClick={() => insertMergeField('رقم_الهاتف')}
            className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px]"
          >
            <span>«رقم الهاتف»</span>
          </button>
          <button
            onClick={() => insertMergeField('المبلغ_المستحق')}
            className="flex items-center gap-1 px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px]"
          >
            <span>«المبلغ»</span>
          </button>
        </div>
        <span className="text-[10px] text-slate-400 text-center font-medium">كتابة وإدراج حقول</span>
      </div>

      {/* 4. Preview Results (معاينة النتائج) */}
      <div className="flex flex-col justify-between px-2 min-w-[130px] shrink-0">
        <div className="flex flex-col items-center justify-center gap-1 py-1">
          <button
            onClick={handleTogglePreview}
            className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-semibold transition-colors ${
              isPreviewActive ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-blue-50 text-[#2b579a] hover:bg-blue-100'
            }`}
            title="تبديل معاينة بيانات العميل الحقيقية"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isPreviewActive ? 'إخفاء المعاينة' : 'معاينة النتائج'}</span>
          </button>

          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => handleNavigateRecord(Math.max(1, recordIndex - 1))}
              className="p-1 hover:bg-slate-200 rounded"
              title="السجل السابق"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] font-bold text-slate-700">
              {recordIndex} / {totalRecords}
            </span>
            <button
              onClick={() => handleNavigateRecord(Math.min(totalRecords, recordIndex + 1))}
              className="p-1 hover:bg-slate-200 rounded"
              title="السجل التالي"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <span className="text-[10px] text-slate-400 text-center font-medium">معاينة النتائج</span>
      </div>

      {/* 5. Finish & Merge (إنهاء ودمج) */}
      <div className="flex flex-col justify-between px-2 min-w-[90px] shrink-0">
        <button
          onClick={handleFinishAndMerge}
          className="flex flex-col items-center justify-center p-2 hover:bg-slate-200 rounded text-slate-800 group my-auto"
          title="دمج جميع السجلات وتوليد كافة الخطابات"
        >
          <div className="w-8 h-8 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 group-hover:bg-emerald-100 transition-colors">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-medium mt-1">إنهاء ودمج</span>
        </button>
        <span className="text-[10px] text-slate-400 text-center font-medium">إنهاء (Finish)</span>
      </div>

    </div>
  );
};

