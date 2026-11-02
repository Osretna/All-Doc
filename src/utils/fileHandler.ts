import * as XLSX from 'xlsx';
import { Sheet, Workbook } from '../types/excel';
import { colIndexToLabel, coordinateToCellId, coordinateToKey, evaluateCell } from './formulaEngine';

export const STORAGE_KEY = 'SMART_EXCEL_WORKBOOK_DATA';
export const LAST_SAVED_KEY = 'SMART_EXCEL_LAST_SAVED';
export const ACTIVE_SHEET_KEY = 'SMART_EXCEL_ACTIVE_SHEET';
export const ACTIVE_CELL_KEY = 'SMART_EXCEL_ACTIVE_CELL';

export function createDefaultWorkbook(): Workbook {
  const initialCells: Record<string, { value: string; style?: any }> = {};

  // Headers
  const headers = ['م', 'البيان / الصنف', 'الكمية', 'سعر الوحدة', 'الإجمالي'];
  headers.forEach((h, col) => {
    initialCells[coordinateToKey({ col, row: 0 })] = {
      value: h,
      style: { bold: true, backgroundColor: '#e2e8f0', align: 'center' }
    };
  });

  // Sample Items
  const items = [
    { id: 1, name: 'أجهزة حاسوب مكتبية', qty: 5, price: 12500 },
    { id: 2, name: 'شاشات عرض 27 بوصة', qty: 10, price: 4200 },
    { id: 3, name: 'لوحات مفاتيح ميكانيكية', qty: 15, price: 650 },
    { id: 4, name: 'طابعات ليزر شبكية', qty: 3, price: 8900 },
    { id: 5, name: 'كابلات شبكة ومحولات', qty: 25, price: 180 },
  ];

  items.forEach((item, index) => {
    const row = index + 1;
    initialCells[coordinateToKey({ col: 0, row })] = { value: String(item.id), style: { align: 'center' } };
    initialCells[coordinateToKey({ col: 1, row })] = { value: item.name, style: { align: 'right' } };
    initialCells[coordinateToKey({ col: 2, row })] = { value: String(item.qty), style: { align: 'center' } };
    initialCells[coordinateToKey({ col: 3, row })] = { value: String(item.price), style: { align: 'right', format: 'number' } };
    // Formula: =C{row+1} * D{row+1}
    initialCells[coordinateToKey({ col: 4, row })] = {
      value: `=C${row + 1} * D${row + 1}`,
      style: { align: 'right', format: 'number', bold: true }
    };
  });

  // Summary Row (Row 6 -> index 6, row label 7)
  const sumRow = items.length + 1;
  initialCells[coordinateToKey({ col: 1, row: sumRow })] = {
    value: 'المجموع الإجمالي',
    style: { bold: true, backgroundColor: '#f1f5f9', align: 'right' }
  };
  initialCells[coordinateToKey({ col: 4, row: sumRow })] = {
    value: `=SUM(E2:E${sumRow})`,
    style: { bold: true, backgroundColor: '#dcfce7', color: '#166534', align: 'right', format: 'currency' }
  };

  const defaultSheet: Sheet = {
    id: 'sheet_1',
    name: 'الميزانية والمبيعات',
    rowCount: 50,
    colCount: 20,
    cells: initialCells,
    colWidths: {
      0: 60,
      1: 220,
      2: 90,
      3: 130,
      4: 150
    }
  };

  const sheet2: Sheet = {
    id: 'sheet_2',
    name: 'تقرير المصروفات',
    rowCount: 50,
    colCount: 20,
    cells: {
      '0,0': { value: 'الشهر', style: { bold: true, backgroundColor: '#e2e8f0' } },
      '1,0': { value: 'الإيجار', style: { bold: true, backgroundColor: '#e2e8f0' } },
      '2,0': { value: 'الرواتب', style: { bold: true, backgroundColor: '#e2e8f0' } },
      '3,0': { value: 'المجموع', style: { bold: true, backgroundColor: '#e2e8f0' } },
      '0,1': { value: 'يناير' },
      '1,1': { value: '15000' },
      '2,1': { value: '45000' },
      '3,1': { value: '=SUM(B2:C2)', style: { bold: true } },
    }
  };

  return {
    id: 'workbook_main',
    name: 'ملف البيانات المالي.xlsx',
    activeSheetId: 'sheet_1',
    sheets: [defaultSheet, sheet2],
    lastSaved: new Date().toISOString()
  };
}

export function saveWorkbookToStorage(workbook: Workbook): void {
  try {
    const toSave = {
      ...workbook,
      lastSaved: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    localStorage.setItem(LAST_SAVED_KEY, toSave.lastSaved);
    localStorage.setItem(ACTIVE_SHEET_KEY, workbook.activeSheetId);
  } catch (err) {
    console.error('Error saving workbook to localStorage:', err);
  }
}

export function loadWorkbookFromStorage(): Workbook {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.sheets) && parsed.sheets.length > 0) {
        // Restore active sheet if saved
        const savedActiveSheet = localStorage.getItem(ACTIVE_SHEET_KEY);
        if (savedActiveSheet && parsed.sheets.some((s: Sheet) => s.id === savedActiveSheet)) {
          parsed.activeSheetId = savedActiveSheet;
        }
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to parse workbook from localStorage, creating fresh workbook', err);
  }
  return createDefaultWorkbook();
}

export function exportWorkbookToXlsx(workbook: Workbook, fileName: string = 'SmartExcel_Export.xlsx'): void {
  const wb = XLSX.utils.book_new();

  for (const sheet of workbook.sheets) {
    const sheetData: any[][] = [];

    // Find bounds
    let maxR = 0;
    let maxC = 0;

    for (const key of Object.keys(sheet.cells)) {
      const [c, r] = key.split(',').map(Number);
      if (r > maxR) maxR = r;
      if (c > maxC) maxC = c;
    }

    maxR = Math.max(maxR, 20);
    maxC = Math.max(maxC, 10);

    for (let r = 0; r <= maxR; r++) {
      const rowArr: any[] = [];
      for (let c = 0; c <= maxC; c++) {
        const key = coordinateToKey({ col: c, row: r });
        const cell = sheet.cells[key];
        if (cell) {
          // If formula, write evaluated or formula
          const val = evaluateCell(key, sheet.cells);
          rowArr.push(val !== undefined && val !== null ? val : cell.value);
        } else {
          rowArr.push('');
        }
      }
      sheetData.push(rowArr);
    }

    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(wb, ws, sheet.name.substring(0, 31));
  }

  XLSX.writeFile(wb, fileName);
}

export function exportSheetToCsv(sheet: Sheet, fileName: string = 'export.csv'): void {
  let maxR = 0;
  let maxC = 0;

  for (const key of Object.keys(sheet.cells)) {
    const [c, r] = key.split(',').map(Number);
    if (r > maxR) maxR = r;
    if (c > maxC) maxC = c;
  }

  const rows: string[] = [];
  for (let r = 0; r <= maxR; r++) {
    const rowVals: string[] = [];
    for (let c = 0; c <= maxC; c++) {
      const key = coordinateToKey({ col: c, row: r });
      const val = evaluateCell(key, sheet.cells);
      const strVal = String(val ?? '').replace(/"/g, '""');
      rowVals.push(`"${strVal}"`);
    }
    rows.push(rowVals.join(','));
  }

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(rows.join('\n'));
  const link = document.createElement('a');
  link.setAttribute('href', csvContent);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function importFileToWorkbook(file: File): Promise<Sheet[]> {
  const data = await file.arrayBuffer();
  const wb = XLSX.read(data, { type: 'array' });
  const newSheets: Sheet[] = [];

  for (let idx = 0; idx < wb.SheetNames.length; idx++) {
    const sheetName = wb.SheetNames[idx];
    const ws = wb.Sheets[sheetName];
    const aoa: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });

    const cells: Record<string, { value: string }> = {};
    let maxR = 50;
    let maxC = 20;

    aoa.forEach((row, rIdx) => {
      if (rIdx >= maxR) maxR = rIdx + 10;
      if (Array.isArray(row)) {
        row.forEach((cellVal, cIdx) => {
          if (cIdx >= maxC) maxC = cIdx + 5;
          if (cellVal !== undefined && cellVal !== null) {
            cells[coordinateToKey({ col: cIdx, row: rIdx })] = {
              value: String(cellVal)
            };
          }
        });
      }
    });

    newSheets.push({
      id: `imported_sheet_${idx}_${Date.now()}`,
      name: sheetName,
      cells,
      rowCount: Math.max(maxR, 50),
      colCount: Math.max(maxC, 26)
    });
  }

  return newSheets;
}
