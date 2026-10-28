import React, { useState } from 'react';
import { X, Link2, Globe, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedText: string;
  onInsertLink: (text: string, url: string) => void;
}

export const WordHyperlinkModal: React.FC<Props> = ({
  isOpen,
  onClose,
  selectedText,
  onInsertLink,
}) => {
  const [displayText, setDisplayText] = useState(selectedText);
  const [url, setUrl] = useState('https://');

  React.useEffect(() => {
    setDisplayText(selectedText);
  }, [selectedText]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    onInsertLink(displayText || url, url);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none">
      <div
        className="bg-white text-slate-800 rounded border border-slate-300 shadow-2xl w-full max-w-md overflow-hidden font-sans text-xs flex flex-col"
        dir="rtl"
        style={{ fontFamily: 'Segoe UI, Tahoma, sans-serif' }}
      >
        {/* Header */}
        <div className="bg-[#005a9e] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            <span className="font-semibold text-sm">إدراج ارتباط تشعبي (Hyperlink)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded text-white/80 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="text-[11px] font-semibold text-slate-700 block mb-1">
              النص المراد عرضه (Text to display):
            </label>
            <input
              type="text"
              value={displayText}
              onChange={e => setDisplayText(e.target.value)}
              placeholder="اكتب النص الذي سيظهر كـ رابط..."
              className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs focus:outline-blue-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-700 block mb-1">
              العنوان / الرابط (Address / URL):
            </label>
            <div className="relative">
              <input
                type="text"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://example.com"
                dir="ltr"
                className="w-full bg-white border border-slate-300 rounded pr-3 pl-8 py-1.5 text-xs focus:outline-blue-500 text-left"
              />
              <Link2 className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              يمكنك كتابة رابط موقع ويب، بريد إلكتروني (mailto:..)، أو ملف محلي.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs font-medium cursor-pointer"
            >
              إلغاء الأمر
            </button>
            <button
              type="submit"
              className="px-5 py-1.5 bg-[#005a9e] hover:bg-[#004578] text-white rounded text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>موافق</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
