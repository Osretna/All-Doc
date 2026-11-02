const fs = require('fs');
const text = fs.readFileSync('/tmp/target_app.js', 'utf8');

// Find function Vr or Vr=
let p = text.indexOf('Vr=');
if (p === -1) p = text.indexOf('function Vr');
console.log('Vr location:', p);
if (p !== -1) {
  // Let's dump 60000 chars from p to see the entire Word ribbon!
  fs.writeFileSync('/tmp/word_ribbon_dump.js', text.substring(p, p + 70000));
  console.log('Dumped Word ribbon code to /tmp/word_ribbon_dump.js');
}
