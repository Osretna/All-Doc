import React, { useState } from 'react';
import { X, Play, Terminal, Database, Check, Plus, Trash2, ArrowRight } from 'lucide-react';
import { DbTable } from '../../../types';
import { AccessQuery } from './types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tables: DbTable[];
  onSaveQuery: (query: AccessQuery) => void;
}

export const QueryWizardModal: React.FC<Props> = ({
  isOpen,
  onClose,
  tables,
  onSaveQuery,
}) => {
  if (!isOpen) return null;

  const [queryName, setQueryName] = useState<string>('qry_NewQuery');
  const [queryType, setQueryType] = useState<AccessQuery['type']>('select');
  const [selectedTable, setSelectedTable] = useState<string>(tables[0]?.name || '');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [whereClause, setWhereClause] = useState<string>('');
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [previewResult, setPreviewResult] = useState<any[] | null>(null);

  const curTableObj = tables.find(t => t.name === selectedTable) || tables[0];

  const handleFieldToggle = (fieldName: string) => {
    if (selectedFields.includes(fieldName)) {
      setSelectedFields(selectedFields.filter(f => f !== fieldName));
    } else {
      setSelectedFields([...selectedFields, fieldName]);
    }
  };

  const handleSelectAllFields = () => {
    if (selectedFields.length === curTableObj.fields.length) {
      setSelectedFields([]);
    } else {
      setSelectedFields(curTableObj.fields.map(f => f.name));
    }
  };

  // Generate real SQL
  const fieldsPart = selectedFields.length > 0 ? selectedFields.join(', ') : '*';
  let generatedSql = `SELECT ${fieldsPart} FROM ${selectedTable}`;
  if (whereClause.trim()) {
    generatedSql += ` WHERE ${whereClause.trim()}`;
  }
  if (sortField) {
    generatedSql += ` ORDER BY ${sortField} ${sortDirection.toUpperCase()}`;
  }
  generatedSql += ';';

  const handleTestQuery = () => {
    try {
      let res = [...curTableObj.records];
      if (whereClause.trim()) {
        const lowerWhere = whereClause.toLowerCase();
        // check if has '='
        if (lowerWhere.includes('=')) {
          const [fName, fVal] = lowerWhere.split('=').map(s => s.trim().replace(/['"]/g, ''));
          res = res.filter(r => String(r[fName] || '').toLowerCase() === fVal.toLowerCase());
        } else if (lowerWhere.includes('>')) {
          const [fName, fVal] = lowerWhere.split('>').map(s => s.trim());
          res = res.filter(r => Number(r[fName]) > Number(fVal));
        } else {
          // general text search
          res = res.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(lowerWhere)));
        }
      }

      if (sortField) {
        res.sort((a, b) => {
          const valA = a[sortField];
          const valB = b[sortField];
          if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
          if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
          return 0;
        });
      }

      setPreviewResult(res);
    } catch (e) {
      alert('خطأ في معايير الاستعلام');
    }
  };

  const handleSave = () => {
    const q: AccessQuery = {
      id: `qry_${Date.now()}`,
      name: queryName,
      type: queryType,
      sourceTable: selectedTable,
      fields: selectedFields.length > 0 ? selectedFields : curTableObj.fields.map(f => f.name),
      sql: generatedSql,
      sortField: sortField || undefined,
      sortDirection,
    };
    onSaveQuery(q);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[160] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4" dir="rtl">
      <div className="bg-[#f0f2f5] border border-gray-400 rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden text-xs">
        {/* Title Bar */}
        <div className="bg-[#a4373a] text-white px-5 py-3 flex items-center justify-between select-none shadow-xs">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-amber-300" />
            <span className="font-bold text-sm">معالج وتصميم الاستعلامات (Query Wizard) - Microsoft Access</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Form */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 font-bold mb-1">اسم الاستعلام (Query Name):</label>
              <input
                type="text"
                value={queryName}
                onChange={(e) => setQueryName(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded p-2 outline-none font-bold"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-1">نوع الاستعلام (Query Type):</label>
              <select
                value={queryType}
                onChange={(e) => setQueryType(e.target.value as any)}
                className="w-full bg-white border border-gray-300 rounded p-2 outline-none font-medium"
              >
                <option value="select">استعلام تحديد (Select Query)</option>
                <option value="make-table">استعلام إنشاء جدول (Make-Table Query)</option>
                <option value="update">استعلام تحديث (Update Query)</option>
                <option value="delete">استعلام حذف (Delete Query)</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-1">الجدول المصدر (Source Table):</label>
              <select
                value={selectedTable}
                onChange={(e) => {
                  setSelectedTable(e.target.value);
                  setSelectedFields([]);
                }}
                className="w-full bg-white border border-gray-300 rounded p-2 outline-none font-medium"
              >
                {tables.map(t => (
                  <option key={t.id} value={t.name}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Fields Selection */}
          <div className="bg-white p-4 rounded-xl border border-gray-300">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-gray-800">الحقول المطلوبة في نتيجة الاستعلام:</span>
              <button
                type="button"
                onClick={handleSelectAllFields}
                className="text-[#a4373a] hover:underline font-bold"
              >
                {selectedFields.length === curTableObj.fields.length ? 'إلغاء تحديد الكل' : 'تحديد جميع الحقول (*)'}
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {curTableObj.fields.map(f => (
                <label key={f.name} className="flex items-center gap-2 p-1.5 rounded hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedFields.includes(f.name)}
                    onChange={() => handleFieldToggle(f.name)}
                    className="rounded text-[#a4373a]"
                  />
                  <span className="font-mono text-gray-700">{f.label || f.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Criteria & Sorting */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-300">
              <label className="block text-gray-800 font-bold mb-1">معايير التصفية والبحث (Criteria / WHERE):</label>
              <input
                type="text"
                placeholder="مثال: status = 'مسدد' أو monthly_due > 350"
                value={whereClause}
                onChange={(e) => setWhereClause(e.target.value)}
                className="w-full bg-slate-50 border border-gray-300 rounded p-2 outline-none font-mono"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">يدعم العمليات الحسابية والنصية الشرطية</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-300">
              <label className="block text-gray-800 font-bold mb-1">الفرز والترتيب (Order By):</label>
              <div className="flex gap-2">
                <select
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value)}
                  className="w-2/3 bg-slate-50 border border-gray-300 rounded p-2 outline-none font-medium"
                >
                  <option value="">بدون فرز</option>
                  {curTableObj.fields.map(f => (
                    <option key={f.name} value={f.name}>{f.label || f.name}</option>
                  ))}
                </select>
                <select
                  value={sortDirection}
                  onChange={(e) => setSortDirection(e.target.value as any)}
                  className="w-1/3 bg-slate-50 border border-gray-300 rounded p-2 outline-none font-medium"
                >
                  <option value="asc">تصاعدي (ASC)</option>
                  <option value="desc">تنازلي (DESC)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Generated SQL View */}
          <div className="bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-xs">
            <div className="text-[10px] text-slate-400 mb-1 font-sans">جملة SQL المُنشأة تلقائياً (SQL View):</div>
            <div className="select-text" dir="ltr">{generatedSql}</div>
          </div>

          {/* Preview Results Table */}
          {previewResult && (
            <div className="bg-white rounded-xl border border-gray-300 p-4">
              <div className="font-bold text-gray-800 mb-2 flex items-center justify-between">
                <span>نتائج اختبار الاستعلام (أعاد {previewResult.length} سجل):</span>
              </div>
              <div className="overflow-x-auto max-h-48 border rounded">
                <table className="w-full text-xs">
                  <thead className="bg-slate-100 border-b">
                    <tr>
                      {curTableObj.fields.map(f => (
                        <th key={f.name} className="p-2 text-right font-bold text-gray-700">{f.label || f.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewResult.map((r, i) => (
                      <tr key={i} className="border-b hover:bg-slate-50">
                        {curTableObj.fields.map(f => (
                          <td key={f.name} className="p-2 text-right">{String(r[f.name] ?? '')}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-300 p-4 flex items-center justify-between">
          <button
            onClick={handleTestQuery}
            className="px-4 py-2 bg-slate-800 hover:bg-black text-white font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>اختبار وتشغيل الاستعلام (Run !)</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-lg transition cursor-pointer"
            >
              إلغاء
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-[#a4373a] hover:bg-[#832629] text-white font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>حفظ الاستعلام (Save Query)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
