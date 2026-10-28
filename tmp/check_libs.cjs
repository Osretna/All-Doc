const fs = require('fs');
const text = fs.readFileSync('/tmp/target_app.js', 'utf8');

const checks = [
  'lucide', 'xlsx', 'sheetjs', 'handsontable', 'fortune', 'univer', 'tiptap', 
  'prosemirror', 'canvas', 'jspdf', 'pdf-lib', 'html2canvas', 'chart.js',
  'sql.js', 'localforage', 'docx', 'pptxgen'
];

checks.forEach(lib => {
  const re = new RegExp(lib, 'gi');
  const count = (text.match(re) || []).length;
  console.log(`${lib}: ${count}`);
});
