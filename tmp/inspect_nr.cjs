const fs = require('fs');
const text = fs.readFileSync('/tmp/word_suite_full.js', 'utf8');

const pNr = text.indexOf('Nr=');
console.log('Nr code snippet:');
console.log(text.substring(pNr, pNr + 8000));
