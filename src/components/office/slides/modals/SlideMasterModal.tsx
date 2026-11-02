import React, { useState } from 'react';
import { X, Layers, Check, Layout, Palette, Type, Shield } from 'lucide-react';
import { SlideMasterLayout } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: string;
  onApplyMasterToAll: (settings: Partial<SlideMasterLayout>) => void;
}

const DEFAULT_MASTERS: SlideMasterLayout[] = [
  {
    id: 'master-title',
    name: 'Title Slide Layout',
    nameAr: 'تخطيط شريحة العنوان الرئيسية',
    isMaster: true,
    backgroundColor: '#003366',
    titleFont: 'Cairo',
    bodyFont: 'Cairo',
    accentColor: '#38bdf8',
    hasHeader: false,
    hasFooter: true,
    hasDate: true,
    hasNumber: true,
  },
  {
    id: 'master-content',
    name: 'Title & Content Layout',
    nameAr: 'تخطيط العنوان والمحتوى',
    backgroundColor: '#003366',
    titleFont: 'Cairo',
    bodyFont: 'Cairo',
    accentColor: '#38bdf8',
    hasHeader: true,
    hasFooter: true,
    hasDate: true,
    hasNumber: true,
  },
  {
    id: 'master-comparison',
    name: 'Two Content Comparison',
    nameAr: 'تخطيط مقارنة عمودين',
    backgroundColor: '#003366',
    titleFont: 'Cairo',
    bodyFont: 'Cairo',
    accentColor: '#10b981',
    hasHeader: true,
    hasFooter: true,
    hasDate: true,
    hasNumber: true,
  },
  {
    id: 'master-blank',
    name: 'Blank Clean Layout',
    nameAr: 'تخطيط فارغ مع علامة مائية',
    backgroundColor: '#003366',
    titleFont: 'Cairo',
    bodyFont: 'Cairo',
    accentColor: '#f59e0b',
    hasHeader: false,
    hasFooter: false,
    hasDate: false,
    hasNumber: false,
  },
];

export const SlideMasterModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentTheme,
  onApplyMasterToAll,
}) => {
  const [selectedMaster, setSelectedMaster] = useState<SlideMasterLayout>(DEFAULT_MASTERS[0]);
  const [titleFont, setTitleFont] = useState<string>('Cairo');
  const [accentColor, setAccentColor] = useState<string>('#38bdf8');
  const [hasFooter, setHasFooter] = useState<boolean>(true);
  const [hasNumber, setHasNumber] = useState<boolean>(true);
  const [hasDate, setHasDate] = useState<boolean>(true);

  if (!isOpen) return null;

  const handleApply = () => {
    onApplyMasterToAll({
      titleFont,
      accentColor,
      hasFooter,
      hasNumber,
      hasDate,
    });
    alert('تم تطبيق إعدادات الشريحة الرئيسية (Slide Master) على جميع شرائح العرض التقديمي بنجاح!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden text-right animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#d83b01] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5" />
            <h3 className="font-bold text-base">طريقة عرض الشريحة الرئيسية (Slide Master View)</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <p className="text-xs text-gray-600 leading-relaxed">
            تتيح لك الشريحة الرئيسية تخصيص وتوحيد أنماط الخطوط، تذييلات الصفحات، أرقام الشرائح، والألوان على مستوى جميع شرائح العرض التقديمي في ملف PowerPoint.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Master Template List */}
            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 space-y-2">
              <div className="text-xs font-bold text-gray-700 mb-2">قوالب الشرائح الرئيسية:</div>
              {DEFAULT_MASTERS.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedMaster(m)}
                  className={`p-2 rounded text-xs cursor-pointer border transition ${
                    selectedMaster.id === m.id
                      ? 'border-[#d83b01] bg-orange-50 font-bold text-[#d83b01]'
                      : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Layout className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{m.nameAr}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Visual Master Preview */}
            <div className="md:col-span-2 border border-gray-300 rounded-lg p-4 bg-[#0a1128] text-white flex flex-col justify-between aspect-video relative shadow-inner">
              <div className="text-right border-b border-white/20 pb-2">
                <div className="text-[10px] text-sky-400 font-mono">INFINITY MASTER TEMPLATE</div>
                <div className="text-base font-bold" style={{ fontFamily: titleFont, color: accentColor }}>
                  اضغط لتحرير نمط عنوان الشريحة الرئيسية
                </div>
                <div className="text-xs text-white/70 mt-1">
                  • مستوى النص الرئيسي الأول<br />
                  &nbsp;&nbsp;– المستوى الفرعي الثاني
                </div>
              </div>

              {/* Master Footers */}
              <div className="border-t border-white/20 pt-2 flex items-center justify-between text-[10px] text-white/50">
                <span>{hasDate ? new Date().toLocaleDateString('ar-EG') : ''}</span>
                <span>{hasFooter ? 'العرض التقديمي السيادي 2026' : ''}</span>
                <span>{hasNumber ? '‹#›' : ''}</span>
              </div>
            </div>
          </div>

          {/* Master Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-200 pt-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">خط العناوين الرئيسي:</label>
              <select
                value={titleFont}
                onChange={(e) => setTitleFont(e.target.value)}
                className="w-full border border-gray-300 rounded p-2 bg-white"
              >
                <option value="Cairo">Cairo (الافتراضي الرسمي)</option>
                <option value="Tajawal">Tajawal (عصري وتقني)</option>
                <option value="Amiri">Amiri (أصيل وأكاديمي)</option>
                <option value="Arial">Arial</option>
                <option value="Times New Roman">Times New Roman</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">لون التمييز الأساسي (Accent):</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-9 h-9 p-0 border border-gray-300 rounded cursor-pointer"
                />
                <span className="font-mono text-gray-600">{accentColor}</span>
              </div>
            </div>

            <div className="sm:col-span-2 flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                <input
                  type="checkbox"
                  checked={hasFooter}
                  onChange={(e) => setHasFooter(e.target.checked)}
                  className="rounded text-[#d83b01] focus:ring-[#d83b01]"
                />
                <span>تضمين تذييل الشريحة (Footer)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                <input
                  type="checkbox"
                  checked={hasNumber}
                  onChange={(e) => setHasNumber(e.target.checked)}
                  className="rounded text-[#d83b01] focus:ring-[#d83b01]"
                />
                <span>تضمين رقم الشريحة (Slide Number)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                <input
                  type="checkbox"
                  checked={hasDate}
                  onChange={(e) => setHasDate(e.target.checked)}
                  className="rounded text-[#d83b01] focus:ring-[#d83b01]"
                />
                <span>تضمين التاريخ والوقت (Date)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-100 transition cursor-pointer"
          >
            إلغاء وإغلاق العرض الرئيسي
          </button>
          <button
            onClick={handleApply}
            className="px-5 py-2 bg-[#d83b01] hover:bg-[#b33000] text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>تطبيق على كافة الشرائح</span>
          </button>
        </div>
      </div>
    </div>
  );
};
