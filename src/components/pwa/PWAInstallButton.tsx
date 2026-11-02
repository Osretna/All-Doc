import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, MonitorCheck, Smartphone, CheckCircle2, X } from 'lucide-react';

interface Props {
  variant?: 'compact' | 'full';
}

export const PWAInstallButton: React.FC<Props> = ({ variant = 'compact' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showDesktopGuide, setShowDesktopGuide] = useState(false);

  // If already running inside standalone app
  if (isInstalled) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">مُنصّب ومتاح أوفلاين</span>
        <span className="sm:hidden">مُنصّب</span>
      </div>
    );
  }

  // Native beforeinstallprompt (Chromium Desktop & Android)
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`flex items-center gap-1.5 rounded transition font-medium cursor-pointer ${
          variant === 'full'
            ? 'bg-[#0078d4] text-white px-4 py-2 text-sm shadow hover:bg-[#006abc]'
            : 'bg-[#0078d4] text-white px-2.5 py-1 text-xs shadow-sm hover:bg-[#006abc]'
        }`}
        title="تثبيت التطبيق على جهاز الكمبيوتر أو الهاتف الذكي للعمل بدون إنترنت"
      >
        <Download className="w-3.5 h-3.5 animate-bounce" />
        <span>تثبيت التطبيق (PWA)</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 bg-[#edebe9] hover:bg-[#e1dfdd] text-[#323130] px-2.5 py-1 rounded text-xs font-medium border border-[#d2d0ce] transition"
        >
          <Smartphone className="w-3.5 h-3.5 text-[#0078d4]" />
          <span>تثبيت على آيفون / آيباد</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl border border-gray-200 text-right">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                    ∞
                  </div>
                  <h3 className="text-base font-bold text-gray-900">تثبيت MY-DOC Office على iOS</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-sm text-gray-700">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shrink-0 font-bold">1</span>
                  <p>اضغط على أيقونة <strong>المشاركة (Share)</strong> أسفل متصفح Safari (المربع ذو السهم لأعلى).</p>
                </div>

                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shrink-0 font-bold">2</span>
                  <p>قم بالتمرير للأسفل واختر <strong>"إضافة إلى الشاشة الرئيسية" (Add to Home Screen)</strong>.</p>
                </div>

                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shrink-0 font-bold">3</span>
                  <p>اضغط على <strong>"إضافة" (Add)</strong> في الزاوية العلوية؛ ليصبح التطبيق متاحاً على شاشتك وبدون إنترنت كأي تطبيق أصلي!</p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-lg bg-[#0078d4] py-2 text-sm font-medium text-white hover:bg-[#006abc] transition"
              >
                فهمت، شكراً
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback for browsers that already installed or need manual trigger
  return (
    <>
      <button
        onClick={() => setShowDesktopGuide(true)}
        className="flex items-center gap-1.5 bg-[#edebe9] hover:bg-[#e1dfdd] text-[#323130] px-2.5 py-1 rounded text-xs font-medium border border-[#d2d0ce] transition"
        title="تثبيت التطبيق على الكمبيوتر والهاتف"
      >
        <MonitorCheck className="w-3.5 h-3.5 text-[#0078d4]" />
        <span>تثبيت PWA</span>
      </button>

      {showDesktopGuide && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl border border-gray-200 text-right">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  ∞
                </div>
                <h3 className="text-base font-bold text-gray-900">تثبيت التطبيق على جهازك</h3>
              </div>
              <button
                onClick={() => setShowDesktopGuide(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm text-gray-700">
              <p className="text-gray-600 text-xs leading-relaxed">
                تطبيق MY-DOC Office مصمم كـ <strong>Progressive Web App (PWA)</strong> مكتبي كامل، يمكن تشغيله كبرنامج مستقل على نظام Windows أو macOS أو Linux وكذلك أندرويد و iOS:
              </p>

              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-gray-800">
                  <MonitorCheck className="w-4 h-4 text-blue-600" />
                  <span>على أجهزة الكمبيوتر (Chrome / Edge):</span>
                </div>
                <p>
                  اضغط على أيقونة التثبيت <span className="inline-block px-1.5 py-0.5 bg-gray-200 rounded text-[11px]">⊕</span> في شريط العنوان أعلى المتصفح، أو اختر من قائمة المتصفح: <strong>"تثبيت هذا الموقع كتطبيق"</strong>.
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-gray-800">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>على الهواتف المحمولة:</span>
                </div>
                <p>
                  من قائمة الخيارات (نقاط القائمة الثلاث ⋮)، اختر <strong>"إضافة إلى الشاشة الرئيسية"</strong> أو <strong>"تثبيت التطبيق"</strong>.
                </p>
              </div>

              <div className="p-2.5 bg-emerald-50 rounded text-emerald-800 text-xs border border-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>بعد التثبيت، ستتمكن من فتح الأوفيس حتى بدون توفر اتصال بالإنترنت نهائياً!</span>
              </div>
            </div>

            <button
              onClick={() => setShowDesktopGuide(false)}
              className="mt-5 w-full rounded-lg bg-[#0078d4] py-2 text-sm font-medium text-white hover:bg-[#006abc] transition"
            >
              تم، إغلاق الإرشاد
            </button>
          </div>
        </div>
      )}
    </>
  );
};
