const fs = require('fs');
const text = fs.readFileSync('/tmp/target_app.js', 'utf8');

// Search for the navigation sidebar or app switcher
const pos = text.indexOf('MY-DOC');
console.log('MY-DOC occurrences:');
let p = 0;
while ((p = text.indexOf('MY-DOC', p)) !== -1) {
  console.log('--- At', p, '---');
  console.log(text.substring(Math.max(0, p - 200), Math.min(text.length, p + 200)));
  p += 6;
}
