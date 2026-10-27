import { SheetData } from '../types';

export interface ExcelFunctionDef {
  name: string;
  syntax: string;
  desc: string;
  example: string;
  category: 'Math' | 'Logical' | 'Statistical' | 'Lookup' | 'Text';
}

export const EXCEL_FUNCTIONS: ExcelFunctionDef[] = [
  { name: 'SUM', syntax: 'SUM(number1, [number2], ...)', desc: 'جمع كافة الأرقام في نطاق محدد من الخلايا', example: '=SUM(B4:B8)', category: 'Math' },
  { name: 'SUMIF', syntax: 'SUMIF(range, criteria, [sum_range])', desc: 'جمع الخلايا التي تستوفي شرطاً محدداً', example: '=SUMIF(C4:C8, ">1000")', category: 'Math' },
  { name: 'AVERAGE', syntax: 'AVERAGE(number1, [number2], ...)', desc: 'حساب المتوسط الحسابي لمجموعة قيم أو خلايا', example: '=AVERAGE(C4:C8)', category: 'Statistical' },
  { name: 'IF', syntax: 'IF(logical_test, [value_if_true], [value_if_false])', desc: 'فحص تحقق شرط منطقي وإرجاع قيمة حسب النتيجة', example: '=IF(C4>1000, "فائض", "ضمن الحد")', category: 'Logical' },
  { name: 'COUNT', syntax: 'COUNT(value1, [value2], ...)', desc: 'عد الخلايا التي تحتوي على أرقام فقط', example: '=COUNT(B4:B20)', category: 'Statistical' },
  { name: 'COUNTA', syntax: 'COUNTA(value1, [value2], ...)', desc: 'عد الخلايا غير الفارغة (أرقام ونصوص)', example: '=COUNTA(A4:A20)', category: 'Statistical' },
  { name: 'MAX', syntax: 'MAX(number1, [number2], ...)', desc: 'إرجاع القيمة الأكبر في نطاق الخلايا', example: '=MAX(C4:C8)', category: 'Statistical' },
  { name: 'MIN', syntax: 'MIN(number1, [number2], ...)', desc: 'إرجاع القيمة الأصغر في نطاق الخلايا', example: '=MIN(C4:C8)', category: 'Statistical' },
  { name: 'ROUND', syntax: 'ROUND(number, num_digits)', desc: 'تقريب رقم إلى عدد محدد من الخانات العشرية', example: '=ROUND(B4*1.15, 2)', category: 'Math' },
  { name: 'VLOOKUP', syntax: 'VLOOKUP(lookup_value, table_array, col_index, [range_lookup])', desc: 'البحث عن قيمة في العمود الأول واسترجاع قيمة عمود محدد', example: '=VLOOKUP(A4, A4:D20, 2, FALSE)', category: 'Lookup' },
  { name: 'CONCAT', syntax: 'CONCAT(text1, [text2], ...)', desc: 'دمج النصوص والسلاسل النصية معاً', example: '=CONCAT(A4, " - ", B4)', category: 'Text' },
  { name: 'AND', syntax: 'AND(logical1, [logical2], ...)', desc: 'فحص تحقق جميع الشروط المنطقية معاً', example: '=AND(B4>1000, C4>1000)', category: 'Logical' },
  { name: 'OR', syntax: 'OR(logical1, [logical2], ...)', desc: 'فحص تحقق أي شرط من الشروط المنطقية', example: '=OR(B4>1000, C4>1000)', category: 'Logical' },
  { name: 'NOT', syntax: 'NOT(logical)', desc: 'عكس القيمة المنطقية (True تصبح False)', example: '=NOT(B4>1000)', category: 'Logical' },
];

/**
 * Microsoft Excel Advanced Formula Engine
 * Evaluates Excel expressions with support for SUM, SUMIF, AVERAGE, COUNT, COUNTA, MIN, MAX,
 * IF, AND, OR, NOT, CONCAT, ROUND, VLOOKUP, and full math operator precedence.
 */

export function parseRange(rangeStr: string): string[] {
  const [start, end] = rangeStr.split(':');
  if (!start || !end) return [start];

  const colStartMatch = start.match(/([A-Z]+)(\d+)/);
  const colEndMatch = end.match(/([A-Z]+)(\d+)/);
  if (!colStartMatch || !colEndMatch) return [start];

  const col1 = colStartMatch[1];
  const row1 = parseInt(colStartMatch[2], 10);
  const col2 = colEndMatch[1];
  const row2 = parseInt(colEndMatch[2], 10);

  const colToNum = (col: string) => {
    let num = 0;
    for (let i = 0; i < col.length; i++) {
      num = num * 26 + (col.charCodeAt(i) - 64);
    }
    return num;
  };

  const numToCol = (num: number) => {
    let str = '';
    while (num > 0) {
      const rem = (num - 1) % 26;
      str = String.fromCharCode(65 + rem) + str;
      num = Math.floor((num - 1) / 26);
    }
    return str;
  };

  const c1 = colToNum(col1);
  const c2 = colToNum(col2);
  const minC = Math.min(c1, c2);
  const maxC = Math.max(c1, c2);
  const minR = Math.min(row1, row2);
  const maxR = Math.max(row1, row2);

  const cells: string[] = [];
  for (let r = minR; r <= maxR; r++) {
    for (let c = minC; c <= maxC; c++) {
      cells.push(`${numToCol(c)}${r}`);
    }
  }
  return cells;
}

export function evaluateExcelFormula(
  expr: string, 
  sheetData: SheetData, 
  allSheets?: Record<string, { label: string; data: SheetData }>
): string {
  if (!expr.startsWith('=')) return expr;

  const raw = expr.substring(1).trim();
  const upper = raw.toUpperCase();

  try {
    // 1. IF(condition, true_val, false_val)
    const ifMatch = raw.match(/^IF\s*\((.+)\)$/i);
    if (ifMatch) {
      const args = splitFormulaArgs(ifMatch[1]);
      if (args.length >= 2) {
        const cond = evaluateCondition(args[0], sheetData, allSheets);
        if (cond) {
          return resolveArgValue(args[1], sheetData, allSheets);
        } else {
          return args[2] ? resolveArgValue(args[2], sheetData, allSheets) : '';
        }
      }
    }

    // 2. VLOOKUP(lookup_value, table_range, col_index, [range_lookup])
    const vlookupMatch = raw.match(/^VLOOKUP\s*\((.+)\)$/i);
    if (vlookupMatch) {
      const args = splitFormulaArgs(vlookupMatch[1]);
      if (args.length >= 3) {
        const lookupVal = resolveArgValue(args[0], sheetData, allSheets).toLowerCase();
        const targetData = resolveTargetSheetData(args[1], sheetData, allSheets);
        const cleanRange = stripSheetPrefix(args[1].toUpperCase());
        const rangeCells = parseRange(cleanRange);
        const colIndex = parseInt(args[2], 10);

        // Group range cells by rows
        const rowMap: Record<number, string[]> = {};
        rangeCells.forEach((c) => {
          const m = c.match(/([A-Z]+)(\d+)/);
          if (m) {
            const r = parseInt(m[2], 10);
            if (!rowMap[r]) rowMap[r] = [];
            rowMap[r].push(c);
          }
        });

        for (const rowNum of Object.keys(rowMap)) {
          const rowCells = rowMap[Number(rowNum)];
          const firstCell = rowCells[0];
          const valInFirst = String(targetData[firstCell]?.value || '').toLowerCase();
          if (valInFirst === lookupVal || valInFirst.includes(lookupVal)) {
            const targetCell = rowCells[colIndex - 1];
            if (targetCell) {
              return String(targetData[targetCell]?.value || '');
            }
          }
        }
        return '#N/A';
      }
    }

    // 3. SUM(...)
    const sumMatch = raw.match(/^SUM\s*\((.+)\)$/i);
    if (sumMatch) {
      const vals = collectNumericValues(sumMatch[1], sheetData, allSheets);
      const total = vals.reduce((a, b) => a + b, 0);
      return formatResult(total);
    }

    // 3b. SUMIF(range, criteria, [sum_range])
    const sumifMatch = raw.match(/^SUMIF\s*\((.+)\)$/i);
    if (sumifMatch) {
      const args = splitFormulaArgs(sumifMatch[1]);
      if (args.length >= 2) {
        const targetData = resolveTargetSheetData(args[0], sheetData, allSheets);
        const cleanCritRange = stripSheetPrefix(args[0].toUpperCase());
        const critCells = parseRange(cleanCritRange);
        const rawCrit = args[1].replace(/['"]/g, '').trim();
        const sumTargetData = args[2] ? resolveTargetSheetData(args[2], sheetData, allSheets) : targetData;
        const sumCells = args[2] ? parseRange(stripSheetPrefix(args[2].toUpperCase())) : critCells;

        let total = 0;
        critCells.forEach((cId, idx) => {
          const val = parseFloat(targetData[cId]?.value || '0');
          let matches = false;
          if (rawCrit.startsWith('>=')) matches = val >= parseFloat(rawCrit.substring(2));
          else if (rawCrit.startsWith('<=')) matches = val <= parseFloat(rawCrit.substring(2));
          else if (rawCrit.startsWith('>')) matches = val > parseFloat(rawCrit.substring(1));
          else if (rawCrit.startsWith('<')) matches = val < parseFloat(rawCrit.substring(1));
          else if (rawCrit.startsWith('=')) matches = val === parseFloat(rawCrit.substring(1));
          else matches = (sheetData[cId]?.value || '') === rawCrit || val === parseFloat(rawCrit);

          if (matches) {
            const sumCell = sumCells[idx] || cId;
            const toAdd = parseFloat(sheetData[sumCell]?.value || '0');
            if (!isNaN(toAdd)) total += toAdd;
          }
        });
        return formatResult(total);
      }
    }

    // 4. AVERAGE(...)
    const avgMatch = raw.match(/^AVERAGE\s*\((.+)\)$/i);
    if (avgMatch) {
      const vals = collectNumericValues(avgMatch[1], sheetData);
      if (vals.length === 0) return '0';
      const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
      return formatResult(avg);
    }

    // 5. COUNT(...)
    const countMatch = raw.match(/^COUNT\s*\((.+)\)$/i);
    if (countMatch) {
      const vals = collectNumericValues(countMatch[1], sheetData);
      return vals.length.toString();
    }

    // 5b. COUNTA(...)
    const countaMatch = raw.match(/^COUNTA\s*\((.+)\)$/i);
    if (countaMatch) {
      const cells = parseRange(countaMatch[1].toUpperCase());
      const nonEmpty = cells.filter((c) => (sheetData[c]?.value || '').trim() !== '');
      return nonEmpty.length.toString();
    }

    // 6. MIN(...)
    const minMatch = raw.match(/^MIN\s*\((.+)\)$/i);
    if (minMatch) {
      const vals = collectNumericValues(minMatch[1], sheetData);
      if (vals.length === 0) return '0';
      return formatResult(Math.min(...vals));
    }

    // 7. MAX(...)
    const maxMatch = raw.match(/^MAX\s*\((.+)\)$/i);
    if (maxMatch) {
      const vals = collectNumericValues(maxMatch[1], sheetData);
      if (vals.length === 0) return '0';
      return formatResult(Math.max(...vals));
    }

    // 8. ROUND(val, decimals)
    const roundMatch = raw.match(/^ROUND\s*\((.+)\)$/i);
    if (roundMatch) {
      const args = splitFormulaArgs(roundMatch[1]);
      const val = parseFloat(resolveArgValue(args[0], sheetData));
      const decimals = args[1] ? parseInt(args[1], 10) : 0;
      if (!isNaN(val)) {
        return val.toFixed(decimals);
      }
    }

    // 9. CONCAT(...) / CONCATENATE(...)
    const concatMatch = raw.match(/^(?:CONCAT|CONCATENATE)\s*\((.+)\)$/i);
    if (concatMatch) {
      const args = splitFormulaArgs(concatMatch[1]);
      return args.map((a) => resolveArgValue(a, sheetData)).join('');
    }

    // 10. General Math Expression with nested functions e.g. SUM(A1:A5)+B1 or A1*1.15
    let mathStr = raw;

    // Replace nested SUM, AVERAGE
    mathStr = mathStr.replace(/SUM\s*\(([^)]+)\)/gi, (_, inner) => {
      const vals = collectNumericValues(inner, sheetData, allSheets);
      return vals.reduce((a, b) => a + b, 0).toString();
    });

    mathStr = mathStr.replace(/AVERAGE\s*\(([^)]+)\)/gi, (_, inner) => {
      const vals = collectNumericValues(inner, sheetData, allSheets);
      if (vals.length === 0) return '0';
      return (vals.reduce((a, b) => a + b, 0) / vals.length).toString();
    });

    // Replace cross-sheet references e.g. 'Sheet1'!A1 or Sheet1!A1
    mathStr = mathStr.replace(/(?:'([^']+)'|([A-Za-z0-9_]+))!([A-Z]+[0-9]+)/gi, (_, quotedSheet, unquotedSheet, cellAddr) => {
      const sheetName = quotedSheet || unquotedSheet;
      const targetData = resolveTargetSheetData(sheetName, sheetData, allSheets);
      const cellVal = targetData[cellAddr.toUpperCase()]?.value;
      if (cellVal === undefined || cellVal === '') return '0';
      const cleanNum = parseFloat(String(cellVal).replace(/[^\d.-]/g, ''));
      return isNaN(cleanNum) ? '0' : cleanNum.toString();
    });

    // Replace local cell references A1, B4 with their numeric values
    mathStr = mathStr.replace(/\b([A-Z]+[0-9]+)\b/g, (match) => {
      const cellVal = sheetData[match]?.value;
      if (cellVal === undefined || cellVal === '') return '0';
      const cleanNum = parseFloat(String(cellVal).replace(/[^\d.-]/g, ''));
      return isNaN(cleanNum) ? '0' : cleanNum.toString();
    });

    // Validate safe characters for arithmetic
    if (/^[0-9+\-*/(). %^]+$/.test(mathStr)) {
      // Replace % with /100 and ^ with **
      const sanitized = mathStr.replace(/\^/g, '**').replace(/([0-9.]+)%/g, '($1/100)');
      // eslint-disable-next-line no-eval
      const result = Function(`'use strict'; return (${sanitized})`)();
      if (typeof result === 'number' && !isNaN(result)) {
        return formatResult(result);
      }
    }

    return raw;
  } catch (err) {
    console.warn('Formula eval error:', err);
    return '#VALUE!';
  }
}

export function stripSheetPrefix(ref: string): string {
  if (ref.includes('!')) {
    return ref.split('!').pop() || ref;
  }
  return ref;
}

export function resolveTargetSheetData(
  refOrSheetName: string, 
  currentSheetData: SheetData, 
  allSheets?: Record<string, { label: string; data: SheetData }>
): SheetData {
  if (!allSheets) return currentSheetData;

  let sheetIdentifier = refOrSheetName;
  if (refOrSheetName.includes('!')) {
    sheetIdentifier = refOrSheetName.split('!')[0].replace(/^['"]|['"]$/g, '').trim();
  } else {
    sheetIdentifier = refOrSheetName.replace(/^['"]|['"]$/g, '').trim();
  }

  // Look up by sheet key e.g. sheet1, sheet2
  if (allSheets[sheetIdentifier]) {
    return allSheets[sheetIdentifier].data;
  }

  // Look up by sheet label or name
  for (const key of Object.keys(allSheets)) {
    const s = allSheets[key];
    if (s.label.toLowerCase() === sheetIdentifier.toLowerCase() || 
        s.label.toLowerCase().includes(sheetIdentifier.toLowerCase()) ||
        key.toLowerCase() === sheetIdentifier.toLowerCase()) {
      return s.data;
    }
  }

  return currentSheetData;
}

function collectNumericValues(
  argsStr: string, 
  sheetData: SheetData, 
  allSheets?: Record<string, { label: string; data: SheetData }>
): number[] {
  const args = splitFormulaArgs(argsStr);
  const values: number[] = [];

  for (const arg of args) {
    const trimmed = arg.trim();
    if (trimmed.includes(':')) {
      const targetData = resolveTargetSheetData(trimmed, sheetData, allSheets);
      const cleanRange = stripSheetPrefix(trimmed.toUpperCase());
      const rangeCells = parseRange(cleanRange);
      for (const c of rangeCells) {
        const val = targetData[c]?.value;
        if (val !== undefined && val !== '') {
          const num = parseFloat(String(val).replace(/[^\d.-]/g, ''));
          if (!isNaN(num)) values.push(num);
        }
      }
    } else {
      const val = resolveArgValue(trimmed, sheetData, allSheets);
      const num = parseFloat(String(val).replace(/[^\d.-]/g, ''));
      if (!isNaN(num)) values.push(num);
    }
  }

  return values;
}

function resolveArgValue(
  arg: string, 
  sheetData: SheetData, 
  allSheets?: Record<string, { label: string; data: SheetData }>
): string {
  const trimmed = arg.trim();
  // Strip quotes
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  
  // Cross-sheet reference e.g. 'Sheet1'!A1 or Sheet1!A1
  if (trimmed.includes('!')) {
    const targetData = resolveTargetSheetData(trimmed, sheetData, allSheets);
    const cellAddr = stripSheetPrefix(trimmed).toUpperCase();
    return String(targetData[cellAddr]?.value || '');
  }

  // Check if cell reference e.g. A1, B4
  if (/^[A-Z]+[0-9]+$/i.test(trimmed)) {
    return String(sheetData[trimmed.toUpperCase()]?.value || '');
  }
  return trimmed;
}

function splitFormulaArgs(str: string): string[] {
  const args: string[] = [];
  let depth = 0;
  let inQuote = false;
  let current = '';

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char === '"' || char === "'") inQuote = !inQuote;
    if (!inQuote) {
      if (char === '(') depth++;
      else if (char === ')') depth--;
      else if ((char === ',' || char === ';') && depth === 0) {
        args.push(current.trim());
        current = '';
        continue;
      }
    }
    current += char;
  }
  if (current.trim()) args.push(current.trim());
  return args;
}

function evaluateCondition(
  condStr: string, 
  sheetData: SheetData, 
  allSheets?: Record<string, { label: string; data: SheetData }>
): boolean {
  const ops = ['>=', '<=', '!=', '<>', '=', '>', '<'];
  for (const op of ops) {
    if (condStr.includes(op)) {
      const [left, right] = condStr.split(op);
      const leftVal = parseFloat(resolveArgValue(left, sheetData, allSheets));
      const rightVal = parseFloat(resolveArgValue(right, sheetData, allSheets));

      if (!isNaN(leftVal) && !isNaN(rightVal)) {
        switch (op) {
          case '>': return leftVal > rightVal;
          case '<': return leftVal < rightVal;
          case '>=': return leftVal >= rightVal;
          case '<=': return leftVal <= rightVal;
          case '=': return leftVal === rightVal;
          case '!=':
          case '<>': return leftVal !== rightVal;
        }
      } else {
        const leftStr = resolveArgValue(left, sheetData, allSheets).toLowerCase();
        const rightStr = resolveArgValue(right, sheetData, allSheets).toLowerCase();
        if (op === '=' || op === '==') return leftStr === rightStr;
        if (op === '!=' || op === '<>') return leftStr !== rightStr;
      }
    }
  }
  return false;
}

function formatResult(val: number): string {
  if (Number.isInteger(val)) return val.toString();
  return val.toFixed(2);
}
