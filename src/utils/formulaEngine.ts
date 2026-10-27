import { CellCoordinate, SheetCells } from '../types/excel';

export function colIndexToLabel(col: number): string {
  let label = '';
  let c = col;
  while (c >= 0) {
    label = String.fromCharCode((c % 26) + 65) + label;
    c = Math.floor(c / 26) - 1;
  }
  return label;
}

export function labelToColIndex(label: string): number {
  let col = 0;
  const upper = label.toUpperCase();
  for (let i = 0; i < upper.length; i++) {
    col = col * 26 + (upper.charCodeAt(i) - 64);
  }
  return col - 1;
}

export function coordinateToKey(coord: CellCoordinate): string {
  return `${coord.col},${coord.row}`;
}

export function keyToCoordinate(key: string): CellCoordinate {
  const parts = key.split(',');
  return { col: parseInt(parts[0], 10), row: parseInt(parts[1], 10) };
}

export function coordinateToCellId(coord: CellCoordinate): string {
  return `${colIndexToLabel(coord.col)}${coord.row + 1}`;
}

export function cellIdToCoordinate(cellId: string): CellCoordinate | null {
  const match = cellId.trim().toUpperCase().match(/^([A-Z]+)(\d+)$/);
  if (!match) return null;
  const col = labelToColIndex(match[1]);
  const row = parseInt(match[2], 10) - 1;
  if (isNaN(col) || isNaN(row) || col < 0 || row < 0) return null;
  return { col, row };
}

export function parseRange(rangeStr: string): CellCoordinate[] {
  const parts = rangeStr.trim().toUpperCase().split(':');
  if (parts.length === 1) {
    const c = cellIdToCoordinate(parts[0]);
    return c ? [c] : [];
  }
  if (parts.length === 2) {
    const start = cellIdToCoordinate(parts[0]);
    const end = cellIdToCoordinate(parts[1]);
    if (!start || !end) return [];
    
    const minCol = Math.min(start.col, end.col);
    const maxCol = Math.max(start.col, end.col);
    const minRow = Math.min(start.row, end.row);
    const maxRow = Math.max(start.row, end.row);
    
    const coords: CellCoordinate[] = [];
    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        coords.push({ col: c, row: r });
      }
    }
    return coords;
  }
  return [];
}

export function getNumericValuesFromRange(
  rangeStr: string,
  cells: SheetCells,
  visited: Set<string>
): number[] {
  const coords = parseRange(rangeStr);
  const values: number[] = [];
  for (const coord of coords) {
    const key = coordinateToKey(coord);
    const cell = cells[key];
    if (cell && cell.value !== undefined && cell.value !== '') {
      const val = evaluateCell(key, cells, visited);
      const num = typeof val === 'number' ? val : parseFloat(String(val).replace(/,/g, ''));
      if (!isNaN(num)) {
        values.push(num);
      }
    }
  }
  return values;
}

export function evaluateCell(
  cellKey: string,
  cells: SheetCells,
  visited: Set<string> = new Set()
): string | number {
  const cell = cells[cellKey];
  if (!cell || cell.value === undefined || cell.value === null) {
    return '';
  }

  const raw = String(cell.value).trim();
  if (!raw.startsWith('=')) {
    // If it's a simple number
    if (raw !== '' && !isNaN(Number(raw))) {
      return Number(raw);
    }
    return raw;
  }

  // Circular reference check
  if (visited.has(cellKey)) {
    return '#REF!';
  }

  const newVisited = new Set(visited);
  newVisited.add(cellKey);

  const formula = raw.substring(1).trim();

  try {
    return evaluateFormulaExpression(formula, cells, newVisited);
  } catch {
    return '#ERROR!';
  }
}

export function evaluateFormulaExpression(
  expression: string,
  cells: SheetCells,
  visited: Set<string>
): string | number {
  const upper = expression.trim().toUpperCase();

  // SUM function
  const sumMatch = upper.match(/^SUM\s*\((.*?)\)$/i);
  if (sumMatch) {
    const args = sumMatch[1].split(',').map((s) => s.trim());
    let total = 0;
    for (const arg of args) {
      if (arg.includes(':') || /^[A-Z]+\d+$/.test(arg)) {
        const nums = getNumericValuesFromRange(arg, cells, visited);
        total += nums.reduce((acc, curr) => acc + curr, 0);
      } else {
        const num = parseFloat(arg);
        if (!isNaN(num)) total += num;
      }
    }
    return Math.round(total * 1000000) / 1000000;
  }

  // AVERAGE / AVG function
  const avgMatch = upper.match(/^(?:AVERAGE|AVG)\s*\((.*?)\)$/i);
  if (avgMatch) {
    const args = avgMatch[1].split(',').map((s) => s.trim());
    const nums: number[] = [];
    for (const arg of args) {
      if (arg.includes(':') || /^[A-Z]+\d+$/.test(arg)) {
        nums.push(...getNumericValuesFromRange(arg, cells, visited));
      } else {
        const num = parseFloat(arg);
        if (!isNaN(num)) nums.push(num);
      }
    }
    if (nums.length === 0) return 0;
    const sum = nums.reduce((acc, curr) => acc + curr, 0);
    return Math.round((sum / nums.length) * 1000000) / 1000000;
  }

  // COUNT function
  const countMatch = upper.match(/^COUNT\s*\((.*?)\)$/i);
  if (countMatch) {
    const args = countMatch[1].split(',').map((s) => s.trim());
    let count = 0;
    for (const arg of args) {
      if (arg.includes(':') || /^[A-Z]+\d+$/.test(arg)) {
        const nums = getNumericValuesFromRange(arg, cells, visited);
        count += nums.length;
      } else if (arg !== '') {
        count++;
      }
    }
    return count;
  }

  // MAX function
  const maxMatch = upper.match(/^MAX\s*\((.*?)\)$/i);
  if (maxMatch) {
    const args = maxMatch[1].split(',').map((s) => s.trim());
    const nums: number[] = [];
    for (const arg of args) {
      if (arg.includes(':') || /^[A-Z]+\d+$/.test(arg)) {
        nums.push(...getNumericValuesFromRange(arg, cells, visited));
      } else {
        const num = parseFloat(arg);
        if (!isNaN(num)) nums.push(num);
      }
    }
    if (nums.length === 0) return 0;
    return Math.max(...nums);
  }

  // MIN function
  const minMatch = upper.match(/^MIN\s*\((.*?)\)$/i);
  if (minMatch) {
    const args = minMatch[1].split(',').map((s) => s.trim());
    const nums: number[] = [];
    for (const arg of args) {
      if (arg.includes(':') || /^[A-Z]+\d+$/.test(arg)) {
        nums.push(...getNumericValuesFromRange(arg, cells, visited));
      } else {
        const num = parseFloat(arg);
        if (!isNaN(num)) nums.push(num);
      }
    }
    if (nums.length === 0) return 0;
    return Math.min(...nums);
  }

  // IF function: IF(condition, trueVal, falseVal)
  const ifMatch = upper.match(/^IF\s*\((.*?),(.*?),(.*?)\)$/i);
  if (ifMatch) {
    const condition = ifMatch[1].trim();
    const trueVal = ifMatch[2].trim();
    const falseVal = ifMatch[3].trim();
    const condResult = evaluateFormulaExpression(condition, cells, visited);
    return condResult ? evaluateFormulaExpression(trueVal, cells, visited) : evaluateFormulaExpression(falseVal, cells, visited);
  }

  // Evaluate general arithmetic expressions like =A1 + B2 * 3
  // Replace cell references with their numeric values
  const cellRefRegex = /\b([A-Z]+[0-9]+)\b/g;
  const replacedExpression = upper.replace(cellRefRegex, (match) => {
    const coord = cellIdToCoordinate(match);
    if (!coord) return '0';
    const key = coordinateToKey(coord);
    const val = evaluateCell(key, cells, visited);
    if (typeof val === 'number') return String(val);
    const num = parseFloat(String(val).replace(/,/g, ''));
    return isNaN(num) ? '0' : String(num);
  });

  // Safe arithmetic evaluator
  // Only allow valid mathematical characters: digits, ., +, -, *, /, (, ), %, spaces
  if (/^[0-9+\-*/().\s%^]+$/.test(replacedExpression)) {
    // Sanitized math calculation
    const sanitized = replacedExpression.replace(/\^/g, '**').replace(/%/g, '/100');
    // Using Function constructor in a strictly sanitized scope
    // eslint-disable-next-line no-new-func
    const result = new Function(`return (${sanitized});`)();
    if (typeof result === 'number') {
      if (isNaN(result) || !isFinite(result)) return '#VALUE!';
      return Math.round(result * 1000000) / 1000000;
    }
    return result;
  }

  return '#VALUE!';
}

export function formatCellValue(value: string | number, format?: string): string {
  if (value === undefined || value === null || value === '') return '';
  if (typeof value === 'string' && value.startsWith('#')) return value;

  const num = typeof value === 'number' ? value : parseFloat(String(value));
  if (isNaN(num)) return String(value);

  if (format === 'currency') {
    return new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(num);
  }
  if (format === 'percent') {
    return `${(num * 100).toFixed(1)}%`;
  }
  if (format === 'number') {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 4 }).format(num);
  }

  return String(value);
}
