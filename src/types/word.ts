export type RibbonTab = 
  | 'home' 
  | 'insert' 
  | 'design' 
  | 'layout' 
  | 'references' 
  | 'mailings' 
  | 'review' 
  | 'view';

export type ViewMode = 'print' | 'read' | 'web' | 'outline' | 'draft';

export type PageOrientation = 'portrait' | 'landscape';
export type PageSize = 'A4' | 'Letter' | 'Legal' | 'A3' | 'A5';

export interface PageSetup {
  orientation: PageOrientation;
  size: PageSize;
  margins: {
    top: number; // in cm
    bottom: number;
    left: number;
    right: number;
  };
  marginPreset: 'normal' | 'narrow' | 'moderate' | 'wide' | 'custom';
  columns: 1 | 2 | 3;
  lineNumbers: boolean;
  hyphenation: boolean;
}

export interface WatermarkConfig {
  type: 'none' | 'draft' | 'confidential' | 'urgent' | 'custom';
  text: string;
  color: string;
  opacity: number;
  layout: 'diagonal' | 'horizontal';
}

export interface PageBorderConfig {
  enabled: boolean;
  style: 'solid' | 'dashed' | 'double' | 'groove' | 'ridge' | 'art';
  width: number; // in px
  color: string;
  artStyle?: string;
}

export interface DocumentComment {
  id: string;
  author: string;
  date: string;
  text: string;
  selectedTextSnippet?: string;
  resolved: boolean;
}

export interface DocumentStats {
  pages: number;
  words: number;
  charactersNoSpaces: number;
  charactersWithSpaces: number;
  paragraphs: number;
  lines: number;
}

export interface DocumentMetadata {
  title: string;
  author: string;
  lastModified: string;
  created: string;
  language: 'ar-EG' | 'en-US' | 'ar-SA';
}
