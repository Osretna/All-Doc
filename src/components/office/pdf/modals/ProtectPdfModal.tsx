import React, { useState } from 'react';
import { X, Lock, ShieldCheck, EyeOff, Trash2, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onApplyProtection: (config: {
    password?: string;
    preventPrinting: boolean;
    preventCopying: boolean;
    sanitizeMetadata: boolean;
  }) => void;
}

export const ProtectPdfModal: React.FC<Props> = ({ isOpen, onClose, onApplyProtection }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [preventPrinting, setPreventPrinting] = useState(true);
  const [preventCopying, setPreventCopying] = useState(true);
  const [sanitizeMetadata, setSanitizeMetadata] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleApply = () => {
    if (password && password !== confirmPassword) {
      setErrorMsg('كلمتا المرور غير متطابقتين.');
      return;
    }

    onApplyProtection({
      password: password || undefined,
      preventPrinting,
      preventCopying,
      sanitizeMetadata,
    });
    alert('تم تفعيل بروتوكول الحماية السيادية على مستند PDF بنجاح!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 text-right">
        {/* Header */}
        <div className="bg-[#ba141a] text-white px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="font-bold text-sm">حماية وتشفير مستند PDF (Security & Encryption)</h3>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded transition cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Password Encryption */}
          <div className="space-y-2 border-b border-gray-200 pb-3">
            <span className="font-bold text-gray-800 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#ba141a]" />
              <span>تشفير بكلمة مرور لفتح المستند (AES-256):</span>
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="أدخل كلمة مرور الفتح (اختياري)..."
              className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-[#ba141a]"
            />
            {password && (
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="تأكيد كلمة المرور..."
                className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-[#ba141a]"
              />
            )}
          </div>

          {/* Permissions */}
          <div className="space-y-2 border-b border-gray-200 pb-3">
            <span className="font-bold text-gray-800 block">تقييد أذونات التحرير والمشاركة:</span>
            <label className="flex items-center gap-2 cursor-pointer text-gray-700">
              <input
                type="checkbox"
                checked={preventPrinting}
                onChange={(e) => setPreventPrinting(e.target.checked)}
                className="accent-[#ba141a] rounded"
              />
              <span>منع طباعة المستند (Prevent High-Res Printing)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-gray-700">
              <input
                type="checkbox"
                checked={preventCopying}
                onChange={(e) => setPreventCopying(e.target.checked)}
                className="accent-[#ba141a] rounded"
              />
              <span>منع نسخ النصوص واستخراج المحتوى (Disable Text Copying)</span>
            </label>
          </div>

          {/* Sanitization */}
          <div className="space-y-1.5">
            <span className="font-bold text-gray-800 flex items-center gap-1.5">
              <EyeOff className="w-3.5 h-3.5 text-blue-600" />
              <span>إزالة المعلومات المخفية وتطهير البيانات (Sanitize):</span>
            </span>
            <label className="flex items-center gap-2 cursor-pointer text-gray-700">
              <input
                type="checkbox"
                checked={sanitizeMetadata}
                onChange={(e) => setSanitizeMetadata(e.target.checked)}
                className="accent-[#ba141a] rounded"
              />
              <span>حذف البيانات الوصفية (Metadata، أسماء الأجهزة، سجلات التعديل السابقة)</span>
            </label>
          </div>

          {errorMsg && (
            <div className="bg-red-50 border border-red-300 rounded p-2 text-red-800 text-xs">
              {errorMsg}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-5 py-3 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            إلغاء
          </button>
          <button
            onClick={handleApply}
            className="px-5 py-1.5 rounded-lg bg-[#ba141a] hover:bg-[#961015] text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>تأكيد وقفل المستند</span>
          </button>
        </div>
      </div>
    </div>
  );
};
