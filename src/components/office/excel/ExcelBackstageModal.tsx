import React, { useState } from 'react';
import {
  Search,
  FolderOpen,
  Save,
  Download,
  Printer,
  Share2,
  FileCode,
  ShieldCheck,
  X,
  Check,
  CheckCircle2,
  FileCheck2,
  Table,
  BarChart2,
  TrendingUp,
  Calendar,
  DollarSign,
  Calculator,
  Layers,
  ArrowRight
} from 'lucide-react';
import { SheetData } from '../../../types';
import { EXCEL_TEMPLATES, EXCEL_SUGGESTED_CATEGORIES, ExcelTemplateDefinition } from './excelTemplates';
import * as XLSX from 'xlsx';
import { parseExcelFile } from '../../../utils/fileImport';
import { saveFileDirectlyToDevice } from '../../../utils/fileSaver';

export type ExcelBackstageTab =
  | 'home'
  | 'new'
  | 'open'
  | 'info'
  | 'save'
  | 'saveas'
  | 'history'
  | 'print'
  | 'share'
  | 'export'
  | 'publish'
  | 'close'
  | 'account'
  | 'options';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  onSelectTemplate: (template: ExcelTemplateDefinition) => void;
  onLoadExcelData: (sheets: Record<string, { label: string; data: SheetData }>, title: string) => void;
  onExport: (format: 'xlsx' | 'xlsm' | 'xlsb' | 'xls' | 'csv' | 'tsv' | 'ods' | 'xml' | 'html' | 'pdf') => void;
  sheetsData?: Record<string, { label: string; data: SheetData }>;
  isSaved?: boolean;
  onQuickSave?: () => void;
}

/**
 * High-fidelity miniature renderer for Excel 365 template thumbnails
 * Matches exact designs from Microsoft Office 365 (image_9ec45994.png)
 */
const TemplateThumbnailPreview: React.FC<{ template: ExcelTemplateDefinition }> = ({ template }) => {
  const { id } = template;

  // 1. Welcome to Excel (Take a tour)
  if (id === 'take_a_tour') {
    return (
      <div className="w-full h-full flex flex-col justify-between bg-white select-none">
        <div className="p-2.5 pt-3">
          <div className="text-sm font-semibold text-[#008272] tracking-tight">Take a tour</div>
        </div>
        <div className="h-10 bg-[#107c41] relative flex items-center justify-end px-3">
          <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-xs">
            <span className="text-[#107c41] font-bold text-sm leading-none">➔</span>
          </div>
        </div>
      </div>
    );
  }

  // 2. Power Query Tutorial
  if (id === 'power_query_tutorial') {
    return (
      <div className="w-full h-full flex flex-col justify-between bg-white select-none">
        <div className="p-2.5 pt-2">
          <div className="text-[10px] text-gray-500 font-medium">Get to know</div>
          <div className="text-sm font-semibold text-[#107c41] tracking-tight">Power Query</div>
        </div>
        <div className="h-10 bg-[#107c41] relative flex items-center justify-end px-3">
          <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-xs text-[#107c41]">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
              <path d="M14 14l2 2 4-4" strokeWidth="2.5" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  // 3. PivotTable Tutorial
  if (id === 'pivottable_tutorial' || id === 'pivot_advanced_guide') {
    return (
      <div className="w-full h-full flex flex-col justify-between bg-white select-none">
        <div className="p-2.5 pt-2">
          <div className="text-[10px] text-gray-500 font-medium">
            {id === 'pivot_advanced_guide' ? 'Get more out of' : 'Make your first'}
          </div>
          <div className="text-sm font-semibold text-[#107c41] tracking-tight">
            {id === 'pivot_advanced_guide' ? 'PivotTables' : 'PivotTable'}
          </div>
        </div>
        <div className="h-10 bg-[#107c41] relative flex items-center justify-end px-3">
          <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-xs text-[#107c41]">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="1.5" />
              <path d="M3 9h18M9 9v12" />
              <path d="M14 13l2 2 2-2" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  // 4. Going Beyond Pie Charts
  if (id === 'beyond_pie_charts') {
    return (
      <div className="w-full h-full flex flex-col justify-between bg-white select-none">
        <div className="p-2.5 pt-2">
          <div className="text-[10px] text-gray-500 font-medium">Going beyond</div>
          <div className="text-sm font-semibold text-[#107c41] tracking-tight">Pie charts</div>
        </div>
        <div className="h-10 bg-[#107c41] relative flex items-center justify-end px-3">
          <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-xs text-[#107c41]">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="9" fill="#107c41" opacity="0.3" />
              <path d="M12 3a9 9 0 0 1 9 9h-5a4 4 0 0 0-4-4V3z" fill="#ffffff" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  // 5. Seasonal Photo Calendar
  if (id === 'seasonal_photo_calendar') {
    return (
      <div className="w-full h-full flex flex-col bg-white p-1.5 select-none text-[8px]">
        <div className="flex items-center justify-between pb-1 border-b border-gray-100">
          <span className="font-bold text-gray-800 text-[9px]">April 20XX</span>
          <div className="px-1.5 py-0.5 rounded-xs bg-gradient-to-r from-amber-400 via-emerald-400 to-sky-400 text-white font-extrabold text-[7px] tracking-widest shadow-xs">
            SPRING
          </div>
        </div>
        <div className="grid grid-cols-7 gap-0.5 text-center text-gray-400 mt-1 text-[6px]">
          <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
        </div>
        <div className="grid grid-cols-7 gap-0.5 mt-0.5 text-center text-[7px] text-gray-600">
          <span className="text-gray-300">29</span><span className="text-gray-300">30</span><span className="text-gray-300">31</span>
          <span className="bg-emerald-50 text-emerald-800 font-semibold rounded-xs">1</span>
          <span>2</span><span>3</span><span>4</span>
          <span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span><span>11</span>
          <span>12</span><span>13</span><span>14</span><span>15</span><span>16</span><span>17</span><span>18</span>
        </div>
      </div>
    );
  }

  // 6. Personal Monthly Budget (Matching image_9ec45994.png)
  if (id === 'personal_monthly_budget') {
    return (
      <div className="w-full h-full flex flex-col bg-white p-1.5 select-none text-[8px]">
        <div className="font-bold text-[#0369a1] text-[9px] mb-1">Personal Monthly Budget</div>
        {/* Two KPI Summary Boxes */}
        <div className="grid grid-cols-2 gap-1 mb-1">
          <div className="bg-[#e0f2fe] p-1 rounded-xs border border-[#bae6fd]">
            <div className="text-[6px] text-gray-500 font-medium truncate">Projected Monthly Income</div>
            <div className="font-bold text-[#0369a1] text-[8px]">$5,000.00</div>
          </div>
          <div className="bg-[#f0f9ff] p-1 rounded-xs border border-[#e0f2fe]">
            <div className="text-[6px] text-gray-500 font-medium truncate">Actual Monthly Income</div>
            <div className="font-bold text-gray-800 text-[8px]">$5,450.00</div>
          </div>
        </div>
        {/* Two Side-by-side Tables */}
        <div className="grid grid-cols-2 gap-1 text-[6px]">
          <div>
            <div className="bg-[#0284c7] text-white font-bold px-1 py-0.5 rounded-t-xs">Housing</div>
            <div className="border border-t-0 border-gray-200 px-1 py-0.5 text-gray-600 bg-gray-50">Rent: $1,600</div>
          </div>
          <div>
            <div className="bg-[#0284c7] text-white font-bold px-1 py-0.5 rounded-t-xs">Food</div>
            <div className="border border-t-0 border-gray-200 px-1 py-0.5 text-gray-600 bg-gray-50">Groceries: $620</div>
          </div>
        </div>
      </div>
    );
  }

  // 7. Seasonal Illustrated Any Year Calendar
  if (id === 'seasonal_illustrated_calendar') {
    return (
      <div className="w-full h-full flex flex-col bg-white p-1.5 select-none text-[8px]">
        <div className="flex items-center justify-between pb-1 border-b border-sky-100">
          <span className="font-bold text-sky-900 text-[9px]">January 20XX</span>
          <span className="text-xs">🏘️❄️</span>
        </div>
        <div className="grid grid-cols-7 gap-0.5 text-center text-sky-700 bg-sky-50 py-0.5 rounded-xs mt-1 text-[6px]">
          <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
        </div>
        <div className="grid grid-cols-7 gap-0.5 mt-1 text-center text-[7px] text-gray-600">
          <span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span>
          <span>11</span><span>12</span><span>13</span><span>14</span><span>15</span><span>16</span><span>17</span>
        </div>
      </div>
    );
  }

  // 8. Any Year One-Month Calendar
  if (id === 'any_year_one_month_calendar') {
    return (
      <div className="w-full h-full flex flex-col bg-white p-1.5 select-none text-[8px]">
        <div className="flex items-center gap-1.5 pb-1 border-b border-gray-200">
          <span className="text-[7px] text-gray-400 font-semibold tracking-wider">YEAR</span>
          <span className="font-bold text-gray-800 text-[9px]">JANUARY</span>
        </div>
        <div className="grid grid-cols-7 gap-0.5 text-center text-gray-500 bg-gray-100 py-0.5 rounded-xs mt-1 text-[6px] font-semibold">
          <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
        </div>
        <div className="grid grid-cols-7 gap-0.5 mt-1 text-center text-[7px] text-gray-700">
          <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span>
          <span>8</span><span>9</span><span>10</span><span>11</span><span>12</span><span>13</span><span>14</span>
        </div>
      </div>
    );
  }

  // 9. Academic Calendar (Solid Black Bar Theme)
  if (id === 'academic_calendar') {
    return (
      <div className="w-full h-full flex flex-col bg-white select-none">
        <div className="bg-black text-white px-2 py-1 flex items-center justify-between text-[9px] font-bold">
          <span>September</span>
          <span className="text-[7px] font-normal tracking-wider">20YY</span>
        </div>
        <div className="p-1.5 flex-1 flex flex-col">
          <div className="grid grid-cols-7 gap-0.5 text-center text-gray-400 text-[6px] font-bold mb-1">
            <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
          </div>
          <div className="grid grid-cols-7 gap-0.5 text-center text-[7px] text-gray-800">
            <span>01</span><span>02</span><span>03</span><span>04</span><span>05</span><span>06</span><span>07</span>
            <span>08</span><span>09</span>
            <span className="bg-amber-200 font-bold rounded-xs">10</span>
            <span>11</span><span>12</span><span>13</span><span>14</span>
          </div>
        </div>
      </div>
    );
  }

  // 10. Monthly Company Budget (Caneiro Group)
  if (id === 'monthly_company_budget') {
    return (
      <div className="w-full h-full flex flex-col bg-white p-1.5 select-none text-[8px]">
        <div className="text-center pb-1">
          <div className="text-[6px] text-gray-400 font-semibold tracking-wider">CANEIRO GROUP</div>
          <div className="font-bold text-[#1e3a8a] text-[9px]">MONTHLY BUDGET</div>
        </div>
        <div className="bg-[#1e40af] text-white text-[6px] font-bold px-1 py-0.5 rounded-t-xs flex justify-between">
          <span>BUDGET TOTALS</span>
          <span>ACTUAL</span>
        </div>
        <div className="border border-t-0 border-gray-200 bg-gray-50 px-1 py-0.5 text-[6px] text-gray-600 flex justify-between">
          <span>Income: $75,000</span>
          <span className="font-bold text-emerald-700">$78,450</span>
        </div>
        {/* Miniature Chart Graphic */}
        <div className="mt-1 flex items-end justify-center gap-1.5 h-6 bg-slate-50 border border-gray-100 rounded-xs px-2 py-0.5">
          <div className="w-2.5 h-4 bg-[#1e40af] rounded-t-xs" />
          <div className="w-2.5 h-5 bg-amber-400 rounded-t-xs" />
          <div className="w-2.5 h-3 bg-[#1e40af] rounded-t-xs" />
          <div className="w-2.5 h-5 bg-amber-400 rounded-t-xs" />
        </div>
      </div>
    );
  }

  // 11. Household Monthly Budget (Budget Overview)
  if (id === 'household_monthly_budget') {
    return (
      <div className="w-full h-full flex flex-col bg-white p-1.5 select-none text-[8px]">
        <div className="flex items-center gap-1 pb-1">
          <div className="w-3.5 h-3.5 bg-emerald-700 rounded-xs flex items-center justify-center text-white text-[7px] font-bold">
            ▲
          </div>
          <div className="font-bold text-emerald-900 text-[8px]">BUDGET OVERVIEW</div>
        </div>
        <div className="bg-[#dcfce7] p-1 rounded-xs border border-emerald-200 mb-1 text-[6px]">
          <div className="text-emerald-800 font-medium">Balance: $1,585</div>
        </div>
        <div className="grid grid-cols-2 gap-1 text-[6px]">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xs p-0.5">Income: $6,000</div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xs p-0.5">Expenses: $4,415</div>
        </div>
      </div>
    );
  }

  // 12. Premium Weekly Chore Schedule
  if (id === 'weekly_chore_schedule') {
    return (
      <div className="w-full h-full flex flex-col bg-white select-none">
        <div className="bg-[#ecfccb] border-b border-[#d9f99d] px-2 py-1 flex items-center justify-between">
          <span className="font-bold text-[#3f6212] text-[8px]">Weekly chore schedule</span>
          <span className="text-[8px]">🧹</span>
        </div>
        <div className="p-1 flex-1 flex flex-col justify-between text-[6px]">
          <div className="grid grid-cols-4 bg-[#65a30d] text-white font-bold p-0.5 rounded-t-xs text-center">
            <span className="col-span-2 text-left pl-1">Task</span><span>Assignee</span><span>Status</span>
          </div>
          <div className="grid grid-cols-4 border border-t-0 border-gray-200 p-0.5 text-gray-700 bg-gray-50">
            <span className="col-span-2 truncate">Living Room</span><span>Alex</span><span className="text-emerald-700 font-bold text-center">✓</span>
          </div>
          <div className="grid grid-cols-4 border border-t-0 border-gray-200 p-0.5 text-gray-700">
            <span className="col-span-2 truncate">Kitchen Counter</span><span>Sarah</span><span className="text-emerald-700 font-bold text-center">✓</span>
          </div>
        </div>
      </div>
    );
  }

  // 13. Basic Business Invoice
  if (id === 'basic_business_invoice') {
    return (
      <div className="w-full h-full flex flex-col bg-white p-1.5 select-none text-[8px]">
        <div className="flex items-center justify-between pb-1 border-b border-gray-100">
          <div className="w-7 h-4 bg-[#0284c7] text-white text-[5px] font-bold flex items-center justify-center rounded-xs text-center leading-none">
            LOGO
          </div>
          <div className="text-right">
            <div className="font-bold text-[#0369a1] text-[8px]">Company Name</div>
            <div className="text-[5px] text-gray-400">INVOICE # 1001</div>
          </div>
        </div>
        <div className="mt-1 flex-1">
          <div className="bg-[#0284c7] text-white text-[6px] font-bold px-1 py-0.5 rounded-t-xs flex justify-between">
            <span>ITEM DESCRIPTION</span>
            <span>AMOUNT</span>
          </div>
          <div className="border border-t-0 border-gray-200 text-[6px] text-gray-600 bg-sky-50/50 px-1 py-0.5 flex justify-between">
            <span>Architecture Consulting</span>
            <span className="font-medium">$1,500.00</span>
          </div>
          <div className="border border-t-0 border-gray-200 text-[6px] text-gray-600 px-1 py-0.5 flex justify-between">
            <span>Software Engineering</span>
            <span className="font-medium">$3,000.00</span>
          </div>
        </div>
      </div>
    );
  }

  // 14. Basic Balance Sheet
  if (id === 'basic_balance_sheet') {
    return (
      <div className="w-full h-full flex flex-col bg-white p-1.5 select-none text-[8px]">
        <div className="font-bold text-[#1e3a8a] text-[9px] pb-1 border-b border-gray-100">Assets & Balance</div>
        {/* Horizontal Dual Bar Chart Graphic */}
        <div className="mt-1 space-y-1 bg-gray-50 p-1 rounded-xs border border-gray-100">
          <div className="flex items-center gap-1 text-[6px]">
            <span className="w-8 text-gray-500 truncate">Cash</span>
            <div className="h-2 bg-[#1e40af] rounded-r-xs w-16" />
          </div>
          <div className="flex items-center gap-1 text-[6px]">
            <span className="w-8 text-gray-500 truncate">Receivable</span>
            <div className="h-2 bg-[#3b82f6] rounded-r-xs w-10" />
          </div>
        </div>
        <div className="mt-1 text-[6px] flex justify-between text-gray-700 font-bold border-t border-gray-200 pt-0.5">
          <span>Total Assets</span>
          <span className="text-[#1e3a8a]">$233,000</span>
        </div>
      </div>
    );
  }

  // 15. Student Schedule (Class Schedule)
  if (id === 'student_schedule') {
    return (
      <div className="w-full h-full flex flex-col bg-white p-1.5 select-none text-[8px]">
        <div className="font-serif italic font-bold text-amber-900 text-[10px] pb-1 border-b border-amber-100">
          Class Schedule
        </div>
        <div className="grid grid-cols-4 gap-0.5 mt-1 text-[6px]">
          <div className="bg-amber-100 font-bold p-0.5 text-center rounded-xs text-amber-900">Mon</div>
          <div className="bg-amber-100 font-bold p-0.5 text-center rounded-xs text-amber-900">Tue</div>
          <div className="bg-amber-100 font-bold p-0.5 text-center rounded-xs text-amber-900">Wed</div>
          <div className="bg-amber-100 font-bold p-0.5 text-center rounded-xs text-amber-900">Thu</div>
          <div className="bg-sky-100 text-sky-900 p-0.5 rounded-xs truncate">CS 101</div>
          <div className="bg-yellow-100 text-yellow-900 p-0.5 rounded-xs truncate">Math</div>
          <div className="bg-sky-100 text-sky-900 p-0.5 rounded-xs truncate">CS 101</div>
          <div className="bg-yellow-100 text-yellow-900 p-0.5 rounded-xs truncate">Math</div>
        </div>
      </div>
    );
  }

  // 16. Weekly Attendance Report
  if (id === 'weekly_attendance_report') {
    return (
      <div className="w-full h-full flex bg-white select-none">
        <div className="w-2.5 bg-[#ca8a04]" />
        <div className="flex-1 p-1.5 flex flex-col justify-between text-[8px]">
          <div className="font-bold text-[#a16207] text-[8px]">Weekly Attendance Report</div>
          <div className="grid grid-cols-5 gap-0.5 text-center text-[6px] text-gray-500 bg-gray-100 py-0.5 rounded-xs">
            <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span>
          </div>
          <div className="grid grid-cols-5 gap-0.5 text-center text-[6px] text-emerald-700 font-bold">
            <span className="bg-emerald-50 rounded-xs">P</span>
            <span className="bg-emerald-50 rounded-xs">P</span>
            <span className="bg-emerald-50 rounded-xs">P</span>
            <span className="bg-emerald-50 rounded-xs">P</span>
            <span className="bg-emerald-50 rounded-xs">P</span>
          </div>
        </div>
      </div>
    );
  }

  // 17. Simple Invoice
  if (id === 'simple_invoice') {
    return (
      <div className="w-full h-full flex flex-col bg-white p-1.5 select-none text-[8px]">
        <div className="flex items-center gap-1 pb-1 border-b border-gray-100">
          <div className="w-3.5 h-3.5 rounded-full border border-gray-400 flex items-center justify-center text-[7px]">
            ❀
          </div>
          <div className="font-bold text-gray-800 text-[8px]">Elegant Embrace INVOICE</div>
        </div>
        <div className="mt-1 border border-gray-200 text-[6px] rounded-xs overflow-hidden">
          <div className="bg-gray-100 font-bold px-1 py-0.5 flex justify-between">
            <span>Description</span>
            <span>Total</span>
          </div>
          <div className="px-1 py-0.5 flex justify-between text-gray-600 border-t border-gray-100">
            <span>Brand Identity</span>
            <span>$2,500</span>
          </div>
        </div>
      </div>
    );
  }

  // 18. Sales Invoice Tracker
  if (id === 'sales_invoice_tracker') {
    return (
      <div className="w-full h-full flex flex-col bg-white select-none">
        <div className="bg-[#0284c7] text-white px-2 py-1 text-[8px] font-bold">company name</div>
        <div className="p-1.5 text-[6px] flex flex-col gap-1">
          <div className="flex justify-between border-b border-gray-100 pb-0.5 text-gray-400 font-semibold">
            <span>Invoice #</span><span>Amount</span><span>Status</span>
          </div>
          <div className="flex justify-between text-gray-700 items-center">
            <span>INV-1001</span><span>$12,500</span>
            <span className="bg-emerald-100 text-emerald-800 font-bold px-1 rounded-xs text-[5px]">PAID</span>
          </div>
        </div>
      </div>
    );
  }

  // 19. Home Inventory
  if (id === 'home_inventory') {
    return (
      <div className="w-full h-full flex flex-col bg-white select-none">
        <div className="bg-[#0d9488] text-white px-2 py-1 flex justify-between items-center text-[8px] font-bold">
          <span>Home Inventory</span>
          <span className="bg-[#042f2e] px-1 py-0.5 rounded-xs text-[7px] text-emerald-300">$4,040.00</span>
        </div>
        <div className="p-1.5 text-[6px] flex flex-col gap-1">
          <div className="flex justify-between text-gray-500 font-medium">
            <span>Item: Smart 4K TV</span>
            <span className="font-bold text-gray-800">$1,800</span>
          </div>
          <div className="flex justify-between text-gray-500 font-medium">
            <span>Item: Workstation</span>
            <span className="font-bold text-gray-800">$2,240</span>
          </div>
        </div>
      </div>
    );
  }

  // 20. Inventory List with Highlight
  if (id === 'inventory_list_with_highlight') {
    return (
      <div className="w-full h-full flex flex-col bg-white select-none">
        <div className="bg-[#65a30d] text-white px-2 py-1 text-[8px] font-bold">Inventory list</div>
        <div className="p-1.5 text-[6px] flex flex-col gap-1">
          <div className="flex justify-between border-b border-gray-100 pb-0.5 text-gray-500 font-semibold">
            <span>SKU</span><span>Stock</span><span>Status</span>
          </div>
          <div className="flex justify-between items-center text-gray-700">
            <span>SKU-001</span><span>12</span>
            <span className="bg-rose-100 text-rose-800 font-bold px-1 rounded-xs text-[5px]">REORDER</span>
          </div>
        </div>
      </div>
    );
  }

  // 21. Employee Absence Schedule
  if (id === 'employee_absence_schedule') {
    return (
      <div className="w-full h-full flex flex-col bg-white p-1.5 select-none text-[8px]">
        <div className="font-bold text-blue-800 text-[9px] pb-1 border-b border-blue-100">January</div>
        <div className="flex items-center gap-1 my-1 text-[5px]">
          <span className="bg-emerald-100 text-emerald-800 px-1 rounded-xs">V: Vacation</span>
          <span className="bg-sky-100 text-sky-800 px-1 rounded-xs">P: Personal</span>
          <span className="bg-rose-100 text-rose-800 px-1 rounded-xs">S: Sick</span>
        </div>
        <div className="grid grid-cols-7 gap-0.5 text-center text-[6px]">
          <span className="bg-emerald-50 text-emerald-800 font-bold">V</span>
          <span className="bg-emerald-50 text-emerald-800 font-bold">V</span>
          <span className="bg-gray-100 text-gray-400">-</span>
          <span className="bg-sky-50 text-sky-800 font-bold">P</span>
        </div>
      </div>
    );
  }

  // 22. Loan Calculator
  if (id === 'loan_calculator') {
    return (
      <div className="w-full h-full flex flex-col bg-white select-none">
        <div className="bg-[#ea580c] text-white px-2 py-1 text-[8px] font-bold">Simple loan calculator</div>
        <div className="p-1.5 text-[6px] flex items-center justify-between">
          <div>
            <div className="text-gray-400">Loan: $50,000</div>
            <div className="font-bold text-amber-900 text-[8px] mt-0.5">Pmt: $978.31</div>
          </div>
          {/* Miniature Repayment Bar */}
          <div className="flex items-end gap-0.5 h-6">
            <div className="w-1.5 h-6 bg-[#ea580c] rounded-t-xs" />
            <div className="w-1.5 h-5 bg-[#f97316] rounded-t-xs" />
            <div className="w-1.5 h-4 bg-[#fb923c] rounded-t-xs" />
            <div className="w-1.5 h-3 bg-[#fdba74] rounded-t-xs" />
          </div>
        </div>
      </div>
    );
  }

  // 23. Loan Amortization Schedule
  if (id === 'loan_amortization_schedule') {
    return (
      <div className="w-full h-full flex flex-col bg-white p-1.5 select-none text-[8px]">
        <div className="flex items-center gap-1 pb-1 border-b border-emerald-100">
          <span className="text-[10px]">🏛️</span>
          <span className="font-bold text-emerald-900 text-[8px]">Loan Amortization</span>
        </div>
        <div className="grid grid-cols-2 gap-1 my-1 text-[6px]">
          <div className="bg-emerald-50 p-0.5 rounded-xs border border-emerald-200">
            <div className="text-gray-500">Values</div>
            <div className="font-bold text-gray-800">$50,000</div>
          </div>
          <div className="bg-emerald-50 p-0.5 rounded-xs border border-emerald-200">
            <div className="text-gray-500">Summary</div>
            <div className="font-bold text-emerald-800">$978/mo</div>
          </div>
        </div>
      </div>
    );
  }

  // 24. Bill Paying Checklist
  if (id === 'bill_paying_checklist') {
    return (
      <div className="w-full h-full flex flex-col bg-white p-1.5 select-none text-[8px]">
        <div className="font-serif italic font-bold text-amber-800 text-[9px] pb-1 border-b border-amber-100">
          Bill Paying checklist
        </div>
        <div className="grid grid-cols-3 gap-0.5 text-center mt-1 text-[6px]">
          <div className="bg-orange-100 text-orange-900 font-bold p-0.5 rounded-xs">Jan</div>
          <div className="bg-rose-100 text-rose-900 font-bold p-0.5 rounded-xs">Feb</div>
          <div className="bg-yellow-100 text-yellow-900 font-bold p-0.5 rounded-xs">Mar</div>
          <div className="text-gray-600 bg-gray-50 p-0.5">$145</div>
          <div className="text-gray-600 bg-gray-50 p-0.5">$160</div>
          <div className="text-gray-600 bg-gray-50 p-0.5">$135</div>
        </div>
      </div>
    );
  }

  // 25. Household To-Do List
  if (id === 'household_todo_list') {
    return (
      <div className="w-full h-full flex flex-col bg-white p-1.5 select-none text-[8px]">
        <div className="flex items-center gap-1 pb-1 border-b border-teal-100">
          <span className="text-[10px]">📋</span>
          <span className="font-bold text-teal-900 text-[8px]">To-do list</span>
        </div>
        <div className="flex gap-1 my-0.5 text-[5px]">
          <span className="bg-emerald-100 text-emerald-800 px-1 rounded-xs font-bold">Due today: 1</span>
          <span className="bg-rose-100 text-rose-800 px-1 rounded-xs font-bold">Overdue: 3</span>
        </div>
        <div className="text-[6px] text-gray-700 space-y-0.5 mt-0.5">
          <div className="flex items-center gap-1"><span className="text-emerald-600 font-bold">✓</span> <span className="truncate">Inspect HVAC Filters</span></div>
          <div className="flex items-center gap-1"><span className="text-gray-400">○</span> <span className="truncate">Clean Garage</span></div>
        </div>
      </div>
    );
  }

  // 26. Gantt Project Planner
  if (id === 'gantt_project_planner') {
    return (
      <div className="w-full h-full flex flex-col bg-white p-1.5 select-none text-[8px]">
        <div className="font-bold text-purple-900 text-[8px] pb-1 border-b border-purple-100">Project Planner</div>
        <div className="space-y-1 mt-1 text-[6px]">
          <div className="flex items-center gap-1">
            <span className="w-10 text-gray-500 truncate">Design</span>
            <div className="h-2 bg-purple-600 rounded-xs w-16" />
          </div>
          <div className="flex items-center gap-1">
            <span className="w-10 text-gray-500 truncate">Develop</span>
            <div className="h-2 bg-amber-500 rounded-xs w-12 ml-4" />
          </div>
        </div>
      </div>
    );
  }

  // 27. Agile Gantt Chart
  if (id === 'agile_gantt_chart') {
    return (
      <div className="w-full h-full flex flex-col bg-white select-none">
        <div className="bg-slate-800 text-white px-2 py-1 text-[8px] font-bold">Agile Gantt</div>
        <div className="p-1.5 space-y-1 text-[6px]">
          <div className="flex items-center gap-1">
            <span className="w-8 text-gray-500 truncate">Sprint 1</span>
            <div className="h-2 bg-sky-500 rounded-xs w-14" />
          </div>
          <div className="flex items-center gap-1">
            <span className="w-8 text-gray-500 truncate">Sprint 2</span>
            <div className="h-2 bg-emerald-500 rounded-xs w-10 ml-6" />
          </div>
        </div>
      </div>
    );
  }

  // Default Fallback Preview
  return (
    <div className="w-full h-full flex flex-col justify-between p-2 bg-white select-none">
      <div className="font-bold text-xs text-gray-800 truncate">{template.titleEn}</div>
      <div className="w-full h-1 rounded-full mt-auto" style={{ backgroundColor: template.accentColor }} />
    </div>
  );
};

export const ExcelBackstageModal: React.FC<Props> = ({
  isOpen,
  onClose,
  documentTitle,
  onSelectTemplate,
  onLoadExcelData,
  onExport,
  sheetsData,
  isSaved = true,
  onQuickSave,
}) => {
  const [activeTab, setActiveTab] = useState<ExcelBackstageTab>('new');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loadingMsg, setLoadingMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Filter templates
  const filteredTemplates = EXCEL_TEMPLATES.filter((tmpl) => {
    const matchesSearch = searchQuery === '' || 
      tmpl.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      tmpl.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || tmpl.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const navItems: { id: ExcelBackstageTab; label: string; en: string }[] = [
    { id: 'home', label: 'الرئيسية', en: 'Home' },
    { id: 'new', label: 'جديد وقوالب', en: 'New' },
    { id: 'open', label: 'فتح مصنف', en: 'Open' },
    { id: 'info', label: 'معلومات المصنف', en: 'Info' },
    { id: 'save', label: 'حفظ محلي', en: 'Save' },
    { id: 'saveas', label: 'حفظ باسم', en: 'Save As' },
    { id: 'history', label: 'السجل', en: 'History' },
    { id: 'print', label: 'طباعة', en: 'Print' },
    { id: 'share', label: 'مشاركة', en: 'Share' },
    { id: 'export', label: 'تصدير', en: 'Export' },
    { id: 'publish', label: 'نشر', en: 'Publish' },
    { id: 'close', label: 'إغلاق', en: 'Close' },
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoadingMsg(`جاري استيراد ملف "${file.name}" بكافة التنسيقات والألوان والصيغ...`);
    try {
      const parsed = await parseExcelFile(file);
      const cleanTitle = file.name.replace(/\.[^/.]+$/, '');
      onLoadExcelData(parsed, cleanTitle);
      setLoadingMsg(null);
      onClose();
    } catch (err) {
      console.error(err);
      setLoadingMsg('حدث خطأ أثناء فك تشفير الملف، تأكد من سلامة امتداد الملف.');
      setTimeout(() => setLoadingMsg(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-[140] bg-black/60 backdrop-blur-xs flex animate-in fade-in select-none">
      {/* Left Office 365 Green Sidebar (matching image_f2ceac1d.png) */}
      <div className="w-56 sm:w-60 bg-[#107c41] text-white flex flex-col justify-between py-4 px-3 shadow-2xl shrink-0 overflow-y-auto">
        <div className="space-y-3">
          {/* Back Button (Circle with arrow) */}
          <div className="flex items-center gap-3 pb-2 border-b border-white/20">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full border border-white/40 hover:bg-white/20 flex items-center justify-center transition cursor-pointer text-white"
              title="الرجوع إلى جدول البيانات"
            >
              <span className="text-lg font-bold leading-none">←</span>
            </button>
            <div>
              <span className="font-bold text-sm block">Excel 365</span>
              <span className="text-[10px] text-white/70">MY-DOC Sovereign Office</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-0.5 text-xs">
            {navItems.map((item) => {
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'close') {
                      onClose();
                    } else if (item.id === 'save') {
                      if (onQuickSave) onQuickSave();
                      onClose();
                    } else {
                      setActiveTab(item.id);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md font-medium text-right cursor-pointer transition ${
                    isSelected
                      ? 'bg-white text-[#107c41] font-bold shadow-md'
                      : 'hover:bg-white/10 text-white/90'
                  }`}
                >
                  <span className="text-xs">{item.en}</span>
                  <span className="text-[10px] opacity-75">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-white/20 text-[11px] text-white/70 space-y-1">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isSaved ? 'bg-emerald-300' : 'bg-amber-300 animate-pulse'}`} />
            <span>{isSaved ? 'تم حفظ التغييرات' : 'توجد تعديلات غير محفوظة'}</span>
          </div>
          <div className="truncate text-[10px]" title={documentTitle}>
            المصنف: {documentTitle}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-[#f8f9fa] overflow-y-auto p-6 sm:p-10 relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {loadingMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold text-sm flex items-center gap-3 animate-pulse">
            <span className="text-lg">⏳</span>
            <span>{loadingMsg}</span>
          </div>
        )}

        {/* TAB 1: NEW & TEMPLATES (Exact match to image_9ec45994.png) */}
        {(activeTab === 'new' || activeTab === 'home') && (
          <div>
            <div className="mb-6">
              <h1 className="text-3xl font-light text-gray-800 tracking-tight mb-2">New</h1>
            </div>

            {/* Top Featured Row: Blank workbook + Formula tutorial */}
            <div className="flex items-center gap-6 mb-8">
              {/* Blank workbook card */}
              <div
                onClick={() => {
                  onSelectTemplate(EXCEL_TEMPLATES[0]);
                  onClose();
                }}
                className="w-48 h-36 rounded-sm border border-gray-200 hover:border-emerald-600 hover:shadow-md transition cursor-pointer flex flex-col justify-between p-3 bg-white group"
              >
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-24 h-16 border border-gray-300 rounded-xs grid grid-cols-3 grid-rows-3 bg-white p-1 gap-0.5 group-hover:scale-105 transition-transform shadow-xs">
                    <div className="border-2 border-emerald-600 rounded-xs bg-emerald-50/50" />
                    <div className="border border-gray-200" /><div className="border border-gray-200" />
                    <div className="border border-gray-200" /><div className="border border-gray-200" /><div className="border border-gray-200" />
                    <div className="border border-gray-200" /><div className="border border-gray-200" /><div className="border border-gray-200" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-semibold text-gray-800">Blank workbook</div>
                  <div className="text-[10px] text-gray-500">مصنف فارغ</div>
                </div>
              </div>

              {/* Get started with Formulas (Formula tutorial) */}
              <div
                onClick={() => {
                  onSelectTemplate(EXCEL_TEMPLATES[1]);
                  onClose();
                }}
                className="w-48 h-36 rounded-sm border border-gray-200 hover:border-emerald-600 hover:shadow-md transition cursor-pointer flex flex-col justify-between overflow-hidden bg-white group"
              >
                <div className="p-3">
                  <div className="text-[10px] text-gray-500 font-medium">Get started with</div>
                  <div className="text-sm font-semibold text-[#107c41]">Formulas</div>
                </div>
                <div className="h-12 bg-[#107c41] relative flex items-center justify-end px-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-xs font-bold text-[#107c41] italic font-serif text-sm">
                    fx
                  </div>
                </div>
                <div className="p-1.5 text-center bg-gray-50 border-t border-gray-100">
                  <div className="text-xs font-semibold text-gray-800">Formula tutorial</div>
                  <div className="text-[10px] text-gray-500">دليل الصيغ والدوال</div>
                </div>
              </div>
            </div>

            {/* Search Bar matching image_9ec45994.png */}
            <div className="mb-4 max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for online templates (البحث عن قوالب إكسيل 365 عبر الإنترنت)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 pr-10 text-xs outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white"
                />
                <Search className="w-4 h-4 text-emerald-700 absolute right-3 top-2.5" />
              </div>
            </div>

            {/* Suggested searches pills matching image_9ec45994.png */}
            <div className="flex items-center gap-2 mb-6 flex-wrap text-xs">
              <span className="text-gray-500 font-bold">Suggested searches:</span>
              {EXCEL_SUGGESTED_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded transition cursor-pointer text-xs ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-700 text-white font-bold'
                      : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  {cat.en}
                </button>
              ))}
            </div>

            {/* Authentic Template Gallery Grid (Matching image_9ec45994.png) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {filteredTemplates.map((template) => {
                if (template.id === 'blank' || template.id === 'formula_tutorial') return null;
                return (
                  <div
                    key={template.id}
                    onClick={() => {
                      onSelectTemplate(template);
                      onClose();
                    }}
                    className="flex flex-col cursor-pointer group"
                  >
                    {/* Visual Card Box */}
                    <div className="w-full h-28 sm:h-32 bg-white border border-gray-200 rounded-sm shadow-xs overflow-hidden group-hover:border-emerald-600 group-hover:shadow-md transition-all relative">
                      <TemplateThumbnailPreview template={template} />
                    </div>

                    {/* Card Title Below Box (Authentic Excel 365 Style) */}
                    <div className="mt-1.5 px-0.5 text-center">
                      <div className="text-xs font-semibold text-gray-800 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                        {template.titleEn}
                      </div>
                      <div className="text-[10px] text-gray-500 line-clamp-1">
                        {template.title}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: OPEN */}
        {activeTab === 'open' && (
          <div>
            <h1 className="text-3xl font-light text-gray-800 tracking-tight mb-3">Open (فتح ملف)</h1>
            <p className="text-sm text-gray-600 mb-6">
              افتح أي مصنف إكسيل من جهازك بجميع التنسيقات والألوان والصيغ والدوال بدون فقدان أي بيانات.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
              <label className="p-6 rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 hover:bg-emerald-50 hover:border-emerald-600 cursor-pointer transition flex flex-col items-center justify-center text-center group">
                <input
                  type="file"
                  accept=".xlsx,.xls,.xlsm,.xlsb,.csv,.tsv,.ods,.xml"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <FolderOpen className="w-12 h-12 text-emerald-700 mb-3 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-gray-800 text-sm">استعراض هذا الجهاز (This PC)</span>
                <span className="text-xs text-gray-500 mt-1">يدعم .xlsx, .xls, .xlsm, .csv, .ods وكافة الامتدادات</span>
              </label>

              <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-xs">
                <div className="font-bold text-xs text-gray-700 mb-3">الملفات الأخيرة (Recent Workbooks)</div>
                <div className="space-y-2 text-xs">
                  <div
                    onClick={() => {
                      onSelectTemplate(EXCEL_TEMPLATES[1]);
                      onClose();
                    }}
                    className="p-2 rounded hover:bg-gray-50 border border-gray-100 flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <div className="font-bold text-gray-800">Formula tutorial1.xlsx</div>
                      <div className="text-[10px] text-gray-400">Office 365 Formulas Guide</div>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold">فتح</span>
                  </div>
                  <div
                    onClick={() => {
                      onSelectTemplate(EXCEL_TEMPLATES[7]);
                      onClose();
                    }}
                    className="p-2 rounded hover:bg-gray-50 border border-gray-100 flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <div className="font-bold text-gray-800">Personal monthly budget.xlsx</div>
                      <div className="text-[10px] text-gray-400">Personal Finance & KPI Tracker</div>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold">فتح</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: INFO */}
        {activeTab === 'info' && (
          <div>
            <h1 className="text-3xl font-light text-gray-800 tracking-tight mb-4">Info (معلومات المصنف)</h1>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs max-w-2xl space-y-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-emerald-600" />
                <div>
                  <div className="font-bold text-sm text-gray-800">المصنف محمي ويعمل بكامل وظائف إكسيل 365</div>
                  <div className="text-xs text-gray-500">حساب فوري للصيغ، وحفظ محلي مباشر على جهازك.</div>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-400 block">اسم الملف:</span>
                  <span className="font-bold text-gray-800">{documentTitle}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">أوراق العمل النشطة:</span>
                  <span className="font-bold text-gray-800">{sheetsData ? Object.keys(sheetsData).length : 1} ورقة</span>
                </div>
                <div>
                  <span className="text-gray-400 block">محرك العمليات:</span>
                  <span className="font-bold text-emerald-700">Infinity Calc Engine 365</span>
                </div>
                <div>
                  <span className="text-gray-400 block">الحالة:</span>
                  <span className="font-bold text-gray-800">{isSaved ? 'محفوظ محلياً' : 'غير محفوظ'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SAVE AS & EXPORT */}
        {(activeTab === 'saveas' || activeTab === 'export') && (
          <div>
            <h1 className="text-3xl font-light text-gray-800 tracking-tight mb-2">Save As & Export (حفظ وتصدير)</h1>
            <p className="text-sm text-gray-600 mb-6">
              احفظ ملفك مباشرة على جهازك بكافة صيغ وامتدادات ميكروسوفت إكسيل الرسمية.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-w-4xl">
              {[
                { format: 'xlsx' as const, name: 'Excel Workbook (*.xlsx)', desc: 'الصيغة الافتراضية القياسية لأوفيس 365' },
                { format: 'xlsm' as const, name: 'Excel Macro-Enabled (*.xlsm)', desc: 'مصنف إكسيل ممكن لوحدات الماكرو' },
                { format: 'xlsb' as const, name: 'Excel Binary Workbook (*.xlsb)', desc: 'المصنف الثنائي عالي السرعة للبيانات الضخمة' },
                { format: 'xls' as const, name: 'Excel 97-2003 Workbook (*.xls)', desc: 'صيغة التوافق للإصدارات القديمة' },
                { format: 'csv' as const, name: 'CSV (Comma delimited) (*.csv)', desc: 'ملف نصي مفصول بفواصل لقواعد البيانات' },
                { format: 'tsv' as const, name: 'Tab Delimited Text (*.tsv)', desc: 'ملف نصي مفصول بعلامات جدولة' },
                { format: 'ods' as const, name: 'OpenDocument Spreadsheet (*.ods)', desc: 'صيغة المستند المفتوح القياسية' },
                { format: 'xml' as const, name: 'Excel XML Spreadsheet (*.xml)', desc: 'بيانات XML مهيكلة متوافقة مع الأنظمة' },
                { format: 'html' as const, name: 'Single File Web Page (*.html)', desc: 'صفحة ويب تفاعلية لعرض الجداول' },
                { format: 'pdf' as const, name: 'PDF Document (*.pdf)', desc: 'مستند طباعة جاهز للمشاركة والأرشفة' },
              ].map((item) => (
                <div
                  key={item.format}
                  onClick={() => {
                    onExport(item.format);
                    onClose();
                  }}
                  className="p-3.5 bg-white rounded-lg border border-gray-200 hover:border-emerald-600 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-gray-800 group-hover:text-emerald-700 transition">
                        {item.name}
                      </span>
                      <Download className="w-3.5 h-3.5 text-gray-400 group-hover:text-emerald-700" />
                    </div>
                    <p className="text-[10px] text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-emerald-700 font-bold">
                    <span>حفظ وتنزيل فوري</span>
                    <span>↓</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
