export interface CellStyle {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  color?: string;
  backgroundColor?: string;
  align?: 'left' | 'center' | 'right';
  format?: 'text' | 'number' | 'currency' | 'percent';
}

export interface CellData {
  value: string; // The raw input (e.g. "=SUM(A1:A4)" or "150" or "محمد")
  computed?: string | number; // The computed result
  style?: CellStyle;
}

export type SheetCells = Record<string, CellData>; // key is "colIndex,rowIndex" e.g. "0,0" for A1

export interface Sheet {
  id: string;
  name: string;
  cells: SheetCells;
  rowCount: number;
  colCount: number;
  colWidths?: Record<number, number>;
  rowHeights?: Record<number, number>;
}

export interface Workbook {
  id: string;
  name: string;
  activeSheetId: string;
  sheets: Sheet[];
  lastSaved?: string;
}

export interface CellCoordinate {
  col: number; // 0-indexed (0 = A)
  row: number; // 0-indexed (0 = 1)
}

export interface SelectionRange {
  start: CellCoordinate;
  end: CellCoordinate;
}

export interface FormulaReference {
  rangeStr: string; // e.g. "A1:A5" or "B2"
  color: string;
  start: CellCoordinate;
  end: CellCoordinate;
}
