import React, { useState } from 'react';
import { 
  Mail, 
  ShieldCheck, 
  CheckCircle2, 
  Send, 
  Inbox, 
  Lock, 
  KeyRound, 
  ArrowRight,
  Server
} from 'lucide-react';

export const EmailView: React.FC = () => {
  const [domain] = useState<string>('infntytech.com');
  const [mailboxUser, setMailboxUser] = useState<string>('info');
  const [createdBoxes, setCreatedBoxes] = useState<string[]>([
    'ceo@infntytech.com',
    'support@infntytech.com',
    'sales@infntytech.com',
    'mollak@infntytech.com',
  ]);

  const handleCreateMailbox = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mailboxUser.trim()) return;
    const full = `${mailboxUser.trim()}@${domain}`;
    if (!createdBoxes.includes(full)) {
      setCreatedBoxes([...createdBoxes, full]);
      setMailboxUser('');
      alert(`تم إنشاء صندوق البريد الاحترافي: ${full}`);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto p-4 sm:p-8 text-right text-xs">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2 pt-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold">
            <Mail className="w-3.5 h-3.5" />
            <span>بريد إلكتروني مهني ومخصص لشركتك باسم نطاقك</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            حلول البريد الإلكتروني المتقدمة ومكافحة السبام
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto text-xs leading-relaxed">
            تمتع ببريد احترافي مع واجهة Webmail حديثة، وفلاتر حماية من الفيروسات والرسائل المزعجة، وتوثيق SPF و DKIM و DMARC كامل لضمان وصول رسائلك لصندوق الوارد دائماً.
          </p>
        </div>

        {/* Create New Mailbox Simulator */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-gray-900 text-sm pb-2 border-b border-gray-100 flex items-center justify-between">
            <span>إنشاء صندوق بريد جديد على نطاق {domain}</span>
            <span className="text-xs text-emerald-600 font-semibold">مساحة تخزين سحابية معزولة 50 GB</span>
          </h3>

          <form onSubmit={handleCreateMailbox} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 flex-1 w-full text-left">
              <span className="text-gray-400 font-mono text-xs">@{domain}</span>
              <input
                type="text"
                value={mailboxUser}
                onChange={(e) => setMailboxUser(e.target.value)}
                placeholder="اسم المستخدم (مثال: contact أو billing)"
                className="flex-1 bg-transparent outline-none text-xs text-gray-900 text-right pr-2"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto bg-[#0078d4] hover:bg-[#006abc] text-white px-5 py-2.5 rounded-xl font-bold transition text-xs shadow-sm cursor-pointer whitespace-nowrap"
            >
              + إنشاء الحساب فوراً
            </button>
          </form>

          {/* Active Mailboxes List */}
          <div className="pt-4 space-y-2">
            <span className="text-gray-500 font-bold text-xs block">صناديق البريد النشطة حالياً:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {createdBoxes.map((box) => (
                <div
                  key={box}
                  className="p-3 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span className="font-mono font-bold text-gray-800 text-xs">{box}</span>
                  </div>
                  <button
                    onClick={() => alert(`جاري تسجيل الدخول الآمن إلى واجهة Webmail لـ ${box}...`)}
                    className="text-[11px] text-blue-600 hover:text-blue-800 font-bold"
                  >
                    دخول Webmail ➔
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Security & Authentication Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-gray-900">حماية SpamAssassin & ClamAV</h4>
            <p className="text-gray-500 leading-relaxed text-[11px]">
              فحص ذكي متعدد الطبقات لجميع الرسائل الصادرة والواردة لمنع التصيد الاحتيالي والبرمجيات الخبيثة بنسبة 99.8%.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <KeyRound className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-gray-900">سجلات SPF و DKIM و DMARC</h4>
            <p className="text-gray-500 leading-relaxed text-[11px]">
              توليد مفاتيح تشفير تلقائية لمنع انتحال اسم شركتك وضمان ثقة خوادم Gmail و Outlook في رسائلك الرسمية.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Lock className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-gray-900">تشفير SSL / TLS كامل</h4>
            <p className="text-gray-500 leading-relaxed text-[11px]">
              نقل الرسائل عبر بروتوكولات مشفرة IMAP / POP3 / SMTP مع شهادات أمان معتمدة على كافة الأجهزة والهواتف.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
