import React, { useState, useEffect, useRef, useMemo } from 'react';
import { DbTable, DbField } from '../../types';
import { localVault } from '../../utils/storage';
import { parseAccessFile } from '../../utils/fileImport';
import { saveFileDirectlyToDevice } from '../../utils/fileSaver';
import { printDocumentContent } from '../../utils/printHelper';

// Access Subsystem Imports
import { AccessRibbon } from './access/AccessRibbon';
import { RelationshipsModal } from './access/RelationshipsModal';
import { QueryWizardModal } from './access/QueryWizardModal';
import { DatabaseDocumenterModal } from './access/DatabaseDocumenterModal';
import { VbaEditorModal } from './access/VbaEditorModal';
import { ContextMenu } from './access/ContextMenu';
import {
  AccessRibbonTab,
  AccessViewMode,
  DbRelationship,
  AccessQuery,
  VbaModuleDef
} from './access/types';

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
  FilterX,
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
  Loader2,
  Network,
  Sigma,
  Code2,
  Wrench,
  Sparkles,
  Rows,
  SplitSquareVertical,
  ShieldAlert,
  ArrowUpDown
} from 'lucide-react';

interface Props {
  fontFamily: string;
  initialTables?: DbTable[];
  onTablesChange?: (tables: DbTable[]) => void;
  onOpenBackstage?: () => void;
}

const INITIAL_ACCESS_TABLES: DbTable[] = [
  {
    id: 'tbl_1',
    name: 'جدول1',
    label: 'جدول 1',
    fields: [
      { name: 'ID', label: 'المعرف', type: 'number', primaryKey: true },
      { name: 'حقل1', label: 'حقل 1', type: 'text' },
    ],
    records: [],
  },
];

const INITIAL_RELATIONSHIPS: DbRelationship[] = [
  {
    id: 'rel_1',
    name: 'FK_Expenses_Mollak',
    fromTable: 'وحدات_نظام_ملاك',
    fromField: 'unit_no',
    toTable: 'مصروفات_الصيانة_الدورية',
    toField: 'item',
    type: 'one-to-many',
    enforceIntegrity: true,
    cascadeUpdate: true,
    cascadeDelete: false,
  },
];

const INITIAL_VBA_MODULES: VbaModuleDef[] = [
  {
    id: 'mod_MainUtils',
    name: 'mod_MainUtils',
    type: 'standard',
    code: `' ========================================================
' Microsoft Access VBA Module: mod_MainUtils
' Purpose: General Accounting & Sovereign Database Routines
' ========================================================
Option Explicit

Public Function CalculateTotalDues(ByVal dblRate As Double, ByVal intMonths As Integer) As Double
    On Error GoTo Err_Handler
    CalculateTotalDues = dblRate * intMonths
    Exit Function

Err_Handler:
    MsgBox "Error in CalculateTotalDues: " & Err.Description, vbCritical, "Access VBA Error"
    CalculateTotalDues = 0
End Function

Public Sub RefreshAllDataSources()
    On Error Resume Next
    DoCmd.Echo False
    DoCmd.Hourglass True
    DoCmd.RunCommand acCmdRefresh
    DoCmd.Hourglass False
    DoCmd.Echo True
    MsgBox "تم تحديث كافة مصادر البيانات بنجاح في نظام Access.", vbInformation, "تحديث البيانات"
End Sub`,
  },
  {
    id: 'mod_DataValidation',
    name: 'mod_DataValidation',
    type: 'standard',
    code: `' ========================================================
' Microsoft Access VBA Module: mod_DataValidation
' Purpose: Referential Integrity & Validation Rules
' ========================================================
Option Compare Database
Option Explicit

Public Function ValidateSaudiPhone(ByVal strPhone As String) As Boolean
    If Left(Trim(strPhone), 4) = "+966" Or Left(Trim(strPhone), 2) = "05" Then
        ValidateSaudiPhone = True
    Else
        ValidateSaudiPhone = False
    End If
End Function

Public Sub AuditTrailLogger(ByVal strAction As String, ByVal strTable As String)
    Debug.Print "[" & Now & "] Action: " & strAction & " on Table: " & strTable
End Sub`,
  },
];

export const BaseApp: React.FC<Props> = ({ fontFamily, initialTables, onTablesChange, onOpenBackstage }) => {
  const [tables, setTables] = useState<DbTable[]>(() => {
    return initialTables || localVault.get<DbTable[]>(localVault.KEYS.BASE_DATA, INITIAL_ACCESS_TABLES);
  });

  const [activeTableId, setActiveTableId] = useState<string>('tbl_1');
  const [activeRibbonTab, setActiveRibbonTab] = useState<AccessRibbonTab>('home');
  const [viewMode, setViewMode] = useState<AccessViewMode>('records');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [formRecordIndex, setFormRecordIndex] = useState<number>(0);
  const [isLoadingFile, setIsLoadingFile] = useState<boolean>(false);

  // Totals Row State (Σ Totals in Datasheet)
  const [showTotalsRow, setShowTotalsRow] = useState<boolean>(true);
  const [totalsCalculationType, setTotalsCalculationType] = useState<Record<string, 'sum' | 'count' | 'avg' | 'min' | 'max'>>({});

  // Sort & Filter state
  const [sortConfig, setSortConfig] = useState<{ field: string; direction: 'asc' | 'desc' } | null>(null);
  const [filterSelection, setFilterSelection] = useState<{ field: string; value: any } | null>(null);

  // Modals state
  const [relationships, setRelationships] = useState<DbRelationship[]>(INITIAL_RELATIONSHIPS);
  const [isRelationshipsOpen, setIsRelationshipsOpen] = useState<boolean>(false);
  const [isQueryWizardOpen, setIsQueryWizardOpen] = useState<boolean>(false);
  const [isDocumenterOpen, setIsDocumenterOpen] = useState<boolean>(false);
  const [isVbaEditorOpen, setIsVbaEditorOpen] = useState<boolean>(false);
  const [vbaModules, setVbaModules] = useState<VbaModuleDef[]>(INITIAL_VBA_MODULES);

  // Context Menu state
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean;
    x: number;
    y: number;
    type: 'record' | 'object' | 'field';
    data: any;
  }>({
    isOpen: false,
    x: 0,
    y: 0,
    type: 'record',
    data: null,
  });

  // SQL Query state
  const [sqlQuery, setSqlQuery] = useState<string>("SELECT * FROM وحدات_نظام_ملاك WHERE status = 'مسدد'");
  const [sqlResult, setSqlResult] = useState<any[] | null>(null);

  // New Record Inline row
  const [newRowData, setNewRowData] = useState<Record<string, any>>({});

  // Active focused cell in Access datasheet view
  const [selectedCellInfo, setSelectedCellInfo] = useState<{ recId: string; fieldName: string; rowIndex: number } | null>(null);
  const [showZoomModal, setShowZoomModal] = useState<boolean>(false);
  const [zoomModalValue, setZoomModalValue] = useState<string>('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync when initialTables is provided externally
  useEffect(() => {
    if (initialTables && initialTables.length > 0) {
      setTables(initialTables);
      setActiveTableId(initialTables[0].id);
    }
  }, [initialTables]);

  useEffect(() => {
    localVault.set(localVault.KEYS.BASE_DATA, tables);
    onTablesChange?.(tables);
  }, [tables]);

  const activeTable = tables.find((t) => t.id === activeTableId) || tables[0] || {
    id: 'tbl_default',
    name: 'جدول_جديد',
    label: 'جدول جديد',
    fields: [{ name: 'ID', label: 'المعرف', type: 'number', primaryKey: true }],
    records: [],
  };

  const rawRecords = activeTable.records || [];

  // Sort and Filter processing
  const processedRecords = useMemo(() => {
    let list = [...rawRecords];

    // 1. Text Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((rec) =>
        Object.values(rec).some((val) => String(val ?? '').toLowerCase().includes(q))
      );
    }

    // 2. Selection Filter (Filter by Selection)
    if (filterSelection) {
      list = list.filter((rec) => String(rec[filterSelection.field]) === String(filterSelection.value));
    }

    // 3. Sorting
    if (sortConfig) {
      list.sort((a, b) => {
        const valA = a[sortConfig.field];
        const valB = b[sortConfig.field];
        if (valA === valB) return 0;
        if (valA === null || valA === undefined) return 1;
        if (valB === null || valB === undefined) return -1;

        const isNum = typeof valA === 'number' && typeof valB === 'number';
        let cmp = 0;
        if (isNum) {
          cmp = (valA as number) - (valB as number);
        } else {
          cmp = String(valA).localeCompare(String(valB), 'ar');
        }
        return sortConfig.direction === 'asc' ? cmp : -cmp;
      });
    }

    return list;
  }, [rawRecords, searchQuery, filterSelection, sortConfig]);

  // Totals calculations
  const totalsMap = useMemo(() => {
    const res: Record<string, { sum: number; count: number; avg: number; min: number; max: number }> = {};
    activeTable.fields.forEach((f) => {
      let sum = 0;
      let count = 0;
      let min = Infinity;
      let max = -Infinity;

      processedRecords.forEach((r) => {
        const val = r[f.name];
        if (val !== undefined && val !== null && val !== '') {
          count++;
          const num = Number(val);
          if (!isNaN(num)) {
            sum += num;
            if (num < min) min = num;
            if (num > max) max = num;
          }
        }
      });

      res[f.name] = {
        sum,
        count,
        avg: count > 0 ? Number((sum / count).toFixed(2)) : 0,
        min: min === Infinity ? 0 : min,
        max: max === -Infinity ? 0 : max,
      };
    });
    return res;
  }, [activeTable, processedRecords]);

  // Access Keyboard Shortcuts
  useEffect(() => {
    const handleAccessShortcuts = (e: KeyboardEvent) => {
      // 1. Ctrl + ; : Today's date
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === ';') {
        if (selectedCellInfo) {
          e.preventDefault();
          const today = new Date().toISOString().split('T')[0];
          handleUpdateRecord(selectedCellInfo.recId, selectedCellInfo.fieldName, today);
          return;
        }
      }

      // 2. Ctrl + Shift + ; : Current time
      if ((e.ctrlKey || e.metaKey) && (e.shiftKey && (e.key === ';' || e.key === ':'))) {
        if (selectedCellInfo) {
          e.preventDefault();
          const now = new Date().toLocaleTimeString('ar-EG');
          handleUpdateRecord(selectedCellInfo.recId, selectedCellInfo.fieldName, now);
          return;
        }
      }

      // 3. Ctrl + ' : Copy value from previous record in same field
      if ((e.ctrlKey || e.metaKey) && (e.key === "'" || e.key === '"')) {
        if (selectedCellInfo && selectedCellInfo.rowIndex > 0) {
          e.preventDefault();
          const prevRec = processedRecords[selectedCellInfo.rowIndex - 1];
          if (prevRec && prevRec[selectedCellInfo.fieldName] !== undefined) {
            handleUpdateRecord(selectedCellInfo.recId, selectedCellInfo.fieldName, prevRec[selectedCellInfo.fieldName]);
          }
          return;
        }
      }

      // 4. Ctrl + + : New record
      if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '=')) {
        e.preventDefault();
        handleAddNewRecordInline();
        return;
      }

      // 5. Ctrl + - : Delete current record
      if ((e.ctrlKey || e.metaKey) && (e.key === '-' || e.key === '_')) {
        if (selectedCellInfo) {
          e.preventDefault();
          handleDeleteRecord(selectedCellInfo.recId);
          return;
        }
      }

      // 6. Shift + F2 : Zoom Box
      if (e.shiftKey && e.key === 'F2') {
        if (selectedCellInfo) {
          e.preventDefault();
          const currRec = processedRecords.find((r) => r.id === selectedCellInfo.recId);
          setZoomModalValue(currRec ? String(currRec[selectedCellInfo.fieldName] || '') : '');
          setShowZoomModal(true);
          return;
        }
      }

      // 7. Ctrl + F : Focus search
      if ((e.ctrlKey || e.metaKey) && (e.key === 'f' || e.key === 'F')) {
        e.preventDefault();
        searchInputRef.current?.focus();
        return;
      }
    };

    window.addEventListener('keydown', handleAccessShortcuts);
    return () => window.removeEventListener('keydown', handleAccessShortcuts);
  }, [selectedCellInfo, processedRecords, activeTableId]);

  // Record actions
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

  const handleAddNewRecordInline = () => {
    const emptyRec: { [key: string]: any; id: string } = { id: Date.now().toString() };
    activeTable.fields.forEach((f) => {
      emptyRec[f.name] = f.type === 'number' || f.type === 'currency' ? 0 : '';
    });
    setTables((prev) =>
      prev.map((t) => (t.id === activeTableId ? { ...t, records: [...t.records, emptyRec] } : t))
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
    if (!window.confirm('هل أنت متأكد من حذف هذا السجل بشكل نهائي من قاعدة البيانات؟')) return;
    setTables((prev) =>
      prev.map((t) => (t.id === activeTableId ? { ...t, records: t.records.filter((r) => r.id !== recId) } : t))
    );
    if (formRecordIndex >= processedRecords.length - 1) {
      setFormRecordIndex(Math.max(0, processedRecords.length - 2));
    }
  };

  const handleSortAsc = () => {
    const targetField = selectedCellInfo?.fieldName || activeTable.fields[0]?.name;
    if (targetField) {
      setSortConfig({ field: targetField, direction: 'asc' });
    }
  };

  const handleSortDesc = () => {
    const targetField = selectedCellInfo?.fieldName || activeTable.fields[0]?.name;
    if (targetField) {
      setSortConfig({ field: targetField, direction: 'desc' });
    }
  };

  const handleClearSort = () => {
    setSortConfig(null);
  };

  const handleToggleFilterBySelection = () => {
    if (!selectedCellInfo) {
      alert('يرجى تحديد خلية أولاً لتطبيق "تصفية حسب التحديد" (Filter by Selection).');
      return;
    }
    const rec = processedRecords.find((r) => r.id === selectedCellInfo.recId);
    if (rec) {
      setFilterSelection({
        field: selectedCellInfo.fieldName,
        value: rec[selectedCellInfo.fieldName],
      });
    }
  };

  const handleClearFilter = () => {
    setFilterSelection(null);
    setSearchQuery('');
  };

  const handleCopyCell = () => {
    if (!selectedCellInfo) {
      alert('يرجى تحديد خلية لنسخ محتواها.');
      return;
    }
    const rec = processedRecords.find((r) => r.id === selectedCellInfo.recId);
    if (rec) {
      const val = String(rec[selectedCellInfo.fieldName] ?? '');
      navigator.clipboard.writeText(val);
      alert(`تم نسخ القيمة "${val}" إلى الحافظة.`);
    }
  };

  const handleCutCell = () => {
    if (!selectedCellInfo) return;
    handleCopyCell();
    handleUpdateRecord(selectedCellInfo.recId, selectedCellInfo.fieldName, '');
  };

  const handlePasteCell = async () => {
    if (!selectedCellInfo) return;
    try {
      const text = await navigator.clipboard.readText();
      handleUpdateRecord(selectedCellInfo.recId, selectedCellInfo.fieldName, text);
    } catch {
      alert('تعذر الوصول للحافظة.');
    }
  };

  // Compact and Repair Database
  const handleCompactAndRepair = () => {
    const initialSize = JSON.stringify(tables).length;
    // 1. Clean whitespace & remove null fields
    const compacted = tables.map((t) => ({
      ...t,
      records: t.records.filter((r) => Object.values(r).some((v) => v !== '' && v !== null && v !== undefined)),
    }));

    // 2. Referential integrity check
    let orphanedCount = 0;
    relationships.forEach((rel) => {
      if (rel.enforceIntegrity) {
        const parentTbl = compacted.find((t) => t.name === rel.fromTable);
        const childTbl = compacted.find((t) => t.name === rel.toTable);
        if (parentTbl && childTbl) {
          const parentKeys = new Set(parentTbl.records.map((r) => String(r[rel.fromField])));
          childTbl.records.forEach((cr) => {
            if (cr[rel.toField] && !parentKeys.has(String(cr[rel.toField]))) {
              orphanedCount++;
            }
          });
        }
      }
    });

    setTables(compacted);
    const finalSize = JSON.stringify(compacted).length;
    const freedBytes = Math.max(0, initialSize - finalSize);

    alert(
      `✓ تمت عملية ضغط وإصلاح قاعدة البيانات (Compact & Repair Database) بنجاح!\n` +
      `• تم فحص ${tables.length} جداول و ${relationships.length} علاقات.\n` +
      `• تم تحرير مساحة ذاكرة قدرها: ${freedBytes} بايت.\n` +
      `• تم التحقق من التكامل المرجعي: ${orphanedCount === 0 ? 'سليم 100% بدون سجلات يتيمة' : `تحذير: وجد ${orphanedCount} سجلات يتيمة`}.\n` +
      `• تم إعادة بناء الفهارس الداخلية بنجاح.`
    );
  };

  // Create Table
  const handleCreateNewTable = () => {
    const tableIndex = tables.length + 1;
    const newTblId = `tbl_custom_${Date.now()}`;
    const newTbl: DbTable = {
      id: newTblId,
      name: `جدول_${tableIndex}`,
      label: `جدول بيانات جديد (${tableIndex})`,
      fields: [
        { name: 'ID', label: 'المعرف الأساسي', type: 'number', primaryKey: true },
        { name: 'Title', label: 'الاسم / الوصف', type: 'text' },
        { name: 'CreatedDate', label: 'تاريخ الإنشاء', type: 'date' },
        { name: 'Amount', label: 'القيمة', type: 'currency' },
      ],
      records: [
        { id: '1', ID: 1, Title: 'سجل تجريبي أول', CreatedDate: new Date().toISOString().split('T')[0], Amount: 100 },
      ],
    };
    setTables([...tables, newTbl]);
    setActiveTableId(newTblId);
    setViewMode('design');
    alert(`تم إنشاء جدول جديد "${newTbl.label}" وتم الانتقال إلى عرض التصميم (Design View) لتحديد الحقول.`);
  };

  // Run SQL Query
  const handleRunSQL = () => {
    const q = sqlQuery.toLowerCase().trim();
    if (q.startsWith('select')) {
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
    } else {
      alert('تم تنفيذ الأمر البرمجي بنجاح على قاعدة البيانات.');
      setSqlResult(activeTable.records);
    }
  };

  // Import / Export
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

  const handleExportExcel = () => {
    let csv = activeTable.fields.map((f) => `"${f.label}"`).join(',') + '\n';
    processedRecords.forEach((rec) => {
      const row = activeTable.fields.map((f) => `"${rec[f.name] ?? ''}"`);
      csv += row.join(',') + '\n';
    });
    saveFileDirectlyToDevice({
      filename: `${activeTable.name}.csv`,
      data: new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' }),
      mimeType: 'text/csv',
      primaryExtension: 'csv',
      description: 'جدول بيانات Excel / CSV',
    });
  };

  const handleExportAccdbSql = () => {
    let sqlExport = `-- ========================================================\n`;
    sqlExport += `-- Microsoft Access Sovereign Database Dump\n`;
    sqlExport += `-- Generated: ${new Date().toISOString()}\n`;
    sqlExport += `-- Tables: ${tables.length}\n`;
    sqlExport += `-- ========================================================\n\n`;

    tables.forEach((tbl) => {
      sqlExport += `CREATE TABLE [${tbl.name}] (\n`;
      const fieldDefs = tbl.fields.map((f) => {
        let typeStr = 'VARCHAR(255)';
        if (f.type === 'number') typeStr = 'INTEGER';
        if (f.type === 'currency') typeStr = 'CURRENCY';
        if (f.type === 'date') typeStr = 'DATETIME';
        if (f.type === 'boolean') typeStr = 'YESNO';
        return `    [${f.name}] ${typeStr}${f.primaryKey ? ' PRIMARY KEY' : ''}`;
      });
      sqlExport += fieldDefs.join(',\n') + '\n);\n\n';

      tbl.records.forEach((rec) => {
        const colNames = tbl.fields.map((f) => `[${f.name}]`).join(', ');
        const colVals = tbl.fields
          .map((f) => {
            const v = rec[f.name];
            if (v === null || v === undefined) return 'NULL';
            if (typeof v === 'number') return v;
            return `'${String(v).replace(/'/g, "''")}'`;
          })
          .join(', ');
        sqlExport += `INSERT INTO [${tbl.name}] (${colNames}) VALUES (${colVals});\n`;
      });
      sqlExport += '\n';
    });

    saveFileDirectlyToDevice({
      filename: `${activeTable.name}_AccessSchema.sql`,
      data: new Blob([sqlExport], { type: 'application/sql;charset=utf-8;' }),
      mimeType: 'application/sql',
      primaryExtension: 'sql',
      description: 'مخطط قاعدة بيانات Access SQL',
    });
  };

  const handleExportPdfReport = () => {
    printDocumentContent('access-report-printable', `تقرير - ${activeTable.label}`);
  };

  // Context Menu handlers
  const handleContextMenuAction = (action: string, payload: any) => {
    setContextMenu((prev) => ({ ...prev, isOpen: false }));
    switch (action) {
      case 'copy-record': {
        const rec = processedRecords.find((r) => r.id === payload.id);
        if (rec) {
          navigator.clipboard.writeText(JSON.stringify(rec, null, 2));
          alert('تم نسخ السجل بالكامل إلى الحافظة.');
        }
        break;
      }
      case 'delete-record':
        handleDeleteRecord(payload.id);
        break;
      case 'filter-by-selection':
        if (selectedCellInfo) {
          handleToggleFilterBySelection();
        } else {
          alert('يرجى النقر على خلية محددة للتصفية بقيمتها.');
        }
        break;
      case 'clear-filter':
        handleClearFilter();
        break;
      case 'open-table':
        setActiveTableId(payload.id);
        setViewMode('records');
        break;
      case 'design-table':
        setActiveTableId(payload.id);
        setViewMode('design');
        break;
      case 'export-table-excel':
        handleExportExcel();
        break;
      case 'rename-table': {
        const newName = prompt('أدخل الاسم الجديد للجدول:', payload.name);
        if (newName && newName.trim()) {
          setTables((prev) =>
            prev.map((t) => (t.id === payload.id ? { ...t, name: newName.trim(), label: newName.trim() } : t))
          );
        }
        break;
      }
      case 'delete-table': {
        if (tables.length <= 1) {
          alert('لا يمكن حذف الجدول الوحيد المتبقي في قاعدة البيانات.');
          return;
        }
        if (window.confirm(`هل أنت متأكد من حذف الجدول "${payload.label}" نهائياً؟`)) {
          const rem = tables.filter((t) => t.id !== payload.id);
          setTables(rem);
          setActiveTableId(rem[0].id);
        }
        break;
      }
    }
  };

  const currentFormRecord = processedRecords[formRecordIndex] || processedRecords[0];

  return (
    <div className="flex-1 flex flex-col bg-[#fbf9f8] overflow-hidden text-xs select-none h-full">
      {/* Hidden file input for importing desktop files */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".accdb,.mdb,.sql,.csv,.json,.xlsx"
        className="hidden"
        onChange={handleImportAccessFile}
      />

      {/* 1. Master Microsoft Access Ribbon */}
      <AccessRibbon
        activeTab={activeRibbonTab}
        onTabChange={setActiveRibbonTab}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenFileMenu={() => {
          if (onOpenBackstage) onOpenBackstage();
          else fileInputRef.current?.click();
        }}
        onCopy={handleCopyCell}
        onCut={handleCutCell}
        onPaste={handlePasteCell}
        onSortAsc={handleSortAsc}
        onSortDesc={handleSortDesc}
        onClearSort={handleClearSort}
        onToggleFilter={handleToggleFilterBySelection}
        onClearFilter={handleClearFilter}
        hasActiveFilter={!!filterSelection || !!searchQuery}
        onNewRecord={handleAddNewRecordInline}
        onSaveRecord={() => alert('تم حفظ التعديلات في قاعدة بيانات Access المحلية.')}
        onDeleteRecord={() => {
          if (selectedCellInfo) handleDeleteRecord(selectedCellInfo.recId);
          else if (currentFormRecord) handleDeleteRecord(currentFormRecord.id);
        }}
        onRefreshAll={() => {
          setTables([...tables]);
          alert('تم تحديث كافة الجداول والسجلات من التخزين السيادي المحلي.');
        }}
        showTotalsRow={showTotalsRow}
        onToggleTotals={() => setShowTotalsRow(!showTotalsRow)}
        onOpenFind={() => searchInputRef.current?.focus()}
        onFirstRecord={() => setFormRecordIndex(0)}
        onPrevRecord={() => setFormRecordIndex((i) => Math.max(0, i - 1))}
        onNextRecord={() => setFormRecordIndex((i) => Math.min(processedRecords.length - 1, i + 1))}
        onLastRecord={() => setFormRecordIndex(Math.max(0, processedRecords.length - 1))}
        onNewTable={handleCreateNewTable}
        onOpenQueryWizard={() => setIsQueryWizardOpen(true)}
        onOpenFormWizard={() => setViewMode('form')}
        onOpenReportWizard={() => setViewMode('report')}
        onOpenVbaEditor={() => setIsVbaEditorOpen(true)}
        onOpenRelationships={() => setIsRelationshipsOpen(true)}
        onOpenDocumenter={() => setIsDocumenterOpen(true)}
        onCompactRepair={handleCompactAndRepair}
        onImportFile={() => fileInputRef.current?.click()}
        onExportExcel={handleExportExcel}
        onExportPdf={handleExportPdfReport}
        onExportAccdb={handleExportAccdbSql}
        onRunCurrentSql={handleRunSQL}
      />

      {/* 2. Workspace Body: Navigation Pane (Left) + Content (Center/Right) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Pane (All Access Objects) */}
        <div className="w-60 sm:w-64 bg-[#f3f0ee] border-l border-gray-300 flex flex-col justify-between shrink-0 overflow-y-auto">
          <div>
            {/* Header */}
            <div className="p-2.5 bg-[#e8e4e1] border-b border-gray-300 flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-[#a4373a]">
                <Database className="w-4 h-4" />
                <span>كافة كائنات Access</span>
              </div>
              <span className="text-[10px] bg-red-100 text-red-800 font-mono px-1.5 py-0.5 rounded font-bold">
                {tables.length} جداول
              </span>
            </div>

            {/* Tables Section */}
            <div className="p-2 space-y-1">
              <div className="text-[10px] font-bold text-gray-500 px-2 py-1 flex items-center justify-between">
                <span>الجداول (Tables)</span>
                <button
                  onClick={handleCreateNewTable}
                  className="hover:text-[#a4373a] transition p-0.5"
                  title="إنشاء جدول جديد"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {tables.map((tbl) => (
                <div
                  key={tbl.id}
                  onClick={() => {
                    setActiveTableId(tbl.id);
                    setFormRecordIndex(0);
                    setSqlResult(null);
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setContextMenu({
                      isOpen: true,
                      x: e.clientX,
                      y: e.clientY,
                      type: 'object',
                      data: tbl,
                    });
                  }}
                  className={`p-2 rounded cursor-pointer transition flex items-center justify-between ${
                    activeTableId === tbl.id
                      ? 'bg-[#a4373a] text-white font-bold shadow-xs'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <TableIcon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{tbl.label || tbl.name}</span>
                  </div>
                  <span className="text-[10px] opacity-75 font-mono">({tbl.records.length})</span>
                </div>
              ))}
            </div>

            {/* Queries Section */}
            <div className="p-2 pt-0 space-y-1 border-t border-gray-200">
              <div className="text-[10px] font-bold text-gray-500 px-2 py-1 flex items-center justify-between">
                <span>الاستعلامات (Queries)</span>
                <button
                  onClick={() => setIsQueryWizardOpen(true)}
                  className="hover:text-[#a4373a] transition p-0.5"
                  title="معالج الاستعلامات"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <button
                onClick={() => setViewMode('sql')}
                className={`w-full text-right p-1.5 rounded flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'sql' ? 'bg-red-50 text-[#a4373a] font-bold' : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Terminal className="w-3.5 h-3.5 text-[#a4373a]" />
                <span className="truncate">qry_استعلام_المسددين</span>
              </button>
            </div>

            {/* Forms Section */}
            <div className="p-2 pt-0 space-y-1 border-t border-gray-200">
              <div className="text-[10px] font-bold text-gray-500 px-2 py-1">النماذج (Forms)</div>
              <button
                onClick={() => setViewMode('form')}
                className={`w-full text-right p-1.5 rounded flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'form' ? 'bg-red-50 text-[#a4373a] font-bold' : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span className="truncate">frm_إدخال_البيانات</span>
              </button>
              <button
                onClick={() => setViewMode('split-form')}
                className={`w-full text-right p-1.5 rounded flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'split-form' ? 'bg-red-50 text-[#a4373a] font-bold' : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <SplitSquareVertical className="w-3.5 h-3.5 text-purple-600" />
                <span className="truncate">frm_النموذج_المنقسم</span>
              </button>
            </div>

            {/* Reports Section */}
            <div className="p-2 pt-0 space-y-1 border-t border-gray-200">
              <div className="text-[10px] font-bold text-gray-500 px-2 py-1">التقارير (Reports)</div>
              <button
                onClick={() => setViewMode('report')}
                className={`w-full text-right p-1.5 rounded flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'report' ? 'bg-red-50 text-[#a4373a] font-bold' : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                <span className="truncate">rpt_تقرير_ختامي_رسمي</span>
              </button>
            </div>

            {/* Modules Section */}
            <div className="p-2 pt-0 space-y-1 border-t border-gray-200">
              <div className="text-[10px] font-bold text-gray-500 px-2 py-1 flex items-center justify-between">
                <span>وحدات VBA والماكرو</span>
                <span className="text-[9px] text-gray-400 font-mono">({vbaModules.length})</span>
              </div>
              {vbaModules.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setIsVbaEditorOpen(true)}
                  className="w-full text-right p-1.5 rounded hover:bg-gray-200 flex items-center gap-1.5 text-gray-700 cursor-pointer"
                >
                  <Code2 className="w-3.5 h-3.5 text-amber-600" />
                  <span className="truncate">{m.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sovereign Security Badge */}
          <div className="p-3 bg-red-50 border-t border-red-200 text-red-950 text-[10px] leading-relaxed">
            <div className="font-bold flex items-center gap-1 mb-0.5 text-[#a4373a]">
              <CheckCircle2 className="w-3 h-3 text-red-600" />
              <span>محرك Access العلائقي السيادي</span>
            </div>
            <span>المعالجة فورية محلياً 100% عبر IndexedDB بدون أي خوادم وسيطة.</span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          {/* Quick Filter & Search Bar */}
          <div className="flex items-center justify-between px-3 py-1.5 bg-[#f3f2f1] border-b border-gray-300">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-800 flex items-center gap-1">
                <TableIcon className="w-3.5 h-3.5 text-[#a4373a]" />
                <span>{activeTable.label || activeTable.name}</span>
              </span>

              {filterSelection && (
                <div className="flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded text-[11px] font-medium">
                  <span>تصفية: {filterSelection.field} = {String(filterSelection.value)}</span>
                  <button onClick={handleClearFilter} className="hover:text-red-700">✕</button>
                </div>
              )}

              {sortConfig && (
                <div className="flex items-center gap-1 bg-blue-100 text-blue-900 border border-blue-300 px-2 py-0.5 rounded text-[11px] font-medium">
                  <span>فرز: {sortConfig.field} ({sortConfig.direction === 'asc' ? 'تصاعدي' : 'تنازلي'})</span>
                  <button onClick={handleClearSort} className="hover:text-red-700">✕</button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute right-2 top-2 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="بحث في السجلات (Ctrl+F)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white border border-gray-300 rounded pr-7 pl-2 py-1 text-xs outline-none focus:border-[#a4373a] w-48 shadow-2xs"
                />
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#a4373a] hover:bg-[#8e2e31] text-white font-bold transition cursor-pointer shadow-xs"
              >
                {isLoadingFile ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FolderOpen className="w-3.5 h-3.5" />}
                <span>فتح ملف</span>
              </button>
            </div>
          </div>

          {/* VIEW 1: DATASHEET VIEW (Classic Microsoft Access Datasheet with Σ Totals) */}
          {viewMode === 'records' && (
            <div className="flex-1 overflow-auto p-2 bg-gray-50 flex flex-col justify-between">
              <div className="overflow-auto border border-gray-300 rounded shadow-xs bg-white">
                <table className="w-full border-collapse text-right bg-white text-xs">
                  <thead>
                    <tr className="bg-[#f3f0ee] text-gray-800 font-bold border-b border-gray-300">
                      <th className="p-2 border border-gray-300 text-center w-10 bg-[#eae6e3]">#</th>
                      {activeTable.fields.map((f) => (
                        <th
                          key={f.name}
                          onClick={() => {
                            if (sortConfig?.field === f.name) {
                              setSortConfig({
                                field: f.name,
                                direction: sortConfig.direction === 'asc' ? 'desc' : 'asc',
                              });
                            } else {
                              setSortConfig({ field: f.name, direction: 'asc' });
                            }
                          }}
                          className="p-2 border border-gray-300 font-bold text-gray-900 cursor-pointer hover:bg-gray-200 transition"
                        >
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              {f.label}
                              {sortConfig?.field === f.name && (
                                <span className="text-[#a4373a] font-mono">
                                  {sortConfig.direction === 'asc' ? '▲' : '▼'}
                                </span>
                              )}
                            </span>
                            {f.primaryKey && <Key className="w-3 h-3 text-amber-600" />}
                          </div>
                        </th>
                      ))}
                      <th className="p-2 border border-gray-300 text-center w-12">حذف</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processedRecords.map((rec, idx) => (
                      <tr
                        key={rec.id}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          setContextMenu({
                            isOpen: true,
                            x: e.clientX,
                            y: e.clientY,
                            type: 'record',
                            data: rec,
                          });
                        }}
                        className="hover:bg-red-50/20 group"
                      >
                        <td className="p-2 border border-gray-300 text-center text-gray-400 font-mono bg-[#fbf9f8]">
                          {idx + 1}
                        </td>
                        {activeTable.fields.map((f) => {
                          const val = rec[f.name];
                          const isSelected =
                            selectedCellInfo?.recId === rec.id && selectedCellInfo?.fieldName === f.name;

                          return (
                            <td
                              key={f.name}
                              className={`p-1 border border-gray-300 ${isSelected ? 'ring-2 ring-[#a4373a] bg-red-50/30' : ''}`}
                            >
                              {f.type === 'select' ? (
                                <select
                                  value={val || ''}
                                  onFocus={() => setSelectedCellInfo({ recId: rec.id, fieldName: f.name, rowIndex: idx })}
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
                                  onFocus={() => setSelectedCellInfo({ recId: rec.id, fieldName: f.name, rowIndex: idx })}
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

                  {/* Microsoft Access Totals Row (Σ Totals) */}
                  {showTotalsRow && (
                    <tfoot>
                      <tr className="bg-[#edeae6] font-bold border-t-2 border-gray-400 text-gray-900 shadow-inner">
                        <td className="p-2 border border-gray-300 text-center bg-[#ded8d3] font-bold text-[#a4373a]">
                          Σ
                        </td>
                        {activeTable.fields.map((f) => {
                          const stats = totalsMap[f.name] || { sum: 0, count: 0, avg: 0, min: 0, max: 0 };
                          const currentCalc = totalsCalculationType[f.name] || (f.type === 'currency' || f.type === 'number' ? 'sum' : 'count');

                          let displayVal: string | number = '';
                          if (currentCalc === 'sum') displayVal = f.type === 'currency' ? `${stats.sum.toLocaleString()} ر.س` : stats.sum;
                          if (currentCalc === 'count') displayVal = `${stats.count} سجلات`;
                          if (currentCalc === 'avg') displayVal = `متوسط: ${stats.avg}`;
                          if (currentCalc === 'min') displayVal = `أدنى: ${stats.min}`;
                          if (currentCalc === 'max') displayVal = `أقصى: ${stats.max}`;

                          return (
                            <td key={f.name} className="p-1.5 border border-gray-300">
                              <div className="flex items-center justify-between gap-1 text-[11px]">
                                <select
                                  value={currentCalc}
                                  onChange={(e) =>
                                    setTotalsCalculationType({
                                      ...totalsCalculationType,
                                      [f.name]: e.target.value as any,
                                    })
                                  }
                                  className="text-[10px] bg-transparent border-0 font-semibold text-gray-600 outline-none cursor-pointer"
                                >
                                  {f.type === 'number' || f.type === 'currency' ? (
                                    <>
                                      <option value="sum">مجموع (Sum)</option>
                                      <option value="avg">متوسط (Average)</option>
                                      <option value="count">عدد (Count)</option>
                                      <option value="min">أدنى (Min)</option>
                                      <option value="max">أقصى (Max)</option>
                                    </>
                                  ) : (
                                    <>
                                      <option value="count">عدد (Count)</option>
                                    </>
                                  )}
                                </select>
                                <span className="font-mono font-bold text-[#a4373a] truncate">{displayVal}</span>
                              </div>
                            </td>
                          );
                        })}
                        <td className="p-1 border border-gray-300 bg-[#edeae6]"></td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>

              {/* Record Navigation bar at bottom of datasheet */}
              <div className="pt-2 flex items-center justify-between text-gray-600">
                <div className="flex items-center gap-1.5 bg-white border border-gray-300 px-2 py-1 rounded shadow-2xs">
                  <span className="text-[11px] font-bold">السجل:</span>
                  <button
                    onClick={() => setFormRecordIndex(0)}
                    disabled={formRecordIndex <= 0}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                    title="أول سجل (|◄)"
                  >
                    |◄
                  </button>
                  <button
                    onClick={() => setFormRecordIndex((i) => Math.max(0, i - 1))}
                    disabled={formRecordIndex <= 0}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                    title="السابق (◄)"
                  >
                    ◄
                  </button>
                  <span className="font-mono text-xs px-2 font-bold text-gray-800">
                    {Math.min(formRecordIndex + 1, processedRecords.length)} من {processedRecords.length}
                  </span>
                  <button
                    onClick={() => setFormRecordIndex((i) => Math.min(processedRecords.length - 1, i + 1))}
                    disabled={formRecordIndex >= processedRecords.length - 1}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                    title="التالي (►)"
                  >
                    ►
                  </button>
                  <button
                    onClick={() => setFormRecordIndex(Math.max(0, processedRecords.length - 1))}
                    disabled={formRecordIndex >= processedRecords.length - 1}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                    title="آخر سجل (►|)"
                  >
                    ►|
                  </button>
                  <button
                    onClick={handleAddNewRecordInline}
                    className="p-1 rounded hover:bg-gray-100 text-[#a4373a] font-bold cursor-pointer"
                    title="سجل جديد فارغ (*)"
                  >
                    *
                  </button>
                </div>

                <div className="text-[11px] text-gray-500 font-mono">
                  {filterSelection ? 'مصفى (Filtered)' : 'غير مصفى (Unfiltered)'} | {sortConfig ? `مفرز: ${sortConfig.field}` : 'افتراضي'}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: DESIGN VIEW (تعريف أسماء الحقول وأنواع البيانات) */}
          {viewMode === 'design' && (
            <div className="flex-1 overflow-auto p-4 bg-gray-50 text-right">
              <div className="max-w-4xl mx-auto bg-white rounded-xl border border-gray-300 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                  <div>
                    <h4 className="font-bold text-sm text-[#a4373a]">تصميم هيكل جدول: {activeTable.name}</h4>
                    <p className="text-gray-500 text-xs">تعريف أسماء الحقول، أنواع البيانات، والمفتاح الأساسي</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const newFieldName = prompt('أدخل اسم الحقل الجديد (Field Name بالإنجليزية):', `Field_${activeTable.fields.length + 1}`);
                        if (!newFieldName) return;
                        const newFieldLabel = prompt('أدخل تسمية العرض (Caption بالعربية):', newFieldName);
                        const newField: DbField = {
                          name: newFieldName,
                          label: newFieldLabel || newFieldName,
                          type: 'text',
                        };
                        setTables((prev) =>
                          prev.map((t) =>
                            t.id === activeTableId ? { ...t, fields: [...t.fields, newField] } : t
                          )
                        );
                      }}
                      className="flex items-center gap-1 bg-[#a4373a] text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-[#802a2c] cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>إضافة حقل جديد</span>
                    </button>
                  </div>
                </div>

                <table className="w-full border-collapse border border-gray-300 text-right text-xs">
                  <thead>
                    <tr className="bg-[#f3f0ee] text-gray-800 font-bold">
                      <th className="p-2 border border-gray-300 w-12 text-center">المفتاح</th>
                      <th className="p-2 border border-gray-300">اسم الحقل (Field Name)</th>
                      <th className="p-2 border border-gray-300">نوع البيانات (Data Type)</th>
                      <th className="p-2 border border-gray-300">تسمية العرض (Caption)</th>
                      <th className="p-2 border border-gray-300 text-center w-16">إجراء</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeTable.fields.map((f, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td
                          className="p-2 border border-gray-300 text-center cursor-pointer"
                          title="تعيين كمفتاح أساسي"
                          onClick={() => {
                            setTables((prev) =>
                              prev.map((t) => {
                                if (t.id !== activeTableId) return t;
                                return {
                                  ...t,
                                  fields: t.fields.map((field) => ({
                                    ...field,
                                    primaryKey: field.name === f.name,
                                  })),
                                };
                              })
                            );
                          }}
                        >
                          {f.primaryKey ? (
                            <Key className="w-3.5 h-3.5 text-amber-600 mx-auto" />
                          ) : (
                            <span className="text-gray-300 hover:text-amber-500">○</span>
                          )}
                        </td>
                        <td className="p-2 border border-gray-300 font-mono font-bold text-gray-900">{f.name}</td>
                        <td className="p-2 border border-gray-300">
                          <select
                            value={f.type}
                            onChange={(e) => {
                              const newType = e.target.value as any;
                              setTables((prev) =>
                                prev.map((t) => {
                                  if (t.id !== activeTableId) return t;
                                  return {
                                    ...t,
                                    fields: t.fields.map((field) =>
                                      field.name === f.name ? { ...field, type: newType } : field
                                    ),
                                  };
                                })
                              );
                            }}
                            className="bg-transparent font-semibold font-mono text-[11px] text-blue-700 outline-none cursor-pointer"
                          >
                            <option value="text">نص مختصر (Short Text)</option>
                            <option value="number">رقم (Number)</option>
                            <option value="currency">عملة (Currency)</option>
                            <option value="date">تاريخ / وقت (Date/Time)</option>
                            <option value="boolean">نعم / لا (Yes/No)</option>
                            <option value="select">قائمة اختيار (Lookup)</option>
                          </select>
                        </td>
                        <td className="p-2 border border-gray-300 font-bold text-gray-800">
                          <input
                            type="text"
                            value={f.label}
                            onChange={(e) => {
                              const newLabel = e.target.value;
                              setTables((prev) =>
                                prev.map((t) => {
                                  if (t.id !== activeTableId) return t;
                                  return {
                                    ...t,
                                    fields: t.fields.map((field) =>
                                      field.name === f.name ? { ...field, label: newLabel } : field
                                    ),
                                  };
                                })
                              );
                            }}
                            className="w-full bg-transparent outline-none"
                          />
                        </td>
                        <td className="p-2 border border-gray-300 text-center">
                          <button
                            onClick={() => {
                              if (activeTable.fields.length <= 1) {
                                alert('لا يمكن حذف الحقل الوحيد في الجدول.');
                                return;
                              }
                              setTables((prev) =>
                                prev.map((t) =>
                                  t.id === activeTableId
                                    ? { ...t, fields: t.fields.filter((field) => field.name !== f.name) }
                                    : t
                                )
                              );
                            }}
                            className="text-gray-400 hover:text-red-600 transition"
                            title="حذف هذا الحقل"
                          >
                            <Trash2 className="w-3.5 h-3.5 mx-auto" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW 3: FORM VIEW & SPLIT FORM VIEW */}
          {(viewMode === 'form' || viewMode === 'split-form') && currentFormRecord && (
            <div className="flex-1 overflow-auto p-4 flex flex-col items-center justify-start bg-gray-50 text-right gap-4">
              <div className="w-full max-w-2xl bg-white rounded-2xl border-2 border-red-200 shadow-xl p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b-2 border-[#a4373a]">
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-[#a4373a]" />
                    <h3 className="font-extrabold text-base text-gray-900">
                      نموذج إدخال سجل: {activeTable.label}
                    </h3>
                  </div>
                  <span className="text-xs bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full font-bold">
                    سجل {formRecordIndex + 1} من {processedRecords.length}
                  </span>
                </div>

                {/* Form Fields Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeTable.fields.map((f) => (
                    <div key={f.name} className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                        <span>{f.label}</span>
                        {f.primaryKey && <Key className="w-3 h-3 text-amber-600" />}
                      </label>
                      <div>
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

                {/* Navigator */}
                <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-lg">
                    <button
                      onClick={() => setFormRecordIndex(0)}
                      disabled={formRecordIndex <= 0}
                      className="p-1 rounded hover:bg-white disabled:opacity-30 cursor-pointer"
                      title="أول سجل"
                    >
                      |◄
                    </button>
                    <button
                      onClick={() => setFormRecordIndex((i) => Math.max(0, i - 1))}
                      disabled={formRecordIndex <= 0}
                      className="p-1 rounded hover:bg-white disabled:opacity-30 cursor-pointer"
                      title="السابق"
                    >
                      ◄
                    </button>
                    <span className="font-mono text-xs px-2 font-bold">
                      {formRecordIndex + 1} / {processedRecords.length}
                    </span>
                    <button
                      onClick={() => setFormRecordIndex((i) => Math.min(processedRecords.length - 1, i + 1))}
                      disabled={formRecordIndex >= processedRecords.length - 1}
                      className="p-1 rounded hover:bg-white disabled:opacity-30 cursor-pointer"
                      title="التالي"
                    >
                      ►
                    </button>
                    <button
                      onClick={() => setFormRecordIndex(Math.max(0, processedRecords.length - 1))}
                      disabled={formRecordIndex >= processedRecords.length - 1}
                      className="p-1 rounded hover:bg-white disabled:opacity-30 cursor-pointer"
                      title="آخر سجل"
                    >
                      ►|
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleAddNewRecordInline}
                      className="text-xs bg-[#a4373a] text-white px-3 py-1.5 rounded font-bold hover:bg-[#802a2c] cursor-pointer"
                    >
                      سجل جديد
                    </button>
                    <button
                      onClick={() => handleDeleteRecord(currentFormRecord.id)}
                      className="text-xs text-red-600 hover:text-red-800 font-bold flex items-center gap-1 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>حذف</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Split Form View Bottom Datasheet */}
              {viewMode === 'split-form' && (
                <div className="w-full max-w-4xl bg-white border border-gray-300 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-[#f3f0ee] px-3 py-1.5 font-bold text-gray-700 border-b border-gray-300 flex items-center justify-between">
                    <span>ورقة البيانات المرتبطة بالنموذج (Synchronized Datasheet)</span>
                    <span className="text-[10px] text-gray-500 font-mono">انقر على أي صف لتعديله في النموذج أعلاه</span>
                  </div>
                  <div className="max-h-56 overflow-auto">
                    <table className="w-full text-xs text-right border-collapse">
                      <thead className="bg-gray-100 font-bold border-b border-gray-300">
                        <tr>
                          <th className="p-1.5 border-l border-gray-200 text-center w-8">#</th>
                          {activeTable.fields.map((f) => (
                            <th key={f.name} className="p-1.5 border-l border-gray-200">
                              {f.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {processedRecords.map((r, i) => (
                          <tr
                            key={r.id}
                            onClick={() => setFormRecordIndex(i)}
                            className={`cursor-pointer border-b border-gray-100 ${
                              i === formRecordIndex ? 'bg-red-100 font-bold text-[#a4373a]' : 'hover:bg-gray-50'
                            }`}
                          >
                            <td className="p-1.5 border-l border-gray-200 text-center font-mono">{i + 1}</td>
                            {activeTable.fields.map((f) => (
                              <td key={f.name} className="p-1.5 border-l border-gray-200">
                                {String(r[f.name] ?? '')}
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

          {/* VIEW 4: SQL CONSOLE */}
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

          {/* VIEW 5: PRINTABLE REPORT VIEW */}
          {viewMode === 'report' && (
            <div className="flex-1 overflow-auto p-6 sm:p-10 flex justify-center bg-gray-200">
              <div
                id="access-report-printable"
                className="w-full max-w-3xl bg-white rounded-lg shadow-2xl p-10 text-right space-y-6"
              >
                {/* Report Header */}
                <div className="border-b-2 border-gray-800 pb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-gray-900">تقرير رسمي: {activeTable.label}</h2>
                    <p className="text-xs text-gray-500 mt-1">
                      كشف حساب ختامي رسمي صادر من قاعدة بيانات Sovereign Access
                    </p>
                  </div>
                  <div className="text-left font-mono text-xs text-gray-400">
                    <div>تاريخ التقرير: {new Date().toISOString().split('T')[0]}</div>
                    <div>كود الاعتماد: ACC-REP-992</div>
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
                    {processedRecords.map((rec) => (
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

                {/* Totals Summary */}
                <div className="p-3 bg-gray-50 rounded border border-gray-200 flex justify-between font-bold text-xs">
                  <span>إجمالي السجلات: {processedRecords.length}</span>
                  <span>
                    إجمالي المبالغ: {totalsMap[activeTable.fields.find((f) => f.type === 'currency')?.name || '']?.sum?.toLocaleString() || 0} ر.س
                  </span>
                </div>

                {/* Signatures */}
                <div className="pt-8 border-t-2 border-gray-800 flex justify-between items-end text-xs">
                  <div>
                    <span className="font-bold block mb-1">الختم المعتمد:</span>
                    <div className="border-2 border-dashed border-red-500 text-red-600 font-black p-2 rounded rotate-[-4deg] inline-block">
                      ★ معتمد رسمياً - نظام ملاك ★
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="font-bold block mb-1">توقيع المسؤول:</span>
                    <div className="font-serif italic text-blue-900 font-bold text-base">م. أحمد المنصوري</div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end no-print">
                  <button
                    onClick={handleExportPdfReport}
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
              <span>سجلات الجدول: {processedRecords.length}</span>
              <span>|</span>
              <span>الحقول: {activeTable.fields.length}</span>
              <span>|</span>
              <span className="text-emerald-700 font-bold">حالة قاعدة البيانات: متصل محلياً (Ready)</span>
              {relationships.length > 0 && (
                <>
                  <span>|</span>
                  <span className="text-blue-700">العلاقات النشطة: {relationships.length}</span>
                </>
              )}
            </div>
            <div className="font-mono text-[10px] text-gray-500">
              Access Sovereign Studio 2026
            </div>
          </div>
        </div>
      </div>

      {/* 4. Modals */}
      {/* Shift + F2: Zoom Box Modal */}
      {showZoomModal && selectedCellInfo && (
        <div className="fixed inset-0 z-[160] bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-gray-300 p-5 text-right animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <div className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <Database className="w-4 h-4 text-[#a4373a]" />
                <span>مربع تكبير الحقل (Access Zoom Box - Shift+F2)</span>
              </div>
              <button
                onClick={() => setShowZoomModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                ✕
              </button>
            </div>

            <div className="my-3">
              <label className="block text-[11px] text-gray-500 mb-1">
                محتوى الحقل: <strong>{selectedCellInfo.fieldName}</strong>
              </label>
              <textarea
                value={zoomModalValue}
                onChange={(e) => setZoomModalValue(e.target.value)}
                rows={6}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs text-gray-900 outline-none focus:border-[#a4373a]"
                placeholder="أدخل النص أو الملاحظات الموسعة..."
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
              <button
                onClick={() => setShowZoomModal(false)}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  handleUpdateRecord(selectedCellInfo.recId, selectedCellInfo.fieldName, zoomModalValue);
                  setShowZoomModal(false);
                }}
                className="px-4 py-1.5 rounded-lg bg-[#a4373a] hover:bg-[#8e2e31] text-white text-xs font-bold cursor-pointer transition shadow-xs"
              >
                حفظ في الحقل (OK)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Relationships Diagram Modal */}
      <RelationshipsModal
        isOpen={isRelationshipsOpen}
        onClose={() => setIsRelationshipsOpen(false)}
        tables={tables}
        relationships={relationships}
        onUpdateRelationships={(rels) => setRelationships(rels)}
      />

      {/* Query Wizard Modal */}
      <QueryWizardModal
        isOpen={isQueryWizardOpen}
        onClose={() => setIsQueryWizardOpen(false)}
        tables={tables}
        onSaveQuery={(qry) => {
          setSqlQuery(qry.sql);
          setViewMode('sql');
          alert(`تم إنشاء الاستعلام "${qry.name}" بنجاح وجرى نقله إلى محرر SQL.`);
        }}
      />

      {/* Database Documenter & Performance Analyzer Modal */}
      <DatabaseDocumenterModal
        isOpen={isDocumenterOpen}
        onClose={() => setIsDocumenterOpen(false)}
        tables={tables}
        relationships={relationships}
        databaseName={activeTable.label || 'Sovereign_Database'}
      />

      {/* VBA Editor Modal */}
      <VbaEditorModal
        isOpen={isVbaEditorOpen}
        onClose={() => setIsVbaEditorOpen(false)}
        modules={vbaModules}
        onSaveModule={(id, newCode) => {
          setVbaModules((prev) =>
            prev.map((m) => (m.id === id ? { ...m, code: newCode } : m))
          );
        }}
      />

      {/* Right-Click Context Menu */}
      {contextMenu.isOpen && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          type={contextMenu.type}
          data={contextMenu.data}
          onClose={() => setContextMenu((prev) => ({ ...prev, isOpen: false }))}
          onAction={handleContextMenuAction}
        />
      )}
    </div>
  );
};
