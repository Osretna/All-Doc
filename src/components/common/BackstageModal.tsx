import React, { useState } from 'react';
import {
  ArrowRight,
  FilePlus,
  FolderOpen,
  Save,
  Download,
  Printer,
  Info,
  Settings,
  HelpCircle,
  FileSpreadsheet,
  FileText,
  Presentation,
  Database,
  StickyNote,
  FileCheck,
  Palette
} from 'lucide-react';
import { OfficeAppId } from '../../types/office';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  activeApp: OfficeAppId;
  documentTitle: string;
  onApplyTemplate: (templateId: string, title: string) => void;
  onExport: (format: string) => void;
  onSwitchApp: (app: OfficeAppId) => void;
  onLoadExcelData?: (data: any, title: string) => void;
}

export const BackstageModal: React.FC<Props> = ({
  isOpen,
  onClose,
  activeApp,
  documentTitle,
  onApplyTemplate,
  onExport,
  onSwitchApp,
  onLoadExcelData,
}) => {
  const [selectedMenu, setSelectedMenu] = useState<'new' | 'open' | 'info' | 'save' | 'export' | 'print'>('new');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex bg-white select-none overflow-hidden animate-in fade-in duration-150">
      {/* Backstage Left Navigation Bar */}
      <div className="w-56 bg-[#004578] text-white flex flex-col justify-between shrink-0 shadow-lg">
        <div>
          {/* Back button */}
          <div className="p-3 border-b border-white/10 flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center cursor-pointer transition text-white"
              title="الرجوع إلى المستند"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
            <span className="font-bold text-sm">ملف</span>
          </div>

          {/* Navigation Links */}
          <nav className="p-2 space-y-1 text-xs">
            {[
              { id: 'new', label: 'جديد (New)', icon: FilePlus },
              { id: 'open', label: 'فتح (Open)', icon: FolderOpen },
              { id: 'info', label: 'معلومات المستند (Info)', icon: Info },
              { id: 'save', label: 'حفظ (Save)', icon: Save },
              { id: 'export', label: 'تصدير وحفظ باسم (Export)', icon: Download },
              { id: 'print', label: 'طباعة (Print)', icon: Printer },
            ].map(item => {
              const Icon = item.icon;
              const active = selectedMenu === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedMenu(item.id as any)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md font-bold transition cursor-pointer text-right ${
                    active ? 'bg-white/20 text-white shadow-xs' : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Suite Info Footer */}
        <div className="p-3 border-t border-white/10 text-[11px] text-white/70">
          <div className="font-bold text-white">MY-DOC Sovereign Suite</div>
          <div>إصدار 2026 السيادي المتكامل</div>
        </div>
      </div>

      {/* Backstage Content Area */}
      <div className="flex-1 bg-[#f8f9fa] overflow-y-auto p-8">
        {selectedMenu === 'new' && (
          <div className="max-w-4xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">إنشاء جديد</h2>
              <p className="text-xs text-gray-500">اختر قالباً جاهزاً أو ابدأ بمصنف ومستند فارغ:</p>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Blank Workbook */}
              <div
                onClick={() => {
                  onApplyTemplate('blank', 'مصنف جديد');
                  onClose();
                }}
                className="group p-5 rounded-xl border-2 border-dashed border-gray-300 hover:border-[#107c41] bg-white hover:shadow-md cursor-pointer transition flex flex-col justify-between h-44"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#107c41] flex items-center justify-center group-hover:scale-110 transition">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">مصنف إكسيل فارغ</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">جدول بيانات جديد ونظيف لبدء العمل فوراً.</p>
                </div>
                <div className="text-[11px] text-[#107c41] font-bold">إنشاء الآن ➔</div>
              </div>

              {/* Maintenance & HOA Budget Template */}
              <div
                onClick={() => {
                  onApplyTemplate('mollak_budget', 'ميزانية اتحاد ملاك وصيانة عقارات');
                  onClose();
                }}
                className="group p-5 rounded-xl border border-gray-200 hover:border-[#107c41] bg-white hover:shadow-md cursor-pointer transition flex flex-col justify-between h-44"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-[#107c41] flex items-center justify-center group-hover:scale-110 transition">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">ميزانية اتحاد الشاغلين والصيانة</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">نموذج احترافي لإدارة مصاريف العمارة واشتراكات الملاك.</p>
                </div>
                <div className="text-[11px] text-[#107c41] font-bold">استخدام القالب ➔</div>
              </div>

              {/* Sales Report */}
              <div
                onClick={() => {
                  onApplyTemplate('sales_report', 'تقرير مبيعات وأرباح سنوي');
                  onClose();
                }}
                className="group p-5 rounded-xl border border-gray-200 hover:border-[#107c41] bg-white hover:shadow-md cursor-pointer transition flex flex-col justify-between h-44"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-110 transition">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">تقرير المبيعات والأرباح السنوية</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">جدول حسابي متكامل مع الرسوم البيانية والمعادلات.</p>
                </div>
                <div className="text-[11px] text-blue-700 font-bold">استخدام القالب ➔</div>
              </div>
            </div>
          </div>
        )}

        {selectedMenu === 'export' && (
          <div className="max-w-2xl space-y-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">تصدير وحفظ باسم</h2>
              <p className="text-xs text-gray-500">حفظ الملف بصيغ قياسية عالمية قابلة للفتح على أي جهاز:</p>
            </div>

            <div className="space-y-3">
              <div
                onClick={() => {
                  onExport('xlsx');
                  onClose();
                }}
                className="p-4 bg-white border border-gray-200 hover:border-[#107c41] rounded-xl cursor-pointer hover:shadow-md transition flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 text-[#107c41] flex items-center justify-center">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">مصنف Excel بصيغة (.xlsx)</h4>
                    <p className="text-xs text-gray-500">الملف الأصلي المعتمد لمايكروسوفت إكسيل مع الاحتفاظ بكافة الصيغ والتنسيقات.</p>
                  </div>
                </div>
                <Download className="w-5 h-5 text-[#107c41]" />
              </div>

              <div
                onClick={() => {
                  window.print();
                  onClose();
                }}
                className="p-4 bg-white border border-gray-200 hover:border-red-500 rounded-xl cursor-pointer hover:shadow-md transition flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                    <FileCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">مستند PDF للطباعة (.pdf)</h4>
                    <p className="text-xs text-gray-500">تصدير المستند كملف PDF عالي الدقة وجاهز للطباعة والاعتماد.</p>
                  </div>
                </div>
                <Printer className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </div>
        )}

        {selectedMenu === 'info' && (
          <div className="max-w-xl space-y-4 bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
            <h3 className="font-bold text-base text-gray-900 border-b border-gray-200 pb-2">معلومات الملف الحالي</h3>
            <div className="space-y-2 text-xs text-gray-700">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-400">اسم المستند:</span>
                <span className="font-bold">{documentTitle}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-400">التطبيق النشط:</span>
                <span className="font-bold uppercase">{activeApp}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-400">حالة الخصوصية:</span>
                <span className="font-bold text-emerald-700">سيادي 100% (أوفلاين بدون إنترنت)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-400">نوع التخزين:</span>
                <span className="font-bold">IndexedDB / LocalStorage محلي مشفر</span>
              </div>
            </div>
          </div>
        )}

        {selectedMenu === 'print' && (
          <div className="max-w-xl space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-1">طباعة المستند</h2>
            <p className="text-xs text-gray-500">جاهز للإرسال إلى الطابعة أو التصدير إلى PDF:</p>
            <button
              onClick={() => {
                window.print();
                onClose();
              }}
              className="px-6 py-2.5 bg-[#107c41] hover:bg-[#0e6b37] text-white font-bold rounded-lg text-xs cursor-pointer shadow-md transition flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>بدء أمر الطباعة الآن (Print)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
