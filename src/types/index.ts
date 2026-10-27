export type OfficeAppId = 
  | 'docs' 
  | 'sheets' 
  | 'slides' 
  | 'notes' 
  | 'base' 
  | 'pdf' 
  | 'photo';

export type MainNavSection = 
  | 'office' 
  | 'hosting' 
  | 'domains' 
  | 'email' 
  | 'mollak' 
  | 'custom-solutions' 
  | 'sovereign-vault';

export type RibbonTab = 
  | 'file' 
  | 'home' 
  | 'insert' 
  | 'layout' 
  | 'design' 
  | 'transitions' 
  | 'animations' 
  | 'slideshow' 
  | 'formulas' 
  | 'data' 
  | 'create' 
  | 'external-data' 
  | 'database-tools' 
  | 'references'
  | 'mailings'
  | 'review' 
  | 'view';

export interface AppThemeConfig {
  id: OfficeAppId;
  name: string;
  nameEn: string;
  msEquivalent: string;
  primaryColor: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  iconName: string;
  description: string;
}

export interface DocTemplate {
  id: string;
  title: string;
  category: string;
  preview: string;
  content: string;
}

export interface SheetCell {
  value: string;
  formula?: string;
  format?: 'text' | 'currency-sar' | 'currency-egp' | 'currency-usd' | 'percent' | 'number' | 'accounting' | 'date' | 'fraction' | 'scientific';
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  align?: 'right' | 'center' | 'left';
  verticalAlign?: 'top' | 'middle' | 'bottom';
  wrapText?: boolean;
  bg?: string;
  color?: string;
  fontSize?: number;
  fontFamily?: string;
  border?: 'all' | 'bottom' | 'top' | 'thick-bottom' | 'double-bottom' | 'outside' | 'none' | 'left' | 'right';
  textRotation?: number;
  comment?: string;
  sparkline?: { type: 'line' | 'column' | 'winloss'; range: string };
  validation?: { type: 'list' | 'number'; values: string[] };
  isMergeParent?: boolean;
  mergeColSpan?: number;
  mergeRowSpan?: number;
  mergedWith?: string;
  decimalPlaces?: number;
  image?: string;
}

export type SheetData = { [cellId: string]: SheetCell };

export interface SlideItem {
  id: string;
  title: string;
  subtitle: string;
  body: string[];
  layout: 'title' | 'content' | 'split' | 'highlight' | 'quote' | 'comparison' | 'custom';
  notes: string;
  theme: 'blue' | 'emerald' | 'amber' | 'dark' | 'purple' | 'crimson' | 'custom';
  transition?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  textColor?: string;
  titleColor?: string;
  hasCardFrame?: boolean;
  cardBg?: string;
  cardBorder?: string;
  fontFamily?: string;
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  notebook: string;
  section: string;
  tags: string[];
  hasAudio?: boolean;
  audioDuration?: string;
  updatedAt: string;
}

export interface DbField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'currency' | 'date' | 'boolean' | 'select';
  options?: string[];
  primaryKey?: boolean;
}

export interface DbTable {
  id: string;
  name: string;
  label: string;
  fields: DbField[];
  records: Array<{ id: string; [key: string]: any }>;
}

export interface HostingPlan {
  id: string;
  name: string;
  tagline: string;
  cpu: string;
  ram: string;
  storage: string;
  bandwidth: string;
  features: string[];
  priceMonthly: number;
  popular?: boolean;
}
