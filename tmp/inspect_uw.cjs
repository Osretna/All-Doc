const fs = require('fs');
const text = fs.readFileSync('/tmp/target_app.js', 'utf8');

// Find function Uw or Uw=
let p = text.indexOf('function Uw');
if (p === -1) p = text.indexOf('Uw=');
console.log('Uw location:', p);
if (p !== -1) {
  console.log(text.substring(p, p + 5000));
}
