const fs = require('fs');
const text = fs.readFileSync('/tmp/excel_ribbon_section.js', 'utf8');

// Find all buttons, labels, and sections in the ribbon
const tabs = ['home', 'insert', 'layout', 'formulas', 'data', 'review', 'view'];
tabs.forEach(tab => {
  const p = text.indexOf(`e===\`${tab}\``);
  console.log(`\n=================== TAB: ${tab} (at ${p}) ===================`);
  if (p !== -1) {
    const chunk = text.substring(p, p + 8000);
    // Find all titles or button texts
    const titles = [...chunk.matchAll(/title:\`([^\`]+)\`/g)].map(m => m[1]);
    const labels = [...chunk.matchAll(/children:\`([^\`]+)\`/g)].map(m => m[1]);
    console.log('Titles:', titles);
    console.log('Labels sample:', labels.slice(0, 20));
  }
});
