import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  HelpCircle,
  Check,
  RotateCcw,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize2,
  Lock,
  EyeOff,
  Palette,
  Sparkles,
  Grid
} from 'lucide-react';
import { SheetCell } from '../../../types';

export type FormatCellsTab = 'number' | 'alignment' | 'font' | 'border' | 'fill' | 'protection';

export interface FormatCellsConfig {
  // Number
  category: 'general' | 'number' | 'currency' | 'accounting' | 'date' | 'time' | 'percentage' | 'fraction' | 'scientific' | 'text' | 'special' | 'custom';
  decimalPlaces: number;
  useThousandSeparator: boolean;
  negativeFormat: 'minus' | 'red' | 'parens' | 'red-parens';
  currencySymbol: string;
  dateFormat: string;
  timeFormat: string;
  fractionFormat: string;
  customFormat: string;

  // Alignment
  horizontalAlign: 'general' | 'left' | 'center' | 'right' | 'fill' | 'justify';
  verticalAlign: 'top' | 'middle' | 'bottom' | 'justify';
  wrapText: boolean;
  shrinkToFit: boolean;
  mergeCells: boolean;
  textDirection: 'context' | 'ltr' | 'rtl';
  textRotation: number;
  indent: number;

  // Font
  fontFamily: string;
  fontStyle: 'regular' | 'italic' | 'bold' | 'bold-italic';
  fontSize: number;
  underline: 'none' | 'single' | 'double';
  color: string;
  strikethrough: boolean;
  superscript: boolean;
  subscript: boolean;

  // Border
  borderTop: boolean;
  borderBottom: boolean;
  borderLeft: boolean;
  borderRight: boolean;
  borderInsideH: boolean;
  borderInsideV: boolean;
  borderDiagonalUp: boolean;
  borderDiagonalDown: boolean;
  borderStyle: 'thin' | 'medium' | 'thick' | 'double' | 'dashed' | 'dotted';
  borderColor: string;

  // Fill
  fillColor: string;
  patternStyle: string;
  patternColor: string;

  // Protection
  locked: boolean;
  hidden: boolean;
}

interface Props {
  isOpen: boolean;
  initialTab?: FormatCellsTab;
  currentCell?: SheetCell;
  cellAddress: string;
  sampleValue?: string | number;
  onClose: () => void;
  onApply: (config: FormatCellsConfig) => void;
}

const FONT_FAMILIES = [
  'Calibri',
  'Segoe UI',
  'Cairo',
  'Arial',
  'Tahoma',
  'Times New Roman',
  'Tajawal',
  'Amiri',
  'Courier New',
  'Georgia',
  'Almarai',
  'Readex Pro'
];

const FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];

const CURRENCY_SYMBOLS = [
  { label: 'ر.س (Saudi Riyal)', value: 'ر.س' },
  { label: '$ (USD Dollar)', value: '$' },
  { label: 'ج.م (Egyptian Pound)', value: 'ج.م' },
  { label: '€ (Euro)', value: '€' },
  { label: '£ (British Pound)', value: '£' },
  { label: 'د.إ (UAE Dirham)', value: 'د.إ' },
  { label: 'د.ك (Kuwaiti Dinar)', value: 'د.ك' },
  { label: '¥ (Japanese Yen)', value: '¥' },
  { label: 'None (بلا رمز)', value: '' },
];

const DATE_FORMATS = [
  { label: '2026-10-28 (ISO)', value: 'YYYY-MM-DD' },
  { label: '28/10/2026 (DD/MM/YYYY)', value: 'DD/MM/YYYY' },
  { label: '10/28/2026 (MM/DD/YYYY)', value: 'MM/DD/YYYY' },
  { label: '28-Oct-26', value: 'DD-MMM-YY' },
  { label: 'Wednesday, October 28, 2026', value: 'dddd, MMMM D, YYYY' },
];

const TIME_FORMATS = [
  { label: '13:30:55 (24-hour with seconds)', value: 'HH:mm:ss' },
  { label: '13:30 (24-hour)', value: 'HH:mm' },
  { label: '1:30 PM (12-hour)', value: 'h:mm A' },
  { label: '1:30:55 PM (12-hour with seconds)', value: 'h:mm:ss A' },
];

const FRACTION_FORMATS = [
  { label: 'Up to one digit (1/4)', value: '# ?/?' },
  { label: 'Up to two digits (21/25)', value: '# ??/??' },
  { label: 'As halves (1/2)', value: '# ?/2' },
  { label: 'As quarters (2/4)', value: '# ?/4' },
  { label: 'As eighths (4/8)', value: '# ?/8' },
];

const CUSTOM_PATTERNS = [
  'General',
  '0',
  '0.00',
  '#,##0',
  '#,##0.00',
  '#,##0;(#,##0);"-"',
  '#,##0.00;(#,##0.00);"-"',
  '$#,##0;($#,##0);"-"',
  '$#,##0.00;($#,##0.00);"-"',
  '0%',
  '0.00%',
  '0.00E+00',
  'YYYY-MM-DD',
  'DD/MM/YYYY HH:mm',
  '@'
];

const THEME_PALETTE = [
  ['#ffffff', '#000000', '#e7e6e6', '#44546a', '#4472c4', '#ed7d31', '#a5a5a5', '#ffc000', '#5b9bd5', '#70ad47'],
  ['#f2f2f2', '#7f7f7f', '#d0cece', '#d6dce4', '#d9e1f2', '#fce4d6', '#ededed', '#fff2cc', '#ddebf7', '#e2efda'],
  ['#d9d9d9', '#595959', '#aeabab', '#acb9ca', '#b4c6e7', '#f8cbad', '#dbdbdb', '#fee699', '#bdd7ee', '#c6e0b4'],
  ['#bfbfbf', '#3f3f3f', '#757171', '#8497b0', '#8ea9db', '#f4b084', '#c9c9c9', '#ffd966', '#9bc2e6', '#a9d08e'],
  ['#a6a6a6', '#262626', '#3a3838', '#333f48', '#305496', '#c65911', '#7b7b7b', '#bf8f00', '#2f5597', '#548235'],
  ['#7f7f7f', '#0c0c0c', '#161616', '#222a35', '#203764', '#843c0c', '#525252', '#7f6000', '#1f3864', '#375623'],
];

const STANDARD_COLORS = [
  '#c00000', '#ff0000', '#ffc000', '#ffff00', '#92d050', '#00b050', '#00b0f0', '#0070c0', '#002060', '#7030a0'
];

export const FormatCellsModal: React.FC<Props> = ({
  isOpen,
  initialTab = 'number',
  currentCell,
  cellAddress,
  sampleValue = '1000',
  onClose,
  onApply,
}) => {
  const [activeTab, setActiveTab] = useState<FormatCellsTab>(initialTab);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Initial config based on current cell
  const [config, setConfig] = useState<FormatCellsConfig>(() => {
    let cat: FormatCellsConfig['category'] = 'general';
    if (currentCell?.format === 'number') cat = 'number';
    else if (currentCell?.format?.includes('currency')) cat = 'currency';
    else if (currentCell?.format === 'accounting') cat = 'accounting';
    else if (currentCell?.format === 'percent') cat = 'percentage';
    else if (currentCell?.format === 'date') cat = 'date';
    else if (currentCell?.format === 'scientific') cat = 'scientific';
    else if (currentCell?.format === 'fraction') cat = 'fraction';

    let initialStyle: FormatCellsConfig['fontStyle'] = 'regular';
    if (currentCell?.bold && currentCell?.italic) initialStyle = 'bold-italic';
    else if (currentCell?.bold) initialStyle = 'bold';
    else if (currentCell?.italic) initialStyle = 'italic';

    return {
      category: cat,
      decimalPlaces: currentCell?.decimalPlaces !== undefined ? currentCell.decimalPlaces : 2,
      useThousandSeparator: true,
      negativeFormat: 'minus',
      currencySymbol: currentCell?.format === 'currency-sar' ? 'ر.س' : currentCell?.format === 'currency-egp' ? 'ج.م' : '$',
      dateFormat: 'YYYY-MM-DD',
      timeFormat: 'HH:mm:ss',
      fractionFormat: '# ?/?',
      customFormat: '#,##0.00',

      horizontalAlign: currentCell?.align || 'general',
      verticalAlign: currentCell?.verticalAlign || 'middle',
      wrapText: !!currentCell?.wrapText,
      shrinkToFit: false,
      mergeCells: !!currentCell?.isMergeParent,
      textDirection: 'context',
      textRotation: currentCell?.textRotation || 0,
      indent: 0,

      fontFamily: currentCell?.fontFamily || 'Calibri',
      fontStyle: initialStyle,
      fontSize: currentCell?.fontSize || 11,
      underline: currentCell?.underline ? 'single' : 'none',
      color: currentCell?.color || '#000000',
      strikethrough: !!currentCell?.strikethrough,
      superscript: false,
      subscript: false,

      borderTop: currentCell?.border === 'all' || currentCell?.border === 'top' || currentCell?.border === 'outside',
      borderBottom: currentCell?.border === 'all' || currentCell?.border === 'bottom' || currentCell?.border === 'thick-bottom' || currentCell?.border === 'double-bottom' || currentCell?.border === 'outside',
      borderLeft: currentCell?.border === 'all' || currentCell?.border === 'left' || currentCell?.border === 'outside',
      borderRight: currentCell?.border === 'all' || currentCell?.border === 'right' || currentCell?.border === 'outside',
      borderInsideH: false,
      borderInsideV: false,
      borderDiagonalUp: false,
      borderDiagonalDown: false,
      borderStyle: currentCell?.border === 'thick-bottom' ? 'thick' : currentCell?.border === 'double-bottom' ? 'double' : 'thin',
      borderColor: '#000000',

      fillColor: currentCell?.bg || '',
      patternStyle: 'none',
      patternColor: '#000000',

      locked: true,
      hidden: false,
    };
  });

  // Re-sync with currentCell when modal opens
  useEffect(() => {
    if (!isOpen) return;
    let cat: FormatCellsConfig['category'] = 'general';
    if (currentCell?.format === 'number') cat = 'number';
    else if (currentCell?.format?.includes('currency')) cat = 'currency';
    else if (currentCell?.format === 'accounting') cat = 'accounting';
    else if (currentCell?.format === 'percent') cat = 'percentage';
    else if (currentCell?.format === 'date') cat = 'date';
    else if (currentCell?.format === 'scientific') cat = 'scientific';
    else if (currentCell?.format === 'fraction') cat = 'fraction';

    let initialStyle: FormatCellsConfig['fontStyle'] = 'regular';
    if (currentCell?.bold && currentCell?.italic) initialStyle = 'bold-italic';
    else if (currentCell?.bold) initialStyle = 'bold';
    else if (currentCell?.italic) initialStyle = 'italic';

    setConfig((prev) => ({
      ...prev,
      category: cat,
      decimalPlaces: currentCell?.decimalPlaces !== undefined ? currentCell.decimalPlaces : 2,
      fontFamily: currentCell?.fontFamily || 'Calibri',
      fontStyle: initialStyle,
      fontSize: currentCell?.fontSize || 11,
      underline: currentCell?.underline ? 'single' : 'none',
      color: currentCell?.color || '#000000',
      fillColor: currentCell?.bg || '',
      wrapText: !!currentCell?.wrapText,
      horizontalAlign: currentCell?.align || 'general',
      verticalAlign: currentCell?.verticalAlign || 'middle',
    }));
  }, [isOpen, currentCell]);

  // Compute live sample formatted output for Number tab
  const computedSample = useMemo(() => {
    const rawNum = parseFloat(String(sampleValue).replace(/[^0-9.-]+/g, '')) || 1000;
    const dec = config.decimalPlaces;
    const sep = config.useThousandSeparator;

    switch (config.category) {
      case 'general':
        return String(sampleValue || '1000');
      case 'number':
        return sep
          ? rawNum.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec })
          : rawNum.toFixed(dec);
      case 'currency':
        const curFormatted = sep
          ? rawNum.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec })
          : rawNum.toFixed(dec);
        return config.currencySymbol ? `${config.currencySymbol} ${curFormatted}` : curFormatted;
      case 'accounting':
        const accFormatted = sep
          ? rawNum.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec })
          : rawNum.toFixed(dec);
        return config.currencySymbol ? `${config.currencySymbol}  ${accFormatted}` : accFormatted;
      case 'date':
        return '2026-10-28';
      case 'time':
        return '13:30:55';
      case 'percentage':
        return `${(rawNum > 1 ? rawNum : rawNum * 100).toFixed(dec)}%`;
      case 'fraction':
        return '1000 1/4';
      case 'scientific':
        return rawNum.toExponential(dec);
      case 'text':
        return String(sampleValue || '1000');
      case 'special':
        return '12345-6789';
      case 'custom':
        return config.customFormat || String(sampleValue || '1000');
      default:
        return String(sampleValue || '1000');
    }
  }, [sampleValue, config.category, config.decimalPlaces, config.useThousandSeparator, config.currencySymbol, config.customFormat]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-100" dir="ltr">
      {/* Excel Classic Dialog Window */}
      <div className="bg-[#f0f0f0] w-[640px] max-w-[95vw] border border-[#7f9db9] rounded-t-sm shadow-2xl flex flex-col text-[12px] font-sans text-gray-800 select-none overflow-hidden">
        
        {/* Title Bar with ? and X */}
        <div className="bg-[#ffffff] border-b border-[#d9d9d9] px-3 py-2 flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[13px] text-gray-900">Format Cells</span>
            <span className="text-[11px] text-gray-500 font-mono">({cellAddress})</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => alert('Format Cells Help (مساعدة تنسيق الخلايا):\nيمكنك من هذه النافذة التحكم الشامل في أرقام الخلايا، المحاذاة، نوع وحجم الخط، حدود الجداول، تعبئة الألوان، وحماية المعادلات.')}
              className="w-5 h-5 flex items-center justify-center hover:bg-gray-200 rounded text-gray-600 text-xs"
              title="Help"
            >
              ?
            </button>
            <button
              onClick={onClose}
              className="w-5 h-5 flex items-center justify-center hover:bg-red-500 hover:text-white rounded text-gray-600"
              title="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Excel Tab Bar */}
        <div className="bg-[#f0f0f0] px-2 pt-2 border-b border-[#999999] flex items-end gap-1">
          {[
            { id: 'number', label: 'Number' },
            { id: 'alignment', label: 'Alignment' },
            { id: 'font', label: 'Font' },
            { id: 'border', label: 'Border' },
            { id: 'fill', label: 'Fill' },
            { id: 'protection', label: 'Protection' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as FormatCellsTab)}
                className={`px-3 py-1.5 text-xs font-medium rounded-t border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-gray-900 border-[#999999] border-b-white -mb-px z-10 font-bold shadow-2xs'
                    : 'bg-[#e1dfdd] text-gray-600 border-transparent hover:bg-[#edebe9]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="bg-white p-4 h-[380px] overflow-y-auto">
          
          {/* TAB 1: NUMBER */}
          {activeTab === 'number' && (
            <div className="flex gap-4 h-full">
              {/* Category Column */}
              <div className="w-36 shrink-0">
                <label className="block text-[11px] font-bold text-gray-600 mb-1">Category:</label>
                <div className="border border-[#7f9db9] rounded bg-white h-[310px] overflow-y-auto shadow-inner">
                  {[
                    { id: 'general', label: 'General' },
                    { id: 'number', label: 'Number' },
                    { id: 'currency', label: 'Currency' },
                    { id: 'accounting', label: 'Accounting' },
                    { id: 'date', label: 'Date' },
                    { id: 'time', label: 'Time' },
                    { id: 'percentage', label: 'Percentage' },
                    { id: 'fraction', label: 'Fraction' },
                    { id: 'scientific', label: 'Scientific' },
                    { id: 'text', label: 'Text' },
                    { id: 'special', label: 'Special' },
                    { id: 'custom', label: 'Custom' },
                  ].map((cat) => {
                    const isSelected = config.category === cat.id;
                    return (
                      <div
                        key={cat.id}
                        onClick={() => setConfig({ ...config, category: cat.id as any })}
                        className={`px-2 py-1 cursor-pointer text-xs transition-colors ${
                          isSelected
                            ? 'bg-[#0078d4] text-white font-medium'
                            : 'hover:bg-[#f3f2f1] text-gray-800'
                        }`}
                      >
                        {cat.label}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Settings Column */}
              <div className="flex-1 flex flex-col space-y-3">
                {/* Sample Box */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Sample</label>
                  <div className="border border-[#7f9db9] rounded bg-[#fafafa] px-3 py-2 text-sm font-mono truncate shadow-inner text-gray-900 font-bold min-h-[38px] flex items-center">
                    {computedSample}
                  </div>
                </div>

                {/* Category Options */}
                {config.category === 'general' && (
                  <div className="text-xs text-gray-600 leading-relaxed pt-2">
                    General format cells have no specific number format. Numbers are displayed as entered without forced decimals or symbols.
                  </div>
                )}

                {config.category === 'number' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-medium">Decimal places:</label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={config.decimalPlaces}
                        onChange={(e) => setConfig({ ...config, decimalPlaces: Math.max(0, parseInt(e.target.value, 10) || 0) })}
                        className="w-16 border border-gray-300 rounded px-2 py-0.5 text-xs text-center outline-none focus:border-[#0078d4]"
                      />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={config.useThousandSeparator}
                        onChange={(e) => setConfig({ ...config, useThousandSeparator: e.target.checked })}
                        className="rounded text-[#0078d4]"
                      />
                      <span>Use 1000 Separator (,)</span>
                    </label>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Negative numbers:</label>
                      <div className="border border-gray-300 rounded bg-white p-1 space-y-1">
                        {[
                          { id: 'minus', label: '-1234.10' },
                          { id: 'red', label: '1234.10 (Red)', color: 'text-red-600' },
                          { id: 'parens', label: '(1234.10)' },
                          { id: 'red-parens', label: '(1234.10) (Red)', color: 'text-red-600' },
                        ].map((neg) => (
                          <div
                            key={neg.id}
                            onClick={() => setConfig({ ...config, negativeFormat: neg.id as any })}
                            className={`px-2 py-0.5 rounded cursor-pointer text-xs flex items-center justify-between ${
                              config.negativeFormat === neg.id ? 'bg-[#0078d4] text-white' : 'hover:bg-gray-100'
                            }`}
                          >
                            <span className={config.negativeFormat === neg.id ? 'text-white' : neg.color || 'text-gray-800'}>{neg.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {config.category === 'currency' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-medium">Decimal places:</label>
                      <input
                        type="number"
                        min="0"
                        max="8"
                        value={config.decimalPlaces}
                        onChange={(e) => setConfig({ ...config, decimalPlaces: Math.max(0, parseInt(e.target.value, 10) || 0) })}
                        className="w-16 border border-gray-300 rounded px-2 py-0.5 text-xs text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Symbol:</label>
                      <select
                        value={config.currencySymbol}
                        onChange={(e) => setConfig({ ...config, currencySymbol: e.target.value })}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-xs bg-white outline-none focus:border-[#0078d4]"
                      >
                        {CURRENCY_SYMBOLS.map((cs) => (
                          <option key={cs.value} value={cs.value}>{cs.label}</option>
                        ))}
                      </select>
                    </div>
                    <p className="text-[11px] text-gray-500">
                      Currency formats are used for general monetary values. Use Accounting formats to align currency symbols.
                    </p>
                  </div>
                )}

                {config.category === 'accounting' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-medium">Decimal places:</label>
                      <input
                        type="number"
                        min="0"
                        max="8"
                        value={config.decimalPlaces}
                        onChange={(e) => setConfig({ ...config, decimalPlaces: Math.max(0, parseInt(e.target.value, 10) || 0) })}
                        className="w-16 border border-gray-300 rounded px-2 py-0.5 text-xs text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Symbol:</label>
                      <select
                        value={config.currencySymbol}
                        onChange={(e) => setConfig({ ...config, currencySymbol: e.target.value })}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-xs bg-white outline-none focus:border-[#0078d4]"
                      >
                        {CURRENCY_SYMBOLS.map((cs) => (
                          <option key={cs.value} value={cs.value}>{cs.label}</option>
                        ))}
                      </select>
                    </div>
                    <p className="text-[11px] text-gray-500">
                      Accounting formats line up currency symbols and decimal points in a column.
                    </p>
                  </div>
                )}

                {config.category === 'date' && (
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-700">Type:</label>
                    <div className="border border-gray-300 rounded bg-white p-1 space-y-1 max-h-36 overflow-y-auto">
                      {DATE_FORMATS.map((df) => (
                        <div
                          key={df.value}
                          onClick={() => setConfig({ ...config, dateFormat: df.value })}
                          className={`px-2 py-1 rounded cursor-pointer text-xs ${
                            config.dateFormat === df.value ? 'bg-[#0078d4] text-white' : 'hover:bg-gray-100 text-gray-800'
                          }`}
                        >
                          {df.label}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {config.category === 'time' && (
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-700">Type:</label>
                    <div className="border border-gray-300 rounded bg-white p-1 space-y-1 max-h-36 overflow-y-auto">
                      {TIME_FORMATS.map((tf) => (
                        <div
                          key={tf.value}
                          onClick={() => setConfig({ ...config, timeFormat: tf.value })}
                          className={`px-2 py-1 rounded cursor-pointer text-xs ${
                            config.timeFormat === tf.value ? 'bg-[#0078d4] text-white' : 'hover:bg-gray-100 text-gray-800'
                          }`}
                        >
                          {tf.label}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {config.category === 'percentage' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-medium">Decimal places:</label>
                      <input
                        type="number"
                        min="0"
                        max="8"
                        value={config.decimalPlaces}
                        onChange={(e) => setConfig({ ...config, decimalPlaces: Math.max(0, parseInt(e.target.value, 10) || 0) })}
                        className="w-16 border border-gray-300 rounded px-2 py-0.5 text-xs text-center"
                      />
                    </div>
                    <p className="text-[11px] text-gray-500">
                      Percentage formats multiply the cell value by 100 and display the result with a percent symbol.
                    </p>
                  </div>
                )}

                {config.category === 'fraction' && (
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-700">Type:</label>
                    <div className="border border-gray-300 rounded bg-white p-1 space-y-1">
                      {FRACTION_FORMATS.map((ff) => (
                        <div
                          key={ff.value}
                          onClick={() => setConfig({ ...config, fractionFormat: ff.value })}
                          className={`px-2 py-1 rounded cursor-pointer text-xs ${
                            config.fractionFormat === ff.value ? 'bg-[#0078d4] text-white' : 'hover:bg-gray-100 text-gray-800'
                          }`}
                        >
                          {ff.label}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {config.category === 'scientific' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-medium">Decimal places:</label>
                      <input
                        type="number"
                        min="0"
                        max="8"
                        value={config.decimalPlaces}
                        onChange={(e) => setConfig({ ...config, decimalPlaces: Math.max(0, parseInt(e.target.value, 10) || 0) })}
                        className="w-16 border border-gray-300 rounded px-2 py-0.5 text-xs text-center"
                      />
                    </div>
                    <p className="text-[11px] text-gray-500">
                      Scientific format displays numbers in exponential notation (e.g. 1.00E+03).
                    </p>
                  </div>
                )}

                {config.category === 'text' && (
                  <div className="text-xs text-gray-600 leading-relaxed pt-2">
                    Text format cells are treated as text even when a number is in the cell. The cell is displayed exactly as entered.
                  </div>
                )}

                {config.category === 'custom' && (
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-700">Type:</label>
                    <input
                      type="text"
                      value={config.customFormat}
                      onChange={(e) => setConfig({ ...config, customFormat: e.target.value })}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-xs font-mono bg-white outline-none focus:border-[#0078d4]"
                    />
                    <div className="border border-gray-300 rounded bg-white p-1 space-y-0.5 max-h-32 overflow-y-auto">
                      {CUSTOM_PATTERNS.map((p) => (
                        <div
                          key={p}
                          onClick={() => setConfig({ ...config, customFormat: p })}
                          className={`px-2 py-0.5 font-mono text-xs cursor-pointer rounded ${
                            config.customFormat === p ? 'bg-[#0078d4] text-white' : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          {p}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ALIGNMENT */}
          {activeTab === 'alignment' && (
            <div className="grid grid-cols-2 gap-6 h-full">
              {/* Left Column: Horizontal & Vertical Alignment */}
              <div className="space-y-4">
                <fieldset className="border border-gray-300 rounded p-3">
                  <legend className="text-xs font-bold text-gray-700 px-1">Text alignment</legend>
                  
                  <div className="space-y-3 pt-1">
                    <div>
                      <label className="block text-[11px] text-gray-600 mb-1">Horizontal:</label>
                      <select
                        value={config.horizontalAlign}
                        onChange={(e) => setConfig({ ...config, horizontalAlign: e.target.value as any })}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-xs bg-white outline-none focus:border-[#0078d4]"
                      >
                        <option value="general">General</option>
                        <option value="left">Left (Indent)</option>
                        <option value="center">Center</option>
                        <option value="right">Right (Indent)</option>
                        <option value="fill">Fill</option>
                        <option value="justify">Justify</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] text-gray-600 mb-1">Vertical:</label>
                      <select
                        value={config.verticalAlign}
                        onChange={(e) => setConfig({ ...config, verticalAlign: e.target.value as any })}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-xs bg-white outline-none focus:border-[#0078d4]"
                      >
                        <option value="top">Top</option>
                        <option value="middle">Center</option>
                        <option value="bottom">Bottom</option>
                        <option value="justify">Justify</option>
                      </select>
                    </div>
                  </div>
                </fieldset>

                <fieldset className="border border-gray-300 rounded p-3">
                  <legend className="text-xs font-bold text-gray-700 px-1">Text control</legend>
                  <div className="space-y-2 pt-1 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.wrapText}
                        onChange={(e) => setConfig({ ...config, wrapText: e.target.checked })}
                        className="rounded text-[#0078d4]"
                      />
                      <span>Wrap text (التفاف النص)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.shrinkToFit}
                        onChange={(e) => setConfig({ ...config, shrinkToFit: e.target.checked })}
                        className="rounded text-[#0078d4]"
                      />
                      <span>Shrink to fit (ملاءمة الاحتواء)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.mergeCells}
                        onChange={(e) => setConfig({ ...config, mergeCells: e.target.checked })}
                        className="rounded text-[#0078d4]"
                      />
                      <span>Merge cells (دمج الخلايا)</span>
                    </label>
                  </div>
                </fieldset>
              </div>

              {/* Right Column: Orientation & Direction */}
              <div className="space-y-4">
                <fieldset className="border border-gray-300 rounded p-3">
                  <legend className="text-xs font-bold text-gray-700 px-1">Orientation (الاتجاه)</legend>
                  <div className="pt-2 flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <label className="text-xs">Degrees:</label>
                        <input
                          type="number"
                          min="-90"
                          max="90"
                          value={config.textRotation}
                          onChange={(e) => setConfig({ ...config, textRotation: parseInt(e.target.value, 10) || 0 })}
                          className="w-16 border border-gray-300 rounded px-2 py-0.5 text-xs text-center"
                        />
                        <span className="text-xs text-gray-500">(-90 to 90)</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {[0, 45, 90, -45, -90].map((deg) => (
                          <button
                            key={deg}
                            onClick={() => setConfig({ ...config, textRotation: deg })}
                            className={`px-2 py-0.5 rounded text-[11px] border ${
                              config.textRotation === deg ? 'bg-[#0078d4] text-white font-bold' : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                          >
                            {deg}°
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="w-16 h-24 border border-dashed border-gray-400 rounded flex items-center justify-center bg-gray-50">
                      <div
                        style={{ transform: `rotate(${config.textRotation}deg)` }}
                        className="text-xs font-bold text-[#0078d4] transition-transform"
                      >
                        Text
                      </div>
                    </div>
                  </div>
                </fieldset>

                <fieldset className="border border-gray-300 rounded p-3">
                  <legend className="text-xs font-bold text-gray-700 px-1">Right-to-left</legend>
                  <div className="pt-1">
                    <label className="block text-[11px] text-gray-600 mb-1">Text direction:</label>
                    <select
                      value={config.textDirection}
                      onChange={(e) => setConfig({ ...config, textDirection: e.target.value as any })}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-xs bg-white outline-none focus:border-[#0078d4]"
                    >
                      <option value="context">Context (سياقي)</option>
                      <option value="ltr">Left-to-Right (من اليسار لليمين)</option>
                      <option value="rtl">Right-to-Left (من اليمين لليسار)</option>
                    </select>
                  </div>
                </fieldset>
              </div>
            </div>
          )}

          {/* TAB 3: FONT */}
          {activeTab === 'font' && (
            <div className="space-y-3 h-full flex flex-col justify-between">
              {/* Three Lists: Font, Font Style, Size */}
              <div className="grid grid-cols-12 gap-3">
                {/* Font Family List (Col 5) */}
                <div className="col-span-5">
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Font:</label>
                  <input
                    type="text"
                    value={config.fontFamily}
                    onChange={(e) => setConfig({ ...config, fontFamily: e.target.value })}
                    className="w-full border border-gray-300 rounded px-2 py-0.5 text-xs mb-1"
                  />
                  <div className="border border-gray-300 rounded bg-white h-32 overflow-y-auto">
                    {FONT_FAMILIES.map((fn) => (
                      <div
                        key={fn}
                        onClick={() => setConfig({ ...config, fontFamily: fn })}
                        style={{ fontFamily: fn }}
                        className={`px-2 py-1 text-xs cursor-pointer ${
                          config.fontFamily === fn ? 'bg-[#0078d4] text-white' : 'hover:bg-gray-100 text-gray-800'
                        }`}
                      >
                        {fn}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Font Style List (Col 4) */}
                <div className="col-span-4">
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Font style:</label>
                  <div className="border border-gray-300 rounded bg-white h-38 overflow-y-auto mt-6">
                    {[
                      { id: 'regular', label: 'Regular', cls: '' },
                      { id: 'italic', label: 'Italic', cls: 'italic' },
                      { id: 'bold', label: 'Bold', cls: 'font-bold' },
                      { id: 'bold-italic', label: 'Bold Italic', cls: 'font-bold italic' },
                    ].map((st) => (
                      <div
                        key={st.id}
                        onClick={() => setConfig({ ...config, fontStyle: st.id as any })}
                        className={`px-2 py-1.5 text-xs cursor-pointer ${st.cls} ${
                          config.fontStyle === st.id ? 'bg-[#0078d4] text-white' : 'hover:bg-gray-100 text-gray-800'
                        }`}
                      >
                        {st.label}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Size List (Col 3) */}
                <div className="col-span-3">
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Size:</label>
                  <input
                    type="number"
                    value={config.fontSize}
                    onChange={(e) => setConfig({ ...config, fontSize: parseInt(e.target.value, 10) || 11 })}
                    className="w-full border border-gray-300 rounded px-2 py-0.5 text-xs mb-1 text-center"
                  />
                  <div className="border border-gray-300 rounded bg-white h-32 overflow-y-auto">
                    {FONT_SIZES.map((sz) => (
                      <div
                        key={sz}
                        onClick={() => setConfig({ ...config, fontSize: sz })}
                        className={`px-2 py-0.5 text-xs text-center cursor-pointer ${
                          config.fontSize === sz ? 'bg-[#0078d4] text-white' : 'hover:bg-gray-100 text-gray-800'
                        }`}
                      >
                        {sz}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Underline, Color, Effects */}
              <div className="grid grid-cols-12 gap-3 pt-1">
                {/* Underline & Color */}
                <div className="col-span-5 space-y-2">
                  <div>
                    <label className="block text-[11px] text-gray-600 mb-0.5">Underline:</label>
                    <select
                      value={config.underline}
                      onChange={(e) => setConfig({ ...config, underline: e.target.value as any })}
                      className="w-full border border-gray-300 rounded px-2 py-0.5 text-xs bg-white"
                    >
                      <option value="none">None</option>
                      <option value="single">Single</option>
                      <option value="double">Double</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-600 mb-0.5">Color:</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.color}
                        onChange={(e) => setConfig({ ...config, color: e.target.value })}
                        className="w-8 h-6 p-0 border border-gray-300 rounded cursor-pointer"
                      />
                      <span className="text-xs font-mono">{config.color}</span>
                    </div>
                  </div>
                </div>

                {/* Effects */}
                <div className="col-span-3 space-y-1 pt-1 text-xs">
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">Effects:</label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.strikethrough}
                      onChange={(e) => setConfig({ ...config, strikethrough: e.target.checked })}
                      className="rounded"
                    />
                    <span>Strikethrough</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.superscript}
                      onChange={(e) => setConfig({ ...config, superscript: e.target.checked, subscript: false })}
                      className="rounded"
                    />
                    <span>Superscript</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.subscript}
                      onChange={(e) => setConfig({ ...config, subscript: e.target.checked, superscript: false })}
                      className="rounded"
                    />
                    <span>Subscript</span>
                  </label>
                </div>

                {/* Live Preview Box */}
                <div className="col-span-4">
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Preview:</label>
                  <div className="border border-gray-300 rounded bg-[#fafafa] h-24 p-2 flex items-center justify-center overflow-hidden">
                    <span
                      style={{
                        fontFamily: config.fontFamily,
                        fontSize: `${Math.min(22, config.fontSize)}px`,
                        fontWeight: config.fontStyle.includes('bold') ? 'bold' : 'normal',
                        fontStyle: config.fontStyle.includes('italic') ? 'italic' : 'normal',
                        textDecoration: [
                          config.underline !== 'none' ? 'underline' : '',
                          config.strikethrough ? 'line-through' : '',
                        ].filter(Boolean).join(' ') || undefined,
                        color: config.color,
                      }}
                      className="truncate"
                    >
                      AaBbCcYyZz - نص عربي
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BORDER */}
          {activeTab === 'border' && (
            <div className="grid grid-cols-12 gap-6 h-full">
              {/* Presets & Line Styles */}
              <div className="col-span-5 space-y-4">
                {/* Presets */}
                <fieldset className="border border-gray-300 rounded p-2.5">
                  <legend className="text-xs font-bold text-gray-700 px-1">Presets (إعدادات مسبقة)</legend>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => setConfig({
                        ...config,
                        borderTop: false,
                        borderBottom: false,
                        borderLeft: false,
                        borderRight: false,
                        borderInsideH: false,
                        borderInsideV: false,
                        borderDiagonalUp: false,
                        borderDiagonalDown: false,
                      })}
                      className="flex-1 py-1.5 border border-gray-300 rounded hover:bg-gray-100 flex flex-col items-center gap-0.5 text-[11px]"
                    >
                      <div className="w-5 h-5 border border-dashed border-gray-400 rounded-xs" />
                      <span>None (بلا)</span>
                    </button>

                    <button
                      onClick={() => setConfig({
                        ...config,
                        borderTop: true,
                        borderBottom: true,
                        borderLeft: true,
                        borderRight: true,
                      })}
                      className="flex-1 py-1.5 border border-gray-300 rounded hover:bg-emerald-50 hover:border-[#107c41] flex flex-col items-center gap-0.5 text-[11px]"
                    >
                      <div className="w-5 h-5 border-2 border-gray-800 rounded-xs" />
                      <span>Outline (إطار)</span>
                    </button>

                    <button
                      onClick={() => setConfig({
                        ...config,
                        borderTop: true,
                        borderBottom: true,
                        borderLeft: true,
                        borderRight: true,
                        borderInsideH: true,
                        borderInsideV: true,
                      })}
                      className="flex-1 py-1.5 border border-gray-300 rounded hover:bg-emerald-50 hover:border-[#107c41] flex flex-col items-center gap-0.5 text-[11px]"
                    >
                      <div className="w-5 h-5 border border-gray-800 grid grid-cols-2 grid-rows-2">
                        <div className="border-r border-b border-gray-400" />
                        <div className="border-b border-gray-400" />
                        <div className="border-r border-gray-400" />
                        <div />
                      </div>
                      <span>Inside (داخلي)</span>
                    </button>
                  </div>
                </fieldset>

                {/* Line Style & Color */}
                <fieldset className="border border-gray-300 rounded p-2.5 space-y-2">
                  <legend className="text-xs font-bold text-gray-700 px-1">Line (الخط)</legend>
                  
                  <div className="space-y-1">
                    <label className="text-[11px] text-gray-600 block">Style:</label>
                    <div className="border border-gray-300 rounded bg-white p-1 space-y-1">
                      {[
                        { id: 'thin', label: 'Thin Solid ───', h: 'border-t border-gray-800' },
                        { id: 'medium', label: 'Medium Solid ━━━', h: 'border-t-2 border-gray-800' },
                        { id: 'thick', label: 'Thick Solid ⬛⬛⬛', h: 'border-t-4 border-gray-800' },
                        { id: 'double', label: 'Double Line ═══', h: 'border-t-4 border-double border-gray-800' },
                        { id: 'dashed', label: 'Dashed - - -', h: 'border-t border-dashed border-gray-800' },
                        { id: 'dotted', label: 'Dotted ·····', h: 'border-t border-dotted border-gray-800' },
                      ].map((ls) => (
                        <div
                          key={ls.id}
                          onClick={() => setConfig({ ...config, borderStyle: ls.id as any })}
                          className={`px-2 py-1 cursor-pointer flex items-center justify-between text-xs rounded ${
                            config.borderStyle === ls.id ? 'bg-[#0078d4] text-white' : 'hover:bg-gray-100 text-gray-800'
                          }`}
                        >
                          <span>{ls.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-gray-600 block mb-1">Color:</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.borderColor}
                        onChange={(e) => setConfig({ ...config, borderColor: e.target.value })}
                        className="w-8 h-6 p-0 border border-gray-300 rounded cursor-pointer"
                      />
                      <span className="text-xs font-mono">{config.borderColor}</span>
                    </div>
                  </div>
                </fieldset>
              </div>

              {/* Border Interactive Diagram & Buttons */}
              <div className="col-span-7 flex flex-col justify-between">
                <label className="text-xs font-bold text-gray-700 block mb-1">Border (انقر على الحواف للتبديل):</label>
                
                <div className="flex items-center justify-center p-3 bg-gray-50 border border-gray-300 rounded flex-1">
                  {/* Interactive Cell Box */}
                  <div className="relative w-48 h-40 bg-white border border-dashed border-gray-300 flex items-center justify-center">
                    
                    {/* Top Edge */}
                    <div
                      onClick={() => setConfig({ ...config, borderTop: !config.borderTop })}
                      className={`absolute top-0 inset-x-0 h-3 cursor-pointer transition-colors flex items-center justify-center ${
                        config.borderTop ? 'bg-[#107c41]' : 'hover:bg-gray-200'
                      }`}
                      title="Top Border"
                    />

                    {/* Bottom Edge */}
                    <div
                      onClick={() => setConfig({ ...config, borderBottom: !config.borderBottom })}
                      className={`absolute bottom-0 inset-x-0 h-3 cursor-pointer transition-colors flex items-center justify-center ${
                        config.borderBottom ? 'bg-[#107c41]' : 'hover:bg-gray-200'
                      }`}
                      title="Bottom Border"
                    />

                    {/* Left Edge */}
                    <div
                      onClick={() => setConfig({ ...config, borderLeft: !config.borderLeft })}
                      className={`absolute left-0 inset-y-0 w-3 cursor-pointer transition-colors flex items-center justify-center ${
                        config.borderLeft ? 'bg-[#107c41]' : 'hover:bg-gray-200'
                      }`}
                      title="Left Border"
                    />

                    {/* Right Edge */}
                    <div
                      onClick={() => setConfig({ ...config, borderRight: !config.borderRight })}
                      className={`absolute right-0 inset-y-0 w-3 cursor-pointer transition-colors flex items-center justify-center ${
                        config.borderRight ? 'bg-[#107c41]' : 'hover:bg-gray-200'
                      }`}
                      title="Right Border"
                    />

                    {/* Center Text Preview */}
                    <span className="text-xs text-gray-400 select-none font-medium">Text</span>
                  </div>
                </div>

                {/* Quick Toggle Buttons */}
                <div className="grid grid-cols-4 gap-1.5 pt-2">
                  <button
                    onClick={() => setConfig({ ...config, borderTop: !config.borderTop })}
                    className={`py-1 text-[11px] border rounded ${config.borderTop ? 'bg-emerald-100 border-[#107c41] font-bold text-[#107c41]' : 'bg-white hover:bg-gray-100'}`}
                  >
                    Top (أعلى)
                  </button>
                  <button
                    onClick={() => setConfig({ ...config, borderBottom: !config.borderBottom })}
                    className={`py-1 text-[11px] border rounded ${config.borderBottom ? 'bg-emerald-100 border-[#107c41] font-bold text-[#107c41]' : 'bg-white hover:bg-gray-100'}`}
                  >
                    Bottom (أسفل)
                  </button>
                  <button
                    onClick={() => setConfig({ ...config, borderLeft: !config.borderLeft })}
                    className={`py-1 text-[11px] border rounded ${config.borderLeft ? 'bg-emerald-100 border-[#107c41] font-bold text-[#107c41]' : 'bg-white hover:bg-gray-100'}`}
                  >
                    Left (يسار)
                  </button>
                  <button
                    onClick={() => setConfig({ ...config, borderRight: !config.borderRight })}
                    className={`py-1 text-[11px] border rounded ${config.borderRight ? 'bg-emerald-100 border-[#107c41] font-bold text-[#107c41]' : 'bg-white hover:bg-gray-100'}`}
                  >
                    Right (يمين)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: FILL */}
          {activeTab === 'fill' && (
            <div className="space-y-3 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-gray-700">Background Color:</label>
                  <button
                    onClick={() => setConfig({ ...config, fillColor: '' })}
                    className="px-2.5 py-1 text-xs border border-gray-300 rounded bg-white hover:bg-gray-100 cursor-pointer shadow-2xs"
                  >
                    No Color (بلا تعبئة)
                  </button>
                </div>

                {/* Theme Palette */}
                <div className="border border-gray-300 rounded p-2 bg-[#fdfdfd] space-y-1">
                  <div className="text-[10px] font-bold text-gray-500 mb-1">Theme Colors</div>
                  {THEME_PALETTE.map((row, rIdx) => (
                    <div key={rIdx} className="flex gap-1.5">
                      {row.map((color, cIdx) => (
                        <div
                          key={cIdx}
                          onClick={() => setConfig({ ...config, fillColor: color })}
                          style={{ backgroundColor: color }}
                          className={`w-6 h-5 rounded-xs cursor-pointer border transition-transform ${
                            config.fillColor.toLowerCase() === color.toLowerCase()
                              ? 'border-black ring-2 ring-[#0078d4] scale-110 z-10'
                              : 'border-gray-300 hover:scale-105'
                          }`}
                          title={color}
                        />
                      ))}
                    </div>
                  ))}

                  <div className="text-[10px] font-bold text-gray-500 mt-2 mb-1">Standard Colors</div>
                  <div className="flex gap-1.5">
                    {STANDARD_COLORS.map((color) => (
                      <div
                        key={color}
                        onClick={() => setConfig({ ...config, fillColor: color })}
                        style={{ backgroundColor: color }}
                        className={`w-6 h-5 rounded-xs cursor-pointer border transition-transform ${
                          config.fillColor.toLowerCase() === color.toLowerCase()
                            ? 'border-black ring-2 ring-[#0078d4] scale-110 z-10'
                            : 'border-gray-300 hover:scale-105'
                        }`}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Sample Fill Box & Custom Color Picker */}
              <div className="grid grid-cols-2 gap-4 pt-1 items-end">
                <div>
                  <label className="text-[11px] font-medium text-gray-700 block mb-1">More Colors (لون مخصص):</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.fillColor || '#ffffff'}
                      onChange={(e) => setConfig({ ...config, fillColor: e.target.value })}
                      className="w-10 h-7 p-0 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.fillColor}
                      placeholder="#ffffff"
                      onChange={(e) => setConfig({ ...config, fillColor: e.target.value })}
                      className="border border-gray-300 rounded px-2 py-1 text-xs font-mono w-28"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">Sample:</label>
                  <div
                    style={{ backgroundColor: config.fillColor || '#ffffff' }}
                    className="border border-gray-400 rounded h-10 flex items-center justify-center font-bold text-gray-800 shadow-inner"
                  >
                    <span>Sample Text</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: PROTECTION */}
          {activeTab === 'protection' && (
            <div className="space-y-4 pt-2">
              <div className="space-y-3">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.locked}
                    onChange={(e) => setConfig({ ...config, locked: e.target.checked })}
                    className="mt-0.5 rounded text-[#0078d4]"
                  />
                  <div>
                    <div className="font-bold text-xs text-gray-800 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Locked (تأمين وقفل الخلايا)</span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                      Locking cells or hiding formulas has no effect until you protect the worksheet (via Review tab &gt; Protect Sheet).
                    </p>
                  </div>
                </label>

                <div className="border-t border-gray-200 my-2" />

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.hidden}
                    onChange={(e) => setConfig({ ...config, hidden: e.target.checked })}
                    className="mt-0.5 rounded text-[#0078d4]"
                  />
                  <div>
                    <div className="font-bold text-xs text-gray-800 flex items-center gap-1.5">
                      <EyeOff className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Hidden (إخفاء المعادلات الرياضية في شريط الصيغ)</span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                      Prevents formulas from being displayed in the formula bar when the sheet is protected.
                    </p>
                  </div>
                </label>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded p-3 text-xs text-amber-900 mt-6 leading-relaxed">
                <strong>ملاحظة هامة:</strong> ميزة قفل الخلايا وإخفاء المعادلات تصبح نشطة تلقائياً بمجرد تفعيل حماية ورقة العمل من تبويب "مراجعة" (Review).
              </div>
            </div>
          )}
        </div>

        {/* Footer Buttons: OK and Cancel */}
        <div className="bg-[#f0f0f0] border-t border-[#d9d9d9] px-4 py-2.5 flex items-center justify-end gap-2 select-none">
          <button
            onClick={() => {
              onApply(config);
              onClose();
            }}
            className="px-6 py-1 bg-[#0078d4] hover:bg-[#106ebe] text-white font-medium rounded text-xs transition-colors shadow-xs outline-none cursor-pointer"
          >
            OK
          </button>
          <button
            onClick={onClose}
            className="px-5 py-1 bg-white hover:bg-gray-100 text-gray-800 border border-gray-400 font-medium rounded text-xs transition-colors shadow-2xs cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
