const fs = require('fs');
const text = fs.readFileSync('/tmp/target_app.js', 'utf8');

// Let's dump 300000 to 395000
fs.writeFileSync('/tmp/word_suite_full.js', text.substring(310000, 395000));
console.log('Saved word suite full dump');
