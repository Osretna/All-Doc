import React, { useState } from 'react';
import { X, Hash, AlignCenter, Check } from 'lucide-react';
import { HeaderFooterConfig, BatesNumberingConfig } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  headerFooter: HeaderFooterConfig;
  batesConfig: BatesNumberingConfig;
  onSaveHeaderFooter: (hf: HeaderFooterConfig) => void;
  onSaveBates: (bates: BatesNumberingConfig) => void;
}

export const HeaderFooterModal: React.FC<Props> = ({
  isOpen,
  onClose,
  headerFooter,
  batesConfig,
  onSaveHeaderFooter,
  onSaveBates,
}) => {
  const [activeTab, setActiveTab] = useState<'hf' | 'bates'>('hf');

  // Header & Footer
  const [headerLeft, setHeaderLeft] = useState(headerFooter.headerLeft || '');
  const [headerCenter, setHeaderCenter] = useState(headerFooter.headerCenter || 'اتحاد شاغلين برج النخيل - المحضر الرسمي');
  const [headerRight, setHeaderRight] = useState(headerFooter.headerRight || '');
  const [footerLeft, setFooterLeft] = useState(headerFooter.footerLeft || 'سري ومحمي سيادياً');
  const [footerCenter, setFooterCenter] = useState(headerFooter.footerCenter || 'صفحة [Page]');
  const [footerRight, setFooterRight] = useState(headerFooter.footerRight || '');

  // Bates Numbering
  const [batesEnabled, setBatesEnabled] = useState(batesConfig.enabled || false);
  const [batesPrefix, setBatesPrefix] = useState(batesConfig.prefix || 'BATES-');
  const [batesStart, setBatesStart] = useState(batesConfig.startNumber || 1);
  const [batesDigits, setBatesDigits] = useState(batesConfig.digits || 6);
  const [batesPos, setBatesPos] = useState<BatesNumberingConfig['position']>(batesConfig.position || 'bottom-right');

  if (!isOpen) return null;

  const handleSave = () => {
    if (activeTab === 'hf') {
      onSaveHeaderFooter({
        headerLeft,
        headerCenter,
        headerRight,
        footerLeft,
        footerCenter,
        footerRight,
      });
    } else {
      onSaveBates({
        enabled: batesEnabled,
        prefix: batesPrefix,
        startNumber: batesStart,
        digits: batesDigits,
        position: batesPos,
      });
    }
    onClose();
  };

  const sampleBates = `${batesPrefix}${String(batesStart).padStart(batesDigits, '0')}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 text-right">
        {/* Header */}
        <div className="bg-[#ba141a] text-white px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlignCenter className="w-5 h-5" />
            <h3 className="font-bold text-sm">رأس وتذييل الصفحة وترقيم Bates</h3>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded transition cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switch */}
        <div className="flex border-b border-gray-200 bg-gray-50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('hf')}
            className={`flex-1 py-2.5 text-center transition cursor-pointer ${
              activeTab === 'hf'
                ? 'bg-white text-[#ba141a] border-b-2 border-[#ba141a] font-bold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            رأس وتذييل الصفحة (Header & Footer)
          </button>
          <button
            onClick={() => setActiveTab('bates')}
            className={`flex-1 py-2.5 text-center transition cursor-pointer ${
              activeTab === 'bates'
                ? 'bg-white text-[#ba141a] border-b-2 border-[#ba141a] font-bold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            ترقيم Bates القانوني (Bates Numbering)
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs">
          {activeTab === 'hf' ? (
            <div className="space-y-4">
              <div>
                <span className="font-bold text-gray-800 block mb-1.5">رأس الصفحة (Header):</span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-gray-500 block mb-0.5">يمين الرأس</label>
                    <input
                      type="text"
                      value={headerRight}
                      onChange={(e) => setHeaderRight(e.target.value)}
                      placeholder="تاريخ اليوم"
                      className="w-full border border-gray-300 rounded px-2.5 py-1 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 block mb-0.5">وسط الرأس</label>
                    <input
                      type="text"
                      value={headerCenter}
                      onChange={(e) => setHeaderCenter(e.target.value)}
                      placeholder="عنوان الوثيقة"
                      className="w-full border border-gray-300 rounded px-2.5 py-1 text-xs text-center"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 block mb-0.5">يسار الرأس</label>
                    <input
                      type="text"
                      value={headerLeft}
                      onChange={(e) => setHeaderLeft(e.target.value)}
                      placeholder="رقم المجلد"
                      className="w-full border border-gray-300 rounded px-2.5 py-1 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div>
                <span className="font-bold text-gray-800 block mb-1.5">تذييل الصفحة (Footer):</span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-gray-500 block mb-0.5">يمين التذييل</label>
                    <input
                      type="text"
                      value={footerRight}
                      onChange={(e) => setFooterRight(e.target.value)}
                      placeholder="اسم الإدارة"
                      className="w-full border border-gray-300 rounded px-2.5 py-1 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 block mb-0.5">وسط التذييل</label>
                    <input
                      type="text"
                      value={footerCenter}
                      onChange={(e) => setFooterCenter(e.target.value)}
                      placeholder="صفحة [Page]"
                      className="w-full border border-gray-300 rounded px-2.5 py-1 text-xs text-center"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 block mb-0.5">يسار التذييل</label>
                    <input
                      type="text"
                      value={footerLeft}
                      onChange={(e) => setFooterLeft(e.target.value)}
                      placeholder="سري"
                      className="w-full border border-gray-300 rounded px-2.5 py-1 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                <input
                  type="checkbox"
                  checked={batesEnabled}
                  onChange={(e) => setBatesEnabled(e.target.checked)}
                  className="accent-[#ba141a] rounded w-4 h-4"
                />
                <span>تفعيل ترقيم Bates القانوني على كافة صفحات المستند</span>
              </label>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-gray-600 block mb-1">البادئة (Prefix):</label>
                  <input
                    type="text"
                    value={batesPrefix}
                    onChange={(e) => setBatesPrefix(e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-600 block mb-1">الرقم المبدئي:</label>
                  <input
                    type="number"
                    min={1}
                    value={batesStart}
                    onChange={(e) => setBatesStart(parseInt(e.target.value, 10) || 1)}
                    className="w-full border border-gray-300 rounded px-2 py-1 font-mono text-xs text-center"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-600 block mb-1">عدد الخانات:</label>
                  <input
                    type="number"
                    min={3}
                    max={10}
                    value={batesDigits}
                    onChange={(e) => setBatesDigits(parseInt(e.target.value, 10) || 6)}
                    className="w-full border border-gray-300 rounded px-2 py-1 font-mono text-xs text-center"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-gray-600 block mb-1">موضع الترقيم على الصفحة:</label>
                <select
                  value={batesPos}
                  onChange={(e) => setBatesPos(e.target.value as any)}
                  className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs bg-white"
                >
                  <option value="bottom-right">أسفل اليمين (Bottom Right)</option>
                  <option value="bottom-center">أسفل الوسط (Bottom Center)</option>
                  <option value="bottom-left">أسفل اليسار (Bottom Left)</option>
                  <option value="top-right">أعلى اليمين (Top Right)</option>
                  <option value="top-left">أعلى اليسار (Top Left)</option>
                </select>
              </div>

              {/* Sample output */}
              <div className="bg-red-50 border border-red-200 rounded p-2.5 flex items-center justify-between">
                <span className="text-gray-700 font-semibold">عينة الترقيم على الصفحة الأولى:</span>
                <span className="font-mono font-black text-sm text-[#ba141a]">{sampleBates}</span>
              </div>
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
            onClick={handleSave}
            className="px-5 py-1.5 rounded-lg bg-[#ba141a] hover:bg-[#961015] text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>حفظ وتطبيق</span>
          </button>
        </div>
      </div>
    </div>
  );
};
