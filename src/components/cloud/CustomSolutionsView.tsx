import React, { useState } from 'react';
import { 
  Sparkles, 
  Code, 
  Smartphone, 
  Globe, 
  Database, 
  Send, 
  CheckCircle2, 
  Layers, 
  ShieldCheck, 
  Cpu
} from 'lucide-react';

export const CustomSolutionsView: React.FC = () => {
  const [projectType, setProjectType] = useState<'saas' | 'mobile' | 'portal' | 'office-extension'>('saas');
  const [timeline, setTimeline] = useState<string>('3-months');
  const [offlineCapability, setOfflineCapability] = useState<boolean>(true);
  const [databaseType, setDatabaseType] = useState<string>('postgres-zfs');
  const [clientName, setClientName] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [projectDesc, setProjectDesc] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Price estimate calculation
  let baseEstimate = 12000;
  if (projectType === 'mobile') baseEstimate = 18000;
  if (projectType === 'saas') baseEstimate = 24000;
  if (projectType === 'office-extension') baseEstimate = 15000;
  if (offlineCapability) baseEstimate += 4500;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail) {
      alert('يرجى كتابة الاسم والبريد الإلكتروني للتواصل');
      return;
    }
    setIsSubmitted(true);
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto p-4 sm:p-8 text-right text-xs">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2 pt-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>طلب تصميم مخصص وحلول برمجية خاصة (Custom Software & Design)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            نطور فكرتك إلى تطبيق سيادي عالي الكفاءة
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto text-xs leading-relaxed">
            من أنظمة إدارة الملاك والمجمعات السكنية إلى المنصات السحابية المعقدة وتطبيقات سطح المكتب PWA مع تخزين ZFS عالي الأمان.
          </p>
        </div>

        {isSubmitted ? (
          <div className="bg-white rounded-2xl border border-emerald-200 p-8 text-center space-y-4 shadow-sm max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">تم استلام طلب مشروعك بنجاح!</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
              شكراً لك يا <strong>{clientName}</strong>. سيقوم كبير المهندسين التقنيين بمراجعة متطلبات المشروع والتواصل معك على <strong>{clientEmail}</strong> خلال 24 ساعة لتقديم عرض السعر الفني والزمني المفصل.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="bg-[#0078d4] text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-[#006abc] transition"
            >
              تقديم طلب مشروع آخر
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
            {/* Step 1: Project Type Selection */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-2">1. نوع الحل البرمجي المطلوب:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { id: 'saas', title: 'منصة سحابية SaaS', desc: 'مثل نظام ملاك أو بوابات العملاء', icon: Globe },
                  { id: 'mobile', title: 'تطبيق هاتف PWA', desc: 'قابل للتنصيب على iOS وأندرويد', icon: Smartphone },
                  { id: 'portal', title: 'بوابة شركات واستضافة', desc: 'ربط بـ API السيرفرات والفوترة', icon: Layers },
                  { id: 'office-extension', title: 'أداة إنتاجية سيادية', desc: 'محرر مستندات أو قواعد بيانات أوفلاين', icon: Code },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = projectType === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setProjectType(item.id as any)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#7719aa] bg-purple-50/40 text-purple-900'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div>
                        <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-[#7719aa]' : 'text-gray-400'}`} />
                        <h4 className="font-bold text-xs text-gray-900">{item.title}</h4>
                        <p className="text-[10px] text-gray-500 mt-1">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Architecture Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={offlineCapability}
                    onChange={(e) => setOfflineCapability(e.target.checked)}
                    className="w-4 h-4 text-[#7719aa] rounded accent-[#7719aa]"
                  />
                  <span className="font-bold text-gray-800 text-xs">ميزة العمل بدون إنترنت (Offline-First Sovereign)</span>
                </label>
                <p className="text-[11px] text-gray-500 pr-6">
                  تمكين النظام من حفظ البيانات محلياً والعمل بدون اتصال، ومزامنتها تلقائياً عند عودة الشبكة.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                <label className="block font-bold text-gray-800 text-xs">قاعدة البيانات والبنية السحابية:</label>
                <select
                  value={databaseType}
                  onChange={(e) => setDatabaseType(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs outline-none"
                >
                  <option value="postgres-zfs">PostgreSQL على خادم NVMe ZFS محمي</option>
                  <option value="sqlite-wasm">قاعدة بيانات محلية سريعة SQLite WASM</option>
                  <option value="hybrid">نظام هجين (مزامنة مشفرة بين الخادم والجهاز)</option>
                </select>
              </div>
            </div>

            {/* Step 3: Contact & Description */}
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">الاسم الكريم / اسم الشركة:</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="مثال: م. أحمد المنصوري"
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#7719aa]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">البريد الإلكتروني الرسمي:</label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#7719aa]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">وصف موجز للمشروع وأهدافه:</label>
                <textarea
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  rows={4}
                  placeholder="اشرح المتطلبات والوظائف التي ترغب في تنفيذها..."
                  className="w-full bg-white border border-gray-300 rounded-xl p-3 text-xs outline-none focus:border-[#7719aa]"
                />
              </div>
            </div>

            {/* Price Estimator Display & Submit */}
            <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="bg-purple-50 px-4 py-2 rounded-xl border border-purple-200">
                <span className="text-[11px] text-purple-700 block">التكلفة التقديرية المبدئية:</span>
                <span className="text-xl font-black text-purple-900 font-mono">
                  تبدأ من {baseEstimate.toLocaleString('ar-EG')} ر.س
                </span>
              </div>

              <button
                type="submit"
                className="bg-[#7719aa] hover:bg-[#5c1382] text-white px-8 py-3 rounded-xl font-bold transition text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>إرسال تفاصيل المشروع لطلب عرض السعر</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
