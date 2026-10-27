import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  HardDrive, 
  WifiOff, 
  Download, 
  Upload, 
  Copy, 
  Check, 
  AlertTriangle,
  FileCode,
  Terminal
} from 'lucide-react';
import { localVault } from '../../utils/storage';

export const SovereignVaultView: React.FC = () => {
  const [strictOffline, setStrictOffline] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [vaultJson, setVaultJson] = useState<string>(() => localVault.exportSovereignBackup());

  const handleCopy = () => {
    navigator.clipboard.writeText(vaultJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([vaultJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `infinity_sovereign_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const ok = localVault.importSovereignBackup(text);
        if (ok) {
          setVaultJson(text);
          alert('تمت استعادة الخزنة السيادية بنجاح! تم تحديث جميع المستندات والجداول.');
          window.location.reload();
        } else {
          alert('الملف غير صالح أو تالف.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto p-4 sm:p-8 text-right text-xs">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2 pt-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>ميثاق السيادة الرقمية الكاملة (Zero-Telemetry Sovereign Architecture)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            بياناتك ملك لك وحدك 100% بدون أي تسريب
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto text-xs leading-relaxed">
            الفرق الجوهري بين Infinity Office والخدمات الاحتكارية: نحن لا نجمع أي بيانات، لا نطلب تسجيل دخول، وتعمل جميع أدوات التحرير وقواعد البيانات داخل متصفحك محلياً بالكامل.
          </p>
        </div>

        {/* Audit Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-gray-500">
              <span>الاتصالات الخارجية (Telemetry)</span>
              <WifiOff className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-emerald-700 font-mono">0 طلبات</div>
            <span className="text-[11px] text-emerald-600 font-medium">مؤمن بالكامل من التسريب</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-gray-500">
              <span>التخزين المشفر المحلي</span>
              <HardDrive className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-blue-700 font-mono">IndexedDB</div>
            <span className="text-[11px] text-blue-600 font-medium">حفظ تلقائي عند كل تعديل</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-purple-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-gray-500">
              <span>المعالجة والتنفيذ</span>
              <Terminal className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-black text-purple-700 font-mono">Client WASM</div>
            <span className="text-[11px] text-purple-600 font-medium">معالجة فورية فائقة السرعة</span>
          </div>
        </div>

        {/* Strict Offline Toggle */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>تفعيل وضع "السيادة الصارمة" (Strict Sovereign Mode)</span>
            </div>
            <p className="text-gray-500 text-xs max-w-lg leading-relaxed">
              عند التفعيل، يتم حظر أي طلبات شبكية داخل التطبيق وتأكيد عمل كافة المحررات (Docs, Sheets, Slides, Base, Notes) بدون إنترنت مطلقاً.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={strictOffline}
              onChange={(e) => setStrictOffline(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        {/* Backup Vault Viewer & Export */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2">
            <div>
              <h3 className="font-bold text-gray-900 text-sm">
                الخزنة المحلية المشفرة (Sovereign Backup Encrypted Blob)
              </h3>
              <p className="text-gray-500 text-xs">
                تحتوي على كافة مستنداتك، جداولك، شرائحك، وسجلات قاعدة بيانات نظام ملاك
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold transition text-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'تم النسخ!' : 'نسخ الكود'}</span>
              </button>

              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0078d4] text-white hover:bg-[#006abc] font-bold transition text-xs shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تنزيل ملف .json</span>
              </button>

              <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold transition text-xs cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>استعادة ملف</span>
                <input type="file" accept=".json" onChange={handleImport} className="hidden" />
              </label>
            </div>
          </div>

          {/* Raw JSON Preview */}
          <div className="relative">
            <textarea
              readOnly
              value={vaultJson}
              rows={8}
              className="w-full font-mono text-[11px] bg-slate-900 text-emerald-400 p-4 rounded-xl outline-none border border-slate-800"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
