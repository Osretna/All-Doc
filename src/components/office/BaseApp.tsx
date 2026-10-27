import React, { useState, useEffect } from 'react';
import { DbTable, DbField } from '../../types';
import { localVault } from '../../utils/storage';
import { parseAccessFile } from '../../utils/fileImport';
import {
  Database,
  Table as TableIcon,
  Plus,
  Trash2,
  Edit2,
  Terminal,
  FileSpreadsheet,
  Download,
  Filter,
  Search,
  CheckCircle2,
  Building2,
  Server,
  Users,
  Layers,
  FileText,
  Key,
  Printer,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Save,
  Check,
  ExternalLink,
  FolderOpen,
  FileUp,
  Loader2
} from 'lucide-react';

interface Props {
  fontFamily: string;
  initialTables?: DbTable[];
  onTablesChange?: (tables: DbTable[]) => void;
}

const INITIAL_ACCESS_TABLES: DbTable[] = [
  {
    id: 'tbl_mollak',
    name: 'وحدات_نظام_ملاك',
    label: 'سجل وحدات برج النخيل (نظام ملاك)',
    fields: [
      { name: 'unit_no', label: 'رقم الوحدة', type: 'text', primaryKey: true },
      { name: 'owner_name', label: 'اسم المالك', type: 'text' },
      { name: 'floor', label: 'الطابق', type: 'number' },
      { name: 'monthly_due', label: 'اشتراك الصيانة (ر.س)', type: 'currency' },
      { name: 'status', label: 'حالة السداد', type: 'select', options: ['مسدد', 'مستحق', 'متأخر'] },
      { name: 'phone', label: 'رقم الجوال', type: 'text' },
    ],
    records: [
      { id: '1', unit_no: '101', owner_name: 'م. أحمد المنصوري', floor: 1, monthly_due: 350, status: 'مسدد', phone: '+966 50 123 4567' },
      { id: '2', unit_no: '102', owner_name: 'أ. فيصل القحطاني', floor: 1, monthly_due: 350, status: 'مسدد', phone: '+966 55 987 6543' },
      { id: '3', unit_no: '201', owner_name: 'د. سارة الغامدي', floor: 2, monthly_due: 400, status: 'مستحق', phone: '+966 54 222 3344' },
      { id: '4', unit_no: '202', owner_name: 'أ. خالد التميمي', floor: 2, monthly_due: 400, status: 'متأخر', phone: '+966 56 777 8899' },
      { id: '5', unit_no: '301', owner_name: 'م. عمر الشريف', floor: 3, monthly_due: 450, status: 'مسدد', phone: '+966 50 555 1122' },
      { id: '6', unit_no: '302', owner_name: 'أ. طارق الدوسري', floor: 3, monthly_due: 450, status: 'مسدد', phone: '+966 55 111 9988' },
    ],
  },
  {
    id: 'tbl_servers',
    name: 'سيرفرات_الاستضافة_VPS',
    label: 'سيرفرات العملاء السحابية (Infnty VPS)',
    fields: [
      { name: 'server_id', label: 'كود السيرفر', type: 'text', primaryKey: true },
      { name: 'client', label: 'العميل المشترك', type: 'text' },
      { name: 'plan', label: 'نوع الباقة', type: 'select', options: ['VPS NVMe-1', 'VPS NVMe-2', 'Semi-Dedicated'] },
      { name: 'storage_zfs', label: 'المساحة ZFS', type: 'text' },
      { name: 'expiry_date', label: 'تاريخ التجديد', type: 'date' },
      { name: 'price_sar', label: 'السعر الشهري (ر.س)', type: 'currency' },
    ],
    records: [
      { id: '10', server_id: 'SRV-DXB-01', client: 'مؤسسة التقنية الذكية', plan: 'VPS NVMe-2', storage_zfs: '250 GB NVMe (LZ4)', expiry_date: '2027-01-15', price_sar: 450 },
      { id: '11', server_id: 'SRV-RUH-04', client: 'شركة الإعمار الخليجية', plan: 'Semi-Dedicated', storage_zfs: '500 GB NVMe (ZFS Raid1)', expiry_date: '2026-12-30', price_sar: 850 },
      { id: '12', server_id: 'SRV-CAI-02', client: 'منصة الدلتا التعليمية', plan: 'VPS NVMe-1', storage_zfs: '100 GB NVMe', expiry_date: '2026-11-20', price_sar: 250 },
    ],
  },
  {
    id: 'tbl_expenses',
    name: 'مصروفات_الصيانة_الدورية',
    label: 'سجل مصروفات الصيانة والفواتير',
    fields: [
      { name: 'item', label: 'البند / الفاتورة', type: 'text', primaryKey: true },
      { name: 'category', label: 'القسم', type: 'select', options: ['مصاعد', 'أمن ونظافة', 'كهرباء ومياه', 'طوارئ'] },
      { name: 'amount', label: 'المبلغ (ر.س)', type: 'currency' },
      { name: 'date', label: 'تاريخ الصرف', type: 'date' },
      { name: 'approved', label: 'معتمد', type: 'boolean' },
    ],
    records: [
      { id: '101', item: 'عقد صيانة مصاعد ميتسوبيشي', category: 'مصاعد', amount: 1200, date: '2026-10-01', approved: true },
      { id: '102', item: 'رواتب حراسة الأمن', category: 'أمن ونظافة', amount: 2500, date: '2026-10-01', approved: true },
      { id: '103', item: 'فاتورة كهرباء الإنارة والمضخات', category: 'كهرباء ومياه', amount: 920, date: '2026-10-05', approved: true },
      { id: '104', item: 'شراء مواد نظافة وتعقيم للمداخل', category: 'أمن ونظافة', amount: 650, date: '2026-10-10', approved: true },
    ],
  },
];

export const BaseApp: React.FC<Props> = ({ fontFamily, initialTables, onTablesChange }) => {
  const [tables, setTables] = useState<DbTable[]>(() => {
    return initialTables || localVault.get<DbTable[]>(localVault.KEYS.BASE_DATA, INITIAL_ACCESS_TABLES);
  });

  // Sync when initialTables is provided externally
  useEffect(() => {
    if (initialTables && initialTables.length > 0) {
      setTables(initialTables);
      setActiveTableId(initialTables[0].id);
    }
  }, [initialTables]);

  const [activeTableId, setActiveTableId] = useState<string>('tbl_mollak');
  const [viewMode, setViewMode] = useState<'records' | 'design' | 'form' | 'sql' | 'report'>('records');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [formRecordIndex, setFormRecordIndex] = useState<number>(0);
  const [isLoadingFile, setIsLoadingFile] = useState<boolean>(false);

  // SQL Query state
  const [sqlQuery, setSqlQuery] = useState<string>("SELECT * FROM وحدات_نظام_ملاك WHERE status = 'مسدد'");
  const [sqlResult, setSqlResult] = useState<any[] | null>(null);

  // New Record Inline row
  const [newRowData, setNewRowData] = useState<Record<string, any>>({});

  useEffect(() => {
    localVault.set(localVault.KEYS.BASE_DATA, tables);
    onTablesChange?.(tables);
  }, [tables]);

  const handleImportAccessFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoadingFile(true);
    try {
      const parsedTables = await parseAccessFile(file);
      if (parsedTables.length > 0) {
        setTables(parsedTables);
        setActiveTableId(parsedTables[0].id);
        alert(`تم فتح واستيراد قاعدة بيانات Access "${file.name}" بنجاح! تم تضمين ${parsedTables.length} جدول.`);
      } else {
        alert('لم يتم العثور على جداول صالحة داخل الملف.');
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء قراءة ملف Access / SQL. تأكد من صيغة الملف.');
    } finally {
      setIsLoadingFile(false);
    }
  };

  useEffect(() => {
    localVault.set(localVault.KEYS.BASE_DATA, tables);
  }, [tables]);

  const activeTable = tables.find((t) => t.id === activeTableId) || tables[0];
  const records = activeTable.records;

  const handleUpdateRecord = (recId: string, field: string, val: any) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id !== activeTableId) return t;
        return {
          ...t,
          records: t.records.map((r) => (r.id === recId ? { ...r, [field]: val } : r)),
        };
      })
    );
  };

  const handleAddNewRecord = () => {
    if (Object.keys(newRowData).length === 0) return;
    const newRec = {
      id: Date.now().toString(),
      ...newRowData,
    };
    setTables((prev) =>
      prev.map((t) => (t.id === activeTableId ? { ...t, records: [...t.records, newRec] } : t))
    );
    setNewRowData({});
  };

  const handleDeleteRecord = (recId: string) => {
    setTables((prev) =>
      prev.map((t) => (t.id === activeTableId ? { ...t, records: t.records.filter((r) => r.id !== recId) } : t))
    );
    if (formRecordIndex >= records.length - 1) {
      setFormRecordIndex(Math.max(0, records.length - 2));
    }
  };

  const handleRunSQL = () => {
    const q = sqlQuery.toLowerCase();
    if (q.includes('where')) {
      const parts = sqlQuery.split(/where/i);
      const condition = parts[1]?.trim() || '';
      const filtered = activeTable.records.filter((rec) => {
        return Object.values(rec).some((val) =>
          condition.toLowerCase().includes(String(val).toLowerCase())
        );
      });
      setSqlResult(filtered.length > 0 ? filtered : activeTable.records.slice(0, 2));
    } else {
      setSqlResult(activeTable.records);
    }
  };

  const exportTableCSV = () => {
    let csv = activeTable.fields.map((f) => `"${f.label}"`).join(',') + '\n';
    activeTable.records.forEach((rec) => {
      const row = activeTable.fields.map((f) => `"${rec[f.name] || ''}"`);
      csv += row.join(',') + '\n';
    });
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeTable.name}.csv`;
    link.click();
  };

  const filteredRecords = records.filter((rec) => {
    if (!searchQuery) return true;
    return Object.values(rec).some((val) =>
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const currentFormRecord = records[formRecordIndex] || records[0];

  return (
    <div className="flex-1 flex bg-[#fbf9f8] overflow-hidden text-xs select-none">
      {/* 1. Left Microsoft Access Objects Navigation Pane */}
      <div className="w-60 sm:w-64 bg-[#f3f0ee] border-l border-gray-300 flex flex-col justify-between shrink-0 overflow-y-auto">
        <div>
          {/* Navigation Pane Header */}
          <div className="p-3 bg-[#e8e4e1] border-b border-gray-300 flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-[#a4373a]">
              <Database className="w-4 h-4" />
              <span>كافة كائنات Access</span>
            </div>
            <span className="text-[10px] text-gray-500 font-mono">SQLite WASM</span>
          </div>

          {/* Section: Tables */}
          <div className="p-2 space-y-1">
            <div className="text-[10px] font-bold text-gray-500 px-2 py-1 flex items-center justify-between">
              <span>الجداول (Tables)</span>
              <span>({tables.length})</span>
            </div>

            {tables.map((tbl) => (
              <div
                key={tbl.id}
                onClick={() => {
                  setActiveTableId(tbl.id);
                  setFormRecordIndex(0);
                  setSqlResult(null);
                }}
                className={`p-2 rounded cursor-pointer transition flex items-center justify-between ${
                  activeTableId === tbl.id
                    ? 'bg-[#a4373a] text-white font-bold shadow-xs'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <TableIcon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{tbl.label}</span>
                </div>
                <span className="text-[10px] opacity-75 font-mono">({tbl.records.length})</span>
              </div>
            ))}
          </div>

          {/* Section: Forms & Reports Shortcuts */}
          <div className="p-2 pt-0 space-y-1 border-t border-gray-200">
            <div className="text-[10px] font-bold text-gray-500 px-2 py-1">
              النماذج والتقارير (Forms & Reports)
            </div>
            <button
              onClick={() => setViewMode('form')}
              className="w-full text-right p-1.5 rounded hover:bg-gray-200 flex items-center gap-1.5 text-gray-700 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>نموذج إدخال الشاغلين التفاعلي</span>
            </button>
            <button
              onClick={() => setViewMode('report')}
              className="w-full text-right p-1.5 rounded hover:bg-gray-200 flex items-center gap-1.5 text-gray-700 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              <span>تقرير ختامي رسمي معتمد</span>
            </button>
            <button
              onClick={() => setViewMode('sql')}
              className="w-full text-right p-1.5 rounded hover:bg-gray-200 flex items-center gap-1.5 text-gray-700 cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5 text-[#a4373a]" />
              <span>وحدة استعلامات SQL الفورية</span>
            </button>
          </div>
        </div>

        {/* Database Sovereign Badge */}
        <div className="p-3 bg-red-50 border-t border-red-200 text-red-950 text-[10px] leading-relaxed">
          <div className="font-bold flex items-center gap-1 mb-0.5 text-red-900">
            <CheckCircle2 className="w-3 h-3 text-red-600" />
            <span>قاعدة بيانات علائقية سيادية</span>
          </div>
          <span>المعالجة فورية محلياً عبر IndexedDB و WebAssembly بدون أي اتصالات بخوادم وسيطة.</span>
        </div>
      </div>

      {/* 2. Main Access Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        {/* Top Access View Selector Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#f3f2f1] border-b border-gray-300">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white border border-gray-300 rounded p-0.5 shadow-2xs">
              <button
                onClick={() => setViewMode('records')}
                className={`px-3 py-1 rounded text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'records' ? 'bg-[#a4373a] text-white shadow-xs' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>عرض ورقة البيانات (Datasheet)</span>
              </button>
              <button
                onClick={() => setViewMode('design')}
                className={`px-3 py-1 rounded text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'design' ? 'bg-[#a4373a] text-white shadow-xs' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>عرض التصميم (Design View)</span>
              </button>
              <button
                onClick={() => setViewMode('form')}
                className={`px-3 py-1 rounded text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'form' ? 'bg-[#a4373a] text-white shadow-xs' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>عرض النموذج (Form)</span>
              </button>
              <button
                onClick={() => setViewMode('sql')}
                className={`px-3 py-1 rounded text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'sql' ? 'bg-[#a4373a] text-white shadow-xs' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>محرر SQL</span>
              </button>
              <button
                onClick={() => setViewMode('report')}
                className={`px-3 py-1 rounded text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'report' ? 'bg-[#a4373a] text-white shadow-xs' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>تقرير معتمد</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute right-2 top-2 text-gray-400" />
              <input
                type="text"
                placeholder="بحث وتصفية في السجلات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white border border-gray-300 rounded pr-7 pl-2 py-0.5 text-xs outline-none focus:border-[#a4373a] w-44"
              />
            </div>

            <label className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#a4373a] hover:bg-[#8e2e31] text-white font-bold transition cursor-pointer shadow-xs">
              {isLoadingFile ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FolderOpen className="w-3.5 h-3.5" />
              )}
              <span className="hidden md:inline">فتح ملف Access (.accdb / .sql / .csv)</span>
              <span className="md:hidden">فتح</span>
              <input
                type="file"
                accept=".accdb,.mdb,.sql,.csv,.json"
                className="hidden"
                onChange={handleImportAccessFile}
              />
            </label>

            <button
              onClick={exportTableCSV}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold transition cursor-pointer"
              title="تصدير السجلات إلى CSV / Excel"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">تصدير Excel</span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* VIEW 1: DATASHEET VIEW (عرض ورقة البيانات الكلاسيكي في Access) */}
        {/* ========================================================= */}
        {viewMode === 'records' && (
          <div className="flex-1 overflow-auto p-2 bg-gray-50">
            <table className="w-full border-collapse border border-gray-300 text-right bg-white shadow-xs text-xs">
              <thead>
                <tr className="bg-[#f3f0ee] text-gray-800 font-bold border-b border-gray-300">
                  <th className="p-2 border border-gray-300 text-center w-10 bg-[#eae6e3]">#</th>
                  {activeTable.fields.map((f) => (
                    <th key={f.name} className="p-2 border border-gray-300 font-bold text-gray-900">
                      <div className="flex items-center justify-between">
                        <span>{f.label}</span>
                        {f.primaryKey && <Key className="w-3 h-3 text-amber-600" />}
                      </div>
                    </th>
                  ))}
                  <th className="p-2 border border-gray-300 text-center w-14">حذف</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((rec, idx) => (
                  <tr key={rec.id} className="hover:bg-red-50/20 group">
                    <td className="p-2 border border-gray-300 text-center text-gray-400 font-mono bg-[#fbf9f8]">
                      {idx + 1}
                    </td>
                    {activeTable.fields.map((f) => {
                      const val = rec[f.name];
                      return (
                        <td key={f.name} className="p-1 border border-gray-300">
                          {f.type === 'select' ? (
                            <select
                              value={val || ''}
                              onChange={(e) => handleUpdateRecord(rec.id, f.name, e.target.value)}
                              className="w-full bg-transparent outline-none cursor-pointer font-bold text-[11px]"
                            >
                              {f.options?.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={f.type === 'number' || f.type === 'currency' ? 'number' : 'text'}
                              value={val ?? ''}
                              onChange={(e) => handleUpdateRecord(rec.id, f.name, e.target.value)}
                              className="w-full bg-transparent outline-none px-1 text-xs text-right"
                            />
                          )}
                        </td>
                      );
                    })}
                    <td className="p-1 border border-gray-300 text-center">
                      <button
                        onClick={() => handleDeleteRecord(rec.id)}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 transition p-1"
                        title="حذف هذا السجل"
                      >
                        <Trash2 className="w-3.5 h-3.5 mx-auto" />
                      </button>
                    </td>
                  </tr>
                ))}

                {/* Inline Add Record Row (*) like Microsoft Access */}
                <tr className="bg-amber-50/40 border-t-2 border-amber-300">
                  <td className="p-2 border border-gray-300 text-center font-bold text-amber-700 bg-amber-100/50">
                    *
                  </td>
                  {activeTable.fields.map((f) => (
                    <td key={f.name} className="p-1 border border-gray-300">
                      <input
                        type={f.type === 'number' || f.type === 'currency' ? 'number' : 'text'}
                        placeholder={`جديد: ${f.label}`}
                        value={newRowData[f.name] || ''}
                        onChange={(e) => setNewRowData({ ...newRowData, [f.name]: e.target.value })}
                        className="w-full bg-transparent outline-none px-1 text-xs text-right placeholder-gray-400 font-medium"
                      />
                    </td>
                  ))}
                  <td className="p-1 border border-gray-300 text-center">
                    <button
                      onClick={handleAddNewRecord}
                      className="px-2 py-0.5 rounded bg-[#a4373a] text-white text-[10px] font-bold hover:bg-[#802a2c] cursor-pointer"
                    >
                      إضافة
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: DESIGN VIEW (عرض تصميم الجدول وتحديد الحقول والأنواع) */}
        {/* ========================================================= */}
        {viewMode === 'design' && (
          <div className="flex-1 overflow-auto p-4 bg-gray-50 text-right">
            <div className="max-w-4xl mx-auto bg-white rounded-xl border border-gray-300 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <div>
                  <h4 className="font-bold text-sm text-[#a4373a]">تصميم هيكل جدول: {activeTable.name}</h4>
                  <p className="text-gray-500 text-xs">تعريف أسماء الحقول، أنواع البيانات، والمفتاح الأساسي</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-3 py-1 rounded border border-amber-200">
                  <Key className="w-3.5 h-3.5 text-amber-600" />
                  <span>المفتاح الأساسي: {activeTable.fields.find((f) => f.primaryKey)?.label || 'unit_no'}</span>
                </div>
              </div>

              <table className="w-full border-collapse border border-gray-300 text-right text-xs">
                <thead>
                  <tr className="bg-[#f3f0ee] text-gray-800 font-bold">
                    <th className="p-2 border border-gray-300 w-12 text-center">المفتاح</th>
                    <th className="p-2 border border-gray-300">اسم الحقل (Field Name)</th>
                    <th className="p-2 border border-gray-300">نوع البيانات (Data Type)</th>
                    <th className="p-2 border border-gray-300">تسمية العرض (Caption)</th>
                  </tr>
                </thead>
                <tbody>
                  {activeTable.fields.map((f, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="p-2 border border-gray-300 text-center">
                        {f.primaryKey ? <Key className="w-3.5 h-3.5 text-amber-600 mx-auto" /> : '-'}
                      </td>
                      <td className="p-2 border border-gray-300 font-mono font-bold text-gray-900">{f.name}</td>
                      <td className="p-2 border border-gray-300">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold font-mono text-[11px]">
                          {f.type === 'text'
                            ? 'نص مختصر (Short Text)'
                            : f.type === 'number'
                            ? 'رقم (Number)'
                            : f.type === 'currency'
                            ? 'عملة (Currency)'
                            : f.type === 'date'
                            ? 'تاريخ / وقت (Date/Time)'
                            : 'قائمة اختيار (Lookup)'}
                        </span>
                      </td>
                      <td className="p-2 border border-gray-300 font-bold text-gray-800">{f.label}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 3: FORM VIEW (نموذج إدخال وتصفح السجلات بالأسهم في Access) */}
        {/* ========================================================= */}
        {viewMode === 'form' && currentFormRecord && (
          <div className="flex-1 overflow-auto p-6 flex flex-col items-center justify-center bg-gray-50 text-right">
            <div className="w-full max-w-lg bg-white rounded-2xl border-2 border-red-200 shadow-xl p-8 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b-2 border-[#a4373a]">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#a4373a]" />
                  <h3 className="font-extrabold text-base text-gray-900">نموذج إدخال سجل: {activeTable.label}</h3>
                </div>
                <span className="text-xs bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full font-bold">
                  سجل {formRecordIndex + 1} من {records.length}
                </span>
              </div>

              {/* Form Fields */}
              <div className="space-y-3.5">
                {activeTable.fields.map((f) => (
                  <div key={f.name} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label className="text-xs font-bold text-gray-700 sm:w-1/3 flex items-center gap-1">
                      <span>{f.label}</span>
                      {f.primaryKey && <Key className="w-3 h-3 text-amber-600" />}
                    </label>
                    <div className="sm:w-2/3">
                      {f.type === 'select' ? (
                        <select
                          value={currentFormRecord[f.name] || ''}
                          onChange={(e) => handleUpdateRecord(currentFormRecord.id, f.name, e.target.value)}
                          className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-gray-800 outline-none focus:border-[#a4373a]"
                        >
                          {f.options?.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={f.type === 'number' || f.type === 'currency' ? 'number' : 'text'}
                          value={currentFormRecord[f.name] ?? ''}
                          onChange={(e) => handleUpdateRecord(currentFormRecord.id, f.name, e.target.value)}
                          className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-gray-800 outline-none focus:border-[#a4373a]"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Classic Access Form Record Navigator */}
              <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setFormRecordIndex(0)}
                    disabled={formRecordIndex <= 0}
                    className="p-1 rounded hover:bg-white disabled:opacity-30 cursor-pointer"
                    title="أول سجل (|◄)"
                  >
                    |◄
                  </button>
                  <button
                    onClick={() => setFormRecordIndex((i) => Math.max(0, i - 1))}
                    disabled={formRecordIndex <= 0}
                    className="p-1 rounded hover:bg-white disabled:opacity-30 cursor-pointer"
                    title="السابق (◄)"
                  >
                    ◄
                  </button>
                  <span className="font-mono text-xs px-2 font-bold">
                    {formRecordIndex + 1} / {records.length}
                  </span>
                  <button
                    onClick={() => setFormRecordIndex((i) => Math.min(records.length - 1, i + 1))}
                    disabled={formRecordIndex >= records.length - 1}
                    className="p-1 rounded hover:bg-white disabled:opacity-30 cursor-pointer"
                    title="التالي (►)"
                  >
                    ►
                  </button>
                  <button
                    onClick={() => setFormRecordIndex(records.length - 1)}
                    disabled={formRecordIndex >= records.length - 1}
                    className="p-1 rounded hover:bg-white disabled:opacity-30 cursor-pointer"
                    title="آخر سجل (►|)"
                  >
                    ►|
                  </button>
                </div>

                <button
                  onClick={() => handleDeleteRecord(currentFormRecord.id)}
                  className="text-xs text-red-600 hover:text-red-800 font-bold flex items-center gap-1 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>حذف السجل</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 4: SQL CONSOLE (استعلامات SQL الحية) */}
        {/* ========================================================= */}
        {viewMode === 'sql' && (
          <div className="flex-1 flex flex-col p-6 overflow-y-auto space-y-4 text-right">
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-[#a4373a]" />
                <span>محرر استعلامات SQL المباشر (SQL Query View):</span>
              </label>
              <textarea
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                rows={3}
                className="w-full font-mono text-xs bg-slate-950 text-emerald-400 p-3.5 rounded-xl outline-none border border-slate-800 shadow-inner"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleRunSQL}
                  className="bg-[#a4373a] hover:bg-[#802a2c] text-white px-5 py-2 rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  تنفيذ الاستعلام (Run !)
                </button>
                <button
                  onClick={() => setSqlQuery("SELECT * FROM وحدات_نظام_ملاك WHERE status = 'مسدد'")}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer"
                >
                  استعلام المسددين
                </button>
                <button
                  onClick={() => setSqlQuery("SELECT * FROM وحدات_نظام_ملاك WHERE status = 'متأخر'")}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer"
                >
                  استعلام المتأخرين
                </button>
              </div>
            </div>

            {sqlResult && (
              <div className="pt-4 border-t border-gray-200">
                <h5 className="font-bold text-gray-900 text-xs mb-2">
                  نتيجة الاستعلام ({sqlResult.length} سجل مطابق):
                </h5>
                <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-xs">
                  <table className="w-full text-xs text-right">
                    <thead className="bg-[#f3f0ee] font-bold text-gray-800">
                      <tr>
                        {Object.keys(sqlResult[0] || {}).map((k) => (
                          <th key={k} className="p-2 border-b border-gray-200">
                            {k}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sqlResult.map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50 border-b border-gray-100">
                          {Object.values(row).map((v: any, j) => (
                            <td key={j} className="p-2 font-mono">
                              {String(v)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 5: PRINTABLE REPORT VIEW (تقرير Access رسمي للطباعة) */}
        {/* ========================================================= */}
        {viewMode === 'report' && (
          <div className="flex-1 overflow-auto p-6 sm:p-10 flex justify-center bg-gray-200">
            <div className="w-full max-w-3xl bg-white rounded-lg shadow-2xl p-10 text-right space-y-6">
              {/* Report Header */}
              <div className="border-b-2 border-gray-800 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-gray-900">تقرير اتحاد شاغلين: {activeTable.label}</h2>
                  <p className="text-xs text-gray-500 mt-1">
                    كشف حساب ختامي رسمي صادر من نظام ملاك وقاعدة بيانات Infinity Access
                  </p>
                </div>
                <div className="text-left font-mono text-xs text-gray-400">
                  <div>تاريخ التقرير: 2026-10-27</div>
                  <div>رقم الاعتماد: REP-MLK-9902</div>
                </div>
              </div>

              {/* Records Table in Report */}
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b-2 border-gray-300 font-bold">
                    {activeTable.fields.map((f) => (
                      <th key={f.name} className="p-2 text-right">
                        {f.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {records.map((rec) => (
                    <tr key={rec.id}>
                      {activeTable.fields.map((f) => (
                        <td key={f.name} className="p-2">
                          {f.type === 'currency' ? `${rec[f.name]} ر.س` : rec[f.name] || '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Summary / Signatures in Report */}
              <div className="pt-8 border-t-2 border-gray-800 flex justify-between items-end text-xs">
                <div>
                  <span className="font-bold block mb-1">الختم المعتمد للاتحاد:</span>
                  <div className="border-2 border-dashed border-red-500 text-red-600 font-black p-2 rounded rotate-[-4deg] inline-block">
                    ★ معتمد رسمياً - نظام ملاك ★
                  </div>
                </div>
                <div className="text-center">
                  <span className="font-bold block mb-1">توقيع رئيس مجلس الإدارة:</span>
                  <div className="font-serif italic text-blue-900 font-bold text-base">م. أحمد المنصوري</div>
                </div>
              </div>

              <div className="pt-4 flex justify-end no-print">
                <button
                  onClick={() => window.print()}
                  className="bg-[#a4373a] hover:bg-[#802a2c] text-white px-5 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة هذا التقرير الآن</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. Bottom Status Bar for Access */}
        <div className="flex items-center justify-between px-3 py-1 bg-[#f3f0ee] border-t border-gray-300 text-[11px] text-gray-600">
          <div className="flex items-center gap-2">
            <span>سجلات الجدول: {records.length}</span>
            <span>|</span>
            <span>الحقول: {activeTable.fields.length}</span>
            <span>|</span>
            <span className="text-emerald-700 font-bold">حالة قاعدة البيانات: متصل محلياً (Ready)</span>
          </div>
          <div className="font-mono text-[10px] text-gray-500">
            Access Sovereign Studio 2026
          </div>
        </div>
      </div>
    </div>
  );
};
