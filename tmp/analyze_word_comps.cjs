const fs = require('fs');
const text = fs.readFileSync('/tmp/word_suite_full.js', 'utf8');

const components = ['Nr', 'Pr', 'Fr', 'Ir', 'Lr', 'Rr', 'zr', 'Vr'];

components.forEach(comp => {
  const p = text.indexOf(`${comp}=`);
  console.log(`\n=================== COMPONENT ${comp} at ${p} ===================`);
  if (p !== -1) {
    const chunk = text.substring(p, p + 6000);
    // Find all titles
    const titles = [...chunk.matchAll(/title:\`([^\`]+)\`/g)].map(m => m[1]);
    const labels = [...chunk.matchAll(/children:\`([^\`]+)\`/g)].map(m => m[1]);
    console.log('Titles:', titles);
    console.log('Labels:', labels.slice(0, 15));
  }
});
