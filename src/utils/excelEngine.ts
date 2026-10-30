import { SheetData } from '../types';

export interface ExcelFunctionDef {
  name: string;
  syntax: string;
  desc: string;
  example: string;
  category: 'Math' | 'Logical' | 'Statistical' | 'Lookup' | 'Text' | 'Financial' | 'DateTime' | 'Engineering' | 'Info';
}

export const EXCEL_FUNCTIONS: ExcelFunctionDef[] = [
  // Math & Trig
  { name: 'SUM', syntax: 'SUM(number1, [number2], ...)', desc: 'جمع كافة الأرقام في نطاق محدد من الخلايا', example: '=SUM(B4:B8)', category: 'Math' },
  { name: 'SUBTOTAL', syntax: 'SUBTOTAL(function_num, ref1, [ref2], ...)', desc: 'إرجاع حاصل إجمالي فرعي في قائمة أو قاعدة بيانات واستبعاد الإجماليات الفرعية الأخرى وتجاهل الصفوف المخفية (1-11، 101-111)', example: '=SUBTOTAL(9, C4:C20)', category: 'Math' },
  { name: 'SUMIF', syntax: 'SUMIF(range, criteria, [sum_range])', desc: 'جمع الخلايا التي تستوفي شرطاً محدداً', example: '=SUMIF(C4:C8, ">1000")', category: 'Math' },
  { name: 'SUMIFS', syntax: 'SUMIFS(sum_range, criteria_range1, criteria1, ...)', desc: 'جمع الخلايا المستوفية لشروط متعددة', example: '=SUMIFS(D4:D20, A4:A20, "مكتمل", B4:B20, ">500")', category: 'Math' },
  { name: 'PRODUCT', syntax: 'PRODUCT(number1, [number2], ...)', desc: 'ضرب كافة الأرقام المحددة ببعضها', example: '=PRODUCT(B4, C4, 1.15)', category: 'Math' },
  { name: 'ROUND', syntax: 'ROUND(number, num_digits)', desc: 'تقريب رقم إلى عدد محدد من الخانات العشرية', example: '=ROUND(B4*1.15, 2)', category: 'Math' },
  { name: 'ROUNDUP', syntax: 'ROUNDUP(number, num_digits)', desc: 'تقريب رقم لأعلى مبتعداً عن الصفر', example: '=ROUNDUP(B4, 0)', category: 'Math' },
  { name: 'ROUNDDOWN', syntax: 'ROUNDDOWN(number, num_digits)', desc: 'تقريب رقم لأسفل باتجاه الصفر', example: '=ROUNDDOWN(B4, 2)', category: 'Math' },
  { name: 'INT', syntax: 'INT(number)', desc: 'تقريب الرقم لأسفل إلى أقرب عدد صحيح', example: '=INT(B4)', category: 'Math' },
  { name: 'MOD', syntax: 'MOD(number, divisor)', desc: 'إرجاع باقي قسمة رقم على مقسوم عليه', example: '=MOD(B4, 2)', category: 'Math' },
  { name: 'ABS', syntax: 'ABS(number)', desc: 'إرجاع القيمة المطلقة للرقم دون إشارة', example: '=ABS(-150)', category: 'Math' },
  { name: 'SQRT', syntax: 'SQRT(number)', desc: 'إرجاع الجذر التربيعي الموجب لرقم', example: '=SQRT(144)', category: 'Math' },
  { name: 'POWER', syntax: 'POWER(number, power)', desc: 'حساب قيمة رقم مرفوع إلى أس محدد', example: '=POWER(2, 8)', category: 'Math' },
  { name: 'CEILING', syntax: 'CEILING(number, significance)', desc: 'تقريب رقم لأعلى لأقرب مضاعف للأهمية', example: '=CEILING(B4, 5)', category: 'Math' },
  { name: 'FLOOR', syntax: 'FLOOR(number, significance)', desc: 'تقريب رقم لأسفل لأقرب مضاعف للأهمية', example: '=FLOOR(B4, 5)', category: 'Math' },
  { name: 'PI', syntax: 'PI()', desc: 'إرجاع قيمة الثابت الرياضي باي (3.14159...)', example: '=PI()', category: 'Math' },
  { name: 'RAND', syntax: 'RAND()', desc: 'توليد رقم عشوائي بين 0 و 1', example: '=RAND()', category: 'Math' },
  { name: 'RANDBETWEEN', syntax: 'RANDBETWEEN(bottom, top)', desc: 'توليد رقم صحيح عشوائي بين حدين', example: '=RANDBETWEEN(10, 100)', category: 'Math' },

  // Statistical
  { name: 'AVERAGE', syntax: 'AVERAGE(number1, [number2], ...)', desc: 'حساب المتوسط الحسابي لمجموعة قيم أو خلايا', example: '=AVERAGE(C4:C8)', category: 'Statistical' },
  { name: 'AVERAGEIF', syntax: 'AVERAGEIF(range, criteria, [average_range])', desc: 'حساب متوسط الخلايا التي تحقق شرطاً محدداً', example: '=AVERAGEIF(C4:C20, ">100")', category: 'Statistical' },
  { name: 'AVERAGEIFS', syntax: 'AVERAGEIFS(average_range, criteria_range1, criteria1, ...)', desc: 'حساب متوسط الخلايا المستوفية لشروط متعددة', example: '=AVERAGEIFS(D4:D20, A4:A20, "الرياض")', category: 'Statistical' },
  { name: 'COUNT', syntax: 'COUNT(value1, [value2], ...)', desc: 'عد الخلايا التي تحتوي على أرقام فقط', example: '=COUNT(B4:B20)', category: 'Statistical' },
  { name: 'COUNTA', syntax: 'COUNTA(value1, [value2], ...)', desc: 'عد الخلايا غير الفارغة (أرقام ونصوص)', example: '=COUNTA(A4:A20)', category: 'Statistical' },
  { name: 'COUNTBLANK', syntax: 'COUNTBLANK(range)', desc: 'عد الخلايا الفارغة تماماً في نطاق محدد', example: '=COUNTBLANK(B4:B20)', category: 'Statistical' },
  { name: 'COUNTIF', syntax: 'COUNTIF(range, criteria)', desc: 'عد الخلايا التي تتطابق مع شرط محدد', example: '=COUNTIF(D4:D20, "مسدد")', category: 'Statistical' },
  { name: 'COUNTIFS', syntax: 'COUNTIFS(criteria_range1, criteria1, ...)', desc: 'عد الخلايا التي تتطابق مع عدة شروط مجتمعة', example: '=COUNTIFS(A4:A20, "ناجح", B4:B20, ">=80")', category: 'Statistical' },
  { name: 'MAX', syntax: 'MAX(number1, [number2], ...)', desc: 'إرجاع القيمة الأكبر في نطاق الخلايا', example: '=MAX(C4:C8)', category: 'Statistical' },
  { name: 'MIN', syntax: 'MIN(number1, [number2], ...)', desc: 'إرجاع القيمة الأصغر في نطاق الخلايا', example: '=MIN(C4:C8)', category: 'Statistical' },
  { name: 'LARGE', syntax: 'LARGE(array, k)', desc: 'إرجاع القيمة الكبرى رقم k في مجموعة بيانات', example: '=LARGE(B4:B20, 2)', category: 'Statistical' },
  { name: 'SMALL', syntax: 'SMALL(array, k)', desc: 'إرجاع القيمة الصغرى رقم k في مجموعة بيانات', example: '=SMALL(B4:B20, 1)', category: 'Statistical' },
  { name: 'MEDIAN', syntax: 'MEDIAN(number1, [number2], ...)', desc: 'إرجاع الوسيط الحسابي للأرقام المعطاة', example: '=MEDIAN(B4:B20)', category: 'Statistical' },
  { name: 'STDEV', syntax: 'STDEV(number1, [number2], ...)', desc: 'تقدير الانحراف المعياري بناءً على عينة', example: '=STDEV(B4:B20)', category: 'Statistical' },

  // Logical
  { name: 'IF', syntax: 'IF(logical_test, [value_if_true], [value_if_false])', desc: 'فحص تحقق شرط منطقي وإرجاع قيمة حسب النتيجة', example: '=IF(C4>1000, "فائض", "ضمن الحد")', category: 'Logical' },
  { name: 'IFS', syntax: 'IFS(logical_test1, value1, [logical_test2, value2], ...)', desc: 'فحص شروط منطقية متعددة بالتتابع', example: '=IFS(B4>=90, "ممتاز", B4>=80, "جيد جدا")', category: 'Logical' },
  { name: 'IFERROR', syntax: 'IFERROR(value, value_if_error)', desc: 'إرجاع قيمة مخصصة في حال وجود خطأ بالصيغة', example: '=IFERROR(B4/C4, 0)', category: 'Logical' },
  { name: 'IFNA', syntax: 'IFNA(value, value_if_na)', desc: 'إرجاع قيمة محددة إذا أرجعت الصيغة خطأ #N/A', example: '=IFNA(VLOOKUP(A4, B4:D10, 2, FALSE), "غير متوفر")', category: 'Logical' },
  { name: 'AND', syntax: 'AND(logical1, [logical2], ...)', desc: 'فحص تحقق جميع الشروط المنطقية معاً', example: '=AND(B4>1000, C4>1000)', category: 'Logical' },
  { name: 'OR', syntax: 'OR(logical1, [logical2], ...)', desc: 'فحص تحقق أي شرط من الشروط المنطقية', example: '=OR(B4>1000, C4>1000)', category: 'Logical' },
  { name: 'NOT', syntax: 'NOT(logical)', desc: 'عكس القيمة المنطقية (True تصبح False)', example: '=NOT(B4>1000)', category: 'Logical' },
  { name: 'SWITCH', syntax: 'SWITCH(expression, val1, result1, [default])', desc: 'مطابقة تعبير مع قائمة قيم وإرجاع النتيجة المطابقة', example: '=SWITCH(A4, 1, "الأحد", 2, "الاثنين", "غير معروف")', category: 'Logical' },
  { name: 'TRUE', syntax: 'TRUE()', desc: 'إرجاع القيمة المنطقية صحيح (TRUE)', example: '=TRUE()', category: 'Logical' },
  { name: 'FALSE', syntax: 'FALSE()', desc: 'إرجاع القيمة المنطقية خطأ (FALSE)', example: '=FALSE()', category: 'Logical' },

  // Financial
  { name: 'PMT', syntax: 'PMT(rate, nper, pv, [fv], [type])', desc: 'حساب دفعة القرض الشهرية أو الدورية الثابتة', example: '=PMT(0.05/12, 60, -250000)', category: 'Financial' },
  { name: 'FV', syntax: 'FV(rate, nper, pmt, [pv], [type])', desc: 'حساب القيمة المستقبلية لاستثمار أو توفير', example: '=FV(0.06/12, 120, -1000)', category: 'Financial' },
  { name: 'PV', syntax: 'PV(rate, nper, pmt, [fv], [type])', desc: 'حساب القيمة الحالية لمجموعة تدفقات نقدية', example: '=PV(0.08/12, 36, -500)', category: 'Financial' },
  { name: 'RATE', syntax: 'RATE(nper, pmt, pv, [fv])', desc: 'حساب معدل الفائدة لكل فترة للقرض أو الاستثمار', example: '=RATE(48, -250, 10000)*12', category: 'Financial' },
  { name: 'NPER', syntax: 'NPER(rate, pmt, pv, [fv])', desc: 'حساب عدد فترات السداد لقرض أو استثمار', example: '=NPER(0.06/12, -500, 15000)', category: 'Financial' },

  // Text
  { name: 'CONCAT', syntax: 'CONCAT(text1, [text2], ...)', desc: 'دمج النصوص والسلاسل النصية معاً', example: '=CONCAT(A4, " - ", B4)', category: 'Text' },
  { name: 'CONCATENATE', syntax: 'CONCATENATE(text1, [text2], ...)', desc: 'دمج سلسلتين أو أكثر من النصوص في سلسلة واحدة', example: '=CONCATENATE(A4, " ", B4)', category: 'Text' },
  { name: 'TEXTJOIN', syntax: 'TEXTJOIN(delimiter, ignore_empty, text1, ...)', desc: 'دمج عدة نصوص أو نطاقات باستخدام فاصل مخصص', example: '=TEXTJOIN(", ", TRUE, A4:A8)', category: 'Text' },
  { name: 'TEXT', syntax: 'TEXT(value, format_text)', desc: 'تنسيق رقم وتحويله إلى نص وفق صيغة محددة', example: '=TEXT(B4, "#,##0.00")', category: 'Text' },
  { name: 'PROPER', syntax: 'PROPER(text)', desc: 'جعل أول حرف من كل كلمة كبيراً (Capitalize)', example: '=PROPER(A4)', category: 'Text' },
  { name: 'UPPER', syntax: 'UPPER(text)', desc: 'تحويل النص الإنجليزي إلى أحرف كبيرة', example: '=UPPER(A4)', category: 'Text' },
  { name: 'LOWER', syntax: 'LOWER(text)', desc: 'تحويل النص الإنجليزي إلى أحرف صغيرة', example: '=LOWER(A4)', category: 'Text' },
  { name: 'TRIM', syntax: 'TRIM(text)', desc: 'إزالة كافة المسافات الزائدة من النص ما عدا المسافات الفردية', example: '=TRIM(A4)', category: 'Text' },
  { name: 'LEN', syntax: 'LEN(text)', desc: 'إرجاع عدد الأحرف في سلسلة نصية', example: '=LEN(A4)', category: 'Text' },
  { name: 'LEFT', syntax: 'LEFT(text, [num_chars])', desc: 'إرجاع عدد محدد من الأحرف من بداية النص', example: '=LEFT(A4, 4)', category: 'Text' },
  { name: 'RIGHT', syntax: 'RIGHT(text, [num_chars])', desc: 'إرجاع عدد محدد من الأحرف من نهاية النص', example: '=RIGHT(A4, 3)', category: 'Text' },
  { name: 'MID', syntax: 'MID(text, start_num, num_chars)', desc: 'إرجاع جزء محدد من النص بدءاً من موضع معين', example: '=MID(A4, 2, 5)', category: 'Text' },
  { name: 'SUBSTITUTE', syntax: 'SUBSTITUTE(text, old_text, new_text)', desc: 'استبدال نص قديم بنص جديد داخل سلسلة نصية', example: '=SUBSTITUTE(A4, "-", "/")', category: 'Text' },
  { name: 'REPT', syntax: 'REPT(text, number_times)', desc: 'تكرار النص لعدد محدد من المرات', example: '=REPT("*", 5)', category: 'Text' },
  { name: 'EXACT', syntax: 'EXACT(text1, text2)', desc: 'مقارنة نصين وإرجاع TRUE إذا كانا متطابقين تماماً', example: '=EXACT(A4, B4)', category: 'Text' },
  { name: 'VALUE', syntax: 'VALUE(text)', desc: 'تحويل نص يمثل رقماً إلى قيمة رقمية حقيقية', example: '=VALUE(A4)', category: 'Text' },

  // Date & Time
  { name: 'TODAY', syntax: 'TODAY()', desc: 'إرجاع التاريخ الحالي للنظام', example: '=TODAY()', category: 'DateTime' },
  { name: 'NOW', syntax: 'NOW()', desc: 'إرجاع التاريخ والوقت الحالي للنظام', example: '=NOW()', category: 'DateTime' },
  { name: 'YEAR', syntax: 'YEAR(serial_number)', desc: 'إرجاع سنة تاريخ محدد كرقم بأربعة أرقام', example: '=YEAR(TODAY())', category: 'DateTime' },
  { name: 'MONTH', syntax: 'MONTH(serial_number)', desc: 'إرجاع رقم شهر التاريخ (1 إلى 12)', example: '=MONTH(TODAY())', category: 'DateTime' },
  { name: 'DAY', syntax: 'DAY(serial_number)', desc: 'إرجاع يوم التاريخ (1 إلى 31)', example: '=DAY(TODAY())', category: 'DateTime' },
  { name: 'DATE', syntax: 'DATE(year, month, day)', desc: 'إنشاء قيمة تاريخ معتمد من الأرقام المعطاة', example: '=DATE(2026, 10, 27)', category: 'DateTime' },
  { name: 'TIME', syntax: 'TIME(hour, minute, second)', desc: 'إنشاء وقت معتمد بتنسيق قياسي', example: '=TIME(14, 30, 0)', category: 'DateTime' },
  { name: 'HOUR', syntax: 'HOUR(serial_number)', desc: 'إرجاع الساعة من وقت محدد (0 إلى 23)', example: '=HOUR(NOW())', category: 'DateTime' },
  { name: 'MINUTE', syntax: 'MINUTE(serial_number)', desc: 'إرجاع الدقيقة من وقت محدد (0 إلى 59)', example: '=MINUTE(NOW())', category: 'DateTime' },
  { name: 'SECOND', syntax: 'SECOND(serial_number)', desc: 'إرجاع الثانية من وقت محدد (0 إلى 59)', example: '=SECOND(NOW())', category: 'DateTime' },
  { name: 'EDATE', syntax: 'EDATE(start_date, months)', desc: 'إرجاع التاريخ بعد أو قبل عدد محدد من الأشهر', example: '=EDATE(TODAY(), 6)', category: 'DateTime' },
  { name: 'EOMONTH', syntax: 'EOMONTH(start_date, months)', desc: 'إرجاع تاريخ آخر يوم في الشهر بعد أشهر محددة', example: '=EOMONTH(TODAY(), 0)', category: 'DateTime' },
  { name: 'DATEDIF', syntax: 'DATEDIF(start_date, end_date, unit)', desc: 'حساب الفرق بين تاريخين بالأيام ("D") أو الأشهر ("M") أو السنين ("Y")', example: '=DATEDIF(A4, B4, "D")', category: 'DateTime' },
  { name: 'WEEKDAY', syntax: 'WEEKDAY(serial_number, [return_type])', desc: 'إرجاع يوم الأسبوع كرقم (1 للأحد أو حسب النوع)', example: '=WEEKDAY(TODAY())', category: 'DateTime' },
  { name: 'DAYS', syntax: 'DAYS(end_date, start_date)', desc: 'إرجاع عدد الأيام بين تاريخين', example: '=DAYS(B4, A4)', category: 'DateTime' },

  // Lookup & Reference
  { name: 'VLOOKUP', syntax: 'VLOOKUP(lookup_value, table_array, col_index, [range_lookup])', desc: 'البحث عن قيمة في العمود الأول واسترجاع قيمة عمود محدد', example: '=VLOOKUP(A4, A4:D20, 2, FALSE)', category: 'Lookup' },
  { name: 'HLOOKUP', syntax: 'HLOOKUP(lookup_value, table_array, row_index, [range_lookup])', desc: 'البحث الأفقي في الصف الأول واسترجاع قيمة من صف محدد', example: '=HLOOKUP(A4, A1:H5, 2, FALSE)', category: 'Lookup' },
  { name: 'INDEX', syntax: 'INDEX(array, row_num, [col_num])', desc: 'إرجاع قيمة الخلية الواقعة عند تقاطع صف وعمود', example: '=INDEX(A4:C20, 2, 3)', category: 'Lookup' },
  { name: 'MATCH', syntax: 'MATCH(lookup_value, lookup_array, [match_type])', desc: 'إرجاع الموضع النسبي لعنصر في نطاق خلايا', example: '=MATCH("سارة", A4:A20, 0)', category: 'Lookup' },
  { name: 'XLOOKUP', syntax: 'XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found])', desc: 'البحث المتقدم ثنائي الاتجاه واسترجاع القيم المقابلة', example: '=XLOOKUP(A4, A4:A20, B4:B20)', category: 'Lookup' },
  { name: 'CHOOSE', syntax: 'CHOOSE(index_num, value1, [value2], ...)', desc: 'اختيار وإرجاع قيمة من قائمة بناءً على رقم المؤشر', example: '=CHOOSE(2, "الأول", "الثاني", "الثالث")', category: 'Lookup' },
  { name: 'ROW', syntax: 'ROW([reference])', desc: 'إرجاع رقم الصف لمرجع محدد أو للخلية الحالية', example: '=ROW(B4)', category: 'Lookup' },
  { name: 'COLUMN', syntax: 'COLUMN([reference])', desc: 'إرجاع رقم العمود لمرجع محدد أو للخلية الحالية', example: '=COLUMN(B4)', category: 'Lookup' },

  // Information
  { name: 'ISNUMBER', syntax: 'ISNUMBER(value)', desc: 'فحص ما إذا كانت القيمة رقماً (True / False)', example: '=ISNUMBER(B4)', category: 'Info' },
  { name: 'ISTEXT', syntax: 'ISTEXT(value)', desc: 'فحص ما إذا كانت القيمة نصاً (True / False)', example: '=ISTEXT(A4)', category: 'Info' },
  { name: 'ISBLANK', syntax: 'ISBLANK(value)', desc: 'فحص ما إذا كانت الخلية فارغة تماماً', example: '=ISBLANK(A4)', category: 'Info' },
  { name: 'ISERROR', syntax: 'ISERROR(value)', desc: 'فحص ما إذا كانت القيمة ناتجة عن خطأ بأي صيغة', example: '=ISERROR(B4/C4)', category: 'Info' },
  { name: 'ISNA', syntax: 'ISNA(value)', desc: 'فحص ما إذا كانت القيمة خطأ #N/A تحديداً', example: '=ISNA(VLOOKUP(A4, B4:C10, 2, FALSE))', category: 'Info' },
  { name: 'ISEVEN', syntax: 'ISEVEN(number)', desc: 'فحص ما إذا كان الرقم زوجياً (TRUE/FALSE)', example: '=ISEVEN(B4)', category: 'Info' },
  { name: 'ISODD', syntax: 'ISODD(number)', desc: 'فحص ما إذا كان الرقم فردياً (TRUE/FALSE)', example: '=ISODD(B4)', category: 'Info' },
];

/**
 * Microsoft Excel Advanced Formula Engine
 * Evaluates Excel expressions with support for SUM, SUMIF, AVERAGE, COUNT, COUNTA, MIN, MAX,
 * IF, AND, OR, NOT, CONCAT, ROUND, VLOOKUP, and full math operator precedence.
 */

export function parseRange(rangeStr: string): string[] {
  const parts = rangeStr.split(':');
  if (parts.length < 2) return [parts[0] || ''];

  const colToNum = (col: string) => {
    let num = 0;
    for (let i = 0; i < col.length; i++) {
      num = num * 26 + (col.charCodeAt(i) - 64);
    }
    return num;
  };

  const numToCol = (num: number) => {
    let str = '';
    while (num > 0) {
      const rem = (num - 1) % 26;
      str = String.fromCharCode(65 + rem) + str;
      num = Math.floor((num - 1) / 26);
    }
    return str;
  };

  const allCells: string[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < parts.length - 1; i++) {
    const start = parts[i].trim();
    const end = parts[i + 1].trim();

    const colStartMatch = start.match(/([A-Z]+)(\d+)/i);
    const colEndMatch = end.match(/([A-Z]+)(\d+)/i);
    if (!colStartMatch || !colEndMatch) {
      if (!seen.has(start)) { seen.add(start); allCells.push(start); }
      if (!seen.has(end)) { seen.add(end); allCells.push(end); }
      continue;
    }

    const col1 = colStartMatch[1].toUpperCase();
    const row1 = parseInt(colStartMatch[2], 10);
    const col2 = colEndMatch[1].toUpperCase();
    const row2 = parseInt(colEndMatch[2], 10);

    const c1 = colToNum(col1);
    const c2 = colToNum(col2);
    const minC = Math.min(c1, c2);
    const maxC = Math.max(c1, c2);
    const minR = Math.min(row1, row2);
    const maxR = Math.max(row1, row2);

    for (let r = minR; r <= maxR; r++) {
      for (let c = minC; c <= maxC; c++) {
        const cid = `${numToCol(c)}${r}`;
        if (!seen.has(cid)) {
          seen.add(cid);
          allCells.push(cid);
        }
      }
    }
  }

  return allCells;
}

export function evaluateExcelFormula(
  expr: string, 
  sheetData: SheetData, 
  allSheets?: Record<string, { label: string; data: SheetData }>,
  hiddenRows?: Set<number>
): string {
  if (!expr.startsWith('=')) return expr;

  let raw = expr.substring(1).trim();

  // Auto-close missing parentheses if any (e.g. =SUM(G8+G7 or =(A1+B1)
  const openCount = (raw.match(/\(/g) || []).length;
  const closeCount = (raw.match(/\)/g) || []).length;
  if (openCount > closeCount) {
    raw += ')'.repeat(openCount - closeCount);
  }

  const upper = raw.toUpperCase();

  try {
    // 1. IF(condition, true_val, false_val)
    const ifMatch = raw.match(/^IF\s*\((.+)\)$/i);
    if (ifMatch) {
      const args = splitFormulaArgs(ifMatch[1]);
      if (args.length >= 2) {
        const cond = evaluateCondition(args[0], sheetData, allSheets);
        if (cond) {
          return resolveArgValue(args[1], sheetData, allSheets);
        } else {
          return args[2] ? resolveArgValue(args[2], sheetData, allSheets) : '';
        }
      }
    }

    // 2. VLOOKUP(lookup_value, table_range, col_index, [range_lookup])
    const vlookupMatch = raw.match(/^VLOOKUP\s*\((.+)\)$/i);
    if (vlookupMatch) {
      const args = splitFormulaArgs(vlookupMatch[1]);
      if (args.length >= 3) {
        const lookupVal = resolveArgValue(args[0], sheetData, allSheets).toLowerCase();
        const targetData = resolveTargetSheetData(args[1], sheetData, allSheets);
        const cleanRange = stripSheetPrefix(args[1].toUpperCase());
        const rangeCells = parseRange(cleanRange);
        const colIndex = parseInt(args[2], 10);

        // Group range cells by rows
        const rowMap: Record<number, string[]> = {};
        rangeCells.forEach((c) => {
          const m = c.match(/([A-Z]+)(\d+)/);
          if (m) {
            const r = parseInt(m[2], 10);
            if (!rowMap[r]) rowMap[r] = [];
            rowMap[r].push(c);
          }
        });

        for (const rowNum of Object.keys(rowMap)) {
          const rowCells = rowMap[Number(rowNum)];
          const firstCell = rowCells[0];
          const valInFirst = String(targetData[firstCell]?.value || '').toLowerCase();
          if (valInFirst === lookupVal || valInFirst.includes(lookupVal)) {
            const targetCell = rowCells[colIndex - 1];
            if (targetCell) {
              return String(targetData[targetCell]?.value || '');
            }
          }
        }
        return '#N/A';
      }
    }

    // 2b. SUBTOTAL(function_num, ref1, [ref2], ...)
    const subtotalMatch = raw.match(/^SUBTOTAL\s*\((.+)\)$/i);
    if (subtotalMatch) {
      const args = splitFormulaArgs(subtotalMatch[1]);
      if (args.length >= 2) {
        const fnCode = parseInt(resolveArgValue(args[0], sheetData, allSheets).trim(), 10);
        const ignoreHidden = fnCode >= 101;
        const opCode = fnCode >= 101 ? fnCode - 100 : fnCode;

        const values: number[] = [];
        let nonEmptyCount = 0;

        for (let i = 1; i < args.length; i++) {
          const refArg = args[i].trim();
          const targetData = resolveTargetSheetData(refArg, sheetData, allSheets);
          const cleanRef = stripSheetPrefix(refArg.toUpperCase());
          const cells = parseRange(cleanRef);

          for (const cellId of cells) {
            const cell = targetData[cellId];
            if (!cell) continue;

            // Excel Rule 1: Exclude nested SUBTOTAL formulas to avoid double counting
            if (cell.formula && /SUBTOTAL/i.test(cell.formula)) {
              continue;
            }

            // Excel Rule 2: If code 101-111, ignore hidden rows
            if (ignoreHidden && hiddenRows) {
              const rowMatch = cellId.match(/\d+$/);
              if (rowMatch && hiddenRows.has(parseInt(rowMatch[0], 10))) {
                continue;
              }
            }

            const rawVal = cell.value !== undefined ? String(cell.value).trim() : '';
            if (rawVal !== '') {
              nonEmptyCount++;
            }

            const num = parseFloat(rawVal.replace(/[^0-9.-]+/g, ''));
            if (!isNaN(num)) {
              values.push(num);
            }
          }
        }

        switch (opCode) {
          case 1: { // AVERAGE
            const avg = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
            return formatResult(avg);
          }
          case 2: { // COUNT (numeric cells)
            return formatResult(values.length);
          }
          case 3: { // COUNTA (non-empty cells)
            return formatResult(nonEmptyCount);
          }
          case 4: { // MAX
            return formatResult(values.length > 0 ? Math.max(...values) : 0);
          }
          case 5: { // MIN
            return formatResult(values.length > 0 ? Math.min(...values) : 0);
          }
          case 6: { // PRODUCT
            const prod = values.length > 0 ? values.reduce((a, b) => a * b, 1) : 0;
            return formatResult(prod);
          }
          case 7: { // STDEV (sample)
            if (values.length <= 1) return formatResult(0);
            const mean = values.reduce((a, b) => a + b, 0) / values.length;
            const variance = values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / (values.length - 1);
            return formatResult(Math.sqrt(variance));
          }
          case 8: { // STDEVP (population)
            if (values.length === 0) return formatResult(0);
            const mean = values.reduce((a, b) => a + b, 0) / values.length;
            const variance = values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / values.length;
            return formatResult(Math.sqrt(variance));
          }
          case 9: { // SUM
            const sum = values.reduce((a, b) => a + b, 0);
            return formatResult(sum);
          }
          case 10: { // VAR (sample)
            if (values.length <= 1) return formatResult(0);
            const mean = values.reduce((a, b) => a + b, 0) / values.length;
            const variance = values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / (values.length - 1);
            return formatResult(variance);
          }
          case 11: { // VARP (population)
            if (values.length === 0) return formatResult(0);
            const mean = values.reduce((a, b) => a + b, 0) / values.length;
            const variance = values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / values.length;
            return formatResult(variance);
          }
          default: {
            const sum = values.reduce((a, b) => a + b, 0);
            return formatResult(sum);
          }
        }
      }
    }

    // 3. SUM(...)
    const sumMatch = raw.match(/^SUM\s*\((.+)\)$/i);
    if (sumMatch) {
      const vals = collectNumericValues(sumMatch[1], sheetData, allSheets);
      const total = vals.reduce((a, b) => a + b, 0);
      return formatResult(total);
    }

    // 3b. SUMIF(range, criteria, [sum_range])
    const sumifMatch = raw.match(/^SUMIF\s*\((.+)\)$/i);
    if (sumifMatch) {
      const args = splitFormulaArgs(sumifMatch[1]);
      if (args.length >= 2) {
        const targetData = resolveTargetSheetData(args[0], sheetData, allSheets);
        const cleanCritRange = stripSheetPrefix(args[0].toUpperCase());
        const critCells = parseRange(cleanCritRange);
        const rawCrit = args[1].replace(/['"]/g, '').trim();
        const sumTargetData = args[2] ? resolveTargetSheetData(args[2], sheetData, allSheets) : targetData;
        const sumCells = args[2] ? parseRange(stripSheetPrefix(args[2].toUpperCase())) : critCells;

        let total = 0;
        critCells.forEach((cId, idx) => {
          const val = parseFloat(targetData[cId]?.value || '0');
          let matches = false;
          if (rawCrit.startsWith('>=')) matches = val >= parseFloat(rawCrit.substring(2));
          else if (rawCrit.startsWith('<=')) matches = val <= parseFloat(rawCrit.substring(2));
          else if (rawCrit.startsWith('>')) matches = val > parseFloat(rawCrit.substring(1));
          else if (rawCrit.startsWith('<')) matches = val < parseFloat(rawCrit.substring(1));
          else if (rawCrit.startsWith('=')) matches = val === parseFloat(rawCrit.substring(1));
          else matches = (sheetData[cId]?.value || '') === rawCrit || val === parseFloat(rawCrit);

          if (matches) {
            const sumCell = sumCells[idx] || cId;
            const toAdd = parseFloat(sheetData[sumCell]?.value || '0');
            if (!isNaN(toAdd)) total += toAdd;
          }
        });
        return formatResult(total);
      }
    }

    // 3c. SUMIFS(sum_range, crit_range1, crit1, ...)
    const sumifsMatch = raw.match(/^SUMIFS\s*\((.+)\)$/i);
    if (sumifsMatch) {
      const args = splitFormulaArgs(sumifsMatch[1]);
      if (args.length >= 3) {
        const sumTargetData = resolveTargetSheetData(args[0], sheetData, allSheets);
        const sumCells = parseRange(stripSheetPrefix(args[0].toUpperCase()));
        let total = 0;

        sumCells.forEach((sc, idx) => {
          let allMatch = true;
          for (let i = 1; i < args.length; i += 2) {
            const critRange = parseRange(stripSheetPrefix(args[i].toUpperCase()));
            const rawCrit = args[i + 1]?.replace(/['"]/g, '').trim() || '';
            const critTargetData = resolveTargetSheetData(args[i], sheetData, allSheets);
            const checkCell = critRange[idx] || critRange[0];
            const checkVal = parseFloat(critTargetData[checkCell]?.value || '0');
            const checkStr = String(critTargetData[checkCell]?.value || '').trim();

            let matched = false;
            if (rawCrit.startsWith('>=')) matched = checkVal >= parseFloat(rawCrit.substring(2));
            else if (rawCrit.startsWith('<=')) matched = checkVal <= parseFloat(rawCrit.substring(2));
            else if (rawCrit.startsWith('>')) matched = checkVal > parseFloat(rawCrit.substring(1));
            else if (rawCrit.startsWith('<')) matched = checkVal < parseFloat(rawCrit.substring(1));
            else if (rawCrit.startsWith('=')) matched = checkVal === parseFloat(rawCrit.substring(1));
            else matched = checkStr.toLowerCase() === rawCrit.toLowerCase() || checkVal === parseFloat(rawCrit);

            if (!matched) {
              allMatch = false;
              break;
            }
          }
          if (allMatch) {
            const v = parseFloat(sumTargetData[sc]?.value || '0');
            if (!isNaN(v)) total += v;
          }
        });
        return formatResult(total);
      }
    }

    // 3d. PRODUCT(...)
    const productMatch = raw.match(/^PRODUCT\s*\((.+)\)$/i);
    if (productMatch) {
      const vals = collectNumericValues(productMatch[1], sheetData, allSheets);
      if (vals.length === 0) return '0';
      const prod = vals.reduce((a, b) => a * b, 1);
      return formatResult(prod);
    }

    // 4. AVERAGE(...)
    const avgMatch = raw.match(/^AVERAGE\s*\((.+)\)$/i);
    if (avgMatch) {
      const vals = collectNumericValues(avgMatch[1], sheetData);
      if (vals.length === 0) return '0';
      const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
      return formatResult(avg);
    }

    // 4b. AVERAGEIF(range, criteria, [avg_range])
    const avgIfMatch = raw.match(/^AVERAGEIF\s*\((.+)\)$/i);
    if (avgIfMatch) {
      const args = splitFormulaArgs(avgIfMatch[1]);
      if (args.length >= 2) {
        const targetData = resolveTargetSheetData(args[0], sheetData, allSheets);
        const critCells = parseRange(stripSheetPrefix(args[0].toUpperCase()));
        const rawCrit = args[1].replace(/['"]/g, '').trim();
        const avgTargetData = args[2] ? resolveTargetSheetData(args[2], sheetData, allSheets) : targetData;
        const avgCells = args[2] ? parseRange(stripSheetPrefix(args[2].toUpperCase())) : critCells;

        const matchedVals: number[] = [];
        critCells.forEach((cId, idx) => {
          const val = parseFloat(targetData[cId]?.value || '0');
          let matches = false;
          if (rawCrit.startsWith('>=')) matches = val >= parseFloat(rawCrit.substring(2));
          else if (rawCrit.startsWith('<=')) matches = val <= parseFloat(rawCrit.substring(2));
          else if (rawCrit.startsWith('>')) matches = val > parseFloat(rawCrit.substring(1));
          else if (rawCrit.startsWith('<')) matches = val < parseFloat(rawCrit.substring(1));
          else if (rawCrit.startsWith('=')) matches = val === parseFloat(rawCrit.substring(1));
          else matches = (sheetData[cId]?.value || '') === rawCrit || val === parseFloat(rawCrit);

          if (matches) {
            const avgCell = avgCells[idx] || cId;
            const toAdd = parseFloat(avgTargetData[avgCell]?.value || '0');
            if (!isNaN(toAdd)) matchedVals.push(toAdd);
          }
        });
        if (matchedVals.length === 0) return '#DIV/0!';
        return formatResult(matchedVals.reduce((a, b) => a + b, 0) / matchedVals.length);
      }
    }

    // 4c. AVERAGEIFS(avg_range, crit_range1, crit1, ...)
    const avgIfsMatch = raw.match(/^AVERAGEIFS\s*\((.+)\)$/i);
    if (avgIfsMatch) {
      const args = splitFormulaArgs(avgIfsMatch[1]);
      if (args.length >= 3) {
        const avgTargetData = resolveTargetSheetData(args[0], sheetData, allSheets);
        const avgCells = parseRange(stripSheetPrefix(args[0].toUpperCase()));
        const matchedVals: number[] = [];

        avgCells.forEach((ac, idx) => {
          let allMatch = true;
          for (let i = 1; i < args.length; i += 2) {
            const critRange = parseRange(stripSheetPrefix(args[i].toUpperCase()));
            const rawCrit = args[i + 1]?.replace(/['"]/g, '').trim() || '';
            const critTargetData = resolveTargetSheetData(args[i], sheetData, allSheets);
            const checkCell = critRange[idx] || critRange[0];
            const checkVal = parseFloat(critTargetData[checkCell]?.value || '0');
            const checkStr = String(critTargetData[checkCell]?.value || '').trim();

            let matched = false;
            if (rawCrit.startsWith('>=')) matched = checkVal >= parseFloat(rawCrit.substring(2));
            else if (rawCrit.startsWith('<=')) matched = checkVal <= parseFloat(rawCrit.substring(2));
            else if (rawCrit.startsWith('>')) matched = checkVal > parseFloat(rawCrit.substring(1));
            else if (rawCrit.startsWith('<')) matched = checkVal < parseFloat(rawCrit.substring(1));
            else if (rawCrit.startsWith('=')) matched = checkVal === parseFloat(rawCrit.substring(1));
            else matched = checkStr.toLowerCase() === rawCrit.toLowerCase() || checkVal === parseFloat(rawCrit);

            if (!matched) {
              allMatch = false;
              break;
            }
          }
          if (allMatch) {
            const v = parseFloat(avgTargetData[ac]?.value || '0');
            if (!isNaN(v)) matchedVals.push(v);
          }
        });
        if (matchedVals.length === 0) return '#DIV/0!';
        return formatResult(matchedVals.reduce((a, b) => a + b, 0) / matchedVals.length);
      }
    }

    // 5. COUNT(...)
    const countMatch = raw.match(/^COUNT\s*\((.+)\)$/i);
    if (countMatch) {
      const vals = collectNumericValues(countMatch[1], sheetData);
      return vals.length.toString();
    }

    // 5b. COUNTA(...)
    const countaMatch = raw.match(/^COUNTA\s*\((.+)\)$/i);
    if (countaMatch) {
      const cells = parseRange(countaMatch[1].toUpperCase());
      const nonEmpty = cells.filter((c) => (sheetData[c]?.value || '').trim() !== '');
      return nonEmpty.length.toString();
    }

    // 5c. COUNTBLANK(...)
    const countblankMatch = raw.match(/^COUNTBLANK\s*\((.+)\)$/i);
    if (countblankMatch) {
      const cells = parseRange(countblankMatch[1].toUpperCase());
      const blank = cells.filter((c) => (sheetData[c]?.value || '').trim() === '');
      return blank.length.toString();
    }

    // 6. MIN(...)
    const minMatch = raw.match(/^MIN\s*\((.+)\)$/i);
    if (minMatch) {
      const vals = collectNumericValues(minMatch[1], sheetData);
      if (vals.length === 0) return '0';
      return formatResult(Math.min(...vals));
    }

    // 7. MAX(...)
    const maxMatch = raw.match(/^MAX\s*\((.+)\)$/i);
    if (maxMatch) {
      const vals = collectNumericValues(maxMatch[1], sheetData);
      if (vals.length === 0) return '0';
      return formatResult(Math.max(...vals));
    }

    // 7b. LARGE(array, k) & SMALL(array, k)
    const largeMatch = raw.match(/^LARGE\s*\((.+)\)$/i);
    if (largeMatch) {
      const args = splitFormulaArgs(largeMatch[1]);
      const vals = collectNumericValues(args[0], sheetData, allSheets).sort((a, b) => b - a);
      const k = parseInt(args[1], 10) || 1;
      return vals[k - 1] !== undefined ? formatResult(vals[k - 1]) : '#NUM!';
    }
    const smallMatch = raw.match(/^SMALL\s*\((.+)\)$/i);
    if (smallMatch) {
      const args = splitFormulaArgs(smallMatch[1]);
      const vals = collectNumericValues(args[0], sheetData, allSheets).sort((a, b) => a - b);
      const k = parseInt(args[1], 10) || 1;
      return vals[k - 1] !== undefined ? formatResult(vals[k - 1]) : '#NUM!';
    }

    // 8. ROUND(val, decimals)
    const roundMatch = raw.match(/^ROUND\s*\((.+)\)$/i);
    if (roundMatch) {
      const args = splitFormulaArgs(roundMatch[1]);
      const val = parseFloat(resolveArgValue(args[0], sheetData));
      const decimals = args[1] ? parseInt(args[1], 10) : 0;
      if (!isNaN(val)) {
        return val.toFixed(decimals);
      }
    }

    // 8b. ROUNDUP(val, decimals)
    const roundupMatch = raw.match(/^ROUNDUP\s*\((.+)\)$/i);
    if (roundupMatch) {
      const args = splitFormulaArgs(roundupMatch[1]);
      const val = parseFloat(resolveArgValue(args[0], sheetData));
      const decimals = args[1] ? parseInt(args[1], 10) : 0;
      if (!isNaN(val)) {
        const factor = Math.pow(10, decimals);
        return (Math.ceil(val * factor) / factor).toFixed(decimals);
      }
    }

    // 8c. ABS, SQRT, POWER, PI
    const absMatch = raw.match(/^ABS\s*\((.+)\)$/i);
    if (absMatch) {
      const v = parseFloat(resolveArgValue(absMatch[1], sheetData));
      return isNaN(v) ? '0' : Math.abs(v).toString();
    }
    const sqrtMatch = raw.match(/^SQRT\s*\((.+)\)$/i);
    if (sqrtMatch) {
      const v = parseFloat(resolveArgValue(sqrtMatch[1], sheetData));
      return isNaN(v) || v < 0 ? '#NUM!' : formatResult(Math.sqrt(v));
    }
    const powerMatch = raw.match(/^POWER\s*\((.+)\)$/i);
    if (powerMatch) {
      const args = splitFormulaArgs(powerMatch[1]);
      const base = parseFloat(resolveArgValue(args[0], sheetData));
      const exp = parseFloat(resolveArgValue(args[1], sheetData));
      return isNaN(base) || isNaN(exp) ? '#VALUE!' : formatResult(Math.pow(base, exp));
    }
    if (/^PI\s*\(\s*\)$/i.test(raw)) {
      return Math.PI.toString();
    }

    // 8d. COUNTIF(range, criteria)
    const countifMatch = raw.match(/^COUNTIF\s*\((.+)\)$/i);
    if (countifMatch) {
      const args = splitFormulaArgs(countifMatch[1]);
      if (args.length >= 2) {
        const targetData = resolveTargetSheetData(args[0], sheetData, allSheets);
        const cleanRange = stripSheetPrefix(args[0].toUpperCase());
        const cells = parseRange(cleanRange);
        const crit = args[1].replace(/['"]/g, '').trim().toLowerCase();
        let matches = 0;
        cells.forEach((c) => {
          const val = String(targetData[c]?.value || '').trim().toLowerCase();
          if (val === crit || (crit.startsWith('>') && parseFloat(val) > parseFloat(crit.substring(1))) || (crit.startsWith('<') && parseFloat(val) < parseFloat(crit.substring(1)))) {
            matches++;
          }
        });
        return matches.toString();
      }
    }

    // 8e. MEDIAN
    const medianMatch = raw.match(/^MEDIAN\s*\((.+)\)$/i);
    if (medianMatch) {
      const vals = collectNumericValues(medianMatch[1], sheetData).sort((a, b) => a - b);
      if (vals.length === 0) return '0';
      const mid = Math.floor(vals.length / 2);
      const median = vals.length % 2 !== 0 ? vals[mid] : (vals[mid - 1] + vals[mid]) / 2;
      return formatResult(median);
    }

    // 8f. IFERROR(val, alt)
    const iferrorMatch = raw.match(/^IFERROR\s*\((.+)\)$/i);
    if (iferrorMatch) {
      const args = splitFormulaArgs(iferrorMatch[1]);
      try {
        const res = evaluateExcelFormula(`=${args[0]}`, sheetData, allSheets);
        if (res.startsWith('#') || res === 'NaN') {
          return resolveArgValue(args[1], sheetData, allSheets);
        }
        return res;
      } catch {
        return resolveArgValue(args[1], sheetData, allSheets);
      }
    }

    // 8g. Text Functions: UPPER, LOWER, TRIM, LEN, LEFT, RIGHT, MID
    const upperMatch = raw.match(/^UPPER\s*\((.+)\)$/i);
    if (upperMatch) return resolveArgValue(upperMatch[1], sheetData).toUpperCase();
    const lowerMatch = raw.match(/^LOWER\s*\((.+)\)$/i);
    if (lowerMatch) return resolveArgValue(lowerMatch[1], sheetData).toLowerCase();
    const trimMatch = raw.match(/^TRIM\s*\((.+)\)$/i);
    if (trimMatch) return resolveArgValue(trimMatch[1], sheetData).trim().replace(/\s+/g, ' ');
    const lenMatch = raw.match(/^LEN\s*\((.+)\)$/i);
    if (lenMatch) return resolveArgValue(lenMatch[1], sheetData).length.toString();
    const leftMatch = raw.match(/^LEFT\s*\((.+)\)$/i);
    if (leftMatch) {
      const args = splitFormulaArgs(leftMatch[1]);
      const str = resolveArgValue(args[0], sheetData);
      const n = args[1] ? parseInt(args[1], 10) : 1;
      return str.substring(0, n);
    }
    const rightMatch = raw.match(/^RIGHT\s*\((.+)\)$/i);
    if (rightMatch) {
      const args = splitFormulaArgs(rightMatch[1]);
      const str = resolveArgValue(args[0], sheetData);
      const n = args[1] ? parseInt(args[1], 10) : 1;
      return str.substring(Math.max(0, str.length - n));
    }
    const midMatch = raw.match(/^MID\s*\((.+)\)$/i);
    if (midMatch) {
      const args = splitFormulaArgs(midMatch[1]);
      const str = resolveArgValue(args[0], sheetData);
      const start = Math.max(0, (parseInt(args[1], 10) || 1) - 1);
      const len = parseInt(args[2], 10) || 1;
      return str.substring(start, start + len);
    }

    // 8h. Date Functions: TODAY(), NOW(), YEAR(), MONTH(), DAY(), DATE()
    if (/^TODAY\s*\(\s*\)$/i.test(raw)) {
      return new Date().toISOString().split('T')[0];
    }
    if (/^NOW\s*\(\s*\)$/i.test(raw)) {
      return new Date().toLocaleString('ar-EG');
    }
    const yearMatch = raw.match(/^YEAR\s*\((.+)\)$/i);
    if (yearMatch) {
      const d = new Date(resolveArgValue(yearMatch[1], sheetData));
      return isNaN(d.getFullYear()) ? new Date().getFullYear().toString() : d.getFullYear().toString();
    }
    const monthMatch = raw.match(/^MONTH\s*\((.+)\)$/i);
    if (monthMatch) {
      const d = new Date(resolveArgValue(monthMatch[1], sheetData));
      return isNaN(d.getMonth()) ? (new Date().getMonth() + 1).toString() : (d.getMonth() + 1).toString();
    }
    const dayMatch = raw.match(/^DAY\s*\((.+)\)$/i);
    if (dayMatch) {
      const d = new Date(resolveArgValue(dayMatch[1], sheetData));
      return isNaN(d.getDate()) ? new Date().getDate().toString() : d.getDate().toString();
    }
    const dateMatch = raw.match(/^DATE\s*\((.+)\)$/i);
    if (dateMatch) {
      const args = splitFormulaArgs(dateMatch[1]);
      const y = parseInt(args[0], 10) || 2026;
      const m = parseInt(args[1], 10) || 1;
      const d = parseInt(args[2], 10) || 1;
      return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    }

    // 8i. Info: ISNUMBER, ISTEXT, ISBLANK
    const isnumMatch = raw.match(/^ISNUMBER\s*\((.+)\)$/i);
    if (isnumMatch) {
      const v = resolveArgValue(isnumMatch[1], sheetData);
      return (!isNaN(parseFloat(v)) && isFinite(Number(v))) ? 'TRUE' : 'FALSE';
    }
    const istextMatch = raw.match(/^ISTEXT\s*\((.+)\)$/i);
    if (istextMatch) {
      const v = resolveArgValue(istextMatch[1], sheetData);
      return (isNaN(parseFloat(v)) && v !== '') ? 'TRUE' : 'FALSE';
    }
    const isblankMatch = raw.match(/^ISBLANK\s*\((.+)\)$/i);
    if (isblankMatch) {
      const v = resolveArgValue(isblankMatch[1], sheetData);
      return v === '' ? 'TRUE' : 'FALSE';
    }

    // 8j. Financial: PMT(rate, nper, pv)
    const pmtMatch = raw.match(/^PMT\s*\((.+)\)$/i);
    if (pmtMatch) {
      const args = splitFormulaArgs(pmtMatch[1]);
      const rate = parseFloat(resolveArgValue(args[0], sheetData));
      const nper = parseFloat(resolveArgValue(args[1], sheetData));
      const pv = parseFloat(resolveArgValue(args[2], sheetData));
      if (!isNaN(rate) && !isNaN(nper) && !isNaN(pv) && rate !== 0) {
        const pmt = (pv * rate * Math.pow(1 + rate, nper)) / (Math.pow(1 + rate, nper) - 1);
        return formatResult(-pmt);
      }
    }

    // 8k. Lookup: INDEX, MATCH, XLOOKUP, HLOOKUP, CHOOSE, ROW, COLUMN
    const indexMatch = raw.match(/^INDEX\s*\((.+)\)$/i);
    if (indexMatch) {
      const args = splitFormulaArgs(indexMatch[1]);
      const cleanRange = stripSheetPrefix(args[0].toUpperCase());
      const cells = parseRange(cleanRange);
      const rowNum = parseInt(args[1], 10) || 1;
      const colNum = args[2] ? parseInt(args[2], 10) : 1;

      // Group cells by rows
      const rowMap: Record<number, string[]> = {};
      cells.forEach((c) => {
        const m = c.match(/([A-Z]+)(\d+)/);
        if (m) {
          const r = parseInt(m[2], 10);
          if (!rowMap[r]) rowMap[r] = [];
          rowMap[r].push(c);
        }
      });
      const rows = Object.values(rowMap);
      const targetRow = rows[rowNum - 1];
      if (targetRow) {
        const targetCell = targetRow[colNum - 1] || targetRow[0];
        return String(sheetData[targetCell]?.value || '');
      }
      return '#REF!';
    }

    const matchMatch = raw.match(/^MATCH\s*\((.+)\)$/i);
    if (matchMatch) {
      const args = splitFormulaArgs(matchMatch[1]);
      if (args.length >= 2) {
        const needle = resolveArgValue(args[0], sheetData).toLowerCase();
        const cleanRange = stripSheetPrefix(args[1].toUpperCase());
        const cells = parseRange(cleanRange);
        const idx = cells.findIndex(c => String(sheetData[c]?.value || '').toLowerCase() === needle);
        return idx !== -1 ? (idx + 1).toString() : '#N/A';
      }
    }

    const xlookupMatch = raw.match(/^XLOOKUP\s*\((.+)\)$/i);
    if (xlookupMatch) {
      const args = splitFormulaArgs(xlookupMatch[1]);
      if (args.length >= 3) {
        const needle = resolveArgValue(args[0], sheetData, allSheets).toLowerCase();
        const lookupCells = parseRange(stripSheetPrefix(args[1].toUpperCase()));
        const returnCells = parseRange(stripSheetPrefix(args[2].toUpperCase()));
        const defaultVal = args[3] ? resolveArgValue(args[3], sheetData, allSheets) : '#N/A';

        const idx = lookupCells.findIndex(c => String(sheetData[c]?.value || '').toLowerCase() === needle);
        if (idx !== -1 && returnCells[idx]) {
          return String(sheetData[returnCells[idx]]?.value || '');
        }
        return defaultVal;
      }
    }

    const hlookupMatch = raw.match(/^HLOOKUP\s*\((.+)\)$/i);
    if (hlookupMatch) {
      const args = splitFormulaArgs(hlookupMatch[1]);
      if (args.length >= 3) {
        const needle = resolveArgValue(args[0], sheetData, allSheets).toLowerCase();
        const cleanRange = stripSheetPrefix(args[1].toUpperCase());
        const cells = parseRange(cleanRange);
        const rowIndex = parseInt(args[2], 10);

        // Group range cells by cols
        const colMap: Record<string, string[]> = {};
        cells.forEach((c) => {
          const m = c.match(/([A-Z]+)(\d+)/);
          if (m) {
            const col = m[1];
            if (!colMap[col]) colMap[col] = [];
            colMap[col].push(c);
          }
        });

        for (const colLetters of Object.keys(colMap)) {
          const colCells = colMap[colLetters];
          const firstCell = colCells[0];
          const valInFirst = String(sheetData[firstCell]?.value || '').toLowerCase();
          if (valInFirst === needle || valInFirst.includes(needle)) {
            const targetCell = colCells[rowIndex - 1];
            if (targetCell) return String(sheetData[targetCell]?.value || '');
          }
        }
        return '#N/A';
      }
    }

    const chooseMatch = raw.match(/^CHOOSE\s*\((.+)\)$/i);
    if (chooseMatch) {
      const args = splitFormulaArgs(chooseMatch[1]);
      const idx = parseInt(resolveArgValue(args[0], sheetData, allSheets), 10);
      if (idx >= 1 && idx < args.length) {
        return resolveArgValue(args[idx], sheetData, allSheets);
      }
      return '#VALUE!';
    }

    const rowMatch = raw.match(/^ROW\s*\((.*)\)$/i);
    if (rowMatch) {
      const arg = rowMatch[1].trim();
      if (!arg) return '1';
      const m = arg.match(/\d+/);
      return m ? m[0] : '1';
    }

    const colMatch = raw.match(/^COLUMN\s*\((.*)\)$/i);
    if (colMatch) {
      const arg = colMatch[1].trim();
      if (!arg) return '1';
      const m = arg.toUpperCase().match(/[A-Z]+/);
      if (m) {
        let num = 0;
        for (let i = 0; i < m[0].length; i++) num = num * 26 + (m[0].charCodeAt(i) - 64);
        return num.toString();
      }
      return '1';
    }

    // 8l. More Logical: IFS, SWITCH, IFNA, TRUE, FALSE
    const ifsMatch = raw.match(/^IFS\s*\((.+)\)$/i);
    if (ifsMatch) {
      const args = splitFormulaArgs(ifsMatch[1]);
      for (let i = 0; i < args.length; i += 2) {
        if (evaluateCondition(args[i], sheetData, allSheets)) {
          return resolveArgValue(args[i + 1], sheetData, allSheets);
        }
      }
      return '#N/A';
    }

    const switchMatch = raw.match(/^SWITCH\s*\((.+)\)$/i);
    if (switchMatch) {
      const args = splitFormulaArgs(switchMatch[1]);
      const testVal = resolveArgValue(args[0], sheetData, allSheets).toLowerCase();
      for (let i = 1; i < args.length - 1; i += 2) {
        const caseVal = resolveArgValue(args[i], sheetData, allSheets).toLowerCase();
        if (testVal === caseVal) {
          return resolveArgValue(args[i + 1], sheetData, allSheets);
        }
      }
      if (args.length % 2 === 0) {
        return resolveArgValue(args[args.length - 1], sheetData, allSheets);
      }
      return '#N/A';
    }

    const ifnaMatch = raw.match(/^IFNA\s*\((.+)\)$/i);
    if (ifnaMatch) {
      const args = splitFormulaArgs(ifnaMatch[1]);
      const res = evaluateExcelFormula(`=${args[0]}`, sheetData, allSheets);
      return res === '#N/A' ? resolveArgValue(args[1], sheetData, allSheets) : res;
    }

    if (/^TRUE\s*\(\s*\)$/i.test(raw)) return 'TRUE';
    if (/^FALSE\s*\(\s*\)$/i.test(raw)) return 'FALSE';

    // 8m. More Math: INT, MOD, CEILING, FLOOR, RAND, RANDBETWEEN, COUNTIFS
    const intMatch = raw.match(/^INT\s*\((.+)\)$/i);
    if (intMatch) {
      const n = parseFloat(resolveArgValue(intMatch[1], sheetData));
      return isNaN(n) ? '#VALUE!' : Math.floor(n).toString();
    }

    const modMatch = raw.match(/^MOD\s*\((.+)\)$/i);
    if (modMatch) {
      const args = splitFormulaArgs(modMatch[1]);
      const n = parseFloat(resolveArgValue(args[0], sheetData));
      const d = parseFloat(resolveArgValue(args[1], sheetData));
      return isNaN(n) || isNaN(d) || d === 0 ? '#DIV/0!' : (n % d).toString();
    }

    const ceilingMatch = raw.match(/^CEILING\s*\((.+)\)$/i);
    if (ceilingMatch) {
      const args = splitFormulaArgs(ceilingMatch[1]);
      const n = parseFloat(resolveArgValue(args[0], sheetData));
      const sig = parseFloat(resolveArgValue(args[1], sheetData)) || 1;
      return isNaN(n) ? '#VALUE!' : formatResult(Math.ceil(n / sig) * sig);
    }

    const floorMatch = raw.match(/^FLOOR\s*\((.+)\)$/i);
    if (floorMatch) {
      const args = splitFormulaArgs(floorMatch[1]);
      const n = parseFloat(resolveArgValue(args[0], sheetData));
      const sig = parseFloat(resolveArgValue(args[1], sheetData)) || 1;
      return isNaN(n) ? '#VALUE!' : formatResult(Math.floor(n / sig) * sig);
    }

    if (/^RAND\s*\(\s*\)$/i.test(raw)) {
      return Math.random().toFixed(4);
    }

    const randbMatch = raw.match(/^RANDBETWEEN\s*\((.+)\)$/i);
    if (randbMatch) {
      const args = splitFormulaArgs(randbMatch[1]);
      const min = parseInt(resolveArgValue(args[0], sheetData), 10) || 0;
      const max = parseInt(resolveArgValue(args[1], sheetData), 10) || 100;
      return Math.floor(min + Math.random() * (max - min + 1)).toString();
    }

    const countifsMatch = raw.match(/^COUNTIFS\s*\((.+)\)$/i);
    if (countifsMatch) {
      const args = splitFormulaArgs(countifsMatch[1]);
      if (args.length >= 2) {
        const firstRange = parseRange(stripSheetPrefix(args[0].toUpperCase()));
        let count = 0;

        firstRange.forEach((_, idx) => {
          let allMatch = true;
          for (let i = 0; i < args.length; i += 2) {
            const critRange = parseRange(stripSheetPrefix(args[i].toUpperCase()));
            const rawCrit = args[i + 1]?.replace(/['"]/g, '').trim().toLowerCase() || '';
            const targetData = resolveTargetSheetData(args[i], sheetData, allSheets);
            const checkCell = critRange[idx] || critRange[0];
            const checkVal = parseFloat(targetData[checkCell]?.value || '0');
            const checkStr = String(targetData[checkCell]?.value || '').trim().toLowerCase();

            let matched = false;
            if (rawCrit.startsWith('>=')) matched = checkVal >= parseFloat(rawCrit.substring(2));
            else if (rawCrit.startsWith('<=')) matched = checkVal <= parseFloat(rawCrit.substring(2));
            else if (rawCrit.startsWith('>')) matched = checkVal > parseFloat(rawCrit.substring(1));
            else if (rawCrit.startsWith('<')) matched = checkVal < parseFloat(rawCrit.substring(1));
            else if (rawCrit.startsWith('=')) matched = checkVal === parseFloat(rawCrit.substring(1));
            else matched = checkStr === rawCrit || checkVal === parseFloat(rawCrit);

            if (!matched) {
              allMatch = false;
              break;
            }
          }
          if (allMatch) count++;
        });
        return count.toString();
      }
    }

    // 8n. More Text: TEXTJOIN, PROPER, SUBSTITUTE, REPT, EXACT, VALUE
    const textjoinMatch = raw.match(/^TEXTJOIN\s*\((.+)\)$/i);
    if (textjoinMatch) {
      const args = splitFormulaArgs(textjoinMatch[1]);
      const delimiter = resolveArgValue(args[0], sheetData, allSheets);
      const ignoreEmpty = resolveArgValue(args[1], sheetData, allSheets).toUpperCase() === 'TRUE';
      const items: string[] = [];

      for (let i = 2; i < args.length; i++) {
        const trimmed = args[i].trim();
        if (trimmed.includes(':')) {
          const cells = parseRange(stripSheetPrefix(trimmed.toUpperCase()));
          cells.forEach((c) => {
            const v = String(sheetData[c]?.value || '');
            if (!ignoreEmpty || v.trim() !== '') items.push(v);
          });
        } else {
          const v = resolveArgValue(trimmed, sheetData, allSheets);
          if (!ignoreEmpty || v.trim() !== '') items.push(v);
        }
      }
      return items.join(delimiter);
    }

    const properMatch = raw.match(/^PROPER\s*\((.+)\)$/i);
    if (properMatch) {
      const str = resolveArgValue(properMatch[1], sheetData);
      return str.replace(/\b\w/g, l => l.toUpperCase());
    }

    const substituteMatch = raw.match(/^SUBSTITUTE\s*\((.+)\)$/i);
    if (substituteMatch) {
      const args = splitFormulaArgs(substituteMatch[1]);
      const text = resolveArgValue(args[0], sheetData);
      const oldText = resolveArgValue(args[1], sheetData);
      const newText = resolveArgValue(args[2], sheetData);
      return text.replaceAll(oldText, newText);
    }

    const reptMatch = raw.match(/^REPT\s*\((.+)\)$/i);
    if (reptMatch) {
      const args = splitFormulaArgs(reptMatch[1]);
      const text = resolveArgValue(args[0], sheetData);
      const times = Math.max(0, parseInt(resolveArgValue(args[1], sheetData), 10) || 0);
      return text.repeat(Math.min(1000, times));
    }

    const exactMatch = raw.match(/^EXACT\s*\((.+)\)$/i);
    if (exactMatch) {
      const args = splitFormulaArgs(exactMatch[1]);
      const t1 = resolveArgValue(args[0], sheetData);
      const t2 = resolveArgValue(args[1], sheetData);
      return t1 === t2 ? 'TRUE' : 'FALSE';
    }

    const valueMatch = raw.match(/^VALUE\s*\((.+)\)$/i);
    if (valueMatch) {
      const str = resolveArgValue(valueMatch[1], sheetData).replace(/[^0-9.-]/g, '');
      const n = parseFloat(str);
      return isNaN(n) ? '#VALUE!' : formatResult(n);
    }

    // 8o. Date & Time Extensions: TIME, HOUR, MINUTE, SECOND, EDATE, EOMONTH, DATEDIF, WEEKDAY, DAYS
    const timeMatch = raw.match(/^TIME\s*\((.+)\)$/i);
    if (timeMatch) {
      const args = splitFormulaArgs(timeMatch[1]);
      const h = String(parseInt(args[0], 10) || 0).padStart(2, '0');
      const m = String(parseInt(args[1], 10) || 0).padStart(2, '0');
      const s = String(parseInt(args[2], 10) || 0).padStart(2, '0');
      return `${h}:${m}:${s}`;
    }

    const hourMatch = raw.match(/^HOUR\s*\((.+)\)$/i);
    if (hourMatch) {
      const d = new Date(resolveArgValue(hourMatch[1], sheetData));
      return isNaN(d.getHours()) ? '0' : d.getHours().toString();
    }
    const minTimeMatch = raw.match(/^MINUTE\s*\((.+)\)$/i);
    if (minTimeMatch) {
      const d = new Date(resolveArgValue(minTimeMatch[1], sheetData));
      return isNaN(d.getMinutes()) ? '0' : d.getMinutes().toString();
    }
    const secMatch = raw.match(/^SECOND\s*\((.+)\)$/i);
    if (secMatch) {
      const d = new Date(resolveArgValue(secMatch[1], sheetData));
      return isNaN(d.getSeconds()) ? '0' : d.getSeconds().toString();
    }

    const edateMatch = raw.match(/^EDATE\s*\((.+)\)$/i);
    if (edateMatch) {
      const args = splitFormulaArgs(edateMatch[1]);
      const d = new Date(resolveArgValue(args[0], sheetData));
      const months = parseInt(resolveArgValue(args[1], sheetData), 10) || 0;
      if (!isNaN(d.getTime())) {
        d.setMonth(d.getMonth() + months);
        return d.toISOString().split('T')[0];
      }
      return '#VALUE!';
    }

    const eomonthMatch = raw.match(/^EOMONTH\s*\((.+)\)$/i);
    if (eomonthMatch) {
      const args = splitFormulaArgs(eomonthMatch[1]);
      const d = new Date(resolveArgValue(args[0], sheetData));
      const months = parseInt(resolveArgValue(args[1], sheetData), 10) || 0;
      if (!isNaN(d.getTime())) {
        const lastDay = new Date(d.getFullYear(), d.getMonth() + months + 1, 0);
        return lastDay.toISOString().split('T')[0];
      }
      return '#VALUE!';
    }

    const datedifMatch = raw.match(/^DATEDIF\s*\((.+)\)$/i);
    if (datedifMatch) {
      const args = splitFormulaArgs(datedifMatch[1]);
      const d1 = new Date(resolveArgValue(args[0], sheetData));
      const d2 = new Date(resolveArgValue(args[1], sheetData));
      const unit = resolveArgValue(args[2], sheetData).toUpperCase();
      if (!isNaN(d1.getTime()) && !isNaN(d2.getTime())) {
        const diffMs = Math.abs(d2.getTime() - d1.getTime());
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (unit === 'D') return diffDays.toString();
        if (unit === 'M') {
          return (Math.abs(d2.getFullYear() - d1.getFullYear()) * 12 + Math.abs(d2.getMonth() - d1.getMonth())).toString();
        }
        if (unit === 'Y') {
          return Math.abs(d2.getFullYear() - d1.getFullYear()).toString();
        }
      }
      return '#VALUE!';
    }

    const weekdayMatch = raw.match(/^WEEKDAY\s*\((.+)\)$/i);
    if (weekdayMatch) {
      const d = new Date(resolveArgValue(splitFormulaArgs(weekdayMatch[1])[0], sheetData));
      return isNaN(d.getDay()) ? '1' : (d.getDay() + 1).toString();
    }

    const daysMatch = raw.match(/^DAYS\s*\((.+)\)$/i);
    if (daysMatch) {
      const args = splitFormulaArgs(daysMatch[1]);
      const d1 = new Date(resolveArgValue(args[0], sheetData));
      const d2 = new Date(resolveArgValue(args[1], sheetData));
      if (!isNaN(d1.getTime()) && !isNaN(d2.getTime())) {
        const diffDays = Math.round((d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays.toString();
      }
      return '#VALUE!';
    }

    // 8p. Extra Info: ISERROR, ISNA, ISEVEN, ISODD
    const iserrorMatch = raw.match(/^ISERROR\s*\((.+)\)$/i);
    if (iserrorMatch) {
      try {
        const res = evaluateExcelFormula(`=${iserrorMatch[1]}`, sheetData, allSheets);
        return (res.startsWith('#') || res === 'NaN') ? 'TRUE' : 'FALSE';
      } catch {
        return 'TRUE';
      }
    }
    const isnaMatch = raw.match(/^ISNA\s*\((.+)\)$/i);
    if (isnaMatch) {
      try {
        const res = evaluateExcelFormula(`=${isnaMatch[1]}`, sheetData, allSheets);
        return res === '#N/A' ? 'TRUE' : 'FALSE';
      } catch {
        return 'FALSE';
      }
    }
    const isevenMatch = raw.match(/^ISEVEN\s*\((.+)\)$/i);
    if (isevenMatch) {
      const n = parseInt(resolveArgValue(isevenMatch[1], sheetData), 10);
      return isNaN(n) ? '#VALUE!' : (n % 2 === 0 ? 'TRUE' : 'FALSE');
    }
    const isoddMatch = raw.match(/^ISODD\s*\((.+)\)$/i);
    if (isoddMatch) {
      const n = parseInt(resolveArgValue(isoddMatch[1], sheetData), 10);
      return isNaN(n) ? '#VALUE!' : (Math.abs(n) % 2 === 1 ? 'TRUE' : 'FALSE');
    }

    // 9. CONCAT(...) / CONCATENATE(...)
    const concatMatch = raw.match(/^(?:CONCAT|CONCATENATE)\s*\((.+)\)$/i);
    if (concatMatch) {
      const args = splitFormulaArgs(concatMatch[1]);
      return args.map((a) => resolveArgValue(a, sheetData)).join('');
    }

    // 10. General Math Expression with nested functions e.g. SUM(A1:A5)+B1 or A1*1.15
    let mathStr = raw;

    // Replace nested SUM, AVERAGE
    mathStr = mathStr.replace(/SUM\s*\(([^)]+)\)/gi, (_, inner) => {
      const vals = collectNumericValues(inner, sheetData, allSheets);
      return vals.reduce((a, b) => a + b, 0).toString();
    });

    mathStr = mathStr.replace(/AVERAGE\s*\(([^)]+)\)/gi, (_, inner) => {
      const vals = collectNumericValues(inner, sheetData, allSheets);
      if (vals.length === 0) return '0';
      return (vals.reduce((a, b) => a + b, 0) / vals.length).toString();
    });

    // Replace cross-sheet references e.g. 'Sheet1'!A1 or Sheet1!A1
    mathStr = mathStr.replace(/(?:'([^']+)'|([A-Za-z0-9_]+))!([A-Z]+[0-9]+)/gi, (_, quotedSheet, unquotedSheet, cellAddr) => {
      const sheetName = quotedSheet || unquotedSheet;
      const targetData = resolveTargetSheetData(sheetName, sheetData, allSheets);
      const cellVal = targetData[cellAddr.toUpperCase()]?.value;
      if (cellVal === undefined || cellVal === '') return '0';
      const cleanNum = parseFloat(String(cellVal).replace(/[^\d.-]/g, ''));
      return isNaN(cleanNum) ? '0' : cleanNum.toString();
    });

    // Replace local cell references A1, B4 with their numeric values
    mathStr = mathStr.replace(/\b([A-Z]+[0-9]+)\b/g, (match) => {
      const cellVal = sheetData[match]?.value;
      if (cellVal === undefined || cellVal === '') return '0';
      const cleanNum = parseFloat(String(cellVal).replace(/[^\d.-]/g, ''));
      return isNaN(cleanNum) ? '0' : cleanNum.toString();
    });

    // Validate safe characters for arithmetic
    if (/^[0-9+\-*/(). %^]+$/.test(mathStr)) {
      // Replace % with /100 and ^ with **
      const sanitized = mathStr.replace(/\^/g, '**').replace(/([0-9.]+)%/g, '($1/100)');
      // eslint-disable-next-line no-eval
      const result = Function(`'use strict'; return (${sanitized})`)();
      if (typeof result === 'number' && !isNaN(result)) {
        return formatResult(result);
      }
    }

    return raw;
  } catch (err) {
    console.warn('Formula eval error:', err);
    return '#VALUE!';
  }
}

export function stripSheetPrefix(ref: string): string {
  if (ref.includes('!')) {
    return ref.split('!').pop() || ref;
  }
  return ref;
}

export function resolveTargetSheetData(
  refOrSheetName: string, 
  currentSheetData: SheetData, 
  allSheets?: Record<string, { label: string; data: SheetData }>
): SheetData {
  if (!allSheets) return currentSheetData;

  let sheetIdentifier = refOrSheetName;
  if (refOrSheetName.includes('!')) {
    sheetIdentifier = refOrSheetName.split('!')[0].replace(/^['"]|['"]$/g, '').trim();
  } else {
    sheetIdentifier = refOrSheetName.replace(/^['"]|['"]$/g, '').trim();
  }

  // Look up by sheet key e.g. sheet1, sheet2
  if (allSheets[sheetIdentifier]) {
    return allSheets[sheetIdentifier].data;
  }

  // Look up by sheet label or name
  for (const key of Object.keys(allSheets)) {
    const s = allSheets[key];
    if (s.label.toLowerCase() === sheetIdentifier.toLowerCase() || 
        s.label.toLowerCase().includes(sheetIdentifier.toLowerCase()) ||
        key.toLowerCase() === sheetIdentifier.toLowerCase()) {
      return s.data;
    }
  }

  return currentSheetData;
}

function collectNumericValues(
  argsStr: string, 
  sheetData: SheetData, 
  allSheets?: Record<string, { label: string; data: SheetData }>
): number[] {
  const args = splitFormulaArgs(argsStr);
  const values: number[] = [];

  for (const arg of args) {
    const trimmed = arg.trim();
    if (trimmed.includes(':')) {
      const targetData = resolveTargetSheetData(trimmed, sheetData, allSheets);
      const cleanRange = stripSheetPrefix(trimmed.toUpperCase());
      const rangeCells = parseRange(cleanRange);
      for (const c of rangeCells) {
        const val = targetData[c]?.value;
        if (val !== undefined && val !== '') {
          const num = parseFloat(String(val).replace(/[^\d.-]/g, ''));
          if (!isNaN(num)) values.push(num);
        }
      }
    } else {
      const val = resolveArgValue(trimmed, sheetData, allSheets);
      const num = parseFloat(String(val).replace(/[^\d.-]/g, ''));
      if (!isNaN(num)) values.push(num);
    }
  }

  return values;
}

function resolveArgValue(
  arg: string, 
  sheetData: SheetData, 
  allSheets?: Record<string, { label: string; data: SheetData }>
): string {
  const trimmed = arg.trim();
  // Strip quotes
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  
  // Cross-sheet reference e.g. 'Sheet1'!A1 or Sheet1!A1
  if (trimmed.includes('!')) {
    const targetData = resolveTargetSheetData(trimmed, sheetData, allSheets);
    const cellAddr = stripSheetPrefix(trimmed).toUpperCase();
    return String(targetData[cellAddr]?.value || '');
  }

  // Check if cell reference e.g. A1, B4
  if (/^[A-Z]+[0-9]+$/i.test(trimmed)) {
    return String(sheetData[trimmed.toUpperCase()]?.value || '');
  }

  // If argument contains arithmetic expression like G8+G7 or A1*2
  if (/[+\-*/^]/.test(trimmed)) {
    try {
      const evalSub = evaluateExcelFormula('=' + trimmed, sheetData, allSheets);
      return String(evalSub);
    } catch {
      // fallback
    }
  }

  return trimmed;
}

function splitFormulaArgs(str: string): string[] {
  const args: string[] = [];
  let depth = 0;
  let inQuote = false;
  let current = '';

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char === '"' || char === "'") inQuote = !inQuote;
    if (!inQuote) {
      if (char === '(') depth++;
      else if (char === ')') depth--;
      else if ((char === ',' || char === ';') && depth === 0) {
        args.push(current.trim());
        current = '';
        continue;
      }
    }
    current += char;
  }
  if (current.trim()) args.push(current.trim());
  return args;
}

function evaluateCondition(
  condStr: string, 
  sheetData: SheetData, 
  allSheets?: Record<string, { label: string; data: SheetData }>
): boolean {
  const ops = ['>=', '<=', '!=', '<>', '=', '>', '<'];
  for (const op of ops) {
    if (condStr.includes(op)) {
      const [left, right] = condStr.split(op);
      const leftVal = parseFloat(resolveArgValue(left, sheetData, allSheets));
      const rightVal = parseFloat(resolveArgValue(right, sheetData, allSheets));

      if (!isNaN(leftVal) && !isNaN(rightVal)) {
        switch (op) {
          case '>': return leftVal > rightVal;
          case '<': return leftVal < rightVal;
          case '>=': return leftVal >= rightVal;
          case '<=': return leftVal <= rightVal;
          case '=': return leftVal === rightVal;
          case '!=':
          case '<>': return leftVal !== rightVal;
        }
      } else {
        const leftStr = resolveArgValue(left, sheetData, allSheets).toLowerCase();
        const rightStr = resolveArgValue(right, sheetData, allSheets).toLowerCase();
        if (op === '=' || op === '==') return leftStr === rightStr;
        if (op === '!=' || op === '<>') return leftStr !== rightStr;
      }
    }
  }
  return false;
}

function formatResult(val: number): string {
  if (Number.isInteger(val)) return val.toString();
  return val.toFixed(2);
}

/**
 * Adjusts relative row references in an Excel formula when dragged downwards or upwards.
 * Relative references (e.g. A4, B4:D4) are shifted by deltaRow.
 * Absolute references with $ row lock (e.g. A$4, $B$4) remain unchanged.
 */
export function shiftFormulaRowReferences(formula: string, deltaRow: number): string {
  if (!formula || !formula.startsWith('=') || deltaRow === 0) return formula;

  return formula.replace(/(\$?)([A-Za-z]+)(\$?)([0-9]+)/g, (match, colLock, colLetters, rowLock, rowStr) => {
    // If the row number is locked with $ ($4), do not shift it
    if (rowLock === '$') {
      return match;
    }
    const origRow = parseInt(rowStr, 10);
    const newRow = Math.max(1, origRow + deltaRow);
    return `${colLock}${colLetters}${newRow}`;
  });
}
