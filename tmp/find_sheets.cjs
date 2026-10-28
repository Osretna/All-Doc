const fs = require('fs');
const text = fs.readFileSync('/tmp/target_app.js', 'utf8');

// Search for the component that renders sheets
const p1 = text.indexOf('sheets');
console.log('Searching for sheets components...');
let matches = [];
let p = 0;
while ((p = text.indexOf('activeApp==="sheets"', p)) !== -1) {
  matches.push(p);
  p += 20;
}
if (matches.length === 0) {
  // try activeApp===`sheets`
  p = 0;
  while ((p = text.indexOf('===`sheets`', p)) !== -1) {
    matches.push(p);
    p += 11;
  }
}

console.log('Matches found:', matches.length);
matches.forEach(m => {
  console.log('--- At', m, '---');
  console.log(text.substring(Math.max(0, m - 100), Math.min(text.length, m + 300)));
});
