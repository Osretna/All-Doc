const fs = require('fs');
const text = fs.readFileSync('/tmp/target_app.js', 'utf8');

// The Excel ribbon starts around 977266. Let's dump from 976000 to 1050000 into a file so we can analyze all buttons and ribbons!
fs.writeFileSync('/tmp/excel_ribbon_section.js', text.substring(976000, 1075000));
console.log('Saved ribbon section: length', 1075000 - 976000);
