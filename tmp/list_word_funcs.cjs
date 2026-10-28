const fs = require('fs');
const text = fs.readFileSync('/tmp/word_suite_full.js', 'utf8');

// Find all occurrences of function declarations in the dump
const funcs = [...text.matchAll(/([A-Za-z0-9_]+)=\(\{([^)]*)\}\)=>/g)].map(m => ({ name: m[1], props: m[2].substring(0, 80) }));
console.log('Components in word dump:');
funcs.forEach(f => console.log(f.name, ':', f.props));
