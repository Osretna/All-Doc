import React, { useState } from 'react';
import { X, Download, FileText, FileSpreadsheet, Presentation, Image, Code, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  onExportFormat: (format: 'docx' | 'xlsx' | 'pptx' | 'png' | 'html') => void;
}

export const ExportPdfModal: React.FC<Props> = ({
  isOpen,
  onClose,
  documentTitle,
  onExportFormat,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'docx' | 'xlsx' | 'pptx' | 'png' | 'html'>('docx');

  if (!isOpen) return null;

  const formats = [
    {
      id: 'docx',
      label: 'مستند Microsoft Word (.docx)',
      desc: 'تحويل النصوص والجداول إلى مستند Word قابل للتحرير بالكامل',
      icon: FileText,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      id: 'xlsx',
      label: 'جدول بيانات Microsoft Excel (.xlsx)',
      desc: 'استخراج الجداول الحسابية والبيانات المالية إلى مصنف Excel',
      icon: FileSpreadsheet,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      id: 'pptx',
      label: 'عرض تقديمي PowerPoint (.pptx)',
      desc: 'تحويل كل صفحة PDF إلى شريحة عرض تقديمي مع الحفاظ على التصميم',
      icon: Presentation,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      id: 'png',
      label: 'صور عالية الدقة (.png / .jpg)',
      desc: 'تصدير صفحات المستند كصور عالية الوضوح (300 DPI)',
      icon: Image,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      id: 'html',
      label: 'صفحة ويب تفاعلية (.html)',
      desc: 'تحويل الملف إلى كود HTML5 مستقل يمكن فتحه بأي متصفح بدون إنترنت',
      icon: Code,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50',
    },
  ];

  const handleExport = () => {
    onExportFormat(selectedFormat);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 text-right">
        {/* Header */}
        <div className="bg-[#ba141a] text-white px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            <h3 className="font-bold text-sm">تصدير وتحويل PDF (Export & Convert)</h3>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded transition cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-3 text-xs">
          <span className="font-semibold text-gray-700 block">
            اختر التنسيق المطلوب لتحويل ملف "{documentTitle}":
          </span>

          <div className="space-y-2">
            {formats.map((fmt) => {
              const Icon = fmt.icon;
              const isSelected = selectedFormat === fmt.id;
              return (
                <div
                  key={fmt.id}
                  onClick={() => setSelectedFormat(fmt.id as any)}
                  className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition ${
                    isSelected
                      ? 'border-[#ba141a] bg-red-50/70 ring-2 ring-red-500/20'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${fmt.bg} ${fmt.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-800 text-xs">{fmt.label}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">{fmt.desc}</div>
                  </div>
                  <input
                    type="radio"
                    name="exportFormat"
                    checked={isSelected}
                    onChange={() => setSelectedFormat(fmt.id as any)}
                    className="accent-[#ba141a]"
                  />
                </div>
              );
            })}
          </div>
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
            onClick={handleExport}
            className="px-5 py-1.5 rounded-lg bg-[#ba141a] hover:bg-[#961015] text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تصدير وتنزيل الملف الآن</span>
          </button>
        </div>
      </div>
    </div>
  );
};
