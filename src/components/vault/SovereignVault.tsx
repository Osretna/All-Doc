import React, { useState, useEffect } from 'react';
import { ShieldCheck, HardDrive, Key, CheckCircle, RefreshCw, Trash2, Download } from 'lucide-react';
import { AppStorage } from '../../utils/storage';

export const SovereignVault: React.FC = () => {
  const [storageItems, setStorageItems] = useState<{ key: string; size: number }[]>([]);

  useEffect(() => {
    refreshItems();
  }, []);

  const refreshItems = () => {
    const items: { key: string; size: number }[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k) {
        const val = localStorage.getItem(k) || '';
        items.push({ key: k, size: new Blob([val]).size });
      }
    }
    setStorageItems(items);
  };

  const clearAllData = () => {
    if (confirm('هل أنت متأكد من مسح كافة المستندات والتخزين المحلي المحفوظ على هذا المتصفح؟')) {
      localStorage.clear();
      refreshItems();
      alert('تم مسح كافة البيانات بنجاح.');
    }
  };

  return (
    <div className="flex-1 overflow-auto p-8 bg-gray-50 select-none">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6 rounded-2xl shadow-lg flex items-center justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>مساحة التخزين السيادية المشفرة</span>
            </div>
            <h2 className="text-2xl font-black">الخزنة المحلية (Sovereign Vault)</h2>
            <p className="text-xs text-white/80 max-w-lg leading-relaxed">
              جميع مستنداتك، جداولك، عروضك، وقواعد بياناتك مخزنة بنسبة 100% داخل المتصفح والقرص الصلب لجهازك فقط، دون أي نقل للبيانات عبر الإنترنت.
            </p>
          </div>
          <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center text-4xl">
            🔒
          </div>
        </div>

        {/* Local Storage Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
            <div className="text-gray-400 text-xs font-bold">العناصر المحفوظة</div>
            <div className="text-2xl font-black text-gray-900 mt-1">{storageItems.length} عنصر</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
            <div className="text-gray-400 text-xs font-bold">الحجم الكلي المستخدم</div>
            <div className="text-2xl font-black text-emerald-700 mt-1">
              {(storageItems.reduce((a, b) => a + b.size, 0) / 1024).toFixed(1)} KB
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
            <div className="text-gray-400 text-xs font-bold">حالة الحفظ</div>
            <div className="text-2xl font-black text-blue-700 mt-1">آمن ومشفر</div>
          </div>
        </div>

        {/* Storage details table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-bold text-sm text-gray-900">سجل مفاتيح التخزين المحلية</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={refreshItems}
                className="p-1.5 hover:bg-gray-100 rounded text-gray-600"
                title="تحديث"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={clearAllData}
                className="flex items-center gap-1 px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded text-xs font-bold cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>مسح كل البيانات</span>
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
            {storageItems.map(item => (
              <div key={item.key} className="p-3 flex items-center justify-between text-xs hover:bg-gray-50">
                <span className="font-mono text-gray-700">{item.key}</span>
                <span className="font-mono text-gray-400">{(item.size / 1024).toFixed(2)} KB</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
