import React, { useState } from 'react';
import { 
  Server, 
  Cpu, 
  HardDrive, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  Globe, 
  ArrowRight,
  Database,
  Cloud
} from 'lucide-react';

export const HostingView: React.FC = () => {
  const [selectedBilling, setSelectedBilling] = useState<'monthly' | 'annual'>('annual');
  const [vCpu, setVCpu] = useState<number>(4);
  const [ram, setRam] = useState<number>(16);
  const [storage, setStorage] = useState<number>(250);

  // Pricing calculation
  const vpsCalculatedPrice = (vCpu * 45 + ram * 15 + storage * 0.8) * (selectedBilling === 'annual' ? 0.8 : 1);

  const hostingPlans = [
    {
      id: 'shared',
      name: 'الاستضافة السحابية المشتركة',
      tagline: 'مثالية للمواقع الشخصية والمدونات والشركات الناشئة',
      price: selectedBilling === 'annual' ? 39 : 49,
      storage: '50 GB NVMe فائق السرعة',
      bandwidth: 'حركة مرور غير محدودة',
      specs: [
        'نظام ملفات ZFS المقاوم للأخطاء',
        'نسخ احتياطي تلقائي يومي',
        'شهادة SSL مجانية مدى الحياة',
        'لوحة تحكم cPanel / CyberPanel عربية',
        'حماية متقدمة من ModSecurity و DDoS',
        'دعم 10 حسابات بريد إلكتروني مخصصة',
      ],
      popular: false,
    },
    {
      id: 'semi-dedicated',
      name: 'الاستضافة شبه المخصصة (Semi-Dedicated)',
      tagline: 'موارد معزولة عالية الكفاءة للمتاجر والشركات المتوسطة',
      price: selectedBilling === 'annual' ? 149 : 189,
      storage: '200 GB ZFS NVMe Enterprise',
      bandwidth: 'عرض نطاق ترددي 10 Gbps',
      specs: [
        'معالجات AMD EPYC / Intel Xeon مخصصة',
        'عزل موارد كامل CloudLinux CageFS',
        'لقطات فورية ZFS Snapshots كل 4 ساعات',
        'تكامل كامل مع قواعد بيانات PostgreSQL / MySQL',
        'اتفاقية مستوى خدمة 99.9% Uptime SLA',
        'ربط مباشر مع جناح Infinity Office السيادي',
      ],
      popular: true,
    },
    {
      id: 'vps',
      name: 'خوادم VPS السحابية السيادية',
      tagline: 'تحكم كامل بصلاحيات Root وأداء فائق بدون مشاركة',
      price: selectedBilling === 'annual' ? 299 : 369,
      storage: '500 GB NVMe ZFS Mirror (RAID 10)',
      bandwidth: '5 TB حركة بيانات شهرية',
      specs: [
        'نواة معالجة KVM Dedicated vCPU',
        'وصول Root كامل عبر SSH ومنافذ مشفرة',
        'جدار حماية ذكي لمنع هجمات الحرمان من الخدمة',
        'خادم WebDAV / Nextcloud خاص لتخزين ملفات الأوفيس',
        'نشر فوري في مراكز بيانات (الرياض، دبي، فرانكفورت)',
        'دعم فني هندسي عربي متقدم 24/7',
      ],
      popular: false,
    },
  ];

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto p-4 sm:p-8 text-right text-xs">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Hero Section */}
        <div className="text-center space-y-3 pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-bold text-xs">
            <Zap className="w-3.5 h-3.5 text-blue-600" />
            <span>بنية تحتية سحابية سيادية (ZFS + NVMe + 99.9% Uptime)</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
            استضافة إنفينيتي السحابية: القوة والأمان والسيادة
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed">
            استضف مواقعك، أنظمتك، وتطبيقات أوفيس على سيرفرات مجهزة بأحدث تقنيات التخزين ZFS وسرعات NVMe المتطورة، مع حماية أمنية صارمة ودعم كامل للغة العربية.
          </p>

          {/* Billing switcher */}
          <div className="inline-flex items-center p-1 bg-gray-200 rounded-xl mt-3">
            <button
              onClick={() => setSelectedBilling('monthly')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                selectedBilling === 'monthly' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600'
              }`}
            >
              دفع شهري
            </button>
            <button
              onClick={() => setSelectedBilling('annual')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                selectedBilling === 'annual' ? 'bg-[#0078d4] text-white shadow-xs' : 'text-gray-600'
              }`}
            >
              <span>دفع سنوي</span>
              <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.2 rounded-full">خصم 20%</span>
            </button>
          </div>
        </div>

        {/* 3 Main Hosting Plans Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hostingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-2xl p-6 bg-white border transition-all duration-200 flex flex-col justify-between relative shadow-sm hover:shadow-xl ${
                plan.popular ? 'border-[#0078d4] ring-2 ring-[#0078d4]/20' : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 right-6 bg-[#0078d4] text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full shadow">
                  الأكثر طلباً للشركات
                </div>
              )}

              <div>
                <h3 className="text-base font-bold text-gray-900 mb-1">{plan.name}</h3>
                <p className="text-gray-500 text-[11px] min-h-[32px]">{plan.tagline}</p>

                <div className="my-5 pb-5 border-b border-gray-100 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-gray-900 font-mono">{plan.price}</span>
                  <span className="text-gray-500 text-xs">ر.س / شهرياً</span>
                </div>

                <div className="space-y-2.5 text-xs text-gray-700">
                  <div className="font-semibold text-gray-900 flex items-center gap-2">
                    <HardDrive className="w-3.5 h-3.5 text-blue-600" />
                    <span>{plan.storage}</span>
                  </div>
                  <div className="font-semibold text-gray-900 flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>{plan.bandwidth}</span>
                  </div>

                  <div className="pt-3 space-y-2 border-t border-gray-100">
                    {plan.specs.map((spec, i) => (
                      <div key={i} className="flex items-start gap-2 text-gray-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => alert(`تم اختيار ${plan.name}! سيتم توجيهك لحجز الاستضافة وبدء الإعداد الفوري.`)}
                  className={`w-full py-2.5 rounded-xl font-bold transition text-xs shadow-sm cursor-pointer ${
                    plan.popular
                      ? 'bg-[#0078d4] text-white hover:bg-[#006abc]'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  حجز الخادم وتفعيله فوراً
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Custom VPS Interactive Configurator */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-700 gap-4">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
                <Cpu className="w-4 h-4" />
                <span>حاسبة السيرفرات المخصصة (Custom VPS Builder)</span>
              </div>
              <h2 className="text-xl font-black text-white">صمم خادمك بالمواصفات التي تحتاجها بدقة</h2>
              <p className="text-gray-400 text-xs mt-1">تحديد فوري لأنوية المعالجة، الرام، وأقراص NVMe ZFS فائقة السرعة</p>
            </div>

            <div className="text-left md:text-right bg-slate-800/80 p-4 rounded-xl border border-slate-700">
              <span className="text-[11px] text-gray-400 block">التكلفة التقديرية المحسوبة:</span>
              <div className="text-2xl font-black text-emerald-400 font-mono mt-0.5">
                {Math.round(vpsCalculatedPrice).toLocaleString('ar-EG')} ر.س / شهرياً
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            {/* Sliders */}
            <div className="space-y-2">
              <div className="flex justify-between font-bold text-xs">
                <span>أنوية المعالجة (vCPU):</span>
                <span className="text-sky-400 font-mono">{vCpu} Cores</span>
              </div>
              <input
                type="range"
                min="2"
                max="32"
                step="2"
                value={vCpu}
                onChange={(e) => setVCpu(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded accent-sky-400 cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between font-bold text-xs">
                <span>الذاكرة العشوائية (RAM):</span>
                <span className="text-sky-400 font-mono">{ram} GB DDR5</span>
              </div>
              <input
                type="range"
                min="4"
                max="128"
                step="4"
                value={ram}
                onChange={(e) => setRam(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded accent-sky-400 cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between font-bold text-xs">
                <span>سعة التخزين (ZFS NVMe):</span>
                <span className="text-sky-400 font-mono">{storage} GB Storage</span>
              </div>
              <input
                type="range"
                min="50"
                max="2000"
                step="50"
                value={storage}
                onChange={(e) => setStorage(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded accent-sky-400 cursor-pointer"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={() => alert(`تم إرسال مواصفات الخادم (${vCpu} vCPU, ${ram}GB RAM, ${storage}GB ZFS) لفريق الدعم لتجهيزه خلال دقائق!`)}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl transition shadow text-xs"
            >
              طلب هذا الخادم المخصص الآن
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
