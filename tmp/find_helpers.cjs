const fs = require('fs');
const text = fs.readFileSync('/tmp/word_suite_full.js', 'utf8');

// Search for kr= and Ar=
console.log('Searching for kr= and Ar=');
let p = text.indexOf('kr=');
if (p !== -1) console.log('kr:', text.substring(p, p + 200));
p = text.indexOf('Ar=');
if (p !== -1) console.log('Ar:', text.substring(p, p + 200));
