/**
 * Helper utilities to manipulate rich text in the document editor
 */

export function executeCommand(command: string, value: string | undefined = undefined): boolean {
  try {
    document.execCommand(command, false, value);
    return true;
  } catch (err) {
    console.error(`Failed to execute ${command}:`, err);
    return false;
  }
}

export function insertHTMLAtCursor(html: string): void {
  const editor = document.getElementById('document-editor');
  const selection = window.getSelection();
  let range: Range | null = null;

  if (selection && selection.rangeCount > 0) {
    const r = selection.getRangeAt(0);
    if (editor && editor.contains(r.commonAncestorContainer)) {
      range = r;
    }
  }

  if (!range && (window as any).__lastWordEditorRange && editor) {
    try {
      range = (window as any).__lastWordEditorRange;
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range!);
      }
    } catch {
      range = null;
    }
  }

  if (!range && editor) {
    editor.focus();
    range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(false);
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  if (!range) return;

  range.deleteContents();

  const el = document.createElement('div');
  el.innerHTML = html;
  const frag = document.createDocumentFragment();
  let node: ChildNode | null;
  let lastNode: ChildNode | null = null;
  
  while ((node = el.firstChild)) {
    lastNode = frag.appendChild(node);
  }
  
  range.insertNode(frag);
  if (lastNode && selection) {
    range.setStartAfter(lastNode);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
    (window as any).__lastWordEditorRange = range.cloneRange();
  }
}

export function getSelectedText(): string {
  const selection = window.getSelection();
  return selection ? selection.toString() : '';
}

export function calculateStats(text: string, html: string): {
  words: number;
  charactersNoSpaces: number;
  charactersWithSpaces: number;
  paragraphs: number;
  lines: number;
} {
  const cleanText = text.trim();
  const words = cleanText ? cleanText.split(/\s+/).filter(Boolean).length : 0;
  const charactersWithSpaces = cleanText.length;
  const charactersNoSpaces = cleanText.replace(/\s+/g, '').length;
  const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0).length || 1;
  const lines = Math.max(1, Math.ceil(words / 10));

  return {
    words,
    charactersNoSpaces,
    charactersWithSpaces,
    paragraphs,
    lines,
  };
}

export function exportDocumentAsWord(title: string, htmlContent: string): void {
  const header = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' 
          xmlns:w='urn:schemas-microsoft-com:office:word' 
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${title}</title>
      <style>
        body { font-family: 'Cairo', 'Segoe UI', Arial, sans-serif; direction: rtl; }
        table { border-collapse: collapse; width: 100%; margin: 10px 0; }
        td, th { border: 1px solid #999; padding: 6px 10px; }
      </style>
    </head>
    <body dir="rtl">
      ${htmlContent}
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', header], {
    type: 'application/msword'
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title || 'document'}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export interface SavedTextStyle {
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  fontStyle?: string;
  textDecoration?: string;
  color?: string;
  backgroundColor?: string;
}

export function copyCurrentSelectionStyle(): SavedTextStyle {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return {};
  const range = selection.getRangeAt(0);
  let el = range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
    ? (range.commonAncestorContainer as HTMLElement)
    : range.commonAncestorContainer.parentElement;

  if (!el) return {};
  const cs = window.getComputedStyle(el);
  return {
    fontFamily: cs.fontFamily,
    fontSize: cs.fontSize,
    fontWeight: cs.fontWeight,
    fontStyle: cs.fontStyle,
    textDecoration: cs.textDecorationLine || cs.textDecoration,
    color: cs.color,
    backgroundColor: cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent' ? cs.backgroundColor : undefined,
  };
}

export function applyStyleToSelection(styles: SavedTextStyle): void {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;

  const range = selection.getRangeAt(0);
  const span = document.createElement('span');
  if (styles.fontFamily) span.style.fontFamily = styles.fontFamily;
  if (styles.fontSize) span.style.fontSize = styles.fontSize;
  if (styles.fontWeight) span.style.fontWeight = styles.fontWeight;
  if (styles.fontStyle) span.style.fontStyle = styles.fontStyle;
  if (styles.textDecoration) span.style.textDecoration = styles.textDecoration;
  if (styles.color) span.style.color = styles.color;
  if (styles.backgroundColor) span.style.backgroundColor = styles.backgroundColor;

  try {
    range.surroundContents(span);
  } catch {
    // If selection crosses node boundaries, extract contents and append
    const contents = range.extractContents();
    span.appendChild(contents);
    range.insertNode(span);
  }
}

export interface SpellingIssue {
  id: string;
  wrongWord: string;
  suggestedWord: string;
  reason: string;
}

const COMMON_ARABIC_ERRORS: Record<string, { suggestion: string; reason: string }> = {
  'انشاء الله': { suggestion: 'إن شاء الله', reason: 'فصل "إن" الشرطية عن "شاء"' },
  'هاذا': { suggestion: 'هذا', reason: 'الألف بعد الهاء تنطق ولا تكتب' },
  'لاكن': { suggestion: 'لكن', reason: 'الألف بعد اللام تنطق ولا تكتب' },
  'مسؤل': { suggestion: 'مسؤول', reason: 'همزة متوسطة مضمومة تليها واو' },
  'شئ': { suggestion: 'شيء', reason: 'همزة متطرفة على السطر بعد ياء ساكنة' },
  'جزءا': { suggestion: 'جزأً', reason: 'تنوين الفتح' },
  'أستراتيجية': { suggestion: 'استراتيجية', reason: 'همزة وصل في الكلمات الأعجمية' },
  'أقتصاد': { suggestion: 'اقتصاد', reason: 'مصدر خماسي همزته وصل' },
  'أستثمار': { suggestion: 'استثمار', reason: 'مصدر سداسي همزته وصل' },
  'اللة': { suggestion: 'الله', reason: 'لفظ الجلالة ينتهي بهاء وليس تاء' },
  'رئيسا': { suggestion: 'رئيسياً', reason: 'ياء النسبة والتشديد' },
};

export function checkSpellingAndGrammar(text: string): SpellingIssue[] {
  const issues: SpellingIssue[] = [];
  let idCounter = 1;

  for (const [wrong, info] of Object.entries(COMMON_ARABIC_ERRORS)) {
    if (text.includes(wrong)) {
      issues.push({
        id: `sp_${idCounter++}`,
        wrongWord: wrong,
        suggestedWord: info.suggestion,
        reason: info.reason,
      });
    }
  }

  // Check duplicate consecutive words (e.g. في في / من من)
  const duplicateRegex = /\b(\S+)\s+\1\b/g;
  let match;
  while ((match = duplicateRegex.exec(text)) !== null) {
    issues.push({
      id: `sp_${idCounter++}`,
      wrongWord: `${match[1]} ${match[1]}`,
      suggestedWord: match[1],
      reason: 'كلمة مكررة بدون داعٍ',
    });
  }

  return issues;
}

