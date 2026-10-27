import React, { useState } from 'react';
import { 
  Globe, 
  Search, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Sparkles, 
  ExternalLink,
  ArrowRight
} from 'lucide-react';

interface DomainResult {
  tld: string;
  price: number;
  available: boolean;
  whoisOwner?: string;
}

export const DomainsView: React.FC = () => {
  const [domainQuery, setDomainQuery] = useState<string>('infntytech');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [results, setResults] = useState<DomainResult[]>([
    { tld: '.com', price: 55, available: false, whoisOwner: 'Infinity Technology Inc.' },
    { tld: '.sa', price: 110, available: true },
    { tld: '.ae', price: 95, available: true },
    { tld: '.ai', price: 290, available: true },
    { tld: '.io', price: 140, available: false, whoisOwner: 'Private Organization' },
    { tld: '.tech', price: 45, available: true },
    { tld: '.net', price: 60, available: true },
  ]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainQuery.trim()) return;
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setResults([
        { tld: '.com', price: 55, available: !['infntytech', 'google', 'microsoft'].includes(domainQuery.toLowerCase()) },
        { tld: '.sa', price: 110, available: true },
        { tld: '.ae', price: 95, available: true },
        { tld: '.ai', price: 290, available: true },
        { tld: '.io', price: 140, available: true },
        { tld: '.tech', price: 45, available: true },
        { tld: '.net', price: 60, available: true },
      ]);
    }, 400);
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto p-4 sm:p-8 text-right text-xs">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2 pt-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold">
            <Globe className="w-3.5 h-3.5" />
            <span>تسجيل وإدارة النطاقات العالمية والمحلية (.sa, .ae, .com, .ai)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            احجز هويتك الرقمية باسم نطاق مميز
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto text-xs leading-relaxed">
            تحكم كامل في سجلات DNS (A, CNAME, MX, SPF, DKIM) مع حماية خصوصية Whois مجانية مدى الحياة.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="flex items-center bg-white p-2 rounded-2xl border-2 border-gray-200 focus-within:border-[#0078d4] shadow-md transition">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              value={domainQuery}
              onChange={(e) => setDomainQuery(e.target.value)}
              placeholder="اكتب اسم النطاق الذي تبحث عنه (مثال: mycompany)..."
              className="flex-1 outline-none text-sm px-2 text-gray-900 text-left font-mono"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="bg-[#0078d4] hover:bg-[#006abc] text-white font-bold px-6 py-2.5 rounded-xl transition text-xs shadow-sm cursor-pointer"
            >
              {isSearching ? 'جاري الفحص...' : 'فحص التوفر'}
            </button>
          </div>
        </form>

        {/* Results List */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 space-y-3">
          <h3 className="font-bold text-gray-800 text-sm pb-2 border-b border-gray-100 flex items-center justify-between">
            <span>نتائج توفر النطاق لـ "{domainQuery}"</span>
            <span className="text-xs text-gray-400 font-normal">الأسعار تشمل الضرائب وحماية الخصوصية</span>
          </h3>

          <div className="space-y-2">
            {results.map((res) => {
              const fullDomain = `${domainQuery}${res.tld}`;
              return (
                <div
                  key={res.tld}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 hover:border-gray-200 bg-gray-50/50 hover:bg-white transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold font-mono text-sm">
                      {res.tld}
                    </div>
                    <div>
                      <div className="font-mono font-bold text-gray-900 text-sm text-left">
                        {fullDomain}
                      </div>
                      <div className="text-[11px] mt-0.5">
                        {res.available ? (
                          <span className="text-emerald-600 flex items-center gap-1 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>متاح للتسجيل الفوري!</span>
                          </span>
                        ) : (
                          <span className="text-gray-400 flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5 text-gray-400" />
                            <span>محجوز مسبقاً ({res.whoisOwner})</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-left font-mono">
                      <span className="text-base font-black text-gray-900">{res.price}</span>
                      <span className="text-[11px] text-gray-500 mr-1">ر.س / سنة</span>
                    </div>

                    {res.available ? (
                      <button
                        onClick={() => alert(`تمت إضافة النطاق ${fullDomain} إلى سلة المشتريات!`)}
                        className="bg-[#0078d4] hover:bg-[#006abc] text-white px-4 py-1.5 rounded-lg font-bold text-xs shadow-xs transition"
                      >
                        حجز النطاق
                      </button>
                    ) : (
                      <button
                        onClick={() => alert(`بيانات WHOIS للنطاق ${fullDomain}: مسجل لصالح ${res.whoisOwner}`)}
                        className="border border-gray-300 text-gray-600 hover:bg-gray-100 px-3 py-1.5 rounded-lg text-xs transition"
                      >
                        فحص WHOIS
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* DNS Management Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-1">
            <h4 className="font-bold text-gray-900">حماية الخصوصية WHOIS</h4>
            <p className="text-gray-500 leading-relaxed">
              إخفاء معلوماتك الشخصية ورقم هاتفك وعنوانك من سجلات النطاق العامة مجاناً لمنع الرسائل المزعجة.
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-1">
            <h4 className="font-bold text-gray-900">إدارة DNS فائقة السرعة</h4>
            <p className="text-gray-500 leading-relaxed">
              تحديث سجلات النطاق A, CNAME, MX خلال ثوانٍ معدودة عبر شبكة Anycast السحابية الموزعة.
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-1">
            <h4 className="font-bold text-gray-900">توجيه فوري واستضافة بريد</h4>
            <p className="text-gray-500 leading-relaxed">
              ربط النطاق بنقرة واحدة مع استضافة إنفينيتي أو خوادمك الخاصة مع دعم البريد المهني المشفر.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
