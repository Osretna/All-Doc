import React, { useState } from 'react';
import { Database, Plus, Trash2, Table, Play, Code } from 'lucide-react';
import { AppStorage } from '../../utils/storage';

interface AccessTable {
  id: string;
  name: string;
  fields: { name: string; label: string; type: string }[];
  records: { [key: string]: any }[];
}

const DEFAULT_ACCESS: AccessTable[] = [
  {
    id: 'tbl_clients',
    name: 'جدول_العملاء',
    fields: [
      { name: 'id', label: 'المعرف', type: 'number' },
      { name: 'name', label: 'اسم العميل', type: 'text' },
      { name: 'phone', label: 'رقم الهاتف', type: 'text' },
      { name: 'balance', label: 'الرصيد المستحق', type: 'number' },
    ],
    records: [
      { id: 1, name: 'مؤسسة الرياض للتقنية', phone: '0501234567', balance: 45000 },
      { id: 2, name: 'شركة النور للمقاولات', phone: '0559876543', balance: 12000 },
      { id: 3, name: 'مجموعة الأفق الاستثمارية', phone: '0543322114', balance: 87500 },
    ]
  }
];

export const AccessApp: React.FC = () => {
  const [tables, setTables] = useState<AccessTable[]>(() => {
    return AppStorage.get(AppStorage.KEYS.BASE_DATA, DEFAULT_ACCESS);
  });
  const [activeTableId, setActiveTableId] = useState(tables[0]?.id || 'tbl_clients');
  const [activeTab, setActiveTab] = useState<'data' | 'sql'>('data');
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM جدول_العملاء WHERE balance > 20000;');
  const [sqlResults, setSqlResults] = useState<any[] | null>(null);

  const currentTable = tables.find(t => t.id === activeTableId) || tables[0];

  const addRecord = () => {
    if (!currentTable) return;
    const newRec: any = { id: currentTable.records.length + 1 };
    currentTable.fields.forEach(f => {
      if (f.name !== 'id') newRec[f.name] = '';
    });
    const updated = tables.map(t => {
      if (t.id === activeTableId) {
        return { ...t, records: [...t.records, newRec] };
      }
      return t;
    });
    setTables(updated);
    AppStorage.set(AppStorage.KEYS.BASE_DATA, updated);
  };

  const updateRecordVal = (recIdx: number, fieldName: string, val: any) => {
    const updated = tables.map(t => {
      if (t.id === activeTableId) {
        const recs = [...t.records];
        recs[recIdx] = { ...recs[recIdx], [fieldName]: val };
        return { ...t, records: recs };
      }
      return t;
    });
    setTables(updated);
    AppStorage.set(AppStorage.KEYS.BASE_DATA, updated);
  };

  const executeSQL = () => {
    if (!currentTable) return;
    // Simple in-browser query filter simulator
    const results = currentTable.records.filter(r => {
      if (sqlQuery.includes('> 20000')) {
        return Number(r.balance) > 20000;
      }
      return true;
    });
    setSqlResults(results);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white select-none">
      {/* Access Ribbon */}
      <div className="bg-[#f3f2f1] border-b border-gray-300 p-2 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('data')}
            className={`px-3 py-1.5 rounded font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'data' ? 'bg-[#a4373a] text-white' : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300'
            }`}
          >
            <Table className="w-4 h-4" />
            <span>عرض البيانات (Datasheet)</span>
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`px-3 py-1.5 rounded font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'sql' ? 'bg-[#a4373a] text-white' : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>محرر استعلامات SQL</span>
          </button>
        </div>

        <button
          onClick={addRecord}
          className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded cursor-pointer shadow-xs text-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>إضافة سجل جديد</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Tables list */}
        <div className="w-48 bg-gray-50 border-l border-gray-200 p-3 space-y-1 shrink-0">
          <div className="text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-wider">جداول القاعدة</div>
          {tables.map(t => (
            <div
              key={t.id}
              onClick={() => setActiveTableId(t.id)}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded text-xs cursor-pointer font-bold transition ${
                activeTableId === t.id ? 'bg-[#a4373a] text-white' : 'hover:bg-gray-200 text-gray-700'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>{t.name}</span>
            </div>
          ))}
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-auto p-4">
          {activeTab === 'data' ? (
            <div className="border border-gray-300 rounded overflow-hidden shadow-xs">
              <table className="w-full text-right text-xs">
                <thead className="bg-[#f3f2f1] border-b border-gray-300 text-gray-700 font-bold">
                  <tr>
                    {currentTable?.fields.map(f => (
                      <th key={f.name} className="p-2.5 border-l border-gray-300">{f.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentTable?.records.map((rec, rIdx) => (
                    <tr key={rIdx} className="hover:bg-emerald-50/50">
                      {currentTable.fields.map(f => (
                        <td key={f.name} className="p-1 border-l border-gray-200">
                          <input
                            type="text"
                            value={rec[f.name] ?? ''}
                            onChange={e => updateRecordVal(rIdx, f.name, e.target.value)}
                            className="w-full px-2 py-1 bg-transparent hover:bg-white focus:bg-white rounded outline-none text-xs"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="space-y-4 max-w-3xl">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">استعلام SQL:</label>
                <div className="relative">
                  <textarea
                    value={sqlQuery}
                    onChange={e => setSqlQuery(e.target.value)}
                    rows={4}
                    className="w-full font-mono text-xs p-3 border border-gray-300 rounded bg-slate-900 text-emerald-400 outline-none"
                  />
                  <button
                    onClick={executeSQL}
                    className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-xs cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>تنفيذ (F5)</span>
                  </button>
                </div>
              </div>

              {sqlResults && (
                <div>
                  <h4 className="font-bold text-xs text-gray-800 mb-2">نتائج الاستعلام ({sqlResults.length} سجل):</h4>
                  <pre className="p-3 bg-gray-100 rounded border border-gray-200 text-xs overflow-auto font-mono text-gray-800 dir-ltr">
                    {JSON.stringify(sqlResults, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
