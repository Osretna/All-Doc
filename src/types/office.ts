export type OfficeAppId = 'docs' | 'sheets' | 'slides' | 'base' | 'notes' | 'pdf' | 'photo';

export type OfficeSection = 'office' | 'hosting' | 'domains' | 'email' | 'mollak' | 'custom-solutions' | 'sovereign-vault';

export interface SheetCell {
  value?: string | number | boolean;
  formula?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  bg?: string;
  border?: 'all' | 'box' | 'thick-bottom' | 'double-bottom' | 'bottom' | 'none';
  align?: 'right' | 'center' | 'left';
  verticalAlign?: 'top' | 'middle' | 'bottom';
  wrapText?: boolean;
  format?: 'general' | 'number' | 'currency' | 'percent' | 'text' | 'date';
  decimalPlaces?: number;
  isMergeParent?: boolean;
  mergeColSpan?: number;
  mergeRowSpan?: number;
  mergedWith?: string;
  comment?: string;
  commentAuthor?: string;
  sparkline?: 'line' | 'bar';
  sparklineRange?: string;
}

export interface SheetData {
  [cellKey: string]: SheetCell;
}

export interface SheetTab {
  id: string;
  label: string;
  data: SheetData;
  rtl?: boolean;
  rowHeights?: { [row: number]: number };
  colWidths?: { [col: string]: number };
}

export interface WorkbookData {
  [sheetId: string]: SheetTab;
}

export interface NamedRange {
  name: string;
  refersTo: string;
  scope: string;
}

export interface SheetChart {
  id: string;
  type: 'column' | 'line' | 'pie' | 'area';
  title: string;
  range: string;
  xRange?: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ConditionalRule {
  id: string;
  range: string;
  type: 'greater' | 'less' | 'between' | 'equal' | 'duplicate';
  val1: string;
  val2?: string;
  color: string;
  bg: string;
}

export interface DataValidationRule {
  id: string;
  range: string;
  type: 'list' | 'whole' | 'decimal' | 'textLength';
  criteria?: 'between' | 'greater' | 'less' | 'equal';
  min?: string;
  max?: string;
  values?: string[]; // for list
  errorMessage?: string;
}

export interface FilterState {
  enabled: boolean;
  headerRow: number;
  filters: {
    [colLetter: string]: {
      selectedValues?: string[];
      active: boolean;
    };
  };
}

export interface ToastItem {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error' | 'warning';
}
