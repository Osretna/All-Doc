import { DbTable, DbField } from '../../../types';

export type AccessRibbonTab = 
  | 'home' 
  | 'create' 
  | 'external' 
  | 'tools' 
  | 'table-fields' 
  | 'table-design' 
  | 'query-design' 
  | 'form-design' 
  | 'report-design';

export type AccessViewMode = 
  | 'records' 
  | 'design' 
  | 'form' 
  | 'split-form' 
  | 'sql' 
  | 'report' 
  | 'relationships';

export interface DbRelationship {
  id: string;
  name: string;
  fromTable: string;
  fromField: string;
  toTable: string;
  toField: string;
  type: 'one-to-many' | 'one-to-one' | 'many-to-many';
  enforceIntegrity: boolean;
  cascadeUpdate?: boolean;
  cascadeDelete?: boolean;
}

export interface AccessQuery {
  id: string;
  name: string;
  type: 'select' | 'make-table' | 'update' | 'append' | 'delete';
  sourceTable: string;
  fields: string[];
  sql: string;
  criteria?: Record<string, string>;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface AccessFormDef {
  id: string;
  name: string;
  sourceTable: string;
  type: 'single' | 'split' | 'multiple';
  fields: string[];
  theme?: string;
}

export interface AccessReportDef {
  id: string;
  name: string;
  sourceTable: string;
  groupBy?: string;
  fields: string[];
  showTotals?: boolean;
  orientation?: 'portrait' | 'landscape';
}

export interface VbaModuleDef {
  id: string;
  name: string;
  type: 'standard' | 'form' | 'class';
  code: string;
}
