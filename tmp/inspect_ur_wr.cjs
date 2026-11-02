const fs = require('fs');
const text = fs.readFileSync('/tmp/word_complete_source.js', 'utf8');

const pUr = text.indexOf('Ur=');
const pWr = text.indexOf('Wr=');

console.log('Ur at:', pUr);
console.log(text.substring(pUr, pUr + 4000));

console.log('\n================ Wr at:', pWr);
console.log(text.substring(pWr, pWr + 3000));
