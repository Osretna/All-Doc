import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { SheetData, SlideItem } from '../types';

/**
 * Parses real binary .docx file and converts to styled HTML with images, tables, headings, and formatting
 */
export async function parseDocxFile(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);
    const docXmlFile = zip.file('word/document.xml');

    if (!docXmlFile) {
      const text = await file.text();
      return `<p>${escapeHtml(text)}</p>`;
    }

    // 1. Extract embedded media images
    const mediaMap: Record<string, string> = {};
    const mediaFiles = Object.keys(zip.files).filter((n) => n.startsWith('word/media/'));
    for (const mPath of mediaFiles) {
      const fileData = await zip.file(mPath)!.async('base64');
      const ext = mPath.split('.').pop()?.toLowerCase() || 'png';
      const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : ext === 'gif' ? 'image/gif' : 'image/png';
      const fileName = mPath.split('/').pop() || '';
      mediaMap[fileName] = `data:${mime};base64,${fileData}`;
      mediaMap[mPath] = `data:${mime};base64,${fileData}`;
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
        let align = 'right';

        const pPr = node.getElementsByTagName('w:pPr')[0];
        if (pPr) {
          const pStyle = pPr.getElementsByTagName('w:pStyle')[0];
          const val = pStyle?.getAttribute('w:val') || '';
          if (val.includes('Heading') || val.includes('Title') || val === '1' || val === '2') {
            isHeading = true;
          }
          const jc = pPr.getElementsByTagName('w:jc')[0];
          if (jc) {
            const jcVal = jc.getAttribute('w:val');
            if (jcVal === 'center') align = 'center';
            else if (jcVal === 'left') align = 'left';
            else if (jcVal === 'right') align = 'right';
          }
        }

        // Check for images in paragraph
        const blips = node.getElementsByTagName('a:blip');
        for (const blip of Array.from(blips)) {
          const embedId = blip.getAttribute('r:embed');
          if (embedId && relsMap[embedId]) {
            pText += `<div style="text-align: ${align}; margin: 12px 0;"><img src="${relsMap[embedId]}" style="max-width: 90%; max-height: 400px; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" /></div>`;
          }
        }

        const runs = node.getElementsByTagName('w:r');
        for (const run of Array.from(runs)) {
          const rPr = run.getElementsByTagName('w:rPr')[0];
          const b = rPr?.getElementsByTagName('w:b')[0];
          const i = rPr?.getElementsByTagName('w:i')[0];
          const u = rPr?.getElementsByTagName('w:u')[0];
          const color = rPr?.getElementsByTagName('w:color')[0]?.getAttribute('w:val');

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
            if (color) formatted = `<span style="color: #${color};">${formatted}</span>`;
            pText += formatted;
          }
        }

        if (pText.trim()) {
          if (isHeading) {
            html += `<h2 style="color: #0078d4; margin: 18px 0 8px 0; font-weight: 800; text-align: ${align};">${pText}</h2>\n`;
          } else {
            html += `<p style="line-height: 1.8; margin-bottom: 12px; text-align: ${align};">${pText}</p>\n`;
          }
        }
      } else if (node.nodeName === 'w:tbl') {
        html += '<table border="1" style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px;">\n';
        const rows = node.getElementsByTagName('w:tr');
        for (let r = 0; r < rows.length; r++) {
          const row = rows[r];
          const isHeader = r === 0;
          html += `<tr style="${isHeader ? 'background-color: #f3f4f6; font-weight: bold;' : ''}">\n`;
          const cells = row.getElementsByTagName('w:tc');
          for (const cell of Array.from(cells)) {
            let cellText = '';
            const pTags = cell.getElementsByTagName('w:p');
            for (const p of Array.from(pTags)) {
              cellText += p.textContent || '';
            }
            const tag = isHeader ? 'th' : 'td';
            html += `  <${tag} style="padding: 8px 12px; border: 1px solid #d1d5db;">${escapeHtml(cellText)}</${tag}>\n`;
          }
          html += '</tr>\n';
        }
        html += '</table>\n';
      }
    }

    return html || '<p>مستند فارغ</p>';
  } catch (err) {
    console.error('Error parsing .docx:', err);
    const raw = await file.text();
    if (raw.includes('<html') || raw.includes('<p')) return raw;
    return `<p style="white-space: pre-wrap;">${escapeHtml(raw)}</p>`;
  }
}

/**
 * Parses real binary .xlsx, .xls, or .csv files into Sheets
 */
export async function parseExcelFile(file: File): Promise<Record<string, { label: string; data: SheetData }>> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array', cellFormula: true, cellStyles: true });

  const resultSheets: Record<string, { label: string; data: SheetData }> = {};

  workbook.SheetNames.forEach((sheetName, sIdx) => {
    const worksheet = workbook.Sheets[sheetName];
    const sheetData: SheetData = {};

    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:A1');

    for (let R = range.s.r; R <= Math.min(range.e.r, 50); ++R) {
      for (let C = range.s.c; C <= Math.min(range.e.c, 26); ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = worksheet[cellAddress];
        if (cell) {
          const val = cell.w !== undefined ? String(cell.w) : (cell.v !== undefined ? String(cell.v) : '');
          const formula = cell.f ? `=${cell.f}` : undefined;

          let format: any = 'text';
          if (typeof cell.v === 'number') {
            if (val.includes('%')) format = 'percent';
            else if (val.includes('$') || val.includes('€') || val.includes('ر.س') || val.includes('EGP')) format = 'currency-sar';
            else format = 'number';
          }

          sheetData[cellAddress] = {
            value: val,
            formula: formula,
            format: format,
            bold: R === 0 || R === 2,
            bg: R === 0 ? '#107c41' : (R % 2 === 0 ? '#f8fafc' : '#ffffff'),
            color: R === 0 ? '#ffffff' : '#0f172a',
            align: typeof cell.v === 'number' ? 'center' : 'right',
          };
        }
      }
    }

    const key = `sheet_${sIdx + 1}`;
    resultSheets[key] = {
      label: sheetName || `ورقة ${sIdx + 1}`,
      data: sheetData,
    };
  });

  return Object.keys(resultSheets).length > 0 ? resultSheets : {};
}

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
          if (val === 'ffffff' || val === 'f8fafc' || val === 'ffffff') {
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

      // In title slides with wallpaper (like the user uploaded screenshot), card frame is standard
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
