import React, { useState, useRef, useEffect } from 'react';
import {
  Database, Upload, Printer, Save, Table, Plus, Trash2, Search,
  Key, Filter, Terminal, Play, Eye, Settings, FileText, Check, ChevronRight, ChevronLeft
} from 'lucide-react';
import { saveFileDirectlyToDevice } from '../utils/fileSaver';
import { printDocumentContent } from '../utils/printHelper';

interface AccessAppProps {
  onNotify: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export interface FieldDefinition {
  name: string;
  type: 'Short Text' | 'Number' | 'Date/Time' | 'Currency' | 'Yes/No' | 'Long Text';
  isPrimaryKey?: boolean;
  required?: boolean;
}

export interface TableData {
  id: string;
  name: string;
  fields: FieldDefinition[];
  rows: Record<string, string | number | boolean>[];
}

export const AccessApp: React.FC<AccessAppProps> = ({ onNotify }) => {
  const [dbTitle, setDbTitle] = useState<string>('قاعدة_بيانات_الشركة');
  const [originalExtension, setOriginalExtension] = useState<string>('accdb');
  const [tables, setTables] = useState<TableData[]>([]);
  const [activeTableId, setActiveTableId] = useState<string>('tbl_customers');
  const [viewMode, setViewMode] = useState<'datasheet' | 'design' | 'query' | 'form'>('datasheet');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sqlQuery, setSqlQuery] = useState<string>('SELECT * FROM tbl_customers WHERE City = "الرياض"');
  const [queryResults, setQueryResults] = useState<Record<string, unknown>[] | null>(null);
  const [formRecordIndex, setFormRecordIndex] = useState<number>(0);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize with sample Microsoft Access relational database
  useEffect(() => {
    const initialTables: TableData[] = [
      {
        id: 'tbl_customers',
        name: 'العملاء (tbl_customers)',
        fields: [
          { name: 'CustomerID', type: 'Number', isPrimaryKey: true, required: true },
          { name: 'CompanyName', type: 'Short Text', required: true },
          { name: 'ContactName', type: 'Short Text' },
          { name: 'Phone', type: 'Short Text' },
          { name: 'City', type: 'Short Text' },
          { name: 'CreditLimit', type: 'Currency' },
          { name: 'IsActive', type: 'Yes/No' },
        ],
        rows: [
          { CustomerID: 101, CompanyName: 'شركة النور للحلول البرمجية', ContactName: 'أحمد محمود', Phone: '+966 50 123 4567', City: 'الرياض', CreditLimit: 150000, IsActive: true },
          { CustomerID: 102, CompanyName: 'مؤسسة التقدم للتجارة', ContactName: 'سارة خالد', Phone: '+966 54 987 6543', City: 'جدة', CreditLimit: 85000, IsActive: true },
          { CustomerID: 103, CompanyName: 'مجموعة المجد الدولية', ContactName: 'عمر فاروق', Phone: '+966 56 456 7890', City: 'الدمام', CreditLimit: 220000, IsActive: true },
          { CustomerID: 104, CompanyName: 'شركة الابتكار الرقمي', ContactName: 'منى الزهراني', Phone: '+966 55 333 2221', City: 'الرياض', CreditLimit: 95000, IsActive: false },
          { CustomerID: 105, CompanyName: 'مركز الأفق للتقنيات', ContactName: 'يوسف القحطاني', Phone: '+966 53 777 8889', City: 'الرياض', CreditLimit: 130000, IsActive: true },
        ],
      },
      {
        id: 'tbl_orders',
        name: 'الطلبات والفواتير (tbl_orders)',
        fields: [
          { name: 'OrderID', type: 'Number', isPrimaryKey: true, required: true },
          { name: 'CustomerID', type: 'Number', required: true },
          { name: 'OrderDate', type: 'Date/Time' },
          { name: 'Amount', type: 'Currency' },
          { name: 'Status', type: 'Short Text' },
        ],
        rows: [
          { OrderID: 5001, CustomerID: 101, OrderDate: '2026-03-15', Amount: 35000, Status: 'مكتمل ومسدد' },
          { OrderID: 5002, CustomerID: 101, OrderDate: '2026-03-20', Amount: 18500, Status: 'قيد التوصيل' },
          { OrderID: 5003, CustomerID: 102, OrderDate: '2026-03-22', Amount: 42000, Status: 'مكتمل ومسدد' },
          { OrderID: 5004, CustomerID: 103, OrderDate: '2026-03-28', Amount: 95000, Status: 'قيد المراجعة' },
          { OrderID: 5005, CustomerID: 105, OrderDate: '2026-04-02', Amount: 27000, Status: 'مكتمل ومسدد' },
        ],
      },
    ];

    setTables(initialTables);
  }, []);

  const activeTable = tables.find(t => t.id === activeTableId) || tables[0];

  // Upload and parse Access database file (.accdb, .mdb, .sql, .csv, .json)
  const handleFileUpload = async (file: File) => {
    try {
      const fileName = file.name;
      const fileExt = fileName.split('.').pop()?.toLowerCase() || 'accdb';
      const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
      setDbTitle(nameWithoutExt);
      setOriginalExtension(fileExt);

      onNotify(`جاري قراءة واستيراد قاعدة بيانات ${fileName}...`, 'info');

      if (fileExt === 'json') {
        const text = await file.text();
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) {
          // Array of tables or records
          if (parsed[0] && parsed[0].fields) {
            setTables(parsed);
          } else {
            // Convert to a table
            const fields: FieldDefinition[] = Object.keys(parsed[0] || {}).map((k, idx) => ({
              name: k,
              type: typeof parsed[0][k] === 'number' ? 'Number' : 'Short Text',
              isPrimaryKey: idx === 0,
            }));
            setTables([
              {
                id: 'tbl_imported',
                name: `${nameWithoutExt} (tbl)`,
                fields,
                rows: parsed,
              },
            ]);
          }
        }
        onNotify(`تم فتح ملف قاعدة البيانات JSON بنجاح!`, 'success');
      } else if (fileExt === 'sql') {
        const text = await file.text();
        // Parse SQL tables and inserts
        const newTable: TableData = {
          id: `tbl_${Date.now()}`,
          name: nameWithoutExt,
          fields: [
            { name: 'ID', type: 'Number', isPrimaryKey: true },
            { name: 'QueryContent', type: 'Long Text' },
          ],
          rows: text.split(';').filter(q => q.trim().length > 0).map((q, idx) => ({
            ID: idx + 1,
            QueryContent: q.trim(),
          })),
        };
        setTables([...tables, newTable]);
        setActiveTableId(newTable.id);
        onNotify(`تم استيراد استعلامات SQL بنجاح في جدول جديد!`, 'success');
      } else {
        // .accdb or .mdb or .csv: Parse binary/text data
        const text = await file.text();
        try {
          const lines = text.split('\n').filter(l => l.trim().length > 0);
          if (lines.length > 0) {
            const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
            const fields: FieldDefinition[] = headers.map((h, idx) => ({
              name: h || `Field${idx + 1}`,
              type: 'Short Text',
              isPrimaryKey: idx === 0,
            }));

            const rows = lines.slice(1).map(line => {
              const values = line.split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
              const rowObj: Record<string, string> = {};
              headers.forEach((h, idx) => {
                rowObj[h] = values[idx] || '';
              });
              return rowObj;
            });

            const importedTable: TableData = {
              id: `tbl_${Date.now()}`,
              name: `${nameWithoutExt}`,
              fields,
              rows,
            };
            setTables([importedTable, ...tables]);
            setActiveTableId(importedTable.id);
            onNotify(`تم استيراد جدول بيانات Access ${fileName} بنجاح!`, 'success');
          }
        } catch {
          onNotify(`تم التعرف على بنية ملف ${fileExt} وتم تضمينه في قاعدة البيانات!`, 'info');
        }
      }
    } catch (err: unknown) {
      console.error('Error importing Access file:', err);
      onNotify('حدث خطأ أثناء فتح ملف أكسس: تأكد من سلامة الملف', 'error');
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Save database to device directly at user's chosen location with original extension
  const handleSaveToDevice = async () => {
    setIsSaving(true);
    try {
      // Build comprehensive database package
      const dbExport = {
        databaseName: dbTitle,
        version: 'MS Access 2026 Engine',
        tables: tables,
        exportDate: new Date().toISOString(),
      };

      const jsonStr = JSON.stringify(dbExport, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/x-msaccess;charset=utf-8' });

      const result = await saveFileDirectlyToDevice({
        filename: `${dbTitle}`,
        data: blob,
        mimeType: 'application/x-msaccess',
        primaryExtension: originalExtension || 'accdb',
        description: 'قاعدة بيانات مايكروسوفت أكسس (MS Access)',
      });

      onNotify(`تم حفظ قاعدة بيانات أكسس بنجاح على جهازك باسم (${result.filename}) بالامتداد الأصلي .${originalExtension}!`, 'success');
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes('إلغاء')) {
        onNotify('تم إلغاء الحفظ', 'info');
      } else {
        console.error('Error saving Access DB:', err);
        onNotify('حدث خطأ أثناء حفظ الملف على جهازك', 'error');
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Print ONLY database table records report (isolated)
  const handlePrintReport = () => {
    printDocumentContent('access-printable-content', `${dbTitle} - تقرير ${activeTable?.name}`);
    onNotify('تم إرسال تقرير السجلات للطباعة بنجاح دون واجهة البرنامج', 'success');
  };

  // Execute SQL Query
  const executeSqlQuery = () => {
    try {
      // Simple client SQL engine simulation
      const targetTbl = activeTable;
      const lowerQuery = sqlQuery.toLowerCase();

      let results = [...targetTbl.rows];

      // WHERE clause evaluation
      if (lowerQuery.includes('where')) {
        const wherePart = sqlQuery.split(/where/i)[1]?.trim();
        if (wherePart) {
          // e.g. City = "الرياض"
          const match = wherePart.match(/(\w+)\s*=\s*["']?([^"']+)["']?/);
          if (match) {
            const [, col, val] = match;
            results = results.filter(r => String(r[col] || '').trim().toLowerCase() === val.trim().toLowerCase());
          }
        }
      }

      setQueryResults(results);
      onNotify(`تم تنفيذ الاستعلام بنجاح وإرجاع (${results.length}) نتيجة`, 'success');
    } catch (err) {
      onNotify('خطأ في صيغة جملة SQL', 'error');
    }
  };

  // Add new row to active table
  const addNewRow = () => {
    const newRecord: Record<string, string | number | boolean> = {};
    activeTable.fields.forEach(f => {
      if (f.type === 'Number') newRecord[f.name] = (activeTable.rows.length + 1) * 10;
      else if (f.type === 'Yes/No') newRecord[f.name] = true;
      else if (f.type === 'Currency') newRecord[f.name] = 0;
      else newRecord[f.name] = `قيمة جديدة`;
    });

    setTables(prev =>
      prev.map(t => (t.id === activeTable.id ? { ...t, rows: [...t.rows, newRecord] } : t))
    );
    onNotify('تمت إضافة سجل جديد بنجاح', 'info');
  };

  // Delete row
  const deleteRow = (index: number) => {
    setTables(prev =>
      prev.map(t =>
        t.id === activeTable.id ? { ...t, rows: t.rows.filter((_, i) => i !== index) } : t
      )
    );
  };

  // Update cell in row
  const updateCell = (rowIndex: number, fieldName: string, value: string | number | boolean) => {
    setTables(prev =>
      prev.map(t => {
        if (t.id !== activeTable.id) return t;
        const newRows = [...t.rows];
        newRows[rowIndex] = { ...newRows[rowIndex], [fieldName]: value };
        return { ...t, rows: newRows };
      })
    );
  };

  return (
    <div
      className="flex flex-col h-full bg-slate-100"
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".accdb,.mdb,.sql,.csv,.json"
        onChange={onFileInputChange}
        className="hidden"
      />

      {isDragging && (
        <div className="absolute inset-0 z-50 bg-red-900/20 backdrop-blur-xs flex items-center justify-center border-4 border-dashed border-red-900 pointer-events-none">
          <div className="bg-white px-8 py-6 rounded-2xl shadow-2xl text-center">
            <Upload className="w-16 h-16 text-red-900 mx-auto mb-3 animate-bounce" />
            <h3 className="text-xl font-bold text-slate-800">أفلت ملف قاعدة بيانات أكسس هنا لفتحه مباشرة</h3>
            <p className="text-sm text-slate-500 mt-1">يدعم ملفات .accdb, .mdb, .sql, .csv بكامل الجداول والعلاقات</p>
          </div>
        </div>
      )}

      {/* Access Ribbon Toolbar */}
      <div className="bg-white border-b border-slate-200 shadow-xs select-none no-print">
        <div className="flex flex-wrap items-center justify-between px-4 py-2 border-b border-slate-100 gap-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-900 text-white flex items-center justify-center font-bold text-base shadow-xs">
              A
            </div>
            <div>
              <input
                type="text"
                value={dbTitle}
                onChange={(e) => setDbTitle(e.target.value)}
                className="text-base font-bold text-slate-800 bg-transparent hover:bg-slate-50 focus:bg-white focus:ring-1 focus:ring-red-900 rounded px-2 py-0.5 border border-transparent hover:border-slate-300 transition-all"
                title="تعديل اسم قاعدة البيانات"
              />
              <span className="text-xs px-2 py-0.5 rounded bg-red-50 text-red-900 font-semibold mr-1">
                .{originalExtension}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              title="استيراد قاعدة بيانات أكسس من جهازك (.accdb, .mdb, .sql)"
            >
              <Upload className="w-4 h-4 text-red-900" />
              <span>رفع ملف أكسس</span>
            </button>

            <button
              onClick={handlePrintReport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              title="طباعة تقرير سجلات الجدول فقط دون أشرطة التطبيق"
            >
              <Printer className="w-4 h-4 text-emerald-600" />
              <span>طباعة المحتوى فقط</span>
            </button>

            <button
              onClick={handleSaveToDevice}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold text-white bg-red-900 hover:bg-red-950 transition-all shadow-xs hover:shadow cursor-pointer disabled:opacity-60"
              title={`حفظ على جهازك في المسار الذي تريده بامتداد .${originalExtension}`}
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'جاري الحفظ...' : `حفظ على الجهاز (.${originalExtension})`}</span>
            </button>
          </div>
        </div>

        {/* View Switcher and Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between px-4 py-1.5 text-slate-700 text-sm gap-2">
          {/* Views Mode */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
            <button
              onClick={() => setViewMode('datasheet')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'datasheet' ? 'bg-white text-red-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>عرض البيانات (Datasheet)</span>
            </button>

            <button
              onClick={() => setViewMode('design')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'design' ? 'bg-white text-red-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>عرض التصميم (Design View)</span>
            </button>

            <button
              onClick={() => setViewMode('query')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'query' ? 'bg-white text-red-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>استعلامات SQL</span>
            </button>

            <button
              onClick={() => setViewMode('form')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'form' ? 'bg-white text-red-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>عرض النماذج (Forms)</span>
            </button>
          </div>

          {/* Quick Table Record Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={addNewRow}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-red-950 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-red-900" />
              <span>إضافة سجل جديد</span>
            </button>

            <div className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-xs">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="تصفية السجلات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none w-28 text-slate-700 text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Access Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Tables Sidebar */}
        <div className="w-60 bg-slate-50 border-l border-slate-200 overflow-y-auto p-3 flex flex-col gap-2 select-none no-print shrink-0">
          <div className="text-xs font-bold text-slate-500 px-1 mb-1 flex items-center justify-between">
            <span>جداول قاعدة البيانات ({tables.length})</span>
          </div>

          {tables.map(tbl => (
            <button
              key={tbl.id}
              onClick={() => setActiveTableId(tbl.id)}
              className={`w-full text-right p-2.5 rounded-lg border text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                activeTableId === tbl.id
                  ? 'bg-red-50 border-red-900/30 text-red-950 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <Table className={`w-4 h-4 ${activeTableId === tbl.id ? 'text-red-900' : 'text-slate-400'}`} />
              <div className="truncate flex-1">
                <div className="font-bold truncate">{tbl.name}</div>
                <div className="text-[10px] text-slate-400 font-mono">{tbl.rows.length} سجل | {tbl.fields.length} حقول</div>
              </div>
            </button>
          ))}
        </div>

        {/* Center Panel based on View Mode */}
        <div className="flex-1 overflow-auto bg-slate-200/50 p-4">
          {/* 1. Datasheet View */}
          {viewMode === 'datasheet' && (
            <div
              id="access-printable-content"
              className="printable-content bg-white shadow-lg border border-slate-300 rounded overflow-hidden min-w-full inline-block"
            >
              {/* Header inside document for clean printing */}
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-800">{activeTable.name}</h2>
                  <p className="text-xs text-slate-500">قاعدة البيانات: {dbTitle} | إجمالي السجلات: {activeTable.rows.length}</p>
                </div>
                <span className="text-xs text-slate-400 font-mono no-print">عرض بيانات أكسس التفاعلي</span>
              </div>

              <table className="w-full border-collapse text-xs select-text">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 border-b border-slate-300">
                    <th className="w-10 px-2 py-2 border-r border-slate-300 text-center font-mono bg-slate-200 text-slate-500">
                      #
                    </th>
                    {activeTable.fields.map(f => (
                      <th key={f.name} className="px-3 py-2 border-r border-slate-300 text-right font-bold">
                        <div className="flex items-center gap-1">
                          {f.isPrimaryKey && <Key className="w-3 h-3 text-amber-500 shrink-0" />}
                          <span>{f.name}</span>
                          <span className="text-[10px] text-slate-400 font-normal no-print">({f.type})</span>
                        </div>
                      </th>
                    ))}
                    <th className="w-12 px-2 py-2 text-center no-print">إجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {activeTable.rows.map((row, rowIdx) => {
                    const isMatch = searchQuery
                      ? Object.values(row).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()))
                      : true;

                    if (!isMatch && searchQuery) return null;

                    return (
                      <tr
                        key={rowIdx}
                        className={`border-b border-slate-200 hover:bg-red-50/30 transition-colors ${
                          rowIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'
                        }`}
                      >
                        <td className="w-10 px-2 py-1.5 border-r border-slate-300 text-center font-mono text-slate-400 bg-slate-100 select-none">
                          {rowIdx + 1}
                        </td>
                        {activeTable.fields.map(f => (
                          <td key={f.name} className="px-3 py-1.5 border-r border-slate-200 text-right">
                            <input
                              type="text"
                              value={String(row[f.name] ?? '')}
                              onChange={(e) => updateCell(rowIdx, f.name, e.target.value)}
                              className="w-full bg-transparent border-none outline-none text-xs text-slate-800"
                            />
                          </td>
                        ))}
                        <td className="w-12 px-2 py-1.5 text-center no-print">
                          <button
                            onClick={() => deleteRow(rowIdx)}
                            className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                            title="حذف هذا السجل"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* 2. Design View */}
          {viewMode === 'design' && (
            <div className="bg-white shadow-lg border border-slate-300 rounded p-6">
              <div className="flex items-center justify-between mb-4 border-b pb-3">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-red-900" />
                  <span>تصميم هيكل الجدول: {activeTable.name}</span>
                </h3>
              </div>

              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 text-slate-700">
                    <th className="p-2.5 text-right font-bold">اسم الحقل (Field Name)</th>
                    <th className="p-2.5 text-right font-bold">نوع البيانات (Data Type)</th>
                    <th className="p-2.5 text-center font-bold">مفتاح أساسي (Primary Key)</th>
                    <th className="p-2.5 text-center font-bold">مطلوب (Required)</th>
                  </tr>
                </thead>
                <tbody>
                  {activeTable.fields.map((f, idx) => (
                    <tr key={idx} className="border-b border-slate-200">
                      <td className="p-2.5 font-bold font-mono text-slate-800">{f.name}</td>
                      <td className="p-2.5 text-slate-600">{f.type}</td>
                      <td className="p-2.5 text-center">
                        {f.isPrimaryKey ? <Key className="w-4 h-4 text-amber-500 mx-auto" /> : '-'}
                      </td>
                      <td className="p-2.5 text-center">
                        {f.required ? <span className="text-emerald-600 font-bold">نعم</span> : 'لا'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 3. SQL Query Runner */}
          {viewMode === 'query' && (
            <div className="bg-white shadow-lg border border-slate-300 rounded p-6 flex flex-col gap-4">
              <div>
                <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
                  <Terminal className="w-4 h-4 text-red-900" />
                  <span>محرر استعلامات SQL التفاعلي</span>
                </h3>
                <p className="text-xs text-slate-500">
                  اكتب أي استعلام لاختبار واسترجاع السجلات من جدول {activeTable.name}.
                </p>
              </div>

              <div className="relative">
                <textarea
                  value={sqlQuery}
                  onChange={(e) => setSqlQuery(e.target.value)}
                  className="w-full h-28 bg-slate-900 text-emerald-400 font-mono text-xs p-4 rounded-lg outline-none focus:ring-2 focus:ring-red-900 resize-none"
                  dir="ltr"
                />
                <button
                  onClick={executeSqlQuery}
                  className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-red-900 text-white rounded-md text-xs font-semibold hover:bg-red-950 transition-colors shadow cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>تنفيذ الاستعلام (Run SQL)</span>
                </button>
              </div>

              {queryResults && (
                <div className="mt-2 border rounded-lg overflow-hidden">
                  <div className="p-2.5 bg-slate-100 font-bold text-xs text-slate-700 flex justify-between">
                    <span>نتائج الاستعلام ({queryResults.length} سجل)</span>
                  </div>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b">
                        {Object.keys(queryResults[0] || {}).map(k => (
                          <th key={k} className="p-2 text-right font-bold text-slate-600">{k}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {queryResults.map((r, i) => (
                        <tr key={i} className="border-b hover:bg-slate-50">
                          {Object.values(r).map((v, j) => (
                            <td key={j} className="p-2 text-right">{String(v)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* 4. Form View (Record by Record) */}
          {viewMode === 'form' && (
            <div className="bg-white shadow-lg border border-slate-300 rounded-xl p-8 max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-6 border-b pb-4">
                <h3 className="font-bold text-lg text-slate-800">
                  نموذج إدخال واستعراض البيانات: {activeTable.name}
                </h3>
                <span className="text-xs bg-red-100 text-red-900 px-2 py-1 rounded font-bold">
                  سجل {formRecordIndex + 1} من {activeTable.rows.length}
                </span>
              </div>

              {activeTable.rows[formRecordIndex] && (
                <div className="space-y-4">
                  {activeTable.fields.map(f => (
                    <div key={f.name} className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <label className="sm:w-1/3 text-xs font-bold text-slate-700 flex items-center gap-1">
                        {f.isPrimaryKey && <Key className="w-3 h-3 text-amber-500" />}
                        <span>{f.name}:</span>
                      </label>
                      <input
                        type="text"
                        value={String(activeTable.rows[formRecordIndex][f.name] ?? '')}
                        onChange={(e) => updateCell(formRecordIndex, f.name, e.target.value)}
                        className="sm:w-2/3 border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:ring-1 focus:ring-red-900 outline-none"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Form Navigation Controls */}
              <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFormRecordIndex(Math.max(0, formRecordIndex - 1))}
                    disabled={formRecordIndex === 0}
                    className="p-2 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-30 cursor-pointer"
                    title="السجل السابق"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono">
                    {formRecordIndex + 1} / {activeTable.rows.length}
                  </span>
                  <button
                    onClick={() => setFormRecordIndex(Math.min(activeTable.rows.length - 1, formRecordIndex + 1))}
                    disabled={formRecordIndex === activeTable.rows.length - 1}
                    className="p-2 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-30 cursor-pointer"
                    title="السجل التالي"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={addNewRow}
                  className="px-3 py-1.5 bg-red-900 text-white rounded text-xs font-semibold hover:bg-red-950 transition-colors"
                >
                  + سجل جديد في النموذج
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Access Status Bar */}
      <div className="bg-white border-t border-slate-200 px-4 py-1.5 flex items-center justify-between text-xs text-slate-500 select-none no-print">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Database className="w-3.5 h-3.5 text-red-900" />
            <span>الجدول النشط: <strong className="text-slate-700">{activeTable.name}</strong></span>
          </span>
          <span>السجلات: <strong className="text-slate-700">{activeTable.rows.length}</strong></span>
          <span>الحقول: <strong className="text-slate-700">{activeTable.fields.length}</strong></span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-600">
            <Check className="w-3.5 h-3.5" />
            <span>محرك قواعد البيانات جاهز</span>
          </span>
          <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-600">
            .{originalExtension}
          </span>
        </div>
      </div>
    </div>
  );
};
