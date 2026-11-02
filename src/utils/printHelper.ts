/**
 * Professional print utility that prints ONLY the document/file content,
 * completely excluding the app UI, toolbars, sidebars, headers, and buttons.
 */

export function printDocumentContent(elementId: string, documentTitle: string = 'المستند'): void {
  const targetElement = document.getElementById(elementId);
  if (!targetElement) {
    console.error(`Print target element #${elementId} not found`);
    window.print();
    return;
  }

  // Create a hidden, isolated iframe dedicated to printing
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.id = 'isolated-print-frame';

  document.body.appendChild(iframe);

  const frameDoc = iframe.contentWindow?.document;
  if (!frameDoc) {
    // Fallback if iframe document cannot be reached
    window.print();
    return;
  }

  // Clone document content and apply clean print layout
  const contentHtml = targetElement.innerHTML;

  frameDoc.open();
  frameDoc.write(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="utf-8">
      <title>${documentTitle}</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
      <style>
        @page {
          size: A4 portrait;
          margin: 15mm;
        }
        * {
          box-sizing: border-box;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        body {
          margin: 0;
          padding: 0;
          font-family: 'Cairo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #000000;
          background: #ffffff;
          line-height: 1.6;
        }
        /* Hide all UI controls, toolbars, buttons, inputs if any survived inside */
        button, .no-print, input, textarea, select {
          display: none !important;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 10px 0;
          font-size: 13px;
        }
        table, th, td {
          border: 1px solid #71717a;
        }
        th, td {
          padding: 8px 10px;
          text-align: right;
        }
        th {
          background-color: #f1f5f9;
          font-weight: 700;
        }
        tr:nth-child(even) {
          background-color: #f8fafc;
        }
        img {
          max-width: 100%;
          height: auto;
        }
        .slide-page {
          page-break-after: always;
          break-after: page;
          min-height: 190mm;
          padding: 20px;
          border: 1px solid #e2e8f0;
          margin-bottom: 20px;
        }
        .slide-page:last-child {
          page-break-after: avoid;
          break-after: avoid;
        }
        h1, h2, h3, h4 {
          margin-top: 0;
          color: #0f172a;
        }
      </style>
    </head>
    <body>
      <div class="print-container">
        ${contentHtml}
      </div>
    </body>
    </html>
  `);
  frameDoc.close();

  // Wait for fonts and assets in the iframe to render, then print
  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (e) {
      console.warn('Iframe print failed, falling back to window.print():', e);
      window.print();
    } finally {
      // Remove the print iframe after printing prompt closes
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 3000);
    }
  }, 400);
}
