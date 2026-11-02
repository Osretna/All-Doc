import React, { useState } from 'react';
import { X, Network, Key, Plus, Trash2, ShieldCheck, AlertCircle, Check, ArrowRightLeft } from 'lucide-react';
import { DbTable } from '../../../types';
import { DbRelationship } from './types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tables: DbTable[];
  relationships: DbRelationship[];
  onUpdateRelationships: (rels: DbRelationship[]) => void;
}

export const RelationshipsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  tables,
  relationships,
  onUpdateRelationships,
}) => {
  if (!isOpen) return null;

  const [fromTable, setFromTable] = useState<string>(tables[0]?.name || '');
  const [fromField, setFromField] = useState<string>('');
  const [toTable, setToTable] = useState<string>(tables[1]?.name || tables[0]?.name || '');
  const [toField, setToField] = useState<string>('');
  const [relType, setRelType] = useState<DbRelationship['type']>('one-to-many');
  const [enforceIntegrity, setEnforceIntegrity] = useState<boolean>(true);
  const [cascadeUpdate, setCascadeUpdate] = useState<boolean>(true);
  const [cascadeDelete, setCascadeDelete] = useState<boolean>(false);
  const [validationResult, setValidationResult] = useState<string | null>(null);

  const selectedFromTableObj = tables.find(t => t.name === fromTable) || tables[0];
  const selectedToTableObj = tables.find(t => t.name === toTable) || tables[1] || tables[0];

  const handleAddRelationship = () => {
    if (!fromField || !toField) {
      alert('يرجى اختيار الحقلين المرتبطين لكلا الجدولين.');
      return;
    }

    const newRel: DbRelationship = {
      id: `rel_${Date.now()}`,
      name: `FK_${fromTable}_${toTable}`,
      fromTable,
      fromField,
      toTable,
      toField,
      type: relType,
      enforceIntegrity,
      cascadeUpdate,
      cascadeDelete,
    };

    const updated = [...relationships, newRel];
    onUpdateRelationships(updated);
    setValidationResult(`✓ تم إنشاء العلاقة بنجاح: [${fromTable}.${fromField}] ➔ [${toTable}.${toField}] مع فرض التكامل المرجعي.`);
  };

  const handleDeleteRelationship = (id: string) => {
    onUpdateRelationships(relationships.filter(r => r.id !== id));
    setValidationResult('تم حذف العلاقة بنجاح.');
  };

  const handleTestIntegrity = () => {
    // Validate records according to relationships
    const errors: string[] = [];
    relationships.forEach(rel => {
      const parent = tables.find(t => t.name === rel.fromTable);
      const child = tables.find(t => t.name === rel.toTable);
      if (parent && child && rel.enforceIntegrity) {
        const parentValues = new Set(parent.records.map(r => String(r[rel.fromField])));
        child.records.forEach(cRec => {
          const val = String(cRec[rel.toField] || '');
          if (val && !parentValues.has(val)) {
            errors.push(`انتهاك تكامل مرجعي: القيمة '${val}' في جدول ${child.label} غير موجودة في جدول ${parent.label}.`);
          }
        });
      }
    });

    if (errors.length > 0) {
      setValidationResult(`⚠ تم اكتشاف (${errors.length}) أخطاء في التكامل المرجعي:\n${errors.join('\n')}`);
    } else {
      setValidationResult('✓ فحص سليم 100%: جميع السجلات متطابقة ومتكاملة مرجعياً دون أي سجلات يتيمة (No Orphan Records).');
    }
  };

  return (
    <div className="fixed inset-0 z-[160] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4" dir="rtl">
      <div className="bg-[#f0f2f5] border border-gray-400 rounded-xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden text-xs">
        {/* Title Bar */}
        <div className="bg-[#a4373a] text-white px-5 py-3 flex items-center justify-between select-none shadow-xs">
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-amber-300" />
            <span className="font-bold text-sm">مخطط العلاقات العلائقية (Relationships Diagram) - Microsoft Access</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="bg-white border-b border-gray-300 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handleTestIntegrity}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-md font-bold transition cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>فحص التكامل المرجعي (Verify Integrity)</span>
            </button>
          </div>

          <div className="text-[11px] text-gray-500 font-medium">
            عدد العلاقات النشطة: {relationships.length}
          </div>
        </div>

        {/* Workspace: Graphical Cards of Tables + Active Relations */}
        <div className="flex-1 overflow-auto p-6 bg-slate-200/60 relative flex flex-col gap-6">
          {/* Visual Table Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tables.map(tbl => (
              <div key={tbl.id} className="bg-white rounded-xl shadow-md border border-gray-300 overflow-hidden">
                <div className="bg-[#a4373a] text-white p-2.5 font-bold flex items-center justify-between">
                  <span className="truncate">{tbl.label}</span>
                  <span className="text-[10px] bg-white/20 px-1.5 rounded">{tbl.name}</span>
                </div>
                <div className="divide-y divide-gray-100 max-h-56 overflow-y-auto">
                  {tbl.fields.map(f => (
                    <div key={f.name} className="p-2 flex items-center justify-between text-gray-700 hover:bg-slate-50">
                      <div className="flex items-center gap-1.5">
                        {f.primaryKey && <Key className="w-3.5 h-3.5 text-amber-500" />}
                        <span className={`font-mono ${f.primaryKey ? 'font-bold text-gray-900' : ''}`}>{f.label || f.name}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono">({f.type})</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Active Relationships Table */}
          <div className="bg-white rounded-xl shadow-md border border-gray-300 p-4">
            <h4 className="font-bold text-gray-900 text-sm mb-3">العلاقات العلائقية المعرفة حالياً:</h4>
            {relationships.length === 0 ? (
              <div className="text-gray-400 py-3 text-center">لا توجد علاقات معرفة بعد. يمكنك إنشاء علاقة جديدة بالأسفل.</div>
            ) : (
              <div className="divide-y divide-gray-200">
                {relationships.map(rel => (
                  <div key={rel.id} className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ArrowRightLeft className="w-4 h-4 text-[#a4373a]" />
                      <span className="font-bold text-gray-800">{rel.name}</span>:
                      <span className="bg-slate-100 px-2 py-0.5 rounded font-mono text-gray-700">{rel.fromTable}.{rel.fromField}</span>
                      <span>➔</span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded font-mono text-gray-700">{rel.toTable}.{rel.toField}</span>
                      <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded">
                        {rel.type === 'one-to-many' ? 'واحد إلى متعدد (1:M)' : 'واحد إلى واحد (1:1)'}
                      </span>
                      {rel.enforceIntegrity && (
                        <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded font-bold">
                          تكامل مرجعي مفعّل ✓
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteRelationship(rel.id)}
                      className="text-gray-400 hover:text-red-600 p-1"
                      title="حذف العلاقة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add New Relationship Form */}
          <div className="bg-white rounded-xl shadow-md border border-gray-300 p-4">
            <h4 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-[#a4373a]" />
              <span>إنشاء علاقة علائقية جديدة (Edit Relationship):</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-3">
              <div>
                <label className="block text-gray-600 mb-1 font-bold">الجدول الأساسي (Parent):</label>
                <select
                  value={fromTable}
                  onChange={(e) => {
                    setFromTable(e.target.value);
                    setFromField('');
                  }}
                  className="w-full bg-slate-50 border border-gray-300 rounded p-1.5 outline-none font-medium"
                >
                  {tables.map(t => (
                    <option key={t.id} value={t.name}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-600 mb-1 font-bold">حقل المفتاح الأساسي:</label>
                <select
                  value={fromField}
                  onChange={(e) => setFromField(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-300 rounded p-1.5 outline-none font-medium"
                >
                  <option value="">-- اختر الحقل --</option>
                  {selectedFromTableObj.fields.map(f => (
                    <option key={f.name} value={f.name}>{f.label || f.name} {f.primaryKey ? '(PK)' : ''}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-600 mb-1 font-bold">الجدول المرتبط (Child):</label>
                <select
                  value={toTable}
                  onChange={(e) => {
                    setToTable(e.target.value);
                    setToField('');
                  }}
                  className="w-full bg-slate-50 border border-gray-300 rounded p-1.5 outline-none font-medium"
                >
                  {tables.map(t => (
                    <option key={t.id} value={t.name}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-600 mb-1 font-bold">حقل المفتاح الخارجي:</label>
                <select
                  value={toField}
                  onChange={(e) => setToField(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-300 rounded p-1.5 outline-none font-medium"
                >
                  <option value="">-- اختر الحقل --</option>
                  {selectedToTableObj.fields.map(f => (
                    <option key={f.name} value={f.name}>{f.label || f.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 py-2 border-t border-gray-100">
              <label className="flex items-center gap-1.5 cursor-pointer font-bold text-gray-800">
                <input
                  type="checkbox"
                  checked={enforceIntegrity}
                  onChange={(e) => setEnforceIntegrity(e.target.checked)}
                  className="rounded text-[#a4373a]"
                />
                <span>فرض التكامل المرجعي (Enforce Referential Integrity)</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer text-gray-700">
                <input
                  type="checkbox"
                  checked={cascadeUpdate}
                  onChange={(e) => setCascadeUpdate(e.target.checked)}
                  className="rounded text-[#a4373a]"
                />
                <span>تحديث متتالي للحقول المرتبطة (Cascade Update)</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer text-gray-700">
                <input
                  type="checkbox"
                  checked={cascadeDelete}
                  onChange={(e) => setCascadeDelete(e.target.checked)}
                  className="rounded text-[#a4373a]"
                />
                <span>حذف متتالي للسجلات المرتبطة (Cascade Delete)</span>
              </label>
            </div>

            <div className="mt-3 flex justify-end">
              <button
                onClick={handleAddRelationship}
                className="px-4 py-2 bg-[#a4373a] hover:bg-[#832629] text-white font-bold rounded-lg shadow-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>حفظ وتطبيق العلاقة (Create Relationship)</span>
              </button>
            </div>
          </div>

          {/* Validation Result Box */}
          {validationResult && (
            <div className="bg-slate-900 text-white p-3 rounded-lg font-mono text-xs whitespace-pre-wrap">
              {validationResult}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-300 p-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg transition cursor-pointer"
          >
            إغلاق المخطط
          </button>
        </div>
      </div>
    </div>
  );
};
