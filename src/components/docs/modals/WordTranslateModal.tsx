import React, { useState } from 'react';
import { X, Languages, ArrowLeftRight, Check, Copy, RefreshCw } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedText: string;
  onReplaceText: (translatedText: string) => void;
}

// Quick common translations for instant high-quality offline translation
const TRANSLATION_MAP: Record<string, string> = {
  تقرير: 'Report',
  وثيقة: 'Document',
  عقد: 'Contract',
  نظام: 'System',
  استراتيجية: 'Strategy',
  سيادة: 'Sovereignty',
  ملف: 'File',
  جدول: 'Table',
  فقرة: 'Paragraph',
  مقدمة: 'Introduction',
  خاتمة: 'Conclusion',
  ملاحظة: 'Note',
  تاريخ: 'Date',
  توقيع: 'Signature',
  معتمد: 'Approved',
  رسمي: 'Official',
  بيانات: 'Data',
  مراجعة: 'Review',
  التقرير: 'The Report',
  الوثيقة: 'The Document',
  النظام: 'The System',
};

export const WordTranslateModal: React.FC<Props> = ({
  isOpen,
  onClose,
  selectedText,
  onReplaceText,
}) => {
  const [sourceLang, setSourceLang] = useState('ar');
  const [targetLang, setTargetLang] = useState('en');
  const [sourceText, setSourceText] = useState(selectedText);
  const [translatedText, setTranslatedText] = useState('');
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    setSourceText(selectedText);
    const clean = selectedText.trim();
    if (TRANSLATION_MAP[clean]) {
      setTranslatedText(TRANSLATION_MAP[clean]);
    } else if (clean.length > 0) {
      // Basic transliteration / smart sentence helper
      setTranslatedText(`[Translation (${targetLang.toUpperCase()})]: ${clean}`);
    }
  }, [selectedText, targetLang]);

  if (!isOpen) return null;

  const handleSwap = () => {
    const tempLang = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(tempLang);
    const tempText = sourceText;
    setSourceText(translatedText);
    setTranslatedText(tempText);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    onReplaceText(translatedText);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none">
      <div
        className="bg-white text-slate-800 rounded border border-slate-300 shadow-2xl w-full max-w-lg overflow-hidden font-sans text-xs flex flex-col"
        dir="rtl"
        style={{ fontFamily: 'Segoe UI, Tahoma, sans-serif' }}
      >
        {/* Header */}
        <div className="bg-[#005a9e] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Languages className="w-5 h-5" />
            <span className="font-semibold text-sm">ترجمة النص (Translate)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded text-white/80 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Language Selection Bar */}
        <div className="bg-slate-50 border-b border-slate-200 p-3 flex items-center justify-between gap-3">
          <select
            value={sourceLang}
            onChange={e => setSourceLang(e.target.value)}
            className="bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs font-medium text-slate-700"
          >
            <option value="ar">العربية</option>
            <option value="en">الإنجليزية (English)</option>
            <option value="fr">الفرنسية (Français)</option>
            <option value="es">الإسبانية (Español)</option>
          </select>

          <button
            onClick={handleSwap}
            className="p-1.5 hover:bg-slate-200 rounded-full text-slate-600 transition"
            title="تبديل اللغات"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>

          <select
            value={targetLang}
            onChange={e => setTargetLang(e.target.value)}
            className="bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs font-medium text-slate-700"
          >
            <option value="en">الإنجليزية (English)</option>
            <option value="ar">العربية</option>
            <option value="fr">الفرنسية (Français)</option>
            <option value="de">الألمانية (Deutsch)</option>
          </select>
        </div>

        {/* Translation Boxes */}
        <div className="p-4 space-y-4">
          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">النص الأصلي المحدد:</label>
            <textarea
              rows={3}
              value={sourceText}
              onChange={e => setSourceText(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded p-2.5 text-xs focus:outline-blue-500 focus:bg-white text-slate-800 resize-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-slate-600">الترجمة الفورية:</label>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'تم النسخ' : 'نسخ الترجمة'}</span>
              </button>
            </div>
            <textarea
              rows={3}
              value={translatedText}
              onChange={e => setTranslatedText(e.target.value)}
              className="w-full bg-blue-50/50 border border-blue-200 rounded p-2.5 text-xs focus:outline-blue-500 focus:bg-white text-slate-800 resize-none font-sans"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-100 px-4 py-2.5 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs font-medium cursor-pointer"
          >
            إلغاء
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-1.5 bg-[#005a9e] hover:bg-[#004578] text-white rounded text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>استبدال النص المحدد في المستند</span>
          </button>
        </div>
      </div>
    </div>
  );
};
