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
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
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
  if (lastNode) {
    range.setStartAfter(lastNode);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
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
