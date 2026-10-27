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
  const totalRecords = 12;

  const insertMergeField = (fieldName: string) => {
    insertHTMLAtCursor(` <span class="bg-blue-100 text-[#2b579a] font-mono px-1.5 py-0.5 rounded text-xs border border-blue-300">«${fieldName}»</span> `);
  };

  return (
    <div className="flex items-stretch h-[96px] py-1 px-2 overflow-x-auto text-slate-700 select-none divide-x divide-x-reverse divide-slate-200" dir="rtl">
      
      {/* 1. Create (إنشاء: أظرف وتسميات) */}
      <div className="flex flex-col justify-between px-2 min-w-[120px] shrink-0">
        <div className="flex items-center gap-1 py-1">
          <button
            onClick={() => alert('إعداد وتخطيط أظرف المراسلات البريدية (Envelopes)')}
            className="flex flex-col items-center p-1.5 hover:bg-slate-200 rounded text-center text-slate-800"
            title="أظرف"
          >
            <div className="p-1 bg-blue-50 text-[#2b579a] rounded mb-1">
              <Mail className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-medium">أظرف</span>
          </button>
          <button
            onClick={() => alert('إنشاء وطباعة ملصقات وتسميات العناوين (Labels)')}
            className="flex flex-col items-center p-1.5 hover:bg-slate-200 rounded text-center text-slate-800"
            title="تسميات"
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
            onClick={() => alert('بدء معالج دمج البريد: خطابات، رسائل بريد إلكتروني، أظرف')}
            className="flex items-center gap-1.5 px-2 py-1 hover:bg-slate-200 rounded text-xs text-slate-800"
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>بدء دمج البريد</span>
          </button>
          <button
            onClick={() => alert('تحديد المستلمين: استخدام قائمة Excel / جهات اتصال Outlook')}
            className="flex items-center gap-1.5 px-2 py-1 hover:bg-slate-200 rounded text-xs text-slate-800"
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
            onClick={() => alert(`معاينة السجل رقم ${recordIndex} من أصل ${totalRecords}`)}
            className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-[#2b579a] hover:bg-blue-100 rounded text-xs font-semibold"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>معاينة النتائج</span>
          </button>

          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => setRecordIndex(Math.max(1, recordIndex - 1))}
              className="p-1 hover:bg-slate-200 rounded"
              title="السجل السابق"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] font-bold text-slate-700">
              {recordIndex} / {totalRecords}
            </span>
            <button
              onClick={() => setRecordIndex(Math.min(totalRecords, recordIndex + 1))}
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
          onClick={() => alert('تم إتمام عملية الدمج بنجاح: جاهز لطباعة المستندات أو إرسالها عبر البريد الإلكتروني.')}
          className="flex flex-col items-center justify-center p-2 hover:bg-slate-200 rounded text-slate-800 group my-auto"
          title="إنهاء ودمج"
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
