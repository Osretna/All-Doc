import React, { useState } from 'react';
import { X, Layers, Plus, Trash2, ArrowUp, ArrowDown, FileText, CheckCircle2 } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onMergedSuccess: (mergedBlob: Blob, filename: string) => void;
}

interface MergeFileItem {
  id: string;
  name: string;
  size: string;
  file: File;
}

export const MergePdfModal: React.FC<Props> = ({ isOpen, onClose, onMergedSuccess }) => {
  const [files, setFiles] = useState<MergeFileItem[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newItems: MergeFileItem[] = Array.from(e.target.files).map((f) => ({
      id: `file_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: f.name,
      size: `${(f.size / 1024).toFixed(1)} KB`,
      file: f,
    }));
    setFiles((prev) => [...prev, ...newItems]);
    setErrorMsg(null);
  };

  const handleRemove = (id: string) => {
    setFiles(files.filter((f) => f.id !== id));
  };

  const handleMoveUp = (idx: number) => {
    if (idx === 0) return;
    const updated = [...files];
    const temp = updated[idx];
    updated[idx] = updated[idx - 1];
    updated[idx - 1] = temp;
    setFiles(updated);
  };

  const handleMoveDown = (idx: number) => {
    if (idx === files.length - 1) return;
    const updated = [...files];
    const temp = updated[idx];
    updated[idx] = updated[idx + 1];
    updated[idx + 1] = temp;
    setFiles(updated);
  };

  const handleExecuteMerge = async () => {
    if (files.length < 2) {
      setErrorMsg('يرجى إضافة ملفين PDF أو أكثر للدمج.');
      return;
    }

    setIsMerging(true);
    setErrorMsg(null);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const item of files) {
        const fileBuffer = await item.file.arrayBuffer();
        const doc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
        const copiedPages = await mergedPdf.copyPages(doc, doc.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save();
      const mergedBlob = new Blob([mergedBytes as any], { type: 'application/pdf' });
      onMergedSuccess(mergedBlob, 'merged_document.pdf');
      onClose();
    } catch (err: any) {
      console.error('Merge PDF error:', err);
      setErrorMsg('حدث خطأ أثناء دمج ملفات PDF. قد يكون أحد الملفات تالفاً أو مشفراً بكلمة مرور.');
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 text-right">
        {/* Header */}
        <div className="bg-[#ba141a] text-white px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5" />
            <h3 className="font-bold text-sm">دمج ملفات PDF (Merge Files into Single PDF)</h3>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded transition cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-700 font-semibold">الملفات المراد دمجها بالترتيب المطلوب:</span>
            <label className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ba141a] hover:bg-[#961015] text-white font-bold rounded-lg cursor-pointer transition shadow-2xs">
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة ملفات PDF</span>
              <input
                type="file"
                multiple
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </div>

          {files.length === 0 ? (
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-400 bg-gray-50 flex flex-col items-center justify-center gap-2">
              <FileText className="w-8 h-8 text-gray-300" />
              <span>قم بسحب وإفلات ملفات PDF أو انقر على "إضافة ملفات PDF" أعلاه</span>
            </div>
          ) : (
            <div className="max-h-60 overflow-y-auto divide-y divide-gray-100 border border-gray-200 rounded-lg">
              {files.map((item, idx) => (
                <div key={item.id} className="p-2.5 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-red-100 text-[#ba141a] font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="font-semibold text-gray-800 text-xs truncate max-w-[220px]" title={item.name}>
                        {item.name}
                      </div>
                      <div className="text-[10px] text-gray-400 font-mono">{item.size}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMoveUp(idx)}
                      disabled={idx === 0}
                      className="p-1 text-gray-500 hover:bg-gray-200 rounded disabled:opacity-30 cursor-pointer"
                      title="تحريك لأعلى"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveDown(idx)}
                      disabled={idx === files.length - 1}
                      className="p-1 text-gray-500 hover:bg-gray-200 rounded disabled:opacity-30 cursor-pointer"
                      title="تحريك لأسفل"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                      title="حذف من القائمة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {errorMsg && (
            <div className="bg-red-50 border border-red-300 rounded p-2 text-red-800 text-xs">
              {errorMsg}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-5 py-3 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {files.length} ملفات جاهزة للدمج
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              إلغاء
            </button>
            <button
              onClick={handleExecuteMerge}
              disabled={files.length < 2 || isMerging}
              className="px-5 py-1.5 rounded-lg bg-[#ba141a] hover:bg-[#961015] text-white text-xs font-bold transition shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
            >
              {isMerging ? 'جاري الدمج...' : 'بدء الدمج وتنزيل PDF'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
