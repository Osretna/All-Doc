const fs = require('fs');
const text = fs.readFileSync('/tmp/target_app.js', 'utf8');

console.log('MY-DOC occurrences:');
let p = 0;
while ((p = text.indexOf('MY-DOC', p)) !== -1) {
  console.log('--- At', p, '---');
  console.log(text.substring(Math.max(0, p - 200), Math.min(text.length, p + 200)));
  p += 6;
}
