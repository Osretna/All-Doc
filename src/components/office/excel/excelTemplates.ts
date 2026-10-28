import { SheetData } from '../../../types';

export interface ExcelTemplateDefinition {
  id: string;
  title: string;
  titleEn: string;
  category: 'business' | 'personal' | 'planners' | 'lists' | 'budgets' | 'charts' | 'calendars' | 'tutorials';
  badge?: string;
  accentColor: string;
  iconType: 'grid' | 'formulas' | 'tour' | 'powerquery' | 'pivottable' | 'charts' | 'calendar' | 'budget' | 'invoice' | 'checklist' | 'gantt' | 'inventory' | 'attendance' | 'loan';
  description: string;
  sheets: Record<string, {
    label: string;
    data: SheetData;
    colWidths?: Record<string, number>;
    rowHeights?: Record<number, number>;
    isRTL?: boolean;
  }>;
}

export const EXCEL_SUGGESTED_CATEGORIES = [
  { id: 'all', label: 'الكل (All)', en: 'All' },
  { id: 'business', label: 'أعمال (Business)', en: 'Business' },
  { id: 'personal', label: 'شخصي (Personal)', en: 'Personal' },
  { id: 'planners', label: 'مخططات وتتبع (Planners and Trackers)', en: 'Planners and Trackers' },
  { id: 'lists', label: 'قوائم (Lists)', en: 'Lists' },
  { id: 'budgets', label: 'ميزانيات (Budgets)', en: 'Budgets' },
  { id: 'charts', label: 'رسوم بيانية (Charts)', en: 'Charts' },
  { id: 'calendars', label: 'تقويمات (Calendars)', en: 'Calendars' },
] as const;

export const EXCEL_TEMPLATES: ExcelTemplateDefinition[] = [
  // 1. Blank Workbook
  {
    id: 'blank',
    title: 'مصنف فارغ',
    titleEn: 'Blank workbook',
    category: 'personal',
    accentColor: '#107c41',
    iconType: 'grid',
    description: 'إنشاء مصنف إكسيل 365 فارغ والبدء من الصفر بحرية تامة.',
    sheets: {
      sheet1: {
        label: 'ورقة 1',
        data: {},
        isRTL: false,
      },
    },
  },

  // 2. Official Microsoft Excel Formula Tutorial (Identical to Excel 365)
  {
    id: 'formula_tutorial',
    title: 'بدء استخدام الصيغ والدوال',
    titleEn: 'Formula tutorial',
    category: 'tutorials',
    badge: 'fx',
    accentColor: '#107c41',
    iconType: 'formulas',
    description: 'دليل تفاعلي رسمي مطابق لـ Microsoft Excel 365 للتعرف على الجمع التلقائي والصيغ والدوال مع 11 ورقة عمل متكاملة.',
    sheets: {
      sheet1: {
        label: 'Start',
        isRTL: false,
        colWidths: { A: 32, B: 460, C: 120, D: 120, E: 120 },
        rowHeights: { 1: 20, 2: 40, 3: 28, 4: 24, 5: 24, 6: 24 },
        data: {
          B2: { value: 'Welcome to Excel', bold: true, fontSize: 20, color: '#262626' },
          B3: { value: '', border: 'bottom', borderColor: '#107c41', borderStyle: 'thick' },
          B4: { value: '10 quick steps to get you calculating in Excel', fontSize: 13, color: '#595959', bold: true },
          B6: { value: 'This tutorial walks you through everything you need to become proficient with formulas and functions in Excel 365.', color: '#333333', wrapText: true },
          B8: { value: 'Click the "Introduction to Functions" tab at the bottom to jump right into functions, or click Basics to start from scratch.', color: '#595959', wrapText: true },
        },
      },
      sheet2: {
        label: 'Basics',
        isRTL: false,
        colWidths: { A: 32, B: 420, C: 24, D: 120, E: 100 },
        rowHeights: { 1: 18, 2: 36, 3: 26, 4: 24, 5: 22, 6: 22, 7: 22, 8: 26 },
        data: {
          B2: { value: 'Basic math in Excel', bold: true, fontSize: 18, color: '#262626' },
          B3: { value: '', border: 'bottom', borderColor: '#107c41', borderStyle: 'thick' },
          B4: { value: 'To write a formula in Excel, always start with an equal sign (=). Then enter numbers or cell coordinates.', color: '#333333', wrapText: true },
          B6: { value: 'Try entering formulas in the yellow cells on the right to perform basic calculations.', color: '#595959', wrapText: true },
          D3: { value: 'Operation', bg: '#107c41', color: '#ffffff', bold: true, align: 'left', border: 'all', borderColor: '#0d6535' },
          E3: { value: 'Result', bg: '#107c41', color: '#ffffff', bold: true, align: 'right', border: 'all', borderColor: '#0d6535' },
          D4: { value: 'Add (=1+2)', border: 'all', borderColor: '#d4d4d4', align: 'left' },
          E4: { value: '3', formula: '=1+2', bold: true, align: 'right', bg: '#fff2cc', border: 'all', borderColor: '#d4d4d4' },
          D5: { value: 'Subtract (=5-3)', border: 'all', borderColor: '#d4d4d4', align: 'left' },
          E5: { value: '2', formula: '=5-3', bold: true, align: 'right', bg: '#fff2cc', border: 'all', borderColor: '#d4d4d4' },
          D6: { value: 'Multiply (=4*5)', border: 'all', borderColor: '#d4d4d4', align: 'left' },
          E6: { value: '20', formula: '=4*5', bold: true, align: 'right', bg: '#fff2cc', border: 'all', borderColor: '#d4d4d4' },
          D7: { value: 'Divide (=20/4)', border: 'all', borderColor: '#d4d4d4', align: 'left' },
          E7: { value: '5', formula: '=20/4', bold: true, align: 'right', bg: '#fff2cc', border: 'all', borderColor: '#d4d4d4' },
        },
      },
      sheet3: {
        label: 'Introduction to Functions',
        isRTL: false,
        colWidths: { A: 32, B: 430, C: 24, D: 115, E: 85, F: 24, G: 115, H: 85, I: 35, J: 40, K: 40, L: 40 },
        rowHeights: { 1: 18, 2: 36, 3: 26, 4: 24, 5: 20, 6: 22, 7: 22, 8: 26, 9: 20, 10: 22, 11: 26, 12: 22, 13: 22, 14: 22, 15: 22, 16: 22, 17: 26 },
        data: {
          // B Column Tutorial Explanations
          B2: { value: 'Introduction to functions', bold: true, fontSize: 18, color: '#262626' },
          B3: { value: '', border: 'bottom', borderColor: '#107c41', borderStyle: 'thick' },
          B4: { value: "Functions give you the ability to do a variety of things, like perform mathematical operations, look up values, or even calculate dates and times. Let's try a few ways to add up values with the SUM function.", color: '#333333', wrapText: true },
          B6: { value: "1. Under the Amount column for Fruit (cell D7), enter =SUM(D3:D6), or type =SUM(, then select that range with the mouse, and press Enter. This will sum the values in cells D3, D4, D5, and D6. Your answer should be 170.", color: '#333333', wrapText: true },
          B10: { value: "2. Now let's try AutoSum. Select the yellow cell under the column for Meat (cell G7), then go to Formulas > AutoSum > select SUM. You'll see Excel automatically enter the formula for you. Press Enter to confirm it. The AutoSum feature has all of the most common functions.", color: '#333333', wrapText: true },
          B15: { value: "3. Here's a neat keyboard shortcut. Select cell D15, then press Alt = then, Enter. This automatically enters SUM for you.", color: '#333333', wrapText: true },
          B18: { value: '', border: 'bottom', borderColor: '#e2e8f0' },
          B19: { value: 'Dive down for more detail          Next step ➔', bold: true, color: '#107c41' },
          B24: { value: 'More about functions', bold: true, fontSize: 16, color: '#262626' },
          B26: { value: 'Go to the Formulas tab and browse through the Function Library, where functions are listed by category, like Text, Date & Time, etc. Insert Function will let you search for functions by name, or double-click to launch a wizard.', color: '#333333', wrapText: true },
          B28: { value: 'If the SUM function could talk, it would say, return the sum of all the values in cells D38 to D41, and all of column H. SUM is the function name, D38:D41 is the argument.', color: '#333333', wrapText: true },
          B30: { value: 'The TODAY function returns today\'s date. It will automatically update when Excel recalculates.', color: '#333333', wrapText: true },
          B32: { value: 'CHECK THIS OUT Select these cells. Then in the lower-right corner of the Excel window, look for SUM: 170 in the bottom bar. That\'s called the Status Bar, and it shows helpful statistics for any range you select.', color: '#333333', wrapText: true },
          B34: { value: 'IMPORTANT DETAIL Double-click this cell. You\'ll notice the 100 toward the end. Although it\'s possible to put numbers in a formula like this, we don\'t recommend it, because it\'s hard to update later.', color: '#333333', wrapText: true },
          B36: { value: 'More information on the web', bold: true, color: '#262626' },
          B38: { value: 'All about the SUM function', color: '#0066cc', underline: true },
          B40: { value: 'Use AutoSum to sum numbers', color: '#0066cc', underline: true },
          B42: { value: 'All about the COUNT function', color: '#0066cc', underline: true },
          B44: { value: 'Free Excel training online', color: '#0066cc', underline: true },
          B46: { value: 'Back to top', color: '#0066cc', underline: true },

          // Table 1 (Fruit) - Columns D & E
          D3: { value: 'Fruit', bg: '#107c41', color: '#ffffff', bold: true, align: 'left', border: 'all', borderColor: '#0d6535' },
          E3: { value: 'Amount', bg: '#107c41', color: '#ffffff', bold: true, align: 'right', border: 'all', borderColor: '#0d6535' },
          D4: { value: 'Apples', border: 'all', borderColor: '#d4d4d4', align: 'left' },
          E4: { value: '50', format: 'number', border: 'all', borderColor: '#d4d4d4', align: 'right' },
          D5: { value: 'Oranges', border: 'all', borderColor: '#d4d4d4', align: 'left' },
          E5: { value: '20', format: 'number', border: 'all', borderColor: '#d4d4d4', align: 'right' },
          D6: { value: 'Bananas', border: 'all', borderColor: '#d4d4d4', align: 'left' },
          E6: { value: '60', format: 'number', border: 'all', borderColor: '#d4d4d4', align: 'right' },
          D7: { value: 'Lemons', border: 'all', borderColor: '#d4d4d4', align: 'left' },
          E7: { value: '40', format: 'number', border: 'all', borderColor: '#d4d4d4', align: 'right' },
          D8: { value: 'SUM >', bold: true, align: 'right' },
          E8: { value: '170', formula: '=SUM(E4:E7)', bold: true, align: 'right', bg: '#fff2cc', border: 'all', borderColor: '#d4d4d4' },

          // Table 2 (Meat) - Columns G & H
          G3: { value: 'Meat', bg: '#107c41', color: '#ffffff', bold: true, align: 'left', border: 'all', borderColor: '#0d6535' },
          H3: { value: 'Amount', bg: '#107c41', color: '#ffffff', bold: true, align: 'right', border: 'all', borderColor: '#0d6535' },
          G4: { value: 'Beef', border: 'all', borderColor: '#d4d4d4', align: 'left' },
          H4: { value: '50', format: 'number', border: 'all', borderColor: '#d4d4d4', align: 'right' },
          G5: { value: 'Chicken', border: 'all', borderColor: '#d4d4d4', align: 'left' },
          H5: { value: '30', format: 'number', border: 'all', borderColor: '#d4d4d4', align: 'right' },
          G6: { value: 'Pork', border: 'all', borderColor: '#d4d4d4', align: 'left' },
          H6: { value: '10', format: 'number', border: 'all', borderColor: '#d4d4d4', align: 'right' },
          G7: { value: 'Fish', border: 'all', borderColor: '#d4d4d4', align: 'left' },
          H7: { value: '50', format: 'number', border: 'all', borderColor: '#d4d4d4', align: 'right' },
          G8: { value: 'SUM >', bold: true, align: 'right' },
          H8: { value: '', bg: '#fff2cc', border: 'all', borderColor: '#d4d4d4', align: 'right' },

          // Lower Left Table (Item) - Rows 11-17
          D11: { value: 'Item', bg: '#107c41', color: '#ffffff', bold: true, align: 'left', border: 'all', borderColor: '#0d6535' },
          E11: { value: 'Amount', bg: '#107c41', color: '#ffffff', bold: true, align: 'right', border: 'all', borderColor: '#0d6535' },
          D12: { value: 'Bread', border: 'all', borderColor: '#d4d4d4', align: 'left' },
          E12: { value: '50', format: 'number', border: 'all', borderColor: '#d4d4d4', align: 'right' },
          D13: { value: 'Donuts', border: 'all', borderColor: '#d4d4d4', align: 'left' },
          E13: { value: '100', format: 'number', border: 'all', borderColor: '#d4d4d4', align: 'right' },
          D14: { value: 'Cookies', border: 'all', borderColor: '#d4d4d4', align: 'left' },
          E14: { value: '40', format: 'number', border: 'all', borderColor: '#d4d4d4', align: 'right' },
          D15: { value: 'Cakes', border: 'all', borderColor: '#d4d4d4', align: 'left' },
          E15: { value: '50', format: 'number', border: 'all', borderColor: '#d4d4d4', align: 'right' },
          D16: { value: 'Pies', border: 'all', borderColor: '#d4d4d4', align: 'left' },
          E16: { value: '20', format: 'number', border: 'all', borderColor: '#d4d4d4', align: 'right' },
          D17: { value: 'SUM >', bold: true, align: 'right' },
          E17: { value: '', bg: '#fff2cc', border: 'all', borderColor: '#d4d4d4', align: 'right' },

          // Lower Right Table (Item) - Rows 11-17
          G11: { value: 'Item', bg: '#107c41', color: '#ffffff', bold: true, align: 'left', border: 'all', borderColor: '#0d6535' },
          H11: { value: 'Amount', bg: '#107c41', color: '#ffffff', bold: true, align: 'right', border: 'all', borderColor: '#0d6535' },
          G12: { value: 'Bread', border: 'all', borderColor: '#d4d4d4', align: 'left' },
          H12: { value: '50', format: 'number', border: 'all', borderColor: '#d4d4d4', align: 'right' },
          G13: { value: 'Donuts', border: 'all', borderColor: '#d4d4d4', align: 'left' },
          H13: { value: '100', format: 'number', border: 'all', borderColor: '#d4d4d4', align: 'right' },
          G14: { value: 'Cookies', border: 'all', borderColor: '#d4d4d4', align: 'left' },
          H14: { value: '40', format: 'number', border: 'all', borderColor: '#d4d4d4', align: 'right' },
          G15: { value: 'Cakes', border: 'all', borderColor: '#d4d4d4', align: 'left' },
          H15: { value: '50', format: 'number', border: 'all', borderColor: '#d4d4d4', align: 'right' },
          G16: { value: 'Pies', border: 'all', borderColor: '#d4d4d4', align: 'left' },
          H16: { value: '20', format: 'number', border: 'all', borderColor: '#d4d4d4', align: 'right' },
          G17: { value: 'COUNT >', bold: true, align: 'right' },
          H17: { value: '', border: 'outside', borderColor: '#ed7d31', borderStyle: 'thick', align: 'right' },
        },
      },
      sheet4: {
        label: 'AVERAGE',
        isRTL: false,
        colWidths: { A: 32, B: 420, C: 24, D: 120, E: 100 },
        rowHeights: { 1: 18, 2: 36, 3: 26, 4: 24, 5: 22, 6: 22, 7: 22, 8: 26 },
        data: {
          B2: { value: 'The AVERAGE function', bold: true, fontSize: 18, color: '#262626' },
          B3: { value: '', border: 'bottom', borderColor: '#107c41', borderStyle: 'thick' },
          B4: { value: 'Use the AVERAGE function to find the mathematical mean of a set of numbers.', color: '#333333', wrapText: true },
          D3: { value: 'Bakery Item', bg: '#107c41', color: '#ffffff', bold: true, align: 'left', border: 'all', borderColor: '#0d6535' },
          E3: { value: 'Daily Sales', bg: '#107c41', color: '#ffffff', bold: true, align: 'right', border: 'all', borderColor: '#0d6535' },
          D4: { value: 'Croissant', border: 'all', borderColor: '#d4d4d4' },
          E4: { value: '140', format: 'number', border: 'all', borderColor: '#d4d4d4', align: 'right' },
          D5: { value: 'Muffin', border: 'all', borderColor: '#d4d4d4' },
          E5: { value: '95', format: 'number', border: 'all', borderColor: '#d4d4d4', align: 'right' },
          D6: { value: 'Baguette', border: 'all', borderColor: '#d4d4d4' },
          E6: { value: '210', format: 'number', border: 'all', borderColor: '#d4d4d4', align: 'right' },
          D7: { value: 'Bagel', border: 'all', borderColor: '#d4d4d4' },
          E7: { value: '115', format: 'number', border: 'all', borderColor: '#d4d4d4', align: 'right' },
          D8: { value: 'AVERAGE >', bold: true, align: 'right' },
          E8: { value: '140', formula: '=AVERAGE(E4:E7)', bold: true, align: 'right', bg: '#fff2cc', border: 'all', borderColor: '#d4d4d4' },
        },
      },
      sheet5: {
        label: 'MIN & MAX',
        isRTL: false,
        colWidths: { A: 32, B: 420, C: 24, D: 120, E: 100 },
        data: {
          B2: { value: 'MIN and MAX functions', bold: true, fontSize: 18, color: '#262626' },
          B3: { value: '', border: 'bottom', borderColor: '#107c41', borderStyle: 'thick' },
          B4: { value: 'Use MIN to get the smallest number, and MAX to get the highest number in a range.', color: '#333333', wrapText: true },
          D3: { value: 'Student', bg: '#107c41', color: '#ffffff', bold: true },
          E3: { value: 'Score', bg: '#107c41', color: '#ffffff', bold: true, align: 'right' },
          D4: { value: 'Alex', border: 'all' },
          E4: { value: '88', border: 'all', align: 'right' },
          D5: { value: 'Sarah', border: 'all' },
          E5: { value: '96', border: 'all', align: 'right' },
          D6: { value: 'Omar', border: 'all' },
          E6: { value: '72', border: 'all', align: 'right' },
          D7: { value: 'MAX >', bold: true, align: 'right' },
          E7: { value: '96', formula: '=MAX(E4:E6)', bold: true, bg: '#fff2cc', border: 'all', align: 'right' },
          D8: { value: 'MIN >', bold: true, align: 'right' },
          E8: { value: '72', formula: '=MIN(E4:E6)', bold: true, bg: '#fff2cc', border: 'all', align: 'right' },
        },
      },
      sheet6: {
        label: 'Date & Time',
        isRTL: false,
        colWidths: { A: 32, B: 420, C: 24, D: 140, E: 140 },
        data: {
          B2: { value: 'Date & Time Functions', bold: true, fontSize: 18, color: '#262626' },
          B3: { value: '', border: 'bottom', borderColor: '#107c41', borderStyle: 'thick' },
          B4: { value: 'Excel stores dates as sequential serial numbers so they can be used in calculations.', color: '#333333', wrapText: true },
          D3: { value: 'Function', bg: '#107c41', color: '#ffffff', bold: true },
          E3: { value: 'Result', bg: '#107c41', color: '#ffffff', bold: true, align: 'right' },
          D4: { value: 'TODAY()', border: 'all' },
          E4: { value: '10/28/2026', formula: '=TODAY()', border: 'all', bg: '#fff2cc', align: 'right' },
          D5: { value: 'YEAR(TODAY())', border: 'all' },
          E5: { value: '2026', formula: '=YEAR(TODAY())', border: 'all', bg: '#fff2cc', align: 'right' },
        },
      },
      sheet7: {
        label: 'Joining text and numbers',
        isRTL: false,
        colWidths: { A: 32, B: 420, C: 24, D: 100, E: 100, F: 160 },
        data: {
          B2: { value: 'Joining text and numbers', bold: true, fontSize: 18, color: '#262626' },
          B3: { value: '', border: 'bottom', borderColor: '#107c41', borderStyle: 'thick' },
          B4: { value: 'Use the ampersand (&) or CONCAT to combine text from multiple cells into one.', color: '#333333', wrapText: true },
          D3: { value: 'First Name', bg: '#107c41', color: '#ffffff', bold: true },
          E3: { value: 'Last Name', bg: '#107c41', color: '#ffffff', bold: true },
          F3: { value: 'Full Name', bg: '#107c41', color: '#ffffff', bold: true },
          D4: { value: 'Nancy', border: 'all' },
          E4: { value: 'Freehafer', border: 'all' },
          F4: { value: 'Nancy Freehafer', formula: '=CONCAT(D4," ",E4)', border: 'all', bg: '#fff2cc' },
        },
      },
      sheet8: {
        label: 'IF statements',
        isRTL: false,
        colWidths: { A: 32, B: 420, C: 24, D: 100, E: 100, F: 120 },
        data: {
          B2: { value: 'The IF statement', bold: true, fontSize: 18, color: '#262626' },
          B3: { value: '', border: 'bottom', borderColor: '#107c41', borderStyle: 'thick' },
          B4: { value: 'The IF function lets you make a logical comparison between a value and what you expect.', color: '#333333', wrapText: true },
          D3: { value: 'Sales Rep', bg: '#107c41', color: '#ffffff', bold: true },
          E3: { value: 'Sales', bg: '#107c41', color: '#ffffff', bold: true, align: 'right' },
          F3: { value: 'Commission', bg: '#107c41', color: '#ffffff', bold: true, align: 'right' },
          D4: { value: 'Robert', border: 'all' },
          E4: { value: '15000', border: 'all', align: 'right' },
          F4: { value: '1500', formula: '=IF(E4>10000, E4*0.1, 0)', border: 'all', bg: '#fff2cc', align: 'right' },
        },
      },
      sheet9: {
        label: 'VLOOKUP',
        isRTL: false,
        colWidths: { A: 32, B: 420, C: 24, D: 100, E: 140, F: 100 },
        data: {
          B2: { value: 'The VLOOKUP function', bold: true, fontSize: 18, color: '#262626' },
          B3: { value: '', border: 'bottom', borderColor: '#107c41', borderStyle: 'thick' },
          B4: { value: 'Use VLOOKUP when you need to find things in a table or a range by row.', color: '#333333', wrapText: true },
          D3: { value: 'ID', bg: '#107c41', color: '#ffffff', bold: true },
          E3: { value: 'Product', bg: '#107c41', color: '#ffffff', bold: true },
          F3: { value: 'Price', bg: '#107c41', color: '#ffffff', bold: true, align: 'right' },
          D4: { value: '101', border: 'all' },
          E4: { value: 'Chai Tea', border: 'all' },
          F4: { value: '$18.00', border: 'all', align: 'right' },
          D5: { value: '102', border: 'all' },
          E5: { value: 'Espresso', border: 'all' },
          F5: { value: '$22.00', border: 'all', align: 'right' },
        },
      },
      sheet10: {
        label: 'Conditional Functions',
        isRTL: false,
        colWidths: { A: 32, B: 420, C: 24, D: 120, E: 120 },
        data: {
          B2: { value: 'SUMIF and COUNTIF', bold: true, fontSize: 18, color: '#262626' },
          B3: { value: '', border: 'bottom', borderColor: '#107c41', borderStyle: 'thick' },
          B4: { value: 'Use conditional functions to sum or count cells that meet specific criteria.', color: '#333333', wrapText: true },
          D3: { value: 'Category', bg: '#107c41', color: '#ffffff', bold: true },
          E3: { value: 'Amount', bg: '#107c41', color: '#ffffff', bold: true, align: 'right' },
          D4: { value: 'Food', border: 'all' },
          E4: { value: '500', border: 'all', align: 'right' },
          D5: { value: 'Travel', border: 'all' },
          E5: { value: '1200', border: 'all', align: 'right' },
        },
      },
      sheet11: {
        label: 'Function Wizard',
        isRTL: false,
        colWidths: { A: 32, B: 440, C: 120 },
        data: {
          B2: { value: 'Using the Function Wizard (fx)', bold: true, fontSize: 18, color: '#262626' },
          B3: { value: '', border: 'bottom', borderColor: '#107c41', borderStyle: 'thick' },
          B4: { value: 'Click the fx button next to the formula bar anytime to search for functions and view their arguments and descriptions.', color: '#333333', wrapText: true },
        },
      },
    },
  },


  // 3. Welcome to Excel (Take a tour)
  {
    id: 'take_a_tour',
    title: 'جولة تعريفية في إكسيل 365',
    titleEn: 'Welcome to Excel',
    category: 'tutorials',
    badge: '➔',
    accentColor: '#008272',
    iconType: 'tour',
    description: 'تعرف على أهم ميزات إكسيل 365 الحديثة: الجداول الذكية، التحليل السريع، والتعبئة التلقائية.',
    sheets: {
      sheet1: {
        label: 'مرحباً بك',
        data: {
          A1: { value: 'مرحباً بك في إكسيل 365 (Welcome to Excel)', bold: true, fontSize: 18, color: '#008272' },
          A3: { value: 'المنتج', bold: true, bg: '#008272', color: '#ffffff', border: 'all' },
          B3: { value: 'الربع الأول', bold: true, bg: '#008272', color: '#ffffff', border: 'all' },
          C3: { value: 'الربع الثاني', bold: true, bg: '#008272', color: '#ffffff', border: 'all' },
          D3: { value: 'الربع الثالث', bold: true, bg: '#008272', color: '#ffffff', border: 'all' },
          E3: { value: 'الإجمالي', bold: true, bg: '#008272', color: '#ffffff', border: 'all' },
          A4: { value: 'أجهزة حاسوب', border: 'all' },
          B4: { value: '12000', format: 'currency-usd', border: 'all' },
          C4: { value: '15500', format: 'currency-usd', border: 'all' },
          D4: { value: '18200', format: 'currency-usd', border: 'all' },
          E4: { value: '45700', formula: '=SUM(B4:D4)', bold: true, border: 'all', bg: '#f0fdfa' },
          A5: { value: 'شاشات عرض', border: 'all' },
          B5: { value: '6400', format: 'currency-usd', border: 'all' },
          C5: { value: '7100', format: 'currency-usd', border: 'all' },
          D5: { value: '8900', format: 'currency-usd', border: 'all' },
          E5: { value: '22400', formula: '=SUM(B5:D5)', bold: true, border: 'all', bg: '#f0fdfa' },
        },
      },
    },
  },

  // 4. Power Query Tutorial
  {
    id: 'power_query_tutorial',
    title: 'تعلم استعلامات Power Query',
    titleEn: 'Power Query tutorial',
    category: 'tutorials',
    badge: 'ETL',
    accentColor: '#107c41',
    iconType: 'powerquery',
    description: 'دمج البيانات وتنظيفها وتوحيد مصادر متعددة تلقائياً عبر Power Query.',
    sheets: {
      sheet1: {
        label: 'بيانات أولية',
        data: {
          A1: { value: 'استعلامات Power Query - دمج وتنظيف البيانات', bold: true, fontSize: 16, color: '#107c41' },
          A3: { value: 'معرف السجل', bold: true, bg: '#064e3b', color: '#ffffff', border: 'all' },
          B3: { value: 'الاسم الكامل', bold: true, bg: '#064e3b', color: '#ffffff', border: 'all' },
          C3: { value: 'المدينة', bold: true, bg: '#064e3b', color: '#ffffff', border: 'all' },
          D3: { value: 'المبيعات', bold: true, bg: '#064e3b', color: '#ffffff', border: 'all' },
          A4: { value: 'REC-101', border: 'all' },
          B4: { value: 'أحمد علي عبد الله', border: 'all' },
          C4: { value: 'الرياض', border: 'all' },
          D4: { value: '24500', format: 'currency-sar', border: 'all' },
          A5: { value: 'REC-102', border: 'all' },
          B5: { value: 'سارة خالد المنصور', border: 'all' },
          C5: { value: 'جدة', border: 'all' },
          D5: { value: '38200', format: 'currency-sar', border: 'all' },
        },
      },
    },
  },

  // 5. PivotTable Tutorial
  {
    id: 'pivottable_tutorial',
    title: 'إنشاء أول جدول محوري PivotTable',
    titleEn: 'Make your first PivotTable',
    category: 'tutorials',
    badge: '📊',
    accentColor: '#0078d4',
    iconType: 'pivottable',
    description: 'تلخيص ملايين الصفوف بضغطة زر وتصنيف المبيعات والمصروفات بدقة متناهية.',
    sheets: {
      sheet1: {
        label: 'المبيعات',
        data: {
          A1: { value: 'بيانات المصدر للجدول المحوري', bold: true, fontSize: 16, color: '#0078d4' },
          A3: { value: 'المنطقة', bold: true, bg: '#0078d4', color: '#ffffff', border: 'all' },
          B3: { value: 'المندوب', bold: true, bg: '#0078d4', color: '#ffffff', border: 'all' },
          C3: { value: 'الفئة', bold: true, bg: '#0078d4', color: '#ffffff', border: 'all' },
          D3: { value: 'المبيعات', bold: true, bg: '#0078d4', color: '#ffffff', border: 'all' },
          A4: { value: 'الوسطى', border: 'all' }, B4: { value: 'فيصل', border: 'all' }, C4: { value: 'إلكترونيات', border: 'all' }, D4: { value: '15000', format: 'number', border: 'all' },
          A5: { value: 'الغربية', border: 'all' }, B5: { value: 'عمر', border: 'all' }, C5: { value: 'أثاث', border: 'all' }, D5: { value: '22000', format: 'number', border: 'all' },
          A6: { value: 'الوسطى', border: 'all' }, B6: { value: 'فيصل', border: 'all' }, C6: { value: 'أثاث', border: 'all' }, D6: { value: '18500', format: 'number', border: 'all' },
          A7: { value: 'الشرقية', border: 'all' }, B7: { value: 'سعد', border: 'all' }, C7: { value: 'إلكترونيات', border: 'all' }, D7: { value: '31000', format: 'number', border: 'all' },
        },
      },
    },
  },

  // 6. Beyond Pie Charts Tutorial
  {
    id: 'beyond_pie_charts',
    title: 'تخطي المخططات الدائرية (مخططات متقدمة)',
    titleEn: 'Going beyond Pie charts',
    category: 'charts',
    badge: '📈',
    accentColor: '#107c41',
    iconType: 'charts',
    description: 'استخدام مخططات الأعمدة المكدسة، التدرج، والمخططات المركبة للتحليل المالي المتفوق.',
    sheets: {
      sheet1: {
        label: 'مخططات متقدمة',
        data: {
          A1: { value: 'تحليل توزيع الحصص السوقية', bold: true, fontSize: 16, color: '#107c41' },
          A3: { value: 'القطاع', bold: true, bg: '#107c41', color: '#ffffff', border: 'all' },
          B3: { value: 'سنة 2024', bold: true, bg: '#107c41', color: '#ffffff', border: 'all' },
          C3: { value: 'سنة 2025', bold: true, bg: '#107c41', color: '#ffffff', border: 'all' },
          D3: { value: 'سنة 2026', bold: true, bg: '#107c41', color: '#ffffff', border: 'all' },
          A4: { value: 'الحوسبة السحابية', border: 'all' }, B4: { value: '45%', border: 'all' }, C4: { value: '55%', border: 'all' }, D4: { value: '68%', border: 'all' },
          A5: { value: 'الذكاء الاصطناعي', border: 'all' }, B5: { value: '30%', border: 'all' }, C5: { value: '48%', border: 'all' }, D5: { value: '72%', border: 'all' },
          A6: { value: 'الأمن السيبراني', border: 'all' }, B6: { value: '50%', border: 'all' }, C6: { value: '60%', border: 'all' }, D6: { value: '80%', border: 'all' },
        },
      },
    },
  },

  // 7. Seasonal Photo Calendar
  {
    id: 'seasonal_photo_calendar',
    title: 'تقويم الفصول المصور',
    titleEn: 'Seasonal photo calendar',
    category: 'calendars',
    accentColor: '#16a34a',
    iconType: 'calendar',
    description: 'تقويم سنوي وشهري منظم لمتابعة المواعيد والمناسبات الموسمية بتصميم أنيق.',
    sheets: {
      sheet1: {
        label: 'تقويم الربيع',
        data: {
          A1: { value: 'تقويم إكسيل 365 - الربيع', bold: true, fontSize: 18, color: '#16a34a' },
          A3: { value: 'الأحد', bold: true, bg: '#dcfce7', color: '#166534', align: 'center', border: 'all' },
          B3: { value: 'الاثنين', bold: true, bg: '#dcfce7', color: '#166534', align: 'center', border: 'all' },
          C3: { value: 'الثلاثاء', bold: true, bg: '#dcfce7', color: '#166534', align: 'center', border: 'all' },
          D3: { value: 'الأربعاء', bold: true, bg: '#dcfce7', color: '#166534', align: 'center', border: 'all' },
          E3: { value: 'الخميس', bold: true, bg: '#dcfce7', color: '#166534', align: 'center', border: 'all' },
          F3: { value: 'الجمعة', bold: true, bg: '#dcfce7', color: '#166534', align: 'center', border: 'all' },
          G3: { value: 'السبت', bold: true, bg: '#dcfce7', color: '#166534', align: 'center', border: 'all' },
          A4: { value: '1', align: 'center', border: 'all' }, B4: { value: '2', align: 'center', border: 'all' }, C4: { value: '3', align: 'center', border: 'all' },
          D4: { value: '4', align: 'center', border: 'all' }, E4: { value: '5', align: 'center', border: 'all' }, F4: { value: '6', align: 'center', border: 'all' }, G4: { value: '7', align: 'center', border: 'all' },
          A5: { value: '8', align: 'center', border: 'all' }, B5: { value: '9', align: 'center', border: 'all' }, C5: { value: '10', align: 'center', border: 'all' },
          D5: { value: '11', align: 'center', border: 'all' }, E5: { value: '12', align: 'center', border: 'all' }, F5: { value: '13', align: 'center', border: 'all' }, G5: { value: '14', align: 'center', border: 'all' },
        },
      },
    },
  },

  // 8. Personal Monthly Budget
  {
    id: 'personal_monthly_budget',
    title: 'الميزانية الشهرية الشخصية',
    titleEn: 'Personal monthly budget',
    category: 'budgets',
    accentColor: '#0284c7',
    iconType: 'budget',
    description: 'تتبع الدخل الشهري مقابل المصروفات الفعلية مع حساب صافي التوفير بصيغ تلقائية.',
    sheets: {
      sheet1: {
        label: 'الميزانية',
        data: {
          A1: { value: 'الميزانية الشهرية الشخصية (Personal Monthly Budget)', bold: true, fontSize: 18, color: '#0369a1' },
          A3: { value: 'الدخل المتوقع', bold: true, bg: '#e0f2fe', color: '#0369a1' },
          B3: { value: '15000', format: 'currency-sar', bold: true },
          A4: { value: 'الدخل الفعلي', bold: true, bg: '#e0f2fe', color: '#0369a1' },
          B4: { value: '15800', format: 'currency-sar', bold: true },
          A6: { value: 'فئة المصروف', bold: true, bg: '#0284c7', color: '#ffffff', border: 'all' },
          B6: { value: 'المقدر', bold: true, bg: '#0284c7', color: '#ffffff', border: 'all' },
          C6: { value: 'الفعلي', bold: true, bg: '#0284c7', color: '#ffffff', border: 'all' },
          D6: { value: 'الفرق', bold: true, bg: '#0284c7', color: '#ffffff', border: 'all' },
          A7: { value: 'إيجار السكن والمرافق', border: 'all' }, B7: { value: '4000', format: 'currency-sar', border: 'all' }, C7: { value: '4000', format: 'currency-sar', border: 'all' }, D7: { value: '0', formula: '=B7-C7', border: 'all' },
          A8: { value: 'المواد التموينية والبقالة', border: 'all' }, B8: { value: '2500', format: 'currency-sar', border: 'all' }, C8: { value: '2350', format: 'currency-sar', border: 'all' }, D8: { value: '150', formula: '=B8-C8', border: 'all' },
          A9: { value: 'المواصلات والوقود', border: 'all' }, B9: { value: '1200', format: 'currency-sar', border: 'all' }, C9: { value: '1100', format: 'currency-sar', border: 'all' }, D9: { value: '100', formula: '=B9-C9', border: 'all' },
          A10: { value: 'الصحة والتعليم', border: 'all' }, B10: { value: '1500', format: 'currency-sar', border: 'all' }, C10: { value: '1400', format: 'currency-sar', border: 'all' }, D10: { value: '100', formula: '=B10-C10', border: 'all' },
          A11: { value: 'إجمالي المصروفات', bold: true, bg: '#bae6fd', border: 'all' },
          B11: { value: '9200', formula: '=SUM(B7:B10)', bold: true, border: 'all', format: 'currency-sar' },
          C11: { value: '8850', formula: '=SUM(C7:C10)', bold: true, border: 'all', format: 'currency-sar' },
          D11: { value: '350', formula: '=SUM(D7:D10)', bold: true, border: 'all', format: 'currency-sar' },
        },
      },
    },
  },

  // 9. Seasonal Illustrated Calendar
  {
    id: 'seasonal_illustrated_calendar',
    title: 'تقويم الفصول المصور لجميع السنوات',
    titleEn: 'Seasonal illustrated calendar',
    category: 'calendars',
    accentColor: '#3b82f6',
    iconType: 'calendar',
    description: 'تقويم متعدد السنوات مع علامات توضيحية وتخطيطات أسبوعية مرنة.',
    sheets: {
      sheet1: {
        label: 'يناير',
        data: {
          A1: { value: 'يناير 2026 - تقويم illustrated', bold: true, fontSize: 16, color: '#1e40af' },
          A3: { value: 'الأحد', bold: true, bg: '#dbeafe', align: 'center', border: 'all' },
          B3: { value: 'الاثنين', bold: true, bg: '#dbeafe', align: 'center', border: 'all' },
          C3: { value: 'الثلاثاء', bold: true, bg: '#dbeafe', align: 'center', border: 'all' },
          D3: { value: 'الأربعاء', bold: true, bg: '#dbeafe', align: 'center', border: 'all' },
          E3: { value: 'الخميس', bold: true, bg: '#dbeafe', align: 'center', border: 'all' },
          F3: { value: 'الجمعة', bold: true, bg: '#dbeafe', align: 'center', border: 'all' },
          G3: { value: 'السبت', bold: true, bg: '#dbeafe', align: 'center', border: 'all' },
          A4: { value: '4', align: 'center', border: 'all' }, B4: { value: '5', align: 'center', border: 'all' }, C4: { value: '6', align: 'center', border: 'all' },
          D4: { value: '7', align: 'center', border: 'all' }, E4: { value: '8', align: 'center', border: 'all' }, F4: { value: '9', align: 'center', border: 'all' }, G4: { value: '10', align: 'center', border: 'all' },
        },
      },
    },
  },

  // 10. Any Year One-Month Calendar
  {
    id: 'any_year_one_month_calendar',
    title: 'تقويم شهري لأي سنة',
    titleEn: 'Any year one-month calendar',
    category: 'calendars',
    accentColor: '#475569',
    iconType: 'calendar',
    description: 'اختر الشهر والسنة ليتم إعادة بناء تواريخ أيام الشهر وتوزيعها آلياً.',
    sheets: {
      sheet1: {
        label: 'التقويم الشهري',
        data: {
          A1: { value: 'التقويم الشهري الذكي (Any Year Calendar)', bold: true, fontSize: 16, color: '#334155' },
          A2: { value: 'السنة: 2026', bold: true }, B2: { value: 'الشهر: يناير', bold: true },
          A4: { value: 'الأحد', bold: true, bg: '#f1f5f9', border: 'all', align: 'center' },
          B4: { value: 'الاثنين', bold: true, bg: '#f1f5f9', border: 'all', align: 'center' },
          C4: { value: 'الثلاثاء', bold: true, bg: '#f1f5f9', border: 'all', align: 'center' },
          D4: { value: 'الأربعاء', bold: true, bg: '#f1f5f9', border: 'all', align: 'center' },
          E4: { value: 'الخميس', bold: true, bg: '#f1f5f9', border: 'all', align: 'center' },
          F4: { value: 'الجمعة', bold: true, bg: '#f1f5f9', border: 'all', align: 'center' },
          G4: { value: 'السبت', bold: true, bg: '#f1f5f9', border: 'all', align: 'center' },
        },
      },
    },
  },

  // 11. Academic Calendar
  {
    id: 'academic_calendar',
    title: 'التقويم الأكاديمي والجامعي',
    titleEn: 'Academic calendar',
    category: 'calendars',
    accentColor: '#0f172a',
    iconType: 'calendar',
    description: 'جدول الفصول الدراسية، فترات الاختبارات النصفية والنهائية، ومواعيد الإجازات.',
    sheets: {
      sheet1: {
        label: 'الخطة الدراسية',
        data: {
          A1: { value: 'التقويم الأكاديمي للعام الدراسي 2025 - 2026', bold: true, fontSize: 16, color: '#0f172a' },
          A3: { value: 'الأسبوع', bold: true, bg: '#1e293b', color: '#ffffff', border: 'all' },
          B3: { value: 'تاريخ البدء', bold: true, bg: '#1e293b', color: '#ffffff', border: 'all' },
          C3: { value: 'الموضوع الدراسي / الحدث', bold: true, bg: '#1e293b', color: '#ffffff', border: 'all' },
          D3: { value: 'الملاحظات والاختبارات', bold: true, bg: '#1e293b', color: '#ffffff', border: 'all' },
          A4: { value: 'الأسبوع 1', border: 'all' }, B4: { value: '2026/01/10', border: 'all' }, C4: { value: 'بدء الفصل الدراسي والتهيئة', border: 'all' }, D4: { value: 'تسليم الجداول', border: 'all' },
          A5: { value: 'الأسبوع 2', border: 'all' }, B5: { value: '2026/01/17', border: 'all' }, C5: { value: 'المحاضرات التأسيسية', border: 'all' }, D5: { value: '-', border: 'all' },
        },
      },
    },
  },

  // 12. Monthly Company Budget
  {
    id: 'monthly_company_budget',
    title: 'ميزانية الشركة الشهرية',
    titleEn: 'Monthly company budget',
    category: 'budgets',
    accentColor: '#1e40af',
    iconType: 'budget',
    description: 'متابعة المبيعات المؤسسية وتكاليف التشغيل والرواتب والتسويق مع هوامش الربح التشغيلي.',
    sheets: {
      sheet1: {
        label: 'الميزانية المؤسسية',
        data: {
          A1: { value: 'ميزانية الشركة الشهرية (Monthly Company Budget)', bold: true, fontSize: 18, color: '#1e3a8a' },
          A3: { value: 'بند الإيرادات', bold: true, bg: '#1e40af', color: '#ffffff', border: 'all' },
          B3: { value: 'الميزانية التقديرية', bold: true, bg: '#1e40af', color: '#ffffff', border: 'all' },
          C3: { value: 'الإيراد الفعلي', bold: true, bg: '#1e40af', color: '#ffffff', border: 'all' },
          D3: { value: 'الانحراف', bold: true, bg: '#1e40af', color: '#ffffff', border: 'all' },
          A4: { value: 'مبيعات المنتجات والبرمجيات', border: 'all' }, B4: { value: '180000', format: 'currency-sar', border: 'all' }, C4: { value: '195000', format: 'currency-sar', border: 'all' }, D4: { value: '15000', formula: '=C4-B4', border: 'all' },
          A5: { value: 'خدمات الدعم الفني والاستضافة', border: 'all' }, B5: { value: '75000', format: 'currency-sar', border: 'all' }, C5: { value: '82000', format: 'currency-sar', border: 'all' }, D5: { value: '7000', formula: '=C5-B5', border: 'all' },
          A6: { value: 'إجمالي الإيرادات', bold: true, bg: '#dbeafe', border: 'all' },
          B6: { value: '255000', formula: '=SUM(B4:B5)', bold: true, border: 'all', format: 'currency-sar' },
          C6: { value: '277000', formula: '=SUM(C4:C5)', bold: true, border: 'all', format: 'currency-sar' },
          D6: { value: '22000', formula: '=C6-B6', bold: true, border: 'all', format: 'currency-sar' },
        },
      },
    },
  },

  // 13. Household Monthly Budget
  {
    id: 'household_monthly_budget',
    title: 'ميزانية الأسرة والمنزل',
    titleEn: 'Household monthly budget',
    category: 'budgets',
    accentColor: '#059669',
    iconType: 'budget',
    description: 'توزيع مصروفات الأسرة بين الأساسيات، الادخار، الترفيه والطوارئ لضبط الإنفاق العائلي.',
    sheets: {
      sheet1: {
        label: 'ميزانية المنزل',
        data: {
          A1: { value: 'ميزانية مصروفات المنزل العائلية', bold: true, fontSize: 16, color: '#047857' },
          A3: { value: 'بند الصرف', bold: true, bg: '#059669', color: '#ffffff', border: 'all' },
          B3: { value: 'المخصص', bold: true, bg: '#059669', color: '#ffffff', border: 'all' },
          C3: { value: 'المنصرف', bold: true, bg: '#059669', color: '#ffffff', border: 'all' },
          D3: { value: 'المتبقي', bold: true, bg: '#059669', color: '#ffffff', border: 'all' },
          A4: { value: 'فواتير الكهرباء والإنترنت', border: 'all' }, B4: { value: '900', format: 'currency-sar', border: 'all' }, C4: { value: '820', format: 'currency-sar', border: 'all' }, D4: { value: '80', formula: '=B4-C4', border: 'all' },
          A5: { value: 'تموين السوبرماركت', border: 'all' }, B5: { value: '3200', format: 'currency-sar', border: 'all' }, C5: { value: '3100', format: 'currency-sar', border: 'all' }, D5: { value: '100', formula: '=B5-C5', border: 'all' },
          A6: { value: 'مصاريف الأبناء والمدارس', border: 'all' }, B6: { value: '1800', format: 'currency-sar', border: 'all' }, C6: { value: '1750', format: 'currency-sar', border: 'all' }, D6: { value: '50', formula: '=B6-C6', border: 'all' },
        },
      },
    },
  },

  // 14. Premium Weekly Chore Schedule
  {
    id: 'weekly_chore_schedule',
    title: 'جدول المهام والأعمال الأسبوعي المميز',
    titleEn: 'Premium weekly chore schedule',
    category: 'planners',
    accentColor: '#84cc16',
    iconType: 'checklist',
    description: 'متابعة المهام المنزلية وفريق العمل على مدار أيام الأسبوع مع خانات إنجاز مرئية.',
    sheets: {
      sheet1: {
        label: 'المهام الأسبوعية',
        data: {
          A1: { value: 'جدول المهام والواجبات الأسبوعية', bold: true, fontSize: 16, color: '#4d7c0f' },
          A3: { value: 'المهمة', bold: true, bg: '#65a30d', color: '#ffffff', border: 'all' },
          B3: { value: 'المسؤول', bold: true, bg: '#65a30d', color: '#ffffff', border: 'all' },
          C3: { value: 'السبت', bold: true, bg: '#ecfccb', border: 'all', align: 'center' },
          D3: { value: 'الأحد', bold: true, bg: '#ecfccb', border: 'all', align: 'center' },
          E3: { value: 'الاثنين', bold: true, bg: '#ecfccb', border: 'all', align: 'center' },
          F3: { value: 'الثلاثاء', bold: true, bg: '#ecfccb', border: 'all', align: 'center' },
          G3: { value: 'الأربعاء', bold: true, bg: '#ecfccb', border: 'all', align: 'center' },
          H3: { value: 'الخميس', bold: true, bg: '#ecfccb', border: 'all', align: 'center' },
          A4: { value: 'النسخ الاحتياطي ومراجعة السيرفرات', border: 'all' }, B4: { value: 'سعد', border: 'all' }, C4: { value: '✓', align: 'center', border: 'all' }, D4: { value: '✓', align: 'center', border: 'all' }, E4: { value: '✓', align: 'center', border: 'all' }, F4: { value: '✓', align: 'center', border: 'all' }, G4: { value: '✓', align: 'center', border: 'all' }, H4: { value: '✓', align: 'center', border: 'all' },
          A5: { value: 'فحص جودة قواعد البيانات', border: 'all' }, B5: { value: 'أحمد', border: 'all' }, C5: { value: '', align: 'center', border: 'all' }, D5: { value: '✓', align: 'center', border: 'all' }, E5: { value: '', align: 'center', border: 'all' }, F5: { value: '✓', align: 'center', border: 'all' }, G5: { value: '', align: 'center', border: 'all' }, H5: { value: '✓', align: 'center', border: 'all' },
        },
      },
    },
  },

  // 15. Basic Business Invoice
  {
    id: 'basic_business_invoice',
    title: 'فاتورة أعمال تجارية أساسية',
    titleEn: 'Basic business invoice',
    category: 'business',
    accentColor: '#0284c7',
    iconType: 'invoice',
    description: 'فاتورة ضريبية رسمية تتضمن حساب الضريبة VAT، الخصومات، وصافي المبلغ المطلوب.',
    sheets: {
      sheet1: {
        label: 'فاتورة',
        data: {
          A1: { value: 'فاتورة ضريبية (Tax Invoice)', bold: true, fontSize: 18, color: '#0369a1' },
          A2: { value: 'رقم الفاتورة: INV-2026-0881', bold: true },
          A3: { value: 'التاريخ: 2026/10/28', bold: true },
          A5: { value: 'البند / وصف الخدمة', bold: true, bg: '#0284c7', color: '#ffffff', border: 'all' },
          B5: { value: 'الكمية', bold: true, bg: '#0284c7', color: '#ffffff', border: 'all', align: 'center' },
          C5: { value: 'سعر الوحدة', bold: true, bg: '#0284c7', color: '#ffffff', border: 'all', align: 'center' },
          D5: { value: 'الإجمالي', bold: true, bg: '#0284c7', color: '#ffffff', border: 'all', align: 'center' },
          A6: { value: 'تطوير واجهة برمجية متقدمة', border: 'all' }, B6: { value: '1', format: 'number', border: 'all', align: 'center' }, C6: { value: '8500', format: 'currency-sar', border: 'all' }, D6: { value: '8500', formula: '=B6*C6', border: 'all', format: 'currency-sar' },
          A7: { value: 'خادم سحابي سيادي سنوي', border: 'all' }, B7: { value: '2', format: 'number', border: 'all', align: 'center' }, C7: { value: '3200', format: 'currency-sar', border: 'all' }, D7: { value: '6400', formula: '=B7*C7', border: 'all', format: 'currency-sar' },
          A8: { value: 'المجموع الفرعي', bold: true, border: 'all' }, D8: { value: '14900', formula: '=SUM(D6:D7)', bold: true, border: 'all', format: 'currency-sar' },
          A9: { value: 'ضريبة القيمة المضافة (15%)', bold: true, border: 'all' }, D9: { value: '2235', formula: '=D8*0.15', bold: true, border: 'all', format: 'currency-sar' },
          A10: { value: 'المبلغ الإجمالي المستحق', bold: true, bg: '#e0f2fe', color: '#0369a1', border: 'double-bottom' }, D10: { value: '17135', formula: '=D8+D9', bold: true, bg: '#e0f2fe', color: '#0369a1', border: 'double-bottom', format: 'currency-sar' },
        },
      },
    },
  },

  // 16. Basic Balance Sheet
  {
    id: 'basic_balance_sheet',
    title: 'الميزانية العمومية وقائمة المركز المالي',
    titleEn: 'Basic balance sheet',
    category: 'business',
    accentColor: '#1e3a8a',
    iconType: 'budget',
    description: 'قائمة الأصول والخصوم وحقوق الملكية وفق معايير المحاسبة الدولية.',
    sheets: {
      sheet1: {
        label: 'المركز المالي',
        data: {
          A1: { value: 'قائمة المركز المالي (Balance Sheet)', bold: true, fontSize: 18, color: '#1e3a8a' },
          A3: { value: 'الأصول المتداولة (Current Assets)', bold: true, bg: '#e0e7ff', color: '#3730a3' },
          A4: { value: 'النقدية وما في حكمها', border: 'all' }, B4: { value: '145000', format: 'currency-sar', border: 'all' },
          A5: { value: 'حسابات المدينين والعملاء', border: 'all' }, B5: { value: '88000', format: 'currency-sar', border: 'all' },
          A6: { value: 'المخزون السلعي', border: 'all' }, B6: { value: '52000', format: 'currency-sar', border: 'all' },
          A7: { value: 'إجمالي الأصول المتداولة', bold: true, bg: '#c7d2fe', border: 'all' }, B7: { value: '285000', formula: '=SUM(B4:B6)', bold: true, border: 'all', format: 'currency-sar' },
          A9: { value: 'الخصوم المتداولة (Current Liabilities)', bold: true, bg: '#fee2e2', color: '#991b1b' },
          A10: { value: 'حسابات الموردين والدائنين', border: 'all' }, B10: { value: '62000', format: 'currency-sar', border: 'all' },
          A11: { value: 'مصروفات مستحقة', border: 'all' }, B11: { value: '18000', format: 'currency-sar', border: 'all' },
          A12: { value: 'إجمالي الخصوم', bold: true, bg: '#fecaca', border: 'all' }, B12: { value: '80000', formula: '=SUM(B10:B11)', bold: true, border: 'all', format: 'currency-sar' },
        },
      },
    },
  },

  // 17. Student Schedule
  {
    id: 'student_schedule',
    title: 'الجدول الدراسي الأسبوعي للطلاب',
    titleEn: 'Student schedule',
    category: 'planners',
    accentColor: '#d97706',
    iconType: 'checklist',
    description: 'تنظيم الحصص والمحاضرات الجامعية وساعات المذاكرة مع رمز ملون لكل مادة.',
    sheets: {
      sheet1: {
        label: 'الجدول الأسبوعي',
        data: {
          A1: { value: 'الجدول الدراسي الأسبوعي (Student Schedule)', bold: true, fontSize: 16, color: '#b45309' },
          A3: { value: 'الوقت', bold: true, bg: '#fef3c7', color: '#92400e', border: 'all', align: 'center' },
          B3: { value: 'الأحد', bold: true, bg: '#fef3c7', color: '#92400e', border: 'all', align: 'center' },
          C3: { value: 'الاثنين', bold: true, bg: '#fef3c7', color: '#92400e', border: 'all', align: 'center' },
          D3: { value: 'الثلاثاء', bold: true, bg: '#fef3c7', color: '#92400e', border: 'all', align: 'center' },
          E3: { value: 'الأربعاء', bold: true, bg: '#fef3c7', color: '#92400e', border: 'all', align: 'center' },
          F3: { value: 'الخميس', bold: true, bg: '#fef3c7', color: '#92400e', border: 'all', align: 'center' },
          A4: { value: '08:00 - 09:30', border: 'all', align: 'center' }, B4: { value: 'هياكل بيانات', bg: '#e0f2fe', border: 'all' }, C4: { value: 'خوارزميات', bg: '#fef08a', border: 'all' }, D4: { value: 'هياكل بيانات', bg: '#e0f2fe', border: 'all' }, E4: { value: 'خوارزميات', bg: '#fef08a', border: 'all' }, F4: { value: 'مختبر برمجيات', bg: '#dcfce7', border: 'all' },
          A5: { value: '10:00 - 11:30', border: 'all', align: 'center' }, B5: { value: 'رياضيات متقطعة', bg: '#fce7f3', border: 'all' }, C5: { value: 'قواعد بيانات', bg: '#ede9fe', border: 'all' }, D5: { value: 'رياضيات متقطعة', bg: '#fce7f3', border: 'all' }, E5: { value: 'قواعد بيانات', bg: '#ede9fe', border: 'all' }, F5: { value: 'ندوة بحثية', bg: '#ffedd5', border: 'all' },
        },
      },
    },
  },

  // 18. Weekly Attendance Report
  {
    id: 'weekly_attendance_report',
    title: 'تقرير الحضور والغياب الأسبوعي',
    titleEn: 'Weekly attendance report',
    category: 'business',
    accentColor: '#eab308',
    iconType: 'attendance',
    description: 'كشف حضور وغياب الموظفين أو الطلاب مع احتساب نسب الحضور والغياب والأعذار آلياً.',
    sheets: {
      sheet1: {
        label: 'حضور الأسبوع',
        data: {
          A1: { value: 'تقرير الحضور والغياب الأسبوعي (Weekly Attendance)', bold: true, fontSize: 16, color: '#a16207' },
          A3: { value: 'اسم الموظف / الطالب', bold: true, bg: '#ca8a04', color: '#ffffff', border: 'all' },
          B3: { value: 'الأحد', bold: true, bg: '#ca8a04', color: '#ffffff', border: 'all', align: 'center' },
          C3: { value: 'الاثنين', bold: true, bg: '#ca8a04', color: '#ffffff', border: 'all', align: 'center' },
          D3: { value: 'الثلاثاء', bold: true, bg: '#ca8a04', color: '#ffffff', border: 'all', align: 'center' },
          E3: { value: 'الأربعاء', bold: true, bg: '#ca8a04', color: '#ffffff', border: 'all', align: 'center' },
          F3: { value: 'الخميس', bold: true, bg: '#ca8a04', color: '#ffffff', border: 'all', align: 'center' },
          G3: { value: 'أيام الحضور', bold: true, bg: '#fef08a', border: 'all', align: 'center' },
          A4: { value: 'سعد المنصور', border: 'all' }, B4: { value: 'حاضر', border: 'all', align: 'center' }, C4: { value: 'حاضر', border: 'all', align: 'center' }, D4: { value: 'حاضر', border: 'all', align: 'center' }, E4: { value: 'حاضر', border: 'all', align: 'center' }, F4: { value: 'حاضر', border: 'all', align: 'center' }, G4: { value: '5', format: 'number', bold: true, border: 'all', align: 'center' },
          A5: { value: 'فيصل العتيبي', border: 'all' }, B5: { value: 'حاضر', border: 'all', align: 'center' }, C5: { value: 'إجازة', border: 'all', align: 'center', bg: '#fee2e2' }, D5: { value: 'حاضر', border: 'all', align: 'center' }, E5: { value: 'حاضر', border: 'all', align: 'center' }, F5: { value: 'حاضر', border: 'all', align: 'center' }, G5: { value: '4', format: 'number', bold: true, border: 'all', align: 'center' },
        },
      },
    },
  },

  // 19. Simple Invoice
  {
    id: 'simple_invoice',
    title: 'فاتورة بسيطة وأنيقة',
    titleEn: 'Simple invoice',
    category: 'business',
    accentColor: '#334155',
    iconType: 'invoice',
    description: 'نموذج فاتورة سريعة مناسب للخدمات المستقلة والشركات الناشئة والمتاجر.',
    sheets: {
      sheet1: {
        label: 'الفاتورة',
        data: {
          A1: { value: 'فاتورة مبيعات مبسطة', bold: true, fontSize: 18, color: '#1e293b' },
          A3: { value: 'الوصف', bold: true, bg: '#334155', color: '#ffffff', border: 'all' },
          B3: { value: 'الكمية', bold: true, bg: '#334155', color: '#ffffff', border: 'all', align: 'center' },
          C3: { value: 'السعر', bold: true, bg: '#334155', color: '#ffffff', border: 'all', align: 'center' },
          D3: { value: 'المجموع', bold: true, bg: '#334155', color: '#ffffff', border: 'all', align: 'center' },
          A4: { value: 'تصميم هوية بصرية كاملة', border: 'all' }, B4: { value: '1', border: 'all', align: 'center' }, C4: { value: '4500', format: 'currency-sar', border: 'all' }, D4: { value: '4500', formula: '=B4*C4', border: 'all', format: 'currency-sar' },
          A5: { value: 'حملة إعلانية رقمية', border: 'all' }, B5: { value: '2', border: 'all', align: 'center' }, C5: { value: '1800', format: 'currency-sar', border: 'all' }, D5: { value: '3600', formula: '=B5*C5', border: 'all', format: 'currency-sar' },
          A6: { value: 'الإجمالي الصافي', bold: true, bg: '#f1f5f9', border: 'double-bottom' }, D6: { value: '8100', formula: '=SUM(D4:D5)', bold: true, bg: '#f1f5f9', border: 'double-bottom', format: 'currency-sar' },
        },
      },
    },
  },

  // 20. Sales Invoice Tracker
  {
    id: 'sales_invoice_tracker',
    title: 'متتبع فواتير المبيعات والتحصيل',
    titleEn: 'Sales invoice tracker',
    category: 'business',
    accentColor: '#0284c7',
    iconType: 'invoice',
    description: 'متابعة الفواتير المصدرة وتواريخ الاستحقاق والمدفوعة وغير المدفوعة.',
    sheets: {
      sheet1: {
        label: 'سجل الفواتير',
        data: {
          A1: { value: 'متتبع فواتير المبيعات (Sales Invoice Tracker)', bold: true, fontSize: 16, color: '#0284c7' },
          A3: { value: 'رقم الفاتورة', bold: true, bg: '#0284c7', color: '#ffffff', border: 'all' },
          B3: { value: 'العميل', bold: true, bg: '#0284c7', color: '#ffffff', border: 'all' },
          C3: { value: 'تاريخ الإصدار', bold: true, bg: '#0284c7', color: '#ffffff', border: 'all' },
          D3: { value: 'المبلغ', bold: true, bg: '#0284c7', color: '#ffffff', border: 'all' },
          E3: { value: 'حالة السداد', bold: true, bg: '#0284c7', color: '#ffffff', border: 'all' },
          A4: { value: 'INV-1001', border: 'all' }, B4: { value: 'شركة الأفق الرقمي', border: 'all' }, C4: { value: '2026/10/01', border: 'all' }, D4: { value: '28000', format: 'currency-sar', border: 'all' }, E4: { value: 'تم السداد', bg: '#dcfce7', color: '#166534', bold: true, border: 'all' },
          A5: { value: 'INV-1002', border: 'all' }, B5: { value: 'مؤسسة الرواد', border: 'all' }, C5: { value: '2026/10/15', border: 'all' }, D5: { value: '14500', format: 'currency-sar', border: 'all' }, E5: { value: 'معلق', bg: '#fef9c3', color: '#854d0e', bold: true, border: 'all' },
        },
      },
    },
  },

  // 21. Home Inventory
  {
    id: 'home_inventory',
    title: 'جرد أصول ومقتنيات المنزل',
    titleEn: 'Home inventory',
    category: 'lists',
    accentColor: '#0d9488',
    iconType: 'inventory',
    description: 'تسجيل الأجهزة والإلكترونيات والأثاث مع التكلفة وتاريخ الشراء لأغراض التأمين والضمان.',
    sheets: {
      sheet1: {
        label: 'مقتنيات المنزل',
        data: {
          A1: { value: 'سجل جرد أصول المنزل (Home Inventory)', bold: true, fontSize: 16, color: '#0f766e' },
          A3: { value: 'الغرفة / الموقع', bold: true, bg: '#0d9488', color: '#ffffff', border: 'all' },
          B3: { value: 'القطعة', bold: true, bg: '#0d9488', color: '#ffffff', border: 'all' },
          C3: { value: 'الشركة والموديل', bold: true, bg: '#0d9488', color: '#ffffff', border: 'all' },
          D3: { value: 'الرقم التسلسلي', bold: true, bg: '#0d9488', color: '#ffffff', border: 'all' },
          E3: { value: 'القيمة التقديرية', bold: true, bg: '#0d9488', color: '#ffffff', border: 'all' },
          A4: { value: 'غرفة المعيشة', border: 'all' }, B4: { value: 'شاشة OLED 65 بوصة', border: 'all' }, C4: { value: 'LG C3', border: 'all' }, D4: { value: 'SN-99841', border: 'all' }, E4: { value: '6200', format: 'currency-sar', border: 'all' },
          A5: { value: 'المكتب المنزلي', border: 'all' }, B5: { value: 'جهاز محمول Workstation', border: 'all' }, C5: { value: 'Dell XPS 16', border: 'all' }, D5: { value: 'SN-33120', border: 'all' }, E5: { value: '9800', format: 'currency-sar', border: 'all' },
        },
      },
    },
  },

  // 22. Inventory List with Highlight
  {
    id: 'inventory_list_with_highlight',
    title: 'قائمة جرد المخزون مع تنبيه النقص',
    titleEn: 'Inventory list with highlight',
    category: 'lists',
    accentColor: '#65a30d',
    iconType: 'inventory',
    description: 'تنبيه لوني تلقائي عند انخفاض كمية المخزون تحت حد إعادة الطلب الأدنى.',
    sheets: {
      sheet1: {
        label: 'المخزون السلعي',
        data: {
          A1: { value: 'جرد المخزون السلعي مع حد إعادة الطلب', bold: true, fontSize: 16, color: '#3f6212' },
          A3: { value: 'رمز المنتج (SKU)', bold: true, bg: '#65a30d', color: '#ffffff', border: 'all' },
          B3: { value: 'اسم المنتج', bold: true, bg: '#65a30d', color: '#ffffff', border: 'all' },
          C3: { value: 'المتوفر بالمستودع', bold: true, bg: '#65a30d', color: '#ffffff', border: 'all', align: 'center' },
          D3: { value: 'الحد الأدنى', bold: true, bg: '#65a30d', color: '#ffffff', border: 'all', align: 'center' },
          E3: { value: 'حالة الطلب', bold: true, bg: '#65a30d', color: '#ffffff', border: 'all' },
          A4: { value: 'SKU-001', border: 'all' }, B4: { value: 'كابل ألياف بصرية 10G', border: 'all' }, C4: { value: '14', format: 'number', border: 'all', align: 'center' }, D4: { value: '25', format: 'number', border: 'all', align: 'center' }, E4: { value: 'يلزم إعادة طلب فوراً', bg: '#fee2e2', color: '#991b1b', bold: true, border: 'all' },
          A5: { value: 'SKU-002', border: 'all' }, B5: { value: 'محول سويتش 24 منفذ', border: 'all' }, C5: { value: '42', format: 'number', border: 'all', align: 'center' }, D5: { value: '15', format: 'number', border: 'all', align: 'center' }, E5: { value: 'مخزون كافٍ', bg: '#dcfce7', color: '#166534', bold: true, border: 'all' },
        },
      },
    },
  },

  // 23. Employee Absence Schedule
  {
    id: 'employee_absence_schedule',
    title: 'جدول إجازات وغياب الموظفين السنوي',
    titleEn: 'Employee absence schedule',
    category: 'business',
    accentColor: '#2563eb',
    iconType: 'attendance',
    description: 'تتبع رصيد الإجازات السنوية، المرضية، والاضطرارية لجميع أعضاء الفريق على مدار العام.',
    sheets: {
      sheet1: {
        label: 'سجل الإجازات',
        data: {
          A1: { value: 'جدول إجازات الموظفين (Employee Absence Schedule)', bold: true, fontSize: 16, color: '#1d4ed8' },
          A3: { value: 'اسم الموظف', bold: true, bg: '#2563eb', color: '#ffffff', border: 'all' },
          B3: { value: 'الرصيد الكلي', bold: true, bg: '#2563eb', color: '#ffffff', border: 'all', align: 'center' },
          C3: { value: 'المستهلك', bold: true, bg: '#2563eb', color: '#ffffff', border: 'all', align: 'center' },
          D3: { value: 'الرصيد المتبقي', bold: true, bg: '#2563eb', color: '#ffffff', border: 'all', align: 'center' },
          A4: { value: 'عبد الله السالم', border: 'all' }, B4: { value: '30', format: 'number', border: 'all', align: 'center' }, C4: { value: '8', format: 'number', border: 'all', align: 'center' }, D4: { value: '22', formula: '=B4-C4', bold: true, border: 'all', align: 'center', bg: '#eff6ff' },
          A5: { value: 'منيرة الشمري', border: 'all' }, B5: { value: '30', format: 'number', border: 'all', align: 'center' }, C5: { value: '14', format: 'number', border: 'all', align: 'center' }, D5: { value: '16', formula: '=B5-C5', bold: true, border: 'all', align: 'center', bg: '#eff6ff' },
        },
      },
    },
  },

  // 24. Loan Calculator
  {
    id: 'loan_calculator',
    title: 'حاسبة القروض والتمويل',
    titleEn: 'Loan calculator',
    category: 'budgets',
    accentColor: '#ea580c',
    iconType: 'loan',
    description: 'حساب القسط الشهري، إجمالي الفوائد، وتكلفة التمويل الإجمالية بدقة تامة.',
    sheets: {
      sheet1: {
        label: 'حاسبة التمويل',
        data: {
          A1: { value: 'حاسبة القروض والتمويل البنكي (Loan Calculator)', bold: true, fontSize: 16, color: '#c2410c' },
          A3: { value: 'بيانات التمويل', bold: true, bg: '#ea580c', color: '#ffffff' },
          A4: { value: 'مبلغ التمويل الأصلي', border: 'all' }, B4: { value: '250000', format: 'currency-sar', border: 'all' },
          A5: { value: 'معدل النسبة السنوي (APR)', border: 'all' }, B5: { value: '4.5%', border: 'all' },
          A6: { value: 'مدة التمويل (بالأشهر)', border: 'all' }, B6: { value: '60', format: 'number', border: 'all' },
          A7: { value: 'القسط الشهري التقديري', bold: true, bg: '#ffedd5', border: 'all' }, B7: { value: '4660.78', format: 'currency-sar', bold: true, bg: '#ffedd5', border: 'all' },
          A8: { value: 'إجمالي أرباح التمويل', bold: true, border: 'all' }, B8: { value: '29646.80', format: 'currency-sar', bold: true, border: 'all' },
          A9: { value: 'إجمالي المبلغ المسدد', bold: true, bg: '#fed7aa', border: 'double-bottom' }, B9: { value: '279646.80', format: 'currency-sar', bold: true, bg: '#fed7aa', border: 'double-bottom' },
        },
      },
    },
  },

  // 25. Loan Amortization Schedule
  {
    id: 'loan_amortization_schedule',
    title: 'جدول استهلاك وسداد القرض',
    titleEn: 'Loan amortization schedule',
    category: 'budgets',
    accentColor: '#059669',
    iconType: 'loan',
    description: 'جدول تفصيلي يوضح حصة الأصل وحصة الفائدة والرصيد المتبقي لكل دفعة شهرية.',
    sheets: {
      sheet1: {
        label: 'جدول الاستهلاك',
        data: {
          A1: { value: 'جدول استهلاك التمويل (Loan Amortization)', bold: true, fontSize: 16, color: '#047857' },
          A3: { value: 'رقم القسط', bold: true, bg: '#059669', color: '#ffffff', border: 'all', align: 'center' },
          B3: { value: 'الرصيد الافتتاحي', bold: true, bg: '#059669', color: '#ffffff', border: 'all' },
          C3: { value: 'القسط الشهري', bold: true, bg: '#059669', color: '#ffffff', border: 'all' },
          D3: { value: 'حصة أصل الدين', bold: true, bg: '#059669', color: '#ffffff', border: 'all' },
          E3: { value: 'حصة الفائدة', bold: true, bg: '#059669', color: '#ffffff', border: 'all' },
          F3: { value: 'الرصيد الختامي', bold: true, bg: '#059669', color: '#ffffff', border: 'all' },
          A4: { value: '1', border: 'all', align: 'center' }, B4: { value: '100000', format: 'currency-sar', border: 'all' }, C4: { value: '1887.12', format: 'currency-sar', border: 'all' }, D4: { value: '1470.45', format: 'currency-sar', border: 'all' }, E4: { value: '416.67', format: 'currency-sar', border: 'all' }, F4: { value: '98529.55', format: 'currency-sar', border: 'all' },
          A5: { value: '2', border: 'all', align: 'center' }, B5: { value: '98529.55', format: 'currency-sar', border: 'all' }, C5: { value: '1887.12', format: 'currency-sar', border: 'all' }, D5: { value: '1476.58', format: 'currency-sar', border: 'all' }, E5: { value: '410.54', format: 'currency-sar', border: 'all' }, F5: { value: '97052.97', format: 'currency-sar', border: 'all' },
        },
      },
    },
  },

  // 26. Bill Paying Checklist
  {
    id: 'bill_paying_checklist',
    title: 'قائمة متابعة ودفع الفواتير الدورية',
    titleEn: 'Bill paying checklist',
    category: 'lists',
    accentColor: '#d97706',
    iconType: 'checklist',
    description: 'قائمة شهرية مجمعة لفواتير الكهرباء والمياه والإنترنت وبطاقات الائتمان لتجنب التأخير.',
    sheets: {
      sheet1: {
        label: 'الفواتير المستحقة',
        data: {
          A1: { value: 'قائمة متابعة سداد الفواتير الشهرية', bold: true, fontSize: 16, color: '#b45309' },
          A3: { value: 'نوع الفاتورة', bold: true, bg: '#d97706', color: '#ffffff', border: 'all' },
          B3: { value: 'المزود', bold: true, bg: '#d97706', color: '#ffffff', border: 'all' },
          C3: { value: 'تاريخ الاستحقاق', bold: true, bg: '#d97706', color: '#ffffff', border: 'all' },
          D3: { value: 'المبلغ التقريبي', bold: true, bg: '#d97706', color: '#ffffff', border: 'all' },
          E3: { value: 'حالة الدفع', bold: true, bg: '#d97706', color: '#ffffff', border: 'all' },
          A4: { value: 'فاتورة الكهرباء', border: 'all' }, B4: { value: 'شركة الكهرباء', border: 'all' }, C4: { value: '28 من كل شهر', border: 'all' }, D4: { value: '450', format: 'currency-sar', border: 'all' }, E4: { value: 'تم السداد', bg: '#dcfce7', color: '#166534', bold: true, border: 'all' },
          A5: { value: 'الألياف البصرية', border: 'all' }, B5: { value: 'الاتصالات', border: 'all' }, C5: { value: '01 من كل شهر', border: 'all' }, D5: { value: '287.50', format: 'currency-sar', border: 'all' }, E5: { value: 'معلق للدفع', bg: '#fef3c7', color: '#92400e', bold: true, border: 'all' },
        },
      },
    },
  },

  // 27. Household To-Do List
  {
    id: 'household_todo_list',
    title: 'قائمة مهام المنزل اليومية',
    titleEn: 'Household to-do list',
    category: 'lists',
    accentColor: '#0d9488',
    iconType: 'checklist',
    description: 'تنظيم مهام الصيانة المنزلية والترتيب مع أولويات الإنجاز (عالية / متوسطة / منخفضة).',
    sheets: {
      sheet1: {
        label: 'مهام المنزل',
        data: {
          A1: { value: 'قائمة مهام المنزل (Household To-Do List)', bold: true, fontSize: 16, color: '#0f766e' },
          A3: { value: 'الحالة', bold: true, bg: '#0d9488', color: '#ffffff', border: 'all', align: 'center' },
          B3: { value: 'وصف المهمة', bold: true, bg: '#0d9488', color: '#ffffff', border: 'all' },
          C3: { value: 'المكان', bold: true, bg: '#0d9488', color: '#ffffff', border: 'all' },
          D3: { value: 'الأولوية', bold: true, bg: '#0d9488', color: '#ffffff', border: 'all', align: 'center' },
          A4: { value: '✓', align: 'center', bg: '#dcfce7', color: '#166534', bold: true, border: 'all' }, B4: { value: 'صيانة فلاتر التكييف المركزي', border: 'all' }, C4: { value: 'المنزل بالكامل', border: 'all' }, D4: { value: 'عالية', bg: '#fee2e2', color: '#991b1b', bold: true, border: 'all', align: 'center' },
          A5: { value: '⏳', align: 'center', border: 'all' }, B5: { value: 'استبدال مصابيح الحديقة الموفرة', border: 'all' }, C5: { value: 'الحديقة الخارجية', border: 'all' }, D5: { value: 'متوسطة', bg: '#fef3c7', color: '#92400e', bold: true, border: 'all', align: 'center' },
        },
      },
    },
  },

  // 28. Gantt Project Planner
  {
    id: 'gantt_project_planner',
    title: 'مخطط جانت لإدارة المشاريع',
    titleEn: 'Gantt project planner',
    category: 'planners',
    accentColor: '#7c3aed',
    iconType: 'gantt',
    description: 'جدول زمني أفقي يوضح مراحل المشروع وفترات البدء والانتهاء ونسب الإنجاز.',
    sheets: {
      sheet1: {
        label: 'مخطط جانت',
        data: {
          A1: { value: 'مخطط جانت الزمني للمشروع (Gantt Project Planner)', bold: true, fontSize: 16, color: '#6d28d9' },
          A3: { value: 'المرحلة / المهمة', bold: true, bg: '#7c3aed', color: '#ffffff', border: 'all' },
          B3: { value: 'تاريخ البدء', bold: true, bg: '#7c3aed', color: '#ffffff', border: 'all' },
          C3: { value: 'المدة (أيام)', bold: true, bg: '#7c3aed', color: '#ffffff', border: 'all', align: 'center' },
          D3: { value: 'نسبة الإنجاز', bold: true, bg: '#7c3aed', color: '#ffffff', border: 'all', align: 'center' },
          E3: { value: 'الأسبوع 1', bold: true, bg: '#ede9fe', border: 'all', align: 'center' },
          F3: { value: 'الأسبوع 2', bold: true, bg: '#ede9fe', border: 'all', align: 'center' },
          G3: { value: 'الأسبوع 3', bold: true, bg: '#ede9fe', border: 'all', align: 'center' },
          H3: { value: 'الأسبوع 4', bold: true, bg: '#ede9fe', border: 'all', align: 'center' },
          A4: { value: '1. تحليل المتطلبات والتوثيق', border: 'all' }, B4: { value: '2026/11/01', border: 'all' }, C4: { value: '7', format: 'number', border: 'all', align: 'center' }, D4: { value: '100%', border: 'all', align: 'center', bg: '#dcfce7', bold: true }, E4: { value: '██████', color: '#7c3aed', align: 'center', border: 'all' }, F4: { value: '', border: 'all' }, G4: { value: '', border: 'all' }, H4: { value: '', border: 'all' },
          A5: { value: '2. تصميم الهيكلية وواجهة المستخدم', border: 'all' }, B5: { value: '2026/11/08', border: 'all' }, C5: { value: '14', format: 'number', border: 'all', align: 'center' }, D5: { value: '65%', border: 'all', align: 'center', bg: '#fef3c7', bold: true }, E5: { value: '', border: 'all' }, F5: { value: '██████', color: '#7c3aed', align: 'center', border: 'all' }, G5: { value: '██████', color: '#7c3aed', align: 'center', border: 'all' }, H5: { value: '', border: 'all' },
        },
      },
    },
  },

  // 29. Agile Gantt Chart
  {
    id: 'agile_gantt_chart',
    title: 'مخطط جانت المرن لمنهجية Agile و Scrum',
    titleEn: 'Agile Gantt chart',
    category: 'planners',
    accentColor: '#2563eb',
    iconType: 'gantt',
    description: 'تتبع السبرنتات (Sprints) وقصص المستخدمين ومراحل الإصدار البرمجي السريع.',
    sheets: {
      sheet1: {
        label: 'خريطة السبرنت',
        data: {
          A1: { value: 'مخطط جانت لمنهجية Agile (Sprints & Releases)', bold: true, fontSize: 16, color: '#1d4ed8' },
          A3: { value: 'السبرنت / الميزة', bold: true, bg: '#2563eb', color: '#ffffff', border: 'all' },
          B3: { value: 'نقاط القصة (Story Points)', bold: true, bg: '#2563eb', color: '#ffffff', border: 'all', align: 'center' },
          C3: { value: 'المسؤول', bold: true, bg: '#2563eb', color: '#ffffff', border: 'all' },
          D3: { value: 'الحالة', bold: true, bg: '#2563eb', color: '#ffffff', border: 'all' },
          A4: { value: 'Sprint 1: نظام الصلاحيات والأمان', border: 'all' }, B4: { value: '13', format: 'number', border: 'all', align: 'center' }, C4: { value: 'فريق النواة', border: 'all' }, D4: { value: 'مكتمل', bg: '#dcfce7', color: '#166534', bold: true, border: 'all' },
          A5: { value: 'Sprint 2: واجهة استيراد ملفات الإكسيل', border: 'all' }, B5: { value: '21', format: 'number', border: 'all', align: 'center' }, C5: { value: 'فريق الواجهات', border: 'all' }, D5: { value: 'قيد التنفيذ', bg: '#dbeafe', color: '#1e40af', bold: true, border: 'all' },
        },
      },
    },
  },

  // 30. Get More Out of PivotTables
  {
    id: 'pivot_advanced_guide',
    title: 'تحقيق أقصى استفادة من الجداول المحورية',
    titleEn: 'Get more out of PivotTables',
    category: 'tutorials',
    badge: 'Pivot+',
    accentColor: '#107c41',
    iconType: 'pivottable',
    description: 'الحقول المحسوبة، التجميع بالتواريخ، ومقاسم البيانات (Slicers) لتحليل الأعمال المتقدم.',
    sheets: {
      sheet1: {
        label: 'تحليل محوري احترافي',
        data: {
          A1: { value: 'احتراف الجداول المحورية ومقاسم البيانات (Pivot Slicers)', bold: true, fontSize: 16, color: '#107c41' },
          A3: { value: 'السنة', bold: true, bg: '#107c41', color: '#ffffff', border: 'all', align: 'center' },
          B3: { value: 'الربع', bold: true, bg: '#107c41', color: '#ffffff', border: 'all', align: 'center' },
          C3: { value: 'الفرع', bold: true, bg: '#107c41', color: '#ffffff', border: 'all' },
          D3: { value: 'المبيعات الفعلية', bold: true, bg: '#107c41', color: '#ffffff', border: 'all' },
          E3: { value: 'المستهدف البيعي', bold: true, bg: '#107c41', color: '#ffffff', border: 'all' },
          F3: { value: 'نسبة التحقيق', bold: true, bg: '#107c41', color: '#ffffff', border: 'all', align: 'center' },
          A4: { value: '2026', border: 'all', align: 'center' }, B4: { value: 'Q1', border: 'all', align: 'center' }, C4: { value: 'فرع الرياض الرئيسي', border: 'all' }, D4: { value: '450000', format: 'currency-sar', border: 'all' }, E4: { value: '400000', format: 'currency-sar', border: 'all' }, F4: { value: '112.5%', bold: true, bg: '#dcfce7', color: '#166534', border: 'all', align: 'center' },
          A5: { value: '2026', border: 'all', align: 'center' }, B5: { value: 'Q1', border: 'all', align: 'center' }, C5: { value: 'فرع جدة كورنيش', border: 'all' }, D5: { value: '380000', format: 'currency-sar', border: 'all' }, E5: { value: '350000', format: 'currency-sar', border: 'all' }, F5: { value: '108.6%', bold: true, bg: '#dcfce7', color: '#166534', border: 'all', align: 'center' },
        },
      },
    },
  },
];
