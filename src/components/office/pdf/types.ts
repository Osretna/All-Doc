export type PdfRibbonTab = 
  | 'home' 
  | 'edit' 
  | 'organize' 
  | 'comment' 
  | 'fill-sign' 
  | 'protect' 
  | 'export' 
  | 'view';

export type PdfActiveTool = 
  | 'select' 
  | 'hand' 
  | 'edit-text' 
  | 'add-text' 
  | 'add-image' 
  | 'add-shape' 
  | 'highlight' 
  | 'underline' 
  | 'strikethrough' 
  | 'pencil' 
  | 'sticky-note' 
  | 'stamp' 
  | 'signature' 
  | 'form-field' 
  | 'redact' 
  | 'measure';

export interface StickyNote {
  id: string;
  pageNumber: number;
  x: number;
  y: number;
  text: string;
  author: string;
  date: string;
  color: string;
}

export interface StampItem {
  id: string;
  pageNumber: number;
  x: number;
  y: number;
  title: string;
  dateStr: string;
  type: 'approved' | 'confidential' | 'draft' | 'rejected' | 'paid';
}

export interface SignatureItem {
  id: string;
  pageNumber: number;
  x: number;
  y: number;
  dataUrl: string;
  signerName: string;
  dateStr: string;
}

export interface DrawingPath {
  id: string;
  pageNumber: number;
  points: { x: number; y: number }[];
  color: string;
  strokeWidth: number;
}

export interface TextBlockItem {
  id: string;
  pageNumber: number;
  x: number;
  y: number;
  text: string;
  fontSize: number;
  color: string;
  bold?: boolean;
}

export interface RedactionBox {
  id: string;
  pageNumber: number;
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
}

export interface FormFieldItem {
  id: string;
  pageNumber: number;
  x: number;
  y: number;
  type: 'text' | 'checkbox' | 'radio' | 'dropdown';
  label: string;
  value: string;
}

export interface PdfWatermarkConfig {
  enabled: boolean;
  text: string;
  color: string;
  opacity: number;
  rotation: number;
  fontSize: number;
}

export interface BatesNumberingConfig {
  enabled: boolean;
  prefix: string;
  startNumber: number;
  digits: number;
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'bottom-center';
}

export interface HeaderFooterConfig {
  headerLeft: string;
  headerCenter: string;
  headerRight: string;
  footerLeft: string;
  footerCenter: string;
  footerRight: string;
}
