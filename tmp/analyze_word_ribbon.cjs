const fs = require('fs');
const text = fs.readFileSync('/tmp/word_ribbon_dump.js', 'utf8');

// Find all tabs in Word
const p = text.indexOf('Vr=');
console.log('Vr length:', text.length);

// Search for tab definitions
const tabMatches = text.match(/\[\s*\{[^}]*id:\s*["`']\w+["`'][^}]*label:[^}]*\}\s*\]/g);
console.log('Tab matches:', tabMatches);

// Find all tabs where e === 'tab_name'
const tabCases = [...text.matchAll(/e===["`']([a-zA-Z0-9_\-]+)["`']/g)].map(m => m[1]);
console.log('Tab cases in Word ribbon:', [...new Set(tabCases)]);
