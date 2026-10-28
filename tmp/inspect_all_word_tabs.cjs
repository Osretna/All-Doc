const fs = require('fs');
const text = fs.readFileSync('/tmp/target_app.js', 'utf8');

// Let's inspect from 311000 to 390000
const wordSlice = text.substring(310000, 390000);
fs.writeFileSync('/tmp/word_complete_source.js', wordSlice);
console.log('Saved word_complete_source.js');

// Let's search for each tab's groups and buttons
const tabNames = ['Nr', 'Pr', 'Fr', 'Ir', 'Lr', 'Rr', 'zr', 'Br', 'Vr', 'Ur', 'Wr'];
tabNames.forEach(tName => {
  const p = wordSlice.indexOf(`${tName}=`);
  if (p !== -1) {
    console.log(`\n=== Found ${tName} at ${p} ===`);
    const chunk = wordSlice.substring(p, p + 3000);
    // Find titles and children
    const titles = [...chunk.matchAll(/title:\`([^\`]+)\`/g)].map(m => m[1]);
    console.log('Titles:', titles);
  }
});
