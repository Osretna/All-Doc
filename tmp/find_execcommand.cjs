const fs = require('fs');
const text = fs.readFileSync('/tmp/target_app.js', 'utf8');

let p = 0;
while ((p = text.indexOf('document.execCommand', p)) !== -1) {
  console.log('--- At', p, '---');
  console.log(text.substring(Math.max(0, p - 100), Math.min(text.length, p + 200)));
  p += 20;
}
