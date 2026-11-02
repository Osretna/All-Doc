import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  DollarSign, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Plus, 
  Printer, 
  ExternalLink,
  ShieldCheck,
  Table as TableIcon
} from 'lucide-react';
import { OfficeAppId } from '../../types';

interface Props {
  onOpenOfficeApp: (app: OfficeAppId) => void;
}

export const MollakView: React.FC<Props> = ({ onOpenOfficeApp }) => {
  const [selectedBuilding, setSelectedBuilding] = useState<string>('برج النخيل السكني');

  const unitsData = [
    { no: '101', owner: 'م. أحمد المنصوري', floor: 'الأول', due: 350, status: 'paid', lastDate: '2026-10-05' },
    { no: '102', owner: 'أ. فيصل القحطاني', floor: 'الأول', due: 350, status: 'paid', lastDate: '2026-10-04' },
    { no: '201', owner: 'د. سارة الغامدي', floor: 'الثاني', due: 400, status: 'pending', lastDate: '2026-09-28' },
    { no: '202', owner: 'أ. خالد التميمي', floor: 'الثاني', due: 400, status: 'overdue', lastDate: '2026-08-15' },
    { no: '301', owner: 'م. عمر الشريف', floor: 'الثالث', due: 450, status: 'paid', lastDate: '2026-10-10' },
    { no: '302', owner: 'أ. طارق الدوسري', floor: 'الثالث', due: 450, status: 'paid', lastDate: '2026-10-01' },
  ];

  const totalCollected = 1950;
  const totalPending = 800;

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto p-4 sm:p-8 text-right text-xs">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Mollak Hero Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30">
              <Building2 className="w-3.5 h-3.5" />
              <span>نظام "ملاك" السيادي لإدارة اتحادات الشاغلين والمجمعات السكنية</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              إدارة ذكية ومؤتمتة للعقارات، الصيانة، واشتراكات الملاك
            </h1>
            <p className="text-emerald-100/80 text-xs max-w-xl leading-relaxed">
              حل برمجي متكامل تم تطويره على منصة إنفينيتي يربط بين جداول الحسابات (Infinity Sheets)، محاضر الجمعيات العمومية (Infinity Docs)، وقواعد البيانات الآمنة.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <button
              onClick={() => onOpenOfficeApp('sheets')}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <TableIcon className="w-4 h-4" />
              <span>فتح ميزانية ملاك في Infinity Sheets</span>
            </button>
            <button
              onClick={() => onOpenOfficeApp('docs')}
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2.5 rounded-xl transition text-xs border border-white/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>محضر اجتماع اتحاد شاغلين</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-gray-500">
              <span>إجمالي الوحدات المسجلة</span>
              <Building2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-gray-900 font-mono">24 وحدة</div>
            <span className="text-[11px] text-gray-400">نسبة الإشغال: 100%</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-gray-500">
              <span>الاشتراكات المحصلة (هذا الشهر)</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-700 font-mono">
              {totalCollected.toLocaleString('ar-EG')} ر.س
            </div>
            <span className="text-[11px] text-emerald-600 font-medium">85% من إجمالي المستهدف</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-gray-500">
              <span>مستحقات متأخرة</span>
              <AlertCircle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-600 font-mono">
              {totalPending.toLocaleString('ar-EG')} ر.س
            </div>
            <span className="text-[11px] text-amber-700">شقتان قيد المتابعة</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-gray-500">
              <span>صندوق صيانة المصاعد والطوارئ</span>
              <ShieldCheck className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-blue-700 font-mono">14,250 ر.س</div>
            <span className="text-[11px] text-blue-600">رصيد آمن في الحساب المشترك</span>
          </div>
        </div>

        {/* Units Ledger Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2">
            <div>
              <h3 className="font-bold text-gray-900 text-sm">
                سجل وحدات واشتراكات {selectedBuilding}
              </h3>
              <p className="text-gray-500 text-xs">محدث تلقائياً ومربوط بقاعدة بيانات Infinity Base</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => alert('تم إصدار وطباعة كشف حساب الشاغلين المعتمد!')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition font-bold"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>طباعة كشف الحساب</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-600 border-b border-gray-200 font-bold">
                  <th className="p-3">رقم الوحدة</th>
                  <th className="p-3">اسم المالك / الشاغل</th>
                  <th className="p-3">الدور</th>
                  <th className="p-3">قيمة الاشتراك</th>
                  <th className="p-3">حالة السداد</th>
                  <th className="p-3">تاريخ آخر دفعة</th>
                  <th className="p-3 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {unitsData.map((unit) => (
                  <tr key={unit.no} className="hover:bg-gray-50/80 transition">
                    <td className="p-3 font-mono font-bold text-gray-900">شقة #{unit.no}</td>
                    <td className="p-3 font-semibold text-gray-800">{unit.owner}</td>
                    <td className="p-3 text-gray-600">{unit.floor}</td>
                    <td className="p-3 font-mono font-bold text-gray-900">{unit.due} ر.س</td>
                    <td className="p-3">
                      {unit.status === 'paid' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>مسدد</span>
                        </span>
                      ) : unit.status === 'pending' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px]">
                          <Clock className="w-3 h-3" />
                          <span>مستحق السداد</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 font-bold text-[11px]">
                          <AlertCircle className="w-3 h-3" />
                          <span>متأخر</span>
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-gray-500 font-mono">{unit.lastDate}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => alert(`تم إرسال إشعار تذكير بالسداد للمالك ${unit.owner}`)}
                        className="text-blue-600 hover:text-blue-800 font-bold hover:underline"
                      >
                        سند استلام ➔
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
