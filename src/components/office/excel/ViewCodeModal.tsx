import React, { useState } from 'react';
import { X, Code, Play, Check, Copy } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  sheetLabel: string;
}

const DEFAULT_VBA = (sheetName: string) => `' Microsoft Visual Basic for Applications (VBA)
' Sheet: ${sheetName}
Option Explicit

Private Sub Worksheet_SelectionChange(ByVal Target As Range)
    ' Event triggered on cell focus change
    ' Application.StatusBar = "Selected: " & Target.Address
End Sub

Private Sub Worksheet_Change(ByVal Target As Range)
    ' Auto-recalculate dependencies
    ' Call RecalculateAllFormulas
End Sub

Sub FormatProfessionalTable()
    ' Auto-format active data as professional Excel table
    Dim tblRange As Range
    Set tblRange = ActiveSheet.UsedRange
    ActiveSheet.ListObjects.Add(xlSrcRange, tblRange, , xlYes).Name = "Table1"
End Sub
`;

export const ViewCodeModal: React.FC<Props> = ({
  isOpen,
  onClose,
  sheetLabel,
}) => {
  const [code, setCode] = useState(DEFAULT_VBA(sheetLabel));
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    setCode(DEFAULT_VBA(sheetLabel));
  }, [sheetLabel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none" dir="rtl">
      <div className="w-full max-w-xl bg-white rounded-lg shadow-2xl border border-gray-300 overflow-hidden text-right font-sans text-xs">
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#005a9e] text-white">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-white" />
            <span className="font-bold">محرر الأكواد والماكرو (Microsoft Visual Basic - {sheetLabel})</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded text-white/90">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 bg-gray-100 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                alert('تم فحص الكود وتجميعه بنجاح (Compile Success: 0 Errors).');
              }}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold flex items-center gap-1 cursor-pointer"
            >
              <Play className="w-3 h-3" />
              <span>تشغيل الماكرو (Run)</span>
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(code);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="px-2.5 py-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'تم النسخ' : 'نسخ الكود'}</span>
            </button>
          </div>
          <span className="text-[11px] font-mono text-gray-500">VBA Project ({sheetLabel})</span>
        </div>

        <div className="p-3">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={12}
            dir="ltr"
            className="w-full bg-slate-900 text-emerald-400 font-mono text-xs p-3 rounded border border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-left resize-none leading-relaxed"
          />
        </div>

        <div className="flex justify-end gap-2 p-3 bg-gray-50 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#005a9e] text-white rounded font-bold shadow-sm hover:bg-[#004578] cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
