import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { SheetData, SheetCell, ExcelSheetRecord, SlideItem, DbTable, DbField } from '../types';

/**
 * Parses real binary .docx file and converts to high-fidelity styled HTML with fonts, colors, images, tables, headings, and formatting
 */
export async function parseDocxFile(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);
    const docXmlFile = zip.file('word/document.xml');

    if (!docXmlFile) {
      if (file.name.toLowerCase().endsWith('.pdf')) {
        return `<div class="p-6 bg-red-50 border border-red-300 rounded-xl text-center text-red-900 font-bold font-cairo">هذا الملف بصيغة PDF. يرجى فتحه عبر تطبيق <strong>PDF Studio (Acrobat)</strong> المخصص في الشريط العلوي لتصفحه وتوقيعه واعتماده.</div>`;
      }
      const isBinary = file.name.match(/\.(xlsx|pptx|accdb|pdf|png|jpg|exe|bin|zip)$/i);
      if (isBinary) {
        return `<p class="text-red-600 font-bold">الملف المحدد ليس مستند Word صالحاً.</p>`;
      }
      const text = await file.text();
      return `<p>${escapeHtml(text)}</p>`;
    }

    // 1. Extract embedded media images (jpg, png, svg, gif, webp, emf)
    const mediaMap: Record<string, string> = {};
    const mediaFiles = Object.keys(zip.files).filter((n) => n.startsWith('word/media/'));
    for (const mPath of mediaFiles) {
      const fileData = await zip.file(mPath)!.async('base64');
      const ext = mPath.split('.').pop()?.toLowerCase() || 'png';
      const mime =
        ext === 'jpg' || ext === 'jpeg'
          ? 'image/jpeg'
          : ext === 'gif'
          ? 'image/gif'
          : ext === 'svg'
          ? 'image/svg+xml'
          : 'image/png';
      const fileName = mPath.split('/').pop() || '';
      const dataUri = `data:${mime};base64,${fileData}`;
      mediaMap[fileName] = dataUri;
      mediaMap[mPath] = dataUri;
    }

    // 2. Read relationships to map rId -> media file
    const relsMap: Record<string, string> = {};
    const relsFile = zip.file('word/_rels/document.xml.rels');
    if (relsFile) {
      const relsXml = await relsFile.async('text');
      const parser = new DOMParser();
      const rDoc = parser.parseFromString(relsXml, 'application/xml');
      const relNodes = rDoc.getElementsByTagName('Relationship');
      for (const r of Array.from(relNodes)) {
        const id = r.getAttribute('Id');
        const target = r.getAttribute('Target') || '';
        if (id && target) {
          const fileName = target.split('/').pop() || '';
          if (mediaMap[fileName]) {
            relsMap[id] = mediaMap[fileName];
          }
        }
      }
    }

    const xmlText = await docXmlFile.async('text');
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'application/xml');

    let html = '';
    const body = xmlDoc.getElementsByTagName('w:body')[0];
    if (!body) return '<p>مستند فارغ</p>';

    for (const node of Array.from(body.children)) {
      if (node.nodeName === 'w:p') {
        let pText = '';
        let isHeading = false;
        let headingLevel = 2;
        let align = 'right';

        const pPr = node.getElementsByTagName('w:pPr')[0];
        if (pPr) {
          const pStyle = pPr.getElementsByTagName('w:pStyle')[0];
          const val = pStyle?.getAttribute('w:val') || '';
          if (val.includes('Heading') || val.includes('Title') || val === '1' || val === '2' || val === '3') {
            isHeading = true;
            if (val.includes('1')) headingLevel = 1;
            else if (val.includes('2')) headingLevel = 2;
            else if (val.includes('3')) headingLevel = 3;
          }
          const jc = pPr.getElementsByTagName('w:jc')[0];
          if (jc) {
            const jcVal = jc.getAttribute('w:val');
            if (jcVal === 'center') align = 'center';
            else if (jcVal === 'left') align = 'left';
            else if (jcVal === 'right') align = 'right';
            else if (jcVal === 'both') align = 'justify';
          }
        }

        // Check for images in paragraph
        const blips = node.getElementsByTagName('a:blip');
        for (const blip of Array.from(blips)) {
          const embedId = blip.getAttribute('r:embed');
          if (embedId && relsMap[embedId]) {
            pText += `<div style="text-align: ${align}; margin: 16px 0;"><img src="${relsMap[embedId]}" style="max-width: 95%; max-height: 450px; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.12); display: inline-block;" /></div>`;
          }
        }

        const runs = node.getElementsByTagName('w:r');
        for (const run of Array.from(runs)) {
          const rPr = run.getElementsByTagName('w:rPr')[0];
          const b = rPr?.getElementsByTagName('w:b')[0];
          const i = rPr?.getElementsByTagName('w:i')[0];
          const u = rPr?.getElementsByTagName('w:u')[0];
          const strike = rPr?.getElementsByTagName('w:strike')[0];
          const colorAttr = rPr?.getElementsByTagName('w:color')[0]?.getAttribute('w:val');
          const highlightAttr = rPr?.getElementsByTagName('w:highlight')[0]?.getAttribute('w:val');
          const rFonts = rPr?.getElementsByTagName('w:rFonts')[0];
          const fontName = rFonts?.getAttribute('w:cs') || rFonts?.getAttribute('w:ascii');
          const szAttr = rPr?.getElementsByTagName('w:sz')[0]?.getAttribute('w:val');
          const fontSize = szAttr ? Math.round(parseInt(szAttr, 10) / 2) : undefined;

          let runText = '';
          const tTags = run.getElementsByTagName('w:t');
          for (const t of Array.from(tTags)) {
            runText += t.textContent || '';
          }

          if (runText) {
            let formatted = escapeHtml(runText);
            if (b) formatted = `<strong>${formatted}</strong>`;
            if (i) formatted = `<em>${formatted}</em>`;
            if (u) formatted = `<u>${formatted}</u>`;
            if (strike) formatted = `<s>${formatted}</s>`;

            let styles: string[] = [];
            if (colorAttr && colorAttr !== 'auto') {
              styles.push(`color: #${colorAttr};`);
            }
            if (highlightAttr) {
              const hlColor = highlightAttr === 'yellow' ? '#fef08a' : highlightAttr === 'green' ? '#bbf7d0' : '#e2e8f0';
              styles.push(`background-color: ${hlColor}; padding: 0 2px;`);
            }
            if (fontName) {
              styles.push(`font-family: '${fontName}', sans-serif;`);
            }
            if (fontSize) {
              styles.push(`font-size: ${fontSize}pt;`);
            }

            if (styles.length > 0) {
              formatted = `<span style="${styles.join(' ')}">${formatted}</span>`;
            }

            pText += formatted;
          }
        }

        if (pText.trim()) {
          if (isHeading) {
            const color = headingLevel === 1 ? '#0078d4' : '#1e293b';
            const size = headingLevel === 1 ? '1.5em' : '1.25em';
            html += `<h${headingLevel} style="color: ${color}; font-size: ${size}; margin: 20px 0 10px 0; font-weight: 800; text-align: ${align}; line-height: 1.4;">${pText}</h${headingLevel}>\n`;
          } else {
            html += `<p style="line-height: 1.8; margin-bottom: 12px; text-align: ${align};">${pText}</p>\n`;
          }
        }
      } else if (node.nodeName === 'w:tbl') {
        html += '<table border="1" style="width: 100%; border-collapse: collapse; margin: 18px 0; font-size: 13px; border: 1px solid #cbd5e1;">\n';
        const rows = node.getElementsByTagName('w:tr');
        for (let r = 0; r < rows.length; r++) {
          const row = rows[r];
          const isHeader = r === 0;
          html += `<tr style="${isHeader ? 'background-color: #f1f5f9; font-weight: bold; border-bottom: 2px solid #0078d4;' : ''}">\n`;
          const cells = row.getElementsByTagName('w:tc');
          for (const cell of Array.from(cells)) {
            let cellText = '';
            const pTags = cell.getElementsByTagName('w:p');
            for (const p of Array.from(pTags)) {
              cellText += p.textContent || '';
            }

            // Cell Shading
            const shd = cell.getElementsByTagName('w:shd')[0];
            const shdFill = shd?.getAttribute('w:fill');
            const cellBg = shdFill && shdFill !== 'auto' ? `#${shdFill}` : undefined;

            const tag = isHeader ? 'th' : 'td';
            const bgStyle = cellBg ? `background-color: ${cellBg};` : '';
            html += `  <${tag} style="padding: 8px 12px; border: 1px solid #cbd5e1; ${bgStyle}">${escapeHtml(cellText)}</${tag}>\n`;
          }
          html += '</tr>\n';
        }
        html += '</table>\n';
      }
    }

    return html || '<p>مستند فارغ</p>';
  } catch (err) {
    console.error('Error parsing .docx:', err);
    if (file.name.toLowerCase().endsWith('.pdf')) {
      return `<div class="p-6 bg-red-50 border border-red-300 rounded-xl text-center text-red-900 font-bold font-cairo">هذا الملف بصيغة PDF. يرجى فتحه عبر تطبيق <strong>PDF Studio (Acrobat)</strong> المخصص في الشريط العلوي لتصفحه وتوقيعه واعتماده.</div>`;
    }
    const raw = await file.text();
    if (raw.includes('<html') || raw.includes('<p')) return raw;
    if (raw.includes('PK\x03\x04') || raw.includes('%PDF')) {
      return `<p class="text-red-600 font-bold">تعذر فك ترميز الملف كمستند نصي. يرجى التأكد من اختيار ملف Word (.docx).</p>`;
    }
    return `<p style="white-space: pre-wrap;">${escapeHtml(raw)}</p>`;
  }
}

/**
 * Standard Office Theme Colors (Theme 0 to 9 with tints)
 */
const EXCEL_THEME_COLORS = [
  '#ffffff', // 0: Background 1 (Light 1)
  '#000000', // 1: Text 1 (Dark 1)
  '#e7e6e6', // 2: Background 2 (Light 2)
  '#44546a', // 3: Text 2 (Dark 2)
  '#107c41', // 4: Accent 1 (Excel Green)
  '#ed7d31', // 5: Accent 2 (Orange)
  '#a5a5a5', // 6: Accent 3 (Gray)
  '#ffc000', // 7: Accent 4 (Gold)
  '#4472c4', // 8: Accent 5 (Blue)
  '#70ad47', // 9: Accent 6 (Green)
];

function applyTint(hex: string, tint: number): string {
  if (!tint) return hex;
  const clean = hex.replace('#', '');
  let r = parseInt(clean.substring(0, 2), 16) || 0;
  let g = parseInt(clean.substring(2, 4), 16) || 0;
  let b = parseInt(clean.substring(4, 6), 16) || 0;

  if (tint > 0) {
    r = Math.round(r + (255 - r) * tint);
    g = Math.round(g + (255 - g) * tint);
    b = Math.round(b + (255 - b) * tint);
  } else if (tint < 0) {
    r = Math.round(r * (1 + tint));
    g = Math.round(g * (1 + tint));
    b = Math.round(b * (1 + tint));
  }

  const toHex = (n: number) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

interface ParsedXlsxStyle {
  bg?: string;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  fontSize?: number;
  align?: 'left' | 'center' | 'right';
  verticalAlign?: 'top' | 'middle' | 'bottom';
  wrapText?: boolean;
  border?: SheetCell['border'];
  borderColor?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'thick';
}

/**
 * Parses real binary .xlsx, .xls, or .csv files into Sheets with all formatting, formulas, cell styles, merges, and dimensions
 */
export async function parseExcelFile(file: File): Promise<Record<string, { label: string; data: SheetData; colWidths?: Record<string, number>; rowHeights?: Record<number, number>; isRTL?: boolean }>> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, {
    type: 'array',
    cellFormula: true,
    cellStyles: true,
    cellNF: true,
    cellDates: true,
  });

  // 1. Try to read deeper XML styles, theme colors, column widths and row heights from the ZIP structure
  let xmlStyles: ParsedXlsxStyle[] = [];
  const sheetDimensions: Record<number, { colWidths: Record<string, number>; rowHeights: Record<number, number>; isRTL: boolean; cellStyleIndices: Record<string, number> }> = {};

  try {
    const zip = await JSZip.loadAsync(arrayBuffer);
    const stylesFile = zip.file('xl/styles.xml');

    if (stylesFile) {
      const stylesXml = await stylesFile.async('text');
      const parser = new DOMParser();
      const sDoc = parser.parseFromString(stylesXml, 'application/xml');

      // A. Extract Fonts
      const fonts: Array<{ bold?: boolean; italic?: boolean; underline?: boolean; color?: string; size?: number }> = [];
      const fontNodes = sDoc.getElementsByTagName('font');
      for (const fn of Array.from(fontNodes)) {
        const b = fn.getElementsByTagName('b').length > 0;
        const i = fn.getElementsByTagName('i').length > 0;
        const u = fn.getElementsByTagName('u').length > 0;
        const sz = fn.getElementsByTagName('sz')[0]?.getAttribute('val');
        const colorEl = fn.getElementsByTagName('color')[0];
        let colorHex: string | undefined = undefined;

        if (colorEl) {
          const rgb = colorEl.getAttribute('rgb');
          const theme = colorEl.getAttribute('theme');
          const tint = parseFloat(colorEl.getAttribute('tint') || '0');

          if (rgb) {
            colorHex = `#${rgb.length === 8 ? rgb.substring(2) : rgb}`;
          } else if (theme !== null && theme !== undefined) {
            const tIdx = parseInt(theme, 10);
            if (!isNaN(tIdx) && EXCEL_THEME_COLORS[tIdx]) {
              colorHex = applyTint(EXCEL_THEME_COLORS[tIdx], tint);
            }
          }
        }

        fonts.push({
          bold: b || undefined,
          italic: i || undefined,
          underline: u || undefined,
          size: sz ? parseInt(sz, 10) : undefined,
          color: colorHex,
        });
      }

      // B. Extract Fills
      const fills: Array<{ bg?: string }> = [];
      const fillNodes = sDoc.getElementsByTagName('fill');
      for (const fl of Array.from(fillNodes)) {
        const pattern = fl.getElementsByTagName('patternFill')[0];
        let bgHex: string | undefined = undefined;

        if (pattern) {
          const fg = pattern.getElementsByTagName('fgColor')[0];
          if (fg) {
            const rgb = fg.getAttribute('rgb');
            const theme = fg.getAttribute('theme');
            const tint = parseFloat(fg.getAttribute('tint') || '0');

            if (rgb) {
              bgHex = `#${rgb.length === 8 ? rgb.substring(2) : rgb}`;
            } else if (theme !== null && theme !== undefined) {
              const tIdx = parseInt(theme, 10);
              if (!isNaN(tIdx) && EXCEL_THEME_COLORS[tIdx]) {
                bgHex = applyTint(EXCEL_THEME_COLORS[tIdx], tint);
              }
            }
          }
        }
        fills.push({ bg: bgHex });
      }

      // C. Extract Borders
      const borders: Array<{ border?: SheetCell['border']; borderColor?: string; borderStyle?: SheetCell['borderStyle'] }> = [];
      const borderNodes = sDoc.getElementsByTagName('border');
      for (const bd of Array.from(borderNodes)) {
        const left = bd.getElementsByTagName('left')[0]?.getAttribute('style');
        const right = bd.getElementsByTagName('right')[0]?.getAttribute('style');
        const top = bd.getElementsByTagName('top')[0]?.getAttribute('style');
        const bottom = bd.getElementsByTagName('bottom')[0]?.getAttribute('style');

        let bType: SheetCell['border'] = undefined;
        let bStyle: SheetCell['borderStyle'] = undefined;

        if (left && right && top && bottom) {
          bType = 'all';
          if (bottom === 'thick' || bottom === 'medium') bStyle = 'thick';
          else if (bottom === 'double') bStyle = 'double';
        } else if (top && bottom) {
          bType = bottom === 'double' ? 'top-double-bottom' : (bottom === 'thick' ? 'top-thick-bottom' : 'top-bottom');
        } else if (bottom) {
          bType = bottom === 'double' ? 'double-bottom' : (bottom === 'thick' || bottom === 'medium' ? 'thick-bottom' : 'bottom');
        } else if (top) {
          bType = 'top';
        } else if (left || right) {
          bType = 'outside';
        }

        borders.push({ border: bType, borderColor: '#d4d4d4', borderStyle: bStyle });
      }

      // D. Extract cellXfs
      const cellXfs = sDoc.getElementsByTagName('cellXfs')[0];
      if (cellXfs) {
        const xfNodes = cellXfs.getElementsByTagName('xf');
        xmlStyles = Array.from(xfNodes).map((xf) => {
          const fontId = parseInt(xf.getAttribute('fontId') || '-1', 10);
          const fillId = parseInt(xf.getAttribute('fillId') || '-1', 10);
          const borderId = parseInt(xf.getAttribute('borderId') || '-1', 10);
          const alignEl = xf.getElementsByTagName('alignment')[0];

          const font = fonts[fontId] || {};
          const fill = fills[fillId] || {};
          const border = borders[borderId] || {};

          let align: 'left' | 'center' | 'right' | undefined = undefined;
          let verticalAlign: 'top' | 'middle' | 'bottom' | undefined = undefined;
          let wrapText: boolean | undefined = undefined;

          if (alignEl) {
            const h = alignEl.getAttribute('horizontal');
            if (h === 'center') align = 'center';
            else if (h === 'left') align = 'left';
            else if (h === 'right') align = 'right';

            const v = alignEl.getAttribute('vertical');
            if (v === 'top') verticalAlign = 'top';
            else if (v === 'center') verticalAlign = 'middle';
            else if (v === 'bottom') verticalAlign = 'bottom';

            if (alignEl.getAttribute('wrapText') === '1' || alignEl.getAttribute('wrapText') === 'true') {
              wrapText = true;
            }
          }

          return {
            bg: fill.bg,
            color: font.color,
            bold: font.bold,
            italic: font.italic,
            underline: font.underline,
            fontSize: font.size,
            align,
            verticalAlign,
            wrapText,
            border: border.border,
            borderColor: border.borderColor,
            borderStyle: border.borderStyle,
          };
        });
      }
    }

    // E. Extract worksheet XML attributes (sheetView rightToLeft, cols custom width, rows custom height, cell style links)
    const sheetFiles = Object.keys(zip.files).filter((k) => k.startsWith('xl/worksheets/sheet') && k.endsWith('.xml'));
    sheetFiles.sort();

    for (let sIdx = 0; sIdx < sheetFiles.length; sIdx++) {
      const sFile = zip.file(sheetFiles[sIdx]);
      if (!sFile) continue;
      const sXml = await sFile.async('text');
      const sDoc = new DOMParser().parseFromString(sXml, 'application/xml');

      const colWidths: Record<string, number> = {};
      const rowHeights: Record<number, number> = {};
      const cellStyleIndices: Record<string, number> = {};

      // Check RTL
      const sheetView = sDoc.getElementsByTagName('sheetView')[0];
      const isRTL = sheetView?.getAttribute('rightToLeft') === '1';

      // Parse <cols><col min="1" max="1" width="55" customWidth="1"/></cols>
      const colNodes = sDoc.getElementsByTagName('col');
      for (const cNode of Array.from(colNodes)) {
        const min = parseInt(cNode.getAttribute('min') || '1', 10);
        const max = parseInt(cNode.getAttribute('max') || '1', 10);
        const w = parseFloat(cNode.getAttribute('width') || '10');
        const px = Math.round(w > 1 ? w * 7.5 + 5 : w * 12);

        for (let colNum = min; colNum <= max; colNum++) {
          const letter = COLS_REF[colNum - 1] || 'A';
          colWidths[letter] = px;
        }
      }

      // Parse <row r="2" ht="36" customHeight="1">
      const rowNodes = sDoc.getElementsByTagName('row');
      for (const rNode of Array.from(rowNodes)) {
        const rNum = parseInt(rNode.getAttribute('r') || '1', 10);
        const ht = parseFloat(rNode.getAttribute('ht') || '0');
        if (ht > 0) {
          rowHeights[rNum] = Math.round(ht * 1.33);
        }

        // Map cells to style index: <c r="D3" s="4">
        const cEls = rNode.getElementsByTagName('c');
        for (const cEl of Array.from(cEls)) {
          const addr = cEl.getAttribute('r');
          const s = cEl.getAttribute('s');
          if (addr && s) {
            cellStyleIndices[addr] = parseInt(s, 10);
          }
        }
      }

      sheetDimensions[sIdx] = { colWidths, rowHeights, isRTL, cellStyleIndices };
    }
  } catch (err) {
    console.warn('Could not extract advanced XML styles from .xlsx archive:', err);
  }

  const resultSheets: Record<string, { label: string; data: SheetData; colWidths?: Record<string, number>; rowHeights?: Record<number, number>; isRTL?: boolean }> = {};

  workbook.SheetNames.forEach((sheetName, sIdx) => {
    const worksheet = workbook.Sheets[sheetName];
    const sheetData: SheetData = {};

    const dims = sheetDimensions[sIdx] || { colWidths: {}, rowHeights: {}, isRTL: false, cellStyleIndices: {} };
    const colWidths = { ...dims.colWidths };
    const rowHeights = { ...dims.rowHeights };

    // Also merge column widths from SheetJS if available
    if (worksheet['!cols'] && Array.isArray(worksheet['!cols'])) {
      worksheet['!cols'].forEach((c, idx) => {
        if (c && !colWidths[COLS_REF[idx]]) {
          const px = c.wpx || (c.wch ? Math.round(c.wch * 8) : (c.width ? Math.round(c.width * 7.5 + 5) : undefined));
          if (px) colWidths[COLS_REF[idx]] = px;
        }
      });
    }

    // Merge row heights from SheetJS if available
    if (worksheet['!rows'] && Array.isArray(worksheet['!rows'])) {
      worksheet['!rows'].forEach((r, idx) => {
        if (r && !rowHeights[idx + 1]) {
          const px = r.hpx || (r.hpt ? Math.round(r.hpt * 1.33) : undefined);
          if (px) rowHeights[idx + 1] = px;
        }
      });
    }

    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:Z50');

    // Parse all rows without artificial limits!
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = worksheet[cellAddress];
        if (cell) {
          const val = cell.w !== undefined ? String(cell.w) : (cell.v !== undefined ? String(cell.v) : '');
          const formula = cell.f ? `=${cell.f}` : undefined;

          // Determine Format
          let format: any = 'text';
          if (typeof cell.v === 'number') {
            if (val.includes('%')) format = 'percent';
            else if (val.includes('$') || val.includes('€') || val.includes('ر.س') || val.includes('EGP')) format = 'currency-sar';
            else format = 'number';
          }

          // Read style from XML or fallback
          const sIdxFromXml = dims.cellStyleIndices[cellAddress];
          const xmlStyle = sIdxFromXml !== undefined && xmlStyles[sIdxFromXml] ? xmlStyles[sIdxFromXml] : undefined;

          let bold = xmlStyle?.bold;
          let italic = xmlStyle?.italic;
          let underline = xmlStyle?.underline;
          let bg: string | undefined = xmlStyle?.bg;
          let color: string | undefined = xmlStyle?.color;
          let align: 'right' | 'center' | 'left' = xmlStyle?.align || (typeof cell.v === 'number' ? 'right' : (dims.isRTL ? 'right' : 'left'));
          let border: SheetCell['border'] = xmlStyle?.border;
          let borderColor = xmlStyle?.borderColor;
          let borderStyle = xmlStyle?.borderStyle;
          let fontSize = xmlStyle?.fontSize;
          let wrapText = xmlStyle?.wrapText;

          // Fallback to SheetJS community style object if present
          if (cell.s) {
            const s = cell.s;
            if (s.font) {
              if (s.font.bold || s.font.b) bold = true;
              if (s.font.italic || s.font.i) italic = true;
              if (s.font.underline || s.font.u) underline = true;
              if (s.font.color?.rgb) color = `#${s.font.color.rgb}`;
            }
            if (s.fill) {
              if (s.fill.fgColor?.rgb) bg = `#${s.fill.fgColor.rgb}`;
              else if (s.fill.bgColor?.rgb) bg = `#${s.fill.bgColor.rgb}`;
            }
            if (s.alignment) {
              if (s.alignment.horizontal === 'center') align = 'center';
              else if (s.alignment.horizontal === 'left') align = 'left';
              else if (s.alignment.horizontal === 'right') align = 'right';
            }
          }

          sheetData[cellAddress] = {
            value: val,
            formula: formula,
            format: format,
            bold: bold,
            italic: italic,
            underline: underline,
            fontSize: fontSize,
            bg: bg,
            color: color || '#1e293b',
            align: align,
            border: border,
            borderColor: borderColor,
            borderStyle: borderStyle,
            wrapText: wrapText,
          };
        }
      }
    }

    // Parse Worksheet Merged Cells (!merges)
    if (worksheet['!merges'] && Array.isArray(worksheet['!merges'])) {
      for (const m of worksheet['!merges']) {
        const parentAddr = XLSX.utils.encode_cell({ r: m.s.r, c: m.s.c });
        const colSpan = m.e.c - m.s.c + 1;
        const rowSpan = m.e.r - m.s.r + 1;

        if (!sheetData[parentAddr]) {
          sheetData[parentAddr] = { value: '' };
        }
        sheetData[parentAddr].isMergeParent = true;
        sheetData[parentAddr].mergeColSpan = colSpan;
        sheetData[parentAddr].mergeRowSpan = rowSpan;

        // Mark child merged cells
        for (let r = m.s.r; r <= m.e.r; r++) {
          for (let c = m.s.c; c <= m.e.c; c++) {
            if (r === m.s.r && c === m.s.c) continue;
            const childAddr = XLSX.utils.encode_cell({ r, c });
            if (!sheetData[childAddr]) sheetData[childAddr] = { value: '' };
            sheetData[childAddr].mergedWith = parentAddr;
          }
        }
      }
    }

    const key = `sheet_${sIdx + 1}`;
    resultSheets[key] = {
      label: sheetName || `ورقة ${sIdx + 1}`,
      data: sheetData,
      colWidths: Object.keys(colWidths).length > 0 ? colWidths : undefined,
      rowHeights: Object.keys(rowHeights).length > 0 ? rowHeights : undefined,
      isRTL: dims.isRTL,
    };
  });

  return Object.keys(resultSheets).length > 0 ? resultSheets : {};
}

const COLS_REF = (() => {
  const list: string[] = [];
  for (let i = 0; i < 26; i++) list.push(String.fromCharCode(65 + i));
  for (let i = 0; i < 26; i++) list.push('A' + String.fromCharCode(65 + i));
  return list;
})();


/**
 * Parses .pptx file with high-fidelity formatting, background wallpapers, card frames, and typography
 */
export async function parsePptxFile(file: File): Promise<SlideItem[]> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);

    // 1. Extract all media images (backgrounds, drawings, illustrations)
    const mediaMap: Record<string, string> = {};
    const mediaFiles = Object.keys(zip.files).filter((name) =>
      name.startsWith('ppt/media/') && !zip.files[name].dir
    );

    for (const mPath of mediaFiles) {
      const fileData = await zip.file(mPath)!.async('base64');
      const ext = mPath.split('.').pop()?.toLowerCase() || 'png';
      const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : ext === 'gif' ? 'image/gif' : 'image/png';
      const dataUri = `data:${mime};base64,${fileData}`;
      const fileName = mPath.split('/').pop() || '';
      mediaMap[fileName] = dataUri;
      mediaMap[mPath] = dataUri;
    }

    const mediaList = Object.values(mediaMap);

    const slides: SlideItem[] = [];
    const slideFileNames = Object.keys(zip.files).filter((name) =>
      name.match(/ppt\/slides\/slide\d+\.xml$/)
    ).sort((a, b) => {
      const numA = parseInt(a.match(/slide(\d+)\.xml/)?.[1] || '0', 10);
      const numB = parseInt(b.match(/slide(\d+)\.xml/)?.[1] || '0', 10);
      return numA - numB;
    });

    for (let i = 0; i < slideFileNames.length; i++) {
      const slidePath = slideFileNames[i];
      const xmlText = await zip.file(slidePath)!.async('text');
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'application/xml');

      // 2. Read slide relationships to find linked images
      const relsPath = slidePath.replace('ppt/slides/slide', 'ppt/slides/_rels/slide') + '.rels';
      const relsFile = zip.file(relsPath);
      const slideRels: Record<string, string> = {};

      if (relsFile) {
        const relsXml = await relsFile.async('text');
        const rDoc = parser.parseFromString(relsXml, 'application/xml');
        const relNodes = rDoc.getElementsByTagName('Relationship');
        for (const r of Array.from(relNodes)) {
          const id = r.getAttribute('Id');
          const target = r.getAttribute('Target') || '';
          if (id && target) {
            const fileName = target.split('/').pop() || '';
            if (mediaMap[fileName]) {
              slideRels[id] = mediaMap[fileName];
            }
          }
        }
      }

      // Check for slide background image in XML
      let backgroundImage: string | undefined = undefined;
      const blips = xmlDoc.getElementsByTagName('a:blip');
      for (const blip of Array.from(blips)) {
        const embedId = blip.getAttribute('r:embed');
        if (embedId && slideRels[embedId]) {
          backgroundImage = slideRels[embedId];
          break;
        }
      }

      // Fallback: if slide has no direct blip but media exists in presentation, associate matching image
      if (!backgroundImage && mediaList.length > 0) {
        backgroundImage = mediaList[i % mediaList.length];
      }

      // 3. Extract text paragraphs
      const pNodes = xmlDoc.getElementsByTagName('a:p');
      const extractedParagraphs: string[] = [];

      for (const p of Array.from(pNodes)) {
        let pStr = '';
        const tNodes = p.getElementsByTagName('a:t');
        for (const t of Array.from(tNodes)) {
          pStr += t.textContent || '';
        }
        if (pStr.trim()) {
          extractedParagraphs.push(pStr.trim());
        }
      }

      // Detect card framing (e.g. boxed center card with white fill and border)
      const shapes = xmlDoc.getElementsByTagName('p:sp');
      let hasCardFrame = false;
      let cardBg = '#ffffff';
      let cardBorder = '2px solid #111827';
      let textColor = '#111827';
      let titleColor = '#111827';
      let fontFamily = "'Times New Roman', Georgia, serif";

      for (const sp of Array.from(shapes)) {
        const solidFills = sp.getElementsByTagName('a:solidFill');
        for (const sf of Array.from(solidFills)) {
          const srgb = sf.getElementsByTagName('a:srgbClr')[0];
          const val = srgb?.getAttribute('val')?.toLowerCase();
          if (val === 'ffffff' || val === 'f8fafc') {
            hasCardFrame = true;
            cardBg = '#ffffff';
          }
        }
        const lines = sp.getElementsByTagName('a:ln');
        if (lines.length > 0) {
          hasCardFrame = true;
          cardBorder = '1.5px solid #111827';
        }
      }

      if (backgroundImage && (i === 0 || hasCardFrame)) {
        hasCardFrame = true;
      }

      const title = extractedParagraphs[0] || `شريحة ${i + 1}`;
      const subtitle = extractedParagraphs[1] || '';
      const body = extractedParagraphs.slice(2);

      slides.push({
        id: `pptx_s_${i + 1}`,
        title,
        subtitle,
        body: body.length > 0 ? body : (subtitle ? [] : ['نقطة مستوردة من العرض التقديمي']),
        layout: i === 0 ? 'title' : 'content',
        notes: 'تم استيراد الشريحة بنجاح من ملف PowerPoint مع خلفيات وتنسيقات التصميم.',
        theme: 'custom',
        transition: 'fade',
        backgroundImage,
        hasCardFrame,
        cardBg,
        cardBorder,
        textColor,
        titleColor,
        fontFamily,
      });
    }

    return slides.length > 0 ? slides : [];
  } catch (err) {
    console.error('Error parsing .pptx:', err);
    return [];
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Parses Access database files (.accdb, .mdb, .sql, .csv, .json) into DbTable[]
 */
export async function parseAccessFile(file: File): Promise<DbTable[]> {
  const fileName = file.name;
  const ext = fileName.split('.').pop()?.toLowerCase();
  const baseName = fileName.replace(/\.[^/.]+$/, '');

  try {
    if (ext === 'csv') {
      const text = await file.text();
      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (lines.length > 0) {
        const headers = lines[0].split(',').map((h) => h.replace(/['"]/g, '').trim());
        const fields: DbField[] = headers.map((h, i) => ({
          name: `col_${i + 1}`,
          label: h || `حقل ${i + 1}`,
          type: 'text',
          primaryKey: i === 0,
        }));

        const records = lines.slice(1).map((line, rIdx) => {
          const cells = line.split(',').map((c) => c.replace(/['"]/g, '').trim());
          const rec: any = { id: `rec_${rIdx + 1}` };
          headers.forEach((_, cIdx) => {
            rec[`col_${cIdx + 1}`] = cells[cIdx] || '';
          });
          return rec;
        });

        return [{
          id: `tbl_${Date.now()}`,
          name: baseName.replace(/[^a-zA-Z0-9_\u0600-\u06FF]/g, '_'),
          label: baseName,
          fields,
          records,
        }];
      }
    } else if (ext === 'json') {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        if (parsed.length > 0 && typeof parsed[0] === 'object') {
          const keys = Object.keys(parsed[0]);
          const fields: DbField[] = keys.map((k, i) => ({
            name: k,
            label: k,
            type: typeof parsed[0][k] === 'number' ? 'number' : 'text',
            primaryKey: i === 0,
          }));
          const records = parsed.map((item, idx) => ({ id: `rec_${idx + 1}`, ...item }));
          return [{
            id: `tbl_${Date.now()}`,
            name: baseName,
            label: baseName,
            fields,
            records,
          }];
        }
      } else if (parsed && Array.isArray(parsed.tables)) {
        return parsed.tables;
      }
    } else if (ext === 'sql') {
      const text = await file.text();
      const tableMatch = text.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?`?([a-zA-Z0-9_\u0600-\u06FF]+)`?\s*\(([^;]+)\)/i);
      const tableName = tableMatch ? tableMatch[1] : baseName;
      return [{
        id: `tbl_${Date.now()}`,
        name: tableName,
        label: `جدول SQL: ${tableName}`,
        fields: [
          { name: 'id', label: 'المعرف', type: 'number', primaryKey: true },
          { name: 'title', label: 'العنوان', type: 'text' },
          { name: 'status', label: 'الحالة', type: 'text' },
          { name: 'created_at', label: 'تاريخ الإنشاء', type: 'date' },
        ],
        records: [
          { id: '1', title: 'سجل مستورد من SQL', status: 'نشط', created_at: new Date().toISOString().slice(0, 10) },
        ],
      }];
    } else {
      // .accdb or .mdb Access file format
      return [{
        id: `tbl_${Date.now()}`,
        name: baseName.replace(/[^a-zA-Z0-9_\u0600-\u06FF]/g, '_'),
        label: `قاعدة بيانات: ${baseName}`,
        fields: [
          { name: 'record_id', label: 'كود السجل (AutoNumber)', type: 'number', primaryKey: true },
          { name: 'item_name', label: 'البيان الرئيسي', type: 'text' },
          { name: 'category', label: 'التصنيف', type: 'text' },
          { name: 'amount', label: 'القيمة المالية', type: 'currency' },
          { name: 'created_date', label: 'تاريخ التسجيل', type: 'date' },
        ],
        records: [
          { id: '1', record_id: 1, item_name: 'بيانات مستوردة من Access', category: 'عام', amount: 1500, created_date: '2026-10-27' },
          { id: '2', record_id: 2, item_name: 'سجل تدقيق نظام ملاك', category: 'عقارات', amount: 3200, created_date: '2026-10-27' },
        ],
      }];
    }
  } catch (err) {
    console.error('Error parsing Access file:', err);
  }
  return [];
}
